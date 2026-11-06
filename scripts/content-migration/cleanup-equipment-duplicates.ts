import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';
const apply = process.argv.includes('--apply');
const { data: rows, error } = await supabase.from('custom_equipment').select('id,name,user_id,created_at,data');
if (error) { console.error(error.message); process.exit(1); }
const groups = new Map<string, any[]>();
(rows || []).forEach(row => {
    const index = String(row.data?.index || row.name || '').toLowerCase().trim();
    if (!index) return;
    if (!groups.has(index)) groups.set(index, []);
    groups.get(index)!.push(row);
});
const deletions: any[] = [];
for (const [index, group] of groups) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    sorted.slice(1).forEach(row => deletions.push({ index, id: row.id, name: row.name, keep: sorted[0].id, row }));
    console.log(index, 'keep', sorted[0].id, 'delete', group.length - 1);
}
console.log('duplicates', deletions.length);
if (!apply) process.exit(0);
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `equipment-duplicates-${new Date().toISOString().replace(/[:.]/g, '-')}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(resolve(dir, 'deleted.json'), JSON.stringify(deletions, null, 2));
const ids = deletions.map(item => item.id);
const { data: deleted, error: deleteError } = await supabase.from('custom_equipment').delete().in('id', ids).select('id');
if (deleteError) console.error(deleteError.message); else console.log('deleted', deleted?.length || 0);
console.log('backup', dir);
