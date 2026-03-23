
import React, { useState, useEffect } from 'react';
import { SpellDetail, ABILITY_NAMES } from '@/types';
import { SPELL_SCHOOLS } from '../../../data/constants';
import { Save, Sparkles, X, Wand2, Shield, Sword, Zap } from 'lucide-react';
import { saveHomebrew } from '../../../services/supabase';

const CustomSpellModal = ({ isOpen, onClose, onSave, currentUser, initialSpell }: { isOpen: boolean, onClose: () => void, onSave: (spell: SpellDetail) => void, currentUser?: any, initialSpell?: SpellDetail | null }) => {
    const [name, setName] = useState(initialSpell?.name || '');
    const [level, setLevel] = useState(initialSpell?.level || 0);
    const [school, setSchool] = useState(initialSpell?.school?.name || 'Evocation');
    const [castingTime, setCastingTime] = useState(initialSpell?.casting_time || '1 Action');
    const [isRitual, setIsRitual] = useState(initialSpell?.ritual || false);
    const [range, setRange] = useState(initialSpell?.range || '60 feet');
    const [duration, setDuration] = useState(initialSpell?.duration || 'Instantaneous');
    const [components, setComponents] = useState<string[]>(initialSpell?.components || ['V', 'S']);
    const [material, setMaterial] = useState(initialSpell?.material || '');
    const [concentration, setConcentration] = useState(initialSpell?.concentration || false);
    const [description, setDescription] = useState(Array.isArray(initialSpell?.desc) ? initialSpell.desc.join('\n') : initialSpell?.desc || '');
    const [higherLevel, setHigherLevel] = useState(Array.isArray(initialSpell?.higher_level) ? initialSpell.higher_level.join('\n') : initialSpell?.higher_level || '');
    const [isSavingToHomebrew, setIsSavingToHomebrew] = useState(false);
    const [isSharedGlobally, setIsSharedGlobally] = useState(false);
    
    // Mechanics
    const [hasAttack, setHasAttack] = useState(!!initialSpell?.attack_type);
    const [attackType, setAttackType] = useState(initialSpell?.attack_type || 'ranged');
    const [hasSave, setHasSave] = useState(!!initialSpell?.dc);
    const [saveType, setSaveType] = useState(initialSpell?.dc?.dc_type?.name?.toUpperCase() || 'DEX');
    
    const getInitialDamage = () => {
        if (!initialSpell?.damage) return '';
        const damageAtLevel = initialSpell.level === 0 ? initialSpell.damage.damage_at_character_level : initialSpell.damage.damage_at_slot_level;
        if (!damageAtLevel) return '';
        const levelKey = initialSpell.level === 0 ? '1' : initialSpell.level.toString();
        return damageAtLevel[levelKey] || '';
    };

    const [damageFormula, setDamageFormula] = useState(getInitialDamage());
    const [damageType, setDamageType] = useState(initialSpell?.damage?.damage_type?.name || 'Force');

    // Reset state when initialSpell changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setName(initialSpell?.name || '');
            setLevel(initialSpell?.level || 0);
            setSchool(initialSpell?.school?.name || 'Evocation');
            setCastingTime(initialSpell?.casting_time || '1 Action');
            setIsRitual(initialSpell?.ritual || false);
            setRange(initialSpell?.range || '60 feet');
            setDuration(initialSpell?.duration || 'Instantaneous');
            setComponents(initialSpell?.components || ['V', 'S']);
            setMaterial(initialSpell?.material || '');
            setConcentration(initialSpell?.concentration || false);
            setDescription(Array.isArray(initialSpell?.desc) ? initialSpell.desc.join('\n') : initialSpell?.desc || '');
            setHigherLevel(Array.isArray(initialSpell?.higher_level) ? initialSpell.higher_level.join('\n') : initialSpell?.higher_level || '');
            setHasAttack(!!initialSpell?.attack_type);
            setAttackType(initialSpell?.attack_type || 'ranged');
            setHasSave(!!initialSpell?.dc);
            setSaveType(initialSpell?.dc?.dc_type?.name?.toUpperCase() || 'DEX');
            setDamageFormula(getInitialDamage());
            setDamageType(initialSpell?.damage?.damage_type?.name || 'Force');
        }
    }, [isOpen, initialSpell]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!name) { alert("Spells require a name to be woven into existence."); return; }
        
        let finalCastingTime = castingTime;
        if (isRitual) {
            finalCastingTime = `${castingTime} (Ritual: +10 mins)`;
        }

        const newSpell: SpellDetail = {
            index: `custom-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name,
            level,
            school: { name: school, index: school.toLowerCase() },
            casting_time: finalCastingTime,
            range,
            duration: (concentration ? "Concentration, " : "") + duration,
            components,
            material: components.includes('M') ? material : undefined,
            ritual: isRitual,
            concentration,
            desc: [description],
            higher_level: higherLevel ? [higherLevel] : undefined,
            classes: [],
            isCustom: true,
            isPrepared: true
        };

        if (hasAttack) newSpell.attack_type = attackType;
        if (hasSave) newSpell.dc = { dc_type: { name: saveType, index: saveType.toLowerCase() }, dc_success: "half" };
        
        if (damageFormula) {
            newSpell.damage = {
                damage_type: { name: damageType, index: damageType.toLowerCase() },
                [level === 0 ? "damage_at_character_level" : "damage_at_slot_level"]: {
                    [level === 0 ? "1" : level.toString()]: damageFormula
                }
            };
        }

        // Save to Homebrew Forge if toggled
        if (isSavingToHomebrew && currentUser) {
            try {
                await saveHomebrew('custom_spells', currentUser.id, newSpell, isSharedGlobally);
            } catch (err) {
                console.error("Failed to save spell to Homebrew Forge:", err);
            }
        }

        onSave(newSpell);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[500] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1b1c20] border border-gray-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                            <Wand2 className="text-dnd-gold" size={24} />
                            Weave Custom Spell
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Define a new magical effect for your character
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 bg-[#1b1c20] custom-scrollbar">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column: Identity & Execution */}
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Core Identity</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Spell Name</label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                            placeholder="e.g. Chronos Burst" 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all placeholder:text-gray-700" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Level</label>
                                            <select 
                                                value={level} 
                                                onChange={e => setLevel(parseInt(e.target.value))} 
                                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                            >
                                                <option value={0}>Cantrip</option>
                                                {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">School</label>
                                            <select 
                                                value={school} 
                                                onChange={e => setSchool(e.target.value)} 
                                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                            >
                                                {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Execution</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Casting Time</label>
                                        <input 
                                            type="text" 
                                            value={castingTime} 
                                            onChange={e => setCastingTime(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-dnd-gold/50" 
                                            list="cast-times" 
                                        />
                                        <datalist id="cast-times">
                                            <option value="1 Action" /><option value="1 Bonus Action" /><option value="1 Reaction" /><option value="1 Minute" /><option value="10 Minutes" /><option value="1 Hour" />
                                        </datalist>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Range</label>
                                        <input 
                                            type="text" 
                                            value={range} 
                                            onChange={e => setRange(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-dnd-gold/50" 
                                            list="ranges" 
                                        />
                                        <datalist id="ranges">
                                            <option value="Self" /><option value="Touch" /><option value="30 feet" /><option value="60 feet" /><option value="120 feet" /><option value="Sight" />
                                        </datalist>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Duration</label>
                                        <input 
                                            type="text" 
                                            value={duration} 
                                            onChange={e => setDuration(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-dnd-gold/50" 
                                            list="durations" 
                                        />
                                        <datalist id="durations">
                                            <option value="Instantaneous" /><option value="1 Round" /><option value="1 Minute" /><option value="10 Minutes" /><option value="1 Hour" /><option value="8 Hours" />
                                        </datalist>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${concentration ? 'bg-blue-600 border-blue-500' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                                {concentration && <div className="w-2 h-2 bg-white rounded-sm" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={concentration} onChange={e => setConcentration(e.target.checked)} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Concentration</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isRitual ? 'bg-yellow-600 border-yellow-500' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                                {isRitual && <div className="w-2 h-2 bg-white rounded-sm" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={isRitual} onChange={e => setIsRitual(e.target.checked)} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ritual</span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Components</h3>
                                <div className="flex gap-3">
                                    {['V', 'S', 'M'].map(comp => (
                                        <label key={comp} className={`flex-1 p-3 rounded-xl border text-center font-black transition-all cursor-pointer ${components.includes(comp) ? 'bg-dnd-gold border-dnd-gold text-black shadow-lg' : 'bg-black/40 border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                                            <input type="checkbox" className="hidden" checked={components.includes(comp)} onChange={() => setComponents(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])} />
                                            {comp}
                                        </label>
                                    ))}
                                </div>
                                {components.includes('M') && (
                                    <textarea 
                                        value={material} 
                                        onChange={e => setMaterial(e.target.value)} 
                                        placeholder="Material component description..." 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs text-white outline-none h-20 focus:border-dnd-gold/50 transition-all resize-none" 
                                    />
                                )}
                            </section>
                        </div>

                        {/* Right Column: Mechanics & Lore */}
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Lore & Description</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Spell Effect</label>
                                        <textarea 
                                            value={description} 
                                            onChange={e => setDescription(e.target.value)} 
                                            placeholder="Describe the magical effect..." 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-sm text-white outline-none h-40 custom-scrollbar focus:border-dnd-gold/50 transition-all resize-none font-serif leading-relaxed" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">At Higher Levels</label>
                                        <textarea 
                                            value={higherLevel} 
                                            onChange={e => setHigherLevel(e.target.value)} 
                                            placeholder="Describe scaling..." 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 outline-none h-20 focus:border-dnd-gold/50 transition-all resize-none font-serif italic" 
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Mechanics</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-black/20 border border-gray-800 rounded-xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${hasAttack ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                                    {hasAttack && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                                </div>
                                                <input type="checkbox" className="hidden" checked={hasAttack} onChange={e => setHasAttack(e.target.checked)} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Spell Attack</span>
                                            </label>
                                            {hasAttack && (
                                                <select value={attackType} onChange={e => setAttackType(e.target.value)} className="bg-black/60 border border-gray-700 rounded px-3 py-1 text-[10px] text-white outline-none focus:border-dnd-gold/50">
                                                    <option value="ranged">Ranged</option>
                                                    <option value="melee">Melee</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${hasSave ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                                    {hasSave && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                                </div>
                                                <input type="checkbox" className="hidden" checked={hasSave} onChange={e => setHasSave(e.target.checked)} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Saving Throw</span>
                                            </label>
                                            {hasSave && (
                                                <select value={saveType} onChange={e => setSaveType(e.target.value)} className="bg-black/60 border border-gray-700 rounded px-3 py-1 text-[10px] text-white outline-none focus:border-dnd-gold/50">
                                                    {ABILITY_NAMES.map(a => <option key={a} value={a.toUpperCase()}>{a.toUpperCase()}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Base Damage / Healing</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={damageFormula} 
                                                onChange={e => setDamageFormula(e.target.value)} 
                                                placeholder="e.g. 2d8 + 3" 
                                                className="w-2/3 bg-black/40 border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-dnd-gold/50 transition-all font-mono" 
                                            />
                                            <select 
                                                value={damageType} 
                                                onChange={e => setDamageType(e.target.value)} 
                                                className="w-1/3 bg-black/40 border border-gray-800 rounded-xl p-2 text-[10px] text-white outline-none focus:border-dnd-gold/50"
                                            >
                                                {["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Healing", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <p className="text-[9px] text-gray-600 uppercase font-black italic">Damage scales by character level for cantrips, by slot level for spells.</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#121316] border-t border-gray-800 flex flex-col items-center gap-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <label className="flex items-center gap-3 cursor-pointer group bg-black/40 border border-gray-800 px-6 py-3 rounded-full hover:border-dnd-gold/50 transition-all">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSavingToHomebrew ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-800 group-hover:border-gray-500'}`}>
                                {isSavingToHomebrew && <Save size={12} className="text-black" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isSavingToHomebrew} onChange={e => setIsSavingToHomebrew(e.target.checked)} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Save to Homebrew Forge Archive</span>
                        </label>

                        {isSavingToHomebrew && (
                            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-gray-800 animate-in fade-in zoom-in duration-200">
                                <button 
                                    type="button"
                                    onClick={() => setIsSharedGlobally(false)}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${!isSharedGlobally ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Personal
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsSharedGlobally(true)}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${isSharedGlobally ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Global
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between w-full">
                        <button 
                            onClick={onClose} 
                            className="px-8 py-3 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
                        >
                            Discard
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            className="px-12 py-4 bg-dnd-gold hover:bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl shadow-2xl transition-all flex items-center gap-3"
                        >
                            <Sparkles size={18} />
                            Inscribe Spell
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomSpellModal;
