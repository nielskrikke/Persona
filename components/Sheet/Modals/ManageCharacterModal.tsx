import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Activity, Shield, Settings, Plus, Trash2, Save, Languages, Palette, Type, Dice5, Eye, EyeOff, Info, Sparkles, AlertTriangle, RotateCcw } from 'lucide-react';
import { CharacterState, APIReference, RaceDetail, SubraceDetail, BackgroundDetail, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, AbilityScores, SpellDetail, LevelChoice, AbilityName } from '@/types';
import { fetchClasses, fetchRaces, fetchSubraces, fetchBackgrounds, fetchFeatsList, fetchRaceDetail, fetchSubraceDetail, fetchBackgroundDetail, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels, getLocalSpells } from '@/data/index';
import { getSpellSlots, calculateModifier, SKILL_LIST } from '@/utils/rules';
import { CLASS_FEATURES, STANDARD_LANGUAGES } from '../../../data/constants';
import LevelUpWizard from '../LevelUpWizard';
import DiceRoller3D from '../Shared/DiceRoller3D';

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
    const [tab, setTab] = useState<'identity' | 'classes' | 'abilities' | 'proficiencies' | 'trackers' | 'choices' | 'theme' | 'combat'>('identity');
    
    // Identity State
    const [name, setName] = useState(character.name);
    const [avatar, setAvatar] = useState(character.avatarUrl || '');
    const [xp, setXp] = useState(character.xp.toString());
    const [alignment, setAlignment] = useState(character.alignment);
    const [languages, setLanguages] = useState<string[]>(character.languages || []);
    const [newLangInput, setNewLangInput] = useState('');
    
    // Choices State
    const [localChoices, setLocalChoices] = useState<LevelChoice[]>(character.choices || []);
    const [localFeats, setLocalFeats] = useState<FeatDetail[]>(character.feats);
    const [localSpells, setLocalSpells] = useState<SpellDetail[]>(character.spells);
    const [localClasses, setLocalClasses] = useState(character.classes);
    const [localMaxHp, setLocalMaxHp] = useState(character.maxHp);
    const [levelDownConfirm, setLevelDownConfirm] = useState<number | null>(null);
    
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

    // Combat Overrides State
    const [combatOverrides, setCombatOverrides] = useState(character.combatOverrides || {
        hitBonus: 0,
        damageBonus: 0,
        hitOverride: null,
        damageOverride: null
    });

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

                if (character.race) {
                    const subs = await fetchSubraces(character.race.index);
                    setAllSubraces(subs);
                }

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
            setCombatOverrides(character.combatOverrides || {
                hitBonus: 0,
                damageBonus: 0,
                hitOverride: null,
                damageOverride: null
            });

            setLocalChoices(character.choices || []);
            setAbilities(character.abilities);
            setLocalFeats(character.feats);
            setLocalSpells(character.spells);
            setSkills(character.skills);
            setExpertise(character.expertise || []);
            setLocalClasses(character.classes);
            setLocalMaxHp(character.maxHp);

            // Preload subraces if race exists
            if (character.race) {
                fetchSubraces(character.race.index).then(setAllSubraces);
            }
        }
    }, [isOpen, character]);

    // Backfill logic for existing characters
    useEffect(() => {
        const backfill = async () => {
            if (isOpen && (!localChoices || localChoices.length === 0) && allRaces.length > 0 && allBackgrounds.length > 0) {
                const backfilled: LevelChoice[] = [];
                
                // Race
                if (character.race) {
                    backfilled.push({
                        id: 'initial-race',
                        level: 0,
                        source: 'Race',
                        type: 'other',
                        label: 'Race Selection',
                        value: character.race.index,
                        options: allRaces
                    });
                }
                
                // Subrace
                if (character.subrace) {
                    backfilled.push({
                        id: 'initial-subrace',
                        level: 0,
                        source: 'Subrace',
                        type: 'other',
                        label: 'Subrace Selection',
                        value: character.subrace.index,
                        options: allSubraces
                    });
                }
                
                // Background
                if (character.background) {
                    const bgRef = allBackgrounds.find(b => b.name === character.background);
                    if (bgRef) {
                        backfilled.push({
                            id: 'initial-background',
                            level: 0,
                            source: 'Background',
                            type: 'other',
                            label: 'Background Selection',
                            value: bgRef.index,
                            options: allBackgrounds
                        });
                    }
                }

                // Languages from Race
                if (character.race?.languages) {
                    const racialLangs = character.race.languages.map(l => l.name);
                    backfilled.push({
                        id: 'initial-languages',
                        level: 0,
                        source: 'Race',
                        type: 'language',
                        label: 'Racial Languages',
                        value: racialLangs,
                        options: STANDARD_LANGUAGES,
                        count: racialLangs.length
                    });
                }

                // Classes & Subclasses
                for (const cls of character.classes) {
                    for (let i = 1; i <= cls.level; i++) {
                        backfilled.push({
                            id: `level-${i}-${cls.definition.index}`,
                            level: i,
                            source: cls.definition.name,
                            type: 'other',
                            label: `Level ${i} Advancement`,
                            value: `${cls.definition.name} Level ${i}`
                        });
                    }
                    const subLvl = SUBCLASS_LEVELS[cls.definition.name] || 3;
                    if (cls.level >= subLvl) {
                        const subclasses = await fetchSubclasses(cls.definition.index);
                        backfilled.push({
                            id: `subclass-${cls.definition.index}`,
                            level: subLvl,
                            source: cls.definition.name,
                            type: 'other',
                            label: 'Subclass Selection',
                            value: cls.subclass?.index || '',
                            options: subclasses
                        });
                    }
                }

                // Feats
                character.feats.forEach((feat, idx) => {
                    backfilled.push({
                        id: `feat-backfill-${idx}`,
                        level: 0,
                        source: 'Feat',
                        type: 'feat',
                        label: 'Feat Selection',
                        value: feat.name,
                        options: allFeats
                    });
                });

                if (backfilled.length > 0) {
                    setLocalChoices(backfilled);
                }
            }
        };
        backfill();
    }, [isOpen, allRaces, allBackgrounds, allFeats, character.race, character.subrace, character.background, character.classes, character.feats]);

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

    const handleAddFeat = async () => {
        if (!featToAdd) return;
        const feat = allFeats.find(f => f.index === featToAdd);
        if (feat) {
            setLocalFeats(prev => [...prev, feat as any]);
            setFeatToAdd('');
        }
    };

    const revertChoice = (choice: LevelChoice) => {
        const data = choice.revertData;
        if (!data) return;

        if (choice.type === 'asi') {
            setAbilities(prev => {
                const next = { ...prev };
                Object.entries(data.abilities as Record<string, number>).forEach(([stat, amount]) => {
                    next[stat as keyof AbilityScores] -= amount;
                });
                return next;
            });
        } else if (choice.type === 'feat') {
            setLocalFeats(prev => prev.filter(f => f.index !== data.featIndex));
            if (data.abilities) {
                setAbilities(prev => {
                    const next = { ...prev };
                    Object.entries(data.abilities as Record<string, number>).forEach(([stat, amount]) => {
                        next[stat as keyof AbilityScores] -= amount;
                    });
                    return next;
                });
            }
            if (data.spells) {
                setLocalSpells(prev => prev.filter(s => !data.spells.includes(s.index)));
            }
            if (data.skills) {
                setSkills(prev => prev.filter(s => !data.skills.includes(s)));
            }
            if (data.expertise) {
                setExpertise(prev => prev.filter(s => !data.expertise.includes(s)));
            }
        } else if (choice.type === 'skill') {
            if (data.skills) setSkills(prev => prev.filter(s => !data.skills.includes(s)));
        } else if (choice.type === 'expertise') {
            if (data.expertise) setExpertise(prev => prev.filter(s => !data.expertise.includes(s)));
        } else if (choice.type === 'subclass') {
            setLocalClasses(prev => prev.map(c => {
                if (c.definition.index === data.classIndex) {
                    return { ...c, subclass: undefined };
                }
                return c;
            }));
        } else if (choice.type === 'other' && choice.id.startsWith('level-')) {
            setLocalClasses(prev => prev.map(c => {
                if (c.definition.index === data.classIndex) {
                    return { ...c, level: c.level - 1 };
                }
                return c;
            }).filter(c => c.level > 0));
            setLocalMaxHp(prev => prev - (data.hpIncrease || 0));
        }
    };

    const handleRevertLevel = (level: number) => {
        const choicesAtLevel = localChoices.filter(c => c.level === level);
        // Revert in reverse order
        [...choicesAtLevel].reverse().forEach(revertChoice);
        setLocalChoices(prev => prev.filter(c => c.level !== level));
        
        // If we are reverting the current level, we should also decrement the level in classes
        if (level === character.level) {
            const levelUpChoice = choicesAtLevel.find(c => c.type === 'level_up');
            if (levelUpChoice && levelUpChoice.revertData?.classIndex) {
                const classIndex = levelUpChoice.revertData.classIndex;
                setLocalClasses(prev => prev.map(c => {
                    if (c.definition.index === classIndex) {
                        return { ...c, level: Math.max(1, c.level - 1) };
                    }
                    return c;
                }));
            }
        }

        setLevelDownConfirm(null);
    };

    const handleAsiEdit = (choiceId: string, stat: string, delta: number) => {
        setLocalChoices(prev => prev.map(c => {
            if (c.id === choiceId) {
                const currentAbilities = { ...(c.revertData?.abilities || {}) };
                const currentVal = currentAbilities[stat] || 0;
                const newVal = Math.max(0, currentVal + delta);
                
                // Total increases in this ASI choice should usually be 2
                const total = Object.values(currentAbilities).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;
                if (delta > 0 && total >= 2) return c;

                const nextAbilities = { ...currentAbilities, [stat]: newVal };
                
                // Update character abilities too
                setAbilities(prevAbs => ({
                    ...prevAbs,
                    [stat]: prevAbs[stat as keyof AbilityScores] + delta
                }));

                return {
                    ...c,
                    revertData: { ...c.revertData, abilities: nextAbilities },
                    value: Object.entries(nextAbilities)
                        .filter(([_, a]) => (a as number) > 0)
                        .map(([s, a]) => `${ABILITY_LABELS[s as AbilityName]} +${a}`)
                        .join(', ')
                };
            }
            return c;
        }));
    };

    const handleRemoveFeat = (index: string) => {
        setLocalFeats(prev => prev.filter(f => f.index !== index));
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

    // Combat Overrides
    const handleCombatOverrideChange = (field: keyof NonNullable<CharacterState['combatOverrides']>, value: any) => {
        setCombatOverrides(prev => ({
            ...prev,
            [field]: value === '' ? (field.includes('Override') ? null : 0) : value
        }));
    };

    const saveCombatOverrides = () => {
        onUpdate({ combatOverrides });
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
            [newFeatName]: { max: newFeatMax, current: newFeatMax, reset: newFeatReset, hidden: false }
        }));
        setNewFeatName(''); setNewFeatMax(1);
    };

    const saveChoices = async () => {
        const updates: any = { 
            choices: localChoices,
            abilities: abilities,
            feats: localFeats,
            spells: localSpells,
            skills: skills,
            expertise: expertise,
            classes: localClasses,
            maxHp: localMaxHp,
            currentHp: Math.min(character.currentHp, localMaxHp)
        };

        // Process Race Change if varied
        if (selectedRaceIndex && selectedRaceIndex !== character.race?.index) {
            const raceDetail = await fetchRaceDetail(selectedRaceIndex);
            if (raceDetail) {
                updates.race = raceDetail;
                
                // Update racial features
                const featuresWithoutRace = (updates.classFeatures || character.classFeatures).filter(f => f.source !== 'Race');
                const newRacialFeatures = raceDetail.traits.map(t => ({
                    index: t.index,
                    name: t.name,
                    level: 1,
                    source: 'Race',
                    desc: [], // We might need to fetch trait details for full desc, but for now name is good
                    url: t.url
                }));
                updates.classFeatures = [...featuresWithoutRace, ...newRacialFeatures];
                
                // Update languages
                const langsWithoutRace = (updates.languages || character.languages || []).filter(l => !character.race?.languages.some(rl => rl.name === l));
                const newLangs = raceDetail.languages.map(l => l.name);
                updates.languages = Array.from(new Set([...langsWithoutRace, ...newLangs]));
                
                // Update proficiencies
                if (raceDetail.starting_proficiencies) {
                    const profsWithoutRace = (updates.skills || character.skills || []).filter(s => !character.race?.starting_proficiencies?.some(rp => rp.name.includes(s)));
                    const newProfs = raceDetail.starting_proficiencies
                        .filter(p => p.index.startsWith('skill-'))
                        .map(p => p.name.replace('Skill: ', ''));
                    updates.skills = Array.from(new Set([...profsWithoutRace, ...newProfs]));
                }
            }
        }

        // Process Subrace Change
        if (selectedSubraceIndex && selectedSubraceIndex !== character.subrace?.index) {
            const subDetail = await fetchSubraceDetail(selectedSubraceIndex);
            if (subDetail) {
                updates.subrace = subDetail;
                
                // Update subrace features
                const featuresWithoutSubrace = (updates.classFeatures || character.classFeatures).filter(f => f.source !== 'Subrace');
                // Subraces might have traits too, though not explicitly in the type I saw earlier. 
                // Let's check if SubraceDetail has traits.
                const newSubFeatures = (subDetail as any).racial_traits?.map((t: any) => ({
                    index: t.index,
                    name: t.name,
                    level: 1,
                    source: 'Subrace',
                    desc: [],
                    url: t.url
                })) || [];
                updates.classFeatures = [...(updates.classFeatures || character.classFeatures).filter(f => f.source !== 'Subrace'), ...newSubFeatures];
                
                // Update subrace proficiencies
                if (subDetail.starting_proficiencies) {
                    const profsWithoutSubrace = (updates.skills || character.skills || []).filter(s => !character.subrace?.starting_proficiencies?.some(sp => sp.name.includes(s)));
                    const newSubProfs = subDetail.starting_proficiencies
                        .filter(p => p.index.startsWith('skill-'))
                        .map(p => p.name.replace('Skill: ', ''));
                    updates.skills = Array.from(new Set([...(updates.skills || character.skills || []), ...newSubProfs]));
                }
            }
        } else if (!selectedSubraceIndex && character.subrace) {
            updates.subrace = null;
            updates.classFeatures = (updates.classFeatures || character.classFeatures).filter(f => f.source !== 'Subrace');
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

    const handleChoiceChange = async (choiceId: string, newValue: any) => {
        const choice = localChoices.find(c => c.id === choiceId);
        if (!choice) return;

        const oldValue = choice.value;

        // Update local state
        setLocalChoices(prev => prev.map(c => 
            c.id === choiceId ? { ...c, value: newValue } : c
        ));

        // Handle major initial choices side effects
        if (choiceId === 'initial-race') {
            const oldRaceDetail = await fetchRaceDetail(selectedRaceIndex);
            const newRaceDetail = await fetchRaceDetail(newValue);
            
            if (newRaceDetail) {
                // Adjust abilities
                setAbilities(prev => {
                    const next = { ...prev };
                    
                    // Subtract old racial bonuses
                    if (oldRaceDetail?.ability_bonuses) {
                        oldRaceDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = Math.max(0, next[stat] - b.bonus);
                        });
                    }
                    
                    // Add new racial bonuses
                    if (newRaceDetail.ability_bonuses) {
                        newRaceDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = (next[stat] || 0) + b.bonus;
                        });
                    }
                    
                    return next;
                });

                // Fetch subraces for the new race
                const subs = await fetchSubraces(newValue);
                setAllSubraces(subs);
                setSelectedRaceIndex(newValue);
                
                // Reset subrace if it's not valid for the new race
                if (selectedSubraceIndex) {
                    const oldSubDetail = await fetchSubraceDetail(selectedSubraceIndex);
                    if (oldSubDetail) {
                        setAbilities(prev => {
                            const next = { ...prev };
                            oldSubDetail.ability_bonuses.forEach(b => {
                                const stat = b.ability_score.index as keyof AbilityScores;
                                next[stat] = Math.max(0, next[stat] - b.bonus);
                            });
                            return next;
                        });
                    }
                    setSelectedSubraceIndex('');
                    setLocalChoices(prev => prev.map(c => 
                        c.id === 'initial-subrace' ? { ...c, value: '' } : c
                    ));
                }
            }
        } else if (choiceId === 'initial-subrace') {
            const oldSubDetail = selectedSubraceIndex ? await fetchSubraceDetail(selectedSubraceIndex) : null;
            const newSubDetail = newValue ? await fetchSubraceDetail(newValue) : null;
            
            setAbilities(prev => {
                const next = { ...prev };
                
                // Subtract old subrace bonuses
                if (oldSubDetail?.ability_bonuses) {
                    oldSubDetail.ability_bonuses.forEach(b => {
                        const stat = b.ability_score.index as keyof AbilityScores;
                        next[stat] = Math.max(0, next[stat] - b.bonus);
                    });
                }
                
                // Add new subrace bonuses
                if (newSubDetail?.ability_bonuses) {
                    newSubDetail.ability_bonuses.forEach(b => {
                        const stat = b.ability_score.index as keyof AbilityScores;
                        next[stat] = (next[stat] || 0) + b.bonus;
                    });
                }
                
                return next;
            });
            
            setSelectedSubraceIndex(newValue);
        } else if (choiceId === 'initial-background') {
            setSelectedBackgroundIndex(newValue);
        } else if (choiceId.startsWith('subclass-')) {
            const classIndex = choiceId.replace('subclass-', '');
            handleSubclassChange(classIndex, newValue);
        } else if (choice.type === 'feat') {
            // Update localFeats
            const oldFeatName = typeof oldValue === 'string' ? oldValue : oldValue?.name;
            const newFeat = allFeats.find(f => f.index === newValue || f.name === newValue);
            
            if (oldFeatName) {
                setLocalFeats(prev => prev.filter(f => f.name !== oldFeatName));
            }
            if (newFeat) {
                setLocalFeats(prev => [...prev, newFeat]);
            }
        } else if (choice.type === 'language') {
            // Update languages
            const oldLangs = Array.isArray(oldValue) ? oldValue : [oldValue];
            const newLangs = Array.isArray(newValue) ? newValue : [newValue];
            
            setLanguages(prev => {
                const filtered = prev.filter(l => !oldLangs.includes(l));
                return Array.from(new Set([...filtered, ...newLangs]));
            });
        }
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
                        { id: 'abilities', label: 'Custom abilities', icon: Activity },
                        { id: 'proficiencies', label: 'Proficiencies', icon: Shield },
                        { id: 'trackers', label: 'Trackers', icon: Activity },
                        { id: 'combat', label: 'Combat', icon: Shield },
                        { id: 'choices', label: 'Choices', icon: Settings },
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alignment</label>
                                    <input 
                                        type="text" 
                                        value={alignment} 
                                        onChange={e => setAlignment(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
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

                            <section className="space-y-6 pt-8 border-t border-gray-800">
                                <div className="flex items-center gap-3">
                                    <Activity size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Base Ability Scores</h3>
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

                            <div className="pt-6 border-t border-gray-800 flex justify-start">
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
                                                {cls.subclass && (
                                                    <div className="text-xs text-dnd-gold font-bold uppercase tracking-widest">
                                                        {cls.subclass.name}
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

                    {/* CUSTOM ABILITIES TAB */}
                    {tab === 'abilities' && (() => {
                        const choiceFeatNames = localChoices
                            .filter(c => c.type === 'feat')
                            .map(c => typeof c.value === 'string' ? c.value : c.value?.name);

                        const customFeats = localFeats.filter(f => !choiceFeatNames.includes(f.name));

                        const choiceLanguages = localChoices
                            .filter(c => c.type === 'language')
                            .flatMap(c => Array.isArray(c.value) ? c.value : [c.value]);

                        const customLanguages = languages.filter(l => !choiceLanguages.includes(l));

                        return (
                            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <Languages size={12} /> Custom Languages
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
                                            {customLanguages.map(lang => (
                                                <span key={lang} className="bg-dnd-gold/10 border border-dnd-gold/30 px-3 py-1.5 rounded-full text-[10px] font-black text-dnd-gold uppercase flex items-center gap-2 animate-in zoom-in duration-200">
                                                    {lang}
                                                    <button onClick={() => removeManualLanguage(lang)} className="hover:text-white transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-4">
                                        <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                            <Sparkles size={14} className="text-dnd-gold" />
                                            <h4 className="text-dnd-gold font-black uppercase tracking-[0.2em] text-[10px]">
                                                Additional Feats
                                            </h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-3">
                                                {customFeats.map((feat, i) => (
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
                                                {customFeats.length === 0 && <div className="text-gray-600 italic text-sm text-center py-4 border border-dashed border-gray-800 rounded-xl">No custom feats.</div>}
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <select 
                                                    value={featToAdd} 
                                                    onChange={e => setFeatToAdd(e.target.value)} 
                                                    className="flex-grow bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all text-xs"
                                                >
                                                    <option value="">Add Feat...</option>
                                                    {allFeats
                                                        .filter(f => !localFeats.some(lf => lf.index === f.index))
                                                        .map(f => (
                                                            <option key={f.index} value={f.index}>{f.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <button 
                                                    onClick={handleAddFeat} 
                                                    disabled={!featToAdd}
                                                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-widest rounded-xl text-[10px] disabled:opacity-30 transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="pt-8 border-t border-gray-800 flex justify-start">
                                    <button 
                                        onClick={saveAbilities} 
                                        className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                    >
                                        <Save size={14} />
                                        Save Custom Settings
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                    
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

                            <div className="pt-8 border-t border-gray-800 flex justify-start">
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

                    {/* COMBAT TAB */}
                    {tab === 'combat' && (
                        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-2 mb-6">
                                <Shield size={18} className="text-dnd-gold" />
                                <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Combat Modifiers & Overrides</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* To-Hit Modifiers */}
                                <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                        <Dice5 size={14} className="text-dnd-gold" />
                                        <h4 className="text-dnd-gold font-black uppercase tracking-[0.2em] text-[10px]">
                                            To-Hit Modifiers
                                        </h4>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Global To-Hit Bonus</label>
                                            <input 
                                                type="number" 
                                                value={combatOverrides.hitBonus} 
                                                onChange={e => handleCombatOverrideChange('hitBonus', parseInt(e.target.value) || 0)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                                placeholder="e.g. +1 from a magical effect"
                                            />
                                            <p className="text-[9px] text-gray-500 italic">Added to all attack rolls.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">To-Hit Override (Fixed Value)</label>
                                            <input 
                                                type="number" 
                                                value={combatOverrides.hitOverride ?? ''} 
                                                onChange={e => handleCombatOverrideChange('hitOverride', e.target.value === '' ? null : parseInt(e.target.value))} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                                placeholder="Leave empty for auto-calculate"
                                            />
                                            <p className="text-[9px] text-gray-500 italic">If set, this replaces the entire to-hit calculation (Ability + Prof + Bonus).</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Damage Modifiers */}
                                <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                        <Activity size={14} className="text-red-400" />
                                        <h4 className="text-red-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                            Damage Modifiers
                                        </h4>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Global Damage Bonus</label>
                                            <input 
                                                type="number" 
                                                value={combatOverrides.damageBonus} 
                                                onChange={e => handleCombatOverrideChange('damageBonus', parseInt(e.target.value) || 0)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                                placeholder="e.g. +2 from Dueling style"
                                            />
                                            <p className="text-[9px] text-gray-500 italic">Added to all damage rolls.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Damage Override (Fixed Value)</label>
                                            <input 
                                                type="number" 
                                                value={combatOverrides.damageOverride ?? ''} 
                                                onChange={e => handleCombatOverrideChange('damageOverride', e.target.value === '' ? null : parseInt(e.target.value))} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                                placeholder="Leave empty for auto-calculate"
                                            />
                                            <p className="text-[9px] text-gray-500 italic">If set, this replaces the ability modifier in damage calculations.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="pt-8 border-t border-gray-800 flex justify-start">
                                <button 
                                    onClick={saveCombatOverrides} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save Combat Settings
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
                                                <div className="flex items-center gap-3">
                                                    <div className="font-bold text-lg text-white font-serif">{featName}</div>
                                                    <button 
                                                        onClick={() => setLocalFeatures((prev: any) => ({
                                                            ...prev,
                                                            [featName]: { ...prev[featName], hidden: !prev[featName].hidden }
                                                        }))}
                                                        className={`p-1.5 rounded-lg transition-all ${usage.hidden ? 'text-gray-600 hover:text-gray-400' : 'text-dnd-gold hover:text-white'}`}
                                                        title={usage.hidden ? "Show in widget column" : "Hide from widget column"}
                                                    >
                                                        {usage.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
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

                             <div className="pt-8 border-t border-gray-800 flex justify-start">
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

                    {/* CHOICES TAB */}
                    {tab === 'choices' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-serif text-white">Character Choices</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Review and modify decisions made during character creation and leveling</p>
                                </div>
                            </div>

                            {/* Core Identity Section */}
                            <section className="bg-black/40 border border-gray-800 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <User size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Core Identity</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Race</label>
                                        <select 
                                            value={selectedRaceIndex}
                                            onChange={(e) => handleChoiceChange('initial-race', e.target.value)}
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                        >
                                            <option value="">Select Race...</option>
                                            {allRaces.map(r => (
                                                <option key={r.index} value={r.index}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subrace</label>
                                        <select 
                                            value={selectedSubraceIndex}
                                            onChange={(e) => handleChoiceChange('initial-subrace', e.target.value)}
                                            disabled={allSubraces.length === 0}
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all disabled:opacity-30"
                                        >
                                            <option value="">{allSubraces.length === 0 ? 'No Subraces Available' : 'Select Subrace...'}</option>
                                            {allSubraces.map(s => (
                                                <option key={s.index} value={s.index}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Racial Spell Choice */}
                            {character.spells.some(s => s.sourceClassIndex === 'racial') && (
                                <section className="bg-black/40 border border-gray-800 rounded-3xl p-8 space-y-6">
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

                            {/* Ability Score Totals & Breakdown */}
                            <section className="bg-black/40 border border-gray-800 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                    <Activity size={18} className="text-dnd-gold" />
                                    <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Ability Score Totals</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {ABILITY_NAMES.map(stat => {
                                        const total = abilities[stat];
                                        const mod = calculateModifier(total);
                                        
                                        const contributors = [];
                                        if (character.race) {
                                            const raceBonus = character.race.ability_bonuses?.find(b => b.ability_score.index === stat);
                                            if (raceBonus) contributors.push({ name: character.race.name, bonus: raceBonus.bonus });
                                        }
                                        if (character.subrace) {
                                            const subraceBonus = character.subrace.ability_bonuses?.find(b => b.ability_score.index === stat);
                                            if (subraceBonus) contributors.push({ name: character.subrace.name, bonus: subraceBonus.bonus });
                                        }
                                        localChoices.forEach(c => {
                                            if (c.type === 'asi' && c.revertData?.abilities?.[stat]) {
                                                contributors.push({ name: `ASI (Lvl ${c.level === 0 ? 'Init' : c.level})`, bonus: c.revertData.abilities[stat] });
                                            }
                                            if (c.type === 'feat' && c.value?.ability_bonuses) {
                                                const featBonus = c.value.ability_bonuses.find((b: any) => b.ability_score.index === stat);
                                                if (featBonus) contributors.push({ name: c.value.name, bonus: featBonus.bonus });
                                            }
                                        });
                                        localFeats.forEach(f => {
                                            if ((f as any).ability_bonuses) {
                                                const featBonus = (f as any).ability_bonuses.find((b: any) => b.ability_score.index === stat);
                                                if (featBonus) contributors.push({ name: f.name, bonus: featBonus.bonus });
                                            }
                                        });

                                        return (
                                            <div key={stat} className="bg-black/20 p-4 rounded-2xl border border-gray-800 flex flex-col items-center">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{ABILITY_LABELS[stat]}</span>
                                                <div className="text-3xl font-serif font-bold text-white leading-none">{total}</div>
                                                <div className={`text-[10px] font-black uppercase mt-1 ${mod >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {mod >= 0 ? `+${mod}` : mod}
                                                </div>
                                                <div className="mt-3 w-full space-y-1 border-t border-gray-800/50 pt-2">
                                                    {contributors.map((c, i) => (
                                                        <div key={i} className="flex justify-between items-center text-[8px] text-gray-500">
                                                            <span className="truncate max-w-[50px]">{c.name}</span>
                                                            <span className="font-bold text-gray-400">+{c.bonus}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {(!localChoices || localChoices.length === 0) ? (
                                <div className="bg-black/20 border border-dashed border-gray-800 rounded-2xl p-12 text-center">
                                    <div className="text-4xl mb-4 opacity-20">📋</div>
                                    <p className="text-gray-500 italic">No recorded choices found for this character.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Group by level */}
                                    {Array.from(new Set(localChoices.map(c => c.level))).sort((a, b) => a - b).map(level => (
                                        <div key={level} className="bg-black/20 border border-gray-800 rounded-2xl overflow-hidden">
                                            <div className="bg-black/40 px-6 py-3 border-b border-gray-800 flex justify-between items-center">
                                                <h4 className="text-dnd-gold font-black uppercase tracking-[0.2em] text-[10px]">
                                                    {level === 0 ? 'Initial Creation' : `Level ${level}`}
                                                </h4>
                                                {level > 0 && level === Math.max(...localChoices.map(c => c.level)) && (
                                                    <button 
                                                        onClick={() => setLevelDownConfirm(level)}
                                                        className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-800 hover:bg-red-900/40 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <RotateCcw size={12} />
                                                        Level Down
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-6 space-y-6">
                                                {localChoices.filter(c => c.level === level).map(choice => (
                                                    <div key={choice.id} className="border-l-2 border-gray-800 pl-6 py-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{choice.source}</span>
                                                                <h5 className="text-white font-bold text-sm">{choice.label}</h5>
                                                            </div>
                                                            <div className="text-[8px] bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded uppercase font-black tracking-tighter border border-gray-700">
                                                                {choice.type}
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            {/* Choice Input Logic */}
                                                            {choice.type === 'asi' ? (
                                                                <div className="grid grid-cols-3 gap-2 max-w-md">
                                                                    {ABILITY_NAMES.map(stat => {
                                                                        const currentVal = choice.revertData?.abilities?.[stat] || 0;
                                                                        return (
                                                                            <div key={stat} className="flex flex-col items-center bg-black/40 border border-gray-800 rounded-xl p-2">
                                                                                <span className="text-[8px] font-black text-gray-500 uppercase mb-1">{ABILITY_LABELS[stat].substring(0, 3)}</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <button 
                                                                                        onClick={() => handleAsiEdit(choice.id, stat, -1)}
                                                                                        className="w-5 h-5 flex items-center justify-center bg-gray-800 rounded text-xs hover:bg-gray-700"
                                                                                    >-</button>
                                                                                    <span className="text-sm font-bold text-white">{currentVal}</span>
                                                                                    <button 
                                                                                        onClick={() => handleAsiEdit(choice.id, stat, 1)}
                                                                                        className="w-5 h-5 flex items-center justify-center bg-gray-800 rounded text-xs hover:bg-gray-700"
                                                                                    >+</button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : choice.type === 'other' && choice.id.startsWith('level-') ? (
                                                                <div className="space-y-3">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {character.classFeatures
                                                                            .filter(f => f.level === choice.level && f.source === choice.source)
                                                                            .map(f => (
                                                                                <div key={f.name} className="group relative">
                                                                                    <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-[10px] font-bold border border-blue-800/50 cursor-help">
                                                                                        {f.name}
                                                                                    </span>
                                                                                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 text-[10px] text-gray-300 leading-relaxed">
                                                                                        {f.desc}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                    {(() => {
                                                                        const cls = character.classes.find(c => c.definition.name === choice.source);
                                                                        if (cls && cls.definition.spellcasting) {
                                                                            // We can't easily show "newly unlocked" without the full table, 
                                                                            // but we can show the class features which often include spellcasting improvements.
                                                                            return null;
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </div>
                                                            ) : (!choice.options || choice.options.length === 0) ? (
                                                                <span className="text-white font-bold text-sm">{String(choice.value)}</span>
                                                            ) : (
                                                                <>
                                                                    {choice.count && choice.count > 1 ? (
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {choice.options.map((opt: any) => {
                                                                                const optValue = opt.index || opt.name || opt;
                                                                                const optLabel = opt.name || opt;
                                                                                const selectedValues = Array.isArray(choice.value) ? choice.value : [choice.value];
                                                                                const isSelected = selectedValues.includes(optValue);
                                                                                
                                                                                return (
                                                                                    <button
                                                                                        key={optValue}
                                                                                        onClick={() => {
                                                                                            let nextValues;
                                                                                            if (isSelected) {
                                                                                                nextValues = selectedValues.filter(v => v !== optValue);
                                                                                            } else {
                                                                                                if (selectedValues.length < (choice.count || 1)) {
                                                                                                    nextValues = [...selectedValues, optValue];
                                                                                                } else {
                                                                                                    nextValues = [...selectedValues.slice(1), optValue];
                                                                                                }
                                                                                            }
                                                                                            handleChoiceChange(choice.id, nextValues);
                                                                                        }}
                                                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${
                                                                                            isSelected 
                                                                                                ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg shadow-dnd-gold/10' 
                                                                                                : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                                                                                        }`}
                                                                                    >
                                                                                        {optLabel}
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <select
                                                                            value={Array.isArray(choice.value) ? (choice.value[0]?.index || choice.value[0]?.name || (typeof choice.value[0] === 'object' ? '' : choice.value[0]) || '') : (choice.value?.index || choice.value?.name || (typeof choice.value === 'object' ? '' : choice.value) || '')}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                const selectedOpt = choice.options?.find(o => (o.index || o.name || o) === val);
                                                                                handleChoiceChange(choice.id, selectedOpt || val);
                                                                            }}
                                                                            className="w-full max-w-md bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                        >
                                                                            <option value="">Select...</option>
                                                                            {choice.options.map((opt: any) => (
                                                                                <option key={opt.index || opt.name || opt} value={opt.index || opt.name || opt}>
                                                                                    {opt.name || opt}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Additional Feats Section Removed from here */}
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-800 flex justify-start">
                                <button 
                                    onClick={saveChoices} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Save Choices
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

                            <div className="pt-8 border-t border-gray-800 flex justify-start">
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
            {/* Level Down Confirmation Modal */}
            {levelDownConfirm !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-red-900/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border border-red-900/30">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-white">Revert Level {levelDownConfirm}?</h3>
                                <p className="text-gray-400 text-sm">
                                    This will permanently revert all choices made at level {levelDownConfirm}, including ability score increases, feats, and class features. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-4 w-full pt-4">
                                <button 
                                    onClick={() => setLevelDownConfirm(null)}
                                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-widest rounded-xl text-xs transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleRevertLevel(levelDownConfirm)}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Revert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCharacterModal;