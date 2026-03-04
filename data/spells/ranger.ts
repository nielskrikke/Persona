
import { SpellDetail } from '../../types';

export const RANGER_SPELLS: SpellDetail[] = [
    // Level 1
    { 
        index: "alarm", name: "Alarm", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "30 feet", components: ["V", "S", "M"], material: "Silver bell.", duration: "8 hours", ritual: true, concentration: false, classes: [], 
        desc: ["You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible."]
    },
    { 
        index: "animal-friendship", name: "Animal Friendship", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Food.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "cure-wounds", name: "Cure Wounds", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "1": "1d8", "2": "2d8", "3": "3d8", "4": "4d8", "5": "5d8" } }
    },
    { 
        index: "detect-magic", name: "Detect Magic", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any."]
    },
    { 
        index: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Yew leaf.", duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case."]
    },
    { 
        index: "ensnaring-strike", name: "Ensnaring Strike", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away. While restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "1": "1d6", "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    { 
        index: "fog-cloud", name: "Fog Cloud", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st."]
    },
    { 
        index: "goodberry", name: "Goodberry", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Mistletoe.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day."]
    },
    { 
        index: "hail-of-thorns", name: "Hail of Thorns", level: 1, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st (to a maximum of 6d10)."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "1": "1d10", "2": "2d10", "3": "3d10", "4": "4d10", "5": "5d10" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "hunters-mark", name: "Hunter's Mark", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 bonus action", range: "90 feet", components: ["V"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it."],
        higher_level: ["When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours."],
        damage: { damage_type: { name: "Weapon", index: "weapon" }, damage_at_slot_level: { "1": "1d6" } }
    },
    { 
        index: "jump", name: "Jump", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Grasshopper leg.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The creature's jump distance is tripled until the spell ends."]
    },
    { 
        index: "longstrider", name: "Longstrider", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Dirt.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. The target's speed increases by 10 feet until the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "speak-with-animals", name: "Speak with Animals", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "10 minutes", ritual: true, concentration: false, classes: [], 
        desc: ["You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day."]
    },

    // Level 2
    { 
        index: "animal-messenger", name: "Animal Messenger", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Food.", duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["Choose a Tiny beast you can see within range. You specify a location and a recipient. The beast travels to the location and mimics your voice to deliver a message."],
        higher_level: ["If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd."]
    },
    { 
        index: "barkskin", name: "Barkskin", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Oak bark.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing."]
    },
    { 
        index: "beast-sense", name: "Beast Sense", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["S"], duration: "Concentration, up to 1 hour", ritual: true, concentration: true, classes: [], 
        desc: ["You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses."]
    },
    { 
        index: "cordon-of-arrows", name: "Cordon of Arrows", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "5 feet", components: ["V", "S", "M"], material: "Four arrows.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You plant four pieces of nonmagical ammunition in the ground within range and lay magic upon them to protect an area. Whenever a creature other than you comes within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 1d6 piercing damage. The piece of ammunition is then destroyed."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the amount of ammunition that can be affected increases by two for each slot level above 2nd."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "2": "1d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "darkvision", name: "Darkvision", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Carrot.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet."]
    },
    { 
        index: "find-traps", name: "Find Traps", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You sense the presence of any trap within range that is within line of sight. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator."]
    },
    { 
        index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."]
    },
    { 
        index: "locate-animals-or-plants", name: "Locate Animals or Plants", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Fur.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present."]
    },
    { 
        index: "locate-object", name: "Locate Object", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Forked twig.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement."]
    },
    { 
        index: "pass-without-trace", name: "Pass Without Trace", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Ashes.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means."]
    },
    { 
        index: "protection-from-poison", name: "Protection from Poison", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage."]
    },
    { 
        index: "silence", name: "Silence", level: 2, school: { name: "Illusion", index: "illusion" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there."]
    },
    { 
        index: "spike-growth", name: "Spike Growth", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "Thorns.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "2": "2d4" } }
    },

    // Level 3
    { 
        index: "conjure-animals", name: "Conjure Animals", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon fey spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower; Two beasts of challenge rating 1 or lower; Four beasts of challenge rating 1/2 or lower; or Eight beasts of challenge rating 1/4 or lower."],
        higher_level: ["When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot."]
    },
    { 
        index: "conjure-barrage", name: "Conjure Barrage", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self (60-foot cone)", components: ["V", "S", "M"], material: "One piece of ammunition or a thrown weapon.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You throw a nonmagical weapon or fire a piece of nonmagical ammunition into the air to create a cone of identical weapons that shoot forward and then disappear. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. A creature takes 3d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the weapon or ammunition used to cast the spell."],
        damage: { damage_type: { name: "Weapon", index: "weapon" }, damage_at_slot_level: { "3": "3d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "daylight", name: "Daylight", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["A 60-foot-radius sphere of light spreads out from a point you choose within range. The sphere is bright light and sheds dim light for an additional 60 feet. If any of this spell's area overlaps with an area of darkness created by a spell of 3rd level or lower, the spell that created the darkness is dispelled."]
    },
    { 
        index: "lightning-arrow", name: "Lightning Arrow", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you make a ranged weapon attack during the spell's duration, the weapon's ammunition, or the weapon itself if it's a thrown weapon, transforms into a bolt of lightning. Make the attack roll as normal. The target takes 4d8 lightning damage on a hit, or half as much damage on a miss, instead of the weapon's normal damage. Whether you hit or miss, each creature within 10 feet of the target must make a Dexterity saving throw. Each of these creatures takes 2d8 lightning damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage for both effects of the spell increases by 1d8 for each slot level above 3rd."],
        damage: { damage_type: { name: "Lightning", index: "lightning" }, damage_at_slot_level: { "3": "4d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "nondetection", name: "Nondetection", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension. The target can't be targeted by any divination magic or perceived through magical scrying sensors."]
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
        index: "speak-with-plants", name: "Speak with Plants", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances."]
    },
    { 
        index: "water-breathing", name: "Water Breathing", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Straw.", duration: "24 hours", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration."]
    },
    { 
        index: "water-walk", name: "Water Walk", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Cork.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration."]
    },
    { 
        index: "wind-wall", name: "Wind Wall", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S", "M"], material: "Tiny fan.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose so long as it makes one continuous path along the ground. The strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can't pass through the wall."]
    },

    // Level 4
    { 
        index: "conjure-woodland-beings", name: "Conjure Woodland Beings", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "Holly berries.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon fey creatures that appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One fey creature of challenge rating 2 or lower; Two fey creatures of challenge rating 1 or lower; Four fey creatures of challenge rating 1/2 or lower; or Eight fey creatures of challenge rating 1/4 or lower."],
        higher_level: ["When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 6th-level slot and three times as many with an 8th-level slot."]
    },
    { 
        index: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Leather strap.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained."]
    },
    { 
        index: "grasping-vine", name: "Grasping Vine", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 bonus action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a vine that sprouts from the ground in an unoccupied space of your choice that you can see within range. When you cast the spell, you can direct the vine to lash out at a creature within 30 feet of it that you can see. That creature must succeed on a Dexterity saving throw or be pulled 20 feet directly toward the vine."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Bloodhound fur.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."]
    },
    { 
        index: "stoneskin", name: "Stoneskin", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust worth 100gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage."]
    },

    // Level 5
    { 
        index: "commune-with-nature", name: "Commune with Nature", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet."]
    },
    { 
        index: "conjure-volley", name: "Conjure Volley", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "150 feet", components: ["V", "S", "M"], material: "One piece of ammunition or a thrown weapon.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You fire a piece of nonmagical ammunition or throw a nonmagical weapon into the air and choose a point within range. Hundreds of duplicates of the ammunition or weapon fall in a volley from above and then disappear. Each creature in a 40-foot-radius, 20-foot-high cylinder centered on that point must make a Dexterity saving throw. A creature takes 8d8 damage on a failed save, or half as much damage on a successful one. The damage type is the same as that of the ammunition or weapon."],
        damage: { damage_type: { name: "Weapon", index: "weapon" }, damage_at_slot_level: { "5": "8d8" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "swift-quiver", name: "Swift Quiver", level: 5, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S", "M"], material: "A quiver containing at least one piece of ammunition.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You transmute your quiver so it produces an endless supply of nonmagical ammunition, which seems to leap into your hand when you reach for it. On each of your turns until the spell ends, you can use a bonus action to make two attacks with a weapon that uses ammunition from the quiver. Each time you make such a ranged attack, your quiver magically replaces the piece of ammunition you used with a similar piece of nonmagical ammunition. Any pieces of ammunition created by this spell disintegrate when the spell ends. If the quiver leaves your possession, the spell ends."],
        damage: { damage_type: { name: "Weapon", index: "weapon" }, damage_at_slot_level: { "5": "0" } } // Attacks deal normal weapon damage
    },
    { 
        index: "tree-stride", name: "Tree Stride", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree."]
    }
];
