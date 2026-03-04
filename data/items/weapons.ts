
import { EquipmentDetail } from '../../types';

export const WEAPONS: EquipmentDetail[] = [
    // Simple Melee
    {
        index: "club", name: "Club",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "sp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        properties: [{ index: "light", name: "Light", url: "" }]
    },
    {
        index: "dagger", name: "Dagger",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 }
    },
    // Firearms
    {
        index: "pistol", name: "Pistol",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 250, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 30, long: 90 }
    },
    {
        index: "musket", name: "Musket",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 500, unit: "gp" },
        damage: { damage_dice: "1d12", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 10,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 40, long: 120 }
    },
    {
        index: "revolver", name: "Revolver",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 100, unit: "gp" },
        damage: { damage_dice: "2d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "reload", name: "Reload (6 shots)", url: "" }],
        range: { normal: 40, long: 120 }
    },
    {
        index: "rifle", name: "Rifle",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 500, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 8,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }, { index: "reload", name: "Reload (4 shots)", url: "" }],
        range: { normal: 80, long: 240 }
    },
    // ... rest of weapons
    {
        index: "greatclub", name: "Greatclub",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "sp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 10,
        properties: [{ index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "handaxe", name: "Handaxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 2,
        properties: [{ index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 }
    },
    {
        index: "javelin", name: "Javelin",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "sp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        properties: [{ index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 30, long: 120 }
    },
    {
        index: "light-hammer", name: "Light Hammer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        properties: [{ index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 }
    },
    {
        index: "mace", name: "Mace",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 4
    },
    {
        index: "quarterstaff", name: "Quarterstaff",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "sp" },
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 4,
        properties: [{ index: "versatile", name: "Versatile (1d8)", url: "" }]
    },
    {
        index: "sickle", name: "Sickle",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 2,
        properties: [{ index: "light", name: "Light", url: "" }]
    },
    {
        index: "spear", name: "Spear",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        properties: [{ index: "thrown", name: "Thrown", url: "" }, { index: "versatile", name: "Versatile (1d8)", url: "" }],
        range: { normal: 20, long: 60 }
    },
    {
        index: "crossbow-light", name: "Crossbow, Light",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 5,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 80, long: 320 }
    },
    {
        index: "dart", name: "Dart",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "cp" },
        damage: { damage_dice: "1d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 0.25,
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 }
    },
    {
        index: "shortbow", name: "Shortbow",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 80, long: 320 }
    },
    {
        index: "sling", name: "Sling",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "sp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 0,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }],
        range: { normal: 30, long: 120 }
    },
    {
        index: "battleaxe", name: "Battleaxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 4,
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }]
    },
    {
        index: "flail", name: "Flail",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2
    },
    {
        index: "glaive", name: "Glaive",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 20, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "greataxe", name: "Greataxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 30, unit: "gp" },
        damage: { damage_dice: "1d12", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 7,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "greatsword", name: "Greatsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "halberd", name: "Halberd",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 20, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "lance", name: "Lance",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d12", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 6,
        properties: [{ index: "reach", name: "Reach", url: "" }, { index: "special", name: "Special", url: "" }]
    },
    {
        index: "longsword", name: "Longsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }]
    },
    {
        index: "maul", name: "Maul",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 10,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "morningstar", name: "Morningstar",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 4
    },
    {
        index: "pike", name: "Pike",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 18,
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }]
    },
    {
        index: "rapier", name: "Rapier",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        properties: [{ index: "finesse", name: "Finesse", url: "" }]
    },
    {
        index: "scimitar", name: "Scimitar",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }]
    },
    {
        index: "shortsword", name: "Shortsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }]
    },
    {
        index: "trident", name: "Trident",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 4,
        properties: [{ index: "thrown", name: "Thrown", url: "" }, { index: "versatile", name: "Versatile (1d8)", url: "" }],
        range: { normal: 20, long: 60 }
    },
    {
        index: "war-pick", name: "War Pick",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2
    },
    {
        index: "warhammer", name: "Warhammer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }]
    },
    {
        index: "whip", name: "Whip",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "reach", name: "Reach", url: "" }]
    },
    {
        index: "blowgun", name: "Blowgun",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 25, long: 100 }
    },
    {
        index: "crossbow-hand", name: "Crossbow, Hand",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 75, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "light", name: "Light", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 30, long: 120 }
    },
    {
        index: "crossbow-heavy", name: "Crossbow, Heavy",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 18,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "heavy", name: "Heavy", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 100, long: 400 }
    },
    {
        index: "longbow", name: "Longbow",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 150, long: 600 }
    },
    {
        index: "net", name: "Net",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        weight: 3,
        properties: [{ index: "special", name: "Special", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 5, long: 15 }
    },
    {
        index: "derringer", name: "Derringer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 100, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "light", name: "Light", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 20, long: 60 }
    }
];
