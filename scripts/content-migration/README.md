# Content Library v2 migration

This directory contains the data migration for the content-library schema described in `AUDIT.md` §6.

## What is in the content library?

Each record remains a document in the existing JSONB `data` column:

- `custom_classes`
- `custom_subclasses`
- `custom_races`
- `custom_backgrounds`
- `custom_feats`
- `custom_spells`, `custom_equipment`, `custom_beasts`, `custom_familiars` (metadata only)

The migration adds settings inside the document rather than creating one table per nested field. That keeps homebrew imports, Forge edits, versioning, and unknown fields practical.

New document fields include:

- `schema_version`
- `caster` (`full`, `half`, `third`, `pact`, `artificer`, `custom`, `none`)
- `subclass_level`, `subclass_label`
- `resources` (name, level, reset, max descriptor, source)
- `choices` (skills, tools, languages, abilities, ancestry, spells, proficiencies)
- `spell_list`
- `ui` / `companions` / `widgets`
- `rules`
- normalized `effects` on features, traits, backgrounds, feats, and options

## Apply order

1. **Back up the content tables** (the script also does this on every run).
2. **Apply the schema migration** in the Supabase SQL editor:
   `supabase/migrations/20261101160000_content_library_v2.sql`
3. **Apply the generated data migration** in the SQL editor:
   `supabase/migrations/20261101160001_content_library_data.sql`
4. **Run the SQL diagnostics** at the bottom of this file and review duplicate/canonical views.
5. **Only then** update the app code to read the new fields (the content is migrated, but the current engine still has hardcoded branches).

If you need to undo the data migration, run:

`supabase/migrations/20261101160002_content_library_data_rollback.sql`

That restores the exact pre-migration documents captured before Step 3. The schema stays in place; it is additive and does not change app behavior on its own.

### Why the data migration is SQL, not the anon script

The content tables are protected by RLS. With the current anon key an `update` that is filtered out by RLS returns **HTTP 200 with 0 rows and no error** — it looks successful but writes nothing. This is also why the Forge can create duplicate rows: its update path is blocked, then it falls through to an insert.

The reliable application path is the generated SQL file, run in the Supabase SQL editor (service role). If you prefer the TypeScript apply path, set a **service-role** key in the environment; the script now detects 0-row updates and reports them as failures.

To regenerate the SQL after reviewing a new plan:

```bash
npx tsx scripts/content-migration/generate-sql.ts \
  --plan=scripts/content-migration/reports/<timestamp>/plan.json \
  --out=supabase/migrations/20261101160001_content_library_data.sql
```

> The schema migration installs the revision trigger. The data SQL therefore snapshots every old content document into `content_revisions` before writing the enriched one, so the migration itself is recoverable.

## Backups and reports

Every run writes:

- `scripts/content-migration/backups/<timestamp>/<table>.json` — full raw rows
- `scripts/content-migration/backups/<timestamp>/manifest.json`
- `scripts/content-migration/reports/<timestamp>/plan.json` — before/after and validation issues
- `scripts/content-migration/reports/<timestamp>/summary.md`
- `scripts/content-migration/reports/<timestamp>/apply-result.json` when `--apply` is used

These directories are gitignored because they contain user content.

## Restore

To restore a backup:

```bash
npx tsx scripts/content-migration/restore.ts --backup=scripts/content-migration/backups/<timestamp> --apply
```

Dry-run restore (no `--apply`) only prints what would be restored.

## After the SQL migration: diagnostics

```sql
-- duplicate rows by slug
select * from public.content_duplicate_report order by table_name, slug;

-- canonical rows (the row the migration/app should prefer)
select count(*) from public.content_canonical_classes;
select count(*) from public.content_canonical_subclasses;
select count(*) from public.content_canonical_races;
select count(*) from public.content_canonical_backgrounds;
select count(*) from public.content_canonical_feats;

-- migration ledger
select * from public.content_migrations order by applied_at desc;

-- rows that have been migrated by the data script
select 'custom_classes' as table_name, count(*) filter (where migrated_at is not null) as migrated, count(*) as total from public.custom_classes
union all
select 'custom_subclasses', count(*) filter (where migrated_at is not null), count(*) from public.custom_subclasses
union all
select 'custom_races', count(*) filter (where migrated_at is not null), count(*) from public.custom_races
union all
select 'custom_backgrounds', count(*) filter (where migrated_at is not null), count(*) from public.custom_backgrounds
union all
select 'custom_feats', count(*) filter (where migrated_at is not null), count(*) from public.custom_feats;
```

## Notes

- The script is idempotent: rerunning it should not add duplicate fields/effects. It is safe to rerun after interrupted applies.
- Records with validation errors are skipped on `--apply`; errors are reported in `apply-result.json`.
- Existing stripped/duplicate rows are enriched but **not deleted**. Deduplication is a separate reviewed step using `content_duplicate_report` and the canonical views.
- The SQL migration does not add unique constraints because duplicates already exist. Add uniqueness only after cleanup, and decide how public core rows and per-user overrides should coexist.
