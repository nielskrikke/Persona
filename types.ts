
export type BuilderPhase = 'welcome' | 'level' | 'race' | 'class' | 'abilities' | 'leveling' | 'spells' | 'background' | 'gear' | 'sheet';

export interface AbilityScores {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export type AbilityName = keyof AbilityScores;

export const ABILITY_NAMES: AbilityName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
export const ABILITY_LABELS: Record<AbilityName, string> = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma'
};

export interface APIReference {
    index: string;
    name: string;
    url?: string;
    isCustom?: boolean;
}

export interface ClassFeature {
    index: string;
    name: string;
    level: number;
    source: string;
    desc: string[];
    url: string;
}

export interface SpellDetail extends APIReference {
    level: number;
    desc: string[];
    range: string;
    components: string[];
    material?: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    casting_time: string;
    attack_type?: string;
    school: APIReference;
    classes: APIReference[];
    subclasses?: APIReference[];
    higher_level?: string[];
    damage?: any;
    dc?: any;
    sourceClassIndex?: string;
    isPrepared?: boolean;
}

export interface RaceDetail extends APIReference {
    speed: number;
    ability_bonuses: {
        ability_score: APIReference;
        bonus: number;
    }[];
    alignment: string;
    age: string;
    size: string;
    size_description: string;
    starting_proficiencies?: APIReference[];
    languages: APIReference[];
    language_desc: string;
    traits: APIReference[];
    subraces?: APIReference[];
    subraces_details?: SubraceDetail[];
    url?: string;
}

export interface ExtendedRaceDetail extends RaceDetail {
    language_options?: any;
    starting_proficiencies?: APIReference[];
    subraces?: APIReference[];
}

export interface SubraceDetail extends APIReference {
    ability_bonuses: {
        ability_score: APIReference;
        bonus: number;
    }[];
    starting_proficiencies: APIReference[];
    languages: APIReference[];
    traits: APIReference[];
    desc?: string[];
}

export interface ExtendedSubraceDetail extends SubraceDetail {
    race?: string | APIReference;
}

export interface ClassDetail extends APIReference {
    hit_die: number;
    proficiency_choices: {
        choose: number;
        type: string;
        from: {
            options: (APIReference | { item: APIReference })[];
        };
    }[];
    proficiencies: APIReference[];
    saving_throws: APIReference[];
    starting_equipment?: {
        equipment: APIReference;
        quantity: number;
    }[];
    class_levels?: string;
    multi_classing?: any;
    spellcasting?: {
        level: number;
        spellcasting_ability: APIReference;
        info: { name: string; desc: string[] }[];
    };
    feature_details?: any[];
    level_table?: any[];
}

export interface SubclassDetail extends APIReference {
    class: APIReference;
    subclass_flavor?: string;
    desc: string[];
    feature_details?: any[];
}

export interface BackgroundDetail extends APIReference {
    feature: {
        name: string;
        desc: string[];
    };
    skill_proficiencies: string[];
    tool_proficiencies?: string[];
    language_options?: any;
    starting_equipment?: APIReference[];
    starting_equipment_options?: any;
    currency: {
        gp: number;
        sp: number;
        cp: number;
        ep?: number;
        pp?: number;
    };
    equipment: string[];
    languages?: number | string[];
    proficiency_choices?: any[];
    source?: string;
}

export interface BaseEquipment extends APIReference {
    equipment_category: APIReference;
    cost: { quantity: number; unit: string };
    weight?: number;
    desc?: string[];
    armor_class?: {
        base: number;
        dex_bonus: boolean;
        max_bonus: number | null;
    };
    damage?: {
        damage_dice: string;
        damage_type: string | APIReference;
    };
    range?: {
        normal: number;
        long: number | null;
    };
    properties?: (string | APIReference)[];
    modifiers?: ItemModifier[];
    requires_attunement?: boolean;
    attunement_description?: string;
}

export interface InventoryItem extends Partial<BaseEquipment> {
    id: string;
    name: string;
    quantity: number;
    equipped: boolean;
    attuned?: boolean;
}

export interface EquipmentDetail extends BaseEquipment {
    id?: string;
    quantity?: number;
    equipped?: boolean;
}

export interface LogEntry {
    id: string;
    name: string;
    relationship?: string;
    status?: string;
    notes?: string;
    description?: string;
    location?: string;
}

export interface CharacterClass {
    definition: ClassDetail;
    level: number;
    subclass: SubclassDetail | null;
}

export interface Currency {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
}

export interface RuleEntry {
    name: string;
    category: string;
    desc: string;
}

export interface RollResult {
    formula: string;
    label: string;
    total: number;
    rolls: number[];
    timestamp: number;
    isCrit?: boolean;
    isFail?: boolean;
    die?: string;
    modifier?: number;
}

export interface BeastDetail extends APIReference {
    size: string;
    type: string;
    ac: number;
    hp: number;
    speed: string;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    senses: string;
    languages?: string;
    actions: { 
        name: string; 
        desc: string;
        attack_bonus?: number;
        damage_dice?: string;
        damage_type?: string | APIReference;
    }[];
    challenge_rating?: number;
    fly_speed?: string | number;
    swim_speed?: string | number;
    traits?: { name: string; desc: string }[];
    hit_dice?: string;
}

export interface EldritchCannonDetail {
    id?: string;
    type: 'Flamethrower' | 'Force Ballista' | 'Protector';
    size: 'Small' | 'Tiny';
    hp: number;
    maxHp: number;
    name?: string;
    desc?: string;
    description?: string;
    action?: string;
    ac?: number;
    active?: boolean;
}

export interface SteelDefenderDetail {
    id?: string;
    hp: number;
    maxHp: number;
    name?: string;
    ac: number;
    speed?: string;
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
    actions?: { name: string; desc: string }[];
    active?: boolean;
}

export interface CharacterState {
    id?: string;
    user_id?: string;
    name: string;
    avatarUrl?: string;
    race: RaceDetail | null;
    subrace: SubraceDetail | null;
    classes: CharacterClass[];
    level: number;
    abilities: AbilityScores;
    background: string;
    alignment: string;
    skills: string[];
    expertise: string[];
    languages: string[];
    toolProficiencies: string[];
    maxHp: number;
    currentHp: number;
    tempHp: number;
    inspiration: boolean;
    inventory: InventoryItem[];
    currency: Currency;
    spells: SpellDetail[];
    spellSlots: Record<number, { max: number, current: number }>;
    hitDiceUsage: Record<string, number>;
    feats: any[];
    featureUsage: Record<string, { max: number, current: number, reset?: 'short' | 'long' }>;
    classFeatures: ClassFeature[];
    xp: number;
    equipment: string[];
    customActions: CustomAction[];
    layout: { left: string[], right: string[], mobile: string[] };
    favorites: string[];
    backstory: string;
    lore: any[];
    quests: any[];
    contacts: LogEntry[];
    generalNotes: string;
    themeColor: string;
    themeColorSecondary: string;
    show3DDice: boolean;
    diceColor?: string;
    diceEffect?: string;
    backgroundColor?: string;
    backgroundImageUrl?: string;
    fontScale?: number;
    activeWildShape?: { beast: BeastDetail, currentHp: number } | null;
    activeConcentration?: { name: string, duration?: string } | null;
    activeFamiliar?: BeastDetail | null;
    familiars?: BeastDetail[];
    activeEldritchCannon?: EldritchCannonDetail | null;
    eldritchCannonFreebieUsed?: boolean;
    activeSteelDefender?: SteelDefenderDetail | null;
    customBeasts?: BeastDetail[];
}

export interface FeatureEffect {
    type: 'bonus' | 'set' | 'resistance' | 'expertise_choice' | 'proficiency_choice' | 'feature_choice' | 'asi' | 'asi_choice' | 'stat_bonus' | 'proficiency' | 'advantage' | 'spell_access' | 'feature' | 'bonus_action' | 'action' | 'reaction';
    target?: string;
    value?: string | number;
    options?: any[];
    category?: string;
    name?: string;
    count?: number;
    attributes?: string[];
    amount?: number;
}

export interface SkillDefinition {
    index: string;
    name: string;
    ability: AbilityName;
}

export interface TraitDetail extends APIReference {
    desc: string[];
}

export interface CustomAction {
    id: string;
    name: string;
    type: 'attack' | 'action' | 'bonus' | 'reaction' | 'other' | 'weapon' | 'spell' | 'feature';
    ability?: AbilityName;
    bonus?: number;
    hit?: number;
    damage?: string;
    damageType?: string;
    desc?: string;
    description?: string;
    range?: string;
}

export interface ItemModifier {
    type: 'bonus' | 'set' | 'resistance' | 'immunity' | 'advantage';
    target: string;
    value: string | number;
    filter?: any;
}

export interface ExtendedFeatDetail extends APIReference {
    desc: string[];
    prerequisites?: string[];
    effects?: FeatureEffect[];
}

export type FeatDetail = ExtendedFeatDetail;
