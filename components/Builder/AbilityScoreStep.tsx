
import React, { useState, useEffect } from 'react';
import { AbilityScores, ABILITY_NAMES, ABILITY_LABELS, AbilityName, RaceDetail } from '../../types';
import { calculateModifier, formatModifier, getPointBuyCost } from '../../utils/rules';

interface AbilityScoreStepProps {
    race: RaceDetail | null;
    initialScores: AbilityScores;
    onSave: (scores: AbilityScores) => void;
    onBack: () => void;
}

const MAX_POINTS = 27;
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const AbilityScoreStep: React.FC<AbilityScoreStepProps> = ({ race, initialScores, onSave, onBack }) => {
    const [baseScores, setBaseScores] = useState<AbilityScores>({...initialScores});
    const [pointsUsed, setPointsUsed] = useState(0);
    const [mode, setMode] = useState<'pointbuy' | 'manual'>('pointbuy');

    const getRaceBonus = (stat: AbilityName): number => {
        if (!race) return 0;
        const bonus = race.ability_bonuses.find(b => b.ability_score.index === stat);
        return bonus ? bonus.bonus : 0;
    };

    useEffect(() => {
        let used = 0;
        ABILITY_NAMES.forEach(stat => {
            const cost = getPointBuyCost(baseScores[stat]);
            if (cost !== 100) used += cost;
        });
        setPointsUsed(used);
    }, [baseScores]);

    const handleScoreChange = (stat: AbilityName, delta: number) => {
        const currentScore = baseScores[stat];
        const newScore = currentScore + delta;

        if (mode === 'pointbuy') {
            if (newScore < 8 || newScore > 15) return;
            const currentCost = getPointBuyCost(currentScore);
            const newCost = getPointBuyCost(newScore);
            const costDiff = newCost - currentCost;
            if (pointsUsed + costDiff > MAX_POINTS) return;
        } else {
            if (newScore < 1 || newScore > 20) return;
        }

        const newScores = { ...baseScores, [stat]: newScore };
        setBaseScores(newScores);
    };

    const handleManualInput = (stat: AbilityName, value: string) => {
        const val = parseInt(value) || 0;
        if (val >= 1 && val <= 20) {
             setBaseScores(prev => ({ ...prev, [stat]: val }));
        }
    };

    const handleRandomize = () => {
        const shuffled = [...STANDARD_ARRAY].sort(() => Math.random() - 0.5);
        const newScores: any = {};
        ABILITY_NAMES.forEach((stat, index) => {
            newScores[stat] = shuffled[index];
        });
        setBaseScores(newScores);
        setMode('pointbuy');
    };

    const remainingPoints = MAX_POINTS - pointsUsed;

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
            <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                    <div>
                         <h2 className="text-4xl font-serif text-white mb-1">Ability Scores</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Distribute your raw potential</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 bg-black/40 p-1 rounded-full border border-gray-800">
                        <button 
                            onClick={() => setMode('pointbuy')}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'pointbuy' ? 'bg-dnd-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Point Buy
                        </button>
                        <button 
                            onClick={() => setMode('manual')}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'manual' ? 'bg-dnd-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Manual
                        </button>
                        <button 
                            onClick={handleRandomize}
                            className="px-6 py-2 border border-blue-900/50 bg-blue-900/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-900/20 transition-all"
                        >
                            🎲 Standard Array
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    {mode === 'pointbuy' && (
                        <div className="flex justify-center mb-8">
                             <div className={`px-10 py-3 rounded-2xl border-2 flex flex-col items-center transition-colors ${remainingPoints >= 0 ? 'border-dnd-gold text-dnd-gold bg-dnd-gold/5' : 'border-red-600 text-red-500 bg-red-900/5'}`}>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Points Remaining</span>
                                <span className="text-4xl font-black">{remainingPoints}</span>
                             </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {ABILITY_NAMES.map(stat => {
                            const base = baseScores[stat];
                            const bonus = getRaceBonus(stat);
                            const total = base + bonus;
                            const mod = calculateModifier(total);

                            return (
                                <div key={stat} className="bg-black/20 rounded-2xl p-6 border border-gray-800 flex flex-col items-center shadow-xl group hover:border-gray-600 transition-all">
                                    <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black mb-4 group-hover:text-dnd-gold transition-colors">{ABILITY_LABELS[stat]}</span>
                                    
                                    <div className="relative mb-4">
                                        <div className="text-6xl font-serif text-white">{total}</div>
                                        {bonus > 0 && (
                                            <div className="absolute -top-1 -right-8 bg-green-900/30 text-green-400 border border-green-800 px-2 py-0.5 rounded text-[10px] font-black">
                                                +{bonus}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-black/40 rounded-lg px-4 py-1.5 mb-6 text-2xl font-black text-dnd-gold border border-gray-800">
                                        {formatModifier(mod)}
                                    </div>

                                    <div className="flex items-center gap-5 bg-[#0b0c0e] rounded-full px-5 py-2 border border-gray-700 shadow-inner">
                                        <button 
                                            onClick={() => handleScoreChange(stat, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white font-black text-xl disabled:opacity-20 transition-colors"
                                            disabled={mode === 'pointbuy' && base <= 8}
                                        >
                                            &minus;
                                        </button>
                                        <div className="flex flex-col items-center w-12">
                                            {mode === 'manual' ? (
                                                <input 
                                                    type="number"
                                                    value={base}
                                                    onChange={(e) => handleManualInput(stat, e.target.value)}
                                                    className="w-full bg-transparent text-center text-xl font-black text-white outline-none"
                                                />
                                            ) : (
                                                <span className="text-xl font-black text-white">{base}</span>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleScoreChange(stat, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white font-black text-xl disabled:opacity-20 transition-colors"
                                            disabled={mode === 'pointbuy' && (base >= 15 || remainingPoints < (getPointBuyCost(base + 1) - getPointBuyCost(base)))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Persistent Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e] to-transparent z-[100]">
                <div className="max-w-6xl mx-auto flex gap-4">
                    <button 
                        onClick={onBack}
                        className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl"
                    >
                        &larr; Back
                    </button>
                    <button 
                        onClick={() => onSave(baseScores)}
                        className="flex-grow py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-2xl transition-all transform active:scale-95 bg-dnd-gold hover:bg-yellow-600 text-black"
                    >
                        Confirm Attributes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AbilityScoreStep;
