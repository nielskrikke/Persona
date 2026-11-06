import React, { useEffect, useMemo, useState } from 'react';
import { EquipmentDetail, SpellDetail } from '../../../types';
import { fetchAllSpells } from '../../../data/index';

interface ItemCustomizationModalProps {
    item: EquipmentDetail;
    allItems: EquipmentDetail[];
    onClose: () => void;
    onConfirm: (item: EquipmentDetail) => void;
}

const replaceTokens = (value: any, base: string, choice: string): any => {
    if (value === null || value === undefined) return value;
    const serialized = JSON.stringify(value)
        .replaceAll('{base}', base)
        .replaceAll('{choice}', choice);
    return JSON.parse(serialized);
};

const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({ item, allItems, onClose, onConfirm }) => {
    const template = (item as any).template;
    const baseOptions = (template?.base_items || []).map((index: string) => allItems.find(entry => entry.index === index)).filter(Boolean) as EquipmentDetail[];
    const [baseIndex, setBaseIndex] = useState(baseOptions[0]?.index || (item as any).base_item || item.index);
    const choiceConfig = (item as any).choice || template?.choice;
    const choiceOptions = choiceConfig?.options || [];
    const [choice, setChoice] = useState<string>(choiceOptions[0] || '');
    const [spells, setSpells] = useState<SpellDetail[]>([]);
    const [spellIndex, setSpellIndex] = useState('');
    const isSpellTemplate = template?.type === 'spell';

    useEffect(() => {
        if (!isSpellTemplate) return;
        fetchAllSpells().then(all => {
            const filtered = all.filter(spell => template?.filter?.level === undefined || spell.level === Number(template.filter.level));
            setSpells(filtered);
            setSpellIndex(filtered[0]?.index || '');
        });
    }, [isSpellTemplate, template?.filter?.level]);

    const base = useMemo(() => allItems.find(entry => entry.index === baseIndex) || allItems.find(entry => entry.index === item.index) || item,
        [allItems, baseIndex, item]);

    const resolve = () => {
        const selectedSpell = spells.find(spell => spell.index === spellIndex);
        const pattern = template?.name_pattern || (item as any).name_pattern || item.name;
        const resolvedName = String(pattern)
            .replaceAll('{base}', base.name)
            .replaceAll('{choice}', choice || base.name)
            .replaceAll('{spell}', selectedSpell?.name || 'Spell');
        const merged: any = replaceTokens({
            ...base,
            ...item,
            ...(template?.overrides || {}),
            damage: item.damage || base.damage,
            properties: item.properties?.length ? item.properties : base.properties,
            mastery: item.mastery || base.mastery,
            range: item.range || base.range,
            versatileDamage: item.versatileDamage || base.versatileDamage,
            weapon_category: item.weapon_category || base.weapon_category,
            weapon_range: item.weapon_range || base.weapon_range,
            armor_class: item.armor_class || base.armor_class,
            armor_category: item.armor_category || base.armor_category,
            weight: Number(item.weight) || Number((template?.overrides || {}).weight) || Number(base.weight) || 0,
            name: resolvedName,
            base_item: base.index,
            is_magic: true,
            ...(selectedSpell ? {
                spell_index: selectedSpell.index,
                spell_name: selectedSpell.name,
                effects: [
                    ...(item.effects || []),
                    { type: 'spell_access', spell: selectedSpell.index, spell_name: selectedSpell.name, cast_level: Number(template?.filter?.level || selectedSpell.level) },
                ],
            } : {}),
        }, base.name, choice || base.name);
        merged.id = `${merged.index || item.index}-${Date.now()}`;
        merged.quantity = 1;
        merged.equipped = false;
        merged.attuned = false;
        if (choice) merged.choice_value = choice;
        delete merged.template;
        onConfirm(merged);
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#1b1c20] p-6 space-y-5" onClick={e => e.stopPropagation()}>
                <div>
                    <h3 className="font-serif text-xl text-dnd-gold">Customize {item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Choose the base item and any required option.</p>
                </div>
                {baseOptions.length > 0 && (
                    <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Base Item</span>
                        <select value={baseIndex} onChange={e => setBaseIndex(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white">
                            {baseOptions.map(option => <option key={option.index} value={option.index}>{option.name}</option>)}
                        </select>
                    </label>
                )}
                {isSpellTemplate && (
                    <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scroll Spell</span>
                        <select value={spellIndex} onChange={e => setSpellIndex(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white">
                            {spells.map(spell => <option key={spell.index} value={spell.index}>{spell.name}</option>)}
                        </select>
                    </label>
                )}
                {choiceOptions.length > 0 && (
                    <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{choiceConfig?.label || 'Choice'}</span>
                        <select value={choice} onChange={e => setChoice(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white">
                            {choiceOptions.map((option: string) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </label>
                )}
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="rounded-xl border border-gray-700 px-4 py-2 text-xs font-bold text-gray-400">Cancel</button>
                    <button type="button" onClick={resolve} className="rounded-xl bg-dnd-gold px-4 py-2 text-xs font-black uppercase tracking-widest text-black">Add Item</button>
                </div>
            </div>
        </div>
    );
};

export default ItemCustomizationModal;
