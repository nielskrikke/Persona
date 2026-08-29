-- ============================================================================
-- Persona — Row Level Security (RLS) policies
-- ============================================================================
-- Project : Persona (D&D 5e character builder) — Supabase
-- Applied : Supabase Dashboard -> SQL Editor, psql, or `supabase db push`
-- Re-run  : SAFE. Every statement is idempotent (DROP POLICY IF EXISTS /
--           guarded DO blocks). Existing policies that are NOT named
--           `persona_*` are left untouched.
--
-- ----------------------------------------------------------------------------
-- WHAT THIS SCRIPT DOES
-- ----------------------------------------------------------------------------
-- 1. Enables RLS on all 15 Persona tables (they were mostly unprotected).
-- 2. Adds `anon` policies that mirror exactly what the app does today with the
--    anon key (username login, no Supabase Auth sessions), so the app keeps
--    working unchanged.
-- 3. Hardens what CAN be hardened without real authentication:
--      * app_users can no longer be written to by the API (insert/update/delete
--        revoked + no RLS policies) — users can only be added/removed by the DM
--        via the dashboard / service role.
--      * user_id becomes immutable on characters + homebrew tables (trigger),
--        so an API client can no longer reassign a row to another owner.
--      * referential-integrity FKs are added (character_shares, campaign
--        inventory/rolls) so orphaned rows cannot be created.
-- 4. Adds dormant `authenticated`-role policies (`persona_*_own`) that enforce
--    true per-user ownership via auth.uid() the day the app switches to
--    Supabase Auth. They are inactive today (anon-key requests carry role
--    `anon`, never `authenticated`).
--
-- ----------------------------------------------------------------------------
-- HONEST LIMITATION (read before applying)
-- ----------------------------------------------------------------------------
-- The app currently logs users in by USERNAME ONLY (no password) against the
-- `app_users` table, and every request goes out with the anon key, passing the
-- user's UUID as a client-controlled query parameter. RLS cannot tell which
-- human is making a request, so per-user ownership CANNOT be enforced yet:
-- anyone with the anon key can still read any row and write with any user_id.
-- This script secures the edges that do not depend on identity and lays the
-- policy groundwork; closing the per-user gap requires Supabase Auth (see the
-- "Upgrade path" note at the bottom of this file).
-- ============================================================================

begin;

-- ============================================================================
-- 1. Helper: current user id
-- ----------------------------------------------------------------------------
-- Single place to read the authenticated user id. Today it always returns NULL
-- (anon requests have no session); when the app moves to Supabase Auth it will
-- start returning the real id and the `persona_*_own` policies activate.
-- ============================================================================

create or replace function public.persona_current_user_id()
returns uuid
language sql
stable
set search_path = public
as $$
    select auth.uid();
$$;

-- ============================================================================
-- 2. Enable RLS on every Persona table (idempotent)
-- ============================================================================

alter table public.app_users             enable row level security;
alter table public.characters            enable row level security;
alter table public.character_shares      enable row level security;
alter table public.campaigns             enable row level security;
alter table public.campaign_inventory    enable row level security;
alter table public.campaign_rolls        enable row level security;
alter table public.custom_races          enable row level security;
alter table public.custom_classes        enable row level security;
alter table public.custom_subclasses     enable row level security;
alter table public.custom_backgrounds    enable row level security;
alter table public.custom_spells         enable row level security;
alter table public.custom_equipment      enable row level security;
alter table public.custom_beasts         enable row level security;
alter table public.custom_familiars      enable row level security;
alter table public.custom_feats          enable row level security;

-- ============================================================================
-- 3. anon policies — keep the current app working (role `anon`)
-- ----------------------------------------------------------------------------
-- Each policy mirrors a query the client actually performs. Where the app's
-- model cannot express ownership (no trusted identity), the policy is
-- permissive and the limitation is called out in a comment.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 app_users
-- ----------------------------------------------------------------------------
-- Reads stay open (login by username + the "who to share with" picker need the
-- full list). Writes are fully blocked below in section 4.1 — the app never
-- writes here, so this is a genuine lockdown, not a no-op.
drop policy if exists persona_app_users_select on public.app_users;
create policy persona_app_users_select on public.app_users
    for select to anon
    using (true);

-- ----------------------------------------------------------------------------
-- 3.2 characters
-- ----------------------------------------------------------------------------
-- NOTE: SELECT is fully open because the client fetches "owned" and "shared"
-- rows by a client-supplied user_id — RLS cannot verify that id without auth.
-- Same for UPDATE/DELETE (the app updates/deletes by id without an ownership
-- check). This matches today's behavior; tightening requires Supabase Auth
-- (the `persona_characters_*_own` policies in section 5 take over then).
drop policy if exists persona_characters_select on public.characters;
create policy persona_characters_select on public.characters
    for select to anon
    using (true);

drop policy if exists persona_characters_insert on public.characters;
create policy persona_characters_insert on public.characters
    for insert to anon
    with check (true);

drop policy if exists persona_characters_update on public.characters;
create policy persona_characters_update on public.characters
    for update to anon
    using (true)
    with check (true);

drop policy if exists persona_characters_delete on public.characters;
create policy persona_characters_delete on public.characters
    for delete to anon
    using (true);

-- ----------------------------------------------------------------------------
-- 3.3 character_shares
-- ----------------------------------------------------------------------------
-- Same caveat as characters: share grants are created/deleted with
-- client-supplied ids. FKs added in section 4.3 keep the rows sane.
drop policy if exists persona_character_shares_select on public.character_shares;
create policy persona_character_shares_select on public.character_shares
    for select to anon
    using (true);

drop policy if exists persona_character_shares_insert on public.character_shares;
create policy persona_character_shares_insert on public.character_shares
    for insert to anon
    with check (true);

drop policy if exists persona_character_shares_delete on public.character_shares;
create policy persona_character_shares_delete on public.character_shares
    for delete to anon
    using (true);

-- ----------------------------------------------------------------------------
-- 3.4 campaigns
-- ----------------------------------------------------------------------------
-- Campaigns are joined by join code; the app lists all campaigns and updates
-- the characters roster of any campaign (join/leave). A real membership model
-- (campaign_members table + ownership checks) is the future tightening step.
drop policy if exists persona_campaigns_select on public.campaigns;
create policy persona_campaigns_select on public.campaigns
    for select to anon
    using (true);

drop policy if exists persona_campaigns_insert on public.campaigns;
create policy persona_campaigns_insert on public.campaigns
    for insert to anon
    with check (true);

drop policy if exists persona_campaigns_update on public.campaigns;
create policy persona_campaigns_update on public.campaigns
    for update to anon
    using (true)
    with check (true);

drop policy if exists persona_campaigns_delete on public.campaigns;
create policy persona_campaigns_delete on public.campaigns
    for delete to anon
    using (true);

-- ----------------------------------------------------------------------------
-- 3.5 campaign_inventory
-- ----------------------------------------------------------------------------
-- Read/insert/update only (that is all the app does). No anon delete policy:
-- client deletes are denied by RLS.
drop policy if exists persona_campaign_inventory_select on public.campaign_inventory;
create policy persona_campaign_inventory_select on public.campaign_inventory
    for select to anon
    using (true);

drop policy if exists persona_campaign_inventory_insert on public.campaign_inventory;
create policy persona_campaign_inventory_insert on public.campaign_inventory
    for insert to anon
    with check (true);

drop policy if exists persona_campaign_inventory_update on public.campaign_inventory;
create policy persona_campaign_inventory_update on public.campaign_inventory
    for update to anon
    using (true)
    with check (true);

-- ----------------------------------------------------------------------------
-- 3.6 campaign_rolls
-- ----------------------------------------------------------------------------
-- Read + insert only (that is all the app does). No anon update/delete
-- policies: those operations are denied by RLS.
drop policy if exists persona_campaign_rolls_select on public.campaign_rolls;
create policy persona_campaign_rolls_select on public.campaign_rolls
    for select to anon
    using (true);

drop policy if exists persona_campaign_rolls_insert on public.campaign_rolls;
create policy persona_campaign_rolls_insert on public.campaign_rolls
    for insert to anon
    with check (true);

-- ----------------------------------------------------------------------------
-- 3.7-3.15 the nine homebrew tables
-- ----------------------------------------------------------------------------
-- Identical shape: id, user_id, name, data, is_public, created_at.
-- Reads stay open because the client mixes public rows with its own rows in a
-- single query (`.or(is_public.eq.true, user_id.eq.<client id>)`) and RLS
-- cannot validate the client-supplied id. Writes mirror the app's upsert /
-- delete flows. The `persona_custom_*_own` policies in section 5 are the
-- ownership-based replacements for when auth lands.
do $$
declare
    t text;
    pol text;
begin
    foreach t in array array[
        'custom_races', 'custom_classes', 'custom_subclasses', 'custom_backgrounds',
        'custom_spells', 'custom_equipment', 'custom_beasts', 'custom_familiars',
        'custom_feats'
    ]
    loop
        if to_regclass('public.' || t) is null then
            raise notice 'Skipping policies: table % does not exist', t;
            continue;
        end if;

        pol := 'persona_' || t || '_select';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for select to anon using (true)', pol, t);

        pol := 'persona_' || t || '_insert';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for insert to anon with check (true)', pol, t);

        pol := 'persona_' || t || '_update';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for update to anon using (true) with check (true)', pol, t);

        pol := 'persona_' || t || '_delete';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format('create policy %I on public.%I for delete to anon using (true)', pol, t);
    end loop;
end $$;

-- ============================================================================
-- 4. Hardening that does NOT require authentication
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 Lock down app_users writes
-- ----------------------------------------------------------------------------
-- The app never inserts/updates/deletes app_users (the DM adds players via the
-- dashboard or SQL). Revoke the raw grants AND leave no RLS policies, so the
-- API cannot create users, rename users, or delete accounts.
revoke insert, update, delete on public.app_users from anon;
grant select on public.app_users to anon;

-- ----------------------------------------------------------------------------
-- 4.2 user_id is immutable once a row exists
-- ----------------------------------------------------------------------------
-- Prevents an API client from "stealing" a row by updating its user_id (the
-- app never changes user_id on update — verified in services/supabase.ts and
-- server.ts). Applies to characters + all nine homebrew tables.
create or replace function public.persona_prevent_user_id_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    if new.user_id is distinct from old.user_id then
        raise exception 'user_id is immutable and cannot be changed via the API';
    end if;
    return new;
end;
$$;

do $$
declare
    t text;
begin
    foreach t in array array[
        'characters',
        'custom_races', 'custom_classes', 'custom_subclasses', 'custom_backgrounds',
        'custom_spells', 'custom_equipment', 'custom_beasts', 'custom_familiars',
        'custom_feats'
    ]
    loop
        if to_regclass('public.' || t) is null then
            raise notice 'Skipping trigger: table % does not exist', t;
            continue;
        end if;
        if not exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = t and column_name = 'user_id'
        ) then
            raise notice 'Skipping trigger: table % has no user_id column', t;
            continue;
        end if;

        execute format('drop trigger if exists persona_freeze_user_id on public.%I', t);
        execute format(
            'create trigger persona_freeze_user_id before update on public.%I
             for each row execute function public.persona_prevent_user_id_change()',
            t
        );
    end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 4.3 Referential integrity FKs (guarded)
-- ----------------------------------------------------------------------------
-- Stops orphan rows (shares pointing at deleted characters/users, inventory or
-- rolls pointing at deleted campaigns). Each FK is skipped with a NOTICE if the
-- table/column is missing, the constraint already exists, orphan rows exist
-- (fix those first), or the column types do not match.
do $$
declare
    r record;
    has_orphans boolean;
    fk_name text;
begin
    for r in select * from (values
        ('character_shares'::text,   'character_id'::text,        'characters'::text, 'id'::text),
        ('character_shares'::text,   'shared_with_user_id'::text, 'app_users'::text,  'id'::text),
        ('campaign_inventory'::text, 'campaign_id'::text,         'campaigns'::text,  'id'::text),
        ('campaign_rolls'::text,     'campaign_id'::text,         'campaigns'::text,  'id'::text)
    ) as t(tbl, col, ref_tbl, ref_col)
    loop
        fk_name := 'persona_fk_' || r.tbl || '_' || r.col;

        if to_regclass('public.' || r.tbl) is null
           or to_regclass('public.' || r.ref_tbl) is null
           or exists (
               select 1
               from pg_constraint c
               join pg_class ct   on ct.oid = c.conrelid
               join pg_namespace n on n.oid = ct.relnamespace
               where n.nspname = 'public'
                 and ct.relname = r.tbl
                 and c.conname = fk_name
           ) then
            continue;
        end if;

        execute format(
            'select exists (
                select 1 from public.%I
                where %I is not null
                  and %I not in (select %I from public.%I)
             )',
            r.tbl, r.col, r.col, r.ref_col, r.ref_tbl
        ) into has_orphans;

        if has_orphans then
            raise notice 'Skipping FK %( %) -> %( %): orphan rows exist — clean them up first',
                r.tbl, r.col, r.ref_tbl, r.ref_col;
            continue;
        end if;

        begin
            execute format(
                'alter table public.%I add constraint %I
                 foreign key (%I) references public.%I(%I) on delete cascade',
                r.tbl, fk_name, r.col, r.ref_tbl, r.ref_col
            );
            raise notice 'Added FK %( %) -> %( %)', r.tbl, r.col, r.ref_tbl, r.ref_col;
        exception when others then
            raise notice 'Could not add FK %( %) -> %( %): %', r.tbl, r.col, r.ref_tbl, r.ref_col, sqlerrm;
        end;
    end loop;
end $$;

-- ============================================================================
-- 5. Dormant `authenticated` policies (future Supabase Auth)
-- ----------------------------------------------------------------------------
-- These enforce real per-user ownership the moment requests carry a real
-- Supabase Auth session (role `authenticated`). They are inert today because
-- the app sends the anon key. They will NOT protect anything until the app
-- switches to Supabase Auth AND ownership ids are aligned (see upgrade note).
-- ============================================================================

-- 5.1 app_users — users may only read their own profile row
drop policy if exists persona_app_users_select_own on public.app_users;
create policy persona_app_users_select_own on public.app_users
    for select to authenticated
    using (id = public.persona_current_user_id());

-- 5.2 characters — owners full access; share recipients can read
drop policy if exists persona_characters_select_own on public.characters;
create policy persona_characters_select_own on public.characters
    for select to authenticated
    using (
        user_id = public.persona_current_user_id()
        or exists (
            select 1 from public.character_shares cs
            where cs.character_id = characters.id
              and cs.shared_with_user_id = public.persona_current_user_id()
        )
    );

drop policy if exists persona_characters_insert_own on public.characters;
create policy persona_characters_insert_own on public.characters
    for insert to authenticated
    with check (user_id = public.persona_current_user_id());

drop policy if exists persona_characters_update_own on public.characters;
create policy persona_characters_update_own on public.characters
    for update to authenticated
    using (user_id = public.persona_current_user_id())
    with check (user_id = public.persona_current_user_id());

drop policy if exists persona_characters_delete_own on public.characters;
create policy persona_characters_delete_own on public.characters
    for delete to authenticated
    using (user_id = public.persona_current_user_id());

-- 5.3 character_shares — owners manage shares; recipients see their own
drop policy if exists persona_character_shares_select_own on public.character_shares;
create policy persona_character_shares_select_own on public.character_shares
    for select to authenticated
    using (
        shared_with_user_id = public.persona_current_user_id()
        or exists (
            select 1 from public.characters c
            where c.id = character_shares.character_id
              and c.user_id = public.persona_current_user_id()
        )
    );

drop policy if exists persona_character_shares_insert_own on public.character_shares;
create policy persona_character_shares_insert_own on public.character_shares
    for insert to authenticated
    with check (
        exists (
            select 1 from public.characters c
            where c.id = character_shares.character_id
              and c.user_id = public.persona_current_user_id()
        )
    );

drop policy if exists persona_character_shares_delete_own on public.character_shares;
create policy persona_character_shares_delete_own on public.character_shares
    for delete to authenticated
    using (
        exists (
            select 1 from public.characters c
            where c.id = character_shares.character_id
              and c.user_id = public.persona_current_user_id()
        )
    );

-- 5.4 the nine homebrew tables — public rows readable by everyone,
--     private rows only by their owner; only owners can write their rows.
do $$
declare
    t text;
    pol text;
begin
    foreach t in array array[
        'custom_races', 'custom_classes', 'custom_subclasses', 'custom_backgrounds',
        'custom_spells', 'custom_equipment', 'custom_beasts', 'custom_familiars',
        'custom_feats'
    ]
    loop
        if to_regclass('public.' || t) is null then
            continue;
        end if;

        pol := 'persona_' || t || '_select_own';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format(
            'create policy %I on public.%I
             for select to authenticated
             using (is_public or user_id = public.persona_current_user_id())', pol, t);

        pol := 'persona_' || t || '_insert_own';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format(
            'create policy %I on public.%I
             for insert to authenticated
             with check (user_id = public.persona_current_user_id())', pol, t);

        pol := 'persona_' || t || '_update_own';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format(
            'create policy %I on public.%I
             for update to authenticated
             using (user_id = public.persona_current_user_id())
             with check (user_id = public.persona_current_user_id())', pol, t);

        pol := 'persona_' || t || '_delete_own';
        execute format('drop policy if exists %I on public.%I', pol, t);
        execute format(
            'create policy %I on public.%I
             for delete to authenticated
             using (user_id = public.persona_current_user_id())', pol, t);
    end loop;
end $$;

commit;

-- ============================================================================
-- 6. Verification (run after the transaction)
-- ============================================================================

-- RLS status per table (relrowsecurity = t means RLS is on):
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in (
      'app_users','characters','character_shares','campaigns',
      'campaign_inventory','campaign_rolls',
      'custom_races','custom_classes','custom_subclasses','custom_backgrounds',
      'custom_spells','custom_equipment','custom_beasts','custom_familiars',
      'custom_feats'
  )
order by relname;

-- All persona policies now in effect:
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and policyname like 'persona\_%'
order by tablename, cmd;

-- ============================================================================
-- UPGRADE PATH (when you are ready for real per-user security)
-- ============================================================================
-- 1. Switch login to Supabase Auth (email/password or magic link). The client
--    must send the session JWT instead of the anon key (supabase.auth.getSession
--    + the auth client's default headers do this automatically).
-- 2. Align ownership ids: add `app_users.auth_id uuid unique references
--    auth.users(id)` (or make app_users.id equal auth.users.id) and backfill
--    characters.user_id / custom_*.user_id from that mapping, then have the app
--    store auth.uid() as user_id for new rows.
-- 3. The dormant `persona_*_own` policies in section 5 take effect immediately
--    for authenticated sessions; per-user ownership is then enforced at the
--    database level.
-- ============================================================================
