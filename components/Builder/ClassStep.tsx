
import React, { useEffect, useState } from 'react';
import { APIReference, ClassDetail, SubclassDetail, CharacterClass } from '../../types';
import { fetchClasses, fetchClassDetail, fetchSubclasses, fetchSubclassDetail } from '../../data/index';

interface ClassStepProps {
  onSelect: (classes: CharacterClass[], skills: string[], tools: string[], choices: any[]) => void;
  initialClasses: CharacterClass[];
  totalLevel: number;
  onBack: () => void;
  currentSkills: string[];
  currentTools: string[];
  userId?: string;
}

interface DraftClass {
    index: string; 
    name: string;
    level: number;
    subclassIndex?: string; 
    subclass?: SubclassDetail; 
}

const ClassStep: React.FC<ClassStepProps> = ({ onSelect, initialClasses, totalLevel, onBack, currentSkills, currentTools, userId }) => {
  const [availableClasses, setAvailableClasses] = useState<APIReference[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [draftClasses, setDraftClasses] = useState<DraftClass[]>([]);
  
  // Details Cache
  const [classDetails, setClassDetails] = useState<Record<string, ClassDetail>>({});
  const [subclassOptions, setSubclassOptions] = useState<Record<string, APIReference[]>>({});
  
  // Proficiency Choices State (Indexed by choice index)
  const [chosenProficiencies, setChosenProficiencies] = useState<Record<number, string[]>>({});
  
  // Feature Choices State: { classIndex: { featureIndex: [selectedOptions] } }
  const [featureChoices, setFeatureChoices] = useState<Record<string, Record<string, string[]>>>({});
  
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const results = await fetchClasses(userId);
      setAvailableClasses(results);

      if (initialClasses && initialClasses.length > 0) {
          const drafts: DraftClass[] = [];
          for (const c of initialClasses) {
              drafts.push({
                  index: c.definition.index,
                  name: c.definition.name,
                  level: c.level,
                  subclassIndex: c.subclass?.index,
                  subclass: c.subclass
              });
              
              if (c.featureChoices) {
                  setFeatureChoices(prev => ({
                      ...prev,
                      [c.definition.index]: c.featureChoices || {}
                  }));
              }

              if (!classDetails[c.definition.index]) {
                  const detail = await fetchClassDetail(c.definition.index, userId);
                  if(detail) setClassDetails(prev => ({...prev, [c.definition.index]: detail}));
                  
                  const subs = await fetchSubclasses(c.definition.index, userId);
                  setSubclassOptions(prev => ({...prev, [c.definition.index]: subs}));
              }
          }
          setDraftClasses(drafts);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const fetchClassInfoIfNeeded = async (index: string) => {
      if (!classDetails[index]) {
          const detail = await fetchClassDetail(index, userId);
          if (detail) {
              setClassDetails(prev => ({...prev, [index]: detail}));
              const subs = await fetchSubclasses(index, userId);
              setSubclassOptions(prev => ({...prev, [index]: subs}));
          }
      }
  };

  const addClass = async (index: string, name: string) => {
      setValidationError(null);
      if (draftClasses.some(c => c.index === index)) return;
      const currentAssigned = draftClasses.reduce((acc, c) => acc + c.level, 0);
      if (currentAssigned >= totalLevel) return;

      const newDraft = { index, name, level: 1 };
      setDraftClasses([...draftClasses, newDraft]);
      await fetchClassInfoIfNeeded(index);
      
      if (draftClasses.length === 0) {
          setChosenProficiencies({});
      }
  };

  const removeClass = (index: string) => {
      setValidationError(null);
      setDraftClasses(prev => prev.filter(c => c.index !== index));
      if (index === draftClasses[0]?.index) {
          setChosenProficiencies({}); 
      }
  };

  const updateLevel = (index: string, delta: number) => {
      setValidationError(null);
      const currentAssigned = draftClasses.reduce((acc, c) => acc + c.level, 0);
      setDraftClasses(prev => prev.map(c => {
          if (c.index !== index) return c;
          const newLvl = c.level + delta;
          if (newLvl < 1) return c;
          if (delta > 0 && currentAssigned >= totalLevel) return c; 
          return { ...c, level: newLvl };
      }));
  };

  const updateSubclass = async (classIndex: string, subIndex: string) => {
      setValidationError(null);
      const detail = await fetchSubclassDetail(subIndex, userId);
      setDraftClasses(prev => prev.map(c => {
          if (c.index !== classIndex) return c;
          return { ...c, subclassIndex: subIndex, subclass: detail || undefined };
      }));
  };

  const toggleProficiency = (choiceIdx: number, item: string, max: number) => {
      setValidationError(null);
      setChosenProficiencies(prev => {
          const current = prev[choiceIdx] || [];
          if (current.includes(item)) {
              return { ...prev, [choiceIdx]: current.filter(i => i !== item) };
          } else if (current.length < max) {
              return { ...prev, [choiceIdx]: [...current, item] };
          }
          return prev;
      });
  };

  const handleFeatureChoice = (classIndex: string, featureIndex: string, option: string, count: number) => {
      setFeatureChoices(prev => {
          const classChoices = prev[classIndex] || {};
          const currentOptions = classChoices[featureIndex] || [];
          
          let newOptions;
          if (currentOptions.includes(option)) {
              newOptions = currentOptions.filter(o => o !== option);
          } else {
              if (count === 1) {
                  newOptions = [option];
              } else if (currentOptions.length < count) {
                  newOptions = [...currentOptions, option];
              } else {
                  newOptions = [...currentOptions.slice(1), option];
              }
          }
          
          return {
              ...prev,
              [classIndex]: {
                  ...classChoices,
                  [featureIndex]: newOptions
              }
          };
      });
  };

  const getAvailableExpertiseOptions = (classIndex: string) => {
      const raceSkills = currentSkills || [];
      let classSkills: string[] = [];
      if (draftClasses[0]?.index === classIndex) {
          const primaryDetail = classDetails[classIndex];
          const choices = primaryDetail?.proficiency_choices || [];
          choices.forEach((choice, i) => {
              if (choice.type === 'proficiencies') {
                  const selected = chosenProficiencies[i] || [];
                  selected.forEach(item => {
                       const isSkill = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]
                          .some(s => item.toLowerCase().includes(s.toLowerCase()));
                      if (isSkill) classSkills.push(item.replace("Skill: ", ""));
                  });
              }
          });
      }
      return Array.from(new Set([...raceSkills, ...classSkills]));
  };

  const handleConfirm = () => {
      if (draftClasses.length === 0) return;
      const finalClasses: CharacterClass[] = draftClasses.map(d => ({
          definition: classDetails[d.index],
          level: d.level,
          subclass: d.subclass || null,
          featureChoices: featureChoices[d.index]
      }));

      const assigned = draftClasses.reduce((acc, c) => acc + c.level, 0);
      if (assigned !== totalLevel) {
          setValidationError(`You have assigned ${assigned} levels out of ${totalLevel}. Please assign all levels.`);
          return;
      }
      
      setValidationError(null);
      
      const levelChoices: any[] = [];
      
      // Subclasses
      draftClasses.forEach(draft => {
          if (draft.subclass) {
              levelChoices.push({
                  id: `class-subclass-${draft.index}`,
                  level: 1, 
                  source: draft.name,
                  type: 'subclass',
                  label: 'Subclass',
                  value: [draft.subclass.name],
                  options: subclassOptions[draft.index]?.map(s => s.name) || [],
                  count: 1
              });
          }
      });

      onSelect(finalClasses, [], [], levelChoices);
  };

  const currentAssigned = draftClasses.reduce((acc, c) => acc + c.level, 0);
  const primaryClass = draftClasses[0] ? classDetails[draftClasses[0].index] : null;

  if (loading) return <div className="text-dnd-gold animate-pulse text-center mt-20 font-serif italic text-xl">Consulting class scrolls...</div>;

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Selection Area */}
        <div className="md:col-span-1 bg-[#1b1c20] border border-gray-800 rounded-xl p-5 flex flex-col overflow-hidden shadow-2xl h-[250px] md:h-full">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
            Class Library
          </h3>
          <div className="space-y-1.5 flex-grow overflow-y-auto custom-scrollbar pr-2">
            {availableClasses.map((cls) => {
               const isSelected = draftClasses.some(d => d.index === cls.index);
               return (
                  <button 
                      key={cls.index}
                      onClick={() => addClass(cls.index, cls.name)}
                      disabled={isSelected || currentAssigned >= totalLevel}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex justify-between items-center ${
                          isSelected 
                          ? 'bg-blue-900/20 text-blue-300 border border-blue-900' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
                      } disabled:opacity-50`}
                  >
                      <span>{cls.name}</span>
                      {isSelected && <span className="text-[10px] uppercase font-black tracking-tighter opacity-50">Added</span>}
                  </button>
               );
            })}
          </div>
        </div>

        {/* Configuration area */}
        <div className="md:col-span-2 bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
           <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center shrink-0">
               <div>
                   <h2 className="text-4xl font-serif text-white mb-1">Configuration</h2>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="text-gray-500">Allocation:</span>
                        <span className={currentAssigned === totalLevel ? 'text-green-500' : 'text-dnd-red'}>{currentAssigned} / {totalLevel}</span>
                   </div>
               </div>
               {draftClasses.length > 0 && (
                   <div className="bg-dnd-gold text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-md">
                       Primary: {draftClasses[0].name}
                   </div>
               )}
           </div>

           <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
               {draftClasses.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 text-gray-600 italic text-center">
                       <span className="text-6xl mb-4 opacity-10">⚔️</span>
                       <p className="max-w-xs font-serif text-lg">Choose a class from the list to begin shaping your hero's path.</p>
                   </div>
               ) : (
                   draftClasses.map((draft, idx) => {
                       const detail = classDetails[draft.index];
                       
                       return (
                           <div key={draft.index} className="bg-black/20 border border-gray-800 rounded-xl p-5 relative animate-in slide-in-from-right-4 duration-300">
                               <button 
                                  onClick={() => removeClass(draft.index)} 
                                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl transition-colors font-light"
                               >
                                  &times;
                                </button>
                               
                               <div className="flex justify-between items-center mb-6">
                                   <div>
                                      <h3 className="text-2xl font-serif text-white">{draft.name}</h3>
                                      {idx === 0 && <span className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Origin Class</span>}
                                   </div>
                                   <div className="flex items-center gap-3 bg-[#0b0c0e] border border-gray-800 rounded-full px-4 py-2 mr-8">
                                       <button onClick={() => updateLevel(draft.index, -1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors">-</button>
                                       <div className="flex flex-col items-center min-w-[30px]">
                                          <span className="text-[9px] font-black text-gray-500 uppercase leading-none mb-0.5">Lvl</span>
                                          <span className="text-lg font-black text-white leading-none">{draft.level}</span>
                                       </div>
                                       <button onClick={() => updateLevel(draft.index, 1)} disabled={currentAssigned >= totalLevel} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-30">+</button>
                                   </div>
                               </div>

                                {idx === 0 && detail && (
                                   <section className="mt-6 pt-6 border-t border-gray-800 space-y-5">
                                        {detail.spellcasting && (
                                            <div className="flex items-center gap-2 mb-4 p-2 bg-purple-900/10 border border-purple-900/30 rounded-lg">
                                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Spellcasting Ability:</span>
                                                <span className="text-xs font-bold text-white">{detail.spellcasting.spellcasting_ability.name}</span>
                                            </div>
                                        )}
                                        
                                       <div>
                                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Class Proficiencies</h4>
                                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-300 uppercase">
                                            <span className="flex items-center gap-1.5"><span className="text-dnd-gold">◈</span> Hit Die: d{detail.hit_die}</span>
                                            <span className="flex items-center gap-1.5"><span className="text-dnd-gold">◈</span> Saves: {detail.saving_throws.map(s=>s.name).join(', ')}</span>
                                          </div>
                                          <p className="text-[10px] text-gray-500 mt-2 italic">Skill and tool proficiencies will be selected in the Level Advancement steps.</p>
                                       </div>
                                   </section>
                               )}
                           </div>
                       );
                   })
               )}
           </div>
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
                    className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl"
                >
                    &larr; Back
                </button>
                <button 
                    onClick={handleConfirm}
                    disabled={currentAssigned !== totalLevel || draftClasses.length === 0}
                    className={`flex-grow py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-2xl transition-all transform active:scale-95 ${currentAssigned !== totalLevel || draftClasses.length === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' : 'bg-dnd-gold hover:bg-yellow-600 text-black'}`}
                >
                    Confirm Path
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClassStep;
