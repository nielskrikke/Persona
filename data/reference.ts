
// This file acts as a registry for Senses, Conditions, and Trait Categorization

export type SenseType = 'darkvision' | 'blindsight' | 'truesight' | 'tremorsense';

export interface SenseDefinition {
    key: SenseType;
    name: string;
    description: string;
}

export const SENSES: SenseDefinition[] = [
    {
        key: 'darkvision',
        name: 'Darkvision',
        description: 'You can see in dim light within range as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.'
    },
    {
        key: 'blindsight',
        name: 'Blindsight',
        description: 'You can perceive your surroundings without relying on sight, within a specific radius.'
    },
    {
        key: 'truesight',
        name: 'Truesight',
        description: 'You can see in normal and magical darkness, see invisible creatures and objects, automatically detect visual illusions and succeed on saving throws against them, and perceive the original form of a shapechanger or a creature that is transformed by magic.'
    },
    {
        key: 'tremorsense',
        name: 'Tremorsense',
        description: 'You can detect and pinpoint the origin of vibrations within a specific radius, provided that you and the source of the vibrations are in contact with the same ground or substance.'
    }
];

export type TraitBucket = 'Senses' | 'Defenses' | 'Movement' | 'Proficiencies' | 'Actions' | 'Passive';

// A mapping of known trait indices to their "Bucket" for UI display
export const TRAIT_CATEGORY_MAP: Record<string, TraitBucket> = {
    // Senses
    'darkvision': 'Senses',
    'superior-darkvision': 'Senses',
    'sunlight-sensitivity': 'Senses',
    'keen-senses': 'Senses',
    'blind-senses': 'Senses',
    'heightened-senses': 'Senses',

    // Defenses (Resistances/Immunities/Advantages on Saves)
    'dwarven-resilience': 'Defenses',
    'stout-resilience': 'Defenses',
    'hellish-resistance': 'Defenses',
    'damage-resistance': 'Defenses',
    'gnomish-cunning': 'Defenses',
    'fey-ancestry': 'Defenses',
    'brave': 'Defenses',
    'magic-resistance': 'Defenses',
    'constructed-resilience': 'Defenses',
    'necrotic-resistance': 'Defenses',
    'celestial-resistance': 'Defenses',
    'fire-resistance': 'Defenses',
    'acid-resistance': 'Defenses',
    'mountain-born': 'Defenses',
    'guardians-of-the-depths': 'Defenses',
    'mental-discipline': 'Defenses',
    'draconic-resistance': 'Defenses',
    'deathless-nature': 'Defenses',
    'natural-resilience': 'Defenses',
    'mechanical-nature': 'Defenses',
    'fearless': 'Defenses',
    'hunters-bane': 'Defenses',
    'hardened-soul': 'Defenses',

    // Movement
    'flight': 'Movement',
    'swim': 'Movement',
    'spider-climb': 'Movement',
    'fleet-of-foot': 'Movement',
    'feline-agility': 'Movement',
    'nimbleness': 'Movement',
    'earth-walk': 'Movement',
    'mobile': 'Movement',
    'gem-flight': 'Movement',

    // Special Actions
    'breath-weapon': 'Actions',
    'breath-weapon-fizban': 'Actions',
    'healing-hands': 'Actions',
    'radiant-soul': 'Actions',
    'necrotic-shroud': 'Actions',
    'radiant-consumption': 'Actions',
    'hidden-step': 'Actions',
    'shifting': 'Actions',
    'hungry-jaws': 'Actions',
    'fury-of-the-small': 'Actions',
    'stone-camouflage': 'Actions',
    'vampiric-bite': 'Actions',
    'starlight-step': 'Actions',
    'rabbit-hop': 'Actions',
    'crimson-rite': 'Actions',
    'blood-maledict': 'Actions',
    'hybrid-transformation': 'Actions',

    // Passives / Misc
    'stonecunning': 'Passive',
    'powerful-build': 'Passive',
    'trance': 'Passive',
    'mask-of-the-wild': 'Passive',
    'lucky': 'Passive',
    'savage-attacks': 'Passive',
    'relentless-endurance': 'Passive',
    'amphibious': 'Passive',
    'hold-breath': 'Passive',
    'natural-armor': 'Passive',
    'armored-casing': 'Passive',
    'chameleon-carapace': 'Passive',
    'dark-augmentation': 'Passive',
    'grim-psychometry': 'Passive',
    'brand-of-castigation': 'Passive',
    'brand-of-tethering': 'Passive'
};

export const getTraitCategory = (index: string): TraitBucket => {
    return TRAIT_CATEGORY_MAP[index] || 'Passive';
};
