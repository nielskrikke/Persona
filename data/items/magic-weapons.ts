
import { EquipmentDetail } from '../../types';

export const MAGIC_WEAPONS: EquipmentDetail[] = [
    // Generics
    { 
        index: "dagger-plus-1", name: "Dagger +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 1, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d4+1", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "longsword-plus-1", name: "Longsword +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 3, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d8+1", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "shortsword-plus-1", name: "Shortsword +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 2, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d6+1", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "longbow-plus-1", name: "Longbow +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 2, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d8+1", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "greataxe-plus-1", name: "Greataxe +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 7, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d12+1", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "warhammer-plus-1", name: "Warhammer +1", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 2, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d8+1", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You have a +1 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "weapon-plus-2", name: "Weapon +2", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 0, 
        rarity: "Rare",
        desc: ["You have a +2 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 }
        ]
    },
    { 
        index: "weapon-plus-3", name: "Weapon +3", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 20000, unit: "gp" }, 
        weight: 0, 
        rarity: "Very Rare",
        desc: ["You have a +3 bonus to attack and damage rolls made with this magic weapon."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ]
    },
    
    // Ammunition
    { 
        index: "arrow-of-slaying", name: "Arrow of Slaying", 
        equipment_category: { index: "ammunition", name: "Ammunition", url: "" }, 
        cost: { quantity: 600, unit: "gp" }, 
        weight: 0.05, 
        rarity: "Very Rare",
        desc: ["An arrow of slaying is a magic weapon meant to slay a particular kind of creature. Some are more focused than others; for example, there are arrows of dragon slaying and arrows of blue dragon slaying.", "If a creature belonging to the type, race, or group associated with an arrow of slaying takes damage from the arrow, the creature must make a DC 17 Constitution saving throw, taking an extra 6d10 piercing damage on a failed save, or half as much extra damage on a successful one.", "Once an arrow of slaying deals its extra damage to a creature, it becomes a nonmagical arrow."] 
    },

    // Named Weapons
    { 
        index: "berserker-axe", name: "Berserker Axe", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d8+1", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your hit point maximum increases by 1 for each level you have attained.", "Curse. This axe is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the axe, keeping it within reach at all times. You also have disadvantage on attack rolls with weapons other than this one, unless no foe is within 60 feet of you that you can see or hear.", "Whenever a hostile creature damages you while the axe is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. While berserk, you must use your action each round to attack the creature nearest to you with the axe."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 },
            { type: 'bonus', target: 'hp_per_level', value: 1 }
        ],
        requires_attunement: true
    },
    { 
        index: "dagger-of-venom", name: "Dagger of Venom", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 1, 
        rarity: "Rare",
        damage: { damage_dice: "1d4+1", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon.", "You can use an action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 poison damage and become poisoned for 1 minute. The dagger can't be used this way again until the next dawn."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "dancing-sword", name: "Dancing Sword", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 25000, unit: "gp" }, 
        weight: 3, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.", "While the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.", "After the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet."],
        requires_attunement: true
    },
    { 
        index: "defender", name: "Defender", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 100000, unit: "gp" }, 
        weight: 3, 
        rarity: "Legendary",
        damage: { damage_dice: "1d8+3", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +3 bonus to attack and damage rolls made with this magic weapon.", "The first time you attack with the sword on each of your turns, you can transfer some or all of the sword's bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ],
        requires_attunement: true
    },
    { 
        index: "dragon-slayer", name: "Dragon Slayer", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 3, 
        rarity: "Rare",
        damage: { damage_dice: "1d8+1", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon.", "When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon's type. For the purpose of this weapon, 'dragon' refers to any creature with the dragon type, including dragon turtles and wyverns."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "dwarven-thrower", name: "Dwarven Thrower", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 60000, unit: "gp" }, 
        weight: 2, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d8+3", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 damage or, if the target is a giant, 2d8 damage. Immediately after the attack, the weapon flies back to your hand.", "Requires attunement by a dwarf."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ],
        requires_attunement: true,
        attunement_description: "by a dwarf"
    },
    { 
        index: "flame-tongue-longsword", name: "Flame Tongue Longsword", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 5000, unit: "gp" }, 
        weight: 3, 
        rarity: "Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You can use a bonus action to speak this magic sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword."],
        requires_attunement: true
    },
    { 
        index: "frost-brand-greatsword", name: "Frost Brand Greatsword", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 35000, unit: "gp" }, 
        weight: 6, 
        rarity: "Very Rare",
        damage: { damage_dice: "2d6", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.", "In freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of you. This property can be used no more than once per hour."],
        modifiers: [
             { type: 'resistance', target: 'resistance', value: 'Fire', filter: 'Fire' }
        ],
        requires_attunement: true
    },
    { 
        index: "giant-slayer", name: "Giant Slayer", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d8+1", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon.", "When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, 'giant' refers to any creature with the giant type, including ettins and trolls."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "hammer-of-thunderbolts", name: "Hammer of Thunderbolts", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 150000, unit: "gp" }, 
        weight: 10, 
        rarity: "Legendary",
        damage: { damage_dice: "2d6+1", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon. Requires Belt of Giant Strength and Gauntlets of Ogre Power to attune.", "Giant's Bane. While you are attuned to this weapon and holding it, your Strength score increases by 4 and can exceed 20, but not 30. When you roll a 20 on an attack roll made with this weapon against a giant, the giant must succeed on a DC 17 Constitution saving throw or die.", "The hammer has 5 charges. While you hold it, you can use an action and expend 1 charge to make a ranged weapon attack with the hammer, hurling it as if it had the thrown property with a normal range of 20 feet and a long range of 60 feet."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 },
            { type: 'bonus', target: 'str', value: 4 }
        ],
        requires_attunement: true
    },
    { 
        index: "holy-avenger", name: "Holy Avenger", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 150000, unit: "gp" }, 
        weight: 3, 
        rarity: "Legendary",
        damage: { damage_dice: "1d8+3", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.", "While you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ],
        requires_attunement: true,
        attunement_description: "by a paladin"
    },
    { 
        index: "javelin-of-lightning", name: "Javelin of Lightning", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 1000, unit: "gp" }, 
        weight: 2, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["This javelin is a magic weapon. When you hurl it and speak its command word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, or half as much damage on a successful one. The lightning bolt turns back into a javelin when it reaches the target. Make a ranged weapon attack against the target. On a hit, the target takes damage from the javelin plus 4d6 lightning damage."] 
    },
    { 
        index: "luck-blade", name: "Luck Blade", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 120000, unit: "gp" }, 
        weight: 2, 
        rarity: "Legendary",
        damage: { damage_dice: "1d8+1", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.", "Luck. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you make. You must use the new roll. This property can't be used again until the next dawn.", "Wish. The sword has 1d4-1 charges. While holding it, you can use an action to expend 1 charge and cast the wish spell from it. This property can't be used again until the next dawn. The sword loses this property if it has no charges."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 },
            { type: 'bonus', target: 'saves', value: 1 }
        ],
        requires_attunement: true
    },
    { 
        index: "mace-of-disruption", name: "Mace of Disruption", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn.", "While you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet."],
        requires_attunement: true
    },
    { 
        index: "mace-of-smiting", name: "Mace of Smiting", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d6+1", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You gain a +1 bonus to attack and damage rolls made with this magic weapon. The bonus increases to +3 when you use the mace to attack a construct.", "When you roll a 20 on an attack roll made with this weapon, the target takes an extra 2d6 bludgeoning damage, or 4d6 bludgeoning damage if it's a construct. If a construct has 25 hit points or fewer after taking this damage, it is destroyed."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 1 },
            { type: 'bonus', target: 'damage', value: 1 }
        ]
    },
    { 
        index: "mace-of-terror", name: "Mace of Terror", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 5000, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["This magic weapon has 3 charges. While holding it, you can use an action and expend 1 charge to release a wave of terror. Each creature of your choice in a 30-foot radius extending from you must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action. At the end of each of its turns, a creature can repeat the saving throw, ending the effect on itself on a success. The mace regains 1d3 expended charges daily at dawn."],
        requires_attunement: true
    },
    { 
        index: "nine-lives-stealer", name: "Nine Lives Stealer", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 50000, unit: "gp" }, 
        weight: 3, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d8+2", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +2 bonus to attack and damage rolls made with this magic weapon.", "The sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 }
        ],
        requires_attunement: true
    },
    { 
        index: "oathbow", name: "Oathbow", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 30000, unit: "gp" }, 
        weight: 2, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["When you nock an arrow on this bow, it whispers in Elvish, 'Swift defeat to my enemies.' When you use this weapon to make a ranged attack, you can, as a command phrase, say, 'Swift death to you who have wronged me.' The target of your attack becomes your sworn enemy until it dies or until dawn seven days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn.", "When you make a ranged attack roll with this weapon against your sworn enemy, you have advantage on the roll. In addition, your target gains no benefit from cover, other than total cover, and you suffer no disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 piercing damage."],
        requires_attunement: true
    },
    { 
        index: "scimitar-of-speed", name: "Scimitar of Speed", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 50000, unit: "gp" }, 
        weight: 3, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d6+2", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make one attack with it as a bonus action on each of your turns."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 }
        ],
        requires_attunement: true
    },
    { 
        index: "sun-blade", name: "Sun Blade", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 5500, unit: "gp" }, 
        weight: 2, 
        rarity: "Rare",
        damage: { damage_dice: "1d8+2", damage_type: { index: "radiant", name: "Radiant" } }, 
        desc: ["This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence, or make the blade disappear. While the blade exists, this magic longsword has the finesse property. If you are proficient with shortswords or longswords, you are proficient with the sun blade.", "You gain a +2 bonus to attack and damage rolls made with this weapon, which deals radiant damage instead of slashing damage. When you hit an undead with it, that target takes an extra 1d8 radiant damage.", "The sword's luminous blade emits bright light in a 15-foot radius and dim light for an additional 15 feet. The light is sunlight."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 }
        ],
        requires_attunement: true
    },
    { 
        index: "sword-of-life-stealing", name: "Sword of Life Stealing", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 3, 
        rarity: "Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 10 necrotic damage if it isn't a construct or an undead. You also gain 10 temporary hit points."],
        requires_attunement: true
    },
    { 
        index: "sword-of-sharpness", name: "Sword of Sharpness", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 45000, unit: "gp" }, 
        weight: 3, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.", "When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 14 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target's limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.", "In addition, you can speak the sword's command word to cause the blade to shed bright light in a 10-foot radius and dim light for an additional 10 feet."],
        requires_attunement: true
    },
    { 
        index: "sword-of-wounding", name: "Sword of Wounding", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 3, 
        rarity: "Rare",
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["Hit points lost to this weapon's damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.", "Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature's turns, it takes 1d4 necrotic damage for each time you've wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success."],
        requires_attunement: true
    },
    { 
        index: "trident-of-fish-command", name: "Trident of Fish Command", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 600, unit: "gp" }, 
        weight: 4, 
        rarity: "Uncommon",
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } }, 
        desc: ["This trident is a magic weapon. It has 3 charges. While you carry it, you can use an action and expend 1 charge to cast dominate beast (save DC 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn."],
        requires_attunement: true
    },
    { 
        index: "vicious-weapon", name: "Vicious Weapon", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 350, unit: "gp" }, 
        weight: 0, 
        rarity: "Rare",
        desc: ["When you roll a 20 on your attack roll with this magic weapon, the target takes an extra 7 damage of the weapon's type."] 
    },
    { 
        index: "vorpal-sword", name: "Vorpal Sword", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 150000, unit: "gp" }, 
        weight: 3, 
        rarity: "Legendary",
        damage: { damage_dice: "1d8+3", damage_type: { index: "slashing", name: "Slashing" } }, 
        desc: ["You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.", "When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn't have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ],
        requires_attunement: true
    },

    // Combat Staves
    { 
        index: "staff-of-striking", name: "Staff of Striking", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 20000, unit: "gp" }, 
        weight: 4, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d6+3", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You have a +3 bonus to attack and damage rolls made with this magic weapon.", "The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 of its charges. For each charge you expend, the target takes an extra 1d6 force damage. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a nonmagical quarterstaff."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 3 },
            { type: 'bonus', target: 'damage', value: 3 }
        ],
        requires_attunement: true
    },
    { 
        index: "staff-of-power", name: "Staff of Power", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 45000, unit: "gp" }, 
        weight: 4, 
        rarity: "Very Rare",
        damage: { damage_dice: "1d6+2", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You have a +2 bonus to attack and damage rolls made with this magic weapon. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls.", "The staff has 20 charges for the following properties. It regains 2d8 + 4 expended charges daily at dawn.", "Power Strike. When you hit with a melee attack using the staff, you can expend 1 charge to deal an extra 1d6 force damage.", "Spells. Cone of Cold (5 charges), Fireball (5th-level version, 5 charges), Globe of Invulnerability (6 charges), Hold Monster (5 charges), Levitate (2 charges), Lightning Bolt (5th-level version, 5 charges), Magic Missile (1 charge), Ray of Enfeeblement (1 charge), Wall of Force (5 charges).", "Retributive Strike. You can break the staff to create an explosion."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 },
            { type: 'bonus', target: 'ac', value: 2 },
            { type: 'bonus', target: 'saves', value: 2 },
            { type: 'bonus', target: 'spell_attack', value: 2 }
        ],
        requires_attunement: true,
        attunement_description: "by a sorcerer, warlock, or wizard"
    },
    { 
        index: "staff-of-the-magi", name: "Staff of the Magi", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 200000, unit: "gp" }, 
        weight: 4, 
        rarity: "Legendary",
        damage: { damage_dice: "1d6+2", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You have a +2 bonus to attack and damage rolls made with this magic weapon. While holding it, you have a +2 bonus to spell attack rolls.", "The staff has 50 charges. It regains 4d6 + 2 expended charges daily at dawn.", "Spell Absorption. While holding the staff, you have advantage on saving throws against spells. In addition, you can use your reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell's level.", "Spells. Conjure Elemental (7 charges), Dispel Magic (3 charges), Fireball (7th-level version, 7 charges), Flaming Sphere (2 charges), Ice Storm (4 charges), Invisibility (2 charges), Knock (2 charges), Lightning Bolt (7th-level version, 7 charges), Passwall (5 charges), Plane Shift (7 charges), Telekinesis (5 charges), Wall of Fire (4 charges), Web (2 charges).", "You can also use an action to cast one of the following spells from the staff without using any charges: Arcane Lock, Detect Magic, Enlarge/Reduce, Light, Mage Hand, or Protection from Evil and Good."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 },
            { type: 'bonus', target: 'spell_attack', value: 2 }
        ],
        requires_attunement: true,
        attunement_description: "by a sorcerer, warlock, or wizard"
    },
    { 
        index: "staff-of-the-woodlands", name: "Staff of the Woodlands", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 15000, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d6+2", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["You have a +2 bonus to attack and damage rolls made with this magic weapon. While holding it, you have a +2 bonus to spell attack rolls.", "The staff has 10 charges. It regains 1d6 + 4 expended charges daily at dawn.", "Spells. Animal Friendship (1 charge), Awaken (5 charges), Barkskin (2 charges), Locate Animals or Plants (1 charge), Speak with Animals (1 charge), Speak with Plants (3 charges), Wall of Thorns (6 charges).", "You can also use an action to cast the Pass Without Trace spell from the staff without using any charges.", "Tree Form. You can use an action to plant one end of the staff in the earth and turn it into a healthy tree. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius."],
        modifiers: [
            { type: 'bonus', target: 'attack', value: 2 },
            { type: 'bonus', target: 'damage', value: 2 },
            { type: 'bonus', target: 'spell_attack', value: 2 }
        ],
        requires_attunement: true,
        attunement_description: "by a druid"
    },
    { 
        index: "staff-of-withering", name: "Staff of Withering", 
        equipment_category: { index: "weapon", name: "Weapon", url: "" }, 
        cost: { quantity: 20000, unit: "gp" }, 
        weight: 4, 
        rarity: "Rare",
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } }, 
        desc: ["This staff has 3 charges and regains 1d3 expended charges daily at dawn.", "The staff can be wielded as a magic quarterstaff. On a hit, it deals damage as a normal quarterstaff, and you can expend 1 charge to deal an extra 2d10 necrotic damage to the target. In addition, the target must succeed on a DC 15 Constitution saving throw or have disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution."],
        requires_attunement: true,
        attunement_description: "by a cleric, druid, or warlock"
    }
];
