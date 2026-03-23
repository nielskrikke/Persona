
import { SpellDetail } from '../../types';

export const ARTIFICER_SPELLS: SpellDetail[] = [
    // --- CANTRIPS (Level 0) ---
    { 
        index: "acid-splash", name: "Acid Splash", level: 0, school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage."],
        damage: { damage_type: {name:"Acid", index:"acid"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} }, 
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" }
    },
    { 
        index: "create-bonfire", name: "Create Bonfire", level: 0, school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", 
        ritual: false, concentration: true, classes: [], 
        desc: ["You create a bonfire on ground that you can see within range. Until the spell ends, the magic bonfire fills a 5-foot cube. Any creature in the bonfire’s space when you cast the spell must succeed on a Dexterity saving throw or take 1d8 fire damage."],
        damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} },
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" }
    },
    { 
        index: "dancing-lights", name: "Dancing Lights", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A bit of phosphorus.", 
        duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration."] 
    },
    { 
        index: "fire-bolt", name: "Fire Bolt", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage."],
        damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_character_level: {"1":"1d10", "5":"2d10", "11":"3d10", "17":"4d10"} }
    },
    { 
        index: "frostbite", name: "Frostbite", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You cause numbing frost to form on one creature you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage."],
        damage: { damage_type: {name:"Cold", index:"cold"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} },
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" }
    },
    { 
        index: "guidance", name: "Guidance", level: 0, school: { name: "Divination", index: "divination" }, 
        casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", 
        ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice."] 
    },
    { 
        index: "light", name: "Light", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A firefly.", 
        duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet."] 
    },
    { 
        index: "mage-hand", name: "Mage Hand", level: 0, school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 minute", 
        ritual: false, concentration: false, classes: [], 
        desc: ["A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action."] 
    },
    { 
        index: "magic-stone", name: "Magic Stone", level: 0, school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "1 minute", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier."],
        damage: { damage_type: {name:"Bludgeoning", index:"bludgeoning"}, damage_at_character_level: {"1":"1d6"} }
    },
    { 
        index: "mending", name: "Mending", level: 0, school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Two lodestones.", 
        duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell repairs a single break or tear in an object you touch. It can physically repair a magic item or construct, but cannot restore magic to it."] 
    },
    { 
        index: "message", name: "Message", level: 0, school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A short piece of copper wire.", 
        duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear."] 
    },
    { 
        index: "poison-spray", name: "Poison Spray", level: 0, school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You project a puff of noxious gas. The target must succeed on a Constitution save or take 1d12 poison damage."],
        damage: { damage_type: {name:"Poison", index:"poison"}, damage_at_character_level: {"1":"1d12", "5":"2d12", "11":"3d12", "17":"4d12"} },
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" }
    },
    { 
        index: "prestidigitation", name: "Prestidigitation", level: 0, school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "1 hour", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You create a minor magical effect, such as sparks, a gust of wind, or cleaning an object."] 
    },
    { 
        index: "ray-of-frost", name: "Ray of Frost", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["A frigid beam of blue-white light streaks toward a creature. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn."],
        damage: { damage_type: {name:"Cold", index:"cold"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { 
        index: "resistance", name: "Resistance", level: 0, school: { name: "Abjuration", index: "abjuration" }, 
        casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A miniature cloak.", 
        duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice."] 
    },
    { 
        index: "shocking-grasp", name: "Shocking Grasp", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["Lightning springs from your hand. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage and can't take reactions until its next turn."],
        damage: { damage_type: {name:"Lightning", index:"lightning"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }
    },
    { 
        index: "spare-the-dying", name: "Spare the Dying", level: 0, school: { name: "Necromancy", index: "necromancy" }, 
        casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You touch a living creature that has 0 hit points. The creature becomes stable."] 
    },
    { 
        index: "booming-blade", name: "Booming Blade", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "Self (5-foot radius)", components: ["S", "M"], material: "A melee weapon worth at least 1 sp.", 
        duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You brandish the weapon used in the spell’s casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack’s normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends."],
        damage: { damage_type: {name:"Thunder", index:"thunder"}, damage_at_character_level: {"5":"1d8", "11":"2d8", "17":"3d8"} }
    },
    { 
        index: "green-flame-blade", name: "Green-Flame Blade", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "Self (5-foot radius)", components: ["S", "M"], material: "A melee weapon worth at least 1 sp.", 
        duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You brandish the weapon used in the spell’s casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack’s normal effects, and you can cause green fire to leap from the target to a different creature of your choice that you can see within 5 feet of it. The second creature takes fire damage equal to your spellcasting ability modifier."],
        damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_character_level: {"5":"1d8", "11":"2d8", "17":"3d8"} }
    },
    { 
        index: "lightning-lure", name: "Lightning Lure", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "15 feet", components: ["V"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You create a lash of lightning energy that strikes at one creature of your choice that you can see within range. The target must succeed on a Strength saving throw or be pulled up to 10 feet in a straight line toward you and then take 1d8 lightning damage if it is within 5 feet of you."],
        damage: { damage_type: {name:"Lightning", index:"lightning"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} },
        dc: { dc_type: {name:"STR", index:"str"}, dc_success: "none" }
    },
    { 
        index: "mind-sliver", name: "Mind Sliver", level: 0, school: { name: "Enchantment", index: "enchantment" }, 
        casting_time: "1 action", range: "60 feet", components: ["V"], duration: "1 round", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn."],
        damage: { damage_type: {name:"Psychic", index:"psychic"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} },
        dc: { dc_type: {name:"INT", index:"int"}, dc_success: "none" }
    },
    { 
        index: "sword-burst", name: "Sword Burst", level: 0, school: { name: "Conjuration", index: "conjuration" }, 
        casting_time: "1 action", range: "Self (5-foot radius)", components: ["V"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You create a circle of spectral blades that sweep around you. Each creature within range, other than you, must succeed on a Dexterity saving throw or take 1d6 force damage."],
        damage: { damage_type: {name:"Force", index:"force"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} },
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" }
    },
    { 
        index: "thorn-whip", name: "Thorn Whip", level: 0, school: { name: "Transmutation", index: "transmutation" }, 
        casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "The stem of a plant with thorns.", 
        duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create a long, vine-like whip covered in thorns. Make a melee spell attack. If it hits, the target takes 1d6 piercing damage and you pull it up to 10 feet closer."],
        damage: { damage_type: {name:"Piercing", index:"piercing"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} } 
    },
    { 
        index: "thunderclap", name: "Thunderclap", level: 0, school: { name: "Evocation", index: "evocation" }, 
        casting_time: "1 action", range: "Self (5-foot radius)", components: ["S"], duration: "Instantaneous", 
        ritual: false, concentration: false, classes: [], 
        desc: ["You create a burst of thunderous sound. Each creature within range must succeed on a Constitution save or take 1d6 thunder damage."],
        damage: { damage_type: {name:"Thunder", index:"thunder"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} },
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" }
    },

    // --- LEVEL 1 ---
    { index: "absorb-elements", name: "Absorb Elements", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "Self", components: ["S"], duration: "1 round", ritual: false, concentration: false, classes: [], desc: ["Gain resistance to incoming energy damage and deal extra damage on your next melee hit."] },
    { index: "alarm", name: "Alarm", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "A bell.", duration: "8 hours", ritual: true, concentration: false, classes: [], desc: ["Set an alarm for an area or object."] },
    { index: "arcane-weapon", name: "Arcane Weapon", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Choose a damage type. Your weapon deals an extra 1d6 damage of that type."] },
    { index: "catapult", name: "Catapult", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Launch an object at high speeds. 3d8 bludgeoning damage."] },
    { index: "cure-wounds", name: "Cure Wounds", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Heal 1d8 + modifier HP."], damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d8"} } },
    { index: "detect-magic", name: "Detect Magic", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], desc: ["Sense presence of magic within 30ft."] },
    { index: "disguise-self", name: "Disguise Self", level: 1, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["Make yourself look different."] },
    { index: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Dash as a bonus action."] },
    { index: "faerie-fire", name: "Faerie Fire", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Outline objects/creatures in light. Adv on attacks."] },
    { index: "false-life", name: "False Life", level: 1, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["Gain 1d4+4 temporary HP."] },
    { index: "feather-fall", name: "Feather Fall", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 reaction", range: "60 feet", components: ["V", "M"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["Slow a fall for up to 5 creatures."] },
    { index: "grease", name: "Grease", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["Slick grease covers 10ft square. Dex save or fall prone."] },
    { index: "identify", name: "Identify", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], desc: ["Learn properties of a magic item."] },
    { index: "jump", name: "Jump", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["Triple a creature's jump distance."] },
    { index: "longstrider", name: "Longstrider", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["+10ft speed for 1 hour."] },
    { index: "sanctuary", name: "Sanctuary", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 bonus action", range: "30 feet", components: ["V", "S", "M"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["Creatures must save to attack warded target."] },
    { index: "snare", name: "Snare", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], desc: ["Create a hidden magical trap on the ground."] },
    { index: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], desc: ["Purify all nonmagical food and drink within a 5-foot radius."] },
    { index: "tashas-caustic-brew", name: "Tasha's Caustic Brew", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (30-foot line)", components: ["V", "S", "M"], material: "A bit of rotten food.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["A stream of acid deals 2d4 acid damage at start of each turn until washed off."], damage: { damage_type: {name:"Acid", index:"acid"}, damage_at_slot_level: {"1":"2d4"} } },

    // --- LEVEL 2 ---
    { index: "aid", name: "Aid", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], desc: ["Increase max and current HP for 3 allies by 5."] },
    { index: "alter-self", name: "Alter Self", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Change appearance or adapt body."] },
    { index: "arcane-lock", name: "Arcane Lock", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], desc: ["Magically lock a door or entrance."] },
    { index: "blur", name: "Blur", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Disadvantage on attacks against you."] },
    { index: "continual-flame", name: "Continual Flame", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], desc: ["Create a permanent torch-like flame."] },
    { index: "darkvision", name: "Darkvision", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], desc: ["Grant darkvision 60ft."] },
    { index: "enhance-ability", name: "Enhance Ability", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Grant adv on checks of one attribute."] },
    { index: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Make target larger or smaller."] },
    { index: "heat-metal", name: "Heat Metal", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Make a metal object glow red-hot, dealing fire dmg."] },
    { index: "invisibility", name: "Invisibility", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Target becomes invisible until they attack or cast."] },
    { index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["End one disease or condition."] },
    { index: "levitate", name: "Levitate", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Float a creature or object in the air."] },
    { index: "magic-mouth", name: "Magic Mouth", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], duration: "Until dispelled", ritual: true, concentration: false, classes: [], desc: ["Implant a triggered audio message in an object."] },
    { index: "magic-weapon", name: "Magic Weapon", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Weapon becomes magical +1 hit/dmg."] },
    { index: "protection-from-poison", name: "Protection from Poison", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["Resistance to poison damage and adv on saves."] },
    { index: "rope-trick", name: "Rope Trick", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["Create a hidden extradimensional space."] },
    { index: "see-invisibility", name: "See Invisibility", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["See invisible things."] },
    { index: "skywrite", name: "Skywrite", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Sight", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: true, concentration: true, classes: [], desc: ["Write messages in the clouds."] },
    { index: "spider-climb", name: "Spider Climb", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Walk on walls and ceilings."] },
    { index: "pyrotechnics", name: "Pyrotechnics", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Extinguish a flame to create fireworks or smoke."] },
    { index: "web", name: "Web", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of spiderweb.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Create a 20-foot cube of sticky webs."] },

    // --- LEVEL 3 ---
    { index: "blink", name: "Blink", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], desc: ["Vanish to the Ethereal Plane each turn on 11+."] },
    { index: "catnap", name: "Catnap", level: 3, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["S", "M"], duration: "10 minutes", ritual: false, concentration: false, classes: [], desc: ["Short rest benefits in 10 minutes."] },
    { index: "dispel-magic", name: "Dispel Magic", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["End a spell on a target."] },
    { index: "elemental-weapon", name: "Elemental Weapon", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Weapon becomes +1 and deals extra 1d4 elemental dmg."] },
    { index: "flame-arrows", name: "Flame Arrows", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Ammunition deals extra 1d6 fire dmg."] },
    { index: "fly", name: "Fly", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Grant a flying speed of 60ft."] },
    { index: "gaseous-form", name: "Gaseous Form", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Turn into a misty cloud."] },
    { index: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], desc: ["Inscribe a magical trap."] },
    { index: "haste", name: "Haste", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Double speed, +2 AC, extra action."] },
    { index: "protection-from-energy", name: "Protection from Energy", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Resistance to one energy type."] },
    { index: "revivify", name: "Revivify", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "300gp worth of diamonds.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Return dead creature (within 1 min) to life."] },
    { index: "tiny-servant", name: "Tiny Servant", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], desc: ["Animate a tiny object to serve you."] },
    { index: "water-breathing", name: "Water Breathing", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: true, concentration: false, classes: [], desc: ["Up to 10 creatures can breathe underwater."] },
    { index: "water-walk", name: "Water Walk", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "1 hour", ritual: true, concentration: false, classes: [], desc: ["Walk on liquid surfaces."] },
    { index: "ashardalons-stride", name: "Ashardalon's Stride", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Increase speed by 20ft and deal 1d6 fire damage to creatures you pass."], damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_slot_level: {"3":"1d6"} } },
    { index: "create-food-and-water", name: "Create Food and Water", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Create 45 pounds of food and 30 gallons of water."] },
    { index: "intellect-fortress", name: "Intellect Fortress", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Grant resistance to psychic damage and adv on mental saves."] },

    // --- LEVEL 4 ---
    { index: "arcane-eye", name: "Arcane Eye", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Create an invisible, floating eye sensor."] },
    { index: "elemental-bane", name: "Elemental Bane", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Target takes extra elemental dmg and loses resistance."] },
    { index: "fabricate", name: "Fabricate", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "10 minutes", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Transform raw materials into complex products."] },
    { index: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "1 hour", ritual: false, concentration: false, classes: [], desc: ["Ignore terrain/paralysis/restraints."] },
    { index: "secret-chest", name: "Leomund's Secret Chest", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Hide a chest on the Ethereal Plane."] },
    { index: "faithful-hound", name: "Mordenkainen's Faithful Hound", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "8 hours", ritual: false, concentration: false, classes: [], desc: ["Conjure a phantom watchdog to guard an area."] },
    { index: "private-sanctum", name: "Mordenkainen's Private Sanctum", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "10 minutes", range: "120 feet", components: ["V", "S", "M"], duration: "24 hours", ritual: false, concentration: false, classes: [], desc: ["Ward an area against sound/vision/sensors."] },
    { index: "resilient-sphere", name: "Otiluke's Resilient Sphere", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Enclose target in an indestructible sphere."] },
    { index: "stone-shape", name: "Stone Shape", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Reshape stone to any form."] },
    { index: "stoneskin", name: "Stoneskin", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Resistance to nonmagical physical damage."] },
    { index: "vitreolic-sphere", name: "Vitreolic Sphere", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["Acid explosion deals heavy dmg over time."] },
    { index: "summon-construct", name: "Summon Construct", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A lock and key worth at least 400 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Summon a construct spirit to fight for you."] },

    // --- LEVEL 5 ---
    { index: "animate-objects", name: "Animate Objects", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Animate nonmagical objects to fight for you."] },
    { index: "bigbys-hand", name: "Bigby's Hand", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Create a versatile Large hand of force."] },
    { index: "creation", name: "Creation", level: 5, school: { name: "Illusion", index: "illusion" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], duration: "Special", ritual: false, concentration: false, classes: [], desc: ["Create nonliving vegetable or mineral matter."] },
    { index: "greater-restoration", name: "Greater Restoration", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["End a debilitating curse/effect/exhaustion."] },
    { index: "skill-empowerment", name: "Skill Empowerment", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["Grant expertise in one skill."] },
    { index: "transmute-rock", name: "Transmute Rock", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], duration: "Until dispelled", ritual: false, concentration: false, classes: [], desc: ["Turn rock to mud or mud to rock."] },
    { index: "wall-of-stone", name: "Wall of Stone", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Create a solid stone wall."] }
];
