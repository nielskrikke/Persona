
import React, { useState } from 'react';
import { RollResult } from '@/types';

export const RollHistory = ({ history, onClear }: { history: RollResult[], onClear: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`fixed right-0 top-24 z-[180] h-[calc(100vh-8rem)] flex items-start transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Toggle Tab */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="absolute left-0 top-8 -translate-x-full bg-[#1b1c20] border-l border-t border-b border-dnd-gold rounded-l-lg py-3 px-1 text-dnd-gold font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#25262b] hover:text-white transition-colors flex flex-col items-center gap-2"
                title="Roll History"
            >
                <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>History</span>
                <span className="w-5 h-5 flex items-center justify-center bg-black/40 rounded-full text-[9px] border border-gray-700 text-gray-300">{history.length}</span>
            </button>

            {/* Panel */}
            <div className="w-80 h-full bg-[#1b1c20] border-l border-dnd-gold shadow-2xl flex flex-col">
                <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-[#121316] shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">📜</span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Roll Log</h3>
                    </div>
                    <button onClick={onClear} className="text-[10px] text-red-400 hover:text-red-300 border border-red-900 bg-red-900/20 px-2 py-1 rounded uppercase font-bold transition-colors">Clear</button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
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
                            {/* Result Indicator */}
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
                </div>
            </div>
        </div>
    );
};
