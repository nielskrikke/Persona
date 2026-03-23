
import React, { useState, useEffect } from 'react';
import { CreatureDetail, CharacterState } from '@/types';
import { Library } from '@/data/index';
import { calculateModifier } from '@/utils/rules';
import CustomCreatureModal from './CustomCreatureModal';
import { Search, Plus, Trash2, PawPrint, Sparkles, Wand2 } from 'lucide-react';

interface CreatureManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: CharacterState;
    mode: 'wildshape' | 'familiar' | 'polymorph';
    onAction: (creature: CreatureDetail) => void;
    onAddCustom: (creature: CreatureDetail) => void;
    onRemoveCustom: (id: string) => void;
    onOpenForge: () => void;
}

const CreatureManagerModal: React.FC<CreatureManagerModalProps> = ({ 
    isOpen, onClose, character, mode, onAction, onAddCustom, onRemoveCustom, onOpenForge 
}) => {
    const [creatures, setCreatures] = useState<CreatureDetail[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSize, setSelectedSize] = useState<string>('All');
    const [selectedCreature, setSelectedCreature] = useState<CreatureDetail | null>(null);
    const [showCustomModal, setShowCustomModal] = useState(false);

    // Calculate Constraints
    const druidClass = character.classes.find(c => c.definition.index === 'druid');
    const druidLevel = druidClass?.level || 0;
    const isMoonDruid = druidClass?.subclass?.index === 'moon';

    const canSwim = mode === 'wildshape' ? druidLevel >= 4 : true;
    const canFly = mode === 'wildshape' ? druidLevel >= 8 : true;
    
    let maxCR = 100; // Default for polymorph (actually limited by target level, but we'll show all for now or filter later)
    if (mode === 'wildshape') {
        if (isMoonDruid) {
            maxCR = druidLevel >= 6 ? Math.floor(druidLevel / 3) : 1;
        } else {
            maxCR = druidLevel >= 8 ? 1 : druidLevel >= 4 ? 0.5 : 0.25;
        }
    } else if (mode === 'familiar') {
        maxCR = 0.25; // Standard familiars are low CR
    }

    useEffect(() => {
        if (isOpen) {
            let allCreatures: CreatureDetail[] = Library.getCreatures();

            const customCreatures = character.customCreatures || [];
            allCreatures = [...customCreatures, ...allCreatures];
            
            // Filter based on limitations
            const filtered = allCreatures.filter(b => {
                if (mode === 'wildshape') {
                    if (b.challenge_rating > maxCR) return false;
                    if (!canSwim && b.swim_speed) return false;
                    if (!canFly && b.fly_speed) return false;
                }
                if (mode === 'familiar') {
                    // Familiars are usually specific, but we'll allow filtering by CR if needed
                }
                return true;
            });

            setCreatures(filtered);
            setSelectedCreature(null);
            setSearchTerm('');
        }
    }, [isOpen, mode, druidLevel, isMoonDruid, character.customCreatures]);

    if (!isOpen) return null;

    const filteredCreatures = creatures.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSize = selectedSize === 'All' || c.size === selectedSize;
        return matchesSearch && matchesSize;
    });

    const sizes = ['All', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

    const formatSpeed = (creature: CreatureDetail) => {
        let s = creature.speed;
        if (creature.fly_speed) s += `, fly ${creature.fly_speed} ft.`;
        if (creature.swim_speed) s += `, swim ${creature.swim_speed} ft.`;
        return s;
    };

    const getThemeColor = () => {
        switch (mode) {
            case 'wildshape': return 'text-dnd-gold border-dnd-gold/50 bg-dnd-gold';
            case 'familiar': return 'text-pink-400 border-pink-500/50 bg-pink-500';
            case 'polymorph': return 'text-purple-400 border-purple-500/50 bg-purple-500';
            default: return 'text-dnd-gold border-dnd-gold/50 bg-dnd-gold';
        }
    };

    const getThemeIcon = () => {
        switch (mode) {
            case 'wildshape': return <PawPrint className="w-6 h-6" />;
            case 'familiar': return <Sparkles className="w-6 h-6" />;
            case 'polymorph': return <Wand2 className="w-6 h-6" />;
            default: return <PawPrint className="w-6 h-6" />;
        }
    };

    const theme = getThemeColor().split(' ');

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
            <CustomCreatureModal 
                isOpen={showCustomModal} 
                onClose={() => setShowCustomModal(false)} 
                onSave={(creature) => { onAddCustom(creature); setShowCustomModal(false); }} 
            />

            <div className={`bg-[#1b1c20] border-2 ${theme[1]} rounded-xl w-full max-w-5xl shadow-2xl flex flex-col h-[85vh]`}>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`${theme[0]}`}>{getThemeIcon()}</div>
                        <div>
                            <h2 className={`text-3xl font-serif ${theme[0]}`}>
                                {mode === 'wildshape' ? 'Wild Shape' : mode === 'familiar' ? 'Summon Familiar' : 'Polymorph'}
                            </h2>
                            <div className="flex gap-4 text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">
                                {mode === 'wildshape' && (
                                    <>
                                        <span>Max CR: {maxCR}</span>
                                        <span>Swim: {canSwim ? 'Yes' : 'No'}</span>
                                        <span>Fly: {canFly ? 'Yes' : 'No'}</span>
                                    </>
                                )}
                                {mode === 'familiar' && <span>Spirit Bond</span>}
                                {mode === 'polymorph' && <span>Arcane Transformation</span>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors">&times;</button>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Left: List */}
                    <div className="w-1/3 border-r border-gray-700 p-4 flex flex-col bg-[#16171a]">
                        <button 
                            onClick={onOpenForge}
                            className="mb-4 w-full py-2 bg-gray-800 border border-gray-600 hover:border-white text-white font-bold uppercase text-[10px] rounded transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-3 h-3" /> Forge Custom Form
                        </button>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search forms..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0b0c0e] border border-gray-600 rounded pl-10 pr-4 py-2 text-white focus:border-white outline-none text-sm"
                                autoFocus
                            />
                        </div>

                        {/* Size Filter */}
                        <div className="mb-4 flex flex-wrap gap-1">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-colors border ${selectedSize === size ? `${theme[0]} ${theme[1]} bg-white/5` : 'text-gray-500 border-gray-800 hover:border-gray-600'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1">
                            {filteredCreatures.map(c => (
                                <button 
                                    key={c.index}
                                    onClick={() => setSelectedCreature(c)}
                                    className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center ${selectedCreature?.index === c.index ? `${theme[2]} text-black font-bold` : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <span className="truncate pr-2">{c.name} {c.isCustom && <span className="text-[10px] text-blue-400 ml-1">★</span>}</span>
                                    <span className="text-[10px] opacity-70 shrink-0">CR {c.challenge_rating}</span>
                                </button>
                            ))}
                            {filteredCreatures.length === 0 && <div className="text-gray-500 italic text-center text-sm mt-4">No forms found.</div>}
                        </div>
                    </div>

                    {/* Right: Detail */}
                    <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar bg-[#1b1c20]">
                        {selectedCreature ? (
                            <div className="max-w-2xl mx-auto">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-4">
                                    <div>
                                        <h1 className="text-4xl font-serif text-white mb-1">{selectedCreature.name}</h1>
                                        <div className="text-sm text-gray-400 italic">{selectedCreature.size} {selectedCreature.type}, Unaligned</div>
                                    </div>
                                    <div className="text-right">
                                         <div className={`text-2xl font-bold ${theme[0]}`}>CR {selectedCreature.challenge_rating}</div>
                                         <div className="text-[10px] text-gray-500 uppercase font-black">XP {selectedCreature.challenge_rating * 200}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                    <div className="bg-gray-800/50 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-black text-gray-500">Armor Class</div>
                                        <div className="text-xl text-white font-bold">{selectedCreature.ac}</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-black text-gray-500">Hit Points</div>
                                        <div className="text-xl text-green-400 font-bold">{selectedCreature.hp}</div>
                                        <div className="text-[10px] text-gray-500">{selectedCreature.hit_dice}</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-2 rounded border border-gray-700">
                                        <div className="text-[10px] uppercase font-black text-gray-500">Speed</div>
                                        <div className="text-sm text-white font-bold leading-tight mt-1">{formatSpeed(selectedCreature)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-2 text-center mb-6 bg-gray-800/30 p-3 rounded border border-gray-700">
                                    {[
                                        { l: 'STR', v: selectedCreature.str },
                                        { l: 'DEX', v: selectedCreature.dex },
                                        { l: 'CON', v: selectedCreature.con },
                                        { l: 'INT', v: selectedCreature.int },
                                        { l: 'WIS', v: selectedCreature.wis },
                                        { l: 'CHA', v: selectedCreature.cha },
                                    ].map(stat => (
                                        <div key={stat.l}>
                                            <div className="text-[10px] font-black text-gray-500">{stat.l}</div>
                                            <div className="text-lg font-bold text-white">{stat.v}</div>
                                            <div className="text-[10px] text-gray-400">{calculateModifier(stat.v) >= 0 ? '+' : ''}{calculateModifier(stat.v)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 text-sm text-gray-300">
                                    {selectedCreature.traits?.map(t => (
                                        <div key={t.name}>
                                            <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                                        </div>
                                    ))}
                                    
                                    {selectedCreature.actions.length > 0 && (
                                        <>
                                            <h4 className={`text-lg font-serif ${theme[0]} border-b border-gray-700 pb-1 pt-2`}>Actions</h4>
                                            {selectedCreature.actions.map((a, i) => (
                                                <div key={i}>
                                                    <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {selectedCreature.isCustom && (
                                        <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end">
                                            <button 
                                                onClick={() => { onRemoveCustom(selectedCreature.index); setSelectedCreature(null); }}
                                                className="text-[10px] text-red-500 hover:text-white border border-red-900/50 bg-red-900/10 hover:bg-red-900 px-3 py-1 rounded uppercase font-bold flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Delete Custom Form
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                                <div className="opacity-10 mb-4">{getThemeIcon()}</div>
                                Select a form to view its details.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-[#121316] rounded-b-xl flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                    <button 
                        onClick={() => selectedCreature && onAction(selectedCreature)}
                        disabled={!selectedCreature}
                        className={`${theme[2]} hover:opacity-90 disabled:bg-gray-700 disabled:text-gray-500 text-black px-12 py-3 rounded font-black uppercase text-xs shadow-lg transition-all active:scale-95`}
                    >
                        {mode === 'wildshape' ? 'Transform' : mode === 'familiar' ? 'Summon' : 'Polymorph'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreatureManagerModal;
