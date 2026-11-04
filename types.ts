
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
    is_homebrew?: boolean;
}

export type CasterType = 'full' | 'half' | 'third' | 'pact' | 'artificer' | 'custom' | 'none';

export interface CasterProfile {
    type: CasterType;
    ability?: AbilityName;
    rounding?: 'up' | 'down';
    note?: string;
}

export interface ResourceDefinition {
    key: string;
    name: string;
    level?: number;
    reset: 'short' | 'long';
    max: {
        type: 'fixed' | 'level' | 'ability' | 'proficiency' | 'table' | 'formula';
        value?: number;
        ability?: AbilityName;
        min?: number;
        bonus?: number;
        multiplier?: number;
        values?: number[];
        expression?: string;
    };
    source?: string;
}

export interface ContentChoice {
    id: string;
    kind: 'skill' | 'tool' | 'language' | 'ability' | 'ancestry' | 'feature' | 'spell' | 'subclass' | 'proficiency' | 'feat' | 'spellcasting_ability' | 'weapon_mastery';
    count: number;
    count_by_level?: Record<number, number>;
    label?: string;
    level?: number;
    amount?: number;
    source?: string;
    sourceClass?: string;
    options?: any[];
    effects?: FeatureEffect[];
    linked_save_proficiency?: boolean;
    expertise_if_proficient?: boolean;
    min_level?: number;
    free_casts?: number;
    free_cast_reset?: 'short' | 'long';
    ability?: string;
}

export interface ContentUiHook {
    widgets?: string[];
    companion?: { kind: string; name?: string; options?: any };
    extraActions?: string[];
}

export interface ClassFeature {
    index: string;
    name: string;
    level: number;
    source: string;
    desc: string[];
    url?: string;
    school?: APIReference;
    casting_time?: string;
    range?: string;
    components?: string[];
    duration?: string;
    ritual?: boolean;
    damage?: string | { damage_dice: string; damage_type?: any };
    save?: { type?: string; dc?: number; dc_type?: any };
    effects?: FeatureEffect[];
    revertData?: any;
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
    isGranted?: boolean;
    grantedBy?: string;
    freeCasts?: number;
    freeCastReset?: 'short' | 'long';
    secondary_damage?: string;
    minLevel?: number;
    spellcastingAbility?: AbilityName;
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
    traits: (APIReference & { desc?: string[]; effects?: FeatureEffect[]; modifiers?: FeatureEffect[] })[];
    resources?: ResourceDefinition[];
    choices?: ContentChoice[];
    subraces_details?: SubraceDetail[];
    url?: string;
    source?: string;
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
    traits: (APIReference & { desc?: string[]; effects?: FeatureEffect[]; modifiers?: FeatureEffect[] })[];
    desc?: string[];
    source?: string;
    choices?: ContentChoice[];
}

export interface ExtendedSubraceDetail extends SubraceDetail {
    race?: string | APIReference;
}

export interface ClassDetail extends APIReference {
    hit_die: number;
    primary_ability?: string[];
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
    subclasses?: APIReference[];
    caster?: CasterProfile;
    subclass_level?: number;
    subclass_label?: string;
    resources?: ResourceDefinition[];
    choices?: ContentChoice[];
    spell_list?: string[];
    ui?: ContentUiHook;
    options?: any;
    rules?: RuleEntry[];
    source?: string;
}

export interface SubclassDetail extends APIReference {
    class: APIReference;
    class_index?: string;
    subclass_flavor?: string;
    desc: string[];
    feature_details?: any[];
    caster?: CasterProfile;
    subclass_level?: number;
    subclass_label?: string;
    resources?: ResourceDefinition[];
    choices?: ContentChoice[];
    spell_list?: string[];
    ui?: ContentUiHook;
    source?: string;
}

export interface BackgroundDetail extends APIReference {
    feature: {
        name: string;
        desc: string[];
        effects?: FeatureEffect[];
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
    equipment_options?: {
        label: string;
        equipment: string[];
        currency?: { gp: number; sp: number; cp: number };
    }[];
    languages?: number | string[];
    proficiency_choices?: any[];
    source?: string;
    effects?: FeatureEffect[];
    choices?: ContentChoice[];
}

export interface BaseEquipment extends APIReference {
    equipment_category: APIReference;
    cost: { quantity: number; unit: string };
    weight?: number;
    rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact' | 'Varies' | 'Unknown';
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
    versatileDamage?: {
        damage_dice: string;
        damage_type: string | APIReference;
    };
    range?: string | {
        normal: number;
        long: number | null;
    };
    properties?: (string | APIReference)[];
    mastery?: string | APIReference;
    specialDescription?: string;
    modifiers?: ItemModifier[];
    requires_attunement?: boolean;
    attunement_description?: string;
    subtype?: string;
    is_wondrous?: boolean;
    isSpellFocus?: boolean;
    weapon_category?: string;
    weapon_range?: string;
    armor_category?: string;
}

export interface InventoryItem extends Partial<BaseEquipment> {
    id: string;
    name: string;
    quantity: number;
    equipped: boolean;
    attuned?: boolean;
    isMonkWeapon?: boolean;
    isPactWeapon?: boolean;
    isKenseiWeapon?: boolean;
    isHexWeapon?: boolean;
    isInfusion?: boolean;
    isShillelagh?: boolean;
    isBattleReady?: boolean;
    isThrown?: boolean;
    thrownRange?: string;
    thrownDamage?: string;
    wieldedTwoHanded?: boolean;
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
    featureChoices?: Record<string, string[]>;
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

export interface CreatureDetail extends APIReference {
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

export interface LevelChoice {
    id: string;
    level: number;
    source: string;
    type: 'language' | 'skill' | 'expertise' | 'asi' | 'feat' | 'subclass' | 'feature_choice' | 'spell' | 'other' | 'level_up' | 'asi-feat' | 'feat-selection' | 'Level Advancement';
    label: string;
    value: any;
    options?: any[];
    count?: number;
    revertData?: any;
}

export type OfficialDiceThemeId =
  | 'default'
  | 'default-extras'
  | 'blueGreenMetal'
  | 'diceOfRolling'
  | 'diceOfRolling-fate'
  | 'gemstone'
  | 'gemstoneMarble'
  | 'rock'
  | 'rust'
  | 'smooth'
  | 'smooth-pip'
  | 'wooden';

export type DiceSurface = 'solid' | 'marble';
export type DiceEdgeStyle = 'rounded' | 'classic' | 'sharp';

export interface DiceCustomizationOptions {
    theme?: OfficialDiceThemeId;
    color?: string;
    labelColor?: string;
    surface?: DiceSurface;
    edgeStyle?: DiceEdgeStyle;
    finish?: 'solid' | 'metallic' | 'glossy' | 'shadow';
    scale?: number;
    lightIntensity?: number;
    shadowTransparency?: number;
    enableShadows?: boolean;
    spinForce?: number;
    throwForce?: number;
    soundEnabled?: boolean;
}

export interface CombatTarget {
    name: string;
    ac?: number;
    hp?: number;
    maxHp?: number;
    resistances: string[];
    immunities: string[];
    conditions: string[];
    notes?: string[];
    lastAttack?: number;
    lastHit?: boolean;
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
    spellcastingAbility?: AbilityName;
    freeCastUsage?: Record<string, number>;
    activeConditions?: Record<string, boolean>;
    combatTarget?: CombatTarget | null;
    alignment: string;
    skills: string[];
    expertise: string[];
    languages: string[];
    toolProficiencies: string[];
    savingThrowProficiencies: string[];
    maxHp: number;
    currentHp: number;
    tempHp: number;
    deathSaves?: { successes: number; failures: number };
    inspiration: boolean;
    inventory: InventoryItem[];
    currency: Currency;
    spells: SpellDetail[];
    spellSlots: Record<number, { max: number, current: number }>;
    hitDiceUsage: Record<string, number>;
    feats: any[];
    featureUsage: Record<string, { max: number, current: number, reset?: 'short' | 'long', hidden?: boolean }>;
    classFeatures: ClassFeature[];
    xp: number;
    equipment: string[];
    customActions: CustomAction[];
    campaign_id?: string | null;
    campaign_name?: string | null;
    layout: { left: string[], right: string[], mobile: string[] };
    favorites: string[];
    backstory: string;
    lore: any[];
    quests: any[];
    contacts: LogEntry[];
    generalNotes: string;
    encounteredCreatures: EncounteredCreature[];
    sessionNotes: SessionNote[];
    themeColor: string;
    themeColorSecondary: string;
    show3DDice: boolean;
    diceColor?: string;
    diceEffect?: string;
    diceCustomization?: DiceCustomizationOptions;
    backgroundColor?: string;
    backgroundImageUrl?: string;
    fontScale?: number;
    activeWildShape?: { creature: CreatureDetail, currentHp: number, maxHp: number } | null;
    activeConcentration?: { name: string, duration?: string } | null;
    customTrackers?: { id: string, name: string, value?: string, color?: string }[];
    activeFamiliar?: { creature: CreatureDetail, currentHp: number, maxHp: number } | null;
    activePolymorph?: { creature: CreatureDetail, currentHp: number, maxHp: number } | null;
    creatures?: CreatureDetail[];
    customCreatures?: CreatureDetail[];
    activeEldritchCannon?: EldritchCannonDetail | null;
    eldritchCannonFreebieUsed?: boolean;
    activeSteelDefender?: SteelDefenderDetail | null;
    choices: LevelChoice[];
    activeCards?: { roll: number, name: string, duration: string, timestamp: number }[];
    exhaustion?: number;
    foolStacks?: number;
    combatOverrides?: {
        hitBonus?: number;
        damageBonus?: number;
        hitOverride?: number;
        damageOverride?: number;
    };
}

export interface FeatureEffect {
    type: 'bonus' | 'set' | 'resistance' | 'immunity' | 'expertise_choice' | 'proficiency_choice' | 'feature_choice' | 'asi' | 'asi_choice' | 'stat_bonus' | 'stat_bonus_attribute' | 'proficiency' | 'advantage' | 'spell_access' | 'feature' | 'bonus_action' | 'action' | 'reaction' | 'class_choice' | 'extra_attack' | 'additional_attack' | 'unarmed_strike' | 'natural_weapon' | 'attack_rider' | 'half_proficiency' | 'smite' | 'speed_bonus' | 'resource' | 'spell_damage_bonus' | 'ignore_resistance' | 'damage_die_min';
    target?: string;
    attribute?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    value?: any;
    mode?: 'bonus' | 'set' | 'override';
    conditions?: string[];
    scaling?: any;
    description?: string;
    options?: any[];
    category?: string;
    name?: string;
    count?: number;
    attributes?: string[];
    amount?: number;
    reset?: 'short' | 'long';
    filter_class?: string;
    filter_level?: number;
    filter_school?: string;
    level?: number;
    school?: string;
    linked_save_proficiency?: boolean;
    expertise_if_proficient?: boolean;
    min_level?: number;
    free_casts?: number;
    free_cast_reset?: 'short' | 'long';
    ability?: string;
    cast_free?: boolean;
    key?: string;
    stat?: string;
    spell?: string;
    label?: string;
    condition?: string;
    damage_type?: string;
    damage?: any;
    save_ability?: string;
    ritual?: boolean;
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
    activationType?: 'action' | 'bonus' | 'reaction' | 'legendary' | 'other';
    ability?: AbilityName;
    isProficient?: boolean;
    bonus?: number;
    hit?: number;
    saveDC?: number;
    saveAbility?: AbilityName;
    damage?: string;
    damageType?: string;
    desc?: string;
    description?: string;
    range?: string;
    maxUses?: number;
    reset?: 'short' | 'long';
}

export interface ItemModifier {
    type: 'bonus' | 'set' | 'resistance' | 'immunity' | 'advantage';
    target: string;
    value: string | number;
    filter?: any;
}

export interface ExtendedFeatDetail extends APIReference {
    desc: string[];
    source?: string;
    prerequisite?: string;
    prerequisites?: string[];
    effects?: FeatureEffect[];
    choices?: ContentChoice[];
}

export type FeatDetail = ExtendedFeatDetail;

export interface EncounteredCreature {
    id: string;
    name: string;
    ac?: number;
    hp?: number;
    weaknesses?: string;
    resistances?: string;
    immunities?: string;
    notes?: string;
}

export interface SessionNote {
    id: string;
    sessionNumber: number;
    title?: string;
    date?: string;
    itemsFound?: string;
    locationsDiscovered?: string;
    generalNotes?: string;
}

export interface Campaign {
    id: string;
    name: string;
    description?: string;
    code: string;
    created_at?: string;
    created_by?: string;
    characters?: { id: string; name: string; avatarUrl?: string; user_id?: string; race?: string; className?: string; level?: number }[];
}

export interface CampaignPartyInventory {
    campaign_id: string;
    inventory: InventoryItem[];
    currency: Currency;
}

export interface CampaignRoll extends RollResult {
    id: string;
    campaign_id: string;
    character_id: string;
    character_name: string;
}

