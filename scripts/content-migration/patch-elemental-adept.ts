import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `elemental-adept-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const { data: rows, error } = await supabase.from('custom_feats').select('id,name,data').eq('data->>index', 'elemental-adept');
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    (next.effects || []).forEach((effect: any) => {
        if (effect.type !== 'feature_choice') return;
        (effect.options || []).forEach((option: any) => {
            const type = option.name;
            option.effects = [
                { name: `${type} Resistance Ignored`, type: 'ignore_resistance', damage_type: type },
                { name: `${type} Dice Minimum`, type: 'damage_die_min', damage_type: type, value: 2 },
            ];
        });
    });
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase.from('custom_feats').update({ data: next }).eq('id', row.id).select('id');
    if (saveError || !saved?.length) { console.error(`Failed ${row.id}: ${saveError?.message || '0 rows'}`); process.exitCode = 1; }
    else console.log(`Updated ${row.data?.name}`);
}
writeFileSync(resolve(dir, 'custom_feats.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} feats`);
