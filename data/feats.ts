import { ExtendedFeatDetail, FeatureEffect } from '../types';

// Data Architecture for Automating Feat Effects
export type FeatModifier = FeatureEffect;

export const FEATS: ExtendedFeatDetail[] = [
    {
        index: "actor",
        name: "Actor",
        source: "Player's Handbook",
        desc: [
            "Skilled at mimicry and dramatics:",
            "• +1 Cha (max 20).",
            "• Adv on Deception/Performance to fake identity.",
            "• Mimic speech/sounds (Insight vs Deception)."
        ],
        effects: [
            { type: 'asi', attributes: ['cha'], amount: 1 },
            { type: 'advantage', key: 'deception_mimicry', label: 'Deception/Performance (Mimicry)' }
        ]
    },
    {
        index: "alert",
        name: "Alert",
        source: "Player's Handbook",
        desc: [
            "• +5 to initiative.",
            "• Can’t be surprised while conscious.",
            "• No advantage for unseen attackers."
        ],
        effects: [
            { type: 'stat_bonus', stat: 'initiative', value: 5 },
            { type: 'feature', name: 'Alertness', description: 'Cannot be surprised while conscious. No advantage for unseen attackers.' }
        ]
    },
    {
        index: "athlete",
        name: "Athlete",
        source: "Player's Handbook",
        desc: [
            "• +1 Str or Dex.",
            "• Stand up from prone uses 5ft movement.",
            "• Climb doesn't cost extra movement.",
            "• Running jump only needs 5ft start."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'dex'], amount: 1, count: 1 },
            { type: 'feature', name: 'Athleticism', description: 'Stand from prone costs 5ft. Climb speed equals walking speed. Running jump needs 5ft start.' }
        ]
    },
    {
        index: "artificer-initiate",
        name: "Artificer Initiate",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• Learn one cantrip and one 1st-level spell from Artificer list.",
            "• Prof with one type of artisan's tools."
        ],
        effects: [
            { type: 'spell_access', level: 0, count: 1, filter_class: 'artificer' },
            { type: 'spell_access', level: 1, count: 1, filter_class: 'artificer', cast_free: true },
            { type: 'proficiency_choice', category: 'tool', count: 1 }
        ]
    },
    {
        index: "chef",
        name: "Chef",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Con or Wis.",
            "• Prof with cook's utensils.",
            "• Cook food during short rest: heals extra 1d8.",
            "• Cook treats (1 hour): Bonus action to eat for temp HP."
        ],
        effects: [
            { type: 'asi_choice', options: ['con', 'wis'], amount: 1, count: 1 },
            { type: 'proficiency', target: "Cook's utensils", category: 'tool' }
        ]
    },
    {
        index: "crossbow-expert",
        name: "Crossbow Expert",
        source: "Player's Handbook",
        desc: [
            "• Ignore loading quality of crossbows you are proficient with.",
            "• Being within 5ft of a hostile creature doesn't impose disadvantage on ranged attacks.",
            "• When you use the Attack action with a one-handed weapon, you can use a bonus action to attack with a hand crossbow."
        ],
        effects: [
            { type: 'feature', name: 'Crossbow Expert', description: 'Ignore loading. No disadvantage at 5ft. Bonus action hand crossbow attack.' }
        ]
    },
    {
        index: "crusher",
        name: "Crusher",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Str or Con.",
            "• Once per turn, when you deal bludgeoning damage, move creature 5ft.",
            "• Crit deals bludgeoning: Attacks vs target have advantage until start of your next turn."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'con'], amount: 1, count: 1 }
        ]
    },
    {
        index: "dual-wielder",
        name: "Dual Wielder",
        source: "Player's Handbook",
        desc: [
            "• +1 AC while wielding a separate melee weapon in each hand.",
            "• Can use two-weapon fighting even when weapons aren't light.",
            "• Can draw or stow two one-handed weapons when you would normally be able to draw or stow only one."
        ],
        effects: [
            { type: 'stat_bonus', stat: 'ac', value: 1 },
            { type: 'feature', name: 'Dual Wielder', description: 'Can use non-light weapons for two-weapon fighting. Draw/stow two weapons at once.' }
        ]
    },
    {
        index: "durable",
        name: "Durable",
        source: "Player's Handbook",
        desc: [
            "• +1 Con.",
            "• When rolling Hit Dice, min roll is 2x Con Mod."
        ],
        effects: [
            { type: 'asi', attributes: ['con'], amount: 1 }
        ]
    },
    {
        index: "elven-accuracy",
        name: "Elven Accuracy",
        source: "Xanathar's Guide to Everything",
        prerequisite: "Elf or Half-Elf",
        desc: [
            "• +1 Dex, Int, Wis, or Cha.",
            "• Reroll one die on advantage attacks (Dex/Int/Wis/Cha)."
        ],
        effects: [
            { type: 'asi_choice', options: ['dex', 'int', 'wis', 'cha'], amount: 1, count: 1 }
        ]
    },
    {
        index: "fey-touched",
        name: "Fey Touched",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Int, Wis, or Cha.",
            "• Learn Misty Step and one 1st-level Divination/Enchantment spell.",
            "• Cast each once for free per Long Rest."
        ],
        effects: [
            { type: 'asi_choice', options: ['int', 'wis', 'cha'], amount: 1, count: 1 },
            { type: 'spell_access', spell: 'Misty Step', count: 1, cast_free: true },
            { type: 'spell_access', school: 'Divination/Enchantment', level: 1, count: 1, cast_free: true }
        ]
    },
    {
        index: "great-weapon-master",
        name: "Great Weapon Master",
        source: "Player's Handbook",
        desc: [
            "• On a crit or reducing a creature to 0 HP, you can make one melee weapon attack as a bonus action.",
            "• Before making a melee attack with a heavy weapon you are proficient with, you can take a -5 penalty to the attack roll to add +10 to the damage."
        ],
        effects: [
            { type: 'bonus_action', name: 'GWM Cleave', description: 'On crit or kill, make one melee attack.' },
            { type: 'feature', name: 'Great Weapon Master', description: '-5 to hit, +10 damage with heavy weapons.' }
        ]
    },
    {
        index: "lucky",
        name: "Lucky",
        source: "Player's Handbook",
        desc: [
            "• You have 3 luck points per long rest.",
            "• Spend a point to roll an additional d20 on an attack, ability check, or save.",
            "• Can also spend a point to reroll an attack against you."
        ],
        effects: [
            { type: 'feature', name: 'Lucky Points', description: '3 points per long rest to roll an extra d20.' }
        ]
    },
    {
        index: "magic-initiate",
        name: "Magic Initiate",
        source: "Player's Handbook",
        desc: [
            "• Choose a class. Learn 2 cantrips and one 1st-level spell.",
            "• Cast 1st-level spell once per long rest."
        ],
        effects: [
            { type: 'class_choice', name: 'Spellcasting Class', options: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'] },
            { type: 'spell_access', level: 0, count: 2 },
            { type: 'spell_access', level: 1, count: 1, cast_free: true }
        ]
    },
    {
        index: "mobile",
        name: "Mobile",
        source: "Player's Handbook",
        desc: [
            "• Speed increases by 10ft.",
            "• Dash through difficult terrain doesn't cost extra movement.",
            "• When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn."
        ],
        effects: [
            { type: 'stat_bonus', stat: 'speed', value: 10 },
            { type: 'feature', name: 'Mobile', description: 'Dash ignores difficult terrain. No OAs from creatures you attack.' }
        ]
    },
    {
        index: "observant",
        name: "Observant",
        source: "Player's Handbook",
        desc: [
            "• +1 Int or Wis.",
            "• +5 to Passive Perception and Investigation."
        ],
        effects: [
            { type: 'asi_choice', options: ['int', 'wis'], amount: 1, count: 1 },
            { type: 'stat_bonus', stat: 'passive_perception', value: 5 },
            { type: 'stat_bonus', stat: 'passive_investigation', value: 5 }
        ]
    },
    {
        index: "piercer",
        name: "Piercer",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Str or Dex.",
            "• Reroll one piercing damage die per turn.",
            "• Crit with piercing: Add one extra damage die."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'dex'], amount: 1, count: 1 }
        ]
    },
    {
        index: "polearm-master",
        name: "Polearm Master",
        source: "Player's Handbook",
        desc: [
            "• When you attack with a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end (1d4 bludgeoning).",
            "• While wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack when they enter your reach."
        ],
        effects: [
            { type: 'bonus_action', name: 'Polearm Master Attack', description: '1d4 bludgeoning attack with opposite end of polearm.' },
            { type: 'feature', name: 'Polearm Master Reach', description: 'Creatures provoke OAs when entering reach.' }
        ]
    },
    {
        index: "resilient",
        name: "Resilient",
        source: "Player's Handbook",
        desc: [
            "• +1 to one ability score.",
            "• Gain proficiency in saving throws of that ability."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'dex', 'con', 'int', 'wis', 'cha'], amount: 1, count: 1, linked_save_proficiency: true }
        ]
    },
    {
        index: "sentinel",
        name: "Sentinel",
        source: "Player's Handbook",
        desc: [
            "• When you hit a creature with an opportunity attack, its speed becomes 0.",
            "• Creatures provoke opportunity attacks even if they use Disengage.",
            "• When a creature within 5ft makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against it."
        ],
        effects: [
            { type: 'reaction', name: 'Sentinel Attack', description: 'Attack creature that attacks ally within 5ft.' },
            { type: 'feature', name: 'Sentinel', description: 'OA hits reduce speed to 0. Ignore Disengage for OAs.' }
        ]
    },
    {
        index: "shadow-touched",
        name: "Shadow Touched",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Int, Wis, or Cha.",
            "• Learn Invisibility and one 1st-level Illusion/Necromancy spell.",
            "• Cast each once for free per Long Rest."
        ],
        effects: [
            { type: 'asi_choice', options: ['int', 'wis', 'cha'], amount: 1, count: 1 },
            { type: 'spell_access', spell: 'Invisibility', count: 1, cast_free: true },
            { type: 'spell_access', school: 'Illusion/Necromancy', level: 1, count: 1, cast_free: true }
        ]
    },
    {
        index: "sharpshooter",
        name: "Sharpshooter",
        source: "Player's Handbook",
        desc: [
            "• Attacking at long range doesn't impose disadvantage on ranged weapon attack rolls.",
            "• Your ranged weapon attacks ignore half cover and three-quarters cover.",
            "• Before making a ranged attack with a ranged weapon you are proficient with, you can take a -5 penalty to the attack roll to add +10 to the damage."
        ],
        effects: [
            { type: 'feature', name: 'Sharpshooter', description: 'No disadvantage at long range. Ignore cover. -5 to hit, +10 damage.' }
        ]
    },
    {
        index: "shield-master",
        name: "Shield Master",
        source: "Player's Handbook",
        desc: [
            "• Use bonus action to shove a creature within 5ft with your shield if you take the Attack action.",
            "• Add shield's AC bonus to Dex saves against spells/harmful effects that target only you.",
            "• If you succeed on a Dex save for half damage, you can use your reaction to take no damage."
        ],
        effects: [
            { type: 'bonus_action', name: 'Shield Shove', description: 'Shove creature with shield after Attack action.' },
            { type: 'reaction', name: 'Shield Cover', description: 'Take no damage on successful Dex save for half.' }
        ]
    },
    {
        index: "skill-expert",
        name: "Skill Expert",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 to one ability score.",
            "• Proficiency in one skill.",
            "• Expertise in one skill."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'dex', 'con', 'int', 'wis', 'cha'], amount: 1, count: 1 },
            { type: 'proficiency_choice', category: 'skill', count: 1 },
            { type: 'expertise_choice', category: 'skill', count: 1 }
        ]
    },
    {
        index: "skilled",
        name: "Skilled",
        source: "Player's Handbook",
        desc: [
            "• Gain proficiency in any combination of three skills or tools."
        ],
        effects: [
            { type: 'proficiency_choice', category: 'skill', count: 3 }
        ]
    },
    {
        index: "slasher",
        name: "Slasher",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Str or Dex.",
            "• Hit with slashing reduces target speed by 10ft.",
            "• Crit with slashing: Disadvantage to target for one turn."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'dex'], amount: 1, count: 1 }
        ]
    },
    {
        index: "tavern-brawler",
        name: "Tavern Brawler",
        source: "Player's Handbook",
        desc: [
            "• +1 Str or Con.",
            "• Proficient with improvised weapons.",
            "• Unarmed strike deals 1d4 damage.",
            "• When you hit with unarmed strike or improvised weapon, use bonus action to grapple."
        ],
        effects: [
            { type: 'asi_choice', options: ['str', 'con'], amount: 1, count: 1 },
            { type: 'proficiency', target: 'Improvised Weapons', category: 'tool' },
            { type: 'bonus_action', name: 'Tavern Brawler Grapple', description: 'Grapple after hit with unarmed/improvised weapon.' }
        ]
    },
    {
        index: "telekinetic",
        name: "Telekinetic",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Int, Wis, or Cha.",
            "• Mage Hand cantrip (invisible, 60ft range).",
            "• Bonus Action: Shove creature 5ft (Str save)."
        ],
        effects: [
            { type: 'asi_choice', options: ['int', 'wis', 'cha'], amount: 1, count: 1 },
            { type: 'spell_access', spell: 'Mage Hand', count: 1 }
        ]
    },
    {
        index: "telepathic",
        name: "Telepathic",
        source: "Tasha's Cauldron of Everything",
        desc: [
            "• +1 Int, Wis, or Cha.",
            "• Telepathy 60ft.",
            "• Cast Detect Thoughts once per long rest."
        ],
        effects: [
            { type: 'asi_choice', options: ['int', 'wis', 'cha'], amount: 1, count: 1 },
            { type: 'spell_access', spell: 'Detect Thoughts', count: 1, cast_free: true }
        ]
    },
    {
        index: "tough",
        name: "Tough",
        source: "Player's Handbook",
        desc: [
            "• +2 HP per level."
        ],
        effects: [
            { type: 'stat_bonus', stat: 'hp_per_level', value: 2 }
        ]
    },
    {
        index: "war-caster",
        name: "War Caster",
        source: "Player's Handbook",
        desc: [
            "• Advantage on Con saves to maintain concentration.",
            "• Can perform somatic components even with weapons/shield in hands.",
            "• When a creature provokes an OA, you can use your reaction to cast a spell (1 action casting time, targets only that creature)."
        ],
        effects: [
            { type: 'advantage', key: 'concentration', label: 'Con Saves (Concentration)' },
            { type: 'reaction', name: 'War Caster Spell', description: 'Cast a spell as an opportunity attack.' }
        ]
    }
];
