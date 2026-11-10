import { EquipmentDetail, InventoryItem, ItemOverrides } from '../types';

const replaceTokens = (value: any, base: string, choice: string): any => {
    if (value === null || value === undefined) return value;
    return JSON.parse(JSON.stringify(value).replaceAll('{base}', base).replaceAll('{choice}', choice));
};

const withCustom = (entries: any[] | undefined) => (entries || []).map(entry => ({ ...entry, _custom: true }));

const stripHomebrewSuffix = (name: any) => typeof name === 'string' ? name.replace(/\s*\(HB\)\s*$/i, '').trim() : name;

export const hasItemOverrides = (item: InventoryItem): boolean => Boolean(item?.overrides && Object.keys(item.overrides).length > 0);

export const mergeInventoryItem = (
    dbRecord: EquipmentDetail | undefined,
    entry: InventoryItem,
    lookup: Map<string, EquipmentDetail>,
): InventoryItem => {
    const overrides: ItemOverrides = entry.overrides || {};
    const customized = hasItemOverrides(entry);
    const instance = {
        id: entry.id,
        quantity: entry.quantity,
        equipped: entry.equipped,
        attuned: entry.attuned,
        isMonkWeapon: entry.isMonkWeapon,
        isPactWeapon: entry.isPactWeapon,
        isKenseiWeapon: entry.isKenseiWeapon,
        isHexWeapon: entry.isHexWeapon,
        isInfusion: entry.isInfusion,
        isShillelagh: entry.isShillelagh,
        isBattleReady: entry.isBattleReady,
        wieldedTwoHanded: entry.wieldedTwoHanded,
    };
    if (!dbRecord) return { ...entry, name: stripHomebrewSuffix(entry.name), overrides: customized ? overrides : undefined, customized };
    if (!customized) {
        return {
            ...dbRecord,
            ...entry,
            name: stripHomebrewSuffix(entry.name || dbRecord.name),
            weight: Number(entry.weight) || Number(dbRecord.weight) || 0,
            cost: entry.cost && (typeof entry.cost !== 'object' || Number(entry.cost.quantity) > 0) ? entry.cost : dbRecord.cost,
            customized: false,
        };
    }

    const baseIndex = overrides.base_item || entry.base_item || (dbRecord as any).base_item;
    const base = baseIndex ? lookup.get(String(baseIndex).toLowerCase()) : undefined;
    const template = (dbRecord as any).template || (entry as any).template;
    const templateOverrides = template?.overrides || {};
    const baseSource: any = base && base.index !== dbRecord.index ? base : {};
    const merged: any = {
        ...baseSource,
        ...dbRecord,
        ...templateOverrides,
        ...instance,
        ...overrides,
        notes: overrides.notes ?? (entry as any).notes,
        customNotes: overrides.notes || (entry as any).customNotes,
        index: dbRecord.index,
        base_item: base?.index || (dbRecord as any).base_item || entry.base_item,
        overrides,
        customized: true,
    };
    merged.name = stripHomebrewSuffix(merged.name);
    if (base?.index && base.index !== dbRecord.index) {
        merged.damage = base.damage || merged.damage;
        merged.properties = base.properties?.length ? base.properties : merged.properties;
        merged.mastery = base.mastery || merged.mastery;
        merged.range = base.range || merged.range;
        merged.versatileDamage = base.versatileDamage || merged.versatileDamage;
        merged.weapon_category = base.weapon_category || merged.weapon_category;
        merged.weapon_range = base.weapon_range || merged.weapon_range;
        merged.armor_class = base.armor_class || merged.armor_class;
        merged.armor_category = base.armor_category || merged.armor_category;
        merged.weight = Number(overrides.weight ?? base.weight ?? dbRecord.weight ?? 0) || 0;
        merged.cost = base.cost || merged.cost;
        const keepCustomName = Boolean(overrides.name && overrides.name !== dbRecord.name);
        merged.name = keepCustomName
            ? overrides.name!
            : String(template?.name_pattern || base.name).replaceAll('{base}', base.name).replaceAll('{choice}', overrides.choice_value || '');
        merged.weight = Number(overrides.weight ?? base?.weight ?? dbRecord.weight ?? 0) || 0;
    } else {
        merged.name = overrides.name || dbRecord.name;
    }
    merged.name = String(merged.name)
        .replaceAll('{base}', base?.name || '')
        .replaceAll('{choice}', overrides.choice_value || '');
    merged.modifiers = [
        ...((baseSource.modifiers) || []),
        ...((dbRecord.modifiers) || []),
        ...withCustom(overrides.modifiers),
    ];
    merged.effects = [
        ...((baseSource.effects) || []),
        ...((dbRecord.effects) || []),
        ...withCustom(overrides.effects),
    ];
    merged.resources = [
        ...((baseSource.resources) || []),
        ...((dbRecord.resources) || []),
        ...withCustom(overrides.resources),
    ];
    if (overrides.weight !== undefined) merged.weight = Number(overrides.weight);
    if (overrides.rarity !== undefined) merged.rarity = overrides.rarity;
    if (overrides.requires_attunement !== undefined) merged.requires_attunement = overrides.requires_attunement;
    const replaced = replaceTokens(merged, base?.name || '', overrides.choice_value || '');
    replaced.name = stripHomebrewSuffix(replaced.name);
    if ((!replaced.weight || Number(replaced.weight) === 0) && Number(dbRecord.weight) > 0) replaced.weight = dbRecord.weight;
    if ((!replaced.cost || (typeof replaced.cost === 'object' && !Number(replaced.cost.quantity))) && dbRecord.cost) replaced.cost = dbRecord.cost;
    return replaced;
};
