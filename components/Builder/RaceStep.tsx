import React, { useEffect, useState } from 'react';
/* Import AbilityName type from types */
import { APIReference, RaceDetail, SubraceDetail, SpellDetail, AbilityName, ABILITY_NAMES, ABILITY_LABELS } from '../../types';
import { fetchRaces, fetchRaceDetail, fetchSubraces, fetchSubraceDetail, getLocalSpells } from '../../data/index';
import { SKILL_LIST } from '../../utils/rules';

const LANGUAGE_LIST = ["Common", "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin", "Halfling", "Orc", "Abyssal", "Celestial", "Draconic", "Deep Speech", "Infernal", "Primordial", "Sylvan", "Undercommon"];

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
  const [ancestry, setAncestry] = useState('');
  const [highElfCantrip, setHighElfCantrip] = useState<SpellDetail | null>(null);
  const [halfElfSkills, setHalfElfSkills] = useState<string[]>([]);
  const [halfElfAsi, setHalfElfAsi] = useState<string[]>([]);
  const [chosenLanguages, setChosenLanguages] = useState<string[]>([]);
  const [traitSelections, setTraitSelections] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Data for options
  const [wizardCantrips, setWizardCantrips] = useState<SpellDetail[]>([]);

  useEffect(() => {
    const load = async () => {
      const results = await fetchRaces(userId);
      setRaces(results);
      setLoading(false);
      
      const spells = getLocalSpells('wizard', 0);
      setWizardCantrips(spells);
    };
    load();
  }, [userId]);

  const handlePreview = async (index: string) => {
    setPreviewRace(null);
    setSelectedSubrace(null);
    setSubraces([]);
    setAncestry('');
    setHighElfCantrip(null);
    setHalfElfSkills([]);
    setHalfElfAsi([]);
    setChosenLanguages([]);
    setTraitSelections({});
    
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

  const handleSubraceSelect = async (index: string) => {
      const detail = await fetchSubraceDetail(index, userId);
      setSelectedSubrace(detail);
      setHighElfCantrip(null);
      setValidationError(null);
  };

  const toggleHalfElfSkill = (skill: string) => {
      setValidationError(null);
      if (halfElfSkills.includes(skill)) {
          setHalfElfSkills(prev => prev.filter(s => s !== skill));
      } else {
          if (halfElfSkills.length < 2) {
              setHalfElfSkills(prev => [...prev, skill]);
          }
      }
  };

  const toggleHalfElfAsi = (stat: string) => {
      setValidationError(null);
      if (halfElfAsi.includes(stat)) {
          setHalfElfAsi(prev => prev.filter(s => s !== stat));
      } else {
          if (halfElfAsi.length < 2) {
              setHalfElfAsi(prev => [...prev, stat]);
          }
      }
  };

  const toggleLanguage = (lang: string, max: number) => {
      setValidationError(null);
      if (chosenLanguages.includes(lang)) {
          setChosenLanguages(prev => prev.filter(l => l !== lang));
      } else {
          if (chosenLanguages.length < max) {
              setChosenLanguages(prev => [...prev, lang]);
          }
      }
  };

  const handleConfirm = () => {
    if (previewRace) {
        const langOptions = previewRace.language_options || 0;
        
        if (subraces.length > 0 && !selectedSubrace) {
            setValidationError("Please select a subrace.");
            return;
        }
        if (previewRace.index === 'dragonborn' && !ancestry) {
            setValidationError("Please select a Draconic Ancestry.");
            return;
        }
        if (previewRace.index === 'half-elf') {
            if (halfElfSkills.length !== 2) {
                setValidationError("Please select exactly 2 skills.");
                return;
            }
            if (halfElfAsi.length !== 2) {
                setValidationError("Please select 2 additional Ability Scores to increase.");
                return;
            }
        }
        if (selectedSubrace?.index === 'high-elf' && !highElfCantrip) {
            setValidationError("Please select a Wizard cantrip.");
            return;
        }
        if (langOptions > 0 && chosenLanguages.length !== langOptions) {
            setValidationError(`Please select ${langOptions} additional language(s).`);
            return;
        }

        // Additional Trait Validations
        if (previewRace.index === 'kenku' && (!traitSelections['kenku-training'] || traitSelections['kenku-training'].length !== 2)) {
            setValidationError("Please select 2 skills for Kenku Training.");
            return;
        }
        if (previewRace.index === 'changeling' && (!traitSelections['changeling-instincts'] || traitSelections['changeling-instincts'].length !== 2)) {
            setValidationError("Please select 2 skills for Changeling Instincts.");
            return;
        }
        if (previewRace.index === 'lizardfolk' && (!traitSelections['hunter-lore'] || traitSelections['hunter-lore'].length !== 2)) {
            // Note: Hunter's Lore might not be in data, but if it was, we'd validate it here.
            // Actually, let's check if it's in the data first.
        }
        if (previewRace.index === 'warforged') {
            if (!traitSelections['specialized-design-skill']) {
                setValidationError("Please select a skill for Specialized Design.");
                return;
            }
            if (!traitSelections['specialized-design-tool']) {
                setValidationError("Please select a tool for Specialized Design.");
                return;
            }
        }
        if (previewRace.index === 'centaur' && !traitSelections['survivor']) {
            setValidationError("Please select a skill for Survivor.");
            return;
        }
        if (previewRace.index === 'minotaur' && !traitSelections['imposing-presence']) {
            setValidationError("Please select a skill for Imposing Presence.");
            return;
        }
        if (previewRace.index === 'leonin' && !traitSelections['hunter-instincts']) {
            setValidationError("Please select a skill for Hunter Instincts.");
            return;
        }
        if (selectedSubrace?.index === 'githyanki') {
            if (!traitSelections['decadent-mastery-skill-tool']) {
                setValidationError("Please select a skill or tool for Decadent Mastery.");
                return;
            }
            if (!traitSelections['decadent-mastery-language']) {
                setValidationError("Please select a language for Decadent Mastery.");
                return;
            }
        }

        setValidationError(null);
        
        const choices: any[] = [];
        const extraData: any = { ...traitSelections };
        
        if (ancestry) {
            extraData.ancestry = ancestry;
            choices.push({
                id: `race-ancestry-${previewRace.index}`,
                level: 1,
                source: previewRace.name,
                type: 'ancestry',
                label: 'Draconic Ancestry',
                value: ancestry,
                options: ['Black', 'Blue', 'Brass', 'Bronze', 'Copper', 'Gold', 'Green', 'Red', 'Silver', 'White']
            });
        }
        
        if (halfElfSkills.length > 0) {
            extraData.skills = halfElfSkills;
            choices.push({
                id: 'race-half-elf-skills',
                level: 1,
                source: 'Half-Elf',
                type: 'skill',
                label: 'Skill Versatility',
                value: halfElfSkills,
                options: SKILL_LIST.map(s => s.name),
                count: 2
            });
        }
        
        if (halfElfAsi.length > 0) {
            extraData.halfElfAsi = halfElfAsi;
            choices.push({
                id: 'race-half-elf-asi',
                level: 1,
                source: 'Half-Elf',
                type: 'asi',
                label: 'Ability Score Increase',
                value: halfElfAsi,
                options: ABILITY_NAMES.filter(a => a !== 'cha'),
                count: 2
            });
        }
        
        if (highElfCantrip) {
            extraData.cantrip = highElfCantrip;
            choices.push({
                id: 'race-high-elf-cantrip',
                level: 1,
                source: 'High Elf',
                type: 'spell',
                label: 'High Elf Cantrip',
                value: highElfCantrip.name,
                options: wizardCantrips.map(s => s.name)
            });
        }
        
        if (chosenLanguages.length > 0) {
            extraData.languages = chosenLanguages;
            choices.push({
                id: `race-languages-${previewRace.index}`,
                level: 1,
                source: previewRace.name,
                type: 'language',
                label: 'Extra Languages',
                value: chosenLanguages,
                options: LANGUAGE_LIST,
                count: previewRace.language_options
            });
        }

        // Trait Selections to Choices
        if (traitSelections['kenku-training']) {
            choices.push({
                id: 'race-kenku-training',
                level: 1,
                source: 'Kenku',
                type: 'skill',
                label: 'Kenku Training',
                value: traitSelections['kenku-training'],
                options: ["Acrobatics", "Deception", "Stealth", "Sleight of Hand"],
                count: 2
            });
        }
        if (traitSelections['changeling-instincts']) {
            choices.push({
                id: 'race-changeling-instincts',
                level: 1,
                source: 'Changeling',
                type: 'skill',
                label: 'Changeling Instincts',
                value: traitSelections['changeling-instincts'],
                options: ["Deception", "Insight", "Intimidation", "Persuasion"],
                count: 2
            });
        }
        if (traitSelections['specialized-design-skill']) {
            choices.push({
                id: 'race-warforged-skill',
                level: 1,
                source: 'Warforged',
                type: 'skill',
                label: 'Specialized Design: Skill',
                value: traitSelections['specialized-design-skill'],
                options: SKILL_LIST.map(s => s.name)
            });
        }
        if (traitSelections['specialized-design-tool']) {
            choices.push({
                id: 'race-warforged-tool',
                level: 1,
                source: 'Warforged',
                type: 'tool',
                label: 'Specialized Design: Tool',
                value: traitSelections['specialized-design-tool'],
                options: ["Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools", "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools"]
            });
        }
        if (traitSelections['survivor']) {
            choices.push({
                id: 'race-centaur-survivor',
                level: 1,
                source: 'Centaur',
                type: 'skill',
                label: 'Survivor',
                value: traitSelections['survivor'],
                options: ["Animal Handling", "Medicine", "Nature", "Survival"]
            });
        }
        if (traitSelections['imposing-presence']) {
            choices.push({
                id: 'race-minotaur-presence',
                level: 1,
                source: 'Minotaur',
                type: 'skill',
                label: 'Imposing Presence',
                value: traitSelections['imposing-presence'],
                options: ["Intimidation", "Persuasion"]
            });
        }
        if (traitSelections['hunter-instincts']) {
            choices.push({
                id: 'race-leonin-instincts',
                level: 1,
                source: 'Leonin',
                type: 'skill',
                label: 'Hunter Instincts',
                value: traitSelections['hunter-instincts'],
                options: ["Athletics", "Intimidation", "Perception", "Survival"]
            });
        }
        if (traitSelections['decadent-mastery-skill-tool']) {
            choices.push({
                id: 'race-githyanki-mastery-skill-tool',
                level: 1,
                source: 'Githyanki',
                type: 'skill', // or tool, but we'll use skill for simplicity in overview for now
                label: 'Decadent Mastery: Skill/Tool',
                value: traitSelections['decadent-mastery-skill-tool'],
                options: [...SKILL_LIST.map(s => s.name), "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools", "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools"]
            });
        }
        if (traitSelections['decadent-mastery-language']) {
            choices.push({
                id: 'race-githyanki-mastery-language',
                level: 1,
                source: 'Githyanki',
                type: 'language',
                label: 'Decadent Mastery: Language',
                value: traitSelections['decadent-mastery-language'],
                options: LANGUAGE_LIST
            });
        }

        extraData.choices = choices;
        onSelect(previewRace, selectedSubrace, extraData);
    }
  };

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
                {race.isCustom && <span className="text-[9px] uppercase font-black opacity-40">Homebrew</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <div className="md:col-span-2 bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
          {previewRace ? (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-[#121316] border-b border-gray-800">
                <div className="flex justify-between items-start">
                    <h2 className="text-4xl font-serif text-white mb-2">{previewRace.name}</h2>
                    {previewRace.isCustom && <span className="bg-blue-900/40 text-blue-300 border border-blue-800 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">Shared Creation</span>}
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
                <div className="bg-black/20 p-5 rounded-lg border border-gray-800 italic text-gray-400 leading-relaxed font-serif">
                   {previewRace.alignment}
                </div>
                
                <section>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Ability Bonuses</h4>
                  <div className="flex flex-wrap gap-3">
                    {previewRace.ability_bonuses.map((b: any, i: number) => (
                      <div key={i} className="bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-lg text-sm font-bold text-white">
                        {ABILITY_LABELS[b.ability_score.index as AbilityName] || b.ability_score.name}: <span className="text-green-400">+{b.bonus}</span>
                      </div>
                    ))}
                    {previewRace.index === 'half-elf' && (
                       <div className="bg-blue-900/10 border border-blue-900/50 px-4 py-2 rounded-lg text-sm font-bold text-blue-300">
                         +1 to two other ability scores
                       </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Traits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewRace.traits.map((t: any) => (
                      <div key={t.index} className="bg-gray-800/30 border border-gray-700/50 p-3 rounded-lg group">
                        <div className="font-bold text-white text-sm mb-1 group-hover:text-dnd-gold transition-colors">{t.name}</div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-serif">{t.desc[0]}</p>
                      </div>
                    ))}
                  </div>
                </section>

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

                {/* SPECIAL CHOICES */}
                {previewRace.index === 'dragonborn' && (
                    <section className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl animate-in zoom-in-95">
                        <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-4">Select Draconic Ancestry</h4>
                        <select 
                          value={ancestry} 
                          onChange={(e) => setAncestry(e.target.value)}
                          className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-4 text-white focus:border-dnd-gold outline-none font-bold"
                        >
                            <option value="">Choose an element...</option>
                            {['Black (Acid - Line)', 'Blue (Lightning - Line)', 'Brass (Fire - Line)', 'Bronze (Lightning - Line)', 'Copper (Acid - Line)', 'Gold (Fire - Cone)', 'Green (Poison - Cone)', 'Red (Fire - Cone)', 'Silver (Cold - Cone)', 'White (Cold - Cone)'].map(o => (
                              <option key={o} value={o.split(' ')[0]}>{o}</option>
                            ))}
                        </select>
                    </section>
                )}

                {selectedSubrace?.index === 'high-elf' && (
                    <section className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">High Elf Cantrip</h4>
                        <select 
                          onChange={(e) => setHighElfCantrip(wizardCantrips.find(s => s.index === e.target.value) || null)}
                          className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-4 text-white focus:border-dnd-gold outline-none"
                        >
                            <option value="">Select a Wizard cantrip...</option>
                            {wizardCantrips.map(s => <option key={s.index} value={s.index}>{s.name}</option>)}
                        </select>
                    </section>
                )}

                {/* Kenku Training */}
                {previewRace?.index === 'kenku' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Kenku Training</h4>
                        <p className="text-[10px] text-gray-500 mb-4 uppercase font-bold">Select 2 skills from the list below.</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["Acrobatics", "Deception", "Stealth", "Sleight of Hand"].map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => {
                                        const current = traitSelections['kenku-training'] || [];
                                        if (current.includes(skill)) {
                                            setTraitSelections(prev => ({ ...prev, 'kenku-training': current.filter((s: string) => s !== skill) }));
                                        } else if (current.length < 2) {
                                            setTraitSelections(prev => ({ ...prev, 'kenku-training': [...current, skill] }));
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                                        (traitSelections['kenku-training'] || []).includes(skill)
                                        ? 'bg-dnd-gold text-black border-dnd-gold'
                                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-dnd-gold/50'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Changeling Instincts */}
                {previewRace?.index === 'changeling' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Changeling Instincts</h4>
                        <p className="text-[10px] text-gray-500 mb-4 uppercase font-bold">Select 2 skills from the list below.</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["Deception", "Insight", "Intimidation", "Persuasion"].map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => {
                                        const current = traitSelections['changeling-instincts'] || [];
                                        if (current.includes(skill)) {
                                            setTraitSelections(prev => ({ ...prev, 'changeling-instincts': current.filter((s: string) => s !== skill) }));
                                        } else if (current.length < 2) {
                                            setTraitSelections(prev => ({ ...prev, 'changeling-instincts': [...current, skill] }));
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                                        (traitSelections['changeling-instincts'] || []).includes(skill)
                                        ? 'bg-dnd-gold text-black border-dnd-gold'
                                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-dnd-gold/50'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Warforged Specialized Design */}
                {previewRace?.index === 'warforged' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl space-y-4">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Specialized Design</h4>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Skill Proficiency</label>
                            <select 
                                value={traitSelections['specialized-design-skill'] || ''}
                                onChange={(e) => setTraitSelections(prev => ({ ...prev, 'specialized-design-skill': e.target.value }))}
                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                            >
                                <option value="">Select a Skill...</option>
                                {SKILL_LIST.map(skill => <option key={skill.name} value={skill.name}>{skill.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Tool Proficiency</label>
                            <select 
                                value={traitSelections['specialized-design-tool'] || ''}
                                onChange={(e) => setTraitSelections(prev => ({ ...prev, 'specialized-design-tool': e.target.value }))}
                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                            >
                                <option value="">Select a Tool...</option>
                                {["Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools", "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools"].map(tool => (
                                    <option key={tool} value={tool}>{tool}</option>
                                ))}
                            </select>
                        </div>
                    </section>
                )}

                {/* Centaur Survivor */}
                {previewRace?.index === 'centaur' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Survivor</h4>
                        <select 
                            value={traitSelections['survivor'] || ''}
                            onChange={(e) => setTraitSelections(prev => ({ ...prev, 'survivor': e.target.value }))}
                            className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                        >
                            <option value="">Select a Skill...</option>
                            {["Animal Handling", "Medicine", "Nature", "Survival"].map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </section>
                )}

                {/* Minotaur Imposing Presence */}
                {previewRace?.index === 'minotaur' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Imposing Presence</h4>
                        <select 
                            value={traitSelections['imposing-presence'] || ''}
                            onChange={(e) => setTraitSelections(prev => ({ ...prev, 'imposing-presence': e.target.value }))}
                            className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                        >
                            <option value="">Select a Skill...</option>
                            {["Intimidation", "Persuasion"].map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </section>
                )}

                {/* Leonin Hunter Instincts */}
                {previewRace?.index === 'leonin' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Hunter Instincts</h4>
                        <select 
                            value={traitSelections['hunter-instincts'] || ''}
                            onChange={(e) => setTraitSelections(prev => ({ ...prev, 'hunter-instincts': e.target.value }))}
                            className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                        >
                            <option value="">Select a Skill...</option>
                            {["Athletics", "Intimidation", "Perception", "Survival"].map(skill => <option key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </section>
                )}

                {/* Githyanki Decadent Mastery */}
                {selectedSubrace?.index === 'githyanki' && (
                    <section className="bg-gray-900/20 border border-gray-700/30 p-6 rounded-xl space-y-4">
                        <h4 className="text-xs font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Decadent Mastery</h4>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Skill or Tool Proficiency</label>
                            <select 
                                value={traitSelections['decadent-mastery-skill-tool'] || ''}
                                onChange={(e) => setTraitSelections(prev => ({ ...prev, 'decadent-mastery-skill-tool': e.target.value }))}
                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                            >
                                <option value="">Select a Skill or Tool...</option>
                                <optgroup label="Skills">
                                    {SKILL_LIST.map(skill => <option key={skill.name} value={skill.name}>{skill.name}</option>)}
                                </optgroup>
                                <optgroup label="Tools">
                                    {["Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools", "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools"].map(tool => (
                                        <option key={tool} value={tool}>{tool}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Language</label>
                            <select 
                                value={traitSelections['decadent-mastery-language'] || ''}
                                onChange={(e) => setTraitSelections(prev => ({ ...prev, 'decadent-mastery-language': e.target.value }))}
                                className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                            >
                                <option value="">Select a Language...</option>
                                {LANGUAGE_LIST.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>
                    </section>
                )}

                {previewRace.index === 'half-elf' && (
                    <div className="space-y-8">
                        <section>
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Ability Score Increase</h4>
                            <p className="text-[10px] text-gray-500 mb-4 uppercase font-bold">Charisma +2 (Fixed). Choose two more stats +1.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {ABILITY_NAMES.filter(a => a !== 'cha').map(stat => (
                                    <label key={stat} className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${halfElfAsi.includes(stat) ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg scale-105' : 'bg-gray-800/40 border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={halfElfAsi.includes(stat)}
                                            onChange={() => toggleHalfElfAsi(stat)}
                                            disabled={!halfElfAsi.includes(stat) && halfElfAsi.length >= 2}
                                        />
                                        <span className="font-black uppercase text-[10px] tracking-widest">{stat}</span>
                                        <span className="text-xl font-black mt-1">+1</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-2">Skill Versatility</h4>
                            <p className="text-[10px] text-gray-500 mb-4 uppercase font-bold">Choose 2 skills for proficiency.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {SKILL_LIST.map(skill => (
                                    <label key={skill.name} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-colors ${halfElfSkills.includes(skill.name) ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/20 border-transparent hover:bg-gray-800'}`}>
                                        <input 
                                          type="checkbox" 
                                          checked={halfElfSkills.includes(skill.name)} 
                                          onChange={() => toggleHalfElfSkill(skill.name)}
                                          disabled={!halfElfSkills.includes(skill.name) && halfElfSkills.length >= 2}
                                          className="accent-dnd-gold"
                                        />
                                        <span className="text-xs font-bold">{skill.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {previewRace.language_options > 0 && (
                    <section className="bg-black/20 p-5 rounded-xl border border-gray-800">
                        <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-widest mb-3">
                            Choose {previewRace.language_options} Language(s):
                            <span className={`ml-2 ${chosenLanguages.length === previewRace.language_options ? 'text-green-500' : 'text-dnd-red'}`}>
                                {chosenLanguages.length} / {previewRace.language_options}
                            </span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {LANGUAGE_LIST.map(lang => (
                                <label key={lang} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${chosenLanguages.includes(lang) ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/40 border-transparent hover:bg-gray-800 text-gray-500'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={chosenLanguages.includes(lang)}
                                        onChange={() => toggleLanguage(lang, previewRace.language_options)}
                                        disabled={!chosenLanguages.includes(lang) && chosenLanguages.length >= previewRace.language_options}
                                        className="accent-dnd-gold"
                                    />
                                    <span className="text-[10px] font-bold uppercase">{lang}</span>
                                </label>
                            ))}
                        </div>
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