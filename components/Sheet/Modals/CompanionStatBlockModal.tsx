import React from 'react';
import { calculateModifier } from '../../../utils/rules';

interface CompanionStatBlockModalProps {
    companion: {
        name: string;
        type: string;
        size: string;
        ac: number;
        hp: number;
        maxHp: number;
        speed?: string;
        abilities?: Record<string, number>;
        actions: { name: string, desc: string }[];
        traits?: { name: string, desc: string }[];
    } | null;
    onClose: () => void;
}

const CompanionStatBlockModal: React.FC<CompanionStatBlockModalProps> = ({ companion, onClose }) => {
    if (!companion) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className={`bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200`} 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl leading-none"
                >
                    &times;
                </button>

                {/* Header */}
                <div className="bg-[#121316] p-6 border-b border-gray-700">
                    <h2 className="text-3xl font-serif text-white mb-1">{companion.name}</h2>
                    <div className="text-sm text-gray-400 italic capitalize">{companion.size} {companion.type}, Unaligned</div>
                </div>

                {/* Stats Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6">
                    
                    {/* Core Stats */}
                    <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex justify-between border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-500 uppercase text-xs">Armor Class</span>
                            <span className="text-white font-bold">{companion.ac}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-500 uppercase text-xs">Hit Points</span>
                            <span className="text-white font-bold">{companion.hp} <span className="text-gray-500 font-normal">/ {companion.maxHp}</span></span>
                        </div>
                        {companion.speed && (
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span className="font-bold text-gray-500 uppercase text-xs">Speed</span>
                                <span className="text-white font-bold">{companion.speed}</span>
                            </div>
                        )}
                    </div>

                    {/* Ability Scores (If available, e.g. Steel Defender) */}
                    {companion.abilities && (
                        <div className="grid grid-cols-6 gap-2 text-center bg-gray-800/50 p-3 rounded border border-gray-700">
                            {Object.entries(companion.abilities).map(([l, v]) => (
                                <div key={l}>
                                    <div className="text-[9px] font-bold text-gray-500 uppercase">{l}</div>
                                    <div className="text-base font-bold text-white">{v as number}</div>
                                    {/* Fix: cast v to number to resolve 'unknown' error in calculateModifier */}
                                    <div className="text-[10px] text-gray-400">{calculateModifier(v as number) >= 0 ? '+' : ''}{calculateModifier(v as number)}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Traits & Actions */}
                    <div className="space-y-4">
                        {companion.traits && companion.traits.length > 0 && (
                            <div className="space-y-2">
                                {companion.traits.map((t, i) => (
                                    <div key={i} className="text-sm text-gray-300">
                                        <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                                    </div>
                                ))}
                            </div>
                        )}

                        {companion.actions.length > 0 && (
                            <div>
                                <h3 className={`text-lg font-serif text-dnd-gold border-b border-gray-700 pb-1 mb-2`}>Actions</h3>
                                <div className="space-y-3">
                                    {companion.actions.map((a, i) => (
                                        <div key={i} className="text-sm text-gray-300">
                                            <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanionStatBlockModal;