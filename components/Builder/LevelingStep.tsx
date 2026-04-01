import React, { useState, useEffect } from 'react';
import { CharacterState, FeatureEffect, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, APIReference, SubclassDetail, AbilityScores, SkillDefinition, AbilityName, LevelChoice } from '../../types';
import { fetchLevelFeatures, fetchFeatsList, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchAllSpells, fetchClassLevels } from '../../data/index';
import { calculateModifier, SKILL_LIST, getSpellSlots } from '../../utils/rules';
import { TOOLS } from '../../data/items/tools';
import { STANDARD_LANGUAGES, CLASS_FEATURES } from '../../data/constants';

interface LevelingStepProps {
    character: CharacterState;
    onComplete: (updates: Partial<CharacterState>) => void;
    onBack: () => void;
}

interface LevelStepItem {
    classIndex: string;
    className: string;
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
                for (let i = 1; i <= cls.level; i++) {
                    const isSub = (
                        (['cleric', 'warlock', 'sorcerer'].includes(cls.definition.index) && i === 1) ||
                        (['druid', 'wizard'].includes(cls.definition.index) && i === 2) ||
                        (['bard', 'barbarian', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'artificer', 'pugilist', 'arrowsmith'].includes(cls.definition.index) && i === 3) ||
                        (['arrowsmith'].includes(cls.definition.index) && i === 5)
                    );
                    q.push({
                        classIndex: cls.definition.index,
                        className: cls.definition.name,
                        level: i,
                        isSubclassLevel: isSub
                    });
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
            
            // Small delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 300));

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
                                else if (eff.type === 'feature_choice') choiceType = 'other';
                                else if (eff.category === 'language') choiceType = 'language';
                                else if (eff.category === 'tool') choiceType = 'other';

                                accumulator.current.choices.push({
                                    id: choiceId,
                                    level: item.level,
                                    source: item.className,
                                    type: choiceType,
                                    label: f.name,
                                    value: null,
                                    options: eff.options ? eff.options.map((o: any) => typeof o === 'string' ? o : (o.name || o.item?.name)) : (eff.category === 'tool' ? TOOLS.map(t => t.name) : (eff.category === 'language' ? STANDARD_LANGUAGES : SKILL_LIST.map(s => s.name))),
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
                        label: getSubclassTerminology(item.classIndex),
                        value: null,
                        options: subs,
                        revertData: { classIndex: item.classIndex }
                    });
                }
            }
        }

        setStatus("Finalizing character...");
        await new Promise(resolve => setTimeout(resolve, 500));
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

        // Recalculate feature usage
        character.classes.forEach(c => {
            const feat = CLASS_FEATURES[c.definition.name];
            if (feat) {
                const max = feat.formula(c.level, accumulator.current.abilities);
                updates.featureUsage![feat.name] = { max, current: max, reset: feat.reset };
            }
        });

        onComplete(updates);
    };

    const getSubclassTerminology = (classIndex: string) => {
        if (classIndex === 'artificer') return 'Artificer Specialist';
        if (classIndex === 'pugilist') return 'Fight Club';
        if (classIndex === 'cleric') return 'Divine Domain';
        if (classIndex === 'druid') return 'Druidic Circle';
        if (classIndex === 'bard') return 'Bard College';
        if (classIndex === 'paladin') return 'Sacred Oath';
        if (classIndex === 'warlock') return 'Otherworldly Patron';
        if (classIndex === 'sorcerer') return 'Sorcerous Origin';
        if (classIndex === 'wizard') return 'Arcane Tradition';
        if (classIndex === 'arrowsmith') return 'Arrowsmith Specialization';
        return 'Specialization';
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
            
            <div className="mt-8 flex gap-4">
                {queue.map((item, idx) => (
                    <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'bg-dnd-gold scale-125' : 'bg-gray-700'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default LevelingStep;