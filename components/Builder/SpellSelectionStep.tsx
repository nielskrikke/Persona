
import React, { useState, useEffect } from 'react';
import { SpellDetail, CharacterState, CharacterClass } from '../../types';
import { fetchSpellsByClassAndLevel } from '../../data/index';
import { getSpellsKnownCount } from '../../utils/rules';

interface SpellSelectionStepProps {
    character: CharacterState;
    onComplete: (spells: SpellDetail[]) => void;
    onBack: () => void;
}

const SpellSelectionStep: React.FC<SpellSelectionStepProps> = ({ character, onComplete, onBack }) => {
    const casterClasses = character.classes.filter(c => {
        const index = c.definition.index;
        if (['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard', 'artificer'].includes(index)) return true;
        if (['paladin', 'ranger'].includes(index) && c.level >= 2) return true;
        if (c.subclass && ['arcane-trickster', 'eldritch-knight'].includes(c.subclass.index) && c.level >= 3) return true;
        return false;
    });

    const [activeClassIndex, setActiveClassIndex] = useState(casterClasses[0]?.definition.index || '');
    const [classSpells, setClassSpells] = useState<Record<string, SpellDetail[]>>(() => {
        const initial: Record<string, SpellDetail[]> = {};
        const validIndices = new Set(casterClasses.map(c => c.definition.index));
        
        if (character.spells) {
            character.spells.forEach(s => {
                if (s.sourceClassIndex && s.sourceClassIndex !== 'racial' && validIndices.has(s.sourceClassIndex)) {
                    if (!initial[s.sourceClassIndex]) initial[s.sourceClassIndex] = [];
                    if (!initial[s.sourceClassIndex].some(existing => existing.index === s.index)) {
                        initial[s.sourceClassIndex].push(s);
                    }
                }
            });
        }
        return initial;
    });

    const [availableSpellsCache, setAvailableSpellsCache] = useState<Record<string, SpellDetail[]>>({});
    const [loading, setLoading] = useState(false);
    /* Fix: added missing search state */
    const [search, setSearch] = useState('');
    const [hoveredSpell, setHoveredSpell] = useState<SpellDetail | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [validationError, setValidationError] = useState<string | null>(null);

    const activeClass = casterClasses.find(c => c.definition.index === activeClassIndex);
    const limits = activeClass 
        ? getSpellsKnownCount(activeClass, character.abilities) 
        : { cantrips: 0, spells: 0 };

    const currentSelected = classSpells[activeClassIndex] || [];
    const selectedCantrips = currentSelected.filter(s => s.level === 0);
    const selectedLeveled = currentSelected.filter(s => s.level > 0);

    useEffect(() => {
        if (!activeClassIndex) return;
        
        const load = async () => {
            if (!availableSpellsCache[activeClassIndex]) {
                setLoading(true);
                const cls = casterClasses.find(c => c.definition.index === activeClassIndex);
                if (cls) {
                    let allSpells: SpellDetail[] = [];
                    const maxFetchLevel = 9; 
                    for (let i = 0; i <= maxFetchLevel; i++) {
                        const spells = await fetchSpellsByClassAndLevel(cls.definition.index, i);
                        allSpells = [...allSpells, ...spells];
                    }
                    setAvailableSpellsCache(prev => ({...prev, [activeClassIndex]: allSpells}));
                }
                setLoading(false);
            }
        };
        load();
    }, [activeClassIndex, casterClasses]); 

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const toggleSpell = (spell: SpellDetail) => {
        setValidationError(null);
        const list = classSpells[activeClassIndex] || [];
        const isSelected = list.some(s => s.index === spell.index);
        
        if (isSelected) {
            const newList = list.filter(s => s.index !== spell.index);
            setClassSpells({ ...classSpells, [activeClassIndex]: newList });
        } else {
            if (spell.level === 0) {
                if (selectedCantrips.length >= limits.cantrips) return;
            } else {
                if (selectedLeveled.length >= limits.spells) return;
            }
            setClassSpells({ ...classSpells, [activeClassIndex]: [...list, spell] });
        }
    };

    const handleConfirm = () => {
        // Check if all classes have their spells selected
        for (const cls of casterClasses) {
            const clsIndex = cls.definition.index;
            const selected = classSpells[clsIndex] || [];
            const clsLimits = getSpellsKnownCount(cls, character.abilities);
            
            const cantrips = selected.filter(s => s.level === 0).length;
            const leveled = selected.filter(s => s.level > 0).length;
            
            if (cantrips < clsLimits.cantrips) {
                setValidationError(`You can select ${clsLimits.cantrips - cantrips} more cantrips for ${cls.definition.name}.`);
                return;
            }
            if (leveled < clsLimits.spells) {
                setValidationError(`You can select ${clsLimits.spells - leveled} more spells for ${cls.definition.name}.`);
                return;
            }
        }

        setValidationError(null);
        const allSelected = Object.entries(classSpells).flatMap(([cIndex, spells]) => 
            (spells as SpellDetail[]).map(s => ({
                ...s,
                sourceClassIndex: cIndex,
                isPrepared: true
            }))
        );
        onComplete(allSelected);
    };

    const displayedSpells = (availableSpellsCache[activeClassIndex] || []).filter(s => {
        if (!activeClass) return false;
        if (s.level === 0) return true;
        const clsName = activeClass.definition.index;
        const level = activeClass.level;
        let maxSlotLevel = 0;
        if (['wizard', 'sorcerer', 'bard', 'cleric', 'druid'].includes(clsName)) {
            maxSlotLevel = Math.ceil(level / 2);
        } else if (['paladin', 'ranger'].includes(clsName)) {
            if (level < 2) return false;
            if (level >= 17) maxSlotLevel = 5;
            else if (level >= 13) maxSlotLevel = 4;
            else if (level >= 9) maxSlotLevel = 3;
            else if (level >= 5) maxSlotLevel = 2;
            else maxSlotLevel = 1;
        } else if (clsName === 'warlock') {
             maxSlotLevel = Math.ceil(level / 2);
             if (maxSlotLevel > 5) maxSlotLevel = 5; 
        } else if (clsName === 'artificer') {
            maxSlotLevel = Math.ceil(level / 2);
        } else if (['arcane-trickster', 'eldritch-knight'].includes(activeClass.subclass?.index || '')) {
             if (level >= 19) maxSlotLevel = 4;
             else if (level >= 13) maxSlotLevel = 3;
             else if (level >= 7) maxSlotLevel = 2;
             else maxSlotLevel = 1;
        }
        return s.level <= maxSlotLevel;
    }).sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));

    if (casterClasses.length === 0) {
         return (
            <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                <p className="font-serif text-2xl text-gray-500 mb-8 italic">The path you have chosen requires no manipulation of the weave.</p>
                <button onClick={() => onComplete([])} className="px-12 py-4 bg-dnd-gold text-black font-black uppercase tracking-widest rounded-xl shadow-2xl">Continue &rarr;</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500" onMouseMove={handleMouseMove}>
             {hoveredSpell && (
                <div 
                    className="fixed w-80 bg-[#121316] border-2 border-dnd-gold rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-[200] text-sm pointer-events-none"
                    style={{ 
                        top: cursorPos.y + 15, 
                        left: cursorPos.x + 15,
                        transform: cursorPos.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
                    }}
                >
                    <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-3">
                        <h4 className="font-black text-xl text-white font-serif">{hoveredSpell.name}</h4>
                        <span className="text-[10px] text-dnd-gold font-black uppercase tracking-widest">{hoveredSpell.level === 0 ? 'Cantrip' : `Level ${hoveredSpell.level}`}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-[10px] font-black uppercase text-gray-500 mb-4">
                        <div className="flex flex-col"><span className="text-gray-600">Time</span> <span className="text-gray-300">{hoveredSpell.casting_time}</span></div>
                        <div className="flex flex-col"><span className="text-gray-600">Range</span> <span className="text-gray-300">{hoveredSpell.range}</span></div>
                        <div className="flex flex-col"><span className="text-gray-600">Dur</span> <span className="text-gray-300">{hoveredSpell.duration}</span></div>
                        <div className="flex flex-col"><span className="text-gray-600">School</span> <span className="text-gray-300">{hoveredSpell.school.name}</span></div>
                    </div>
                    <div className="text-gray-400 text-xs leading-relaxed max-h-60 overflow-hidden font-serif italic">
                        {hoveredSpell.desc[0]}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Selection column */}
                <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-4 bg-[#121316] border-b border-gray-800 shrink-0 overflow-x-auto no-scrollbar flex gap-1">
                        {casterClasses.map(c => (
                            <button
                                key={c.definition.index}
                                onClick={() => setActiveClassIndex(c.definition.index)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                    activeClassIndex === c.definition.index 
                                    ? 'bg-dnd-gold text-black shadow-lg' 
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                {c.definition.name} ({c.level})
                            </button>
                        ))}
                    </div>

                    <div className="p-5 border-b border-gray-800 bg-black/20">
                         <input 
                            type="text" 
                            placeholder="Search available spells..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-white focus:border-dnd-gold outline-none text-sm placeholder:text-gray-700" 
                        />
                    </div>
                    
                    <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-6">
                        {loading ? <div className="text-dnd-gold animate-pulse text-center p-10 font-serif">Consulting grimoires...</div> : (
                            <>
                            {/* Cantrips */}
                            {displayedSpells.filter(s => s.level === 0).length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Cantrips</h4>
                                    <div className="space-y-1">
                                        {displayedSpells.filter(s => s.level === 0 && s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                                            <div 
                                                key={s.index} 
                                                onClick={() => toggleSpell(s)}
                                                onMouseEnter={() => setHoveredSpell(s)}
                                                onMouseLeave={() => setHoveredSpell(null)}
                                                className={`group p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all ${currentSelected.some(sel => sel.index === s.index) ? 'bg-blue-900/10 border border-blue-900 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'hover:bg-gray-800 border border-transparent'}`}
                                            >
                                                <span className="font-bold text-sm text-gray-200">{s.name}</span>
                                                {currentSelected.some(sel => sel.index === s.index) ? (
                                                    <span className="text-blue-500 font-black text-xs">✓</span>
                                                ) : (
                                                    <span className="text-gray-800 group-hover:text-gray-600 text-xs font-black">+</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Leveled Spells */}
                             {[1,2,3,4,5,6,7,8,9].map(lvl => {
                                 const spellsAtLvl = displayedSpells.filter(s => s.level === lvl && s.name.toLowerCase().includes(search.toLowerCase()));
                                 if (spellsAtLvl.length === 0) return null;
                                 return (
                                    <div key={lvl} className="mt-6">
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Level {lvl}</h4>
                                        <div className="space-y-1">
                                            {spellsAtLvl.map(s => (
                                                <div 
                                                    key={s.index} 
                                                    onClick={() => toggleSpell(s)}
                                                    onMouseEnter={() => setHoveredSpell(s)}
                                                    onMouseLeave={() => setHoveredSpell(null)}
                                                    className={`group p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all ${currentSelected.some(sel => sel.index === s.index) ? 'bg-purple-900/10 border border-purple-900 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]' : 'hover:bg-gray-800 border border-transparent'}`}
                                                >
                                                    <span className="font-bold text-sm text-gray-200">{s.name}</span>
                                                    {currentSelected.some(sel => sel.index === s.index) ? (
                                                        <span className="text-purple-500 font-black text-xs">✓</span>
                                                    ) : (
                                                        <span className="text-gray-800 group-hover:text-gray-600 text-xs font-black">+</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                 );
                             })}
                            </>
                        )}
                    </div>
                </div>

                {/* Chosen column */}
                <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center shrink-0">
                        <div>
                             <h2 className="text-4xl font-serif text-white mb-1">Spellbook</h2>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dnd-gold">Preparation & Known Incantations</p>
                        </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-4 shrink-0 bg-black/10 border-b border-gray-800">
                        <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Cantrips</div>
                            <div className={`text-2xl font-black ${selectedCantrips.length >= limits.cantrips ? 'text-green-500' : 'text-white'}`}>
                                {selectedCantrips.length} / {limits.cantrips}
                            </div>
                        </div>
                        <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 text-center">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Spells</div>
                            <div className={`text-2xl font-black ${selectedLeveled.length >= limits.spells ? 'text-green-500' : 'text-white'}`}>
                                {selectedLeveled.length} / {limits.spells}
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-2">
                        {currentSelected.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 italic p-10 text-center">
                                <span className="text-6xl mb-4 opacity-10">✨</span>
                                <p className="font-serif text-lg">Select spells to commit them to your memory.</p>
                            </div>
                        ) : (
                            currentSelected.map(s => (
                                <div key={s.index} className="flex items-center justify-between bg-black/20 border border-gray-800 p-4 rounded-xl group hover:border-dnd-gold/50 transition-all">
                                    <div>
                                        <div className="font-black text-sm text-white">{s.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{s.level === 0 ? 'Cantrip' : `Level ${s.level}`}</div>
                                    </div>
                                    <button 
                                        onClick={() => toggleSpell(s)}
                                        className="text-gray-700 hover:text-red-500 text-2xl font-light px-2"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Persistent Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e] to-transparent z-[100]">
                <div className="max-w-6xl mx-auto">
                    {validationError && (
                        <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold animate-in slide-in-from-bottom-2">
                            <span className="mr-2">⚠️</span>
                            {validationError}
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button 
                            onClick={onBack}
                            className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl"
                        >
                            &larr; Back
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="flex-grow py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-2xl transition-all transform active:scale-95 bg-dnd-gold hover:bg-yellow-600 text-black"
                        >
                            Confirm Spellbook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpellSelectionStep;
