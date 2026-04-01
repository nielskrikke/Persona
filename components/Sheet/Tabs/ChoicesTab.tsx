import React, { useState, useEffect } from 'react';
import { CharacterState, LevelChoice, AbilityScores, ABILITY_NAMES, ABILITY_LABELS, AbilityName, SpellDetail, FeatDetail } from '../../../types';
import { AlertTriangle, CheckCircle2, ChevronRight, RotateCcw, Sparkles, Info } from 'lucide-react';
import { calculateModifier, SKILL_LIST } from '../../../utils/rules';
import { STANDARD_LANGUAGES } from '../../../data/constants';
import { fetchFeatsList, fetchAllSpells, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels } from '../../../data/index';

interface ChoicesTabProps {
    character: CharacterState;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
}

const ChoicesTab: React.FC<ChoicesTabProps> = ({ character, setCharacter }) => {
    const [allFeats, setAllFeats] = useState<FeatDetail[]>([]);
    const [allSpells, setAllSpells] = useState<SpellDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [feats, spells] = await Promise.all([
                fetchFeatsList(),
                fetchAllSpells()
            ]);
            setAllFeats(feats);
            setAllSpells(spells);
            setLoading(false);
        };
        load();
    }, []);

    const pendingChoices = (character.choices || []).filter(c => c.value === null || c.value === undefined || (Array.isArray(c.value) && c.value.length === 0));
    const completedChoices = (character.choices || []).filter(c => !pendingChoices.includes(c)).sort((a, b) => b.level - a.level);

    const handleMakeChoice = async (choiceId: string, value: any, revertData?: any) => {
        const choice = character.choices.find(c => c.id === choiceId);
        if (!choice) return;

        let additionalUpdates: Partial<CharacterState> = {};

        // Special handling for subclass to fetch features
        if (choice.type === 'subclass' && value) {
            const subclassRef = choice.options?.find(o => o.index === value || o.name === value);
            if (subclassRef) {
                const subclassDetail = await fetchSubclassDetail(subclassRef.index);
                const classIndex = choice.revertData?.classIndex || character.classes[0].definition.index;
                const cls = character.classes.find(c => c.definition.index === classIndex);
                
                if (cls) {
                    const subLevels = await fetchSubclassLevels(subclassRef.index);
                    const newFeatures = subLevels
                        .filter((l: any) => l.level <= cls.level)
                        .flatMap((l: any) => l.features.map((f: any) => ({ 
                            ...f, 
                            level: l.level, 
                            source: subclassDetail.name 
                        })));
                    
                    additionalUpdates.classes = character.classes.map(c => 
                        c.definition.index === classIndex ? { ...c, subclass: subclassDetail } : c
                    );
                    additionalUpdates.classFeatures = [...character.classFeatures, ...newFeatures];
                }
            }
        }

        // Special handling for feature_choice
        if ((choice.type === 'feature_choice' || choice.type === 'other') && value) {
            const selectedIndices = Array.isArray(value) ? value : [value];
            const classIndex = choice.revertData?.classIndex;
            
            if (classIndex) {
                const classLevels = await fetchClassLevels(classIndex);
                const allPossibleFeatures = classLevels.flatMap(l => l.features);
                const selectedFeatures = allPossibleFeatures.filter(f => selectedIndices.includes(f.index));
                
                if (selectedFeatures.length > 0) {
                    additionalUpdates.classFeatures = [...(additionalUpdates.classFeatures || character.classFeatures), ...selectedFeatures.map(f => ({
                        ...f,
                        level: choice.level,
                        source: choice.source
                    }))];
                    if (!revertData) revertData = {};
                    revertData.features = selectedFeatures.map(f => ({
                        ...f,
                        level: choice.level,
                        source: choice.source
                    }));
                }
            }
        }

        // Special handling for feat selection to add sub-choices
        if ((choice.type === 'feat' || choice.type === 'feat-selection' || choice.type === 'asi-feat') && value && typeof value === 'string' && value.includes('Feat:')) {
            const featName = value.replace('Feat: ', '');
            const featDetail = allFeats.find(f => f.name === featName || f.index === value);
            if (featDetail && featDetail.effects) {
                const newSubChoices = featDetail.effects
                    .filter(e => e.type.endsWith('_choice') || e.type === 'spell_access')
                    .map((e, idx) => ({
                        id: `feat-${featDetail.index}-${idx}-${Date.now()}`,
                        level: choice.level,
                        source: `${choice.source} (${featDetail.name})`,
                        type: (e.type === 'asi_choice' ? 'asi' : 
                               e.type === 'proficiency_choice' ? (e.category === 'skill' ? 'skill' : e.category === 'language' ? 'language' : 'other') :
                               e.type === 'expertise_choice' ? 'expertise' :
                               e.type === 'spell_access' ? 'spell' : 'other') as LevelChoice['type'],
                        label: `${featDetail.name}: ${e.name || e.type.replace('_', ' ')}`,
                        value: null,
                        options: e.options || (e.category === 'language' ? STANDARD_LANGUAGES : (e.type === 'proficiency_choice' && e.category === 'skill' ? SKILL_LIST.map(s => s.name) : [])),
                        count: e.count || 1,
                        revertData: { parentChoiceId: choiceId, featIndex: featDetail.index }
                    }));
                if (newSubChoices.length > 0) {
                    additionalUpdates.choices = [...(additionalUpdates.choices || character.choices), ...newSubChoices];
                }
            }
        }

        setCharacter(prev => {
            const newChoices = (additionalUpdates.choices || prev.choices).map(c => {
                if (c.id === choiceId) {
                    return { ...c, value, revertData: { ...c.revertData, ...revertData } };
                }
                return c;
            });

            const updates: Partial<CharacterState> = { ...additionalUpdates, choices: newChoices };

            if (revertData) {
                if (revertData.abilities) {
                    const newAbilities = { ...prev.abilities };
                    Object.entries(revertData.abilities as Record<string, number>).forEach(([stat, amount]) => {
                        newAbilities[stat as keyof AbilityScores] += amount;
                    });
                    updates.abilities = newAbilities;
                }
                if (revertData.skills) {
                    updates.skills = Array.from(new Set([...prev.skills, ...revertData.skills]));
                }
                if (revertData.expertise) {
                    updates.expertise = Array.from(new Set([...(prev.expertise || []), ...revertData.expertise]));
                }
                if (revertData.languages) {
                    updates.languages = Array.from(new Set([...(prev.languages || []), ...revertData.languages]));
                }
                if (revertData.feats) {
                    updates.feats = [...(prev.feats || []), ...revertData.feats];
                }
                if (revertData.spells) {
                    const spellsToAdd = allSpells.filter(s => revertData.spells.includes(s.index));
                    updates.spells = [...prev.spells, ...spellsToAdd];
                }
                if (revertData.features) {
                    updates.classFeatures = [...(updates.classFeatures || prev.classFeatures), ...revertData.features];
                }
            }

            return { ...prev, ...updates };
        });
    };

    const handleRevertChoice = (choiceId: string) => {
        const choice = character.choices.find(c => c.id === choiceId);
        if (!choice || !choice.revertData) return;

        setCharacter(prev => {
            const updates: Partial<CharacterState> = {
                choices: prev.choices.map(c => c.id === choiceId ? { ...c, value: null, revertData: null } : c)
            };

            const data = choice.revertData;

            if (choice.type === 'subclass') {
                const subclassName = choice.value;
                updates.classes = prev.classes.map(c => {
                    if (c.definition.index === (data.classIndex || prev.classes[0].definition.index)) {
                        return { ...c, subclass: null };
                    }
                    return c;
                });
                updates.classFeatures = prev.classFeatures.filter(f => f.source !== subclassName);
            }

            if (data.abilities) {
                const newAbilities = { ...prev.abilities };
                Object.entries(data.abilities as Record<string, number>).forEach(([stat, amount]) => {
                    newAbilities[stat as keyof AbilityScores] -= amount;
                });
                updates.abilities = newAbilities;
            }

            if (data.featAbilities) {
                const newAbilities = updates.abilities || { ...prev.abilities };
                Object.entries(data.featAbilities as Record<string, number>).forEach(([stat, amount]) => {
                    newAbilities[stat as keyof AbilityScores] -= amount;
                });
                updates.abilities = newAbilities;
            }

            if (data.skills) {
                updates.skills = prev.skills.filter(s => !data.skills.includes(s));
            }
            if (data.expertise) {
                updates.expertise = (prev.expertise || []).filter(s => !data.expertise.includes(s));
            }
            if (data.toolProficiencies) {
                updates.toolProficiencies = (prev.toolProficiencies || []).filter(t => !data.toolProficiencies.includes(t));
            }
            if (data.languages) {
                updates.languages = (prev.languages || []).filter(l => !data.languages.includes(l));
            }
            if (data.spells) {
                updates.spells = prev.spells.filter(s => !data.spells.includes(s.index));
            }
            if (data.feats || data.featIndex) {
                const featIndices = data.feats ? data.feats.map((f: any) => f.index) : [data.featIndex];
                updates.feats = (prev.feats || []).filter(f => !featIndices.includes(f.index));
            }
            if (data.features) {
                const featureIndices = data.features.map((f: any) => f.index);
                updates.classFeatures = (prev.classFeatures || []).filter(f => !featureIndices.includes(f.index));
            }

            return { ...prev, ...updates };
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin mb-4 text-dnd-gold">🔮</div>
                <p className="font-serif italic">Consulting the archives of fate...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Pending Choices Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-dnd-gold w-6 h-6" />
                    <h2 className="text-2xl font-serif text-white">Pending Decisions</h2>
                </div>

                {pendingChoices.length === 0 ? (
                    <div className="bg-gray-800/20 border border-gray-800 rounded-xl p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                        <p className="text-gray-400 font-serif italic">Your path is clear. All choices have been made for your current level.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingChoices.map(choice => (
                            <ChoiceCard 
                                key={choice.id} 
                                choice={choice} 
                                onMakeChoice={handleMakeChoice}
                                allFeats={allFeats}
                                allSpells={allSpells}
                                character={character}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* History Section */}
            {completedChoices.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6 pt-8 border-t border-gray-800">
                        <RotateCcw className="text-gray-500 w-5 h-5" />
                        <h2 className="text-xl font-serif text-gray-300">Choice History</h2>
                    </div>
                    <div className="space-y-3">
                        {completedChoices.map(choice => (
                            <div key={choice.id} className="bg-[#1b1c20]/40 border border-gray-800 rounded-lg p-4 flex items-center justify-between group hover:border-gray-700 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-dnd-gold bg-dnd-gold/10 px-2 py-0.5 rounded">Lvl {choice.level}</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{choice.source}</span>
                                    </div>
                                    <h4 className="text-white font-bold">{choice.label}</h4>
                                    <p className="text-sm text-gray-400">
                                        {Array.isArray(choice.value) ? choice.value.join(', ') : String(choice.value)}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleRevertChoice(choice.id)}
                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    title="Revert Choice"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

interface ChoiceCardProps {
    choice: LevelChoice;
    onMakeChoice: (id: string, value: any, revertData?: any) => void;
    allFeats: FeatDetail[];
    allSpells: SpellDetail[];
    character: CharacterState;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ choice, onMakeChoice, allFeats, allSpells, character }) => {
    const [selection, setSelection] = useState<any>(choice.count && choice.count > 1 ? [] : null);
    const [asiIncreases, setAsiIncreases] = useState<Record<string, number>>({});
    const [asiMode, setAsiMode] = useState<'ability' | 'feat'>('ability');

    const handleConfirm = async () => {
        if (choice.type === 'asi' || choice.type === 'asi-feat') {
            if (asiMode === 'ability') {
                onMakeChoice(choice.id, Object.entries(asiIncreases).filter(([_, v]) => v > 0).map(([s, v]) => `${ABILITY_LABELS[s as AbilityName]} +${v}`).join(', '), { abilities: asiIncreases });
            } else {
                const feat = allFeats.find(f => f.index === selection);
                if (feat) {
                    onMakeChoice(choice.id, `Feat: ${feat.name}`, { feats: [feat], featIndex: feat.index });
                }
            }
        } else if (choice.type === 'feat' || choice.type === 'feat-selection') {
            const feat = allFeats.find(f => f.index === selection);
            if (feat) {
                onMakeChoice(choice.id, feat.name, { feats: [feat] });
            }
        } else if (choice.type === 'subclass') {
            const subRef = choice.options?.find(o => o.index === selection);
            if (subRef) {
                onMakeChoice(choice.id, subRef.name, { subclassIndex: subRef.index });
            }
        } else {
            const revertData: any = {};
            if (choice.type === 'skill') revertData.skills = Array.isArray(selection) ? selection : [selection];
            if (choice.type === 'expertise') revertData.expertise = Array.isArray(selection) ? selection : [selection];
            if (choice.type === 'language') revertData.languages = Array.isArray(selection) ? selection : [selection];
            if (choice.type === 'spell') revertData.spells = Array.isArray(selection) ? selection : [selection];
            if (choice.type === 'other' || choice.type === 'feature_choice') {
                if (choice.label.toLowerCase().includes('tool')) {
                    revertData.toolProficiencies = Array.isArray(selection) ? selection : [selection];
                } else {
                    revertData.features = Array.isArray(selection) ? selection : [selection];
                }
            }
            
            onMakeChoice(choice.id, selection, revertData);
        }
    };

    const renderInput = () => {
        switch (choice.type) {
            case 'asi':
            case 'asi-feat':
                const total = Object.values(asiIncreases).reduce((a, b) => a + b, 0);
                return (
                    <div className="space-y-6">
                        <div className="flex bg-black/40 p-1 rounded-lg border border-gray-800">
                            <button 
                                onClick={() => setAsiMode('ability')}
                                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${asiMode === 'ability' ? 'bg-dnd-gold text-black' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Ability Scores
                            </button>
                            <button 
                                onClick={() => setAsiMode('feat')}
                                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${asiMode === 'feat' ? 'bg-dnd-gold text-black' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Feat
                            </button>
                        </div>

                        {asiMode === 'ability' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {ABILITY_NAMES.map(stat => (
                                    <div key={stat} className="bg-black/40 p-3 rounded border border-gray-800 flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2">{ABILITY_LABELS[stat]}</span>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setAsiIncreases(prev => ({ ...prev, [stat]: Math.max(0, (prev[stat] || 0) - 1) }))}
                                                className="w-6 h-6 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-30"
                                                disabled={(asiIncreases[stat] || 0) === 0}
                                            >-</button>
                                            <span className="font-bold text-white">+{asiIncreases[stat] || 0}</span>
                                            <button 
                                                onClick={() => setAsiIncreases(prev => ({ ...prev, [stat]: (prev[stat] || 0) + 1 }))}
                                                className="w-6 h-6 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-30"
                                                disabled={total >= 2}
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <select 
                                className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none"
                                value={selection || ''}
                                onChange={(e) => setSelection(e.target.value)}
                            >
                                <option value="">Select a Feat...</option>
                                {allFeats.map(f => (
                                    <option key={f.index} value={f.index}>{f.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                );

            case 'feat':
                return (
                    <select 
                        className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none"
                        value={selection || ''}
                        onChange={(e) => setSelection(e.target.value)}
                    >
                        <option value="">Select a Feat...</option>
                        {allFeats.map(f => (
                            <option key={f.index} value={f.index}>{f.name}</option>
                        ))}
                    </select>
                );

            case 'subclass':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(choice.options || []).map((sub: any) => (
                            <button
                                key={sub.index}
                                onClick={() => setSelection(sub.index)}
                                className={`p-4 rounded-xl border text-left transition-all ${selection === sub.index ? 'bg-dnd-gold/20 border-dnd-gold' : 'bg-black/20 border-gray-800 hover:border-gray-600'}`}
                            >
                                <h4 className={`font-bold ${selection === sub.index ? 'text-dnd-gold' : 'text-white'}`}>{sub.name}</h4>
                            </button>
                        ))}
                    </div>
                );

            case 'skill':
            case 'expertise':
            case 'language':
            case 'spell':
            case 'feature_choice':
            case 'other':
                const options = choice.options || [];
                const count = choice.count || 1;
                const isMulti = count > 1;

                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {options.map((opt: any) => {
                            const name = typeof opt === 'string' ? opt : opt.name;
                            const index = typeof opt === 'string' ? opt : opt.index;
                            const isSelected = isMulti ? selection.includes(index) : selection === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (isMulti) {
                                            if (isSelected) setSelection((prev: any[]) => prev.filter(i => i !== index));
                                            else if (selection.length < count) setSelection((prev: any[]) => [...prev, index]);
                                        } else {
                                            setSelection((prev: any) => prev === index ? null : index);
                                        }
                                    }}
                                    className={`p-3 rounded border text-left text-sm transition-all ${isSelected ? 'bg-dnd-gold/20 border-dnd-gold text-white' : 'bg-black/20 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return <p className="text-gray-500 italic">This choice type ({choice.type}) is not yet supported in the Choices tab.</p>;
        }
    };

    const canConfirm = () => {
        if (choice.type === 'asi' || choice.type === 'asi-feat') {
            if (asiMode === 'ability') return Object.values(asiIncreases).reduce((a, b) => a + b, 0) === 2;
            return !!selection;
        }
        if (choice.type === 'feat' || choice.type === 'feat-selection') return !!selection;
        if (choice.count && choice.count > 1) return selection.length === choice.count;
        return !!selection;
    };

    return (
        <div className="bg-[#1b1c20] border-2 border-dnd-gold/30 rounded-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-dnd-gold/5 border-b border-dnd-gold/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dnd-gold/20 flex items-center justify-center">
                        <Sparkles className="text-dnd-gold w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-dnd-gold">Level {choice.level}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{choice.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-serif text-white">{choice.label}</h3>
                            {choice.revertData?.featIndex && (
                                <div className="group relative">
                                    <Info size={14} className="text-gray-500 hover:text-dnd-gold cursor-help" />
                                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-black border border-gray-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                        <h6 className="text-dnd-gold font-bold text-[10px] mb-1">{allFeats.find(f => f.index === choice.revertData.featIndex)?.name}</h6>
                                        <p className="text-[9px] text-gray-400 leading-relaxed">
                                            {allFeats.find(f => f.index === choice.revertData.featIndex)?.desc.join(' ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Status</div>
                    <div className="flex items-center gap-1.5 text-amber-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Required</span>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                {renderInput()}

                <div className="flex justify-end pt-4 border-t border-gray-800">
                    <button 
                        onClick={handleConfirm}
                        disabled={!canConfirm()}
                        className="px-8 py-2 bg-dnd-gold hover:bg-yellow-600 disabled:opacity-30 disabled:hover:bg-dnd-gold text-black font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center gap-2"
                    >
                        Confirm Choice
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChoicesTab;
