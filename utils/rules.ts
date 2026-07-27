
import { CharacterClass, AbilityScores, AbilityName, SpellDetail, CharacterState, FeatureEffect } from '@/types';

export const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
};

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

export const getEffectiveAbilities = (character: CharacterState): AbilityScores => {
    const abilities = { ...character.abilities };
    
    // 1. Racial bonuses (direct)
    character.race?.ability_bonuses?.forEach(b => {
        const stat = b.ability_score.index as AbilityName;
        if (abilities[stat] !== undefined) abilities[stat] += b.bonus;
    });
    character.subrace?.ability_bonuses?.forEach(b => {
        const stat = b.ability_score.index as AbilityName;
        if (abilities[stat] !== undefined) abilities[stat] += b.bonus;
    });

    // 2. Modifiers from traits and items
    const mods: any[] = [];

    const processEffects = (effects: any[]) => {
        if (!effects) return;
        effects.forEach((e: any) => {
            mods.push(e);
            if ((e.type === 'feature_choice' || e.type === 'proficiency_choice' || e.options) && Array.isArray(e.options)) {
                e.options.forEach((opt: any) => {
                    const optName = opt.name || opt.item?.name;
                    if (!optName) return;

                    const isSelectedInChoices = character.choices?.some((c: any) => {
                        const val = c.value;
                        if (typeof val === 'string') {
                            return val.toLowerCase() === optName.toLowerCase() || val.toLowerCase().includes(optName.toLowerCase());
                        }
                        if (Array.isArray(val)) {
                            return val.some((v: any) => typeof v === 'string' ? (v.toLowerCase() === optName.toLowerCase() || v.toLowerCase().includes(optName.toLowerCase())) : (v?.name?.toLowerCase() === optName.toLowerCase()));
                        }
                        if (val && typeof val === 'object' && val.name) {
                            return val.name.toLowerCase() === optName.toLowerCase();
                        }
                        return false;
                    });

                    const isSelectedInClassFeatures = character.classFeatures?.some((f: any) => {
                        const fn = f.name.toLowerCase();
                        const on = optName.toLowerCase();
                        return fn === on || fn.endsWith(`: ${on}`) || fn.includes(`(${on})`);
                    });

                    if (isSelectedInChoices || isSelectedInClassFeatures) {
                        if (opt.effects && Array.isArray(opt.effects)) {
                            opt.effects.forEach((subE: any) => mods.push(subE));
                        }
                        if (opt.modifiers && Array.isArray(opt.modifiers)) {
                            opt.modifiers.forEach((subM: any) => mods.push(subM));
                        }
                    }
                });
            }
        });
    };
    
    // Racial Traits
    if (character.race) {
        (character.race as any).traits?.forEach((trait: any) => {
            trait.modifiers?.forEach((m: any) => mods.push(m));
            processEffects(trait.effects);
        });
    }
    // Subracial Traits
    if (character.subrace) {
        (character.subrace as any).traits?.forEach((trait: any) => {
            trait.modifiers?.forEach((m: any) => mods.push(m));
            processEffects(trait.effects);
        });
    }
    // Class & Subclass Features
    character.classes?.forEach(cls => {
        cls.definition.feature_details?.forEach(f => {
            if (f.level <= cls.level) {
                processEffects(f.effects);
            }
        });
        if (cls.subclass) {
            cls.subclass.feature_details?.forEach(f => {
                if (f.level <= cls.level) {
                    processEffects(f.effects);
                }
            });
        }
    });
    // Class Features / Virtual choice features
    character.classFeatures?.forEach(feat => {
        processEffects(feat.effects);
    });
    // Direct choices
    character.choices?.forEach((c: any) => {
        if (c.value && typeof c.value === 'object' && !Array.isArray(c.value)) {
            if (c.value.effects && Array.isArray(c.value.effects)) c.value.effects.forEach((subE: any) => mods.push(subE));
            if (c.value.modifiers && Array.isArray(c.value.modifiers)) c.value.modifiers.forEach((subM: any) => mods.push(subM));
        } else if (Array.isArray(c.value)) {
            c.value.forEach((v: any) => {
                if (v && typeof v === 'object') {
                    if (v.effects && Array.isArray(v.effects)) v.effects.forEach((subE: any) => mods.push(subE));
                    if (v.modifiers && Array.isArray(v.modifiers)) v.modifiers.forEach((subM: any) => mods.push(subM));
                }
            });
        }
    });
    // Equipped & Attuned Items
    character.inventory?.forEach(item => {
        if (item.equipped && (!item.requires_attunement || item.attuned)) {
            item.modifiers?.forEach(m => mods.push(m));
            processEffects((item as any).effects);
        }
    });
    // Feats
    character.feats?.forEach(feat => {
        processEffects(feat.effects);
        feat.modifiers?.forEach(m => mods.push(m));
    });

    // Apply bonuses
    mods.forEach(m => {
        const targetStat = (m.target || m.stat || m.attribute || '').toLowerCase();
        if ((m.type === 'bonus' || m.type === 'stat_bonus' || m.type === 'asi' || m.type === 'stat_bonus_attribute') && targetStat in abilities) {
            abilities[targetStat as AbilityName] += Number(m.value || m.amount || 0);
        }
    });

    // Apply overrides
    mods.forEach(m => {
        const targetStat = (m.target || m.stat || m.attribute || '').toLowerCase();
        if (m.type === 'set' && targetStat in abilities) {
            abilities[targetStat as AbilityName] = Math.max(abilities[targetStat as AbilityName], Number(m.value || 0));
        }
    });

    return abilities;
};

export const isPreparedCaster = (classIndex: string): boolean => {
    return ['cleric', 'druid', 'paladin', 'artificer', 'wizard', 'card-master'].includes(classIndex);
};

export const formatModifier = (mod: number): string => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const calculateProficiency = (level: number): number => {
    return Math.floor((level - 1) / 4) + 2;
};

export const SKILL_LIST = [
    { name: 'Acrobatics', ability: 'dex' as const },
    { name: 'Animal Handling', ability: 'wis' as const },
    { name: 'Arcana', ability: 'int' as const },
    { name: 'Athletics', ability: 'str' as const },
    { name: 'Deception', ability: 'cha' as const },
    { name: 'History', ability: 'int' as const },
    { name: 'Insight', ability: 'wis' as const },
    { name: 'Intimidation', ability: 'cha' as const },
    { name: 'Investigation', ability: 'int' as const },
    { name: 'Medicine', ability: 'wis' as const },
    { name: 'Nature', ability: 'int' as const },
    { name: 'Perception', ability: 'wis' as const },
    { name: 'Performance', ability: 'cha' as const },
    { name: 'Persuasion', ability: 'cha' as const },
    { name: 'Religion', ability: 'int' as const },
    { name: 'Sleight of Hand', ability: 'dex' as const },
    { name: 'Stealth', ability: 'dex' as const },
    { name: 'Survival', ability: 'wis' as const },
];

export const getSpellSlots = (classes: CharacterClass[]): Record<number, { max: number, current: number }> => {
    let casterLevel = 0;
    classes.forEach(c => {
        const index = c.definition.index;
        if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard', 'card-master'].includes(index)) {
            casterLevel += c.level;
        } else if (['paladin', 'ranger'].includes(index)) {
            casterLevel += Math.floor(c.level / 2);
        } else if (index === 'artificer') {
            casterLevel += Math.ceil(c.level / 2);
        } else if (c.subclass && ['arcane-trickster', 'eldritch-knight'].includes(c.subclass.index)) {
            casterLevel += Math.floor(c.level / 3);
        }
    });

    const slots: Record<number, { max: number, current: number }> = {};
    const slotTable: Record<number, number[]> = {
        1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2],
        11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1],
        16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    };

    if (casterLevel > 0) {
        const levelSlots = slotTable[Math.min(casterLevel, 20)] || [];
        levelSlots.forEach((max, i) => {
            slots[i + 1] = { max, current: max };
        });
    }

    const warlock = classes.find(c => c.definition.index === 'warlock');
    if (warlock) {
        const pactSlots: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3, 13: 3, 14: 3, 15: 3, 16: 3, 17: 4, 18: 4, 19: 4, 20: 4 };
        const pactLevel: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5 };
        const level = pactLevel[warlock.level];
        const count = pactSlots[warlock.level];
        slots[level] = { 
            max: (slots[level]?.max || 0) + count, 
            current: (slots[level]?.current || 0) + count 
        };
    }
    return slots;
};

export const getPointBuyCost = (score: number): number => {
    const costs: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costs[score] || 0;
};

export const getSpellsKnownCount = (characterClass: CharacterClass, abilities: AbilityScores, classFeatures: any[] = []): { cantrips: number; spells: number } => {
    const { definition, level } = characterClass;
    
    // Robust ability detection
    let abilityScore: AbilityName = 'int';
    if (definition.spellcasting?.spellcasting_ability.index) {
        abilityScore = definition.spellcasting.spellcasting_ability.index as AbilityName;
    } else {
        const index = definition.index;
        if (['sorcerer', 'bard', 'warlock', 'paladin', 'card-master'].includes(index)) abilityScore = 'cha';
        else if (['cleric', 'druid', 'ranger'].includes(index)) abilityScore = 'wis';
        else if (['wizard', 'artificer'].includes(index)) abilityScore = 'int';
    }

    const mod = calculateModifier(abilities[abilityScore] || 10);

    let cantrips = 0;
    let spells = 0;

    switch (definition.index) {
        case 'bard':
            const bardCantrips = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
            const bardSpells = [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22];
            cantrips = bardCantrips[level - 1] || 0;
            spells = bardSpells[level - 1] || 0;
            break;
        case 'sorcerer':
            const sorcCantrips = [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
            const sorcSpells = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15];
            cantrips = sorcCantrips[level - 1] || 0;
            spells = sorcSpells[level - 1] || 0;
            break;
        case 'card-master':
            const cmCantrips = [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
            cantrips = cmCantrips[level - 1] || 0;
            spells = Math.max(1, mod + level);
            break;
        case 'ranger':
            const rangerSpells = [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
            cantrips = 0;
            spells = rangerSpells[level - 1] || 0;
            break;
        case 'warlock':
            const warlockCantrips = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
            const warlockSpells = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];
            cantrips = warlockCantrips[level - 1] || 0;
            spells = warlockSpells[level - 1] || 0;
            break;
        case 'wizard':
            const wizardCantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
            cantrips = wizardCantrips[level - 1] || 0;
            spells = Math.max(1, mod + level); // This is actually "prepared" for wizard
            break;
        case 'cleric':
        case 'druid':
            const clericCantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
            cantrips = clericCantrips[level - 1] || 0;
            spells = Math.max(1, mod + level);
            break;
        case 'paladin':
            cantrips = 0;
            spells = Math.max(1, mod + Math.floor(level / 2));
            break;
        case 'artificer':
            const artificerCantrips = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
            cantrips = artificerCantrips[level - 1] || 0;
            spells = Math.max(1, mod + Math.floor(level / 2));
            break;
        default:
            cantrips = 0;
            spells = 0;
    }

    // Apply bonuses from features (e.g. Thaumaturge)
    classFeatures.forEach(f => {
        f.effects?.forEach((e: any) => {
            if (e.type === 'spell_access') {
                // If it matches the class and level, add to count
                if ((!e.filter_class || e.filter_class.toLowerCase() === definition.index.toLowerCase()) && e.level !== undefined) {
                    if (e.level === 0) cantrips += (e.count || 1);
                    else spells += (e.count || 1);
                }
            }
        });
    });

    return { cantrips, spells };
};

export const getSpellDamageString = (spell: SpellDetail, characterLevel: number = 1, slotLevel: number = 1): string => {
    if (!spell.damage) return '';
    const damage = spell.damage;
    if (damage.damage_at_character_level) {
        const levels = Object.keys(damage.damage_at_character_level).map(Number).sort((a, b) => a - b).filter(lvl => lvl <= characterLevel);
        const highestLevel = levels[levels.length - 1];
        return damage.damage_at_character_level[highestLevel] || '';
    }
    if (damage.damage_at_slot_level) {
        return damage.damage_at_slot_level[slotLevel] || damage.damage_at_slot_level[spell.level] || '';
    }
    return '';
};

export const isSpell = (item: any): item is SpellDetail => {
    return item && 'school' in item;
};
