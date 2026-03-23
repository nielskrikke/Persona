
import { SpellDetail } from '../../types';

export const CLERIC_SPELLS: SpellDetail[] = [
    // Cantrips
    { 
        index: "guidance", name: "Guidance", level: 0, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends."] 
    },
    { 
        index: "light", name: "Light", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A firefly or phosphorescent moss.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.", "If you target an object held or worn by a hostile creature, that creature must succeed on a Dexterity saving throw to avoid the spell."],
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "none" }
    },
    { 
        index: "mending", name: "Mending", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Two lodestones.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.", "This spell can physically repair a magic item or construct, but the spell can't restore magic to such an object."] 
    },
    { 
        index: "resistance", name: "Resistance", level: 0, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A miniature cloak.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends."] 
    },
    { 
        index: "sacred-flame", name: "Sacred Flame", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw."], 
        damage: { damage_type: {name:"Radiant", index:"radiant"}, damage_at_character_level: {"1":"1d8", "5":"2d8", "11":"3d8", "17":"4d8"} }, 
        dc: { dc_type: {name:"DEX", index:"dex"}, dc_success: "none" } 
    },
    { 
        index: "spare-the-dying", name: "Spare the Dying", level: 0, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs."] 
    },
    { 
        index: "thaumaturgy", name: "Thaumaturgy", level: 0, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range:", "• Your voice booms up to three times as loud as normal for 1 minute.", "• You cause flames to flicker, brighten, dim, or change color for 1 minute.", "• You cause harmless tremors in the ground for 1 minute.", "• You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.", "• You instantaneously cause an unlocked door or window to fly open or slam shut.", "• You alter the appearance of your eyes for 1 minute.", "If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action."] 
    },
    {
        index: "toll-the-dead", name: "Toll the Dead", level: 0, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You point at one creature you can see within range, and the sound of a dolorous bell fills the air around it for a moment. The target must succeed on a Wisdom saving throw or take 1d8 necrotic damage. If the target is missing any of its hit points, it instead takes 1d12 necrotic damage."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_character_level: { "1": "1d8", "5": "2d8", "11": "3d8", "17": "4d8" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    {
        index: "word-of-radiance", name: "Word of Radiance", level: 0, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "5 feet", components: ["V", "M"], material: "a holy symbol", duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You utter a divine word, and burning radiance erupts from you. Each creature of your choice that you can see within range must succeed on a Constitution saving throw or take 1d6 radiant damage."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_character_level: { "1": "1d6", "5": "2d6", "11": "3d6", "17": "4d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "none" }
    },

    // Level 1
    { 
        index: "bane", name: "Bane", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A drop of blood.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."],
        dc: { dc_type: {name:"CHA", index:"cha"}, dc_success: "none" } 
    },
    { 
        index: "bless", name: "Bless", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A sprinkling of holy water.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st."]
    },
    { 
        index: "command", name: "Command", level: 1, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them."],
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "none" } 
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
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d8", "2":"2d8", "3":"3d8", "4":"4d8", "5":"5d8", "6":"6d8", "7":"7d8", "8":"8d8", "9":"9d8"} } 
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
        index: "guiding-bolt", name: "Guiding Bolt", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "120 feet", components: ["V", "S"], duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target then fading."],
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st."],
        damage: { damage_type: {name:"Radiant", index:"radiant"}, damage_at_slot_level: {"1":"4d6", "2":"5d6", "3":"6d6", "4":"7d6", "5":"8d6"} } 
    },
    { 
        index: "healing-word", name: "Healing Word", level: 1, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A creature of your choice that you can see within range regains a number of hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"1":"1d4", "2":"2d4", "3":"3d4", "4":"4d4", "5":"5d4", "6":"6d4", "7":"7d4", "8":"8d4", "9":"9d4"} } 
    },
    { 
        index: "inflict-wounds", name: "Inflict Wounds", level: 1, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage."], 
        higher_level: ["When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st."],
        damage: { damage_type: {name:"Necrotic", index:"necrotic"}, damage_at_slot_level: {"1":"3d10", "2":"4d10", "3":"5d10", "4":"6d10", "5":"7d10"} } 
    },
    { 
        index: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them."] 
    },
    { 
        index: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "10 feet", components: ["V", "S"], duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease."] 
    },
    {
        index: "ceremony", name: "Ceremony", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "25 gp worth of powdered silver, which the spell consumes", duration: "Instantaneous", ritual: true, concentration: false, classes: [],
        desc: ["You perform a special religious ceremony that is infused with magic. When you cast the spell, choose one of the following rites, the target of which must be within 10 feet of you throughout the casting: Atonement, Bless Wedding, Coming of Age, Dedication, Funeral Rite, Investiture, or Magic Weapon."]
    },
    {
        index: "life-transference", name: "Life Transference", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [],
        desc: ["You sacrifice some of your health to mend another creature’s injuries. You take 4d8 necrotic damage, which can’t be reduced in any way, and one creature of your choice that you can see within range regains a number of hit points equal to twice the necrotic damage you take."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd."]
    },
    { 
        index: "sanctuary", name: "Sanctuary", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 bonus action", range: "30 feet", components: ["V", "S", "M"], material: "A small silver mirror.", duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.", "If the warded creature makes an attack or casts a spell that affects an enemy creature, this spell ends."],
        dc: { dc_type: {name:"WIS", index:"wis"}, dc_success: "none" }
    },
    { 
        index: "shield-of-faith", name: "Shield of Faith", level: 1, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 bonus action", range: "60 feet", components: ["V", "S", "M"], material: "A small parchment with a bit of holy text written on it.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration."] 
    },

    // Level 2
    { 
        index: "aid", name: "Aid", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A tiny strip of white cloth.", duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd."]
    },
    { 
        index: "augury", name: "Augury", level: 2, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "Specially marked sticks, bones, or similar tokens worth at least 25 gp.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens: Weal (good), Woe (bad), Weal and woe (both), or Nothing."] 
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
        index: "continual-flame", name: "Continual Flame", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Ruby dust worth 50 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["A flame, equivalent in brightness to a torch, springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched."] 
    },
    { 
        index: "enhance-ability", name: "Enhance Ability", level: 2, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Fur or a feather from a beast.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends. Bear's Endurance (Adv on Con, 2d6 temp hp), Bull's Strength (Adv on Str, double carry), Cat's Grace (Adv on Dex, no fall dmg 20ft), Eagle's Splendor (Adv on Cha), Fox's Cunning (Adv on Int), or Owl's Wisdom (Adv on Wis)."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."]
    },
    { 
        index: "gentle-repose", name: "Gentle Repose", level: 2, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration.", duration: "10 days", ritual: true, concentration: false, classes: [], 
        desc: ["You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead."] 
    },
    { 
        index: "hold-person", name: "Hold Person", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A small, straight piece of iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "lesser-restoration", name: "Lesser Restoration", level: 2, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned."] 
    },
    { 
        index: "prayer-of-healing", name: "Prayer of Healing", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "10 minutes", range: "30 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Up to six creatures of your choice that you can see within range regain hit points equal to 2d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the healing increases by 1d8 for each slot level above 2nd."],
        damage: { damage_type: {name:"Healing", index:"healing"}, damage_at_slot_level: {"2":"2d8", "3":"3d8", "4":"4d8", "5":"5d8"} } 
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
        index: "spiritual-weapon", name: "Spiritual Weapon", level: 2, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "60 feet", components: ["V", "S"], duration: "1 minute", ritual: false, concentration: false, classes: [], 
        desc: ["You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.", "As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it."],
        higher_level: ["When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd."],
        damage: { damage_type: {name:"Force", index:"force"}, damage_at_slot_level: {"2":"1d8", "3":"1d8", "4":"2d8", "5":"2d8", "6":"3d8", "7":"3d8"} } 
    },
    { 
        index: "zone-of-truth", name: "Zone of Truth", level: 2, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point of your choice within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },

    // Level 3
    { 
        index: "animate-dead", name: "Animate Dead", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "A drop of blood, a piece of flesh, and a pinch of bone dust.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["This spell creates an undead servant. Choose a pile of bones or a corpse of a medium or small humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an undead creature (Skeleton or Zombie)."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, you animate or reassert control over two additional undead creatures for each slot level above 3rd."]
    },
    { 
        index: "beacon-of-hope", name: "Beacon of Hope", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing."] 
    },
    { 
        index: "bestow-curse", name: "Bestow Curse", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration of the spell. When you cast this spell, choose the nature of the curse from the following options: Disadvantage on checks/saves; Disadvantage on attacks vs you; Wisdom save to act; or Extra 1d8 necrotic damage from your attacks."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration is concentration, up to 10 minutes. If you use a spell slot of 5th level or higher, the duration is 8 hours. If you use a spell slot of 7th level or higher, the duration is 24 hours. If you use a 9th level spell slot, the spell lasts until it is dispelled."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "clairvoyance", name: "Clairvoyance", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "1 mile", components: ["V", "S", "M"], material: "A focus worth at least 100 gp, either a jeweled horn for hearing or a glass eye for seeing.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with."] 
    },
    { 
        index: "create-food-and-water", name: "Create Food and Water", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn't go bad."] 
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
        index: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "Incense and powdered diamond worth at least 200 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["When you cast this spell, you inscribe a glyph that later unleashes a magical effect. You can choose from Explosive Runes (5d8 damage) or Spell Glyph (stores a spell)."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd."],
        damage: { damage_type: { name: "Varies", index: "varies" }, damage_at_slot_level: { "3": "5d8", "4": "6d8", "5": "7d8", "6": "8d8", "7": "9d8" } }
    },
    { 
        index: "magic-circle", name: "Magic Circle", level: 3, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron worth at least 100 gp, which the spell consumes.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You create a 10-foot-radius, 20-foot-tall cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the cylinder intersects with the floor or other surface. Choose one or more of the following types of creatures: celestials, elementals, fey, fiends, or undead. The circle affects a creature of the chosen type in the following ways: The creature can't willingly enter the cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw. The creature has disadvantage on attack rolls against targets within the cylinder. Targets within the cylinder can't be charmed, frightened, or possessed by the creature."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd."]
    },
    { 
        index: "mass-healing-word", name: "Mass Healing Word", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "60 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "3": "1d4", "4": "2d4", "5": "3d4", "6": "4d4", "7": "5d4" } }
    },
    { 
        index: "meld-into-stone", name: "Meld into Stone", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "8 hours", ritual: true, concentration: false, classes: [], 
        desc: ["You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses."] 
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
        index: "revivify", name: "Revivify", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamonds worth 300 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts."] 
    },
    { 
        index: "sending", name: "Sending", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Unlimited", components: ["V", "S", "M"], material: "A short piece of copper wire.", duration: "1 round", ritual: false, concentration: false, classes: [], 
        desc: ["You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately."] 
    },
    { 
        index: "speak-with-dead", name: "Speak with Dead", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "10 feet", components: ["V", "S", "M"], material: "Burning incense.", duration: "10 minutes", ritual: false, concentration: false, classes: [], 
        desc: ["You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead."] 
    },
    { 
        index: "spirit-guardians", name: "Spirit Guardians", level: 3, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "Self (15-foot radius)", components: ["V", "S", "M"], material: "A holy symbol.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage."],
        higher_level: ["When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "3": "3d8", "4": "4d8", "5": "5d8", "6": "6d8", "7": "7d8", "8": "8d8" } },
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "half" }
    },
    { 
        index: "tongues", name: "Tongues", level: 3, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "M"], material: "A small clay model of a ziggurat.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says."] 
    },
    { 
        index: "water-walk", name: "Water Walk", level: 3, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "30 feet", components: ["V", "S", "M"], material: "A piece of cork.", duration: "1 hour", ritual: true, concentration: false, classes: [], 
        desc: ["This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration."] 
    },
    { index: "aura-of-vitality", name: "Aura of Vitality", level: 3, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["Healing energy radiates from you. As a bonus action, you can cause a creature in the aura to regain 2d6 HP."] },
    { index: "spirit-shroud", name: "Spirit Shroud", level: 3, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 bonus action", range: "Self", components: ["V", "S"], duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["You call forth spirits of the dead. Your attacks deal an extra 1d8 radiant, necrotic, or cold damage, and creatures hit can't regain HP."], damage: { damage_type: {name:"Radiant", index:"radiant"}, damage_at_slot_level: {"3":"1d8"} } },

    // Level 4
    { 
        index: "banishment", name: "Banishment", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "An item distasteful to the target.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished."],
        higher_level: ["When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "control-water", name: "Control Water", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A drop of water and a pinch of dust.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects: Flood, Part Water, Redirect Flow, or Whirlpool."] 
    },
    { 
        index: "death-ward", name: "Death Ward", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point, and the spell ends. If the spell is still in effect when the target is subjected to an effect that would kill it instantaneously without dealing damage, that effect is instead negated against the target, and the spell ends."] 
    },
    {
        index: "aura-of-life", name: "Aura of Life", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Life-preserving energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) has resistance to necrotic damage, and its hit point maximum can't be reduced. In addition, a nonhostile creature regains 1 hit point when it starts its turn in the aura with 0 hit points."]
    },
    {
        index: "aura-of-purity", name: "Aura of Purity", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [],
        desc: ["Purifying energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. Each nonhostile creature in the aura (including you) can’t become diseased, has resistance to poison damage, and has advantage on saving throws against effects that cause any of the following conditions: blinded, charmed, deafened, frightened, paralyzed, poisoned, and stunned."]
    },
    {
        index: "holy-weapon", name: "Holy Weapon", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "Touch", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [],
        desc: ["You imbue a weapon you touch with holy power. Until the spell ends, the weapon emits bright light in a 30-foot radius and dim light for an additional 30 feet. In addition, weapon attacks made with it deal an extra 2d8 radiant damage on a hit. As a bonus action on your turn, you can dismiss this spell and cause the weapon to emit a burst of radiance. Each creature of your choice that you can see within 30 feet of the weapon must make a Constitution saving throw. On a failed save, a creature takes 4d8 radiant damage, and it is blinded for 1 minute. On a successful save, a creature takes half as much damage and isn’t blinded. At the end of each of its turns, a blinded creature can make a Constitution saving throw, ending the effect on itself on a success."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "5": "2d8" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    {
        index: "dawn", name: "Dawn", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "a sunstone worth at least 100 gp", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [],
        desc: ["The light of dawn shines in a 30-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, bright light fills the cylinder, and its area is sunlight. When the cylinder appears, each creature in it must make a Constitution saving throw, taking 4d10 radiant damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it ends its turn in the cylinder. If you’re within 60 feet of the cylinder, you can move it up to 60 feet as a bonus action on your turn."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "5": "4d10" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "divination", name: "Divination", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Incense and a sacrificial offering appropriate to the religion, together worth at least 25 gp, which the spell consumes.", duration: "Instantaneous", ritual: true, concentration: false, classes: [], 
        desc: ["Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen."] 
    },
    { 
        index: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "A leather strap, bound around the arm or a similar appendage.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained."] 
    },
    { 
        index: "guardian-of-faith", name: "Guardian of Faith", level: 4, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "30 feet", components: ["V"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity. Any creature hostile to you that moves to a space within 10 feet of the guardian for the first time on a turn must succeed on a Dexterity saving throw. The creature takes 20 radiant damage on a failed save, or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage."],
        damage: { damage_type: { name: "Radiant", index: "radiant" }, damage_at_slot_level: { "4": "20" } }
    },
    { 
        index: "locate-creature", name: "Locate Creature", level: 4, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A bit of fur from a bloodhound.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement."] 
    },
    { 
        index: "stone-shape", name: "Stone Shape", level: 4, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Soft clay to be worked into roughly the desired shape of the stone object.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large rock into a weapon, idol, or coffer, or make a small passage through a wall, as long as the wall is less than 5 feet thick. You can also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn't possible."] 
    },
    { index: "aura-of-life", name: "Aura of Life", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Life-preserving energy radiates from you. Non-hostile creatures in the aura have resistance to necrotic damage and their HP maximum can't be reduced."] },
    { index: "aura-of-purity", name: "Aura of Purity", level: 4, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (30-foot radius)", components: ["V"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], desc: ["Purifying energy radiates from you. Non-hostile creatures in the aura can't become diseased and have advantage on saves against various conditions."] },

    // Level 5
    { 
        index: "commune", name: "Commune", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "Incense and a vial of holy or unholy water.", duration: "1 minute", ritual: true, concentration: false, classes: [], 
        desc: ["You contact your deity or a divine proxy and ask up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question."] 
    },
    { 
        index: "contagion", name: "Contagion", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "7 days", ritual: false, concentration: false, classes: [], 
        desc: ["Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, you afflict the creature with a disease of your choice from any of the ones described below (e.g. Blinding Sickness, Filth Fever, etc.)."] 
    },
    { 
        index: "dispel-evil-and-good", name: "Dispel Evil and Good", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "Holy water or powdered silver and iron.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Shimmering energy surrounds and protects you from fey, undead, and creatures originating from beyond the Material Plane. For the duration, celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls against you. You can end the spell early by using either of the following special functions: Break Enchantment or Dismissal."] 
    },
    { 
        index: "flame-strike", name: "Flame Strike", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "Pinch of sulfur.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high cylinder centered on a point within range must make a Dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the fire damage or the radiant damage (your choice) increases by 1d6 for each slot level above 5th."],
        damage: { damage_type: { name: "Fire/Radiant", index: "fire" }, damage_at_slot_level: { "5": "4d6+4d6", "6": "5d6+4d6", "7": "6d6+4d6" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "geas", name: "Geas", level: 5, school: { name: "Enchantment", index: "enchantment" }, casting_time: "1 minute", range: "60 feet", components: ["V"], duration: "30 days", ritual: false, concentration: false, classes: [], 
        desc: ["You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you cast this spell using a spell slot of 9th level, the spell lasts until it is ended by one of the spells mentioned above."],
        damage: { damage_type: { name: "Psychic", index: "psychic" }, damage_at_character_level: { "1": "5d10" } }, // 5d10 once per day if disobeys
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { 
        index: "greater-restoration", name: "Greater Restoration", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "Diamond dust worth at least 100 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's exhaustion level by one, or end one of the following effects on the target: Charm/Petrify, Curse, Ability Reduction, HP Max Reduction."] 
    },
    { 
        index: "hallow", name: "Hallow", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "24 hours", range: "Touch", components: ["V", "S", "M"], material: "Herbs, oils, and incense worth at least 1,000 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a point and infuse an area around it with holy (or unholy) power. The area can have a radius up to 60 feet, and the spell fails if the radius includes an area already under the effect of a hallow spell. The affected area is subject to the following effects: First, celestials, elementals, fey, fiends, and undead can't enter the area, nor can such creatures charm, frighten, or possess creatures within it. Second, you can bind an extra effect to the area (e.g. Courage, Darkness, Daylight, Energy Protection, etc.)."] 
    },
    { 
        index: "insect-plague", name: "Insect Plague", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "300 feet", components: ["V", "S", "M"], material: "A few grains of sugar, some kernels of grain, and a smear of fat.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th."],
        damage: { damage_type: { name: "Piercing", index: "piercing" }, damage_at_slot_level: { "5": "4d10", "6": "5d10", "7": "6d10" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
    },
    { 
        index: "legend-lore", name: "Legend Lore", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "Incense worth at least 250 gp, which the spell consumes, and four ivory strips worth at least 50 gp each.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named."] 
    },
    { 
        index: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier."],
        higher_level: ["When you cast this spell using a spell slot of 6th level or higher, the healing increases by 1d8 for each slot level above 5th."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "5": "3d8", "6": "4d8", "7": "5d8", "8": "6d8", "9": "7d8" } }
    },
    { 
        index: "planar-binding", name: "Planar Binding", level: 5, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 hour", range: "60 feet", components: ["V", "S", "M"], material: "A jewel worth at least 1,000 gp, which the spell consumes.", duration: "24 hours", ritual: false, concentration: false, classes: [], 
        desc: ["With this spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration."],
        higher_level: ["When you cast this spell using a spell slot of a higher level, the duration increases to 10 days (6th level), 30 days (7th level), 180 days (8th level), and a year and a day (9th level)."],
        dc: { dc_type: { name: "CHA", index: "cha" }, dc_success: "none" }
    },
    { 
        index: "raise-dead", name: "Raise Dead", level: 5, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A diamond worth at least 500 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point."] 
    },
    { 
        index: "scrying", name: "Scrying", level: 5, school: { name: "Divination", index: "divination" }, casting_time: "10 minutes", range: "Self", components: ["V", "S", "M"], material: "A focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water.", duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it."],
        dc: { dc_type: { name: "WIS", index: "wis" }, dc_success: "none" }
    },
    { index: "summon-celestial", name: "Summon Celestial", level: 5, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "90 feet", components: ["V", "S", "M"], material: "A golden reliquary worth at least 500 gp.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], desc: ["You call forth a celestial spirit to fight for you."] },

    // Level 6
    { 
        index: "blade-barrier", name: "Blade Barrier", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 10 minutes", ritual: false, concentration: true, classes: [], 
        desc: ["You create a vertical wall of whirling, razor-sharp blades made of magical energy. The wall appears within range and lasts for the duration. You can make a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick. The wall provides three-quarters cover to creatures behind it, and its space is difficult terrain. When a creature enters the wall's area for the first time on a turn or starts its turn there, the creature must make a Dexterity saving throw. On a failed save, the creature takes 6d10 slashing damage. On a successful save, the creature takes half as much damage."],
        damage: { damage_type: { name: "Slashing", index: "slashing" }, damage_at_slot_level: { "6": "6d10" } },
        dc: { dc_type: { name: "DEX", index: "dex" }, dc_success: "half" }
    },
    { 
        index: "create-undead", name: "Create Undead", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 minute", range: "10 feet", components: ["V", "S", "M"], material: "One clay pot filled with grave dirt, one clay pot filled with brackish water, and one 150 gp black onyx stone for each corpse.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You can cast this spell only at night. Choose up to three corpses of Medium or Small humanoids within range. Each corpse becomes a ghoul under your control. (At higher levels: Create ghasts, wights, or mummies)."],
        higher_level: ["When you cast this spell using a 7th-level spell slot, you can animate or reassert control over four ghouls. When you use an 8th-level spell slot, you can create five ghouls or two ghasts or wights. When you use a 9th-level spell slot, you can create six ghouls, three ghasts or wights, or two mummies."]
    },
    { 
        index: "find-the-path", name: "Find the Path", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 minute", range: "Self", components: ["V", "S", "M"], material: "A set of divinatory tools—such as bones, ivory sticks, cards, teeth, or carved runes—worth 100 gp and an object from the location you wish to find.", duration: "Concentration, up to 1 day", ritual: false, concentration: true, classes: [], 
        desc: ["This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence."] 
    },
    { 
        index: "forbiddance", name: "Forbiddance", level: 6, school: { name: "Abjuration", index: "abjuration" }, casting_time: "10 minutes", range: "Touch", components: ["V", "S", "M"], material: "A sprinkling of holy water, rare incense, and powdered ruby worth at least 1,000 gp.", duration: "1 day", ritual: true, concentration: false, classes: [], 
        desc: ["You create a ward against magical travel that protects up to 40,000 square feet of floor space to a height of 30 feet above the floor. For the duration, creatures can't teleport into the area or use portals, such as those created by the gate spell, to enter the area. The spell also damages celestials, elementals, fey, fiends, and undead who enter or end their turn in the area (5d10 radiant/necrotic)."] 
    },
    { 
        index: "harm", name: "Harm", level: 6, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d6 necrotic damage, or half as much damage on a successful save. The damage can't reduce the target's hit points below 1. If the target fails the saving throw, its hit point maximum is reduced for 1 hour by an amount equal to the necrotic damage it took."],
        damage: { damage_type: { name: "Necrotic", index: "necrotic" }, damage_at_slot_level: { "6": "14d6" } },
        dc: { dc_type: { name: "CON", index: "con" }, dc_success: "half" }
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
        index: "planar-ally", name: "Planar Ally", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "10 minutes", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You beseech an otherworldly entity for aid. The being must be known to you: a god, a primordial, a demon prince, or some other being of cosmic power. That entity sends a celestial, an elemental, or a fiend loyal to it to aid you, making the creature appear in an unoccupied space within range. If you know a specific creature's name, you can speak that name when you cast this spell to request that creature, though you might get a different creature anyway (GM's choice)."] 
    },
    { 
        index: "true-seeing", name: "True Seeing", level: 6, school: { name: "Divination", index: "divination" }, casting_time: "1 action", range: "Touch", components: ["V", "S", "M"], material: "An ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet."] 
    },
    { 
        index: "word-of-recall", name: "Word of Recall", level: 6, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "5 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated when you prepared your sanctuary (if you have not prepared a sanctuary, the spell has no effect)."] 
    },
    { index: "sunbeam", name: "Sunbeam", level: 6, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Self (60-foot line)", components: ["V", "S", "M"], material: "A magnifying glass.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], desc: ["A beam of brilliant light flashes out from your hand. Each creature in the line must make a Con save or take 6d8 radiant damage and be blinded."], damage: { damage_type: {name:"Radiant", index:"radiant"}, damage_at_slot_level: {"6":"6d8"} }, dc: { dc_type: {name:"CON", index:"con"}, dc_success: "half" } },

    // Level 7
    { 
        index: "conjure-celestial", name: "Conjure Celestial", level: 7, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 minute", range: "90 feet", components: ["V", "S"], duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["You summon a celestial of challenge rating 4 or lower, which appears in an unoccupied space that you can see within range. The celestial disappears when it drops to 0 hit points or when the spell ends."],
        higher_level: ["When you cast this spell using a 9th-level spell slot, you can summon a celestial of challenge rating 5 or lower."]
    },
    { 
        index: "divine-word", name: "Divine Word", level: 7, school: { name: "Evocation", index: "evocation" }, casting_time: "1 bonus action", range: "30 feet", components: ["V"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You utter a divine word, imbued with the power that shaped the world at the dawn of creation. Choose any number of creatures you can see within range. Each creature that can hear you must make a Charisma saving throw. On a failed save, a creature suffers an effect based on its current hit points: 50 HP or fewer: deafened for 1 minute; 40 HP or fewer: deafened and blinded for 10 minutes; 30 HP or fewer: blinded, deafened, and stunned for 1 hour; 20 HP or fewer: killed instantly."] 
    },
    { 
        index: "etherealness", name: "Etherealness", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 action", range: "Self", components: ["V", "S"], duration: "8 hours", ritual: false, concentration: false, classes: [], 
        desc: ["You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell."],
        higher_level: ["When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including yourself) for each slot level above 7th. The creatures must be within 10 feet of you when you cast the spell."]
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
        index: "regenerate", name: "Regenerate", level: 7, school: { name: "Transmutation", index: "transmutation" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "A prayer wheel and holy water.", duration: "1 hour", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points per minute). The target's severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "7": "4d8" } } // +15 fixed not in dice string usually
    },
    { 
        index: "resurrection", name: "Resurrection", level: 7, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A diamond worth at least 1,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't undead. If its soul is free and willing, the target returns to life with all its hit points."] 
    },
    { 
        index: "symbol", name: "Symbol", level: 7, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 minute", range: "Touch", components: ["V", "S", "M"], material: "Mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp, which the spell consumes.", duration: "Until dispelled", ritual: false, concentration: false, classes: [], 
        desc: ["You scribe a potent rune on a surface or within an object that can be closed. When triggered, the glyph enacts one of the following effects: Death (10d10 necrotic), Discord, Fear, Hopelessness, Insanity, Pain, Sleep, or Stunning."] 
    },

    // Level 8
    { 
        index: "antimagic-field", name: "Antimagic Field", level: 8, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self (10-foot radius)", components: ["V", "S", "M"], material: "A pinch of powdered iron or iron filings.", duration: "Concentration, up to 1 hour", ritual: false, concentration: true, classes: [], 
        desc: ["A 10-foot-radius invisible sphere of antimagic surrounds you. This area is divorced from the magical energy that suffuses the multiverse. Within the sphere, spells can't be cast, summoned creatures disappear, and even magic items become mundane."] 
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
        index: "holy-aura", name: "Holy Aura", level: 8, school: { name: "Abjuration", index: "abjuration" }, casting_time: "1 action", range: "Self", components: ["V", "S", "M"], material: "A tiny reliquary worth at least 1,000 gp containing a sacred relic, such as a scrap of cloth from a saint's robe or a piece of parchment from a religious text.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["Divine light washes out from you and coalesces in a soft radiance in a 30-foot radius around you. Creatures of your choice in that radius when you cast this spell shed dim light in a 5-foot radius and have advantage on all saving throws, and other creatures have disadvantage on attack rolls against them until the spell ends. In addition, when a fiend or an undead hits an affected creature with a melee attack, the aura flashes with brilliant light. The attacker must succeed on a Constitution saving throw or be blinded until the spell ends."] 
    },

    // Level 9
    { 
        index: "astral-projection", name: "Astral Projection", level: 9, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "For each creature you affect with this spell, you must provide one jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100 gp, all of which the spell consumes.", duration: "Special", ritual: false, concentration: false, classes: [], 
        desc: ["You and up to eight willing creatures within range project your astral bodies into the Astral Plane (the spell fails and the casting is wasted if you are already on that plane). The material body you leave behind is unconscious and in a state of suspended animation; it doesn't need food or air and doesn't age."] 
    },
    { 
        index: "gate", name: "Gate", level: 9, school: { name: "Conjuration", index: "conjuration" }, casting_time: "1 action", range: "60 feet", components: ["V", "S", "M"], material: "A diamond worth at least 5,000 gp.", duration: "Concentration, up to 1 minute", ritual: false, concentration: true, classes: [], 
        desc: ["You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose. The portal lasts for the duration."] 
    },
    { 
        index: "mass-heal", name: "Mass Heal", level: 9, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "60 feet", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["A flood of healing energy flows from you into injured creatures around you. You restore up to 700 hit points, divided as you choose among any number of creatures that you can see within range. Creatures healed by this spell are also cured of all diseases and any effect making them blinded or deafened. This spell has no effect on undead or constructs."],
        damage: { damage_type: { name: "Healing", index: "healing" }, damage_at_slot_level: { "9": "700" } } // fixed pool
    },
    { 
        index: "true-resurrection", name: "True Resurrection", level: 9, school: { name: "Necromancy", index: "necromancy" }, casting_time: "1 hour", range: "Touch", components: ["V", "S", "M"], material: "A sprinkle of holy water and diamonds worth at least 25,000 gp, which the spell consumes.", duration: "Instantaneous", ritual: false, concentration: false, classes: [], 
        desc: ["You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. If the creature's soul is free and willing, the creature is restored to life with all its hit points."] 
    },
    { index: "power-word-heal", name: "Power Word Heal", level: 9, school: { name: "Evocation", index: "evocation" }, casting_time: "1 action", range: "Touch", components: ["V", "S"], duration: "Instantaneous", ritual: false, concentration: false, classes: [], desc: ["A wave of healing energy washes over a creature you touch. The target regains all its HP."] }
];
