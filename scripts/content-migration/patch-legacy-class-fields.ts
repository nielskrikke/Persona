import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `legacy-class-fields-${now}`);
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_classes')
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

    if (Object.prototype.hasOwnProperty.call(next, 'proficiency_choices')) {
        delete next.proficiency_choices;
        modified = true;
    }

    if (next.index === 'pugilist') {
        (next.feature_details || []).forEach((feature: any) => {
            if (!/iron chin/i.test(feature.name || '')) return;
            feature.desc = ['While wearing no armor and not using a shield, your AC is 10 + your Dexterity modifier + your Constitution modifier.'];
            (feature.effects || []).forEach((effect: any) => {
                if (effect.type !== 'stat_bonus_attribute' || effect.target !== 'ac') return;
                effect.condition = 'if no armor and no shield';
                effect.rule = 'If no armor and no shield';
                effect.conditions = ['no_armor', 'no_shield'];
            });
            modified = true;
        });
    }

    if (!modified) continue;
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_classes')
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

writeFileSync(resolve(backupDir, 'custom_classes.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} class rows. Backup: ${backupDir}`);
