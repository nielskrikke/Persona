import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `weapon-mastery-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const counts: Record<string, number> = { fighter: 3, barbarian: 2, rogue: 2, ranger: 2, paladin: 2 };
const weapons = ['Club','Dagger','Greatclub','Handaxe','Javelin','Light Hammer','Mace','Quarterstaff','Sickle','Spear','Light Crossbow','Dart','Shortbow','Sling','Battleaxe','Flail','Glaive','Greataxe','Greatsword','Halberd','Lance','Longsword','Maul','Morningstar','Pike','Rapier','Scimitar','Shortsword','Trident','War Pick','Warhammer','Whip','Blowgun','Hand Crossbow','Heavy Crossbow','Longbow','Net'];

const { data: rows, error } = await supabase.from('custom_classes').select('id,name,data').eq('is_public', true);
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const index = row.data?.index;
    if (!counts[index]) continue;
    const next = JSON.parse(JSON.stringify(row.data || {}));
    next.choices = next.choices || [];
    if (next.choices.some((choice: any) => choice.kind === 'weapon_mastery')) continue;
    next.choices.push({
        id: `${index}-weapon-mastery`,
        kind: 'weapon_mastery',
        count: counts[index],
        level: 1,
        source: 'class',
        label: 'Weapon Mastery',
        options: weapons,
    });
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase.from('custom_classes').update({ data: next }).eq('id', row.id).select('id');
    if (saveError || !saved?.length) { console.error(`Failed ${index}: ${saveError?.message || '0 rows'}`); process.exitCode = 1; }
    else console.log(`Updated ${index}`);
}
writeFileSync(resolve(dir, 'custom_classes.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} classes`);
