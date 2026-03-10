import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Activity, Shield, Settings, Plus, Trash2, Save, Languages, Palette, Type, Dice5, Eye, Info, Sparkles } from 'lucide-react';
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
    const [tab, setTab] = useState<'identity' | 'classes' | 'abilities' | 'proficiencies' | 'trackers' | 'theme'>('identity');
    
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
        <div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-gray-800 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif text-white">Manage Character</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Refine your hero's identity, abilities, and appearance
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 py-1 bg-[#16171a] border-b border-gray-800 flex flex-wrap gap-2">
                    {[
                        { id: 'identity', label: 'Identity', icon: User },
                        { id: 'classes', label: 'Classes', icon: GraduationCap },
                        { id: 'abilities', label: 'Abilities', icon: Activity },
                        { id: 'proficiencies', label: 'Proficiencies', icon: Shield },
                        { id: 'trackers', label: 'Trackers', icon: Activity },
                        { id: 'theme', label: 'Theme', icon: Palette }
                    ].map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setTab(t.id as any)} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                tab === t.id 
                                    ? 'bg-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            <t.icon size={14} />
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 bg-[#1b1c20]">
                    
                    {/* IDENTITY TAB */}
                    {tab === 'identity' && (
                        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Character Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Avatar URL</label>
                                    <input 
                                        type="text" 
                                        value={avatar} 
                                        onChange={e => setAvatar(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Race</label>
                                    <select 
                                        value={selectedRaceIndex} 
                                        onChange={e => handleRaceChange(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                                    >
                                        {allRaces.map(r => <option key={r.index} value={r.index}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subrace</label>
                                    <select 
                                        value={selectedSubraceIndex} 
                                        onChange={e => setSelectedSubraceIndex(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all disabled:opacity-30"
                                        disabled={loadingSubraces || allSubraces.length === 0}
                                    >
                                        <option value="">{allSubraces.length > 0 ? 'Select Subrace' : 'None Available'}</option>
                                        {allSubraces.map(s => <option key={s.index} value={s.index}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Background</label>
                                    <select 
                                        value={selectedBackgroundIndex} 
                                        onChange={e => setSelectedBackgroundIndex(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                                    >
                                        <option value="">Select Background</option>
                                        {allBackgrounds.map(b => <option key={b.index} value={b.index}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alignment</label>
                                    <input 
                                        type="text" 
                                        value={alignment} 
                                        onChange={e => setAlignment(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="md:col-span-2 bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <Languages size={12} /> Languages Known
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-grow relative">
                                            <input 
                                                type="text" 
                                                list="standard-languages-manage"
                                                value={newLangInput} 
                                                onChange={e => setNewLangInput(e.target.value)} 
                                                placeholder="Add custom language..."
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-dnd-gold/50 transition-all"
                                                onKeyDown={e => e.key === 'Enter' && addManualLanguage()}
                                            />
                                            <datalist id="standard-languages-manage">
                                                {STANDARD_LANGUAGES.map(l => <option key={l} value={l} />)}
                                            </datalist>
                                        </div>
                                        <button 
                                            onClick={addManualLanguage} 
                                            className="px-6 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold uppercase text-white transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {languages.map(lang => (
                                            <span key={lang} className="bg-dnd-gold/10 border border-dnd-gold/30 px-3 py-1.5 rounded-full text-[10px] font-black text-dnd-gold uppercase flex items-center gap-2 animate-in zoom-in duration-200">
                                                {lang}
                                                <button onClick={() => removeManualLanguage(lang)} className="hover:text-white transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {languages.length === 0 && <span className="text-gray-600 italic text-xs">No languages recorded. Add 'Common' or others.</span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Experience Points</label>
                                    <input 
                                        type="number" 
                                        value={xp} 
                                        onChange={e => setXp(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-800 flex justify-end">
                                <button 
                                    onClick={saveIdentity} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save Identity
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CLASSES TAB */}
                    {tab === 'classes' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="space-y-4">
                                {character.classes.map((cls, idx) => {
                                    const requiredLevel = SUBCLASS_LEVELS[cls.definition.name] || 3;
                                    const canPickSubclass = cls.level >= requiredLevel;

                                    return (
                                        <div key={idx} className="bg-black/20 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-gray-700 transition-all">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-serif text-white">{cls.definition.name}</h3>
                                                    <span className="bg-dnd-gold/10 px-3 py-1 rounded-full text-xs font-black text-dnd-gold border border-dnd-gold/20">Level {cls.level}</span>
                                                </div>
                                                {canPickSubclass && (
                                                    <div className="flex items-center gap-3">
                                                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Subclass</label>
                                                        <select 
                                                            className="bg-black/40 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-dnd-gold/50 transition-all"
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
                                                     <div className="text-xs text-gray-500 italic flex items-center gap-2">
                                                         <Info size={14} />
                                                         Subclass available at level {requiredLevel}
                                                     </div>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 shrink-0">
                                                {cls.level > 1 && (
                                                    <button 
                                                        onClick={() => handleLevelDown(cls.definition.index)}
                                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all"
                                                    >
                                                        Level Down
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setWizardClassIndex(cls.definition.index)}
                                                    className="px-4 py-2 bg-blue-900/20 border border-blue-800 hover:border-blue-500 text-blue-400 font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all"
                                                >
                                                    Level Up
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveClass(cls.definition.index)}
                                                    className="px-4 py-2 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 text-red-400 font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-8 border-t border-gray-800">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Add Multiclass</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {allClasses.filter(c => !character.classes.some(existing => existing.definition.index === c.index)).map(cls => (
                                        <button 
                                            key={cls.index}
                                            onClick={() => { setWizardClassIndex(cls.index); setIsInitiation(true); }}
                                            className="p-4 bg-black/20 border border-gray-800 hover:border-dnd-gold/50 rounded-xl text-center text-sm font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <Plus size={16} className="text-gray-600 group-hover:text-dnd-gold transition-colors" />
                                            {cls.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABILITIES TAB */}
                    {tab === 'abilities' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Activity size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Ability Scores</h3>
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {ABILITY_NAMES.map(stat => (
                                        <div key={stat} className="bg-black/20 p-4 rounded-2xl border border-gray-800 text-center space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">{ABILITY_LABELS[stat]}</label>
                                            <input 
                                                type="number" 
                                                value={abilities[stat]} 
                                                onChange={(e) => handleAbilityChange(stat, e.target.value)}
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 text-center text-2xl font-serif font-bold text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Sparkles size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Feats</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {character.feats.map((feat, i) => (
                                        <div key={i} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-gray-800 group hover:border-gray-700 transition-all">
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-white truncate">{feat.name}</div>
                                                <div className="text-[10px] text-gray-500 line-clamp-1 italic">{feat.desc[0]}</div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveFeat(feat.index)} 
                                                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {character.feats.length === 0 && <div className="col-span-2 text-gray-600 italic text-sm text-center py-8 border border-dashed border-gray-800 rounded-2xl">No feats acquired.</div>}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <select 
                                        value={featToAdd} 
                                        onChange={e => setFeatToAdd(e.target.value)} 
                                        className="flex-grow bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                                    >
                                        <option value="">Select Feat to Add...</option>
                                        {allFeats.map(f => <option key={f.index} value={f.index}>{f.name}</option>)}
                                    </select>
                                    <button 
                                        onClick={handleAddFeat} 
                                        disabled={!featToAdd}
                                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-widest rounded-xl text-xs disabled:opacity-30 transition-all"
                                    >
                                        Add
                                    </button>
                                </div>
                            </section>

                            <div className="pt-8 border-t border-gray-800 flex justify-end">
                                <button 
                                    onClick={saveAbilities} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save Stats & Feats
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* PROFICIENCIES TAB */}
                    {tab === 'proficiencies' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Shield size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Skill Proficiencies</h3>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {SKILL_LIST.map(skill => {
                                        const isProf = skills.includes(skill.name);
                                        const isExp = expertise.includes(skill.name);
                                        
                                        return (
                                            <div 
                                                key={skill.name} 
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                                                    isExp ? 'bg-dnd-gold/10 border-dnd-gold shadow-lg shadow-dnd-gold/5' : 
                                                    isProf ? 'bg-gray-800/50 border-gray-700' : 
                                                    'bg-black/20 border-gray-800 hover:border-gray-700 hover:bg-black/30'
                                                }`}
                                                onClick={() => cycleSkill(skill.name)}
                                            >
                                                <div className={`w-6 h-6 flex items-center justify-center rounded-lg border transition-all ${
                                                    isExp ? 'border-dnd-gold bg-dnd-gold text-black' : 
                                                    isProf ? 'border-gray-500 bg-gray-500 text-black' : 
                                                    'border-gray-700 bg-black/40'
                                                }`}>
                                                    {isExp && <span className="text-[10px] font-black">E</span>}
                                                    {isProf && !isExp && <span className="text-[10px] font-black">✓</span>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold ${isExp ? 'text-dnd-gold' : isProf ? 'text-white' : 'text-gray-400'}`}>
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-[8px] uppercase font-black text-gray-600 tracking-widest">
                                                        {skill.ability.substring(0, 3)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Racial Spell Choice */}
                            {character.spells.some(s => s.sourceClassIndex === 'racial') && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                        <Sparkles size={18} className="text-dnd-gold" />
                                        <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Racial Spells</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {character.spells.filter(s => s.sourceClassIndex === 'racial').map(spell => (
                                            <div key={spell.index} className="flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-gray-800">
                                                <div>
                                                    <div className="font-bold text-white text-lg font-serif">{spell.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Source: Race</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-gray-500 font-bold italic">Change to:</span>
                                                    <select 
                                                        className="bg-black/40 border border-gray-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-dnd-gold/50 transition-all w-48"
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
                                    <p className="text-[10px] text-gray-600 italic flex items-center gap-2">
                                        <Info size={14} />
                                        Note: Changing a racial spell here will replace the existing one in your spellbook.
                                    </p>
                                </section>
                            )}

                            <div className="pt-8 border-t border-gray-800 flex justify-end">
                                <button 
                                    onClick={saveProficiencies} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save Proficiencies
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TRACKERS TAB */}
                    {tab === 'trackers' && (
                        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                             <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-2 mb-6">
                                        <Activity size={18} className="text-dnd-gold" />
                                        <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Active Trackers</h3>
                                    </div>
                                    {Object.entries(localFeatures).map(([featName, usage]: [string, any]) => (
                                        <div key={featName} className="flex flex-col sm:flex-row items-center gap-6 bg-black/20 p-6 rounded-2xl border border-gray-800 group hover:border-gray-700 transition-all">
                                            <div className="flex-grow">
                                                <div className="font-bold text-lg text-white font-serif">{featName}</div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Max Uses:</span>
                                                        <span className="text-sm font-bold text-white">{usage.max}</span>
                                                    </div>
                                                    <div className="h-3 w-px bg-gray-800" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Resets:</span>
                                                        <select 
                                                            value={usage.reset || 'long'} 
                                                            onChange={(e) => setLocalFeatures((prev: any) => ({
                                                                ...prev,
                                                                [featName]: { ...prev[featName], reset: e.target.value as 'short' | 'long' }
                                                            }))}
                                                            className="bg-black/40 border border-gray-700 rounded-lg px-2 py-1 text-[10px] text-white focus:border-dnd-gold/50 outline-none uppercase font-black tracking-widest transition-all"
                                                        >
                                                            <option value="short">Short Rest</option>
                                                            <option value="long">Long Rest</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteFeature(featName)}
                                                className="p-3 bg-red-900/10 text-red-400 hover:bg-red-900/20 rounded-xl transition-all border border-red-900/20"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {Object.keys(localFeatures).length === 0 && (
                                        <div className="text-gray-600 italic text-sm text-center py-12 border border-dashed border-gray-800 rounded-3xl">
                                            No custom trackers defined.
                                        </div>
                                    )}
                             </div>

                             <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Plus size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Add New Tracker</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Feature Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Ki Points, Superiority Dice" 
                                            value={newFeatName} 
                                            onChange={e => setNewFeatName(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Max Uses</label>
                                            <input 
                                                type="number" 
                                                value={newFeatMax} 
                                                onChange={e => setNewFeatMax(parseInt(e.target.value) || 1)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reset On</label>
                                            <select 
                                                value={newFeatReset} 
                                                onChange={e => setNewFeatReset(e.target.value as any)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                                            >
                                                <option value="short">Short Rest</option>
                                                <option value="long">Long Rest</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddFeature} 
                                    disabled={!newFeatName}
                                    className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-widest rounded-xl text-xs disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Tracker
                                </button>
                             </div>

                             <div className="pt-8 border-t border-gray-800 flex justify-end">
                                <button 
                                    onClick={handleSaveTrackers} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save All Trackers
                                </button>
                             </div>
                        </div>
                    )}

                    {/* THEME TAB */}
                    {tab === 'theme' && (
                        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <section className="space-y-8">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Palette size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Visual Theme</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Type size={12} /> UI Font Scale
                                        </label>
                                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-gray-800">
                                            <input 
                                                type="range" min="0.8" max="1.5" step="0.05" 
                                                value={fontScale} 
                                                onChange={e => setFontScale(parseFloat(e.target.value))} 
                                                className="flex-grow accent-dnd-gold"
                                            />
                                            <span className="text-sm font-bold text-white min-w-[3rem] text-right">{Math.round(fontScale * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Dice5 size={12} /> 3D Dice Settings
                                        </label>
                                        <button 
                                            onClick={() => setShow3DDice(!show3DDice)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                show3DDice ? 'bg-blue-900/10 border-blue-800 text-blue-400' : 'bg-black/20 border-gray-800 text-gray-500'
                                            }`}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">Enable 3D Dice</span>
                                            <div className={`w-10 h-5 rounded-full relative transition-all ${show3DDice ? 'bg-blue-600' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${show3DDice ? 'left-6' : 'left-1'}`} />
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Palette size={12} /> Background Color
                                        </label>
                                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-gray-800">
                                            <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <input type="text" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="flex-grow bg-transparent text-xs font-mono text-gray-400 uppercase outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Sparkles size={12} /> Primary Theme Color
                                        </label>
                                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-gray-800">
                                            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <input type="text" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="flex-grow bg-transparent text-xs font-mono text-gray-400 uppercase outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Palette size={12} /> Secondary Theme Color
                                        </label>
                                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-gray-800">
                                            <input type="color" value={themeColorSecondary} onChange={e => setThemeColorSecondary(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <input type="text" value={themeColorSecondary} onChange={e => setThemeColorSecondary(e.target.value)} className="flex-grow bg-transparent text-xs font-mono text-gray-400 uppercase outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Dice5 size={12} /> 3D Dice Color
                                        </label>
                                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-gray-800">
                                            <input type="color" value={diceColor} onChange={e => setDiceColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <input type="text" value={diceColor} onChange={e => setDiceColor(e.target.value)} className="flex-grow bg-transparent text-xs font-mono text-gray-400 uppercase outline-none" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Eye size={12} /> Background Image URL
                                        </label>
                                        <input 
                                            type="text" 
                                            value={backgroundImageUrl} 
                                            onChange={e => setBackgroundImageUrl(e.target.value)} 
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="pt-8 border-t border-gray-800 flex justify-end">
                                <button 
                                    onClick={() => {
                                        onUpdate({
                                            fontScale,
                                            backgroundImageUrl,
                                            backgroundColor,
                                            themeColor,
                                            themeColorSecondary,
                                            diceColor,
                                            show3DDice
                                        });
                                        onClose();
                                    }} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Apply All Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCharacterModal;