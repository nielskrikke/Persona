import { FeatDetail } from '../types';

// Data Architecture for Automating Feat Effects
export type FeatModifier = 
    | { type: 'asi'; attributes: string[]; amount: number } 
    | { type: 'asi_choice'; options: string[]; amount: number; count: number; linked_save_proficiency?: boolean } 
    | { type: 'stat_bonus'; stat: 'initiative' | 'hp_per_level' | 'ac' | 'speed' | 'passive_perception' | 'passive_investigation'; value: number }
    | { type: 'proficiency'; target: string; category: 'skill' | 'save' | 'tool' | 'language' } 
    | { type: 'proficiency_choice'; category: 'skill' | 'tool' | 'language'; options?: string[]; count: number } 
    | { type: 'expertise_choice'; category: 'skill'; count: number } 
    | { type: 'advantage'; key: string; label: string } 
    | { type: 'spell_access'; spell?: string; school?: string; level?: number; count: number; cast_free?: boolean; filter_class?: string } 
    | { type: 'feature'; name: string; description: string } 
    | { type: 'bonus_action'; name: string; description: string }
    | { type: 'action'; name: string; description: string }
    | { type: 'reaction'; name: string; description: string };

export interface ExtendedFeatDetail extends FeatDetail {
    source: string;
    prerequisite?: string;
    effects?: FeatModifier[];
}

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
        index: "magic-initiate",
        name: "Magic Initiate",
        source: "Player's Handbook",
        desc: [
            "• Choose a class. Learn 2 cantrips and one 1st-level spell.",
            "• Cast 1st-level spell once per long rest."
        ],
        effects: [
            { type: 'spell_access', level: 0, count: 2 },
            { type: 'spell_access', level: 1, count: 1, cast_free: true }
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
    }
];
