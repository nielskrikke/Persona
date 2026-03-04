
import React, { useEffect, useState } from 'react';
import { APIReference, ClassDetail, SubclassDetail, CharacterClass } from '../../types';
import { fetchClasses, fetchClassDetail, fetchSubclasses, fetchSubclassDetail } from '../../data/index';

interface ClassStepProps {
  onSelect: (classes: CharacterClass[], skills: string[], tools: string[]) => void;
  initialClasses: CharacterClass[];
  totalLevel: number;
  onBack: () => void;
}

interface DraftClass {
    index: string; 
    name: string;
    level: number;
    subclassIndex?: string; 
    subclass?: SubclassDetail; 
}

const ClassStep: React.FC<ClassStepProps> = ({ onSelect, initialClasses, totalLevel, onBack }) => {
  const [availableClasses, setAvailableClasses] = useState<APIReference[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [draftClasses, setDraftClasses] = useState<DraftClass[]>([]);
  
  // Details Cache
  const [classDetails, setClassDetails] = useState<Record<string, ClassDetail>>({});
  const [subclassOptions, setSubclassOptions] = useState<Record<string, APIReference[]>>({});
  
  // Proficiency Choices State (Indexed by choice index)
  const [chosenProficiencies, setChosenProficiencies] = useState<Record<number, string[]>>({});

  useEffect(() => {
    const load = async () => {
      const results = await fetchClasses();
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
              if (!classDetails[c.definition.index]) {
                  const detail = await fetchClassDetail(c.definition.index);
                  if(detail) setClassDetails(prev => ({...prev, [c.definition.index]: detail}));
                  
                  const subs = await fetchSubclasses(c.definition.index);
                  setSubclassOptions(prev => ({...prev, [c.definition.index]: subs}));
              }
          }
          setDraftClasses(drafts);
      }
      setLoading(false);
    };
    load();
  }, []);

  const fetchClassInfoIfNeeded = async (index: string) => {
      if (!classDetails[index]) {
          const detail = await fetchClassDetail(index);
          if (detail) {
              setClassDetails(prev => ({...prev, [index]: detail}));
              const subs = await fetchSubclasses(index);
              setSubclassOptions(prev => ({...prev, [index]: subs}));
          }
      }
  };

  const addClass = async (index: string, name: string) => {
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
      setDraftClasses(prev => prev.filter(c => c.index !== index));
      if (index === draftClasses[0]?.index) {
          setChosenProficiencies({}); 
      }
  };

  const updateLevel = (index: string, delta: number) => {
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
      const detail = await fetchSubclassDetail(subIndex);
      setDraftClasses(prev => prev.map(c => {
          if (c.index !== classIndex) return c;
          return { ...c, subclassIndex: subIndex, subclass: detail || undefined };
      }));
  };

  const toggleProficiency = (choiceIdx: number, item: string, max: number) => {
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

  const handleConfirm = () => {
      if (draftClasses.length === 0) return;
      const finalClasses: CharacterClass[] = draftClasses.map(d => ({
          definition: classDetails[d.index],
          level: d.level,
          subclass: d.subclass
      }));

      const assigned = draftClasses.reduce((acc, c) => acc + c.level, 0);
      if (assigned !== totalLevel) {
          alert(`You have assigned ${assigned} levels out of ${totalLevel}. Please assign all levels.`);
          return;
      }
      
      const primaryDetail = classDetails[draftClasses[0].index];
      const choices = primaryDetail?.proficiency_choices || [];
      
      // Validation
      for (let i = 0; i < choices.length; i++) {
          const choice = choices[i];
          const selected = chosenProficiencies[i] || [];
          if (selected.length !== choice.choose) {
              alert(`Please select ${choice.choose} options for choice group #${i+1} (${choice.type}).`);
              return;
          }
      }

      // Distribute into Skills vs Tools based on Choice Type or Category
      const selectedSkills: string[] = [];
      const selectedTools: string[] = [];

      choices.forEach((choice, i) => {
          const selected = chosenProficiencies[i] || [];
          selected.forEach(item => {
              if (choice.type === 'proficiencies') {
                  // Heuristic: check if item looks like a skill
                  const isSkill = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]
                      .some(s => item.toLowerCase().includes(s.toLowerCase()));
                  if (isSkill) selectedSkills.push(item.replace("Skill: ", ""));
                  else selectedTools.push(item);
              } else {
                  selectedTools.push(item);
              }
          });
      });

      onSelect(finalClasses, selectedSkills, selectedTools);
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
                       const subs = subclassOptions[draft.index] || [];
                       const needsSubclass = draft.level >= 3 || (['cleric', 'warlock', 'sorcerer'].includes(draft.index) && draft.level >= 1) || (draft.index === 'wizard' && draft.level >= 2) || (draft.index === 'druid' && draft.level >= 2);
                       
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

                               {needsSubclass && (
                                   <div className="mb-6 animate-in fade-in duration-500">
                                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Divine Archetype / Specialization</label>
                                       <select 
                                          value={draft.subclassIndex || ''} 
                                          onChange={(e) => updateSubclass(draft.index, e.target.value)}
                                          className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-dnd-gold outline-none"
                                       >
                                           <option value="">Select Archetype...</option>
                                           {subs.map(s => <option key={s.index} value={s.index}>{s.name}</option>)}
                                       </select>
                                       {draft.subclass && (
                                           <div className="mt-3 bg-[#121316] p-4 rounded-lg border border-gray-700 text-[11px] text-gray-400 leading-relaxed font-serif italic">
                                               {draft.subclass.desc[0]}
                                           </div>
                                       )}
                                   </div>
                               )}

                               {idx === 0 && detail && (
                                   <section className="mt-6 pt-6 border-t border-gray-800 space-y-5">
                                       <div>
                                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Class Proficiencies</h4>
                                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-300 uppercase">
                                            <span className="flex items-center gap-1.5"><span className="text-dnd-gold">◈</span> Hit Die: d{detail.hit_die}</span>
                                            <span className="flex items-center gap-1.5"><span className="text-dnd-gold">◈</span> Saves: {detail.saving_throws.map(s=>s.name).join(', ')}</span>
                                          </div>
                                       </div>
                                       
                                       {detail.proficiency_choices.map((choice, cIdx) => (
                                           <div key={cIdx}>
                                               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                                                  Choose {choice.choose} {choice.type.replace("proficiencies", "Proficiencies")}: 
                                                  <span className={`ml-2 ${(chosenProficiencies[cIdx] || []).length === choice.choose ? 'text-green-500' : 'text-dnd-red'}`}>{(chosenProficiencies[cIdx] || []).length} / {choice.choose}</span>
                                               </h4>
                                               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                   {choice.from.options.map((option, oIdx) => {
                                                       const itemName = (option as any).item?.name || (option as any).name;
                                                       const isSelected = (chosenProficiencies[cIdx] || []).includes(itemName);
                                                       return (
                                                           <label key={oIdx} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${isSelected ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/40 border-transparent hover:bg-gray-800 text-gray-500'}`}>
                                                               <input 
                                                                  type="checkbox" 
                                                                  checked={isSelected}
                                                                  onChange={() => toggleProficiency(cIdx, itemName, choice.choose)}
                                                                  disabled={!isSelected && (chosenProficiencies[cIdx] || []).length >= choice.choose}
                                                                  className="accent-dnd-gold"
                                                               />
                                                               <span className="text-xs font-black uppercase tracking-tight">{itemName.replace("Skill: ", "").replace("Musical Instrument: ", "")}</span>
                                                           </label>
                                                       );
                                                   })}
                                               </div>
                                           </div>
                                       ))}
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
        <div className="max-w-6xl mx-auto flex gap-4">
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
  );
};

export default ClassStep;
