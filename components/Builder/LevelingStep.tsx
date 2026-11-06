import React, { useState, useEffect } from 'react';
import { CharacterState, FeatureEffect, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, APIReference, SubclassDetail, AbilityScores, SkillDefinition, AbilityName, LevelChoice } from '../../types';
import { fetchLevelFeatures, fetchFeatsList, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchAllSpells, fetchClassLevels } from '../../data/index';
import { calculateModifier, SKILL_LIST, getSpellSlots, getSubclassLevel, getSubclassLabel, getResourceDefinitions } from '../../utils/rules';
import { ARTISAN_TOOLS } from '../../data/constants';
import { STANDARD_LANGUAGES } from '../../data/constants';

interface LevelingStepProps {
    character: CharacterState;
    onComplete: (updates: Partial<CharacterState>) => void;
    onBack: () => void;
}

interface LevelStepItem {
    classIndex: string;
    className: string;
    subclassLabel: string;
    level: number;
    isSubclassLevel: boolean;
}

const LevelingStep: React.FC<LevelingStepProps> = ({ character, onComplete, onBack }) => {
    const [queue, setQueue] = useState<LevelStepItem[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Preparing your journey...");

    const accumulator = React.useRef<{
        skills: string[];
        expertise: string[];
        feats: FeatDetail[];
        abilities: AbilityScores;
        subclasses: Record<string, SubclassDetail>;
        features: any[];
        choices: LevelChoice[];
        languages: string[];
        toolProficiencies: string[];
        maxHp: number;
    }>({
        skills: [...character.skills],
        expertise: [...(character.expertise || [])],
        feats: [...character.feats],
        abilities: { ...character.abilities },
        subclasses: {},
        features: [...character.classFeatures],
        choices: [...(character.choices || [])],
        languages: [...(character.languages || [])],
        toolProficiencies: [...(character.toolProficiencies || [])],
        maxHp: character.maxHp || 10
    });

    useEffect(() => {
        const init = async () => {
            const q: LevelStepItem[] = [];
            character.classes.forEach(cls => {
                const subclassLevel = getSubclassLevel(cls.definition);
                const subclassLabel = getSubclassLabel(cls.definition);
                for (let i = 1; i <= cls.level; i++) {
                    q.push({
                        classIndex: cls.definition.index,
                        className: cls.definition.name,
                        subclassLabel,
                        level: i,
                        isSubclassLevel: i === subclassLevel
                    });

                    // Data-declared invocation-style choices. The class table's
                    // class_specific.invocations tells us how many are known at
                    // each level; the delta is the number chosen at this level.
                    const invocationOptions = (cls.definition as any).options?.invocations;
                    if (Array.isArray(invocationOptions) && invocationOptions.length > 0) {
                        const rows = (cls.definition as any).level_table || [];
                        const current = Number(rows[i - 1]?.class_specific?.invocations || 0);
                        const previous = Number(rows[i - 2]?.class_specific?.invocations || 0);
                        const delta = current - previous;
                        if (delta > 0) {
                            const choiceId = `invocations-${cls.definition.index}-${i}`;
                            if (!accumulator.current.choices.some(c => c.id === choiceId)) {
                                accumulator.current.choices.push({
                                    id: choiceId,
                                    level: i,
                                    source: cls.definition.name,
                                    type: 'feature_choice',
                                    label: 'Eldritch Invocations',
                                    value: null,
                                    options: invocationOptions,
                                    count: delta,
                                    revertData: { classIndex: cls.definition.index }
                                });
                            }
                        }
                    }

                    // Class-declared option progression (e.g. Sorcerer Metamagic).
                    const optionProgression = (cls.definition as any).options?.metamagicProgression;
                    if (optionProgression) {
                        const isProgression = (optionProgression.progressionLevels || []).includes(i);
                        const isCalibration = !isProgression && i > Number(optionProgression.calibrationFrom ?? 2);

                        if (isProgression || isCalibration) {
                            const choiceId = `metamagic-matrix-${cls.definition.index}-${i}`;
                            if (!accumulator.current.choices.some(c => c.id === choiceId)) {
                                accumulator.current.choices.push({
                                    id: choiceId,
                                    level: i,
                                    source: cls.definition.name,
                                    type: 'other',
                                    label: isProgression ? 'Metamagic Options' : 'Metamagic Calibration',
                                    value: null,
                                    options: [],
                                    count: isProgression ? 2 : 1,
                                    revertData: { classIndex: cls.definition.index, isMetamagicMatrix: true, isProgression }
                                });
                            }
                        }
                    }
                }
            });
            setQueue(q);
            setLoading(false);
            processAllLevels(q);
        };
        init();
    }, []);

    const processAllLevels = async (q: LevelStepItem[]) => {
        setLoading(true);
        for (let i = 0; i < q.length; i++) {
            setCurrentStepIndex(i);
            const item = q[i];
            setStatus(`Processing ${item.className} Level ${item.level}...`);
            
            const features = await fetchLevelFeatures(item.classIndex, item.level);
            
            // Add non-choice features directly
            features.forEach((f: any) => {
                if (!accumulator.current.features.some(ex => ex.index === f.index)) {
                    accumulator.current.features.push({
                        ...f,
                        level: item.level,
                        source: item.className
                    });
                }

                // Record Level Up (Completed)
                // Removed level advancement as a choice to prevent it from being stuck on pending

                // Identify choices and add as PENDING
                if (f.effects) {
                    f.effects.forEach((eff: FeatureEffect) => {
                        if (['expertise_choice', 'proficiency_choice', 'feature_choice'].includes(eff.type)) {
                            const choiceId = `${f.index}-${eff.type}-${item.level}`;
                            if (!accumulator.current.choices.some(c => c.id === choiceId)) {
                                let choiceType: LevelChoice['type'] = 'skill';
                                if (eff.type === 'expertise_choice') choiceType = 'expertise';
                                else if (eff.type === 'feature_choice') choiceType = 'feature_choice';
                                else if (eff.category === 'language') choiceType = 'language';
                                else if (eff.category === 'tool') choiceType = 'other';

                                accumulator.current.choices.push({
                                    id: choiceId,
                                    level: item.level,
                                    source: item.className,
                                    type: choiceType,
                                    label: f.name,
                                    value: null,
                                    options: eff.options ? eff.options.map((o: any) => {
                                        if (typeof o === 'string') return o;
                                        if (o.desc || o.effects) return { ...o, index: o.index || o.name, name: o.name || o.index };
                                        return (o.name || o.item?.name || o.index);
                                    }) : (eff.type === 'expertise_choice'
                                        ? (() => {
                                            const traitSkills = [
                                                ...(character.race?.traits || []),
                                                ...(character.subrace?.traits || []),
                                            ].flatMap((trait: any) => (trait.effects || [])
                                                .filter((effect: any) => effect.type === 'proficiency' && effect.category === 'skill')
                                                .map((effect: any) => effect.target || effect.value)
                                            );
                                            return Array.from(new Set([...accumulator.current.skills, ...character.skills, ...traitSkills]))
                                                .filter(skill => SKILL_LIST.some(entry => entry.name.toLowerCase() === String(skill).toLowerCase()));
                                        })()
                                        : (eff.category === 'tool' ? ARTISAN_TOOLS : (eff.category === 'language' ? STANDARD_LANGUAGES : SKILL_LIST.map(s => s.name)))),
                                    count: eff.count || 1,
                                    revertData: { classIndex: item.classIndex }
                                });
                            }
                        }
                    });
                }

                if (f.name === "Ability Score Improvement") {
                    const choiceId = `asi-${item.level}-${item.classIndex}`;
                    if (!accumulator.current.choices.some(c => c.id === choiceId)) {
                        accumulator.current.choices.push({
                            id: choiceId,
                            level: item.level,
                            source: item.className,
                            type: 'asi-feat',
                            label: 'Ability Score Improvement',
                            value: null,
                            options: ABILITY_NAMES
                        });
                    }
                }
            });

            // Handle Subclass Choice
            if (item.isSubclassLevel) {
                const choiceId = `subclass-${item.classIndex}-${item.level}`;
                if (!accumulator.current.choices.some(c => c.id === choiceId)) {
                    const subs = await fetchSubclasses(item.classIndex);
                    accumulator.current.choices.push({
                        id: choiceId,
                        level: item.level,
                        source: item.className,
                        type: 'subclass',
                        label: item.subclassLabel,
                        value: null,
                        options: subs,
                        revertData: { classIndex: item.classIndex }
                    });
                }
            }
        }

        setStatus("Finalizing character...");
        finish();
    };

    const finish = async () => {
        const updates: Partial<CharacterState> = {
            level: character.level, // This should be the target level
            abilities: accumulator.current.abilities,
            skills: accumulator.current.skills,
            expertise: accumulator.current.expertise,
            feats: accumulator.current.feats,
            choices: accumulator.current.choices,
            languages: accumulator.current.languages,
            toolProficiencies: accumulator.current.toolProficiencies,
            classFeatures: accumulator.current.features,
            maxHp: accumulator.current.maxHp,
            currentHp: accumulator.current.maxHp, // Full heal on level up/creation
            spellSlots: getSpellSlots(character.classes),
            featureUsage: {} // Will be recalculated by CharacterSheet or we can do it here
        };

        // Recalculate feature usage from the class/subclass resources.
        const projected = { ...character, ...updates, classes: character.classes, abilities: accumulator.current.abilities } as any;
        getResourceDefinitions(projected).forEach(resource => {
            updates.featureUsage![resource.name] = { max: resource.max, current: resource.max, reset: resource.reset };
        });

        onComplete(updates);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 border-4 border-dnd-gold/20 rounded-full"></div>
                <div 
                    className="absolute inset-0 border-4 border-dnd-gold rounded-full border-t-transparent animate-spin"
                    style={{ animationDuration: '2s' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-dnd-gold font-serif text-2xl">
                    {Math.round(((currentStepIndex + 1) / queue.length) * 100)}%
                </div>
            </div>

            <h2 className="text-4xl font-serif text-white mb-4">{status}</h2>
            <p className="text-gray-400 mb-12 text-lg max-w-lg mx-auto font-serif italic">
                Weaving the threads of your legend... All choices will be available in the "Choices" tab once your character is forged.
            </p>

            <div className="w-full max-w-md bg-gray-800/30 h-2 rounded-full overflow-hidden border border-gray-700">
                <div 
                    className="bg-dnd-gold h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    style={{ width: `${((currentStepIndex + 1) / queue.length) * 100}%` }}
                ></div>
            </div>
            
            <div className="mt-8 flex gap-4 max-w-full overflow-x-auto pb-1 px-2">
                {queue.map((item, idx) => (
                    <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-500 shrink-0 ${idx <= currentStepIndex ? 'bg-dnd-gold scale-125' : 'bg-gray-700'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default LevelingStep;