
import { SpellDetail } from '../../types';

export const DRUID_SPELLS: SpellDetail[] = [
    // Cantrips
    { 
        index: "druidcraft", name: "Druidcraft", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Whispering to the spirits of nature, you create one of the following effects within range:", "• You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours.", "• You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.", "• You create an instantaneous, harmless sensory effect, such as a falling leaf, a puff of wind, the sound of a small animal, or the faint odor of skunk.", "• You instantly light or snuff out a candle, a torch, or a small campfire."] 
    },
    { 
        index: "guidance", name: "Guidance", level: 0, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends."] 
    },
    { 
        index: "mending", name: "Mending", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Two lodestones.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage."] 
    },
    { 
        index: "poison-spray", name: "Poison Spray", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage."], 
        damage: { damage_type: {name:"Poison", index:"poison"}, damage_at_character_level: {"1":"1d12", "5":"2d12", "11":"3d12", "17":"4d12"} }, 
        dc: { dc_type: {name:"CON", index:"con"}, dc_success: "none" } 
    },
    { 
        index: "produce-flame", name: "Produce Flame", level: 0, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.", "You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage."],
        damage: { damage_type: {name:"Fire", index:"fire"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} } 
    },
    { 
        index: "resistance", name: "Resistance", level: 0, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A miniature cloak.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends."] 
    },
    { 
        index: "shillelagh", name: "Shillelagh", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S", "M"], material: "Mistletoe, a shamrock, or a club or quarterstaff.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon."],
        damage: { damage_type: {name:"Bludgeoning", index:"bludgeoning"}, damage_at_character_level: {"1":"1d8"} } 
    },
    { 
        index: "thorn-whip", name: "Thorn Whip", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Stem of a thorny plant.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you."],
        damage: { damage_type: {name:"Piercing", index:"piercing"}, damage_at_character_level: {"1":"1d6", "5":"2d6", "11":"3d6", "17":"4d6"} } 
    },
    {
        index: "control-flames", name: "Control Flames", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You choose nonmagical flame that you can see within range and that fits within a 5-foot cube. You affect it in one of the following ways:", "• You instantaneously expand the flame 5 feet in one direction, provided that flammable material is present in the new location.", "• You instantaneously extinguish the flames within the cube.", "• You double or halve the area of bright light and dim light shed by the flame, change its color, or both. This change lasts for 1 hour.", "• You cause simple shapes—such as the vague form of a creature, an inanimate object, or a location—to appear within the flames and animate as you like. These shapes last for 1 hour."]
    },
    {
        index: "gust", name: "Gust", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You seize the air and compel it to create one of the following effects at a point you can see within range:", "• One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you.", "• You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn’t pushed with enough force to cause damage.", "• You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze."]
    },
    {
        index: "magic-stone", name: "Magic Stone", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [],
        desc: ["You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. If thrown, it has a range of 60 feet. If someone else attacks with the pebble, that attacker adds your spellcasting ability modifier, rather than the attacker’s modifier, to the attack roll. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier. Hit or miss, the spell then ends on the stone. If you cast this spell again, the spell ends on any pebbles still affected by your previous casting."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_character_level: { "1": "1d6" } }
    },
    {
        index: "mold-earth", name: "Mold Earth", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:", "• If you target an area of loose earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away. This movement doesn’t have enough force to cause damage.", "• You cause shapes, colors, or both to appear on the dirt or stone, spelling out words, creating images, or shaping patterns. The changes last for 1 hour.", "• If the dirt or stone you target is difficult terrain, you can cause it to become normal terrain. Alternatively, you can cause normal terrain to become difficult terrain. This change lasts for 1 hour."]
    },
    {
        index: "primal-savagery", name: "Primal Savagery", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You channel primal magic to cause your teeth or fingernails to sharpen, ready to deliver a corrosive attack. Make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage. After you make the attack, your teeth or fingernails return to normal."],
        damage: { damage_type: { name: "Acid", index: "acid" }, damage_at_character_level: { "1": "1d10", "5": "2d10", "11": "3d10", "17": "4d10" } }
    },
    {
        index: "shape-water", name: "Shape Water", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You choose an area of water that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways:", "• You instantaneously move or otherwise change the flow of the water as you direct, up to 5 feet in any direction. This movement doesn’t have enough force to cause damage.", "• You cause the water to form into simple shapes and animate at your direction. This change lasts for 1 hour.", "• You change the water’s color or opacity. The water must be changed in the same way throughout. This change lasts for 1 hour.", "• You freeze the water, provided that there are no creatures in it. The water unfreezes in 1 hour."]
    },

    // Level 1
    {
        index: "absorb-elements", name: "Absorb Elements", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 reaction", range: "Self", components: ["S"], duration: "1 round", ritual: false, concentration: false, classes: [],
        desc: ["The spell captures some of the incoming energy, lessening its effect on you and storing it for your next melee attack. You have resistance to the triggering energy type until the start of your next turn. Also, the first time you hit with a melee attack on your next turn, the target takes an extra 1d6 damage of the triggering type, and the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each slot level above 1st."]
    },
    {
        index: "earth-tremor", name: "Earth Tremor", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until it is cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "1": "1d6", "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6", "6": "6d6", "7": "7d6", "8": "8d6", "9": "9d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "ice-knife", name: "Ice Knife", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["S", "M"], material: "a drop of water or piece of ice", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage."],
        damage: { damage_type: { name: "Cold", index: "cold" }, damage_at_slot_level: { "1": "2d6", "2": "3d6", "3": "4d6", "4": "5d6", "5": "6d6", "6": "7d6", "7": "8d6", "8": "9d6", "9": "10d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    {
        index: "snare", name: "Snare", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "25 feet of rope, which the spell consumes", duration: "Until dispelled or triggered", ritual: false, concentration: false, classes: [],
        desc: ["As you cast this spell, you use the rope to create a circle with a 5-foot radius on the ground or the floor. When you finish casting, the circle becomes nearly invisible and requires a successful Intelligence (Investigation) check against your spell save DC to be found. The trap triggers when a Small, Medium, or Large creature moves onto the ground or the floor in the spell’s radius. That creature must succeed on a Dexterity saving throw or be magically hoisted into the air, leaving it hanging upside down 3 feet above the ground or the floor. The creature is restrained until the spell ends."]
    },

    // Level 1
    { 
        index: "animal-friendship", name: "Animal Friendship", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A morsel of food.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st."]
    },
    { 
        index: "charm-person", name: "Charm Person", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "create-or-destroy-water", name: "Create or Destroy Water", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A drop of water if creating water; or a few grains of sand if destroying it.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You either create or destroy water. Create Water: You create up to 10 gallons of clean water within range in an open container. Destroy Water: You destroy up to 10 gallons of water in an open container within range."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st."]
    },
    { 
        index: "cure-wounds", name: "Cure Wounds", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d8", "2":"2d8", "3":"3d8", "4":"4d8", "5":"5d8"} } 
    },
    { 
        index: "detect-magic", name: "Detect Magic", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any."] 
    },
    { 
        index: "entangle", name: "Entangle", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends."],
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    { 
        index: "faerie-fire", name: "Faerie Fire", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible."] 
    },
    { 
        index: "fog-cloud", name: "Fog Cloud", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st."]
    },
    { 
        index: "goodberry", name: "Goodberry", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A sprig of mistletoe.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day. The berries lose their potency if they have not been consumed within 24 hours of the casting of this spell."] 
    },
    { 
        index: "healing-word", name: "Healing Word", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A creature of your choice that you can see within range regains a number of hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d4", "2":"2d4", "3":"3d4", "4":"4d4", "5":"5d4"} } 
    },
    { 
        index: "longstrider", name: "Longstrider", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A pinch of dirt.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The target's speed increases by 10 feet until the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "speak-with-animals", name: "Speak with Animals", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "10 minutes", ritual: true, concentration: false, classes: [], 
        desc: ["You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day."] 
    },
    { 
        index: "thunderwave", name: "Thunderwave", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (15-foot cube)", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "1": "2d8", "2": "3d8", "3": "4d8", "4": "5d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { index: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead."] },

    // Level 2
    { 
        index: "animal-messenger", name: "Animal Messenger", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A morsel of food.", duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["Choose a Tiny beast you can see within range. You specify a location and a recipient. The beast travels to the location and mimics your voice to deliver a message."] 
    },
    { 
        index: "barkskin", name: "Barkskin", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A handful of oak bark.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing."] 
    },
    { 
        index: "beast-sense", name: "Beast Sense", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["S"], duration: "Concentration, up to 1 hour", ritual: true, concentration: true, classes: [], 
        desc: ["You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses."] 
    },
    { 
        index: "enhance-ability", name: "Enhance Ability", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Fur or a feather from a beast.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature and bestow upon it a magical enhancement. Choose one: Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, or Owl's Wisdom."] 
    },
    { 
        index: "flaming-sphere", name: "Flaming Sphere", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A bit of tallow, a pinch of brimstone, and a dusting of powdered iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A 5-foot-diameter sphere of fire appears in an unoccupied space of your choice within range and lasts for the duration. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw. The creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6" } }
    },
    { 
        index: "gust-of-wind", name: "Gust of Wind", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot line)", components: ["V", "S", "M"], material: "A legume seed.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line."] 
    },
    { 
        index: "heat-metal", name: "Heat Metal", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A piece of iron and a flame.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "2": "2d8", "3": "3d8", "4": "4d8", "5": "5d8" } }
    },
    { 
        index: "hold-person", name: "Hold Person", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."] 
    },
    { 
        index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."] 
    },
    { 
        index: "moonbeam", name: "Moonbeam", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "Several seeds of any moonseed plant and a piece of opalescent feldspar.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A 5-foot-radius, 40-foot-high cylinder of pale light falls into range. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spell's light."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "2": "2d10", "3": "3d10", "4": "4d10", "5": "5d10" } }
    },
    { 
        index: "pass-without-trace", name: "Pass Without Trace", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Ashes from a burned leaf of mistletoe and a sprig of spruce.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage."] 
    },
    {
        index: "healing-spirit", name: "Healing Spirit", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You call forth a nature spirit to soothe the wounded. The spirit occupies a 5-foot cube within range. Until the spell ends, whenever you or a creature you can see moves into the spirit’s space for the first time on a turn or starts its turn there, you can cause the spirit to restore 1d6 hit points to that creature (no action required). The spirit can’t heal constructs or undead. The spirit can heal a number of times equal to 1 + your spellcasting ability modifier (minimum of twice). After it heals that many times, the spirit disappears."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d6 for each slot level above 2nd."]
    },
    {
        index: "dust-devil", name: "Dust Devil", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a pinch of dust", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["Choose an unoccupied 5-foot cube of air that you can see within range. An elemental force that resembles a dust devil appears in the cube and lasts for the spell’s duration. Any creature that ends its turn within 5 feet of the dust devil must make a Strength saving throw. On a failed save, the creature takes 1d8 bludgeoning damage and is pushed 10 feet away. On a successful save, the creature takes half as much damage and isn’t pushed."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "2": "1d8" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "half" }
    },
    { 
        index: "spike-growth", name: "Spike Growth", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "Seven sharp thorns or seven small twigs, each sharpened to a point.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels."] 
    },
    { index: "augury", name: "Augury", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "Specially marked sticks, bones, or similar tokens worth at least 25 gp.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], desc: ["You receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes."] },
    { index: "continual-flame", name: "Continual Flame", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "50 gp worth of ruby dust, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], desc: ["A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't consume oxygen."] },
    { index: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A pinch of powdered iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["You cause a creature or an object you can see within range to grow larger or smaller for the duration."], dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" } },
    { index: "summon-beast", name: "Summon Beast", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A feather, tuft of fur, and fish tail inside a gilded acorn worth at least 200 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["You call forth a bestial spirit to fight for you."] },

    // Level 3
    {
        index: "erupting-earth", name: "Erupting Earth", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "a piece of obsidian", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "3": "3d12", "4": "4d12", "5": "5d12", "6": "6d12", "7": "7d12", "8": "8d12", "9": "9d12" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    {
        index: "tidal-wave", name: "Tidal Wave", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "a drop of water", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You conjure up a large wave of water that crashes down on an area within range. The area can be up to 30 feet long, up to 10 feet wide, and up to 10 feet tall. Each creature in that area must make a Dexterity saving throw. On a failed save, a creature takes 4d8 bludgeoning damage and is knocked prone. On a successful save, a creature takes half as much damage and isn’t knocked prone. The water then spreads out as it extinguishes unprotected flames in its area and within 30 feet of it, and then it vanishes."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "3": "4d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },

    // Level 3
    { 
        index: "call-lightning", name: "Call Lightning", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A storm cloud appears in the shape of a cylinder that is 10 feet tall and has a 60-foot radius. When you cast the spell, choose a point you can see under the cloud. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d10 for each slot level above 3rd."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "3": "3d10", "4": "4d10", "5": "5d10", "6": "6d10" } }
    },
    { 
        index: "conjure-animals", name: "Conjure Animals", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower; Two beasts of challenge rating 1 or lower; Four beasts of challenge rating 1/2 or lower; or Eight beasts of challenge rating 1/4 or lower."],
        higher_level: ["When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot."]
    },
    { 
        index: "daylight", name: "Daylight", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet."] 
    },
    { 
        index: "dispel-magic", name: "Dispel Magic", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends."] 
    },
    { 
        index: "meld-into-stone", name: "Meld into Stone", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "8 hours", ritual: true, concentration: false, classes: [], 
        desc: ["You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration."] 
    },
    { 
        index: "plant-growth", name: "Plant Growth", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits (overgrowth hinders movement or enriches land)."] 
    },
    { 
        index: "protection-from-energy", name: "Protection from Energy", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder."] 
    },
    { 
        index: "sleet-storm", name: "Sleet Storm", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A pinch of dust and a few drops of water.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone."] 
    },
    { 
        index: "speak-with-plants", name: "Speak with Plants", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands."] 
    },
    { 
        index: "water-breathing", name: "Water Breathing", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A short reed or piece of straw.", duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends."] 
    },
    { 
        index: "water-walk", name: "Water Walk", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A piece of cork.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground."] 
    },
    { index: "revivify", name: "Revivify", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamonds worth 300 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["You touch a creature that has died within the last minute. That creature returns to life with 1 hit point."] },
    { index: "summon-fey", name: "Summon Fey", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A gilded flower worth at least 300 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["You call forth a fey spirit to fight for you."] },
    { 
        index: "wind-wall", name: "Wind Wall", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A tiny fan and a feather of exotic origin.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A wall of strong wind rises from the ground at a point you choose within range. The strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can't pass through the wall. Loose, lightweight materials brought into the wall fly upward. Arrows, bolts, and other ordinary projectiles launched at targets behind the wall are deflected upward and automatically miss."] 
    },

    // Level 4
    { 
        index: "blight", name: "Blight", level: 4, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw. The target takes 8d8 necrotic damage on a failed save, or half as much damage on a successful one. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "4": "8d8", "5": "9d8", "6": "10d8", "7": "11d8", "8": "12d8", "9": "13d8" } }
    },
    { 
        index: "confusion", name: "Confusion", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "Three nut shells.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell assaults and twists creatures' minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot-radius sphere centered on a point you choose within range must succeed on a Wisdom saving throw when you cast this spell or be affected by it."] 
    },
    { 
        index: "conjure-minor-elementals", name: "Conjure Minor Elementals", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon elementals that appear in unoccupied spaces that you can see within range. You choose one of the following options for what appears: One elemental of challenge rating 2 or lower; Two elementals of challenge rating 1 or lower; Four elementals of challenge rating 1/2 or lower; or Eight elementals of challenge rating 1/4 or lower."] 
    },
    { 
        index: "conjure-woodland-beings", name: "Conjure Woodland Beings", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "One holly berry per creature summoned.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon fey creatures that appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One fey creature of challenge rating 2 or lower; Two fey creatures of challenge rating 1 or lower; Four fey creatures of challenge rating 1/2 or lower; or Eight fey creatures of challenge rating 1/4 or lower."] 
    },
    { 
        index: "control-water", name: "Control Water", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A drop of water and a pinch of dust.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects: Flood, Part Water, Redirect Flow, or Whirlpool."] 
    },
    { 
        index: "dominate-beast", name: "Dominate Beast", level: 4, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence."] 
    },
    { 
        index: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A leather strap, bound around the arm or a similar appendage.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained."] 
    },
    { 
        index: "giant-insect", name: "Giant Insect", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into giant versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion."] 
    },
    { 
        index: "grasping-vine", name: "Grasping Vine", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a vine that sprouts from the ground in an unoccupied space of your choice that you can see within range. When you cast the spell, you can direct the vine to lash out at a creature within 30 feet of it that you can see. That creature must succeed on a Dexterity saving throw or be pulled 20 feet directly toward the vine."] 
    },
    { 
        index: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "300 feet", components: ["V", "S", "M"], material: "A stone, a twig, and a bit of green plant.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain."] 
    },
    { 
        index: "ice-storm", name: "Ice Storm", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A pinch of dust and a few drops of water.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Cold/Bludgeoning", index: "cold" }, damage_at_slot_level: { "4": "2d8+4d6", "5": "2d8+5d6", "6": "2d8+6d6" } }
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A bit of fur from a bloodhound.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."] 
    },
    { 
        index: "polymorph", name: "Polymorph", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A caterpillar cocoon.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points."] 
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
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "4": "5d8", "5": "6d8", "6": "7d8" } }
    },
    { index: "divination", name: "Divination", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Incense and a sacrificial offering worth at least 25 gp, which the spell consumes.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], desc: ["Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days."] },
    { index: "fire-shield", name: "Fire Shield", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A bit of phosphorus or a firefly.", duration: "10 minutes", ritual: false, concentration: false, classes: [], desc: ["Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can choose a warm shield or a cold shield."] },
    { index: "summon-elemental", name: "Summon Elemental", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A crystal vial filled with air, earth, fire, or water worth at least 400 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["You call forth an elemental spirit to fight for you."] },
    {
        index: "guardian-of-nature", name: "Guardian of Nature", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A primal spirit animates you. Until the spell ends, you gain one of the following benefits of your choice: Primal Beast or Great Tree."]
    },
    {
        index: "watery-sphere", name: "Watery Sphere", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "a droplet of water", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You conjure up a sphere of water with a 10-foot radius on a point you can see within range. The sphere can hover but no more than 10 feet off the ground. The sphere remains for the spell’s duration. Any creature in the sphere’s space must make a Strength saving throw. On a successful save, a creature is ejected from that space to the nearest unoccupied space of the creature’s choice outside the sphere. A Huge or larger creature succeeds on the saving throw automatically, and a Large or smaller creature can choose to fail it. On a failed save, a creature is restrained by the sphere and is engulfed by the water. At the end of each of its turns, a restrained target can repeat the saving throw, ending the effect on itself on a success."]
    },
    {
        index: "maelstrom", name: "Maelstrom", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "five paper birds", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["A swirling mass of 5-foot-deep water appears in a 30-foot radius centered on a point you can see within range. The point must be on the ground or in a body of water. Until the spell ends, that area is difficult terrain, and any creature that starts its turn there must succeed on a Strength saving throw or take 6d6 bludgeoning damage and be pulled 10 feet toward the center."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "5": "6d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    {
        index: "wrath-of-nature", name: "Wrath of Nature", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You call out to the spirits of nature to rouse them against your enemies. Choose a point you can see on the ground within range. A 60-foot cube of nature’s fury lashes out from that point for the duration. The area is difficult terrain for your enemies. At the start of each of your turns, you can cause the following effects: Grass and Undergrowth, Trees, Rocks, or Roots and Vines."]
    },
    {
        index: "transmute-rock", name: "Transmute Rock", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "clay and water", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You choose an area of stone or mud that you can see within range and that fits within a 40-foot cube. You can transmute stone to mud, or mud to stone."]
    },
    {
        index: "control-winds", name: "Control Winds", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You take control of the air in a 100-foot cube that you can see within range. Choose one of the following effects for the duration: Gusts, Downdraft, or Updraft."]
    },

    // Level 5
    { 
        index: "antilife-shell", name: "Antilife Shell", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A shimmering field appears and surrounds you in a 10-foot radius. The area within this barrier excludes all other creatures except for those you designate. You can specify a creature type or a specific creature. The barrier repels the creatures you designate."] 
    },
    { 
        index: "awaken", name: "Awaken", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "8 hours", range: "Touch", components: ["V", "S", "M"], material: "An agate worth at least 1,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["After spending the casting time tracing magical pathways within a precious gemstone, you touch a Huge or smaller beast or plant. The target must have either no Intelligence score or an Intelligence of 3 or less. The target gains an Intelligence of 10. The target also gains the ability to speak one language you know."] 
    },
    { 
        index: "commune-with-nature", name: "Commune with Nature", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet."] 
    },
    { 
        index: "conjure-elemental", name: "Conjure Elemental", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S", "M"], material: "Burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it."] 
    },
    { 
        index: "contagion", name: "Contagion", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "7 days", ritual: false, concentration: false, classes: [], 
        desc: ["Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, you afflict the creature with a disease of your choice from any of the ones described below."] 
    },
    { 
        index: "geas", name: "Geas", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 minute", range: "60 feet", components: ["V"], duration: "30 days", ritual: false, concentration: false, classes: [], 
        desc: ["You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration."] 
    },
    { 
        index: "greater-restoration", name: "Greater Restoration", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust worth at least 100 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target: Charm/Petrify, Curse, Ability Reduction, HP Max Reduction."] 
    },
    { 
        index: "insect-plague", name: "Insect Plague", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A few grains of sugar, some kernels of grain, and a smear of fat.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "5": "4d10", "6": "5d10", "7": "6d10" } }
    },
    { 
        index: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "5": "3d8", "6": "4d8", "7": "5d8", "8": "6d8", "9": "7d8" } }
    },
    { 
        index: "planar-binding", name: "Planar Binding", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "A jewel worth at least 1,000 gp, which the spell consumes.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration."] 
    },
    { 
        index: "reincarnate", name: "Reincarnate", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "Rare oils and unguents worth at least 1,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a dead humanoid or a piece of a dead humanoid. Provided that the creature has been dead no longer than 10 days, the spell forms a new adult body for it and then calls the soul to enter that body. If the target's soul isn't free or willing to do so, the spell fails. The magic fashions a new body for the creature to inhabit, which likely causes the creature's race to change."] 
    },
    { 
        index: "scrying", name: "Scrying", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "A focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it."] 
    },
    { 
        index: "tree-stride", name: "Tree Stride", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree."] 
    },
    { index: "cone-of-cold", name: "Cone of Cold", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot cone)", components: ["V", "S", "M"], material: "A small crystal or glass cone.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["A blast of cold air emits from your hands. Each creature in a 60-foot cone must make a Con save or take 8d8 cold damage."], damage: { damage_type: {name:"Cold", index:"cold"}, damage_at_slot_level: {"5":"8d8"} }, dc: { dc_type: {name:"CON", index:"con"}, dc_success: "half" } },
    { 
        index: "wall-of-stone", name: "Wall of Stone", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A small block of granite.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with at least one other panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick."] 
    },

    // Level 6
    { 
        index: "conjure-fey", name: "Conjure Fey", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon a fey creature of challenge rating 6 or lower, or a fey spirit that takes the form of a beast of challenge rating 6 or lower. It appears in an unoccupied space that you can see within range. The fey creature disappears when it drops to 0 hit points or when the spell ends."] 
    },
    { 
        index: "find-the-path", name: "Find the Path", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "A set of divinatory tools.", duration: "Concentration, up to 1 day", ritual: false, concentration: true, classes: [], 
        desc: ["This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence."] 
    },
    { 
        index: "heal", name: "Heal", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. This spell also ends blindness, deafness, and any diseases affecting the target. This spell has no effect on constructs or undead."],
        higher_level: ["When you cast this spell using a spell slot of 7th level or higher, the amount of healing increases by 10 for each slot level above 6th."]
    },
    { 
        index: "heroes-feast", name: "Heroes' Feast", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "30 feet", components: ["V", "S", "M"], material: "A gem-encrusted bowl worth at least 1,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't set in until this hour is over. Up to twelve other creatures can partake of the feast. A creature that partakes of the feast gains several benefits. The creature is cured of all diseases and poison, becomes immune to poison and being frightened, and makes all Wisdom saving throws with advantage. Its hit point maximum also increases by 2d10, and it gains the same number of hit points. These benefits last for 24 hours."] 
    },
    { 
        index: "move-earth", name: "Move Earth", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "An iron blade and a small bag containing a mixture of soils.", duration: "Concentration, up to 2 hours", ritual: false, concentration: false, classes: [], 
        desc: ["Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration. You can raise or lower the area's elevation, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can't exceed half the area's largest dimension. So, if you affect a 40-foot square, you can create a pillar up to 20 feet high, raise or lower the square's elevation by up to 20 feet, dig a trench up to 20 feet deep, and so on."] 
    },
    { 
        index: "sunbeam", name: "Sunbeam", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot line)", components: ["V", "S", "M"], material: "A magnifying glass.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "6": "6d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "transport-via-plants", name: "Transport via Plants", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before. For the duration, any creature can step into the target plant and exit from the destination plant by using 5 feet of movement."] 
    },
    { 
        index: "wall-of-thorns", name: "Wall of Thorns", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "A handful of thorns.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight. When a creature enters the wall's area for the first time on a turn or starts its turn there, the creature must make a Dexterity saving throw. On a failed save, the creature takes 7d8 piercing damage, or half as much damage on a successful save."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "6": "7d8", "7": "8d8", "8": "9d8", "9": "10d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { index: "summon-draconic-spirit", name: "Summon Draconic Spirit", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "An object with the image of a dragon engraved on it, worth at least 500 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["You call forth a draconic spirit to fight for you."] },
    { 
        index: "wind-walk", name: "Wind Walk", level: 6, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "Fire and holy water.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to ten willing creatures you can see within range assume a gaseous form for the duration, appearing as wisps of cloud. While in this cloud form, a creature has a flying speed of 300 feet and has resistance to damage from nonmagical weapons. The only actions a creature can take in this form are the Dash action or to revert to its normal form."] 
    },

    // Level 7
    { 
        index: "fire-storm", name: "Fire Storm", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot cubes, which you can arrange as you wish. Each cube must have at least one face adjacent to the face of another cube. Each creature in the area must make a Dexterity saving throw. It takes 7d10 fire damage on a failed save, or half as much damage on a successful one."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "7": "7d10" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "mirage-arcane", name: "Mirage Arcane", level: 7, school: { name: "Illusion", index: "illusion" }, casting_time: "10 minutes", range: "Sight", components: ["V", "S"], duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same, however."] 
    },
    { 
        index: "plane-shift", name: "Plane Shift", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A forked, metal rod worth at least 250 gp, tailored to a specific plane of existence.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second layer of the Nine Hells, and you appear in or near that destination."] 
    },
    { 
        index: "regenerate", name: "Regenerate", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A prayer wheel and holy water.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points per minute). The target's severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "7": "4d8" } } 
    },
    { 
        index: "reverse-gravity", name: "Reverse Gravity", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "100 feet", components: ["V", "S", "M"], material: "A lodestone and iron filings.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell reverses gravity in a 50-foot-radius, 100-foot-high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall."] 
    },
    { index: "symbol", name: "Symbol", level: 7, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Mercury, phosphorus, and powdered diamond and opal worth at least 1,000 gp, which the spell consumes.", duration: "Until dispelled or triggered", ritual: false, concentration: false, classes: [], desc: ["You scribe a harmful glyph either on a surface or within an object that can be closed to conceal the glyph. If you choose a surface, the glyph can cover an area of the surface no larger than 10 feet in diameter."] },

    // Level 8
    { 
        index: "animal-shapes", name: "Animal Shapes", level: 8, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 24 hours", ritual: false, concentration: true, classes: [], 
        desc: ["Your magic turns others into beasts. Choose any number of willing creatures that you can see within range. You transform each target into the form of a Large or smaller beast with a challenge rating of 4 or lower."] 
    },
    { 
        index: "antipathy-sympathy", name: "Antipathy/Sympathy", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "A lump of alum soaked in vinegar for the antipathy effect or a drop of honey for the sympathy effect.", duration: "10 days", ritual: false, concentration: false, classes: [], 
        desc: ["This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or a creature or an area that is no larger than a 200-foot cube. Then specify a kind of intelligent creature, such as red dragons, goblins, or vampires. You invest the target with an aura that either attracts or repels the specified creatures for the duration."] 
    },
    { 
        index: "control-weather", name: "Control Weather", level: 8, school: { name: "Transmutation", index: "transmutation" }, casting_time: "10 minutes", range: "Self (5-mile radius)", components: ["V", "S", "M"], material: "Burning incense and bits of earth and wood mixed in water.", duration: "Concentration, up to 8 hours", ritual: false, concentration: true, classes: [], 
        desc: ["You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell. Moving to a place where you don't have a clear path to the sky ends the spell early."] 
    },
    { 
        index: "earthquake", name: "Earthquake", level: 8, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "500 feet", components: ["V", "S", "M"], material: "A pinch of dirt, a piece of rock, and a lump of clay.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point and shakes creatures and structures in contact with the ground in that area."] 
    },
    { 
        index: "feeblemind", name: "Feeblemind", level: 8, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "A handful of clay, crystal, glass, or mineral spheres.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You blast the mind of a creature that you can see within range, attempting to shatter its intellect and personality. The target takes 4d6 psychic damage and must make an Intelligence saving throw. On a failed save, the creature's Intelligence and Charisma scores become 1. The creature can't cast spells, activate magic items, understand language, or communicate in any intelligible way."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "8": "4d6" } },
        dc: { dc_type: { name: "INT", index: "int" }, dc_success: "none" }
    },
    { 
        index: "sunburst", name: "Sunburst", level: 8, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "Fire and a piece of sunstone.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 12d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "8": "12d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "tsunami", name: "Tsunami", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "Sight", components: ["V", "S"], duration: "Concentration, up to 6 rounds", ritual: false, concentration: true, classes: [], 
        desc: ["A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration. When the wall appears, each creature within its area must make a Strength saving throw. On a failed save, a creature takes 6d10 bludgeoning damage, or half as much damage on a successful save."],
        damage: { damage_type: { name: "Bludgeoning", index: "bludgeoning" }, damage_at_slot_level: { "8": "6d10" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "half" }
    },
    { index: "incendiary-cloud", name: "Incendiary Cloud", level: 8, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius sphere centered on a point within range. The cloud spreads around corners and is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it."] },

    // Level 9
    { 
        index: "foresight", name: "Foresight", level: 9, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A hummingbird feather.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration."] 
    },
    { 
        index: "shapechange", name: "Shapechange", level: 9, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A jade circlet worth at least 1,500 gp, which you must place on your head before you cast the spell.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You assume the form of a different creature for the duration. The new form can be of any creature with a challenge rating equal to your level or lower. The creature can't be a construct or an undead, and you must have seen the sort of creature at least once."] 
    },
    { 
        index: "storm-of-vengeance", name: "Storm of Vengeance", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Sight", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A churning storm cloud forms, centered on a point you can see and spreading to a radius of 360 feet. Each creature under the cloud must make a Constitution saving throw. On a failed save, a creature takes 2d6 thunder damage and becomes deafened for 5 minutes. Each round you maintain concentration on this spell, the storm produces different effects on your turn."] 
    },
    { 
        index: "true-resurrection", name: "True Resurrection", level: 9, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A sprinkle of holy water and diamonds worth at least 25,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. If the creature's soul is free and willing, the creature is restored to life with all its hit points."] 
    },
    { index: "mass-resurrection", name: "Mass Resurrection", level: 9, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "Diamonds worth at least 5,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. If the creature's soul is free and willing, the creature is restored to life with all its hit points."] }
];
