# Persona content migration — exact steps

> **Status: applied on 2026-11-01.** The live project has 239 revision snapshots and two migration ledger rows. Keep this file for re-running or rollback.

You need to run **two** files, in this order, in Supabase. A third file is the rollback.

## Before you start

- Log in to Supabase.
- Open this project: <https://supabase.com/dashboard/project/pducitlqzhcjjeqthkof>
- Click **SQL Editor** in the left sidebar, then **+ New query**.
- If a step shows a red error, **stop**. Copy the red error text and send it to me. Do not run the next file.

## Step 1 — Create the new columns/tables

1. Open this file in your editor:
   `Persona/supabase/migrations/20261101160000_content_library_v2.sql`
2. Select **all** of it and copy.
3. Paste it into the Supabase SQL editor.
4. Click **Run** (or press Cmd/Ctrl + Enter).
5. Wait for **Success**. This only adds columns/tables/triggers/views; it does not change your content.

## Step 2 — Migrate the content

1. In Supabase, click **+ New query** again.
2. Open:
   `Persona/supabase/migrations/20261101160001_content_library_data.sql`
3. Select all, copy, paste, click **Run**.
4. Wait for **Success**.
5. This updates 239 content records and saves the old version of every record into `content_revisions`.

## Step 3 — Quick check

Run this in a new query:

```sql
select 'classes' as table_name, count(*) as rows from public.custom_classes
union all
select 'subclasses', count(*) from public.custom_subclasses
union all
select 'races', count(*) from public.custom_races
union all
select 'backgrounds', count(*) from public.custom_backgrounds
union all
select 'feats', count(*) from public.custom_feats;
```

Expected row counts: 24, 117, 45, 22, 31.

Then run:

```sql
select count(*) as revisions from public.content_revisions;
```

If the data migration ran, this should be at least 239.

## If something goes wrong — rollback

1. In Supabase, click **+ New query**.
2. Open:
   `Persona/supabase/migrations/20261101160002_content_library_data_rollback.sql`
3. Select all, copy, paste, click **Run**.
4. This restores all 239 content records to their pre-migration documents.
5. The new columns/tables stay in place. That is safe; they do not change how the app behaves yet.

**Important:** the rollback restores the content from **before Step 2**. Any content edits you make after Step 2 will be lost if you roll back. Use rollback only if the migration itself caused a problem. You can run Step 2 again later to re-apply the migration.

## If Supabase says the file is too large

Tell me. The data file is about 555 KB. I can split it into five smaller files (classes, subclasses, races, backgrounds, feats) and give you a shorter run order.

## What this does and does not do

- **Does:** puts `caster`, `subclass_level`, `resources`, `choices`, `spell_list`, `ui`, `rules`, and normalized effects into the content library; adds revision history; makes Forge saves non-destructive.
- **Code now reads:** caster progression, spell slots/counts, resources/trackers, HP, subclass levels, and class skill choices from the content data.
- **Does not yet:** expose every new field in the Forge UI, or show all migrated race/subclass mechanics. Remaining work is listed in `AUDIT.md` §8.

## Extra safety already in the repo

- Full pre-migration JSON backups: `Persona/scripts/content-migration/backups/<timestamp>/`
- Migration reports: `Persona/scripts/content-migration/reports/<timestamp>/`
- Restore script: `npx tsx scripts/content-migration/restore.ts --backup=<backup-dir> --apply`

You do not need these if the rollback SQL above works.
