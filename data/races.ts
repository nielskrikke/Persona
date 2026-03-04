
import { RaceDetail, SubraceDetail, ItemModifier, APIReference } from '../types';

export interface ExtendedRaceDetail extends RaceDetail {
    source: string;
    traits: { index: string; name: string; url: string; desc: string[], modifiers?: ItemModifier[] }[];
    subraces_details?: ExtendedSubraceDetail[];
    language_options?: any;
}

export interface ExtendedSubraceDetail extends SubraceDetail {
    source: string;
    traits: { index: string; name: string; url: string; desc: string[], modifiers?: ItemModifier[] }[];
    race?: string | APIReference;
}

export const RACES: ExtendedRaceDetail[] = [
    // --- PLAYER'S HANDBOOK ---
    {
        index: "dwarf",
        name: "Dwarf",
        source: "Player's Handbook",
        speed: 25,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }],
        alignment: "Most dwarves are lawful, believing firmly in the benefits of a well-ordered society.",
        age: "Dwarves mature at 18 and live about 350 years.",
        size: "Medium",
        size_description: "Dwarves stand between 4 and 5 feet tall. Your size is Medium.",
        language_desc: "You can speak, read, and write Common and Dwarvish.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "dwarvish", name: "Dwarvish", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "dwarven-resilience", 
                name: "Dwarven Resilience", 
                url: "", 
                desc: ["Advantage on saving throws against poison, and resistance against poison damage."],
                modifiers: [
                    { type: 'resistance', target: 'resistance', value: 'Poison' },
                    { type: 'advantage', target: 'saves', value: 1, filter: 'Poison' }
                ]
            },
            { index: "stonecunning", name: "Stonecunning", url: "", desc: ["Double proficiency bonus on History checks related to stonework."] }
        ],
        subraces_details: [
            {
                index: "hill-dwarf",
                name: "Hill Dwarf",
                source: "Player's Handbook",
                race: { index: "dwarf", name: "Dwarf", url: "" },
                desc: ["As a hill dwarf, you have keen senses and remarkable resilience."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "dwarven-toughness", 
                        name: "Dwarven Toughness", 
                        url: "", 
                        desc: ["Your hit point maximum increases by 1, and it increases by 1 every time you gain a level."],
                        modifiers: [{ type: 'bonus', target: 'hp_per_level', value: 1 }]
                    }
                ]
            },
            {
                index: "mountain-dwarf",
                name: "Mountain Dwarf",
                source: "Player's Handbook",
                race: { index: "dwarf", name: "Dwarf", url: "" },
                desc: ["Strong and hardy, accustomed to a difficult life in rugged terrain."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }],
                starting_proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }],
                languages: [],
                traits: [
                    { index: "dwarven-armor-training", name: "Dwarven Armor Training", url: "", desc: ["You have proficiency with light and medium armor."] }
                ]
            },
            {
                index: "duergar",
                name: "Duergar",
                source: "Mordenkainen's Tome of Foes",
                race: { index: "dwarf", name: "Dwarf", url: "" },
                desc: ["Grim and ashen-skinned dwarves of the Underdark."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [{ index: "undercommon", name: "Undercommon", url: "" }],
                traits: [
                    { 
                        index: "superior-darkvision", 
                        name: "Superior Darkvision", 
                        url: "", 
                        desc: ["Your darkvision has a radius of 120 feet."],
                        modifiers: [{ type: 'set', target: 'darkvision', value: 120 }]
                    },
                    { index: "duergar-magic", name: "Duergar Magic", url: "", desc: ["You can cast Enlarge/Reduce and Invisibility on yourself once per long rest (starting at level 3/5)."] },
                    { index: "sunlight-sensitivity", name: "Sunlight Sensitivity", url: "", desc: ["Disadvantage on attack rolls and Perception (sight) checks while in direct sunlight."] }
                ]
            }
        ]
    },
    {
        index: "elf",
        name: "Elf",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }],
        alignment: "Elves love freedom and self-expression, leaning toward chaotic good.",
        age: "Elves can live to be 750 years old.",
        size: "Medium",
        size_description: "Elves range from under 5 to over 6 feet tall. Your size is Medium.",
        language_desc: "You can speak, read, and write Common and Elvish.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "elvish", name: "Elvish", url: "" }],
        traits: [
            { index: "keen-senses", name: "Keen Senses", url: "", desc: ["Proficiency in the Perception skill."] },
            { 
                index: "fey-ancestry", 
                name: "Fey Ancestry", 
                url: "", 
                desc: ["Advantage vs Charmed; magic can't put you to sleep."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Charmed' }, { type: 'immunity', target: 'immunity', value: 'Sleep (Magic)' }]
            },
            { index: "trance", name: "Trance", url: "", desc: ["Meditation for 4 hours instead of sleep."] },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            }
        ],
        subraces_details: [
            {
                index: "high-elf",
                name: "High Elf",
                source: "Player's Handbook",
                race: { index: "elf", name: "Elf", url: "" },
                desc: ["Studious and masters of magic."],
                ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "longsword", name: "Longsword", url: "" }, { index: "shortbow", name: "Shortbow", url: "" }],
                languages: [],
                traits: [{ index: "elf-cantrip", name: "Cantrip", url: "", desc: ["You know one cantrip of your choice from the wizard spell list."] }]
            },
            {
                index: "wood-elf",
                name: "Wood Elf",
                source: "Player's Handbook",
                race: { index: "elf", name: "Elf", url: "" },
                desc: ["Keen senses and intuition, fleet of foot."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "fleet-of-foot", 
                        name: "Fleet of Foot", 
                        url: "", 
                        desc: ["Base walking speed increases to 35 feet."],
                        modifiers: [{ type: 'bonus', target: 'speed', value: 5 }]
                    },
                    { index: "mask-of-the-wild", name: "Mask of the Wild", url: "", desc: ["Can hide when only lightly obscured by natural phenomena."] }
                ]
            },
            {
                index: "drow",
                name: "Drow (Dark Elf)",
                source: "Player's Handbook",
                race: { index: "elf", name: "Elf", url: "" },
                desc: ["At home in the Underdark, drow are adapted to a life of shadows."],
                ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "rapier", name: "Rapier", url: "" }, { index: "shortsword", name: "Shortsword", url: "" }, { index: "hand-crossbow", name: "Hand Crossbow", url: "" }],
                languages: [],
                traits: [
                    { 
                        index: "superior-darkvision", 
                        name: "Superior Darkvision", 
                        url: "", 
                        desc: ["Darkvision 120 ft."],
                        modifiers: [{ type: 'set', target: 'darkvision', value: 120 }]
                    },
                    { index: "sunlight-sensitivity", name: "Sunlight Sensitivity", url: "", desc: ["Disadvantage on attacks/perception in direct sunlight."] },
                    { index: "drow-magic", name: "Drow Magic", url: "", desc: ["Dancing Lights cantrip. Faerie Fire (L3). Darkness (L5)."] }
                ]
            },
            {
                index: "shadar-kai",
                name: "Shadar-kai",
                source: "Mordenkainen's Tome of Foes",
                race: { index: "elf", name: "Elf", url: "" },
                desc: ["Elves of the Shadowfell, serving the Raven Queen."],
                ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "necrotic-resistance", 
                        name: "Necrotic Resistance", 
                        url: "", 
                        desc: ["Resistance to necrotic damage."],
                        modifiers: [{ type: 'resistance', target: 'resistance', value: 'Necrotic' }]
                    },
                    { index: "blessing-of-the-raven-queen", name: "Blessing of the Raven Queen", url: "", desc: ["Bonus Action: Teleport 30ft to unoccupied space you can see. (Long Rest)"] }
                ]
            }
        ]
    },
    {
        index: "halfling",
        name: "Halfling",
        source: "Player's Handbook",
        speed: 25,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }],
        alignment: "Most halflings are lawful good. As a rule, they are good-hearted and kind.",
        age: "A halfling reaches adulthood at the age of 20 and generally lives into the middle of his or her second century.",
        size: "Small",
        size_description: "Halflings average about 3 feet tall and weigh about 40 pounds. Your size is Small.",
        language_desc: "You can speak, read, and write Common and Halfling.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "halfling", name: "Halfling", url: "" }],
        traits: [
            { index: "lucky", name: "Lucky", url: "", desc: ["When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll."] },
            { 
                index: "brave", 
                name: "Brave", 
                url: "", 
                desc: ["You have advantage on saving throws against being frightened."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Frightened' }]
            },
            { index: "halfling-nimbleness", name: "Halfling Nimbleness", url: "", desc: ["You can move through the space of any creature that is of a size larger than yours."] }
        ],
        subraces_details: [
            {
                index: "lightfoot-halfling",
                name: "Lightfoot",
                source: "Player's Handbook",
                race: { index: "halfling", name: "Halfling", url: "" },
                desc: ["As a lightfoot halfling, you can easily hide from sight, even using other people as cover."],
                ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [{ index: "naturally-stealthy", name: "Naturally Stealthy", url: "", desc: ["You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you."] }]
            },
            {
                index: "stout-halfling",
                name: "Stout",
                source: "Player's Handbook",
                race: { index: "halfling", name: "Halfling", url: "" },
                desc: ["As a stout halfling, you're hardier than average and have some resistance to poison."],
                ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "stout-resilience", 
                        name: "Stout Resilience", 
                        url: "", 
                        desc: ["You have advantage on saving throws against poison, and you have resistance against poison damage."],
                        modifiers: [
                            { type: 'resistance', target: 'resistance', value: 'Poison' },
                            { type: 'advantage', target: 'saves', value: 1, filter: 'Poison' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        index: "human",
        name: "Human",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [
            { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 },
            { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 },
            { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 },
            { ability_score: { index: "int", name: "INT", url: "" }, bonus: 1 },
            { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 },
            { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }
        ],
        alignment: "Humans tend toward no particular alignment. The best and the worst are found among them.",
        age: "Humans reach adulthood in their late teens and live less than a century.",
        size: "Medium",
        size_description: "Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Your size is Medium.",
        language_desc: "You can speak, read, and write Common and one extra language of your choice.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "ability-score-increase-human", name: "Ability Score Increase", url: "", desc: ["Your ability scores each increase by 1."] }
        ]
    },
    {
        index: "dragonborn",
        name: "Dragonborn",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Dragonborn tend toward extremes.",
        age: "Mature at 15, live to about 80.",
        size: "Medium",
        size_description: "Over 6 feet tall, averaging 250 pounds.",
        language_desc: "Common and Draconic.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "draconic", name: "Draconic", url: "" }],
        traits: [
            { index: "draconic-ancestry", name: "Draconic Ancestry", url: "", desc: ["Choose a dragon type for damage resistance and breath weapon."] },
            { index: "breath-weapon", name: "Breath Weapon", url: "", desc: ["Exhale destructive energy in a 15ft cone or 30ft line."] },
            { 
                index: "damage-resistance", 
                name: "Damage Resistance", 
                url: "", 
                desc: ["Resistance to damage type associated with your ancestry."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Draconic Ancestry' }]
            }
        ]
    },
    {
        index: "gnome",
        name: "Gnome",
        source: "Player's Handbook",
        speed: 25,
        ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 2 }],
        alignment: "Gnomes are most often good.",
        age: "Mature at 40, live 350-500 years.",
        size: "Small",
        size_description: "3-4 feet tall, 40 pounds.",
        language_desc: "Common and Gnomish.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "gnomish", name: "Gnomish", url: "" }],
        traits: [
            { 
                index: "gnomish-cunning", 
                name: "Gnomish Cunning", 
                url: "", 
                desc: ["You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Int/Wis/Cha vs Magic' }]
            },
            {
                index: "darkvision",
                name: "Darkvision",
                url: "",
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            }
        ],
        subraces_details: [
            {
                index: "rock-gnome",
                name: "Rock Gnome",
                source: "Player's Handbook",
                race: { index: "gnome", name: "Gnome", url: "" },
                desc: ["Inventive and hardy."],
                ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { index: "artificers-lore", name: "Artificer’s Lore", url: "", desc: ["Double proficiency on History checks related to magic items, alchemical objects, or technological devices."] },
                    { index: "tinker", name: "Tinker", url: "", desc: ["Construct tiny clockwork devices."] }
                ]
            },
            {
                index: "forest-gnome",
                name: "Forest Gnome",
                source: "Player's Handbook",
                race: { index: "gnome", name: "Gnome", url: "" },
                desc: ["Stealthy and close to nature."],
                ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { index: "natural-illusionist", name: "Natural Illusionist", url: "", desc: ["You know the Minor Illusion cantrip. Intelligence is your spellcasting modifier."] },
                    { index: "speak-with-small-beasts", name: "Speak with Small Beasts", url: "", desc: ["Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts."] }
                ]
            },
            {
                index: "deep-gnome",
                name: "Svirfneblin (Deep Gnome)",
                source: "Mordenkainen's Tome of Foes",
                race: { index: "gnome", name: "Gnome", url: "" },
                desc: ["Guarded, suspicious, and resentful of the surface world."],
                ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "superior-darkvision", 
                        name: "Superior Darkvision", 
                        url: "", 
                        desc: ["Darkvision 120ft."],
                        modifiers: [{ type: 'set', target: 'darkvision', value: 120 }]
                    },
                    { index: "stone-camouflage", name: "Stone Camouflage", url: "", desc: ["Advantage on Stealth checks to hide in rocky terrain."] }
                ]
            }
        ]
    },
    {
        index: "half-elf",
        name: "Half-Elf",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }], // +1 to any other
        alignment: "Chaotic bent, valuing freedom.",
        age: "Mature at 20, live 180+ years.",
        size: "Medium",
        size_description: "5-6 feet tall.",
        language_desc: "Common, Elvish, and one extra.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "elvish", name: "Elvish", url: "" }],
        language_options: 1,
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "fey-ancestry", 
                name: "Fey Ancestry", 
                url: "", 
                desc: ["Advantage vs Charmed, magic can't put you to sleep."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Charmed' }, { type: 'immunity', target: 'immunity', value: 'Sleep (Magic)' }]
            },
            { index: "skill-versatility", name: "Skill Versatility", url: "", desc: ["You gain proficiency in two skills of your choice."] }
        ]
    },
    {
        index: "half-orc",
        name: "Half-Orc",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Tend toward chaos, not often good.",
        age: "Mature at 14, live ~75 years.",
        size: "Medium",
        size_description: "Larger and bulkier than humans.",
        language_desc: "Common and Orc.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "orc", name: "Orc", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "menacing", name: "Menacing", url: "", desc: ["You gain proficiency in the Intimidation skill."] },
            { index: "relentless-endurance", name: "Relentless Endurance", url: "", desc: ["When reduced to 0 HP but not killed outright, drop to 1 HP instead. (1/Long Rest)"] },
            { index: "savage-attacks", name: "Savage Attacks", url: "", desc: ["When you score a critical hit with a melee weapon attack, roll one of the weapon’s damage dice one additional time."] }
        ]
    },
    {
        index: "tiefling",
        name: "Tiefling",
        source: "Player's Handbook",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 1 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }],
        alignment: "Tend toward chaotic, sometimes evil.",
        age: "Same as humans, live slightly longer.",
        size: "Medium",
        size_description: "Same size/shape as humans.",
        language_desc: "Common and Infernal.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "infernal", name: "Infernal", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "hellish-resistance", 
                name: "Hellish Resistance", 
                url: "", 
                desc: ["Resistance to fire damage."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Fire' }]
            },
            { index: "infernal-legacy", name: "Infernal Legacy", url: "", desc: ["Know Thaumaturgy cantrip; Hellish Rebuke (L3), Darkness (L5)."] }
        ]
    },
    
    // --- VOLO'S GUIDE TO MONSTERS / MORDENKAINEN'S ---
    {
        index: "aasimar",
        name: "Aasimar",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }],
        alignment: "Often good.",
        age: "Up to 160 years.",
        size: "Medium",
        size_description: "Similar to humans.",
        language_desc: "Common and Celestial.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "celestial", name: "Celestial", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "celestial-resistance", 
                name: "Celestial Resistance", 
                url: "", 
                desc: ["Resistance to necrotic and radiant damage."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Necrotic' }, { type: 'resistance', target: 'resistance', value: 'Radiant' }]
            },
            { index: "healing-hands", name: "Healing Hands", url: "", desc: ["Action: Touch creature to heal HP equal to your level. (1/Long Rest)"] },
            { index: "light-bearer", name: "Light Bearer", url: "", desc: ["You know the Light cantrip. Charisma is your spellcasting ability."] }
        ],
        subraces_details: [
            {
                index: "protector-aasimar",
                name: "Protector Aasimar",
                source: "Volo's Guide to Monsters",
                race: { index: "aasimar", name: "Aasimar", url: "" },
                desc: ["Charged with holy power to protect the weak."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [{ index: "radiant-soul", name: "Radiant Soul", url: "", desc: ["Starting at 3rd level, use action to unleash divine energy. Fly speed 30, deal extra radiant damage equal to level. Lasts 1 minute. (1/Long Rest)"] }]
            },
            {
                index: "scourge-aasimar",
                name: "Scourge Aasimar",
                source: "Volo's Guide to Monsters",
                race: { index: "aasimar", name: "Aasimar", url: "" },
                desc: [" imbued with a divine energy that blazes intensely."],
                ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [{ index: "radiant-consumption", name: "Radiant Consumption", url: "", desc: ["Starting at 3rd level, use action to radiate light. Deal radiant damage to self and others within 10ft. Deal extra damage on attacks. Lasts 1 minute. (1/Long Rest)"] }]
            },
            {
                index: "fallen-aasimar",
                name: "Fallen Aasimar",
                source: "Volo's Guide to Monsters",
                race: { index: "aasimar", name: "Aasimar", url: "" },
                desc: ["Touched by dark powers or fallen from grace."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [{ index: "necrotic-shroud", name: "Necrotic Shroud", url: "", desc: ["Starting at 3rd level, use action to frighten nearby creatures (Charisma save). Deal extra necrotic damage on attacks. Lasts 1 minute. (1/Long Rest)"] }]
            }
        ]
    },
    {
        index: "firbolg",
        name: "Firbolg",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 2 }, { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
        alignment: "Neutral Good.",
        age: "Live up to 500 years.",
        size: "Medium",
        size_description: "7 to 8 feet tall.",
        language_desc: "Common, Elvish, Giant.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "elvish", name: "Elvish", url: "" }, { index: "giant", name: "Giant", url: "" }],
        traits: [
            { index: "firbolg-magic", name: "Firbolg Magic", url: "", desc: ["Cast Detect Magic and Disguise Self once per short or long rest."] },
            { index: "hidden-step", name: "Hidden Step", url: "", desc: ["Bonus Action: Turn invisible until start of next turn or until you attack/cast. (1/Short Rest)"] },
            { index: "powerful-build", name: "Powerful Build", url: "", desc: ["Count as one size larger for carrying capacity."] },
            { index: "speech-of-beast-and-leaf", name: "Speech of Beast and Leaf", url: "", desc: ["Communicate with beasts and plants (they understand you, you don't necessarily understand them)."] }
        ]
    },
    {
        index: "goliath",
        name: "Goliath",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Lawful Neutral.",
        age: "Similar to humans.",
        size: "Medium",
        size_description: "Between 7 and 8 feet tall.",
        language_desc: "Common, Giant.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "giant", name: "Giant", url: "" }],
        traits: [
            { index: "natural-athlete", name: "Natural Athlete", url: "", desc: ["Proficiency in Athletics."] },
            { index: "stones-endurance", name: "Stone's Endurance", url: "", desc: ["Reaction: When you take damage, roll 1d12 + Con and reduce damage by that amount. (1/Short Rest)"] },
            { index: "powerful-build", name: "Powerful Build", url: "", desc: ["Count as one size larger for carrying capacity."] },
            { 
                index: "mountain-born", 
                name: "Mountain Born", 
                url: "", 
                desc: ["Resistance to cold damage. Acclimated to high altitude."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Cold' }]
            }
        ]
    },
    {
        index: "kenku",
        name: "Kenku",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Chaotic Neutral.",
        age: "Live to ~60.",
        size: "Medium",
        size_description: "Around 5 feet tall.",
        language_desc: "Common, Auran (mimicry only).",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "auran", name: "Auran", url: "" }],
        traits: [
            { index: "expert-forgery", name: "Expert Forgery", url: "", desc: ["Advantage on copying writing/craftwork."] },
            { index: "kenku-training", name: "Kenku Training", url: "", desc: ["Proficiency in two skills: Acrobatics, Deception, Stealth, or Sleight of Hand."] },
            { index: "mimicry", name: "Mimicry", url: "", desc: ["Mimic sounds you have heard. Insight vs Deception to identify."] }
        ]
    },
    {
        index: "lizardfolk",
        name: "Lizardfolk",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Neutral.",
        age: "Live to ~60.",
        size: "Medium",
        size_description: "Bulky, 5-7 feet tall.",
        language_desc: "Common, Draconic.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "draconic", name: "Draconic", url: "" }],
        traits: [
            { 
                index: "swimming-speed-lizard",
                name: "Swimming Speed",
                url: "",
                desc: ["You have a swimming speed of 30 feet."],
                modifiers: [{ type: 'set', target: 'speed_swim', value: 30 }]
            },
            { index: "bite", name: "Bite", url: "", desc: ["Unarmed strike deals 1d6 + Str piercing damage."] },
            { index: "cunning-artisan", name: "Cunning Artisan", url: "", desc: ["Harvest bone/hide to create shield/clubs/javelins during short rest."] },
            { index: "hold-breath", name: "Hold Breath", url: "", desc: ["Hold breath for 15 minutes."] },
            { 
                index: "natural-armor", 
                name: "Natural Armor", 
                url: "", 
                desc: ["AC is 13 + Dex if not wearing armor."],
                modifiers: [{ type: 'set', target: 'ac', value: 13 }] // Note: Dex added automatically by AC calc for unarmored usually, simple base override here
            },
            { index: "hungry-jaws", name: "Hungry Jaws", url: "", desc: ["Bonus Action: Bite attack. If hit, gain temp HP equal to Con mod. (1/Short Rest)"] }
        ]
    },
    {
        index: "tabaxi",
        name: "Tabaxi",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Chaotic.",
        age: "Equivalent to humans.",
        size: "Medium",
        size_description: "Slender, 6-7 feet tall.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "feline-agility", name: "Feline Agility", url: "", desc: ["Double your speed for one turn. Must move 0 feet on a subsequent turn to use again."] },
            { 
                index: "cats-claws", 
                name: "Cat's Claws", 
                url: "", 
                desc: ["Climbing speed 20ft. Unarmed strikes deal 1d4 + Str slashing."],
                modifiers: [{ type: 'set', target: 'speed_climb', value: 20 }]
            },
            { index: "cats-talent", name: "Cat's Talent", url: "", desc: ["Proficiency in Perception and Stealth."] }
        ]
    },
    {
        index: "triton",
        name: "Triton",
        source: "Volo's Guide to Monsters",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Lawful Good.",
        age: "Live up to 200 years.",
        size: "Medium",
        size_description: "Human-sized.",
        language_desc: "Common, Primordial.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "primordial", name: "Primordial", url: "" }],
        traits: [
            { index: "amphibious", name: "Amphibious", url: "", desc: ["Breathe air and water."] },
            { 
                index: "swim", 
                name: "Swim", 
                url: "", 
                desc: ["Swimming speed 30 feet."],
                modifiers: [{ type: 'set', target: 'speed_swim', value: 30 }]
            },
            { index: "control-air-and-water", name: "Control Air and Water", url: "", desc: ["Fog Cloud (L1), Gust of Wind (L3), Wall of Water (L5). 1/Long Rest each."] },
            { 
                index: "guardians-of-the-depths", 
                name: "Guardians of the Depths", 
                url: "", 
                desc: ["Resistance to cold damage."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Cold' }]
            }
        ]
    },
    {
        index: "gith",
        name: "Gith",
        source: "Mordenkainen's Tome of Foes",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 1 }],
        alignment: "Lawful.",
        age: "Same as humans.",
        size: "Medium",
        size_description: "Taller and leaner than humans.",
        language_desc: "Common, Gith.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "gith", name: "Gith", url: "" }],
        traits: [],
        subraces_details: [
            {
                index: "githyanki",
                name: "Githyanki",
                source: "Mordenkainen's Tome of Foes",
                race: { index: "gith", name: "Gith", url: "" },
                desc: ["Aggressive martial artists from the Astral Plane."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }],
                starting_proficiencies: [{index: "light-armor", name: "Light Armor", url:""}, {index: "medium-armor", name: "Medium Armor", url:""}, {index: "shortsword", name: "Shortsword", url:""}, {index: "longsword", name: "Longsword", url:""}, {index: "greatsword", name: "Greatsword", url:""}],
                languages: [],
                traits: [
                    { index: "decadent-mastery", name: "Decadent Mastery", url: "", desc: ["Learn one language of your choice and one skill/tool proficiency."] },
                    { index: "githyanki-psionics", name: "Githyanki Psionics", url: "", desc: ["Mage Hand (invisible) cantrip. Jump (L3), Misty Step (L5). Int based."] }
                ]
            },
            {
                index: "githzerai",
                name: "Githzerai",
                source: "Mordenkainen's Tome of Foes",
                race: { index: "gith", name: "Gith", url: "" },
                desc: ["Monastic ascetics from Limbo."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 2 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "mental-discipline", 
                        name: "Mental Discipline", 
                        url: "", 
                        desc: ["Advantage on saves vs charmed and frightened."],
                        modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Charmed/Frightened' }]
                    },
                    { index: "githzerai-psionics", name: "Githzerai Psionics", url: "", desc: ["Mage Hand (invisible) cantrip. Shield (L3), Detect Thoughts (L5). Wis based."] }
                ]
            }
        ]
    },
    // --- EBERRON ---
    {
        index: "changeling",
        name: "Changeling",
        source: "Eberron: Rising from the Last War",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }], // +1 to any other
        alignment: "Neutral.",
        age: "Similar to humans.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common, two others.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 2,
        traits: [
            { index: "shapechanger", name: "Shapechanger", url: "", desc: ["Action: Change your appearance and voice. You determine the specifics. You stay in the new form until you use an action to revert or die."] },
            { index: "changeling-instincts", name: "Changeling Instincts", url: "", desc: ["Proficiency with two of the following skills: Deception, Insight, Intimidation, and Persuasion."] }
        ]
    },
    {
        index: "kalashtar",
        name: "Kalashtar",
        source: "Eberron: Rising from the Last War",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Lawful Good.",
        age: "Similar to humans.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common, Quori, one other.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "quori", name: "Quori", url: "" }],
        language_options: 1,
        traits: [
            { 
                index: "dual-mind", 
                name: "Dual Mind", 
                url: "", 
                desc: ["Advantage on all Wisdom saving throws."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Wisdom' }]
            },
            { 
                index: "mental-discipline", 
                name: "Mental Discipline", 
                url: "", 
                desc: ["Resistance to psychic damage."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Psychic' }]
            },
            { index: "mind-link", name: "Mind Link", url: "", desc: ["Speak telepathically to any creature you can see within 10 feet * level."] }
        ]
    },
    {
        index: "shifter",
        name: "Shifter",
        source: "Eberron: Rising from the Last War",
        speed: 30,
        ability_bonuses: [], // Subrace dependent
        alignment: "Neutral.",
        age: "Similar to humans.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common.",
        languages: [{ index: "common", name: "Common", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "shifting", name: "Shifting", url: "", desc: ["Bonus Action: Shift for 1 minute. Gain temp HP and a special feature based on subrace. (1/Short Rest)"] }
        ],
        subraces_details: [
            {
                index: "beasthide",
                name: "Beasthide Shifter",
                source: "Eberron",
                race: { index: "shifter", name: "Shifter", url: "" },
                desc: ["Tough and hardy."],
                ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "athletics", name: "Athletics", url: "" }],
                languages: [],
                traits: [{ index: "shifting-feature-beasthide", name: "Shifting Feature", url: "", desc: ["Gain 1d6 temp HP. +1 AC while shifted."] }]
            },
            {
                index: "longtooth",
                name: "Longtooth Shifter",
                source: "Eberron",
                race: { index: "shifter", name: "Shifter", url: "" },
                desc: ["Fierce and aggressive."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "intimidation", name: "Intimidation", url: "" }],
                languages: [],
                traits: [{ index: "shifting-feature-longtooth", name: "Shifting Feature", url: "", desc: ["Bonus Action: Bite attack (1d6 + Str piercing) while shifted."] }]
            },
            {
                index: "swiftstride",
                name: "Swiftstride Shifter",
                source: "Eberron",
                race: { index: "shifter", name: "Shifter", url: "" },
                desc: ["Graceful and fast."],
                ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "acrobatics", name: "Acrobatics", url: "" }],
                languages: [],
                traits: [
                    { 
                        index: "shifting-feature-swiftstride", 
                        name: "Shifting Feature", 
                        url: "", 
                        desc: ["Walking speed increases by 10ft. Reaction: Move 10ft without provoking opportunity attacks when an enemy ends turn near you."],
                        modifiers: [{ type: 'bonus', target: 'speed', value: 10 }]
                    }
                ]
            },
            {
                index: "wildhunt",
                name: "Wildhunt Shifter",
                source: "Eberron",
                race: { index: "shifter", name: "Shifter", url: "" },
                desc: ["Wise and observant."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 2 }, { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
                starting_proficiencies: [{ index: "survival", name: "Survival", url: "" }],
                languages: [],
                traits: [{ index: "shifting-feature-wildhunt", name: "Shifting Feature", url: "", desc: ["Advantage on Wisdom checks. No creature within 30ft can make an attack with advantage against you."] }]
            }
        ]
    },
    {
        index: "warforged",
        name: "Warforged",
        source: "Eberron: Rising from the Last War",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }], // Flexible +1 usually
        alignment: "Neutral.",
        age: "2-30 years typically.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { 
                index: "constructed-resilience", 
                name: "Constructed Resilience", 
                url: "", 
                desc: ["Advantage vs poison, resistance to poison dmg. Immune to disease. Don't need to sleep/eat/breathe."],
                modifiers: [
                    { type: 'resistance', target: 'resistance', value: 'Poison' },
                    { type: 'advantage', target: 'saves', value: 1, filter: 'Poison' }
                ]
            },
            { index: "sentrys-rest", name: "Sentry's Rest", url: "", desc: ["Long rest = 6 hours inactive/motionless state. You are conscious."] },
            { 
                index: "integrated-protection", 
                name: "Integrated Protection", 
                url: "", 
                desc: ["+1 AC. Armor takes 1 hour to don/doff (integrate)."],
                modifiers: [{ type: 'bonus', target: 'ac', value: 1 }]
            },
            { index: "specialized-design", name: "Specialized Design", url: "", desc: ["One skill proficiency and one tool proficiency."] }
        ]
    },
    // --- RAVNICA / THEROS ---
    {
        index: "centaur",
        name: "Centaur",
        source: "Guildmasters' Guide to Ravnica / Theros",
        speed: 40,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Neutral.",
        age: "Mature at 15.",
        size: "Medium",
        size_description: "6-7 feet tall, horse body.",
        language_desc: "Common, Sylvan.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "sylvan", name: "Sylvan", url: "" }],
        traits: [
            { index: "fey", name: "Fey", url: "", desc: ["Your creature type is fey, rather than humanoid."] },
            { index: "charge", name: "Charge", url: "", desc: ["If you move 30ft straight toward a target and hit with melee, bonus action hooves attack."] },
            { index: "hooves", name: "Hooves", url: "", desc: ["Unarmed strikes deal 1d4 + Str bludgeoning."] },
            { index: "equine-build", name: "Equine Build", url: "", desc: ["Count as one size larger for carrying capacity. Climbing costs 4ft per 1ft."] },
            { index: "survivor", name: "Survivor", url: "", desc: ["Proficiency in one: Animal Handling, Medicine, Nature, or Survival."] }
        ]
    },
    {
        index: "loxodon",
        name: "Loxodon",
        source: "Guildmasters' Guide to Ravnica",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Lawful Good.",
        age: "Live 450 years.",
        size: "Medium",
        size_description: "7-8 feet tall.",
        language_desc: "Common, Loxodon.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "loxodon", name: "Loxodon", url: "" }],
        traits: [
            { index: "powerful-build", name: "Powerful Build", url: "", desc: ["Count as one size larger for carrying."] },
            { 
                index: "natural-armor", 
                name: "Natural Armor", 
                url: "", 
                desc: ["AC 12 + Con. Can use shield."],
                modifiers: [{ type: 'set', target: 'ac', value: '12 + Con' }]
            },
            { index: "trunk", name: "Trunk", url: "", desc: ["Grasp things, snorkel, lift 5x Str lbs. Can't wield weapons/shields with trunk."] },
            { index: "keen-smell", name: "Keen Smell", url: "", desc: ["Advantage on Perception/Survival/Investigation involving smell."] }
        ]
    },
    {
        index: "minotaur",
        name: "Minotaur",
        source: "Guildmasters' Guide to Ravnica / Theros",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Chaotic.",
        age: "Live 150 years.",
        size: "Medium",
        size_description: "Over 6 feet tall.",
        language_desc: "Common, Minotaur.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "minotaur", name: "Minotaur", url: "" }],
        traits: [
            { index: "horns", name: "Horns", url: "", desc: ["Unarmed strikes deal 1d6 + Str piercing."] },
            { index: "goring-rush", name: "Goring Rush", url: "", desc: ["After Dash, bonus action horns attack."] },
            { index: "hammering-horns", name: "Hammering Horns", url: "", desc: ["After hitting with melee attack, bonus action shove 10ft (Str save DC)."] },
            { index: "imposing-presence", name: "Imposing Presence", url: "", desc: ["Proficiency in Intimidation or Persuasion."] }
        ]
    },
    {
        index: "leonin",
        name: "Leonin",
        source: "Mythic Odysseys of Theros",
        speed: 35,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
        alignment: "Good.",
        age: "Similar to humans.",
        size: "Medium",
        size_description: "6-7 feet.",
        language_desc: "Common, Leonin.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "leonin", name: "Leonin", url: "" }],
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "claws", name: "Claws", url: "", desc: ["Unarmed strikes 1d4 + Str slashing."] },
            { index: "daunting-roar", name: "Daunting Roar", url: "", desc: ["Bonus Action: Frighten enemies within 10ft (Con save). (1/Short Rest)"] },
            { index: "hunter-instincts", name: "Hunter-Instincts", url: "", desc: ["Proficiency in one: Athletics, Intimidation, Perception, or Survival."] }
        ]
    },
    {
        index: "satyr",
        name: "Satyr",
        source: "Mythic Odysseys of Theros",
        speed: 35,
        ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }, { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
        alignment: "Chaotic.",
        age: "Live 100 years.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common, Sylvan.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "sylvan", name: "Sylvan", url: "" }],
        traits: [
            { index: "fey", name: "Fey", url: "", desc: ["Creature type is fey."] },
            { 
                index: "magic-resistance", 
                name: "Magic Resistance", 
                url: "", 
                desc: ["Advantage on saving throws against spells and other magical effects."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Spells' }]
            },
            { index: "mirthful-leaps", name: "Mirthful Leaps", url: "", desc: ["Add d8 to high/long jumps."] },
            { index: "ram", name: "Ram", url: "", desc: ["Unarmed strike 1d4 + Str bludgeoning."] }
        ]
    },
    // --- ELEMENTAL EVIL ---
    {
        index: "genasi",
        name: "Genasi",
        source: "Elemental Evil Player's Companion",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }],
        alignment: "Variable.",
        age: "Live up to 120.",
        size: "Medium",
        size_description: "Human-sized.",
        language_desc: "Common, Primordial.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "primordial", name: "Primordial", url: "" }],
        traits: [],
        subraces_details: [
            {
                index: "air-genasi",
                name: "Air Genasi",
                source: "Elemental Evil",
                race: { index: "genasi", name: "Genasi", url: "" },
                desc: ["Descendants of djinn."],
                ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { index: "unending-breath", name: "Unending Breath", url: "", desc: ["Hold breath indefinitely while not incapacitated."] },
                    { index: "mingle-with-the-wind", name: "Mingle with the Wind", url: "", desc: ["Cast Levitate once per long rest (Con based)."] }
                ]
            },
            {
                index: "earth-genasi",
                name: "Earth Genasi",
                source: "Elemental Evil",
                race: { index: "genasi", name: "Genasi", url: "" },
                desc: ["Descendants of dao."],
                ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { index: "earth-walk", name: "Earth Walk", url: "", desc: ["Move across difficult terrain made of earth or stone without extra movement cost."] },
                    { index: "merge-with-stone", name: "Merge with Stone", url: "", desc: ["Cast Pass Without Trace once per long rest (Con based)."] }
                ]
            },
            {
                index: "fire-genasi",
                name: "Fire Genasi",
                source: "Elemental Evil",
                race: { index: "genasi", name: "Genasi", url: "" },
                desc: ["Descendants of efreet."],
                ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "darkvision", 
                        name: "Darkvision", 
                        url: "", 
                        desc: ["60 feet (shades of red)."],
                        modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
                    },
                    { 
                        index: "fire-resistance", 
                        name: "Fire Resistance", 
                        url: "", 
                        desc: ["Resistance to fire damage."],
                        modifiers: [{ type: 'resistance', target: 'resistance', value: 'Fire' }]
                    },
                    { index: "reach-to-the-blaze", name: "Reach to the Blaze", url: "", desc: ["Produce Flame cantrip. Burning Hands (L3). (Con based)."] }
                ]
            },
            {
                index: "water-genasi",
                name: "Water Genasi",
                source: "Elemental Evil",
                race: { index: "genasi", name: "Genasi", url: "" },
                desc: ["Descendants of marids."],
                ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
                starting_proficiencies: [],
                languages: [],
                traits: [
                    { 
                        index: "acid-resistance", 
                        name: "Acid Resistance", 
                        url: "", 
                        desc: ["Resistance to acid damage."],
                        modifiers: [{ type: 'resistance', target: 'resistance', value: 'Acid' }]
                    },
                    { index: "amphibious", name: "Amphibious", url: "", desc: ["Breathe air and water."] },
                    { 
                        index: "swim", 
                        name: "Swim", 
                        url: "", 
                        desc: ["Swimming speed 30 feet."],
                        modifiers: [{ type: 'set', target: 'speed_swim', value: 30 }]
                    },
                    { index: "call-to-the-wave", name: "Call to the Wave", url: "", desc: ["Shape Water cantrip. Create or Destroy Water (L3). (Con based)."] }
                ]
            }
        ]
    },
    // --- OTHERS ---
    {
        index: "aarakocra",
        name: "Aarakocra",
        source: "Elemental Evil Player's Companion",
        speed: 25,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Neutral Good.",
        age: "Live to ~30.",
        size: "Medium",
        size_description: "5 feet tall.",
        language_desc: "Common, Aarakocra, Auran.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "aarakocra", name: "Aarakocra", url: "" }, { index: "auran", name: "Auran", url: "" }],
        traits: [
            { 
                index: "flight", 
                name: "Flight", 
                url: "", 
                desc: ["Flying speed 50 feet. Cannot fly if wearing medium or heavy armor."],
                modifiers: [{ type: 'set', target: 'speed_fly', value: 50 }]
            },
            { index: "talons", name: "Talons", url: "", desc: ["Unarmed strikes deal 1d4 + Str slashing."] }
        ]
    },
    {
        index: "tortle",
        name: "Tortle",
        source: "The Tortle Package",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Lawful Good.",
        age: "Live to ~50.",
        size: "Medium",
        size_description: "5-6 feet, heavy shells.",
        language_desc: "Common, Aquan.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "aquan", name: "Aquan", url: "" }],
        traits: [
            { index: "claws", name: "Claws", url: "", desc: ["Unarmed strikes deal 1d4 + Str slashing."] },
            { index: "hold-breath", name: "Hold Breath", url: "", desc: ["Hold breath for 1 hour."] },
            { 
                index: "natural-armor", 
                name: "Natural Armor", 
                url: "", 
                desc: ["Base AC is 17 (Dex doesn't affect it). Cannot wear armor, but can use shields."],
                modifiers: [{ type: 'set', target: 'ac', value: 17 }]
            },
            { index: "shell-defense", name: "Shell Defense", url: "", desc: ["Action: Withdraw into shell. +4 AC, Advantage on Str/Con saves. Prone, speed 0, disadvantage on Dex saves, can't take reactions."] }
        ]
    },
    // --- FIZBAN'S TREASURY OF DRAGONS ---
    {
        index: "chromatic-dragonborn",
        name: "Chromatic Dragonborn",
        source: "Fizban's Treasury of Dragons",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Typically chaotic or evil, but can be any.",
        age: "Mature at 15, live to 80.",
        size: "Medium",
        size_description: "Tall and heavy.",
        language_desc: "Common, Draconic.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "draconic", name: "Draconic", url: "" }],
        traits: [
            { index: "chromatic-ancestry", name: "Chromatic Ancestry", url: "", desc: ["Choose: Black (Acid/Line), Blue (Lightning/Line), Green (Poison/Cone), Red (Fire/Cone), White (Cold/Cone)."] },
            { index: "breath-weapon-fizban", name: "Breath Weapon", url: "", desc: ["Exhale energy (1d10, scales). Replace attack action. (PB/Long Rest)."] },
            { 
                index: "draconic-resistance", 
                name: "Draconic Resistance", 
                url: "", 
                desc: ["Resistance to your damage type."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Ancestry Type' }]
            },
            { index: "chromatic-warding", name: "Chromatic Warding", url: "", desc: ["Starting at 5th level, use action to become immune to your damage type for 1 min (1/Long Rest)."] }
        ]
    },
    {
        index: "gem-dragonborn",
        name: "Gem Dragonborn",
        source: "Fizban's Treasury of Dragons",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Typically neutral.",
        age: "Mature at 15, live to 80.",
        size: "Medium",
        size_description: "Tall and heavy.",
        language_desc: "Common, Draconic.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "draconic", name: "Draconic", url: "" }],
        traits: [
            { index: "gem-ancestry", name: "Gem Ancestry", url: "", desc: ["Choose: Amethyst (Force), Crystal (Radiant), Emerald (Psychic), Sapphire (Thunder), Topaz (Necrotic). All Cones."] },
            { index: "breath-weapon-fizban", name: "Breath Weapon", url: "", desc: ["Exhale energy (1d10, scales). Replace attack action. (PB/Long Rest)."] },
            { 
                index: "draconic-resistance", 
                name: "Draconic Resistance", 
                url: "", 
                desc: ["Resistance to your damage type."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Ancestry Type' }]
            },
            { index: "psionic-mind", name: "Psionic Mind", url: "", desc: ["Telepathy 30ft."] },
            { 
                index: "gem-flight", 
                name: "Gem Flight", 
                url: "", 
                desc: ["Starting at 5th level, bonus action to manifest spectral wings. Fly speed = walk speed for 1 min (1/Long Rest)."],
                modifiers: [{ type: 'set', target: 'speed_fly', value: 'Walk' }]
            }
        ]
    },
    {
        index: "metallic-dragonborn",
        name: "Metallic Dragonborn",
        source: "Fizban's Treasury of Dragons",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Typically good.",
        age: "Mature at 15, live to 80.",
        size: "Medium",
        size_description: "Tall and heavy.",
        language_desc: "Common, Draconic.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "draconic", name: "Draconic", url: "" }],
        traits: [
            { index: "metallic-ancestry", name: "Metallic Ancestry", url: "", desc: ["Choose: Brass (Fire/Line), Bronze (Lightning/Line), Copper (Acid/Line), Gold (Fire/Cone), Silver (Cold/Cone)."] },
            { index: "breath-weapon-fizban", name: "Breath Weapon", url: "", desc: ["Exhale energy (1d10, scales). Replace attack action. (PB/Long Rest)."] },
            { 
                index: "draconic-resistance", 
                name: "Draconic Resistance", 
                url: "", 
                desc: ["Resistance to your damage type."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Ancestry Type' }]
            },
            { index: "metallic-breath-weapon", name: "Metallic Breath Weapon", url: "", desc: ["At 5th level, gain second breath weapon (Repulsion or Enervating). (1/Long Rest)."] }
        ]
    },
    // --- VAN RICHTEN'S GUIDE TO RAVENLOFT ---
    {
        index: "dhampir",
        name: "Dhampir",
        source: "Van Richten's Guide to Ravenloft",
        speed: 35,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Variable.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "ancestral-legacy", name: "Ancestral Legacy", url: "", desc: ["If you replace a race with this lineage, you keep skill proficiencies and movement speeds."] },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "spider-climb", 
                name: "Spider Climb", 
                url: "", 
                desc: ["Climbing speed equal to walking speed. At 3rd level, move up/down/across vertical surfaces and ceilings hands-free."],
                modifiers: [{ type: 'set', target: 'speed_climb', value: 'Walk' }]
            },
            { index: "vampiric-bite", name: "Vampiric Bite", url: "", desc: ["Bite attack (Con based). 1d4 piercing. On hit with advantage (or below half HP), regain HP or bonus to next check."] }
        ]
    },
    {
        index: "hexblood",
        name: "Hexblood",
        source: "Van Richten's Guide to Ravenloft",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Variable.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "ancestral-legacy", name: "Ancestral Legacy", url: "", desc: ["Keep skills/speeds from prior race."] },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "fey", name: "Fey", url: "", desc: ["Creature type is Fey."] },
            { index: "hex-magic", name: "Hex Magic", url: "", desc: ["Disguise Self and Hex spells (1/Long Rest each)."] },
            { index: "eerie-token", name: "Eerie Token", url: "", desc: ["Remove lock of hair/tooth/nail. Telepathic message to holder or remote viewing."] }
        ]
    },
    {
        index: "reborn",
        name: "Reborn",
        source: "Van Richten's Guide to Ravenloft",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "con", name: "CON", url: "" }, bonus: 2 }, { ability_score: { index: "str", name: "STR", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Variable.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "ancestral-legacy", name: "Ancestral Legacy", url: "", desc: ["Keep skills/speeds from prior race."] },
            { 
                index: "deathless-nature", 
                name: "Deathless Nature", 
                url: "", 
                desc: ["Advantage vs poison/disease. Resistance to poison. Don't need sleep/eat/breathe. 4 hour long rest."],
                modifiers: [
                    { type: 'resistance', target: 'resistance', value: 'Poison' },
                    { type: 'advantage', target: 'saves', value: 1, filter: 'Poison/Disease' }
                ]
            },
            { index: "knowledge-from-a-past-life", name: "Knowledge from a Past Life", url: "", desc: ["Add d6 to skill check (PB/Long Rest)."] }
        ]
    },
    // --- WILD BEYOND THE WITCHLIGHT ---
    {
        index: "fairy",
        name: "Fairy",
        source: "The Wild Beyond the Witchlight",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Century or more.",
        size: "Small",
        size_description: "Small.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "fey", name: "Fey", url: "", desc: ["Creature type is Fey."] },
            { 
                index: "flight", 
                name: "Flight", 
                url: "", 
                desc: ["Flying speed equal to walking speed. Can't fly in medium/heavy armor."],
                modifiers: [{ type: 'set', target: 'speed_fly', value: 'Walk' }]
            },
            { index: "fairy-magic", name: "Fairy Magic", url: "", desc: ["Druidcraft cantrip. Faerie Fire (L3), Enlarge/Reduce (L5)."] }
        ]
    },
    {
        index: "harengon",
        name: "Harengon",
        source: "The Wild Beyond the Witchlight",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Century.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { index: "hare-trigger", name: "Hare-Trigger", url: "", desc: ["Add proficiency bonus to initiative rolls."] },
            { index: "leprous-senses", name: "Leprous Senses", url: "", desc: ["Proficiency in Perception."] },
            { index: "lucky-footwork", name: "Lucky Footwork", url: "", desc: ["Reaction: Add d4 to Dex save."] },
            { index: "rabbit-hop", name: "Rabbit Hop", url: "", desc: ["Bonus Action: Jump 5*PB feet without provoking OAs. (PB/Long Rest)."] }
        ]
    },
    // --- STRIXHAVEN ---
    {
        index: "owlin",
        name: "Owlin",
        source: "Strixhaven: A Curriculum of Chaos",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Century.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common, one other.",
        languages: [{ index: "common", name: "Common", url: "" }],
        language_options: 1,
        traits: [
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["120 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 120 }]
            },
            { 
                index: "flight", 
                name: "Flight", 
                url: "", 
                desc: ["Flying speed equal to walking speed. Can't fly in medium/heavy armor."],
                modifiers: [{ type: 'set', target: 'speed_fly', value: 'Walk' }]
            },
            { index: "silent-feathers", name: "Silent Feathers", url: "", desc: ["Proficiency in Stealth."] }
        ]
    },
    // --- SPELLJAMMER ---
    {
        index: "astral-elf",
        name: "Astral Elf",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Thousands of years.",
        size: "Medium",
        size_description: "Medium.",
        language_desc: "Common, Elvish.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "elvish", name: "Elvish", url: "" }],
        traits: [
            { index: "astral-fire", name: "Astral Fire", url: "", desc: ["One cantrip: Dancing Lights, Light, or Sacred Flame."] },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { 
                index: "fey-ancestry", 
                name: "Fey Ancestry", 
                url: "", 
                desc: ["Adv vs charm, no magical sleep."],
                modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Charmed' }, { type: 'immunity', target: 'immunity', value: 'Sleep (Magic)' }]
            },
            { index: "keen-senses", name: "Keen Senses", url: "", desc: ["Proficiency in Perception."] },
            { index: "starlight-step", name: "Starlight Step", url: "", desc: ["Bonus Action: Teleport 30ft. (PB/Long Rest)."] },
            { index: "astral-trance", name: "Astral Trance", url: "", desc: ["Finish long rest in 4 hours. Gain proficiency in one skill/tool until next rest."] }
        ]
    },
    {
        index: "autognome",
        name: "Autognome",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "int", name: "INT", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Centuries.",
        size: "Small",
        size_description: "Small.",
        language_desc: "Common, Gnomish.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "gnomish", name: "Gnomish", url: "" }],
        traits: [
            { 
                index: "armored-casing", 
                name: "Armored Casing", 
                url: "", 
                desc: ["Base AC 13 + Dex."],
                modifiers: [{ type: 'set', target: 'ac', value: '13 + Dex' }]
            },
            { index: "built-for-success", name: "Built for Success", url: "", desc: ["Add d4 to attack/check/save (PB/Long Rest)."] },
            { index: "construct", name: "Construct", url: "", desc: ["Type is Construct."] },
            { index: "healing-machine", name: "Healing Machine", url: "", desc: ["Mending heals you. You can spend HD."] },
            { 
                index: "mechanical-nature", 
                name: "Mechanical Nature", 
                url: "", 
                desc: ["Resistance to poison. Immune to disease. Adv vs paralyzed/poisoned. No sleep/eat/breathe."],
                modifiers: [{ type: 'resistance', target: 'resistance', value: 'Poison' }]
            },
            { index: "sentrys-rest", name: "Sentry's Rest", url: "", desc: ["6 hour inactive long rest."] },
            { index: "specialized-design", name: "Specialized Design", url: "", desc: ["Two tool proficiencies."] }
        ]
    },
    {
        index: "giff",
        name: "Giff",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Lawful.",
        age: "Century.",
        size: "Medium",
        size_description: "Medium (hippo-folk).",
        language_desc: "Common.",
        languages: [{ index: "common", name: "Common", url: "" }],
        traits: [
            { index: "astral-spark", name: "Astral Spark", url: "", desc: ["Add PB force damage to weapon attack (PB/Long Rest)."] },
            { index: "firearms-mastery", name: "Firearms Mastery", url: "", desc: ["Proficiency with firearms. Ignore loading property."] },
            { 
                index: "hippo-build", 
                name: "Hippo Build", 
                url: "", 
                desc: ["Advantage on Strength checks and Strength saving throws. You also count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift. You have a swimming speed equal to your walking speed."],
                modifiers: [{ type: 'set', target: 'speed_swim', value: 'Walk' }] // Per rules, swimming speed = walking speed
            }
        ]
    },
    {
        index: "hadozee",
        name: "Hadozee",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Chaotic.",
        age: "Century.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common.",
        languages: [{ index: "common", name: "Common", url: "" }],
        traits: [
            { 
                index: "dexterous-feet", 
                name: "Dexterous Feet", 
                url: "", 
                desc: ["Use bonus action to Use an Object. You have a climbing speed equal to your walking speed."],
                modifiers: [{ type: 'set', target: 'speed_climb', value: 'Walk' }]
            },
            { index: "glide", name: "Glide", url: "", desc: ["Glide 5ft for every 1ft fallen. Use reaction to take 0 falling damage."] },
            { index: "hadozee-resilience", name: "Hadozee Resilience", url: "", desc: ["Reaction: Reduce damage by 1d6 + PB (PB/Long Rest)."] }
        ]
    },
    {
        index: "plasmoid",
        name: "Plasmoid",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "str", name: "STR", url: "" }, bonus: 2 }, { ability_score: { index: "con", name: "CON", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "Century.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Common.",
        languages: [{ index: "common", name: "Common", url: "" }],
        traits: [
            { index: "amorphous", name: "Amorphous", url: "", desc: ["Squeeze through 1-inch spaces (without gear). Adv on grapple escapes."] },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "hold-breath", name: "Hold Breath", url: "", desc: ["1 hour."] },
            { 
                index: "natural-resilience", 
                name: "Natural Resilience", 
                url: "", 
                desc: ["Resistance to acid/poison. Adv vs poison."],
                modifiers: [
                    { type: 'resistance', target: 'resistance', value: 'Acid' },
                    { type: 'resistance', target: 'resistance', value: 'Poison' },
                    { type: 'advantage', target: 'saves', value: 1, filter: 'Poison' }
                ]
            },
            { index: "shape-self", name: "Shape Self", url: "", desc: ["Reshape body. Create pseudopod (10ft reach) to manipulate objects."] }
        ]
    },
    {
        index: "thri-kreen",
        name: "Thri-kreen",
        source: "Spelljammer: Adventures in Space",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 2 }, { ability_score: { index: "wis", name: "WIS", url: "" }, bonus: 1 }],
        alignment: "Any.",
        age: "30 years.",
        size: "Small or Medium",
        size_description: "Variable.",
        language_desc: "Thri-kreen Telepathy.",
        languages: [{ index: "thri-kreen-telepathy", name: "Thri-kreen Telepathy", url: "" }],
        traits: [
            { 
                index: "chameleon-carapace", 
                name: "Chameleon Carapace", 
                url: "", 
                desc: ["AC 13 + Dex (unarmored). Adv on Stealth."],
                modifiers: [{ type: 'set', target: 'ac', value: '13 + Dex' }]
            },
            { 
                index: "darkvision", 
                name: "Darkvision", 
                url: "", 
                desc: ["60 feet."],
                modifiers: [{ type: 'set', target: 'darkvision', value: 60 }]
            },
            { index: "secondary-arms", name: "Secondary Arms", url: "", desc: ["Two smaller arms. Can manipulate light objects/light weapons."] },
            { index: "sleepless", name: "Sleepless", url: "", desc: ["Do not sleep. Alert during rest."] },
            // Fix: Add missing 'desc' property to the thri-kreen-telepathy trait.
            { index: "thri-kreen-telepathy", name: "Thri-kreen Telepathy", url: "", desc: ["You can magically transmit messages mentally to any creature you can see within 120 feet of you."] }
        ]
    },
    // --- DRAGONLANCE ---
    {
        index: "kender",
        name: "Kender",
        source: "Dragonlance: Shadow of the Dragon Queen",
        speed: 30,
        ability_bonuses: [{ ability_score: { index: "cha", name: "CHA", url: "" }, bonus: 2 }, { ability_score: { index: "dex", name: "DEX", url: "" }, bonus: 1 }],
        alignment: "Chaotic Good.",
        age: "Century.",
        size: "Small",
        size_description: "Small.",
        language_desc: "Common, Kenderspeak.",
        languages: [{ index: "common", name: "Common", url: "" }, { index: "kenderspeak", name: "Kenderspeak", url: "" }],
        traits: [
            { 
                index: "fearless", 
                name: "Fearless", 
                url: "", 
                desc: ["Immune to frightened condition."],
                modifiers: [{ type: 'immunity', target: 'immunity', value: 'Frightened' }]
            },
            { index: "kender-ace", name: "Kender Ace", url: "", desc: ["Proficiency in one skill/tool."] },
            { index: "taunt", name: "Taunt", url: "", desc: ["Bonus Action: Target within 60ft must save (Wis) or have disadvantage on attacks vs others (PB/Long Rest)."] }
        ]
    }
];
