import React from 'react';
import { WIDGET_BG } from '../../../data/constants';

const MagicalCunningWidget = ({ character, setCharacter }: { character: any; setCharacter: React.Dispatch<React.SetStateAction<any>> }) => {
    const usage = character.featureUsage?.['Magical Cunning'];
    if (!usage) return null;
    const slotLevel = Object.keys(character.spellSlots || {}).map(Number).find(level => Number(character.spellSlots[level]?.max || 0) > 0);
    if (!slotLevel) return null;
    const slot = character.spellSlots[slotLevel];
    const missing = Math.max(0, Number(slot?.max || 0) - Number(slot?.current || 0));
    const regain = Math.min(missing, Math.max(1, Math.ceil(Number(slot?.max || 0) / 2)));
    const usable = Number(usage.current || 0) > 0 && missing > 0;

    const useCunning = () => setCharacter((prev: any) => {
        const resource = prev.featureUsage['Magical Cunning'];
        const level = Object.keys(prev.spellSlots || {}).map(Number).find(l => Number(prev.spellSlots[l]?.max || 0) > 0);
        if (!resource || Number(resource.current || 0) <= 0 || level === undefined) return prev;
        const slots = { ...prev.spellSlots };
        const currentSlot = slots[level];
        const amount = Math.min(Number(currentSlot.max || 0) - Number(currentSlot.current || 0), Math.max(1, Math.ceil(Number(currentSlot.max || 0) / 2)));
        slots[level] = { ...currentSlot, current: Number(currentSlot.current || 0) + amount };
        return {
            ...prev,
            spellSlots: slots,
            featureUsage: { ...prev.featureUsage, 'Magical Cunning': { ...resource, current: Number(resource.current || 0) - 1 } },
        };
    });

    return (
        <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
            <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                    <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest leading-tight">Magical Cunning</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Pact Magic slots</p>
                </div>
                <span className="text-[10px] text-gray-500">{Number(usage.current || 0)} / {usage.max}</span>
            </div>
            <button type="button" onClick={useCunning} disabled={!usable} className="w-full py-1.5 rounded border border-purple-800/60 bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-900/30 disabled:opacity-30 disabled:hover:bg-purple-950/20 transition-colors">
                {missing > 0 ? `Regain ${regain} Pact Slot${regain === 1 ? '' : 's'}` : 'Pact Slots Full'}
            </button>
        </div>
    );
};

export default MagicalCunningWidget;
