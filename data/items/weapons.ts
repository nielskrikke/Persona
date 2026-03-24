
import { EquipmentDetail } from '../../types';

export const WEAPONS: EquipmentDetail[] = [
    // Simple Melee
    {
        index: "club", name: "Club",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "sp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "light", name: "Light", url: "" }],
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    {
        index: "dagger", name: "Dagger",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 },
        mastery: { index: "nick", name: "Nick", url: "" }
    },
    {
        index: "greatclub", name: "Greatclub",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "sp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 10,
        rarity: "Common",
        properties: [{ index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "push", name: "Push", url: "" }
    },
    {
        index: "handaxe", name: "Handaxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "javelin", name: "Javelin",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "sp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 30, long: 120 },
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    {
        index: "light-hammer", name: "Light Hammer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "light", name: "Light", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 },
        mastery: { index: "nick", name: "Nick", url: "" }
    },
    {
        index: "mace", name: "Mace",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 4,
        rarity: "Common",
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    {
        index: "quarterstaff", name: "Quarterstaff",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "sp" },
        damage: { damage_dice: "1d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 4,
        rarity: "Common",
        properties: [{ index: "versatile", name: "Versatile (1d8)", url: "" }],
        versatileDamage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "sickle", name: "Sickle",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "light", name: "Light", url: "" }],
        mastery: { index: "nick", name: "Nick", url: "" }
    },
    {
        index: "spear", name: "Spear",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "thrown", name: "Thrown", url: "" }, { index: "versatile", name: "Versatile (1d8)", url: "" }],
        versatileDamage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        range: { normal: 20, long: 60 },
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    // Simple Ranged
    {
        index: "crossbow-light", name: "Crossbow, Light",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 5,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 80, long: 320 },
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    {
        index: "dart", name: "Dart",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "cp" },
        damage: { damage_dice: "1d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 0.25,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        range: { normal: 20, long: 60 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "shortbow", name: "Shortbow",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 80, long: 320 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "sling", name: "Sling",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "sp" },
        damage: { damage_dice: "1d4", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 0,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }],
        range: { normal: 30, long: 120 },
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    // Martial Melee
    {
        index: "battleaxe", name: "Battleaxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 4,
        rarity: "Common",
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }],
        versatileDamage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "flail", name: "Flail",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        rarity: "Common",
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    {
        index: "glaive", name: "Glaive",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 20, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "graze", name: "Graze", url: "" }
    },
    {
        index: "greataxe", name: "Greataxe",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 30, unit: "gp" },
        damage: { damage_dice: "1d12", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 7,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "cleave", name: "Cleave", url: "" }
    },
    {
        index: "greatsword", name: "Greatsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "graze", name: "Graze", url: "" }
    },
    {
        index: "halberd", name: "Halberd",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 20, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 6,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "cleave", name: "Cleave", url: "" }
    },
    {
        index: "lance", name: "Lance",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 6,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "special", name: "Special", url: "" }],
        specialDescription: "You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.",
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "longsword", name: "Longsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }],
        versatileDamage: { damage_dice: "1d10", damage_type: { index: "slashing", name: "Slashing" } },
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    {
        index: "maul", name: "Maul",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 10,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "morningstar", name: "Morningstar",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 4,
        rarity: "Common",
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    {
        index: "pike", name: "Pike",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 18,
        rarity: "Common",
        properties: [{ index: "heavy", name: "Heavy", url: "" }, { index: "reach", name: "Reach", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        mastery: { index: "push", name: "Push", url: "" }
    },
    {
        index: "rapier", name: "Rapier",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }],
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "scimitar", name: "Scimitar",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 25, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }],
        mastery: { index: "nick", name: "Nick", url: "" }
    },
    {
        index: "shortsword", name: "Shortsword",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "light", name: "Light", url: "" }],
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "trident", name: "Trident",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 4,
        rarity: "Common",
        properties: [{ index: "thrown", name: "Thrown", url: "" }, { index: "versatile", name: "Versatile (1d10)", url: "" }],
        versatileDamage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        range: { normal: 20, long: 60 },
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "war-pick", name: "War Pick",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 5, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        mastery: { index: "sap", name: "Sap", url: "" }
    },
    {
        index: "warhammer", name: "Warhammer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 15, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "versatile", name: "Versatile (1d10)", url: "" }],
        versatileDamage: { damage_dice: "1d10", damage_type: { index: "bludgeoning", name: "Bludgeoning" } },
        mastery: { index: "topple", name: "Topple", url: "" }
    },
    {
        index: "whip", name: "Whip",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 2, unit: "gp" },
        damage: { damage_dice: "1d4", damage_type: { index: "slashing", name: "Slashing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "finesse", name: "Finesse", url: "" }, { index: "reach", name: "Reach", url: "" }],
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    // Martial Ranged
    {
        index: "blowgun", name: "Blowgun",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 10, unit: "gp" },
        damage: { damage_dice: "1", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 25, long: 100 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "crossbow-hand", name: "Crossbow, Hand",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 75, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "light", name: "Light", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 30, long: 120 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "crossbow-heavy", name: "Crossbow, Heavy",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 18,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "heavy", name: "Heavy", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 100, long: 400 },
        mastery: { index: "push", name: "Push", url: "" }
    },
    {
        index: "longbow", name: "Longbow",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 50, unit: "gp" },
        damage: { damage_dice: "1d8", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 2,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "heavy", name: "Heavy", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 150, long: 600 },
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    {
        index: "net", name: "Net",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 1, unit: "gp" },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "special", name: "Special", url: "" }, { index: "thrown", name: "Thrown", url: "" }],
        specialDescription: "A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.",
        range: { normal: 5, long: 15 }
    },
    // Firearms
    {
        index: "pistol", name: "Pistol",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 250, unit: "gp" },
        damage: { damage_dice: "1d10", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 30, long: 90 },
        mastery: { index: "vex", name: "Vex", url: "" }
    },
    {
        index: "musket", name: "Musket",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 500, unit: "gp" },
        damage: { damage_dice: "1d12", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 10,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "loading", name: "Loading", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }],
        range: { normal: 40, long: 120 },
        mastery: { index: "slow", name: "Slow", url: "" }
    },
    {
        index: "revolver", name: "Revolver",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 100, unit: "gp" },
        damage: { damage_dice: "2d4", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 3,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "reload", name: "Reload (6 shots)", url: "" }],
        range: { normal: 40, long: 120 }
    },
    {
        index: "rifle", name: "Rifle",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 500, unit: "gp" },
        damage: { damage_dice: "2d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 8,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "two-handed", name: "Two-Handed", url: "" }, { index: "reload", name: "Reload (4 shots)", url: "" }],
        range: { normal: 80, long: 240 }
    },
    {
        index: "derringer", name: "Derringer",
        equipment_category: { index: "weapon", name: "Weapon", url: "" },
        cost: { quantity: 100, unit: "gp" },
        damage: { damage_dice: "1d6", damage_type: { index: "piercing", name: "Piercing" } },
        weight: 1,
        rarity: "Common",
        properties: [{ index: "ammunition", name: "Ammunition", url: "" }, { index: "light", name: "Light", url: "" }, { index: "loading", name: "Loading", url: "" }],
        range: { normal: 20, long: 60 }
    }
];
