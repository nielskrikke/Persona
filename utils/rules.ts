
import { CharacterClass, AbilityScores, AbilityName, SpellDetail, CharacterState, FeatureEffect, CasterProfile, ResourceDefinition } from '@/types';

export const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
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

export const getPointBuyCost = (score: number): number => {
    const costs: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costs[score] || 0;
};

export const getEffectiveAbilities = (character: CharacterState): AbilityScores => {
    const abilities = { ...character.abilities };
    
    // 1. Racial bonuses. 2024 characters take ASIs from their background,
    // which are already folded into the stored base scores.
    if (character.abilitySource !== 'background') {
        character.race?.ability_bonuses?.forEach(b => {
            const stat = b.ability_score.index as AbilityName;
            if (abilities[stat] !== undefined) abilities[stat] += b.bonus;
        });
        character.subrace?.ability_bonuses?.forEach(b => {
            const stat = b.ability_score.index as AbilityName;
            if (abilities[stat] !== undefined) abilities[stat] += b.bonus;
        });
    }

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
        const appliesToAbility =
            m.type === 'bonus' || m.type === 'stat_bonus' || m.type === 'asi' || m.type === 'stat_bonus_attribute';

        if (!appliesToAbility) return;

        // Some feats store ability increases as `attributes: ['con']` + amount
        // (Durable, Actor) rather than target/stat.
        if (Array.isArray(m.attributes) && m.attributes.length > 0) {
            const amount = Number(m.value ?? m.amount ?? 0);
            m.attributes.forEach((stat: string) => {
                const key = String(stat).toLowerCase();
                if (key in abilities) abilities[key as AbilityName] += amount;
            });
            return;
        }

        if (targetStat in abilities) {
            const amount = Number(m.value || m.amount || 0);
            const cap = m.max !== undefined ? Number(m.max) : (m.type === 'bonus' && /ioun/i.test(String(m.name || '')) ? 20 : undefined);
            const next = abilities[targetStat as AbilityName] + amount;
            abilities[targetStat as AbilityName] = cap !== undefined ? Math.min(cap, next) : next;
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

/* ------------------------------------------------------------------------- */
/* Caster progression (data-driven)                                          */
/* ------------------------------------------------------------------------- */

const FULL_CASTER_SLOTS: Record<number, number[]> = {
    1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

const HALF_CASTER_SLOTS: Record<number, number[]> = {
    1: [2], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2], 10: [4, 3, 2],
    11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1], 15: [4, 3, 3, 2], 16: [4, 3, 3, 2],
    17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1], 19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2],
};

const THIRD_CASTER_SLOTS: Record<number, number[]> = {
    3: [2], 4: [2], 5: [2], 6: [2], 7: [4, 2], 8: [4, 2], 9: [4, 2], 10: [4, 3], 11: [4, 3], 12: [4, 3],
    13: [4, 3, 2], 14: [4, 3, 2], 15: [4, 3, 2], 16: [4, 3, 3], 17: [4, 3, 3], 18: [4, 3, 3], 19: [4, 3, 3, 1], 20: [4, 3, 3, 1],
};

const THIRD_CASTER_KNOWN: Record<number, { cantrips: number; spells: number }> = {
    3: { cantrips: 2, spells: 3 }, 4: { cantrips: 2, spells: 4 }, 5: { cantrips: 2, spells: 4 }, 6: { cantrips: 2, spells: 4 },
    7: { cantrips: 2, spells: 5 }, 8: { cantrips: 2, spells: 6 }, 9: { cantrips: 2, spells: 6 }, 10: { cantrips: 3, spells: 7 },
    11: { cantrips: 3, spells: 8 }, 12: { cantrips: 3, spells: 8 }, 13: { cantrips: 3, spells: 9 }, 14: { cantrips: 3, spells: 10 },
    15: { cantrips: 3, spells: 10 }, 16: { cantrips: 3, spells: 11 }, 17: { cantrips: 3, spells: 11 }, 18: { cantrips: 3, spells: 11 },
    19: { cantrips: 3, spells: 12 }, 20: { cantrips: 3, spells: 13 },
};

const PACT_SLOTS: Record<number, { level: number; count: number }> = {
    1: { level: 1, count: 1 }, 2: { level: 1, count: 2 }, 3: { level: 2, count: 2 }, 4: { level: 2, count: 2 },
    5: { level: 3, count: 2 }, 6: { level: 3, count: 2 }, 7: { level: 4, count: 2 }, 8: { level: 4, count: 2 },
    9: { level: 5, count: 2 }, 10: { level: 5, count: 2 }, 11: { level: 5, count: 3 }, 12: { level: 5, count: 3 },
    13: { level: 5, count: 3 }, 14: { level: 5, count: 3 }, 15: { level: 5, count: 3 }, 16: { level: 5, count: 3 },
    17: { level: 5, count: 4 }, 18: { level: 5, count: 4 }, 19: { level: 5, count: 4 }, 20: { level: 5, count: 4 },
};

/**
 * Returns the caster profile for a class/subclass combination.
 * Class caster wins; a subclass caster is used for EK/AT-style subclasses.
 * There are no class-name checks here.
 */
export const getCasterProfileFor = (characterClass: CharacterClass): CasterProfile | undefined => {
    const definition: any = characterClass.definition;
    const classCaster: CasterProfile | undefined = definition?.caster;
    if (classCaster && classCaster.type && classCaster.type !== 'none') return classCaster;

    const subclassCaster: CasterProfile | undefined = characterClass.subclass?.caster;
    if (subclassCaster && subclassCaster.type && subclassCaster.type !== 'none') return subclassCaster;

    // Legacy fallback for records that have not been migrated yet.
    const legacyAbility = definition?.spellcasting?.spellcasting_ability?.index;
    if (legacyAbility) return { type: 'full', ability: legacyAbility };
    return undefined;
};

const getCasterContribution = (profile: CasterProfile | undefined, level: number): number => {
    if (!profile) return 0;
    switch (profile.type) {
        case 'full':
        case 'custom':
            return level;
        case 'half':
            return Math.floor(level / 2);
        case 'third':
            return Math.floor(level / 3);
        case 'artificer':
            return Math.ceil(level / 2);
        case 'pact':
        case 'none':
        default:
            return 0;
    }
};

const getClassSlotTable = (characterClass: CharacterClass): number[] => {
    const definition: any = characterClass.definition;
    const level = characterClass.level;
    const row = definition?.level_table?.find((item: any) => item.level === level);
    const customSlots = row?.class_specific?.spell_slots;
    if (Array.isArray(customSlots)) return customSlots;

    const profile = getCasterProfileFor(characterClass);
    if (!profile) return [];
    switch (profile.type) {
        case 'full':
        case 'custom':
            return FULL_CASTER_SLOTS[level] || [];
        case 'half':
        case 'artificer':
            return HALF_CASTER_SLOTS[level] || [];
        case 'third':
            return THIRD_CASTER_SLOTS[level] || [];
        case 'pact':
        case 'none':
        default:
            return [];
    }
};

const tableToSlots = (table: number[]): Record<number, { max: number; current: number }> => {
    const slots: Record<number, { max: number; current: number }> = {};
    table.forEach((max, index) => {
        if (max > 0) slots[index + 1] = { max, current: max };
    });
    return slots;
};

export const getHpPerLevelBonus = (character: CharacterState): number => {
    let bonus = 0;
    const collect = (effects: any[]) => {
        (effects || []).forEach(effect => {
            if (!effect) return;
            const target = String(effect.target || effect.stat || '').toLowerCase();
            if ((effect.type === 'stat_bonus' || effect.type === 'bonus') && target === 'hp_per_level') {
                bonus += Number(effect.value || 0);
            }
        });
    };
    const collectFeature = (entry: any) => {
        if (Array.isArray(entry?.effects) && entry.effects.length > 0) collect(entry.effects);
        if (Array.isArray(entry?.modifiers) && entry.modifiers.length > 0) collect(entry.modifiers);
    };

    character.race?.traits?.forEach(collectFeature);
    character.subrace?.traits?.forEach(collectFeature);
    character.classes?.forEach(characterClass => {
        (characterClass.definition as any)?.feature_details?.forEach((feature: any) => {
            if ((feature.level || 0) <= characterClass.level) collect(feature.effects || []);
        });
        (characterClass.subclass as any)?.feature_details?.forEach((feature: any) => {
            if ((feature.level || 0) <= characterClass.level) collect(feature.effects || []);
        });
    });
    character.classFeatures?.forEach(collectFeature);
    character.feats?.forEach(collectFeature);
    character.inventory?.forEach(item => {
        if (item.equipped && (!item.requires_attunement || item.attuned)) {
            if (Array.isArray((item as any).effects) && (item as any).effects.length > 0) collect((item as any).effects);
            if (Array.isArray(item.modifiers) && item.modifiers.length > 0) collect(item.modifiers);
        }
    });
    return bonus;
};

/**
 * Computes max HP from the class hit dice, effective Constitution, and
 * hp_per_level effects. Use this when creating a character or changing
 * abilities/classes; do not silently overwrite imported max HP on load.
 */
export const getFlatMaxHpBonus = (character: CharacterState): number => {
    let bonus = 0;
    const collect = (effects: any[]) => {
        (effects || []).forEach(effect => {
            if (!effect) return;
            const target = String(effect.target || effect.stat || '').toLowerCase();
            if ((effect.type === 'stat_bonus' || effect.type === 'bonus') && (target === 'max_hp' || target === 'hp')) {
                bonus += Number(effect.value || 0);
            }
        });
    };

    const collectFeature = (entry: any) => {
        if (Array.isArray(entry?.effects) && entry.effects.length > 0) collect(entry.effects);
        if (Array.isArray(entry?.modifiers) && entry.modifiers.length > 0) collect(entry.modifiers);
    };
    character.race?.traits?.forEach(collectFeature);
    character.subrace?.traits?.forEach(collectFeature);
    character.classes?.forEach(characterClass => {
        (characterClass.definition as any)?.feature_details?.forEach((feature: any) => {
            if ((feature.level || 0) <= characterClass.level) collect(feature.effects || []);
        });
        (characterClass.subclass as any)?.feature_details?.forEach((feature: any) => {
            if ((feature.level || 0) <= characterClass.level) collect(feature.effects || []);
        });
    });
    character.classFeatures?.forEach(collectFeature);
    character.feats?.forEach(collectFeature);
    character.inventory?.forEach(item => {
        if (item.equipped && (!item.requires_attunement || item.attuned)) {
            if (Array.isArray((item as any).effects) && (item as any).effects.length > 0) collect((item as any).effects);
            if (Array.isArray(item.modifiers) && item.modifiers.length > 0) collect(item.modifiers);
        }
    });
    return bonus;
};

export const calculateMaxHp = (character: CharacterState): number => {
    const conModifier = calculateModifier(getEffectiveAbilities(character).con);
    let hp = 0;
    let levelTotal = 0;

    (character.classes || []).forEach((characterClass, index) => {
        const level = Number(characterClass.level || 0);
        if (level <= 0) return;
        levelTotal += level;
        const hitDie = Number((characterClass.definition as any)?.hit_die || 8);
        const average = Math.floor(hitDie / 2) + 1;
        if (index === 0) {
            hp += hitDie + Math.max(0, level - 1) * average;
        } else {
            hp += level * average;
        }
        hp += level * conModifier;
    });

    const totalLevel = levelTotal || character.level || 1;
    hp += getHpPerLevelBonus(character) * totalLevel;
    hp += getFlatMaxHpBonus(character);
    return Math.max(1, hp);
};

export const isPreparedCaster = (definitionOrIndex: any): boolean => {
    if (!definitionOrIndex) return false;
    if (typeof definitionOrIndex === 'string') return false;
    return !!definitionOrIndex.caster && definitionOrIndex.caster.type !== 'none';
};

export const getSubclassLevel = (definition: any): number => {
    if (definition && typeof definition.subclass_level === 'number') return definition.subclass_level;
    return 3;
};

export const getSubclassLabel = (definition: any): string => {
    if (definition && definition.subclass_label) return definition.subclass_label;
    return 'Subclass';
};

export const getSpellSlots = (classes: CharacterClass[]): Record<number, { max: number; current: number }> => {
    const slots: Record<number, { max: number; current: number }> = {};

    if (classes.length === 1) {
        const characterClass = classes[0];
        const profile = getCasterProfileFor(characterClass);
        if (!profile || profile.type === 'none') return slots;

        if (profile.type === 'pact') {
            const pact = PACT_SLOTS[characterClass.level];
            if (pact) slots[pact.level] = { max: pact.count, current: pact.count };
            return slots;
        }

        return tableToSlots(getClassSlotTable(characterClass));
    }

    let casterLevel = 0;
    let pactLevel = 0;
    let pactCount = 0;

    classes.forEach(characterClass => {
        const profile = getCasterProfileFor(characterClass);
        if (!profile || profile.type === 'none') return;
        if (profile.type === 'pact') {
            const pact = PACT_SLOTS[characterClass.level];
            if (pact) { pactLevel = Math.max(pactLevel, pact.level); pactCount = Math.max(pactCount, pact.count); }
            return;
        }
        casterLevel += getCasterContribution(profile, characterClass.level);
    });

    if (casterLevel > 0) {
        Object.assign(slots, tableToSlots(FULL_CASTER_SLOTS[Math.min(casterLevel, 20)] || []));
    }
    if (pactLevel > 0) {
        slots[pactLevel] = {
            max: (slots[pactLevel]?.max || 0) + pactCount,
            current: (slots[pactLevel]?.current || 0) + pactCount,
        };
    }
    return slots;
};

export const mergeSpellSlotCurrents = (
    next: Record<number, { max: number; current: number }>,
    previous?: Record<number, { max: number; current: number }>
): Record<number, { max: number; current: number }> => {
    const merged: Record<number, { max: number; current: number }> = {};
    Object.entries(next).forEach(([levelKey, slot]) => {
        const level = Number(levelKey);
        const old = previous?.[level];
        merged[level] = {
            max: slot.max,
            current: old ? Math.min(old.current, slot.max) : slot.max,
        };
    });
    return merged;
};

export const hasUiWidget = (character: CharacterState, widget: string): boolean =>
    (character.classes || []).some(characterClass => {
        const classWidgets = (characterClass.definition as any)?.ui?.widgets || [];
        const subclassWidgets = (characterClass.subclass as any)?.ui?.widgets || [];
        return classWidgets.includes(widget) || subclassWidgets.includes(widget);
    });

export const getClassWithUiWidget = (character: CharacterState, widget: string): CharacterClass | undefined =>
    (character.classes || []).find(characterClass => {
        const classWidgets = (characterClass.definition as any)?.ui?.widgets || [];
        const subclassWidgets = (characterClass.subclass as any)?.ui?.widgets || [];
        return classWidgets.includes(widget) || subclassWidgets.includes(widget);
    });

export const getMaxSpellLevelForClass = (characterClass: CharacterClass): number => {
    const slots = getSpellSlots([characterClass]);
    const levels = Object.keys(slots).map(Number).filter(level => (slots[level]?.max || 0) > 0);
    return levels.length > 0 ? Math.max(...levels) : 0;
};

export const getSpellAbilityForClass = (characterClass: CharacterClass | undefined): AbilityName | undefined => {
    if (!characterClass) return undefined;
    const profile = getCasterProfileFor(characterClass);
    if (profile?.ability) return profile.ability;
    const legacy = (characterClass.definition as any)?.spellcasting?.spellcasting_ability?.index;
    return legacy as AbilityName | undefined;
};

export const getSpellsKnownCount = (characterClass: CharacterClass, abilities: AbilityScores, classFeatures: any[] = []): { cantrips: number; spells: number } => {
    const definition: any = characterClass.definition;
    const level = characterClass.level;
    const row = definition?.level_table?.find((item: any) => item.level === level);
    const classSpecific = row?.class_specific || {};
    const profile = getCasterProfileFor(characterClass);

    let cantrips = typeof classSpecific.cantrips === 'number' ? classSpecific.cantrips : 0;
    let spells = typeof classSpecific.prepared === 'number' ? classSpecific.prepared : 0;

    if (typeof classSpecific.prepared !== 'number' && profile && profile.type !== 'none') {
        if (profile.type === 'third') {
            const known = THIRD_CASTER_KNOWN[level] || { cantrips: 0, spells: 0 };
            if (typeof classSpecific.cantrips !== 'number') cantrips = known.cantrips;
            spells = known.spells;
        } else {
            const abilityName = profile.ability
                || definition?.spellcasting?.spellcasting_ability?.index
                || 'int';
            const modifier = calculateModifier(abilities[abilityName as AbilityName] || 10);
            if (profile.type === 'half' || profile.type === 'artificer') {
                spells = Math.max(1, modifier + Math.floor(level / 2));
            } else {
                spells = Math.max(1, modifier + level);
            }
        }
    }

    // Only explicit "choose N spells" features add to the limit. Fixed-granted
    // spells (domain spells, patron spells, a specific spell_access) are always
    // prepared and must not inflate the prepared count.
    const allowedSources = new Set([definition?.name, characterClass.subclass?.name].filter(Boolean));
    classFeatures.forEach(feature => {
        if (feature?.source && !allowedSources.has(feature.source)) return;
        feature?.effects?.forEach((effect: any) => {
            if (effect.type !== 'spell_access') return;
            if (effect.spell) return;
            if (typeof effect.level !== 'number') return;
            if (effect.filter_class && String(effect.filter_class).toLowerCase() !== String(definition?.index).toLowerCase()) return;
            if (effect.level === 0) cantrips += (effect.count || 1);
            else spells += (effect.count || 1);
        });
    });

    return { cantrips, spells };
};

export const getResourceMax = (
    resource: ResourceDefinition,
    classLevel: number,
    abilities: AbilityScores,
    totalLevel: number
): number => {
    const descriptor: any = resource.max || {};
    switch (descriptor.type) {
        case 'fixed':
            return Number(descriptor.value || 0);
        case 'roll': {
            const match = String(descriptor.value || '').match(/^(\d+)d(\d+)(?:\+(\d+))?$/i);
            return match ? Number(match[1]) * Number(match[2]) + Number(match[3] || 0) : 0;
        }
        case 'level':
            return classLevel * Number(descriptor.multiplier || 1);
        case 'ability': {
            const ability = descriptor.ability || 'int';
            return Math.max(Number(descriptor.min ?? 1), calculateModifier(abilities[ability as AbilityName] || 10) + Number(descriptor.bonus || 0));
        }
        case 'proficiency':
            return calculateProficiency(totalLevel);
        case 'table':
            return Number(descriptor.values?.[classLevel - 1] || 0);
        case 'formula':
        default:
            return 0;
    }
};

export interface CharacterResource {
    key: string;
    name: string;
    reset: 'short' | 'long';
    max: number;
    source?: string;
    regain?: string;
    itemId?: string;
    sourceType?: 'item';
}

/**
 * Resources declared on the class/subclass documents. No CLASS_FEATURES lookup
 * and no class-name checks. A resource with max 0 at the current level is not
 * included (e.g. Wild Shape before level 2, Stroke of Luck before 20).
 */
export const getResourceDefinitions = (character: CharacterState): CharacterResource[] => {
    const abilities = getEffectiveAbilities(character);
    const resources = new Map<string, CharacterResource>();

    const raceDefinitions: ResourceDefinition[] = [
        ...((character.race as any)?.resources || []),
        ...((character.subrace as any)?.resources || []),
    ];
    raceDefinitions.forEach(resource => {
        if (resource.level && character.level < resource.level) return;
        const max = getResourceMax(resource, character.level, abilities, character.level);
        if (max > 0) resources.set(resource.key, {
            key: resource.key,
            name: resource.name,
            reset: resource.reset,
            max,
            source: resource.source || character.race?.name || character.subrace?.name,
        });
    });

    character.inventory?.forEach(item => {
        if (!item.equipped || (item.requires_attunement && !item.attuned)) return;
        ((item as any).resources || []).forEach((resource: any) => {
            if (/stored[- ]?spell[- ]?levels?/i.test(String(resource.name || resource.key || ''))) return;
            const max = getResourceMax(resource, character.level, abilities, character.level);
            if (max <= 0) return;
            const name = `${item.name}: ${resource.name || resource.key}`;
            resources.set(name, {
                key: resource.key,
                name,
                reset: resource.reset === 'short' ? 'short' : 'long',
                max,
                source: item.name,
                regain: resource.regain,
                itemId: item.id,
                sourceType: 'item',
            });
        });
    });

    character.feats?.forEach(feat => {
        ((feat as any).resources || []).forEach((resource: any) => {
            const max = getResourceMax(resource, character.level, abilities, character.level);
            if (max <= 0) return;
            resources.set(resource.name, {
                key: resource.key,
                name: resource.name,
                reset: resource.reset === 'short' ? 'short' : 'long',
                max,
                source: feat.name,
                regain: resource.regain,
            });
        });
    });

    character.classes?.forEach(characterClass => {
        const definitions: ResourceDefinition[] = [
            ...((characterClass.definition as any)?.resources || []),
            ...((characterClass.subclass as any)?.resources || []),
        ];
        definitions.forEach(resource => {
            if (resource.level && characterClass.level < resource.level) return;
            const max = getResourceMax(resource, characterClass.level, abilities, character.level);
            if (max <= 0) return;
            const reset = /bardic inspiration/i.test(resource.name) && character.level >= 5 ? 'short' : resource.reset;
            resources.set(resource.name, {
                key: resource.key,
                name: resource.name,
                reset,
                max,
                source: resource.source,
            });
        });
    });

    return Array.from(resources.values());
};

const primaryDamagePart = (value: string): string => String(value || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim();


const UPCAST_NUMBERS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

export const getSpellUpcastCount = (spell: SpellDetail, castLevel: number): { count: number; base: number; unit: string } | null => {
    if (!spell) return null;
    const config: any = (spell as any).scaling;
    if (config && Number(config.targetsPerSlot) > 0) {
        const base = Math.max(1, Number(config.baseTargets) || 1);
        const levelsAbove = Math.max(0, Number(castLevel) - Number(spell.level || 0));
        return { count: base + Number(config.targetsPerSlot) * levelsAbove, base, unit: config.targetUnit || 'targets' };
    }
    const text = (spell.higher_level || []).join(' ');
    if (!text) return null;
    const additional = text.match(/(one|two|three|four|five|six|\d+)\s+(?:additional|more)\s+(rays?|darts?|beams?|creatures?|targets?|undead|beasts?|humanoids?)/i);
    const increases = text.match(/number[^.]*?increases by (one|two|three|\d+)/i);
    const baseMatch = text.match(/up to (one|two|three|four|five|six|\d+)\s+willing creatures/i);
    let base = 1;
    let unit = 'targets';
    let increment = 1;
    if (additional) {
        increment = UPCAST_NUMBERS[additional[1].toLowerCase()] || Number(additional[1]) || 1;
        const rawUnit = additional[2].toLowerCase();
        unit = rawUnit.endsWith('s') ? rawUnit : `${rawUnit}s`;
        if (unit.startsWith('ray')) base = 3;
        else if (unit.startsWith('dart')) base = 3;
        else if (unit.startsWith('beam')) base = 1;
        else if (unit.startsWith('undead')) base = 1;
    } else if (increases) {
        increment = UPCAST_NUMBERS[increases[1].toLowerCase()] || Number(increases[1]) || 1;
        unit = 'targets';
    } else if (baseMatch) {
        base = UPCAST_NUMBERS[baseMatch[1].toLowerCase()] || Number(baseMatch[1]) || 1;
        increment = base;
        unit = 'creatures';
    } else {
        return null;
    }
    const levelsAbove = Math.max(0, castLevel - Number(spell.level || 0));
    return { count: base + increment * levelsAbove, base, unit };
};

export const getSpellCastLevel = (character: CharacterState, spell: SpellDetail): number => {
    if ((spell as any)?.itemCastLevel) return Number((spell as any).itemCastLevel);
    if (!spell || Number(spell.level) === 0) return Math.max(1, Number(character.level) || 1);
    const available = Object.entries(character.spellSlots || {})
        .map(([level, slots]) => ({ level: Number(level), ...(slots as any) }))
        .filter(slot => Number(slot.max) > 0 && Number(slot.current) > 0 && slot.level >= Number(spell.level))
        .sort((a, b) => a.level - b.level);
    return available[0]?.level || Number(spell.level);
};

export const CONDITION_LABELS = ['Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];

export const getConditionLabelsFromText = (text: string): string[] => {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    // Protection, immunity, removal, and object-state text should not assign
    // a condition to the target (e.g. Protection from Evil and Good, Forcecage).
    if (/(?:can(?:'|no)t|can not|cannot)\s+be\s+(?:charmed|frightened|poisoned|prone|restrained|stunned|paralyzed|petrified|blinded|deafened|invisible|incapacitated|grappled)|protected against|protection from|immune to|no longer|suppress(?:es|ed)?|prevents? .*condition|cage is invisible|prison .*invisible/i.test(clean)) return [];
    return CONDITION_LABELS.filter(label => {
        const lower = label.toLowerCase();
        const affected = new RegExp(`\\b(?:target|creature|it|they)\\b[^.!?]{0,140}\\b(?:is|are|becomes?|remains?|falls?|has|have)\\b[^.!?]{0,80}\\b${lower}\\b`, 'i');
        const save = new RegExp(`\\b(?:must|fails?|failing|failure)\\b[^.!?]{0,140}\\b(?:save|saving throw)\\b[^.!?]{0,140}\\b${lower}\\b`, 'i');
        const condition = new RegExp(`\\b${lower}\\b[^.!?]{0,40}\\bconditions?\\b`, 'i');
        return affected.test(clean) || save.test(clean) || condition.test(clean);
    });
};

export const getSpellDamageString = (spell: SpellDetail, characterLevel: number = 1, slotLevel: number = 1): string => {
    const damage: any = spell.damage || (spell as any).heal_at_slot_level;
    if (!damage) return '';
    if (damage.damage_at_character_level) {
        const levels = Object.keys(damage.damage_at_character_level).map(Number).sort((a, b) => a - b).filter(lvl => lvl <= characterLevel);
        const highestLevel = levels[levels.length - 1];
        return primaryDamagePart(damage.damage_at_character_level[highestLevel] || '');
    }
    if (damage.damage_at_slot_level || (spell as any).heal_at_slot_level) {
        const table = damage.damage_at_slot_level || (spell as any).heal_at_slot_level;
        const base = primaryDamagePart(table[slotLevel] || table[spell.level] || '');
        if (String(spell.name).toLowerCase() === 'magic missile') {
            const info = getSpellUpcastCount(spell, slotLevel);
            const match = base.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i);
            if (info && match) {
                const dice = Number(match[1]) * info.count;
                const flat = Number(match[3] || 0) * info.count;
                return `${dice}d${match[2]}${flat ? `+${flat}` : ''}`;
            }
        }
        const scalingConfig: any = (spell as any).scaling;
        const perSlot = typeof scalingConfig?.per_slot === 'string' ? scalingConfig.per_slot : (typeof scalingConfig === 'string' ? scalingConfig : null);
        const levelDelta = Math.max(0, Number(slotLevel) - Number(spell.level || 0));
        if (perSlot && levelDelta > 0) {
            const per = String(perSlot).trim();
            const dice = per.match(/^(\d+)d(\d+)$/i);
            const scaled = dice ? `${Number(dice[1]) * levelDelta}d${dice[2]}` : per;
            return `${base}+${scaled}`;
        }
        return base;
    }
    return '';
};

export const getSpellSecondaryDamageString = (spell: SpellDetail, characterLevel: number = 1, slotLevel: number = 1): string => {
    if (spell.secondary_damage) return primaryDamagePart(spell.secondary_damage);
    const damage = spell.damage;
    if (!damage) return '';
    const raw = damage.damage_at_character_level
        ? damage.damage_at_character_level[Object.keys(damage.damage_at_character_level).map(Number).sort((a, b) => a - b).filter(lvl => lvl <= characterLevel).pop() || 1] || ''
        : damage.damage_at_slot_level?.[slotLevel] || damage.damage_at_slot_level?.[spell.level] || '';
    const match = String(raw).match(/\(([^)]+)\)/);
    return match ? primaryDamagePart(match[1]) : '';
};

export const isSpell = (item: any): item is SpellDetail => {
    return item && 'school' in item;
};

export const isFeatAvailableForLevel = (feat: any, level: number): boolean => {
    const prerequisite = String(feat?.prerequisite || '').toLowerCase();
    const description = (Array.isArray(feat?.desc) ? feat.desc.join(' ') : String(feat?.desc || '')).toLowerCase();
    const text = `${prerequisite} ${description}`;

    if ((text.includes('epic boon') || text.includes('epic boon')) && level < 19) return false;
    if (text.includes('origin feat') && level > 1) return false;

    const sourceMatch = text.match(/prerequisite:\s*level\s+(\d+)/i) || prerequisite.match(/level\s+(\d+)/i);
    if (sourceMatch && level < Number(sourceMatch[1])) return false;
    const genericLevel = description.match(/level\s+(\d+)\s*\+/i);
    if (genericLevel && level < Number(genericLevel[1])) return false;
    return true;
};

export const appendMinDie = (formula: string, minimum: number): string => {
    if (!minimum || minimum <= 1) return formula;
    return String(formula || '').replace(/(\d*)d(\d+)/gi, (match) => `${match}min${minimum}`);
};

export const resolveDamageFormula = (formula: string, modifier: number = 0, hitDie: number = 8): string => {
    return String(formula || '')
        .replace(/\bHD\b/gi, `1d${Number(hitDie) || 8}`)
        .replace(/\bMOD\b/gi, String(Number(modifier) || 0));
};



export const formatResourceName = (name: string, level: number): string => {
    const bardicSteps: [number, string][] = [[1, 'd6'], [5, 'd8'], [10, 'd10'], [15, 'd12']];
    if (/^bardic inspiration/i.test(name)) {
        const die = [...bardicSteps].reverse().find(([threshold]) => level >= threshold)?.[1] || 'd6';
        return `Bardic Inspiration (${die})`;
    }
    const progression = String(name).match(/\((.*?)\)/);
    if (progression && /d\d+/i.test(progression[1])) {
        const baseDie = progression[1].match(/d\d+/i)?.[0] || '';
        let current = baseDie.toLowerCase();
        Array.from(progression[1].matchAll(/d(\d+)\s+at\s+(\d+)/gi)).forEach(match => {
            if (level >= Number(match[2])) current = `d${match[1]}`;
        });
        return `${String(name).slice(0, progression.index).trim()} (${current})`;
    }
    if (progression && /→/.test(progression[1])) return String(name).slice(0, progression.index).trim();
    return name;
};

export const getChoiceCount = (choice: any, level: number): number => {
    const byLevel = choice?.count_by_level;
    if (byLevel && typeof byLevel === 'object') {
        const keys = Object.keys(byLevel).map(Number).filter(key => key <= level).sort((a, b) => b - a);
        if (keys.length > 0) return Number(byLevel[keys[0]]) || Number(choice.count || 1);
    }
    return Number(choice?.count || 1);
};

export const getWeaponMasteryEffect = (mastery: string, proficiency: number, strMod: number, dexMod: number): string => {
    const key = String(mastery || '').toLowerCase();
    const ability = Math.max(strMod, dexMod);
    switch (key) {
        case 'cleave': return 'On a hit, make one extra melee attack against a second creature within 5 feet (once per turn).';
        case 'graze': return `On a miss, deal ${Math.max(0, ability)} damage of the weapon's type.`;
        case 'nick': return 'Make the extra Light weapon attack as part of the Attack action instead of a Bonus Action (once per turn).';
        case 'push': return 'On a hit, push the target up to 10 feet away.';
        case 'sap': return 'On a hit, the target has Disadvantage on its next attack roll before your next turn.';
        case 'slow': return 'On a hit, reduce the target’s Speed by 10 feet until your next turn.';
        case 'topple': return `On a hit, CON save DC ${8 + proficiency + ability} or the target has the Prone condition.`;
        case 'vex': return 'On a hit, you have Advantage on your next attack against that target before your next turn.';
        default: return '';
    }
};

export const getWeaponMasteryData = (mastery: string, proficiency: number, strMod: number, dexMod: number): {
    name: string;
    description: string;
    saveAbility?: string;
    saveDC?: number;
    missDamage?: number;
    extraAttack?: boolean;
} => {
    const key = String(mastery || '').toLowerCase();
    const ability = Math.max(strMod, dexMod);
    const descriptions: Record<string, string> = {
        cleave: 'On a hit, make one extra melee attack against a second creature within 5 feet (once per turn).',
        graze: `On a miss, deal ${Math.max(0, ability)} damage of the weapon's type.`,
        nick: 'Make the extra Light weapon attack as part of the Attack action instead of a Bonus Action (once per turn).',
        push: 'On a hit, push the target up to 10 feet away.',
        sap: 'On a hit, the target has Disadvantage on its next attack roll before your next turn.',
        slow: 'On a hit, reduce the target’s Speed by 10 feet until your next turn.',
        topple: `On a hit, CON save DC ${8 + proficiency + ability} or the target has the Prone condition.`,
        vex: 'On a hit, you have Advantage on your next attack against that target before your next turn.',
    };
    return {
        name: mastery,
        description: descriptions[key] || '',
        saveAbility: key === 'topple' ? 'CON' : undefined,
        saveDC: key === 'topple' ? 8 + proficiency + ability : undefined,
        missDamage: key === 'graze' ? Math.max(0, ability) : undefined,
        extraAttack: key === 'cleave' || key === 'nick',
    };
};

export const isFeatAvailableForCharacter = (feat: any, character: CharacterState): boolean => {
    if (!isFeatAvailableForLevel(feat, character.level)) return false;
    const requirements = String(feat?.prerequisite || '').toLowerCase();
    const text = `${requirements} ${Array.isArray(feat?.desc) ? feat.desc.join(' ') : (feat?.desc || '')}`.toLowerCase();
    const race = String(character.race?.name || character.race?.index || '').toLowerCase();
    const classDefinitions = (character.classes || []).map(entry => entry.definition as any);
    const hasHeavyArmor = classDefinitions.some(definition =>
        [...(definition.proficiencies || []), ...(definition.armor_proficiencies || [])]
            .some((armor: any) => /heavy/i.test(typeof armor === 'string' ? armor : armor.name || ''))
    );
    const hasSpellcasting = classDefinitions.some(definition => definition.caster && definition.caster.type !== 'none')
        || classDefinitions.some(definition => definition.spellcasting);

    if (/elf or half-elf/.test(text) && !/elf/.test(race)) return false;
    if (/heavy armor (training|proficiency)/.test(requirements) && !hasHeavyArmor) return false;
    if (/(spellcasting|pact magic)/.test(requirements) && !hasSpellcasting) return false;

    const abilities: Record<string, string> = {
        strength: 'str', dexterity: 'dex', constitution: 'con',
        intelligence: 'int', wisdom: 'wis', charisma: 'cha',
    };
    for (const [name, key] of Object.entries(abilities)) {
        const match = requirements.match(new RegExp(`${name}\\s+(\\d+)`));
        if (match && Number(character.abilities[key as keyof typeof character.abilities] || 0) < Number(match[1])) return false;
    }
    return true;
};
