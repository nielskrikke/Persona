
import React, { useState } from 'react';
import { CharacterState, RollResult } from '@/types';
import { rollDice } from '../../../utils/dice';
import { Heart, Skull, RotateCcw, Dices, ShieldCheck, AlertOctagon } from 'lucide-react';

const HealthManagerModal = ({ 
    isOpen, 
    onClose, 
    character, 
    onUpdate,
    onTakeDamage,
    onRoll
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    character: CharacterState, 
    onUpdate: (updates: Partial<CharacterState>) => void,
    onTakeDamage: (dmg: number) => void,
    onRoll?: (formula: string, label: string) => RollResult
}) => {
    const [amount, setAmount] = useState<string>('');
    const [mode, setMode] = useState<'hp' | 'max' | 'deathsaves'>('hp');
    const [lastRollMsg, setLastRollMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const val = parseInt(amount) || 0;

    const currentHp = character.currentHp;
    const maxHp = character.maxHp;
    const successes = character.deathSaves?.successes || 0;
    const failures = character.deathSaves?.failures || 0;

    const handleHeal = () => {
        if (val <= 0) return;
        const newHp = Math.min(character.maxHp, character.currentHp + val);
        const updates: Partial<CharacterState> = { currentHp: newHp };
        if (newHp > 0) {
            updates.deathSaves = { successes: 0, failures: 0 };
        }
        onUpdate(updates);
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

    const handleToggleSuccess = (index: number) => {
        // index is 1, 2, 3
        const newSuccesses = successes === index ? index - 1 : index;
        onUpdate({
            deathSaves: {
                successes: Math.max(0, Math.min(3, newSuccesses)),
                failures
            }
        });
    };

    const handleToggleFailure = (index: number) => {
        // index is 1, 2, 3
        const newFailures = failures === index ? index - 1 : index;
        onUpdate({
            deathSaves: {
                successes,
                failures: Math.max(0, Math.min(3, newFailures))
            }
        });
    };

    const handleResetDeathSaves = () => {
        onUpdate({ deathSaves: { successes: 0, failures: 0 } });
        setLastRollMsg(null);
    };

    const handleRollDeathSave = () => {
        const rollRes = onRoll ? onRoll('1d20', 'Death Save') : rollDice('1d20', 'Death Save');
        const result = rollRes.rolls[0];
        let newSuccesses = successes;
        let newFailures = failures;
        let msg = '';

        if (result === 20) {
            newSuccesses = Math.min(3, successes + 2);
            msg = `NAT 20! Critical Save! (+2 Saves)`;
        } else if (result >= 10) {
            newSuccesses = Math.min(3, successes + 1);
            msg = `Rolled ${result}: Save (+1 Save)`;
        } else if (result === 1) {
            newFailures = Math.min(3, failures + 2);
            msg = `NAT 1! Critical Failure! (+2 Failures)`;
        } else {
            newFailures = Math.min(3, failures + 1);
            msg = `Rolled ${result}: Failure (+1 Failure)`;
        }

        setLastRollMsg(msg);
        onUpdate({
            deathSaves: {
                successes: newSuccesses,
                failures: newFailures
            }
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-[#3e4149] rounded-xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-3 text-gray-500 hover:text-white transition-colors text-xl leading-none z-10"
                >
                    &times;
                </button>
                
                {/* Header Stats */}
                <div className={`p-4 flex justify-between items-center border-b transition-colors ${currentHp === 0 ? 'bg-red-950/40 border-red-900/50' : 'bg-[#121316] border-[#3e4149]/50'}`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {currentHp === 0 ? 'STATUS' : 'Current HP'}
                        </span>
                        {currentHp === 0 ? (
                            <span className="text-xl font-bold font-serif text-red-400 flex items-center gap-1.5 animate-pulse">
                                <AlertOctagon className="w-5 h-5 text-red-500" />
                                UNCONSCIOUS (0 HP)
                            </span>
                        ) : (
                            <span className={`text-2xl font-bold font-serif ${currentHp < maxHp / 2 ? 'text-red-400' : 'text-white'}`}>
                                {currentHp} <span className="text-gray-600 text-lg">/ {maxHp}</span>
                            </span>
                        )}
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
                            className="w-full bg-[#0b0c0e] border border-[#3e4149] rounded-lg py-2.5 px-4 text-center text-3xl font-bold text-white focus:border-dnd-gold outline-none placeholder:text-gray-700 font-serif"
                            autoFocus
                        />
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center border-b border-[#3e4149]/30 pb-3">
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
                             <button 
                                onClick={() => setMode('deathsaves')} 
                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-colors flex items-center gap-1 ${mode === 'deathsaves' || currentHp === 0 ? 'bg-red-900/60 text-red-200 border border-red-700/50' : 'text-gray-500 hover:text-gray-300'}`}
                             >
                                 Death Saves {currentHp === 0 && '⚡'}
                             </button>
                         </div>
                    </div>

                    {/* Death Saves Section - Always shown when currentHp === 0 or mode === 'deathsaves' */}
                    {(currentHp === 0 || mode === 'deathsaves') && (
                        <div className="bg-[#121316] border border-red-900/40 rounded-xl p-3.5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Skull className="w-4 h-4 text-red-500" />
                                    Death Saving Throws
                                </span>
                                {(successes > 0 || failures > 0) && (
                                    <button 
                                        onClick={handleResetDeathSaves}
                                        title="Reset Death Saves"
                                        className="text-[10px] font-bold text-gray-500 hover:text-gray-300 uppercase flex items-center gap-1 transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                )}
                            </div>

                            {/* Status outcome banner */}
                            {successes >= 3 && (
                                <div className="bg-emerald-950/80 border border-emerald-600/60 rounded-lg p-2 text-center text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    STABILIZED (3 Successes)
                                </div>
                            )}
                            {failures >= 3 && (
                                <div className="bg-red-950/90 border border-red-600 rounded-lg p-2 text-center text-red-200 font-bold text-xs flex items-center justify-center gap-2 animate-pulse">
                                    <Skull className="w-4 h-4 text-red-400" />
                                    3 FAILURES - CHARACTER DYING
                                </div>
                            )}

                            {/* Digital Roll Button */}
                            <button
                                onClick={handleRollDeathSave}
                                disabled={successes >= 3 || failures >= 3}
                                className="w-full py-2.5 bg-gradient-to-r from-red-900/80 to-amber-900/80 hover:from-red-800 hover:to-amber-800 border border-red-600/60 text-white rounded-lg font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Dices className="w-4 h-4 text-dnd-gold" />
                                Roll Death Save (d20)
                            </button>

                            {lastRollMsg && (
                                <div className="text-center text-[11px] font-bold text-dnd-gold bg-black/40 py-1 px-2 rounded border border-dnd-gold/20">
                                    {lastRollMsg}
                                </div>
                            )}

                            {/* Interactive Pips: Successes (Hearts) and Failures (Skulls) */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                {/* Successes / Lives */}
                                <div className="bg-[#1b1c20] p-2.5 rounded-lg border border-gray-800 flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <Heart className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                                        Successes ({successes}/3)
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3].map((num) => (
                                            <button
                                                key={`suc-${num}`}
                                                onClick={() => handleToggleSuccess(num)}
                                                title={`Click to set ${num} success(es)`}
                                                className="transition-transform active:scale-125"
                                            >
                                                <Heart 
                                                    className={`w-6 h-6 transition-all duration-200 ${
                                                        num <= successes 
                                                            ? 'fill-emerald-500 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)] scale-110' 
                                                            : 'text-gray-600 hover:text-emerald-600'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Failures */}
                                <div className="bg-[#1b1c20] p-2.5 rounded-lg border border-gray-800 flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                                        <Skull className="w-3 h-3 text-red-500" />
                                        Failures ({failures}/3)
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3].map((num) => (
                                            <button
                                                key={`fail-${num}`}
                                                onClick={() => handleToggleFailure(num)}
                                                title={`Click to set ${num} failure(s)`}
                                                className="transition-transform active:scale-125"
                                            >
                                                <Skull 
                                                    className={`w-6 h-6 transition-all duration-200 ${
                                                        num <= failures 
                                                            ? 'fill-red-600 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] scale-110' 
                                                            : 'text-gray-600 hover:text-red-600'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Actions */}
                    {mode !== 'deathsaves' && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthManagerModal;
