
import { WEAPONS } from './weapons';
import { ARMOR } from './armor';
import { ADVENTURING_GEAR } from './gear';
import { TOOLS } from './tools';
import { CONSUMABLES } from './consumables';
import { MAGIC_WEAPONS } from './magic-weapons';
import { MAGIC_ARMOR } from './magic-armor';
import { WONDROUS_ITEMS } from './wondrous';
import { EquipmentDetail } from '../../types';

export const ALL_ITEMS: EquipmentDetail[] = [
    ...WEAPONS,
    ...ARMOR,
    ...ADVENTURING_GEAR,
    ...TOOLS,
    ...CONSUMABLES,
    ...MAGIC_WEAPONS,
    ...MAGIC_ARMOR,
    ...WONDROUS_ITEMS
];

export const getItem = (index: string): EquipmentDetail | undefined => {
    return ALL_ITEMS.find(item => item.index === index);
};

export const getItemsByCategory = (category: string): EquipmentDetail[] => {
    return ALL_ITEMS.filter(item => item.equipment_category.index === category || item.equipment_category.name === category);
};

export const searchItems = (query: string): EquipmentDetail[] => {
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(item => item.name.toLowerCase().includes(q));
};
