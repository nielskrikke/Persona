
import { SpellDetail } from '../../types';

export const WARLOCK_SPELLS: SpellDetail[] = [
    // Cantrips
    { 
        index: "blade-ward", name: "Blade Ward", level: 0, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks."]
    },
    { 
        index: "chill-touch", name: "Chill Touch", level: 0, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target. If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn."],
        damage: { damage_type: {name:"Necrotic", index:"necrotic"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { 
        index: "eldritch-blast", name: "Eldritch Blast", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.", "The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam."],
        damage: { damage_type: {name:"Force", index:"force"}, damage_at_character_level: {"1":"1d10", "5":"2d10", "11":"3d10", "17":"4d10"} }
    },
    { 
        index: "friends", name: "Friends", level: 0, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "Self", components: ["S", "M"], material: "A small amount of makeup applied to the face.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you."]
    },
    { 
        index: "mage-hand", name: "Mage Hand", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand."]
    },
    { 
        index: "minor-illusion", name: "Minor Illusion", level: 0, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "30 feet", components: ["S", "M"], material: "A bit of fleece.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again."]
    },
    { 
        index: "poison-spray", name: "Poison Spray", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage."],
        damage: { damage_type: {name:"Poison", index:"poison"}, damage_at_character_level: {"1":"1d12", "5":"2d12", "11":"3d12", "17":"4d12"} },
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" }
    },
    { 
        index: "prestidigitation", name: "Prestidigitation", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: sensory effect, light/snuff candle, clean/soil object, chill/warm/flavor material, color mark, create trinket."]
    },
    { 
        index: "true-strike", name: "True Strike", level: 0, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Concentration, up to 1 round", ritual: false, concentration: true, classes: [], 
        desc: ["You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended."]
    },

    // Level 1
    { 
        index: "armor-of-agathys", name: "Armor of Agathys", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A cup of water.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st."]
    },
    { 
        index: "arms-of-hadar", name: "Arms of Hadar", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can't take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "1": "2d6", "2": "3d6", "3": "4d6", "4": "5d6", "5": "6d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "half" }
    },
    { 
        index: "charm-person", name: "Charm Person", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "comprehend-languages", name: "Comprehend Languages", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A pinch of soot and salt.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written."]
    },
    { 
        index: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action."]
    },
    { 
        index: "hellish-rebuke", name: "Hellish Rebuke", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 reaction", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "1": "2d10", "2": "3d10", "3": "4d10", "4": "5d10", "5": "6d10" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "hex", name: "Hex", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 bonus action", range: "90 feet", components: ["V", "S", "M"], material: "The petrified eye of a newt.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability."],
        higher_level: ["When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "1": "1d6" } } // Damage doesn't scale, duration does
    },
    { 
        index: "illusory-script", name: "Illusory Script", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "Touch", components: ["S", "M"], material: "A lead-based ink worth at least 10 gp, which the spell consumes.", duration: "10 days", ritual: true, concentration: false, classes: [], 
        desc: ["You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration."]
    },
    { 
        index: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them."]
    },
    { 
        index: "unseen-servant", name: "Unseen Servant", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 ritual", range: "60 feet", components: ["V", "S", "M"], material: "A piece of string and a bit of wood.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends."]
    },
    { 
        index: "witch-bolt", name: "Witch Bolt", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A twig from a tree that has been struck by lightning.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "1": "1d12", "2": "2d12", "3": "3d12", "4": "4d12", "5": "5d12" } }
    },

    // Level 2
    { 
        index: "cloud-of-daggers", name: "Cloud of Daggers", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A sliver of glass.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
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
        index: "darkness", name: "Darkness", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "M"], material: "Bat fur and a drop of pitch or piece of coal.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it."]
    },
    { 
        index: "enthrall", name: "Enthrall", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You weave a distracting string of words, causing creatures of your choice that you can see within range and that can hear you to make a Wisdom saving throw. Any creature that can't be charmed succeeds on this saving throw automatically, and if you or your companions are fighting a creature, it has advantage on the save. On a failed save, the target has disadvantage on Wisdom (Perception) checks made to perceive any creature other than you for the duration."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "hold-person", name: "Hold Person", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "invisibility", name: "Invisibility", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "An eyelash encased in gum arabic.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."]
    },
    { 
        index: "mirror-image", name: "Mirror Image", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates."]
    },
    { 
        index: "misty-step", name: "Misty Step", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see."]
    },
    { 
        index: "ray-of-enfeeblement", name: "Ray of Enfeeblement", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends. At the end of each of the target's turns, it can make a Constitution saving throw against the spell. On a success, the spell ends."]
    },
    { 
        index: "shatter", name: "Shatter", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A chip of mica.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. A creature takes 3d8 thunder damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "2": "3d8", "3": "4d8", "4": "5d8", "5": "6d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "spider-climb", name: "Spider Climb", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A drop of bitumen and a spider.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed."]
    },
    { 
        index: "suggestion", name: "Suggestion", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "M"], material: "A snake's tongue and either a bit of honeycomb or a drop of sweet oil.", duration: "Concentration, up to 8 hours", ritual: false, concentration: true, classes: [], 
        desc: ["You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. Creatures that can't be charmed are immune to this effect. The suggestion must be worded in such a manner as to make the course of activity sound reasonable."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 3
    { 
        index: "counterspell", name: "Counterspell", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "60 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used."]
    },
    { 
        index: "dispel-magic", name: "Dispel Magic", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the level of the spell slot you used."]
    },
    { 
        index: "fear", name: "Fear", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self (30-foot cone)", components: ["V", "S", "M"], material: "A white feather or the heart of a hen.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "fly", name: "Fly", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A wing feather from any bird.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a willing creature. The target gains a flying speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft, unless it can stop the fall."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd."]
    },
    { 
        index: "gaseous-form", name: "Gaseous Form", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A bit of gauze and a wisp of smoke.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You transform a willing creature you touch, along with everything it's wearing and carrying, into a misty cloud for the duration. The spell ends if the creature drops to 0 hit points. An incorporeal creature isn't affected."]
    },
    { 
        index: "hypnotic-pattern", name: "Hypnotic Pattern", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["S", "M"], material: "A glowing stick of incense or a crystal vial filled with phosphorescent material.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "magic-circle", name: "Magic Circle", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron worth at least 100 gp, which the spell consumes.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface. Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways: The creature can't willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw. The creature has disadvantage on attack rolls against targets within the cylinder. Targets within the cylinder can't be charmed, frightened, or possessed by the creature."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd."]
    },
    { 
        index: "major-image", name: "Major Image", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A bit of fleece.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image seems completely real, including sounds, smells, and temperature appropriate to the thing depicted."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration."]
    },
    { 
        index: "remove-curse", name: "Remove Curse", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded."]
    },
    { 
        index: "tongues", name: "Tongues", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A small clay model of a ziggurat.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says."]
    },
    { 
        index: "vampiric-touch", name: "Vampiric Touch", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "3": "3d6", "4": "4d6", "5": "5d6", "6": "6d6", "7": "7d6", "8": "8d6", "9": "9d6" } }
    },

    // Level 4
    { 
        index: "banishment", name: "Banishment", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "An item distasteful to the target.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished. If the target is native to the plane of existence you're on, you banish the target to a harmless demiplane. If the target is native to a different plane of existence than the one you're on, the target is banished with a faint popping noise, returning to its home plane."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "blight", name: "Blight", level: 4, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "4": "8d8", "5": "9d8", "6": "10d8", "7": "11d8", "8": "12d8", "9": "13d8" } }
    },
    { 
        index: "dimension-door", name: "Dimension Door", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction."]
    },
    { 
        index: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "300 feet", components: ["V", "S", "M"], material: "A stone, a twig, and a bit of green plant.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain."]
    },

    // Level 5
    { 
        index: "contact-other-plane", name: "Contact Other Plane", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V"], duration: "1 minute", ritual: true, concentration: false, classes: [], 
        desc: ["You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. Contacting this extraplanar intelligence can strain or even break your mind. When you cast this spell, make a DC 15 Intelligence saving throw. On a failure, you take 6d6 psychic damage and are insane until you finish a long rest. On a success, you can ask the entity up to five questions."]
    },
    { 
        index: "dream", name: "Dream", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "Unlimited", components: ["V", "S", "M"], material: "A handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. Creatures that don't sleep, such as elves, can't be contacted by this spell. You, or a willing creature you touch, enters a trance state, acting as a messenger."]
    },
    { 
        index: "hold-monster", name: "Hold Monster", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "scrying", name: "Scrying", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "A focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 6
    { 
        index: "arcane-gate", name: "Arcane Gate", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create linked teleportation portals that remain open for the duration. Choose two points on the ground that you can see, one point within 10 feet of you and one point within 500 feet of you. A circular portal, 10 feet in diameter, opens over each point. If the portal would open in the space occupied by a creature, the spell fails, and the casting is lost. The portals are two-dimensional glowing rings filled with mist, hovering inches from the ground and perpendicular to it at the points you choose."]
    },
    { 
        index: "circle-of-death", name: "Circle of Death", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "The powder of a crushed black pearl worth at least 500 gp.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A sphere of negative energy ripples out in a 60-foot-radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "6": "8d6", "7": "10d6", "8": "12d6", "9": "14d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "conjure-fey", name: "Conjure Fey", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon a fey creature of challenge rating 6 or lower, or a fey spirit that takes the form of a beast of challenge rating 6 or lower. It appears in an unoccupied space that you can see within range. The fey creature disappears when it drops to 0 hit points or when the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the challenge rating increases by 1 for each slot level above 6th."]
    },
    { 
        index: "create-undead", name: "Create Undead", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "One clay pot filled with grave dirt, one clay pot filled with brackish water, and one 150 gp black onyx stone for each corpse.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a ghoul under your control. (The spell creates ghouls in this version, but higher level casting allows for ghasts, wights, or mummies)."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, you can animate or reassert control over four ghouls. When you use an 8th-level spell slot, you can create five ghouls or two ghasts or wights. When you use a 9th-level spell slot, you can create six ghouls, three ghasts or wights, or two mummies."]
    },
    { 
        index: "eyebite", name: "Eyebite", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects: Asleep, Panicked, or Sickened."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "flesh-to-stone", name: "Flesh to Stone", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "Lime, water, and earth.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to turn one creature that you can see within range into stone. If the target's body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn't affected. A creature restrained by this spell must make another Constitution saving throw at the end of each of its turns. If it successfully saves against this spell three times, the spell ends. If it fails its saves three times, it is turned to stone and subjected to the petrified condition for the duration."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "mass-suggestion", name: "Mass Suggestion", level: 6, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "M"], material: "A snake's tongue and either a bit of honeycomb or a drop of sweet oil.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You suggest a course of activity (limited to a sentence or two) and magically influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can't be charmed are immune to this effect."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, the duration is 10 days. When you use an 8th-level spell slot, the duration is 30 days. When you use a 9th-level spell slot, the duration is a year and a day."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "true-seeing", name: "True Seeing", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "An ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet."]
    },

    // Level 7
    { 
        index: "etherealness", name: "Etherealness", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell."],
        higher_level: ["When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including yourself) for each slot level above 7th. The creatures must be within 10 feet of you when you cast the spell."]
    },
    { 
        index: "finger-of-death", name: "Finger of Death", level: 7, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You send negative energy coursing through a creature that you can see within range, causing it searing pain. The target must make a Constitution saving throw. It takes 7d8 + 30 necrotic damage on a failed save, or half as much damage on a successful one. A humanoid killed by this spell rises at the start of your next turn as a zombie that is permanently under your command."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "7": "7d8+30" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "forcecage", name: "Forcecage", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], material: "Ruby dust worth 1,500 gp.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box."]
    },
    { 
        index: "plane-shift", name: "Plane Shift", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A forked, metal rod worth at least 250 gp, tailored to a specific plane of existence.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second layer of the Nine Hells, and you appear in or near that destination."]
    },

    // Level 8
    { 
        index: "demiplane", name: "Demiplane", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You create a shadowy door on a flat solid surface that you can see within range. The door is large enough to allow Medium creatures to pass through unhindered. When opened, the door leads to a demiplane that appears to be an empty room 30 feet in each dimension, made of wood or stone."]
    },
    { 
        index: "dominate-monster", name: "Dominate Monster", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw."],
        higher_level: ["When you cast this spell using a 9th-level spell slot, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "feeblemind", name: "Feeblemind", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A handful of clay, crystal, glass, or mineral spheres.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must make an Intelligence saving throw. On a failed save, the creature's Intelligence and Charisma scores become 1. The creature can't cast spells, activate magic items, understand language, or communicate in any intelligible way."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "8": "4d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    { 
        index: "glibness", name: "Glibness", level: 8, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful."]
    },
    { 
        index: "power-word-stun", name: "Power Word Stun", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You speak a word of power that can overwhelm the mind of one creature you can see within range. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect."]
    },

    // Level 9
    { 
        index: "astral-projection", name: "Astral Projection", level: 9, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "One jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100 gp per creature, all of which the spell consumes.", duration: "Special", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to eight willing creatures within range project your astral bodies into the Astral Plane (the spell fails and the casting is wasted if you are already on that plane). The material body you leave behind is unconscious and in a state of suspended animation; it doesn't need food or air and doesn't age."]
    },
    { 
        index: "foresight", name: "Foresight", level: 9, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A hummingbird feather.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration."]
    },
    { 
        index: "imprisonment", name: "Imprisonment", level: 9, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A vellum depiction or a carved statuette in the likeness of the target, and a special component that varies according to the version of the spell you choose, worth at least 500 gp per Hit Die of the target.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell; if it succeeds, it is immune to this spell if you cast it again. While affected by this spell, the creature doesn't need to breathe, eat, or drink, and it doesn't age. Divination spells can't locate or perceive the target. The conditions for ending the spell are determined when you cast it."]
    },
    { 
        index: "power-word-kill", name: "Power Word Kill", level: 9, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect."]
    },
    { 
        index: "true-polymorph", name: "True Polymorph", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A drop of mercury, a dollop of gum arabic, and a wisp of smoke.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into an object, or the object into a creature (the object must be neither worn nor carried by another creature). The transformation lasts for the duration, or until the target drops to 0 hit points or dies. If you concentrate on this spell for the full duration, the transformation becomes permanent."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    }
];
