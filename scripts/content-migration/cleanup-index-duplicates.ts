import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const apply = process.argv.includes('--apply');
const tables = ['custom_classes', 'custom_subclasses', 'custom_races', 'custom_backgrounds', 'custom_feats', 'custom_spells', 'custom_equipment', 'custom_beasts', 'custom_familiars'];
const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `index-duplicates-${now}`);
if (apply && !existsSync(dir)) mkdirSync(dir, { recursive: true });

const deletions: any[] = [];
for (const table of tables) {
    const { data: rows, error } = await supabase.from(table).select('id,name,user_id,created_at,data');
    if (error) { console.error(table, error.message); continue; }
    const groups = new Map<string, any[]>();
    (rows || []).forEach(row => {
        const index = String(row.data?.index || row.name || '').toLowerCase().trim();
        if (!index) return;
        if (!groups.has(index)) groups.set(index, []);
        groups.get(index)!.push(row);
    });
    for (const [index, group] of groups) {
        if (group.length < 2) continue;
        const sorted = [...group].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        const keep = sorted[0];
        const remove = sorted.slice(1);
        remove.forEach(row => deletions.push({ table, index, id: row.id, name: row.name, keep: keep.id, row }));
        console.log(`${table}/${index}: keep ${keep.id}, delete ${remove.length}`);
    }
}
console.log(`Total rows to delete: ${deletions.length}`);
if (!apply) { console.log('Dry-run only. Re-run with --apply.'); process.exit(0); }
if (deletions.length === 0) process.exit(0);
writeFileSync(resolve(dir, 'deleted-index-duplicates.json'), JSON.stringify(deletions, null, 2));
for (const table of tables) {
    const ids = deletions.filter(item => item.table === table).map(item => item.id);
    if (ids.length === 0) continue;
    const { data: deleted, error } = await supabase.from(table).delete().in('id', ids).select('id');
    if (error) console.error(`Delete failed ${table}: ${error.message}`);
    else console.log(`Deleted ${deleted?.length || 0}/${ids.length} from ${table}`);
}
console.log(`Backup: ${dir}`);
