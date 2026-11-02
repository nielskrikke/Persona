import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const apply = process.argv.includes('--apply');
const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `duplicate-cleanup-${now}`);
if (apply && !existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const score = (table: string, item: any): number => {
    let value = 0;
    if (item?.source && String(item.source).toLowerCase() !== 'homebrew') value += 100;
    if (item?.is_homebrew === false || item?.homebrew === false) value += 10;
    if (table === 'custom_classes') {
        value += (item?.proficiency_choices?.length || 0) * 20;
        value += (item?.level_table || []).some((row: any) => row?.class_specific) ? 60 : 0;
        value += item?.feature_details?.length || 0;
        value += item?.options ? Object.keys(item.options).length * 5 : 0;
    } else if (table === 'custom_subclasses') {
        value += (item?.feature_details?.length || 0) * 10;
        value += item?.options ? Object.keys(item.options).length * 5 : 0;
    }
    return value;
};

const { data: duplicates, error } = await supabase.from('content_duplicate_report').select('*');
if (error) {
    console.error(error.message);
    process.exit(1);
}

const METADATA_KEYS = new Set(['id', 'user_id', 'created_at', 'updated_at', 'isCustom', 'is_public', 'is_homebrew', 'homebrew']);
const isEmptyValue = (value: any): boolean => {
    if (value === undefined || value === null || value === '') return true;
    if (Array.isArray(value)) return value.length === 0 || value.every(item => isEmptyValue(item));
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

const toDelete: any[] = [];
const skipped: any[] = [];

for (const group of duplicates || []) {
    const { data: rows, error: rowError } = await supabase
        .from(group.table_name)
        .select('id,name,user_id,homebrew,created_at,data')
        .in('id', group.ids);
    if (rowError || !rows?.length) {
        console.warn(`Could not inspect ${group.table_name}/${group.slug}: ${rowError?.message || 'no rows'}`);
        continue;
    }

    const ranked = [...rows].sort((a, b) => score(group.table_name, b.data) - score(group.table_name, a.data));
    const best = ranked[0];
    const bestScore = score(group.table_name, best.data);
    for (const row of ranked.slice(1)) {
        const rowScore = score(group.table_name, row.data);
        const extraKeys = Object.keys(row.data || {}).filter(key =>
            !METADATA_KEYS.has(key) && !(key in (best.data || {})) && !isEmptyValue((row.data || {})[key])
        );
        if (rowScore >= bestScore) {
            // Tied rows can be cleaned when the payload shape is identical and
            // only the description length differs; otherwise leave both alone.
            const rowKeys = Object.keys(row.data || {}).filter(key => !METADATA_KEYS.has(key)).sort().join(',');
            const bestKeys = Object.keys(best.data || {}).filter(key => !METADATA_KEYS.has(key)).sort().join(',');
            const rowDesc = String((row.data || {}).desc?.[0] || '');
            const bestDesc = String((best.data || {}).desc?.[0] || '');
            const sameShape = rowKeys === bestKeys && (row.data?.feature_details?.length || 0) === (best.data?.feature_details?.length || 0);
            if (sameShape && bestDesc.length >= rowDesc.length) {
                toDelete.push({ table: group.table_name, group: group.slug, id: row.id, score: rowScore, keep: best.id, keepScore: bestScore, row });
            } else {
                skipped.push({ group, row: row.id, reason: 'tied score' });
            }
            continue;
        }
        if (extraKeys.length > 0) {
            skipped.push({ group, row: row.id, reason: `unique keys: ${extraKeys.join(', ')}` });
            continue;
        }
        toDelete.push({ table: group.table_name, group: group.slug, id: row.id, score: rowScore, keep: best.id, keepScore: bestScore, row });
    }
}

console.log(`Duplicate rows to delete: ${toDelete.length}`);
for (const item of toDelete) console.log(`- ${item.table}/${item.group}: ${item.id} (score ${item.score}; keep ${item.keep} score ${item.keepScore})`);
if (skipped.length) {
    console.log(`Skipped: ${skipped.length}`);
    for (const item of skipped) console.log(`- ${item.group.table_name}/${item.group.slug}: ${item.row} (${item.reason})`);
}

if (!apply) {
    console.log('Dry-run only. Re-run with --apply to delete the listed rows.');
    process.exit(0);
}

if (toDelete.length === 0) {
    console.log('Nothing to delete.');
    process.exit(0);
}

writeFileSync(resolve(backupDir, 'deleted-content.json'), JSON.stringify(toDelete, null, 2));
for (const table of Array.from(new Set(toDelete.map(item => item.table)))) {
    const ids = toDelete.filter(item => item.table === table).map(item => item.id);
    const { data: deleted, error: deleteError } = await supabase
        .from(table)
        .delete()
        .in('id', ids)
        .select('id');
    if (deleteError) {
        console.error(`Delete failed for ${table}: ${deleteError.message}`);
        process.exitCode = 1;
    } else {
        console.log(`Deleted ${deleted?.length || 0}/${ids.length} from ${table}`);
    }
}
console.log(`Backup: ${backupDir}`);
