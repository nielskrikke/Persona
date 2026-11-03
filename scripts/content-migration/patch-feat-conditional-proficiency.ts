import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `feat-conditional-proficiency-${now}`);
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const { data: rows, error } = await supabase
    .from('custom_feats')
    .select('id,name,data')
    .eq('is_public', true);

if (error) {
    console.error(error.message);
    process.exit(1);
}

const changed: any[] = [];
for (const row of rows || []) {
    if (!/observant|keen mind/i.test(row.data?.name || '')) continue;
    const next = JSON.parse(JSON.stringify(row.data || {}));
    (next.effects || []).forEach((effect: any) => {
        if (effect.type === 'proficiency_choice' && (effect.category || 'skill') === 'skill') {
            effect.expertise_if_proficient = true;
        }
    });
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase
        .from('custom_feats')
        .update({ data: next })
        .eq('id', row.id)
        .select('id');
    if (saveError || !saved || saved.length === 0) {
        console.error(`Failed ${row.data?.name || row.id}: ${saveError?.message || '0 rows'}`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${row.data?.name || row.name}`);
    }
}

writeFileSync(resolve(backupDir, 'custom_feats.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} feat rows. Backup: ${backupDir}`);
