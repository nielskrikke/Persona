
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Filter, Plus, Info, ChevronUp, ChevronDown, Sparkles, Book, Wand2, GraduationCap, Trash2 } from 'lucide-react';
import { CharacterState, SpellDetail } from '../../../types';
import { fetchSpellsByClass } from '../../../data/index';
import { getSpellsKnownCount, getEffectiveAbilities, isPreparedCaster } from '../../../utils/rules';

interface SpellManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: CharacterState;
    onUpdateSpells: (spells: SpellDetail[]) => void;
    onAddCustom: () => void;
    onDuplicateToHomebrew?: (spell: any) => void;
}

const SpellManagerModal: React.FC<SpellManagerModalProps> = ({ 
    isOpen, 
    onClose, 
    character, 
    onUpdateSpells,
    onAddCustom,
    onDuplicateToHomebrew
}) => {
    const [activeClassIndex, setActiveClassIndex] = useState<string>('');
    const [availableSpells, setAvailableSpells] = useState<SpellDetail[]>([]);
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmSpell, setConfirmSpell] = useState<SpellDetail | null>(null);
    const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);
    const [showKnownOnly, setShowKnownOnly] = useState(false);

    // Sync active class on open
    useEffect(() => {
        if (isOpen && character.classes.length > 0) {
            const valid = character.classes.find(c => c.definition.index === activeClassIndex);
            if (!valid) {
                setActiveClassIndex(character.classes[0].definition.index);
            }
        }
    }, [isOpen, character.classes]);

    const activeClass = character.classes.find(c => c.definition.index === activeClassIndex);
    const effectiveAbilities = useMemo(() => getEffectiveAbilities(character), [character]);
    const isPrepared = activeClass ? isPreparedCaster(activeClass.definition.index) : false;
    
    // Calculate limits for the ACTIVE class
    const limits = activeClass 
        ? getSpellsKnownCount(activeClass, effectiveAbilities)
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
            const spells = await fetchSpellsByClass(activeClassIndex, character.user_id);
            const sorted = spells.sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
            setAvailableSpells(sorted);
            setLoading(false);
        };
        loadSpells();
    }, [isOpen, activeClassIndex]);

    const isKnown = (spell: SpellDetail) => {
        return character.spells.some(s => s.index === spell.index && s.sourceClassIndex === activeClassIndex);
    };

    const tryAddSpell = (spell: SpellDetail) => {
        if (isKnown(spell)) {
            onUpdateSpells(character.spells.filter(s => !(s.index === spell.index && s.sourceClassIndex === activeClassIndex)));
            return;
        }

        const isCantrip = spell.level === 0;
        const overLimit = isCantrip 
            ? (limits.cantrips > 0 && currentCantrips >= limits.cantrips) 
            : (limits.spells > 0 && currentLeveled >= limits.spells);
        
        const tooHigh = spell.level > maxSpellLevel && spell.level > 0;

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

    const getMaxSpellLevel = (clsName: string, level: number) => {
        const name = clsName.toLowerCase();
        // Full Casters
        if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard', 'card-master', 'card master'].includes(name)) {
            if (level >= 17) return 9;
            if (level >= 15) return 8;
            if (level >= 13) return 7;
            if (level >= 11) return 6;
            if (level >= 9) return 5;
            if (level >= 7) return 4;
            if (level >= 5) return 3;
            if (level >= 3) return 2;
            return 1;
        }
        // Warlock (Pact Magic up to 5th)
        if (name === 'warlock') {
            if (level >= 9) return 5;
            if (level >= 7) return 4;
            if (level >= 5) return 3;
            if (level >= 3) return 2;
            return 1;
        }
        // Half Casters
        if (['paladin', 'ranger', 'artificer'].includes(name)) {
            if (level >= 17) return 5;
            if (level >= 13) return 4;
            if (level >= 9) return 3;
            if (level >= 5) return 2;
            if (level >= 2) return 1;
            return 0;
        }
        // Third Casters
        if (['fighter', 'rogue'].includes(name)) {
            if (level >= 19) return 4;
            if (level >= 13) return 3;
            if (level >= 7) return 2;
            if (level >= 3) return 1;
            return 0;
        }
        return 9;
    };

    const maxSpellLevel = activeClass ? getMaxSpellLevel(activeClass.definition.name, activeClass.level) : 9;

    const filteredAvailableSpells = useMemo(() => {
        return availableSpells.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = filterLevel === 'all' || s.level === filterLevel;
            const matchesKnown = !showKnownOnly || isKnown(s);
            const isWithinLevel = s.level <= maxSpellLevel;
            return matchesSearch && matchesLevel && matchesKnown && isWithinLevel;
        });
    }, [availableSpells, searchQuery, filterLevel, showKnownOnly, character.spells, activeClassIndex, maxSpellLevel]);

    if (!isOpen) return null;

    const renderSpellDetail = (spell: SpellDetail) => (
        <div className="p-4 bg-black/40 border-t border-gray-800 text-xs text-gray-300 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase font-bold text-gray-500">
                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                    <div className="text-gray-500 mb-1">Casting Time</div>
                    <div className="text-gray-300">{spell.casting_time}{spell.ritual ? ' (R)' : ''}</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                    <div className="text-gray-500 mb-1">Range</div>
                    <div className="text-gray-300">{spell.range}</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                    <div className="text-gray-500 mb-1">Duration</div>
                    <div className="text-gray-300">{spell.duration}</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                    <div className="text-gray-500 mb-1">Components</div>
                    <div className="text-gray-300">{spell.components.join(', ')}</div>
                </div>
            </div>
            <div className="pt-2 leading-relaxed font-serif text-sm text-gray-400">
                {spell.desc.map((p, i) => <p key={i} className="mb-2 last:mb-0">{p}</p>)}
            </div>
            {spell.higher_level && (
                <div className="pt-3 border-t border-gray-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-dnd-gold">At Higher Levels</span>
                    <p className="mt-1 text-gray-400 italic">{spell.higher_level}</p>
                </div>
            )}
        </div>
    );

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-gray-800 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif text-white">Spell Manager</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Manage your {isPrepared ? 'prepared spells' : 'spellbook'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onAddCustom}
                            className="px-4 py-2 bg-blue-900/20 border border-blue-800 hover:border-blue-500 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <Plus size={14} />
                            Create Custom
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Search & Class Tabs */}
                <div className="p-6 space-y-4 bg-[#16171a] border-b border-gray-800">
                    <div className="flex gap-3">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text"
                                placeholder="Search spells..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-dnd-gold/50 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => setShowKnownOnly(!showKnownOnly)}
                            className={`px-4 rounded-xl border transition-all flex items-center gap-2 font-bold text-sm ${
                                showKnownOnly
                                    ? 'bg-dnd-gold border-dnd-gold text-black' 
                                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                            }`}
                        >
                            <Book size={18} />
                            {isPrepared ? 'Prepared Spells' : 'My Spellbook'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {character.classes.map(cls => (
                            <button
                                key={cls.definition.index}
                                onClick={() => setActiveClassIndex(cls.definition.index)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    activeClassIndex === cls.definition.index 
                                        ? 'bg-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <GraduationCap size={14} />
                                {cls.definition.name} ({cls.level})
                            </button>
                        ))}
                    </div>

                    {/* Level Filters */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        <button 
                            onClick={() => setFilterLevel('all')} 
                            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all border ${
                                filterLevel === 'all' 
                                    ? 'bg-white border-white text-black' 
                                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                            }`}
                        >
                            All
                        </button>
                        {[0,1,2,3,4,5,6,7,8,9].filter(l => l <= maxSpellLevel).map(l => (
                            <button 
                                key={l} 
                                onClick={() => setFilterLevel(l)} 
                                className={`min-w-[32px] px-2 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                                    filterLevel === l 
                                        ? 'bg-white border-white text-black' 
                                        : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                                }`}
                            >
                                {l === 0 ? 'C' : l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Limits & Counts */}
                {activeClass && (
                    <div className="px-6 py-3 bg-black/20 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex gap-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Cantrips</span>
                                <span className={`text-sm font-bold ${currentCantrips >= limits.cantrips ? 'text-red-400' : 'text-white'}`}>
                                    {currentCantrips} / {limits.cantrips}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{isPrepared ? 'Prepared' : 'Known'}</span>
                                <span className={`text-sm font-bold ${currentLeveled >= limits.spells ? 'text-red-400' : 'text-white'}`}>
                                    {currentLeveled} / {limits.spells}
                                </span>
                            </div>
                        </div>
                        {confirmSpell && (
                            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                                <span className="text-xs text-red-400 font-bold italic">Maximum number of {confirmSpell.level === 0 ? 'cantrips' : 'spells'} reached for {activeClass?.definition.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setConfirmSpell(null)} className="px-3 py-1 bg-gray-800 text-white text-[10px] font-bold uppercase rounded hover:bg-gray-700">Cancel</button>
                                    <button onClick={() => addSpell(confirmSpell)} className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded hover:bg-red-500">Add Anyway</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Results */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-[#1b1c20]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Wand2 size={48} className="text-dnd-gold animate-pulse mb-4 opacity-20" />
                            <p className="text-dnd-gold animate-pulse text-xs font-bold uppercase tracking-widest">Consulting the archives...</p>
                        </div>
                    ) : filteredAvailableSpells.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 italic">
                            <Book size={48} className="mb-4 opacity-10" />
                            <p>No spells found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredAvailableSpells.map(spell => {
                                const known = isKnown(spell);
                                const isExpanded = expandedSpellId === spell.index;
                                
                                return (
                                    <div 
                                        key={spell.index}
                                        onClick={() => setExpandedSpellId(isExpanded ? null : spell.index)}
                                        className={`flex flex-col bg-black/20 border rounded-xl transition-all overflow-hidden cursor-pointer ${
                                            isExpanded ? 'border-gray-700 bg-black/40' : 'border-gray-800 hover:border-gray-700 hover:bg-black/30'
                                        } ${known && !showKnownOnly ? 'opacity-60' : ''}`}
                                    >
                                        <div className="flex items-center p-4 gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                known ? 'bg-green-900/20 text-green-400' : 'bg-gray-800/50 text-gray-500'
                                            }`}>
                                                <Wand2 size={20} />
                                            </div>
                                            
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-bold text-sm truncate ${known ? 'text-green-300' : 'text-gray-200'}`}>
                                                        {spell.name}
                                                    </h4>
                                                    <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[8px] font-black uppercase tracking-tighter text-gray-400">
                                                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                                        {spell.school.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600 font-bold">
                                                        {spell.casting_time}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div 
                                                    onClick={(e) => { e.stopPropagation(); onDuplicateToHomebrew?.(spell); }}
                                                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-dnd-gold transition-colors"
                                                    title="Duplicate to Homebrew Forge"
                                                >
                                                    <Sparkles size={18} />
                                                </div>
                                                <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}>
                                                    <Info size={18} />
                                                </div>
                                                {known ? (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); removeKnownSpell(spell); }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg text-xs font-black uppercase hover:bg-red-900/40 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                        {isPrepared ? 'Unprepare' : 'Forget'}
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); tryAddSpell(spell); }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-dnd-gold text-black rounded-lg text-xs font-black uppercase hover:bg-white transition-all shadow-lg shadow-dnd-gold/10"
                                                    >
                                                        <Plus size={14} />
                                                        {isPrepared ? 'Prepare' : 'Learn'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {isExpanded && renderSpellDetail(spell)}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpellManagerModal;
