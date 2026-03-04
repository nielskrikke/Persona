
import React, { useState, useEffect } from 'react';
import { BeastDetail, CharacterState } from '@/types';
import { Library } from '@/data/index';
import { calculateModifier } from '@/utils/rules';
import CustomBeastModal from './CustomBeastModal';

interface WildShapeModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: CharacterState;
    onTransform: (beast: BeastDetail) => void;
    onAddCustomBeast: (beast: BeastDetail) => void;
    onRemoveCustomBeast: (id: string) => void;
}

const WildShapeModal: React.FC<WildShapeModalProps> = ({ isOpen, onClose, character, onTransform, onAddCustomBeast, onRemoveCustomBeast }) => {
    const [beasts, setBeasts] = useState<BeastDetail[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBeast, setSelectedBeast] = useState<BeastDetail | null>(null);
    const [showCustomModal, setShowCustomModal] = useState(false);

    // Calculate Druid Level and Constraints
    const druidClass = character.classes.find(c => c.definition.index === 'druid');
    const druidLevel = druidClass?.level || 0;
    const isMoonDruid = druidClass?.subclass?.index === 'moon';

    // Constraints
    const canSwim = druidLevel >= 4;
    const canFly = druidLevel >= 8;
    
    let maxCR = 0;
    if (isMoonDruid) {
        maxCR = druidLevel >= 6 ? Math.floor(druidLevel / 3) : 1;
    } else {
        maxCR = druidLevel >= 8 ? 1 : druidLevel >= 4 ? 0.5 : 0.25;
    }

    useEffect(() => {
        if (isOpen) {
            const libraryBeasts = Library.getBeasts();
            const customBeasts = character.customBeasts || [];
            
            const allBeasts = [...customBeasts, ...libraryBeasts];
            
            // Filter based on Druid limitations (Note: Custom beasts still filtered by CR for now, but maybe should be looser?)
            const filtered = allBeasts.filter(b => {
                if (b.challenge_rating > maxCR) return false;
                if (!canSwim && b.swim_speed) return false;
                if (!canFly && b.fly_speed) return false;
                return true;
            });
            setBeasts(filtered);
            setSelectedBeast(null);
            setSearchTerm('');
        }
    }, [isOpen, druidLevel, isMoonDruid, character.customBeasts]);

    if (!isOpen) return null;

    const filteredBeasts = beasts.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatSpeed = (beast: BeastDetail) => {
        let s = beast.speed;
        if (beast.fly_speed) s += `, fly ${beast.fly_speed} ft.`;
        if (beast.swim_speed) s += `, swim ${beast.swim_speed} ft.`;
        return s;
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
            <CustomBeastModal 
                isOpen={showCustomModal} 
                onClose={() => setShowCustomModal(false)} 
                onSave={(beast) => { onAddCustomBeast(beast); setShowCustomModal(false); }} 
            />

            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-5xl shadow-2xl flex flex-col h-[85vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-dnd-gold">Wild Shape</h2>
                        <div className="flex gap-4 text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
                            <span>Max CR: {maxCR}</span>
                            <span>Swim: {canSwim ? 'Yes' : 'No'}</span>
                            <span>Fly: {canFly ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors">&times;</button>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Left: List */}
                    <div className="w-1/3 border-r border-gray-700 p-4 flex flex-col bg-[#16171a]">
                        <button 
                            onClick={() => setShowCustomModal(true)}
                            className="mb-4 w-full py-2 bg-gray-800 border border-gray-600 hover:border-dnd-gold text-white font-bold uppercase text-xs rounded transition-colors"
                        >
                            + Create Custom Form
                        </button>
                        <input 
                            type="text" 
                            placeholder="Search beasts..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none mb-4"
                            autoFocus
                        />
                        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1">
                            {filteredBeasts.map(b => (
                                <button 
                                    key={b.index}
                                    onClick={() => setSelectedBeast(b)}
                                    className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center ${selectedBeast?.index === b.index ? 'bg-dnd-gold text-black font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <span>{b.name} {b.isCustom && <span className="text-[10px] text-blue-400 ml-1">★</span>}</span>
                                    <span className="text-xs opacity-70">CR {b.challenge_rating}</span>
                                </button>
                            ))}
                            {filteredBeasts.length === 0 && <div className="text-gray-500 italic text-center text-sm mt-4">No beasts found within limits.</div>}
                        </div>
                    </div>

                    {/* Right: Detail */}
                    <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar bg-[#1b1c20]">
                        {selectedBeast ? (
                            <div className="max-w-2xl mx-auto">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-4">
                                    <div>
                                        <h1 className="text-4xl font-serif text-white mb-1">{selectedBeast.name}</h1>
                                        <div className="text-sm text-gray-400 italic">{selectedBeast.size} {selectedBeast.type}, Unaligned</div>
                                    </div>
                                    <div className="text-right">
                                         <div className="text-2xl font-bold text-dnd-gold">CR {selectedBeast.challenge_rating}</div>
                                         <div className="text-xs text-gray-500">XP {selectedBeast.challenge_rating * 200}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                    <div className="bg-gray-800 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-bold text-gray-500">Armor Class</div>
                                        <div className="text-xl text-white font-bold">{selectedBeast.ac}</div>
                                    </div>
                                    <div className="bg-gray-800 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-bold text-gray-500">Hit Points</div>
                                        <div className="text-xl text-green-400 font-bold">{selectedBeast.hp}</div>
                                        <div className="text-[10px] text-gray-500">{selectedBeast.hit_dice}</div>
                                    </div>
                                    <div className="bg-gray-800 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-bold text-gray-500">Speed</div>
                                        <div className="text-sm text-white font-bold leading-tight mt-1">{formatSpeed(selectedBeast)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-2 text-center mb-6 bg-gray-800/50 p-3 rounded border border-gray-700">
                                    {[
                                        { l: 'STR', v: selectedBeast.str },
                                        { l: 'DEX', v: selectedBeast.dex },
                                        { l: 'CON', v: selectedBeast.con },
                                        { l: 'INT', v: selectedBeast.int },
                                        { l: 'WIS', v: selectedBeast.wis },
                                        { l: 'CHA', v: selectedBeast.cha },
                                    ].map(stat => (
                                        <div key={stat.l}>
                                            <div className="text-[10px] font-bold text-gray-500">{stat.l}</div>
                                            <div className="text-lg font-bold text-white">{stat.v}</div>
                                            <div className="text-xs text-gray-400">{calculateModifier(stat.v) >= 0 ? '+' : ''}{calculateModifier(stat.v)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 text-sm text-gray-300">
                                    {selectedBeast.traits.map(t => (
                                        <div key={t.name}>
                                            <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                                        </div>
                                    ))}
                                    
                                    {selectedBeast.actions.length > 0 && (
                                        <>
                                            <h4 className="text-lg font-serif text-dnd-gold border-b border-gray-700 pb-1 pt-2">Actions</h4>
                                            {selectedBeast.actions.map((a, i) => (
                                                <div key={i}>
                                                    <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {selectedBeast.isCustom && (
                                        <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end">
                                            <button 
                                                onClick={() => { onRemoveCustomBeast(selectedBeast.index); setSelectedBeast(null); }}
                                                className="text-xs text-red-500 hover:text-white border border-red-900 bg-red-900/20 hover:bg-red-900 px-3 py-1 rounded"
                                            >
                                                Delete Custom Form
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                                <span className="text-6xl mb-4 opacity-20">🐾</span>
                                Select a beast to view its nature.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-[#121316] rounded-b-xl flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs">Cancel</button>
                    <button 
                        onClick={() => selectedBeast && onTransform(selectedBeast)}
                        disabled={!selectedBeast}
                        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white px-12 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors"
                    >
                        Transform
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WildShapeModal;
