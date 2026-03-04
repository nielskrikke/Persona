
import React, { useState, useEffect } from 'react';
import SidePanelLayout from '../Shared/SidePanelLayout';
import { CharacterState, SpellDetail } from '../../../types';
import { getLocalSpells } from '../../../data/index';
import { getSpellsKnownCount } from '../../../utils/rules';

const SpellManagerSidePanel = ({ 
    character, 
    isOpen, 
    onClose, 
    onUpdateSpells,
    onAddCustom,
    isPinned,
    onTogglePin
}: { 
    character: CharacterState, 
    isOpen: boolean, 
    onClose: () => void, 
    onUpdateSpells: (spells: SpellDetail[]) => void,
    onAddCustom: () => void,
    isPinned: boolean,
    onTogglePin: () => void; 
}) => {
    // Initialize active class to the first spellcasting class or just the first class
    const [activeClassIndex, setActiveClassIndex] = useState<string>('');
    const [availableSpells, setAvailableSpells] = useState<SpellDetail[]>([]);
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmSpell, setConfirmSpell] = useState<SpellDetail | null>(null);
    
    // State for expanded spell detail
    const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);

    // Sync active class on open
    useEffect(() => {
        if (isOpen && character.classes.length > 0) {
            // Try to keep current selection if valid, else default to first
            const valid = character.classes.find(c => c.definition.index === activeClassIndex);
            if (!valid) {
                setActiveClassIndex(character.classes[0].definition.index);
            }
        }
    }, [isOpen, character.classes]);

    const activeClass = character.classes.find(c => c.definition.index === activeClassIndex);
    
    // Calculate limits for the ACTIVE class
    const limits = activeClass 
        ? getSpellsKnownCount(activeClass, character.abilities)
        : { cantrips: 0, spells: 0 };

    // Calculate current usage for the ACTIVE class
    const knownSpells = character.spells.filter(s => s.sourceClassIndex === activeClassIndex);
    const currentCantrips = knownSpells.filter(s => s.level === 0).length;
    const currentLeveled = knownSpells.filter(s => s.level > 0).length;

    // Load spells for the ACTIVE class
    useEffect(() => {
        if (!isOpen || !activeClassIndex) return;
        
        const loadSpells = async () => {
            setLoading(true);
            // Fetch spells specific to this class
            const spells = getLocalSpells(activeClassIndex);
            // Sort by level then name
            const sorted = spells.sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
            setAvailableSpells(sorted);
            setLoading(false);
        };
        loadSpells();
    }, [isOpen, activeClassIndex]); // Reload when tab changes

    const isKnown = (spell: SpellDetail) => {
        // Check if known specifically by this class
        return character.spells.some(s => s.index === spell.index && s.sourceClassIndex === activeClassIndex);
    };

    const tryAddSpell = (spell: SpellDetail) => {
        if (isKnown(spell)) {
            // Remove
            onUpdateSpells(character.spells.filter(s => !(s.index === spell.index && s.sourceClassIndex === activeClassIndex)));
            return;
        }

        const isCantrip = spell.level === 0;
        const overLimit = isCantrip 
            ? (limits.cantrips > 0 && currentCantrips >= limits.cantrips) 
            : (limits.spells > 0 && currentLeveled >= limits.spells);
        
        // Simplified check: usually can't learn spells higher than slot level, but we'll stick to a basic level check
        const maxSpellLevel = Math.ceil((activeClass?.level || 1) / 2); 
        const tooHigh = spell.level > maxSpellLevel && spell.level > 0; // cantrips are 0

        if (overLimit || tooHigh) {
            setConfirmSpell(spell);
        } else {
            addSpell(spell);
        }
    };

    const addSpell = (spell: SpellDetail) => {
        const newSpell = { ...spell, isPrepared: true, sourceClassIndex: activeClassIndex };
        onUpdateSpells([...character.spells, newSpell]);
        setConfirmSpell(null);
    };
    
    const removeKnownSpell = (spell: SpellDetail) => {
         onUpdateSpells(character.spells.filter(s => !(s.index === spell.index && s.sourceClassIndex === activeClassIndex)));
    };

    const toggleExpand = (spellIndex: string) => {
        setExpandedSpellId(prev => prev === spellIndex ? null : spellIndex);
    };

    const renderSpellDetail = (spell: SpellDetail) => (
        <div className="p-3 bg-black/40 border-t border-gray-700/50 text-xs text-gray-300 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold text-gray-500">
                <div>
                    Time: <span className="text-gray-300">{spell.casting_time}{spell.ritual && !spell.casting_time.toLowerCase().includes('ritual') ? ' (Ritual)' : ''}</span>
                </div>
                <div>Range: <span className="text-gray-300">{spell.range}</span></div>
                <div>Dur: <span className="text-gray-300">{spell.duration}</span></div>
                <div>Comp: <span className="text-gray-300">{spell.components.join(', ')}</span></div>
            </div>
            <div className="pt-2 border-t border-gray-700/30 leading-relaxed">
                {spell.desc.map((p, i) => <p key={i} className="mb-2 last:mb-0">{p}</p>)}
            </div>
            {spell.higher_level && (
                <div className="pt-2 border-t border-gray-700/30">
                    <span className="text-[10px] font-bold text-dnd-gold uppercase">At Higher Levels:</span>
                    <p className="mt-1">{spell.higher_level}</p>
                </div>
            )}
        </div>
    );

    return (
        <SidePanelLayout
            title="Manage Spells"
            isOpen={isOpen}
            onClose={onClose}
            isPinned={isPinned}
            onTogglePin={onTogglePin}
            footer={
                <button 
                    onClick={onAddCustom}
                    className="w-full py-3 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors text-sm"
                >
                    Create Custom Spell
                </button>
            }
        >
            {confirmSpell && (
                <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6 text-center">
                    <div className="bg-[#1b1c20] border border-red-500 p-6 rounded shadow-2xl">
                        <h3 className="text-xl font-bold text-red-500 mb-2">Rules Warning</h3>
                        <p className="text-gray-300 mb-4 text-sm">
                            You are exceeding your known spell limits or level requirements for <strong>{confirmSpell.name}</strong>.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setConfirmSpell(null)} className="px-4 py-2 border border-gray-500 text-gray-300 rounded">Cancel</button>
                            <button onClick={() => addSpell(confirmSpell)} className="px-4 py-2 bg-red-600 text-white font-bold rounded">Add Anyway</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* CLASS TABS */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto custom-scrollbar border-b border-gray-700 pb-1">
                {character.classes.map(cls => (
                    <button
                        key={cls.definition.index}
                        onClick={() => setActiveClassIndex(cls.definition.index)}
                        className={`px-3 py-2 rounded-t-lg text-xs font-bold uppercase whitespace-nowrap transition-colors ${
                            activeClassIndex === cls.definition.index 
                            ? 'bg-dnd-gold text-black' 
                            : 'bg-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {cls.definition.name} ({cls.level})
                    </button>
                ))}
            </div>

            {/* Limits & Counts */}
            {activeClass && (
                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase border-b border-gray-700 pb-4 mb-4">
                    <span>Cantrips: <span className={currentCantrips >= limits.cantrips ? 'text-red-400' : 'text-white'}>{currentCantrips}/{limits.cantrips}</span></span>
                    <span>Known/Prepared: <span className={currentLeveled >= limits.spells ? 'text-red-400' : 'text-white'}>{currentLeveled}/{limits.spells}</span></span>
                </div>
            )}
            
            {/* Known Spells Section */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-dnd-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
                    My Spellbook
                </h3>
                
                {knownSpells.length === 0 ? (
                    <div className="text-xs text-gray-600 italic pl-4">No spells learned for this class yet.</div>
                ) : (
                    <div className="space-y-1">
                        {knownSpells.sort((a,b) => a.level - b.level || a.name.localeCompare(b.name)).map(spell => {
                             const isExpanded = expandedSpellId === spell.index;
                             return (
                                <div key={spell.index} className={`rounded overflow-hidden border transition-colors ${isExpanded ? 'bg-green-900/20 border-green-700' : 'bg-green-900/10 border-green-800/30'}`}>
                                     <div 
                                        className="flex items-center justify-between p-2 cursor-pointer group hover:bg-green-900/20"
                                        onClick={() => toggleExpand(spell.index)}
                                     >
                                        <div className="flex-grow">
                                            <div className="font-bold text-white text-sm">{spell.name}</div>
                                            <div className="text-[10px] text-gray-400">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-gray-500">{isExpanded ? '▲' : '▼'}</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeKnownSpell(spell); }}
                                                className="text-xs text-red-500 hover:text-red-400 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                            >
                                                Forget
                                            </button>
                                        </div>
                                    </div>
                                    {isExpanded && renderSpellDetail(spell)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Spells Section */}
            <div className="mb-4 space-y-3">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    Learn New Spells
                </h3>
                
                <input type="text" placeholder="Search available spells..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none text-sm" />
                <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
                    <button onClick={() => setFilterLevel('all')} className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-colors ${filterLevel === 'all' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>All</button>
                    {[0,1,2,3,4,5,6,7,8,9].map(l => <button key={l} onClick={() => setFilterLevel(l)} className={`min-w-[24px] px-1 py-1 rounded text-[10px] font-bold transition-colors ${filterLevel === l ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{l === 0 ? 'C' : l}</button>)}
                </div>
            </div>
            
            <div className="space-y-1">
                {loading ? <div className="text-center text-dnd-gold animate-pulse text-xs">Consulting the archives...</div> : 
                 availableSpells.filter(s => (filterLevel === 'all' || s.level === filterLevel) && s.name.toLowerCase().includes(search.toLowerCase()))
                    .map(spell => {
                        const known = isKnown(spell);
                        const isExpanded = expandedSpellId === spell.index;
                        
                        return (
                            <div key={spell.index} className={`rounded overflow-hidden border transition-colors ${known ? 'bg-gray-800/50 border-gray-700 opacity-50' : 'hover:bg-white/5 border-transparent hover:border-gray-600'}`}>
                                <div 
                                    className="flex items-center justify-between p-2 cursor-pointer group"
                                    onClick={() => toggleExpand(spell.index)}
                                >
                                    <div className="flex-grow min-w-0 pr-2">
                                        <div className="font-bold text-gray-300 text-sm group-hover:text-white truncate">
                                            {spell.name} <span className="text-gray-600 text-xs font-normal ml-1">({spell.level === 0 ? 'C' : spell.level})</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 truncate">{spell.school.name}</div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                         {!known ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); tryAddSpell(spell); }} 
                                                className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-blue-900/20 border border-blue-500/50 text-blue-400 hover:bg-blue-900/40 transition-colors"
                                            >
                                                Learn
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-green-500 font-bold uppercase italic pr-2">Learned</span>
                                        )}
                                        <span className="text-[10px] text-gray-600 w-4 text-center">{isExpanded ? '▲' : '▼'}</span>
                                    </div>
                                </div>
                                {isExpanded && renderSpellDetail(spell)}
                            </div>
                        );
                    })
                }
                {availableSpells.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8 italic text-xs">
                        No spells found for this class in the archives.
                    </div>
                )}
            </div>
        </SidePanelLayout>
    );
};

export default SpellManagerSidePanel;
