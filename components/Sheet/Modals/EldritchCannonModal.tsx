import React, { useState } from 'react';
import { CharacterState, EldritchCannonDetail } from '@/types';

interface EldritchCannonModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: CharacterState;
    onSummon: (cannon: EldritchCannonDetail, slotLevel: number) => void;
}

const CANNON_TYPES = [
    {
        name: 'Flamethrower',
        desc: 'Exhales fire in a 15-foot cone. DEX save vs DC for 2d8 fire damage (half on success).',
        damage: '2d8',
        damageType: 'Fire'
    },
    {
        name: 'Force Ballista',
        desc: 'Make a ranged spell attack (120ft). Deals 2d8 force damage and pushes the target 5 feet away.',
        damage: '2d8',
        damageType: 'Force'
    },
    {
        name: 'Defender',
        desc: 'Emits a burst of positive energy. You and each creature of your choice within 10 feet gain 1d8 + INT temp HP.',
        damage: '1d8',
        damageType: 'Temp HP'
    }
];

const EldritchCannonModal: React.FC<EldritchCannonModalProps> = ({ isOpen, onClose, character, onSummon }) => {
    const [selectedType, setSelectedType] = useState<string>('');
    const [size, setSize] = useState<'Tiny' | 'Small'>('Small');
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    if (!isOpen) return null;

    const artificer = character.classes.find(c => c.definition.index === 'artificer');
    const artificerLevel = artificer?.level || 1;
    const maxHp = artificerLevel * 5;
    const freebieAvailable = !character.eldritchCannonFreebieUsed;

    const handleSummon = () => {
        const typeData = CANNON_TYPES.find(t => t.name === selectedType);
        if (!typeData) return;
        
        if (!freebieAvailable && selectedSlot === null) {
            alert("Free daily use expended. You must select a spell slot to summon a new cannon.");
            return;
        }

        const cannon: EldritchCannonDetail = {
            id: `cannon-${Date.now()}`,
            type: selectedType as any,
            ac: 18,
            hp: maxHp,
            maxHp: maxHp,
            size: size,
            active: true,
            description: typeData.desc
        };
        
        onSummon(cannon, freebieAvailable ? 0 : (selectedSlot || 1));
        onClose();
    };

    const availableSlots = Object.entries(character.spellSlots)
        // Fix: Explicitly access properties to avoid spread type error with potentially unknown types from Object.entries
        .map(([level, data]) => ({ level: parseInt(level), max: (data as any).max, current: (data as any).current }))
        .filter(s => s.level >= 1 && s.current > 0);

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#1b1c20] border-2 border-cyan-500 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif text-cyan-400">Summon Eldritch Cannon</h2>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Artillerist Feature</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition-colors">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Choose Cannon Type</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {CANNON_TYPES.map(t => (
                                <button 
                                    key={t.name}
                                    onClick={() => setSelectedType(t.name)}
                                    className={`p-4 rounded-lg border text-left transition-all ${selectedType === t.name ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold uppercase tracking-wide ${selectedType === t.name ? 'text-cyan-400' : 'text-white'}`}>{t.name}</span>
                                        <span className="text-[10px] text-gray-500 font-bold">{t.damageType}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-serif italic">"{t.desc}"</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cannon Size</h3>
                            <div className="flex gap-4">
                                {(['Small', 'Tiny'] as const).map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`flex-1 py-3 rounded-lg border font-bold uppercase text-xs transition-all ${size === s ? 'bg-cyan-900/40 border-cyan-500 text-cyan-100' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                                    >
                                        {s}
                                        <div className="text-[9px] opacity-60 normal-case font-normal mt-0.5">
                                            {s === 'Tiny' ? 'Handheld' : 'Occupies 5ft sq'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Summoning Cost</h3>
                            {freebieAvailable ? (
                                <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 flex items-center justify-between">
                                    <span className="text-xs font-bold text-green-400 uppercase">Free Use Ready</span>
                                    <span className="text-[10px] text-green-600 font-bold italic">1st / Long Rest</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-[10px] text-orange-400 uppercase font-bold mb-1">Select spell slot:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(slot => (
                                                <button
                                                    key={slot.level}
                                                    onClick={() => setSelectedSlot(slot.level)}
                                                    className={`px-3 py-2 rounded border text-xs font-bold uppercase transition-all ${selectedSlot === slot.level ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                                >
                                                    Lvl {slot.level} ({slot.current})
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-xs text-red-500 italic">No slots available!</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-800 text-xs text-gray-400 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-500 uppercase">Armor Class</span>
                            <span className="text-white">18</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-500 uppercase">Hit Points</span>
                            <span className="text-green-400">{maxHp} (5 x Artificer Lvl)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-700 bg-[#121316] rounded-b-xl flex justify-between items-center shrink-0">
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-tight uppercase font-bold italic">Replacing an existing cannon is instantaneous.</p>
                    <button 
                        onClick={handleSummon}
                        disabled={!selectedType || (!freebieAvailable && selectedSlot === null)}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-10 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors"
                    >
                        Summon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EldritchCannonModal;