
import React from 'react';
import { BeastDetail } from '@/types';
import { calculateModifier } from '@/utils/rules';

interface FamiliarStatBlockModalProps {
    beast: BeastDetail | null;
    onClose: () => void;
    variant?: 'familiar' | 'wildshape';
}

const FamiliarStatBlockModal: React.FC<FamiliarStatBlockModalProps> = ({ beast, onClose, variant = 'familiar' }) => {
    if (!beast) return null;

    const formatSpeed = (b: BeastDetail) => {
        let s = b.speed;
        if (b.fly_speed) s += `, fly ${b.fly_speed} ft.`;
        if (b.swim_speed) s += `, swim ${b.swim_speed} ft.`;
        return s;
    };

    const borderColor = variant === 'wildshape' ? 'border-green-500' : 'border-pink-500';
    const textColor = variant === 'wildshape' ? 'text-green-400' : 'text-pink-400';

    return (
        <div className="fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className={`bg-[#1b1c20] border-2 ${borderColor} rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200`} 
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
                    <h2 className="text-3xl font-serif text-white mb-1">{beast.name}</h2>
                    <div className="text-sm text-gray-400 italic capitalize">{beast.size} {beast.type}, Unaligned</div>
                </div>

                {/* Stats Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-6">
                    
                    {/* Core Stats */}
                    <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex justify-between border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-500 uppercase text-xs">Armor Class</span>
                            <span className="text-white font-bold">{beast.ac}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-500 uppercase text-xs">Hit Points</span>
                            <span className="text-white font-bold">{beast.hp} <span className="text-gray-500 font-normal">({beast.hit_dice})</span></span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-500 uppercase text-xs">Speed</span>
                            <span className="text-white font-bold">{formatSpeed(beast)}</span>
                        </div>
                    </div>

                    {/* Ability Scores */}
                    <div className="grid grid-cols-6 gap-2 text-center bg-gray-800/50 p-3 rounded border border-gray-700">
                        {[
                            { l: 'STR', v: beast.str },
                            { l: 'DEX', v: beast.dex },
                            { l: 'CON', v: beast.con },
                            { l: 'INT', v: beast.int },
                            { l: 'WIS', v: beast.wis },
                            { l: 'CHA', v: beast.cha },
                        ].map(stat => (
                            <div key={stat.l}>
                                <div className="text-[9px] font-bold text-gray-500 uppercase">{stat.l}</div>
                                <div className="text-base font-bold text-white">{stat.v}</div>
                                <div className="text-[10px] text-gray-400">{calculateModifier(stat.v) >= 0 ? '+' : ''}{calculateModifier(stat.v)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Traits & Actions */}
                    <div className="space-y-4">
                        {beast.senses && (
                            <div className="text-xs text-gray-400">
                                <span className="font-bold text-gray-500 uppercase mr-2">Senses</span> 
                                {beast.senses}
                            </div>
                        )}
                        
                        {beast.traits.length > 0 && (
                            <div className="space-y-2">
                                {beast.traits.map((t, i) => (
                                    <div key={i} className="text-sm text-gray-300">
                                        <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                                    </div>
                                ))}
                            </div>
                        )}

                        {beast.actions.length > 0 && (
                            <div>
                                <h3 className={`text-lg font-serif ${textColor} border-b border-gray-700 pb-1 mb-2`}>Actions</h3>
                                <div className="space-y-3">
                                    {beast.actions.map((a, i) => (
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

export default FamiliarStatBlockModal;
