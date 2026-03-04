
import React, { useState } from 'react';
import { SpellDetail, ABILITY_NAMES } from '@/types';
import { SPELL_SCHOOLS } from '../../../data/constants';

const CustomSpellModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (spell: SpellDetail) => void }) => {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(0);
    const [school, setSchool] = useState('Evocation');
    const [castingTime, setCastingTime] = useState('1 Action');
    const [isRitual, setIsRitual] = useState(false);
    const [range, setRange] = useState('60 feet');
    const [duration, setDuration] = useState('Instantaneous');
    const [components, setComponents] = useState<string[]>(['V', 'S']);
    const [material, setMaterial] = useState('');
    const [concentration, setConcentration] = useState(false);
    const [description, setDescription] = useState('');
    const [higherLevel, setHigherLevel] = useState('');
    
    // Mechanics
    const [hasAttack, setHasAttack] = useState(false);
    const [attackType, setAttackType] = useState('ranged');
    const [hasSave, setHasSave] = useState(false);
    const [saveType, setSaveType] = useState('DEX');
    const [damageFormula, setDamageFormula] = useState('');
    const [damageType, setDamageType] = useState('Force');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name) { alert("Spells require a name to be woven into existence."); return; }
        
        let finalCastingTime = castingTime;
        if (isRitual) {
            finalCastingTime = `${castingTime} (Ritual: +10 mins)`;
        }

        const newSpell: SpellDetail = {
            index: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
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

        onSave(newSpell);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-4xl shadow-2xl flex flex-col my-auto max-h-[95vh]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#121316] rounded-t-xl shrink-0">
                    <h2 className="text-3xl font-serif text-dnd-gold">Weave Custom Spell</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors">&times;</button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
                    {/* Identity & Execution */}
                    <div className="space-y-8">
                        <section className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Core Identity</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Spell Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chronos Burst" className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none transition-all placeholder:text-gray-700" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Level</label>
                                        <select value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none">
                                            <option value={0}>Cantrip</option>
                                            {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">School</label>
                                        <select value={school} onChange={e => setSchool(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-dnd-gold outline-none">
                                            {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Execution</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Base Casting Time</label>
                                    <input type="text" value={castingTime} onChange={e => setCastingTime(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white outline-none focus:border-dnd-gold" list="cast-times" />
                                    <datalist id="cast-times">
                                        <option value="1 Action" /><option value="1 Bonus Action" /><option value="1 Reaction" /><option value="1 Minute" /><option value="10 Minutes" /><option value="1 Hour" />
                                    </datalist>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Range</label>
                                    <input type="text" value={range} onChange={e => setRange(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white outline-none focus:border-dnd-gold" list="ranges" />
                                    <datalist id="ranges">
                                        <option value="Self" /><option value="Touch" /><option value="30 feet" /><option value="60 feet" /><option value="120 feet" /><option value="Sight" />
                                    </datalist>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Duration</label>
                                    <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white outline-none focus:border-dnd-gold" list="durations" />
                                    <datalist id="durations">
                                        <option value="Instantaneous" /><option value="1 Round" /><option value="1 Minute" /><option value="10 Minutes" /><option value="1 Hour" /><option value="8 Hours" />
                                    </datalist>
                                </div>
                                <div className="flex flex-col gap-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${concentration ? 'bg-blue-600 border-blue-500' : 'bg-black/40 border-gray-700 group-hover:border-gray-500'}`}>
                                            {concentration && <span className="text-[10px] text-white">✓</span>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={concentration} onChange={e => setConcentration(e.target.checked)} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Concentration</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isRitual ? 'bg-yellow-600 border-yellow-500' : 'bg-black/40 border-gray-700 group-hover:border-gray-500'}`}>
                                            {isRitual && <span className="text-[10px] text-white">✓</span>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={isRitual} onChange={e => setIsRitual(e.target.checked)} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ritual</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Components</h3>
                            <div className="flex gap-4">
                                {['V', 'S', 'M'].map(comp => (
                                    <label key={comp} className={`flex-1 p-3 rounded-lg border text-center font-bold transition-all cursor-pointer ${components.includes(comp) ? 'bg-dnd-red border-dnd-red text-white shadow-lg' : 'bg-black/40 border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        <input type="checkbox" className="hidden" checked={components.includes(comp)} onChange={() => setComponents(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])} />
                                        {comp}
                                    </label>
                                ))}
                            </div>
                            {components.includes('M') && (
                                <textarea value={material} onChange={e => setMaterial(e.target.value)} placeholder="Material component description (e.g. a pinch of diamond dust worth 50gp)..." className="w-full bg-black/40 border border-gray-700 rounded p-3 text-xs text-white outline-none h-20 focus:border-dnd-gold transition-all" />
                            )}
                        </section>
                    </div>

                    {/* Mechanics & Lore */}
                    <div className="space-y-8">
                        <section className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Lore & Description</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Spell Effect</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the magical effect of this spell..." className="w-full bg-black/40 border border-gray-700 rounded p-3 text-xs text-white outline-none h-40 custom-scrollbar focus:border-dnd-gold transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">At Higher Levels</label>
                                    <textarea value={higherLevel} onChange={e => setHigherLevel(e.target.value)} placeholder="Describe how the spell scales with slot levels..." className="w-full bg-black/40 border border-gray-700 rounded p-3 text-[10px] text-gray-300 outline-none h-20 focus:border-dnd-gold transition-all" />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 pb-2">Mechanics</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="p-4 bg-black/20 border border-gray-800 rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${hasAttack ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-700 group-hover:border-gray-500'}`}>
                                                {hasAttack && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={hasAttack} onChange={e => setHasAttack(e.target.checked)} />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Spell Attack</span>
                                        </label>
                                        {hasAttack && (
                                            <select value={attackType} onChange={e => setAttackType(e.target.value)} className="bg-black/60 border border-gray-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-dnd-gold">
                                                <option value="ranged">Ranged</option>
                                                <option value="melee">Melee</option>
                                            </select>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${hasSave ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-700 group-hover:border-gray-500'}`}>
                                                {hasSave && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={hasSave} onChange={e => setHasSave(e.target.checked)} />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Saving Throw</span>
                                        </label>
                                        {hasSave && (
                                            <select value={saveType} onChange={e => setSaveType(e.target.value)} className="bg-black/60 border border-gray-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-dnd-gold">
                                                {ABILITY_NAMES.map(a => <option key={a} value={a.toUpperCase()}>{a.toUpperCase()}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Base Damage / Healing</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={damageFormula} onChange={e => setDamageFormula(e.target.value)} placeholder="e.g. 2d8 + 3" className="w-2/3 bg-black/40 border border-gray-700 rounded p-3 text-white text-sm outline-none focus:border-dnd-gold transition-all" />
                                        <select value={damageType} onChange={e => setDamageType(e.target.value)} className="w-1/3 bg-black/40 border border-gray-700 rounded p-2 text-[10px] text-white outline-none focus:border-dnd-gold">
                                            {["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Healing", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <p className="text-[9px] text-gray-500 italic">Damage automatically scales: by character level for cantrips, by slot level for spells.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-8 bg-[#121316] border-t border-gray-800 flex justify-between rounded-b-xl shrink-0">
                    <button onClick={onClose} className="px-8 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs tracking-[0.2em] transition-colors">Discard</button>
                    <button onClick={handleSubmit} className="px-12 py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase text-sm tracking-widest rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all transform active:scale-95">Inscribe Spell</button>
                </div>
            </div>
        </div>
    );
};

export default CustomSpellModal;
