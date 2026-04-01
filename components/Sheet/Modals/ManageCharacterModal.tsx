import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Activity, Shield, Settings, Plus, Trash2, Save, Languages, Palette, Type, Dice5, Eye, EyeOff, Info, Sparkles, AlertTriangle, RotateCcw, AlertCircle } from 'lucide-react';
import { CharacterState, APIReference, RaceDetail, SubraceDetail, BackgroundDetail, FeatDetail, ABILITY_NAMES, ABILITY_LABELS, AbilityScores, SpellDetail, LevelChoice, AbilityName } from '@/types';
import { fetchClasses, fetchRaces, fetchSubraces, fetchBackgrounds, fetchFeatsList, fetchRaceDetail, fetchSubraceDetail, fetchBackgroundDetail, fetchSubclasses, fetchSubclassDetail, fetchSubclassLevels, fetchClassLevels, getLocalSpells, fetchLevelFeatures, fetchClassDetail, fetchAllSpells } from '@/data/index';
import { getSpellSlots, calculateModifier, SKILL_LIST } from '@/utils/rules';
import { CLASS_FEATURES, STANDARD_LANGUAGES, ARTISAN_TOOLS } from '../../../data/constants';
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
    
    const [expandedChoices, setExpandedChoices] = useState<string[]>([]);
    
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
    const [localClassFeatures, setLocalClassFeatures] = useState(character.classFeatures);
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

    // Abilities State
    const [abilities, setAbilities] = useState<AbilityScores>({...character.abilities});
    const [featToAdd, setFeatToAdd] = useState('');

    // Proficiencies State
    const [skills, setSkills] = useState<string[]>([...character.skills]);
    const [expertise, setExpertise] = useState<string[]>([...(character.expertise || [])]);
    const [toolProficiencies, setToolProficiencies] = useState<string[]>([...(character.toolProficiencies || [])]);
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
            setToolProficiencies([...(character.toolProficiencies || [])]);
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
            setLocalFeats(character.feats || []);
            setLocalSpells(character.spells || []);
            setLocalClasses(character.classes || []);
            setLocalMaxHp(character.maxHp || 10);

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
                    const classIndex = cls.definition.index;
                    const sourceName = cls.definition.name;

                    for (let i = 1; i <= cls.level; i++) {
                        // Level Advancement
                        backfilled.push({
                            id: `level-${i}-${classIndex}`,
                            level: i,
                            source: sourceName,
                            type: 'other',
                            label: `Level ${i} Advancement`,
                            value: `${sourceName} Level ${i}`,
                            revertData: { classIndex, hpIncrease: 0 } // Backfill assumes HP already added
                        });

                        // Subclass
                        const subLvl = SUBCLASS_LEVELS[sourceName] || 3;
                        if (i === subLvl) {
                            const subclasses = await fetchSubclasses(classIndex);
                            backfilled.push({
                                id: `subclass-${classIndex}-${i}`,
                                level: i,
                                source: sourceName,
                                type: 'subclass',
                                label: 'Subclass Selection',
                                value: cls.subclass?.index || '',
                                options: subclasses,
                                revertData: { classIndex }
                            });
                        }

                        // ASI/Feat
                        const isAsiLevel = [4, 8, 12, 16, 19].includes(i);
                        if (isAsiLevel) {
                            backfilled.push({
                                id: `asi-feat-${i}-${classIndex}`,
                                level: i,
                                source: sourceName,
                                type: 'asi-feat',
                                label: 'Ability Score Improvement or Feat',
                                value: 'asi',
                                revertData: { classIndex, abilities: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } }
                            });
                        }
                    }
                }

                // Feats
                character.feats.forEach((feat, idx) => {
                    backfilled.push({
                        id: `feat-backfill-${idx}`,
                        level: 0,
                        source: 'Feat',
                        type: 'feat-selection',
                        label: 'Feat Selection',
                        value: feat.index || feat.name.toLowerCase().replace(/\s+/g, '-'),
                        options: allFeats,
                        revertData: { featIndex: feat.index }
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
    const handleDirectLevelUp = async (classIndex: string, isInitiation: boolean = false) => {
        const classDetail = await fetchClassDetail(classIndex);
        if (!classDetail) return;

        const existingClass = localClasses.find(c => c.definition.index === classIndex);
        const nextLevel = existingClass ? existingClass.level + 1 : 1;
        const sourceName = classDetail.name;

        // 1. Add Level Choice
        const hpIncrease = Math.floor(classDetail.hit_die / 2) + 1 + calculateModifier(abilities.con);
        const levelChoice: LevelChoice = {
            id: `level-${nextLevel}-${classIndex}`,
            level: nextLevel,
            source: sourceName,
            type: 'Level Advancement',
            label: `Level ${nextLevel} Advancement`,
            value: `${sourceName} Level ${nextLevel}`,
            revertData: { classIndex, hpIncrease }
        };

        const newChoices = [...localChoices, levelChoice];

        // 2. Fetch features for this level to identify choices
        const levelFeatures = await fetchLevelFeatures(classIndex, nextLevel);
        
        // 3. Check for Subclass
        const requiredSubclassLevel = SUBCLASS_LEVELS[sourceName] || 3;
        const needsSubclass = levelFeatures.some((f: any) => 
            /subclass|archetype|domain|origin|college|circle|oath|tradition|patron|specialist|club|path/i.test(f.name)
        ) || (isInitiation && ['cleric', 'warlock', 'sorcerer'].includes(classIndex));

        if (needsSubclass && (!existingClass || !existingClass.subclass)) {
            const subs = await fetchSubclasses(classIndex);
            newChoices.push({
                id: `subclass-${classIndex}-${nextLevel}`,
                level: nextLevel,
                source: sourceName,
                type: 'subclass',
                label: 'Subclass Selection',
                value: '',
                options: subs,
                revertData: { classIndex }
            });
        }

        // 4. Check for ASI/Feat
        const isAsiLevel = levelFeatures.some((f: any) => f.name === 'Ability Score Improvement') || [4, 8, 12, 16, 19].includes(nextLevel);
        if (isAsiLevel) {
            newChoices.push({
                id: `asi-feat-${nextLevel}-${classIndex}`,
                level: nextLevel,
                source: sourceName,
                type: 'asi-feat',
                label: 'Ability Score Improvement or Feat',
                value: 'asi', // Default to ASI
                revertData: { classIndex, abilities: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } }
            });
        }

        // 5. Check for Feature Choices (Fighting Style, etc.)
        levelFeatures.forEach((f: any, fIdx: number) => {
            if (f.effects) {
                f.effects.forEach((eff: any, eIdx: number) => {
                    if (eff.type === 'expertise_choice' || eff.type === 'proficiency_choice' || eff.type === 'feature_choice') {
                        newChoices.push({
                            id: `choice-${nextLevel}-${classIndex}-${fIdx}-${eIdx}`,
                            level: nextLevel,
                            source: f.name,
                            type: eff.type === 'expertise_choice' ? 'expertise' : 
                                  (eff.category === 'language' ? 'language' : 
                                   eff.category === 'skill' ? 'skill' : 'feature_choice'),
                            label: f.name,
                            value: eff.count && eff.count > 1 ? [] : '',
                            options: eff.options || (eff.category === 'language' ? STANDARD_LANGUAGES : []),
                            count: eff.count || 1,
                            revertData: { classIndex }
                        });
                    }
                });
            }
        });

        // 6. Update state
        setLocalChoices(newChoices);
        setLocalMaxHp(prev => prev + hpIncrease);
        
        if (isInitiation) {
            setLocalClasses(prev => [...prev, {
                level: 1,
                definition: classDetail,
                subclass: null
            }]);
        } else {
            setLocalClasses(prev => prev.map(c => 
                c.definition.index === classIndex ? { ...c, level: c.level + 1 } : c
            ));
        }

        // Add new features to local features
        setLocalClassFeatures(prev => [...prev, ...levelFeatures.map((f: any) => ({
            ...f,
            level: nextLevel,
            source: sourceName
        }))]);

        setTab('choices');
    };

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


    const handleSubclassChange = async (classIndex: string, subclassIndex: string) => {
        if (!subclassIndex) return;
        const clsDef = localClasses.find(c => c.definition.index === classIndex);
        if (!clsDef) return;

        const newSubclass = await fetchSubclassDetail(subclassIndex);
        if (!newSubclass) return;

        // Update Local Classes
        const updatedClasses = localClasses.map(c => 
            c.definition.index === classIndex ? { ...c, subclass: newSubclass } : c
        );
        setLocalClasses(updatedClasses);

        // Update Local Features: Remove old subclass features, add new ones up to current level
        const oldSubclassName = clsDef.subclass?.name;
        let updatedFeatures = localClassFeatures.filter(f => f.source !== oldSubclassName);
        
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

        setLocalClassFeatures(updatedFeatures);

        // Auto-inject layout if Artificer companions are unlocked
        if (classIndex === 'artificer' && clsDef.level >= 3) {
            const currentLayout = character.layout || { left: [], right: [], mobile: [] };
            if (subclassIndex === 'artillerist') {
                if (!currentLayout.right.includes('eldritchCannon') && !currentLayout.left.includes('eldritchCannon')) {
                    setCombatOverrides(prev => ({
                        ...prev,
                        layout: { ...currentLayout, right: [...currentLayout.right, 'eldritchCannon'] }
                    }));
                }
            } else if (subclassIndex === 'battle-smith') {
                if (!currentLayout.right.includes('steelDefender') && !currentLayout.left.includes('steelDefender')) {
                    setCombatOverrides(prev => ({
                        ...prev,
                        layout: { ...currentLayout, right: [...currentLayout.right, 'steelDefender'] }
                    }));
                }
            }
        }
    };

    const loadSubclasses = async (classIndex: string) => {
        if (!classSubclassOptions[classIndex]) {
            const subs = await fetchSubclasses(classIndex);
            setClassSubclassOptions(prev => ({ ...prev, [classIndex]: subs }));
        }
    };

    // Global Save Helper
    const getGlobalUpdates = () => ({
        name,
        avatarUrl: avatar,
        xp: parseInt(xp) || 0, 
        alignment,
        languages,
        abilities,
        feats: localFeats,
        skills,
        expertise,
        toolProficiencies,
        featureUsage: localFeatures,
        fontScale,
        backgroundImageUrl,
        backgroundColor,
        themeColor,
        themeColorSecondary,
        diceColor,
        show3DDice,
        combatOverrides,
        choices: localChoices,
        spells: localSpells,
        classes: localClasses,
        classFeatures: localClassFeatures,
        maxHp: localMaxHp,
        level: localClasses.reduce((sum, c) => sum + c.level, 0)
    });

    const handleSave = () => {
        onUpdate({
            ...getGlobalUpdates(),
            currentHp: Math.min(character.currentHp, localMaxHp)
        });
        onClose();
    };

    // Save All Identity Changes
    const saveIdentity = async () => {
        handleSave();
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
        if (feat && !localFeats.some(lf => lf.index === feat.index)) {
            setLocalFeats(prev => [...prev, feat as any]);
            setFeatToAdd('');
        }
    };

    const revertChoiceInternal = (choice: LevelChoice, temp: any) => {
        const data = choice.revertData;
        if (!data) return;

        if (choice.type === 'asi' || choice.type === 'asi-feat') {
            if (data.abilities) {
                Object.entries(data.abilities as Record<string, number>).forEach(([stat, amount]) => {
                    temp.abilities[stat as keyof AbilityScores] -= amount;
                });
            }
            if (data.featIndex) {
                temp.feats = temp.feats.filter((f: any) => f.index !== data.featIndex && f.name !== data.featIndex);
            }
            if (data.featAbilities) {
                Object.entries(data.featAbilities as Record<string, number>).forEach(([stat, amount]) => {
                    temp.abilities[stat as keyof AbilityScores] -= amount;
                });
            }
        } else if (choice.type === 'feat' || choice.type === 'feat-selection') {
            const featIndex = data.featIndex || (typeof choice.value === 'string' ? choice.value : null);
            if (featIndex) {
                temp.feats = temp.feats.filter((f: any) => f.index !== featIndex && f.name !== featIndex);
            }
            if (data.abilities) {
                Object.entries(data.abilities as Record<string, number>).forEach(([stat, amount]) => {
                    temp.abilities[stat as keyof AbilityScores] -= amount;
                });
            }
            if (data.spells) {
                temp.spells = temp.spells.filter((s: any) => !data.spells.includes(s.index) && !data.spells.includes(s.name));
            }
            if (data.skills) {
                temp.skills = temp.skills.filter((s: string) => !data.skills.includes(s));
            }
            if (data.expertise) {
                temp.expertise = temp.expertise.filter((s: string) => !data.expertise.includes(s));
            }
        } else if (choice.type === 'skill') {
            const skillsToRemove = data.skills || (Array.isArray(choice.value) ? choice.value : [choice.value]);
            temp.skills = temp.skills.filter((s: string) => !skillsToRemove.includes(s));
        } else if (choice.type === 'expertise') {
            const expertiseToRemove = data.expertise || (Array.isArray(choice.value) ? choice.value : [choice.value]);
            temp.expertise = temp.expertise.filter((s: string) => !expertiseToRemove.includes(s));
        } else if (choice.type === 'language') {
            const langsToRemove = data.languages || (Array.isArray(choice.value) ? choice.value : [choice.value]);
            temp.languages = temp.languages.filter((l: string) => !langsToRemove.includes(l));
        } else if ((choice.type === 'other' || choice.type === 'Level Advancement') && choice.id.startsWith('level-')) {
            if (data.classIndex) {
                temp.classes = temp.classes.map((c: any) => {
                    if (c.definition.index === data.classIndex) {
                        return { ...c, level: Math.max(0, c.level - 1) };
                    }
                    return c;
                }).filter((c: any) => c.level > 0);
                
                temp.maxHp -= (data.hpIncrease || 0);
            }
        } else if (choice.type === 'other' || choice.type === 'feature_choice') {
            const toolsToRemove = data.toolProficiencies || (Array.isArray(choice.value) ? choice.value : [choice.value]);
            if (toolsToRemove) {
                temp.toolProficiencies = temp.toolProficiencies.filter((t: string) => !toolsToRemove.includes(t));
            }
        } else if (choice.type === 'subclass') {
            const classIndex = data.classIndex;
            if (classIndex) {
                temp.classes = temp.classes.map((c: any) => 
                    c.definition.index === classIndex ? { ...c, subclass: undefined } : c
                );
            }
        } else if (choice.type === 'spell') {
            const spellsToRemove = Array.isArray(choice.value) ? choice.value : [choice.value];
            temp.spells = temp.spells.filter((s: any) => !spellsToRemove.includes(s.name) && !spellsToRemove.includes(s.index));
        }
    };

    const revertChoices = (choices: LevelChoice[]) => {
        const temp = {
            abilities: { ...abilities },
            feats: [...localFeats],
            spells: [...localSpells],
            skills: [...skills],
            expertise: [...expertise],
            toolProficiencies: [...toolProficiencies],
            languages: [...languages],
            classes: [...localClasses],
            maxHp: localMaxHp
        };

        [...choices].reverse().forEach(choice => revertChoiceInternal(choice, temp));

        setAbilities(temp.abilities);
        setLocalFeats(temp.feats);
        setLocalSpells(temp.spells);
        setSkills(temp.skills);
        setExpertise(temp.expertise);
        setToolProficiencies(temp.toolProficiencies);
        setLanguages(temp.languages);
        setLocalClasses(temp.classes);
        setLocalMaxHp(temp.maxHp);
    };

    const revertChoice = (choice: LevelChoice) => {
        revertChoices([choice]);
    };

    const handleRevertSingleChoice = (choiceId: string) => {
        const choice = localChoices.find(c => c.id === choiceId);
        if (!choice) return;
        
        // Find children sub-choices recursively
        const findChildren = (parentId: string): LevelChoice[] => {
            const children = localChoices.filter(c => c.revertData?.parentChoiceId === parentId);
            return [...children, ...children.flatMap(c => findChildren(c.id))];
        };

        const subChoices = findChildren(choiceId);
        
        // Revert all including children (revertChoices handles the reverse order)
        revertChoices([choice, ...subChoices]);
        
        // Update localChoices: set parent to null, remove children
        setLocalChoices(prev => {
            const childIds = new Set(subChoices.map(s => s.id));
            const filtered = prev.filter(c => !childIds.has(c.id));
            return filtered.map(c => 
                c.id === choiceId ? { ...c, value: null } : c
            );
        });
    };

    const handleRevertLevel = (level: number) => {
        const choicesAtLevel = localChoices.filter(c => c.level === level);
        
        const temp = {
            abilities: { ...abilities },
            feats: [...localFeats],
            spells: [...localSpells],
            skills: [...skills],
            expertise: [...expertise],
            toolProficiencies: [...toolProficiencies],
            languages: [...languages],
            classes: [...localClasses],
            maxHp: localMaxHp
        };

        // 1. Revert all choices at this level in reverse order
        [...choicesAtLevel].reverse().forEach(choice => revertChoiceInternal(choice, temp));

        // 2. Update all states at once
        setAbilities(temp.abilities);
        setLocalFeats(temp.feats);
        setLocalSpells(temp.spells);
        setSkills(temp.skills);
        setExpertise(temp.expertise);
        setToolProficiencies(temp.toolProficiencies);
        setLanguages(temp.languages);
        setLocalClasses(temp.classes);
        setLocalMaxHp(temp.maxHp);

        // 3. Remove the choices from local state
        const updatedChoices = localChoices.filter(c => c.level !== level);
        setLocalChoices(updatedChoices);

        // 4. Cleanup features for the new levels and update trackers
        const updatedFeatures = { ...localFeatures };
        setLocalClassFeatures(prev => prev.filter(f => {
            const cls = temp.classes.find(c => c.definition.name === f.source || c.subclass?.name === f.source);
            if (cls) {
                if (f.level > cls.level) return false;
                return true;
            }
            return true;
        }));

        // Sync featureUsage (trackers) with new levels
        Object.keys(updatedFeatures).forEach(featName => {
            // Find the class that provides this feature
            const sourceClass = temp.classes.find(c => {
                const def = CLASS_FEATURES[c.definition.name];
                if (def && def.name === featName) return true;
                const subDef = c.subclass ? CLASS_FEATURES[c.subclass.name] : null;
                if (subDef && subDef.name === featName) return true;
                
                // Special case for Paladin Channel Divinity
                if (featName === 'Channel Divinity' && c.definition.name === 'Paladin') return true;
                
                return false;
            });
            
            if (!sourceClass) {
                delete updatedFeatures[featName];
            } else {
                // Find the definition again to get the formula
                const classFeatureDef = Object.values(CLASS_FEATURES).find(f => f.name === featName);
                if (classFeatureDef) {
                    const max = classFeatureDef.formula(sourceClass.level, temp.abilities);
                    if (max <= 0) {
                        delete updatedFeatures[featName];
                    } else {
                        updatedFeatures[featName] = {
                            ...updatedFeatures[featName],
                            max: max,
                            current: Math.min(updatedFeatures[featName].current, max)
                        };
                    }
                }
            }
        });
        setLocalFeatures(updatedFeatures);
        setLevelDownConfirm(null);
        
        // Auto-save after destructive action like level down
        handleSave();
    };

    const handleAsiEdit = (choiceId: string, stat: string, delta: number) => {
        setLocalChoices(prev => prev.map(c => {
            if (c.id === choiceId) {
                const currentAbilities = { ...(c.revertData?.abilities || {}) };
                const currentVal = currentAbilities[stat] || 0;
                const newVal = Math.max(0, currentVal + delta);
                
                if (newVal === currentVal) return c;

                // Total increases in this ASI choice should usually be 2
                const total = Object.values(currentAbilities).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;
                if (delta > 0 && total >= 2) return c;

                const nextAbilities = { ...currentAbilities, [stat]: newVal };
                const nextTotal = Object.values(nextAbilities).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;
                
                // Update character abilities too
                setAbilities(prevAbs => ({
                    ...prevAbs,
                    [stat]: prevAbs[stat as keyof AbilityScores] + delta
                }));

                return {
                    ...c,
                    revertData: { ...c.revertData, abilities: nextAbilities },
                    value: nextTotal >= 2 
                        ? Object.entries(nextAbilities)
                            .filter(([_, a]) => (a as number) > 0)
                            .map(([s, a]) => `${ABILITY_LABELS[s as AbilityName]} +${a}`)
                            .join(', ')
                        : null
                };
            }
            return c;
        }));
    };

    const handleRemoveFeat = (index: string) => {
        setLocalFeats(prev => prev.filter(f => f.index !== index));
    };

    const saveAbilities = () => {
        handleSave();
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

        setLocalSpells(prev => prev.map(s => {
            if (s.index === oldSpellIndex && s.sourceClassIndex === 'racial') {
                return { ...newSpell, sourceClassIndex: 'racial', isPrepared: true };
            }
            return s;
        }));
    };

    const saveProficiencies = () => {
        handleSave();
    };

    // Combat Overrides
    const handleCombatOverrideChange = (field: keyof NonNullable<CharacterState['combatOverrides']>, value: any) => {
        setCombatOverrides(prev => ({
            ...prev,
            [field]: value === '' ? (field.includes('Override') ? null : 0) : value
        }));
    };

    const saveCombatOverrides = () => {
        handleSave();
    };

    // Trackers
    const handleSaveTrackers = () => {
        handleSave();
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
            ...getGlobalUpdates(),
            currentHp: Math.min(character.currentHp, localMaxHp)
        };

        // 1. Race & Traits
        if (selectedRaceIndex && selectedRaceIndex !== character.race?.index) {
            const raceDetail = await fetchRaceDetail(selectedRaceIndex);
            if (raceDetail) {
                updates.race = raceDetail;
                const featuresWithoutRace = localClassFeatures.filter(f => f.source !== 'Race');
                const newRacialFeatures = raceDetail.traits.map(t => ({
                    index: t.index,
                    name: t.name,
                    level: 1,
                    source: 'Race',
                    desc: t.desc || [],
                    url: t.url
                }));
                updates.classFeatures = [...featuresWithoutRace, ...newRacialFeatures];
            }
        }

        // 2. Subrace & Traits
        if (selectedSubraceIndex && selectedSubraceIndex !== character.subrace?.index) {
            const subDetail = await fetchSubraceDetail(selectedSubraceIndex);
            if (subDetail) {
                updates.subrace = subDetail;
                const featuresWithoutSubrace = (updates.classFeatures || localClassFeatures).filter(f => f.source !== 'Subrace');
                const newSubFeatures = (subDetail as any).racial_traits?.map((t: any) => ({
                    index: t.index,
                    name: t.name,
                    level: 1,
                    source: 'Subrace',
                    desc: t.desc || [],
                    url: t.url
                })) || [];
                updates.classFeatures = [...featuresWithoutSubrace, ...newSubFeatures];
            }
        } else if (!selectedSubraceIndex && character.subrace) {
            updates.subrace = null;
            updates.classFeatures = (updates.classFeatures || localClassFeatures).filter(f => f.source !== 'Subrace');
        }

        // 3. Background & Features
        const bgRef = allBackgrounds.find(b => b.index === selectedBackgroundIndex);
        if (bgRef && bgRef.name !== character.background) {
            const bgDetail = await fetchBackgroundDetail(bgRef.index);
            if (bgDetail) {
                updates.background = bgDetail.name;
                const featsWithoutBg = (updates.classFeatures || localClassFeatures).filter(f => f.source !== 'Background');
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

    const toggleChoiceExpansion = (id: string) => {
        setExpandedChoices(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Handle Choice Change with Side Effects
    const handleChoiceChange = async (choiceId: string, newValue: any) => {
        const choice = localChoices.find(c => c.id === choiceId);
        if (!choice) return;

        const oldValue = choice.value;
        const count = choice.count || 1;
        const isMulti = count > 1;

        let finalValue = newValue;
        if (isMulti) {
            const currentArray = Array.isArray(oldValue) ? oldValue : [];
            if (currentArray.includes(newValue)) {
                finalValue = currentArray.filter(v => v !== newValue);
            } else if (currentArray.length < count) {
                finalValue = [...currentArray, newValue];
            } else {
                // Already at max, do nothing or replace last?
                // Usually we just don't add.
                return;
            }
        } else if (oldValue === newValue) {
            // Toggle off for single select
            finalValue = null;
        }

        // Update local choices state
        const skipImmediateValue = ['asi-feat', 'subclass', 'feat-selection'].includes(choice.type);
        setLocalChoices(prev => prev.map(c => 
            c.id === choiceId ? { ...c, value: skipImmediateValue ? c.value : finalValue } : c
        ));

        if (choice.type === 'subclass') {
            const subclassDetail = typeof finalValue === 'string' ? choice.options?.find((o: any) => o.index === finalValue) : finalValue;
            if (subclassDetail) {
                setLocalClasses(prev => prev.map(c => 
                    c.definition.index === choice.revertData.classIndex ? { ...c, subclass: subclassDetail } : c
                ));
                
                // Fetch and add subclass features
                const subLevels = await fetchSubclassLevels(subclassDetail.index);
                const currentLevel = localClasses.find(c => c.definition.index === choice.revertData.classIndex)?.level || 1;
                const newSubFeatures = subLevels
                    .filter(l => l.level <= currentLevel)
                    .flatMap(l => l.features.map(f => ({
                        ...f,
                        level: l.level,
                        source: subclassDetail.name,
                        desc: f.desc || []
                    })));
                
                setLocalClassFeatures(prev => {
                    const filtered = prev.filter(f => f.source !== subclassDetail.name);
                    return [...filtered, ...newSubFeatures];
                });
            }
        }

        if (choice.type === 'asi-feat' || choice.type === 'asi') {
            if (finalValue === 'asi') {
                // If switching back to ASI, we might need to remove the feat if one was selected
                if (choice.revertData?.featIndex) {
                    setLocalFeats(prev => prev.filter(f => f.index !== choice.revertData.featIndex));
                    // Also remove any sub-choices from that feat
                    const subChoices = localChoices.filter(c => c.revertData?.parentChoiceId === choiceId);
                    revertChoices(subChoices);
                    setLocalChoices(prev => prev.filter(c => c.revertData?.parentChoiceId !== choiceId));
                    // Also need to revert any ASI from the feat
                    if (choice.revertData.featAbilities) {
                        setAbilities(prev => {
                            const next = { ...prev };
                            Object.entries(choice.revertData.featAbilities).forEach(([stat, val]) => {
                                next[stat as keyof AbilityScores] -= (val as number);
                            });
                            return next;
                        });
                    }
                }
                setLocalChoices(prev => prev.map(c => 
                    c.id === choiceId ? { 
                        ...c, 
                        value: null, // Keep as null until ASI is spent
                        revertData: { ...c.revertData, mode: 'asi', featIndex: null, featAbilities: null, abilities: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } } 
                    } : c
                ));
            } else if (newValue === 'feat') {
                // If switching to Feat, revert any ASI points spent
                if (choice.revertData?.abilities) {
                    setAbilities(prev => {
                        const next = { ...prev };
                        Object.entries(choice.revertData.abilities).forEach(([stat, val]) => {
                            next[stat as keyof AbilityScores] -= (val as number);
                        });
                        return next;
                    });
                }
                setLocalChoices(prev => prev.map(c => 
                    c.id === choiceId ? { 
                        ...c, 
                        value: null, // Keep as null until feat is selected
                        revertData: { ...c.revertData, mode: 'feat', abilities: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } } 
                    } : c
                ));
            } else {
                // This is a feat selection within an asi-feat choice
                const featDetail = allFeats.find(f => f.index === newValue);
                if (featDetail || newValue === '') {
                    if (choice.revertData?.featIndex) {
                        setLocalFeats(prev => prev.filter(f => f.index !== choice.revertData.featIndex));
                    // Remove sub-choices from old feat
                    const subChoices = localChoices.filter(c => c.revertData?.parentChoiceId === choiceId);
                    revertChoices(subChoices);
                    setLocalChoices(prev => prev.filter(c => c.revertData?.parentChoiceId !== choiceId));
                    }
                    if (featDetail) {
                        setLocalFeats(prev => {
                            if (prev.some(f => f.index === featDetail.index)) return prev;
                            return [...prev, featDetail];
                        });
                        
                        // Handle sub-choices from feat
                        if (featDetail.effects) {
                            const allSpells = await fetchAllSpells();
                            const newSubChoices = featDetail.effects
                                .filter(e => e.type.endsWith('_choice') || e.type === 'spell_access')
                                .map((e, idx) => {
                                    let options: any[] = [];
                                    if (e.options) {
                                        options = e.options;
                                    } else if (e.type === 'proficiency_choice') {
                                        if (e.category === 'language') options = STANDARD_LANGUAGES;
                                        else if (e.category === 'skill') options = SKILL_LIST.map(s => s.name);
                                        else if (e.category === 'tool') options = ARTISAN_TOOLS;
                                    } else if (e.type === 'spell_access') {
                                        let filtered = allSpells;
                                        if (e.filter_class) {
                                            const classSpells = getLocalSpells(e.filter_class);
                                            const classSpellIndices = new Set(classSpells.map(s => s.index));
                                            filtered = filtered.filter(s => classSpellIndices.has(s.index));
                                        }
                                        if (e.level !== undefined) {
                                            filtered = filtered.filter(s => s.level === e.level);
                                        }
                                        if (e.school) {
                                            const schools = e.school.split('/').map(s => s.trim().toLowerCase());
                                            filtered = filtered.filter(s => schools.includes(s.school.name.toLowerCase()));
                                        }
                                        options = filtered.map(s => ({ index: s.index, name: s.name }));
                                    }

                                    return {
                                        id: `feat-${featDetail.index}-${idx}-${Date.now()}`,
                                        level: choice.level,
                                        source: `${choice.source} (${featDetail.name})`,
                                        type: (e.type === 'asi_choice' ? 'asi' : 
                                               e.type === 'proficiency_choice' ? (e.category === 'skill' ? 'skill' : e.category === 'language' ? 'language' : 'other') :
                                               e.type === 'expertise_choice' ? 'expertise' :
                                               e.type === 'spell_access' ? 'spell' : 'other') as LevelChoice['type'],
                                        label: `${featDetail.name}: ${e.name || (e.type === 'spell_access' ? (e.level === 0 ? 'Cantrip' : '1st-level Spell') : e.type.replace('_', ' '))}`,
                                        value: null,
                                        options: options,
                                        count: e.count || 1,
                                        revertData: { parentChoiceId: choiceId, featIndex: featDetail.index }
                                    };
                                });
                            if (newSubChoices.length > 0) {
                                setLocalChoices(prev => [...prev, ...newSubChoices]);
                            }
                        }
                    }
                    setLocalChoices(prev => prev.map(c => 
                        c.id === choiceId ? { 
                            ...c, 
                            value: null, // Keep as null until confirmed
                            revertData: { ...c.revertData, mode: 'feat', featIndex: newValue || null } 
                        } : c
                    ));
                }
            }
            return;
        }

        if (choice.type === 'feat-selection') {
            const featDetail = allFeats.find(f => f.index === newValue);
            if (featDetail) {
                // Remove old feat if any
                if (choice.revertData.featIndex) {
                    setLocalFeats(prev => prev.filter(f => f.index !== choice.revertData.featIndex));
                    const subChoices = localChoices.filter(c => c.revertData?.parentChoiceId === choiceId);
                    revertChoices(subChoices);
                    setLocalChoices(prev => prev.filter(c => c.revertData?.parentChoiceId !== choiceId));
                }
                setLocalFeats(prev => {
                    if (prev.some(f => f.index === featDetail.index)) return prev;
                    return [...prev, featDetail];
                });
                setLocalChoices(prev => prev.map(c => 
                    c.id === choiceId ? { ...c, value: null, revertData: { ...c.revertData, featIndex: newValue } } : c
                ));
            }
        }

        if (choiceId === 'initial-race') {
            const oldRaceDetail = await fetchRaceDetail(oldValue);
            const newRaceDetail = await fetchRaceDetail(newValue);
            
            if (newRaceDetail) {
                // 1. Abilities
                setAbilities(prev => {
                    const next = { ...prev };
                    if (oldRaceDetail?.ability_bonuses) {
                        oldRaceDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = Math.max(0, next[stat] - b.bonus);
                        });
                    }
                    if (newRaceDetail.ability_bonuses) {
                        newRaceDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = (next[stat] || 0) + b.bonus;
                        });
                    }
                    return next;
                });

                // 2. Languages
                setLanguages(prev => {
                    const oldLangs = oldRaceDetail?.languages.map(l => l.name) || [];
                    const newLangs = newRaceDetail.languages.map(l => l.name);
                    const filtered = prev.filter(l => !oldLangs.includes(l));
                    return Array.from(new Set([...filtered, ...newLangs]));
                });

                // 3. Skills
                setSkills(prev => {
                    const oldProfs = oldRaceDetail?.starting_proficiencies?.filter(p => p.index.startsWith('skill-')).map(p => p.name.replace('Skill: ', '')) || [];
                    const newProfs = newRaceDetail.starting_proficiencies?.filter(p => p.index.startsWith('skill-')).map(p => p.name.replace('Skill: ', '')) || [];
                    const filtered = prev.filter(s => !oldProfs.includes(s));
                    return Array.from(new Set([...filtered, ...newProfs]));
                });

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

                const subs = await fetchSubraces(newValue);
                setAllSubraces(subs);
            }
        } else if (choiceId === 'initial-subrace') {
            const oldSubDetail = selectedSubraceIndex ? await fetchSubraceDetail(selectedSubraceIndex) : null;
            const newSubDetail = newValue ? await fetchSubraceDetail(newValue) : null;
            
            if (newSubDetail || oldSubDetail) {
                setAbilities(prev => {
                    const next = { ...prev };
                    if (oldSubDetail?.ability_bonuses) {
                        oldSubDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = Math.max(0, next[stat] - b.bonus);
                        });
                    }
                    if (newSubDetail?.ability_bonuses) {
                        newSubDetail.ability_bonuses.forEach(b => {
                            const stat = b.ability_score.index as keyof AbilityScores;
                            next[stat] = (next[stat] || 0) + b.bonus;
                        });
                    }
                    return next;
                });

                // Subrace Skills/Languages could be added here if needed
            }
            
            setSelectedSubraceIndex(newValue);
        } else if (choiceId === 'initial-background') {
            const oldBgDetail = selectedBackgroundIndex ? await fetchBackgroundDetail(selectedBackgroundIndex) : null;
            const newBgDetail = newValue ? await fetchBackgroundDetail(newValue) : null;

            if (newBgDetail) {
                // 1. Skills
                setSkills(prev => {
                    const oldProfs = oldBgDetail?.skill_proficiencies || [];
                    const newProfs = newBgDetail.skill_proficiencies || [];
                    const filtered = prev.filter(s => !oldProfs.includes(s));
                    return Array.from(new Set([...filtered, ...newProfs]));
                });

                // 2. Languages
                // Backgrounds often give a number of languages to choose, 
                // but some give specific ones. For now we'll just handle specific ones if they exist.
                
                setSelectedBackgroundIndex(newValue);
            }
        } else if (choiceId.startsWith('subclass-')) {
            setLocalChoices(prev => prev.map(c => 
                c.id === choiceId ? { ...c, revertData: { ...c.revertData, featIndex: newValue } } : c
            ));
        } else if (choice.type === 'feat') {
            const oldFeatName = typeof oldValue === 'string' ? oldValue : oldValue?.name;
            const newFeat = allFeats.find(f => f.index === newValue || f.name === newValue);
            
            if (oldFeatName) {
                setLocalFeats(prev => prev.filter(f => f.name !== oldFeatName));
                // Remove sub-choices from old feat
                const subChoices = localChoices.filter(c => c.revertData?.parentChoiceId === choiceId);
                revertChoices(subChoices);
                setLocalChoices(prev => prev.filter(c => c.revertData?.parentChoiceId !== choiceId));
            }
            if (newFeat) {
                setLocalFeats(prev => [...prev, newFeat]);
                // Handle sub-choices from feat
                if (newFeat.effects) {
                    const allSpells = await fetchAllSpells();
                    const newSubChoices = newFeat.effects
                        .filter(e => e.type.endsWith('_choice') || e.type === 'spell_access')
                        .map((e, idx) => {
                            let options: any[] = [];
                            if (e.options) {
                                options = e.options;
                            } else if (e.type === 'proficiency_choice') {
                                if (e.category === 'language') options = STANDARD_LANGUAGES;
                                else if (e.category === 'skill') options = SKILL_LIST.map(s => s.name);
                                else if (e.category === 'tool') options = ARTISAN_TOOLS;
                            } else if (e.type === 'spell_access') {
                                let filtered = allSpells;
                                if (e.filter_class) {
                                    const classSpells = getLocalSpells(e.filter_class);
                                    const classSpellIndices = new Set(classSpells.map(s => s.index));
                                    filtered = filtered.filter(s => classSpellIndices.has(s.index));
                                }
                                if (e.level !== undefined) {
                                    filtered = filtered.filter(s => s.level === e.level);
                                }
                                if (e.school) {
                                    const schools = e.school.split('/').map(s => s.trim().toLowerCase());
                                    filtered = filtered.filter(s => schools.includes(s.school.name.toLowerCase()));
                                }
                                options = filtered.map(s => ({ index: s.index, name: s.name }));
                            }

                            return {
                                id: `feat-${newFeat.index}-${idx}-${Date.now()}`,
                                level: choice.level,
                                source: `${choice.source} (${newFeat.name})`,
                                type: (e.type === 'asi_choice' ? 'asi' : 
                                       e.type === 'proficiency_choice' ? (e.category === 'skill' ? 'skill' : e.category === 'language' ? 'language' : 'other') :
                                       e.type === 'expertise_choice' ? 'expertise' :
                                       e.type === 'spell_access' ? 'spell' : 'other') as LevelChoice['type'],
                                label: `${newFeat.name}: ${e.name || (e.type === 'spell_access' ? (e.level === 0 ? 'Cantrip' : '1st-level Spell') : e.type.replace('_', ' '))}`,
                                value: null,
                                options: options,
                                count: e.count || 1,
                                revertData: { parentChoiceId: choiceId, featIndex: newFeat.index }
                            };
                        });
                    if (newSubChoices.length > 0) {
                        setLocalChoices(prev => [...prev, ...newSubChoices]);
                    }
                }
            }
            setLocalChoices(prev => prev.map(c => 
                c.id === choiceId ? { ...c, value: newValue, revertData: { ...c.revertData, featIndex: newValue } } : c
            ));
        } else if (choice.type === 'language') {
            const oldLangs = Array.isArray(oldValue) ? oldValue : [oldValue];
            const newLangs = Array.isArray(finalValue) ? finalValue : [finalValue];
            
            setLanguages(prev => {
                const filtered = prev.filter(l => !oldLangs.includes(l));
                return Array.from(new Set([...filtered, ...newLangs]));
            });
        } else if (choice.type === 'skill') {
            const oldSkills = Array.isArray(oldValue) ? oldValue : [oldValue];
            const newSkills = Array.isArray(finalValue) ? finalValue : [finalValue];
            
            setSkills(prev => {
                const filtered = prev.filter(s => !oldSkills.includes(s));
                return Array.from(new Set([...filtered, ...newSkills]));
            });
        } else if (choice.type === 'other' || choice.type === 'feature_choice') {
            if (choice.label.toLowerCase().includes('tool')) {
                const oldTools = Array.isArray(oldValue) ? oldValue : [oldValue];
                const newTools = Array.isArray(finalValue) ? finalValue : [finalValue];
                setToolProficiencies(prev => {
                    const filtered = prev.filter(t => !oldTools.includes(t));
                    return Array.from(new Set([...filtered, ...newTools]));
                });
            }
        } else if (choice.type === 'expertise') {
            const oldExpertise = Array.isArray(oldValue) ? oldValue : [oldValue];
            const newExpertise = Array.isArray(finalValue) ? finalValue : [finalValue];
            
            setExpertise(prev => {
                const filtered = prev.filter(e => !oldExpertise.includes(e));
                return Array.from(new Set([...filtered, ...newExpertise]));
            });
        } else if (choice.type === 'spell') {
            const oldValue = choice.value;
            const oldSpells = Array.isArray(oldValue) ? oldValue : [oldValue];
            const newSpells = Array.isArray(finalValue) ? finalValue : [finalValue];
            const allSpells = await fetchAllSpells();
            
            setLocalSpells(prev => {
                // Filter out old spells by index OR name (for backward compatibility)
                const filtered = prev.filter(s => !oldSpells.includes(s.index) && !oldSpells.includes(s.name));
                // Add new spells by index OR name
                const addedSpells = allSpells.filter(s => newSpells.includes(s.index) || newSpells.includes(s.name));
                return [...filtered, ...addedSpells];
            });
        }
    };

    const handleConfirmChoice = (choiceId: string) => {
        const choice = localChoices.find(c => c.id === choiceId);
        if (!choice) return;

        let finalValue: any = null;
        if (choice.type === 'asi-feat' || choice.type === 'asi') {
            if (choice.revertData?.mode === 'asi') {
                const abilities = choice.revertData.abilities;
                const total = Object.values(abilities).reduce((a: number, b: number) => a + b, 0);
                if (total === 0) return;
                finalValue = Object.entries(abilities)
                    .filter(([_, v]) => (v as number) > 0)
                    .map(([s, v]) => `${ABILITY_LABELS[s as AbilityName]} +${v}`)
                    .join(', ');
            } else if (choice.revertData?.mode === 'feat') {
                const feat = allFeats.find(f => f.index === choice.revertData.featIndex);
                if (!feat) return;
                finalValue = `Feat: ${feat.name}`;
            }
        } else if (choice.type === 'subclass' || choice.type === 'feat-selection') {
            const featIndex = choice.revertData?.featIndex || choice.value;
            if (!featIndex) return;
            
            if (choice.type === 'subclass') {
                const classIndex = choice.id.replace('subclass-', '');
                handleSubclassChange(classIndex, featIndex);
                finalValue = featIndex;
            } else {
                finalValue = featIndex;
            }
        } else if (Array.isArray(choice.value)) {
            if (choice.value.length === (choice.count || 1)) {
                // Already has enough selections, just "confirming" current state
                finalValue = choice.value;
            }
        }

        if (finalValue) {
            setLocalChoices(prev => prev.map(c => 
                c.id === choiceId ? { ...c, value: finalValue } : c
            ));
        }
    };

    // Render Logic
    if (!isOpen) return null;

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
                    ].map(t => {
                        const hasPending = t.id === 'choices' && localChoices.some(c => (c.value === null || c.value === undefined || (Array.isArray(c.value) && c.value.length === 0)) && c.type !== 'Level Advancement');
                        return (
                            <button 
                                key={t.id}
                                onClick={() => setTab(t.id as any)} 
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                                    tab === t.id 
                                        ? 'bg-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <t.icon size={14} />
                                {t.label}
                                {hasPending && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-dnd-red rounded-full border-2 border-[#16171a] animate-pulse" />
                                )}
                            </button>
                        );
                    })}
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

                            <div className="pt-6 border-t border-gray-800 flex justify-start hidden">
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
                                {character.classes.map((cls) => {
                                    const requiredLevel = SUBCLASS_LEVELS[cls.definition.name] || 3;
                                    const canPickSubclass = cls.level >= requiredLevel;

                                    return (
                                        <div key={cls.definition.index} className="bg-black/20 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-gray-700 transition-all">
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
                                                <button 
                                                    onClick={() => handleDirectLevelUp(cls.definition.index)}
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
                                            onClick={() => handleDirectLevelUp(cls.index, true)}
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
                        const choiceFeatIdentifiers = localChoices
                            .filter(c => ['feat', 'asi-feat', 'feat-selection'].includes(c.type))
                            .map(c => {
                                if (c.type === 'asi-feat') return c.revertData?.featIndex;
                                if (c.type === 'feat-selection') return c.revertData?.featIndex || (typeof c.value === 'string' ? c.value : c.value?.index);
                                return typeof c.value === 'string' ? c.value : c.value?.index || c.value?.name;
                            })
                            .filter(Boolean);

                        // Deduplicate localFeats by index to prevent duplicate key errors
                        const uniqueLocalFeats = Array.from(new Map(localFeats.map(f => [f.index, f])).values());

                        const customFeats = uniqueLocalFeats.filter(f => 
                            !choiceFeatIdentifiers.includes(f.index) && 
                            !choiceFeatIdentifiers.includes(f.name)
                        );

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
                                                {customFeats.map((feat) => (
                                                    <div key={feat.index} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-gray-800 group hover:border-gray-700 transition-all">
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

                            <div className="pt-8 border-t border-gray-800 flex justify-start hidden">
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

                            <div className="pt-8 border-t border-gray-800 flex justify-start hidden">
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
                            {localSpells.some(s => s.sourceClassIndex === 'racial') && (
                                <section className="bg-black/40 border border-gray-800 rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                                        <Sparkles size={18} className="text-dnd-gold" />
                                        <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Racial Spells</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {localSpells.filter(s => s.sourceClassIndex === 'racial').map(spell => (
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
                                        const total = abilities[stat] || 0;
                                        const mod = calculateModifier(total);
                                        
                                        const contributors = [];
                                        const statLabel = ABILITY_LABELS[stat].toLowerCase();

                                        if (character.race) {
                                            const raceBonus = character.race.ability_bonuses?.find(b => 
                                                b.ability_score.index === stat || b.ability_score.name.toLowerCase() === statLabel
                                            );
                                            if (raceBonus) contributors.push({ name: character.race.name, bonus: raceBonus.bonus });
                                        }
                                        if (character.subrace) {
                                            const subraceBonus = character.subrace.ability_bonuses?.find(b => 
                                                b.ability_score.index === stat || b.ability_score.name.toLowerCase() === statLabel
                                            );
                                            if (subraceBonus) contributors.push({ name: character.subrace.name, bonus: subraceBonus.bonus });
                                        }
                                        localChoices.forEach(c => {
                                            const mode = c.revertData?.mode || c.type;
                                            if ((mode === 'asi' || c.type === 'asi') && c.revertData?.abilities?.[stat]) {
                                                contributors.push({ name: `ASI (Lvl ${c.level === 0 ? 'Init' : c.level})`, bonus: c.revertData.abilities[stat] });
                                            }
                                            if ((mode === 'feat' || c.type === 'feat' || c.type === 'feat-selection') && c.revertData?.abilities?.[stat]) {
                                                contributors.push({ name: c.label || 'Feat ASI', bonus: c.revertData.abilities[stat] });
                                            }
                                        });

                                        const bonusTotal = contributors.reduce((sum, c) => sum + c.bonus, 0);
                                        const base = total - bonusTotal;
                                        
                                        // Add base to contributors for display
                                        const displayContributors = [
                                            { name: 'Base', bonus: base },
                                            ...contributors
                                        ].filter(c => c.bonus !== 0 || c.name === 'Base');

                                        return (
                                            <div key={stat} className="bg-black/20 p-4 rounded-2xl border border-gray-800 flex flex-col items-center">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{ABILITY_LABELS[stat]}</span>
                                                <div className="text-3xl font-serif font-bold text-white leading-none">{total}</div>
                                                <div className={`text-[10px] font-black uppercase mt-1 ${mod >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {mod >= 0 ? `+${mod}` : mod}
                                                </div>
                                                <div className="mt-3 w-full space-y-1 border-t border-gray-800/50 pt-2">
                                                    {displayContributors.map((c, i) => (
                                                        <div key={`${c.name}-${i}`} className="flex justify-between items-center text-[8px] text-gray-500">
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
                                <div className="space-y-8">
                                    {/* Pending Choices Section */}
                                    {localChoices.filter(c => (c.value === null || c.value === undefined || c.value === '' || (Array.isArray(c.value) && c.value.length === 0)) && c.type !== 'Level Advancement').length > 0 && (
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="w-2 h-2 rounded-full bg-dnd-gold animate-pulse" />
                                                <h4 className="text-dnd-gold font-black uppercase tracking-[0.2em] text-[11px]">Pending Choices</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {localChoices
                                                    .filter(c => (c.value === null || c.value === undefined || c.value === '' || (Array.isArray(c.value) && c.value.length === 0)) && c.type !== 'Level Advancement')
                                                    .sort((a, b) => a.level - b.level)
                                                    .map(choice => (
                                                        <div key={choice.id} className="bg-black/40 border border-dnd-gold/30 rounded-2xl p-6 shadow-xl shadow-dnd-gold/5">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-[9px] text-dnd-gold uppercase font-black tracking-widest">{choice.source}</span>
                                                                        <div className="text-[8px] bg-dnd-gold/10 text-dnd-gold px-2 py-0.5 rounded uppercase font-black tracking-tighter border border-dnd-gold/20">
                                                                            {choice.type}
                                                                        </div>
                                                                        {choice.revertData?.featIndex && (
                                                                            <div className="group relative">
                                                                                <Info size={12} className="text-gray-500 hover:text-dnd-gold cursor-help" />
                                                                                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-black border border-gray-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                                                    <h6 className="text-dnd-gold font-bold text-[10px] mb-1">{allFeats.find(f => f.index === choice.revertData.featIndex)?.name}</h6>
                                                                                    <p className="text-[9px] text-gray-400 leading-relaxed">
                                                                                        {allFeats.find(f => f.index === choice.revertData.featIndex)?.desc.join(' ')}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <h5 className="text-white font-bold text-lg">{choice.label}</h5>
                                                                </div>
                                                                <div className="text-[10px] font-black text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                                                                    LEVEL {choice.level}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-4">
                                                                {/* Choice Input Logic */}
                                                                {(choice.type === 'asi' || choice.type === 'asi-feat') ? (
                                                                    <div className="space-y-4">
                                                                        <div className="flex gap-2">
                                                                            <button 
                                                                                onClick={() => handleChoiceChange(choice.id, 'asi')}
                                                                                className={`flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                                    choice.revertData?.mode !== 'feat' 
                                                                                        ? 'bg-dnd-gold border-dnd-gold text-black' 
                                                                                        : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                                                                                }`}
                                                                            >
                                                                                Ability Score Increase
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleChoiceChange(choice.id, 'feat')}
                                                                                className={`flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                                    choice.revertData?.mode === 'feat' 
                                                                                        ? 'bg-dnd-gold border-dnd-gold text-black' 
                                                                                        : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                                                                                }`}
                                                                            >
                                                                                Select a Feat
                                                                            </button>
                                                                        </div>

                                                                        {choice.revertData?.mode !== 'feat' && (
                                                                            <div className="grid grid-cols-3 gap-2 max-w-md animate-in fade-in slide-in-from-top-1 duration-300">
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
                                                                        )}

                                                                        {choice.revertData?.mode === 'feat' && (
                                                                            <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                                                                <select
                                                                                    value={choice.revertData?.featIndex || ''}
                                                                                    onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                                >
                                                                                    <option value="">Select a Feat...</option>
                                                                                    {allFeats.map(f => (
                                                                                        <option key={f.index} value={f.index}>{f.name}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : choice.type === 'subclass' ? (
                                                                    <select
                                                                        value={choice.revertData?.featIndex || choice.value || ''}
                                                                        onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                        className="w-full max-w-md bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                    >
                                                                        <option value="">Select Subclass...</option>
                                                                        {choice.options?.map((opt: any, idx: number) => (
                                                                            <option key={opt.index || opt.name || (typeof opt === 'string' ? opt : idx)} value={opt.index || opt.name || opt}>{opt.name || opt}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : choice.type === 'feat-selection' ? (
                                                                    <select
                                                                        value={choice.revertData?.featIndex || choice.value || ''}
                                                                        onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                        className="w-full max-w-md bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                    >
                                                                        <option value="">Select a Feat...</option>
                                                                        {allFeats.map(f => (
                                                                            <option key={f.index} value={f.index}>{f.name}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {choice.options?.map((opt: any, idx: number) => {
                                                                            const val = opt.index || opt.name || opt;
                                                                            const isSelected = Array.isArray(choice.value) 
                                                                                ? choice.value.includes(val)
                                                                                : choice.value === val;
                                                                            return (
                                                                                <button
                                                                                    key={typeof val === 'string' || typeof val === 'number' ? val : idx}
                                                                                    onClick={() => handleChoiceChange(choice.id, val)}
                                                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                                                                        isSelected 
                                                                                            ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                                                                            : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600'
                                                                                    }`}
                                                                                >
                                                                                    {opt.name || opt}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}

                                                                {/* Confirm Button */}
                                                                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
                                                                    <button
                                                                        onClick={() => handleConfirmChoice(choice.id)}
                                                                        disabled={
                                                                            choice.type === 'asi-feat' 
                                                                                ? (choice.revertData?.mode === 'asi' 
                                                                                    ? Object.values(choice.revertData?.abilities || {}).reduce((a: any, b: any) => a + b, 0) === 0
                                                                                    : !choice.revertData?.featIndex)
                                                                                : choice.type === 'subclass' || choice.type === 'feat-selection'
                                                                                    ? !choice.revertData?.featIndex
                                                                                    : Array.isArray(choice.value)
                                                                                        ? choice.value.length < (choice.count || 1)
                                                                                        : !choice.value
                                                                        }
                                                                        className="px-6 py-2 bg-dnd-gold text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-dnd-gold/20"
                                                                    >
                                                                        Confirm Selection
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Choice History Section */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-600" />
                                            <h4 className="text-gray-500 font-black uppercase tracking-[0.2em] text-[11px]">Choice History</h4>
                                        </div>
                                        
                                        {localChoices.filter(c => c.value !== null && c.value !== undefined && c.value !== '' && !(Array.isArray(c.value) && c.value.length === 0)).length === 0 ? (
                                            <div className="bg-black/10 border border-dashed border-gray-800 rounded-2xl p-8 text-center">
                                                <p className="text-gray-600 text-[10px] italic">No completed choices yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Group by level */}
                                                {Array.from(new Set(localChoices
                                                    .filter(c => c.value !== null && c.value !== undefined && c.value !== '' && !(Array.isArray(c.value) && c.value.length === 0))
                                                    .map(c => c.level)))
                                                    .sort((a, b) => b - a)
                                                    .map(level => (
                                                        <div key={level} className="bg-black/20 border border-gray-800 rounded-2xl overflow-hidden">
                                                            <div className="bg-black/40 px-6 py-3 border-b border-gray-800 flex justify-between items-center">
                                                                <h4 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">
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
                                                            <div className="p-4 space-y-4">
                                                                {localChoices
                                                                    .filter(c => c.level === level && c.value !== null && c.value !== undefined && c.value !== '' && !(Array.isArray(c.value) && c.value.length === 0) && c.type !== 'Level Advancement')
                                                                    .map(choice => {
                                                                        const isExpanded = expandedChoices.includes(choice.id);
                                                                        return (
                                                                            <div key={choice.id} className="border-l-2 border-gray-800 pl-4 py-1">
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{choice.source}</span>
                                                                                            <div className="text-[7px] bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded uppercase font-black tracking-tighter border border-gray-700">
                                                                                                {choice.type}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-3">
                                                                                            <h5 className="text-gray-300 font-bold text-xs">{choice.label}</h5>
                                                                                            {['subclass', 'feat-selection', 'asi-feat'].includes(choice.type) && (
                                                                                                <button 
                                                                                                    onClick={() => toggleChoiceExpansion(choice.id)}
                                                                                                    className="p-1 hover:bg-gray-800 rounded-full text-gray-500 hover:text-dnd-gold transition-all"
                                                                                                >
                                                                                                    <Info size={12} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <button 
                                                                                        onClick={() => handleRevertSingleChoice(choice.id)}
                                                                                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all"
                                                                                        title="Revert Choice"
                                                                                    >
                                                                                        <RotateCcw size={14} />
                                                                                    </button>
                                                                                </div>
                                                                                
                                                                                <div className="text-[10px] text-dnd-gold font-medium bg-dnd-gold/5 border border-dnd-gold/10 px-3 py-1.5 rounded-lg inline-block">
                                                                                    {Array.isArray(choice.value) ? choice.value.join(', ') : choice.value}
                                                                                </div>

                                                                                {isExpanded && (
                                                                                    <div className="mt-3 p-3 bg-black/40 border border-gray-800 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300">
                                                                                        <p className="text-[10px] text-gray-500 italic mb-2">You can modify this choice below:</p>
                                                                                        <div className="mt-2">
                                                                                            {/* Same input logic as pending but for history */}
                                                                                            {(choice.type === 'asi' || choice.type === 'asi-feat') ? (
                                                                                                <div className="space-y-4">
                                                                                                    <div className="flex gap-2">
                                                                                                        <button 
                                                                                                            onClick={() => handleChoiceChange(choice.id, 'asi')}
                                                                                                            className={`flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                                                                choice.revertData?.mode !== 'feat' 
                                                                                                                    ? 'bg-dnd-gold border-dnd-gold text-black' 
                                                                                                                    : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                                                                                                            }`}
                                                                                                        >
                                                                                                            Ability Score Increase
                                                                                                        </button>
                                                                                                        <button 
                                                                                                            onClick={() => handleChoiceChange(choice.id, 'feat')}
                                                                                                            className={`flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                                                                choice.revertData?.mode === 'feat' 
                                                                                                                    ? 'bg-dnd-gold border-dnd-gold text-black' 
                                                                                                                    : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'
                                                                                                            }`}
                                                                                                        >
                                                                                                            Select a Feat
                                                                                                        </button>
                                                                                                    </div>

                                                                                                    {choice.revertData?.mode !== 'feat' && (
                                                                                                        <div className="grid grid-cols-3 gap-2 max-w-md animate-in fade-in slide-in-from-top-1 duration-300">
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
                                                                                                    )}

                                                                                                    {choice.revertData?.mode === 'feat' && (
                                                                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                                                                                            <select
                                                                                                                value={choice.revertData?.featIndex || ''}
                                                                                                                onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                                                                className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                                                            >
                                                                                                                <option value="">Select a Feat...</option>
                                                                                                                {allFeats.map(f => (
                                                                                                                    <option key={f.index} value={f.index}>{f.name}</option>
                                                                                                                ))}
                                                                                                            </select>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : choice.type === 'subclass' ? (
                                                                                                <select
                                                                                                    value={choice.value || ''}
                                                                                                    onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                                                    className="w-full max-w-md bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                                                >
                                                                                                    <option value="">Select Subclass...</option>
                                                                                                    {choice.options?.map((opt: any, idx: number) => (
                                                                                                        <option key={opt.index || opt.name || (typeof opt === 'string' ? opt : idx)} value={opt.index || opt.name || opt}>{opt.name || opt}</option>
                                                                                                    ))}
                                                                                                </select>
                                                                                            ) : choice.type === 'feat-selection' ? (
                                                                                                <select
                                                                                                    value={choice.value || ''}
                                                                                                    onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                                                                                                    className="w-full max-w-md bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold/50 transition-all"
                                                                                                >
                                                                                                    <option value="">Select a Feat...</option>
                                                                                                    {allFeats.map(f => (
                                                                                                        <option key={f.index} value={f.index}>{f.name}</option>
                                                                                                    ))}
                                                                                                </select>
                                                                                            ) : (
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {choice.options?.map((opt: any, idx: number) => {
                                                                                                        const val = opt.index || opt.name || opt;
                                                                                                        const isSelected = Array.isArray(choice.value) 
                                                                                                            ? choice.value.includes(val)
                                                                                                            : choice.value === val;
                                                                                                        return (
                                                                                                            <button
                                                                                                                key={typeof val === 'string' || typeof val === 'number' ? val : idx}
                                                                                                                onClick={() => handleChoiceChange(choice.id, val)}
                                                                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                                                                                                    isSelected 
                                                                                                                        ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                                                                                                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600'
                                                                                                                }`}
                                                                                                            >
                                                                                                                {opt.name || opt}
                                                                                                            </button>
                                                                                                        );
                                                                                                    })}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-800 flex justify-start hidden">
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

                            <div className="pt-8 border-t border-gray-800 flex justify-start hidden">
                                <button 
                                    onClick={handleSave} 
                                    className="px-8 py-2.5 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    <Save size={14} />
                                    Apply All Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#121316] border-t border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                        <AlertCircle size={14} className="text-dnd-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unsaved changes will be lost</span>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="px-10 py-3 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-xl shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 text-xs group"
                    >
                        <Save size={16} className="group-hover:scale-110 transition-transform" />
                        Save All Changes
                    </button>
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