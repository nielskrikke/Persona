
import React, { useState } from 'react';
import { CustomAction } from '@/types';

const CustomActionModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (action: CustomAction) => void }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<CustomAction['type']>('weapon' as any);
    const [hit, setHit] = useState('');
    const [damage, setDamage] = useState('');
    const [damageType, setDamageType] = useState('');
    const [range, setRange] = useState('');
    const [desc, setDesc] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name) return;
        onSave({
            id: `custom-action-${Date.now()}`,
            name,
            type,
            hit: hit ? parseInt(hit) : undefined,
            damage,
            damageType,
            range,
            description: desc
        });
        setName(''); setType('weapon'); setHit(''); setDamage(''); setDamageType(''); setRange(''); setDesc('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4">
            <div className="bg-[#1b1c20] border border-dnd-gold rounded-lg p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
                <h2 className="text-xl font-serif text-dnd-gold mb-4">Create Custom Action</h2>
                <div className="space-y-3">
                    <input type="text" placeholder="Action Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    <div className="grid grid-cols-2 gap-2">
                        <select value={type} onChange={e => setType(e.target.value as any)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white">
                            <option value="weapon">Weapon</option>
                            <option value="spell">Spell</option>
                            <option value="feature">Feature</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="text" placeholder="Range (e.g. 30ft)" value={range} onChange={e => setRange(e.target.value)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Hit Bonus (+5)" value={hit} onChange={e => setHit(e.target.value)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                        <input type="text" placeholder="Damage (1d8+3)" value={damage} onChange={e => setDamage(e.target.value)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <input type="text" placeholder="Damage Type" value={damageType} onChange={e => setDamageType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white h-20" />
                    <textarea placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white h-20" />
                    <button onClick={handleSubmit} className="w-full py-2 bg-dnd-red hover:bg-red-800 text-white font-bold rounded">Create Action</button>
                </div>
            </div>
        </div>
    );
};

export default CustomActionModal;
