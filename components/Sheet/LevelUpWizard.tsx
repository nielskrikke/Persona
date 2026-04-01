import React, { useState, useEffect } from 'react';
import { CharacterState, FeatDetail, SpellDetail, AbilityScores, ABILITY_NAMES, ABILITY_LABELS, APIReference, ClassFeature, SubclassDetail, FeatureEffect, AbilityName, LevelChoice } from '../../types';
import { fetchLevelFeatures, fetchFeatsList, fetchAllSpells, getLocalSpells, fetchClassDetail, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels } from '../../data/index';
import { STANDARD_LANGUAGES, CLASS_FEATURES } from '../../data/constants';
import { calculateModifier, getSpellsKnownCount, getSpellSlots, calculateProficiency, SKILL_LIST, getEffectiveAbilities } from '../../utils/rules';

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
    const [newLevel, setNewLevel] = useState(0);
    const [newFeatures, setNewFeatures] = useState<any[]>([]);
    const [classDefinition, setClassDefinition] = useState<any | null>(null);

    // Feature Choices State
    const [pendingChoices, setPendingChoices] = useState<PendingChoice[]>([]);

    // Subclass state
    const [availableSubclasses, setAvailableSubclasses] = useState<APIReference[]>([]);

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
                        if (eff.type === 'expertise_choice' || eff.type === 'proficiency_choice' || eff.type === 'feature_choice') {
                            choices.push({ featureName: f.name, effect: eff, selection: [] });
                        }
                    });
                }
            });
            setPendingChoices(choices);

            // Check if we need to choose a subclass at this level
            const subs = await fetchSubclasses(classIndex);
            if (subs.length > 0) {
                const needsSub = feats.some((f: any) => 
                    /subclass|archetype|domain|origin|college|circle|oath|tradition|patron|specialist|club|path/i.test(f.name)
                ) || (isInitiation && ['cleric', 'warlock', 'sorcerer'].includes(classIndex));

                if (needsSub) {
                    setAvailableSubclasses(subs);
                }
            }
        };
        load();
    }, [classIndex, nextLevel, isInitiation]);

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

        const effectiveAbilities = getEffectiveAbilities(character);
        const currentLevel = isInitiation ? 0 : (existingClass?.level || 0);
        const currKnown = currentLevel > 0 
            ? getSpellsKnownCount({ definition: classDefinition, level: currentLevel, subclass: existingClass?.subclass || null }, effectiveAbilities)
            : { cantrips: 0, spells: 0 };
        const nextKnown = getSpellsKnownCount({ definition: classDefinition, level: nextLevel, subclass: existingClass?.subclass || null }, effectiveAbilities);

        const newCantrips = Math.max(0, nextKnown.cantrips - currKnown.cantrips);
        const newSpells = Math.max(0, nextKnown.spells - currKnown.spells);

        if (newSlots.length === 0 && newCantrips === 0 && newSpells === 0) return null;

        return { newSlots, newCantrips, newSpells };
    }, [classDefinition, character.classes, classIndex, isInitiation, nextLevel, existingClass]);

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
        if (name === 'Card Master') return 'Path';
        return 'Archetype';
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
                subclass: null
            });
        } else {
            updatedClasses = updatedClasses.map(c => 
                c.definition.index === classIndex 
                ? { ...c, level: c.level + 1 } 
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
        updates.classFeatures = mergedFeatures;

        // 4. Update Resource Tracking (featureUsage)
        const newFeatureUsage = { ...character.featureUsage };
        updatedClasses.forEach(c => {
            const feat = CLASS_FEATURES[c.definition.name];
            if (feat) {
                const max = feat.formula(c.level, character.abilities);
                if (!newFeatureUsage[feat.name] || newFeatureUsage[feat.name].max !== max) {
                    newFeatureUsage[feat.name] = {
                        max,
                        current: newFeatureUsage[feat.name] ? Math.min(newFeatureUsage[feat.name].current, max) : max,
                        reset: feat.reset
                    };
                }
            }
        });
        updates.featureUsage = newFeatureUsage;

        // 5. Queue Choices
        const newChoices: LevelChoice[] = [];
        
        // Record Level Up (Completed)
        newChoices.push({
            id: `level-${nextLevel}-${classIndex}`,
            level: nextLevel,
            source: sourceName,
            type: 'Level Advancement',
            label: `Level ${nextLevel} Advancement`,
            value: `${sourceName} Level ${nextLevel}`,
            revertData: { classIndex, hpIncrease }
        });

        // Queue Subclass Choice if needed
        if (availableSubclasses.length > 0 && !existingClass?.subclass) {
            newChoices.push({
                id: `subclass-${classIndex}-${nextLevel}`,
                level: nextLevel,
                source: sourceName,
                type: 'subclass',
                label: `${getSubclassTerminology()} Selection`,
                value: null,
                options: availableSubclasses
            });
        }

        // Queue ASI/Feat choice if needed
        if (isAsiLevel) {
            newChoices.push({
                id: `asi-${nextLevel}-${classIndex}`,
                level: nextLevel,
                source: 'Ability Score Improvement',
                type: 'asi-feat',
                label: 'Ability Score Improvement',
                value: null
            });
        }

        // Queue Feature Choices
        pendingChoices.forEach((choice, idx) => {
            newChoices.push({
                id: `choice-${nextLevel}-${idx}-${classIndex}`,
                level: nextLevel,
                source: choice.featureName,
                type: choice.effect.type === 'expertise_choice' ? 'expertise' : 
                      (choice.effect.category === 'language' ? 'language' : 'skill'),
                label: choice.featureName,
                value: null,
                options: choice.effect.options || (choice.effect.category === 'language' ? STANDARD_LANGUAGES : (choice.effect.type === 'proficiency_choice' && choice.effect.category === 'skill' ? SKILL_LIST.map(s => s.name) : [])),
                count: (choice.effect as any).count || 1
            });
        });

        updates.choices = [...(character.choices || []), ...newChoices];
        updates.spellSlots = getSpellSlots(updatedClasses);

        onComplete(updates);
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
                                            <p className="text-sm text-gray-400 mt-1 leading-relaxed line-clamp-2">
                                                {f.desc && f.desc.length > 0 ? f.desc[0] : "No description available."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="italic text-gray-600 text-sm">No new features at this level.</p>}
                        </section>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-between bg-[#121316] rounded-b-xl">
                    <button onClick={onCancel} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs">Cancel</button>
                    <button onClick={finish} className="bg-dnd-gold text-black px-12 py-4 rounded font-bold uppercase text-sm">Finish Level Up &rarr;</button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpWizard;
