import React, { useState } from 'react';
import { WIDGET_BG } from '../../../data/constants';

const SLOT_COSTS: Record<number, number> = { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7 };

const FontOfMagicWidget = ({ character, setCharacter }: { character: any; setCharacter: React.Dispatch<React.SetStateAction<any>> }) => {
    const [createLevel, setCreateLevel] = useState(1);
    const [convertLevel, setConvertLevel] = useState(1);
    const points = character.featureUsage?.['Sorcery Points'];
    if (!points) return null;

    const current = Number(points.current || 0);
    const max = Number(points.max || 0);
    const cost = SLOT_COSTS[createLevel] || 2;
    const canCreate = current >= cost;
    const slot = character.spellSlots?.[convertLevel];
    const canConvert = Number(slot?.current || 0) > 0;

    const adjustPoints = (delta: number) => setCharacter((prev: any) => ({
        ...prev,
        featureUsage: {
            ...prev.featureUsage,
            'Sorcery Points': { ...prev.featureUsage['Sorcery Points'], current: Math.max(0, Math.min(max, Number(prev.featureUsage['Sorcery Points']?.current || 0) + delta)) },
        },
    }));

    const createSlot = () => setCharacter((prev: any) => {
        const p = prev.featureUsage['Sorcery Points'];
        if (Number(p.current || 0) < cost) return prev;
        const slots = { ...prev.spellSlots };
        const existing = slots[createLevel] || { max: 0, current: 0 };
        slots[createLevel] = { max: Number(existing.max || 0) + 1, current: Number(existing.current || 0) + 1 };
        return {
            ...prev,
            spellSlots: slots,
            featureUsage: { ...prev.featureUsage, 'Sorcery Points': { ...p, current: Number(p.current || 0) - cost } },
        };
    });

    const innate = character.featureUsage?.['Innate Sorcery'];
    const hasIncarnate = (character.classFeatures || []).some((feature: any) => /sorcery incarnate/i.test(feature.name || ''));
    const canActivateInnate = hasIncarnate && innate && Number(innate.current || 0) <= 0 && current >= 2;
    const activateInnate = () => setCharacter((prev: any) => {
        const p = prev.featureUsage['Sorcery Points'];
        const source = prev.featureUsage['Innate Sorcery'];
        if (!source || Number(p.current || 0) < 2) return prev;
        return {
            ...prev,
            featureUsage: {
                ...prev.featureUsage,
                'Sorcery Points': { ...p, current: Number(p.current || 0) - 2 },
                'Innate Sorcery': { ...source, current: Number(source.max || 0) },
            },
        };
    });

    const convertSlot = () => setCharacter((prev: any) => {
        const p = prev.featureUsage['Sorcery Points'];
        const slots = { ...prev.spellSlots };
        const existing = slots[convertLevel];
        if (!existing || Number(existing.current || 0) <= 0) return prev;
        slots[convertLevel] = { ...existing, current: Number(existing.current || 0) - 1 };
        return {
            ...prev,
            spellSlots: slots,
            featureUsage: { ...prev.featureUsage, 'Sorcery Points': { ...p, current: Math.min(Number(p.max || 0), Number(p.current || 0) + convertLevel) } },
        };
    });

    return (
        <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
            <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                    <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest leading-tight">Font of Magic</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Sorcery Points</p>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => adjustPoints(-1)} className="h-6 w-6 rounded border border-gray-700/70 bg-black/20 text-xs text-gray-400 hover:text-white" aria-label="Spend 1 Sorcery Point">−</button>
                    <span className="text-sm font-bold text-white min-w-12 text-center">{current} / {max}</span>
                    <button type="button" onClick={() => adjustPoints(1)} className="h-6 w-6 rounded border border-gray-700/70 bg-black/20 text-xs text-gray-400 hover:text-white" aria-label="Regain 1 Sorcery Point">+</button>
                </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-gray-800/60">
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-500 uppercase font-bold w-16">To slot</span>
                    <select value={createLevel} onChange={e => setCreateLevel(Number(e.target.value))} className="flex-1 bg-black/30 border border-gray-700/60 rounded px-1.5 py-1 text-[10px] text-gray-300 outline-none">
                        {[1,2,3,4,5].map(level => <option key={level} value={level}>Level {level} · {SLOT_COSTS[level]} SP</option>)}
                    </select>
                    <button type="button" onClick={createSlot} disabled={!canCreate} className="px-2 py-1 rounded border border-gray-700/60 bg-black/20 text-[9px] font-bold uppercase text-gray-400 hover:text-white disabled:opacity-30">Create</button>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-500 uppercase font-bold w-16">To points</span>
                    <select value={convertLevel} onChange={e => setConvertLevel(Number(e.target.value))} className="flex-1 bg-black/30 border border-gray-700/60 rounded px-1.5 py-1 text-[10px] text-gray-300 outline-none">
                        {[1,2,3,4,5].map(level => <option key={level} value={level}>Level {level} · {character.spellSlots?.[level]?.current || 0} left</option>)}
                    </select>
                    <button type="button" onClick={convertSlot} disabled={!canConvert} className="px-2 py-1 rounded border border-gray-700/60 bg-black/20 text-[9px] font-bold uppercase text-gray-400 hover:text-white disabled:opacity-30">Convert</button>
                </div>
                {canActivateInnate && (
                    <button type="button" onClick={activateInnate} className="w-full mt-2 py-1.5 rounded border border-purple-800/60 bg-purple-950/20 text-[9px] font-bold uppercase tracking-wide text-purple-300 hover:bg-purple-900/30 transition-colors">
                        Activate Innate Sorcery · 2 SP
                    </button>
                )}
            </div>
        </div>
    );
};

export default FontOfMagicWidget;
