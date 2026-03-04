
import React, { useState } from 'react';
import { BeastDetail, ABILITY_NAMES } from '@/types';

interface CustomBeastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (beast: BeastDetail) => void;
}

const CustomBeastModal: React.FC<CustomBeastModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [cr, setCr] = useState('0');
    const [size, setSize] = useState('Medium');
    const [type, setType] = useState('Beast');
    const [ac, setAc] = useState('');
    const [hp, setHp] = useState('');
    const [hitDice, setHitDice] = useState('');
    const [speed, setSpeed] = useState('');
    const [flySpeed, setFlySpeed] = useState('');
    const [swimSpeed, setSwimSpeed] = useState('');
    
    // Stats
    const [stats, setStats] = useState({
        str: 10, dex: 10, con: 10, int: 2, wis: 10, cha: 5
    });

    // Actions
    const [actions, setActions] = useState<{name: string, desc: string, attack_bonus?: number, damage_dice?: string, damage_type?: string}[]>([]);
    const [newActionName, setNewActionName] = useState('');
    const [newActionDesc, setNewActionDesc] = useState('');
    const [newActionHit, setNewActionHit] = useState('');
    const [newActionDmg, setNewActionDmg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name) return;

        const beast: BeastDetail = {
            index: `custom-beast-${Date.now()}`,
            name,
            size,
            type,
            challenge_rating: parseFloat(cr) || 0,
            ac: parseInt(ac) || 10,
            hp: parseInt(hp) || 10,
            hit_dice: hitDice || '1d8',
            speed: speed || '30 ft.',
            str: stats.str,
            dex: stats.dex,
            con: stats.con,
            int: stats.int,
            wis: stats.wis,
            cha: stats.cha,
            senses: '',
            languages: '',
            traits: [],
            actions: actions,
            fly_speed: flySpeed ? parseInt(flySpeed) : undefined,
            swim_speed: swimSpeed ? parseInt(swimSpeed) : undefined,
            isCustom: true
        };

        onSave(beast);
        // Reset form
        setName(''); setCr('0'); setAc(''); setHp(''); setHitDice(''); setSpeed('');
        setActions([]);
        onClose();
    };

    const addAction = () => {
        if (!newActionName) return;
        setActions([...actions, {
            name: newActionName,
            desc: newActionDesc,
            attack_bonus: newActionHit ? parseInt(newActionHit) : undefined,
            damage_dice: newActionDmg || undefined
        }]);
        setNewActionName(''); setNewActionDesc(''); setNewActionHit(''); setNewActionDmg('');
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[600] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-dnd-gold">Create Custom Wild Shape</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition-colors">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white outline-none focus:border-dnd-gold" placeholder="e.g. Dire Rabbit" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">CR</label>
                                <input type="number" step="0.125" value={cr} onChange={e => setCr(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white outline-none focus:border-dnd-gold" />
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Size</label>
                                <select value={size} onChange={e => setSize(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white outline-none focus:border-dnd-gold text-xs">
                                    {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                <input type="text" value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white outline-none focus:border-dnd-gold" />
                             </div>
                        </div>
                    </div>

                    {/* Combat Stats */}
                    <div className="grid grid-cols-4 gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Armor Class</label>
                            <input type="number" value={ac} onChange={e => setAc(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-center" placeholder="10" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">HP</label>
                            <input type="number" value={hp} onChange={e => setHp(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-center" placeholder="10" />
                        </div>
                        <div className="col-span-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase">Hit Dice</label>
                            <input type="text" value={hitDice} onChange={e => setHitDice(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-center" placeholder="2d8+2" />
                        </div>
                    </div>

                    {/* Speed */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Walk Speed</label>
                            <input type="text" value={speed} onChange={e => setSpeed(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" placeholder="30 ft." />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Fly Speed (opt)</label>
                            <input type="number" value={flySpeed} onChange={e => setFlySpeed(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Swim Speed (opt)</label>
                            <input type="number" value={swimSpeed} onChange={e => setSwimSpeed(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" placeholder="0" />
                        </div>
                    </div>

                    {/* Abilities */}
                    <div>
                        <h3 className="text-xs font-bold text-dnd-gold uppercase tracking-widest border-b border-gray-700 pb-1 mb-3">Ability Scores</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {ABILITY_NAMES.map(stat => (
                                <div key={stat} className="text-center">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{stat}</label>
                                    <input 
                                        type="number" 
                                        value={stats[stat]} 
                                        onChange={(e) => setStats(prev => ({...prev, [stat]: parseInt(e.target.value)||10}))} 
                                        className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-1 text-white text-center" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                         <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-3">
                            <h3 className="text-xs font-bold text-dnd-gold uppercase tracking-widest">Actions</h3>
                            <span className="text-[10px] text-gray-500">e.g. Bite, Claws</span>
                         </div>
                         <div className="space-y-2 mb-4">
                             {actions.map((act, i) => (
                                 <div key={i} className="bg-gray-800 p-2 rounded flex justify-between items-center text-xs text-gray-300">
                                     <span><strong>{act.name}:</strong> {act.desc} ({act.attack_bonus ? `+${act.attack_bonus} hit` : ''} {act.damage_dice ? `, ${act.damage_dice}` : ''})</span>
                                     <button onClick={() => setActions(actions.filter((_, idx) => idx !== i))} className="text-red-500 font-bold px-2">&times;</button>
                                 </div>
                             ))}
                         </div>
                         <div className="bg-gray-800/30 p-3 rounded border border-gray-700 space-y-2">
                             <input type="text" placeholder="Action Name" value={newActionName} onChange={e => setNewActionName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm" />
                             <div className="grid grid-cols-2 gap-2">
                                <input type="number" placeholder="Hit Bonus (+4)" value={newActionHit} onChange={e => setNewActionHit(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm" />
                                <input type="text" placeholder="Damage (1d6+2)" value={newActionDmg} onChange={e => setNewActionDmg(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm" />
                             </div>
                             <textarea placeholder="Description..." value={newActionDesc} onChange={e => setNewActionDesc(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm h-16 resize-none" />
                             <button onClick={addAction} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase text-xs rounded">Add Action</button>
                         </div>
                    </div>

                </div>

                <div className="p-6 border-t border-gray-700 bg-[#121316] rounded-b-xl flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs">Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        className="bg-dnd-gold hover:bg-yellow-600 text-black px-8 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors"
                    >
                        Save Beast
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomBeastModal;
