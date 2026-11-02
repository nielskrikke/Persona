import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { supabase } from '../../services/supabase';

const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(process.cwd(), 'scripts/content-migration/backups', `combat-effects-${now}`);
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const classUpdates: Record<string, Record<string, any[]>> = {
    fighter: {
        'Two Extra Attacks': [{ type: 'extra_attack', mode: 'set', value: 3, name: 'Extra Attack' }],
        'Three Extra Attacks': [{ type: 'extra_attack', mode: 'set', value: 4, name: 'Extra Attack' }],
    },
    rogue: {
        'Cunning Strike': [
            { type: 'feature', name: 'Cunning Strike', description: 'You can trade Sneak Attack damage for additional effects like Poison, Trip, or Withdraw.' },
            { type: 'attack_rider', name: 'Cunning Strike', condition: 'finesse_or_ranged_weapon', description: 'You can trade Sneak Attack damage for additional effects like Poison, Trip, or Withdraw.' },
        ],
    },
    barbarian: {},
    paladin: {
        "Paladin's Smite": [{ type: 'attack_rider', name: 'Divine Smite', condition: 'melee_weapon', description: 'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal extra radiant damage.' }],
    },
    ranger: {
        'Foe Slayer': [{ type: 'attack_rider', name: 'Foe Slayer', condition: 'weapon', description: 'You can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies.' }],
    },
    monk: {
        'Empowered Strikes': [{ type: 'attack_rider', name: 'Empowered Strikes', condition: 'unarmed', description: 'Whenever you deal damage with your Unarmed Strike, it can deal Force damage or its normal damage type.' }],
    },
};

const conditionUpdates: Record<string, Record<string, string>> = {
    rogue: { 'Sneak Attack': 'finesse_or_ranged_weapon' },
    paladin: { 'Radiant Strikes': 'melee_weapon' },
    barbarian: { 'Brutal Strike': 'melee_weapon' },
};

const { data: rows, error } = await supabase
    .from('custom_classes')
    .select('id,name,data')
    .eq('is_public', true);

if (error) {
    console.error(error.message);
    process.exit(1);
}

const backups: any[] = [];
for (const [index, featureUpdates] of Object.entries(classUpdates) as any) {
    const row = (rows || []).find((item: any) => item.data?.index === index);
    if (!row) {
        console.warn(`Missing class ${index}`);
        continue;
    }
    backups.push(row);
    const nextData = JSON.parse(JSON.stringify(row.data));
    (nextData.feature_details || []).forEach((feature: any) => {
        const additions = featureUpdates[feature.name];
        if (!additions) return;
        const existing = Array.isArray(feature.effects) ? feature.effects : [];
        additions.forEach((addition: any) => {
            const found = existing.find((effect: any) => effect.type === addition.type && (effect.name || '') === (addition.name || ''));
            if (found) Object.assign(found, addition);
            else existing.push(addition);
        });
        feature.effects = existing;
    });
    const conditions = conditionUpdates[index] || {};
    (nextData.feature_details || []).forEach((feature: any) => {
        const condition = conditions[feature.name];
        if (!condition) return;
        (feature.effects || []).forEach((effect: any) => {
            if (effect.type === 'attack_rider') effect.condition = condition;
        });
    });

    const { data: saved, error: saveError } = await supabase
        .from('custom_classes')
        .update({ data: nextData })
        .eq('id', row.id)
        .select('id');
    if (saveError || !saved || saved.length === 0) {
        console.error(`Failed ${index}: ${saveError?.message || '0 rows'}`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${index}`);
    }
}

writeFileSync(resolve(backupDir, 'custom_classes.json'), JSON.stringify(backups, null, 2));
console.log(`Backup: ${backupDir}`);
