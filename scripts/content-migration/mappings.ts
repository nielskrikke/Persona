import { ARTISAN_TOOLS, STANDARD_LANGUAGES } from '../../data/constants';
import { SKILL_LIST } from '../../utils/rules';
import { inferOptionEffects } from './legacyInferEffects';
import { ARROWSMITH_ARROWS, METAMAGIC_OPTIONS, PICK_A_CARD_TABLE, WARLOCK_INVOCATIONS } from './legacyOptions';

/* ------------------------------------------------------------------------- */
/* Small helpers                                                             */
/* ------------------------------------------------------------------------- */

export const stableStringify = (value: any): string => {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
};

export const dedupe = <T>(items: T[], key: (item: T) => string): T[] => {
    const seen = new Set<string>();
    return items.filter(item => {
        const k = key(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
};

export const mergeEffects = (...lists: any[][]): any[] => dedupe(
    lists.flat().filter(Boolean),
    (e: any) => stableStringify(e)
);

const table = (values: number[]) => ({ type: 'table' as const, values });
const ability = (abilityName: string, min = 1) => ({ type: 'ability' as const, ability: abilityName, min });
const fixed = (value: number) => ({ type: 'fixed' as const, value });
const perLevel = (multiplier: number) => ({ type: 'level' as const, multiplier });
const proficiency = () => ({ type: 'proficiency' as const });

const extraAttack: any[] = [{ type: 'extra_attack', mode: 'set', value: 2, name: 'Extra Attack' }];

const feature = (name: string, description: string) => ({ type: 'feature', name, description });
const action = (name: string, description: string) => ({ type: 'action', name, description });
const bonusAction = (name: string, description: string) => ({ type: 'bonus_action', name, description });
const reaction = (name: string, description: string) => ({ type: 'reaction', name, description });

const prof = (target: string, category: 'skill' | 'tool' | 'armor' | 'weapon' | 'save' = 'skill') =>
    ({ type: 'proficiency', target, category });

const resistance = (value: string) => ({ type: 'resistance', value, damage_type: value });

/* ------------------------------------------------------------------------- */
/* Caster profiles                                                           */
/* ------------------------------------------------------------------------- */

export type CasterProfile = {
    type: 'full' | 'half' | 'third' | 'pact' | 'artificer' | 'custom' | 'none';
    ability?: string;
    rounding?: 'up' | 'down';
    note?: string;
};

export const STANDARD_CASTERS: Record<string, CasterProfile> = {
    bard: { type: 'full', ability: 'cha' },
    cleric: { type: 'full', ability: 'wis' },
    druid: { type: 'full', ability: 'wis' },
    sorcerer: { type: 'full', ability: 'cha' },
    wizard: { type: 'full', ability: 'int' },
    warlock: { type: 'pact', ability: 'cha' },
    paladin: { type: 'half', ability: 'cha' },
    ranger: { type: 'half', ability: 'wis' },
    artificer: { type: 'artificer', ability: 'int' },
    'card-master': { type: 'custom', ability: 'cha', note: 'Uses level_table.class_specific.spell_slots' },
    'blood-hunter': { type: 'none' },
    gunslinger: { type: 'none' },
    pugilist: { type: 'none' },
    arrowsmith: { type: 'none' },
};

export const SUBCLASS_CASTERS: Record<string, CasterProfile> = {
    'eldritch-knight': { type: 'third', ability: 'int' },
    'arcane-trickster': { type: 'third', ability: 'int' },
};

export const buildCaster = (data: any): CasterProfile => {
    if (data.caster && data.caster.type) return data.caster;
    if (STANDARD_CASTERS[data.index]) return STANDARD_CASTERS[data.index];

    const abilityName = data.spellcasting?.spellcasting_ability?.index;
    if (!abilityName) return { type: 'none' };

    const hasCustomSlots = (data.level_table || []).some((row: any) => Array.isArray(row?.class_specific?.spell_slots));
    if (hasCustomSlots) {
        return { type: 'custom', ability: abilityName, note: 'Inferred from level_table.class_specific.spell_slots' };
    }

    return { type: 'full', ability: abilityName, note: 'Inferred from spellcasting; please review' };
};

export const buildSubclassCaster = (data: any): CasterProfile | undefined => {
    if (data.caster && data.caster.type) return data.caster;
    if (SUBCLASS_CASTERS[data.index]) return SUBCLASS_CASTERS[data.index];
    if (data.spellcasting?.spellcasting_ability?.index) {
        return { type: 'full', ability: data.spellcasting.spellcasting_ability.index };
    }
    return undefined;
};

/* ------------------------------------------------------------------------- */
/* Subclass metadata                                                         */
/* ------------------------------------------------------------------------- */

const CLASS_SUBCLASS_LEVELS: Record<string, number> = {
    'card-master': 4,
    'blood-hunter': 3,
    'gunslinger': 3,
    'pugilist': 3,
    'arrowsmith': 3,
};

const CLASS_SUBCLASS_LABELS: Record<string, string> = {
    barbarian: 'Primal Path',
    bard: 'Bard College',
    cleric: 'Divine Domain',
    druid: 'Druidic Circle',
    fighter: 'Martial Archetype',
    monk: 'Monastic Tradition',
    paladin: 'Sacred Oath',
    ranger: 'Ranger Archetype',
    rogue: 'Roguish Archetype',
    sorcerer: 'Sorcerous Origin',
    warlock: 'Otherworldly Patron',
    wizard: 'Arcane Tradition',
    artificer: 'Artificer Specialist',
    'blood-hunter': 'Blood Hunter Order',
    gunslinger: 'Gunslinger Archetype',
    pugilist: 'Fight Club',
    arrowsmith: 'Specialization',
    'card-master': 'Path',
};

const SUBCLASS_LEVEL_BY_INDEX: Record<string, number> = {
    'destiny-caster': 4,
    'support-cards': 4,
};

const inferSubclassLevel = (data: any): number => {
    const match = (data.level_table || []).find((row: any) =>
        (row.features || []).some((name: string) =>
            /subclass|archetype|order|path|college|domain|circle|oath|tradition|patron|specialist|club|bravado/i.test(name)
        )
    );
    return match?.level ?? 3;
};

export const buildSubclassLevel = (data: any): number => {
    if (typeof data.subclass_level === 'number') return data.subclass_level;
    if (SUBCLASS_LEVEL_BY_INDEX[data.index]) return SUBCLASS_LEVEL_BY_INDEX[data.index];
    const classIndex = data.class?.index || data.class_index;
    if (classIndex && CLASS_SUBCLASS_LEVELS[classIndex]) return CLASS_SUBCLASS_LEVELS[classIndex];
    return inferSubclassLevel(data);
};

export const buildSubclassLabel = (data: any): string => {
    if (data.subclass_label) return data.subclass_label;
    const classIndex = data.class?.index || data.class_index;
    return CLASS_SUBCLASS_LABELS[classIndex] || 'Subclass';
};

/* ------------------------------------------------------------------------- */
/* Resources                                                                 */
/* ------------------------------------------------------------------------- */

export type ResourceDef = {
    key: string;
    name: string;
    level: number;
    reset: 'short' | 'long';
    max: any;
    source?: string;
};

const CLASS_RESOURCES: Record<string, ResourceDef[]> = {
    bard: [
        { key: 'bardic-inspiration', name: 'Bardic Inspiration', level: 1, reset: 'long', max: ability('cha') },
    ],
    barbarian: [
        { key: 'rage', name: 'Rages', level: 1, reset: 'long', max: table([2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6]) },
    ],
    fighter: [
        { key: 'second-wind', name: 'Second Wind', level: 1, reset: 'short', max: table([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]) },
        { key: 'action-surge', name: 'Action Surge', level: 2, reset: 'short', max: table([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2]) },
        { key: 'indomitable', name: 'Indomitable', level: 9, reset: 'long', max: table([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]) },
    ],
    druid: [
        { key: 'wild-shape', name: 'Wild Shape', level: 2, reset: 'short', max: table([0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4]) },
    ],
    monk: [
        { key: 'focus-points', name: 'Focus Points', level: 2, reset: 'short', max: table([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) },
        { key: 'uncanny-metabolism', name: 'Uncanny Metabolism', level: 2, reset: 'long', max: fixed(1) },
    ],
    paladin: [
        { key: 'lay-on-hands', name: 'Lay on Hands', level: 1, reset: 'long', max: perLevel(5) },
        { key: 'channel-divinity', name: 'Channel Divinity', level: 3, reset: 'short', max: table([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]) },
    ],
    ranger: [
        { key: 'favored-enemy', name: 'Favored Enemy', level: 1, reset: 'long', max: table([2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6]) },
        { key: 'tireless', name: 'Tireless', level: 10, reset: 'long', max: proficiency() },
        { key: 'natures-veil', name: "Nature's Veil", level: 14, reset: 'long', max: proficiency() },
    ],
    rogue: [
        { key: 'stroke-of-luck', name: 'Stroke of Luck', level: 20, reset: 'short', max: table([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) },
    ],
    sorcerer: [
        { key: 'sorcery-points', name: 'Sorcery Points', level: 2, reset: 'long', max: table([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) },
        { key: 'innate-sorcery', name: 'Innate Sorcery', level: 1, reset: 'long', max: fixed(2) },
    ],
    cleric: [
        { key: 'channel-divinity', name: 'Channel Divinity', level: 2, reset: 'short', max: table([0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4]) },
    ],
    artificer: [
        { key: 'flash-of-genius', name: 'Flash of Genius', level: 7, reset: 'long', max: ability('int') },
    ],
    gunslinger: [
        { key: 'grit', name: 'Grit', level: 1, reset: 'short', max: ability('wis') },
    ],
    arrowsmith: [
        { key: 'arrow-crafting', name: 'Arrow Crafting', level: 1, reset: 'short', max: table([2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]) },
    ],
};

const SUBCLASS_RESOURCES: Record<string, ResourceDef[]> = {
    'battle-master': [
        { key: 'superiority-dice', name: 'Superiority Dice', level: 3, reset: 'short', max: table([0, 0, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6]) },
    ],
    artillerist: [
        { key: 'eldritch-cannon', name: 'Eldritch Cannon', level: 3, reset: 'long', max: fixed(1) },
    ],
    commander: [
        { key: 'influence', name: 'Influence', level: 3, reset: 'long', max: fixed(2) },
    ],
};

const classSpecificTable = (data: any, key: string): number[] | null => {
    const rows = data.level_table || [];
    const values = rows.map((row: any) => Number(row?.class_specific?.[key]));
    if (values.some((v: number) => Number.isFinite(v) && v !== 0)) return values.map((v: number) => Number.isFinite(v) ? v : 0);
    return null;
};

export const buildClassResources = (data: any): ResourceDef[] => {
    const resources: ResourceDef[] = [...(CLASS_RESOURCES[data.index] || [])];

    if (data.index === 'card-master') {
        const values = classSpecificTable(data, 'choice_points')
            || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 13, 14, 14, 15, 15, 16];
        resources.push({ key: 'choice-points', name: 'Choice Points', level: 1, reset: 'long', max: table(values) });
    }
    if (data.index === 'blood-hunter') {
        const values = classSpecificTable(data, 'blood_maledicts');
        if (values) resources.push({ key: 'blood-maledict', name: 'Blood Maledict', level: 1, reset: 'short', max: table(values) });
    }
    if (data.index === 'pugilist') {
        const values = classSpecificTable(data, 'moxie');
        if (values) resources.push({ key: 'moxie', name: 'Moxie', level: 2, reset: 'short', max: table(values) });
    }

    return dedupe(resources, r => r.key).map(r => ({ ...r, source: data.name }));
};

export const buildSubclassResources = (data: any): ResourceDef[] => {
    const resources = [...(SUBCLASS_RESOURCES[data.index] || [])];
    return dedupe(resources, r => r.key).map(r => ({ ...r, source: data.name }));
};

/* ------------------------------------------------------------------------- */
/* UI hooks / rules / spell lists                                            */
/* ------------------------------------------------------------------------- */

export const CLASS_UI: Record<string, any> = {
    'card-master': { widgets: ['activeCards'], companion: { kind: 'deck', name: 'Deck of Destiny' } },
};

export const SUBCLASS_UI: Record<string, any> = {
    artillerist: { widgets: ['eldritchCannon'], companion: { kind: 'eldritch-cannon', name: 'Eldritch Cannon' } },
    'battle-smith': { widgets: ['steelDefender'], companion: { kind: 'steel-defender', name: 'Steel Defender' } },
};

export const CLASS_RULES: Record<string, any[]> = {
    rogue: [
        { name: 'Sneak Attack', category: 'Custom', desc: 'Once per turn, deal extra Sneak Attack damage to one creature you hit with advantage, or if an ally is within 5 ft of it.', scaling: { type: 'class_table', key: 'sneak_attack' } },
        { name: 'Cunning Action', category: 'Custom', desc: 'Bonus Action: Dash, Disengage, or Hide.' },
    ],
    barbarian: [
        { name: 'Rage', category: 'Custom', desc: 'Bonus Action. Advantage on Str checks/saves. Bonus melee damage. Resistance to B/P/S damage.' },
        { name: 'Unarmored Defense (Barb)', category: 'Custom', desc: 'AC = 10 + Dex + Con while not wearing armor.' },
    ],
    arrowsmith: [
        { name: 'Into The Frey', category: 'Custom', desc: 'If within 15 ft of 2+ enemies, AC increases by +2, and +1 for every additional 2 enemies.' },
        { name: 'Rolling Reload', category: 'Custom', desc: 'When reloading, you can move 5 ft without provoking opportunity attacks.' },
    ],
};

export const CLASS_SPELL_LISTS: Record<string, string[]> = {
    bard: ['bard'], cleric: ['cleric'], druid: ['druid'], paladin: ['paladin'], ranger: ['ranger'],
    sorcerer: ['sorcerer'], warlock: ['warlock'], wizard: ['wizard'], artificer: ['artificer'],
    'card-master': ['sorcerer'],
};

const CLASS_OPTIONS: Record<string, any> = {
    sorcerer: { metamagic: METAMAGIC_OPTIONS, metamagicProgression: { progressionLevels: [2, 10, 17], calibrationFrom: 3 } },
    'card-master': { pickACardTable: PICK_A_CARD_TABLE },
    arrowsmith: { arrowCrafting: true, arrows: ARROWSMITH_ARROWS },
    warlock: { invocations: WARLOCK_INVOCATIONS },
};

export const SUBCLASS_SPELL_LISTS: Record<string, string[]> = {
    'eldritch-knight': ['wizard'],
    'arcane-trickster': ['wizard'],
};

/* ------------------------------------------------------------------------- */
/* Feature effects                                                           */
/* ------------------------------------------------------------------------- */

const CLASS_FEATURE_EFFECTS: Record<string, Record<string, any[]>> = {
    fighter: {
        'Extra Attack': extraAttack,
        'Two Extra Attacks': [{ type: 'extra_attack', mode: 'set', value: 3, name: 'Extra Attack' }],
        'Three Extra Attacks': [{ type: 'extra_attack', mode: 'set', value: 4, name: 'Extra Attack' }],
    },
    barbarian: {
        'Unarmored Defense': [{ type: 'stat_bonus_attribute', stat: 'ac', attribute: 'con', name: 'Unarmored Defense' }],
        'Extra Attack': extraAttack,
        'Fast Movement': [{ type: 'stat_bonus', stat: 'speed', value: 10, condition: 'not_heavy_armor', name: 'Fast Movement' }],
        'Rage': [
            bonusAction('Rage', 'Enter a rage as a bonus action.'),
            feature('Rage', 'Advantage on Strength checks and saves; bonus melee damage; resistance to bludgeoning, piercing, and slashing damage.'),
        ],
        'Reckless Attack': [feature('Reckless Attack', 'You can have advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.')],
        'Brutal Strike': [{ type: 'attack_rider', name: 'Brutal Strike', damage: '1d10', level: 9, condition: 'melee_weapon' }],
    },
    monk: {
        'Unarmored Defense': [{ type: 'stat_bonus_attribute', stat: 'ac', attribute: 'wis', name: 'Unarmored Defense' }],
        'Extra Attack': extraAttack,
        'Unarmored Movement': [{
            type: 'stat_bonus',
            stat: 'speed',
            value: table([0, 10, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30]),
            condition: 'no_armor_no_shield',
            name: 'Unarmored Movement',
        }],
        'Empowered Strikes': [
            feature('Empowered Strikes', 'Unarmed strikes can deal Force damage or their normal damage type.'),
            { type: 'attack_rider', name: 'Empowered Strikes', condition: 'unarmed', description: 'Whenever you deal damage with your Unarmed Strike, it can deal Force damage or its normal damage type.' },
        ],
    },
    paladin: {
        'Extra Attack': extraAttack,
        'Lay on Hands': [action('Lay on Hands', 'Restore a pool of hit points equal to five times your Paladin level.')],
        'Channel Divinity': [action('Channel Divinity', 'Channel divine energy to produce a magical effect.')],
        'Paladin\'s Smite': [
            bonusAction("Paladin's Smite", 'Cast a smite spell as a bonus action.'),
            { type: 'attack_rider', name: 'Divine Smite', condition: 'melee_weapon', description: 'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal extra radiant damage.' },
        ],
        'Aura of Protection': [{
            type: 'bonus',
            target: 'saves',
            value: { type: 'ability', ability: 'cha', min: 1 },
            name: 'Aura of Protection',
            condition: 'within_10ft',
        }],
        'Radiant Strikes': [{ type: 'attack_rider', name: 'Radiant Strikes', damage: '1d8', damage_type: 'Radiant', level: 11, condition: 'melee_weapon' }],
    },
    ranger: {
        'Extra Attack': extraAttack,
        'Roving': [{ type: 'stat_bonus', stat: 'speed', value: 10, condition: 'not_heavy_armor', name: 'Roving' }],
        'Tireless': [action('Tireless', 'Gain temporary hit points and reduce exhaustion.')],
        "Nature's Veil": [bonusAction("Nature's Veil", 'Become invisible until the end of your next turn.')],
        'Foe Slayer': [
            feature('Foe Slayer', 'Add your Wisdom modifier to an attack or damage roll against a favored enemy.'),
            { type: 'attack_rider', name: 'Foe Slayer', condition: 'weapon', description: 'You can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies.' },
        ],
    },
    rogue: {
        'Sneak Attack': [{ type: 'attack_rider', name: 'Sneak Attack', damage: '1d6', scaling: { type: 'class_table', key: 'sneak_attack' }, condition: 'finesse_or_ranged_weapon' }],
        'Cunning Strike': [{ type: 'attack_rider', name: 'Cunning Strike', condition: 'finesse_or_ranged_weapon', description: 'You can trade Sneak Attack damage for additional effects like Poison, Trip, or Withdraw.' }],
        'Cunning Action': [bonusAction('Cunning Action', 'Dash, Disengage, or Hide as a bonus action.')],
        'Steady Aim': [bonusAction('Steady Aim', 'Gain advantage on your next attack roll this turn.')],
        'Uncanny Dodge': [reaction('Uncanny Dodge', 'Halve the damage from one attack that hits you.')],
        'Reliable Talent': [feature('Reliable Talent', 'Treat a d20 roll of 9 or lower as a 10 for proficient ability checks.')],
        'Stroke of Luck': [feature('Stroke of Luck', 'Turn a missed attack into a hit or a failed check into a 20.')],
    },
    bard: {
        'Bardic Inspiration': [bonusAction('Bardic Inspiration', 'Give a creature a Bardic Inspiration die.')],
        'Jack of All Trades': [{ type: 'half_proficiency', target: 'ability_checks', name: 'Jack of All Trades' }],
        'Font of Inspiration': [feature('Font of Inspiration', 'Regain Bardic Inspiration uses on a short rest.')],
        'Magical Secrets': [feature('Magical Secrets', 'Learn spells from any class list.')],
        'Countercharm': [action('Countercharm', 'Grant advantage against being frightened or charmed.')],
    },
    cleric: {
        'Channel Divinity': [action('Channel Divinity', 'Channel divine energy to produce a magical effect.')],
        'Sear Undead': [action('Sear Undead', 'Turn or damage undead with Channel Divinity.')],
        'Divine Intervention': [action('Divine Intervention', 'Call on your deity for aid.')],
    },
    druid: {
        'Wild Shape': [action('Wild Shape', 'Transform into a beast.')],
        'Wild Companion': [action('Wild Companion', 'Summon a fey familiar.')],
        'Wild Resurgence': [feature('Wild Resurgence', 'Regain Wild Shape uses by expending spell slots.')],
    },
    sorcerer: {
        'Innate Sorcery': [bonusAction('Innate Sorcery', 'Unleash your innate magic for 1 minute.')],
        'Font of Magic': [bonusAction('Font of Magic', 'Convert spell slots and sorcery points.')],
    },
    warlock: {
        'Eldritch Invocations': [feature('Eldritch Invocations', 'Learn fragments of forbidden knowledge.')],
        'Pact Magic': [feature('Pact Magic', 'Your spell slots recharge on a short rest.')],
        'Magical Cunning': [feature('Magical Cunning', 'Regain expended Pact Magic slots.')],
        'Mystic Arcanum': [feature('Mystic Arcanum', 'Cast a high-level spell once per long rest without a slot.')],
    },
    artificer: {
        'Infuse Item': [action('Infuse Item', 'Imbue an item with a magical infusion.')],
        'Flash of Genius': [reaction('Flash of Genius', 'Add your Intelligence modifier to an ability check or saving throw.')],
    },
    'blood-hunter': {
        'Hunter\'s Bane': [feature("Hunter's Bane", 'Advantage on checks to track or recall information about certain creatures.')],
        'Blood Maledict': [bonusAction('Blood Maledict', 'Invoke a blood curse.')],
        'Crimson Rite': [bonusAction('Crimson Rite', 'Imbue a weapon with crimson rite damage.')],
        'Extra Attack': extraAttack,
        'Brand of Castigation': [feature('Brand of Castigation', 'Brand a creature with a magical mark.')],
    },
    gunslinger: {
        'Extra Attack': extraAttack,
        'Adept Marksman': [feature('Adept Marksman', 'Use Grit to perform firearms maneuvers.')],
        'Special Ammunition': [feature('Special Ammunition', 'Craft and use special ammunition.')],
    },
    pugilist: {
        'Extra Attack': extraAttack,
        'Fisticuffs': [bonusAction('Fisticuffs', 'Make an unarmed strike as a bonus action.')],
        'Dig Deep': [bonusAction('Dig Deep', 'Gain temporary hit points by digging deep.')],
        'Shake It Off': [bonusAction('Shake It Off', 'End a condition affecting you.')],
        'Moxie-Fueled Fists': [feature('Moxie-Fueled Fists', 'Your unarmed strikes improve.')],
    },
    arrowsmith: {
        'Extra Attack': extraAttack,
        'Rolling Reload': [feature('Rolling Reload', 'Reload while moving without provoking opportunity attacks.')],
        'Into The Frey': [feature('Into The Frey', 'Gain AC when surrounded by enemies.')],
    },
    'card-master': {
        'Pick a Card': [bonusAction('Pick a Card', 'Draw a card from the Deck of Destiny.')],
        'Trust the Destiny': [feature('Trust the Destiny', 'Gain proficiency and advantage with Religion and Arcana.')],
        'Chiromancy': [bonusAction('Chiromancy', 'Read the omens to alter fate.')],
        'Mystic Shuffle': [feature('Mystic Shuffle', 'Reshuffle and redraw cards.')],
        'Foresight Touch': [feature('Foresight Touch', 'Grant a glimpse of the future.')],
        'The World': [feature('The World', 'Unlock the final card of the Major Arcana.')],
    },
};

const SUBCLASS_FEATURE_EFFECTS: Record<string, Record<string, any[]>> = {
    swords: { 'Extra Attack': extraAttack },
    valor: { 'Extra Attack': extraAttack },
    'battle-smith': {
        'Extra Attack': extraAttack,
        'Steel Defender': [action('Steel Defender', 'Command your Steel Defender.')],
    },
    bladesinging: { 'Extra Attack': extraAttack },
    'battle-master': {
        'Combat Superiority': [feature('Combat Superiority', 'Spend Superiority Dice on maneuvers.')],
    },
    artillerist: {
        'Eldritch Cannon': [action('Eldritch Cannon', 'Create and command an Eldritch Cannon.')],
    },
    commander: {
        'Battlefield Influence': [feature('Battlefield Influence', 'Spend Influence to direct allies.')],
    },
    moon: {
        'Combat Wild Shape': [bonusAction('Combat Wild Shape', 'Wild Shape as a bonus action.')],
    },
};

const SYNTHETIC_SUBCLASS_FEATURES: Record<string, any[]> = {
    bladesinging: [{
        index: 'bladesinging-extra-attack',
        name: 'Extra Attack',
        level: 6,
        desc: ['You can attack twice, instead of once, whenever you take the Attack action on your turn.'],
        effects: extraAttack,
    }],
};

const descText = (desc: any): string => Array.isArray(desc) ? desc.join(' ') : (desc || '');

const enrichFeatureOptions = (effects: any[]): any[] => effects.map(effect => {
    if (!Array.isArray(effect.options)) return effect;
    const options = effect.options.map((option: any) => {
        if (typeof option === 'string') return option;
        if (Array.isArray(option.effects) && option.effects.length > 0) return option;
        const inferred = inferOptionEffects(option.name || option.index || '', descText(option.desc || option.description));
        return inferred.length > 0 ? { ...option, effects: inferred } : option;
    });
    return { ...effect, options };
});

const additionsWithoutDuplicates = (existing: any[], additions: any[]): any[] => {
    return additions.filter(addition => {
        if (!addition || typeof addition !== 'object') return true;
        return !existing.some(effect => {
            if (!effect || typeof effect !== 'object') return false;
            if (effect.type !== addition.type) return false;
            const effectName = effect.name || effect.target || effect.stat || '';
            const additionName = addition.name || addition.target || addition.stat || '';
            return effectName === additionName;
        });
    });
};

export const enrichClassFeatures = (data: any): any[] => {
    const added = CLASS_FEATURE_EFFECTS[data.index] || {};
    return (data.feature_details || []).map((featureDef: any) => {
        const existing = featureDef.effects || [];
        const effects = mergeEffects(
            existing,
            additionsWithoutDuplicates(existing, added[featureDef.name] || [])
        );
        return {
            ...featureDef,
            effects: enrichFeatureOptions(effects),
        };
    });
};

export const enrichSubclassFeatures = (data: any): any[] => {
    const added = SUBCLASS_FEATURE_EFFECTS[data.index] || {};
    const features = [...(data.feature_details || [])];
    for (const synthetic of SYNTHETIC_SUBCLASS_FEATURES[data.index] || []) {
        if (!features.some(f => f.name === synthetic.name)) features.push(synthetic);
    }
    return features.map((featureDef: any) => {
        const existing = featureDef.effects || [];
        const effects = mergeEffects(
            existing,
            additionsWithoutDuplicates(existing, added[featureDef.name] || [])
        );
        return {
            ...featureDef,
            effects: enrichFeatureOptions(effects),
        };
    });
};

/* ------------------------------------------------------------------------- */
/* Class / subclass / race / background choices                              */
/* ------------------------------------------------------------------------- */

const categoryFromOptionName = (name: string): string => {
    const lower = String(name || '').toLowerCase();
    if (lower.startsWith('skill:')) return 'skill';
    if (lower.startsWith('musical instrument:') || lower.startsWith('gaming set:') || lower.includes('tools') || lower.includes('kit') || lower.includes('supplies') || lower.includes('utensils')) return 'tool';
    if (lower.includes('armor') || lower.includes('shield')) return 'armor';
    if (lower.includes('weapon') || lower.includes('sword') || lower.includes('bow') || lower.includes('axe') || lower.includes('mace') || lower.includes('dagger') || lower.includes('spear') || lower.includes('crossbow')) return 'weapon';
    return 'other';
};

const cleanOptionName = (name: string): string =>
    String(name || '').replace(/^(Skill|Musical Instrument|Gaming Set|Tool|Armor|Weapon|Other):\s*/i, '').trim();

export const buildClassChoices = (data: any, source: 'class' | 'background' = 'class'): any[] => {
    const choices = (data.proficiency_choices || []).map((choice: any, index: number) => {
        const options = (choice.from?.options || []).map((option: any) => {
            const item = option.item || option;
            return {
                name: cleanOptionName(item.name),
                index: item.index || cleanOptionName(item.name).toLowerCase().replace(/\s+/g, '-'),
                category: categoryFromOptionName(item.name),
                rawName: item.name,
            };
        });
        return {
            id: `${data.index}-proficiency-${index}`,
            kind: 'proficiency',
            count: choice.choose || 1,
            source,
            options,
        };
    });
    return choices;
};

const allSkillNames = SKILL_LIST.map(s => s.name);

export const RACE_CHOICES: Record<string, any[]> = {
    dragonborn: [{
        id: 'dragonborn-ancestry',
        kind: 'ancestry',
        count: 1,
        source: 'race',
        options: [
            { name: 'Black', effects: [resistance('Acid')] },
            { name: 'Blue', effects: [resistance('Lightning')] },
            { name: 'Brass', effects: [resistance('Fire')] },
            { name: 'Bronze', effects: [resistance('Lightning')] },
            { name: 'Copper', effects: [resistance('Acid')] },
            { name: 'Gold', effects: [resistance('Fire')] },
            { name: 'Green', effects: [resistance('Poison')] },
            { name: 'Red', effects: [resistance('Fire')] },
            { name: 'Silver', effects: [resistance('Cold')] },
            { name: 'White', effects: [resistance('Cold')] },
        ],
    }],
    'half-elf': [
        {
            id: 'half-elf-skills',
            kind: 'skill',
            count: 2,
            source: 'race',
            options: allSkillNames,
        },
        {
            id: 'half-elf-asi',
            kind: 'ability',
            count: 2,
            amount: 1,
            source: 'race',
            options: ['str', 'dex', 'con', 'int', 'wis'],
        },
    ],
    'high-elf': [{
        id: 'high-elf-cantrip',
        kind: 'spell',
        count: 1,
        level: 0,
        sourceClass: 'wizard',
        source: 'subrace',
        options: [],
    }],
    kenku: [{
        id: 'kenku-training',
        kind: 'skill',
        count: 2,
        source: 'race',
        options: ['Acrobatics', 'Deception', 'Stealth', 'Sleight of Hand'],
    }],
    changeling: [{
        id: 'changeling-instincts',
        kind: 'skill',
        count: 2,
        source: 'race',
        options: ['Deception', 'Insight', 'Intimidation', 'Persuasion'],
    }],
    warforged: [
        {
            id: 'warforged-skill',
            kind: 'skill',
            count: 1,
            source: 'race',
            options: allSkillNames,
        },
        {
            id: 'warforged-tool',
            kind: 'tool',
            count: 1,
            source: 'race',
            options: ARTISAN_TOOLS,
        },
    ],
    centaur: [{
        id: 'centaur-survivor',
        kind: 'skill',
        count: 1,
        source: 'race',
        options: ['Animal Handling', 'Medicine', 'Nature', 'Survival'],
    }],
    minotaur: [{
        id: 'minotaur-imposing-presence',
        kind: 'skill',
        count: 1,
        source: 'race',
        options: ['Intimidation', 'Persuasion'],
    }],
    leonin: [{
        id: 'leonin-hunter-instincts',
        kind: 'skill',
        count: 1,
        source: 'race',
        options: ['Athletics', 'Intimidation', 'Perception', 'Survival'],
    }],
    githyanki: [
        {
            id: 'githyanki-decadent-mastery-skill-tool',
            kind: 'proficiency',
            count: 1,
            source: 'subrace',
            options: [...allSkillNames, ...ARTISAN_TOOLS],
        },
        {
            id: 'githyanki-decadent-mastery-language',
            kind: 'language',
            count: 1,
            source: 'subrace',
            options: STANDARD_LANGUAGES,
        },
    ],
};

export const RACE_TRAIT_EFFECTS: Record<string, Record<string, any[]>> = {
    elf: { 'Keen Senses': [prof('Perception')] },
    'astral-elf': { 'Keen Senses': [prof('Perception')] },
    'half-orc': { 'Menacing': [prof('Intimidation')] },
    tabaxi: { "Cat's Talent": [prof('Perception'), prof('Stealth')] },
    harengon: { 'Leprous Senses': [prof('Perception')] },
    owlin: { 'Silent Feathers': [prof('Stealth')] },
    goliath: { 'Natural Athlete': [prof('Athletics')] },
};

export const enrichRaceTraits = (race: any): any[] => {
    const added = RACE_TRAIT_EFFECTS[race.index] || {};
    return (race.traits || []).map((trait: any) => ({
        ...trait,
        effects: mergeEffects(trait.effects || [], trait.modifiers || [], added[trait.name] || []),
    }));
};

export const enrichSubrace = (subrace: any): any => {
    const added = RACE_TRAIT_EFFECTS[subrace.index] || {};
    return {
        ...subrace,
        traits: (subrace.traits || []).map((trait: any) => ({
            ...trait,
            effects: mergeEffects(trait.effects || [], trait.modifiers || [], added[trait.name] || []),
        })),
        choices: mergeChoices(subrace.choices || [], RACE_CHOICES[subrace.index] || []),
    };
};

export const mergeChoices = (existing: any[], incoming: any[]): any[] => {
    const byId = new Map<string, any>();
    [...existing, ...incoming].forEach(choice => {
        if (!choice) return;
        const id = choice.id || choice.kind;
        if (id) byId.set(id, choice);
    });
    return Array.from(byId.values());
};

/* ------------------------------------------------------------------------- */
/* Builders                                                                  */
/* ------------------------------------------------------------------------- */

export const buildClassData = (data: any): any => {
    const caster = buildCaster(data);
    const choices = mergeChoices(data.choices || [], buildClassChoices(data));
    const classOptions = { ...(data.options || {}), ...(CLASS_OPTIONS[data.index] || {}) };
    return {
        ...data,
        schema_version: 2,
        caster,
        subclass_level: buildSubclassLevel(data),
        subclass_label: CLASS_SUBCLASS_LABELS[data.index] || data.subclass_label || 'Subclass',
        resources: dedupe([...(data.resources || []), ...buildClassResources(data)], r => r.key),
        choices,
        spell_list: data.spell_list || CLASS_SPELL_LISTS[data.index] || [],
        ui: { ...(data.ui || {}), ...(CLASS_UI[data.index] || {}) },
        ...(Object.keys(classOptions).length > 0 ? { options: classOptions } : {}),
        rules: dedupe([...(data.rules || []), ...(CLASS_RULES[data.index] || [])], r => r.name),
        feature_details: enrichClassFeatures(data),
        ...(data.spellcasting
            ? { spellcasting: { ...data.spellcasting, progression: caster.type } }
            : {}),
    };
};

export const buildSubclassData = (data: any): any => {
    const caster = buildSubclassCaster(data);
    const result: any = {
        ...data,
        schema_version: 2,
        subclass_level: buildSubclassLevel(data),
        subclass_label: buildSubclassLabel(data),
        resources: dedupe([...(data.resources || []), ...buildSubclassResources(data)], r => r.key),
        spell_list: data.spell_list || SUBCLASS_SPELL_LISTS[data.index] || [],
        ui: { ...(data.ui || {}), ...(SUBCLASS_UI[data.index] || {}) },
        feature_details: enrichSubclassFeatures(data),
    };
    if (caster) result.caster = caster;
    else delete result.caster;
    return result;
};

export const buildRaceData = (data: any): any => ({
    ...data,
    schema_version: 2,
    choices: mergeChoices(data.choices || [], RACE_CHOICES[data.index] || []),
    traits: enrichRaceTraits(data),
    subraces_details: (data.subraces_details || []).map(enrichSubrace),
});

export const buildBackgroundData = (data: any): any => {
    const choices = buildClassChoices({ ...data, index: data.index }, 'background');
    return {
        ...data,
        schema_version: 2,
        effects: data.effects || [],
        feature: data.feature
            ? { ...data.feature, effects: data.feature.effects || [] }
            : data.feature,
        choices: mergeChoices(data.choices || [], choices),
    };
};

export const buildFeatData = (data: any): any => ({
    ...data,
    schema_version: 2,
    effects: data.effects || [],
});

export const buildRecordData = (table: string, data: any): any => {
    switch (table) {
        case 'custom_classes': return buildClassData(data);
        case 'custom_subclasses': return buildSubclassData(data);
        case 'custom_races': return buildRaceData(data);
        case 'custom_backgrounds': return buildBackgroundData(data);
        case 'custom_feats': return buildFeatData(data);
        default: return { ...data, schema_version: 2 };
    }
};
