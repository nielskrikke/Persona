
import { EquipmentDetail } from '../../types';

export const MAGIC_ARMOR: EquipmentDetail[] = [
    // +1/2/3 Variants
    { 
        index: "leather-armor-plus-1", name: "Leather Armor +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 1500, unit: "gp" }, 
        weight: 10, 
        rarity: "Rare",
        armor_class: { base: 12, dex_bonus: true, max_bonus: null },
        desc: ["You have a +1 bonus to AC while wearing this armor."]
    },
    { 
        index: "chain-shirt-plus-1", name: "Chain Shirt +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 1500, unit: "gp" }, 
        weight: 20, 
        rarity: "Rare",
        armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
        desc: ["You have a +1 bonus to AC while wearing this armor."]
    },
    { 
        index: "scale-mail-plus-1", name: "Scale Mail +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 1500, unit: "gp" }, 
        weight: 45, 
        rarity: "Rare",
        armor_class: { base: 15, dex_bonus: true, max_bonus: 2 }, 
        desc: ["You have a +1 bonus to AC while wearing this armor. Disadvantage on Stealth checks."] 
    },
    { 
        index: "chain-mail-plus-1", name: "Chain Mail +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 1500, unit: "gp" }, 
        weight: 55, 
        rarity: "Rare",
        armor_class: { base: 17, dex_bonus: false, max_bonus: null }, 
        desc: ["You have a +1 bonus to AC while wearing this armor. Disadvantage on Stealth checks. Strength 13 required."] 
    },
    { 
        index: "plate-armor-plus-1", name: "Plate Armor +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 2500, unit: "gp" }, 
        weight: 65, 
        rarity: "Rare",
        armor_class: { base: 19, dex_bonus: false, max_bonus: null }, 
        desc: ["You have a +1 bonus to AC while wearing this armor. Disadvantage on Stealth checks. Strength 15 required."] 
    },
    { 
        index: "shield-plus-1", name: "Shield +1", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 1500, unit: "gp" }, 
        weight: 6, 
        rarity: "Uncommon",
        armor_class: { base: 3, dex_bonus: false, max_bonus: null },
        desc: ["You have a +1 bonus to AC while holding this shield."]
    },
    { 
        index: "armor-plus-2", name: "Armor +2", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 6000, unit: "gp" }, 
        weight: 0, 
        rarity: "Very Rare",
        desc: ["You have a +2 bonus to AC while wearing this armor."],
        modifiers: [{ type: 'bonus', target: 'ac', value: 2 }]
    },
    { 
        index: "shield-plus-2", name: "Shield +2", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 6000, unit: "gp" }, 
        weight: 6, 
        rarity: "Rare",
        armor_class: { base: 4, dex_bonus: false, max_bonus: null },
        desc: ["You have a +2 bonus to AC while holding this shield."]
    },
    { 
        index: "armor-plus-3", name: "Armor +3", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 25000, unit: "gp" }, 
        weight: 0, 
        rarity: "Legendary",
        desc: ["You have a +3 bonus to AC while wearing this armor."],
        modifiers: [{ type: 'bonus', target: 'ac', value: 3 }]
    },
    { 
        index: "shield-plus-3", name: "Shield +3", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 25000, unit: "gp" }, 
        weight: 6, 
        rarity: "Very Rare",
        armor_class: { base: 5, dex_bonus: false, max_bonus: null },
        desc: ["You have a +3 bonus to AC while holding this shield."]
    },

    // Special Armor
    { 
        index: "adamantine-plate", name: "Adamantine Plate Armor", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 65, 
        rarity: "Uncommon",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null },
        desc: ["This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit."],
        modifiers: [{ type: 'immunity', target: 'immunity', filter: 'Critical Hits', value: 1 }]
    },
    { 
        index: "mithral-plate", name: "Mithral Plate Armor", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 800, unit: "gp" }, 
        weight: 32, // Halved weight
        rarity: "Uncommon",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null },
        desc: ["Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't."]
    },
    {
        index: "demon-armor", name: "Demon Armor", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 20000, unit: "gp" }, 
        weight: 65,
        rarity: "Very Rare",
        armor_class: { base: 19, dex_bonus: false, max_bonus: null }, // +1 plate
        desc: ["While wearing this armor, you have a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor's clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack rolls and damage rolls and a damage die of 1d8.", "Curse. Once you don this cursed armor, you can't doff it unless you are targeted by the remove curse spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities."],
        requires_attunement: true
    },
    {
        index: "glamoured-studded-leather", name: "Glamoured Studded Leather", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 4500, unit: "gp" }, 
        weight: 13,
        rarity: "Rare",
        armor_class: { base: 13, dex_bonus: true, max_bonus: null }, // +1 standard
        desc: ["While wearing this armor, you gain a +1 bonus to AC. You can also use a bonus action to speak the armor's command word and cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like, including color, style, and accessories, but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or remove the armor."]
    },
    {
        index: "elven-chain", name: "Elven Chain", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 20,
        rarity: "Rare",
        armor_class: { base: 14, dex_bonus: true, max_bonus: 2 }, // +1 chain shirt
        desc: ["You have a +1 bonus to AC while wearing this armor. You are considered proficient with this armor even if you lack proficiency with medium armor."]
    },
    {
        index: "dragon-scale-mail", name: "Dragon Scale Mail", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 30000, unit: "gp" }, 
        weight: 45,
        rarity: "Very Rare",
        armor_class: { base: 15, dex_bonus: true, max_bonus: 2 }, // +1 scale mail
        desc: ["While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of dragon that provided the scales."],
        requires_attunement: true
    },
    {
        index: "dwarven-plate", name: "Dwarven Plate", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 45000, unit: "gp" }, 
        weight: 65,
        rarity: "Very Rare",
        armor_class: { base: 20, dex_bonus: false, max_bonus: null }, // +2 plate
        desc: ["While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet."]
    },
    {
        index: "mariners-armor", name: "Mariner's Armor", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 10, // Varies
        rarity: "Uncommon",
        armor_class: { base: 11, dex_bonus: true, max_bonus: null }, // Placeholder for Leather
        desc: ["While wearing this armor, you have a swimming speed equal to your walking speed. In addition, whenever you start your turn underwater with 0 hit points, the armor causes you to rise 60 feet toward the surface."],
        modifiers: [{ type: 'set', target: 'speed', value: 0 }] // Special logic needed for "swim = walk", simplistic placeholder
    },
    {
        index: "armor-of-invulnerability", name: "Armor of Invulnerability", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 120000, unit: "gp" }, 
        weight: 65,
        rarity: "Legendary",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null }, // Plate
        desc: ["You have resistance to nonmagical damage while you wear this armor. Additionally, you can use an action to make yourself immune to nonmagical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can't be used again until the next dawn."],
        modifiers: [{ type: 'resistance', target: 'resistance', filter: 'Nonmagical Damage', value: 1 }],
        requires_attunement: true
    },
    {
        index: "armor-of-resistance", name: "Armor of Resistance", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 6000, unit: "gp" }, 
        weight: 0, // Varies
        rarity: "Rare",
        desc: ["You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly."],
        requires_attunement: true
    },
    {
        index: "armor-of-vulnerability", name: "Armor of Vulnerability", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 2000, unit: "gp" }, 
        weight: 65, // Plate usually
        rarity: "Rare",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null },
        desc: ["While wearing this armor, you have resistance to one of the following damage types: bludgeoning, piercing, or slashing. However, you are vulnerable to the other two types.", "Curse. This armor is cursed, a fact that is revealed only when an identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the remove curse spell or similar magic. You can't remove the armor while you're cursed."],
        requires_attunement: true
    },
    {
        index: "plate-armor-of-etherealness", name: "Plate Armor of Etherealness", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 60000, unit: "gp" }, 
        weight: 65,
        rarity: "Legendary",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null },
        desc: ["While wearing this armor, you can speak its command word as an action to gain the effect of the etherealness spell, which last for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can't be used again until the next dawn."],
        requires_attunement: true
    },
    {
        index: "sentinel-shield", name: "Sentinel Shield", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 500, unit: "gp" }, 
        weight: 6,
        rarity: "Uncommon",
        armor_class: { base: 2, dex_bonus: false, max_bonus: null },
        desc: ["While holding this shield, you have advantage on initiative rolls and Wisdom (Perception) checks. The shield is emblazoned with a symbol of an eye."],
        modifiers: [
            { type: 'bonus', target: 'passive_perception', value: 5 },
            { type: 'advantage', target: 'initiative', filter: 'Initiative', value: 1 },
            { type: 'advantage', target: 'skills', filter: 'Perception', value: 1 }
        ]
    },
    {
        index: "shield-of-missile-attraction", name: "Shield of Missile Attraction", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 3000, unit: "gp" }, 
        weight: 6,
        rarity: "Rare",
        armor_class: { base: 2, dex_bonus: false, max_bonus: null },
        desc: ["While holding this shield, you have resistance to damage from ranged weapon attacks.", "Curse. This shield is cursed. Attuning to it curses you until you are targeted by the remove curse spell or similar magic. Removing the shield fails to end the curse. Whenever a ranged weapon attack is made against a target within 10 feet of you, the curse causes you to become the target instead."],
        modifiers: [{ type: 'resistance', target: 'resistance', filter: 'Ranged Weapon Damage', value: 1 }],
        requires_attunement: true
    },
    {
        index: "animated-shield", name: "Animated Shield", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 45000, unit: "gp" }, 
        weight: 6,
        rarity: "Very Rare",
        armor_class: { base: 2, dex_bonus: false, max_bonus: null },
        desc: ["While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you die or are incapacitated, at which point it falls to the ground or into your hand if you have one free."],
        requires_attunement: true
    },
    {
        index: "arrow-catching-shield", name: "Arrow-Catching Shield", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 4000, unit: "gp" }, 
        weight: 6,
        rarity: "Rare",
        armor_class: { base: 4, dex_bonus: false, max_bonus: null }, // +2 base, +2 vs ranged
        desc: ["You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield's normal bonus to AC. In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead."],
        requires_attunement: true
    },
    {
        index: "spellguard-shield", name: "Spellguard Shield", 
        equipment_category: { index: "armor", name: "Armor", url: "" }, 
        cost: { quantity: 50000, unit: "gp" }, 
        weight: 6,
        rarity: "Very Rare",
        armor_class: { base: 2, dex_bonus: false, max_bonus: null },
        desc: ["While holding this shield, you have advantage on saving throws against spells and other magical effects, and spell attacks have disadvantage against you."],
        modifiers: [
            { type: 'advantage', target: 'saves', filter: 'Spells', value: 1 }
        ],
        requires_attunement: true
    }
];
