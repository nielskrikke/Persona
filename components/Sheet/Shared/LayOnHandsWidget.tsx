import React, { useEffect, useState } from 'react';
import { WIDGET_BG } from '../../../data/constants';

interface LayOnHandsWidgetProps {
    usage: { max: number; current: number; reset?: 'short' | 'long' };
    onChange: (value: number) => void;
}

const LayOnHandsWidget: React.FC<LayOnHandsWidgetProps> = ({ usage, onChange }) => {
    const [draft, setDraft] = useState(String(usage.current ?? 0));
    useEffect(() => { setDraft(String(usage.current ?? 0)); }, [usage.current]);

    const max = Math.max(1, Number(usage.max || 0));
    const current = Math.max(0, Math.min(max, Number(usage.current || 0)));
    const stepBase = Number.isFinite(Number(draft)) ? Number(draft) : current;

    const commit = (raw: string | number) => {
        const parsed = Number(raw);
        const next = Number.isFinite(parsed) ? Math.max(0, Math.min(max, Math.round(parsed))) : current;
        onChange(next);
        setDraft(String(next));
    };

    return (
        <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
            <div className="flex justify-between items-start gap-2 mb-2">
                <div className="min-w-0">
                    <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest leading-tight">Lay on Hands</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Healing HP Pool</p>
                </div>
                <span className="text-[9px] text-gray-600 shrink-0">Long Rest</span>
            </div>
            <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => commit(stepBase - 5)} className="h-8 min-w-8 px-2 rounded border border-gray-700/70 bg-black/20 text-[10px] font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors" aria-label="Spend 5 HP from Lay on Hands">−5</button>
                <button type="button" onClick={() => commit(stepBase - 1)} className="h-8 w-8 rounded border border-gray-700/70 bg-black/20 text-sm font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors" aria-label="Spend 1 HP from Lay on Hands">−</button>
                <div className="flex-1 flex items-baseline justify-center gap-1">
                    <input
                        type="number"
                        min={0}
                        max={max}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={() => commit(draft)}
                        onKeyDown={e => { if (e.key === 'Enter') { commit(draft); (e.target as HTMLInputElement).blur(); } }}
                        className="w-16 bg-transparent text-center text-xl font-serif font-bold text-white outline-none border-b border-transparent focus:border-dnd-gold/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Lay on Hands remaining HP"
                    />
                    <span className="text-[10px] text-gray-500">/ {usage.max}</span>
                </div>
                <button type="button" onClick={() => commit(stepBase + 1)} className="h-8 w-8 rounded border border-gray-700/70 bg-black/20 text-sm font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors" aria-label="Restore 1 HP to Lay on Hands">+</button>
                <button type="button" onClick={() => commit(stepBase + 5)} className="h-8 min-w-8 px-2 rounded border border-gray-700/70 bg-black/20 text-[10px] font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors" aria-label="Restore 5 HP to Lay on Hands">+5</button>
            </div>
        </div>
    );
};

export default LayOnHandsWidget;
