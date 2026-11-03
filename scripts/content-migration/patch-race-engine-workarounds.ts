import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `race-engine-workarounds-${now}`);
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_races')
    .select('id,name,data')
    .eq('is_public', true);

if (error) {
    console.error(error.message);
    process.exit(1);
}

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    let modified = false;

    if (next.index === 'harengon') {
        (next.traits || []).forEach((trait: any) => {
            if (trait.index !== 'hare-trigger' && trait.name !== 'Hare-Trigger') return;
            trait.effects = [{
                name: 'Hare-Trigger',
                type: 'stat_bonus',
                target: 'initiative',
                scaling: 'proficiency',
                description: 'Add your Proficiency Bonus to initiative rolls.',
            }];
            trait.modifiers = trait.effects;
            modified = true;
        });
    }

    if (next.index === 'tortle') {
        (next.traits || []).forEach((trait: any) => {
            if (trait.index !== 'natural-armor' && trait.name !== 'Natural Armor') return;
            trait.effects = (trait.effects || []).filter((effect: any) =>
                !(effect.type === 'feature' && /sheet adds Dex/i.test(effect.description || effect.desc || ''))
            );
            trait.modifiers = trait.effects;
            modified = true;
        });
    }

    if (!modified) continue;
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_races')
        .update({ data: next })
        .eq('id', row.id)
        .select('id');
    if (saveError || !saved || saved.length === 0) {
        console.error(`Failed ${row.data?.index || row.id}: ${saveError?.message || '0 rows'}`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${row.data?.index || row.name}`);
    }
}

writeFileSync(resolve(backupDir, 'custom_races.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} race rows. Backup: ${backupDir}`);
