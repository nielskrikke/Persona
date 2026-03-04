import React, { useState, useEffect } from 'react';
import { CharacterState, FeatDetail, SpellDetail, AbilityScores, ABILITY_NAMES, ABILITY_LABELS, APIReference, ClassFeature, SubclassDetail, FeatureEffect, AbilityName } from '../../types';
import { fetchLevelFeatures, fetchFeatsList, fetchAllSpells, getLocalSpells, fetchClassDetail, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels } from '../../data/index';
import { calculateModifier, getSpellsKnownCount, getSpellSlots, calculateProficiency, SKILL_LIST } from '../../utils/rules';

interface LevelUpWizardProps {
    character: CharacterState;
    classIndex: string;
    onCancel: () => void;
    onComplete: (updates: Partial<CharacterState>) => void;
}

interface PendingChoice {
    featureName: string;
    effect: FeatureEffect;
    selection: string[]; // Store array for multiple choices
}

const LevelUpWizard: React.FC<LevelUpWizardProps> = ({ character, classIndex, onCancel, onComplete }) => {
    const [step, setStep] = useState<'features' | 'choices' | 'subclass' | 'asi'>('features');
    const [newLevel, setNewLevel] = useState(0);
    const [newFeatures, setNewFeatures] = useState<any[]>([]);
    const [availableFeats, setAvailableFeats] = useState<any[]>([]);
    const [allSpells, setAllSpells] = useState<SpellDetail[]>([]);
    const [classDefinition, setClassDefinition] = useState<any | null>(null);

    // Feature Choices State
    const [pendingChoices, setPendingChoices] = useState<PendingChoice[]>([]);

    // Subclass state
    const [availableSubclasses, setAvailableSubclasses] = useState<APIReference[]>([]);
    const [selectedSubclass, setSelectedSubclass] = useState<SubclassDetail | null>(null);

    // ASI Choice State
    const [asiChoice, setAsiChoice] = useState<'ability' | 'feat'>('ability');
    const [abilityIncreases, setAbilityIncreases] = useState<AbilityScores>({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
    const [selectedFeat, setSelectedFeat] = useState<any | null>(null);
    const [featChoices, setFeatChoices] = useState<Record<number, any>>({});

    // Initiation check
    const existingClass = character.classes.find(c => c.definition.index === classIndex);
    const isInitiation = !existingClass;
    const nextLevel = existingClass ? existingClass.level + 1 : 1;
    const isAsiLevel = [4, 8, 12, 16, 19].includes(nextLevel);

    useEffect(() => {
        const load = async () => {
            const def = await fetchClassDetail(classIndex);
            setClassDefinition(def);
            setNewLevel(nextLevel);

            const feats = await fetchLevelFeatures(classIndex, nextLevel);
            setNewFeatures(feats);

            // Process feature effects for choices
            const choices: PendingChoice[] = [];
            feats.forEach((f: any) => {
                if (f.effects) {
                    f.effects.forEach((eff: FeatureEffect) => {
                        if (eff.type === 'expertise_choice' || eff.type === 'proficiency_choice') {
                            choices.push({ featureName: f.name, effect: eff, selection: [] });
                        }
                    });
                }
            });
            setPendingChoices(choices);

            // Check if we need to choose a subclass at this level
            const subs = await fetchSubclasses(classIndex);
            if (subs.length > 0) {
                // Expanded regex to catch "Fight Club", "Artificer Specialist" and other variant archetypes
                const needsSub = feats.some((f: any) => 
                    /archetype|domain|origin|college|circle|oath|tradition|patron|specialist|club/i.test(f.name)
                ) || (isInitiation && ['cleric', 'warlock', 'sorcerer'].includes(classIndex));

                if (needsSub) {
                    setAvailableSubclasses(subs);
                }
            }

            if (isAsiLevel) {
                const list = await fetchFeatsList();
                setAvailableFeats(list);
            }
            const spells = await fetchAllSpells();
            setAllSpells(spells);
        };
        load();
    }, [classIndex, nextLevel, isInitiation]);

    // Reset feat choices when feat selection changes
    useEffect(() => {
        setFeatChoices({});
    }, [selectedFeat]);

    const hpIncrease = classDefinition ? (
        Math.floor(classDefinition.hit_die / 2) + 1
    ) + calculateModifier(character.abilities.con) : 0;

    const spellChanges = React.useMemo(() => {
        if (!classDefinition) return null;
        
        let nextClasses: any[] = [];
        if (isInitiation) {
            nextClasses = [...character.classes, { definition: classDefinition, level: 1 }];
        } else {
            nextClasses = character.classes.map(c => 
                c.definition.index === classIndex ? { ...c, level: c.level + 1 } : c
            );
        }

        const currentSlots = getSpellSlots(character.classes);
        const nextSlots = getSpellSlots(nextClasses);
        
        const newSlots: string[] = [];
        for (let i = 1; i <= 9; i++) {
            const curr = currentSlots[i]?.max || 0;
            const next = nextSlots[i]?.max || 0;
            if (next > curr) {
                newSlots.push(`+${next - curr} Lvl ${i}`);
            }
        }

        const className = classDefinition.name;
        const currentLevel = isInitiation ? 0 : (existingClass?.level || 0);
        const currKnown = currentLevel > 0 
            ? getSpellsKnownCount({ definition: classDefinition, level: currentLevel, subclass: existingClass?.subclass || null }, character.abilities)
            : { cantrips: 0, spells: 0 };
        const nextKnown = getSpellsKnownCount({ definition: classDefinition, level: nextLevel, subclass: existingClass?.subclass || null }, character.abilities);

        const newCantrips = Math.max(0, nextKnown.cantrips - currKnown.cantrips);
        const newSpells = Math.max(0, nextKnown.spells - currKnown.spells);

        if (newSlots.length === 0 && newCantrips === 0 && newSpells === 0) return null;

        return { newSlots, newCantrips, newSpells };
    }, [classDefinition, character.classes, classIndex, isInitiation, nextLevel, existingClass]);

    const handleAsiChange = (stat: keyof AbilityScores, val: number) => {
        const currentTotal = (Object.values(abilityIncreases) as number[]).reduce((a, b) => a + b, 0);
        if (currentTotal + val > 2 && val > 0) return;
        if (abilityIncreases[stat] + val < 0) return;
        setAbilityIncreases(prev => ({ ...prev, [stat]: prev[stat] + val }));
    };

    const handleSubclassSelect = async (ref: APIReference) => {
        const detail = await fetchSubclassDetail(ref.index);
        setSelectedSubclass(detail);
    };

    const handleChoiceSelection = (choiceIndex: number, value: string) => {
        const newChoices = [...pendingChoices];
        const choice = newChoices[choiceIndex];
        const max = (choice.effect as any).count || 1;

        if (choice.selection.includes(value)) {
            choice.selection = choice.selection.filter(v => v !== value);
        } else {
            if (choice.selection.length < max) {
                choice.selection.push(value);
            }
        }
        setPendingChoices(newChoices);
    };

    const nextStep = () => {
        if (step === 'features') {
            if (pendingChoices.length > 0) {
                setStep('choices');
            } else if (availableSubclasses.length > 0 && !selectedSubclass) {
                setStep('subclass');
            } else if (isAsiLevel) {
                setStep('asi');
            } else {
                finish();
            }
        } else if (step === 'choices') {
             if (availableSubclasses.length > 0 && !selectedSubclass) {
                setStep('subclass');
            } else if (isAsiLevel) {
                setStep('asi');
            } else {
                finish();
            }
        } else if (step === 'subclass') {
            if (isAsiLevel) setStep('asi');
            else finish();
        } else {
            finish();
        }
    };

    const finish = async () => {
        const updates: Partial<CharacterState> = {};
        const sourceName = classDefinition?.name || 'Class';
        
        // 1. Update Classes array
        let updatedClasses = [...character.classes];
        if (isInitiation) {
            updatedClasses.push({
                definition: classDefinition,
                level: 1,
                subclass: selectedSubclass || undefined
            });
        } else {
            updatedClasses = updatedClasses.map(c => 
                c.definition.index === classIndex 
                ? { ...c, level: c.level + 1, subclass: selectedSubclass || c.subclass } 
                : c
            );
        }
        updates.classes = updatedClasses;
        updates.level = character.level + 1;

        // 2. HP
        updates.maxHp = character.maxHp + hpIncrease;
        updates.currentHp = character.currentHp + hpIncrease;

        // 3. Features Merging with attribution
        let mergedFeatures = [...character.classFeatures];
        newFeatures.forEach(f => {
            if (!mergedFeatures.some(existing => existing.index === f.index)) {
                mergedFeatures.push({ ...f, level: nextLevel, source: sourceName });
            }
        });

        // 4. Process Choices (Expertise, etc)
        let finalSkills = [...character.skills];
        let finalExpertise = [...(character.expertise || [])];
        
        pendingChoices.forEach(choice => {
            const effect = choice.effect;
            if (effect.type === 'expertise_choice') {
                 choice.selection.forEach(skill => {
                     if (!finalExpertise.includes(skill)) finalExpertise.push(skill);
                 });
            } else if (effect.type === 'proficiency_choice') {
                 choice.selection.forEach(prof => {
                     if (effect.category === 'skill') {
                         if (!finalSkills.includes(prof)) finalSkills.push(prof);
                     }
                 });
            }
        });
        
        updates.skills = finalSkills;
        updates.expertise = finalExpertise;

        if (selectedSubclass) {
            const subLvlData = await fetchSubclassLevels(selectedSubclass.index);
            const subFeats = subLvlData
                .filter(l => l.level <= nextLevel)
                .flatMap(l => l.features.map((f: any) => ({ ...f, level: l.level, source: selectedSubclass.name })));
            
            subFeats.forEach(f => {
                if (!mergedFeatures.some(existing => existing.index === f.index)) {
                    mergedFeatures.push(f);
                }
            });
        }
        updates.classFeatures = mergedFeatures;

        // 5. ASI / Feats
        let finalAbilities = { ...character.abilities };
        let finalFeats = [...character.feats];
        let extraSpells: SpellDetail[] = [];

        if (isAsiLevel) {
            if (asiChoice === 'ability') {
                ABILITY_NAMES.forEach(stat => {
                    finalAbilities[stat] += abilityIncreases[stat];
                });
            } else if (selectedFeat) {
                finalFeats.push(selectedFeat);
                selectedFeat.effects?.forEach((eff: any, idx: number) => {
                    const choice = featChoices[idx];
                    if (eff.type === 'asi') {
                        eff.attributes.forEach((attr: string) => {
                            finalAbilities[attr as keyof AbilityScores] += eff.amount;
                        });
                    } else if (eff.type === 'asi_choice' && choice) {
                        // Choice can be array or string
                         if (Array.isArray(choice)) {
                             choice.forEach(c => finalAbilities[c as keyof AbilityScores] += eff.amount);
                         } else {
                             finalAbilities[choice as keyof AbilityScores] += eff.amount;
                         }
                    } else if (eff.type === 'spell_access') {
                        if (eff.spell) {
                             const found = allSpells.find(s => s.name === eff.spell || s.index === eff.spell.toLowerCase().replace(/\s+/g, '-'));
                             if (found) extraSpells.push({ ...found, sourceClassIndex: classIndex });
                        }
                    } else if (eff.type === 'proficiency_choice' && choice && eff.category === 'skill') {
                        if (Array.isArray(choice)) finalSkills = [...finalSkills, ...choice];
                        else finalSkills.push(choice);
                    }
                });
            }
        }
        
        updates.abilities = finalAbilities;
        updates.skills = Array.from(new Set(finalSkills)); // Dedup just in case
        updates.feats = finalFeats;
        updates.spellSlots = getSpellSlots(updatedClasses);

        if (extraSpells.length > 0) {
            const existingIndices = new Set(character.spells.map(s => s.index));
            updates.spells = [...character.spells, ...extraSpells.filter(s => !existingIndices.has(s.index))];
        }

        // Auto-add companion widgets to layout
        if (classIndex === 'artificer' && nextLevel === 3) {
            const currentLayout = character.layout || { left: [], right: [], mobile: [] };
            if (selectedSubclass?.index === 'artillerist') {
                if (!currentLayout.right.includes('eldritchCannon') && !currentLayout.left.includes('eldritchCannon')) {
                    updates.layout = {
                        ...currentLayout,
                        right: [...currentLayout.right, 'eldritchCannon']
                    };
                }
            } else if (selectedSubclass?.index === 'battle-smith') {
                if (!currentLayout.right.includes('steelDefender') && !currentLayout.left.includes('steelDefender')) {
                    updates.layout = {
                        ...currentLayout,
                        right: [...currentLayout.right, 'steelDefender']
                    };
                }
            }
        }

        onComplete(updates);
    };

    const isStepReady = () => {
        if (step === 'features') return true;
        if (step === 'choices') {
             // Ensure all choices are made
             return pendingChoices.every(c => c.selection.length === ((c.effect as any).count || 1));
        }
        if (step === 'subclass') return !!selectedSubclass;
        if (step === 'asi') {
            if (asiChoice === 'ability') return (Object.values(abilityIncreases) as number[]).reduce((a, b) => a + b, 0) === 2;
            if (asiChoice === 'feat') {
                if (!selectedFeat) return false;
                // Validate subchoices
                let missing = false;
                selectedFeat.effects?.forEach((eff: any, idx: number) => {
                    if (eff.type === 'asi_choice') {
                        const choice = featChoices[idx];
                        const count = eff.count || 1;
                        if (count === 1) { if (!choice) missing = true; }
                        else { if (!Array.isArray(choice) || choice.length !== count) missing = true; }
                    }
                });
                return !missing;
            }
        }
        return false;
    };

    const getSubclassTerminology = () => {
        if (!classDefinition) return 'Archetype';
        const name = classDefinition.name;
        if (name === 'Artificer') return 'Artificer Specialist';
        if (name === 'Pugilist') return 'Fight Club';
        if (name === 'Cleric') return 'Divine Domain';
        if (name === 'Druid') return 'Druidic Circle';
        if (name === 'Bard') return 'Bard College';
        if (name === 'Paladin') return 'Sacred Oath';
        if (name === 'Warlock') return 'Otherworldly Patron';
        if (name === 'Sorcerer') return 'Sorcerous Origin';
        if (name === 'Wizard') return 'Arcane Tradition';
        return 'Archetype';
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-md font-scalable-text">
            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0">
                    <h2 className="text-4xl font-serif text-dnd-gold">{isInitiation ? 'Initiate' : 'Level Up'}: {classDefinition?.name}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                        Advancing to {classDefinition?.name} Level {nextLevel}
                    </p>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    {step === 'features' && (
                        <div className="space-y-8">
                             <section>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Destiny Advancement</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Health Increase</div>
                                        <div className="text-2xl font-serif text-green-400">+{hpIncrease} Max HP</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Proficiency Bonus</div>
                                        <div className="text-2xl font-serif text-white">+{calculateProficiency(character.level + 1)}</div>
                                    </div>
                                </div>
                            </section>

                            {spellChanges && (
                                <section>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Arcane Expansion</h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {spellChanges.newSlots.length > 0 && (
                                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center flex-1">
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">New Spell Slots</div>
                                                <div className="flex wrap justify-center gap-2">
                                                    {spellChanges.newSlots.map(s => <span key={s} className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-800 rounded text-xs font-bold">{s}</span>)}
                                                </div>
                                            </div>
                                        )}
                                        {spellChanges.newCantrips > 0 && (
                                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center flex-1">
                                                <div className="text-[10px] text-gray-500 uppercase font-bold">Cantrips Known</div>
                                                <div className="text-2xl font-serif text-blue-400">+{spellChanges.newCantrips}</div>
                                            </div>
                                        )}
                                        {spellChanges.newSpells > 0 && (
                                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center flex-1">
                                                <div className="text-[10px] text-gray-500 uppercase font-bold">Spells Known / Prepared</div>
                                                <div className="text-2xl font-serif text-purple-400">+{spellChanges.newSpells}</div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">New Path Features</h3>
                                {newFeatures.length > 0 ? (
                                    <div className="space-y-3">
                                        {newFeatures.map((f, i) => (
                                            <div key={i} className="bg-gray-800/30 p-4 rounded border-l-4 border-dnd-gold">
                                                <h4 className="font-bold text-white text-lg">{f.name}</h4>
                                                <p className="text-sm text-gray-400 mt-1 leading-relaxed line-clamp-2">{f.desc?.[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="italic text-gray-600 text-sm">No new features at this level.</p>}
                            </section>
                        </div>
                    )}

                    {step === 'choices' && (
                         <div className="space-y-8">
                             <h3 className="text-2xl font-serif text-dnd-gold text-center">Feature Choices</h3>
                             {pendingChoices.map((choice, idx) => {
                                 const count = (choice.effect as any).count || 1;
                                 let options: string[] = [];

                                 if (choice.effect.type === 'expertise_choice') {
                                     // Filter for skills the character IS proficient in but NOT expert in
                                     options = character.skills.filter(s => !character.expertise?.includes(s));
                                 } else if (choice.effect.type === 'proficiency_choice' && choice.effect.category === 'skill') {
                                      // Default options if none provided in API (fallback to all skills)
                                      const pool = choice.effect.options || SKILL_LIST.map(s => s.name);
                                      // Filter out skills character already has
                                      options = pool.filter(s => !character.skills.includes(s));
                                 }

                                 return (
                                     <div key={idx} className="bg-gray-800/50 p-6 rounded border border-gray-700">
                                         <h4 className="text-lg font-bold text-white mb-2">{choice.featureName}</h4>
                                         <p className="text-sm text-gray-400 mb-4">Choose {count} option{count > 1 ? 's' : ''}:</p>
                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                             {options.map(opt => (
                                                 <label key={opt} className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-colors ${choice.selection.includes(opt) ? 'bg-dnd-gold/20 border-dnd-gold text-white' : 'bg-black/20 border-transparent hover:bg-gray-500'}`}>
                                                     <input 
                                                        type="checkbox" 
                                                        checked={choice.selection.includes(opt)}
                                                        onChange={() => handleChoiceSelection(idx, opt)}
                                                        disabled={!choice.selection.includes(opt) && choice.selection.length >= count}
                                                        className="accent-dnd-gold"
                                                     />
                                                     <span className="text-sm font-bold">{opt}</span>
                                                 </label>
                                             ))}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                    )}

                    {step === 'subclass' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif text-dnd-gold text-center">Choose Your {getSubclassTerminology()}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableSubclasses.map(sub => (
                                    <button key={sub.index} onClick={() => handleSubclassSelect(sub)} className={`p-6 rounded-lg border text-left transition-all ${selectedSubclass?.index === sub.index ? 'bg-dnd-gold border-dnd-gold text-black font-bold' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                                        <div className="text-lg">{sub.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'asi' && (
                        <div className="space-y-6">
                             <div className="flex justify-center gap-4 mb-8">
                                <button onClick={() => setAsiChoice('ability')} className={`px-10 py-2 rounded-full font-bold uppercase text-xs ${asiChoice === 'ability' ? 'bg-dnd-gold text-black' : 'bg-gray-800 text-gray-500'}`}>Stat Increase</button>
                                <button onClick={() => setAsiChoice('feat')} className={`px-10 py-2 rounded-full font-bold uppercase text-xs ${asiChoice === 'feat' ? 'bg-dnd-gold text-black' : 'bg-gray-800 text-gray-500'}`}>Choose Feat</button>
                            </div>
                            {asiChoice === 'ability' ? (
                                <div className="max-w-md mx-auto space-y-3">
                                    {ABILITY_NAMES.map(stat => (
                                        <div key={stat} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                                            <span className="text-gray-300 font-bold uppercase text-xs">{ABILITY_LABELS[stat]}</span>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => handleAsiChange(stat, -1)} className="w-6 h-6 rounded bg-gray-700 text-white">-</button>
                                                <span className={`w-4 text-center font-bold ${abilityIncreases[stat] > 0 ? 'text-green-400' : 'text-white'}`}>+{abilityIncreases[stat]}</span>
                                                <button onClick={() => handleAsiChange(stat, 1)} className="w-6 h-6 rounded bg-gray-700 text-white">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                        {availableFeats.map(f => (
                                            <button key={f.index} onClick={() => setSelectedFeat(f)} className={`p-3 rounded text-left text-xs border ${selectedFeat?.index === f.index ? 'bg-dnd-gold text-black font-bold border-dnd-gold' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>{f.name}</button>
                                        ))}
                                    </div>

                                    {/* Feat Details & Choices */}
                                    {selectedFeat && (
                                        <div className="bg-black/30 p-4 rounded border border-gray-600 animate-in fade-in slide-in-from-bottom-2">
                                            <h4 className="text-lg font-bold text-white mb-1">{selectedFeat.name}</h4>
                                            <div className="text-sm text-gray-400 mb-4">{selectedFeat.desc[0]}</div>
                                            
                                            {selectedFeat.effects && selectedFeat.effects.length > 0 && (
                                                <div className="space-y-4">
                                                    {selectedFeat.effects.map((eff: any, idx: number) => {
                                                        if (eff.type === 'asi_choice') {
                                                            const count = eff.count || 1;
                                                            return (
                                                                <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-700">
                                                                    <span className="text-xs font-bold text-dnd-gold uppercase block mb-2">Increase {count} Ability Score{count > 1 ? 's' : ''} by {eff.amount}</span>
                                                                    <div className="flex flex-col gap-2">
                                                                        {Array.from({length: count}).map((_, i) => (
                                                                             <select
                                                                                key={i}
                                                                                className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm focus:border-dnd-gold outline-none"
                                                                                value={Array.isArray(featChoices[idx]) ? (featChoices[idx] as string[])[i] : (featChoices[idx] as string) || ''}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (count > 1) {
                                                                                        const current = (featChoices[idx] as string[]) || Array(count).fill('');
                                                                                        const newArr = [...current];
                                                                                        newArr[i] = val;
                                                                                        setFeatChoices(prev => ({...prev, [idx]: newArr}));
                                                                                    } else {
                                                                                        setFeatChoices(prev => ({...prev, [idx]: val}));
                                                                                    }
                                                                                }}
                                                                             >
                                                                                <option value="">Select Ability...</option>
                                                                                {eff.options.map((opt: string) => (
                                                                                    <option key={opt} value={opt}>{ABILITY_LABELS[opt as AbilityName]}</option>
                                                                                ))}
                                                                             </select>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-between bg-[#121316] rounded-b-xl">
                    <button onClick={onCancel} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs">Cancel</button>
                    <button onClick={nextStep} disabled={!isStepReady()} className="bg-dnd-gold disabled:bg-gray-700 text-black px-12 py-4 rounded font-bold uppercase text-sm">Continue &rarr;</button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpWizard;