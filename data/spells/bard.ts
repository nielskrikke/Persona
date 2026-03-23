
import { SpellDetail } from '../../types';

export const BARD_SPELLS: SpellDetail[] = [
    // Cantrips
    { 
        index: "dancing-lights", 
        name: "Dancing Lights", 
        level: 0, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", 
        range: "120 feet", 
        components: ["V", "S", "M"], 
        material: "A bit of phosphorus or wychwood, or a glowworm.",
        duration: "Concentration, up to 1 minute", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.",
            "As a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell's range."
        ]
    },
    { 
        index: "light", 
        name: "Light", 
        level: 0, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", 
        range: "Touch", 
        components: ["V", "M"], 
        material: "A firefly or phosphorescent moss.",
        duration: "1 hour", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.",
            "If you target an object held or worn by a hostile creature, that creature must succeed on a Dexterity saving throw to avoid the spell."
        ],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "mage-hand", 
        name: "Mage Hand", 
        level: 0, 
        school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["V", "S"], 
        duration: "1 minute", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.",
            "You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.",
            "The hand can't attack, activate magic items, or carry more than 10 pounds."
        ]
    },
    { 
        index: "mending", 
        name: "Mending", 
        level: 0, 
        school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 minute", 
        range: "Touch", 
        components: ["V", "S", "M"], 
        material: "Two lodestones.",
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.",
            "This spell can physically repair a magic item or construct, but the spell can't restore magic to such an object."
        ]
    },
    { 
        index: "message", 
        name: "Message", 
        level: 0, 
        school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", 
        range: "120 feet", 
        components: ["V", "S", "M"], 
        material: "A short piece of copper wire.",
        duration: "1 round", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.",
            "You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn't have to follow a straight line and can travel freely around corners or through openings."
        ]
    },
    { 
        index: "minor-illusion", 
        name: "Minor Illusion", 
        level: 0, 
        school: { name: "Illusion", index: "illusion" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["S", "M"], 
        material: "A bit of fleece.",
        duration: "1 minute", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.",
            "If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.",
            "If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.",
            "If a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature."
        ]
    },
    { 
        index: "prestidigitation", 
        name: "Prestidigitation", 
        level: 0, 
        school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", 
        range: "10 feet", 
        components: ["V", "S"], 
        duration: "1 hour", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:",
            "• You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.",
            "• You instantaneously light or snuff out a candle, a torch, or a small campfire.",
            "• You instantaneously clean or soil an object no larger than 1 cubic foot.",
            "• You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.",
            "• You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.",
            "• You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.",
            "If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action."
        ]
    },
    { 
        index: "true-strike", 
        name: "True Strike", 
        level: 0, 
        school: { name: "Divination", index: "divination" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["S"], 
        duration: "Concentration, up to 1 round", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended."
        ]
    },
    { 
        index: "vicious-mockery", 
        name: "Vicious Mockery", 
        level: 0, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "60 feet", 
        components: ["V"], 
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn."
        ], 
        damage: { damage_type: {name:"Psychic", index:"psychic"}, damage_at_character_level: {"1":"1d4", "5":"2d4", "11":"3d4", "17":"4d4"} }, 
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "none" } 
    },
    {
        index: "thunderclap", name: "Thunderclap", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "5 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must succeed on a Constitution saving throw or take 1d6 thunder damage."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "blade-ward", name: "Blade Ward", level: 0, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks."]
    },
    {
        index: "friends", name: "Friends", level: 0, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "Self", components: ["S", "M"], material: "a small amount of makeup applied to the face as this spell is cast", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you. A creature prone to violence might attack you. Another creature might seek retribution in other ways (at the DM's discretion), depending on the nature of your interaction with it."]
    },

    // Level 1
    {
        index: "silvery-barbs", name: "Silvery Barbs", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 reaction", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You magically distract the triggering creature and turn its momentary uncertainty into encouragement for another creature. The triggering creature must reroll the d20 and use the lower roll. You can then choose a different creature you can see within range (you can choose yourself). The chosen creature has advantage on the next attack roll, ability check, or saving throw it makes within 1 minute. A creature can be empowered by only one use of this spell at a time."]
    },
    
    // Level 1
    { 
        index: "animal-friendship", 
        name: "Animal Friendship", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["V", "S", "M"], 
        material: "A morsel of food.",
        duration: "24 hours", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spells ends."
        ],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st."],
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "none" }
    },
    { 
        index: "bane", 
        name: "Bane", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["V", "S", "M"], 
        material: "A drop of blood.",
        duration: "Concentration, up to 1 minute", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."],
        dc: { dc_type: {name:"CHA", index:"cha"}, dc_success: "none" } 
    },
    { 
        index: "charm-person", 
        name: "Charm Person", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "30 feet", 
        components: ["V", "S"], 
        duration: "1 hour", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "none" } 
    },
    { 
        index: "comprehend-languages", 
        name: "Comprehend Languages", 
        level: 1, 
        school: { name: "Divination", index: "divination" }, 
        casting_time: "1 action", 
        range: "Self", 
        components: ["V", "S", "M"], 
        material: "A pinch of soot and salt.",
        duration: "1 hour", 
        ritual: true, 
        concentration: false, 
        classes: [], 
        desc: [
            "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.",
            "This spell doesn't decode secret messages in a text or a glyph, such as an arcane sigil, that isn't part of a written language."
        ] 
    },
    { 
        index: "cure-wounds", 
        name: "Cure Wounds", 
        level: 1, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", 
        range: "Touch", 
        components: ["V", "S"], 
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d8", "2":"2d8", "3":"3d8", "4":"4d8", "5":"5d8", "6":"6d8", "7":"7d8", "8":"8d8", "9":"9d8"} } 
    },
    { 
        index: "detect-magic", 
        name: "Detect Magic", 
        level: 1, 
        school: { name: "Divination", index: "divination" }, 
        casting_time: "1 action", 
        range: "Self", 
        components: ["V", "S"], 
        duration: "Concentration, up to 10 minutes", 
        ritual: true, 
        concentration: true, 
        classes: [], 
        desc: [
            "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.",
            "The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood."
        ] 
    },
    { 
        index: "disguise-self", 
        name: "Disguise Self", 
        level: 1, 
        school: { name: "Illusion", index: "illusion" }, 
        casting_time: "1 action", 
        range: "Self", 
        components: ["V", "S"], 
        duration: "1 hour", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can't change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you.",
            "The changes wrought by this spell fail to hold up to physical inspection. To discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your spell save DC."
        ] 
    },
    { 
        index: "dissonant-whispers", 
        name: "Dissonant Whispers", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "60 feet", 
        components: ["V"], 
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You whisper a discordant melody that only one eligible creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: {name:"Psychic", index:"psychic"}, damage_at_slot_level: {"1":"3d6", "2":"4d6", "3":"5d6", "4":"6d6", "5":"7d6", "6":"8d6", "7":"9d6", "8":"10d6", "9":"11d6"} }, 
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "half" } 
    },
    { 
        index: "faerie-fire", 
        name: "Faerie Fire", 
        level: 1, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", 
        range: "60 feet", 
        components: ["V"], 
        duration: "Concentration, up to 1 minute", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.",
            "Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible."
        ], 
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" } 
    },
    { 
        index: "feather-fall", 
        name: "Feather Fall", 
        level: 1, 
        school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 reaction", 
        range: "60 feet", 
        components: ["V", "M"], 
        material: "A small feather or piece of down.",
        duration: "1 minute", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature."
        ]
    },
    { 
        index: "healing-word", 
        name: "Healing Word", 
        level: 1, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 bonus action", 
        range: "60 feet", 
        components: ["V"], 
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "A creature of your choice that you can see within range regains a number of hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d4", "2":"2d4", "3":"3d4", "4":"4d4", "5":"5d4", "6":"6d4", "7":"7d4", "8":"8d4", "9":"9d4"} } 
    },
    { 
        index: "heroism", 
        name: "Heroism", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "Touch", 
        components: ["V", "S"], 
        duration: "Concentration, up to 1 minute", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns. When the spell ends, the target loses any remaining temporary hit points from this spell."
        ],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "identify", 
        name: "Identify", 
        level: 1, 
        school: { name: "Divination", index: "divination" }, 
        casting_time: "1 minute", 
        range: "Touch", 
        components: ["V", "S", "M"], 
        material: "A pearl worth at least 100 gp and an owl feather.",
        duration: "Instantaneous", 
        ritual: true, 
        concentration: false, 
        classes: [], 
        desc: [
            "You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.",
            "If you instead touch a creature throughout the casting, you learn what spells, if any, are currently affecting it."
        ] 
    },
    { 
        index: "illusory-script", 
        name: "Illusory Script", 
        level: 1, 
        school: { name: "Illusion", index: "illusion" }, 
        casting_time: "1 minute", 
        range: "Touch", 
        components: ["S", "M"], 
        material: "A lead-based ink worth at least 10 gp, which the spell consumes.",
        duration: "10 days", 
        ritual: true, 
        concentration: false, 
        classes: [], 
        desc: [
            "You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration.",
            "To you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, you can cause the writing to appear to be an entirely different message, written in a different hand and language, though the language must be one you know.",
            "Should the spell be dispelled, the original script and the illusion both disappear. A creature with truesight can read the hidden message."
        ] 
    },
    { 
        index: "longstrider", 
        name: "Longstrider", 
        level: 1, 
        school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", 
        range: "Touch", 
        components: ["V", "S", "M"], 
        material: "A pinch of dirt.",
        duration: "1 hour", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "You touch a creature. The target's speed increases by 10 feet until the spell ends."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "silent-image", 
        name: "Silent Image", 
        level: 1, 
        school: { name: "Illusion", index: "illusion" }, 
        casting_time: "1 action", 
        range: "60 feet", 
        components: ["V", "S", "M"], 
        material: "A bit of fleece.",
        duration: "Concentration, up to 10 minutes", 
        ritual: false, 
        concentration: true, 
        classes: [], 
        desc: [
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects.",
            "You can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image.",
            "Physical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image."
        ] 
    },
    { 
        index: "sleep", 
        name: "Sleep", 
        level: 1, 
        school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", 
        range: "90 feet", 
        components: ["V", "S", "M"], 
        material: "A pinch of fine sand, rose petals, or a cricket.",
        duration: "1 minute", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).",
            "Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature's hit points from the total before moving on to the creature with the next lowest hit points. A creature's hit points must be equal to or less than the remaining total for that creature to be affected.",
            "Undead and creatures immune to being charmed aren't affected by this spell."
        ],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st."],
        damage: { damage_type: {name:"None", index:"none"}, damage_at_slot_level: {"1":"5d8", "2":"7d8", "3":"9d8", "4":"11d8", "5":"13d8", "6":"15d8", "7":"17d8", "8":"19d8", "9":"21d8"} }
    },
    {
        index: "speak-with-animals", name: "Speak with Animals", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "10 minutes", ritual: true, concentration: false, classes: [],
        desc: ["You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day."]
    },
    {
        index: "tashas-hideous-laughter", name: "Tasha's Hideous Laughter", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "tiny tarts and a feather that is waved in the air", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "unseen-servant", name: "Unseen Servant", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a piece of string and a bit of wood", duration: "1 hour", ritual: true, concentration: false, classes: [],
        desc: ["This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can't attack. If it drops to 0 hit points, the spell ends."]
    },
    {
        index: "color-spray", name: "Color Spray", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self (15-foot cone)", components: ["V", "S", "M"], material: "a pinch of powder or sand that is colored red, yellow, and blue", duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["A dazzling array of flashing, colored lights springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can affect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can't see)."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st."]
    },
    {
        index: "command", name: "Command", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "thunderwave", 
        name: "Thunderwave", 
        level: 1, 
        school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", 
        range: "Self (15-foot cube)", 
        components: ["V", "S"], 
        duration: "Instantaneous", 
        ritual: false, 
        concentration: false, 
        classes: [], 
        desc: [
            "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed.",
            "In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet."
        ], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: {name:"Thunder", index:"thunder"}, damage_at_slot_level: {"1":"2d8", "2":"3d8", "3":"4d8", "4":"5d8", "5":"6d8", "6":"7d8", "7":"8d8", "8":"9d8", "9":"10d8"} }, 
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "half" } 
    },

    // Level 2
    { 
        index: "animal-messenger", name: "Animal Messenger", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["Choose a Tiny beast you can see within range. You specify a location, which you must have visited, and a recipient who matches a general description. You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours. When the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice."],
        higher_level: ["If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd."]
    },
    { 
        index: "blindness-deafness", name: "Blindness/Deafness", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "calm-emotions", name: "Calm Emotions", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw. On a failure, you can choose one of the following two effects. You can suppress any effect causing a target to be charmed or frightened. Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "cloud-of-daggers", name: "Cloud of Daggers", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell's area for the first time on a turn or starts its turn there."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd."],
        damage: { damage_type: { name: "Slashing", index: "slashing" }, damage_at_slot_level: { "2": "4d4", "3": "6d4", "4": "8d4", "5": "10d4" } }
    },
    { 
        index: "crown-of-madness", name: "Crown of Madness", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes. The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "detect-thoughts", name: "Detect Thoughts", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn't speak any language, the creature is unaffected."]
    },
    { 
        index: "enhance-ability", name: "Enhance Ability", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends. Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, or Owl's Wisdom."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."]
    },
    { 
        index: "enthrall", name: "Enthrall", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you for the duration."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "heat-metal", name: "Heat Metal", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d8", "3": "3d8", "4": "4d8", "5": "5d8" } }
    },
    { 
        index: "hold-person", name: "Hold Person", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "invisibility", name: "Invisibility", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."]
    },
    { 
        index: "knock", name: "Knock", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked."]
    },
    { 
        index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."]
    },
    { 
        index: "locate-animals-or-plants", name: "Locate Animals or Plants", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present."]
    },
    { 
        index: "locate-object", name: "Locate Object", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement."]
    },
    { 
        index: "magic-mouth", name: "Magic Mouth", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], duration: "Until dispelled", ritual: true, concentration: false, classes: [], 
        desc: ["You implant a message within an object in range, a message that is uttered when a trigger condition is met. You choose an object that you can see and that isn't being worn or carried by another creature."]
    },
    { 
        index: "see-invisibility", name: "See Invisibility", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent."]
    },
    { 
        index: "shatter", name: "Shatter", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one. A creature made of inorganic material such as stone, crystal, or metal has disadvantage on this saving throw."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "2": "3d8", "3": "4d8", "4": "5d8", "5": "6d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    {
        index: "pyrotechnics", name: "Pyrotechnics", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Choose an area of nonmagical flame that you can see within range and that fits within a 5-foot cube. You can extinguish the fire in that area, and you create either fireworks or smoke."]
    },
    {
        index: "catnap", name: "Catnap", level: 3, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["S", "M"], material: "a pinch of sand", duration: "10 minutes", ritual: false, concentration: false, classes: [],
        desc: ["You make a calming gesture, and up to three willing creatures of your choice that you can see within range fall unconscious for the spell’s duration. The spell ends on a self-chosen creature early if it takes damage or someone uses an action to shake or slap it awake. If a creature remains unconscious for the full duration, that creature gains all the benefits of a short rest, and it can’t be affected by this spell again until it finishes a long rest."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you can target one additional willing creature for each slot level above 3rd."]
    },
    {
        index: "enemies-abound", name: "Enemies Abound", level: 3, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You reach into the mind of one creature you can see and force it to make an Intelligence saving throw. A creature automatically succeeds if it is immune to being charmed. On a failed save, the target loses the ability to distinguish friend from foe, regarding all creatures it can see as enemies until the spell ends. Each time the target takes damage, it can repeat the saving throw, ending the effect on itself on a success."],
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    { 
        index: "silence", name: "Silence", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there."]
    },
    { 
        index: "suggestion", name: "Suggestion", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "M"], duration: "Concentration, up to 8 hours", ritual: false, concentration: true, classes: [], 
        desc: ["You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of activity sound reasonable."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "zone-of-truth", name: "Zone of Truth", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether each creature succeeds or fails on its saving throw."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    {
        index: "aid", name: "Aid", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "a tiny strip of white cloth", duration: "8 hours", ritual: false, concentration: false, classes: [],
        desc: ["Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd."]
    },
    {
        index: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "a pinch of powdered iron", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "mirror-image", name: "Mirror Image", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [],
        desc: ["Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates."]
    },
    {
        index: "phantasmal-force", name: "Phantasmal Force", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a bit of fleece", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You craft an illusion that settles in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs."],
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    {
        index: "skywrite", name: "Skywrite", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Sight", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: true, concentration: true, classes: [],
        desc: ["You cause up to ten words to form in a part of the sky you can see. The words appear to be made of clouds and remain in place for the duration. The words dissipate when the spell ends. A strong wind disperses the clouds and ends the spell early."]
    },
    {
        index: "warding-wind", name: "Warding Wind", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["A strong wind (20 miles per hour) blows around you in a 10-foot radius and moves with you, remaining centered on you. The wind lasts for the spell's duration."]
    },

    // Level 3
    { 
        index: "bestow-curse", name: "Bestow Curse", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: Disadvantage on checks/saves; Disadvantage on attacks vs you; Wisdom save to act; or Extra 1d8 necrotic damage from your attacks."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "clairvoyance", name: "Clairvoyance", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "1 mile", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with."]
    },
    { 
        index: "dispel-magic", name: "Dispel Magic", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used."]
    },
    { 
        index: "fear", name: "Fear", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self (30-foot cone)", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["When you cast this spell, you inscribe a glyph that later unleashes a magical effect. You can choose from Explosive Runes (5d8 damage) or Spell Glyph (stores a spell)."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd."],
        damage: { damage_type: { name: "Varies", index: "varies" }, damage_at_slot_level: { "3": "5d8", "4": "6d8", "5": "7d8", "6": "8d8", "7": "9d8" } }
    },
    { 
        index: "hypnotic-pattern", name: "Hypnotic Pattern", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "major-image", name: "Major Image", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image seems completely real, including sounds, smells, and temperature appropriate to the thing depicted."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration."]
    },
    { 
        index: "nondetection", name: "Nondetection", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can't be targeted by any divination magic or perceived through magical scrying sensors."]
    },
    { 
        index: "plant-growth", name: "Plant Growth", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits (overgrowth hinders movement or enriches land)."]
    },
    { 
        index: "sending", name: "Sending", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Unlimited", components: ["V", "S", "M"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately."]
    },
    { 
        index: "speak-with-dead", name: "Speak with Dead", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "10 feet", components: ["V", "S", "M"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead."]
    },
    { 
        index: "speak-with-plants", name: "Speak with Plants", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands."]
    },
    { 
        index: "stinking-cloud", name: "Stinking Cloud", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. Each creature that starts its turn in the cloud must succeed on a Constitution saving throw or spend its action that turn retching and reeling."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "tongues", name: "Tongues", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says."]
    },
    {
        index: "intellect-fortress", name: "Intellect Fortress", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You create a telepathic barrier around yourself or a willing creature you can see within range. Until the spell ends, the creature has resistance to psychic damage, and it has advantage on Intelligence, Wisdom, and Charisma saving throws."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them."]
    },
    {
        index: "leomunds-tiny-hut", name: "Leomund's Tiny Hut", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 minute", range: "Self (10-foot-radius hemisphere)", components: ["V", "S", "M"], material: "a small crystal bead", duration: "8 hours", ritual: true, concentration: false, classes: [],
        desc: ["A 10-foot-radius, immobile dome of force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area."]
    },
    {
        index: "mass-healing-word", name: "Mass Healing Word", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "3": "1d4", "4": "2d4", "5": "3d4", "6": "4d4", "7": "5d4", "8": "6d4", "9": "7d4" } }
    },
    {
        index: "slow", name: "Slow", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "a drop of molasses", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 4
    { 
        index: "compulsion", name: "Compulsion", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Creatures of your choice that you can see within range and that can hear you must make a Wisdom saving throw. A target automatically succeeds on this saving throw if it can't be charmed. On a failed save, a target is affected by this spell. Until the spell ends, you can use a bonus action on each of your turns to designate a direction that is horizontal to you. Each affected target must use as much of its movement as possible to move in that direction on its next turn."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "confusion", name: "Confusion", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell assaults and twists creatures' minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or be affected by it."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the radius of the sphere increases by 5 feet for each slot level above 4th."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "dimension-door", name: "Dimension Door", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction. You can bring along objects as long as their weight doesn't exceed what you can carry. You can also bring one willing creature of your size or smaller."]
    },
    { 
        index: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained."]
    },
    { 
        index: "greater-invisibility", name: "Greater Invisibility", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person."]
    },
    { 
        index: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "300 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain."]
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."]
    },
    { 
        index: "polymorph", name: "Polymorph", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "charm-monster", name: "Charm Monster", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "phantasmal-killer", name: "Phantasmal Killer", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "4": "4d10", "5": "5d10", "6": "6d10", "7": "7d10", "8": "8d10", "9": "9d10" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 5
    { 
        index: "animate-objects", name: "Animate Objects", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Objects come to life at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. Medium targets count as two objects, Large targets count as four objects, Huge targets count as eight objects."],
        higher_level: ["If you cast this spell using a spell slot of 6th level or higher, you can animate two additional objects for each slot level above 5th."]
    },
    { 
        index: "awaken", name: "Awaken", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "8 hours", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["After spending the casting time tracing magical pathways within a precious gemstone, you touch a Huge or smaller beast or plant. The target must have either no Intelligence score or an Intelligence of 3 or less. The target gains an Intelligence of 10. The target also gains the ability to speak one language you know."]
    },
    { 
        index: "dominate-person", name: "Dominate Person", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the target is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence."],
        higher_level: ["When you cast this spell using a spell slot of 6th level, the duration is concentration, up to 10 minutes. When you use a spell slot of 7th level, the duration is concentration, up to 1 hour. When you use a spell slot of 8th level or higher, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "dream", name: "Dream", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "Unlimited", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. Creatures that don't sleep, such as elves, can't be contacted by this spell. You, or a willing creature you touch, enters a trance state, acting as a messenger."]
    },
    { 
        index: "geas", name: "Geas", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 minute", range: "60 feet", components: ["V"], duration: "30 days", ritual: false, concentration: false, classes: [], 
        desc: ["You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you cast this spell using a spell slot of 9th level, the spell lasts until it is ended by one of the spells mentioned above."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_character_level: { "1": "5d10" } }, // 5d10 once per day if disobeys
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "greater-restoration", name: "Greater Restoration", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target: Charm/Petrify, Curse, Ability Reduction, HP Max Reduction."]
    },
    { 
        index: "hold-monster", name: "Hold Monster", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "legend-lore", name: "Legend Lore", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named."]
    },
    { 
        index: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "5": "3d8", "6": "4d8", "7": "5d8", "8": "6d8", "9": "7d8" } }
    },
    { 
        index: "mislead", name: "Mislead", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You become invisible at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends if you attack or cast a spell."]
    },
    { 
        index: "modify-memory", name: "Modify Memory", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to reshape another creature's memories. One creature that you can see must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target becomes charmed by you for the duration."],
        higher_level: ["If you use a spell slot of 6th level or higher, you can alter the target's memories of an event that took place up to 7 days ago (6th level), 30 days ago (7th level), 1 year ago (8th level), or any time in the creature's past (9th level)."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "planar-binding", name: "Planar Binding", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of a higher level, the duration increases to 10 days (6th level), 30 days (7th level), 180 days (8th level), and a year and a day (9th level)."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "raise-dead", name: "Raise Dead", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point."]
    },
    { 
        index: "scrying", name: "Scrying", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "seeming", name: "Seeming", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target you choose a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected by this spell."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "teleportation-circle", name: "Teleportation Circle", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "10 feet", components: ["V", "M"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you."]
    },
    {
        index: "rarys-telepathic-bond", name: "Rary's Telepathic Bond", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "pieces of eggshell from two different kinds of creatures", duration: "1 hour", ritual: true, concentration: false, classes: [],
        desc: ["You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can't extend to other planes of existence."]
    },
    {
        index: "skill-empowerment", name: "Skill Empowerment", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["Your magic deepens a creature's understanding of its own talent. You touch one willing creature and give it expertise in one skill of your choice; until the spell ends, the creature doubles its proficiency bonus for any ability check it makes that uses the chosen skill. You must choose a skill in which the creature is already proficient and that isn't already benefiting from an effect, such as Expertise, that doubles its proficiency bonus."]
    },
    {
        index: "synaptic-static", name: "Synaptic Static", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You cause a psychic explosion to erupt at a point of your choice within range. Each creature in a 20-foot-radius sphere centered on that point must make an Intelligence saving throw. A creature with an Intelligence score of 2 or less is unaffected. A target takes 8d6 psychic damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "5": "8d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "half" }
    },

    // Level 6
    { 
        index: "eyebite", name: "Eyebite", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects: Asleep, Panicked, or Sickened."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "find-the-path", name: "Find the Path", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], duration: "Concentration, up to 1 day", ritual: false, concentration: true, classes: [], 
        desc: ["This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence."]
    },
    { 
        index: "guards-and-wards", name: "Guards and Wards", level: 6, school: { name: "Abjuration", index: "abjuration" }, casting_time: "10 minutes", range: "Touch", components: ["V", "S", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You create a ward that protects up to 2,500 square feet of floor space. The warded area can be up to 20 feet tall, and shaped as you desire. You can cast Corridors, Doors, Stairs effects within."]
    },
    { 
        index: "mass-suggestion", name: "Mass Suggestion", level: 6, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You suggest a course of activity (limited to a sentence or two) and magically influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can't be charmed are immune to this effect."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, the duration is 10 days. When you use an 8th-level spell slot, the duration is 30 days. When you use a 9th-level spell slot, the duration is a year and a day."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "ottos-irresistible-dance", name: "Otto's Irresistible Dance", level: 6, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can't be charmed are immune to this spell. A dancing creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls. As an action, a dancing creature makes a Wisdom saving throw to regain control of itself."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "programmed-illusion", name: "Programmed Illusion", level: 6, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You create an illusion of an object, a creature, or some other visible phenomenon within range that activates when a specific condition occurs. The illusion is imperceptible until then. It must be no larger than a 30-foot cube."]
    },
    { 
        index: "true-seeing", name: "True Seeing", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet."]
    },
    {
        index: "heroes-feast", name: "Heroes' Feast", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "30 feet", components: ["V", "S", "M"], material: "a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't charm until they have finished the feast. Up to twelve creatures can partake of the feast. A creature that partakes of the feast gains several benefits: immunity to poison and being frightened, and all saving throws are made with advantage. Its hit point maximum also increases by 2d10, and it gains the same number of hit points. These benefits last for 24 hours."]
    },

    // Level 7
    { 
        index: "etherealness", name: "Etherealness", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell."],
        higher_level: ["When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including yourself) for each slot level above 7th. The creatures must be within 10 feet of you when you cast the spell."]
    },
    { 
        index: "forcecage", name: "Forcecage", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box."]
    },
    { 
        index: "mirage-arcane", name: "Mirage Arcane", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "Sight", components: ["V", "S"], duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same, however."]
    },
    { 
        index: "mordenkainens-magnificent-mansion", name: "Mordenkainen's Magnificent Mansion", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "300 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You conjure an extradimensional dwelling in range that lasts for the duration. You choose where its one entrance is located. The entrance shimmers faintly and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the portal remains open."]
    },
    { 
        index: "mordenkainens-sword", name: "Mordenkainen's Sword", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a shimmering, sword-shaped plane of force that hovers within range. It lasts for the duration. When the sword appears, you make a melee spell attack against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "7": "3d10" } }
    },
    { 
        index: "project-image", name: "Project Image", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "500 miles", components: ["V", "S", "M"], duration: "Concentration, up to 1 day", ritual: false, concentration: true, classes: [], 
        desc: ["You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before, regardless of intervening obstacles."]
    },
    { 
        index: "regenerate", name: "Regenerate", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points per minute)."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "7": "4d8" } } // +15 fixed not in dice string usually
    },
    { 
        index: "resurrection", name: "Resurrection", level: 7, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't undead. If its soul is free and willing, the target returns to life with all its hit points."]
    },
    { 
        index: "symbol", name: "Symbol", level: 7, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You scribe a potent rune on a surface or within an object that can be closed. When triggered, the glyph enacts one of the following effects: Death (10d10 necrotic), Discord, Fear, Hopelessness, Insanity, Pain, Sleep, or Stunning."]
    },
    { 
        index: "teleport", name: "Teleport", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can't be held or carried by an unwilling creature."]
    },
    {
        index: "dream-of-the-blue-veil", name: "Dream of the Blue Veil", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "20 feet", components: ["V", "S", "M"], material: "a magic item or a willing creature from the destination world", duration: "6 hours", ritual: false, concentration: false, classes: [],
        desc: ["You and up to eight willing creatures within range fall into a deep sleep and dream of a journey to another world on the Material Plane. You must have an item or a creature from that world to serve as a beacon. At the end of the sleep, you and the other creatures wake up in that world, in a location you choose. If you don't choose a location, you arrive in a random location."]
    },
    {
        index: "prismatic-spray", name: "Prismatic Spray", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot cone)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot cone must make a Dexterity saving throw. For each target, roll a d8 to determine which color ray affects it."],
        damage: { damage_type: { name: "Varies", index: "varies" }, damage_at_slot_level: { "7": "10d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },

    // Level 8
    { 
        index: "dominate-monster", name: "Dominate Monster", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw."],
        higher_level: ["When you cast this spell using a 9th-level spell slot, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "feeblemind", name: "Feeblemind", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must make an Intelligence saving throw. On a failed save, the creature's Intelligence and Charisma scores become 1. The creature can't cast spells, activate magic items, understand language, or communicate in any intelligible way."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "8": "4d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    { 
        index: "glibness", name: "Glibness", level: 8, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful."]
    },
    { 
        index: "mind-blank", name: "Mind Blank", level: 8, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch is immune to psychic damage, to any effect that would sense its emotions or read its thoughts, to divination spells, and to the charmed condition."]
    },
    { 
        index: "power-word-stun", name: "Power Word Stun", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You speak a word of power that can overwhelm the mind of one creature you can see within range. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect."]
    },
    {
        index: "antipathy-sympathy", name: "Antipathy/Sympathy", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "either a lump of alum soaked in vinegar for the antipathy effect or a drop of honey for the sympathy effect", duration: "10 days", ritual: false, concentration: false, classes: [],
        desc: ["This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 20-foot cube. Then specify a kind of intelligent creature, such as red dragons, goblins, or vampires. You invest the target with an aura that either attracts or repels the specified creatures for the duration. Choose antipathy or sympathy as the aura's effect."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 9
    { 
        index: "foresight", name: "Foresight", level: 9, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration."]
    },
    { 
        index: "power-word-kill", name: "Power Word Kill", level: 9, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect."]
    },
    { 
        index: "true-polymorph", name: "True Polymorph", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into an object, or the object into a creature (the object must be neither worn nor carried by another creature). The transformation lasts for the duration, or until the target drops to 0 hit points or dies. If you concentrate on this spell for the full duration, the transformation becomes permanent."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "prismatic-wall", name: "Prismatic Wall", level: 9, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [],
        desc: ["A shimmering, multicolored plane of light forms a vertical opaque wall—up to 90 feet long, 30 feet high, and 1 inch thick—centered on a point you can see within range. Alternatively, you can shape the wall into a sphere up to 30 feet in diameter centered on a point you choose within range. The wall remains in place for the duration. If you position the wall so that it passes through a space occupied by a creature, the spell fails, and your action is lost."]
    }
];
