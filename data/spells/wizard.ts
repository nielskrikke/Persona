
import { SpellDetail } from '../../types';

export const WIZARD_SPELLS: SpellDetail[] = [
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
        index: "alarm", name: "Alarm", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A tiny bell and a piece of fine silver wire.", duration: "8 hours", ritual: true, concentration: false, classes: [], 
        desc: ["You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible."]
    },
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
        index: "find-familiar", name: "Find Familiar", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 hour", range: "10 feet", components: ["V", "S", "M"], material: "10 gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast."]
    },
    { 
        index: "fog-cloud", name: "Fog Cloud", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st."]
    },
    { 
        index: "grease", name: "Grease", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of pork rind or butter.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "identify", name: "Identify", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A pearl worth at least 100 gp and an owl feather.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any."]
    },
    { 
        index: "illusory-script", name: "Illusory Script", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "Touch", components: ["S", "M"], material: "A lead-based ink worth at least 10 gp, which the spell consumes.", duration: "10 days", ritual: true, concentration: false, classes: [], 
        desc: ["You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration."]
    },
    { 
        index: "jump", name: "Jump", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A grasshopper's hind leg.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The creature's jump distance is tripled until the spell ends."]
    },
    { 
        index: "longstrider", name: "Longstrider", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A pinch of dirt.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The target's speed increases by 10 feet until the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
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
        index: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them."]
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
        index: "tashas-hideous-laughter", name: "Tasha's Hideous Laughter", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Tiny tarts and a feather that is waved in the air.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "tensers-floating-disk", name: "Tenser's Floating Disk", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 ritual", range: "30 feet", components: ["V", "S", "M"], material: "A drop of mercury.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration, and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground."]
    },
    { 
        index: "thunderwave", name: "Thunderwave", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (15-foot cube)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "1": "2d8", "2": "3d8", "3": "4d8", "4": "5d8", "5": "6d8", "6": "7d8", "7": "8d8", "8": "9d8", "9": "10d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "unseen-servant", name: "Unseen Servant", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 ritual", range: "60 feet", components: ["V", "S", "M"], material: "A piece of string and a bit of wood.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends."]
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
        index: "arcane-lock", name: "Arcane Lock", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Gold dust worth at least 25 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute."]
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
        index: "continual-flame", name: "Continual Flame", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Ruby dust worth 50 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched."]
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
        index: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A pinch of powdered iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "flaming-sphere", name: "Flaming Sphere", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of tallow, a pinch of brimstone, and a dusting of powdered iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6" } }
    },
    { 
        index: "gentle-repose", name: "Gentle Repose", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration.", duration: "10 days", ritual: true, concentration: false, classes: [], 
        desc: ["You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead."]
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
        index: "locate-object", name: "Locate Object", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A forked twig.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement."]
    },
    { 
        index: "magic-mouth", name: "Magic Mouth", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes.", duration: "Until dispelled", ritual: true, concentration: false, classes: [], 
        desc: ["You implant a message within an object in range, a message that is uttered when a trigger condition is met. You choose an object that you can see and that isn't being worn or carried by another creature. Then you speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes."]
    },
    { 
        index: "magic-weapon", name: "Magic Weapon", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3."]
    },
    { 
        index: "melfs-acid-arrow", name: "Melf's Acid Arrow", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "Powdered rhubarb leaf and an adder's stomach.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd."],
        damage: { damage_type: { name: "Acid", index: "acid" }, damage_at_slot_level: { "2": "4d4+2d4", "3": "5d4+3d4", "4": "6d4+4d4", "5": "7d4+5d4" } }
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
        index: "nystuls-magic-aura", name: "Nystul's Magic Aura", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A small square of silk.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You place an illusion on a creature or an object you touch so that divination spells reveal false information about it. The target can be a willing creature or an object that isn't being carried or worn by another creature."]
    },
    { 
        index: "phantasmal-force", name: "Phantasmal Force", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of fleece.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. The phantasm includes sound, temperature, and other stimuli, also evident only to the creature."],
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    { 
        index: "ray-of-enfeeblement", name: "Ray of Enfeeblement", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A black beam of enervating energy springs from your finger toward a creature within range. Make a ranged spell attack against the target. On a hit, the target deals only half damage with weapon attacks that use Strength until the spell ends. At the end of each of the target's turns, it can make a Constitution saving throw against the spell. On a success, the spell ends."]
    },
    { 
        index: "rope-trick", name: "Rope Trick", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Powdered corn extract and a twisted loop of parchment.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends."]
    },
    { 
        index: "scorching-ray", name: "Scorching Ray", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you create one additional ray for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d6" } } // Per ray
    },
    { 
        index: "see-invisibility", name: "See Invisibility", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A pinch of talc and a small sprinkling of powdered silver.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["For the duration, you see invisible creatures and objects as if they were visible, and you can see into the Ethereal Plane. Ethereal creatures and objects appear ghostly and translucent."]
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
        index: "animate-dead", name: "Animate Dead", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "A drop of blood, a piece of flesh, and a pinch of bone dust.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell creates an undead servant. Choose a pile of bones or a corpse of a medium or small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature (Skeleton or Zombie)."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you animate or reassert control over two additional undead creatures for each slot level above 3rd."]
    },
    { 
        index: "bestow-curse", name: "Bestow Curse", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: Disadvantage on checks/saves; Disadvantage on attacks vs you; Wisdom save to act; or Extra 1d8 necrotic damage from your attacks."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
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
        index: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "Incense and powdered diamond worth at least 200 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["When you cast this spell, you inscribe a glyph that later unleashes a magical effect. You can choose from Explosive Runes (5d8 damage) or Spell Glyph (stores a spell)."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd."],
        damage: { damage_type: { name: "Varies", index: "varies" }, damage_at_slot_level: { "3": "5d8", "4": "6d8", "5": "7d8", "6": "8d8", "7": "9d8" } }
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
        index: "nondetection", name: "Nondetection", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust worth 25 gp sprinkled over the target.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can't be targeted by any divination magic or perceived through magical scrying sensors."]
    },
    { 
        index: "phantom-steed", name: "Phantom Steed", level: 3, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["A Large quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range. You decide the creature's appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed."]
    },
    { 
        index: "protection-from-energy", name: "Protection from Energy", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder."]
    },
    { 
        index: "remove-curse", name: "Remove Curse", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded."]
    },
    { 
        index: "sending", name: "Sending", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Unlimited", components: ["V", "S", "M"], material: "A short piece of copper wire.", duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately."]
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
        index: "tiny-hut", name: "Tiny Hut", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 minute", range: "Self (10-foot radius)", components: ["V", "S", "M"], material: "A small crystal bead.", duration: "8 hours", ritual: true, concentration: false, classes: [], 
        desc: ["A 10-foot-radius immobile dome of force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area. Nine creatures of Medium size or smaller can fit inside the dome with you. The spell fails if its area includes a larger creature or more than nine creatures. Creatures and objects within the dome when you cast this spell can move through it freely. All other creatures and objects are barred from passing through it. Spells and other magical effects can't extend through the dome or be cast through it. The atmosphere inside the space is comfortable and dry, regardless of the weather outside."]
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
        index: "arcane-eye", name: "Arcane Eye", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A bit of bat fur.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction."]
    },
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
        index: "conjure-minor-elementals", name: "Conjure Minor Elementals", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon elementals that appear in unoccupied spaces that you can see within range. You choose one of the following options for what appears: One elemental of challenge rating 2 or lower; Two elementals of challenge rating 1 or lower; Four elementals of challenge rating 1/2 or lower; or Eight elementals of challenge rating 1/4 or lower."],
        higher_level: ["When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 6th-level slot and three times as many with an 8th-level slot."]
    },
    { 
        index: "control-water", name: "Control Water", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A drop of water and a pinch of dust.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects: Flood, Part Water, Redirect Flow, or Whirlpool."]
    },
    { 
        index: "dimension-door", name: "Dimension Door", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction."]
    },
    { 
        index: "fabricate", name: "Fabricate", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "10 minutes", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You convert raw materials into products of the same material. For example, you can fabricate a wooden bridge from a clump of trees, a rope from a patch of hemp, and clothes from flax or wool. Choose raw materials that you can see within range. You can fabricate a Large or smaller object (contained within a 10-foot cube), or eight connected Medium objects (within a 10-foot cube), from raw materials that you can see within range that are of the same material."]
    },
    { 
        index: "faithful-hound", name: "Faithful Hound", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A tiny silver whistle, a piece of bone, and a thread.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You conjure a phantom watchdog in an unoccupied space that you can see within range, where it remains for the duration, until you dismiss it as an action, or until you move more than 100 feet away from it. The hound is invisible to all creatures except you and can't be harmed. When a Small or larger creature comes within 30 feet of it without first speaking the password that you specify when you cast this spell, the hound starts barking loudly. The hound sees invisible creatures and can see into the Ethereal Plane. It ignores illusions. At the start of each of your turns, the hound attempts to bite one creature within 5 feet of it that is hostile to you. The hound's attack bonus is equal to your spellcasting ability modifier + your proficiency bonus. On a hit, it deals 4d8 piercing damage."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "4": "4d8" } }
    },
    { 
        index: "fire-shield", name: "Fire Shield", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A bit of phosphorus or a firefly.", duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it. The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage. In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a chill shield."],
        damage: { damage_type: { name: "Fire/Cold", index: "fire" }, damage_at_slot_level: { "4": "2d8" } }
    },
    { 
        index: "greater-invisibility", name: "Greater Invisibility", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person."]
    },
    { 
        index: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "300 feet", components: ["V", "S", "M"], material: "A stone, a twig, and a bit of green plant.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain."]
    },
    { 
        index: "ice-storm", name: "Ice Storm", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A pinch of dust and a few drops of water.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th."],
        damage: { damage_type: { name: "Cold/Bludgeoning", index: "cold" }, damage_at_slot_level: { "4": "2d8+4d6", "5": "3d8+4d6", "6": "4d8+4d6", "7": "5d8+4d6", "8": "6d8+4d6", "9": "7d8+4d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Fur from a bloodhound.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."]
    },
    { 
        index: "phantasmal-killer", name: "Phantasmal Killer", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target becomes frightened for the duration. At the end of each of the target's turns before the spell ends, the target must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "4": "4d10", "5": "5d10", "6": "6d10", "7": "7d10", "8": "8d10", "9": "9d10" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "polymorph", name: "Polymorph", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A caterpillar cocoon.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "private-sanctum", name: "Private Sanctum", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "10 minutes", range: "120 feet", components: ["V", "S", "M"], material: "A thin sheet of lead, a piece of opaque glass, a wad of cotton or cloth, and powdered chrysolite.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You make an area within range magically secure. The area is a cube that can be as small as 5 feet to as large as 100 feet on each side. The spell lasts for the duration or until you use an action to dismiss it. When you cast the spell, you decide what sort of security the spell provides, choosing any or all of the following properties: Sound can't pass through the barrier; The barrier appears dark and foggy, preventing vision; Sensors created by divination spells can't appear inside the protected area or pass through the barrier; Creatures in the area can't be targeted by divination spells; Nothing can teleport into or out of the warded area; Planar travel is blocked within the warded area."]
    },
    { 
        index: "resilient-sphere", name: "Resilient Sphere", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A hemispherical piece of clear crystal and a matching hemispherical piece of gum arabic.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A sphere of shimmering force encloses a creature or object of Large size or smaller within range. An unwilling creature must make a Dexterity saving throw. On a failed save, the creature is enclosed for the duration. Nothing—not physical objects, energy, or other spell effects—can pass through the barrier, in or out, though a creature in the sphere can breathe there. The sphere is immune to all damage, and a creature or object inside can't be damaged by attacks or effects originating from outside, nor can a creature inside the sphere damage anything outside it."]
    },
    { 
        index: "secret-chest", name: "Secret Chest", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "An exquisite chest, 3 feet by 2 feet by 2 feet, constructed from rare materials worth at least 5,000 gp, and a tiny replica made from the same materials worth at least 50 gp.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You hide a chest, and all its contents, on the Ethereal Plane. You must touch the chest and the miniature replica that serves as a material component for the spell. The chest can contain up to 12 cubic feet of nonliving material (3 feet by 2 feet by 2 feet). While the chest remains on the Ethereal Plane, you can use an action and touch the replica to recall the chest. It appears in an unoccupied space on the ground within 5 feet of you. You can send the chest back to the Ethereal Plane by using an action and touching both the chest and the replica."]
    },
    { 
        index: "stone-shape", name: "Stone Shape", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Soft clay to be worked into roughly the desired shape of the stone object.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose."]
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
        index: "bigbys-hand", name: "Bigby's Hand", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "An eggshell and a snakeskin glove.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the duration, and it moves at your command, mimicking the movements of your own hand. The hand is an object that has AC 20 and hit points equal to your hit point maximum. The hand doesn't fill its space. When you cast the spell and as a bonus action on your subsequent turns, you can move the hand up to 60 feet and then cause one of the following effects with it: Clenched Fist (4d8 force), Forceful Hand (push), Grasping Hand (grapple), or Interposing Hand (cover)."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage from the clenched fist option increases by 2d8 and the damage from the grasping hand increases by 2d6 for each slot level above 5th."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "5": "4d8", "6": "6d8", "7": "8d8", "8": "10d8", "9": "12d8" } }
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
        index: "conjure-elemental", name: "Conjure Elemental", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S", "M"], material: "Burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it. For example, a fire elemental emerges from a bonfire, and an earth elemental rises up from the ground. The elemental disappears when it drops to 0 hit points or when the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the challenge rating increases by 1 for each slot level above 5th."]
    },
    { 
        index: "contact-other-plane", name: "Contact Other Plane", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V"], duration: "1 minute", ritual: true, concentration: false, classes: [], 
        desc: ["You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. Contacting this extraplanar intelligence can strain or even break your mind. When you cast this spell, make a DC 15 Intelligence saving throw. On a failure, you take 6d6 psychic damage and are insane until you finish a long rest. On a success, you can ask the entity up to five questions."]
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
        index: "dream", name: "Dream", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "Unlimited", components: ["V", "S", "M"], material: "A handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
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
        index: "hold-monster", name: "Hold Monster", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. This spell has no effect on undead. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, you can target one additional creature for each slot level above 5th. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "legend-lore", name: "Legend Lore", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "Incense worth at least 250 gp, which the spell consumes, and four ivory strips worth at least 50 gp each.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named."]
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
        index: "passwall", name: "Passwall", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A pinch of sesame seeds.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface (such as a wall, a ceiling, or a floor) within range, and lasts for the duration. You choose the opening's dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep. The passage creates no instability in a structure surrounding it."]
    },
    { 
        index: "planar-binding", name: "Planar Binding", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "A jewel worth at least 1,000 gp, which the spell consumes.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of a higher level, the duration increases to 10 days (6th level), 30 days (7th level), 180 days (8th level), and a year and a day (9th level)."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "rarys-telepathic-bond", name: "Rary's Telepathic Bond", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Pieces of eggshell from two different kinds of creatures.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can't extend to other planes of existence."]
    },
    { 
        index: "scrying", name: "Scrying", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "A focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
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
        index: "wall-of-force", name: "Wall of Force", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S, M"], material: "A pinch of powder made by crushing a clear gemstone.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["An invisible wall of force springs into existence at a point you choose within range. The wall appears in any orientation you choose, as a horizontal or vertical barrier or at an angle. It can be free floating or resting on a solid surface. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. In any form, the wall is 1/4 inch thick. It lasts for the duration. If the wall cuts through a creature's space when it appears, the creature is pushed to one side of the wall (your choice which side). Nothing can physically pass through the wall. It is immune to all damage and can't be dispelled by dispel magic. A disintegrate spell destroys the wall instantly, however. The wall also extends into the Ethereal Plane, blocking ethereal travel through the wall."]
    },
    { 
        index: "wall-of-stone", name: "Wall of Stone", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A small block of granite.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick."]
    },

    // Level 6
    { 
        index: "arcane-gate", name: "Arcane Gate", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create linked teleportation portals that remain open for the duration. Choose two points on the ground that you can see, one point within 10 feet of you and one point within 500 feet of you. A circular portal, 10 feet in diameter, opens over each point. If the portal would open in the space occupied by a creature, the spell fails, and the casting is lost. The portals are two-dimensional glowing rings filled with mist, hovering inches from the ground and perpendicular to it at the points you choose."]
    },
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
        index: "contingency", name: "Contingency", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "A statuette of yourself carved from ivory and decorated with gems worth at least 1,500 gp.", duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["Choose a spell of 5th level or lower that you can cast, that has a casting time of 1 action, and that can target you. You cast that spell—called the contingent spell—as part of casting contingency, expending spell slots for both, but the contingent spell doesn't come into effect. Instead, it takes effect when a certain circumstance occurs. You describe that circumstance when you cast the two spells. For example, a contingency cast with water breathing might stipulate that water breathing comes into effect when you are engulfed in water or a similar liquid."]
    },
    { 
        index: "create-undead", name: "Create Undead", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "One clay pot filled with grave dirt, one clay pot filled with brackish water, and one 150 gp black onyx stone for each corpse.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a ghoul under your control. (The spell creates ghouls in this version, but higher level casting allows for ghasts, wights, or mummies)."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, you can animate or reassert control over four ghouls. When you use an 8th-level spell slot, you can create five ghouls or two ghasts or wights. When you use a 9th-level spell slot, you can create six ghouls, three ghasts or wights, or two mummies."]
    },
    { 
        index: "disintegrate", name: "Disintegrate", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A lodestone and a pinch of dust.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A thin green ray springs from your pointing finger to a target that you can see within range. The target can be a creature, an object, or a creation of magical force, such as the wall created by wall of force. A creature targeted by this spell must make a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 force damage. The target is disintegrated if this damage leaves it with 0 hit points."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 3d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "6": "10d6+40", "7": "13d6+40", "8": "16d6+40", "9": "19d6+40" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "drawmijs-instant-summons", name: "Drawmij's Instant Summons", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A sapphire worth 1,000 gp.", duration: "Until dispelled", ritual: true, concentration: false, classes: [], 
        desc: ["You touch an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an invisible mark on its surface and invisibly inscribes the name of the item on the sapphire you use as a material component. Each time you cast this spell, you must use a different sapphire. At any time thereafter, you can use your action to speak the item's name and crush the sapphire. The item instantly appears in your hand regardless of physical or planar distances, and the spell ends."]
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
        index: "globe-of-invulnerability", name: "Globe of Invulnerability", level: 6, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S", "M"], material: "A glass or crystal bead that shatters when the spell ends.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration. Any spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the barrier blocks spells of one level higher for each slot level above 6th."]
    },
    { 
        index: "guards-and-wards", name: "Guards and Wards", level: 6, school: { name: "Abjuration", index: "abjuration" }, casting_time: "10 minutes", range: "Touch", components: ["V", "S", "M"], material: "Burning incense, a small amount of brimstone and oil, a knotted string, a small amount of umber hulk blood, and a small silver rod worth at least 10 gp.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You create a ward that protects up to 2,500 square feet of floor space (an area 50 feet square, or one hundred 5-foot squares or twenty-five 10-foot squares). The warded area can be up to 20 feet tall, and shaped as you desire. You can cast Corridors, Doors, Stairs effects within."]
    },
    { 
        index: "magic-jar", name: "Magic Jar", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "A gem, crystal, reliquary, or some other ornamental container worth at least 500 gp.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["Your body falls into a catatonic state as your soul leaves it and enters the container you used for the spell's material component. While your soul inhabits the container, you are aware of your surroundings as if you were in the container's space. You can't move or use reactions. The only action you can take is to project your soul up to 100 feet out of the container, either returning to your living body (and ending the spell) or attempting to possess a humanoid's body."]
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
        index: "otilukes-freezing-sphere", name: "Otiluke's Freezing Sphere", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A small crystal sphere.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A frigid globe of cold energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a Constitution saving throw. On a failed save, a creature takes 10d6 cold damage. On a successful save, it takes half as much damage."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "6": "10d6", "7": "11d6", "8": "12d6", "9": "13d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "ottos-irresistible-dance", name: "Otto's Irresistible Dance", level: 6, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can't be charmed are immune to this spell. A dancing creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls. As an action, a dancing creature makes a Wisdom saving throw to regain control of itself."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "programmed-illusion", name: "Programmed Illusion", level: 6, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A bit of fleece and jade dust worth at least 25 gp.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You create an illusion of an object, a creature, or some other visible phenomenon within range that activates when a specific condition occurs. The illusion is imperceptible until then. It must be no larger than a 30-foot cube."]
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
    { 
        index: "wall-of-ice", name: "Wall of Ice", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A small piece of quartz.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create a wall of ice on a solid surface within range. You can form it into a hemispherical dome or a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. In any form, the wall is 1 foot thick and lasts for the duration. If the wall cuts through a creature's space when it appears, the creature within its area is pushed to one side of the wall and must make a Dexterity saving throw. On a failed save, the creature takes 10d6 cold damage, or half as much damage on a successful save."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "6": "10d6", "7": "12d6", "8": "14d6", "9": "16d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
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
        index: "forcecage", name: "Forcecage", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], material: "Ruby dust worth 1,500 gp.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box."]
    },
    { 
        index: "mirage-arcane", name: "Mirage Arcane", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "Sight", components: ["V", "S"], duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same, however."]
    },
    { 
        index: "mordenkainens-magnificent-mansion", name: "Mordenkainen's Magnificent Mansion", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "300 feet", components: ["V", "S", "M"], material: "A miniature portal carved from ivory, a small piece of polished marble, and a tiny silver spoon, each item worth at least 5 gp.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You conjure an extradimensional dwelling in range that lasts for the duration. You choose where its one entrance is located. The entrance shimmers faintly and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the portal remains open."]
    },
    { 
        index: "mordenkainens-sword", name: "Mordenkainen's Sword", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A miniature platinum sword with a grip and pommel of copper and zinc, worth 250 gp.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a shimmering, sword-shaped plane of force that hovers within range. It lasts for the duration. When the sword appears, you make a melee spell attack against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "7": "3d10" } }
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
        index: "project-image", name: "Project Image", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "500 miles", components: ["V", "S", "M"], material: "A small replica of you made from materials worth at least 5 gp.", duration: "Concentration, up to 1 day", ritual: false, concentration: true, classes: [], 
        desc: ["You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before, regardless of intervening obstacles. The illusion looks and sounds like you but is intangible."]
    },
    { 
        index: "reverse-gravity", name: "Reverse Gravity", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], material: "A lodestone and iron filings.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell reverses gravity in a 50-foot-radius, 100-foot-high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "sequester", name: "Sequester", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A powder composed of diamond, emerald, ruby, and sapphire dust worth at least 5,000 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["By means of this spell, a willing creature or an object can be hidden away, safe from detection for the duration. When you cast the spell and touch the target, it becomes invisible and can't be targeted by divination spells or perceived through scrying sensors created by divination spells."]
    },
    { 
        index: "simulacrum", name: "Simulacrum", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "12 hours", range: "Touch", components: ["V", "S", "M"], material: "Snow or ice in quantities sufficient to made a life-size copy of the duplicated creature; some hair, fingernail clippings, or other piece of that creature's body placed inside the snow or ice; and powdered ruby worth 1,500 gp, sprinkled over the duplicate and consumed by the spell.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You shape an illusory duplicate of one beast or humanoid that is within range for the entire casting time of the spell. The duplicate is a creature, partially real and formed from ice or snow, and it can take actions and otherwise be affected as a normal creature. It appears to be the same as the original, but it has half the creature's hit point maximum and is formed without any equipment. Otherwise, the illusion uses all the statistics of the creature it duplicates."]
    },
    { 
        index: "symbol", name: "Symbol", level: 7, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You scribe a potent rune on a surface or within an object that can be closed. When triggered, the glyph enacts one of the following effects: Death (10d10 necrotic), Discord, Fear, Hopelessness, Insanity, Pain, Sleep, or Stunning."]
    },
    { 
        index: "teleport", name: "Teleport", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can't be held or carried by an unwilling creature."]
    },

    // Level 8
    { 
        index: "antimagic-field", name: "Antimagic Field", level: 8, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S", "M"], material: "A pinch of powdered iron or iron filings.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A 10-foot-radius invisible sphere of antimagic surrounds you. This area is divorced from the magical energy that suffuses the multiverse. Within the sphere, spells can't be cast, summoned creatures disappear, and even magic items become mundane."]
    },
    { 
        index: "antipathy-sympathy", name: "Antipathy/Sympathy", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "A lump of alum soaked in vinegar for the antipathy effect or a drop of honey for the sympathy effect.", duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or a creature or an area that is no larger than a 200-foot cube. Then specify a kind of intelligent creature, such as red dragons, goblins, or vampires. You invest the target with an aura that either attracts or repels the specified creatures for the duration."]
    },
    { 
        index: "clone", name: "Clone", level: 8, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A diamond worth at least 1,000 gp and at least 1 cubic inch of flesh of the creature that is to be cloned, which the spell consumes, and a vessel worth at least 2,000 gp that has a sealable lid and is large enough to hold a Medium creature, such as a huge urn, coffin, mud-filled cyst in the ground, or crystal container filled with salt water.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell grows an inert duplicate of a living creature as a safeguard against death. This clone forms inside a sealed vessel and grows to full size and maturity after 120 days; you can also choose to have the clone be a younger version of the same creature. It remains inert and endures indefinitely, as long as its vessel remains undisturbed."]
    },
    { 
        index: "control-weather", name: "Control Weather", level: 8, school: { name: "Transmutation", index: "transmutation" }, casting_time: "10 minutes", range: "Self (5-mile radius)", components: ["V", "S", "M"], material: "Burning incense and bits of earth and wood mixed in water.", duration: "Concentration, up to 8 hours", ritual: false, concentration: true, classes: [], 
        desc: ["You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell. Moving to a place where you don't have a clear path to the sky ends the spell early."]
    },
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
        index: "incendiary-cloud", name: "Incendiary Cloud", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. Each creature that enters the area or starts its turn there must make a Dexterity saving throw. The creature takes 10d8 fire damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "8": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "maze", name: "Maze", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes. The target can use its action to attempt to escape. When it does so, it makes a DC 20 Intelligence check. If it succeeds, it escapes, and the spell ends."]
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
        index: "sunburst", name: "Sunburst", level: 8, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "Fire and a piece of sunstone.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "8": "12d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
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
        index: "gate", name: "Gate", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A diamond worth at least 5,000 gp.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose. The portal lasts for the duration."]
    },
    { 
        index: "imprisonment", name: "Imprisonment", level: 9, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A vellum depiction or a carved statuette in the likeness of the target, and a special component that varies according to the version of the spell you choose, worth at least 500 gp per Hit Die of the target.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell; if it succeeds, it is immune to this spell if you cast it again. While affected by this spell, the creature doesn't need to breathe, eat, or drink, and it doesn't age. Divination spells can't locate or perceive the target. The conditions for ending the spell are determined when you cast it."]
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
        index: "prismatic-wall", name: "Prismatic Wall", level: 9, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["A shimmering, multicolored plane of light forms a vertical opaque wall--up to 90 feet long, 30 feet high, and 1 inch thick--centered on a point you can see within range. Alternatively, you can shape the wall into a sphere up to 30 feet in diameter centered on a point you choose within range. The wall remains in place for the duration. If you position the wall so that it passes through a space occupied by a creature, the spell fails, and your action and the spell slot are wasted."]
    },
    { 
        index: "shapechange", name: "Shapechange", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A jade circlet worth at least 1,500 gp, which you must place on your head before you cast the spell.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You assume the form of a different creature for the duration. The new form can be of any creature with a challenge rating equal to your level or lower. The creature can't be a construct or an undead, and you must have seen the sort of creature at least once."]
    },
    { 
        index: "time-stop", name: "Time Stop", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal."]
    },
    { 
        index: "true-polymorph", name: "True Polymorph", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A drop of mercury, a dollop of gum arabic, and a wisp of smoke.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into an object, or the object into a creature (the object must be neither worn nor carried by another creature). The transformation lasts for the duration, or until the target drops to 0 hit points or dies. If you concentrate on this spell for the full duration, the transformation becomes permanent."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "weird", name: "Weird", level: 9, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds, visible only to them. Each creature in a 30-foot-radius sphere centered on a point of your choice within range must make a Wisdom saving throw. On a failed save, a creature becomes frightened for the duration. The illusion calls on the creature's deepest fears, manifesting its worst nightmares as an implacable threat. At the end of each of the frightened creature's turns, it must succeed on a Wisdom saving throw or take 4d10 psychic damage. On a successful save, the spell ends for that creature."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "9": "4d10" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "wish", name: "Wish", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires."]
    }
];
