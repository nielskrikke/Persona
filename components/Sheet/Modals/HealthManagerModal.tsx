
import React, { useState } from 'react';
import { CharacterState } from '@/types';

const HealthManagerModal = ({ 
    isOpen, 
    onClose, 
    character, 
    onUpdate,
    onTakeDamage
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    character: CharacterState, 
    onUpdate: (updates: Partial<CharacterState>) => void,
    onTakeDamage: (dmg: number) => void
}) => {
    const [amount, setAmount] = useState<string>('');
    const [mode, setMode] = useState<'hp' | 'max'>('hp');

    if (!isOpen) return null;

    const val = parseInt(amount) || 0;

    const handleHeal = () => {
        if (val <= 0) return;
        onUpdate({ currentHp: Math.min(character.maxHp, character.currentHp + val) });
        setAmount('');
        onClose();
    };

    const handleDamage = () => {
        if (val <= 0) return;
        let remainingDmg = val;
        let newTemp = character.tempHp;
        let newCurrent = character.currentHp;

        if (newTemp > 0) {
            if (newTemp >= remainingDmg) {
                newTemp -= remainingDmg;
                remainingDmg = 0;
            } else {
                remainingDmg -= newTemp;
                newTemp = 0;
            }
        }
        newCurrent = Math.max(0, newCurrent - remainingDmg);

        onUpdate({ currentHp: newCurrent, tempHp: newTemp });
        if (val > 0) onTakeDamage(val);
        setAmount('');
        onClose();
    };

    const handleSetTemp = () => {
        if (val < 0) return;
        onUpdate({ tempHp: val });
        setAmount('');
        onClose();
    };

    const handleModifyMax = (isAddition: boolean) => {
        if (val === 0) return;
        const diff = isAddition ? val : -val;
        onUpdate({ maxHp: Math.max(1, character.maxHp + diff) });
        setAmount('');
        onClose();
    };

    const handleOverrideMax = () => {
        if (val <= 0) return;
        onUpdate({ maxHp: val });
        setAmount('');
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-[#3e4149] rounded-xl w-full max-w-xs shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-3 text-gray-500 hover:text-white transition-colors text-xl leading-none"
                >
                    &times;
                </button>
                
                {/* Header Stats */}
                <div className="bg-[#121316] p-4 flex justify-between items-center border-b border-[#3e4149]/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current</span>
                        <span className={`text-2xl font-bold font-serif ${character.currentHp < character.maxHp / 2 ? 'text-red-400' : 'text-white'}`}>
                            {character.currentHp} <span className="text-gray-600 text-lg">/ {character.maxHp}</span>
                        </span>
                    </div>
                    {character.tempHp > 0 && (
                        <div className="flex flex-col items-end">
                             <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Temp</span>
                             <span className="text-2xl font-bold text-blue-400 font-serif">+{character.tempHp}</span>
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-4">
                    {/* Input */}
                    <div className="relative">
                        <input 
                            type="number" 
                            placeholder="0" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#0b0c0e] border border-[#3e4149] rounded-lg py-3 px-4 text-center text-3xl font-bold text-white focus:border-dnd-gold outline-none placeholder:text-gray-700 font-serif"
                            autoFocus
                        />
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center border-b border-[#3e4149]/30 pb-4">
                         <div className="flex bg-black/20 rounded p-1 gap-1">
                             <button 
                                onClick={() => setMode('hp')} 
                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${mode === 'hp' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                             >
                                 HP / Temp
                             </button>
                             <button 
                                onClick={() => setMode('max')} 
                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors ${mode === 'max' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                             >
                                 Max HP
                             </button>
                         </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        {mode === 'hp' ? (
                            <>
                                <button onClick={handleHeal} className="py-3 bg-green-900/20 border border-green-800/50 hover:bg-green-900/40 hover:border-green-600 text-green-400 rounded font-bold uppercase text-xs transition-all">
                                    Heal
                                </button>
                                <button onClick={handleDamage} className="py-3 bg-red-900/20 border border-red-800/50 hover:bg-red-900/40 hover:border-red-600 text-red-400 rounded font-bold uppercase text-xs transition-all">
                                    Damage
                                </button>
                                <button onClick={handleSetTemp} className="col-span-2 py-2 bg-blue-900/20 border border-blue-800/50 hover:bg-blue-900/40 hover:border-blue-600 text-blue-400 rounded font-bold uppercase text-xs transition-all">
                                    Set Temp HP
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleModifyMax(true)} className="py-3 bg-[#25262b] border border-gray-600 hover:border-dnd-gold text-white rounded font-bold uppercase text-xs transition-all">
                                    Add to Max
                                </button>
                                <button onClick={() => handleModifyMax(false)} className="py-3 bg-[#25262b] border border-gray-600 hover:border-dnd-gold text-white rounded font-bold uppercase text-xs transition-all">
                                    Sub from Max
                                </button>
                                <button onClick={handleOverrideMax} className="col-span-2 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded font-bold uppercase text-xs transition-all">
                                    Override Max HP
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthManagerModal;
