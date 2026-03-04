
import React from 'react';
import { CharacterState, SteelDefenderDetail } from '@/types';

interface SteelDefenderModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: CharacterState;
    onSummon: (defender: SteelDefenderDetail) => void;
}

const SteelDefenderModal: React.FC<SteelDefenderModalProps> = ({ isOpen, onClose, character, onSummon }) => {
    if (!isOpen) return null;

    const artificer = character.classes.find(c => c.definition.index === 'artificer');
    const artificerLevel = artificer?.level || 1;
    const maxHp = 2 + calculateModifier(character.abilities.int) + (artificerLevel * 5);

    const handleSummon = () => {
        const defender: SteelDefenderDetail = {
            id: `defender-${Date.now()}`,
            ac: 15,
            hp: maxHp,
            maxHp: maxHp,
            active: true
        };
        onSummon(defender);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#1b1c20] border-2 border-orange-500 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-orange-400">Summon Steel Defender</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition-colors">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300 font-serif italic leading-relaxed">
                        "Your tinkering has given life to a faithful metallic companion. It is friendly to you and your companions, and it obeys your commands."
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg border border-gray-800 text-xs text-gray-400 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-500 uppercase">Armor Class</span>
                            <span className="text-white">15 (natural armor)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-500 uppercase">Hit Points</span>
                            <span className="text-green-400">{maxHp} (2 + Int + 5 * Lvl)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-500 uppercase">Speed</span>
                            <span className="text-white">40 ft.</span>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-700 bg-[#121316] rounded-b-xl flex justify-end">
                    <button 
                        onClick={handleSummon}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors"
                    >
                        Summon Defender
                    </button>
                </div>
            </div>
        </div>
    );
};

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

export default SteelDefenderModal;
