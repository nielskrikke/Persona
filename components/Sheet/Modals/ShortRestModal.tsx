
import React from 'react';
import { CharacterState } from '@/types';
import { calculateModifier, formatModifier } from '@/utils/rules';
import { CLASS_FEATURES } from '../../../data/constants';
import { rollDice } from '../../../utils/dice';

const ShortRestModal = ({ 
    isOpen, 
    onClose, 
    character, 
    onUpdate,
    onRoll
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    character: CharacterState, 
    onUpdate: (updates: Partial<CharacterState>) => void,
    onRoll: (formula: string, label: string) => void
}) => {
    if (!isOpen) return null;

    // Group available hit dice
    const conMod = calculateModifier(character.abilities.con);
    const dieGroups: Record<string, { max: number, spent: number }> = {};
    character.classes.forEach(c => {
        const size = String(c.definition.hit_die);
        if (!dieGroups[size]) dieGroups[size] = { max: 0, spent: 0 };
        dieGroups[size].max += c.level;
        dieGroups[size].spent = character.hitDiceUsage[size] || 0;
    });

    const handleSpend = (size: string) => {
        if ((dieGroups[size].max - dieGroups[size].spent) <= 0) return;

        // Roll HD
        const result = rollDice(`1d${size}`, `Hit Die (d${size})`);
        onRoll(`1d${size}${formatModifier(conMod)}`, `Hit Die (d${size})`);
        
        const healing = Math.max(0, result.total + conMod);
        
        onUpdate({
            currentHp: Math.min(character.maxHp, character.currentHp + healing),
            hitDiceUsage: {
                ...character.hitDiceUsage,
                [size]: (character.hitDiceUsage[size] || 0) + 1
            }
        });
    };

    const handleFinish = () => {
        const newFeatures = {...character.featureUsage};
        Object.keys(newFeatures).forEach(key => {
            const featureDef = Object.values(CLASS_FEATURES).find(f => f.name === key);
            const resetRule = (newFeatures[key] as any).reset || featureDef?.reset || 'long';
            if (resetRule === 'short') {
                newFeatures[key].current = newFeatures[key].max;
            }
        });

        // Warlock Pact Magic slots also reset on short rest
        const newSlots = {...character.spellSlots};
        const hasWarlock = character.classes.some(c => c.definition.name.toLowerCase() === 'warlock');
        if (hasWarlock) {
            Object.keys(newSlots).forEach(lvl => {
                const l = parseInt(lvl);
                newSlots[l].current = newSlots[l].max;
            });
        }

        onUpdate({ featureUsage: newFeatures, spellSlots: newSlots });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4">
            <div className="bg-[#1b1c20] border border-dnd-gold rounded-lg w-full max-w-lg shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
                <h2 className="text-3xl font-serif text-dnd-gold mb-2 text-center">Short Rest</h2>
                <p className="text-gray-400 text-sm mb-6 text-center italic">Take an hour to bind your wounds and gather your strength.</p>

                <div className="bg-black/40 rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-700">
                    <div>
                        <div className="text-[10px] uppercase text-gray-500 font-bold">Health</div>
                        <div className="text-2xl font-bold text-white">{character.currentHp} / {character.maxHp}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase text-gray-500 font-bold">CON Modifier</div>
                        <div className="text-2xl font-bold text-dnd-gold">{formatModifier(conMod)}</div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">Spend Hit Dice</h3>
                    {Object.entries(dieGroups).map(([size, usage]) => (
                        <div key={size} className="flex justify-between items-center bg-gray-800/40 p-3 rounded border border-gray-700">
                            <div>
                                <span className="text-white font-bold">d{size}</span>
                                <span className="ml-3 text-xs text-gray-500">{usage.max - usage.spent} remaining</span>
                            </div>
                            <button 
                                onClick={() => handleSpend(size)}
                                disabled={usage.max - usage.spent <= 0 || character.currentHp >= character.maxHp}
                                className="px-4 py-2 bg-emerald-900/40 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 rounded text-xs font-bold uppercase disabled:opacity-30 disabled:hover:bg-emerald-900/40"
                            >
                                Roll & Heal
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={handleFinish} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors">
                    Finish Rest
                </button>
            </div>
        </div>
    );
};

export default ShortRestModal;
