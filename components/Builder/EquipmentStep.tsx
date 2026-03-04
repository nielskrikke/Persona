
import React, { useState, useEffect } from 'react';
import { APIReference, InventoryItem } from '../../types';
import { fetchEquipment, fetchEquipmentDetail } from '../../data/index';

interface EquipmentStepProps {
    onComplete: (equipment: InventoryItem[]) => void;
    onBack: () => void;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({ onComplete, onBack }) => {
    const [allEquipment, setAllEquipment] = useState<APIReference[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const startingPacks = [
        { name: "Explorer's Pack", items: ["Backpack", "Bedroll", "Mess Kit", "Tinderbox", "Torch", "Rations (1 day)", "Waterskin", "Rope, Hempen (50 feet)"] },
        { name: "Dungeoneer's Pack", items: ["Backpack", "Crowbar", "Hammer", "Piton", "Torch", "Rations (1 day)", "Tinderbox", "Waterskin", "Rope, Hempen (50 feet)"] },
        { name: "Diplomat's Pack", items: ["Chest", "Clothes, Fine", "Ink (1 ounce bottle)", "Ink Pen", "Lamp", "Oil (flask)", "Paper (one sheet)", "Perfume (vial)", "Sealing Wax", "Soap"] },
        { name: "Burglar's Pack", items: ["Backpack", "Ball Bearings (bag of 1,000)", "String (10 feet)", "Bell", "Candle", "Crowbar", "Hammer", "Piton", "Lantern, Hooded", "Oil (flask)", "Rations (1 day)", "Tinderbox", "Waterskin", "Rope, Hempen (50 feet)"] }
    ];

    useEffect(() => {
        const load = async () => {
            const results = await fetchEquipment();
            setAllEquipment(results);
            setLoading(false);
        };
        load();
    }, []);

    const toggleItem = (name: string) => {
        if (selectedItems.includes(name)) {
            const idx = selectedItems.indexOf(name);
            const newList = [...selectedItems];
            newList.splice(idx, 1);
            setSelectedItems(newList);
        } else {
            setSelectedItems(prev => [...prev, name]);
        }
    };

    const addPack = (items: string[]) => {
        setSelectedItems(prev => [...prev, ...items]);
    };

    const handleNext = async () => {
        setProcessing(true);
        const finalInventory: InventoryItem[] = [];
        const counts: Record<string, number> = {};
        selectedItems.forEach(i => { counts[i] = (counts[i] || 0) + 1; });

        for (const [name, qty] of Object.entries(counts)) {
            const match = allEquipment.find(eq => 
                eq.name === name || 
                name.includes(eq.name) || 
                eq.name.includes(name.split(' (')[0])
            );

            if (match) {
                const detail = await fetchEquipmentDetail(match.index);
                if (detail) {
                    finalInventory.push({
                        id: `start-item-${match.index}-${Date.now()}`,
                        index: detail.index,
                        name: detail.name,
                        quantity: qty,
                        weight: detail.weight || 0,
                        cost: detail.cost,
                        desc: detail.desc,
                        equipped: false,
                        damage: detail.damage,
                        armor_class: detail.armor_class,
                        properties: detail.properties?.map(p => typeof p === 'string' ? p : p.name),
                        range: detail.range,
                        equipment_category: detail.equipment_category,
                        modifiers: detail.modifiers,
                        requires_attunement: detail.requires_attunement
                    });
                } else {
                    finalInventory.push({ id: `stub-${name}`, name: name, quantity: qty, weight: 0, equipped: false });
                }
            } else {
                finalInventory.push({ id: `custom-${name}`, name: name, quantity: qty, weight: 0, equipped: false });
            }
        }
        onComplete(finalInventory);
    };

    if (loading || processing) return (
        <div className="flex flex-col items-center justify-center h-full text-dnd-gold">
            <div className="w-16 h-16 border-4 border-dnd-gold border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="font-serif italic text-xl">{processing ? 'Packing your satchel...' : 'Forging the armory archives...'}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Available Area */}
                <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-5 bg-[#121316] border-b border-gray-800 shrink-0">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold"></span>
                            Armory
                        </h3>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                        <section>
                            <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Starting Kits</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {startingPacks.map(pack => (
                                    <div key={pack.name} className="bg-black/20 p-4 rounded-xl border border-gray-800 group hover:border-dnd-gold/30 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-black uppercase tracking-widest text-xs text-white">{pack.name}</span>
                                            <button 
                                                onClick={() => addPack(pack.items)}
                                                className="text-[10px] font-black uppercase tracking-widest bg-dnd-gold hover:bg-yellow-600 text-black px-4 py-1.5 rounded-lg shadow-lg"
                                            >
                                                Add All
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-1 font-serif italic">{pack.items.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="flex flex-col h-[300px]">
                            <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Individual Gear</h4>
                            <div className="flex-grow overflow-y-auto custom-scrollbar bg-black/30 border border-gray-800 rounded-xl p-2">
                                 {allEquipment.map(item => (
                                    <div 
                                        key={item.index} 
                                        onClick={() => toggleItem(item.name)}
                                        className="cursor-pointer px-4 py-2.5 text-xs font-bold rounded-lg flex justify-between items-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                    >
                                        <span>{item.name}</span>
                                        <span className="text-dnd-gold opacity-50">+</span>
                                    </div>
                                 ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Selected Area */}
                <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-6 bg-[#121316] border-b border-gray-800 shrink-0">
                        <h2 className="text-4xl font-serif text-white mb-1">Your Satchel</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inventory before departure</p>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 italic text-center p-10">
                                <span className="text-6xl mb-4 opacity-10">🎒</span>
                                <p className="font-serif text-lg">Your satchel is empty. Gather gear or select a kit to prepare for your journey.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {Array.from(new Set(selectedItems)).map((item) => {
                                    const count = selectedItems.filter(i => i === item).length;
                                    return (
                                        <div key={item} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-gray-800 group hover:border-gray-600">
                                            <span className="text-gray-200 text-sm font-bold">{item}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-dnd-gold font-black bg-dnd-gold/10 px-2 py-0.5 rounded border border-dnd-gold/20">x{count}</span>
                                                <button 
                                                    onClick={() => setSelectedItems(prev => prev.filter(i => i !== item))}
                                                    className="text-gray-600 hover:text-red-500 text-2xl font-light transition-colors"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
                        onClick={handleNext}
                        className="flex-grow py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-2xl transition-all transform active:scale-95 bg-green-700 hover:bg-green-600 text-white"
                    >
                        Enter the World &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentStep;
