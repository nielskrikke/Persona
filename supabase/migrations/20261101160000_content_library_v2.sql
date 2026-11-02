-- ============================================================================
-- Persona — Content Library v2
-- ============================================================================
-- Purpose:
--   * Make the content library the single source of truth for class / race /
--     subclass / feat / background settings.
--   * Add metadata columns (schema version, slug, source, hash, revision).
--   * Add an append-only revision table so Forge edits are recoverable.
--   * Add canonical/duplicate views for migration and cleanup.
--
-- Design note:
--   The actual settings live in the existing `data jsonb` document. We are NOT
--   creating one table per nested setting (resources, choices, effects, ...).
--   A class/subclass is a document with optional fields such as:
--     caster, subclass_level, subclass_label, resources, choices, ui, rules,
--     feature_details[].effects, level_table[].class_specific, ...
--   This keeps homebrew imports/edits/versioning practical. The SQL below adds
--   the metadata and safety rails around those documents.
--
-- Apply with the Supabase SQL editor or a service-role connection. This script
-- is idempotent and safe to re-run.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Metadata columns on every content table
-- ----------------------------------------------------------------------------
do $$
declare
    t text;
begin
    foreach t in array array[
        'custom_classes', 'custom_subclasses', 'custom_races',
        'custom_backgrounds', 'custom_feats', 'custom_spells',
        'custom_equipment', 'custom_beasts', 'custom_familiars'
    ]
    loop
        if to_regclass('public.' || t) is null then
            raise notice 'Skipping missing content table %', t;
            continue;
        end if;

        execute format('alter table public.%I add column if not exists schema_version integer not null default 2', t);
        execute format('alter table public.%I add column if not exists slug text', t);
        execute format('alter table public.%I add column if not exists source text', t);
        execute format('alter table public.%I add column if not exists content_hash text', t);
        execute format('alter table public.%I add column if not exists revision integer not null default 1', t);
        execute format('alter table public.%I add column if not exists updated_at timestamptz not null default now()', t);
        execute format('alter table public.%I add column if not exists migrated_at timestamptz', t);
        execute format('alter table public.%I add column if not exists derived_from uuid', t);
        execute format('alter table public.%I add column if not exists deleted_at timestamptz', t);
    end loop;
end $$;

-- Backfill metadata from the document. Keep this deterministic and idempotent.
do $$
declare
    t text;
begin
    foreach t in array array[
        'custom_classes', 'custom_subclasses', 'custom_races',
        'custom_backgrounds', 'custom_feats', 'custom_spells',
        'custom_equipment', 'custom_beasts', 'custom_familiars'
    ]
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        execute format($f$
            update public.%I
               set slug = coalesce(
                       nullif(lower(data->>'index'), ''),
                       trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
                   ),
                   source = coalesce(nullif(data->>'source', ''), source),
                   content_hash = md5(data::text),
                   updated_at = coalesce(updated_at, created_at, now())
             where slug is null
                or source is null
                or content_hash is null
                or updated_at is null
        $f$, t);
    end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 2. Append-only revision history
-- ----------------------------------------------------------------------------
create table if not exists public.content_revisions (
    id           bigint generated always as identity primary key,
    table_name   text not null,
    record_id    uuid not null,
    revision     integer not null,
    operation    text not null default 'update' check (operation in ('update', 'delete')),
    name         text,
    data         jsonb not null,
    is_public    boolean,
    user_id      uuid,
    homebrew     boolean,
    created_at   timestamptz,
    archived_at  timestamptz not null default now(),
    archived_by  text,
    unique (table_name, record_id, revision)
);

create index if not exists idx_content_revisions_record
    on public.content_revisions (table_name, record_id, revision desc);

create index if not exists idx_content_revisions_archived
    on public.content_revisions (archived_at desc);

-- Migration ledger
create table if not exists public.content_migrations (
    id          text primary key,
    applied_at  timestamptz not null default now(),
    notes       text,
    stats       jsonb not null default '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 3. Trigger helpers
-- ----------------------------------------------------------------------------
-- Prepare metadata on insert/update. On update:
--   * revision increments
--   * content_hash/updated_at refresh
--   * slug is immutable (rename must not silently change identity)
create or replace function public.persona_content_prepare()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    computed_slug text;
begin
    computed_slug := coalesce(
        nullif(lower(NEW.data->>'index'), ''),
        nullif(lower(NEW.data->>'slug'), ''),
        trim(both '-' from lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g')))
    );

    if tg_op = 'INSERT' then
        NEW.schema_version := coalesce(NEW.schema_version, 2);
        NEW.revision := coalesce(NEW.revision, 1);
        NEW.slug := coalesce(NEW.slug, computed_slug);
        NEW.source := coalesce(NEW.source, nullif(NEW.data->>'source', ''));
        NEW.content_hash := md5(NEW.data::text);
        NEW.updated_at := coalesce(NEW.updated_at, now());
    elsif tg_op = 'UPDATE' then
        NEW.revision := coalesce(OLD.revision, 0) + 1;
        NEW.slug := coalesce(OLD.slug, NEW.slug, computed_slug);
        NEW.source := coalesce(NEW.source, nullif(NEW.data->>'source', ''));
        NEW.content_hash := md5(NEW.data::text);
        NEW.updated_at := now();
    end if;

    return NEW;
end;
$$;

-- Snapshot the old document before update/delete.
create or replace function public.persona_content_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.content_revisions (
        table_name, record_id, revision, operation, name, data,
        is_public, user_id, homebrew, created_at, archived_by
    ) values (
        tg_table_name,
        old.id,
        coalesce(old.revision, 1),
        case when tg_op = 'DELETE' then 'delete' else 'update' end,
        old.name,
        coalesce(old.data, '{}'::jsonb),
        (to_jsonb(old)->>'is_public')::boolean,
        (to_jsonb(old)->>'user_id')::uuid,
        (to_jsonb(old)->>'homebrew')::boolean,
        old.created_at,
        current_user
    )
    on conflict (table_name, record_id, revision) do nothing;

    if tg_op = 'DELETE' then
        return old;
    end if;
    return new;
end;
$$;

do $$
declare
    t text;
begin
    foreach t in array array[
        'custom_classes', 'custom_subclasses', 'custom_races',
        'custom_backgrounds', 'custom_feats', 'custom_spells',
        'custom_equipment', 'custom_beasts', 'custom_familiars'
    ]
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        execute format('drop trigger if exists persona_content_prepare on public.%I', t);
        execute format(
            'create trigger persona_content_prepare
             before insert or update on public.%I
             for each row execute function public.persona_content_prepare()', t
        );

        execute format('drop trigger if exists persona_content_snapshot on public.%I', t);
        execute format(
            'create trigger persona_content_snapshot
             before update or delete on public.%I
             for each row execute function public.persona_content_snapshot()', t
        );
    end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 4. Indexes
-- ----------------------------------------------------------------------------
do $$
declare
    t text;
    short text;
begin
    foreach t in array array[
        'custom_classes', 'custom_subclasses', 'custom_races',
        'custom_backgrounds', 'custom_feats', 'custom_spells',
        'custom_equipment', 'custom_beasts', 'custom_familiars'
    ]
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        short := replace(t, 'custom_', '');
        execute format('create index if not exists %I on public.%I (slug)', 'idx_content_' || short || '_slug', t);
        execute format('create index if not exists %I on public.%I ((data->>''index''))', 'idx_content_' || short || '_data_index', t);
        execute format('create index if not exists %I on public.%I (is_public)', 'idx_content_' || short || '_public', t);
        execute format('create index if not exists %I on public.%I (user_id)', 'idx_content_' || short || '_user', t);
    end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 5. Diagnostics: duplicates and canonical rows
-- ----------------------------------------------------------------------------
-- Do not delete automatically. Run this view after the migration and review.
create or replace view public.content_duplicate_report as
select 'custom_classes'::text as table_name,
       coalesce(data->>'index', slug) as slug,
       count(*) as row_count,
       array_agg(id order by created_at) as ids
  from public.custom_classes
 where deleted_at is null
 group by 1, 2 having count(*) > 1
union all
select 'custom_subclasses', coalesce(data->>'index', slug), count(*),
       array_agg(id order by created_at)
  from public.custom_subclasses
 where deleted_at is null
 group by 1, 2 having count(*) > 1
union all
select 'custom_races', coalesce(data->>'index', slug), count(*),
       array_agg(id order by created_at)
  from public.custom_races
 where deleted_at is null
 group by 1, 2 having count(*) > 1
union all
select 'custom_backgrounds', coalesce(data->>'index', slug), count(*),
       array_agg(id order by created_at)
  from public.custom_backgrounds
 where deleted_at is null
 group by 1, 2 having count(*) > 1
union all
select 'custom_feats', coalesce(data->>'index', slug), count(*),
       array_agg(id order by created_at)
  from public.custom_feats
 where deleted_at is null
 group by 1, 2 having count(*) > 1;

-- Canonical class rows: prefer source, real proficiency choices, and
-- level_table.class_specific. This is a read-only diagnostic view; the app can
-- adopt it once duplicate cleanup has been verified.
create or replace view public.content_canonical_classes as
select distinct on (coalesce(data->>'index', slug)) *
  from public.custom_classes
 where deleted_at is null
 order by coalesce(data->>'index', slug),
          (case when data ? 'source' then 0 else 1 end),
          (case when (case when jsonb_typeof(data->'proficiency_choices') = 'array' then jsonb_array_length(data->'proficiency_choices') else 0 end) > 0 then 0 else 1 end),
          (case when jsonb_path_exists(data, '$.level_table[*].class_specific') then 0 else 1 end),
          created_at asc;

create or replace view public.content_canonical_subclasses as
select distinct on (coalesce(data->>'index', slug)) *
  from public.custom_subclasses
 where deleted_at is null
 order by coalesce(data->>'index', slug),
          (case when jsonb_typeof(data->'feature_details') = 'array' then jsonb_array_length(data->'feature_details') else 0 end) desc,
          (case when data ? 'source' then 0 else 1 end),
          created_at asc;

create or replace view public.content_canonical_races as
select distinct on (coalesce(data->>'index', slug)) *
  from public.custom_races
 where deleted_at is null
 order by coalesce(data->>'index', slug),
          (case when jsonb_typeof(data->'subraces_details') = 'array' then jsonb_array_length(data->'subraces_details') else 0 end) desc,
          (case when data ? 'language_options' then 0 else 1 end),
          (case when jsonb_typeof(data->'traits') = 'array' then jsonb_array_length(data->'traits') else 0 end) desc,
          created_at asc;

create or replace view public.content_canonical_backgrounds as
select distinct on (coalesce(data->>'index', slug)) *
  from public.custom_backgrounds
 where deleted_at is null
 order by coalesce(data->>'index', slug),
          (case when jsonb_typeof(data->'proficiency_choices') = 'array' then jsonb_array_length(data->'proficiency_choices') else 0 end) desc,
          (case when data ? 'languages' then 0 else 1 end),
          created_at asc;

create or replace view public.content_canonical_feats as
select distinct on (coalesce(data->>'index', slug)) *
  from public.custom_feats
 where deleted_at is null
 order by coalesce(data->>'index', slug),
          (case when jsonb_typeof(data->'effects') = 'array' then jsonb_array_length(data->'effects') else 0 end) desc,
          (case when data ? 'source' then 0 else 1 end),
          created_at asc;

-- ----------------------------------------------------------------------------
-- 6. RLS for the new tables
-- ----------------------------------------------------------------------------
alter table public.content_revisions enable row level security;
alter table public.content_migrations enable row level security;

drop policy if exists persona_content_revisions_select on public.content_revisions;
create policy persona_content_revisions_select on public.content_revisions
    for select to anon, authenticated using (true);

drop policy if exists persona_content_migrations_select on public.content_migrations;
create policy persona_content_migrations_select on public.content_migrations
    for select to anon, authenticated using (true);

-- No anon insert/update/delete policies on either table. Writes to
-- content_revisions happen through the SECURITY DEFINER trigger; the migration
-- ledger is written by the migration runner.

-- ----------------------------------------------------------------------------
-- 7. App access policies for content edits
-- ----------------------------------------------------------------------------
-- The app uses the public anon key and username-only login; there is no
-- Supabase Auth session to carry per-user identity. These policies mirror the
-- app's existing content-library model so the Forge can actually update rows.
-- They are permissive by design and should be replaced by the authenticated
-- ownership policies when the app moves to Supabase Auth.
do $$
declare
    t text;
    short text;
    pol text;
begin
    foreach t in array array[
        'custom_classes', 'custom_subclasses', 'custom_races',
        'custom_backgrounds', 'custom_feats', 'custom_spells',
        'custom_equipment', 'custom_beasts', 'custom_familiars'
    ]
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        short := replace(t, 'custom_', '');

        execute format('grant select, insert, update, delete on public.%I to anon', t);

        pol := 'persona_content_' || short || '_select';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for select to anon using (true)', pol, t);

        pol := 'persona_content_' || short || '_insert';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for insert to anon with check (true)', pol, t);

        pol := 'persona_content_' || short || '_update';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for update to anon using (true) with check (true)', pol, t);

        pol := 'persona_content_' || short || '_delete';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for delete to anon using (true)', pol, t);
    end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 8. Ledger
-- ----------------------------------------------------------------------------
insert into public.content_migrations (id, notes, stats)
values (
    '20261101160000_content_library_v2',
    'Content Library v2 metadata, revision history, indexes, canonical views.',
    jsonb_build_object('tables', 9)
)
on conflict (id) do update
set notes = excluded.notes,
    stats = excluded.stats;

commit;
