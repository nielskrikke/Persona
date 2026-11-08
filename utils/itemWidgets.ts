import { InventoryItem, ItemWidget } from '../types';

const ROBE_PATCHES: ItemWidget = {
    type: 'patches',
    name: 'Robe Patches',
    patches: [
        { name: 'Bullseye Lantern (filled and lit)', quantity: 2, itemIndex: 'lantern-bullseye' },
        { name: 'Dagger', quantity: 2, itemIndex: 'dagger' },
        { name: 'Mirror', quantity: 2, itemIndex: 'mirror-steel' },
        { name: 'Pole (10 ft.)', quantity: 2, itemIndex: 'pole' },
        { name: 'Rope (coiled, 50 ft.)', quantity: 2, itemIndex: 'rope-hempen' },
        { name: 'Sack', quantity: 2, itemIndex: 'sack' },
    ],
};

export const getItemWidgets = (item: any): ItemWidget[] => {
    if (Array.isArray(item?.widgets) && item.widgets.length > 0) return item.widgets;
    const index = String(item?.index || '').toLowerCase();
    const name = String(item?.name || '').toLowerCase();
    if (index === 'ring-of-spell-storing' || name.includes('ring of spell storing')) {
        return [{ type: 'spell_storage', name: 'Stored Spells', capacity: 5, storedSpells: [] }];
    }
    if (index === 'robe-of-useful-items' || name.includes('robe of useful items')) {
        return [{ ...ROBE_PATCHES, patches: ROBE_PATCHES.patches?.map(patch => ({ ...patch })) }];
    }
    return [];
};

export const withItemWidgets = (item: InventoryItem, widgets: ItemWidget[]): InventoryItem => ({
    ...item,
    widgets,
});

export const storedSpellLevels = (widget: ItemWidget): number =>
    (widget.storedSpells || []).reduce((sum, spell) => sum + Math.max(1, Number(spell.castLevel || spell.level || 1)), 0);
