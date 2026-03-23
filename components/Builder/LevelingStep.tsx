import React, { useState, useEffect } from 'react';
import { CharacterState, FeatureEffect, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, APIReference, SubclassDetail, AbilityScores, SkillDefinition, AbilityName } from '../../types';
import { fetchLevelFeatures, fetchFeatsList, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchAllSpells, fetchClassLevels } from '../../data/index';
import { calculateModifier, SKILL_LIST } from '../../utils/rules';
import { TOOLS } from '../../data/items/tools';
import { STANDARD_LANGUAGES } from '../../data/constants';

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

    // Accumulated state
    const [pendingChoices, setPendingChoices] = useState<any[]>([]);
    const [availableSubclasses, setAvailableSubclasses] = useState<APIReference[]>([]);
    const [selectedSubclass, setSelectedSubclass] = useState<SubclassDetail | null>(null);
    
    // Feature Choice State
    const [choiceSelections, setChoiceSelections] = useState<Record<string, string[]>>({});

    // ASI State
    const [asiChoice, setAsiChoice] = useState<'ability' | 'feat'>('ability');
    const [abilityIncreases, setAbilityIncreases] = useState<Record<string, number>>({}); 
    const [selectedFeat, setSelectedFeat] = useState<FeatDetail | null>(null);
    const [availableFeats, setAvailableFeats] = useState<FeatDetail[]>([]);
    const [featSubChoices, setFeatSubChoices] = useState<Record<number, string | string[]>>({}); 

    // Subclass Map
    const [subclassMap, setSubclassMap] = useState<Record<string, SubclassDetail>>({});

    useEffect(() => {
        const init = async () => {
            const q: LevelStepItem[] = [];
            character.classes.forEach(cls => {
                for (let i = 1; i <= cls.level; i++) {
                    const isSub = (
                        (['cleric', 'warlock', 'sorcerer'].includes(cls.definition.index) && i === 1) ||
                        (['druid', 'wizard'].includes(cls.definition.index) && i === 2) ||
                        (['bard', 'barbarian', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'artificer', 'pugilist', 'arrowsmith'].includes(cls.definition.index) && i === 3) ||
                        (['arrowsmith'].includes(cls.definition.index) && i === 5) // Specialization for arrowsmith is level 5
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
            
            const feats = await fetchFeatsList();
            setAvailableFeats(feats);
            
            setLoading(false);
            loadStep(0, q);
        };
        init();
    }, []);

    useEffect(() => {
        setFeatSubChoices({});
    }, [selectedFeat]);

    const loadStep = async (index: number, q: LevelStepItem[]) => {
        if (index >= q.length) return;
        const item = q[index];
        setLoading(true);

        setPendingChoices([]);
        setChoiceSelections({});
        setAsiChoice('ability');
        setAbilityIncreases({});
        setSelectedFeat(null);
        setAvailableSubclasses([]);
        setSelectedSubclass(null);
        setFeatSubChoices({});

        const features = await fetchLevelFeatures(item.classIndex, item.level);
        
        const choices: any[] = [];
        features.forEach((f: any) => {
            if (f.effects) {
                f.effects.forEach((eff: FeatureEffect) => {
                    if (['expertise_choice', 'proficiency_choice', 'feature_choice'].includes(eff.type)) {
                        choices.push({ feature: f, effect: eff, id: `${f.index}-${eff.type}` });
                    }
                });
            }
            if (f.name === "Ability Score Improvement") {
                choices.push({ feature: f, effect: { type: 'asi' }, id: `asi-${item.level}` });
            }
        });

        const existingSub = character.classes.find(c => c.definition.index === item.classIndex)?.subclass || subclassMap[item.classIndex];

        if (item.isSubclassLevel) {
            if (existingSub) {
                setSelectedSubclass(existingSub);
                const subLevels = await fetchSubclassLevels(existingSub.index);
                const subFeats = subLevels
                    .filter((l: any) => l.level === item.level)
                    .flatMap((l: any) => l.features.map((f: any) => ({ ...f, source: existingSub.name })));
                
                 subFeats.forEach((f: any) => {
                    if (f.effects) {
                        f.effects.forEach((eff: FeatureEffect) => {
                             if (['expertise_choice', 'proficiency_choice', 'feature_choice'].includes(eff.type)) {
                                choices.push({ feature: f, effect: eff, id: `${f.index}-${eff.type}` });
                            }
                        });
                    }
                 });
            } else {
                 const subs = await fetchSubclasses(item.classIndex);
                 setAvailableSubclasses(subs);
            }
        } else {
            if (existingSub) {
                const subLevels = await fetchSubclassLevels(existingSub.index);
                const subFeats = subLevels
                    .filter((l: any) => l.level === item.level)
                    .flatMap((l: any) => l.features.map((f: any) => ({ ...f, source: existingSub.name })));
                
                 subFeats.forEach((f: any) => {
                    if (f.effects) {
                        f.effects.forEach((eff: FeatureEffect) => {
                             if (['expertise_choice', 'proficiency_choice', 'feature_choice'].includes(eff.type)) {
                                choices.push({ feature: f, effect: eff, id: `${f.index}-${eff.type}` });
                            }
                        });
                    }
                 });
            }
        }

        setPendingChoices(choices);
        setLoading(false);
    };

    const handleChoice = (id: string, value: string, max: number) => {
        setChoiceSelections(prev => {
            const current = prev[id] || [];
            if (current.includes(value)) {
                return { ...prev, [id]: current.filter(v => v !== value) };
            } else {
                if (current.length < max) {
                    return { ...prev, [id]: [...current, value] };
                }
                return prev;
            }
        });
    };
    
    const handleSubclassSelect = async (sub: APIReference) => {
        const detail = await fetchSubclassDetail(sub.index);
        if (detail) {
            setSelectedSubclass(detail);
            setSubclassMap(prev => ({ ...prev, [queue[currentStepIndex].classIndex]: detail }));
        }
    };

    const accumulator = React.useRef<{
        skills: string[];
        expertise: string[];
        feats: FeatDetail[];
        abilities: AbilityScores;
        subclasses: Record<string, SubclassDetail>;
        features: any[];
        choices: any[];
        languages: string[];
        toolProficiencies: string[];
    }>({
        skills: [...character.skills],
        expertise: [...(character.expertise || [])],
        feats: [...character.feats],
        abilities: { ...character.abilities },
        subclasses: {},
        features: [...character.classFeatures],
        choices: [...character.choices],
        languages: [...(character.languages || [])],
        toolProficiencies: [...(character.toolProficiencies || [])]
    });

    const updateAccumulator = () => {
         const currentItem = queue[currentStepIndex];

         if (selectedSubclass) {
             accumulator.current.subclasses[currentItem.classIndex] = selectedSubclass;
             // Add subclass choice
             accumulator.current.choices.push({
                 id: `subclass-${currentItem.classIndex}-${currentItem.level}`,
                 level: currentItem.level,
                 source: currentItem.className,
                 type: 'subclass',
                 label: getSubclassTerminology(currentItem.classIndex),
                 value: selectedSubclass.name,
                 options: availableSubclasses.map(s => s.name)
             });
         }

         pendingChoices.forEach(c => {
             if (c.effect.type === 'expertise_choice') {
                 const selections = choiceSelections[c.id] || [];
                 selections.forEach(s => {
                     if (!accumulator.current.expertise.includes(s)) accumulator.current.expertise.push(s);
                 });
                 accumulator.current.choices.push({
                     id: c.id,
                     level: currentItem.level,
                     source: currentItem.className,
                     type: 'expertise',
                     label: c.feature.name,
                     value: selections,
                     options: accumulator.current.skills, // Options for expertise are usually current skills
                     count: c.effect.count || 1
                 });
             } else if (c.effect.type === 'proficiency_choice') {
                 const selections = choiceSelections[c.id] || [];
                 selections.forEach(s => {
                       if (c.effect.category === 'skill') {
                           if (!accumulator.current.skills.includes(s)) accumulator.current.skills.push(s);
                       } else if (c.effect.category === 'tool') {
                           if (!accumulator.current.toolProficiencies.includes(s)) accumulator.current.toolProficiencies.push(s);
                       } else if (c.effect.category === 'language') {
                           if (!accumulator.current.languages.includes(s)) accumulator.current.languages.push(s);
                       }
                 });
                 accumulator.current.choices.push({
                     id: c.id,
                     level: currentItem.level,
                     source: currentItem.className,
                     type: c.effect.category || 'skill',
                     label: c.feature.name,
                     value: selections,
                     options: c.effect.options ? c.effect.options.map((o: any) => typeof o === 'string' ? o : (o.name || o.item?.name)) : (c.effect.category === 'tool' ? TOOLS.map(t => t.name) : (c.effect.category === 'language' ? STANDARD_LANGUAGES : SKILL_LIST.map(s => s.name))),
                     count: c.effect.count || 1
                 });
             } else if (c.effect.type === 'feature_choice') {
                 const selections = choiceSelections[c.id] || [];
                 selections.forEach(s => {
                     accumulator.current.features.push({
                         index: `choice-${s.toLowerCase().replace(/\s+/g, '-')}`,
                         name: `${c.feature.name}: ${s}`,
                         level: currentItem.level,
                         source: currentItem.className,
                         desc: [`Selected option: ${s}`]
                     });
                 });
                 accumulator.current.choices.push({
                     id: c.id,
                     level: currentItem.level,
                     source: currentItem.className,
                     type: 'feature',
                     label: c.feature.name,
                     value: selections,
                     options: c.effect.options.map((o: any) => o.name),
                     count: c.effect.count || 1
                 });
             } else if (c.effect.type === 'asi') {
                 if (asiChoice === 'ability') {
                     Object.entries(abilityIncreases).forEach(([stat, val]) => {
                         accumulator.current.abilities[stat as keyof AbilityScores] += val;
                     });
                     accumulator.current.choices.push({
                         id: `asi-${currentItem.level}`,
                         level: currentItem.level,
                         source: currentItem.className,
                         type: 'asi',
                         label: 'Ability Score Improvement',
                         value: abilityIncreases,
                         options: ABILITY_NAMES
                     });
                 } else if (selectedFeat) {
                     accumulator.current.feats.push(selectedFeat);
                     accumulator.current.choices.push({
                         id: `feat-${currentItem.level}`,
                         level: currentItem.level,
                         source: currentItem.className,
                         type: 'feat',
                         label: 'Feat Selection',
                         value: selectedFeat.name,
                         options: availableFeats.map(f => f.name)
                     });
                     if (selectedFeat.effects) {
                         selectedFeat.effects.forEach((eff: any, idx: number) => {
                             if (eff.type === 'asi') {
                                 eff.attributes.forEach((a: string) => accumulator.current.abilities[a as keyof AbilityScores] += eff.amount);
                             } else if (eff.type === 'asi_choice') {
                                 const choice = featSubChoices[idx];
                                 if (Array.isArray(choice)) {
                                     choice.forEach(a => accumulator.current.abilities[a as keyof AbilityScores] += eff.amount);
                                 } else if (typeof choice === 'string' && choice) {
                                     accumulator.current.abilities[choice as keyof AbilityScores] += eff.amount;
                                 }
                                 accumulator.current.choices.push({
                                     id: `feat-choice-${selectedFeat.index}-${idx}`,
                                     level: currentItem.level,
                                     source: `Feat: ${selectedFeat.name}`,
                                     type: 'asi',
                                     label: 'Feat Ability Choice',
                                     value: choice,
                                     options: eff.options,
                                     count: eff.count || 1
                                 });
                             }
                         });
                     }
                 }
             }
         });
    };

    const handleNext = () => {
        const currentItem = queue[currentStepIndex];
        
        if (currentItem.isSubclassLevel && !selectedSubclass) {
            alert("Please select a specialization.");
            return;
        }

        for (const c of pendingChoices) {
            if (c.effect.type === 'asi') {
                if (asiChoice === 'ability') {
                    const total = Object.values(abilityIncreases).reduce((a: number, b: number) => a + b, 0);
                    if (total !== 2) { alert("Please allocate exactly 2 ability points."); return; }
                } else if (!selectedFeat) {
                    alert("Please select a feat."); return;
                } else {
                    let missingChoice = false;
                    selectedFeat.effects?.forEach((eff: any, idx: number) => {
                        if (eff.type === 'asi_choice') {
                            const choice = featSubChoices[idx];
                            const count = eff.count || 1;
                            if (count === 1) {
                                if (!choice) missingChoice = true;
                            } else {
                                if (!Array.isArray(choice) || choice.length !== count) missingChoice = true;
                            }
                        }
                    });
                    if (missingChoice) {
                        alert("Please complete all choices for your selected feat.");
                        return;
                    }
                }
            } else {
                const count = c.effect.count || 1;
                const made = choiceSelections[c.id]?.length || 0;
                if (made !== count) {
                     alert(`Please select ${count} options for ${c.feature.name}.`);
                     return;
                }
            }
        }
        
        // Update accumulator for current level step
        updateAccumulator();

        if (currentStepIndex < queue.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            loadStep(currentStepIndex + 1, queue);
        } else {
            finish();
        }
    };

    const finish = async () => {
        const updates: Partial<CharacterState> = {
            abilities: accumulator.current.abilities,
            skills: accumulator.current.skills,
            expertise: accumulator.current.expertise,
            feats: accumulator.current.feats,
            choices: accumulator.current.choices,
            languages: accumulator.current.languages,
            toolProficiencies: accumulator.current.toolProficiencies
        };

        updates.classes = character.classes.map(c => ({
            ...c,
            subclass: accumulator.current.subclasses[c.definition.index] || c.subclass
        }));

        let allFeatures = [...accumulator.current.features]; 
        for (const cls of updates.classes || []) {
             const classLevels = await fetchClassLevels(cls.definition.index);
             const clsFeats = classLevels
                .filter((l: { level: number }) => l.level <= cls.level)
                .flatMap((l: any) => (l.features || []).map((f: any) => ({ 
                    ...f, 
                    level: l.level, 
                    source: cls.definition.name 
                })));
            
            clsFeats.forEach((f: any) => {
                if (!allFeatures.some(ex => ex.index === f.index)) {
                     allFeatures.push(f);
                }
            });

            if (cls.subclass) {
                 const subLevels = await fetchSubclassLevels(cls.subclass.index);
                 const subFeats = subLevels
                    .filter((l: { level: number }) => l.level <= cls.level)
                    .flatMap((l: any) => l.features.map((f: any) => ({ 
                        ...f, 
                        level: l.level, 
                        source: cls.subclass?.name 
                    })));
                 
                 subFeats.forEach((f: any) => {
                    if (!allFeatures.some(ex => ex.index === f.index)) {
                         allFeatures.push(f);
                    }
                });
            }
        }
        updates.classFeatures = allFeatures;

        // Auto-add companion widgets to layout
        const currentLayout = character.layout || { left: [], right: [], mobile: [] };
        let newRight = [...(currentLayout.right || [])];
        
        const isArtillerist = updates.classes?.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'artillerist' && c.level >= 3);
        const isBattleSmith = updates.classes?.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'battle-smith' && c.level >= 3);

        if (isArtillerist && !newRight.includes('eldritchCannon') && !(currentLayout.left || []).includes('eldritchCannon')) {
            newRight.push('eldritchCannon');
        }
        if (isBattleSmith && !newRight.includes('steelDefender') && !(currentLayout.left || []).includes('steelDefender')) {
            newRight.push('steelDefender');
        }
        
        if (newRight.length !== (currentLayout.right || []).length) {
            updates.layout = { ...currentLayout, right: newRight };
        }

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

    const currentItem = queue[currentStepIndex];
    if (!currentItem) return null;

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
             <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center shrink-0">
                    <div>
                         <h2 className="text-4xl font-serif text-white mb-1">{currentItem.className}</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dnd-gold">Level {currentItem.level} Advancement</p>
                    </div>
                    <div className="text-right">
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Step</span>
                         <div className="text-2xl font-black text-white leading-none">{currentStepIndex + 1} / {queue.length}</div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-10">
                     {loading ? <div className="text-dnd-gold animate-pulse text-center font-serif text-xl mt-10">Weaving your history...</div> : (
                         <>
                            {currentItem.isSubclassLevel && !selectedSubclass && (
                                <section className="animate-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Choose Your {getSubclassTerminology(currentItem.classIndex)}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableSubclasses.map(sub => (
                                            <button 
                                                key={sub.index} 
                                                onClick={() => handleSubclassSelect(sub)}
                                                className="p-6 border border-gray-700 rounded-xl hover:border-dnd-gold text-left bg-black/20 hover:bg-black/40 transition-all group"
                                            >
                                                <div className="font-black uppercase tracking-widest text-sm text-white group-hover:text-dnd-gold">{sub.name}</div>
                                                <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Adopt this specialized path</div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {selectedSubclass && currentItem.isSubclassLevel && (
                                <div className="bg-dnd-gold/10 border border-dnd-gold/30 p-5 rounded-xl animate-in zoom-in-95">
                                    <div className="text-[10px] font-black text-dnd-gold uppercase tracking-widest mb-1">{getSubclassTerminology(currentItem.classIndex)} Selected</div>
                                    <div className="text-2xl font-serif text-white">{selectedSubclass.name}</div>
                                </div>
                            )}

                            {pendingChoices.map(choice => (
                                <section key={choice.id} className="bg-black/20 border border-gray-800 p-6 rounded-2xl animate-in fade-in duration-300">
                                    <h4 className="text-xl font-serif text-white mb-4 flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
                                        {choice.feature.name}
                                    </h4>
                                    
                                    {choice.effect.type === 'asi' ? (
                                         <div className="max-w-xl mx-auto space-y-6">
                                             <div className="flex justify-center gap-3 bg-black/40 p-1 rounded-full border border-gray-800">
                                                 <button onClick={() => setAsiChoice('ability')} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${asiChoice === 'ability' ? 'bg-dnd-gold text-black shadow-lg' : 'text-gray-500'}`}>Stats</button>
                                                 <button onClick={() => setAsiChoice('feat')} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${asiChoice === 'feat' ? 'bg-dnd-gold text-black shadow-lg' : 'text-gray-500'}`}>Feat</button>
                                             </div>
                                             
                                             {asiChoice === 'ability' ? (
                                                 <div className="space-y-2">
                                                     {ABILITY_NAMES.map(stat => (
                                                         <div key={stat} className="flex justify-between items-center bg-[#0b0c0e] border border-gray-800 p-3 rounded-xl">
                                                             <span className="uppercase font-black text-[10px] tracking-[0.2em] text-gray-500">{ABILITY_LABELS[stat]}</span>
                                                             <div className="flex items-center gap-4">
                                                                 <button onClick={() => setAbilityIncreases(p => ({...p, [stat]: Math.max(0, (p[stat]||0)-1)}))} className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">&minus;</button>
                                                                 <span className="font-black text-white w-6 text-center text-xl">{abilityIncreases[stat] || 0}</span>
                                                                 <button 
                                                                    onClick={() => {
                                                                        const currentTotal = Object.values(abilityIncreases).reduce((a: number,b: number)=>a+b,0) as number;
                                                                        if (currentTotal < 2) setAbilityIncreases(p => ({...p, [stat]: (p[stat]||0)+1}));
                                                                    }} 
                                                                    className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                                                                 >+</button>
                                                             </div>
                                                         </div>
                                                     ))}
                                                 </div>
                                             ) : (
                                                 <div className="space-y-6">
                                                    <select 
                                                        className="w-full bg-[#0b0c0e] border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-dnd-gold outline-none shadow-inner"
                                                        onChange={(e) => setSelectedFeat(availableFeats.find(f => f.index === e.target.value) || null)}
                                                        value={selectedFeat?.index || ''}
                                                    >
                                                        <option value="">Choose a Feat...</option>
                                                        {availableFeats.map(f => <option key={f.index} value={f.index}>{f.name}</option>)}
                                                    </select>
                                                    
                                                    {selectedFeat && (
                                                        <div className="bg-black/30 p-5 rounded-xl border border-dnd-gold/20">
                                                            <p className="text-sm text-gray-400 italic mb-4 font-serif leading-relaxed">"{selectedFeat.desc[0]}"</p>
                                                            {selectedFeat.effects?.map((eff: any, idx: number) => {
                                                                if (eff.type === 'asi_choice') {
                                                                    return (
                                                                        <div key={idx} className="space-y-3">
                                                                            <span className="text-[10px] text-dnd-gold uppercase font-black tracking-widest">Feat Selection (+{eff.amount})</span>
                                                                            {Array.from({length: eff.count || 1}).map((_, i) => (
                                                                                <select
                                                                                    key={i}
                                                                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-xs text-white"
                                                                                    value={Array.isArray(featSubChoices[idx]) ? (featSubChoices[idx] as string[])[i] : (featSubChoices[idx] as string) || ''}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        if ((eff.count || 1) > 1) {
                                                                                            const current = (featSubChoices[idx] as string[]) || Array(eff.count).fill('');
                                                                                            const newArr = [...current];
                                                                                            newArr[i] = val;
                                                                                            setFeatSubChoices(prev => ({...prev, [idx]: newArr}));
                                                                                        } else {
                                                                                            setFeatSubChoices(prev => ({...prev, [idx]: val}));
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="">Select Attribute...</option>
                                                                                    {eff.options.map((opt: string) => (
                                                                                        <option key={opt} value={opt}>{ABILITY_LABELS[opt as AbilityName]}</option>
                                                                                    ))}
                                                                                </select>
                                                                            ))}
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
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {(() => {
                                                let options: any[] = [];
                                                if (choice.effect.type === 'expertise_choice') {
                                                    options = accumulator.current.skills
                                                        .filter(s => !accumulator.current.expertise.includes(s))
                                                        .map(s => ({ name: s, desc: `Gain expertise in ${s}.` }));
                                                } else if (choice.effect.type === 'proficiency_choice') {
                                                    if (choice.effect.category === 'skill') {
                                                        options = SKILL_LIST
                                                            .filter(s => !accumulator.current.skills.includes(s.name))
                                                            .map(s => ({ name: s.name, desc: `Gain proficiency in ${s.name}.` }));
                                                    } else if (choice.effect.category === 'tool') {
                                                        options = TOOLS
                                                            .filter(t => !accumulator.current.toolProficiencies.includes(t.name))
                                                            .map(t => ({ name: t.name, desc: `Gain proficiency in ${t.name}.` }));
                                                    } else if (choice.effect.category === 'language') {
                                                        options = STANDARD_LANGUAGES
                                                            .filter(l => !accumulator.current.languages.includes(l))
                                                            .map(l => ({ name: l, desc: `Learn the ${l} language.` }));
                                                    } else if (choice.effect.options) {
                                                        options = choice.effect.options.map((o: any) => ({
                                                            name: typeof o === 'string' ? o : (o.name || o.item?.name),
                                                            desc: o.desc || (typeof o === 'string' ? `Gain proficiency in ${o}.` : `Gain proficiency in ${o.name || o.item?.name}.`)
                                                        }));
                                                    }
                                                } else if (choice.effect.type === 'feature_choice') {
                                                    options = choice.effect.options.map((o: any) => ({
                                                        name: o.name,
                                                        desc: o.desc
                                                    }));
                                                }
                                                
                                                return options.map(opt => {
                                                    const isSel = choiceSelections[choice.id]?.includes(opt.name);
                                                    return (
                                                        <label 
                                                            key={opt.name} 
                                                            title={opt.desc}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSel ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/20 border-transparent text-gray-500 hover:bg-gray-800'}`}
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isSel || false}
                                                                onChange={() => handleChoice(choice.id, opt.name, choice.effect.count)}
                                                                className="accent-dnd-gold"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black uppercase tracking-widest">{opt.name}</span>
                                                                {opt.desc && <span className="text-[9px] text-gray-600 line-clamp-1 italic">{opt.desc}</span>}
                                                            </div>
                                                        </label>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    )}
                                </section>
                            ))}
                            
                            {pendingChoices.length === 0 && !currentItem.isSubclassLevel && (
                                <div className="text-center py-20 animate-in fade-in duration-1000">
                                     <p className="font-serif text-2xl text-gray-600 italic">This level is a time of quiet growth and steady progress.</p>
                                     <p className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em]">No choices required at this level.</p>
                                </div>
                            )}
                         </>
                     )}
                </div>

                <div className="p-6 border-t border-gray-800 bg-[#121316] rounded-b-xl flex justify-between items-center shrink-0">
                    <button 
                        onClick={onBack}
                        className="px-8 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors"
                    >
                        &larr; Back
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={loading}
                        className="bg-dnd-gold hover:bg-yellow-600 disabled:bg-gray-800 disabled:text-gray-600 text-black px-12 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors"
                    >
                        {currentStepIndex < queue.length - 1 ? 'Next Level' : 'Complete Leveling'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelingStep;