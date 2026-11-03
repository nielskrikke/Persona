import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `background-equipment-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_backgrounds')
    .select('id,name,data')
    .eq('is_public', true);
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    if (Array.isArray(next.equipment_options) && next.equipment_options.length > 0) continue;
    const equipment = Array.isArray(next.equipment) ? next.equipment : [];
    const goldEntry = equipment.find((item: string) => /^or\s+(\d+)\s+gp\s+instead of this gear$/i.test(item));
    if (!goldEntry) continue;
    const gold = Number(goldEntry.match(/\d+/)?.[0] || 0);
    const kit = equipment.filter((item: string) => item !== goldEntry);
    next.equipment_options = [
        { label: 'Equipment Pack', equipment: kit, currency: next.currency || { gp: 0, sp: 0, cp: 0 } },
        { label: `${gold} GP`, equipment: [], currency: { gp: gold, sp: 0, cp: 0 } },
    ];
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_backgrounds')
        .update({ data: next })
        .eq('id', row.id)
        .select('id');
    if (saveError || !saved?.length) {
        console.error(`Failed ${row.id}: ${saveError?.message || '0 rows'}`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${next.index || row.name}`);
    }
}
writeFileSync(resolve(dir, 'custom_backgrounds.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} backgrounds`);
