
import React, { useState, useRef, useEffect } from 'react';
import { BuilderPhase, CharacterState, RaceDetail, AbilityScores, SpellDetail, SubraceDetail, ClassFeature, BackgroundDetail, InventoryItem, LogEntry, CharacterClass } from './types';
import LevelStep from './components/Builder/LevelStep';
import RaceStep from './components/Builder/RaceStep';
import ClassStep from './components/Builder/ClassStep';
import AbilityScoreStep from './components/Builder/AbilityScoreStep';
import LevelingStep from './components/Builder/LevelingStep';
import BackgroundStep from './components/Builder/BackgroundStep';
import EquipmentStep from './components/Builder/EquipmentStep';
import SpellSelectionStep from './components/Builder/SpellSelectionStep';
import { CharacterSheet } from './components/Sheet/CharacterSheet';
import ErrorBoundary from './components/ErrorBoundary';
import { getSpellSlots, SKILL_LIST, getCasterProfileFor, calculateMaxHp, mergeSpellSlotCurrents } from './utils/rules';
import { getClassProficiencies, isToolProficiency } from './utils/multiclass';
import { STANDARD_LANGUAGES, ARTISAN_TOOLS, GAMING_SETS } from './data/constants';
import { hydrateCharacterClasses, fetchAllSpells, hydrateGrantedSpells, fetchEquipment, fetchEquipmentDetail } from './data/index';
import { saveCharacterToDb, loginUser } from './services/supabase';
import AuthModal from './components/Auth/AuthModal';
import CharacterDashboard from './components/Dashboard/CharacterDashboard';

const initialAbilities: AbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };

const hasCasterClass = (classes: CharacterClass[]) => classes.some(c => {
    const profile = getCasterProfileFor(c);
    return !!profile && profile.type !== 'none';
});

const buildFeatGrantChoices = async (feat: any, source: string, level: number): Promise<any[]> => {
    if (!feat?.effects?.length) return [];
    const allSpells = await fetchAllSpells();
    const choices: any[] = [];
    feat.effects.forEach((effect: any, index: number) => {
        if (effect.type === 'spell_access' && effect.spell) return;
        if (!effect.type?.endsWith('_choice') && effect.type !== 'spell_access') return;
        let options: any[] = effect.options || [];
        if (options.length === 0) {
            if (effect.type === 'proficiency_choice') {
                if (effect.category === 'skill') options = (/tool/i.test(effect.name || '') || feat.name === 'Skilled') ? [...SKILL_LIST.map(skill => skill.name), ...ARTISAN_TOOLS] : SKILL_LIST.map(skill => skill.name);
                else if (effect.category === 'tool') options = ARTISAN_TOOLS;
                else if (effect.category === 'language') options = STANDARD_LANGUAGES;
            } else if (effect.type === 'spell_access') {
                let filtered = allSpells;
                if (effect.filter_class) {
                    filtered = filtered.filter(spell => spell.classes?.some((entry: any) => entry.name === effect.filter_class || entry.index === effect.filter_class));
                }
                if (effect.level !== undefined) filtered = filtered.filter(spell => spell.level === effect.level);
                options = filtered.map(spell => ({ index: spell.index, name: spell.name }));
            }
        }
        choices.push({
            id: `feat-${feat.index}-${index}-${Date.now()}`,
            level,
            source: `${source} (${feat.name})`,
            type: effect.type === 'asi_choice' ? 'asi'
                : effect.type === 'proficiency_choice' ? (effect.category === 'skill' ? 'skill' : effect.category === 'language' ? 'language' : 'other')
                : effect.type === 'expertise_choice' ? 'expertise'
                : effect.type === 'spell_access' ? 'spell' : 'other',
            label: `${feat.name}: ${effect.name || (effect.type === 'spell_access' ? 'Spell' : effect.type.replace(/_/g, ' '))}`,
            value: null,
            options,
            count: effect.count || 1,
            revertData: {
                featIndex: feat.index,
                isSubChoice: true,
                expertiseIfProficient: !!effect.expertise_if_proficient,
                spellGrant: {
                    freeCasts: effect.free_casts,
                    freeCastReset: effect.free_cast_reset || effect.reset,
                    ability: effect.ability,
                    minLevel: effect.min_level,
                },
            },
        });
    });
    return choices;
};

const mergeChoices = (existing: any[], incoming: any[]) => {
    const map = new Map<string, any>();
    existing.forEach(c => { if (c.id) map.set(c.id, c); });
    incoming.forEach(c => { if (c.id) map.set(c.id, c); });
    // Keep choices without IDs as well
    const withIds = Array.from(map.values());
    const withoutIds = incoming.filter(c => !c.id);
    return [...withIds, ...withoutIds];
};

const INITIAL_CHARACTER: CharacterState = {
    name: '',
    race: null,
    subrace: null,
    classes: [],
    level: 1,
    abilities: initialAbilities,
    background: '',
    alignment: '',
    skills: [],
    expertise: [],
    languages: ['Common'],
    toolProficiencies: [],
    savingThrowProficiencies: [],
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    inspiration: false,
    inventory: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spells: [],
    spellSlots: {},
    hitDiceUsage: {},
    feats: [],
    featureUsage: {},
    classFeatures: [],
    xp: 0,
    equipment: [],
    customActions: [],
    layout: { left: ['senses', 'proficiencies', 'skills', 'saves'], right: ['actions', 'features', 'inventory', 'movement', 'defenses'], mobile: ['actions', 'spells', 'inventory', 'saves', 'hitDice'] },
    favorites: [],
    backstory: '',
    lore: [],
    quests: [],
    contacts: [],
    encounteredCreatures: [],
    sessionNotes: [],
    generalNotes: '',
    themeColor: '',
    themeColorSecondary: '',
    show3DDice: true,
    customCreatures: [],
    creatures: [],
    activePolymorph: null,
    abilitySource: 'background',
    choices: [],
    customTrackers: []
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<BuilderPhase>('welcome');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Landing Page State
  const [usernameInput, setUsernameInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Character State
  const [character, setCharacter] = useState<CharacterState>(INITIAL_CHARACTER);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user from local storage
  useEffect(() => {
      const storedUser = localStorage.getItem('persona_user');
      if (storedUser) {
          try {
              setCurrentUser(JSON.parse(storedUser));
          } catch(e) {
              localStorage.removeItem('persona_user');
          }
      }
  }, []);

  // Force Vault Theme for Landing/Builder
  useEffect(() => {
    if (phase !== 'sheet') {
      const root = document.documentElement;
      root.style.setProperty('--color-accent', '201 173 106');
      root.style.setProperty('--color-accent-secondary', '138 11 11');
    }
  }, [phase]);

  const handleLoginSuccess = (user: any) => {
      setCurrentUser(user);
      localStorage.setItem('persona_user', JSON.stringify(user));
      setShowDashboard(true);
      setUsernameInput('');
      setLoginError('');
  };

  const handleLandingLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!usernameInput.trim()) return;

      setIsLoggingIn(true);
      setLoginError('');

      try {
          const user = await loginUser(usernameInput.trim());
          if (user) {
              handleLoginSuccess(user);
          } else {
              setLoginError('Fate does not recognize you.');
          }
      } catch (err: any) {
          if (err.code === 'PGRST116') {
               setLoginError('User not found. Ask your DM for entry.');
          } else {
               console.error(err);
               setLoginError('Connection to the archives failed.');
          }
      } finally {
          setIsLoggingIn(false);
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('persona_user');
      setShowDashboard(false);
      setPhase('welcome');
  };

  const updateCharacter = (updates: Partial<CharacterState>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const startBuilder = () => {
      setCharacter(JSON.parse(JSON.stringify(INITIAL_CHARACTER)));
      setPhase('level');
  };

  const handleCloudLoad = async (char: CharacterState) => {
      const freshStart = JSON.parse(JSON.stringify(INITIAL_CHARACTER));
      let hydrated = char;
      try {
          hydrated = await hydrateCharacterClasses(char);
      } catch (e) {
          console.warn('Could not hydrate class definitions from the content library', e);
      }
      if (!hydrated.abilitySource) hydrated = { ...hydrated, abilitySource: 'race' };
      hydrated = {
          ...hydrated,
          spellSlots: mergeSpellSlotCurrents(getSpellSlots(hydrated.classes), hydrated.spellSlots),
      };
      setCharacter({ ...freshStart, ...hydrated });
      setPhase('sheet');
      setShowDashboard(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.name && json.abilities) {
            let contacts: LogEntry[] = json.contacts || [];
            if (!json.contacts) {
                if (json.allies && Array.isArray(json.allies)) {
                    contacts = [...contacts, ...json.allies.map((a: any) => ({ ...a, relationship: 'Ally', status: a.status || 'Alive' }))];
                }
                if (json.enemies && Array.isArray(json.enemies)) {
                    contacts = [...contacts, ...json.enemies.map((e: any) => ({ ...e, relationship: 'Enemy', status: e.status || 'Alive' }))];
                }
            }

            const importedChar = {
                ...json,
                backstory: json.backstory || '',
                lore: json.lore || [],
                quests: Array.isArray(json.quests) && typeof json.quests[0] === 'object' ? json.quests : [],
                contacts: contacts,
                encounteredCreatures: json.encounteredCreatures || [],
                sessionNotes: json.sessionNotes || [],
                generalNotes: json.generalNotes || '',
                expertise: json.expertise || [],
                favorites: json.favorites || [],
                show3DDice: json.show3DDice !== false
            };

            delete (importedChar as any).allies;
            delete (importedChar as any).enemies;
            delete (importedChar as any).locations;

            const freshStart = JSON.parse(JSON.stringify(INITIAL_CHARACTER));
            let hydrated = importedChar;
            try {
                hydrated = await hydrateCharacterClasses(importedChar);
            } catch (e) {
                console.warn('Could not hydrate imported class definitions', e);
            }
            if (!hydrated.abilitySource) hydrated = { ...hydrated, abilitySource: 'race' };
            setCharacter({ ...freshStart, ...hydrated });
            setPhase('sheet');
        } else {
            alert("Invalid scroll. The runes are indecipherable.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to read the ancient text.");
      }
    };
    reader.readAsText(file);
  };

  const handleBack = () => {
    switch (phase) {
        case 'race': setPhase('level'); break;
        case 'class': setPhase('race'); break;
        case 'abilities': setPhase('class'); break;
        case 'leveling': setPhase('abilities'); break;
        case 'spells': setPhase('leveling'); break;
        case 'background':
            setPhase(hasCasterClass(character.classes) ? 'spells' : 'leveling');
            break;
        case 'gear': setPhase('background'); break;
        case 'sheet': setPhase('gear'); break;
        default: setPhase('welcome'); break;
    }
  };

  const handleLevelSelect = (level: number) => {
      updateCharacter({ level });
      setPhase('race');
  };

  const handleRaceSelect = async (race: RaceDetail, subrace: SubraceDetail | null, extraData?: any) => {
    const finalRace = { ...race };
    const newFeatures: ClassFeature[] = [...character.classFeatures];
    const newSpells: SpellDetail[] = [...character.spells];
    let newSkills = [...character.skills];
    let newLanguages = [...character.languages];
    let newTools = [...character.toolProficiencies];

    if (extraData) {
        if (extraData.choices) {
            updateCharacter({ choices: mergeChoices(character.choices, extraData.choices) });
        }

        if (extraData.isCustomOrigin) {
            // Override ASI
            if (extraData.customAsi) {
                finalRace.ability_bonuses = Object.entries(extraData.customAsi).map(([stat, bonus]) => ({
                    ability_score: { index: stat, name: stat.toUpperCase(), url: '' },
                    bonus: bonus as number
                }));
            }
            // Override Languages
            if (extraData.customLanguages) {
                newLanguages = extraData.customLanguages;
            }
            // Handle Proficiency Swaps
            if (extraData.proficiencySwaps) {
                extraData.proficiencySwaps.forEach((swap: any) => {
                    if (swap.replacement) {
                        // Check if it's a skill
                        if (SKILL_LIST.some(s => s.name === swap.replacement)) {
                            newSkills.push(swap.replacement);
                        } else {
                            newTools.push(swap.replacement);
                        }
                    }
                });
            }
        } else {
            // Standard race processing, driven by RaceDetail.choices/effects.
            if (extraData.features) {
                newFeatures.push(...extraData.features);
            }
            if (extraData.cantrip) {
                 const cantrip = { ...extraData.cantrip, sourceClassIndex: 'racial', isPrepared: true };
                 newSpells.push(cantrip);
            }
            if (extraData.skills) {
                 newSkills = Array.from(new Set([...newSkills, ...extraData.skills]));
            }
            if (extraData.tools) {
                 newTools = Array.from(new Set([...newTools, ...extraData.tools]));
            }
            if (extraData.languages) {
                 newLanguages = Array.from(new Set([...newLanguages, ...extraData.languages]));
            }
            if (extraData.abilityBonuses) {
                finalRace.ability_bonuses.push(...extraData.abilityBonuses);
            }
        }
    }

    const racialLanguages = [
        ...(race.languages || []),
        ...(subrace?.languages || []),
    ].map((language: any) => typeof language === 'string' ? language : language.name);
    newLanguages = Array.from(new Set([...newLanguages, ...racialLanguages]));

    const fixedProficiencies = [
        ...(race.starting_proficiencies || []),
        ...(subrace?.starting_proficiencies || []),
    ].map((proficiency: any) => typeof proficiency === 'string' ? proficiency : proficiency.name);
    fixedProficiencies.forEach((name: string) => {
        if (name.startsWith('Skill: ')) newSkills.push(name.replace('Skill: ', ''));
    });

    const newFeats = [...character.feats];
    (extraData?.feats || []).forEach((feat: any) => {
        if (!newFeats.some(existing => (existing.index || existing.name) === (feat.index || feat.name))) newFeats.push(feat);
    });
    const featChoices = (await Promise.all((extraData?.feats || []).map((feat: any) => buildFeatGrantChoices(feat, race.name, 1)))).flat();
    const finalChoices = mergeChoices(character.choices, [...(extraData?.choices || []), ...featChoices]);
    const hydratedRace = await hydrateCharacterClasses({
        ...character,
        race: finalRace,
        subrace,
        feats: newFeats,
        choices: finalChoices,
        classFeatures: newFeatures,
        spells: newSpells,
    });

    updateCharacter({
        race: finalRace,
        subrace,
        classFeatures: hydratedRace.classFeatures,
        spells: hydratedRace.spells,
        skills: Array.from(new Set(newSkills)),
        languages: Array.from(new Set(newLanguages)),
        toolProficiencies: Array.from(new Set(newTools)),
        feats: newFeats,
        choices: finalChoices,
        ...(extraData?.spellcastingAbility ? { spellcastingAbility: extraData.spellcastingAbility } : {}),
    });
    setPhase('class');
  };

  const handleClassSelect = async (classes: CharacterClass[], skills: string[], tools: string[], choices: any[] = []) => {
    let totalHp = 0;
    const primary = classes[0];
    if (primary) {
        const primaryLevel = primary.level;
        const baseHp = primary.definition.hit_die + ((primaryLevel - 1) * (Math.floor(primary.definition.hit_die / 2) + 1));
        totalHp += baseHp;
    }

    for (let i = 1; i < classes.length; i++) {
        const cls = classes[i];
        const lvl = cls.level;
        totalHp += lvl * (Math.floor(cls.definition.hit_die / 2) + 1);
    }

    const mergedSkills = Array.from(new Set([...character.skills, ...skills]));
    const grantedClassTools = classes.flatMap((cls, index) =>
        getClassProficiencies(cls, index === 0)
            .map((entry: any) => entry.name)
            .filter(isToolProficiency)
    );
    const mergedTools = Array.from(new Set([...character.toolProficiencies, ...tools, ...grantedClassTools]));
    const startingSaves = (primary?.definition.saving_throws || []).map((save: any) => save.index || String(save.name || '').toLowerCase());

    // Extract feature choices into classFeatures
    const choiceFeatures: ClassFeature[] = [];
    classes.forEach(cls => {
        if (cls.featureChoices) {
            Object.entries(cls.featureChoices).forEach(([featureIndex, selections]) => {
                const feature = cls.definition.feature_details?.find((f: any) => f.index === featureIndex);
                if (feature) {
                    choiceFeatures.push({
                        index: `${featureIndex}-selection`,
                        name: `${feature.name}: ${selections.join(', ')}`,
                        level: feature.level,
                        source: cls.definition.name,
                        desc: [`You chose: ${selections.join(', ')}`],
                        url: ''
                    });
                }
            });
        }
    });

    updateCharacter({
        classes: classes,
        maxHp: totalHp,
        currentHp: totalHp,
        skills: mergedSkills,
        toolProficiencies: mergedTools,
        savingThrowProficiencies: startingSaves,
        classFeatures: [
            ...character.classFeatures.filter(f =>
                f.source === 'Race'
                || f.source === character.race?.name
                || f.source === character.subrace?.name
                || f.source === 'Background'
                || f.source === character.background
            ),
            ...choiceFeatures,
        ],
        choices: mergeChoices(character.choices, choices)
    });
    setPhase('abilities');
  };

  const handleAbilitiesSave = (abilities: AbilityScores) => {
    const nextCharacter = { ...character, abilities };
    const maxHp = calculateMaxHp(nextCharacter);
    updateCharacter({ abilities, maxHp, currentHp: maxHp });
    setPhase('leveling');
  };

  const handleLevelingComplete = async (updates: Partial<CharacterState>) => {
      const granted = await hydrateGrantedSpells({ ...character, ...updates });
      updateCharacter({ ...updates, spells: granted.spells });
      if (hasCasterClass(character.classes)) {
          setPhase('spells');
      } else {
          setPhase('background');
      }
  };

  const handleSpellComplete = (spells: SpellDetail[]) => {
      const racialSpells = character.spells.filter(s => s.sourceClassIndex === 'racial' || s.isGranted);
      const spellMap = new Map();
      [...racialSpells, ...spells].forEach(s => spellMap.set(s.index + (s.sourceClassIndex || ''), s));
      const newSlots = getSpellSlots(character.classes);
      updateCharacter({ spells: Array.from(spellMap.values()), spellSlots: newSlots });
      setPhase('background');
  };

  const handleBackgroundComplete = async (name: string, background: BackgroundDetail, extraData: { languages: string[], tools: string[], skills: string[], choices?: any[], equipment?: string[], currency?: { gp: number; sp: number; cp: number }, abilities?: Record<string, number>, feats?: any[], spellcastingAbility?: any }) => {
    const newSkills = Array.from(new Set([...character.skills, ...background.skill_proficiencies, ...extraData.skills]));
    const newLanguages = Array.from(new Set([...character.languages, ...extraData.languages]));
    const newTools = Array.from(new Set([...character.toolProficiencies, ...(background.tool_proficiencies || []), ...extraData.tools]));
    const newChoices = mergeChoices(character.choices, extraData.choices || []);
    const newAbilities = { ...character.abilities };
    Object.entries(extraData.abilities || {}).forEach(([ability, bonus]) => {
        const key = ability as keyof typeof newAbilities;
        newAbilities[key] = (newAbilities[key] || 0) + Number(bonus || 0);
    });
    const newFeats = [...character.feats];
    (extraData.feats || []).forEach(feat => {
        if (!newFeats.some(existing => (existing.index || existing.name) === (feat.index || feat.name))) newFeats.push(feat);
    });

    const selectedCurrency = extraData.currency || background.currency;
    const newCurrency = { ...character.currency };
    newCurrency.gp += selectedCurrency.gp;
    newCurrency.sp += selectedCurrency.sp;
    newCurrency.cp += selectedCurrency.cp;

    const bgFeature: ClassFeature = {
        index: background.feature.name.toLowerCase().replace(/\s+/g, '-'),
        name: background.feature.name,
        level: 1,
        source: 'Background',
        desc: background.feature.desc,
        effects: [...((background as any).effects || []), ...(background.feature?.effects || [])],
        url: ''
    };

    const newInventory = [...character.inventory];
    const allItems = await fetchEquipment(currentUser?.id);
    const byName = new Map(allItems.map(item => [item.name.toLowerCase(), item]));
    for (const rawItem of (extraData.equipment || background.equipment || [])) {
        const itemStr = String(rawItem).trim();
        if (!itemStr) continue;
        if (/any of your choice/i.test(itemStr)) {
            newChoices.push({
                id: `background-equipment-choice-${itemStr.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                level: 1,
                source: background.name,
                type: 'tool',
                label: itemStr,
                value: [],
                options: /gaming set/i.test(itemStr) ? GAMING_SETS : ARTISAN_TOOLS,
                count: 1,
            });
            continue;
        }
        const quantityMatch = itemStr.match(/\((\d+)\)\s*$/);
        const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
        const cleanName = itemStr.replace(/\s*\(\d+\)\s*$/, '').replace(/\s*\(any of your choice\)\s*$/i, '').trim();
        const normalized = (value: string) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const normalizedName = normalized(cleanName);
        const reversedName = normalizedName.split(' ').reverse().join(' ');
        const aliasIndex = normalizedName.includes('traveler') && normalizedName.includes('clothes') ? 'clothes-traveler' : '';
        const detail = (aliasIndex ? allItems.find(item => item.index === aliasIndex) : null)
            || await fetchEquipmentDetail(cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), currentUser?.id)
            || allItems.find(item => normalized(item.name) === normalizedName)
            || allItems.find(item => !item.is_magic && (normalized(item.name) === reversedName || normalizedName.includes(normalized(item.name))))
            || byName.get(cleanName.toLowerCase());
        if (detail) {
            newInventory.push({
                ...detail,
                id: `bg-${detail.index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                quantity,
                equipped: false,
            });
        } else {
            newInventory.push({
                id: `bg-${cleanName}-${Date.now()}`,
                name: cleanName,
                quantity,
                weight: 0,
                equipped: false
            });
        }
    }

    const featChoices = (await Promise.all((extraData.feats || []).map(feat => buildFeatGrantChoices(feat, 'Background', 1)))).flat();
    const finalChoices = mergeChoices(newChoices, featChoices).map((choice: any) =>
        choice.type === 'expertise'
            ? { ...choice, options: Array.from(new Set([...(choice.options || []), ...newSkills])) }
            : choice
    );
    const nextMaxHp = calculateMaxHp({ ...character, abilities: newAbilities, feats: newFeats });
    const grantedSpells = await hydrateGrantedSpells({
        ...character,
        abilities: newAbilities,
        feats: newFeats,
        classFeatures: [...character.classFeatures, bgFeature],
        spells: character.spells,
    });
    updateCharacter({
        name,
        background: background.name,
        skills: newSkills,
        languages: newLanguages,
        toolProficiencies: newTools,
        abilities: newAbilities,
        feats: newFeats,
        ...(extraData.spellcastingAbility ? { spellcastingAbility: extraData.spellcastingAbility } : {}),
        currency: newCurrency,
        maxHp: nextMaxHp,
        currentHp: nextMaxHp,
        classFeatures: [...character.classFeatures, bgFeature],
        spells: grantedSpells.spells,
        inventory: newInventory,
        choices: finalChoices
    });
    setPhase('gear');
  };

  const handleEquipmentComplete = async (inventory: InventoryItem[], currency?: { gp: number; sp: number; cp: number }) => {
    const finalInventory = [...character.inventory, ...inventory];
    const { id, user_id, ...charProps } = character;
    const finalChar = { ...charProps, inventory: finalInventory, ...(currency ? { currency: { ...character.currency, gp: character.currency.gp + currency.gp, sp: character.currency.sp + currency.sp, cp: character.currency.cp + currency.cp } } : {}) };

    updateCharacter({ inventory: finalInventory, ...(currency ? { currency: { ...character.currency, gp: character.currency.gp + currency.gp, sp: character.currency.sp + currency.sp, cp: character.currency.cp + currency.cp } } : {}) });

    if (currentUser) {
        try {
            const saved = await saveCharacterToDb(finalChar, currentUser.id);
            if (saved && saved.id) {
                updateCharacter({ id: saved.id, user_id: saved.user_id });
            }
        } catch(e: any) {
            console.error("Save failed:", e);
        }
    }

    setPhase('sheet');
  };

  const hasSpells = hasCasterClass(character.classes);
  const builderSteps = [
      { key: 'level', label: 'Level' },
      { key: 'race', label: 'Race' },
      { key: 'class', label: 'Class' },
      { key: 'abilities', label: 'Stats' },
      { key: 'leveling', label: 'Build' },
      ...(hasSpells ? [{ key: 'spells', label: 'Spells' }] : []),
      { key: 'background', label: 'Origin' },
      { key: 'gear', label: 'Gear' },
  ];
  const builderStepIndex = Math.max(0, builderSteps.findIndex(step => step.key === phase));
  const closeBuilder = () => {
      if (window.confirm('Discard this character draft and close the forge?')) {
          setPhase('welcome');
          setShowDashboard(false);
      }
  };

  useEffect(() => {
      if (phase === 'welcome' || phase === 'sheet') return;
      const handleKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') closeBuilder();
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
  }, [phase]);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-dnd-text font-sans selection:bg-dnd-gold selection:text-black">
      <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleLoginSuccess} />

      {showDashboard && (
          <CharacterDashboard
             currentUser={currentUser}
             onLoadCharacter={handleCloudLoad}
             onNewCharacter={() => { setShowDashboard(false); startBuilder(); }}
             onCancel={() => setShowDashboard(false)}
             onLogout={handleLogout}
          />
      )}

      <div className="min-h-screen">

        {phase === 'welcome' && (
          <div className="h-screen min-h-screen w-full flex flex-col items-center relative bg-[#0b0c0e] overflow-y-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9ad6a]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 my-auto flex flex-col items-center animate-in fade-in zoom-in duration-1000 w-full max-w-md px-6 py-10">
                <div className="mb-2 relative text-center">
                     <h1 className="text-5xl md:text-9xl font-serif font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e5c983] to-[#8a7238] drop-shadow-2xl">
                        PERSONA
                    </h1>
                </div>

                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#5c5f66] to-transparent mb-10"></div>

                {currentUser ? (
                    <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-[#1b1c20] border border-gray-800 rounded-xl p-6 w-full text-center shadow-lg">
                           <p className="text-gray-400 text-sm font-serif italic mb-4 uppercase tracking-widest">Welcome, {currentUser.username}</p>
                           <button
                                onClick={() => setShowDashboard(true)}
                                className="group relative w-full px-8 py-4 bg-dnd-gold text-black hover:bg-yellow-600 rounded transition-all duration-300 ease-out overflow-hidden shadow-lg mb-3"
                            >
                                <span className="relative font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                                    <span className="text-lg">🗝️</span>
                                    Open Character Vault
                                </span>
                            </button>
                            <button
                                onClick={startBuilder}
                                className="w-full px-8 py-4 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded font-black uppercase tracking-widest text-xs transition-all"
                            >
                                Create New Character
                            </button>
                        </div>
                        <button
                             onClick={handleLogout}
                             className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleLandingLogin} className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-5 duration-500">
                        <div className="w-full relative">
                            <input
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                placeholder="Enter Username..."
                                className="w-full bg-[#1b1c20]/80 border border-gray-700 rounded-lg py-4 px-6 text-center text-white placeholder:text-gray-600 focus:border-dnd-gold focus:outline-none transition-colors text-lg font-bold"
                                autoFocus
                            />
                        </div>

                        {loginError && <p className="text-red-400 text-xs font-bold animate-in fade-in">{loginError}</p>}

                        <button
                            type="submit"
                            disabled={isLoggingIn || !usernameInput.trim()}
                            className="group relative w-full px-8 py-4 bg-dnd-gold text-black hover:bg-yellow-600 rounded shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                                {isLoggingIn ? 'Consulting Archives...' : 'Enter Vault'}
                            </span>
                        </button>
                    </form>
                )}
            </div>
        </div>
        )}

        {phase !== 'welcome' && phase !== 'sheet' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-5">
            <div className="flex h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#3e4149] bg-[#121316] shadow-2xl">
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#2e3036] px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-black tracking-tight text-dnd-gold">Character Forge</span>
                    <span className="rounded-full border border-gray-700 bg-black/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                      Step {builderStepIndex + 1} / {builderSteps.length}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {builderSteps.map((step, index) => (
                      <React.Fragment key={step.key}>
                        <button
                          type="button"
                          disabled={index >= builderStepIndex}
                          onClick={() => index < builderStepIndex && setPhase(step.key as BuilderPhase)}
                          className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transition-colors ${phase === step.key ? 'border-dnd-gold bg-dnd-gold/15 text-dnd-gold' : index < builderStepIndex ? 'border-gray-700 bg-black/30 text-gray-400 hover:border-gray-500' : 'border-transparent text-gray-700'}`}
                        >
                          {step.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-gray-800 sm:block">
                    <div className="h-full rounded-full bg-dnd-gold transition-all duration-300" style={{ width: `${((builderStepIndex + 1) / builderSteps.length) * 100}%` }} />
                  </div>
                  <button onClick={closeBuilder} className="rounded-lg border border-gray-700 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:border-red-700 hover:text-red-300">Close</button>
                </div>
              </div>
              <div className="builder-modal-content relative min-h-0 flex-1 overflow-hidden">
                {phase === 'level' && <LevelStep onSelect={handleLevelSelect} onBack={handleBack} />}
                {phase === 'race' && <RaceStep onSelect={handleRaceSelect} selectedRace={character.race} onBack={handleBack} userId={currentUser?.id} />}
                {phase === 'class' && (
                    <ClassStep
                        onSelect={handleClassSelect}
                        initialClasses={character.classes}
                        totalLevel={character.level}
                        onBack={handleBack}
                        currentSkills={character.skills}
                        currentTools={character.toolProficiencies}
                        userId={currentUser?.id}
                        initialChoices={character.choices}
                    />
                )}
                {phase === 'abilities' && <AbilityScoreStep race={character.race} initialScores={character.abilities} onSave={handleAbilitiesSave} onBack={handleBack} />}
                {phase === 'leveling' && <LevelingStep character={character} onComplete={handleLevelingComplete} onBack={handleBack} />}
                {phase === 'spells' && <SpellSelectionStep character={character} onComplete={handleSpellComplete} onBack={handleBack} />}
                {phase === 'background' && <BackgroundStep onComplete={handleBackgroundComplete} onBack={handleBack} userId={currentUser?.id} currentSkills={Array.from(new Set([...character.skills, ...((character.race as any)?.traits || []).flatMap((trait: any) => (trait.effects || []).filter((effect: any) => effect.type === 'proficiency' && effect.category === 'skill').map((effect: any) => effect.target || effect.value)), ...((character.subrace as any)?.traits || []).flatMap((trait: any) => (trait.effects || []).filter((effect: any) => effect.type === 'proficiency' && effect.category === 'skill').map((effect: any) => effect.target || effect.value))]))} />}
                {phase === 'gear' && <EquipmentStep onComplete={handleEquipmentComplete} onBack={handleBack} userId={currentUser?.id} classes={character.classes} />}
              </div>
            </div>
          </div>
        )}

        {phase === 'sheet' && (
            <ErrorBoundary>
                <CharacterSheet
                    character={character}
                    currentUser={currentUser}
                    onOpenVault={() => setShowDashboard(true)}
                    key={character.name + '-' + (character.id || Date.now())}
                />
            </ErrorBoundary>
        )}

      </div>
    </div>
  );
};

export default App;
