import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const planArg = args.find(arg => arg.startsWith('--plan='))?.slice('--plan='.length);
const outArg = args.find(arg => arg.startsWith('--out='))?.slice('--out='.length);
const mode = (args.find(arg => arg.startsWith('--mode='))?.slice('--mode='.length) || 'apply') as 'apply' | 'rollback';

if (!planArg || !outArg) {
    console.error('Usage: npx tsx scripts/content-migration/generate-sql.ts --plan=<plan.json> --out=<file.sql>');
    process.exit(1);
}

const planPath = resolve(process.cwd(), planArg);
const outPath = resolve(process.cwd(), outArg);
if (!existsSync(planPath)) {
    console.error(`Plan not found: ${planPath}`);
    process.exit(1);
}

const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const records = (plan.records || []).filter((record: any) => !record.issues?.some((issue: any) => issue.severity === 'error'));
const dataKey = mode === 'rollback' ? 'before' : 'after';

const tableByLabel: Record<string, string> = {
    Classes: 'custom_classes',
    Subclasses: 'custom_subclasses',
    Races: 'custom_races',
    Backgrounds: 'custom_backgrounds',
    Feats: 'custom_feats',
};

// Pick a dollar-quote tag that does not occur in the payload. This avoids
// escaping every JSON string and keeps the generated SQL readable.
let tag = 'persona_content_migration';
const allJson = records.map((record: any) => JSON.stringify(record[dataKey])).join('\n');
while (allJson.includes(`$${tag}$`)) tag = `${tag}_x`;

const q = (value: any) => `'${String(value).replace(/'/g, "''")}'`;

const lines: string[] = [];
lines.push('-- ============================================================================');
lines.push(mode === 'rollback' ? '-- Persona — Content Library v2 data ROLLBACK' : '-- Persona — Content Library v2 data migration');
lines.push('-- ============================================================================');
lines.push('-- GENERATED FILE. Do not edit by hand. Regenerate with:');
lines.push('--   npx tsx scripts/content-migration/generate-sql.ts --plan=<plan.json> --out=<file.sql>');
lines.push('--');
lines.push(mode === 'rollback' ? '-- Restores the exact pre-migration documents captured in the plan.' : '-- Run this AFTER 20261101160000_content_library_v2.sql.');
lines.push(mode === 'rollback' ? '-- Run this in the Supabase SQL editor. The schema stays in place; it is additive.' : '-- It sets the enriched JSON documents and the metadata columns. The schema');
lines.push('-- trigger snapshots the current document into content_revisions before each update.');
lines.push('-- ============================================================================');
lines.push('');
lines.push('begin;');
lines.push('');
lines.push('-- Make sure the revision trigger is present before writing.');
lines.push("do $$");
lines.push("begin");
lines.push("    if to_regclass('public.content_revisions') is null then");
lines.push("        raise exception 'Run 20261101160000_content_library_v2.sql first (content_revisions is missing)';");
lines.push("    end if;");
lines.push("end $$;");
lines.push('');

let currentTable = '';
for (const record of records) {
    const table = tableByLabel[record.tableLabel] || record.table;
    if (!table) {
        console.warn(`Skipping record with unknown table: ${record.tableLabel}`);
        continue;
    }
    if (table !== currentTable) {
        currentTable = table;
        lines.push('');
        lines.push(`-- ----------------------------------------------------------------------------`);
        lines.push(`-- ${record.tableLabel}`);
        lines.push(`-- ----------------------------------------------------------------------------`);
        lines.push('');
    }
    const json = JSON.stringify(record[dataKey]);
    lines.push(`-- ${record.name} (${record.slug || record.id})`);
    lines.push(`update public.${table}`);
    const dollar = `$${tag}$`;
    lines.push(`   set data = ${dollar}${json}${dollar}::jsonb,`);
    lines.push(mode === 'rollback' ? `       schema_version = 1,` : `       schema_version = 2,`);
    lines.push(`       slug = coalesce(slug, ${q(record[dataKey]?.index || record.slug || record.id)}),`);
    lines.push(`       source = ${record[dataKey]?.source ? q(record[dataKey].source) : 'source'},`);
    lines.push(mode === 'rollback' ? `       migrated_at = null` : `       migrated_at = now()`);
    lines.push(` where id = ${q(record.id)};`);
    lines.push('');
}

lines.push(mode === 'rollback' ? '-- Record the rollback.' : '-- Record the data migration.');
if (mode === 'rollback') {
    lines.push("delete from public.content_migrations where id = '20261101160001_content_library_data';");
}
lines.push('insert into public.content_migrations (id, notes, stats)');
lines.push('values (');
lines.push(mode === 'rollback' ? "    '20261101160002_content_library_data_rollback'," : "    '20261101160001_content_library_data',");
lines.push(mode === 'rollback' ? "    'Restored the pre-migration documents captured before the content library v2 data migration.'," : "    'Generated data migration for the content library v2 schema.',");
lines.push(`    ${q(JSON.stringify({
    generatedAt: new Date().toISOString(),
    records: records.length,
    byTable: plan.tables,
}))}::jsonb`);
lines.push(')');
lines.push('on conflict (id) do update set notes = excluded.notes, stats = excluded.stats;');
lines.push('');
lines.push('commit;');
lines.push('');

writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Wrote ${outPath} with ${records.length} record(s), ${lines.length} lines.`);
