
import { EquipmentDetail } from '../../types';

export const ARMOR: EquipmentDetail[] = [
    // Light Armor
    {
        index: "padded-armor", name: "Padded Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 5, unit: "gp" },
        weight: 8,
        rarity: "Common",
        armor_class: { base: 11, dex_bonus: true, max_bonus: null },
        desc: ["Disadvantage on Stealth checks."]
    },
    {
        index: "leather-armor", name: "Leather Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 10, unit: "gp" },
        weight: 10,
        rarity: "Common",
        armor_class: { base: 11, dex_bonus: true, max_bonus: null }
    },
    {
        index: "studded-leather-armor", name: "Studded Leather Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 45, unit: "gp" },
        weight: 13,
        rarity: "Common",
        armor_class: { base: 12, dex_bonus: true, max_bonus: null }
    },

    // Medium Armor
    {
        index: "hide-armor", name: "Hide Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 10, unit: "gp" },
        weight: 12,
        rarity: "Common",
        armor_class: { base: 12, dex_bonus: true, max_bonus: 2 }
    },
    {
        index: "chain-shirt", name: "Chain Shirt",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 50, unit: "gp" },
        weight: 20,
        rarity: "Common",
        armor_class: { base: 13, dex_bonus: true, max_bonus: 2 }
    },
    {
        index: "scale-mail", name: "Scale Mail",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 50, unit: "gp" },
        weight: 45,
        rarity: "Common",
        armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
        desc: ["Disadvantage on Stealth checks."]
    },
    {
        index: "breastplate", name: "Breastplate",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 400, unit: "gp" },
        weight: 20,
        rarity: "Common",
        armor_class: { base: 14, dex_bonus: true, max_bonus: 2 }
    },
    {
        index: "half-plate", name: "Half Plate",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 750, unit: "gp" },
        weight: 40,
        rarity: "Common",
        armor_class: { base: 15, dex_bonus: true, max_bonus: 2 },
        desc: ["Disadvantage on Stealth checks."]
    },

    // Heavy Armor
    {
        index: "ring-mail", name: "Ring Mail",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 30, unit: "gp" },
        weight: 40,
        rarity: "Common",
        armor_class: { base: 14, dex_bonus: false, max_bonus: null },
        desc: ["Disadvantage on Stealth checks."]
    },
    {
        index: "chain-mail", name: "Chain Mail",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 75, unit: "gp" },
        weight: 55,
        rarity: "Common",
        armor_class: { base: 16, dex_bonus: false, max_bonus: null },
        desc: ["Disadvantage on Stealth checks. Strength 13 required."]
    },
    {
        index: "splint-armor", name: "Splint Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 200, unit: "gp" },
        weight: 60,
        rarity: "Common",
        armor_class: { base: 17, dex_bonus: false, max_bonus: null },
        desc: ["Disadvantage on Stealth checks. Strength 15 required."]
    },
    {
        index: "plate-armor", name: "Plate Armor",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 1500, unit: "gp" },
        weight: 65,
        rarity: "Common",
        armor_class: { base: 18, dex_bonus: false, max_bonus: null },
        desc: ["Disadvantage on Stealth checks. Strength 15 required."]
    },

    // Shield
    {
        index: "shield", name: "Shield",
        equipment_category: { index: "armor", name: "Armor", url: "" },
        cost: { quantity: 10, unit: "gp" },
        weight: 6,
        rarity: "Common",
        armor_class: { base: 2, dex_bonus: false, max_bonus: null } // +2 AC
    }
];
