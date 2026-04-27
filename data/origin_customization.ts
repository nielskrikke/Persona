
export const SIMPLE_WEAPONS = [
    "Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "Light hammer", "Mace", "Quarterstaff", "Sickle", "Spear",
    "Crossbow, light", "Dart", "Shortbow", "Sling"
];

export const MARTIAL_WEAPONS = [
    "Battleaxe", "Flail", "Glaive", "Greataxe", "Greatsword", "Halberd", "Lance", "Longsword", "Maul", "Morningstar",
    "Pike", "Rapier", "Scimitar", "Shortsword", "Trident", "War pick", "Warhammer", "Whip",
    "Blowgun", "Crossbow, hand", "Crossbow, heavy", "Longbow", "Net"
];

export const TOOLS = [
    "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools", "Cartographer's tools",
    "Cobbler's tools", "Cook's utensils", "Glassblower's tools", "Jeweler's tools", "Leatherworker's tools",
    "Mason's tools", "Painter's supplies", "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools",
    "Woodcarver's tools", "Disguise kit", "Forgery kit", "Herbalism kit", "Navigator's tools", "Poisoner's kit",
    "Thieves' tools", "Dice set", "Dragonchess set", "Playing card set", "Three-Dragon Ante set",
    "Bagpipes", "Drum", "Dulcimer", "Flute", "Lute", "Lyre", "Horn", "Pan flute", "Shawm", "Viol",
    "Navigator's tools", "Vehicles (land)", "Vehicles (water)"
];

export const SKILLS = [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation",
    "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand",
    "Stealth", "Survival"
];

export const LANGUAGES = [
    "Abyssal", "Aquan", "Auran", "Celestial", "Common", "Deep Speech", "Draconic", "Dwarvish", "Elvish", "Giant",
    "Gnomish", "Goblin", "Halfling", "Ignan", "Infernal", "Orc", "Primordial", "Sylvan", "Terran", "Undercommon"
];

export type ProficiencyType = 'skill' | 'simple_weapon' | 'martial_weapon' | 'tool';

export const getProficiencyType = (prof: string): ProficiencyType | null => {
    if (SKILLS.includes(prof)) return 'skill';
    if (SIMPLE_WEAPONS.includes(prof)) return 'simple_weapon';
    if (MARTIAL_WEAPONS.includes(prof)) return 'martial_weapon';
    if (TOOLS.includes(prof)) return 'tool';
    return null;
};

export const getAllowedSwaps = (type: ProficiencyType): string[] => {
    switch (type) {
        case 'skill':
            return SKILLS;
        case 'simple_weapon':
            return [...SIMPLE_WEAPONS, ...TOOLS];
        case 'martial_weapon':
            return [...SIMPLE_WEAPONS, ...MARTIAL_WEAPONS, ...TOOLS];
        case 'tool':
            return [...TOOLS, ...SIMPLE_WEAPONS];
        default:
            return [];
    }
};
