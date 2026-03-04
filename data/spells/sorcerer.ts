
import { SpellDetail } from '../../types';

export const SORCERER_SPELLS: SpellDetail[] = [
    // Cantrips
    { 
        index: "acid-splash", name: "Acid Splash", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage."],
        damage: { damage_type: {name:"Acid", index:"acid"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} }, 
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" }
    },
    { index: "blade-ward", name: "Blade Ward", level: 0, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], desc: ["You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks."] },
    { 
        index: "chill-touch", name: "Chill Touch", level: 0, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target. If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn."],
        damage: { damage_type: {name:"Necrotic", index:"necrotic"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { index: "dancing-lights", name: "Dancing Lights", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A bit of phosphorus or wychwood, or a glowworm.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius."] },
    { 
        index: "fire-bolt", name: "Fire Bolt", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried."],
        damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_character_level: {"1":"1d10", "5":"2d10", "11":"3d10", "17":"4d10"} }
    },
    { index: "friends", name: "Friends", level: 0, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "Self", components: ["S", "M"], material: "A small amount of makeup applied to the face.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn't hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you."] },
    { index: "light", name: "Light", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A firefly or phosphorescent moss.", duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet."] },
    { index: "mage-hand", name: "Mage Hand", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand."] },
    { index: "mending", name: "Mending", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Two lodestones.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin."] },
    { index: "message", name: "Message", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A short piece of copper wire.", duration: "1 round", ritual: false, concentration: false, classes: [], desc: ["You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear."] },
    { index: "minor-illusion", name: "Minor Illusion", level: 0, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "30 feet", components: ["S", "M"], material: "A bit of fleece.", duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again."] },
    { 
        index: "poison-spray", name: "Poison Spray", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage."],
        damage: { damage_type: {name:"Poison", index:"poison"}, damage_at_character_level: {"1":"1d12", "5":"2d12", "11":"3d12", "17":"4d12"} },
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" }
    },
    { index: "prestidigitation", name: "Prestidigitation", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: sensory effect, light/snuff candle, clean/soil object, chill/warm/flavor material, color mark, create trinket."] },
    { 
        index: "ray-of-frost", name: "Ray of Frost", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn."],
        damage: { damage_type: {name:"Cold", index:"cold"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { 
        index: "shocking-grasp", name: "Shocking Grasp", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn."],
        damage: { damage_type: {name:"Lightning", index:"lightning"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { index: "true-strike", name: "True Strike", level: 0, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Concentration, up to 1 round", ritual: false, concentration: true, classes: [], desc: ["You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended."] },

    // Level 1
    { 
        index: "burning-hands", name: "Burning Hands", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (15-foot cone)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "1": "3d6", "2": "4d6", "3": "5d6", "4": "6d6", "5": "7d6", "6": "8d6", "7": "9d6", "8": "10d6", "9": "11d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "charm-person", name: "Charm Person", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "chromatic-orb", name: "Chromatic Orb", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A diamond worth at least 50 gp.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Variable", index: "variable" }, damage_at_slot_level: { "1": "3d8", "2": "4d8", "3": "5d8", "4": "6d8", "5": "7d8", "6": "8d8", "7": "9d8", "8": "10d8", "9": "11d8" } }
    },
    { 
        index: "color-spray", name: "Color Spray", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self (15-foot cone)", components: ["V", "S", "M"], material: "A pinch of powder or sand that is colored red, yellow, and blue.", duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can effect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can't see)."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st."],
        damage: { damage_type: { name: "None", index: "none" }, damage_at_slot_level: { "1": "6d10", "2": "8d10", "3": "10d10", "4": "12d10", "5": "14d10", "6": "16d10", "7": "18d10", "8": "20d10", "9": "22d10" } }
    },
    { 
        index: "comprehend-languages", name: "Comprehend Languages", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A pinch of soot and salt.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written."]
    },
    { 
        index: "detect-magic", name: "Detect Magic", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any."]
    },
    { 
        index: "disguise-self", name: "Disguise Self", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it."]
    },
    { 
        index: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action."]
    },
    { 
        index: "false-life", name: "False Life", level: 1, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A small amount of alcohol or distilled spirits.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st."]
    },
    { 
        index: "feather-fall", name: "Feather Fall", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 reaction", range: "60 feet", components: ["V", "M"], material: "A small feather or piece of down.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends."]
    },
    { 
        index: "fog-cloud", name: "Fog Cloud", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st."]
    },
    { 
        index: "jump", name: "Jump", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A grasshopper's hind leg.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The creature's jump distance is tripled until the spell ends."]
    },
    { 
        index: "mage-armor", name: "Mage Armor", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A piece of cured leather.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action."]
    },
    { 
        index: "magic-missile", name: "Magic Missile", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "1": "3d4+3" } } // Approximation for 3 missiles
    },
    { 
        index: "shield", name: "Shield", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "Self", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile."]
    },
    { 
        index: "silent-image", name: "Silent Image", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of fleece.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects."]
    },
    { 
        index: "sleep", name: "Sleep", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A pinch of fine sand, rose petals, or a cricket.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures)."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st."],
        damage: { damage_type: { name: "None", index: "none" }, damage_at_slot_level: { "1": "5d8", "2": "7d8", "3": "9d8", "4": "11d8", "5": "13d8", "6": "15d8", "7": "17d8", "8": "19d8", "9": "21d8" } }
    },
    { 
        index: "thunderwave", name: "Thunderwave", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (15-foot cube)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "1": "2d8", "2": "3d8", "3": "4d8", "4": "5d8", "5": "6d8", "6": "7d8", "7": "8d8", "8": "9d8", "9": "10d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "witch-bolt", name: "Witch Bolt", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A twig from a tree that has been struck by lightning.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "1": "1d12", "2": "2d12", "3": "3d12", "4": "4d12", "5": "5d12", "6": "6d12", "7": "7d12", "8": "8d12", "9": "9d12" } }
    },

    // Level 2
    { 
        index: "alter-self", name: "Alter Self", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell: Aquatic Adaptation, Change Appearance, Natural Weapons."]
    },
    { 
        index: "blindness-deafness", name: "Blindness/Deafness", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You can blind or deafen a foe. Choose one creature that you can see within range to make a Constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "blur", name: "Blur", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight."]
    },
    { 
        index: "cloud-of-daggers", name: "Cloud of Daggers", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A sliver of glass.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell's area for the first time on a turn or starts its turn there."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd."],
        damage: { damage_type: { name: "Slashing", index: "slashing" }, damage_at_slot_level: { "2": "4d4", "3": "6d4", "4": "8d4", "5": "10d4" } }
    },
    { 
        index: "darkness", name: "Darkness", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "M"], material: "Bat fur and a drop of pitch or piece of coal.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it."]
    },
    { 
        index: "darkvision", name: "Darkvision", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Either a pinch of dried carrot or an agate.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet."]
    },
    { 
        index: "detect-thoughts", name: "Detect Thoughts", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A copper piece.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn't speak any language, the creature is unaffected."]
    },
    { 
        index: "enhance-ability", name: "Enhance Ability", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Fur or a feather from a beast.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends. Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, or Owl's Wisdom."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."]
    },
    { 
        index: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A pinch of powdered iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "gust-of-wind", name: "Gust of Wind", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot line)", components: ["V", "S", "M"], material: "A legume seed.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
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
        index: "knock", name: "Knock", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred."]
    },
    { 
        index: "levitate", name: "Levitate", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "Either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["One creature or object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
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
        index: "scorching-ray", name: "Scorching Ray", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d6" } } // Per ray
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
    { 
        index: "web", name: "Web", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of spiderweb.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },

    // Level 3
    { 
        index: "blink", name: "Blink", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["Roll a d20 at the end of each of your turns for the duration of the spell. On a roll of 11 or higher, you vanish from your current plane of existence and appear in the Ethereal Plane (the spell fails and the casting is wasted if you were already on that plane). At the start of your next turn, and when the spell ends if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 10 feet of the space you vanished from."]
    },
    { 
        index: "clairvoyance", name: "Clairvoyance", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "1 mile", components: ["V", "S", "M"], material: "A focus worth at least 100 gp, either a jeweled horn for hearing or a glass eye for seeing.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with."]
    },
    { 
        index: "counterspell", name: "Counterspell", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "60 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used."]
    },
    { 
        index: "daylight", name: "Daylight", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet. If any of this spell's area overlaps with an area of darkness created by a spell of 3rd level or lower, the spell that created the darkness is dispelled."]
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
        index: "fireball", name: "Fireball", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A tiny ball of bat guano and sulfur.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "3": "8d6", "4": "9d6", "5": "10d6", "6": "11d6", "7": "12d6", "8": "13d6", "9": "14d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
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
        index: "haste", name: "Haste", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A shaving of licorice root.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a willing creature that you can see within range. Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action. When the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it."]
    },
    { 
        index: "hypnotic-pattern", name: "Hypnotic Pattern", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["S", "M"], material: "A glowing stick of incense or a crystal vial filled with phosphorescent material.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. The pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "lightning-bolt", name: "Lightning Bolt", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (100-foot line)", components: ["V", "S", "M"], material: "A bit of fur and a rod of amber, crystal, or glass.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "3": "8d6", "4": "9d6", "5": "10d6", "6": "11d6", "7": "12d6", "8": "13d6", "9": "14d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "major-image", name: "Major Image", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A bit of fleece.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image seems completely real, including sounds, smells, and temperature appropriate to the thing depicted."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration."]
    },
    { 
        index: "protection-from-energy", name: "Protection from Energy", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder."]
    },
    { 
        index: "sleet-storm", name: "Sleet Storm", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A pinch of dust and a few drops of water.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "slow", name: "Slow", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A drop of molasses.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration. An affected target's speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can't use reactions."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "stinking-cloud", name: "Stinking Cloud", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A rotten egg or several skunk cabbage leaves.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. Each creature that starts its turn in the cloud must succeed on a Constitution saving throw or spend its action that turn retching and reeling."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "tongues", name: "Tongues", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A small clay model of a ziggurat.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says."]
    },
    { 
        index: "water-breathing", name: "Water Breathing", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A short reed or piece of straw.", duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration."]
    },
    { 
        index: "water-walk", name: "Water Walk", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A piece of cork.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration."]
    },

    // Level 4
    { 
        index: "banishment", name: "Banishment", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "An item distasteful to the target.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished."],
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
        index: "confusion", name: "Confusion", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "Three nut shells.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell assaults and twists creatures' minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or be affected by it."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the radius of the sphere increases by 5 feet for each slot level above 4th."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "dimension-door", name: "Dimension Door", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction."]
    },
    { 
        index: "dominate-beast", name: "Dominate Beast", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence."],
        higher_level: ["When you cast this spell using a spell slot of 5th level, the duration is concentration, up to 10 minutes. When you use a spell slot of 6th level, the duration is concentration, up to 1 hour. When you use a spell slot of 7th level or higher, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "greater-invisibility", name: "Greater Invisibility", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person."]
    },
    { 
        index: "ice-storm", name: "Ice Storm", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A pinch of dust and a few drops of water.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th."],
        damage: { damage_type: { name: "Cold/Bludgeoning", index: "cold" }, damage_at_slot_level: { "4": "2d8+4d6", "5": "3d8+4d6", "6": "4d8+4d6", "7": "5d8+4d6", "8": "6d8+4d6", "9": "7d8+4d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "polymorph", name: "Polymorph", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A caterpillar cocoon.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "stoneskin", name: "Stoneskin", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust worth 100 gp, which the spell consumes.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage."]
    },
    { 
        index: "wall-of-fire", name: "Wall of Fire", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A small piece of phosphorus.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "4": "5d8", "5": "6d8", "6": "7d8", "7": "8d8", "8": "9d8", "9": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },

    // Level 5
    { 
        index: "animate-objects", name: "Animate Objects", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Objects come to life at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. Medium targets count as two objects, Large targets count as four objects, Huge targets count as eight objects. You can command them to attack."],
        higher_level: ["If you cast this spell using a spell slot of 6th level or higher, you can animate two additional objects for each slot level above 5th."]
    },
    { 
        index: "cloudkill", name: "Cloudkill", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of poisonous, yellow-green fog centered on a point you choose within range. The fog spreads around corners. It lasts for the duration or until strong wind disperses the fog, ending the spell. Its area is heavily obscured. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 5d8 poison damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th."],
        damage: { damage_type: { name: "Poison", index: "poison" }, damage_at_slot_level: { "5": "5d8", "6": "6d8", "7": "7d8", "8": "8d8", "9": "9d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "cone-of-cold", name: "Cone of Cold", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot cone)", components: ["V", "S", "M"], material: "A small crystal or glass cone.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "5": "8d8", "6": "9d8", "7": "10d8", "8": "11d8", "9": "12d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "creation", name: "Creation", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A tiny piece of matter of the same type of the item you plan to create.", duration: "Special", ritual: false, concentration: false, classes: [], 
        desc: ["You pull wisps of shadow material from the Shadowfell to create a nonliving object of vegetable matter within range: soft goods, rope, wood, or something similar. You can also use this spell to create mineral objects such as stone, crystal, or metal. The object created must be no larger than a 5-foot cube, and the object must be of a form and material that you have seen before."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the cube increases by 5 feet for each slot level above 5th."]
    },
    { 
        index: "dominate-person", name: "Dominate Person", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the target is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence."],
        higher_level: ["When you cast this spell using a spell slot of 6th level, the duration is concentration, up to 10 minutes. When you use a spell slot of 7th level, the duration is concentration, up to 1 hour. When you use a spell slot of 8th level or higher, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "hold-monster", name: "Hold Monster", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "insect-plague", name: "Insect Plague", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A few grains of sugar, some kernels of grain, and a smear of fat.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "5": "4d10", "6": "5d10", "7": "6d10", "8": "7d10", "9": "8d10" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "seeming", name: "Seeming", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target you choose a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected by this spell."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "telekinesis", name: "Telekinesis", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell, and as your action each round for the duration, you can exert your will on one creature or object that you can see within range, causing the appropriate effect below."]
    },
    { 
        index: "teleportation-circle", name: "Teleportation Circle", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "10 feet", components: ["V", "M"], material: "Rare chalks and inks infused with precious gems worth 50 gp, which the spell consumes.", duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you."]
    },
    { 
        index: "wall-of-stone", name: "Wall of Stone", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A small block of granite.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick."]
    },

    // Level 6
    { 
        index: "chain-lightning", name: "Chain Lightning", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A bit of fur; a piece of amber, glass, or a crystal rod; and three silver pins.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts. A target must make a Dexterity saving throw. The target takes 10d8 lightning damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, one additional bolt leaps from the first target to another target for each slot level above 6th."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "6": "10d8", "7": "10d8", "8": "10d8", "9": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "circle-of-death", name: "Circle of Death", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "The powder of a crushed black pearl worth at least 500 gp.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A sphere of negative energy ripples out in a 60-foot-radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "6": "8d6", "7": "10d6", "8": "12d6", "9": "14d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "disintegrate", name: "Disintegrate", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A lodestone and a pinch of dust.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force, such as the wall created by wall of force. A creature targeted by this spell must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. The target is disintegrated if this damage leaves it with 0 hit points."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "6": "10d6+40", "7": "13d6+40", "8": "16d6+40", "9": "19d6+40" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "eyebite", name: "Eyebite", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects: Asleep, Panicked, or Sickened."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "globe-of-invulnerability", name: "Globe of Invulnerability", level: 6, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S", "M"], material: "A glass or crystal bead that shatters when the spell ends.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration. Any spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the barrier blocks spells of one level higher for each slot level above 6th."]
    },
    { 
        index: "mass-suggestion", name: "Mass Suggestion", level: 6, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "M"], material: "A snake's tongue and either a bit of honeycomb or a drop of sweet oil.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You suggest a course of activity (limited to a sentence or two) and magically influence up to twelve creatures of your choice that you can see within range and that can hear and understand you. Creatures that can't be charmed are immune to this effect."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, the duration is 10 days. When you use an 8th-level spell slot, the duration is 30 days. When you use a 9th-level spell slot, the duration is a year and a day."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "move-earth", name: "Move Earth", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "An iron blade and a small bag containing a mixture of soils.", duration: "Concentration, up to 2 hours", ritual: false, concentration: false, classes: [], 
        desc: ["Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration. You can raise or lower the area's elevation, create or fill in a trench, erect or flatten a wall, or form a pillar."]
    },
    { 
        index: "sunbeam", name: "Sunbeam", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot line)", components: ["V", "S", "M"], material: "A magnifying glass.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "6": "6d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "true-seeing", name: "True Seeing", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "An ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet."]
    },

    // Level 7
    { 
        index: "delayed-blast-fireball", name: "Delayed Blast Fireball", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A tiny ball of bat guano and sulfur.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A beam of yellow light flashes from your pointing finger, then condenses to linger at a chosen point within range as a glowing bead for the duration. When the spell ends, either because your concentration is broken or because you decide to end it, the bead blossoms with a low roar into an explosion of flame that spreads around corners. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A creature takes fire damage equal to the total accumulated damage on a failed save, or half as much damage on a successful one. The spell's base damage is 12d6. If at the end of your turn the bead has not yet detonated, the damage increases by 1d6."],
        higher_level: ["When you cast this spell using a spell slot of 8th level or higher, the base damage increases by 1d6 for each slot level above 7th."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "7": "12d6", "8": "13d6", "9": "14d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
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
        index: "fire-storm", name: "Fire Storm", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot cubes, which you can arrange as you wish. Each cube must have at least one face adjacent to the face of another cube. Each creature in the area must make a Dexterity saving throw. It takes 7d10 fire damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "7": "7d10" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "plane-shift", name: "Plane Shift", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A forked, metal rod worth at least 250 gp, tailored to a specific plane of existence.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second layer of the Nine Hells, and you appear in or near that destination."]
    },
    { 
        index: "prismatic-spray", name: "Prismatic Spray", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot cone)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot cone must make a Dexterity saving throw. For each target, roll a d8 to determine which color ray affects it."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "reverse-gravity", name: "Reverse Gravity", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], material: "A lodestone and iron filings.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell reverses gravity in a 50-foot-radius, 100-foot-high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "teleport", name: "Teleport", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can't be held or carried by an unwilling creature."]
    },

    // Level 8
    { 
        index: "dominate-monster", name: "Dominate Monster", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw."],
        higher_level: ["When you cast this spell using a 9th-level spell slot, the duration is concentration, up to 8 hours."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "earthquake", name: "Earthquake", level: 8, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "500 feet", components: ["V", "S", "M"], material: "A pinch of dirt, a piece of rock, and a lump of clay.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area."]
    },
    { 
        index: "incendiary-cloud", name: "Incendiary Cloud", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. Each creature that enters the area or starts its turn there must make a Dexterity saving throw. The creature takes 10d8 fire damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "8": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "power-word-stun", name: "Power Word Stun", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You speak a word of power that can overwhelm the mind of one creature you can see within range. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect."]
    },
    { 
        index: "sunburst", name: "Sunburst", level: 8, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "Fire and a piece of sunstone.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "8": "12d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },

    // Level 9
    { 
        index: "gate", name: "Gate", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A diamond worth at least 5,000 gp.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose. The portal lasts for the duration."]
    },
    { 
        index: "meteor-swarm", name: "Meteor Swarm", level: 9, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "1 mile", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Fire/Bludgeoning", index: "fire" }, damage_at_slot_level: { "9": "40d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "power-word-kill", name: "Power Word Kill", level: 9, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 hit points or fewer, it dies. Otherwise, the spell has no effect."]
    },
    { 
        index: "time-stop", name: "Time Stop", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal."]
    },
    { 
        index: "wish", name: "Wish", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires."]
    }
];
