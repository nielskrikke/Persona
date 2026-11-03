import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const dir = resolve(process.cwd(), 'scripts/content-migration/backups', `goliath-boons-${now}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const { data: rows, error } = await supabase.from('custom_races').select('id,name,data').eq('data->>index', 'goliath');
if (error) { console.error(error.message); process.exit(1); }

const changed: any[] = [];
for (const row of rows || []) {
    const next = JSON.parse(JSON.stringify(row.data || {}));
    next.choices = next.choices || [];
    if (next.choices.some((choice: any) => choice.id === 'goliath-giant-ancestry')) continue;
    next.choices.push({
        id: 'goliath-giant-ancestry',
        kind: 'ancestry',
        count: 1,
        level: 1,
        source: 'race',
        label: 'Giant Ancestry',
        options: [
            { name: "Cloud's Jaunt", desc: 'Teleport up to 30 feet as a Bonus Action.', effects: [{ name: "Cloud's Jaunt", type: 'bonus_action', description: 'Teleport up to 30 feet as a Bonus Action.' }] },
            { name: "Fire's Burn", desc: 'Once per turn, deal an extra 1d10 Fire damage on a hit.', effects: [{ name: "Fire's Burn", type: 'attack_rider', condition: 'weapon', damage: '1d10', damage_type: 'Fire', description: 'Once per turn, deal an extra 1d10 Fire damage on a hit.' }] },
            { name: "Frost's Chill", desc: 'Once per turn, deal an extra 1d6 Cold damage and reduce the target’s Speed by 10 feet.', effects: [{ name: "Frost's Chill", type: 'attack_rider', condition: 'weapon', damage: '1d6', damage_type: 'Cold', description: 'Once per turn, deal an extra 1d6 Cold damage and reduce the target’s Speed by 10 feet.' }] },
            { name: "Hill's Tumble", desc: 'Once per turn, knock a Large or smaller target Prone on a hit.', effects: [{ name: "Hill's Tumble", type: 'attack_rider', condition: 'weapon', description: 'Once per turn, knock a Large or smaller target Prone on a hit.' }] },
            { name: "Stone's Endurance", desc: 'Use your Reaction to reduce damage by 1d12 + Constitution modifier.', effects: [{ name: "Stone's Endurance", type: 'reaction', description: 'Use your Reaction to reduce damage by 1d12 + Constitution modifier.' }] },
            { name: "Storm's Thunder", desc: 'Use your Reaction to deal 1d8 Thunder damage to a creature that hits you.', effects: [{ name: "Storm's Thunder", type: 'reaction', description: 'Use your Reaction to deal 1d8 Thunder damage to a creature that hits you.' }] },
        ],
    });
    changed.push({ ...row, replacementData: next });
    const { data: saved, error: saveError } = await supabase.from('custom_races').update({ data: next }).eq('id', row.id).select('id');
    if (saveError || !saved?.length) { console.error(`Failed ${row.id}: ${saveError?.message || '0 rows'}`); process.exitCode = 1; }
    else console.log(`Updated ${row.id}`);
}
writeFileSync(resolve(dir, 'custom_races.json'), JSON.stringify(changed, null, 2));
console.log(`Changed ${changed.length} Goliath rows`);
