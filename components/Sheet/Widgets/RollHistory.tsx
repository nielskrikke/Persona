import React, { useState, useEffect, useRef } from 'react';
import { RollResult, CampaignRoll } from '../../../types';
import { loadPartyRolls, addPartyRoll } from '../../../services/supabase';

interface RollHistoryProps {
    history: RollResult[];
    onClear: () => void;
    campaignId?: string | null;
    characterName?: string;
}

export const RollHistory: React.FC<RollHistoryProps> = ({ 
    history, 
    onClear, 
    campaignId,
    characterName
}) => {
    const [activeView, setActiveView] = useState<'personal' | 'party' | null>(null);
    const [partyRolls, setPartyRolls] = useState<CampaignRoll[]>([]);
    const [loadingParty, setLoadingParty] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeView && panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setActiveView(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeView]);

    useEffect(() => {
        if (campaignId && activeView === 'party') {
            fetchPartyRolls();
        }
    }, [campaignId, activeView]);

    const fetchPartyRolls = async () => {
        if (!campaignId) return;
        setLoadingParty(true);
        try {
            const rolls = await loadPartyRolls(campaignId);
            setPartyRolls(rolls);
        } catch (e) {
            console.error("Error loading party rolls", e);
        } finally {
            setLoadingParty(false);
        }
    };

    const isOpen = activeView !== null;

    return (
        <div ref={panelRef} className={`fixed right-0 top-24 z-[180] h-[calc(100vh-8rem)] flex items-start transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Toggle Tabs Bar */}
            <div className="absolute left-0 top-8 -translate-x-full flex flex-col gap-2">
                {/* Personal History Tab */}
                <button 
                    onClick={() => setActiveView(activeView === 'personal' ? null : 'personal')}
                    className={`bg-[#1b1c20] border-l border-t border-b ${activeView === 'personal' ? 'border-dnd-gold text-dnd-gold bg-[#25262b]' : 'border-gray-700 text-gray-400'} rounded-l-lg py-3 px-1 font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#25262b] hover:text-white transition-colors flex flex-col items-center gap-2`}
                    title="Personal Roll History"
                >
                    <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Personal</span>
                    <span className="w-5 h-5 flex items-center justify-center bg-black/40 rounded-full text-[9px] border border-gray-700 text-gray-300">
                        {history.length}
                    </span>
                </button>

                {/* Party History Tab (Only visible if in a campaign) */}
                {campaignId && (
                    <button 
                        onClick={() => setActiveView(activeView === 'party' ? null : 'party')}
                        className={`bg-[#1b1c20] border-l border-t border-b ${activeView === 'party' ? 'border-purple-400 text-purple-300 bg-[#25262b]' : 'border-purple-900/60 text-purple-400/70'} rounded-l-lg py-3 px-1 font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#25262b] hover:text-white transition-colors flex flex-col items-center gap-2`}
                        title="Party Roll History"
                    >
                        <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Party</span>
                        <span className="w-5 h-5 flex items-center justify-center bg-purple-950/60 rounded-full text-[9px] border border-purple-800 text-purple-300">
                            {partyRolls.length}
                        </span>
                    </button>
                )}
            </div>

            {/* Panel */}
            <div className="w-80 h-full bg-[#1b1c20] border-l border-dnd-gold shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-[#121316] shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{activeView === 'party' ? '👥' : '📜'}</span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                            {activeView === 'party' ? 'Party Rolls' : 'Personal Log'}
                        </h3>
                    </div>
                    {activeView === 'personal' ? (
                        <button onClick={onClear} className="text-[10px] text-red-400 hover:text-red-300 border border-red-900 bg-red-900/20 px-2 py-1 rounded uppercase font-bold transition-colors">
                            Clear
                        </button>
                    ) : (
                        <button onClick={fetchPartyRolls} className="text-[10px] text-purple-300 hover:text-white border border-purple-800 bg-purple-900/20 px-2 py-1 rounded uppercase font-bold transition-colors">
                            Refresh
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {activeView === 'personal' && (
                        <>
                            {history.map((roll, i) => (
                                <div key={roll.timestamp + '-' + i} className={`bg-black/20 border rounded p-2 text-sm relative overflow-hidden group ${roll.isCrit ? 'border-green-800 bg-green-900/10' : roll.isFail ? 'border-red-900 bg-red-900/10' : 'border-gray-700'}`}>
                                    <div className="flex justify-between mb-1 relative z-10">
                                        <span className="font-bold text-gray-300 truncate w-2/3" title={roll.label}>{roll.label}</span>
                                        <span className="text-[10px] text-gray-600">{new Date(roll.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                    </div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="text-xs text-gray-500">
                                            <div className="font-mono">{roll.die} {roll.modifier ? (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier) : ''}</div>
                                            <div className="text-[10px] opacity-50 break-words max-w-[150px]">[{roll.rolls.join(', ')}]</div>
                                        </div>
                                        <div className={`text-2xl font-bold font-serif ${roll.isCrit ? 'text-green-400' : roll.isFail ? 'text-red-400' : 'text-dnd-gold'}`}>
                                            {roll.total}
                                        </div>
                                    </div>
                                    {roll.isCrit && <div className="absolute top-0 right-0 p-1"><span className="text-[8px] font-bold text-green-500 uppercase border border-green-500 rounded px-1 bg-black/50">Crit</span></div>}
                                    {roll.isFail && <div className="absolute top-0 right-0 p-1"><span className="text-[8px] font-bold text-red-500 uppercase border border-red-500 rounded px-1 bg-black/50">Fail</span></div>}
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="text-center text-gray-600 italic text-xs py-10 flex flex-col items-center">
                                    <span className="text-2xl opacity-30 mb-2">🎲</span>
                                    Fate awaits your roll...
                                </div>
                            )}
                        </>
                    )}

                    {activeView === 'party' && (
                        <>
                            {partyRolls.map((roll, i) => (
                                <div key={(roll.id || roll.timestamp) + '-' + i} className={`bg-black/30 border rounded p-2 text-sm relative overflow-hidden group ${roll.isCrit ? 'border-green-800 bg-green-900/20' : roll.isFail ? 'border-red-900 bg-red-900/20' : 'border-purple-900/50'}`}>
                                    <div className="text-[9px] font-bold text-purple-300 uppercase tracking-wide flex items-center justify-between mb-0.5 border-b border-purple-900/30 pb-0.5">
                                        <span>👤 {roll.character_name}</span>
                                        <span className="text-gray-500 font-normal">{new Date(roll.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="flex justify-between my-1 relative z-10">
                                        <span className="font-bold text-gray-200 truncate w-2/3 text-xs" title={roll.label}>{roll.label}</span>
                                    </div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="text-xs text-gray-500">
                                            <div className="font-mono">{roll.die} {roll.modifier ? (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier) : ''}</div>
                                            <div className="text-[10px] opacity-50 break-words max-w-[150px]">[{roll.rolls.join(', ')}]</div>
                                        </div>
                                        <div className={`text-2xl font-bold font-serif ${roll.isCrit ? 'text-green-400' : roll.isFail ? 'text-red-400' : 'text-purple-300'}`}>
                                            {roll.total}
                                        </div>
                                    </div>
                                    {roll.isCrit && <div className="absolute top-0 right-0 p-1"><span className="text-[8px] font-bold text-green-500 uppercase border border-green-500 rounded px-1 bg-black/50">Crit</span></div>}
                                    {roll.isFail && <div className="absolute top-0 right-0 p-1"><span className="text-[8px] font-bold text-red-500 uppercase border border-red-500 rounded px-1 bg-black/50">Fail</span></div>}
                                </div>
                            ))}
                            {partyRolls.length === 0 && !loadingParty && (
                                <div className="text-center text-gray-500 italic text-xs py-10 flex flex-col items-center">
                                    <span className="text-2xl opacity-30 mb-2">👥</span>
                                    No party rolls recorded yet in this campaign.
                                </div>
                            )}
                            {loadingParty && (
                                <div className="text-center text-purple-400 italic text-xs py-10 animate-pulse">
                                    Fetching party roll archive...
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
