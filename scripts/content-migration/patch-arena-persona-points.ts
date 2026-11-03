import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `arena-persona-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_subclasses')
    .select('id,name,data')
    .eq('data->>index', 'arena-royale');
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    const resource = (next.resources || []).find((item: any) => item.key === 'persona_points');
    if (!resource) continue;
    resource.max = { ...(resource.max || {}), bonus: 3 };
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_subclasses')
        .update({ data: next })
        .eq('id', row.id)
        .select('id');
    if (saveError || !saved?.length) {
        console.error(`Failed ${row.id}: ${saveError?.message || '0 rows'}`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${row.id}`);
    }
}
writeFileSync(resolve(dir, 'custom_subclasses.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} Arena Royale rows`);
