import { CharacterClass } from '../types';

const norm = (value: any) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// 2024 multiclass training. Proficiencies are matched against the class
// definition by name; unknown/homebrew classes fall back to their full list.
export const MULTICLASS_PROFICIENCIES: Record<string, string[]> = {
    artificer: ['Light Armor', 'Medium Armor', 'Shields', "Thieves' Tools", "Tinker's Tools"],
    barbarian: ['Shields', 'Simple Weapons', 'Martial Weapons'],
    bard: ['Light Armor'],
    cleric: ['Light Armor', 'Medium Armor', 'Shields'],
    druid: ['Light Armor', 'Medium Armor', 'Shields'],
    fighter: ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'],
    monk: ['Simple Weapons', 'Martial Weapons with the Light property'],
    paladin: ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'],
    ranger: ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'],
    rogue: ['Light Armor', "Thieves' Tools"],
    sorcerer: [],
    warlock: ['Light Armor', 'Simple Weapons'],
    wizard: [],
};

// Multiclass choice allowances. Starting classes still use their full
// definition choices; later classes use these counts.
export const MULTICLASS_CHOICE_COUNTS: Record<string, Record<string, number>> = {
    bard: { 'bard-proficiency-0': 1, 'bard-proficiency-1': 1 },
    rogue: { 'rogue-proficiency-0': 1, 'rogue-weapon-mastery': 2 },
    ranger: { 'ranger-proficiency-0': 1, 'ranger-weapon-mastery': 2 },
    barbarian: { 'barbarian-weapon-mastery': 2 },
    fighter: { 'fighter-weapon-mastery': 3 },
    paladin: { 'paladin-weapon-mastery': 2 },
};

export const getClassProficiencies = (characterClass: CharacterClass | any, isStarting: boolean): any[] => {
    const definition = characterClass?.definition || characterClass || {};
    const all = Array.isArray(definition.proficiencies) ? definition.proficiencies : [];
    if (isStarting) return all;
    const explicit = definition.multiclass?.proficiencies;
    if (Array.isArray(explicit)) {
        return explicit.map((name: string) => all.find((entry: any) => norm(entry.name) === norm(name)) || { name, index: norm(name).replace(/\s+/g, '-') });
    }
    const grantedNames = MULTICLASS_PROFICIENCIES[String(definition.index || '').toLowerCase()];
    if (!grantedNames) return [];
    return grantedNames.map(name => all.find((entry: any) => norm(entry.name) === norm(name)) || { name, index: norm(name).replace(/\s+/g, '-') });
};

export const getClassChoiceCount = (
    definitionIndex: string,
    choiceId: string,
    level: number,
    isStarting: boolean,
    fallback: number,
    definition?: any,
): number => {
    if (isStarting) return fallback;
    const explicit = definition?.multiclass?.choices;
    if (explicit && Object.prototype.hasOwnProperty.call(explicit, choiceId)) return Number(explicit[choiceId]) || 0;
    return MULTICLASS_CHOICE_COUNTS[String(definitionIndex || '').toLowerCase()]?.[choiceId] ?? 0;
};

export const isToolProficiency = (name: string): boolean => /tools?$|instrument|gaming set|kit$/i.test(String(name || ''));
