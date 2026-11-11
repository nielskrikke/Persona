import React, { useEffect, useState } from 'react';
/* Import AbilityName type from types */
import { APIReference, RaceDetail, SubraceDetail, SpellDetail, FeatDetail, AbilityName, ABILITY_NAMES, ABILITY_LABELS } from '../../types';
import { fetchRaces, fetchRaceDetail, fetchSubraces, fetchSubraceDetail, fetchSpellsByClass, fetchFeatsList } from '../../data/index';
import { SKILL_LIST } from '../../utils/rules';
import { SIMPLE_WEAPONS, MARTIAL_WEAPONS, TOOLS, SKILLS, LANGUAGES, getProficiencyType, getAllowedSwaps } from '../../data/origin_customization';

const LANGUAGE_LIST = LANGUAGES;
const STANDARD_LANGUAGE_NAMES = new Set(['Common', 'Common Sign Language', 'Draconic', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc']);

interface RaceStepProps {
  onSelect: (race: RaceDetail, subrace: SubraceDetail | null, extraData?: any) => void;
  selectedRace: RaceDetail | null;
  onBack: () => void;
  userId?: string;
}

const RaceStep: React.FC<RaceStepProps> = ({ onSelect, selectedRace, onBack, userId }) => {
  const [races, setRaces] = useState<APIReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewRace, setPreviewRace] = useState<any | null>(null);
  
  // Subrace State
  const [subraces, setSubraces] = useState<APIReference[]>([]);
  const [selectedSubrace, setSelectedSubrace] = useState<SubraceDetail | null>(null);
  const [loadingSubraces, setLoadingSubraces] = useState(false);

  // Extra Options State
  const [raceChoiceSelections, setRaceChoiceSelections] = useState<Record<string, string[]>>({});
  const [asiMode, setAsiMode] = useState<'2/1' | '1/1/1'>('2/1');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Customize Your Origin State
  const [isCustomizingOrigin, setIsCustomizingOrigin] = useState(false);
  const [customAsi, setCustomAsi] = useState<Record<string, number>>({});
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [customProficiencies, setCustomProficiencies] = useState<Record<string, string>>({});
  const [proficiencySwaps, setProficiencySwaps] = useState<{original: string, replacement: string}[]>([]);
  
  // Data for spell choices
  const [spellChoiceOptions, setSpellChoiceOptions] = useState<Record<string, SpellDetail[]>>({});
  const [allFeats, setAllFeats] = useState<FeatDetail[]>([]);

  useEffect(() => {
    const load = async () => {
      const [results, feats] = await Promise.all([fetchRaces(userId), fetchFeatsList(userId)]);
      setRaces(results);
      setAllFeats(feats);
      setLoading(false);
    };
    load();
  }, [userId]);

  useEffect(() => {
      setAsiMode('2/1');
  }, [previewRace, selectedSubrace]);

  useEffect(() => {
      const tags = new Set<string>();
      [...((previewRace as any)?.choices || []), ...((selectedSubrace as any)?.choices || [])]
          .forEach((choice: any) => {
              if (choice.kind === 'spell' && choice.sourceClass) tags.add(choice.sourceClass);
          });
      tags.forEach(async tag => {
          const spells = await fetchSpellsByClass(tag);
          setSpellChoiceOptions(prev => prev[tag] ? prev : { ...prev, [tag]: spells });
      });
  }, [previewRace, selectedSubrace]);

  const handlePreview = async (index: string) => {
    setPreviewRace(null);
    setSelectedSubrace(null);
    setSubraces([]);
    setRaceChoiceSelections({});
    setIsCustomizingOrigin(false);
    setCustomAsi({});
    setCustomLanguages([]);
    setCustomProficiencies({});
    setProficiencySwaps([]);
    
    const detail = await fetchRaceDetail(index, userId);
    setPreviewRace(detail);
    setValidationError(null);
    
    if (detail) {
        setLoadingSubraces(true);
        const subs = await fetchSubraces(index, userId);
        setSubraces(subs);
        setLoadingSubraces(false);
    }
  };

  const giantAncestryForSubrace = (indexOrName?: string): string | null => {
      const text = String(indexOrName || '').toLowerCase();
      if (/stone/.test(text)) return "Stone's Endurance";
      if (/cloud/.test(text)) return "Cloud's Jaunt";
      if (/fire/.test(text)) return "Fire's Burn";
      if (/frost/.test(text)) return "Frost's Chill";
      if (/hill/.test(text)) return "Hill's Tumble";
      if (/storm/.test(text)) return "Storm's Thunder";
      return null;
  };
  const subraceForGiantAncestry = (option?: string): string | null => {
      const text = String(option || '').toLowerCase();
      if (/stone/.test(text)) return 'stone-giant-ancestry';
      if (/cloud/.test(text)) return 'cloud-giant-ancestry';
      if (/fire/.test(text)) return 'fire-giant-ancestry';
      if (/frost/.test(text)) return 'frost-giant-ancestry';
      if (/hill/.test(text)) return 'hill-giant-ancestry';
      if (/storm/.test(text)) return 'storm-giant-ancestry';
      return null;
  };

  const handleSubraceSelect = async (index: string) => {
      const detail = await fetchSubraceDetail(index, userId);
      setSelectedSubrace(detail);
      setValidationError(null);
      const ancestryChoice = ((previewRace as any)?.choices || []).find((choice: any) => choice.kind === 'ancestry');
      const ancestryOption = giantAncestryForSubrace(detail?.index || detail?.name || index);
      if (ancestryChoice && ancestryOption && (ancestryChoice.options || []).some((option: any) => (typeof option === 'string' ? option : option.name) === ancestryOption)) {
          setRaceChoiceSelections(prev => ({ ...prev, [ancestryChoice.id]: [ancestryOption] }));
      }
  };

  const getRaceChoices = (): any[] => {
      const choices = [
          ...((previewRace as any)?.choices || []),
          ...((selectedSubrace as any)?.choices || []),
      ];
      if ((previewRace as any)?.language_options > 0 && !choices.some((choice: any) => choice.kind === 'language')) {
          choices.push({
              id: `${previewRace.index}-extra-languages`,
              kind: 'language',
              count: (previewRace as any).language_options,
              source: 'race',
              options: LANGUAGE_LIST,
          });
      }
      return choices;
  };

  const getChoiceOptions = (choice: any): any[] => {
      if (choice.kind === 'language') {
          const granted = new Set([
              ...((previewRace as any)?.languages || []),
              ...((selectedSubrace as any)?.languages || []),
          ].map((language: any) => String(language?.name || language).toLowerCase()));
          const base = (Array.isArray(choice.options) && choice.options.length > 0) ? choice.options : LANGUAGE_LIST;
          return base.filter((language: any) => {
              const name = String(typeof language === 'string' ? language : language?.name || '');
              return STANDARD_LANGUAGE_NAMES.has(name) && !granted.has(name.toLowerCase());
          });
      }
      if (Array.isArray(choice.options) && choice.options.length > 0) return choice.options;
      if (choice.kind === 'spell' && choice.sourceClass) return spellChoiceOptions[choice.sourceClass] || [];
      if (choice.kind === 'feat') return (choice.options && choice.options.length > 0) ? choice.options : allFeats;
      if (choice.kind === 'spellcasting_ability') return (choice.options && choice.options.length > 0) ? choice.options : ['int', 'wis', 'cha'];
      if (choice.kind === 'skill') return SKILL_LIST.map(skill => skill.name);
      if (choice.kind === 'tool') return TOOLS;
      if (choice.kind === 'language') return LANGUAGE_LIST;
      return [];
  };

  const toggleRaceChoice = (choice: any, optionName: string) => {
      setValidationError(null);
      const count = Number(choice.count || 1);
      if (choice.kind === 'ancestry') {
          const subraceIndex = subraceForGiantAncestry(optionName);
          if (subraceIndex && subraces.some(subrace => subrace.index === subraceIndex)) {
              handleSubraceSelect(subraceIndex);
          }
      }
      setRaceChoiceSelections(prev => {
          const current = prev[choice.id] || [];
          if (current.includes(optionName)) return { ...prev, [choice.id]: current.filter(item => item !== optionName) };
          if (current.length < count) return { ...prev, [choice.id]: [...current, optionName] };
          return prev;
      });
  };

  const handleConfirm = () => {
    if (!previewRace) return;

    const raceChoices = getRaceChoices().filter((choice: any) => choice.kind !== 'ability');

    // Validation for Custom Origin
    if (isCustomizingOrigin) {
        const baseBonuses = [...(previewRace.ability_bonuses || []), ...(selectedSubrace?.ability_bonuses || [])].map(b => b.bonus);
        const customBonuses = Object.values(customAsi).filter(b => b > 0);
        const sortedBase = [...baseBonuses].sort((a, b) => b - a);
        const sortedCustom = [...customBonuses].sort((a, b) => b - a);
        if (JSON.stringify(sortedBase) !== JSON.stringify(sortedCustom)) {
            setValidationError(`Please distribute your Ability Score points correctly: ${sortedBase.map(b => `+${b}`).join(', ')}.`);
            return;
        }
        const languageChoiceCount = getRaceChoices().filter((choice: any) => choice.kind === 'language').reduce((sum: number, choice: any) => sum + Number(choice.count || 1), 0);
        const baseLanguagesCount = (previewRace.languages?.length || 0) + (selectedSubrace?.languages?.length || 0) + languageChoiceCount;
        if (customLanguages.length !== baseLanguagesCount) {
            setValidationError(`Please select exactly ${baseLanguagesCount} languages.`);
            return;
        }
    }

    if (subraces.length > 0 && !selectedSubrace) {
        setValidationError("Please select a subrace.");
        return;
    }

    const abilityChoices = raceChoices.filter((choice: any) => choice.kind === 'ability');
    const hasAsiAlternative = abilityChoices.some((choice: any) => Number(choice.amount) === 2)
        && abilityChoices.some((choice: any) => Number(choice.amount) === 1);
    const syntheticAsi: any = hasAsiAlternative && asiMode === '1/1/1'
        ? {
            id: '__asi_111__',
            kind: 'ability',
            count: 3,
            amount: 1,
            options: Array.from(new Set(abilityChoices.flatMap((choice: any) => getChoiceOptions(choice)))),
            label: '+1, +1, +1',
        }
        : null;
    const activeRaceChoices = asiMode === '1/1/1'
        ? raceChoices.filter((choice: any) => choice.kind !== 'ability').concat(syntheticAsi ? [syntheticAsi] : [])
        : raceChoices;

    for (const choice of activeRaceChoices) {
        const selected = raceChoiceSelections[choice.id] || [];
        if (selected.length !== Number(choice.count || 1)) {
            const label = choice.kind === 'ancestry' ? 'ancestry' : choice.kind;
            setValidationError(`Please choose ${choice.count || 1} ${label} option(s).`);
            return;
        }
    }

    const extraData: any = {};
    const skills = new Set<string>();
    const tools = new Set<string>();
    const languages = new Set<string>();
    const features: any[] = [];
    const abilityBonuses: any[] = [];
    const levelChoices: any[] = [];

    if (isCustomizingOrigin) {
        extraData.isCustomOrigin = true;
        extraData.customAsi = customAsi;
        extraData.customLanguages = customLanguages;
        extraData.customProficiencies = customProficiencies;
        extraData.proficiencySwaps = proficiencySwaps;
    }

    activeRaceChoices.forEach(choice => {
        const selected = raceChoiceSelections[choice.id] || [];
        const options = getChoiceOptions(choice);
        selected.forEach(name => {
            const option = options.find((item: any) => (typeof item === 'string' ? item : item.name) === name);
            const label = typeof option === 'string' ? option : (option?.name || name);
            const category = typeof option === 'object' && option?.category ? option.category : choice.kind;

            if (category === 'skill' || choice.kind === 'skill') skills.add(label);
            else if (category === 'tool' || choice.kind === 'tool') tools.add(label);
            else if (category === 'language' || choice.kind === 'language') languages.add(label);
            else if (choice.kind === 'ability') {
                abilityBonuses.push({
                    ability_score: { index: name, name: name.toUpperCase(), url: '' },
                    bonus: Number(choice.amount || 1),
                });
            } else if (choice.kind === 'spell' && option && typeof option === 'object') {
                extraData.cantrip = { ...option, sourceClassIndex: 'racial', isPrepared: true };
            } else if (choice.kind === 'feat') {
                const feat = allFeats.find(item => item.index === name || item.name === name)
                    || (option && typeof option === 'object' ? option : null);
                if (feat) {
                    extraData.feats = extraData.feats || [];
                    extraData.feats.push(feat);
                }
            } else if (choice.kind === 'spellcasting_ability') {
                extraData.spellcastingAbility = name;
            } else if (option && typeof option === 'object' && Array.isArray(option.effects) && option.effects.length > 0) {
                features.push({
                    index: `race-${choice.id}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    name: label,
                    level: 1,
                    source: selectedSubrace?.name || previewRace.name,
                    desc: option.desc ? [].concat(option.desc) : [choice.label || choice.id],
                    effects: option.effects,
                    url: '',
                });
            }
        });

        levelChoices.push({
            id: `race-${choice.id}`,
            level: 1,
            source: selectedSubrace?.name || previewRace.name,
            type: choice.kind === 'ability' ? 'asi' : choice.kind === 'spell' ? 'spell' : choice.kind === 'feat' ? 'feat' : choice.kind === 'language' ? 'language' : 'other',
            label: choice.label || choice.kind,
            value: selected,
            options,
            count: choice.count || 1,
            revertData: { abilityBonuses },
        });
    });

    if (skills.size > 0) extraData.skills = Array.from(skills);
    if (tools.size > 0) extraData.tools = Array.from(tools);
    if (languages.size > 0) extraData.languages = Array.from(languages);
    if (features.length > 0) extraData.features = features;
    if (abilityBonuses.length > 0) extraData.abilityBonuses = abilityBonuses;
    extraData.choices = levelChoices;

    onSelect(previewRace, selectedSubrace, extraData);
  };

  const allRaceChoices = getRaceChoices().filter((choice: any) => choice.kind !== 'ability');
  const allAbilityChoiceOptions = allRaceChoices.filter((choice: any) => choice.kind === 'ability');
  const hasAsiAlternative = allAbilityChoiceOptions.some((choice: any) => Number(choice.amount) === 2)
      && allAbilityChoiceOptions.some((choice: any) => Number(choice.amount) === 1);
  const syntheticAsiChoice: any = {
      id: '__asi_111__',
      kind: 'ability',
      count: 3,
      amount: 1,
      options: Array.from(new Set(allAbilityChoiceOptions.flatMap((choice: any) => getChoiceOptions(choice)))),
      label: '+1, +1, +1',
  };
  const renderedRaceChoices = asiMode === '1/1/1'
      ? allRaceChoices.filter((choice: any) => choice.kind !== 'ability').concat(syntheticAsiChoice)
      : allRaceChoices;

  if (loading) return <div className="text-dnd-gold animate-pulse text-center mt-20 font-serif italic text-xl">Summoning lineages from the archives...</div>;

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* List */}
        <div className="md:col-span-1 bg-[#1b1c20] border border-gray-800 rounded-xl p-5 flex flex-col overflow-hidden shadow-2xl h-[250px] md:h-full">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
            Choose Lineage
          </h3>
          <ul className="space-y-1.5 flex-grow overflow-y-auto custom-scrollbar pr-2">
            {races.map((race) => (
              <li 
                key={race.index}
                onClick={() => handlePreview(race.index)}
                className={`cursor-pointer px-4 py-3 rounded-lg text-sm font-bold transition-all flex justify-between items-center ${
                  previewRace?.index === race.index 
                    ? 'bg-dnd-gold text-black shadow-lg translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{race.name}</span>
                {race.is_homebrew && <span className="text-[9px] uppercase font-black text-dnd-gold bg-dnd-gold/10 px-1.5 py-0.5 rounded">Homebrew</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <div className="md:col-span-2 bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
          {previewRace ? (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-[#121316] border-b border-gray-800">
                <div className="flex flex-wrap justify-between items-start gap-3">
                    <h2 className="text-3xl sm:text-4xl font-serif text-white mb-2 break-words min-w-0">{previewRace.name}</h2>
                    <div className="flex gap-2 flex-wrap shrink-0">
                        <button 
                            onClick={() => {
                                setIsCustomizingOrigin(!isCustomizingOrigin);
                                if (!isCustomizingOrigin) {
                                    // Initialize custom values from base race
                                    const baseAsi: Record<string, number> = {};
                                    previewRace.ability_bonuses.forEach((b: any) => {
                                        baseAsi[b.ability_score.index] = (baseAsi[b.ability_score.index] || 0) + b.bonus;
                                    });
                                    if (selectedSubrace) {
                                        selectedSubrace.ability_bonuses.forEach((b: any) => {
                                            baseAsi[b.ability_score.index] = (baseAsi[b.ability_score.index] || 0) + b.bonus;
                                        });
                                    }
                                    // Include generic ability/language choices from the
                                    // content data instead of race-name special cases.
                                    getRaceChoices().forEach((choice: any) => {
                                        const selected = raceChoiceSelections[choice.id] || [];
                                        if (choice.kind === 'ability') {
                                            selected.forEach(stat => {
                                                baseAsi[stat] = (baseAsi[stat] || 0) + Number(choice.amount || 1);
                                            });
                                        }
                                    });
                                    setCustomAsi(baseAsi);

                                    const baseLangs = [...(previewRace.languages || []), ...(selectedSubrace?.languages || [])]
                                        .map((l: any) => typeof l === 'string' ? l : l.name);
                                    const chosenLangChoices = getRaceChoices()
                                        .filter((choice: any) => choice.kind === 'language')
                                        .flatMap((choice: any) => raceChoiceSelections[choice.id] || []);
                                    setCustomLanguages([...baseLangs, ...chosenLangChoices]);
                                }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${isCustomizingOrigin ? 'bg-dnd-gold border-dnd-gold text-black' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                        >
                            {isCustomizingOrigin ? 'Customizing Origin' : 'Customize Origin'}
                        </button>
                        {previewRace.is_homebrew && <span className="bg-dnd-gold/20 text-dnd-gold border border-dnd-gold/30 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">Homebrew</span>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black text-dnd-gold uppercase tracking-widest">
                   <span>Walk: {previewRace.speed}ft</span>
                   {previewRace.swim_speed && <span>/ Swim: {previewRace.swim_speed}ft</span>}
                   {previewRace.fly_speed && <span>/ Fly: {previewRace.fly_speed}ft</span>}
                   {previewRace.climb_speed && <span>/ Climb: {previewRace.climb_speed}ft</span>}
                   <span className="text-gray-800">/</span>
                   <span>Size: {previewRace.size}</span>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-8">
                {isCustomizingOrigin ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-dnd-gold/5 border border-dnd-gold/20 p-6 rounded-xl">
                            <h3 className="text-lg font-serif text-dnd-gold mb-2">Customize Your Origin</h3>
                            <p className="text-sm text-gray-400 font-serif italic mb-6">
                                You can customize your ability scores, languages, and proficiencies to fit the origin you have in mind.
                            </p>

                            {/* Custom ASI */}
                            <section className="mb-8">
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Ability Score Increases</h4>
                                <div className="bg-black/40 p-4 rounded-xl border border-gray-800 mb-6">
                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-4">Available Bonuses to Distribute:</p>
                                    <div className="flex gap-2">
                                        {(() => {
                                            const baseBonuses = [...(previewRace.ability_bonuses || []), ...(selectedSubrace?.ability_bonuses || [])].map(b => b.bonus);
                                            getRaceChoices().filter((choice: any) => choice.kind === 'ability').forEach((choice: any) => {
                                                (raceChoiceSelections[choice.id] || []).forEach(() => baseBonuses.push(Number(choice.amount || 1)));
                                            });
                                            return baseBonuses.sort((a, b) => b - a).map((b, i) => (
                                                <div key={i} className="bg-dnd-gold/20 border border-dnd-gold/50 px-3 py-1 rounded text-dnd-gold font-black text-xs">+{b}</div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {ABILITY_NAMES.map(stat => (
                                        <div key={stat} className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex flex-col items-center">
                                            <span className="font-black uppercase text-[10px] tracking-widest text-gray-400 mb-2">{ABILITY_LABELS[stat as AbilityName]}</span>
                                            <select 
                                                value={customAsi[stat] || 0}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setCustomAsi(prev => {
                                                        const next = { ...prev };
                                                        if (val === 0) delete next[stat];
                                                        else next[stat] = val;
                                                        return next;
                                                    });
                                                }}
                                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center font-black"
                                            >
                                                <option value="0">None</option>
                                                <option value="1">+1</option>
                                                <option value="2">+2</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Custom Languages */}
                            <section className="mb-8">
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Languages</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {LANGUAGE_LIST.map(lang => (
                                        <label key={lang} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${customLanguages.includes(lang) ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/40 border-transparent hover:bg-gray-800 text-gray-500'}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={customLanguages.includes(lang)}
                                                onChange={() => {
                                                    const max = (previewRace.languages?.length || 0) + (selectedSubrace?.languages?.length || 0) + getRaceChoices().filter((choice: any) => choice.kind === 'language').reduce((sum: number, choice: any) => sum + Number(choice.count || 1), 0);
                                                    if (customLanguages.includes(lang)) {
                                                        setCustomLanguages(prev => prev.filter(l => l !== lang));
                                                    } else if (customLanguages.length < max) {
                                                        setCustomLanguages(prev => [...prev, lang]);
                                                    }
                                                }}
                                                className="accent-dnd-gold"
                                            />
                                            <span className="text-[10px] font-bold uppercase">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-4 uppercase font-bold">
                                    Selected: {customLanguages.length} / {(previewRace.languages?.length || 0) + (selectedSubrace?.languages?.length || 0) + getRaceChoices().filter((choice: any) => choice.kind === 'language').reduce((sum: number, choice: any) => sum + Number(choice.count || 1), 0)}
                                </p>
                            </section>

                            {/* Proficiency Swaps */}
                            <section>
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Proficiency Swaps</h4>
                                <div className="space-y-4">
                                    {proficiencySwaps.map((swap, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-4 sm:items-end bg-gray-800/20 p-4 rounded-xl border border-gray-700">
                                            <div className="flex-grow">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Original Proficiency</label>
                                                <input 
                                                    type="text"
                                                    value={swap.original}
                                                    onChange={(e) => {
                                                        const newSwaps = [...proficiencySwaps];
                                                        newSwaps[index].original = e.target.value;
                                                        setProficiencySwaps(newSwaps);
                                                    }}
                                                    placeholder="e.g. Longsword"
                                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Replacement</label>
                                                <select 
                                                    value={swap.replacement}
                                                    onChange={(e) => {
                                                        const newSwaps = [...proficiencySwaps];
                                                        newSwaps[index].replacement = e.target.value;
                                                        setProficiencySwaps(newSwaps);
                                                    }}
                                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                                                >
                                                    <option value="">Select Replacement...</option>
                                                    {(() => {
                                                        const type = getProficiencyType(swap.original);
                                                        if (!type) return <option disabled>Enter valid original first</option>;
                                                        return getAllowedSwaps(type).map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ));
                                                    })()}
                                                </select>
                                            </div>
                                            <button 
                                                onClick={() => setProficiencySwaps(prev => prev.filter((_, i) => i !== index))}
                                                className="p-3 text-red-500 hover:text-red-400 shrink-0 self-end sm:self-auto"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setProficiencySwaps(prev => [...prev, { original: '', replacement: '' }])}
                                        className="w-full py-3 border-2 border-dashed border-gray-800 rounded-xl text-gray-500 hover:border-dnd-gold hover:text-dnd-gold transition-all font-bold text-xs uppercase"
                                    >
                                        + Add Proficiency Swap
                                    </button>
                                    <p className="text-[10px] text-gray-500 italic">
                                        According to Tasha's: Skill → Skill, Simple Weapon → Simple Weapon/Tool, Martial Weapon → Simple/Martial Weapon/Tool, Tool → Tool/Simple Weapon.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-black/20 p-5 rounded-lg border border-gray-800 italic text-gray-400 leading-relaxed font-serif">
                           {previewRace.alignment}
                        </div>
                        
                        <section>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Ability Score Increases</h4>
                  <p className="text-xs text-gray-500 italic">2024 rules: ability score increases come from your background, not your species.</p>
                </section>

                <section>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Traits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewRace.traits.filter((t: any) => !/ability score increase/i.test(t.name || '')).map((t: any) => (
                      <div key={t.index} className="bg-gray-800/30 border border-gray-700/50 p-3 rounded-lg group">
                        <div className="font-bold text-white text-sm mb-1 group-hover:text-dnd-gold transition-colors">{t.name}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-serif">{t.desc[0]}</p>
                      </div>
                    ))}
                  </div>
                </section>
                    </>
                )}

                {/* Subrace Section */}
                {subraces.length > 0 && (
                    <section className="animate-in slide-in-from-bottom-2 duration-500">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4 border-b border-dnd-gold/20 pb-2">Ancestral Lineage</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {subraces.map(sub => (
                                <button
                                  key={sub.index}
                                  onClick={() => handleSubraceSelect(sub.index)}
                                  className={`p-4 rounded-xl border text-left transition-all ${selectedSubrace?.index === sub.index ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg scale-[1.02]' : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                >
                                    <div className="font-black uppercase tracking-widest text-xs mb-1">{sub.name}</div>
                                    <p className="text-[9px] opacity-70 leading-tight">View variant details</p>
                                </button>
                            ))}
                        </div>
                        
                        {selectedSubrace && (
                            <div className="mt-5 bg-black/40 p-5 rounded-xl border border-gray-700 animate-in fade-in duration-300">
                                <h4 className="font-black uppercase tracking-tighter text-white mb-2">{selectedSubrace.name} Traits</h4>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 font-serif italic">"{selectedSubrace.desc[0]}"</p>
                                {selectedSubrace.ability_bonuses.length > 0 && (
                                    <div className="text-xs text-green-400 font-bold uppercase tracking-widest">
                                        Bonus: {selectedSubrace.ability_bonuses.map(b => `${b.ability_score.name} +${b.bonus}`).join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {renderedRaceChoices.length > 0 && (
                    <section className="bg-black/20 border border-gray-800 p-6 rounded-xl space-y-5">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Origin Choices</h4>
                        {hasAsiAlternative && (
                            <div className="flex items-center justify-between gap-3 bg-black/20 border border-gray-800 rounded-xl p-3">
                                <div>
                                    <p className="text-[10px] font-black text-dnd-gold uppercase tracking-widest">Ability Score Increase Style</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Use the standard +2/+1, or spread it as +1/+1/+1.</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button type="button" onClick={() => { setAsiMode('2/1'); setRaceChoiceSelections(prev => ({ ...prev, __asi_111__: [] })); }} className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase border ${asiMode === '2/1' ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/30 text-gray-400 border-gray-700'}`}>+2 / +1</button>
                                    <button type="button" onClick={() => { setAsiMode('1/1/1'); setRaceChoiceSelections(prev => { const next = { ...prev }; allRaceChoices.filter((choice: any) => choice.kind === 'ability').forEach((choice: any) => { delete next[choice.id]; }); return next; }); }} className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase border ${asiMode === '1/1/1' ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/30 text-gray-400 border-gray-700'}`}>+1 / +1 / +1</button>
                                </div>
                            </div>
                        )}
                        {renderedRaceChoices.map((choice: any) => {
                            const options = getChoiceOptions(choice);
                            const selected = raceChoiceSelections[choice.id] || [];
                            return (
                                <div key={choice.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {choice.label || choice.kind}
                                        </label>
                                        <span className={`text-[10px] font-bold ${selected.length === Number(choice.count || 1) ? 'text-green-500' : 'text-dnd-red'}`}>
                                            {selected.length} / {choice.count || 1}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {options.map((option: any, index: number) => {
                                            const name = typeof option === 'string' ? option : option.name;
                                            const display = (choice.kind === 'ability' || choice.kind === 'spellcasting_ability')
                                                ? (ABILITY_LABELS[String(name).toLowerCase() as keyof typeof ABILITY_LABELS] || String(name).toUpperCase())
                                                : name;
                                            const isSelected = selected.includes(name);
                                            return (
                                                <button
                                                    key={`${name}-${index}`}
                                                    type="button"
                                                    onClick={() => toggleRaceChoice(choice, name)}
                                                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all ${isSelected ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-500'}`}
                                                >
                                                    {display}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 italic p-10 text-center">
                <span className="text-6xl mb-4 opacity-10">🏺</span>
                <p className="max-w-xs font-serif text-lg">Choose a lineage from the shared archive to proceed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e] to-transparent z-[100]">
        <div className="max-w-6xl mx-auto">
            {validationError && (
                <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold animate-in slide-in-from-bottom-2">
                    <span className="mr-2">⚠️</span>
                    {validationError}
                </div>
            )}
            <div className="flex gap-4">
                <button 
                    onClick={onBack}
                    className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl border border-gray-700"
                >
                    &larr; Back
                </button>
                <button 
                    onClick={handleConfirm}
                    disabled={!previewRace || (subraces.length > 0 && !selectedSubrace)}
                    className={`flex-grow py-4 font-black uppercase text-[10px] tracking-[0.3em] rounded-xl shadow-2xl transition-all transform active:scale-95 ${!previewRace || (subraces.length > 0 && !selectedSubrace) ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' : 'bg-dnd-gold hover:bg-yellow-600 text-black'}`}
                >
                    Confirm: {selectedSubrace ? selectedSubrace.name : previewRace ? previewRace.name : 'Select Lineage'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RaceStep;