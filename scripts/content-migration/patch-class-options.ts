import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';
import { ARROWSMITH_ARROWS, METAMAGIC_OPTIONS, PICK_A_CARD_TABLE, WARLOCK_INVOCATIONS } from './legacyOptions';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `class-options-${now}`);
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_classes')
    .select('id,name,data')
    .eq('is_public', true);

if (error) {
    console.error(error.message);
    process.exit(1);
}

const updates = [
    { index: 'sorcerer', options: { metamagic: METAMAGIC_OPTIONS, metamagicProgression: { progressionLevels: [2, 10, 17], calibrationFrom: 3 } } },
    { index: 'card-master', options: { pickACardTable: PICK_A_CARD_TABLE } },
    { index: 'arrowsmith', options: { arrowCrafting: true, arrows: ARROWSMITH_ARROWS } },
    { index: 'warlock', options: { invocations: WARLOCK_INVOCATIONS } },
];

const backups: any[] = [];
for (const update of updates) {
    const matching = (rows || []).filter((item: any) => item.data?.index === update.index);
    if (matching.length === 0) {
        console.warn(`Missing class: ${update.index}`);
        continue;
    }
    for (const row of matching) {
        backups.push(row);
        const nextData = {
            ...row.data,
            options: { ...(row.data.options || {}), ...update.options },
        };
        const { data: saved, error: saveError } = await supabase
            .from('custom_classes')
            .update({ data: nextData })
            .eq('id', row.id)
            .select('id');
        if (saveError) {
            console.error(`Failed ${update.index}: ${saveError.message}`);
            process.exitCode = 1;
        } else if (!saved || saved.length === 0) {
            console.error(`Blocked ${update.index}: 0 rows`);
            process.exitCode = 1;
        } else {
            console.log(`Updated ${update.index} (${row.id})`);
        }
    }
}

writeFileSync(resolve(backupDir, 'custom_classes.json'), JSON.stringify(backups, null, 2));
console.log(`Backup: ${backupDir}`);
