
import React, { useState, useEffect } from 'react';
import { APIReference, BackgroundDetail } from '../../types';
import { fetchBackgrounds, fetchBackgroundDetail } from '../../data/index';
import { STANDARD_LANGUAGES } from '../../data/constants';

const LANGUAGE_LIST = ["Abyssal", "Celestial", "Common", "Deep Speech", "Draconic", "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin", "Halfling", "Infernal", "Orc", "Primordial", "Sylvan", "Undercommon"];

interface BackgroundStepProps {
    onComplete: (name: string, background: BackgroundDetail, extraData: { languages: string[], tools: string[], skills: string[] }) => void;
    onBack: () => void;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({ onComplete, onBack }) => {
    const [name, setName] = useState('');
    const [backgrounds, setBackgrounds] = useState<APIReference[]>([]);
    const [selectedBackground, setSelectedBackground] = useState<BackgroundDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Dynamic Choices State
    const [chosenLanguages, setChosenLanguages] = useState<string[]>([]);
    const [extraPersonalLanguages, setExtraPersonalLanguages] = useState<string[]>([]);
    const [newLangInput, setNewLangInput] = useState('');
    
    // Using an object to store choices per choice group index
    const [choiceSelections, setChoiceSelections] = useState<Record<number, string[]>>({});

    useEffect(() => {
        const load = async () => {
            const results = await fetchBackgrounds();
            setBackgrounds(results);
            setLoading(false);
            if(results.length > 0) {
                 const details = await fetchBackgroundDetail(results[0].index);
                 setSelectedBackground(details);
            }
        };
        load();
    }, []);

    const handleBackgroundSelect = async (index: string) => {
        const detail = await fetchBackgroundDetail(index);
        setSelectedBackground(detail);
        setChosenLanguages([]);
        setChoiceSelections({});
        setValidationError(null);
    };

    const toggleLanguage = (lang: string, max: number) => {
        setValidationError(null);
        if (chosenLanguages.includes(lang)) {
            setChosenLanguages(prev => prev.filter(l => l !== lang));
        } else if (chosenLanguages.length < max) {
            setChosenLanguages(prev => [...prev, lang]);
        }
    };

    const addExtraLanguage = () => {
        if (!newLangInput.trim()) return;
        if (!extraPersonalLanguages.includes(newLangInput.trim())) {
            setExtraPersonalLanguages(prev => [...prev, newLangInput.trim()]);
        }
        setNewLangInput('');
    };

    const removeExtraLanguage = (lang: string) => {
        setExtraPersonalLanguages(prev => prev.filter(l => l !== lang));
    };

    const toggleChoice = (choiceIdx: number, item: string, max: number) => {
        setValidationError(null);
        setChoiceSelections(prev => {
            const current = prev[choiceIdx] || [];
            if (current.includes(item)) {
                return { ...prev, [choiceIdx]: current.filter(i => i !== item) };
            } else if (current.length < max) {
                return { ...prev, [choiceIdx]: [...current, item] };
            }
            return prev;
        });
    };

    const handleSubmit = () => {
        if (!name.trim()) { 
            setValidationError("Please give your character a name."); 
            return; 
        }
        if (!selectedBackground) return;

        const langCount = typeof selectedBackground.languages === 'number' ? selectedBackground.languages : 0;
        if (chosenLanguages.length !== langCount) {
             setValidationError(`Please select ${langCount} additional language(s).`);
             return;
        }

        const choices = selectedBackground.proficiency_choices || [];
        for (let i = 0; i < choices.length; i++) {
            const sel = choiceSelections[i] || [];
            if (sel.length !== choices[i].choose) {
                setValidationError(`Please complete all selections for the ${selectedBackground.name} background.`);
                return;
            }
        }

        setValidationError(null);
        // Segregate choices into Skills and Tools based on item name heuristics
        const extraSkills: string[] = [];
        const extraTools: string[] = [];
        
        (Object.values(choiceSelections).flat() as string[]).forEach((item: string) => {
            if (item.includes("Skill: ")) extraSkills.push(item.replace("Skill: ", ""));
            else if (item.includes("Musical Instrument: ")) extraTools.push(item.replace("Musical Instrument: ", ""));
            else if (item.includes("Gaming Set: ")) extraTools.push(item.replace("Gaming Set: ", ""));
            else {
                // Check against known skill list names as fallback
                const skillNames = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
                if (skillNames.some(s => item.toLowerCase() === s.toLowerCase())) extraSkills.push(item);
                else extraTools.push(item);
            }
        });

        onComplete(name, selectedBackground, { 
            languages: [...chosenLanguages, ...extraPersonalLanguages], 
            tools: extraTools, 
            skills: extraSkills 
        });
    };

    if (loading) return <div className="text-dnd-gold animate-pulse text-center mt-20 font-serif italic text-xl">Writing your history...</div>;

    const extraLanguages = selectedBackground && typeof selectedBackground.languages === 'number' ? selectedBackground.languages : 0;

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* List */}
                <div className="md:col-span-1 bg-[#1b1c20] border border-gray-800 rounded-xl p-5 flex flex-col overflow-hidden shadow-2xl h-[200px] md:h-full">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
                        Select Origin
                    </h3>
                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1 pr-2">
                        {backgrounds.map(bg => (
                            <button
                                key={bg.index}
                                onClick={() => handleBackgroundSelect(bg.index)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                    selectedBackground?.index === bg.index 
                                    ? 'bg-dnd-gold text-black shadow-lg translate-x-1' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                {bg.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Area */}
                <div className="md:col-span-2 bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-6 bg-[#121316] border-b border-gray-800 shrink-0">
                        <h2 className="text-4xl font-serif text-white mb-4">Identity & Origin</h2>
                        
                        <div className="relative">
                            <label className="block text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Character Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0b0c0e] text-white border border-gray-700 rounded-xl p-4 focus:border-dnd-gold outline-none text-2xl font-serif placeholder:text-gray-800 shadow-inner"
                                placeholder="Valen Shadowheart..."
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                        {selectedBackground ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h3 className="text-2xl font-serif text-dnd-gold mb-2">{selectedBackground.name}</h3>
                                <div className="space-y-8">
                                    <section>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 border-b border-gray-800 pb-2">Background Feature: {selectedBackground.feature.name}</span>
                                        <p className="text-gray-300 leading-relaxed font-serif text-lg">{selectedBackground.feature.desc.join(' ')}</p>
                                    </section>

                                    <div className="space-y-6">
                                        <section>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 border-b border-gray-800 pb-2">Skill Proficiencies</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedBackground.skill_proficiencies.map(s => (
                                                    <span key={s} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wider">{s}</span>
                                                ))}
                                                {selectedBackground.skill_proficiencies.length === 0 && !selectedBackground.proficiency_choices && <span className="text-gray-600 italic text-xs">No starting skills.</span>}
                                            </div>
                                        </section>

                                        {selectedBackground.proficiency_choices?.map((choice, cIdx) => (
                                            <section key={cIdx} className="bg-black/20 p-5 rounded-xl border border-gray-800">
                                                <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-widest mb-3">
                                                    Choose {choice.choose} Proficiencies:
                                                    <span className={`ml-2 ${(choiceSelections[cIdx] || []).length === choice.choose ? 'text-green-500' : 'text-dnd-red'}`}>
                                                        {(choiceSelections[cIdx] || []).length} / {choice.choose}
                                                    </span>
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {choice.from.options.map((option, oIdx) => {
                                                        const itemName = option.item.name;
                                                        const isSelected = (choiceSelections[cIdx] || []).includes(itemName);
                                                        return (
                                                            <label key={oIdx} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${isSelected ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/40 border-transparent hover:bg-gray-800 text-gray-500'}`}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isSelected}
                                                                    onChange={() => toggleChoice(cIdx, itemName, choice.choose)}
                                                                    disabled={!isSelected && (choiceSelections[cIdx] || []).length >= choice.choose}
                                                                    className="accent-dnd-gold"
                                                                />
                                                                <span className="text-xs font-black uppercase tracking-tight">
                                                                    {itemName.replace("Skill: ", "").replace("Musical Instrument: ", "").replace("Gaming Set: ", "")}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        ))}

                                        {extraLanguages > 0 && (
                                            <section>
                                                <span className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em] block mb-3 border-b border-dnd-gold/20 pb-2">Background Languages</span>
                                                <p className="text-[9px] text-gray-500 mb-2 uppercase font-bold">Select {extraLanguages} language(s).</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {LANGUAGE_LIST.map(lang => (
                                                        <label key={lang} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${chosenLanguages.includes(lang) ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/20 border-transparent hover:bg-gray-800 text-gray-500'}`}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={chosenLanguages.includes(lang)}
                                                                onChange={() => toggleLanguage(lang, extraLanguages)}
                                                                disabled={!chosenLanguages.includes(lang) && chosenLanguages.length >= extraLanguages}
                                                                className="accent-dnd-gold"
                                                            />
                                                            <span className="text-[10px] font-bold uppercase">{lang}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        <section className="bg-black/40 p-5 rounded-xl border border-gray-800">
                                            <span className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em] block mb-3 border-b border-gray-700 pb-2">Bonus Languages (Custom)</span>
                                            <div className="flex gap-2 mb-4">
                                                <div className="flex-grow relative">
                                                    <input 
                                                        type="text" 
                                                        list="standard-languages-bg"
                                                        value={newLangInput} 
                                                        onChange={e => setNewLangInput(e.target.value)} 
                                                        placeholder="Add language..."
                                                        className="w-full bg-[#0b0c0e] border border-gray-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-dnd-gold"
                                                        onKeyDown={e => e.key === 'Enter' && addExtraLanguage()}
                                                    />
                                                    <datalist id="standard-languages-bg">
                                                        {STANDARD_LANGUAGES.map(l => <option key={l} value={l} />)}
                                                    </datalist>
                                                </div>
                                                <button onClick={addExtraLanguage} className="bg-gray-800 hover:bg-gray-700 px-4 rounded-lg text-xs font-bold uppercase text-white transition-colors">Add</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {extraPersonalLanguages.map(lang => (
                                                    <span key={lang} className="bg-dnd-gold/10 border border-dnd-gold/30 px-3 py-1 rounded-full text-[10px] font-black text-dnd-gold uppercase flex items-center gap-2">
                                                        {lang}
                                                        <button onClick={() => removeExtraLanguage(lang)} className="hover:text-white">&times;</button>
                                                    </span>
                                                ))}
                                                {extraPersonalLanguages.length === 0 && <span className="text-gray-600 italic text-[10px]">Add any other languages your character knows.</span>}
                                            </div>
                                        </section>
                                    </div>

                                    <section className="bg-black/20 p-5 rounded-xl border border-gray-800">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Inherited Belongings</span>
                                        <p className="text-sm text-gray-400 italic mb-3 font-serif">"{selectedBackground.equipment.join(', ')}"</p>
                                        <div className="inline-flex items-center gap-2 bg-dnd-gold/10 border border-dnd-gold/30 px-3 py-1 rounded-full text-[10px] font-black text-dnd-gold uppercase tracking-widest">
                                            Starting Coin: {selectedBackground.currency.gp} gp
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 italic text-center">
                                <span className="text-6xl mb-4 opacity-10">📜</span>
                                <p className="max-w-xs font-serif text-lg">Select a background to establish your hero's roots in the world.</p>
                            </div>
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
                            onClick={handleSubmit}
                            disabled={!name.trim() || !selectedBackground}
                            className={`flex-grow py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-2xl transition-all transform active:scale-95 ${!name.trim() || !selectedBackground ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' : 'bg-dnd-gold hover:bg-yellow-600 text-black'}`}
                        >
                            Finalize Legend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundStep;
