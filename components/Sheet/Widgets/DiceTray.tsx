import React, { useState } from 'react';
import { RollResult } from '@/types';
import RollContextMenu from '../Shared/RollContextMenu';

export const DiceTray = ({ logs, onRoll }: { logs: RollResult[], onRoll: (formula: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({ d20: 0, d12: 0, d10: 0, d8: 0, d6: 0, d4: 0 });
    const [menuPos, setMenuPos] = useState<{x: number, y: number} | null>(null);

    const hasSelection = Object.values(counts).some((v: number) => v > 0);

    const updateCount = (die: string, delta: number) => {
        setCounts(prev => ({
            ...prev,
            [die]: Math.max(0, (prev[die] || 0) + delta)
        }));
    };

    const handleRoll = (mode: 'normal' | 'advantage' | 'disadvantage' = 'normal') => {
        const parts = Object.entries(counts)
            .filter(([_, count]: [string, number]) => count > 0)
            .map(([die, count]) => {
                // Apply Advantage/Disadvantage logic specifically to d20s if selected
                if (die === 'd20' && (mode === 'advantage' || mode === 'disadvantage')) {
                    // For Advantage/Disadvantage on d20, we assume standard 2d20kh1 or 2d20kl1
                    const suffix = mode === 'advantage' ? 'kh1' : 'kl1';
                    return `2${die}${suffix}`;
                }
                return `${count}${die}`;
            });
        
        if (parts.length > 0) {
            onRoll(parts.join('+'));
            setCounts({ d20: 0, d12: 0, d10: 0, d8: 0, d6: 0, d4: 0 });
            setIsOpen(false);
            setMenuPos(null);
        }
    };

    const clearCounts = () => setCounts({ d20: 0, d12: 0, d10: 0, d8: 0, d6: 0, d4: 0 });

    const dice = ['d20', 'd12', 'd10', 'd8', 'd6', 'd4'];

    return (
        <>
            {menuPos && (
                <RollContextMenu 
                    x={menuPos.x} 
                    y={menuPos.y} 
                    onClose={() => setMenuPos(null)} 
                    onOptionSelect={(mode) => handleRoll(mode)} 
                />
            )}

            {/* Logs Area */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                {logs.map((log) => (
                    <div key={log.timestamp} className={`bg-[#1b1c20] border-l-4 p-3 rounded shadow-lg text-sm w-64 animate-in slide-in-from-right fade-in duration-300 pointer-events-auto ${log.isCrit ? 'border-green-500' : log.isFail ? 'border-red-500' : 'border-dnd-gold'}`}>
                         <div className="flex justify-between text-gray-400 text-xs uppercase font-bold mb-1">
                            <span>{log.label}</span>
                            <span>{log.die}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className={`text-2xl font-bold ${log.isCrit ? 'text-green-400' : log.isFail ? 'text-red-400' : 'text-white'}`}>{log.total}</span>
                            <span className="text-gray-500 text-xs">Rolled: [{log.rolls.join(', ')}] {log.modifier ? (log.modifier > 0 ? `+${log.modifier}` : log.modifier) : ''}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dice Tray Container */}
            <div className="fixed bottom-24 md:bottom-6 left-6 z-[190] flex flex-col items-center gap-4">
                
                {/* The Stack (Collapsible) */}
                <div className={`flex flex-col-reverse gap-3 transition-all duration-300 origin-bottom ${isOpen || hasSelection ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}>
                    {dice.map(d => (
                        <div key={d} className="relative group">
                            <button 
                                onClick={() => updateCount(d, 1)}
                                onContextMenu={(e) => { e.preventDefault(); updateCount(d, -1); }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-xl bg-[#1b1c20] hover:bg-[#25262b] hover:scale-110 ${counts[d] > 0 ? 'border-dnd-gold text-dnd-gold' : 'border-gray-600 text-gray-400'}`}
                            >
                                <span className="font-bold font-serif text-sm uppercase">{d}</span>
                                {counts[d] > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-dnd-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#1b1c20] shadow-sm">
                                        {counts[d]}
                                    </div>
                                )}
                            </button>
                            {/* Hover Label */}
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white text-black font-bold px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50 uppercase">
                                {d}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Toggle Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-16 h-16 rounded-full bg-dnd-gold text-black flex items-center justify-center border-2 border-[#1b1c20] hover:bg-[#b09658] transition-all z-[191] group ${isOpen ? 'rotate-180' : ''}`}
                    title="Open Dice Tray"
                >
                    <div className={`transition-transform duration-300 ${isOpen ? 'scale-75' : 'scale-100'}`}>
                        {isOpen ? (
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                                <path d="M480-120 200-280v-320l280-160 280 160v320L480-120Zm0-92 200-114v-228l-200-114-200 114v228l200 114Zm0-137 137-79-137-80-137 80 137 79Zm0 0Z"/>
                             </svg>
                        )}
                    </div>
                </button>
            </div>

            {/* Roll Action Bar */}
            {hasSelection && (
                <div className="fixed bottom-[100px] md:bottom-7 left-24 z-[210] flex items-center gap-2 animate-in slide-in-from-left-10 fade-in duration-300">
                    <button 
                        onClick={clearCounts}
                        className="w-10 h-10 rounded-full bg-[#1b1c20] border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white flex items-center justify-center shadow-xl transition-colors"
                        title="Clear Dice"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    <button 
                        onClick={() => handleRoll('normal')}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setMenuPos({ x: e.clientX, y: e.clientY });
                        }}
                        className="flex items-center bg-[#5c4033] hover:bg-[#6d4c3d] text-white pl-6 pr-4 py-3 rounded-full shadow-2xl border-2 border-[#3e2b22] transition-colors gap-4 group"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[9px] uppercase font-bold text-gray-300 tracking-widest leading-tight">To: Everyone</span>
                            <span className="text-2xl font-black uppercase tracking-wide leading-none font-serif">ROLL</span>
                        </div>
                        <div className="border-l border-[#7d5c4d] pl-4">
                             <svg className="w-6 h-6 text-gray-300 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                </div>
            )}
        </>
    );
};
