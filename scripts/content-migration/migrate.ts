import { createClient } from '@supabase/supabase-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase as appSupabase } from '../../services/supabase';
import { buildRecordData, stableStringify } from './mappings';
import { CONTENT_TABLES, ContentRow, ContentTableSpec, MigrationIssue, MigrationPlan, MigrationRecordResult } from './types';
import { validateRecord } from './validate';

/* ------------------------------------------------------------------------- */
/* Environment                                                               */
/* ------------------------------------------------------------------------- */

const loadEnvFile = () => {
    const envPath = resolve(process.cwd(), '.env.local');
    if (!existsSync(envPath)) return;
    const text = readFileSync(envPath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
    }
};

loadEnvFile();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// The checked-in app service already contains the public anon fallback. Use
// explicit env values when provided; otherwise reuse the app client so the
// migration works in this checkout even when .env.local has empty Supabase keys.
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : appSupabase;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('SUPABASE_URL/SUPABASE_ANON_KEY not set; using the app client fallback.');
}

/* ------------------------------------------------------------------------- */
/* CLI                                                                       */
/* ------------------------------------------------------------------------- */

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const help = args.includes('--help') || args.includes('-h');
const tableArg = args.find(arg => arg.startsWith('--table='))?.slice('--table='.length);
const selectedTables = tableArg
    ? new Set(tableArg.split(',').map(t => t.trim()).filter(Boolean))
    : null;

if (help) {
    console.log(`Usage: npx tsx scripts/content-migration/migrate.ts [--apply] [--table=classes,races,...]\n\n` +
        `Default is dry-run. Writes a full backup and plan under scripts/content-migration/.\n` +
        `Use --apply only after reviewing the plan and applying the SQL schema migration.`);
    process.exit(0);
}

/* ------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------- */

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const nowIso = () => new Date().toISOString();
const runId = nowIso().replace(/[:.]/g, '-');

const reportsRoot = resolve(process.cwd(), 'scripts/content-migration/reports', runId);
const backupsRoot = resolve(process.cwd(), 'scripts/content-migration/backups', runId);

const ensureDir = (dir: string) => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const writeJson = (path: string, value: any) => writeFileSync(path, JSON.stringify(value, null, 2), 'utf8');

const fetchAll = async (table: string): Promise<ContentRow[]> => {
    const pageSize = 1000;
    const rows: ContentRow[] = [];
    let from = 0;
    while (true) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .range(from, from + pageSize - 1);
        if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
        rows.push(...((data || []) as ContentRow[]));
        if (!data || data.length < pageSize) break;
        from += pageSize;
    }
    return rows;
};

const changedKeys = (before: any, after: any): { added: string[]; changed: string[] } => {
    const added: string[] = [];
    const changed: string[] = [];
    const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
    for (const key of keys) {
        const hasBefore = Object.prototype.hasOwnProperty.call(before || {}, key);
        const hasAfter = Object.prototype.hasOwnProperty.call(after || {}, key);
        if (!hasBefore && hasAfter) added.push(key);
        else if (hasBefore && hasAfter && stableStringify(before[key]) !== stableStringify(after[key])) changed.push(key);
        else if (hasBefore && !hasAfter) changed.push(key);
    }
    return { added: added.sort(), changed: changed.sort() };
};

const summarize = (records: MigrationRecordResult[], specs: ContentTableSpec[]) => specs.map(spec => {
    const rows = records.filter(r => r.table === spec.table);
    return {
        table: spec.table,
        label: spec.label,
        total: rows.length,
        changed: rows.filter(r => r.changed).length,
        errors: rows.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0),
        warnings: rows.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0),
    };
});

const renderSummary = (plan: MigrationPlan): string => {
    const lines: string[] = [];
    lines.push(`# Content migration ${plan.mode}`);
    lines.push('');
    lines.push(`Generated: ${plan.generatedAt}`);
    lines.push('');
    lines.push('| Table | Rows | Changed | Errors | Warnings |');
    lines.push('|---|---:|---:|---:|---:|');
    for (const table of plan.tables) {
        lines.push(`| ${table.label} | ${table.total} | ${table.changed} | ${table.errors} | ${table.warnings} |`);
    }
    lines.push('');
    const issueRecords = plan.records.filter(r => r.issues.length > 0);
    if (issueRecords.length === 0) {
        lines.push('No validation issues.');
    } else {
        lines.push('## Validation issues');
        lines.push('');
        for (const record of issueRecords) {
            lines.push(`### ${record.tableLabel}: ${record.name} (${record.slug})`);
            for (const issue of record.issues) {
                lines.push(`- **${issue.severity}** \`${issue.path}\`: ${issue.message}`);
            }
            lines.push('');
        }
    }
    const changed = plan.records.filter(r => r.changed);
    lines.push('## Changed records');
    lines.push('');
    if (changed.length === 0) {
        lines.push('Nothing to change.');
    } else {
        lines.push('| Table | Name | Added keys | Changed keys |');
        lines.push('|---|---|---|---|');
        for (const record of changed) {
            lines.push(`| ${record.tableLabel} | ${record.name} | ${record.addedKeys.join(', ') || '-'} | ${record.changedKeys.join(', ') || '-'} |`);
        }
    }
    lines.push('');
    return lines.join('\n');
};

const detectV2Columns = async (table: string): Promise<boolean> => {
    const { error } = await supabase
        .from(table)
        .select('id,schema_version,slug,source,migrated_at')
        .limit(1);
    return !error;
};

/* ------------------------------------------------------------------------- */
/* Build plan                                                                */
/* ------------------------------------------------------------------------- */

const specs = CONTENT_TABLES.filter(spec => !selectedTables || selectedTables.has(spec.key) || selectedTables.has(spec.table));
if (specs.length === 0) {
    console.error(`No matching tables. Use --table=${CONTENT_TABLES.map(s => s.key).join(',')}`);
    process.exit(1);
}

const records: MigrationRecordResult[] = [];
const backups: Record<string, ContentRow[]> = {};

for (const spec of specs) {
    console.log(`Reading ${spec.table}...`);
    const rows = await fetchAll(spec.table);
    backups[spec.table] = rows;

    for (const row of rows) {
        const before = clone(row.data || {});
        let after: any;
        let issues: MigrationIssue[] = [];
        try {
            after = buildRecordData(spec.table, clone(before));
            issues = validateRecord(spec.table, after);
        } catch (error: any) {
            after = before;
            issues = [{ severity: 'error', path: '$', message: error?.message || String(error) }];
        }
        const diff = changedKeys(before, after);
        records.push({
            table: spec.table,
            tableLabel: spec.label,
            id: row.id,
            name: row.name,
            slug: after?.index || row.schema_version ? (after?.index || row.name) : row.name,
            changed: stableStringify(before) !== stableStringify(after),
            addedKeys: diff.added,
            changedKeys: diff.changed,
            issues,
            before,
            after,
        });
    }
}

const plan: MigrationPlan = {
    generatedAt: nowIso(),
    mode: apply ? 'apply' : 'dry-run',
    tables: summarize(records, specs),
    records,
};

ensureDir(reportsRoot);
ensureDir(backupsRoot);

for (const [table, rows] of Object.entries(backups)) {
    writeJson(resolve(backupsRoot, `${table}.json`), rows);
}
writeJson(resolve(backupsRoot, 'manifest.json'), {
    runId,
    generatedAt: plan.generatedAt,
    tables: Object.fromEntries(Object.entries(backups).map(([table, rows]) => [table, rows.length])),
});

writeJson(resolve(reportsRoot, 'plan.json'), plan);
writeFileSync(resolve(reportsRoot, 'summary.md'), renderSummary(plan), 'utf8');

console.log('');
console.log(renderSummary(plan));
console.log(`Backups: ${backupsRoot}`);
console.log(`Plan:    ${reportsRoot}/plan.json`);

const errorCount = plan.tables.reduce((sum, table) => sum + table.errors, 0);

if (!apply) {
    if (errorCount > 0) {
        console.error(`\nDry-run found ${errorCount} validation error(s). Nothing was written.`);
        process.exitCode = 1;
    } else {
        console.log('\nDry-run only. Nothing was written. Re-run with --apply after applying the SQL schema migration and reviewing the plan.');
    }
} else {
    const hasV2: Record<string, boolean> = {};
    for (const spec of specs) {
        hasV2[spec.table] = await detectV2Columns(spec.table);
        console.log(`Metadata columns on ${spec.table}: ${hasV2[spec.table] ? 'yes' : 'no (data-only update)'}`);
    }

    const appliedAt = nowIso();
    const applied: any[] = [];
    const failed: any[] = [];
    const candidates = records.filter(r => r.changed && !r.issues.some(i => i.severity === 'error'));

    console.log(`\nApplying ${candidates.length} record(s)...`);
    let index = 0;
    for (const record of candidates) {
        index += 1;
        const payload: any = { data: record.after };
        if (hasV2[record.table]) {
            payload.schema_version = 2;
            payload.slug = record.after.index || record.slug;
            payload.source = record.after.source || null;
            payload.migrated_at = appliedAt;
        }
        // IMPORTANT: a PostgREST update that is filtered out by RLS returns
        // 200 with an empty body and no error. Always ask for the updated ids so
        // a blocked/no-op write is reported as a failure instead of "applied".
        const { data: updated, error } = await supabase
            .from(record.table)
            .update(payload)
            .eq('id', record.id)
            .select('id');

        if (error) {
            failed.push({ table: record.table, id: record.id, name: record.name, error: error.message });
            console.error(`  ✗ ${record.table}/${record.name}: ${error.message}`);
        } else if (!updated || updated.length === 0) {
            const message = 'RLS blocked the update (0 rows returned). Use the generated SQL data migration or a service-role key.';
            failed.push({ table: record.table, id: record.id, name: record.name, error: message });
            console.error(`  ✗ ${record.table}/${record.name}: ${message}`);
        } else {
            applied.push({ table: record.table, id: record.id, name: record.name, slug: record.after.index || record.slug });
            if (index % 10 === 0 || index === candidates.length) {
                console.log(`  ${index}/${candidates.length}`);
            }
        }
    }

    writeJson(resolve(reportsRoot, 'apply-result.json'), {
        runId,
        appliedAt,
        applied,
        failed,
        skippedWithErrors: records.filter(r => r.issues.some(i => i.severity === 'error')).map(r => ({
            table: r.table,
            id: r.id,
            name: r.name,
            issues: r.issues,
        })),
    });

    console.log(`\nApplied: ${applied.length}`);
    console.log(`Failed:  ${failed.length}`);
    console.log(`Report:  ${reportsRoot}/apply-result.json`);

    if (failed.length > 0 || errorCount > 0) process.exitCode = 1;
}
