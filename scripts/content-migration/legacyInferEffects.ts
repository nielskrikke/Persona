import { FeatureEffect } from '../../types';

export const inferOptionEffects = (optionName: string, optionDesc?: string): FeatureEffect[] => {
    if (!optionName) return [];
    const nameLower = optionName.toLowerCase();
    const descLower = (optionDesc || '').toLowerCase();
    const effects: FeatureEffect[] = [];

    // Fighting Styles & Features
    if (nameLower.includes('archery')) {
        effects.push({ type: 'stat_bonus', stat: 'ranged_attack', value: 2 });
    } else if (nameLower.includes('defense') || descLower.includes('+1 bonus to ac')) {
        effects.push({ type: 'stat_bonus', stat: 'ac', value: 1 });
    } else if (nameLower.includes('dueling')) {
        effects.push({ type: 'stat_bonus', stat: 'weapon_damage', value: 2 });
    } else if (nameLower.includes('mariner')) {
        effects.push({ type: 'stat_bonus', stat: 'ac', value: 1 });
        effects.push({ type: 'stat_bonus', stat: 'speed', value: 5 });
    } else if (nameLower.includes('thrown weapon')) {
        effects.push({ type: 'stat_bonus', stat: 'weapon_damage', value: 2 });
    } else if (nameLower.includes('close quarters shooter')) {
        effects.push({ type: 'stat_bonus', stat: 'ranged_attack', value: 1 });
    } else if (nameLower.includes('fleet of foot') || (nameLower.includes('mobile') && !nameLower.includes('armor'))) {
        effects.push({ type: 'stat_bonus', stat: 'speed', value: nameLower.includes('mobile') ? 10 : 5 });
    } else if (nameLower.includes('fast movement') || nameLower.includes('unarmored movement')) {
        effects.push({ type: 'stat_bonus', stat: 'speed', value: 10 });
    } else if (nameLower.includes('tough')) {
        effects.push({ type: 'stat_bonus', stat: 'hp_per_level', value: 2 });
    } else if (nameLower.includes('alert')) {
        effects.push({ type: 'stat_bonus', stat: 'initiative', value: 5 });
        effects.push({ type: 'advantage', stat: 'initiative', target: 'initiative' });
    } else if (nameLower.includes('red') || nameLower.includes('gold') || nameLower.includes('brass') || nameLower.includes('fire resistance') || descLower.includes('fire resistance')) {
        effects.push({ type: 'resistance', value: 'Fire', damage_type: 'Fire' });
    } else if (nameLower.includes('white') || nameLower.includes('silver') || nameLower.includes('cold resistance') || descLower.includes('cold resistance')) {
        effects.push({ type: 'resistance', value: 'Cold', damage_type: 'Cold' });
    } else if (nameLower.includes('blue') || nameLower.includes('bronze') || nameLower.includes('lightning resistance') || descLower.includes('lightning resistance')) {
        effects.push({ type: 'resistance', value: 'Lightning', damage_type: 'Lightning' });
    } else if (nameLower.includes('black') || nameLower.includes('copper') || nameLower.includes('acid resistance') || descLower.includes('acid resistance')) {
        effects.push({ type: 'resistance', value: 'Acid', damage_type: 'Acid' });
    } else if (nameLower.includes('green') || nameLower.includes('poison resistance') || descLower.includes('poison resistance')) {
        effects.push({ type: 'resistance', value: 'Poison', damage_type: 'Poison' });
    } else if (nameLower.includes('armor of shadows')) {
        effects.push({ type: 'set', stat: 'ac', value: 13, target: 'ac' });
    } else if (nameLower.includes('draconic resilience') || nameLower.includes('natural armor')) {
        effects.push({ type: 'set', stat: 'ac', value: 13, target: 'ac' });
        effects.push({ type: 'stat_bonus', stat: 'hp_per_level', value: 1 });
    }

    return effects;
};

