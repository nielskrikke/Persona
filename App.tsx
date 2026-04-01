
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
import { getSpellSlots } from './utils/rules';
import { saveCharacterToDb, loginUser } from './services/supabase';
import AuthModal from './components/Auth/AuthModal';
import CharacterDashboard from './components/Dashboard/CharacterDashboard';

const initialAbilities: AbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };

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
    layout: { left: [], right: [], mobile: ['actions', 'spells', 'inventory', 'saves', 'hitDice'] },
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

  const handleCloudLoad = (char: CharacterState) => {
      const freshStart = JSON.parse(JSON.stringify(INITIAL_CHARACTER));
      setCharacter({ ...freshStart, ...char });
      setPhase('sheet');
      setShowDashboard(false);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
            setCharacter({ ...freshStart, ...importedChar });
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
            const hasSpells = character.classes.some(c => 
                ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard', 'artificer'].includes(c.definition.index) ||
                (['paladin', 'ranger'].includes(c.definition.index) && c.level >= 2) ||
                (c.subclass && ['arcane-trickster', 'eldritch-knight'].includes(c.subclass.index) && c.level >= 3)
            );
            setPhase(hasSpells ? 'spells' : 'leveling'); 
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

  const handleRaceSelect = (race: RaceDetail, subrace: SubraceDetail | null, extraData?: any) => {
    const finalRace = { ...race };
    const newFeatures: ClassFeature[] = [...character.classFeatures];
    const newSpells: SpellDetail[] = [...character.spells];
    let newSkills = [...character.skills];
    let newLanguages = [...character.languages];

    if (extraData) {
        if (extraData.choices) {
            updateCharacter({ choices: mergeChoices(character.choices, extraData.choices) });
        }
        if (extraData.ancestry) {
             newFeatures.push({
                 index: 'draconic-ancestry-selection',
                 name: `Draconic Ancestry: ${extraData.ancestry}`,
                 level: 1,
                 source: 'Race',
                 desc: [`You have resistance to the damage type associated with your ${extraData.ancestry} ancestry.`],
                 url: ''
             });
        }
        if (extraData.cantrip) {
             const cantrip = { ...extraData.cantrip, sourceClassIndex: 'racial', isPrepared: true };
             newSpells.push(cantrip);
        }
        if (extraData.skills) {
             newSkills = Array.from(new Set([...newSkills, ...extraData.skills]));
        }
        if (extraData.languages) {
             newLanguages = Array.from(new Set([...newLanguages, ...extraData.languages]));
        }
        if (extraData.halfElfAsi && Array.isArray(extraData.halfElfAsi)) {
            extraData.halfElfAsi.forEach((stat: string) => {
                finalRace.ability_bonuses.push({
                    ability_score: { index: stat, name: stat.toUpperCase(), url: '' },
                    bonus: 1
                });
            });
        }
    }

    updateCharacter({ 
        race: finalRace, 
        subrace,
        classFeatures: newFeatures,
        spells: newSpells,
        skills: newSkills,
        languages: newLanguages
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
    const mergedTools = Array.from(new Set([...character.toolProficiencies, ...tools]));

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
        classFeatures: [...character.classFeatures.filter(f => f.source === 'Race'), ...choiceFeatures],
        choices: mergeChoices(character.choices, choices)
    });
    setPhase('abilities');
  };

  const handleAbilitiesSave = (abilities: AbilityScores) => {
    const conMod = Math.floor((abilities.con - 10) / 2);
    const hpWithCon = character.maxHp + (character.level * conMod);
    updateCharacter({ abilities, maxHp: hpWithCon, currentHp: hpWithCon });
    setPhase('leveling');
  };

  const handleLevelingComplete = (updates: Partial<CharacterState>) => {
      updateCharacter(updates);
      const hasSpells = character.classes.some(c => 
        ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard', 'artificer'].includes(c.definition.index) ||
        (['paladin', 'ranger'].includes(c.definition.index) && c.level >= 2) ||
        (c.subclass && ['arcane-trickster', 'eldritch-knight'].includes(c.subclass.index) && c.level >= 3)
      );
      if (hasSpells) {
          setPhase('spells');
      } else {
          setPhase('background');
      }
  };

  const handleSpellComplete = (spells: SpellDetail[]) => {
      const racialSpells = character.spells.filter(s => s.sourceClassIndex === 'racial');
      const spellMap = new Map();
      [...racialSpells, ...spells].forEach(s => spellMap.set(s.index + (s.sourceClassIndex || ''), s));
      const newSlots = getSpellSlots(character.classes);
      updateCharacter({ spells: Array.from(spellMap.values()), spellSlots: newSlots });
      setPhase('background');
  };

  const handleBackgroundComplete = async (name: string, background: BackgroundDetail, extraData: { languages: string[], tools: string[], skills: string[], choices?: any[] }) => {
    const newSkills = Array.from(new Set([...character.skills, ...background.skill_proficiencies, ...extraData.skills]));
    const newLanguages = Array.from(new Set([...character.languages, ...extraData.languages]));
    const newTools = Array.from(new Set([...character.toolProficiencies, ...extraData.tools]));
    const newChoices = mergeChoices(character.choices, extraData.choices || []);
    
    const newCurrency = { ...character.currency };
    newCurrency.gp += background.currency.gp;
    newCurrency.sp += background.currency.sp;
    newCurrency.cp += background.currency.cp;
    
    const bgFeature: ClassFeature = {
        index: background.feature.name.toLowerCase().replace(/\s+/g, '-'),
        name: background.feature.name,
        level: 1,
        source: 'Background',
        desc: background.feature.desc,
        url: ''
    };

    const newInventory = [...character.inventory];
    for (const itemStr of background.equipment) {
        newInventory.push({
            id: `bg-${itemStr}-${Date.now()}`,
            name: itemStr,
            quantity: 1,
            weight: 0,
            equipped: false
        });
    }

    updateCharacter({ 
        name, 
        background: background.name, 
        skills: newSkills,
        languages: newLanguages,
        toolProficiencies: newTools,
        currency: newCurrency,
        classFeatures: [...character.classFeatures, bgFeature],
        inventory: newInventory,
        choices: newChoices
    });
    setPhase('gear');
  };

  const handleEquipmentComplete = async (inventory: InventoryItem[]) => {
    const finalInventory = [...character.inventory, ...inventory];
    const { id, user_id, ...charProps } = character;
    const finalChar = { ...charProps, inventory: finalInventory };
    
    updateCharacter({ inventory: finalInventory });
    
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

  const hasSpells = character.classes.some(c => 
    ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard', 'artificer'].includes(c.definition.index) ||
    (['paladin', 'ranger'].includes(c.definition.index) && c.level >= 2) ||
    (c.subclass && ['arcane-trickster', 'eldritch-knight'].includes(c.subclass.index) && c.level >= 3)
  );

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

      {phase !== 'welcome' && phase !== 'sheet' && (
        <div className="fixed top-0 left-0 right-0 bg-[#121316] border-b border-[#3e4149] z-[100] shadow-xl">
           <div className="max-w-6xl mx-auto flex items-center h-16 px-6 overflow-x-auto whitespace-nowrap no-scrollbar">
              {[
                { key: 'level', label: 'Level' },
                { key: 'race', label: 'Race' },
                { key: 'class', label: 'Class' },
                { key: 'abilities', label: 'Stats' },
                { key: 'leveling', label: 'Features' },
                ...(hasSpells ? [{ key: 'spells', label: 'Spells' }] : []),
                { key: 'background', label: 'Origin' },
                { key: 'gear', label: 'Gear' }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.key}>
                   <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${phase === step.key ? 'text-dnd-gold' : 'text-gray-600'}`}>
                    {step.label}
                   </span>
                   {idx < arr.length - 1 && <span className="mx-3 text-gray-800 text-xs font-light">/</span>}
                </React.Fragment>
              ))}
           </div>
        </div>
      )}

      <div className={`h-screen ${phase !== 'welcome' && phase !== 'sheet' ? 'pt-16 pb-0' : ''}`}>
        
        {phase === 'welcome' && (
          <div className="h-full flex flex-col items-center justify-center relative bg-[#0b0c0e] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9ad6a]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000 w-full max-w-md px-6">
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
            />
        )}
        {phase === 'abilities' && <AbilityScoreStep race={character.race} initialScores={character.abilities} onSave={handleAbilitiesSave} onBack={handleBack} />}
        {phase === 'leveling' && <LevelingStep character={character} onComplete={handleLevelingComplete} onBack={handleBack} />}
        {phase === 'spells' && <SpellSelectionStep character={character} onComplete={handleSpellComplete} onBack={handleBack} />}
        {phase === 'background' && <BackgroundStep onComplete={handleBackgroundComplete} onBack={handleBack} userId={currentUser?.id} />}
        {phase === 'gear' && <EquipmentStep onComplete={handleEquipmentComplete} onBack={handleBack} userId={currentUser?.id} />}
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
