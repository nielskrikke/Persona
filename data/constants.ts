import { calculateModifier } from '@/utils/rules';
import { RuleEntry } from '@/types';

export const WIDGET_LABELS: Record<string, string> = {
    features: 'Class Features',
    saves: 'Saving Throws',
    skills: 'Skills',
    proficiencies: 'Proficiencies',
    spells: 'Spells (Compact)',
    inventory: 'Inventory (Compact)',
    actions: 'Actions (Compact)',
    rules: 'Rules (Compact)',
    senses: 'Senses',
    movement: 'Movement',
    defenses: 'Defenses',
    conditions: 'Condition Tracker',
    hitDice: 'Hit Dice Tracker',
    concentration: 'Concentration',
    familiar: 'Familiar',
    eldritchCannon: 'Eldritch Cannon',
    steelDefender: 'Steel Defender'
};

export const WIDGET_METADATA: Record<string, { icon: string, desc: string, color: string }> = {
    features: { icon: '★', desc: 'Track usage of Rage, Bardic Inspiration, Channel Divinity, Grit, etc.', color: 'text-yellow-400' },
    saves: { icon: '🛡️', desc: 'Quick roll buttons for all Saving Throws.', color: 'text-gray-300' },
    skills: { icon: '✋', desc: 'Full list of skills with proficiency indicators and roll buttons.', color: 'text-gray-300' },
    proficiencies: { icon: '⚒️', desc: 'List of armor, weapons, tools, and languages known.', color: 'text-orange-300' },
    spells: { icon: '✨', desc: 'Compact list of prepared spells and available slots.', color: 'text-purple-400' },
    inventory: { icon: '🎒', desc: 'Money tracker and list of equipped items.', color: 'text-amber-600' },
    actions: { icon: '⚔️', desc: 'Quick access to Attacks and common combat actions.', color: 'text-red-400' },
    rules: { icon: '📖', desc: 'Quick reference for conditions and general rules.', color: 'text-blue-300' },
    senses: { icon: '👁️', desc: 'Passive Perception, Investigation, Insight, and Darkvision.', color: 'text-emerald-400' },
    movement: { icon: '🦶', desc: 'Walking, flying, swimming, and climbing speeds.', color: 'text-white' },
    defenses: { icon: '🏰', desc: 'List of damage resistances, immunities, and vulnerabilities.', color: 'text-slate-400' },
    conditions: { icon: '⚠️', desc: 'Toggle active conditions like Poisoned, Stunned, etc.', color: 'text-red-500' },
    hitDice: { icon: '❤️', desc: 'Track and spend Hit Dice during short rests.', color: 'text-red-400' },
    concentration: { icon: '🧠', desc: 'Track active concentration spell and roll CON saves.', color: 'text-blue-500' },
    familiar: { icon: '🐈', desc: 'Manage and view your active familiar companion.', color: 'text-pink-400' },
    eldritchCannon: { icon: '⚙️', desc: 'Artillerist Artificer companion with specific weapon modes.', color: 'text-cyan-400' },
    steelDefender: { icon: '🐺', desc: 'Battle Smith companion that protects and attacks.', color: 'text-orange-400' }
};

export const DEFAULT_LAYOUT: { left: string[], right: string[], mobile: string[] } = {
    left: [],
    right: [],
    mobile: ['actions', 'spells', 'inventory', 'saves', 'hitDice']
};

export const ALL_WIDGETS = Object.keys(WIDGET_LABELS);

export const STANDARD_CONDITIONS = [
    "Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened", "Grappled", 
    "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", 
    "Restrained", "Stunned", "Unconscious"
];

export const STANDARD_LANGUAGES = [
    "Abyssal", "Aquan", "Auran", "Celestial", "Common", "Deep Speech", "Draconic", 
    "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin", "Halfling", "Ignan", 
    "Infernal", "Orc", "Primordial", "Sylvan", "Terran", "Undercommon"
];

export const CLASS_FEATURES: Record<string, {name: string, formula: (level: number, stats: any) => number, reset: 'short' | 'long'}> = {
    'Bard': { name: 'Bardic Inspiration', reset: 'long', formula: (l, s) => Math.max(1, calculateModifier(s.cha)) },
    'Barbarian': { name: 'Rages', reset: 'long', formula: (l) => l < 3 ? 2 : l < 6 ? 3 : l < 12 ? 4 : l < 17 ? 5 : 6 },
    'Fighter': { name: 'Second Wind', reset: 'short', formula: (l) => l < 4 ? 2 : l < 10 ? 3 : 4 },
    'Druid': { name: 'Wild Shape', reset: 'short', formula: (l) => l < 6 ? 2 : l < 17 ? 3 : 4 },
    'Monk': { name: 'Focus Points', reset: 'short', formula: (l) => l < 2 ? 0 : l },
    'Paladin': { name: 'Lay on Hands', reset: 'long', formula: (l) => l * 5 },
    'Sorcerer': { name: 'Sorcery Points', reset: 'long', formula: (l) => l < 2 ? 0 : l },
    'Cleric': { name: 'Channel Divinity', reset: 'short', formula: (l) => l < 2 ? 0 : l < 6 ? 2 : l < 18 ? 3 : 4 },
    'Paladin-CD': { name: 'Channel Divinity', reset: 'short', formula: (l) => l < 3 ? 0 : l < 11 ? 2 : 3 },
    'Ranger': { name: 'Favored Enemy', reset: 'long', formula: (l) => l < 5 ? 2 : l < 9 ? 3 : l < 13 ? 4 : l < 17 ? 5 : 6 },
    'Rogue': { name: 'Stroke of Luck', reset: 'short', formula: (l) => l < 20 ? 0 : 1 },
    'Gunslinger': { name: 'Grit', reset: 'short', formula: (l, s) => Math.max(1, calculateModifier(s.wis)) },
    'Commander': { name: 'Influence', reset: 'long', formula: (l) => 2 },
    'Arrowsmith': { name: 'Arrow Crafting', reset: 'short', formula: (l) => {
        // Correct progression for Crafting Capacity (column "Custom Arrows")
        const craftMap: Record<number, number> = {
            1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10,
            11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15
        };
        return craftMap[l] || 0;
    }},
};

export const STANDARD_ACTIONS = [
    { name: 'Attack', desc: 'Perform one attack with a weapon or unarmed strike. If you have the Extra Attack feature, you can attack more than once.' },
    { name: 'Dash', desc: 'Gain extra movement equal to your speed for the current turn.' },
    { name: 'Disengage', desc: 'Your movement does not provoke opportunity attacks for the rest of the turn.' },
    { name: 'Dodge', desc: 'Until start of next turn, attacks against you have disadvantage, and you have advantage on Dex saves.' },
    { name: 'Grapple', desc: "Special melee attack. Make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics). Success: Target is Grappled (speed 0)." },
    { name: 'Help', desc: 'Give an ally advantage on the next ability check or attack roll they make before the start of your next turn.' },
    { name: 'Hide', desc: 'Make a Dexterity (Stealth) check vs enemy Wisdom (Perception). You must have cover or be heavily obscured.' },
    { name: 'Ready', desc: 'Wait for a specific trigger to perform an action using your reaction (e.g., "If the goblin steps out, I shoot").' },
    { name: 'Search', desc: 'Devote your attention to finding something. Depending on the nature of your search, the DM might call for a Wisdom (Perception) or Intelligence (Investigation) check.' },
    { name: 'Shove', desc: "Special melee attack. Make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics). Success: Knock target prone or push them 5 feet away." },
    { name: 'Use an Object', desc: 'Interact with an object (e.g., drink a potion, pull a lever) beyond your one free interaction.' },
    { name: 'Improvise', desc: 'Do something not covered by other actions. The DM determines the check required.' },
];

export const SPELL_SCHOOLS = [
    "Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"
];

export const STATIC_RULES: RuleEntry[] = [
    { name: 'Attack', category: 'Action', desc: 'Make a melee or ranged attack. See your equipment for details.' },
    { name: 'Cast a Spell', category: 'Action', desc: 'Cast a spell with a casting time of 1 action.' },
    { name: 'Dash', category: 'Action', desc: 'Gain extra movement equal to your speed for the current turn.' },
    { name: 'Disengage', category: 'Action', desc: 'Your movement does not provoke opportunity attacks for the rest of the turn.' },
    { name: 'Dodge', category: 'Action', desc: 'Until the start of your next turn, attack rolls against you have disadvantage if you can see the attacker, and you have advantage on Dex saves.' },
    { name: 'Help', category: 'Action', desc: 'Give an ally advantage on the next ability check or attack roll they make before the start of your next turn.' },
    { name: 'Hide', category: 'Action', desc: "Make a Stealth check to contest an enemy's Perception. You must have cover or be obscured." },
    { name: 'Ready', category: 'Action', desc: 'Wait for a specific trigger to perform a reaction.' },
    { name: 'Search', category: 'Action', desc: 'Devote your attention to finding something (Perception/Investigation check).' },
    { name: 'Weapon Mastery', category: 'Rules', desc: 'Special properties triggered by weapon attacks (e.g., Cleave, Graze, Topple).' },
    { name: 'Use a Magic Item', category: 'Action', desc: 'Activate a magic item that requires an action.' },
    { name: 'Use a Special Ability', category: 'Action', desc: 'Use a class feature or racial trait that requires an action.' },
    { name: 'Use an Object', category: 'Action', desc: 'Interact with an object (e.g., drink a potion, pull a lever) beyond your one free interaction.' },
    { name: 'Blinded', category: 'Condition', desc: 'Fail checks involving sight. Attacks have disadvantage. Enemy attacks have advantage.' },
    { name: 'Charmed', category: 'Condition', desc: 'Cannot attack the charmer. Charmer has advantage on social checks against you.' },
    { name: 'Deafened', category: 'Condition', desc: 'Fail checks involving hearing.' },
    { name: 'Frightened', category: 'Condition', desc: 'Disadvantage on checks/attacks while source of fear is visible. Cannot move closer to source.' },
    { name: 'Grappled', category: 'Condition', desc: 'Speed becomes 0.' },
    { name: 'Incapacitated', category: 'Condition', desc: 'Cannot take actions or reactions.' },
    { name: 'Invisible', category: 'Condition', desc: 'Unseen. Attacks have advantage. Enemy attacks have disadvantage.' },
    { name: 'Paralyzed', category: 'Condition', desc: 'Incapacitated. Can\'t move/speak. Auto-fail Str/Dex saves. Attacks within 5ft are auto-crits.' },
    { name: 'Petrified', category: 'Condition', desc: 'Turned to stone. Incapacitated. Resistance to all damage. Poison/Disease suspended.' },
    { name: 'Poisoned', category: 'Condition', desc: 'Disadvantage on attack rolls and ability checks.' },
    { name: 'Prone', category: 'Condition', desc: 'Crawling costs extra movement. Disadvantage on melee attacks. Attacks against you have advantage within 5ft, disadvantage otherwise.' },
    { name: 'Restrained', category: 'Condition', desc: 'Speed 0. Attacks have disadvantage. Enemy attacks have advantage. Disadvantage on Dex saves.' },
    { name: 'Stunned', category: 'Condition', desc: 'Incapacitated. Can\'t move/speak. Fail Str/Dex saves. Enemy attacks have advantage.' },
    { name: 'Unconscious', category: 'Condition', desc: 'Incapacitated. Drop what you\'re holding. Fall prone. Fail Str/Dex saves. Attacks within 5ft are auto-crits.' },
    { name: 'Armor', category: 'Rules', desc: 'Wearing armor you are not proficient in imposes disadvantage on Str/Dex checks and makes you unable to cast spells.' },
    { name: 'Blindsight', category: 'Rules', desc: 'Perceive surroundings without sight within a specific radius.' },
    { name: 'Climbing', category: 'Rules', desc: 'Costs 1 extra foot of movement per foot moved. May require Athletics check.' },
    { name: 'Concentration', category: 'Rules', desc: 'Maintained for spells. Ends if you cast another concentration spell, take damage (CON save DC 10 or half dmg), or are incapacitated.' },
    { name: 'Cover', category: 'Rules', desc: 'Half Cover: +2 AC/Dex Saves. Three-Quarters: +5 AC/Dex Saves. Total: Can\'t be targeted directly.' },
    { name: 'Crawling', category: 'Rules', desc: 'Movement while prone costs 1 extra foot per foot moved.' },
    { name: 'Darkvision', category: 'Rules', desc: 'See in dim light as bright, and darkness as dim (shades of gray).' },
    { name: 'Encumbrance', category: 'Rules', desc: 'Carrying capacity is Str score * 15 lbs. Path/Drag/Lift is Str * 30 lbs.' },
    { name: 'Exhaustion', category: 'Rules', desc: 'Cumulative levels: 1) Disadv on checks 2) Speed halved 3) Disadv on attacks/saves 4) HP max halved 5) Speed 0 6) Death.' },
    { name: 'Falling', category: 'Rules', desc: '1d6 bludgeoning damage for every 10ft fallen (max 20d6). Land prone unless you avoid damage.' },
    { name: 'High Jump', category: 'Rules', desc: '3 + Str Mod feet (with 10ft run). Half that without run.' },
    { name: 'Inspiration', category: 'Rules', desc: 'Spend to gain advantage on an attack roll, saving throw, or ability check.' },
    { name: 'Long Jump', category: 'Rules', desc: 'Distance equal to Strength score (with 10ft run). Half without run.' },
    { name: 'Long Rest', category: 'Rules', desc: '8 hours (6 sleep). Regain all HP and half max Hit Dice. Restore spell slots.' },
    { name: 'Obscured Areas', category: 'Rules', desc: 'Lightly Obscured: Disadvantage on Perception (sight). Heavily Obscured: Effectively blinded.' },
    { name: 'Put Armor On/Off', category: 'Rules', desc: 'Light: 1 min. Medium: 5 mins. Heavy: 10 mins. Shield: 1 action.' },
    { name: 'Short Rest', category: 'Rules', desc: '1 hour. Spend Hit Dice to regain HP.' },
    { name: 'Suffocating', category: 'Rules', desc: 'Hold breath for 1 + Con Mod minutes (min 30 sec). Then survive Con Mod rounds before dropping to 0 HP.' },
    { name: 'Swimming', category: 'Rules', desc: 'Costs 1 extra foot of movement per foot moved unless you have a skip speed.' },
    { name: 'Travel Pace', category: 'Rules', desc: 'Fast: 30 miles/day (-5 passive percep). Normal: 24 miles/day. Slow: 18 miles/day (able to stealth).' },
    { name: 'Truesight', category: 'Rules', desc: 'See in normal/magical darkness, see invisible, detect illusions, see shapechangers, see into Ethereal Plane.' },
    { name: 'Underwater Combat', category: 'Rules', desc: 'Melee attacks have disadvantage unless using dagger, javelin, shortsword, spear, trident. Ranged auto-miss beyond normal range.' },
    { name: 'Unseen Attackers', category: 'Rules', desc: 'Advantage on attacks against targets that can\'t see you. Disadvantage on attacks against targets you can\'t see.' },
];