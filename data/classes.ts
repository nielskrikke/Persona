import { ClassDetail, ClassFeature, FeatureEffect } from '../types';

export interface ExtendedClassDetail extends ClassDetail {
    source: string;
    level_table: {
        level: number;
        prof_bonus: number;
        features: string[];
        class_specific?: Record<string, any>;
    }[];
    feature_details: (ClassFeature & { effects?: FeatureEffect[] })[];
}

const INSTRUMENT_LIST = [
    "Bagpipes", "Drum", "Dulcimer", "Flute", "Lute", "Lyre", "Horn", "Pan flute", "Shawm", "Viol"
];


const makeOptions = (items: string[], prefix: string = "") => {
    return items.map(s => ({
        item: { index: s.toLowerCase().replace(/\s+/g, '-'), name: prefix + s, url: "" }
    }));
};

const ALL_SKILLS = [
    "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", 
    "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
    "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
];

export const FIGHTING_STYLES = [
    { name: 'Archery', desc: 'You gain a +2 bonus to Attack Rolls you make with Ranged Weapons.' },
    { name: 'Defense', desc: 'While you are wearing armor, you gain a +1 bonus to AC.' },
    { name: 'Dueling', desc: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
    { name: 'Great Weapon Fighting', desc: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll.' },
    { name: 'Protection', desc: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' },
    { name: 'Two-Weapon Fighting', desc: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.' },
    { name: 'Mariner', desc: 'As long as you are not wearing armor or using a shield, you have a swimming speed and a climbing speed equal to your normal speed, and you gain a +1 bonus to AC.' },
    { name: 'Close Quarters Shooter', desc: 'You are trained in making ranged attacks at close quarters. When making a ranged attack while you are within 5 feet of a hostile creature, you do not have disadvantage on the attack roll. Your ranged attacks ignore half cover and three-quarter cover against targets within 30 feet of you. Finally, you have a +1 bonus to attack rolls on ranged attacks.' },
    { name: 'Opportune Ranger', desc: 'When a teammate misses an opportunity attack against an enemy you can see, you can use your reaction to make an opportunity attack against the same target, as long as they are in range.' }
];

export const CLASSES: ExtendedClassDetail[] = [
    {
        index: "arrowsmith",
        name: "Arrowsmith",
        source: "Homebrew",
        hit_die: 10,
        proficiency_choices: [{ 
            choose: 3, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Sleight of Hand", "Survival"], "Skill: ") 
            } 
        }],
        proficiencies: [
            { index: "light-armor", name: "Light Armor", url: "" }, 
            { index: "medium-armor", name: "Medium Armor", url: "" }, 
            { index: "simple-weapons", name: "Simple Weapons", url: "" }, 
            { index: "martial-weapons", name: "Martial Weapons", url: "" },
            { index: "tinkers-tools", name: "Tinker's Tools", url: "" }
        ],
        saving_throws: [{ index: "dex", name: "DEX", url: "" }, { index: "wis", name: "WIS", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Arrowsmith"] },
            { level: 2, prof_bonus: 2, features: ["Fighting Style"] },
            { level: 3, prof_bonus: 2, features: ["Rolling Reload"] },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"] },
            { level: 5, prof_bonus: 3, features: ["Specialization Feature", "Extra Attack"] },
            { level: 6, prof_bonus: 3, features: ["Into The Frey"] },
            { level: 7, prof_bonus: 3, features: ["Craftsman"] },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement", "Specialization Feature"] },
            { level: 9, prof_bonus: 4, features: ["Camouflage Crafter"] },
            { level: 10, prof_bonus: 4, features: ["Made to Kill (1)"] },
            { level: 11, prof_bonus: 4, features: ["Specialization Feature"] },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"] },
            { level: 13, prof_bonus: 5, features: ["Additional Fighting Style"] },
            { level: 14, prof_bonus: 5, features: ["Specialization Feature"] },
            { level: 15, prof_bonus: 5, features: ["Shared Knowledge", "Made to Kill (2)"] },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"] },
            { level: 17, prof_bonus: 6, features: ["Trained Archer"] },
            { level: 18, prof_bonus: 6, features: ["Combined Custom Arrows"] },
            { level: 19, prof_bonus: 6, features: ["Ability Score Improvement"] },
            { level: 20, prof_bonus: 6, features: ["Advanced Combined Custom Arrows", "Made to Kill (3)"] }
        ],
        feature_details: [
            { 
                index: "arrowsmith-core", 
                name: "Arrowsmith", 
                level: 1, 
                source: "Arrowsmith", 
                url: "", 
                desc: ["You craft specialized arrows using Tinker's Tools. You can craft a number of arrows per short/long rest, up to your carrying capacity. Saving throw DC = 8 + Proficiency + Intelligence modifier."]
            },
            { 
                index: "fighting-style-as", 
                name: "Fighting Style", 
                level: 2, 
                source: "Arrowsmith", 
                url: "", 
                desc: ["Adopt a particular style of fighting as your specialty."],
                effects: [{ type: 'feature_choice', name: 'Fighting Style', count: 1, options: FIGHTING_STYLES }]
            },
            { index: "rolling-reload", name: "Rolling Reload", level: 3, source: "Arrowsmith", url: "", desc: ["Whenever you reload a weapon, you can move 5 ft. This movement is treated as a disengage and does not provoke opportunity attacks."] },
            { index: "extra-attack-as", name: "Extra Attack", level: 5, source: "Arrowsmith", url: "", desc: ["You can attack twice whenever you take the Attack action."] },
            { index: "into-the-frey", name: "Into The Frey", level: 6, source: "Arrowsmith", url: "", desc: ["Being within 15 ft of 2 enemies increases AC by +2. Add +1 for every additional 2 enemies."] },
            { 
                index: "craftsman-as", 
                name: "Craftsman", 
                level: 7, 
                source: "Arrowsmith", 
                url: "", 
                desc: ["Gain proficiency in one artisan's tool of your choice."],
                effects: [{ type: 'proficiency_choice', category: 'tool', count: 1 }]
            },
            { index: "camouflage-crafter", name: "Camouflage Crafter", level: 9, source: "Arrowsmith", url: "", desc: ["Spend 1 minute to create wearable camouflage. Grants proficiency to Stealth checks and removes disadvantage from armor. Lasts 10 minutes or until you move."] },
            { index: "made-to-kill-1", name: "Made to Kill (1)", level: 10, source: "Arrowsmith", url: "", desc: ["Your Custom Arrows gain a +1 bonus to attack and damage rolls."] },
            { index: "shared-knowledge", name: "Shared Knowledge", level: 15, source: "Arrowsmith", url: "", desc: ["Choose additional special arrows from other specializations."] },
            { index: "trained-archer", name: "Trained Archer", level: 17, source: "Arrowsmith", url: "", desc: ["When attacking with a custom arrow, add Intelligence modifier to attack and damage rolls. Uses: Int mod per Short Rest."] },
            { index: "combined-custom-arrows", name: "Combined Custom Arrows", level: 18, source: "Arrowsmith", url: "", desc: ["Combine a base Custom Arrow with a Specialization arrow."] },
            { index: "advanced-combined-custom-arrows", name: "Advanced Combined Custom Arrows", level: 20, source: "Arrowsmith", url: "", desc: ["Combine 2 base Custom Arrows with a Specialization arrow. Costs 2 craft points."] }
        ]
    },
    {
        index: "gunslinger",
        name: "Gunslinger",
        source: "Homebrew Wiki",
        hit_die: 10,
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Acrobatics", "Athletics", "History", "Insight", "Perception", "Sleight of Hand", "Stealth", "Survival"], "Skill: ") 
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }, { index: "firearms", name: "Firearms", url: "" }, { index: "tinkers-tools", name: "Tinker's Tools", url: "" }],
        saving_throws: [{ index: "dex", name: "DEX", url: "" }, { index: "wis", name: "WIS", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Firearm Forge"] },
            { level: 2, prof_bonus: 2, features: ["Adept Marksman", "Swift Reload"] },
            { level: 3, prof_bonus: 2, features: ["Gunslinger Bravado"] },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"] },
            { level: 5, prof_bonus: 3, features: ["Extra Attack"] },
            { level: 6, prof_bonus: 3, features: ["Special Ammunition"] },
            { level: 7, prof_bonus: 3, features: ["Adept Marksman Improvement", "Gunslinger Bravado Feature"] },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement", "Evasion"] },
            { level: 9, prof_bonus: 4, features: ["Special Ammunition Improvement"] },
            { level: 10, prof_bonus: 4, features: ["Adept Marksman Improvement", "Quick Movement"] },
            { level: 11, prof_bonus: 4, features: ["Extra Attack", "Tools of the Trade"] },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"] },
            { level: 13, prof_bonus: 5, features: ["Gunslinger Bravado Feature"] },
            { level: 14, prof_bonus: 5, features: ["Low Profile"] },
            { level: 15, prof_bonus: 5, features: ["Adept Marksman Improvement", "Gunslinger Bravado Feature"] },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"] },
            { level: 17, prof_bonus: 6, features: ["Special Ammunition Improvement"] },
            { level: 18, prof_bonus: 6, features: ["Adept Marksman Improvement", "Feral Senses", "Gunslinger Archetype Feature"] },
            { level: 19, prof_bonus: 6, features: ["Ability Score Improvement"] },
            { level: 20, prof_bonus: 6, features: ["Gunslinger Bravado Feature"] }
        ],
        feature_details: [
            { index: "firearm-forge", name: "Firearm Forge", level: 1, source: "Gunslinger", url: "", desc: ["You can forge modern-style firearms and their ammunition. You gain a +2 bonus to all attack rolls you make with ranged weapons."] },
            { index: "swift-reload", name: "Swift Reload", level: 2, source: "Gunslinger", url: "", desc: ["You ignore the loading property of firearms with which you are proficient."] },
            { index: "adept-marksman", name: "Adept Marksman", level: 2, source: "Gunslinger", url: "", desc: ["You learn powerful trick shots to disable or damage opponents. You learn two trick shots. You gain Grit points equal to your Wisdom modifier (min 1). Save DC = 8 + Prof + Dex."] },
            { index: "gunslinger-bravado", name: "Gunslinger Bravado", level: 3, source: "Gunslinger", url: "", desc: ["Choose an archetype: Commander, CQC, Desperado, Marksman, or Preacher."] },
            { index: "extra-attack-gs", name: "Extra Attack", level: 5, source: "Gunslinger", url: "", desc: ["You can attack twice (three times at level 11) whenever you take the Attack action."] },
            { index: "special-ammunition", name: "Special Ammunition", level: 6, source: "Gunslinger", url: "", desc: ["You can craft special ammo dealing extra elemental damage (Fire, Lightning, or Cold)."] },
            { index: "evasion-gs", name: "Evasion", level: 8, source: "Gunslinger", url: "", desc: ["When you succeed on a Dexterity save for half damage, you instead take none."] },
            { index: "quick-movement", name: "Quick Movement", level: 10, source: "Gunslinger", url: "", desc: ["Walking speed increases by 10 feet. You can Disengage as a bonus action."] },
            { index: "tools-of-the-trade", name: "Tools of the Trade", level: 11, source: "Gunslinger", url: "", desc: ["Customize a weapon to deal an additional damage die (scales with level)."] },
            { index: "low-profile", name: "Low Profile", level: 14, source: "Gunslinger", url: "", desc: ["Half cover counts as three-quarters cover for you."] },
            { index: "feral-senses-gs", name: "Feral Senses", level: 18, source: "Gunslinger", url: "", desc: ["Gain blindsight and ignore disadvantage against unseen targets."] }
        ]
    },
    {
        index: "barbarian",
        name: "Barbarian",
        source: "Player's Handbook 2024",
        hit_die: 12,
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"], "Skill: ") 
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }],
        saving_throws: [{ index: "str", name: "STR", url: "" }, { index: "con", name: "CON", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Rage", "Unarmored Defense", "Weapon Mastery"] },
            { level: 2, prof_bonus: 2, features: ["Danger Sense", "Reckless Attack"] },
            { level: 3, prof_bonus: 2, features: ["Barbarian Subclass", "Primal Knowledge"] },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"] },
            { level: 5, prof_bonus: 3, features: ["Extra Attack", "Fast Movement"] },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"] },
            { level: 7, prof_bonus: 3, features: ["Feral Instinct", "Instinctive Pounce"] },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"] },
            { level: 9, prof_bonus: 4, features: ["Brutal Strike"] },
            { level: 10, prof_bonus: 4, features: ["Subclass feature"] },
            { level: 11, prof_bonus: 4, features: ["Relentless Rage"] },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"] },
            { level: 13, prof_bonus: 5, features: ["Improved Brutal Strike"] },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"] },
            { level: 15, prof_bonus: 5, features: ["Persistent Rage"] },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"] },
            { level: 17, prof_bonus: 6, features: ["Improved Brutal Strike"] },
            { level: 18, prof_bonus: 6, features: ["Indomitable Might"] },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"] },
            { level: 20, prof_bonus: 6, features: ["Primal Champion"] }
        ],
        feature_details: [
            { index: "rage", name: "Rage", level: 1, source: "Barbarian", url: "", desc: ["In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saves, bonus rage damage to melee attacks, and resistance to bludgeoning, piercing, and slashing damage."] },
            { index: "unarmored-defense-barbarian", name: "Unarmored Defense", level: 1, source: "Barbarian", url: "", desc: ["While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier."] },
            { index: "weapon-mastery-barb", name: "Weapon Mastery", level: 1, source: "Barbarian", url: "", desc: ["Your training with weapons allows you to use the mastery properties of specific kinds of weapons."] },
            { index: "reckless-attack", name: "Reckless Attack", level: 2, source: "Barbarian", url: "", desc: ["You gain advantage on melee weapon attack rolls using Strength, but attack rolls against you have advantage."] },
            { index: "danger-sense", name: "Danger Sense", level: 2, source: "Barbarian", url: "", desc: ["You have advantage on Dexterity saving throws against effects that you can see."] },
            { index: "barbarian-subclass", name: "Barbarian Subclass", level: 3, source: "Barbarian", url: "", desc: ["You choose a path that shapes the nature of your rage."] },
            { index: "primal-knowledge", name: "Primal Knowledge", level: 3, source: "Barbarian", url: "", desc: ["While your Rage is active, you can use your Strength modifier for certain skill checks."] },
            { index: "ability-score-improvement", name: "Ability Score Improvement", level: 4, source: "Barbarian", url: "", desc: ["You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1."] },
            { index: "extra-attack", name: "Extra Attack", level: 5, source: "Barbarian", url: "", desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] },
            { index: "fast-movement", name: "Fast Movement", level: 5, source: "Barbarian", url: "", desc: ["Your speed increases by 10 feet while you aren't wearing heavy armor."] },
            { index: "feral-instinct", name: "Feral Instinct", level: 7, source: "Barbarian", url: "", desc: ["Your instincts are so sharp that you have advantage on Initiative rolls. If you are surprised and not incapacitated, you can act normally if you enter a Rage first."] },
            { index: "instinctive-pounce", name: "Instinctive Pounce", level: 7, source: "Barbarian", url: "", desc: ["As part of the Bonus Action you use to enter your Rage, you can move up to half your speed."] },
            { index: "brutal-strike", name: "Brutal Strike", level: 9, source: "Barbarian", url: "", desc: ["When you use Reckless Attack, you can choose to forego Advantage on one attack to deal an extra 1d10 damage of the weapon's type and apply a tactical effect (like pushing the target or reducing its speed)."] },
            { index: "relentless-rage", name: "Relentless Rage", level: 11, source: "Barbarian", url: "", desc: ["Your Rage can keep you fighting through wounds that would fell another. If you drop to 0 HP while raging and don't die outright, you can make a DC 10 Constitution save to drop to 1 HP instead. The DC increases by 5 each time you use this until a short or long rest."] },
            { index: "improved-brutal-strike", name: "Improved Brutal Strike", level: 13, source: "Barbarian", url: "", desc: ["The extra damage from your Brutal Strike increases, and you can choose from additional tactical effects."] },
            { index: "persistent-rage", name: "Persistent Rage", level: 15, source: "Barbarian", url: "", desc: ["Your Rage is so fierce that it only ends early if you fall unconscious or choose to end it. It no longer ends if you haven't attacked or taken damage."] },
            { index: "indomitable-might", name: "Indomitable Might", level: 18, source: "Barbarian", url: "", desc: ["If your total for a Strength check is less than your Strength score, you can use that score in place of the total."] },
            { index: "epic-boon-barb", name: "Epic Boon", level: 19, source: "Barbarian", url: "", desc: ["You gain an Epic Boon feat of your choice."] },
            { index: "primal-champion", name: "Primal Champion", level: 20, source: "Barbarian", url: "", desc: ["You embody the powers of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24."] }
        ]
        },
    {
        index: "bard",
        name: "Bard",
        source: "Player's Handbook 2024",
        hit_die: 8,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "cha", name: "Charisma", url: "" },
            info: []
        },
        proficiency_choices: [
            { 
                choose: 3, 
                type: "proficiencies", 
                from: { 
                    options: makeOptions(ALL_SKILLS, "Skill: ")
                } 
            },
            {
                choose: 3,
                type: "proficiencies",
                from: {
                    options: makeOptions(INSTRUMENT_LIST, "Musical Instrument: ")
                }
            }
        ], 
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "longswords", name: "Longswords", url: ""}, { index: "rapiers", name: "Rapiers", url: ""}, { index: "shortswords", name: "Shortswords", url: ""}, { index: "hand-crossbows", name: "Hand Crossbows", url: ""}],
        saving_throws: [{ index: "dex", name: "DEX", url: "" }, { index: "cha", name: "CHA", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Bardic Inspiration", "Spellcasting"], class_specific: { die: "d6", cantrips: 2, prepared: 4 } },
            { level: 2, prof_bonus: 2, features: ["Expertise", "Jack of All Trades"], class_specific: { die: "d6", cantrips: 2, prepared: 5 } },
            { level: 3, prof_bonus: 2, features: ["Bard Subclass"], class_specific: { die: "d6", cantrips: 2, prepared: 6 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { die: "d6", cantrips: 3, prepared: 7 } },
            { level: 5, prof_bonus: 3, features: ["Font of Inspiration"], class_specific: { die: "d8", cantrips: 3, prepared: 9 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { die: "d8", cantrips: 3, prepared: 10 } },
            { level: 7, prof_bonus: 3, features: ["Countercharm"], class_specific: { die: "d8", cantrips: 3, prepared: 11 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { die: "d8", cantrips: 3, prepared: 12 } },
            { level: 9, prof_bonus: 4, features: ["Expertise"], class_specific: { die: "d8", cantrips: 3, prepared: 14 } },
            { level: 10, prof_bonus: 4, features: ["Magical Secrets"], class_specific: { die: "d10", cantrips: 4, prepared: 15 } },
            { level: 11, prof_bonus: 4, features: [], class_specific: { die: "d10", cantrips: 4, prepared: 16 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { die: "d10", cantrips: 4, prepared: 16 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { die: "d10", cantrips: 4, prepared: 17 } },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"], class_specific: { die: "d10", cantrips: 4, prepared: 17 } },
            { level: 15, prof_bonus: 5, features: [], class_specific: { die: "d12", cantrips: 4, prepared: 18 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { die: "d12", cantrips: 4, prepared: 18 } },
            { level: 17, prof_bonus: 6, features: [], class_specific: { die: "d12", cantrips: 4, prepared: 19 } },
            { level: 18, prof_bonus: 6, features: ["Superior Inspiration"], class_specific: { die: "d12", cantrips: 4, prepared: 20 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { die: "d12", cantrips: 4, prepared: 21 } },
            { level: 20, prof_bonus: 6, features: ["Words of Creation"], class_specific: { die: "d12", cantrips: 4, prepared: 22 } }
        ],
        feature_details: [
            { index: "bardic-inspiration", name: "Bardic Inspiration", level: 1, source: "Bard", url: "", desc: ["You can inspire others through stirring words or music. Use a Bonus Action to grant a Bardic Inspiration die to a creature within 60 feet. The die is a d6 (increasing at later levels). The creature can add the die to one ability check, attack roll, or saving throw it makes within 10 minutes. You can use this feature a number of times equal to your Charisma modifier, regaining all uses on a Long Rest (Short Rest at level 5)."] },
            { index: "spellcasting-bard", name: "Spellcasting", level: 1, source: "Bard", url: "", desc: ["You have learned to untangle and reshape the fabric of reality in harmony with your music and performance."] },
            { 
                index: "expertise-bard", 
                name: "Expertise", 
                level: 2, 
                source: "Bard", 
                url: "", 
                desc: ["Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies."],
                effects: [{ type: 'expertise_choice', category: 'skill', count: 2 }]
            },
            { index: "jack of all trades", name: "Jack of All Trades", level: 2, source: "Bard", url: "", desc: ["You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus."] },
            { index: "bard-subclass", name: "Bard Subclass", level: 3, source: "Bard", url: "", desc: ["You delve into the advanced techniques of a bard college of your choice."] },
            { index: "font-of-inspiration", name: "Font of Inspiration", level: 5, source: "Bard", url: "", desc: ["You regain all of your expended uses of Bardic Inspiration when you finish a Short or Long Rest."] },
            { index: "countercharm", name: "Countercharm", level: 7, source: "Bard", url: "", desc: ["As a Reaction when you or an ally within 30 feet fails a save against being Charmed or Frightened, you can grant a reroll with Advantage."] },
            { 
                index: "expertise-bard-9", 
                name: "Expertise", 
                level: 9, 
                source: "Bard", 
                url: "", 
                desc: ["Choose two more of your skill proficiencies. Your proficiency bonus is doubled for these choices."],
                effects: [{ type: 'expertise_choice', category: 'skill', count: 2 }]
            },
            { index: "magical-secrets", name: "Magical Secrets", level: 10, source: "Bard", url: "", desc: ["Your mastery of the weave allows you to learn spells from any class list. Whenever you gain a Bard level or finish a Long Rest, you can replace one of your Bard spells with a spell from the Cleric, Druid, or Wizard spell list."] },
            { index: "superior-inspiration", name: "Superior Inspiration", level: 18, source: "Bard", url: "", desc: ["When you roll initiative and have no uses of Bardic Inspiration remaining, you regain two uses."] },
            { index: "epic-boon-bard", name: "Epic Boon", level: 19, source: "Bard", url: "", desc: ["You gain an Epic Boon feat of your choice."] },
            { index: "words-of-creation", name: "Words of Creation", level: 20, source: "Bard", url: "", desc: ["You have mastered the most powerful musical utterances. You always have Power Word Heal and Power Word Kill prepared, and when you cast either, you can target a second creature within 10 feet of the first."] }
        ]
    },
    {
        index: "cleric",
        name: "Cleric",
        source: "Player's Handbook 2024",
        hit_die: 8,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "wis", name: "Wisdom", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["History", "Insight", "Medicine", "Persuasion", "Religion"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }],
        saving_throws: [{ index: "wis", name: "WIS", url: "" }, { index: "cha", name: "CHA", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Spellcasting", "Divine Order"], class_specific: { cantrips: 3, prepared: 4 } },
            { level: 2, prof_bonus: 2, features: ["Channel Divinity"], class_specific: { cd_uses: 2, cantrips: 3, prepared: 5 } },
            { level: 3, prof_bonus: 2, features: ["Cleric Subclass"], class_specific: { cd_uses: 2, cantrips: 3, prepared: 6 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { cd_uses: 2, cantrips: 4, prepared: 7 } },
            { level: 5, prof_bonus: 3, features: ["Sear Undead"], class_specific: { cd_uses: 2, cantrips: 4, prepared: 9 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { cd_uses: 3, cantrips: 4, prepared: 10 } },
            { level: 7, prof_bonus: 3, features: ["Blessed Strikes"], class_specific: { cd_uses: 3, cantrips: 4, prepared: 11 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { cd_uses: 3, cantrips: 4, prepared: 12 } },
            { level: 9, prof_bonus: 4, features: [], class_specific: { cd_uses: 3, cantrips: 4, prepared: 14 } },
            { level: 10, prof_bonus: 4, features: ["Divine Intervention"], class_specific: { cd_uses: 3, cantrips: 5, prepared: 15 } },
            { level: 11, prof_bonus: 4, features: [], class_specific: { cd_uses: 3, cantrips: 5, prepared: 16 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { cd_uses: 3, cantrips: 5, prepared: 16 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { cd_uses: 3, cantrips: 5, prepared: 17 } },
            { level: 14, prof_bonus: 5, features: ["Improved Blessed Strikes"], class_specific: { cd_uses: 3, cantrips: 5, prepared: 17 } },
            { level: 15, prof_bonus: 5, features: [], class_specific: { cd_uses: 3, cantrips: 5, prepared: 18 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { cd_uses: 3, cantrips: 5, prepared: 18 } },
            { level: 17, prof_bonus: 6, features: ["Subclass feature"], class_specific: { cd_uses: 3, cantrips: 5, prepared: 19 } },
            { level: 18, prof_bonus: 6, features: [], class_specific: { cd_uses: 4, cantrips: 5, prepared: 20 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { cd_uses: 4, cantrips: 5, prepared: 21 } },
            { level: 20, prof_bonus: 6, features: ["Greater Divine Intervention"], class_specific: { cd_uses: 4, cantrips: 5, prepared: 22 } }
        ],
        feature_details: [
            { index: "spellcasting-cleric", name: "Spellcasting", level: 1, source: "Cleric", url: "", desc: ["As a conduit for divine power, you can cast cleric spells. You prepare a number of spells from the Cleric list based on your level."] },
            { index: "divine-order", name: "Divine Order", level: 1, source: "Cleric", url: "", desc: ["You have dedicated yourself to one of the following roles: Protector (Proficiency with heavy armor and martial weapons) or Thaumaturge (Extra cantrip, +Wis to Arcana/Religion)."] },
            { index: "channel-divinity", name: "Channel Divinity", level: 2, source: "Cleric", url: "", desc: ["You gain the ability to channel divine energy directly from your deity. You start with two such effects: Turn Undead and Divine Spark. You regain expended uses on a Short or Long Rest."] },
            { index: "cleric-subclass", name: "Cleric Subclass", level: 3, source: "Cleric", url: "", desc: ["Choose a divine domain related to your deity."] },
            { index: "sear-undead", name: "Sear Undead", level: 5, source: "Cleric", url: "", desc: ["Whenever you use Turn Undead, you also deal radiant damage equal to 3 times your Wisdom modifier to each undead that fails its saving throw."] },
            { index: "blessed-strikes", name: "Blessed Strikes", level: 7, source: "Cleric", url: "", desc: ["You are blessed with divine might. Choose Potent Spellcasting (+Wis to cantrip damage) or Divine Strike (+1d8 radiant damage once per turn on attacks)."] },
            { index: "divine-intervention", name: "Divine Intervention", level: 10, source: "Cleric", url: "", desc: ["You can call on your deity to intervene on your behalf. As an action, describe the assistance you seek and cast any Cleric spell of 5th level or lower without expending a slot. Once you use this, you can't do do again until you finish a Long Rest."] },
            { index: "improved-blessed-strikes", name: "Improved Blessed Strikes", level: 14, source: "Cleric", url: "", desc: ["The benefit of your Blessed Strikes feature increases in power."] },
            { index: "epic-boon-cleric", name: "Epic Boon", level: 19, source: "Cleric", url: "", desc: ["You gain an Epic Boon feat of your choice."] },
            { index: "greater-divine-intervention", name: "Greater Divine Intervention", level: 20, source: "Cleric", url: "", desc: ["Your connection to your deity is near-perfect. You can now use Divine Intervention to cast the Wish spell. Once you cast Wish in this way, you cannot use this feature again for 2d4 days."] }
        ]
    },
    {
        index: "druid",
        name: "Druid",
        source: "Player's Handbook 2024",
        hit_die: 8,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "wis", name: "Wisdom", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "clubs", name: "Clubs", url: "" }, { index: "daggers", name: "Daggers", url: "" }, { index: "darts", name: "Darts", url: "" }, { index: "javelins", name: "Javelins", url: "" }, { index: "maces", name: "Maces", url: "" }, { index: "quarterstaffs", name: "Quarterstaffs", url: "" }, { index: "scimitars", name: "Scimitars", url: "" }, { index: "sickles", name: "Sickles", url: "" }, { index: "slings", name: "Slings", url: "" }, { index: "spears", name: "Spears", url: "" }],
        saving_throws: [{ index: "int", name: "INT", url: "" }, { index: "wis", name: "WIS", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Spellcasting", "Druidic", "Primal Order"], class_specific: { cantrips: 2, prepared: 4 } },
            { level: 2, prof_bonus: 2, features: ["Wild Shape", "Wild Companion"], class_specific: { cantrips: 2, prepared: 5, ws_uses: 2 } },
            { level: 3, prof_bonus: 2, features: ["Druid Subclass"], class_specific: { cantrips: 2, prepared: 6, ws_uses: 2 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { cantrips: 3, prepared: 7, ws_uses: 2 } },
            { level: 5, prof_bonus: 3, features: ["Wild Resurgence"], class_specific: { cantrips: 3, prepared: 9, ws_uses: 2 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { cantrips: 3, prepared: 10, ws_uses: 3 } },
            { level: 7, prof_bonus: 3, features: ["Elemental Fury"], class_specific: { cantrips: 3, prepared: 11, ws_uses: 3 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { cantrips: 3, prepared: 12, ws_uses: 3 } },
            { level: 9, prof_bonus: 4, features: [], class_specific: { cantrips: 3, prepared: 14, ws_uses: 3 } },
            { level: 10, prof_bonus: 4, features: ["Subclass feature"], class_specific: { cantrips: 4, prepared: 15, ws_uses: 3 } },
            { level: 11, prof_bonus: 4, features: [], class_specific: { cantrips: 4, prepared: 16, ws_uses: 3 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { cantrips: 4, prepared: 16, ws_uses: 3 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { cantrips: 4, prepared: 17, ws_uses: 3 } },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"], class_specific: { cantrips: 4, prepared: 17, ws_uses: 3 } },
            { level: 15, prof_bonus: 5, features: ["Improved Elemental Fury"], class_specific: { cantrips: 4, prepared: 18, ws_uses: 3 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { cantrips: 4, prepared: 18, ws_uses: 3 } },
            { level: 17, prof_bonus: 6, features: [], class_specific: { cantrips: 4, prepared: 19, ws_uses: 4 } },
            { level: 18, prof_bonus: 6, features: ["Beast Spells"], class_specific: { cantrips: 4, prepared: 20, ws_uses: 4 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { cantrips: 4, prepared: 21, ws_uses: 4 } },
            { level: 20, prof_bonus: 6, features: ["Archdruid"], class_specific: { cantrips: 4, prepared: 22, ws_uses: 4 } }
        ],
        feature_details: [
            { index: "spellcasting-druid", name: "Spellcasting", level: 1, source: "Druid", url: "", desc: ["Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will."] },
            { index: "druidic", name: "Druidic", level: 1, source: "Druid", url: "", desc: ["You know Druidic, the secret language of druids."] },
            { index: "primal-order", name: "Primal Order", level: 1, source: "Druid", url: "", desc: ["You have dedicated yourself to one of the following roles: Magician (extra cantrip, +Wis to Arcana/Nature) or Warden (Proficiency with martial weapons and heavy armor)."] },
            { index: "wild-shape", name: "Wild Shape", level: 2, source: "Druid", url: "", desc: ["You can use your action to magically assume the shape of a beast. You regain expended uses when you finish a long rest, or one use on a short rest."] },
            { index: "wild-companion", name: "Wild Companion", level: 2, source: "Druid", url: "", desc: ["You can summon a spirit that takes the form of an animal. You can cast the Find Familiar spell without expending a spell slot by expending a use of your Wild Shape."] },
            { index: "druid-subclass", name: "Druid Subclass", level: 3, source: "Druid", url: "", desc: ["Choose a druidic circle that identifies your connection to nature."] },
            { index: "wild-resurgence", name: "Wild Resurgence", level: 5, source: "Druid", url: "", desc: ["Once per long rest, you can expend a spell slot to regain one use of Wild Shape, or expend a use of Wild Shape to regain a level 1 spell slot."] },
            { index: "elemental-fury", name: "Elemental Fury", level: 7, source: "Druid", url: "", desc: ["Your connection to nature allows you to channel elemental power. Choose Potent Spellcasting (+Wis to cantrip damage) or Primal Strike (+1d8 cold/fire/lightning/thunder damage once per turn on attacks)."] },
            { index: "improved-elemental-fury", name: "Improved Elemental Fury", level: 15, source: "Druid", url: "", desc: ["The damage of your Elemental Fury choice increases."] },
            { index: "beast-spells", name: "Beast Spells", level: 18, source: "Druid", url: "", desc: ["You can cast many of your druid spells in any shape you assume using Wild Shape."] },
            { index: "epic-boon", name: "Epic Boon", level: 19, source: "Druid", url: "", desc: ["You gain an Epic Boon feat of your choice."] },
            { index: "archdruid", name: "Archdruid", level: 20, source: "Druid", url: "", desc: ["Nature's power flows through you. When you roll initiative and have no uses of Wild Shape, you regain one use. You can also use Wild Shape to ignore verbal/somatic components of spells while in human form."] }
        ]
    },
    {
        index: "fighter",
        name: "Fighter",
        source: "Player's Handbook 2024",
        hit_die: 10,
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "all-armor", name: "All Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }],
        saving_throws: [{ index: "str", name: "STR", url: "" }, { index: "con", name: "CON", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Fighting Style", "Second Wind", "Weapon Mastery"], class_specific: { second_wind: 2, weapon_mastery: 3 } },
            { level: 2, prof_bonus: 2, features: ["Action Surge", "Tactical Mind"], class_specific: { second_wind: 2, weapon_mastery: 3 } },
            { level: 3, prof_bonus: 2, features: ["Fighter Subclass"], class_specific: { second_wind: 2, weapon_mastery: 3 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack", "Tactical Shift"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 6, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 7, prof_bonus: 3, features: ["Subclass feature"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 9, prof_bonus: 4, features: ["Indomitable", "Tactical Master"], class_specific: { second_wind: 3, weapon_mastery: 4 } },
            { level: 10, prof_bonus: 4, features: ["Subclass feature"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 11, prof_bonus: 4, features: ["Two Extra Attacks"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 13, prof_bonus: 5, features: ["Indomitable", "Studied Attacks"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 14, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 15, prof_bonus: 5, features: ["Subclass feature"], class_specific: { second_wind: 4, weapon_mastery: 5 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { second_wind: 4, weapon_mastery: 6 } },
            { level: 17, prof_bonus: 6, features: ["Action Surge", "Indomitable"], class_specific: { second_wind: 4, weapon_mastery: 6 } },
            { level: 18, prof_bonus: 6, features: ["Subclass feature"], class_specific: { second_wind: 4, weapon_mastery: 6 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { second_wind: 4, weapon_mastery: 6 } },
            { level: 20, prof_bonus: 6, features: ["Three Extra Attacks"], class_specific: { second_wind: 4, weapon_mastery: 6 } }
        ],
        feature_details: [
            { 
                index: "fighting-style", 
                name: "Fighting Style", 
                level: 1, 
                source: "Fighter", 
                url: "", 
                desc: ["You adopt a particular style of fighting as your specialty."],
                effects: [{ type: 'feature_choice', name: 'Fighting Style', count: 1, options: FIGHTING_STYLES }]
            },
            { index: "second-wind", name: "Second Wind", level: 1, source: "Fighter", url: "", desc: ["You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. You regain all uses when you finish a Short or Long Rest."] },
            { index: "weapon-mastery-fighter", name: "Weapon Mastery", level: 1, source: "Fighter", url: "", desc: ["Your training with weapons allows you to use the mastery properties of specific kinds of weapons. You can choose a number of weapon types to master based on your level."] },
            { index: "action-surge", name: "Action Surge", level: 2, source: "Fighter", url: "", desc: ["You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once you use this feature, you must finish a Short or Long rest before you can use it again."] },
            { index: "tactical-mind", name: "Tactical Mind", level: 2, source: "Fighter", url: "", desc: ["If you fail an ability check, you can expend a use of your Second Wind to roll a d10 and add the number rolled to the check. If the check still fails, the use of Second Wind isn't expended."] },
            { index: "fighter-subclass", name: "Fighter Subclass", level: 3, source: "Fighter", url: "", desc: ["You choose an archetype that you strive to emulate in your combat styles and techniques."] },
            { index: "extra-attack", name: "Extra Attack", level: 5, source: "Fighter", url: "", desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] },
            { index: "tactical-shift", name: "Tactical Shift", level: 5, source: "Fighter", url: "", desc: ["Whenever you use your Second Wind, you can move up to half your speed without provoking opportunity attacks."] },
            { index: "indomitable", name: "Indomitable", level: 9, source: "Fighter", url: "", desc: ["You can reroll a saving throw that you fail. If you do so, you must use the new roll, and you gain a bonus to the roll equal to your Fighter level. You regain expended uses on a Long Rest."] },
            { index: "tactical-master", name: "Tactical Master", level: 9, source: "Fighter", url: "", desc: ["When you hit a creature with a weapon you have mastered, you can choose to swap its mastery property for the Push, Sap, or Slow property for that attack."] },
            { index: "two-extra-attacks", name: "Two Extra Attacks", level: 11, source: "Fighter", url: "", desc: ["You can attack three times, instead of twice, whenever you take the Attack action on your turn."] },
            { index: "studied-attacks", name: "Studied Attacks", level: 13, source: "Fighter", url: "", desc: ["You study your opponents as you fight them. If you miss with an attack roll against a creature, your next attack roll against that same creature has Advantage if made before the end of your next turn."] },
            { index: "epic-boon-fighter", name: "Epic Boon", level: 19, source: "Fighter", url: "", desc: ["You gain an Epic Boon feat of your choice."] },
            { index: "three-extra-attacks", name: "Three Extra Attacks", level: 20, source: "Fighter", url: "", desc: ["You can attack four times, instead of three, whenever you take the Attack action on your turn."] }
        ]
    },
    {
        index: "monk",
        name: "Monk",
        source: "Player's Handbook 2024",
        hit_die: 8,
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }],
        saving_throws: [{ index: "str", name: "STR", url: "" }, { index: "dex", name: "DEX", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Martial Arts", "Unarmored Defense"], class_specific: { martial_arts: "1d6", focus_points: 0, unarmored_movement: 0 } },
            { level: 2, prof_bonus: 2, features: ["Monk's Focus", "Unarmored Movement", "Uncanny Metabolism"], class_specific: { martial_arts: "1d6", focus_points: 2, unarmored_movement: 10 } },
            { level: 3, prof_bonus: 2, features: ["Deflect Attacks", "Monk Subclass"], class_specific: { martial_arts: "1d6", focus_points: 3, unarmored_movement: 10 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement", "Slow Fall"], class_specific: { martial_arts: "1d6", focus_points: 4, unarmored_movement: 10 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack", "Stunning Strike"], class_specific: { martial_arts: "1d8", focus_points: 5, unarmored_movement: 10 } },
            { level: 6, prof_bonus: 3, features: ["Empowered Strikes", "Subclass feature"], class_specific: { martial_arts: "1d8", focus_points: 6, unarmored_movement: 15 } },
            { level: 7, prof_bonus: 3, features: ["Evasion"], class_specific: { martial_arts: "1d8", focus_points: 7, unarmored_movement: 15 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { martial_arts: "1d8", focus_points: 8, unarmored_movement: 15 } },
            { level: 9, prof_bonus: 4, features: ["Acrobatic Movement"], class_specific: { martial_arts: "1d8", focus_points: 9, unarmored_movement: 15 } },
            { level: 10, prof_bonus: 4, features: ["Heightened Focus", "Self-Restoration"], class_specific: { martial_arts: "1d8", focus_points: 10, unarmored_movement: 20 } },
            { level: 11, prof_bonus: 4, features: ["Subclass feature"], class_specific: { martial_arts: "1d10", focus_points: 11, unarmored_movement: 20 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { martial_arts: "1d10", focus_points: 12, unarmored_movement: 20 } },
            { level: 13, prof_bonus: 5, features: ["Deflect Energy"], class_specific: { martial_arts: "1d10", focus_points: 13, unarmored_movement: 20 } },
            { level: 14, prof_bonus: 5, features: ["Disciplined Survivor"], class_specific: { martial_arts: "1d10", focus_points: 14, unarmored_movement: 25 } },
            { level: 15, prof_bonus: 5, features: ["Perfect Focus"], class_specific: { martial_arts: "1d10", focus_points: 15, unarmored_movement: 25 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { martial_arts: "1d10", focus_points: 16, unarmored_movement: 25 } },
            { level: 17, prof_bonus: 6, features: ["Subclass feature"], class_specific: { martial_arts: "1d12", focus_points: 17, unarmored_movement: 25 } },
            { level: 18, prof_bonus: 6, features: ["Superior Defense"], class_specific: { martial_arts: "1d12", focus_points: 18, unarmored_movement: 30 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { martial_arts: "1d12", focus_points: 19, unarmored_movement: 30 } },
            { level: 20, prof_bonus: 6, features: ["Body and Mind"], class_specific: { martial_arts: "1d12", focus_points: 20, unarmored_movement: 30 } }
        ],
        feature_details: [
            { index: "martial-arts-2024", name: "Martial Arts", level: 1, source: "Monk", url: "", desc: ["Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and Monk weapons. You can use Dexterity instead of Strength for attack and damage rolls, use your Martial Arts die for damage, and make an unarmed strike as a bonus action if you took the Attack action."] },
            { index: "unarmored-defense-monk", name: "Unarmored Defense", level: 1, source: "Monk", url: "", desc: ["While you are wearing no armor and not wielding a shield, your AC equals 10 + Dexterity modifier + Wisdom modifier."] },
            { index: "monks-focus", name: "Monk's Focus", level: 2, source: "Monk", url: "", desc: ["You can channel your inner focus to perform supernatural feats. You have a number of Focus Points as shown in the Monk table. You can spend these points to fuel features like Flurry of Blows, Patient Defense, and Step of the Wind. You regain all Focus Points at the end of a Short or Long Rest."] },
            { index: "unarmored-movement-monk", name: "Unarmored Movement", level: 2, source: "Monk", url: "", desc: ["Your speed increases while you are not wearing armor or wielding a shield. This bonus increases as you reach certain Monk levels."] },
            { index: "uncanny-metabolism", name: "Uncanny Metabolism", level: 2, source: "Monk", url: "", desc: ["When you roll Initiative, you can regain all expended Focus Points and regain HP equal to your Monk level + Wisdom modifier. (1/Long Rest)"] },
            { index: "deflect-attacks", name: "Deflect Attacks", level: 3, source: "Monk", url: "", desc: ["You can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack or reduce damage from a melee attack. Damage reduction: 1d10 + Dex modifier + Monk level."] },
            { index: "slow-fall", name: "Slow Fall", level: 4, source: "Monk", url: "", desc: ["You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level."] },
            { index: "extra-attack-monk", name: "Extra Attack", level: 5, source: "Monk", url: "", desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] },
            { index: "stunning-strike", name: "Stunning Strike", level: 5, source: "Monk", url: "", desc: ["Once per turn when you hit a creature with a Monk weapon or Unarmed Strike, you can spend 1 Focus Point to attempt a stunning strike. The target must succeed on a Con save or be stunned until the end of your next turn."] },
            { index: "empowered-strikes", name: "Empowered Strikes", level: 6, source: "Monk", url: "", desc: ["Your Unarmed Strikes deal force damage instead of their normal damage type."] },
            { index: "evasion-monk", name: "Evasion", level: 7, source: "Monk", url: "", desc: ["When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."] },
            { index: "acrobatic-movement", name: "Acrobatic Movement", level: 9, source: "Monk", url: "", desc: ["You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move."] },
            { index: "heightened-focus", name: "Heightened Focus", level: 10, source: "Monk", url: "", desc: ["Your Monk's Focus features are improved: Flurry of Blows (3 attacks), Patient Defense (Temp HP), Step of the Wind (Fly speed/Disengage)."] },
            { index: "self-restoration", name: "Self-Restoration", level: 10, source: "Monk", url: "", desc: ["At the end of your turn, you can remove one condition: Charmed, Frightened, or Poisoned. You also don't suffer the effects of exhaustion."] },
            { index: "deflect-energy", name: "Deflect Energy", level: 13, source: "Monk", url: "", desc: ["You can use Deflect Attacks against attacks that deal any damage type, not just bludgeoning, piercing, or slashing."] },
            { index: "disciplined-survivor", name: "Disciplined Survivor", level: 14, source: "Monk", url: "", desc: ["You gain proficiency in all saving throws. If you fail a save, you can spend 1 Focus Point to reroll it and must use the new roll."] },
            { index: "perfect-focus", name: "Perfect Focus", level: 15, source: "Monk", url: "", desc: ["When you roll Initiative and have 0 Focus Points remaining, you regain 4 Focus Points."] },
            { index: "superior-defense", name: "Superior Defense", level: 18, source: "Monk", url: "", desc: ["At the start of your turn, you can spend 3 Focus Points to gain resistance to all damage except force damage for 1 minute or until you are incapacitated."] },
            { index: "body-and-mind", name: "Body and Mind", level: 20, source: "Monk", url: "", desc: ["Your Dexterity and Wisdom scores increase by 4. Your maximum for those scores is now 24."] }
        ]
    },
    {
        index: "paladin",
        name: "Paladin",
        source: "Player's Handbook 2024",
        hit_die: 10,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "cha", name: "Charisma", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "all-armor", name: "All Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }],
        saving_throws: [{ index: "wis", name: "WIS", url: "" }, { index: "cha", name: "CHA", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Lay on Hands", "Spellcasting", "Weapon Mastery"], class_specific: { cd_uses: 0, prepared: 2 } },
            { level: 2, prof_bonus: 2, features: ["Fighting Style", "Paladin's Smite"], class_specific: { cd_uses: 0, prepared: 3 } },
            { level: 3, prof_bonus: 2, features: ["Channel Divinity", "Paladin Subclass"], class_specific: { cd_uses: 2, prepared: 4 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { cd_uses: 2, prepared: 5 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack", "Faithful Steed"], class_specific: { cd_uses: 2, prepared: 6 } },
            { level: 6, prof_bonus: 3, features: ["Aura of Protection"], class_specific: { cd_uses: 2, prepared: 6 } },
            { level: 7, prof_bonus: 3, features: ["Subclass feature"], class_specific: { cd_uses: 2, prepared: 7 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { cd_uses: 2, prepared: 7 } },
            { level: 9, prof_bonus: 4, features: ["Abjure Foes"], class_specific: { cd_uses: 2, prepared: 9 } },
            { level: 10, prof_bonus: 4, features: ["Aura of Courage"], class_specific: { cd_uses: 2, prepared: 9 } },
            { level: 11, prof_bonus: 4, features: ["Radiant Strikes"], class_specific: { cd_uses: 3, prepared: 10 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { cd_uses: 3, prepared: 10 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { cd_uses: 3, prepared: 11 } },
            { level: 14, prof_bonus: 5, features: ["Restoring Touch"], class_specific: { cd_uses: 3, prepared: 11 } },
            { level: 15, prof_bonus: 5, features: ["Subclass feature"], class_specific: { cd_uses: 3, prepared: 12 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { cd_uses: 3, prepared: 12 } },
            { level: 17, prof_bonus: 6, features: [], class_specific: { cd_uses: 3, prepared: 14 } },
            { level: 18, prof_bonus: 6, features: ["Aura Expansion"], class_specific: { cd_uses: 3, prepared: 14 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { cd_uses: 3, prepared: 15 } },
            { level: 20, prof_bonus: 6, features: ["Subclass feature"], class_specific: { cd_uses: 3, prepared: 15 } }
        ],
        feature_details: [
            { index: "lay-on-hands-2024", name: "Lay on Hands", level: 1, source: "Paladin", url: "", desc: ["Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5. As a Bonus Action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool."] },
            { index: "spellcasting-paladin-2024", name: "Spellcasting", level: 1, source: "Paladin", url: "", desc: ["You have learned to draw on divine magic through meditation and prayer to cast spells. You prepare a list of spells from the Paladin list."] },
            { index: "weapon-mastery-paladin", name: "Weapon Mastery", level: 1, source: "Paladin", url: "", desc: ["Your training with weapons allows you to use the mastery properties of specific kinds of weapons. You can choose a number of weapon types to master based on your level."] },
            { 
                index: "fighting-style-paladin", 
                name: "Fighting Style", 
                level: 2, 
                source: "Paladin", 
                url: "", 
                desc: ["You adopt a particular style of fighting as your specialty."],
                effects: [{ type: 'feature_choice', name: 'Fighting Style', count: 1, options: FIGHTING_STYLES.filter(fs => fs.name !== 'Two-Weapon Fighting') }]
            },
            { index: "paladins-smite", name: "Paladin's Smite", level: 2, source: "Paladin", url: "", desc: ["You always have the Divine Smite spell prepared. In addition, you can cast it or another Smite spell as a Bonus Action immediately after hitting a target with an attack roll."] },
            { index: "channel-divinity-paladin", name: "Channel Divinity", level: 3, source: "Paladin", url: "", desc: ["You gain the ability to channel divine energy directly from your deity, using that energy to fuel various magical effects. You start with two such effects: Divine Sense and an option granted by your subclass."] },
            { index: "paladin-subclass-2024", name: "Paladin Subclass", level: 3, source: "Paladin", url: "", desc: ["Choose an oath that binds you to a particular set of tenets."] },
            { index: "extra-attack-paladin", name: "Extra Attack", level: 5, source: "Paladin", url: "", desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] },
            { index: "faithful-steed", name: "Faithful Steed", level: 5, source: "Paladin", url: "", desc: ["You can cast the Find Steed spell without expending a spell slot. You can do so once per Long Rest."] },
            { index: "aura-of-protection", name: "Aura of Protection", level: 6, source: "Paladin", url: "", desc: ["Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus."] },
            { index: "abjure-foes", name: "Abjure Foes", level: 9, source: "Paladin", url: "", desc: ["As an action, you can expend one use of your Channel Divinity to force each creature of your choice within 30 feet to make a Wisdom save. On a failure, a creature is Frightened for 1 minute or until it takes damage."] },
            { index: "aura-of-courage", name: "Aura of Courage", level: 10, source: "Paladin", url: "", desc: ["You and friendly creatures within 10 feet of you can't be frightened while you are conscious."] },
            { index: "radiant-strikes", name: "Radiant Strikes", level: 11, source: "Paladin", url: "", desc: ["You are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage."] },
            { index: "restoring-touch", name: "Restoring Touch", level: 14, source: "Paladin", url: "", desc: ["When you use your Lay on Hands on a creature, you can also end one or more of the following conditions on it: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned."] },
            { index: "aura-expansion", name: "Aura Expansion", level: 18, source: "Paladin", url: "", desc: ["The range of your Aura of Protection and Aura of Courage (and other subclass auras) increases to 30 feet."] },
            { index: "epic-boon-paladin", name: "Epic Boon", level: 19, source: "Paladin", url: "", desc: ["You gain an Epic Boon feat of your choice."] }
        ]
    },
    {
        index: "ranger",
        name: "Ranger",
        source: "Player's Handbook 2024",
        hit_die: 10,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "wis", name: "Wisdom", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 3, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "martial-weapons", name: "Martial Weapons", url: "" }],
        saving_throws: [{ index: "str", name: "STR", url: "" }, { index: "dex", name: "DEX", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Spellcasting", "Favored Enemy", "Weapon Mastery"], class_specific: { fe_uses: 2, prepared: 2 } },
            { level: 2, prof_bonus: 2, features: ["Deft Explorer", "Fighting Style"], class_specific: { fe_uses: 2, prepared: 3 } },
            { level: 3, prof_bonus: 2, features: ["Ranger Subclass"], class_specific: { fe_uses: 2, prepared: 4 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { fe_uses: 2, prepared: 5 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack"], class_specific: { fe_uses: 3, prepared: 6 } },
            { level: 6, prof_bonus: 3, features: ["Roving"], class_specific: { fe_uses: 3, prepared: 6 } },
            { level: 7, prof_bonus: 3, features: ["Subclass feature"], class_specific: { fe_uses: 3, prepared: 7 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { fe_uses: 3, prepared: 7 } },
            { level: 9, prof_bonus: 4, features: ["Expertise"], class_specific: { fe_uses: 4, prepared: 9 } },
            { level: 10, prof_bonus: 4, features: ["Tireless"], class_specific: { fe_uses: 4, prepared: 9 } },
            { level: 11, prof_bonus: 4, features: ["Subclass feature"], class_specific: { fe_uses: 4, prepared: 10 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { fe_uses: 4, prepared: 10 } },
            { level: 13, prof_bonus: 5, features: ["Relentless Hunter"], class_specific: { fe_uses: 5, prepared: 11 } },
            { level: 14, prof_bonus: 5, features: ["Nature's Veil"], class_specific: { fe_uses: 5, prepared: 11 } },
            { level: 15, prof_bonus: 5, features: ["Subclass feature"], class_specific: { fe_uses: 5, prepared: 12 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { fe_uses: 5, prepared: 12 } },
            { level: 17, prof_bonus: 6, features: ["Precise Hunter"], class_specific: { fe_uses: 6, prepared: 14 } },
            { level: 18, prof_bonus: 6, features: ["Feral Senses"], class_specific: { fe_uses: 6, prepared: 14 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { fe_uses: 6, prepared: 15 } },
            { level: 20, prof_bonus: 6, features: ["Foe Slayer"], class_specific: { fe_uses: 6, prepared: 15 } }
        ],
        feature_details: [
            { index: "spellcasting-ranger-2024", name: "Spellcasting", level: 1, source: "Ranger", url: "", desc: ["You have learned to use the magical essence of nature to cast spells. You prepare a list of spells from the Ranger list."] },
            { index: "favored-enemy-2024", name: "Favored Enemy", level: 1, source: "Ranger", url: "", desc: ["You always have the Hunter's Mark spell prepared. You can cast it without expending a spell slot a number of times equal to your Proficiency Bonus."] },
            { index: "weapon-mastery-ranger", name: "Weapon Mastery", level: 1, source: "Ranger", url: "", desc: ["Your training with weapons allows you to use the mastery properties of specific kinds of weapons. You can choose a number of weapon types to master based on your level."] },
            { index: "deft-explorer", name: "Deft Explorer", level: 2, source: "Ranger", url: "", desc: ["You are an unsurpassed explorer. You gain the Canny benefit now, and you gain the Roving and Tireless benefits at later levels. Canny: Expertise in one skill and two languages."] },
            { 
                index: "fighting-style-ranger", 
                name: "Fighting Style", 
                level: 2, 
                source: "Ranger", 
                url: "", 
                desc: ["You adopt a particular style of fighting as your specialty."],
                effects: [{ type: 'feature_choice', name: 'Fighting Style', count: 1, options: FIGHTING_STYLES.filter(fs => fs.name !== 'Great Weapon Fighting' && fs.name !== 'Protection') }]
            },
            { index: "extra-attack-ranger", name: "Extra Attack", level: 5, source: "Ranger", url: "", desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] },
            { index: "roving", name: "Roving", level: 6, source: "Ranger", url: "", desc: ["Your walking speed increases by 5 feet. You also gain a climbing speed and a swimming speed equal to your walking speed."] },
            { index: "expertise-ranger", name: "Expertise", level: 9, source: "Ranger", url: "", desc: ["Choose two of your skill proficiencies. Your proficiency bonus is doubled for these choices."] },
            { index: "tireless", name: "Tireless", level: 10, source: "Ranger", url: "", desc: ["As an action, you can give yourself temporary hit points (1d8 + Wisdom modifier) a number of times equal to your Proficiency Bonus per Long Rest. In addition, when you finish a Short Rest, your exhaustion level, if any, is decreased by 1."] },
            { index: "relentless-hunter", name: "Relentless Hunter", level: 13, source: "Ranger", url: "", desc: ["Taking damage can't break your concentration on Hunter's Mark."] },
            { index: "natures-veil", name: "Nature's Veil", level: 14, source: "Ranger", url: "", desc: ["You can draw on the powers of nature to hide yourself. As a Bonus Action, you can magically become invisible, along with any equipment you are wearing or carrying, until the end of your next turn. (PB/Long Rest)"] },
            { index: "precise-hunter", name: "Precise Hunter", level: 17, source: "Ranger", url: "", desc: ["You have advantage on attack rolls against the creature currently marked by your Hunter's Mark spell."] },
            { index: "feral-senses", name: "Feral Senses", level: 18, source: "Ranger", url: "", desc: ["You gain blindsight out to a range of 30 feet."] },
            { index: "foe-slayer", name: "Foe Slayer", level: 20, source: "Ranger", url: "", desc: ["Your marks are particularly deadly. You can add your Wisdom modifier to the damage roll of your attacks against a creature marked by Hunter's Mark, and you can add it to the attack roll as well."] }
        ]
    },
    {
        index: "rogue",
        name: "Rogue",
        source: "Player's Handbook 2024",
        hit_die: 8,
        proficiency_choices: [
            { 
                choose: 4, 
                type: "proficiencies", 
                from: { 
                    options: makeOptions(ALL_SKILLS, "Skill: ")
                } 
            }
        ],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "hand-crossbows", name: "Hand Crossbows", url: ""}, { index: "longswords", name: "Longswords", url: ""}, { index: "rapiers", name: "Rapiers", url: ""}, { index: "shortswords", name: "Shortswords", url: ""}, { index: "thieves-tools", name: "Thieves' Tools", url: "" }],
        saving_throws: [{ index: "dex", name: "DEX", url: "" }, { index: "int", name: "INT", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Expertise", "Sneak Attack", "Thieves' Cant", "Weapon Mastery"], class_specific: { sneak_attack: "1d6" } },
            { level: 2, prof_bonus: 2, features: ["Cunning Action"], class_specific: { sneak_attack: "1d6" } },
            { level: 3, prof_bonus: 2, features: ["Rogue Subclass", "Steady Aim"], class_specific: { sneak_attack: "2d6" } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { sneak_attack: "2d6" } },
            { level: 5, prof_bonus: 3, features: ["Cunning Strike", "Uncanny Dodge"], class_specific: { sneak_attack: "3d6" } },
            { level: 6, prof_bonus: 3, features: ["Expertise"], class_specific: { sneak_attack: "3d6" } },
            { level: 7, prof_bonus: 3, features: ["Evasion", "Reliable Talent"], class_specific: { sneak_attack: "4d6" } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { sneak_attack: "4d6" } },
            { level: 9, prof_bonus: 4, features: ["Subclass feature"], class_specific: { sneak_attack: "5d6" } },
            { level: 10, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { sneak_attack: "5d6" } },
            { level: 11, prof_bonus: 4, features: ["Improved Cunning Strike"], class_specific: { sneak_attack: "6d6" } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { sneak_attack: "6d6" } },
            { level: 13, prof_bonus: 5, features: ["Subclass feature"], class_specific: { sneak_attack: "7d6" } },
            { level: 14, prof_bonus: 5, features: ["Devious Strikes"], class_specific: { sneak_attack: "7d6" } },
            { level: 15, prof_bonus: 5, features: ["Slippery Mind"], class_specific: { sneak_attack: "8d6" } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { sneak_attack: "8d6" } },
            { level: 17, prof_bonus: 6, features: ["Subclass feature"], class_specific: { sneak_attack: "9d6" } },
            { level: 18, prof_bonus: 6, features: ["Elusive"], class_specific: { sneak_attack: "9d6" } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { sneak_attack: "10d6" } },
            { level: 20, prof_bonus: 6, features: ["Stroke of Luck"], class_specific: { sneak_attack: "10d6" } }
        ],
        feature_details: [
            { 
                index: "expertise-rogue", 
                name: "Expertise", 
                level: 1, 
                source: "Rogue", 
                url: "", 
                desc: ["Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies."],
                effects: [{ type: 'expertise_choice', category: 'skill', count: 2 }]
            },
            { index: "sneak-attack", name: "Sneak Attack", level: 1, source: "Rogue", url: "", desc: ["Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll."] },
            { index: "thieves-cant", name: "Thieves' Cant", level: 1, source: "Rogue", url: "", desc: ["During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation."] },
            { index: "weapon-mastery-rogue", name: "Weapon Mastery", level: 1, source: "Rogue", url: "", desc: ["Your training with weapons allows you to use the mastery properties of specific kinds of weapons. You can choose a number of weapon types to master based on your level."] },
            { index: "cunning-action", name: "Cunning Action", level: 2, source: "Rogue", url: "", desc: ["Your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action."] },
            { index: "rogue-subclass-2024", name: "Rogue Subclass", level: 3, source: "Rogue", url: "", desc: ["You choose an archetype that you emulate in the exercise of your rogue abilities."] },
            { index: "steady-aim", name: "Steady Aim", level: 3, source: "Rogue", url: "", desc: ["As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn."] },
            { index: "cunning-strike", name: "Cunning Strike", level: 5, source: "Rogue", url: "", desc: ["You can trade your Sneak Attack damage for tactical effects. When you deal Sneak Attack damage, you can choose to reduce the damage by a certain number of d6s to apply an effect (like Poison, Trip, or Withdraw)."] },
            { index: "uncanny-dodge-rogue", name: "Uncanny Dodge", level: 5, source: "Rogue", url: "", desc: ["When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you."] },
            { 
                index: "expertise-rogue-6", 
                name: "Expertise", 
                level: 6, 
                source: "Rogue", 
                url: "", 
                desc: ["Choose two more of your skill proficiencies. Your proficiency bonus is doubled for these choices."],
                effects: [{ type: 'expertise_choice', category: 'skill', count: 2 }]
            },
            { index: "evasion-rogue", name: "Evasion", level: 7, source: "Rogue", url: "", desc: ["You can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."] },
            { index: "reliable-talent", name: "Reliable Talent", level: 7, source: "Rogue", url: "", desc: ["You have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10."] },
            { index: "improved-cunning-strike", name: "Improved Cunning Strike", level: 11, source: "Rogue", url: "", desc: ["You can use up to two Cunning Strike effects on a single attack, paying the cost for each."] },
            { index: "devious-strikes", name: "Devious Strikes", level: 14, source: "Rogue", url: "", desc: ["You gain new options for your Cunning Strike (like Daze, Knock Out, or Obscure)."] },
            { index: "slippery-mind", name: "Slippery Mind", level: 15, source: "Rogue", url: "", desc: ["You gain proficiency in Wisdom and Charisma saving throws."] },
            { index: "elusive", name: "Elusive", level: 18, source: "Rogue", url: "", desc: ["No attack roll has advantage against you while you aren't incapacitated."] },
            { index: "stroke-of-luck", name: "Stroke of Luck", level: 20, source: "Rogue", url: "", desc: ["If you fail an ability check or miss with an attack roll, you can treat the d20 roll as a 20. (Once per Short/Long rest)"] }
        ]
    },
    {
        index: "sorcerer",
        name: "Sorcerer",
        source: "Player's Handbook 2024",
        hit_die: 6,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "cha", name: "Charisma", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "daggers", name: "Daggers", url: "" }, { index: "darts", name: "Darts", url: "" }, { index: "slings", name: "Slings", url: "" }, { index: "quarterstaffs", name: "Quarterstaffs", url: "" }, { index: "light-crossbows", name: "Light Crossbows", url: "" }],
        saving_throws: [{ index: "con", name: "CON", url: "" }, { index: "cha", name: "CHA", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Spellcasting", "Innate Sorcery"], class_specific: { prepared: 2, cantrips: 4, sorcery_points: 0 } },
            { level: 2, prof_bonus: 2, features: ["Font of Magic", "Metamagic"], class_specific: { prepared: 4, cantrips: 4, sorcery_points: 2 } },
            { level: 3, prof_bonus: 2, features: ["Sorcerer Subclass"], class_specific: { prepared: 6, cantrips: 4, sorcery_points: 3 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { prepared: 7, cantrips: 5, sorcery_points: 4 } },
            { level: 5, prof_bonus: 3, features: ["Sorcerous Restoration"], class_specific: { prepared: 9, cantrips: 5, sorcery_points: 5 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { prepared: 10, cantrips: 5, sorcery_points: 6 } },
            { level: 7, prof_bonus: 3, features: ["Sorcery Incarnate"], class_specific: { prepared: 11, cantrips: 5, sorcery_points: 7 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { prepared: 12, cantrips: 5, sorcery_points: 8 } },
            { level: 9, prof_bonus: 4, features: [], class_specific: { prepared: 14, cantrips: 5, sorcery_points: 9 } },
            { level: 10, prof_bonus: 4, features: ["Metamagic"], class_specific: { prepared: 15, cantrips: 6, sorcery_points: 10 } },
            { level: 11, prof_bonus: 4, features: [], class_specific: { prepared: 16, cantrips: 6, sorcery_points: 11 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { prepared: 16, cantrips: 6, sorcery_points: 12 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { prepared: 17, cantrips: 6, sorcery_points: 13 } },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"], class_specific: { prepared: 17, cantrips: 6, sorcery_points: 14 } },
            { level: 15, prof_bonus: 5, features: [], class_specific: { prepared: 18, cantrips: 6, sorcery_points: 15 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { prepared: 18, cantrips: 6, sorcery_points: 16 } },
            { level: 17, prof_bonus: 6, features: ["Metamagic"], class_specific: { prepared: 19, cantrips: 6, sorcery_points: 17 } },
            { level: 18, prof_bonus: 6, features: ["Subclass feature"], class_specific: { prepared: 20, cantrips: 6, sorcery_points: 18 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { prepared: 21, cantrips: 6, sorcery_points: 19 } },
            { level: 20, prof_bonus: 6, features: ["Arcane Apotheosis"], class_specific: { prepared: 22, cantrips: 6, sorcery_points: 20 } }
        ],
        feature_details: [
            { index: "spellcasting-sorcerer-2024", name: "Spellcasting", level: 1, source: "Sorcerer", url: "", desc: ["You have learned to draw on the innate magic within yourself. You prepare a list of spells from the Sorcerer list."] },
            { index: "innate-sorcery", name: "Innate Sorcery", level: 1, source: "Sorcerer", url: "", desc: ["As a Bonus Action, you can unleash your innate sorcery for 1 minute. During this time, your Sorcerer spell save DC increases by 1, and you have advantage on attack rolls with Sorcerer spells. (2/Long Rest)"] },
            { index: "font-of-magic-2024", name: "Font of Magic", level: 2, source: "Sorcerer", url: "", desc: ["You can tap into a wellspring of magic within yourself. You have a number of Sorcery Points as shown in the Sorcerer table. You can use these points to create spell slots or fuel your Metamagic."] },
            { index: "metamagic-2024", name: "Metamagic", level: 2, source: "Sorcerer", url: "", desc: ["You gain the ability to twist your spells to suit your needs. You gain two Metamagic options of your choice. You gain additional options at levels 10 and 17."] },
            { index: "sorcerer-subclass-2024", name: "Sorcerer Subclass", level: 3, source: "Sorcerer", url: "", desc: ["Choose a sorcerous origin that describes the source of your innate magical power."] },
            { index: "sorcerous-restoration", name: "Sorcerous Restoration", level: 5, source: "Sorcerer", url: "", desc: ["When you finish a Short Rest, you can regain expended Sorcery Points equal to half your Sorcerer level (rounded up)."] },
            { index: "sorcery-incarnate", name: "Sorcery Incarnate", level: 7, source: "Sorcerer", url: "", desc: ["While your Innate Sorcery is active, you can use up to two Metamagic options on a single spell."] },
            { index: "arcane-apotheosis", name: "Arcane Apotheosis", level: 20, source: "Sorcerer", url: "", desc: ["Your mastery of magic is absolute. While your Innate Sorcery is active, you can use one Metamagic option on each of your turns without expending Sorcery Points."] }
        ]
    },
    {
        index: "warlock",
        name: "Warlock",
        source: "Player's Handbook 2024",
        hit_die: 8,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "cha", name: "Charisma", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }],
        saving_throws: [{ index: "wis", name: "WIS", url: "" }, { index: "cha", name: "CHA", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Eldritch Invocations", "Pact Magic"], class_specific: { invocations: 1, prepared: 2, cantrips: 2, slots: 1, slot_level: 1 } },
            { level: 2, prof_bonus: 2, features: ["Magical Cunning"], class_specific: { invocations: 3, prepared: 3, cantrips: 2, slots: 2, slot_level: 1 } },
            { level: 3, prof_bonus: 2, features: ["Warlock Subclass"], class_specific: { invocations: 3, prepared: 4, cantrips: 2, slots: 2, slot_level: 2 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { invocations: 3, prepared: 5, cantrips: 3, slots: 2, slot_level: 2 } },
            { level: 5, prof_bonus: 3, features: [], class_specific: { invocations: 5, prepared: 6, cantrips: 3, slots: 2, slot_level: 3 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { invocations: 5, prepared: 7, cantrips: 3, slots: 2, slot_level: 3 } },
            { level: 7, prof_bonus: 3, features: [], class_specific: { invocations: 6, prepared: 8, cantrips: 3, slots: 2, slot_level: 4 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { invocations: 6, prepared: 9, cantrips: 3, slots: 2, slot_level: 4 } },
            { level: 9, prof_bonus: 4, features: ["Contact Patron"], class_specific: { invocations: 7, prepared: 10, cantrips: 3, slots: 2, slot_level: 5 } },
            { level: 10, prof_bonus: 4, features: ["Subclass feature"], class_specific: { invocations: 7, prepared: 10, cantrips: 4, slots: 2, slot_level: 5 } },
            { level: 11, prof_bonus: 4, features: ["Mystic Arcanum (6th Level)"], class_specific: { invocations: 7, prepared: 11, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { invocations: 8, prepared: 11, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 13, prof_bonus: 5, features: ["Mystic Arcanum (7th Level)"], class_specific: { invocations: 8, prepared: 12, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"], class_specific: { invocations: 8, prepared: 12, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 15, prof_bonus: 5, features: ["Mystic Arcanum (8th Level)"], class_specific: { invocations: 9, prepared: 13, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { invocations: 9, prepared: 13, cantrips: 4, slots: 3, slot_level: 5 } },
            { level: 17, prof_bonus: 6, features: ["Mystic Arcanum (9th Level)"], class_specific: { invocations: 9, prepared: 14, cantrips: 4, slots: 4, slot_level: 5 } },
            { level: 18, prof_bonus: 6, features: [], class_specific: { invocations: 10, prepared: 14, cantrips: 4, slots: 4, slot_level: 5 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { invocations: 10, prepared: 15, cantrips: 4, slots: 4, slot_level: 5 } },
            { level: 20, prof_bonus: 6, features: ["Eldritch Master"], class_specific: { invocations: 10, prepared: 15, cantrips: 4, slots: 4, slot_level: 5 } }
        ],
        feature_details: [
            { index: "eldritch-invocations-2024", name: "Eldritch Invocations", level: 1, source: "Warlock", url: "", desc: ["In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability. You gain additional invocations as you level up."] },
            { index: "pact-magic-2024", name: "Pact Magic", level: 1, source: "Warlock", url: "", desc: ["Your arcane research and the magic bestowed on you by your patron have given you facility with spells. You use Charisma as your spellcasting ability. Your warlock spell slots are all of the same level and you regain all expended Pact Magic slots when you finish a Short or Long Rest."] },
            { index: "magical-cunning", name: "Magical Cunning", level: 2, source: "Warlock", url: "", desc: ["Once per Long Rest, you can spend 1 minute to perform a ritual to regain half of your expended Pact Magic slots (rounded up)."] },
            { index: "contact-patron", name: "Contact Patron", level: 9, source: "Warlock", url: "", desc: ["You can cast the Contact Other Plane spell without expending a spell slot once per Long Rest. You automatically succeed on the saving throw for this casting, and you contact your patron."] },
            { index: "mystic-arcanum", name: "Mystic Arcanum", level: 11, source: "Warlock", url: "", desc: ["Your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum. You can cast your arcanum spell once without expending a spell slot. You must finish a Long Rest before you can do so again. You gain more arcana at levels 13, 15, and 17."] },
            { index: "eldritch-master", name: "Eldritch Master", level: 20, source: "Warlock", url: "", desc: ["You can draw on your inner reserve of mystical power to entreat your patron to regain all your expended Pact Magic slots. You can use this feature once per Long Rest."] }
        ]
    },
    {
        index: "wizard",
        name: "Wizard",
        source: "Player's Handbook 2024",
        hit_die: 6,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "int", name: "Intelligence", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "daggers", name: "Daggers", url: "" }, { index: "darts", name: "Darts", url: "" }, { index: "slings", name: "Slings", url: "" }, { index: "quarterstaffs", name: "Quarterstaffs", url: "" }, { index: "light-crossbows", name: "Light Crossbows", url: "" }],
        saving_throws: [{ index: "int", name: "INT", url: "" }, { index: "wis", name: "WIS", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Spellcasting", "Ritual Adept", "Arcane Recovery"], class_specific: { prepared: 4, cantrips: 3 } },
            { level: 2, prof_bonus: 2, features: ["Scholar"], class_specific: { prepared: 5, cantrips: 3 } },
            { level: 3, prof_bonus: 2, features: ["Wizard Subclass"], class_specific: { prepared: 6, cantrips: 3 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { prepared: 7, cantrips: 4 } },
            { level: 5, prof_bonus: 3, features: ["Memorize Spell"], class_specific: { prepared: 9, cantrips: 4 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature"], class_specific: { prepared: 10, cantrips: 4 } },
            { level: 7, prof_bonus: 3, features: [], class_specific: { prepared: 11, cantrips: 4 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { prepared: 12, cantrips: 4 } },
            { level: 9, prof_bonus: 4, features: [], class_specific: { prepared: 14, cantrips: 4 } },
            { level: 10, prof_bonus: 4, features: ["Subclass feature"], class_specific: { prepared: 15, cantrips: 5 } },
            { level: 11, prof_bonus: 4, features: [], class_specific: { prepared: 16, cantrips: 5 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { prepared: 16, cantrips: 5 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { prepared: 17, cantrips: 5 } },
            { level: 14, prof_bonus: 5, features: ["Subclass feature"], class_specific: { prepared: 18, cantrips: 5 } },
            { level: 15, prof_bonus: 5, features: [], class_specific: { prepared: 19, cantrips: 5 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { prepared: 21, cantrips: 5 } },
            { level: 17, prof_bonus: 6, features: [], class_specific: { prepared: 22, cantrips: 5 } },
            { level: 18, prof_bonus: 6, features: ["Spell Mastery"], class_specific: { prepared: 23, cantrips: 5 } },
            { level: 19, prof_bonus: 6, features: ["Epic Boon"], class_specific: { prepared: 24, cantrips: 5 } },
            { level: 20, prof_bonus: 6, features: ["Signature Spells"], class_specific: { prepared: 25, cantrips: 5 } }
        ],
        feature_details: [
            { index: "spellcasting-wizard-2024", name: "Spellcasting", level: 1, source: "Wizard", url: "", desc: ["You have studied the workings of magic and recorded your discoveries in a spellbook. You prepare a list of spells from the Wizard list."] },
            { index: "ritual-adept", name: "Ritual Adept", level: 1, source: "Wizard", url: "", desc: ["You can cast any Wizard spell as a ritual if that spell has the ritual tag and is in your spellbook. You don’t need to have the spell prepared."] },
            { index: "arcane-recovery-2024", name: "Arcane Recovery", level: 1, source: "Wizard", url: "", desc: ["Once per day when you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your Wizard level (rounded up). (Max 5th level slots)"] },
            { 
                index: "scholar-wizard", 
                name: "Scholar", 
                level: 2, 
                source: "Wizard", 
                url: "", 
                desc: ["You gain proficiency in one of the following skills: Arcana, History, Nature, or Religion. If you are already proficient in it, you gain Expertise in it."],
                effects: [{ type: 'expertise_choice', category: 'skill', count: 1, options: ["Arcana", "History", "Nature", "Religion"] }]
            },
            { index: "wizard-subclass-2024", name: "Wizard Subclass", level: 3, source: "Wizard", url: "", desc: ["Choose an arcane tradition that describes your primary school of magic."] },
            { index: "memorize-spell", name: "Memorize Spell", level: 5, source: "Wizard", url: "", desc: ["Whenever you finish a Short Rest, you can replace one of your prepared Wizard spells with a different Wizard spell from your spellbook."] },
            { index: "spell-mastery-2024", name: "Spell Mastery", level: 18, source: "Wizard", url: "", desc: ["Choose a 1st-level and a 2nd-level Wizard spell in your spellbook. You always have these spells prepared, and you can cast them at their lowest level without expending a spell slot."] },
            { index: "signature-spells-2024", name: "Signature Spells", level: 20, source: "Wizard", url: "", desc: ["You choose two 3rd-level spells in your spellbook as your signature spells. You always have them prepared and can cast each of them once at 3rd level without expending a spell slot (1/Short or Long Rest)."] }
        ]
    },
    {
        index: "artificer",
        name: "Artificer",
        source: "Eberron: Rising from the Last War",
        hit_die: 8,
        spellcasting: {
            level: 1,
            spellcasting_ability: { index: "int", name: "Intelligence", url: "" },
            info: []
        },
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Arcana", "History", "Investigation", "Medicine", "Nature", "Perception", "Sleight of Hand"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "medium-armor", name: "Medium Armor", url: "" }, { index: "shields", name: "Shields", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "hand-crossbow", name: "Hand Crossbow", url: "" }, { index: "heavy-crossbow", name: "Heavy Crossbow", url: "" }, { index: "thieves-tools", name: "Thieves' Tools", url: "" }, { index: "tinkers-tools", name: "Tinker's Tools", url: "" }],
        saving_throws: [{ index: "con", name: "CON", url: "" }, { index: "int", name: "INT", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Magical Tinkering", "Spellcasting"], class_specific: { infusions_known: 0, infused_items: 0, cantrips: 2 } },
            { level: 2, prof_bonus: 2, features: ["Infuse Item"], class_specific: { infusions_known: 3, infused_items: 2, cantrips: 2 } },
            { level: 3, prof_bonus: 2, features: ["Artificer Specialist", "The Right Tool for the Job"], class_specific: { infusions_known: 3, infused_items: 2, cantrips: 2 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { infusions_known: 4, infused_items: 2, cantrips: 2 } },
            { level: 5, prof_bonus: 3, features: ["Specialist Feature"], class_specific: { infusions_known: 4, infused_items: 2, cantrips: 2 } },
            { level: 6, prof_bonus: 3, features: ["Tool Expertise"], class_specific: { infusions_known: 4, infused_items: 3, cantrips: 2 } },
            { level: 7, prof_bonus: 3, features: ["Flash of Genius"], class_specific: { infusions_known: 5, infused_items: 3, cantrips: 2 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { infusions_known: 5, infused_items: 3, cantrips: 2 } },
            { level: 9, prof_bonus: 4, features: ["Specialist Feature"], class_specific: { infusions_known: 5, infused_items: 3, cantrips: 2 } },
            { level: 10, prof_bonus: 4, features: ["Magic Item Adept"], class_specific: { infusions_known: 5, infused_items: 3, cantrips: 3 } },
            { level: 11, prof_bonus: 4, features: ["Spell-Storing Item"], class_specific: { infusions_known: 6, infused_items: 4, cantrips: 3 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { infusions_known: 6, infused_items: 4, cantrips: 3 } },
            { level: 13, prof_bonus: 5, features: [], class_specific: { infusions_known: 6, infused_items: 4, cantrips: 3 } },
            { level: 14, prof_bonus: 5, features: ["Magic Item Savant"], class_specific: { infusions_known: 6, infused_items: 4, cantrips: 4 } },
            { level: 15, prof_bonus: 5, features: ["Specialist Feature"], class_specific: { infusions_known: 7, infused_items: 4, cantrips: 4 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { infusions_known: 7, infused_items: 5, cantrips: 4 } },
            { level: 17, prof_bonus: 6, features: [], class_specific: { infusions_known: 7, infused_items: 5, cantrips: 4 } },
            { level: 18, prof_bonus: 6, features: ["Magic Item Master"], class_specific: { infusions_known: 7, infused_items: 5, cantrips: 4 } },
            { level: 19, prof_bonus: 6, features: ["Ability Score Improvement"], class_specific: { infusions_known: 8, infused_items: 5, cantrips: 4 } },
            { level: 20, prof_bonus: 6, features: ["Soul of Artifice"], class_specific: { infusions_known: 8, infused_items: 5, cantrips: 4 } }
        ],
        feature_details: [
            { index: "magical-tinkering", name: "Magical Tinkering", level: 1, source: "Artificer", url: "", desc: ["You learn how to invest a spark of magic in objects that would otherwise be mundane. Using thieves' tools or artisan's tools, you can touch a Tiny nonmagical object as an action and give it a magical property: shedding light, emitting a sound/odor, showing a visual effect, or recording a message. You can affect a number of objects equal to your Intelligence modifier."] },
            { index: "spellcasting-artificer", name: "Spellcasting", level: 1, source: "Artificer", url: "", desc: ["You have studied the workings of magic and how to channel it through objects. You use Intelligence as your spellcasting ability and must use a tool you are proficient with as a spellcasting focus."] },
            { index: "infuse-item", name: "Infuse Item", level: 2, source: "Artificer", url: "", desc: ["You gain the ability to imbue mundane items with magical infusions. You learn a number of infusions and can have a maximum number of items infused at once based on your level. Whenever you finish a long rest, you can touch a nonmagical object and imbue it with one of your infusions, turning it into a magic item."] },
            { index: "artificer-specialist", name: "Artificer Specialist", level: 3, source: "Artificer", url: "", desc: ["You choose the type of specialist you are: Alchemist, Artillerist, or Battle Smith. Your choice grants you features at 3rd, 5th, 9th, and 15th levels."] },
            { index: "the-right-tool-for-the-job", name: "The Right Tool for the Job", level: 3, source: "Artificer", url: "", desc: ["You can magically create one set of artisan's tools in an unoccupied space within 5 feet of you using tinker's tools and 1 hour of work."] },
            { index: "tool-expertise", name: "Tool Expertise", level: 6, source: "Artificer", url: "", desc: ["Your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool."] },
            { index: "flash-of-genius", name: "Flash of Genius", level: 7, source: "Artificer", url: "", desc: ["When you or another creature you can see within 30 feet makes an ability check or saving throw, you can use your reaction to add your Intelligence modifier to the roll. You can use this a number of times equal to your Intelligence modifier (min 1) per Long Rest."] },
            { index: "magic-item-adept", name: "Magic Item Adept", level: 10, source: "Artificer", url: "", desc: ["You can attune to up to four magic items at once. If you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time and costs half as much gold."] },
            { index: "spell-storing-item", name: "Spell-Storing Item", level: 11, source: "Artificer", url: "", desc: ["You can store a 1st- or 2nd-level artificer spell in a weapon or focus. A creature holding the object can use an action to cast the spell using your spellcasting ability modifier. It can be used a number of times equal to twice your Intelligence modifier."] },
            { index: "magic-item-savant", name: "Magic Item Savant", level: 14, source: "Artificer", url: "", desc: ["You can attune to up to five magic items at once. You ignore all class, race, spell, and level requirements on attuning to or using a magic item."] },
            { index: "magic-item-master", name: "Magic Item Master", level: 18, source: "Artificer", url: "", desc: ["You can attune to up to six magic items at once."] },
            { index: "soul-of-artifice", name: "Soul of Artifice", level: 20, source: "Artificer", url: "", desc: ["You gain a +1 bonus to all saving throws per magic item you are currently attuned to. If you drop to 0 HP, you can use your reaction to end one infusion and drop to 1 HP instead."] }
        ]
    },
    {
        index: "pugilist",
        name: "Pugilist",
        source: "The School of Hard Knocks",
        hit_die: 8,
        proficiency_choices: [{ 
            choose: 2, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Acrobatics", "Athletics", "Deception", "Intimidation", "Perception", "Sleight of Hand", "Stealth"], "Skill: ")
            } 
        }],
        proficiencies: [{ index: "light-armor", name: "Light Armor", url: "" }, { index: "simple-weapons", name: "Simple Weapons", url: "" }, { index: "whip", name: "Whip", url: "" }, { index: "derringer", name: "Derringer", url: "" }, { index: "improvised-weapons", name: "Improvised Weapons", url: "" }],
        saving_throws: [{ index: "str", name: "STR", url: "" }, { index: "con", name: "CON", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Fisticuffs", "Iron Chin"], class_specific: { fisticuffs: "1d6", moxie: 0 } },
            { level: 2, prof_bonus: 2, features: ["Moxie", "Street Smart"], class_specific: { fisticuffs: "1d6", moxie: 2 } },
            { level: 3, prof_bonus: 2, features: ["Bloodied but Unbowed", "Fight Club"], class_specific: { fisticuffs: "1d6", moxie: 2 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement", "Dig Deep"], class_specific: { fisticuffs: "1d6", moxie: 3 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack", "Haymaker"], class_specific: { fisticuffs: "1d8", moxie: 3 } },
            { level: 6, prof_bonus: 3, features: ["Subclass feature", "Moxie-Fueled Fists"], class_specific: { fisticuffs: "1d8", moxie: 4 } },
            { level: 7, prof_bonus: 3, features: ["Fancy Footwork", "Shake It Off"], class_specific: { fisticuffs: "1d8", moxie: 4 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { fisticuffs: "1d8", moxie: 5 } },
            { level: 9, prof_bonus: 4, features: ["Down but Not Out"], class_specific: { fisticuffs: "1d8", moxie: 5 } },
            { level: 10, prof_bonus: 4, features: ["School of Hard Knocks"], class_specific: { fisticuffs: "1d8", moxie: 6 } },
            { level: 11, prof_bonus: 4, features: ["Subclass feature"], class_specific: { fisticuffs: "1d10", moxie: 6 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { fisticuffs: "1d10", moxie: 7 } },
            { level: 13, prof_bonus: 5, features: ["Rabble Rouser"], class_specific: { fisticuffs: "1d10", moxie: 7 } },
            { level: 14, prof_bonus: 5, features: ["Unbreakable"], class_specific: { fisticuffs: "1d10", moxie: 8 } },
            { level: 15, prof_bonus: 5, features: ["Herculean"], class_specific: { fisticuffs: "1d10", moxie: 8 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { fisticuffs: "1d10", moxie: 9 } },
            { level: 17, prof_bonus: 6, features: ["Subclass feature"], class_specific: { fisticuffs: "1d12", moxie: 9 } },
            { level: 18, prof_bonus: 6, features: ["Fighting Spirit"], class_specific: { fisticuffs: "1d12", moxie: 10 } },
            { level: 19, prof_bonus: 6, features: ["Ability Score Improvement"], class_specific: { fisticuffs: "1d12", moxie: 10 } },
            { level: 20, prof_bonus: 6, features: ["Peak Physical Condition"], class_specific: { fisticuffs: "1d12", moxie: 12 } }
        ],
        feature_details: [
            { index: "fisticuffs", name: "Fisticuffs", level: 1, source: "Pugilist", url: "", desc: ["You use a scaling damage die for unarmed strikes and 'Pugilist Weapons' (simple melee, whips, improvised). You can make one unarmed strike or grapple as a bonus action when you attack."] },
            { index: "iron-chin", name: "Iron Chin", level: 1, source: "Pugilist", url: "", desc: ["While wearing light or no armor (and no shield), your AC is 12 + Constitution modifier."] },
            { index: "moxie", name: "Moxie", level: 2, source: "Pugilist", url: "", desc: ["You have a pool of Moxie points (regained on a Short or Long rest). Spend points for: Brace Up (Temp HP), The Old One-Two (Two unarmed strikes), or Stick and Move (Dash/Shove)."] },
            { index: "street-smart", name: "Street Smart", level: 2, source: "Pugilist", url: "", desc: ["You are at home in the urban sprawl. You have advantage on checks to find food, shelter, or information in settlements."] },
            { index: "bloodied-but-unbowed", name: "Bloodied but Unbowed", level: 3, source: "Pugilist", url: "", desc: ["When reduced to half HP or less, use your reaction to regain all Moxie and gain Temp HP equal to Level + Con mod. (1/Short Rest)"] },
            { index: "fight-club", name: "Fight Club", level: 3, source: "Pugilist", url: "", desc: ["Choose a Fight Club that defines your specific brawling style."] },
            { index: "dig-deep", name: "Dig Deep", level: 4, source: "Pugilist", url: "", desc: ["Bonus action to gain resistance to Bludgeoning, Piercing, and Slashing for 1 minute. You gain a level of exhaustion when it ends."] },
            { index: "haymaker", name: "Haymaker", level: 5, source: "Pugilist", url: "", desc: ["You can choose to take Disadvantage on all attacks this turn to deal Maximum Damage on hits with unarmed strikes or pugilist weapons."] },
            { index: "moxie-fueled-fists", name: "Moxie-Fueled Fists", level: 6, source: "Pugilist", url: "", desc: ["Your unarmed strikes and pugilist weapons count as magical for the purpose of overcoming resistance."] },
            { index: "fancy-footwork", name: "Fancy Footwork", level: 7, source: "Pugilist", url: "", desc: ["You gain proficiency in Dexterity saving throws. If you already have it, you gain proficiency in another save of your choice."] },
            { index: "shake-it-off", name: "Shake It Off", level: 7, source: "Pugilist", url: "", desc: ["You can use a bonus action to end one of the following conditions on yourself: Charmed, Frightened, or Poisoned."] },
            { index: "down-but-not-out", name: "Down but Not Out", level: 9, source: "Pugilist", url: "", desc: ["When using Bloodied But Unbowed, you can also add your Proficiency Bonus to damage for 1 minute (1/Long Rest)."] },
            { index: "school-of-hard-knocks", name: "School of Hard Knocks", level: 10, source: "Pugilist", url: "", desc: ["You have resistance to psychic damage and have advantage on saves against being charmed."] },
            { index: "rabble-rouser", name: "Rabble Rouser", level: 13, source: "Pugilist", url: "", desc: ["You can find enough volunteers to perform non-specialized labor for you in any settlement."] },
            { index: "unbreakable", name: "Unbreakable", level: 14, source: "Pugilist", url: "", desc: ["When you are reduced to 0 HP but not killed outright, you can spend 1 Moxie to drop to 1 HP instead."] },
            { index: "herculean", name: "Herculean", level: 15, source: "Pugilist", url: "", desc: ["Your carrying capacity doubles. You have advantage on Strength checks to break, lift, or move objects."] },
            { index: "fighting-spirit-pugilist", name: "Fighting Spirit", level: 18, source: "Pugilist", url: "", desc: ["At the start of each of your turns, you regain 1 Moxie point if you have 0 points."] },
            { index: "peak-physical-condition", name: "Peak Physical Condition", level: 20, source: "Pugilist", url: "", desc: ["Str and Con increase by 2 (max 22). Recover 2 levels of exhaustion and all Hit Dice on a long rest."] }
        ]

    },
    {
        index: "blood-hunter",
        name: "Blood Hunter",
        source: "Critical Role",
        hit_die: 10,
        proficiency_choices: [{ 
            choose: 3, 
            type: "proficiencies", 
            from: { 
                options: makeOptions(["Athletics", "Acrobatics", "Arcana", "History", "Insight", "Investigation", "Religion", "Survival"], "Skill: ") 
            } 
        }],
        proficiencies: [
            { index: "light-armor", name: "Light Armor", url: "" }, 
            { index: "medium-armor", name: "Medium Armor", url: "" }, 
            { index: "shields", name: "Shields", url: "" }, 
            { index: "simple-weapons", name: "Simple Weapons", url: "" }, 
            { index: "martial-weapons", name: "Martial Weapons", url: "" },
            { index: "alchemists-supplies", name: "Alchemist's Supplies", url: "" }
        ],
        saving_throws: [{ index: "dex", name: "DEX", url: "" }, { index: "int", name: "INT", url: "" }],
        level_table: [
            { level: 1, prof_bonus: 2, features: ["Hunter's Bane", "Blood Maledict"], class_specific: { hemocraft_die: "d4", blood_maledicts: 1 } },
            { level: 2, prof_bonus: 2, features: ["Fighting Style", "Crimson Rite"], class_specific: { hemocraft_die: "d4", blood_maledicts: 1 } },
            { level: 3, prof_bonus: 2, features: ["Blood Hunter Order"], class_specific: { hemocraft_die: "d4", blood_maledicts: 1 } },
            { level: 4, prof_bonus: 2, features: ["Ability Score Improvement"], class_specific: { hemocraft_die: "d4", blood_maledicts: 1 } },
            { level: 5, prof_bonus: 3, features: ["Extra Attack"], class_specific: { hemocraft_die: "d6", blood_maledicts: 1 } },
            { level: 6, prof_bonus: 3, features: ["Brand of Castigation", "Blood Maledict (2/rest)"], class_specific: { hemocraft_die: "d6", blood_maledicts: 2 } },
            { level: 7, prof_bonus: 3, features: ["Order Feature"], class_specific: { hemocraft_die: "d6", blood_maledicts: 2 } },
            { level: 8, prof_bonus: 3, features: ["Ability Score Improvement"], class_specific: { hemocraft_die: "d6", blood_maledicts: 2 } },
            { level: 9, prof_bonus: 4, features: ["Grim Psychometry"], class_specific: { hemocraft_die: "d6", blood_maledicts: 2 } },
            { level: 10, prof_bonus: 4, features: ["Dark Augmentation"], class_specific: { hemocraft_die: "d6", blood_maledicts: 2 } },
            { level: 11, prof_bonus: 4, features: ["Order Feature"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 12, prof_bonus: 4, features: ["Ability Score Improvement"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 13, prof_bonus: 5, features: ["Brand of Tethering"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 14, prof_bonus: 5, features: ["Hardened Soul"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 15, prof_bonus: 5, features: ["Order Feature"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 16, prof_bonus: 5, features: ["Ability Score Improvement"], class_specific: { hemocraft_die: "d8", blood_maledicts: 2 } },
            { level: 17, prof_bonus: 6, features: ["Blood Maledict (3/rest)"], class_specific: { hemocraft_die: "d10", blood_maledicts: 3 } },
            { level: 18, prof_bonus: 6, features: ["Order Feature"], class_specific: { hemocraft_die: "d10", blood_maledicts: 3 } },
            { level: 19, prof_bonus: 6, features: ["Ability Score Improvement"], class_specific: { hemocraft_die: "d10", blood_maledicts: 3 } },
            { level: 20, prof_bonus: 6, features: ["Sanguine Mastery"], class_specific: { hemocraft_die: "d10", blood_maledicts: 3 } }
        ],
        feature_details: [
            { 
                index: "hunters-bane", 
                name: "Hunter's Bane", 
                level: 1, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You have survived the Tainted Blood ritual. You have advantage on Wisdom (Survival) checks to track fey, fiends, or undead, as well as on Intelligence checks to recall information about them. You also gain advantage on saving throws against being charmed or frightened."] 
            },
            { 
                index: "blood-maledict", 
                name: "Blood Maledict", 
                level: 1, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You can use your blood to curse your enemies. You know one Blood Curse. You can use this feature once per short or long rest. When you use it, you can choose to amplify it by taking damage equal to one roll of your hemocraft die."] 
            },
            { 
                index: "fighting-style-bh", 
                name: "Fighting Style", 
                level: 2, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You adopt a particular style of fighting as your specialty."],
                effects: [{ type: 'feature_choice', name: 'Fighting Style', count: 1, options: FIGHTING_STYLES.filter(fs => ['Archery', 'Dueling', 'Great Weapon Fighting', 'Two-Weapon Fighting'].includes(fs.name)) }]
            },
            { 
                index: "crimson-rite", 
                name: "Crimson Rite", 
                level: 2, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You learn to invoke a rite of hemocraft that infuses your weapon with elemental energy. As a bonus action, you can imbue a weapon with a rite you know. Your max HP is reduced by an amount equal to your character level until the rite ends. Your attacks with that weapon deal extra damage equal to your hemocraft die."] 
            },
            { 
                index: "blood-hunter-order", 
                name: "Blood Hunter Order", 
                level: 3, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You commit to a specific order of blood hunters."] 
            },
            { 
                index: "extra-attack-bh", 
                name: "Extra Attack", 
                level: 5, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] 
            },
            { 
                index: "brand-of-castigation", 
                name: "Brand of Castigation", 
                level: 6, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["When you damage a creature with your Crimson Rite, you can brand it. The branded creature takes psychic damage equal to your Intelligence modifier (min 1) whenever it deals damage to you or a creature you can see within 5 feet of you."] 
            },
            { 
                index: "grim-psychometry", 
                name: "Grim Psychometry", 
                level: 9, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You can meditate on an object or location to perceive the lingering emotions and memories of past events. You have advantage on Intelligence (History) checks made to recall information about the history of an object you are touching or a location you are in."] 
            },
            { 
                index: "dark-augmentation", 
                name: "Dark Augmentation", 
                level: 10, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["Your hemocraft has altered your body. Your speed increases by 5 feet, and you can add your Intelligence modifier (min 1) to your Strength, Dexterity, and Constitution saving throws."] 
            },
            { 
                index: "brand-of-tethering", 
                name: "Brand of Tethering", 
                level: 13, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["Your Brand of Castigation now deals double the psychic damage. Additionally, the branded creature can't use the Dash action, and if it attempts to teleport or leave its current plane, it must make a Wisdom save or take 4d6 psychic damage and have the attempt fail."] 
            },
            { 
                index: "hardened-soul", 
                name: "Hardened Soul", 
                level: 14, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["You have advantage on saving throws against being charmed or frightened, and you are immune to the possessed condition."] 
            },
            { 
                index: "sanguine-mastery", 
                name: "Sanguine Mastery", 
                level: 20, 
                source: "Blood Hunter", 
                url: "", 
                desc: ["When you are below half your max HP, you can reroll your hemocraft die once per turn and use either result. Additionally, when you score a critical hit with a weapon for which you have an active Crimson Rite, you regain one expended use of your Blood Maledict feature."] 
            }
        ]
    }
];