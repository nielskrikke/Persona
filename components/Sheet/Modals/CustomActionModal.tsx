
import React, { useState } from 'react';
import { X, Sword, Sparkles, Shield, Info, Save, Activity, Clock, Zap } from 'lucide-react';
import { CustomAction, AbilityName, ABILITY_NAMES, ABILITY_LABELS } from '@/types';

const CustomActionModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (action: CustomAction) => void }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<CustomAction['type']>('weapon');
    const [activationType, setActivationType] = useState<string>('action');
    const [ability, setAbility] = useState<AbilityName | ''>('');
    const [isProficient, setIsProficient] = useState(true);
    const [hit, setHit] = useState('');
    const [saveDC, setSaveDC] = useState('');
    const [saveAbility, setSaveAbility] = useState<AbilityName | ''>('');
    const [damage, setDamage] = useState('');
    const [damageType, setDamageType] = useState('');
    const [range, setRange] = useState('');
    const [desc, setDesc] = useState('');
    const [maxUses, setMaxUses] = useState('');
    const [reset, setReset] = useState<'short' | 'long'>('long');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name) return;
        onSave({
            id: `custom-action-${Date.now()}`,
            name,
            type,
            activationType: activationType as any,
            ability: ability || undefined,
            isProficient,
            hit: hit ? parseInt(hit) : undefined,
            saveDC: saveDC ? parseInt(saveDC) : undefined,
            saveAbility: saveAbility || undefined,
            damage,
            damageType,
            range,
            description: desc,
            maxUses: maxUses ? parseInt(maxUses) : undefined,
            reset
        } as any);
        
        // Reset form
        setName(''); setType('weapon'); setActivationType('action'); setAbility(''); 
        setIsProficient(true); setHit(''); setSaveDC(''); setSaveAbility('');
        setDamage(''); setDamageType(''); setRange(''); setDesc('');
        setMaxUses(''); setReset('long');
        
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-gray-800 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-serif text-white">Create Custom Action</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Define a unique maneuver, spell, or feature
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Action Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Flaming Strike" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Action Type</label>
                            <select 
                                value={type} 
                                onChange={e => setType(e.target.value as any)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                            >
                                <option value="weapon">Weapon Attack</option>
                                <option value="spell">Spell / Magic</option>
                                <option value="feature">Class Feature</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Economy & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Economy</label>
                            <select 
                                value={activationType} 
                                onChange={e => setActivationType(e.target.value)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                            >
                                <option value="action">Action</option>
                                <option value="bonus">Bonus Action</option>
                                <option value="reaction">Reaction</option>
                                <option value="legendary">Legendary Action</option>
                                <option value="other">Other / Special</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ability Modifier</label>
                            <select 
                                value={ability} 
                                onChange={e => setAbility(e.target.value as any)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                            >
                                <option value="">None</option>
                                {ABILITY_NAMES.map(a => <option key={a} value={a}>{ABILITY_LABELS[a]}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Proficiency</label>
                            <button 
                                onClick={() => setIsProficient(!isProficient)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                    isProficient ? 'bg-dnd-gold/10 border-dnd-gold/50 text-dnd-gold' : 'bg-black/20 border-gray-800 text-gray-500'
                                }`}
                            >
                                <span className="text-xs font-bold uppercase">Add Bonus</span>
                                <Zap size={14} className={isProficient ? 'fill-current' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Attack / Save */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <Sword size={12} /> Combat Mechanics
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fixed Hit Bonus</label>
                                <input 
                                    type="number" 
                                    placeholder="+5 (Overrides Ability)" 
                                    value={hit} 
                                    onChange={e => setHit(e.target.value)} 
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Save DC</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="15" 
                                        value={saveDC} 
                                        onChange={e => setSaveDC(e.target.value)} 
                                        className="flex-grow bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                    />
                                    <select 
                                        value={saveAbility} 
                                        onChange={e => setSaveAbility(e.target.value as any)} 
                                        className="w-24 bg-black/40 border border-gray-700 rounded-xl p-3 text-white text-xs outline-none focus:border-dnd-gold/50 transition-all"
                                    >
                                        <option value="">Stat</option>
                                        {ABILITY_NAMES.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Damage & Range */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Damage Dice</label>
                            <input 
                                type="text" 
                                placeholder="1d8 + 3" 
                                value={damage} 
                                onChange={e => setDamage(e.target.value)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Damage Type</label>
                            <input 
                                type="text" 
                                placeholder="Fire, Slashing..." 
                                value={damageType} 
                                onChange={e => setDamageType(e.target.value)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Range</label>
                            <input 
                                type="text" 
                                placeholder="30ft / 5ft" 
                                value={range} 
                                onChange={e => setRange(e.target.value)} 
                                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                            />
                        </div>
                    </div>

                    {/* Limited Uses */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <Clock size={12} /> Usage Tracking
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max Charges</label>
                                <input 
                                    type="number" 
                                    placeholder="None" 
                                    value={maxUses} 
                                    onChange={e => setMaxUses(e.target.value)} 
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reset On</label>
                                <select 
                                    value={reset} 
                                    onChange={e => setReset(e.target.value as any)} 
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none transition-all"
                                >
                                    <option value="short">Short Rest</option>
                                    <option value="long">Long Rest</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                        <textarea 
                            placeholder="Describe the effect or flavor text..." 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white h-32 focus:border-dnd-gold/50 outline-none transition-all resize-none" 
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#121316] border-t border-gray-800">
                    <button 
                        onClick={handleSubmit} 
                        disabled={!name}
                        className="w-full py-4 bg-dnd-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-xl shadow-dnd-gold/10 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                        <Save size={18} />
                        Create Custom Action
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomActionModal;
