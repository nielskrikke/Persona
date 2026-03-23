
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
    {
        index: "control-flames", name: "Control Flames", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Instantaneous or 1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You choose nonmagical flame that you can see within range and that fits within a 5-foot cube. You affect it in one of the following ways: expand it, extinguish it, change its brightness, or cause simple shapes to appear."]
    },
    {
        index: "create-bonfire", name: "Create Bonfire", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You create a bonfire on ground that you can see within range. Until the spell ends, the magic bonfire fills a 5-foot cube. Any creature in the bonfire’s space when you cast the spell must succeed on a Dexterity saving throw or take 1d8 fire damage. A creature must also make the saving throw when it enters the bonfire’s space for the first time on a turn or ends its turn there."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_character_level: { "1": "1d8", "5": "2d8", "11": "3d8", "17": "4d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "frostbite", name: "Frostbite", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You cause numbing frost to form on one creature you can see within range. The target must make a Constitution saving throw. On a failed save, the target takes 1d6 cold damage, and it has disadvantage on the next weapon attack roll it makes before the end of its next turn."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "thunderclap", name: "Thunderclap", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "5 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must succeed on a Constitution saving throw or take 1d6 thunder damage."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "booming-blade", name: "Booming Blade", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (5-foot radius)", components: ["S", "M"], material: "a melee weapon worth at least 1 sp", duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["You brandish the weapon used in the spell’s casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack’s normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_character_level: { "5": "1d8", "11": "2d8", "17": "3d8" } }
    },
    {
        index: "green-flame-blade", name: "Green-Flame Blade", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (5-foot radius)", components: ["S", "M"], material: "a melee weapon worth at least 1 sp", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You brandish the weapon used in the spell’s casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack’s normal effects, and you can cause green fire to leap from the target to a different creature of your choice that you can see within 5 feet of it. The second creature takes fire damage equal to your spellcasting ability modifier."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_character_level: { "5": "1d8", "11": "2d8", "17": "3d8" } }
    },
    {
        index: "lightning-lure", name: "Lightning Lure", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "15 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a lash of lightning energy that strikes at one creature you can see within range. The target must succeed on a Strength saving throw or be pulled up to 10 feet in a straight line toward you and then take 1d8 lightning damage if it is within 5 feet of you."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_character_level: { "1": "1d8", "5": "2d8", "11": "3d8", "17": "4d8" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "mind-sliver", name: "Mind Sliver", level: 0, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    {
        index: "sword-burst", name: "Sword Burst", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self (5-foot radius)", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a circle of spectral blades that sweep around you. All other creatures within 5 feet of you must each succeed on a Dexterity saving throw or take 1d6 force damage."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "gust", name: "Gust", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You seize the air and compel it to create one of the following effects at a point you can see within range: One Medium or smaller creature must succeed on a Strength saving throw or be pushed up to 5 feet away from you; You create a small blast of air capable of moving an object that is neither held nor carried and that weighs no more than 5 pounds; You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "infestation", name: "Infestation", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "a living flea", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet. Roll a d4 for the direction: 1, north; 2, south; 3, east; or 4, west. This movement doesn’t provoke opportunity attacks, and if the direction rolled is blocked, the target doesn't move."],
        damage: { damage_type: { name: "Poison", index: "poison" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "mold-earth", name: "Mold Earth", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Instantaneous or 1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You can affect it in one of the following ways: If you target an area of loose earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away; You cause shapes, colors, or both to appear on the dirt or stone, spelling out words, creating images, or shaping patterns; If the dirt or stone you target is on the ground, you cause it to become difficult terrain. Alternatively, you can cause the ground to become normal terrain if it is already difficult terrain."]
    },
    {
        index: "shape-water", name: "Shape Water", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Instantaneous or 1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You choose an area of water that you can see within range and that fits within a 5-foot cube. You can affect it in one of the following ways: You instantaneously move or otherwise change the flow of the water as you direct, up to 5 feet in any direction; You cause the water to form into simple shapes and animate at your direction; You change the water’s color or opacity; You freeze the water, provided that there are no creatures in it. The water unfreezes in 1 hour."]
    },

    // Level 1
    {
        index: "absorb-elements", name: "Absorb Elements", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "Self", components: ["S"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["The spell absorbs a portion of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering damage type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type, and the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each slot level above 1st."]
    },
    {
        index: "chaos-bolt", name: "Chaos Bolt", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You hurl an undulating, warbling mass of chaotic energy at one creature in range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 + 1d6 damage. Choose one of the d8s. The number rolled on that die determines the spell’s damage type: 1-Acid, 2-Cold, 3-Fire, 4-Force, 5-Lightning, 6-Poison, 7-Psychic, 8-Thunder. If you roll the same number on both d8s, the chaotic energy leaps from the target to a different creature of your choice within 30 feet of it. Make a new attack roll against the new target, and make a new damage roll, which could cause the chaotic energy to leap again."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, each target takes an extra 1d6 damage of the type rolled for each slot level above 1st."]
    },
    {
        index: "ice-knife", name: "Ice Knife", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["S", "M"], material: "a drop of water or piece of ice", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "1": "2d6", "2": "3d6", "3": "4d6", "4": "5d6", "5": "6d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "grease", name: "Grease", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a bit of pork rind or butter", duration: "1 minute", ritual: false, concentration: false, classes: [],
        desc: ["Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "tashas-caustic-brew", name: "Tasha's Caustic Brew", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (30-foot line)", components: ["V", "S", "M"], material: "a bit of rotten food", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A stream of acid blasts from you in a line 30 feet long and 5 feet wide. Each creature in the line must succeed on a Dexterity saving throw or be covered in acid for the duration or until a creature uses its action to scrape or wash the acid off itself or another creature. A creature covered in the acid takes 2d4 acid damage at the start of each of its turns."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 2d4 for each slot level above 1st."],
        damage: { damage_type: { name: "Acid", index: "acid" }, damage_at_slot_level: { "1": "2d4", "2": "4d4", "3": "6d4", "4": "8d4", "5": "10d4" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
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
    {
        index: "catapult", name: "Catapult", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Choose one object weighing 1 to 5 pounds within range that isn’t being worn or carried. The object flies in a straight line up to 90 feet in a direction you choose before falling to the ground, stopping early if it impacts against a solid surface. If the object would strike a creature, that creature must make a Dexterity saving throw. On a failed save, the object strikes the target and stops moving. In either case, both the object and the creature or solid surface take 3d8 bludgeoning damage."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the maximum weight of an object you can target increases by 5 pounds, and the damage increases by 1d8, for each slot level above 1st."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "1": "3d8", "2": "4d8", "3": "5d8", "4": "6d8", "5": "7d8", "6": "8d8", "7": "9d8", "8": "10d8", "9": "11d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "earth-tremor", name: "Earth Tremor", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "1": "1d6", "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6", "6": "6d6", "7": "7d6", "8": "8d6", "9": "9d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
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
        index: "dragons-breath", name: "Dragon's Breath", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S", "M"], material: "a hot pepper", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You touch one willing creature and imbue it with the power to spew magical energy from its mouth, provided it has one. Choose acid, cold, fire, lightning, or poison. Until the spell ends, the creature can use an action to exhale energy of the chosen type in a 15-foot cone. Each creature in that area must make a Dexterity saving throw, taking 3d6 damage of the chosen type on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd."]
    },
    {
        index: "mind-spike", name: "Mind Spike", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You reach into the mind of one creature you can see within range. The target must make a Wisdom saving throw, taking 3d8 psychic damage on a failed save, or half as much damage on a successful one. On a failed save, you also always know the target’s location until the spell ends, but only while the two of you are on the same plane of existence. While you have this knowledge, the target can’t become hidden from you, and if it’s invisible, it gains no benefit from that condition against you."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."]
    },
    {
        index: "shadow-blade", name: "Shadow Blade", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You weave together threads of shadow to create a sword of solidified gloom in your hand. This magic sword lasts until the spell ends. It counts as a simple melee weapon with which you are proficient. It deals 2d8 psychic damage on a hit and has the finesse, light, and thrown properties (range 20/60). When you use the sword to attack a target that is in dim light or darkness, you have advantage on the attack roll."],
        higher_level: ["When you cast this spell using a 3rd- or 4th-level spell slot, the damage increases to 3d8. When you cast it using a 5th- or 6th-level spell slot, the damage increases to 4d8. When you cast it using a spell slot of 7th level or higher, the damage increases to 5d8."]
    },
    {
        index: "flame-blade", name: "Flame Blade", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S", "M"], material: "a leaf of sumac", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke it again as a bonus action. You can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes 3d6 fire damage."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for every two slot levels above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "3d6", "4": "4d6", "6": "5d6", "8": "6d6" } }
    },
    {
        index: "flaming-sphere", name: "Flaming Sphere", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a bit of tallow, a pinch of brimstone, and a dusting of powdered iron", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6", "6": "6d6", "7": "7d6", "8": "8d6", "9": "9d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "magic-weapon", name: "Magic Weapon", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3."]
    },
    {
        index: "tashas-mind-whip", name: "Tasha's Mind Whip", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["You psychically lash out at one creature you can see within range. The target must make an Intelligence saving throw. On a failed save, the target takes 3d6 psychic damage, and it can’t take a reaction until the end of its next turn. Moreover, on its next turn, it must choose whether it gets a move, an action, or a bonus action; it gets only one of the three."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd. The creatures must be within 30 feet of each other when you target them."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "2": "3d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    {
        index: "thunder-step", name: "Thunder Step", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You teleport yourself to an unoccupied space you can see within range. Immediately after you disappear, a thunderous boom sounds, and each creature within 10 feet of the space you left must make a Constitution saving throw, taking 3d10 thunder damage on a failed save, or half as much damage on a successful one. You can bring along objects as long as their weight doesn’t exceed what you can carry. You can also teleport one willing creature of your size or smaller who is carrying gear up to its carrying capacity. The creature must be within 5 feet of you when you cast this spell, and there must be an unoccupied space within 5 feet of your destination space for the creature to appear in; otherwise, the creature is left behind."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d10 for each slot level above 3rd."]
    },
    {
        index: "intellect-fortress", name: "Intellect Fortress", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You create a psychic barrier around yourself or a willing creature you can see within range. For the duration, the target has advantage on Intelligence, Wisdom, and Charisma saving throws, and it has resistance to psychic damage."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them."]
    },
    {
        index: "vampiric-touch", name: "Vampiric Touch", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "3": "3d6", "4": "4d6", "5": "5d6", "6": "6d6", "7": "7d6", "8": "8d6", "9": "9d6" } }
    },
    {
        index: "melfs-minute-meteors", name: "Melf's Minute Meteors", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "niter, sulfur, and pine tar formed into a bead", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["You create six tiny meteors in your space. They float in the air and orbit you for the spell’s duration. When you cast the spell — and as a bonus action on each of your subsequent turns — you can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, it explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the number of meteors created increases by two for each slot level above 3rd."]
    },
    { 
        index: "web", name: "Web", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of spiderweb.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "aganazzars-scorcher", name: "Aganazzar's Scorcher", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "a red dragon’s scale", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["A line of roaring flame 30 feet long and 5 feet wide shoots out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 3d8 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "3d8", "3": "4d8", "4": "5d8", "5": "6d8", "6": "7d8", "7": "8d8", "8": "9d8", "9": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "dust-devil", name: "Dust Devil", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a pinch of dust", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You choose an unoccupied 5-foot cube of air that you can see within range. An elemental force that resembles a dust devil appears in the cube and lasts for the spell’s duration. Any creature that ends its turn within 5 feet of the dust devil must make a Strength saving throw. On a failed save, the creature takes 1d8 bludgeoning damage and is pushed 10 feet away from the dust devil. On a successful save, the creature takes half as much damage and isn't pushed. As a bonus action, you can move the dust devil up to 30 feet in any direction. If the dust devil moves over sand, dust, loose dirt, or small gravel, it sucks up the material and forms a 10-foot-radius cloud of debris around itself that lasts until the start of your next turn. The cloud heavily obscures its area."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "2": "1d8", "3": "2d8", "4": "3d8", "5": "4d8", "6": "5d8", "7": "6d8", "8": "7d8", "9": "8d8" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "half" }
    },
    {
        index: "earthbind", name: "Earthbind", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["Choose one creature you can see within range. Yellow strips of magical energy loop around the creature. The target must succeed on a Strength saving throw, or its flying speed (if any) is reduced to 0 feet for the spell’s duration. An airborne creature affected by this spell safely descends at 60 feet per round until it reaches the ground or the spell ends."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "maximilians-earthy-grasp", name: "Maximilian's Earthy Grasp", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "a miniature hand sculpted from clay", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You choose a 5-foot-square unoccupied space on the ground that you can see within range. A Medium hand made of compacted soil rises there and reaches for one creature you can see within 5 feet of it. The target must make a Strength saving throw. On a failed save, the target takes 2d6 bludgeoning damage and is restrained for the spell’s duration. As an action, you can cause the hand to crush the restrained target, who must make a Strength saving throw. It takes 2d6 bludgeoning damage on a failed save, or half as much damage on a successful one. To give its freedom, the restrained target can make a Strength check against your spell save DC. On a success, it escapes and is no longer restrained by the hand. As an action, you can cause the hand to reach for a different creature or to move to a different unoccupied space within range. The hand releases a restrained target if you do either."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "2": "2d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "pyrotechnics", name: "Pyrotechnics", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Choose an area of nonmagical flame that you can see within range and that fits within a 5-foot cube. You can extinguish the fire in that area, and you create either fireworks or smoke: Fireworks. The target explodes with a dazzling display of colors. Each creature within 10 feet of the target must succeed on a Constitution saving throw or become blinded until the end of your next turn; Smoke. Thick black smoke spreads out from the target in a 20-foot radius, moving around corners. The area of the smoke is heavily obscured. The smoke persists for 1 minute or until a strong wind disperses it."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "snillocs-snowball-swarm", name: "Snilloc's Snowball Swarm", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "a piece of ice or a small white rock chip", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["A flurry of magic snowballs erupts from a point you choose within range. Each creature in a 5-foot-radius sphere centered on that point must make a Dexterity saving throw. A creature takes 3d6 cold damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "2": "3d6", "3": "4d6", "4": "5d6", "5": "6d6", "6": "7d6", "7": "8d6", "8": "9d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "warding-wind", name: "Warding Wind", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["A strong wind (20 miles per hour) blows around you in a 10-foot radius and moves with you, remaining centered on you. The wind lasts for the spell’s duration. The wind has the following effects: It deafens you and other creatures in its area; It extinguishes unprotected flames in its area that are torch-sized or smaller; It hedges out vapor, gas, and fog that can be dispersed by strong wind; The area is difficult terrain for creatures other than you; The attack rolls of ranged weapon attacks have disadvantage if they pass in or out of the wind."]
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
        desc: ["This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language can understand what it says."]
    },
    {
        index: "catnap", name: "Catnap", level: 3, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["S", "M"], material: "a pinch of sand", duration: "10 minutes", ritual: false, concentration: false, classes: [],
        desc: ["You make a calming gesture, and up to three willing creatures of your choice that you can see within range fall into a magical slumber for the duration. The spell ends on a target early if it takes damage or someone uses an action to shake or slap it awake. If a target remains asleep for the full duration, that target gains all the benefits of a short rest, and it can’t be affected by this spell again until it finishes a long rest."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you can target one additional willing creature for each slot level above 3rd."]
    },
    {
        index: "enemies-abound", name: "Enemies Abound", level: 3, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You reach into the mind of one creature you can see within range and force it to make an Intelligence saving throw. A creature automatically succeeds if it is immune to being charmed. On a failed save, the target loses the ability to distinguish friend from foe, regarding all creatures it can see as enemies until the spell ends. Each time the target takes damage, it can repeat the saving throw, ending the effect on itself on a success. Whenever the affected creature chooses a target for an attack, spell, or other ability, it must choose the target at random from among the creatures it can see within range of the attack, spell, or ability. If an appropriate target is within range, the creature must make an attack, spell, or other ability against it. If the creature makes an opportunity attack, it must attack the first creature that provokes the attack, regardless of whether it is an ally or an enemy."],
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    {
        index: "erupting-earth", name: "Erupting Earth", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "a piece of obsidian", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d12 for each slot level above 3rd."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "3": "3d12", "4": "4d12", "5": "5d12", "6": "6d12", "7": "7d12", "8": "8d12", "9": "9d12" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "flame-arrows", name: "Flame Arrows", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You touch a quiver containing arrows or bolts. When a target is hit by a ranged weapon attack using a piece of ammunition from the quiver, the target takes an extra 1d6 fire damage. The spell’s magic ends on the piece of ammunition when it hits or misses, and the spell ends when twelve pieces of ammunition have been drawn from the quiver."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the number of pieces of ammunition you can affect increases by two for each slot level above 3rd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_character_level: { "1": "1d6" } }
    },
    {
        index: "wall-of-water", name: "Wall of Water", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a drop of water", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["You conjure up a wall of water on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall vanishes when the spell ends. The wall’s space is difficult terrain. Any ranged weapon attack that enters the wall’s space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Spells that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot-square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall’s water doesn’t fill it."]
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
    {
        index: "sickening-radiance", name: "Sickening Radiance", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Dim, greenish light spreads within a 30-foot-radius sphere centered on a point you choose within range. The light spreads around corners, and it lasts until the spell ends. When a creature moves into the spell’s area for the first time on a turn or starts its turn there, that creature must succeed on a Constitution saving throw or take 4d10 radiant damage, and it suffers one level of exhaustion and emits a dim, greenish light in a 5-foot radius. This light and the exhaustion caused by this spell go away when the spell ends."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "4": "4d10", "5": "5d10", "6": "6d10", "7": "7d10", "8": "8d10", "9": "9d10" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "vitriolic-sphere", name: "Vitriolic Sphere", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "a drop of giant slug bile", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You point your finger at a location within range, and a 1-foot-diameter ball of churning, acid energy explodes there in a 20-foot-radius sphere. Each creature in that area must make a Dexterity saving throw. On a failed save, a creature takes 10d4 acid damage and 5d4 acid damage at the end of its next turn. On a successful save, a creature takes half the initial damage and no damage at the end of its next turn."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the initial damage increases by 2d4 for each slot level above 4th."],
        damage: { damage_type: { name: "Acid", index: "acid" }, damage_at_slot_level: { "4": "10d4", "5": "12d4", "6": "14d4", "7": "16d4", "8": "18d4", "9": "20d4" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "fire-shield", name: "Fire Shield", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "a bit of phosphorus or a firefly", duration: "10 minutes", ritual: false, concentration: false, classes: [],
        desc: ["Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it. The flames provide you with a shield, the type of which you choose when you cast the spell: Warm Shield or Chill Shield."]
    },
    {
        index: "summon-aberration", name: "Summon Aberration", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "a pickled tentacle and a silver eyeball worth at least 400 gp", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You call forth an aberrational spirit. It manifests in an unoccupied space that you can see within range. This corporeal form uses the Aberrant Spirit stat block. When you cast the spell, choose a form: Beholderkin, Slaad, or Star Spawn. The creature resembles an aberration of your choice which determines certain traits in its stat block. The creature disappears when it drops to 0 hit points or when the spell ends."],
        higher_level: ["When you cast this spell using a slot of 5th level or higher, use the higher level wherever the spell’s level appears in the stat block."]
    },
    {
        index: "charm-monster", name: "Charm Monster", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature is friendly to you. When the spell ends, the creature knows it was charmed by you."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "storm-sphere", name: "Storm Sphere", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A 20-foot-radius sphere of whirling air springs into existence centered on a point you choose within range. The sphere remains for the spell’s duration. Each creature in the sphere when it appears or that ends its turn there must succeed on a Strength saving throw or take 2d6 bludgeoning damage. The sphere’s space is difficult terrain. Until the spell ends, you can use a bonus action on each of your turns to cause a bolt of lightning to leap from the center of the sphere toward one creature you choose within 60 feet of the center. Make a ranged spell attack. You have advantage on the attack roll if the target is in the sphere. On a hit, the target takes 4d6 lightning damage. Creatures within 30 feet of the sphere have disadvantage on Wisdom (Perception) checks that rely on hearing due to the sphere’s roaring."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d6 for each slot level above 4th, and the lightning damage increases by 1d6 for each slot level above 4th."],
        damage: { damage_type: { name: "Lightning/Bludgeoning", index: "lightning" }, damage_at_slot_level: { "4": "2d6+4d6", "5": "3d6+5d6", "6": "4d6+6d6", "7": "5d6+7d6", "8": "6d6+8d6", "9": "7d6+9d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "half" }
    },
    {
        index: "watery-sphere", name: "Watery Sphere", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "a droplet of water and a pinch of dust", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You conjure up a sphere of water with a 10-foot radius at a point you can see within range. The sphere can hover but no more than 10 feet off the ground. The sphere remains for the spell’s duration. Any creature in the sphere’s space must make a Strength saving throw. On a successful save, a creature is ejected from that space to the nearest unoccupied space of the creature’s choice outside the sphere. A Huge or larger creature succeeds on the saving throw automatically, and a Large or smaller creature can choose to fail it. On a failed save, a creature is restrained by the sphere and is engulfed by the water. At the end of each of its turns, a restrained target can repeat the saving throw, ending the effect on itself on a success. The sphere can restrain up to four Medium or smaller creatures or one Large creature. If the sphere restrains an additional creature, one of the creatures already restrained by it is excluded and falls 10 feet in a random direction. As an action, you can move the sphere up to 30 feet in a straight line. If it moves over a pit, a cliff, or other drop-off, it safely descends until it is hovering 10 feet above ground. Any creature restrained by the sphere moves with it. You can ram the sphere into creatures, forcing them to make the saving throw. When the spell ends, the sphere falls to the ground and extinguishes all normal flames within 30 feet of it. Any creature restrained by the sphere is knocked prone in the space where it falls. The water then vanishes."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "enervation", name: "Enervation", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A tendril of inky darkness reaches out from you, touching a creature you can see within range to drain life from it. The target must make a Dexterity saving throw. On a successful save, the target takes 2d8 necrotic damage, and the spell ends. On a failed save, the target takes 4d8 necrotic damage, and until the spell ends, you can use your action on each of your turns to automatically deal 4d8 necrotic damage to the target. The spell ends if you use your action to do anything else, if the target is ever outside the spell’s range, or if the target has total cover from you. Whenever the spell deals damage to a target, you regain hit points equal to half the amount of necrotic damage the target takes."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "5": "4d8", "6": "5d8", "7": "6d8", "8": "7d8", "9": "8d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "far-step", name: "Far Step", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You teleport up to 60 feet to an unoccupied space you can see. On each of your turns before the spell ends, you can use a bonus action to teleport in this way again."]
    },
    {
        index: "synaptic-static", name: "Synaptic Static", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You choose a point within range and cause psychic energy to explode there. Each creature in a 20-foot-radius sphere centered on that point must make an Intelligence saving throw. A creature with an Intelligence score of 2 or lower can’t be affected by this spell. A target takes 8d6 psychic damage on a failed save, or half as much damage on a successful one. After a failed save, a target has muddled thoughts for 1 minute. During that time, it rolls a d6 and subtracts the number rolled from all its attack rolls and ability checks, as well as its Constitution saving throws to maintain concentration. The target can make an Intelligence saving throw at the end of each of its turns, ending the effect on itself on a success."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "5": "8d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "half" }
    },
    {
        index: "bigbys-hand", name: "Bigby's Hand", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "an eggshell and a snake’s tongue", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the spell’s duration, and it moves at your command, mimicking the movements of your own hand. The hand is an object that has AC 20 and hit points equal to your hit point maximum. If it drops to 0 hit points, the spell ends. It has a Strength of 26 (+8) and a Dexterity of 10 (+0). When you cast the spell and as a bonus action on your subsequent turns, you can move the hand up to 60 feet and then cause one of the following effects with it: Clenched Fist, Forceful Hand, Grasping Hand, Interposing Hand."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage from the clenched fist and the grasping hand increases by 2d8 for each slot level above 5th."]
    },
    {
        index: "control-winds", name: "Control Winds", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You take control of the air in a 100-foot cube that you can see within range. Choose one of the following effects for the duration of the spell. As an action on your turn, you can change which effect is in place: Gusts, Downdraft, or Updraft."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "immolation", name: "Immolation", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "90 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["Flames wreathe one creature you can see within range. The target must make a Dexterity saving throw. It takes 8d6 fire damage on a failed save, or half as much damage on a successful one. On a failed save, the target also burns for the spell’s duration. The burning target sheds bright light in a 30-foot radius and dim light for an additional 30 feet. At the end of each of its turns, the target repeats the saving throw. It takes 4d6 fire damage on a failed save, and the spell ends on a successful one. These flames can’t be extinguished by nonmagical means. If damage from this spell kills a target, the target is turned to ash."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "5": "8d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "skill-empowerment", name: "Skill Empowerment", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["Your magic deepens a creature’s understanding of its own talent. You touch one willing creature and give it expertise in one skill of your choice; until the spell ends, the creature doubles its proficiency bonus for any ability check it makes that uses the chosen skill. You must choose a skill in which the creature is already proficient and that isn’t already benefiting from a feature, such as Expertise, that doubles its proficiency bonus."]
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
    {
        index: "arcane-gate", name: "Arcane Gate", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "500 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["You create a 5-foot-wide, 10-foot-high circular portal at a point you can see within range. Another portal also appears at a point you can see within range. The portals are two-dimensional glowing rings, and they are always oriented toward each other. A creature or object entering one portal exits from the other as if the two were adjacent. The portals are only visible from one side (the side you choose), and they are opaque from the other side. On your turn, you can use a bonus action to rotate the portals so that their visible sides face different directions."]
    },
    {
        index: "investiture-of-flame", name: "Investiture of Flame", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Flames wreathe your body, shedding bright light in a 30-foot radius and dim light for an additional 30 feet. You are immune to fire damage and have resistance to cold damage. Any creature that moves within 5 feet of you for the first time on a turn or ends its turn there takes 1d10 fire damage. You can use your action to create a line of fire 15 feet long and 5 feet wide extending from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 4d8 fire damage on a failed save, or half as much damage on a successful one."]
    },
    {
        index: "investiture-of-ice", name: "Investiture of Ice", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Until the spell ends, ice rimes your body, and you gain the following benefits: You are immune to cold damage and have resistance to fire damage. You can use your action to create a 15-foot cone of freezing air extending from your outstretched hand. Each creature in the cone must make a Constitution saving throw. A creature takes 4d6 cold damage on a failed save, or half as much damage on a successful one. A creature that fails its save against this effect has its speed halved until the start of your next turn. The ground in a 10-foot radius around you is icy and is difficult terrain for creatures other than you. The radius moves with you."]
    },
    {
        index: "investiture-of-stone", name: "Investiture of Stone", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Until the spell ends, your flesh becomes as hard as stone, and you gain the following benefits: You have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks. You can use your action to create a small earthquake on the ground in a 15-foot radius around you. Each creature on that ground must make a Strength saving throw. On a failed save, a creature takes 4d6 bludgeoning damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone. You can move through solid earth or stone as if it were air and without destabilizing it, but you can’t end your movement there. If you do so, you are ejected to the nearest unoccupied space, this spell ends, and you are stunned until the start of your next turn."]
    },
    {
        index: "investiture-of-wind", name: "Investiture of Wind", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Until the spell ends, wind whirls around you, and you gain the following benefits: Ranged weapon attacks made against you have disadvantage on the attack roll. You gain a flying speed of 60 feet. If you are still flying when the spell ends, you fall, unless you have some other means of aloft. You can use your action to create a 15-foot cube of swirling wind centered on a point you can see within 60 feet of you. Each creature in that area must make a Strength saving throw. A creature takes 2d10 bludgeoning damage on a failed save, or half as much damage on a successful one. If a Large or smaller creature fails the save, that creature is also pushed up to 10 feet away from the center of the cube."]
    },
    {
        index: "mental-prison", name: "Mental Prison", level: 6, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You attempt to bind a creature within an illusory cell that only it perceives. One creature you can see within range must make an Intelligence saving throw. The target succeeds automatically if it is immune to being charmed. On a successful save, the target takes 5d10 psychic damage, and the spell ends. On a failed save, the target takes 5d10 psychic damage, and you make the area immediately around the target’s space appear dangerous to it in some way. The target can’t see or hear anything outside the illusory cell. The target is restrained for the duration. If the target is moved out of the illusory cell, if it makes a melee attack through it, or if it reaches any part of its body through it, the target takes 10d10 psychic damage, and the spell ends."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "6": "5d10" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "half" }
    },
    {
        index: "scatter", name: "Scatter", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["The air quivers around up to five willing creatures you can see within range, or the air quivers around you and up to four willing creatures you can see within range. You teleport each affected creature to an unoccupied space that you can see within 120 feet of you, but each destination space must be on the ground or on a floor."]
    },
    {
        index: "flesh-to-stone", name: "Flesh to Stone", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a pinch of lime, water, and earth", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You attempt to turn a creature that you can see within range into stone. If the target’s body is made of flesh, the creature must make a Constitution saving throw. On a failed save, it is restrained as its flesh begins to harden. On a successful save, the creature isn’t affected. A creature restrained by this spell must make another Constitution saving throw at the end of each of its turns. If it successfully saves against this spell three times, the spell ends. If it fails its saves three times, it is turned to stone and subjected to the petrified condition for the duration. The successes and failures don’t need to be consecutive; keep track of both until the target collects three of a kind."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "otilukes-freezing-sphere", name: "Otiluke's Freezing Sphere", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "a small crystal sphere", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["A globe of frigid energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a Constitution saving throw. On a failed save, a creature takes 10d6 cold damage. On a successful save, a creature takes half as much damage. If the globe strikes a body of water or a liquid that is principally water (not including water-based creatures), it freezes the liquid to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were swimming on the surface of frozen water are trapped in the ice. A trapped creature can use an action to make a Strength check against your spell save DC to break free."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "6": "10d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    {
        index: "tashas-otherworldly-guise", name: "Tasha's Otherworldly Guise", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S", "M"], material: "an object engraved with a symbol of the Outer Planes worth at least 500 gp", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["Uttering an incantation, you draw on the magic of the Lower Planes or Upper Planes (your choice) to transform yourself. You gain the following benefits until the spell ends: you are immune to fire and poison damage (Lower Planes) or radiant and necrotic damage (Upper Planes); you are immune to the poisoned condition (Lower Planes) or the charmed condition (Upper Planes); spectral wings grow from your back, giving you a flying speed of 40 feet; you gain a +2 bonus to AC; all your weapon attacks are magical, and when you make a weapon attack, you can use your spellcasting ability modifier instead of Strength or Dexterity for the attack and damage rolls; you can attack twice, instead of once, when you take the Attack action on your turn. You ignore this benefit if you already have a feature, like Extra Attack, that gives you extra attacks."]
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
    {
        index: "crown-of-stars", name: "Crown of Stars", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [],
        desc: ["Seven star-like orbs of light appear and hover around your head until the spell ends or until you expend them all. When you cast the spell, and as a bonus action on each of your subsequent turns, you can expend one orb and send it streaking toward a creature or object within 120 feet of you. Make a ranged spell attack. On a hit, the target takes 4d12 radiant damage. Whether you hit or miss, the orb is expended. The orbs shed bright light in a 30-foot radius and dim light for an additional 30 feet. If you have four or more orbs remaining, they shed bright light in a 60-foot radius and dim light for an additional 60 feet."],
        higher_level: ["When you cast this spell using a spell slot of 8th level or higher, the number of orbs created increases by two for each slot level above 7th."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "7": "4d12" } }
    },
    {
        index: "dream-of-the-blue-veil", name: "Dream of the Blue Veil", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "20 feet", components: ["V", "S", "M"], material: "a magic item or a willing creature from the destination world", duration: "6 hours", ritual: false, concentration: false, classes: [],
        desc: ["You and up to eight willing creatures within range fall into a magic-induced sleep and journey to another world in the Material Plane. You must have a magic item or a willing creature from that world to act as a beacon. The destination world must be on the same plane of existence as the world you are currently on. You can specify a target destination in general terms, such as the world of Oerth or the world of Toril. You and the other creatures appear in an unoccupied space within 1 mile of the beacon. If you cast this spell on a world that is not your own, you can return to your home world without a beacon."]
    },
    {
        index: "power-word-pain", name: "Power Word Pain", level: 7, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You utter a word of power that causes waves of intense pain to assail one creature you can see within range. If the target has 100 hit points or fewer, it is subject to crippling pain. Otherwise, the spell has no effect on it. While the target is affected by crippling pain, any speed it has can’t be higher than 10 feet; it has disadvantage on attack rolls, ability checks, and saving throws, other than Constitution saving throws; and finally, if the target tries to cast a spell, it must first succeed on a Constitution saving throw, or the casting fails and the spell is wasted. A target suffering this pain can make a Constitution saving throw at the end of each of its turns. On a successful save, the pain ends."],
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    {
        index: "abi-dalzims-horrid-wilting", name: "Abi-Dalzim's Horrid Wilting", level: 8, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "a bit of sponge", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You draw the moisture from every creature in a 30-foot cube centered on a point you choose within range. Each creature in that area must make a Constitution saving throw. A creature takes 12d8 necrotic damage on a failed save, or half as much damage on a successful one. Nonmagical plants and plant creatures have disadvantage on this saving throw and take maximum damage from it. A creature made of water or a liquid that is principally water (not including water-based creatures) also has disadvantage on this saving throw and takes maximum damage from it. This spell has no effect on undead or constructs."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "8": "12d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
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
    {
        index: "demiplane", name: "Demiplane", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "1 hour", ritual: false, concentration: false, classes: [],
        desc: ["You create a shadowy door on a flat solid surface that you can see within range. The door is large enough to allow Medium creatures to pass through unhindered. When opened, the door leads to a demiplane that appears to be an empty room 30 feet in each dimension, made of wood or stone. When the spell ends, the door disappears, and any creatures or objects inside the demiplane remain there until this spell is cast again to allow passage out."]
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
        index: "psychic-scream", name: "Psychic Scream", level: 9, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You unleash a psychic blast from within your mind. Up to ten creatures of your choice that you can see within range must each make an Intelligence saving throw. A creature takes 14d6 psychic damage on a failed save, or half as much damage on a successful one. A creature that fails the save is also stunned. If a target is killed by this damage, its head explodes, assuming it has one. A stunned creature can make an Intelligence saving throw at the end of each of its turns, ending the effect on itself on a success."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "9": "14d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "half" }
    },
    { 
        index: "wish", name: "Wish", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires."]
    }
];
