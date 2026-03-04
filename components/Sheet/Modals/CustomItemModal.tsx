
import React, { useState } from 'react';
import { InventoryItem } from '@/types';

const CustomItemModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (item: InventoryItem) => void }) => {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [desc, setDesc] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name) return;
        const costParts = cost.trim().split(' ');
        const costObj = costParts.length >= 2 
            ? { quantity: parseFloat(costParts[0]) || 0, unit: costParts[1] }
            : { quantity: parseFloat(cost) || 0, unit: 'gp' };

        const newItem: InventoryItem = {
            id: `custom-item-${Date.now()}`,
            name,
            weight: parseFloat(weight) || 0,
            quantity: parseInt(quantity) || 1,
            cost: costObj,
            desc: [desc],
            equipped: false
        };
        onSave(newItem);
        setName(''); setWeight(''); setCost(''); setQuantity('1'); setDesc('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4">
            <div className="bg-[#1b1c20] border border-dnd-gold rounded-lg p-6 w-full max-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
                <h2 className="text-xl font-serif text-dnd-gold mb-4">Add Custom Item</h2>
                <div className="space-y-3">
                    <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Weight (lb)" value={weight} onChange={e => setWeight(e.target.value)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                        <input type="text" placeholder="Cost (e.g. 5 gp)" value={cost} onChange={e => setCost(e.target.value)} className="bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="text-gray-400 text-sm">Quantity:</span>
                         <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-20 bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <textarea placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white h-20" />
                    <button onClick={handleSubmit} className="w-full py-2 bg-dnd-gold text-black font-bold rounded hover:bg-yellow-600">Add Item</button>
                </div>
            </div>
        </div>
    );
};

export default CustomItemModal;
