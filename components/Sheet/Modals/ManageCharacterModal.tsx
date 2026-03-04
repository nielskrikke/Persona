import React, { useState, useEffect } from 'react';
import { CharacterState, APIReference, RaceDetail, SubraceDetail, BackgroundDetail, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, AbilityScores, SpellDetail } from '@/types';
import { fetchClasses, fetchRaces, fetchSubraces, fetchBackgrounds, fetchFeatsList, fetchRaceDetail, fetchSubraceDetail, fetchBackgroundDetail, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels, getLocalSpells } from '@/data/index';
import { getSpellSlots, calculateModifier, SKILL_LIST } from '@/utils/rules';
import { CLASS_FEATURES, STANDARD_LANGUAGES } from '../../../data/constants';
import LevelUpWizard from '../LevelUpWizard';

const SUBCLASS_LEVELS: Record<string, number> = {
    'Cleric': 1, 'Warlock': 1, 'Sorcerer': 1,
    'Druid': 2, 'Wizard': 2,
    'Bard': 3, 'Barbarian': 3, 'Fighter': 3, 'Monk': 3, 'Paladin': 3, 'Ranger': 3, 'Rogue': 3, 'Artificer': 3
};

const ManageCharacterModal = ({ 
    character, 
    isOpen, 
    onClose, 
    onUpdate, 
    onLevelUp 
}: { 
    character: CharacterState, 
    isOpen: boolean, 
    onClose: () => void, 
    onUpdate: (data: any) => void, 
    onLevelUp: (classIndex: string, updates: Partial<CharacterState>) => Promise<void> 
}) => {
    const [tab, setTab] = useState<'identity' | 'classes' | 'abilities' | 'proficiencies' | 'trackers' | 'settings'>('identity');
    
    // Identity State
    const [name, setName] = useState(character.name);
    const [avatar, setAvatar] = useState(character.avatarUrl || '');
    const [xp, setXp] = useState(character.xp.toString());
    const [alignment, setAlignment] = useState(character.alignment);
    const [languages, setLanguages] = useState<string[]>(character.languages || []);
    const [newLangInput, setNewLangInput] = useState('');
    
    // Lists
    const [allRaces, setAllRaces] = useState<APIReference[]>([]);
    const [allSubraces, setAllSubraces] = useState<APIReference[]>([]);
    const [allBackgrounds, setAllBackgrounds] = useState<APIReference[]>([]);
    const [allClasses, setAllClasses] = useState<APIReference[]>([]);
    const [allFeats, setAllFeats] = useState<FeatDetail[]>([]);
    const [wizardCantrips, setWizardCantrips] = useState<SpellDetail[]>([]);
    const [loadingSubraces, setLoadingSubraces] = useState(false);

    // Selections
    const [selectedRaceIndex, setSelectedRaceIndex] = useState('');
    const [selectedSubraceIndex, setSelectedSubraceIndex] = useState('');
    const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState('');

    // Classes State
    const [classSubclassOptions, setClassSubclassOptions] = useState<Record<string, APIReference[]>>({});
    const [wizardClassIndex, setWizardClassIndex] = useState<string>(''); // For opening LevelUpWizard
    const [isInitiation, setIsInitiation] = useState(false); // New class vs existing

    // Abilities State
    const [abilities, setAbilities] = useState<AbilityScores>({...character.abilities});
    const [featToAdd, setFeatToAdd] = useState('');

    // Proficiencies State
    const [skills, setSkills] = useState<string[]>([...character.skills]);
    const [expertise, setExpertise] = useState<string[]>([...(character.expertise || [])]);

    // Tracker State
    const [localFeatures, setLocalFeatures] = useState(character.featureUsage || {});
    const [newFeatName, setNewFeatName] = useState('');
    const [newFeatMax, setNewFeatMax] = useState(1);
    const [newFeatReset, setNewFeatReset] = useState<'short' | 'long'>('long');

    // Settings State
    const [fontScale, setFontScale] = useState(character.fontScale || 1.0);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(character.backgroundImageUrl || '');
    const [backgroundColor, setBackgroundColor] = useState(character.backgroundColor || '#151515');
    const [themeColor, setThemeColor] = useState(character.themeColor || '#c9ad6a');
    const [themeColorSecondary, setThemeColorSecondary] = useState(character.themeColorSecondary || '#8a0b0b');
    const [diceColor, setDiceColor] = useState(character.diceColor || '#c9ad6a');
    const [show3DDice, setShow3DDice] = useState(character.show3DDice !== false); // Default to true

    // Initialization
    useEffect(() => {
        if (isOpen) {
            // Load Ref Data
            const loadData = async () => {
                const [r, b, f, c] = await Promise.all([
                    fetchRaces(),
                    fetchBackgrounds(),
                    fetchFeatsList(),
                    fetchClasses()
                ]);
                setAllRaces(r);
                setAllBackgrounds(b);
                setAllFeats(f);
                setAllClasses(c);

                // Load wizard cantrips for racial spell swapping
                const spells = getLocalSpells('wizard', 0);
                setWizardCantrips(spells);
            };
            loadData();

            // Sync Local State
            setName(character.name);
            setAvatar(character.avatarUrl || '');
            setXp(character.xp.toString());
            setAlignment(character.alignment);
            setLanguages(character.languages || []);
            setSelectedRaceIndex(character.race?.index || '');
            setSelectedSubraceIndex(character.subrace?.index || '');
            // Attempt to match background by name or index
            setSelectedBackgroundIndex(character.background.toLowerCase().replace(/\s+/g, '-'));
            setAbilities({...character.abilities});
            setSkills([...character.skills]);
            setExpertise([...(character.expertise || [])]);
            setLocalFeatures(character.featureUsage || {});
            setFontScale(character.fontScale || 1.0);
            setBackgroundImageUrl(character.backgroundImageUrl || '');
            setBackgroundColor(character.backgroundColor || '#2b2b2b');
            setThemeColor(character.themeColor || '#c9ad6a');
            setThemeColorSecondary(character.themeColorSecondary || '#8a0b0b');
            setDiceColor(character.diceColor || '#c9ad6a');
            setShow3DDice(character.show3DDice !== false);

            // Preload subraces if race exists
            if (character.race) {
                fetchSubraces(character.race.index).then(setAllSubraces);
            }
        }
    }, [isOpen, character]);

    // Handle Race Change
    const handleRaceChange = async (index: string) => {
        setSelectedRaceIndex(index);
        setSelectedSubraceIndex(''); // Reset subrace
        setLoadingSubraces(true);
        const subraces = await fetchSubraces(index);
        setAllSubraces(subraces);
        setLoadingSubraces(false);
    };

    // Handle Class Actions
    const handleRemoveClass = (classIndex: string) => {
        const cls = character.classes.find(c => c.definition.index === classIndex);
        if (!cls) return;
        
        if (!confirm(`Are you sure you want to remove ${cls.definition.name}? This will remove all ${cls.level} levels, features, and HP.`)) return;

        const remainingClasses = character.classes.filter(c => c.definition.index !== classIndex);
        const newLevel = remainingClasses.reduce((acc, c) => acc + c.level, 0);

        // HP Calculation
        const hitDie = cls.definition.hit_die;
        const conMod = calculateModifier(character.abilities.con);
        const isPrimary = character.classes[0].definition.index === classIndex;
        let hpToRemove = 0;
        
        if (isPrimary) {
            hpToRemove += hitDie + conMod; // Lvl 1
            if (cls.level > 1) {
                const avg = Math.floor(hitDie / 2) + 1;
                hpToRemove += (cls.level - 1) * (avg + conMod);
            }
        } else {
            const avg = Math.floor(hitDie / 2) + 1;
            hpToRemove += cls.level * (avg + conMod);
        }

        const newMaxHp = Math.max(0, character.maxHp - hpToRemove);
        const newCurrentHp = Math.min(character.currentHp, newMaxHp);

        // Features
        const subclassName = cls.subclass?.name;
        const className = cls.definition.name;
        const remainingFeatures = character.classFeatures.filter(f => 
            f.source !== className && f.source !== subclassName
        );

        // Spell Slots
        const newSpellSlots = getSpellSlots(remainingClasses);

        // Feature Usage Cleanup
        const newFeatureUsage = { ...character.featureUsage };
        const classFeatureDef = CLASS_FEATURES[className];
        if (classFeatureDef && newFeatureUsage[classFeatureDef.name]) {
            delete newFeatureUsage[classFeatureDef.name];
        }

        onUpdate({
            classes: remainingClasses,
            classFeatures: remainingFeatures,
            level: newLevel,
            maxHp: newMaxHp,
            currentHp: newCurrentHp,
            spellSlots: newSpellSlots,
            featureUsage: newFeatureUsage
        });
    };

    const handleLevelDown = (classIndex: string) => {
        const cls = character.classes.find(c => c.definition.index === classIndex);
        if (!cls || cls.level <= 1) return;

        const newLevel = cls.level - 1;
        
        // HP Reduction
        const hitDie = cls.definition.hit_die;
        const conMod = calculateModifier(character.abilities.con);
        const avg = Math.floor(hitDie / 2) + 1;
        const hpToRemove = avg + conMod;
        
        // Update Class
        const updatedClasses = character.classes.map(c => 
            c.definition.index === classIndex ? { ...c, level: newLevel } : c
        );
        
        // Remove Features of higher level
        const className = cls.definition.name;
        const subclassName = cls.subclass?.name;
        const updatedFeatures = character.classFeatures.filter(f => {
            if (f.source === className || f.source === subclassName) {
                return f.level <= newLevel;
            }
            return true;
        });

        // Update Spell Slots
        const newSlots = getSpellSlots(updatedClasses);

        // Update Trackers
        const newFeatures = { ...character.featureUsage };
        const classFeatureDef = CLASS_FEATURES[className];
        if (classFeatureDef && newFeatures[classFeatureDef.name]) {
             const max = classFeatureDef.formula(newLevel, character.abilities);
             newFeatures[classFeatureDef.name] = { 
                 ...newFeatures[classFeatureDef.name], 
                 max: max, 
                 current: Math.min(newFeatures[classFeatureDef.name].current, max) 
             };
        }
        
        onUpdate({
            classes: updatedClasses,
            classFeatures: updatedFeatures,
            level: character.level - 1,
            maxHp: Math.max(1, character.maxHp - hpToRemove),
            currentHp: Math.min(character.currentHp, Math.max(1, character.maxHp - hpToRemove)),
            spellSlots: newSlots,
            featureUsage: newFeatures
        });
    };

    const handleSubclassChange = async (classIndex: string, subclassIndex: string) => {
        if (!subclassIndex) return;
        const clsDef = character.classes.find(c => c.definition.index === classIndex);
        if (!clsDef) return;

        const newSubclass = await fetchSubclassDetail(subclassIndex);
        if (!newSubclass) return;

        // Update Class Definition
        const updatedClasses = character.classes.map(c => 
            c.definition.index === classIndex ? { ...c, subclass: newSubclass } : c
        );

        // Update Features: Remove old subclass features, add new ones up to current level
        const oldSubclassName = clsDef.subclass?.name;
        let updatedFeatures = character.classFeatures.filter(f => f.source !== oldSubclassName);
        
        const subLevels = await fetchSubclassLevels(subclassIndex);
        const newFeats = subLevels
            .filter((l: any) => l.level <= clsDef.level)
            .flatMap((l: any) => l.features.map((f: any) => ({ 
                ...f, 
                level: l.level, 
                source: newSubclass.name 
            })));

        // Merge unique features
        newFeats.forEach(f => {
            if (!updatedFeatures.some(ex => ex.index === f.index)) {
                updatedFeatures.push(f);
            }
        });

        const updates: any = { classes: updatedClasses, classFeatures: updatedFeatures };

        // Auto-inject layout if Artificer companions are unlocked
        if (classIndex === 'artificer' && clsDef.level >= 3) {
            const currentLayout = character.layout || { left: [], right: [], mobile: [] };
            if (subclassIndex === 'artillerist') {
                if (!currentLayout.right.includes('eldritchCannon') && !currentLayout.left.includes('eldritchCannon')) {
                    updates.layout = { ...currentLayout, right: [...currentLayout.right, 'eldritchCannon'] };
                }
            } else if (subclassIndex === 'battle-smith') {
                if (!currentLayout.right.includes('steelDefender') && !currentLayout.left.includes('steelDefender')) {
                    updates.layout = { ...currentLayout, right: [...currentLayout.right, 'steelDefender'] };
                }
            }
        }

        onUpdate(updates);
    };

    const loadSubclasses = async (classIndex: string) => {
        if (!classSubclassOptions[classIndex]) {
            const subs = await fetchSubclasses(classIndex);
            setClassSubclassOptions(prev => ({ ...prev, [classIndex]: subs }));
        }
    };

    // Save All Identity Changes
    const saveIdentity = async () => {
        const updates: any = { 
            name, 
            avatarUrl: avatar, 
            xp: parseInt(xp) || 0, 
            alignment,
            languages
        };

        // Process Race Change if varied
        if (selectedRaceIndex && selectedRaceIndex !== character.race?.index) {
            const raceDetail = await fetchRaceDetail(selectedRaceIndex);
            if (raceDetail) updates.race = raceDetail;
        }

        // Process Subrace Change
        if (selectedSubraceIndex && selectedSubraceIndex !== character.subrace?.index) {
            const subDetail = await fetchSubraceDetail(selectedSubraceIndex);
            if (subDetail) updates.subrace = subDetail;
        } else if (!selectedSubraceIndex && allSubraces.length === 0) {
            updates.subrace = null;
        }

        // Process Background Change
        const bgRef = allBackgrounds.find(b => b.index === selectedBackgroundIndex);
        if (bgRef && bgRef.name !== character.background) {
            const bgDetail = await fetchBackgroundDetail(bgRef.index);
            if (bgDetail) {
                updates.background = bgDetail.name;
                // Swap features
                const featsWithoutBg = character.classFeatures.filter(f => f.source !== 'Background');
                const newBgFeat = {
                    index: bgDetail.feature.name.toLowerCase().replace(/\s+/g, '-'),
                    name: bgDetail.feature.name,
                    level: 1,
                    source: 'Background',
                    desc: bgDetail.feature.desc,
                    url: ''
                };
                updates.classFeatures = [...featsWithoutBg, newBgFeat];
            }
        }

        onUpdate(updates);
        onClose();
    };

    const addManualLanguage = () => {
        if (!newLangInput.trim()) return;
        if (!languages.includes(newLangInput.trim())) {
            setLanguages(prev => [...prev, newLangInput.trim()]);
        }
        setNewLangInput('');
    };

    const removeManualLanguage = (lang: string) => {
        setLanguages(prev => prev.filter(l => l !== lang));
    };

    // Abilities & Feats
    const handleAbilityChange = (stat: keyof AbilityScores, val: string) => {
        const num = parseInt(val) || 0;
        setAbilities(prev => ({ ...prev, [stat]: num }));
    };

    const handleAddFeat = () => {
        if (!featToAdd) return;
        const feat = allFeats.find(f => f.index === featToAdd);
        if (feat) {
            onUpdate({ feats: [...character.feats, feat] });
            setFeatToAdd('');
        }
    };

    const handleRemoveFeat = (index: string) => {
        onUpdate({ feats: character.feats.filter(f => f.index !== index) });
    };

    const saveAbilities = () => {
        onUpdate({ abilities });
        onClose();
    };

    // Proficiencies
    const cycleSkill = (skill: string) => {
        const isProf = skills.includes(skill);
        const isExp = expertise.includes(skill);

        if (!isProf) {
            // None -> Proficient
            setSkills(prev => [...prev, skill]);
        } else if (isProf && !isExp) {
            // Proficient -> Expertise
            setExpertise(prev => [...prev, skill]);
        } else {
            // Expertise -> None
            setSkills(prev => prev.filter(s => s !== skill));
            setExpertise(prev => prev.filter(s => s !== skill));
        }
    };

    const replaceRacialSpell = (oldSpellIndex: string, newSpellIndex: string) => {
        const newSpell = wizardCantrips.find(s => s.index === newSpellIndex);
        if (!newSpell) return;

        const updatedSpells = character.spells.map(s => {
            if (s.index === oldSpellIndex && s.sourceClassIndex === 'racial') {
                return { ...newSpell, sourceClassIndex: 'racial', isPrepared: true };
            }
            return s;
        });
        
        onUpdate({ spells: updatedSpells });
    };

    const saveProficiencies = () => {
        onUpdate({ skills, expertise });
        onClose();
    };

    // Trackers
    const handleSaveTrackers = () => {
        onUpdate({ featureUsage: localFeatures });
        onClose();
    };
    
    const handleDeleteFeature = (featName: string) => {
        const next = { ...localFeatures };
        delete next[featName];
        setLocalFeatures(next);
    };

    const handleAddFeature = () => {
        if (!newFeatName) return;
        setLocalFeatures(prev => ({
            ...prev,
            [newFeatName]: { max: newFeatMax, current: newFeatMax, reset: newFeatReset }
        }));
        setNewFeatName(''); setNewFeatMax(1);
    };

    // Render Logic
    if (!isOpen) return null;

    if (wizardClassIndex) {
        return (
            <LevelUpWizard 
                character={character} 
                classIndex={wizardClassIndex} 
                onCancel={() => { setWizardClassIndex(''); setIsInitiation(false); }} 
                onComplete={(updates) => { 
                    onLevelUp(wizardClassIndex, updates); 
                    setWizardClassIndex('');
                    setIsInitiation(false);
                }} 
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4">
            <div className="bg-[#1b1c20] border border-dnd-gold rounded-lg w-full max-w-6xl shadow-2xl relative flex flex-col h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-white text-2xl z-20 transition-colors">&times;</button>
                
                <div className="flex border-b border-gray-700 bg-[#121316] shrink-0 overflow-x-auto">
                    {['identity', 'classes', 'abilities', 'proficiencies', 'trackers', 'settings'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTab(t as any)} 
                            className={`px-6 py-4 font-bold uppercase text-sm tracking-widest transition-colors ${tab === t ? 'bg-[#1b1c20] text-dnd-gold border-t-2 border-dnd-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 bg-[#1b1c20]">
                    
                    {/* IDENTITY TAB */}
                    {tab === 'identity' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Avatar URL</label>
                                    <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Race</label>
                                    <select value={selectedRaceIndex} onChange={e => handleRaceChange(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none">
                                        {allRaces.map(r => <option key={r.index} value={r.index}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Subrace</label>
                                    <select 
                                        value={selectedSubraceIndex} 
                                        onChange={e => setSelectedSubraceIndex(e.target.value)} 
                                        className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none disabled:opacity-50"
                                        disabled={loadingSubraces || allSubraces.length === 0}
                                    >
                                        <option value="">{allSubraces.length > 0 ? 'Select Subrace' : 'None Available'}</option>
                                        {allSubraces.map(s => <option key={s.index} value={s.index}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Background</label>
                                    <select value={selectedBackgroundIndex} onChange={e => setSelectedBackgroundIndex(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none">
                                        <option value="">Select Background</option>
                                        {allBackgrounds.map(b => <option key={b.index} value={b.index}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Alignment</label>
                                    <input type="text" value={alignment} onChange={e => setAlignment(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none" />
                                </div>
                                <div className="md:col-span-2 bg-black/20 p-5 rounded-xl border border-gray-800">
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-3 tracking-widest">Languages known</label>
                                    <div className="flex gap-2 mb-4">
                                        <div className="flex-grow relative">
                                            <input 
                                                type="text" 
                                                list="standard-languages-manage"
                                                value={newLangInput} 
                                                onChange={e => setNewLangInput(e.target.value)} 
                                                placeholder="Add custom language..."
                                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-dnd-gold"
                                                onKeyDown={e => e.key === 'Enter' && addManualLanguage()}
                                            />
                                            <datalist id="standard-languages-manage">
                                                {STANDARD_LANGUAGES.map(l => <option key={l} value={l} />)}
                                            </datalist>
                                        </div>
                                        <button onClick={addManualLanguage} className="bg-gray-700 hover:bg-gray-600 px-4 rounded-lg text-xs font-bold uppercase text-white transition-colors">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {languages.map(lang => (
                                            <span key={lang} className="bg-dnd-gold/10 border border-dnd-gold/30 px-3 py-1 rounded-full text-[10px] font-black text-dnd-gold uppercase flex items-center gap-2">
                                                {lang}
                                                <button onClick={() => removeManualLanguage(lang)} className="hover:text-white transition-colors">&times;</button>
                                            </span>
                                        ))}
                                        {languages.length === 0 && <span className="text-gray-600 italic text-[10px]">No languages recorded. Add 'Common' or others.</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Experience Points</label>
                                    <input type="number" value={xp} onChange={e => setXp(e.target.value)} className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <button onClick={saveIdentity} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors">Save Identity</button>
                            </div>
                        </div>
                    )}

                    {/* CLASSES TAB */}
                    {tab === 'classes' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="space-y-4">
                                {character.classes.map((cls, idx) => {
                                    const requiredLevel = SUBCLASS_LEVELS[cls.definition.name] || 3;
                                    const canPickSubclass = cls.level >= requiredLevel;

                                    return (
                                        <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-gray-500 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold text-white">{cls.definition.name}</h3>
                                                    <span className="bg-black/40 px-2 py-1 rounded text-xs font-bold text-dnd-gold border border-dnd-gold/30">Level {cls.level}</span>
                                                </div>
                                                {canPickSubclass && (
                                                    <div className="mt-2">
                                                        <label className="text-[10px] text-gray-500 uppercase font-bold mr-2">Subclass:</label>
                                                        <select 
                                                            className="bg-[#0b0c0e] border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-dnd-gold"
                                                            value={cls.subclass?.index || ''}
                                                            onFocus={() => loadSubclasses(cls.definition.index)}
                                                            onChange={(e) => handleSubclassChange(cls.definition.index, e.target.value)}
                                                        >
                                                            <option value="">{cls.subclass ? cls.subclass.name : 'Select Subclass'}</option>
                                                            {(classSubclassOptions[cls.definition.index] || []).map(s => (
                                                                <option key={s.index} value={s.index}>{s.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {!canPickSubclass && (
                                                     <div className="mt-2 text-xs text-gray-500 italic">
                                                         Subclass available at level {requiredLevel}
                                                     </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                {cls.level > 1 && (
                                                    <button 
                                                        onClick={() => handleLevelDown(cls.definition.index)}
                                                        className="px-4 py-2 bg-gray-700 border border-gray-600 hover:bg-gray-600 text-white font-bold uppercase text-xs rounded transition-colors"
                                                    >
                                                        Level Down
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setWizardClassIndex(cls.definition.index)}
                                                    className="px-4 py-2 bg-blue-900/30 border border-blue-600 hover:bg-blue-800 text-blue-100 font-bold uppercase text-xs rounded transition-colors"
                                                >
                                                    Level Up
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveClass(cls.definition.index)}
                                                    className="px-4 py-2 bg-red-900/30 border border-red-600 hover:bg-red-800 text-red-100 font-bold uppercase text-xs rounded transition-colors"
                                                >
                                                    Remove Class
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-gray-700">
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Add Multiclass</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {allClasses.filter(c => !character.classes.some(existing => existing.definition.index === c.index)).map(cls => (
                                        <button 
                                            key={cls.index}
                                            onClick={() => { setWizardClassIndex(cls.index); setIsInitiation(true); }}
                                            className="p-3 bg-black/40 border border-gray-700 hover:border-dnd-gold rounded text-center text-sm font-bold text-gray-300 hover:text-white transition-all"
                                        >
                                            + {cls.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABILITIES TAB */}
                    {tab === 'abilities' && (
                        <div className="max-w-4xl mx-auto space-y-10">
                            <section>
                                <h3 className="text-sm font-bold text-dnd-gold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Ability Scores</h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {ABILITY_NAMES.map(stat => (
                                        <div key={stat} className="bg-gray-800 p-3 rounded border border-gray-700 text-center">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">{ABILITY_LABELS[stat]}</label>
                                            <input 
                                                type="number" 
                                                value={abilities[stat]} 
                                                onChange={(e) => handleAbilityChange(stat, e.target.value)}
                                                className="w-full bg-black/40 border border-gray-600 rounded py-2 text-center text-xl font-bold text-white focus:border-dnd-gold outline-none" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-dnd-gold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Feats</h3>
                                <div className="space-y-2 mb-4">
                                    {character.feats.map((feat, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-700">
                                            <div>
                                                <div className="font-bold text-white">{feat.name}</div>
                                                <div className="text-[10px] text-gray-500 line-clamp-1">{feat.desc[0]}</div>
                                            </div>
                                            <button onClick={() => handleRemoveFeat(feat.index)} className="text-red-500 hover:text-red-300 font-bold px-3">&times;</button>
                                        </div>
                                    ))}
                                    {character.feats.length === 0 && <div className="text-gray-500 italic text-sm">No feats acquired.</div>}
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        value={featToAdd} 
                                        onChange={e => setFeatToAdd(e.target.value)} 
                                        className="flex-grow bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none"
                                    >
                                        <option value="">Select Feat to Add...</option>
                                        {allFeats.map(f => <option key={f.index} value={f.index}>{f.name}</option>)}
                                    </select>
                                    <button 
                                        onClick={handleAddFeat} 
                                        disabled={!featToAdd}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase rounded text-xs disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </section>

                            <div className="pt-4 border-t border-gray-800">
                                <button onClick={saveAbilities} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors">Save Stats & Feats</button>
                            </div>
                        </div>
                    )}
                    
                    {/* PROFICIENCIES TAB */}
                    {tab === 'proficiencies' && (
                        <div className="max-w-4xl mx-auto space-y-10">
                            <section>
                                <h3 className="text-sm font-bold text-dnd-gold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Skill Proficiencies</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {SKILL_LIST.map(skill => {
                                        const isProf = skills.includes(skill.name);
                                        const isExp = expertise.includes(skill.name);
                                        
                                        return (
                                            <div 
                                                key={skill.name} 
                                                className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-colors ${isExp ? 'bg-dnd-gold/10 border-dnd-gold' : isProf ? 'bg-gray-800 border-gray-600' : 'border-transparent hover:bg-gray-800'}`}
                                                onClick={() => cycleSkill(skill.name)}
                                            >
                                                <div className={`w-4 h-4 flex items-center justify-center rounded border ${isExp ? 'border-dnd-gold bg-dnd-gold text-black' : isProf ? 'border-gray-500 bg-gray-500' : 'border-gray-600 bg-black/40'}`}>
                                                    {isExp && <span className="text-[10px] font-bold">E</span>}
                                                    {isProf && !isExp && <span className="text-[10px] font-bold text-black">✓</span>}
                                                </div>
                                                <span className={`text-sm ${isExp ? 'text-dnd-gold font-bold' : 'text-gray-300'}`}>{skill.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Racial Spell Choice (e.g. High Elf Cantrip) */}
                            {character.spells.some(s => s.sourceClassIndex === 'racial') && (
                                <section>
                                    <h3 className="text-sm font-bold text-dnd-gold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Racial Spells</h3>
                                    <div className="space-y-3">
                                        {character.spells.filter(s => s.sourceClassIndex === 'racial').map(spell => (
                                            <div key={spell.index} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                                                <div>
                                                    <div className="font-bold text-white">{spell.name}</div>
                                                    <div className="text-[10px] text-gray-500">Source: Race</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400">Change to:</span>
                                                    <select 
                                                        className="bg-black/40 border border-gray-600 rounded p-1 text-xs text-white outline-none focus:border-dnd-gold w-40"
                                                        onChange={(e) => replaceRacialSpell(spell.index, e.target.value)}
                                                        value=""
                                                    >
                                                        <option value="">Select...</option>
                                                        {wizardCantrips.map(s => (
                                                            <option key={s.index} value={s.index}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        Note: Changing a racial spell here will replace the existing one in your spellbook.
                                    </p>
                                </section>
                            )}

                            <div className="pt-4 border-t border-gray-800">
                                <button onClick={saveProficiencies} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors">Save Proficiencies</button>
                            </div>
                        </div>
                    )}

                    {/* TRACKERS TAB */}
                    {tab === 'trackers' && (
                        <div className="max-w-2xl mx-auto">
                             <div className="space-y-3 mb-8">
                                    {Object.entries(localFeatures).map(([featName, usage]: [string, any]) => (
                                        <div key={featName} className="flex items-center gap-4 bg-gray-800 p-3 rounded border border-gray-700">
                                            <div className="flex-grow">
                                                <div className="font-bold text-white">{featName}</div>
                                                <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-1">
                                                    <span>Current: {usage.current}</span>
                                                    <span className="text-gray-600">|</span>
                                                    <div className="flex items-center gap-1">
                                                        <span>Resets:</span>
                                                        <select 
                                                            value={usage.reset || 'long'} 
                                                            onChange={(e) => setLocalFeatures((prev: any) => ({
                                                                ...prev,
                                                                [featName]: { ...prev[featName], reset: e.target.value as 'short' | 'long' }
                                                            }))}
                                                            className="bg-[#0b0c0e] border border-gray-600 rounded px-1 py-0.5 text-[10px] text-white focus:border-dnd-gold outline-none uppercase font-bold"
                                                        >
                                                            <option value="short">Short</option>
                                                            <option value="long">Long</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 uppercase font-bold">Max</span>
                                                <input 
                                                    type="number" 
                                                    value={usage.max} 
                                                    onChange={(e) => setLocalFeatures((prev: any) => ({
                                                        ...prev,
                                                        [featName]: { ...prev[featName], max: parseInt(e.target.value) || 0 }
                                                    }))}
                                                    className="w-16 bg-[#0b0c0e] border border-gray-600 rounded p-1 text-center text-white focus:border-dnd-gold outline-none"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteFeature(featName)} 
                                                className="text-gray-500 hover:text-red-500 p-2" 
                                                title="Delete Tracker"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    {Object.keys(localFeatures).length === 0 && <div className="text-center text-gray-500 italic py-4">No features tracked.</div>}
                                </div>

                                <div className="bg-[#151619] p-4 rounded border border-gray-700">
                                    <h4 className="text-sm font-bold text-white mb-3 uppercase">Add New Tracker</h4>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Feature Name" 
                                            value={newFeatName} 
                                            onChange={e => setNewFeatName(e.target.value)} 
                                            className="flex-grow bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            value={newFeatMax} 
                                            onChange={e => setNewFeatMax(parseInt(e.target.value) || 0)} 
                                            className="w-20 bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none text-center"
                                        />
                                        <select 
                                            value={newFeatReset} 
                                            onChange={(e) => setNewFeatReset(e.target.value as 'short' | 'long')}
                                            className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none text-xs uppercase font-bold"
                                        >
                                            <option value="short">Short Rest</option>
                                            <option value="long">Long Rest</option>
                                        </select>
                                        <button 
                                            onClick={handleAddFeature} 
                                            disabled={!newFeatName}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold uppercase disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <button onClick={handleSaveTrackers} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors mt-8">Save Feature Changes</button>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {tab === 'settings' && (
                        <div className="max-w-lg mx-auto">
                            <h3 className="text-xl font-serif text-dnd-gold mb-4">Display & Sheet Settings</h3>
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-white uppercase">Text Size Adjustment</label>
                                        <span className="text-dnd-gold font-bold">{Math.round(fontScale * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1.0" 
                                        max="1.5" 
                                        step="0.05" 
                                        value={fontScale} 
                                        onChange={e => setFontScale(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-dnd-gold"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mt-2">
                                        <span>Default</span>
                                        <span>Large</span>
                                        <span>Extra Large</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-white uppercase block mb-2">Background Image URL</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://example.com/wallpaper.jpg"
                                        value={backgroundImageUrl} 
                                        onChange={e => setBackgroundImageUrl(e.target.value)} 
                                        className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-3 text-white focus:border-dnd-gold outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-white uppercase block mb-2">Background Color</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={backgroundColor} 
                                            onChange={e => setBackgroundColor(e.target.value)} 
                                            className="h-10 w-12 bg-transparent border-0 cursor-pointer rounded"
                                        />
                                        <input 
                                            type="text" 
                                            value={backgroundColor}
                                            onChange={e => setBackgroundColor(e.target.value)}
                                            className="flex-grow bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none uppercase"
                                            placeholder="#2b2b2b"
                                        />
                                        <button 
                                            onClick={() => setBackgroundColor('#2b2b2b')}
                                            className="text-xs uppercase font-bold text-gray-500 hover:text-white border border-gray-600 px-3 rounded"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-bold text-white uppercase block mb-2">Theme Color (Primary)</label>
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="color" 
                                                value={themeColor} 
                                                onChange={e => setThemeColor(e.target.value)} 
                                                className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                            />
                                            <button 
                                                onClick={() => setThemeColor('#c9ad6a')}
                                                className="text-[10px] uppercase font-bold text-gray-500 hover:text-dnd-gold border border-gray-600 rounded px-2 py-1"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-white uppercase block mb-2">Theme Color (Secondary)</label>
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="color" 
                                                value={themeColorSecondary} 
                                                onChange={e => setThemeColorSecondary(e.target.value)} 
                                                className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                            />
                                            <button 
                                                onClick={() => setThemeColorSecondary('#8a0b0b')}
                                                className="text-[10px] uppercase font-bold text-gray-500 hover:text-red-500 border border-gray-600 rounded px-2 py-1"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-white uppercase block mb-2">3D Dice Color</label>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            type="color" 
                                            value={diceColor} 
                                            onChange={e => setDiceColor(e.target.value)} 
                                            className="w-12 h-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                        />
                                        <button 
                                            onClick={() => setDiceColor('#c9ad6a')}
                                            className="text-[10px] uppercase font-bold text-gray-500 hover:text-dnd-gold border border-gray-600 rounded px-2 py-1"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                     <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-white uppercase">Enable 3D Dice Rolling</span>
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={show3DDice} 
                                                onChange={(e) => setShow3DDice(e.target.checked)} 
                                            />
                                            <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${show3DDice ? 'bg-dnd-gold' : 'bg-gray-600'}`}></div>
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform transform ${show3DDice ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                     </label>
                                     <p className="text-[10px] text-gray-500 mt-2">If disabled, dice rolls will only appear in the log.</p>
                                </div>

                                <button onClick={() => { onUpdate({ fontScale, backgroundImageUrl, backgroundColor, themeColor, themeColorSecondary, diceColor, show3DDice }); onClose(); }} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors mt-8">Save Settings</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCharacterModal;