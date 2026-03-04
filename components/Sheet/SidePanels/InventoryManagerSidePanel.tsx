
import React, { useState, useEffect } from 'react';
import SidePanelLayout from '../Shared/SidePanelLayout';
import { CharacterState, InventoryItem, APIReference } from '../../../types';
import { fetchEquipment, fetchEquipmentDetail } from '../../../data/index';

const InventoryManagerSidePanel = ({ 
    character, 
    isOpen, 
    onClose, 
    onUpdateInventory,
    isPinned,
    onTogglePin
}: { 
    character: CharacterState, 
    isOpen: boolean, 
    onClose: () => void, 
    onUpdateInventory: (items: InventoryItem[]) => void,
    isPinned: boolean,
    onTogglePin: () => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [equipmentList, setEquipmentList] = useState<APIReference[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isOpen && equipmentList.length === 0) {
            setLoading(true);
            fetchEquipment().then(data => {
                setEquipmentList(data);
                setLoading(false);
            });
        }
    }, [isOpen]);

    const addItem = async (itemRef: APIReference) => {
        // Fetch details *before* adding to ensure we have weight/cost/etc immediately
        // This makes UI slightly less snappy but ensures correctness
        let detail: any = null;
        try {
             detail = await fetchEquipmentDetail(itemRef.index);
        } catch(e) {}

        const newItem: InventoryItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            index: itemRef.index,
            name: itemRef.name,
            quantity: 1,
            weight: detail?.weight || 0, 
            cost: detail?.cost,
            equipment_category: detail?.equipment_category,
            equipped: false,
            attuned: false,
            desc: detail?.desc,
            damage: detail?.damage,
            range: detail?.range,
            properties: detail?.properties?.map((p: any) => typeof p === 'string' ? p : p.name),
            requires_attunement: detail?.requires_attunement,
            modifiers: detail?.modifiers,
            armor_class: detail?.armor_class
        };
        
        onUpdateInventory([...character.inventory, newItem]);
    };

    const filteredList = equipmentList
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 50); // Limit rendered items for performance

    return (
        <SidePanelLayout
            title="Manage Inventory"
            isOpen={isOpen}
            onClose={onClose}
            isPinned={isPinned}
            onTogglePin={onTogglePin}
        >
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search equipment..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white focus:border-dnd-gold outline-none" 
                />
            </div>

            {loading ? (
                <div className="text-center text-dnd-gold animate-pulse">Loading armory...</div>
            ) : (
                <div className="space-y-1">
                    {filteredList.map(item => (
                        <div key={item.index} className="flex justify-between items-center p-2 bg-[#1b1c20] border border-gray-700 rounded hover:border-gray-500">
                            <span className="text-sm font-bold text-gray-300">{item.name}</span>
                            <button 
                                onClick={() => addItem(item)}
                                className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs font-bold uppercase hover:bg-green-900 hover:text-white hover:border-green-500 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    ))}
                    {filteredList.length === 0 && <div className="text-gray-500 italic text-center">No items found.</div>}
                </div>
            )}
        </SidePanelLayout>
    );
};

export default InventoryManagerSidePanel;
