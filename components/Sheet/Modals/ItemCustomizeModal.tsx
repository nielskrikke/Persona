import React, { useState } from 'react';
import { EquipmentDetail, InventoryItem, ItemOverrides } from '../../../types';

interface ExtraDamage {
    dice: string;
    type: string;
    condition: 'always' | 'vs' | 'requires_toggle' | 'natural_20';
    value: string;
}

interface ItemCustomizeModalProps {
    item: InventoryItem;
    allItems: EquipmentDetail[];
    onClose: () => void;
    onSave: (overrides: ItemOverrides) => void;
    onReset: () => void;
    onSaveHomebrew: (name: string, isPublic: boolean) => void;
}

const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({ item, allItems, onClose, onSave, onReset, onSaveHomebrew }) => {
    const overrides: any = item.overrides || {};
    const [name, setName] = useState(overrides.name || item.name);
    const [notes, setNotes] = useState(overrides.notes || item.customNotes || '');
    const [baseItem, setBaseItem] = useState(overrides.base_item || item.base_item || '');
    const [attackBonus, setAttackBonus] = useState(Number((overrides.modifiers || []).find((m: any) => m.target === 'attack')?.value || 0));
    const [damageBonus, setDamageBonus] = useState(Number((overrides.modifiers || []).find((m: any) => m.target === 'damage')?.value || 0));
    const [acBonus, setAcBonus] = useState(Number((overrides.modifiers || []).find((m: any) => m.target === 'ac')?.value || 0));
    const initialEffects = overrides.effects || [];
    const [resistances, setResistances] = useState((initialEffects.filter((e: any) => e.type === 'resistance').map((e: any) => e.value || e.filter || '')).join(', '));
    const [immunities, setImmunities] = useState((initialEffects.filter((e: any) => e.type === 'immunity').map((e: any) => e.value || e.filter || '')).join(', '));
    const [advantages, setAdvantages] = useState((initialEffects.filter((e: any) => e.type === 'advantage').map((e: any) => e.target || '')).join(', '));
    const [attunement, setAttunement] = useState(overrides.requires_attunement ?? item.requires_attunement ?? false);
    const initialResource = (overrides.resources || [])[0];
    const [chargeMax, setChargeMax] = useState(Number(initialResource?.max?.value || 0));
    const [chargeReset, setChargeReset] = useState(initialResource?.reset || 'dawn');
    const [chargeRegain, setChargeRegain] = useState(initialResource?.regain || '');
    const initialAction = (overrides.effects || []).find((e: any) => ['action', 'bonus_action', 'reaction'].includes(e.type));
    const [actionName, setActionName] = useState(initialAction?.name || '');
    const [actionType, setActionType] = useState(initialAction?.type || 'action');
    const [actionDesc, setActionDesc] = useState(initialAction?.description || initialAction?.desc || '');
    const initialRiders = (overrides.effects || []).filter((e: any) => e.type === 'attack_rider');
    const [riders, setRiders] = useState<ExtraDamage[]>(initialRiders.length > 0 ? initialRiders.map((e: any) => ({
        dice: e.damage || '', type: e.damage_type || 'Fire',
        condition: e.vs ? 'vs' : e.requires_toggle ? 'requires_toggle' : e.on === 'natural_20' ? 'natural_20' : 'always',
        value: e.vs || e.requires_toggle || '',
    })) : []);

    const updateRider = (index: number, patch: Partial<ExtraDamage>) => setRiders(prev => prev.map((rider, i) => i === index ? { ...rider, ...patch } : rider));
    const isWeaponItem = Boolean(item.weapon_category);
    const baseItems = allItems.filter(entry => {
        if (entry.is_magic) return false;
        if (String((entry as any).source || '').toLowerCase() === 'legacy') return false;
        if (isWeaponItem) return Boolean(entry.weapon_category) && !/firearm/i.test(String((entry as any).category_range || ''));
        return Boolean(entry.armor_category);
    });

    const build = (): ItemOverrides => {
        const modifiers: any[] = [];
        if (attackBonus) modifiers.push({ type: 'bonus', target: 'attack', value: attackBonus, name: 'Custom Attack' });
        if (damageBonus) modifiers.push({ type: 'bonus', target: 'damage', value: damageBonus, name: 'Custom Damage' });
        if (acBonus) modifiers.push({ type: 'bonus', target: 'ac', value: acBonus, name: 'Custom AC' });
        const effects: any[] = [];
        resistances.split(',').map(value => value.trim()).filter(Boolean).forEach(value => effects.push({ type: 'resistance', target: 'resistance', value, filter: value, name: `Resistance: ${value}` }));
        immunities.split(',').map(value => value.trim()).filter(Boolean).forEach(value => effects.push({ type: 'immunity', target: 'immunity', value, filter: value, name: `Immunity: ${value}` }));
        advantages.split(',').map(value => value.trim()).filter(Boolean).forEach(value => effects.push({ type: 'advantage', target: value, name: `Advantage: ${value}` }));
        riders.forEach(rider => {
            if (!rider.dice.trim()) return;
            const effect: any = { type: 'attack_rider', scope: 'this_weapon', damage: rider.dice.trim(), damage_type: rider.type, name: `Custom ${rider.type}` };
            if (rider.condition === 'vs') effect.vs = rider.value;
            if (rider.condition === 'requires_toggle') effect.requires_toggle = rider.value || 'custom';
            if (rider.condition === 'natural_20') effect.on = 'natural_20';
            effects.push(effect);
        });
        if (actionName.trim()) effects.push({ type: actionType, name: actionName.trim(), description: actionDesc });
        const resources = chargeMax > 0 ? [{ key: 'charges', name: 'Charges', max: { type: 'fixed', value: chargeMax }, reset: chargeReset, regain: chargeRegain || undefined }] : [];
        return {
            name: name.trim() || item.name,
            notes: notes.trim() || undefined,
            base_item: baseItem || undefined,
            modifiers,
            effects,
            resources,
            requires_attunement: attunement,
            choice_value: overrides.choice_value,
        };
    };

    return (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-[#1b1c20] p-6 space-y-5" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-dnd-gold">Customize Item</h3>
                    {item.customized && <span className="text-[9px] font-black uppercase tracking-widest text-dnd-gold bg-dnd-gold/10 border border-dnd-gold/30 rounded-full px-2 py-1">Customized</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Name</span><input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Base Item</span><select value={baseItem} onChange={e => setBaseItem(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white"><option value="">Keep current</option>{baseItems.map(entry => <option key={entry.index} value={entry.index}>{entry.name}</option>)}</select></label>
                </div>
                <label className="block space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Notes</span><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Attack Bonus</span><input type="number" value={attackBonus} onChange={e => setAttackBonus(Number(e.target.value))} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Damage Bonus</span><input type="number" value={damageBonus} onChange={e => setDamageBonus(Number(e.target.value))} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">AC Bonus</span><input type="number" value={acBonus} onChange={e => setAcBonus(Number(e.target.value))} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="flex items-end gap-2 pb-2 text-xs text-gray-400"><input type="checkbox" checked={attunement} onChange={e => setAttunement(e.target.checked)} className="accent-dnd-gold" /> Attunement</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Resistances</span><input value={resistances} onChange={e => setResistances(e.target.value)} placeholder="Fire, Cold" className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-xs text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Immunities</span><input value={immunities} onChange={e => setImmunities(e.target.value)} placeholder="Poison" className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-xs text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Advantages</span><input value={advantages} onChange={e => setAdvantages(e.target.value)} placeholder="saves, Perception" className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-xs text-white" /></label>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between"><span className="text-[9px] uppercase text-gray-500 font-bold">Extra Damage</span><button type="button" onClick={() => setRiders(prev => [...prev, { dice: '1d6', type: 'Fire', condition: 'always', value: '' }])} className="text-[10px] bg-gray-800 px-2 py-1 rounded text-white">+ Add</button></div>
                    {riders.map((rider, index) => (
                        <div key={index} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <input value={rider.dice} onChange={e => updateRider(index, { dice: e.target.value })} placeholder="1d6" className="rounded border border-gray-700 bg-black/40 px-2 py-1 text-xs text-white" />
                            <input value={rider.type} onChange={e => updateRider(index, { type: e.target.value })} placeholder="Fire" className="rounded border border-gray-700 bg-black/40 px-2 py-1 text-xs text-white" />
                            <select value={rider.condition} onChange={e => updateRider(index, { condition: e.target.value as ExtraDamage['condition'] })} className="rounded border border-gray-700 bg-black/40 px-2 py-1 text-xs text-white">
                                <option value="always">Always</option><option value="vs">vs type</option><option value="requires_toggle">While toggled</option><option value="natural_20">Natural 20</option>
                            </select>
                            <input value={rider.value} onChange={e => updateRider(index, { value: e.target.value })} placeholder="Undead / toggle" className="rounded border border-gray-700 bg-black/40 px-2 py-1 text-xs text-white" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Charges</span><input type="number" value={chargeMax} onChange={e => setChargeMax(Number(e.target.value))} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Reset</span><select value={chargeReset} onChange={e => setChargeReset(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white"><option value="dawn">Dawn</option><option value="short">Short Rest</option><option value="long">Long Rest</option><option value="never">Never</option></select></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Regain</span><input value={chargeRegain} onChange={e => setChargeRegain(e.target.value)} placeholder="1d3" className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Action Name</span><input value={actionName} onChange={e => setActionName(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Action Type</span><select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white"><option value="action">Action</option><option value="bonus_action">Bonus Action</option><option value="reaction">Reaction</option></select></label>
                    <label className="space-y-1"><span className="text-[9px] uppercase text-gray-500 font-bold">Action Description</span><input value={actionDesc} onChange={e => setActionDesc(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white" /></label>
                </div>
                <div className="flex flex-wrap justify-between gap-2 pt-2">
                    <div className="flex gap-2">
                        <button type="button" onClick={onReset} className="rounded-lg border border-red-800 px-3 py-2 text-[10px] font-bold uppercase text-red-300">Reset to original</button>
                        <button type="button" onClick={() => onSaveHomebrew(name, false)} className="rounded-lg border border-gray-700 px-3 py-2 text-[10px] font-bold uppercase text-gray-300">Save as Homebrew</button>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-700 px-3 py-2 text-[10px] font-bold uppercase text-gray-400">Cancel</button>
                        <button type="button" onClick={() => onSave(build())} className="rounded-lg bg-dnd-gold px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">Save Customization</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemCustomizeModal;
