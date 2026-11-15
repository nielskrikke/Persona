import React from 'react';
import { WIDGET_BG } from '../../../data/constants';

const DragonWingsWidget = ({ character, setCharacter }: { character: any; setCharacter: React.Dispatch<React.SetStateAction<any>> }) => {
    const usage = character.featureUsage?.['Dragon Wings'];
    if (!usage) return null;
    const active = character.activeConditions?.['dragon-wings'] === true;
    const points = character.featureUsage?.['Sorcery Points'];
    const canActivate = Number(usage.current || 0) > 0 && !active;
    const canRestore = !active && Number(usage.current || 0) <= 0 && Number(points?.current || 0) >= 3;

    const activate = () => setCharacter((prev: any) => {
        const u = prev.featureUsage['Dragon Wings'];
        if (!u || Number(u.current || 0) <= 0) return prev;
        return {
            ...prev,
            activeConditions: { ...(prev.activeConditions || {}), 'dragon-wings': true },
            featureUsage: { ...prev.featureUsage, 'Dragon Wings': { ...u, current: Math.max(0, Number(u.current || 0) - 1) } },
        };
    });
    const dismiss = () => setCharacter((prev: any) => ({
        ...prev,
        activeConditions: { ...(prev.activeConditions || {}), 'dragon-wings': false },
    }));
    const restore = () => setCharacter((prev: any) => {
        const p = prev.featureUsage['Sorcery Points'];
        const u = prev.featureUsage['Dragon Wings'];
        if (!p || !u || Number(p.current || 0) < 3 || Number(u.current || 0) > 0) return prev;
        return {
            ...prev,
            featureUsage: {
                ...prev.featureUsage,
                'Sorcery Points': { ...p, current: Number(p.current || 0) - 3 },
                'Dragon Wings': { ...u, current: 1 },
            },
        };
    });

    return (
        <div className={`${WIDGET_BG} border ${active ? 'border-dnd-gold/60' : 'border-[#3e4149]/50'} rounded-lg p-3`}>
            <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                    <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest leading-tight">Dragon Wings</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{active ? 'Flying · 60 ft' : '1/Long Rest · 3 SP to restore'}</p>
                </div>
                <span className="text-[10px] text-gray-500">{Number(usage.current || 0)} / {usage.max}</span>
            </div>
            <div className="flex gap-2">
                {active ? (
                    <button type="button" onClick={dismiss} className="flex-1 py-1.5 rounded border border-dnd-gold/50 bg-dnd-gold/10 text-[9px] font-bold uppercase tracking-wider text-dnd-gold hover:bg-dnd-gold/20">End Wings</button>
                ) : (
                    <button type="button" onClick={activate} disabled={!canActivate} className="flex-1 py-1.5 rounded border border-gray-700/70 bg-black/20 text-[9px] font-bold uppercase tracking-wider text-gray-300 hover:text-white disabled:opacity-30">Activate</button>
                )}
                {canRestore && (
                    <button type="button" onClick={restore} className="flex-1 py-1.5 rounded border border-purple-800/60 bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-900/30">Restore · 3 SP</button>
                )}
            </div>
        </div>
    );
};

export default DragonWingsWidget;
