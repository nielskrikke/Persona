import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `breath-weapons-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const damageTypes: Record<string, string> = {
    Acid: 'Acid', Lightning: 'Lightning', Fire: 'Fire', Poison: 'Poison', Cold: 'Cold',
};

const { data: rows, error } = await supabase
    .from('custom_races')
    .select('id,name,data')
    .eq('data->>index', 'dragonborn');
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    let modified = false;
    (next.choices || []).forEach((choice: any) => {
        (choice.options || []).forEach((option: any) => {
            (option.effects || []).forEach((effect: any) => {
                if (effect.type !== 'action' || !/^Breath Weapon/i.test(effect.name || '')) return;
                const typeMatch = String(effect.name).match(/\(([^)]+)\)/);
                const damageType = typeMatch ? (damageTypes[typeMatch[1]] || typeMatch[1]) : 'Fire';
                Object.assign(effect, {
                    damage: '1d10',
                    damage_type: damageType,
                    save_ability: 'DEX',
                    ability: 'con',
                    scaling: { type: 'character_level', values: { 1: '1d10', 5: '2d10', 11: '3d10', 17: '4d10' } },
                });
                modified = true;
            });
        });
    });
    if (!modified) continue;
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_races')
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
writeFileSync(resolve(dir, 'custom_races.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} Dragonborn rows`);
