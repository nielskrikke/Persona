
import React, { useState, useEffect } from 'react';
import { RollResult } from '@/types';
import { formatModifier } from '@/utils/rules';
import { rollDice } from '../../../utils/dice';

const ConcentrationCheckModal = ({ 
    isOpen, 
    dc, 
    spellName, 
    onSuccess, 
    onFail,
    conSaveModifier,
    onRoll
}: { 
    isOpen: boolean, 
    dc: number, 
    spellName: string, 
    onSuccess: () => void, 
    onFail: () => void,
    conSaveModifier: number,
    onRoll: (formula: string, label: string) => void
}) => {
    const [result, setResult] = useState<RollResult | null>(null);

    useEffect(() => {
        if (isOpen) setResult(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const modStr = formatModifier(conSaveModifier);

    const handleRoll = () => {
        const formula = `1d20${modStr}`;
        const label = "Concentration Check";
        const rollRes = rollDice(formula, label);
        setResult(rollRes);
        onRoll(formula, label);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[600] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#1b1c20] border-2 border-blue-500 rounded-xl w-full max-w-md shadow-[0_0_50px_rgba(59,130,246,0.3)] p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Concentration Check</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    You took damage! Make a Constitution saving throw to maintain <strong>{spellName}</strong>.
                </p>
                <div className="bg-black/40 rounded-lg py-4 mb-4 border border-gray-800">
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Target Difficulty</div>
                    <div className="text-5xl font-black text-blue-400 font-serif">DC {dc}</div>
                </div>

                {!result ? (
                    <div className="mb-6">
                        <button 
                            onClick={handleRoll}
                            className="w-full py-3 bg-blue-900/40 border border-blue-500 hover:bg-blue-800 text-blue-100 font-bold uppercase rounded transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Roll 1d20 {modStr}</span>
                        </button>
                    </div>
                ) : (
                    <div className="mb-8 animate-in fade-in zoom-in duration-300">
                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-2">Result</div>
                        <div className={`text-6xl font-black font-serif mb-2 ${result.total >= dc ? 'text-green-500' : 'text-red-500'}`}>
                            {result.total}
                        </div>
                        <div className="text-xs text-gray-500">
                            Rolled: {result.rolls[0]} (d20) {conSaveModifier >= 0 ? '+' : ''}{conSaveModifier}
                        </div>
                         <div className={`text-xl font-bold mt-2 uppercase tracking-widest ${result.total >= dc ? 'text-green-400' : 'text-red-400'}`}>
                            {result.total >= dc ? 'Success' : 'Failure'}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={onFail}
                        className="py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-bold uppercase rounded-lg transition-all text-xs tracking-widest"
                    >
                        {result && result.total < dc ? "Confirm Fail" : "Force Fail"}
                    </button>
                    <button 
                        onClick={onSuccess}
                        className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase rounded-lg shadow-lg transition-all transform active:scale-95 text-xs tracking-widest"
                    >
                        {result && result.total >= dc ? "Confirm Success" : "Force Success"}
                    </button>
                </div>
                <p className="mt-6 text-[10px] text-gray-600 italic">Rules: DC is 10 or half the damage taken, whichever is higher.</p>
            </div>
        </div>
    );
};

export default ConcentrationCheckModal;
