import React, { useState, useEffect } from 'react';
import { saveHomebrew, loadHomebrew } from '../../services/supabase';
import { ABILITY_NAMES, ABILITY_LABELS, APIReference, SpellDetail, EquipmentDetail } from '../../types';
import { SKILL_LIST } from '../../utils/rules';
import { SPELL_SCHOOLS } from '../../data/constants';

interface HomebrewManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any;
}

// Sub-component for adding "Mechanics" to any feature or trait
const EffectEditor = ({ effects, onChange }: { effects: any[], onChange: (newEffects: any[]) => void }) => {
    const addEffect = () => onChange([...effects, { type: 'feature', name: '', description: '' }]);
    const removeEffect = (i: number) => onChange(effects.filter((_, idx) => idx !== i));
    const updateEffect = (i: number, updates: any) => onChange(effects.map((e, idx) => idx === i ? { ...e, ...updates } : e));

    return (
        <div className="space-y-3 bg-black/40 p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mechanical Effects</span>
                <button type="button" onClick={addEffect} className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">+ Add Logic</button>
            </div>
            {effects.map((eff, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start border-b border-gray-800 pb-3 last:border-0">
                    <select 
                        value={eff.type} 
                        onChange={e => updateEffect(i, { type: e.target.value })}
                        className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white"
                    >
                        <option value="feature">General Feature</option>
                        <option value="stat_bonus">Stat Bonus (Flat)</option>
                        <option value="resistance">Resistance</option>
                        <option value="immunity">Immunity</option>
                        <option value="bonus_action">Bonus Action</option>
                        <option value="reaction">Reaction</option>
                        <option value="proficiency">Proficiency</option>
                    </select>

                    {eff.type === 'stat_bonus' && (
                        <>
                            <select value={eff.stat} onChange={e => updateEffect(i, { stat: e.target.value })} className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white">
                                <option value="ac">AC</option>
                                <option value="speed">Speed</option>
                                <option value="hp_per_level">HP per Lvl</option>
                                <option value="initiative">Initiative</option>
                                <option value="str">Strength</option>
                                <option value="dex">Dexterity</option>
                                <option value="con">Constitution</option>
                                <option value="int">Intelligence</option>
                                <option value="wis">Wisdom</option>
                                <option value="cha">Charisma</option>
                            </select>
                            <input type="number" placeholder="Value" value={eff.value} onChange={e => updateEffect(i, { value: parseInt(e.target.value) })} className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                        </>
                    )}

                    {eff.type === 'resistance' && (
                        <input type="text" placeholder="Type (e.g. Fire)" value={eff.value} onChange={e => updateEffect(i, { value: e.target.value })} className="col-span-2 bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                    )}

                    {eff.type !== 'stat_bonus' && eff.type !== 'resistance' && (
                        <input type="text" placeholder="Detail" value={eff.name} onChange={e => updateEffect(i, { name: e.target.value })} className="col-span-2 bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                    )}

                    <button type="button" onClick={() => removeEffect(i)} className="text-red-500 text-xs hover:text-red-400 mt-1">Remove Effect</button>
                </div>
            ))}
        </div>
    );
};

const HomebrewManagerModal: React.FC<HomebrewManagerModalProps> = ({ isOpen, onClose, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item'>('race');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [list, setList] = useState<any[]>([]);

    // --- FORM STATES ---
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Race Forge
    const [speeds, setSpeeds] = useState({ walk: 30, fly: 0, swim: 0, climb: 0 });
    const [size, setSize] = useState('Medium');
    const [abilityBonuses, setAbilityBonuses] = useState<{ stat: string, bonus: number }[]>([]);
    const [traits, setTraits] = useState<{ name: string, desc: string, effects: any[] }[]>([]);

    // Class Forge
    const [hitDie, setHitDie] = useState(8);
    const [saves, setSaves] = useState<string[]>([]);
    const [casterType, setCasterType] = useState<'none' | 'full' | 'half' | 'third' | 'pact'>('none');
    const [casterAbility, setCasterAbility] = useState('int');
    const [levelFeatures, setLevelFeatures] = useState<{ level: number, name: string, desc: string, effects: any[] }[]>([]);
    const [armorProfs, setArmorProfs] = useState<string[]>([]);
    const [weaponProfs, setWeaponProfs] = useState<string[]>([]);

    // Subclass Forge
    const [parentClass, setParentClass] = useState('fighter');

    // Background Forge
    const [bgSkills, setBgSkills] = useState<string[]>([]);
    const [bgTools, setBgTools] = useState<string[]>([]);
    const [bgFeatureName, setBgFeatureName] = useState('');
    const [bgEquipment, setBgEquipment] = useState('');

    // Spell Forge
    const [spellLevel, setSpellLevel] = useState(0);
    const [spellSchool, setSpellSchool] = useState('Evocation');
    const [spellCastTime, setSpellCastTime] = useState('1 Action');
    const [spellRange, setSpellRange] = useState('60 feet');
    const [spellDuration, setSpellDuration] = useState('Instantaneous');
    const [spellRitual, setSpellRitual] = useState(false);
    const [spellConcentration, setSpellConcentration] = useState(false);
    const [spellComponents, setSpellComponents] = useState<string[]>(['V', 'S']);
    const [spellMaterial, setSpellMaterial] = useState('');
    const [spellHigherLevel, setSpellHigherLevel] = useState('');
    const [spellHasAttack, setSpellHasAttack] = useState(false);
    const [spellAttackType, setSpellAttackType] = useState('Ranged');
    const [spellHasSave, setSpellHasSave] = useState(false);
    const [spellSaveType, setSpellSaveType] = useState('DEX');
    const [spellDmgFormula, setSpellDmgFormula] = useState('');
    const [spellDmgType, setSpellDmgType] = useState('Force');

    // Item Forge
    const [itemCategory, setItemCategory] = useState('Wondrous Item');
    const [itemWeight, setItemWeight] = useState(0);
    const [itemCost, setItemCost] = useState('0 gp');
    const [itemAttunement, setItemAttunement] = useState(false);
    const [itemDmgDice, setItemDmgDice] = useState('');
    const [itemDmgType, setItemDmgType] = useState('Piercing');
    const [itemAcBase, setItemAcBase] = useState(0);
    const [itemAcDexBonus, setItemAcDexBonus] = useState(false);
    const [itemAcMaxBonus, setItemAcMaxBonus] = useState<number | null>(null);
    const [itemProperties, setItemProperties] = useState<string[]>([]);
    const [itemModifiers, setItemModifiers] = useState<any[]>([]);

    useEffect(() => { if (isOpen) fetchList(); }, [isOpen, activeTab]);

    const fetchList = async () => {
        setLoading(true);
        const tableMap = { 
            race: 'custom_races', 
            class: 'custom_classes', 
            subclass: 'custom_subclasses', 
            background: 'custom_backgrounds',
            spell: 'custom_spells',
            item: 'custom_equipment'
        };
        const data = await loadHomebrew(tableMap[activeTab] as any);
        setList(data);
        setLoading(false);
    };

    if (!isOpen) return null;

    const resetForm = () => {
        setName(''); setDescription(''); 
        setSpeeds({ walk: 30, fly: 0, swim: 0, climb: 0 });
        setAbilityBonuses([]); setTraits([]); setSize('Medium');
        setSaves([]); setLevelFeatures([]); setHitDie(8);
        setCasterType('none'); setCasterAbility('int');
        setBgSkills([]); setBgFeatureName(''); setBgTools([]); setBgEquipment('');
        setArmorProfs([]); setWeaponProfs([]);
        setSpellLevel(0); setSpellSchool('Evocation'); setSpellCastTime('1 Action'); setSpellRange('60 feet'); setSpellDuration('Instantaneous'); setSpellRitual(false); setSpellConcentration(false);
        setSpellComponents(['V', 'S']); setSpellMaterial(''); setSpellHigherLevel(''); setSpellHasAttack(false); setSpellHasSave(false); setSpellDmgFormula('');
        setItemCategory('Wondrous Item'); setItemWeight(0); setItemCost('0 gp'); setItemAttunement(false); setItemDmgDice(''); setItemAcBase(0); setItemAcDexBonus(false); setItemModifiers([]);
        setShowForm(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tableMap = { 
                race: 'custom_races', 
                class: 'custom_classes', 
                subclass: 'custom_subclasses', 
                background: 'custom_backgrounds',
                spell: 'custom_spells',
                item: 'custom_equipment'
            };
            
            let payload: any = { name, index: name.toLowerCase().replace(/\s+/g, '-'), desc: [description] };
            
            if (activeTab === 'race') {
                payload = { 
                    ...payload, speed: speeds.walk, size, alignment: description,
                    ability_bonuses: abilityBonuses.map(ab => ({ ability_score: { index: ab.stat, name: ab.stat.toUpperCase() }, bonus: ab.bonus })),
                    traits: traits.map(t => ({ index: t.name.toLowerCase().replace(/\s+/g, '-'), name: t.name, desc: [t.desc], modifiers: t.effects })),
                    fly_speed: speeds.fly > 0 ? speeds.fly : undefined,
                    swim_speed: speeds.swim > 0 ? speeds.swim : undefined,
                    climb_speed: speeds.climb > 0 ? speeds.climb : undefined
                };
            } else if (activeTab === 'class') {
                const level_table = Array.from({ length: 20 }, (_, i) => ({
                    level: i + 1,
                    prof_bonus: Math.floor(i / 4) + 2,
                    features: levelFeatures.filter(f => f.level === i + 1).map(f => f.name)
                }));
                const profs = [...armorProfs.map(p => ({name: p})), ...weaponProfs.map(p => ({name: p}))];
                payload = { 
                    ...payload, hit_die: hitDie, saving_throws: saves.map(s => ({ index: s, name: s.toUpperCase() })),
                    proficiency_choices: [], proficiencies: profs, level_table,
                    spellcasting: casterType !== 'none' ? { spellcasting_ability: { index: casterAbility, name: casterAbility.toUpperCase() } } : undefined,
                    feature_details: levelFeatures.map(f => ({ index: f.name.toLowerCase().replace(/\s+/g, '-'), name: f.name, level: f.level, desc: [f.desc], effects: f.effects }))
                };
            } else if (activeTab === 'subclass') {
                payload = { 
                    ...payload, class: { index: parentClass, name: parentClass.charAt(0).toUpperCase() + parentClass.slice(1) },
                    feature_details: levelFeatures.map(f => ({ index: f.name.toLowerCase().replace(/\s+/g, '-'), name: f.name, level: f.level, desc: [f.desc], effects: f.effects }))
                };
            } else if (activeTab === 'background') {
                payload = { 
                    ...payload, skill_proficiencies: bgSkills, equipment: bgEquipment.split(',').map(s => s.trim()), 
                    currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }, 
                    feature: { name: bgFeatureName || 'Custom Feature', desc: [description] } 
                };
            } else if (activeTab === 'spell') {
                payload = {
                    ...payload, level: spellLevel, school: { name: spellSchool, index: spellSchool.toLowerCase() },
                    casting_time: spellCastTime, range: spellRange, duration: (spellConcentration ? "Concentration, " : "") + spellDuration,
                    components: spellComponents, material: spellComponents.includes('M') ? spellMaterial : undefined, 
                    ritual: spellRitual, concentration: spellConcentration,
                    higher_level: spellHigherLevel ? [spellHigherLevel] : undefined,
                    attack_type: spellHasAttack ? spellAttackType.toLowerCase() : undefined,
                    damage: spellDmgFormula ? { 
                        damage_type: { name: spellDmgType, index: spellDmgType.toLowerCase() },
                        [spellLevel === 0 ? 'damage_at_character_level' : 'damage_at_slot_level']: { [spellLevel === 0 ? '1' : spellLevel.toString()]: spellDmgFormula }
                    } : undefined,
                    dc: spellHasSave ? { dc_type: { name: spellSaveType, index: spellSaveType.toLowerCase() }, dc_success: 'half' } : undefined
                };
            } else if (activeTab === 'item') {
                payload = {
                    ...payload, equipment_category: { name: itemCategory, index: itemCategory.toLowerCase().replace(/\s+/g, '-') },
                    weight: itemWeight, cost: { quantity: parseInt(itemCost) || 0, unit: itemCost.includes('gp') ? 'gp' : 'sp' },
                    requires_attunement: itemAttunement,
                    damage: itemDmgDice ? { damage_dice: itemDmgDice, damage_type: { name: itemDmgType, index: itemDmgType.toLowerCase() } } : undefined,
                    armor_class: itemAcBase > 0 ? { base: itemAcBase, dex_bonus: itemAcDexBonus, max_bonus: itemAcMaxBonus } : undefined,
                    properties: itemProperties.map(p => ({ name: p, index: p.toLowerCase() })),
                    modifiers: itemModifiers
                };
            }

            await saveHomebrew(tableMap[activeTab] as any, currentUser.id, payload);
            alert(`${name} has been added to the Persona network.`);
            resetForm();
            fetchList();
        } catch (err) {
            console.error(err);
            alert("Archive synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-6xl shadow-2xl flex flex-col h-[90vh]">
                
                {/* Forge Header */}
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-dnd-gold flex items-center gap-3">
                            <span className="opacity-50">⚒️</span>
                            {showForm ? 'Forging Mode' : 'The Homebrew Forge'}
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1 italic">
                            {showForm ? 'Binding mechanics to the weave' : 'Shared creations from across the realms'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors">&times;</button>
                </div>

                <div className="flex border-b border-gray-800 bg-[#1b1c20] shrink-0 overflow-x-auto no-scrollbar">
                    {(['race', 'class', 'subclass', 'background', 'spell', 'item'] as const).map(t => (
                        <button 
                            key={t}
                            onClick={() => { setActiveTab(t); setShowForm(false); }}
                            className={`px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === t ? 'text-dnd-gold border-dnd-gold bg-dnd-gold/5' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                        >
                            {t}s
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Public Archive Sidebar */}
                    <div className="md:w-72 border-r border-gray-800 bg-black/20 flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Public Archive</h3>
                            <button onClick={() => setShowForm(true)} className="text-[10px] text-dnd-gold hover:underline font-bold uppercase">+ Forge New</button>
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {loading && list.length === 0 ? <div className="p-4 text-xs text-gray-600 animate-pulse">Browsing scrolls...</div> : (
                                list.map(item => (
                                    <div key={item.id} className="p-3 bg-gray-800/20 rounded-lg border border-gray-700/50 hover:border-dnd-gold transition-colors group">
                                        <div className="font-bold text-sm text-gray-300 group-hover:text-white">{item.name}</div>
                                        <div className="text-[8px] text-gray-600 uppercase font-black mt-1">By {item.user_id?.substring(0,8)}</div>
                                    </div>
                                ))
                            )}
                            {!loading && list.length === 0 && <div className="p-4 text-xs text-gray-700 italic">The archives are empty.</div>}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar bg-[#1b1c20]">
                        {!showForm ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10 max-w-lg mx-auto">
                                <div className="w-24 h-24 bg-dnd-gold/5 border border-dnd-gold/20 rounded-full flex items-center justify-center text-5xl mb-8 opacity-20 shadow-[0_0_50px_rgba(201,173,106,0.1)]">📜</div>
                                <h3 className="text-3xl font-serif text-white mb-4 uppercase tracking-tighter">Forge your own Legend</h3>
                                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-serif italic">"Once committed to the archive, your creation will be available to all heroes within the Persona network."</p>
                                <button onClick={() => setShowForm(true)} className="px-12 py-5 bg-dnd-gold text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">Initialize Craft</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-8 space-y-12 max-w-4xl mx-auto pb-40 animate-in fade-in duration-300">
                                
                                {/* IDENTITY SECTION */}
                                <section className="space-y-6">
                                    <div className="border-l-4 border-dnd-gold pl-4">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Basic Identity</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Entity Name</label>
                                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-2xl font-serif text-white outline-none focus:border-dnd-gold shadow-inner" placeholder={`e.g. ${activeTab === 'spell' ? 'Mind Blade' : 'Soulcatcher Amulet'}`} />
                                        </div>
                                        {activeTab !== 'spell' && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Flavor Text / Lore</label>
                                                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-sm text-gray-400 h-32 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif italic" placeholder="The origins of this legend date back to..." />
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* TAB SPECIFIC CONFIGS */}

                                {activeTab === 'spell' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spell Level</label>
                                                <select value={spellLevel} onChange={e => setSpellLevel(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option value={0}>Cantrip</option>
                                                    {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">School</label>
                                                <select value={spellSchool} onChange={e => setSpellSchool(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base Casting Time</label>
                                                <select value={spellCastTime} onChange={e => setSpellCastTime(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option>1 Action</option>
                                                    <option>1 Bonus Action</option>
                                                    <option>1 Reaction</option>
                                                    <option>1 Minute</option>
                                                    <option>10 Minutes</option>
                                                    <option>1 Hour</option>
                                                    <option>8 Hours</option>
                                                    <option>Special</option>
                                                </select>
                                            </div>
                                        </section>

                                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Range</label>
                                                <input type="text" value={spellRange} onChange={e => setSpellRange(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold" placeholder="e.g. 60 feet" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Duration</label>
                                                <select value={spellDuration} onChange={e => setSpellDuration(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option>Instantaneous</option>
                                                    <option>1 Round</option>
                                                    <option>1 Minute</option>
                                                    <option>10 Minutes</option>
                                                    <option>1 Hour</option>
                                                    <option>8 Hours</option>
                                                    <option>24 Hours</option>
                                                    <option>Until Dispelled</option>
                                                    <option>Special</option>
                                                </select>
                                            </div>
                                        </section>

                                        <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-6">
                                            <div className="flex flex-wrap gap-8">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={spellConcentration} onChange={e => setSpellConcentration(e.target.checked)} className="accent-blue-500 w-4 h-4" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Concentration</span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={spellRitual} onChange={e => setSpellRitual(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ritual</span>
                                                </label>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Components</label>
                                                <div className="flex gap-4">
                                                    {['V', 'S', 'M'].map(c => (
                                                        <button 
                                                            key={c} type="button"
                                                            onClick={() => setSpellComponents(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                                            className={`px-4 py-2 rounded border text-xs font-black transition-all ${spellComponents.includes(c) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-700 hover:border-gray-500'}`}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                                {spellComponents.includes('M') && (
                                                    <input 
                                                        type="text" value={spellMaterial} onChange={e => setSpellMaterial(e.target.value)} 
                                                        className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-dnd-gold" 
                                                        placeholder="e.g. a pinch of powdered lead" 
                                                    />
                                                )}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="border-l-4 border-blue-900/50 pl-4">
                                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lore & Description</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spell Effect</label>
                                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-sm text-gray-300 h-40 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif leading-relaxed" placeholder="Describe the magical effect..." />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">At Higher Levels</label>
                                                    <textarea value={spellHigherLevel} onChange={e => setSpellHigherLevel(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-3 text-xs text-gray-500 h-20 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif italic" placeholder="e.g. When you cast this spell using a slot of 2nd level or higher..." />
                                                </div>
                                            </div>
                                        </section>

                                        <section className="bg-purple-900/5 border border-purple-900/20 p-6 rounded-2xl space-y-6">
                                            <h4 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em]">Mechanics</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={spellHasAttack} onChange={e => setSpellHasAttack(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spell Attack</span>
                                                    </label>
                                                    {spellHasAttack && (
                                                        <div className="flex gap-2">
                                                            {['Ranged', 'Melee'].map(t => (
                                                                <button key={t} type="button" onClick={() => setSpellAttackType(t)} className={`flex-1 py-2 rounded border text-[10px] font-black transition-all ${spellAttackType === t ? 'bg-purple-600 text-white border-purple-500' : 'bg-black/20 text-gray-600 border-gray-700'}`}>{t.toUpperCase()}</button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                                                        <input type="checkbox" checked={spellHasSave} onChange={e => setSpellHasSave(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saving Throw</span>
                                                    </label>
                                                    {spellHasSave && (
                                                        <select value={spellSaveType} onChange={e => setSpellSaveType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white outline-none">
                                                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base Damage / Healing Formula</label>
                                                        <input type="text" value={spellDmgFormula} onChange={e => setSpellDmgFormula(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-mono" placeholder="e.g. 3d8" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Type</label>
                                                        <select value={spellDmgType} onChange={e => setSpellDmgType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                            {['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Healing', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'].map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 uppercase font-black italic border-t border-purple-900/20 pt-2">Damage automatically scales: by character level for cantrips, by slot level for spells.</p>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'item' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Category</label>
                                                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white">
                                                    <option>Wondrous Item</option>
                                                    <option>Weapon</option>
                                                    <option>Armor</option>
                                                    <option>Consumable</option>
                                                    <option>Tool</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Weight (lb)</label>
                                                <input type="number" value={itemWeight} onChange={e => setItemWeight(parseFloat(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Cost</label>
                                                <input type="text" value={itemCost} onChange={e => setItemCost(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white" placeholder="50 gp" />
                                            </div>
                                        </section>
                                        <section className="flex gap-8">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={itemAttunement} onChange={e => setItemAttunement(e.target.checked)} className="accent-dnd-gold" />
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requires Attunement</span>
                                            </label>
                                        </section>

                                        {itemCategory === 'Weapon' && (
                                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-900/5 p-6 rounded-2xl border border-red-900/20">
                                                <h4 className="md:col-span-2 text-[10px] uppercase font-black text-red-400 tracking-[0.2em]">Weapon Statistics</h4>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Dice</label>
                                                    <input type="text" value={itemDmgDice} onChange={e => setItemDmgDice(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" placeholder="1d8" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Type</label>
                                                    <select value={itemDmgType} onChange={e => setItemDmgType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        {['Piercing', 'Slashing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Force', 'Necrotic', 'Radiant', 'Psychic'].map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                            </section>
                                        )}

                                        {itemCategory === 'Armor' && (
                                            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-900/5 p-6 rounded-2xl border border-blue-900/20">
                                                <h4 className="md:col-span-3 text-[10px] uppercase font-black text-blue-400 tracking-[0.2em]">Armor Statistics</h4>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base AC</label>
                                                    <input type="number" value={itemAcBase} onChange={e => setItemAcBase(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" />
                                                </div>
                                                <div className="flex items-center pt-6">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={itemAcDexBonus} onChange={e => setItemAcDexBonus(e.target.checked)} className="accent-dnd-gold" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Dex Mod</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Max Dex Bonus (opt)</label>
                                                    <input type="number" value={itemAcMaxBonus || ''} onChange={e => setItemAcMaxBonus(parseInt(e.target.value) || null)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" />
                                                </div>
                                            </section>
                                        )}

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Item Modifiers & Bonuses</h4>
                                                <button type="button" onClick={() => setItemModifiers([...itemModifiers, { type: 'bonus', target: 'ac', value: 1 }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Modifier</button>
                                            </div>
                                            <div className="space-y-4">
                                                {itemModifiers.map((mod, i) => (
                                                    <div key={i} className="bg-black/20 p-4 rounded-xl border border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end relative">
                                                        <button type="button" onClick={() => setItemModifiers(itemModifiers.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Type</label>
                                                            <select value={mod.type} onChange={e => { const n = [...itemModifiers]; n[i].type = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white">
                                                                <option value="bonus">Bonus (+)</option>
                                                                <option value="set">Set To (=)</option>
                                                                <option value="resistance">Resistance</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Target</label>
                                                            <select value={mod.target} onChange={e => { const n = [...itemModifiers]; n[i].target = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white">
                                                                <option value="ac">AC</option>
                                                                <option value="attack">Attack Rolls</option>
                                                                <option value="damage">Damage Rolls</option>
                                                                <option value="saves">Saving Throws</option>
                                                                {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Value</label>
                                                            <input type="text" value={mod.value} onChange={e => { const n = [...itemModifiers]; n[i].value = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'race' && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            {Object.keys(speeds).map(s => (
                                                <div key={s}>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">{s} Speed</label>
                                                    <input type="number" value={(speeds as any)[s]} onChange={e => setSpeeds({...speeds, [s]: parseInt(e.target.value)||0})} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center" />
                                                </div>
                                            ))}
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Ability Score Bonuses</h4>
                                                <button type="button" onClick={() => setAbilityBonuses([...abilityBonuses, { stat: 'str', bonus: 1 }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Bonus</button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {abilityBonuses.map((ab, i) => (
                                                    <div key={i} className="flex gap-2 items-center bg-black/20 p-2 rounded border border-gray-800">
                                                        <select value={ab.stat} onChange={e => { const n = [...abilityBonuses]; n[i].stat = e.target.value; setAbilityBonuses(n); }} className="flex-grow bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-xs">
                                                            {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                        </select>
                                                        <input type="number" value={ab.bonus} onChange={e => { const n = [...abilityBonuses]; n[i].bonus = parseInt(e.target.value); setAbilityBonuses(n); }} className="w-16 bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-xs text-center" />
                                                        <button type="button" onClick={() => setAbilityBonuses(abilityBonuses.filter((_, idx) => idx !== i))} className="text-red-500 px-2">&times;</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Racial Traits</h4>
                                                <button type="button" onClick={() => setTraits([...traits, { name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Trait</button>
                                            </div>
                                            <div className="space-y-4">
                                                {traits.map((t, i) => (
                                                    <div key={i} className="bg-black/20 p-5 rounded-xl border border-gray-800 space-y-4 relative group">
                                                        <button type="button" onClick={() => setTraits(traits.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <input type="text" value={t.name} onChange={e => { const n = [...traits]; n[i].name = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Trait Name (e.g. Relentless Endurance)" />
                                                        <textarea value={t.desc} onChange={e => { const n = [...traits]; n[i].desc = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-20 resize-none font-serif" placeholder="Description of the trait's power..." />
                                                        <EffectEditor effects={t.effects} onChange={newE => { const n = [...traits]; n[i].effects = newE; setTraits(n); }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'class' && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Hit Die</label>
                                                <select value={hitDie} onChange={e => setHitDie(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option value={6}>d6</option><option value={8}>d8</option><option value={10}>d10</option><option value={12}>d12</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Save Proficiencies</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {ABILITY_NAMES.map(s => (
                                                        <button key={s} type="button" onClick={() => setSaves(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className={`px-4 py-2 rounded border text-[10px] font-black transition-all ${saves.includes(s) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-800'}`}>{s.toUpperCase()}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        <section className="bg-purple-900/5 border border-purple-900/20 p-6 rounded-2xl space-y-6">
                                            <h4 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em]">Spellcasting Setup</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Caster Type</label>
                                                    <select value={casterType} onChange={e => setCasterType(e.target.value as any)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        <option value="none">Non-Caster</option>
                                                        <option value="full">Full Caster (Wizard/Cleric)</option>
                                                        <option value="half">Half Caster (Paladin/Ranger)</option>
                                                        <option value="third">Third Caster (EK/AT)</option>
                                                        <option value="pact">Pact Magic (Warlock)</option>
                                                    </select>
                                                </div>
                                                {casterType !== 'none' && (
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spellcasting Ability</label>
                                                        <select value={casterAbility} onChange={e => setCasterAbility(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                            {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Level Progression (1-20)</h4>
                                                <button type="button" onClick={() => setLevelFeatures([...levelFeatures, { level: 1, name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Level Feature</button>
                                            </div>
                                            <div className="space-y-6">
                                                {levelFeatures.map((f, i) => (
                                                    <div key={i} className="bg-black/20 p-6 rounded-xl border border-gray-800 grid grid-cols-[80px_1fr] gap-6 relative">
                                                        <button type="button" onClick={() => setLevelFeatures(levelFeatures.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500">&times;</button>
                                                        <div>
                                                            <label className="text-[8px] uppercase font-black text-gray-600 block mb-1">Level</label>
                                                            <input type="number" min="1" max="20" value={f.level} onChange={e => { const n = [...levelFeatures]; n[i].level = parseInt(e.target.value); setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center font-bold" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <input type="text" value={f.name} onChange={e => { const n = [...levelFeatures]; n[i].name = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Feature Name" />
                                                            <textarea value={f.desc} onChange={e => { const n = [...levelFeatures]; n[i].desc = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-24 resize-none font-serif" placeholder="Feature description..." />
                                                            <EffectEditor effects={f.effects} onChange={newE => { const n = [...levelFeatures]; n[i].effects = newE; setLevelFeatures(n); }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'background' && (
                                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="space-y-4">
                                            <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Skill Proficiencies</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {SKILL_LIST.map(s => (
                                                    <button key={s.name} type="button" onClick={() => setBgSkills(prev => prev.includes(s.name) ? prev.filter(x => x !== s.name) : [...prev, s.name])} className={`px-2 py-2 rounded border text-[9px] font-black transition-all ${bgSkills.includes(s.name) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-800'}`}>{s.name.toUpperCase()}</button>
                                                ))}
                                            </div>
                                        </section>
                                        <section className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Tool Proficiencies (Comma Separated)</label>
                                                <input type="text" value={bgTools.join(', ')} onChange={e => setBgTools(e.target.value.split(',').map(s => s.trim()))} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm" placeholder="e.g. Cook's Utensils, Dice Set" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Starting Equipment</label>
                                                <input type="text" value={bgEquipment} onChange={e => setBgEquipment(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm" placeholder="e.g. A backpack, 5 gold, a letter from a friend" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Special Feature Name</label>
                                                <input type="text" value={bgFeatureName} onChange={e => setBgFeatureName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm font-serif" placeholder="e.g. Position of Privilege" />
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'subclass' && (
                                    <div className="space-y-12">
                                        <section>
                                            <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base Class ID (e.g. fighter, wizard)</label>
                                            <input type="text" value={parentClass} onChange={e => setParentClass(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white focus:border-dnd-gold" />
                                        </section>
                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Subclass Level Features</h4>
                                                <button type="button" onClick={() => setLevelFeatures([...levelFeatures, { level: 3, name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Feature</button>
                                            </div>
                                            <div className="space-y-6">
                                                {levelFeatures.map((f, i) => (
                                                    <div key={i} className="bg-black/20 p-6 rounded-xl border border-gray-800 grid grid-cols-[80px_1fr] gap-6 relative">
                                                        <button type="button" onClick={() => setLevelFeatures(levelFeatures.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500">&times;</button>
                                                        <div>
                                                            <label className="text-[8px] uppercase font-black text-gray-600 block mb-1">Level</label>
                                                            <input type="number" min="1" max="20" value={f.level} onChange={e => { const n = [...levelFeatures]; n[i].level = parseInt(e.target.value); setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center font-bold" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <input type="text" value={f.name} onChange={e => { const n = [...levelFeatures]; n[i].name = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Feature Name" />
                                                            <textarea value={f.desc} onChange={e => { const n = [...levelFeatures]; n[i].desc = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-24 resize-none font-serif" placeholder="Feature description..." />
                                                            <EffectEditor effects={f.effects} onChange={newE => { const n = [...levelFeatures]; n[i].effects = newE; setLevelFeatures(n); }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                <div className="sticky bottom-0 pt-10 pb-6 bg-[#1b1c20] z-10">
                                    <div className="bg-black/80 p-6 rounded-2xl border-2 border-dnd-gold/30 text-center backdrop-blur-md shadow-2xl">
                                        <p className="text-gray-400 text-xs italic font-serif mb-6">"All creations are permanent additions to the shared world archive."</p>
                                        <div className="flex gap-4 justify-center">
                                            <button type="button" onClick={resetForm} className="px-10 py-3 text-gray-500 hover:text-white uppercase font-black text-[10px] tracking-widest transition-colors">Discard Draft</button>
                                            <button type="submit" disabled={loading || !name} className="px-16 py-4 bg-dnd-gold text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                                                {loading ? 'Binding Weave...' : 'Forge Entry'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="p-3 bg-[#121316] border-t border-gray-700 rounded-b-xl flex justify-center">
                    <p className="text-[8px] text-gray-700 uppercase font-black tracking-[0.4em]">Vault Network Active • Secure Link 256-BIT • Node Persona-Core</p>
                </div>
            </div>
        </div>
    );
};

export default HomebrewManagerModal;