
import { SpellDetail } from '../../types';

export const PALADIN_SPELLS: SpellDetail[] = [
    // Level 1
    { 
        index: "bless", name: "Bless", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A sprinkling of holy water.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    {
        index: "ceremony", name: "Ceremony", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "25 gp worth of powdered silver, which the spell consumes", duration: "Instantaneous", ritual: true, concentration: false, classes: [],
        desc: ["You perform a special religious ceremony that is infused with magic. When you cast the spell, choose one of the following rites, the target of which must be within 10 feet of you throughout the casting: Atonement, Bless Water, Coming of Age, Dedication, Funeral Rite, Wedding."]
    },
    { 
        index: "command", name: "Command", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.", "Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.", "Approach, Drop, Flee, Grovel, Halt."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "compelled-duel", name: "Compelled Duel", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 bonus action", range: "30 feet", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to compel a creature into a duel. One creature that you can see within range must make a Wisdom saving throw. On a failed save, the creature is drawn to you, compelled by your divine demand. For the duration, it has disadvantage on attack rolls against creatures other than you, and must make a Wisdom saving throw each time it attempts to move to a space that is more than 30 feet away from you; if it succeeds on this save, this spell doesn't restrict the target's movement for that turn."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "cure-wounds", name: "Cure Wounds", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "1": "1d8", "2": "2d8", "3": "3d8", "4": "4d8", "5": "5d8" } }
    },
    { 
        index: "detect-evil-and-good", name: "Detect Evil and Good", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated."]
    },
    { 
        index: "detect-magic", name: "Detect Magic", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any."]
    },
    { 
        index: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A yew leaf.", duration: "Concentration, up to 10 minutes", ritual: true, concentration: true, classes: [], 
        desc: ["For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case."]
    },
    { 
        index: "divine-favor", name: "Divine Favor", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "1": "1d4" } }
    },
    { 
        index: "heroism", name: "Heroism", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of each of its turns. When the spell ends, the target loses any remaining temporary hit points from this spell."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect."]
    },
    { 
        index: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease."]
    },
    { 
        index: "searing-smite", name: "Searing Smite", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage and ignites the target. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: { name: "Fire", index: "fire" }, damage_at_slot_level: { "1": "1d6", "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "shield-of-faith", name: "Shield of Faith", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 bonus action", range: "60 feet", components: ["V", "S", "M"], material: "A small parchment with a bit of holy text written on it.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration."]
    },
    { 
        index: "thunderous-smite", name: "Thunderous Smite", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The first time you hit with a melee weapon attack during this spell's duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone."],
        damage: { damage_type: { name: "Thunder", index: "thunder" }, damage_at_slot_level: { "1": "2d6" } },
        dc: { dc_type: { name: "STR", index: "str" }, dc_success: "none" }
    },
    { 
        index: "wrathful-smite", name: "Wrathful Smite", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit with a melee weapon attack during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "1": "1d6" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },

    // Level 2
    { 
        index: "aid", name: "Aid", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A tiny strip of white cloth.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd."]
    },
    { 
        index: "branding-smite", name: "Branding Smite", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a weapon attack before this spell ends, the weapon gleams with astral radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it's invisible, and the target sheds dim light in a 5-foot radius and can't become invisible until the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "2": "2d6", "3": "3d6", "4": "4d6", "5": "5d6" } }
    },
    { 
        index: "find-steed", name: "Find Steed", level: 2, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You summon a spirit that assumes the form of an unusually intelligent, strong, and loyal steed, creating a long-lasting bond with it. Appearing in an unoccupied space within range, the steed takes on a form that you choose, such as a warhorse, a pony, a camel, an elk, or a mastiff."]
    },
    { 
        index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."]
    },
    { 
        index: "locate-object", name: "Locate Object", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A forked twig.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement."]
    },
    { 
        index: "magic-weapon", name: "Magic Weapon", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3."]
    },
    { 
        index: "protection-from-poison", name: "Protection from Poison", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random. For the duration, the target has advantage on saving throws against being poisoned, and it has resistance to poison damage."]
    },
    { 
        index: "zone-of-truth", name: "Zone of Truth", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },

    // Level 3
    { 
        index: "aura-of-vitality", name: "Aura of Vitality", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Healing energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. You can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "3": "2d6" } }
    },
    { 
        index: "blinding-smite", name: "Blinding Smite", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a melee weapon attack during this spell's duration, your weapon flares with bright light, and the attack deals an extra 3d8 radiant damage. Additionally, the target must succeed on a Constitution saving throw or be blinded until the spell ends."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "3": "3d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },
    { 
        index: "create-food-and-water", name: "Create Food and Water", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "Pinch of salt and sugar.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn't go bad."]
    },
    { 
        index: "crusaders-mantle", name: "Crusader's Mantle", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures. Until the spell ends, the aura moves with you, centered on you. While in the aura, you and each nonhostile creature in the aura deal an extra 1d4 radiant damage when it hits with a weapon attack."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "3": "1d4" } }
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
        index: "elemental-weapon", name: "Elemental Weapon", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: acid, cold, fire, lightning, or thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits."],
        higher_level: ["When you cast this spell using a spell slot of 5th or 6th level, the bonus to attack rolls increases to +2 and the extra damage increases to 2d4. When you use a spell slot of 7th level or higher, the bonus increases to +3 and the extra damage increases to 3d4."],
        damage: { damage_type: { name: "Variable", index: "variable" }, damage_at_slot_level: { "3": "1d4", "5": "2d4", "7": "3d4" } }
    },
    { 
        index: "magic-circle", name: "Magic Circle", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "Holy water.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface. Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways: The creature can't willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw. The creature has disadvantage on attack rolls against targets within the cylinder. Targets within the cylinder can't be charmed, frightened, or possessed by the creature."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd."]
    },
    { 
        index: "remove-curse", name: "Remove Curse", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object so it can be removed or discarded."]
    },
    { 
        index: "revivify", name: "Revivify", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamonds worth 300 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts."]
    },
    {
        index: "spirit-shroud", name: "Spirit Shroud", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["You call forth spirits of the dead, which flit around you for the duration. Until the spell ends, any attack you make deals 1d8 extra damage when you hit a creature within 10 feet of you. The damage is radiant, necrotic, or cold (your choice when you cast the spell). Any creature that takes this damage can’t regain hit points until the start of your next turn. Also, any creature of your choice that you can see that starts its turn within 10 feet of you has its speed reduced by 10 feet until the start of your next turn."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the extra damage increases by 1d8 for every two slot levels above 3rd."]
    },

    // Level 4
    { 
        index: "aura-of-life", name: "Aura of Life", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Life-preserving energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) has resistance to necrotic damage, and its hit point maximum can't be reduced. In addition, a nonhostile creature regains 1 hit point when it starts its turn in the aura with 0 hit points."]
    },
    { 
        index: "aura-of-purity", name: "Aura of Purity", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Purifying energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) can't become diseased, has resistance to poison damage, and has advantage on saving throws against effects that cause any of the following conditions: blinded, charmed, deafened, frightened, paralyzed, poisoned, and stunned."]
    },
    { 
        index: "banishment", name: "Banishment", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "An item distasteful to the target.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished. If the target is native to the plane of existence you're on, you banish the target to a harmless demiplane. If the target is native to a different plane of existence than the one you're on, the target is banished with a faint popping noise, returning to its home plane."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "death-ward", name: "Death Ward", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends."]
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Fur from a bloodhound.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."]
    },
    { 
        index: "staggering-smite", name: "Staggering Smite", level: 4, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a melee weapon attack during this spell's duration, your weapon pierces both body and mind, and the attack deals an extra 4d6 psychic damage. The target must make a Wisdom saving throw. On a failed save, it has disadvantage on attack rolls and ability checks, and can't take reactions, until the end of its next turn."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_slot_level: { "4": "4d6" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "find-greater-steed", name: "Find Greater Steed", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You summon a spirit that assumes the form of a loyal, majestic mount. Appearing in an unoccupied space within range, the spirit takes on a form you choose: a griffon, a pegasus, a peryton, a dire wolf, a rhinoceros, or a saber-toothed tiger."]
    },

    // Level 5
    { 
        index: "banishing-smite", name: "Banishing Smite", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 bonus action", range: "Self", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["The next time you hit a creature with a weapon attack before this spell ends, your weapon crackles with force, and the attack deals an extra 5d10 force damage to the target. Additionally, if this attack reduces the target to 50 hit points or fewer, you banish it. If the target is native to a different plane of existence than the one you're on, the target disappears, returning to its home plane. If the target is native to the plane you're on, the creature vanishes into a harmless demiplane. While there, the target is incapacitated. It remains there until the spell ends, at which point the target reappears in the space it left or in the nearest unoccupied space if that space is occupied."],
        damage: { damage_type: { name: "Force", index: "force" }, damage_at_slot_level: { "5": "5d10" } }
    },
    { 
        index: "circle-of-power", name: "Circle of Power", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Divine energy radiates from you, distorting and diffusing magical energy within 30 feet of you. Until the spell ends, the sphere moves with you, centered on you. For the duration, each friendly creature in the area (including you) has advantage on saving throws against spells and other magical effects. Additionally, when an affected creature succeeds on a saving throw made against a spell or magical effect that allows it to make a saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw."]
    },
    { 
        index: "destructive-wave", name: "Destructive Wave", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You strike the ground, creating a burst of divine energy that ripples outward from you. Each creature you choose within 30 feet of you must succeed on a Constitution saving throw or take 5d6 thunder damage, as well as 5d6 radiant or necrotic damage (your choice), and be knocked prone. A creature that succeeds on its saving throw takes half as much damage and isn't knocked prone."],
        damage: { damage_type: { name: "Thunder/Radiant/Necrotic", index: "thunder" }, damage_at_slot_level: { "5": "10d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    {
        index: "holy-weapon", name: "Holy Weapon", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You imbue a weapon you touch with holy power. Until the spell ends, the weapon emits bright light in a 30-foot radius and dim light for an additional 30 feet. In addition, weapon attacks made with it deal an extra 2d8 radiant damage on a hit. As a bonus action, you can dismiss this spell and cause the weapon to emit a burst of radiance. Each creature of your choice that you can see within 30 feet of the weapon must make a Constitution saving throw. On a failed save, a creature takes 4d8 radiant damage and is blinded for 1 minute. On a successful save, a creature takes half as much damage and isn’t blinded. At the end of each of its turns, a blinded creature can make a Constitution saving throw, ending the effect on itself on a success."]
    },
    {
        index: "summon-celestial", name: "Summon Celestial", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "a golden reliquary worth at least 500 gp", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You call forth a celestial spirit. It manifests in an unoccupied space that you can see within range. This corporeal form uses the Celestial Spirit stat block. When you cast the spell, choose a manifestation: Avenger or Defender. The creature resembles a celestial of your choice which determines certain traits in its stat block. The creature disappears when it drops to 0 hit points or when the spell ends."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, use the higher level wherever the spell’s level appears in the stat block."]
    },
    { 
        index: "dispel-evil-and-good", name: "Dispel Evil and Good", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Holy water.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Shimmering energy surrounds and protects you from fey, undead, and creatures originating from beyond the Material Plane. For the duration, celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls against you. You can end the spell early by using either of the following special functions: Break Enchantment or Dismissal."]
    },
    { 
        index: "geas", name: "Geas", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 minute", range: "60 feet", components: ["V"], duration: "30 days", ritual: false, concentration: false, classes: [], 
        desc: ["You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you cast this spell using a spell slot of 9th level, the spell lasts until it is ended by one of the spells mentioned above."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_character_level: { "1": "5d10" } }, // 5d10 once per day if disobeys
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "raise-dead", name: "Raise Dead", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A diamond worth at least 500 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point. This spell also neutralizes any poisons and cures nonmagical diseases that affected the creature at the time it died."]
    }
];
