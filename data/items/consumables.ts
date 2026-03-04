
import { EquipmentDetail } from '../../types';

export const CONSUMABLES: EquipmentDetail[] = [
    // Potions
    { index: "potion-healing", name: "Potion of Healing", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 50, unit: "gp" }, weight: 0.5, desc: ["You regain 2d4 + 2 hit points when you drink this potion."] },
    { index: "potion-healing-greater", name: "Potion of Healing (Greater)", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 150, unit: "gp" }, weight: 0.5, desc: ["You regain 4d4 + 4 hit points when you drink this potion."] },
    { index: "potion-healing-superior", name: "Potion of Healing (Superior)", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 450, unit: "gp" }, weight: 0.5, desc: ["You regain 8d4 + 8 hit points when you drink this potion."] },
    { index: "potion-healing-supreme", name: "Potion of Healing (Supreme)", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 1350, unit: "gp" }, weight: 0.5, desc: ["You regain 10d4 + 20 hit points when you drink this potion."] },
    { index: "potion-climbing", name: "Potion of Climbing", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 75, unit: "gp" }, weight: 0.5, desc: ["Gain a climbing speed equal to your walking speed for 1 hour."] },
    { index: "potion-invisibility", name: "Potion of Invisibility", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0.5, desc: ["Become invisible for 1 hour. Ends if you attack or cast a spell."] },
    { index: "potion-water-breathing", name: "Potion of Water Breathing", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 200, unit: "gp" }, weight: 0.5, desc: ["Breathe underwater for 1 hour."] },
    { index: "potion-speed", name: "Potion of Speed", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0.5, desc: ["Gain the effect of the Haste spell for 1 minute (no concentration)."] },
    { index: "potion-heroism", name: "Potion of Heroism", equipment_category: { index: "potion", name: "Potion", url: "" }, cost: { quantity: 200, unit: "gp" }, weight: 0.5, desc: ["Gain 10 temp HP and bless effect for 1 hour."] },
    
    // Scrolls
    { index: "spell-scroll-cantrip", name: "Spell Scroll (Cantrip)", equipment_category: { index: "scroll", name: "Scroll", url: "" }, cost: { quantity: 10, unit: "gp" }, weight: 0, desc: ["A spell scroll bearing the words of a cantrip."] },
    { index: "spell-scroll-level-1", name: "Spell Scroll (Level 1)", equipment_category: { index: "scroll", name: "Scroll", url: "" }, cost: { quantity: 50, unit: "gp" }, weight: 0, desc: ["A spell scroll bearing the words of a 1st-level spell."] },
    { index: "spell-scroll-level-2", name: "Spell Scroll (Level 2)", equipment_category: { index: "scroll", name: "Scroll", url: "" }, cost: { quantity: 250, unit: "gp" }, weight: 0, desc: ["A spell scroll bearing the words of a 2nd-level spell."] },
    { index: "spell-scroll-level-3", name: "Spell Scroll (Level 3)", equipment_category: { index: "scroll", name: "Scroll", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, desc: ["A spell scroll bearing the words of a 3rd-level spell."] },

    // Magic Ammo
    { index: "arrow-plus-1", name: "Arrow +1", equipment_category: { index: "ammunition", name: "Ammunition", url: "" }, cost: { quantity: 20, unit: "gp" }, weight: 0.05, desc: ["You have a +1 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical."] },
    { index: "bolt-plus-1", name: "Crossbow Bolt +1", equipment_category: { index: "ammunition", name: "Ammunition", url: "" }, cost: { quantity: 20, unit: "gp" }, weight: 0.075, desc: ["You have a +1 bonus to attack and damage rolls made with this piece of magic ammunition."] },

    // Oils & Dusts
    { index: "oil-of-sharpness", name: "Oil of Sharpness", equipment_category: { index: "oil", name: "Oil", url: "" }, cost: { quantity: 1500, unit: "gp" }, weight: 0.5, desc: ["Coat one weapon/5 ammo. For 1 hour, it is magical +3."] },
    { index: "dust-of-disappearance", name: "Dust of Disappearance", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["You and creatures within 10 feet become invisible for 2d4 minutes."] }
];
