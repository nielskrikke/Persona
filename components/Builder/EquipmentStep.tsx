
import React, { useState, useEffect, useRef } from 'react';
import { CharacterClass, EquipmentDetail, InventoryItem } from '../../types';
import { fetchEquipment, fetchEquipmentDetail } from '../../data/index';
import ItemSearchModal from './ItemSearchModal';
import ItemCustomizationModal from '../Sheet/Modals/ItemCustomizationModal';
import { Search, Globe } from 'lucide-react';

interface EquipmentStepProps {
    onComplete: (equipment: InventoryItem[], currency?: { gp: number; sp: number; cp: number }) => void;
    onBack: () => void;
    userId?: string;
    classes?: CharacterClass[];
}

const CLASS_STARTING_KITS: Record<string, string[]> = {
    barbarian: ['Greataxe', 'Handaxe', 'Handaxe', 'Handaxe', 'Handaxe', "Explorer's Pack"],
    bard: ['Leather Armor', 'Dagger', 'Musical Instrument', "Entertainer's Pack"],
    cleric: ['Chain Shirt', 'Shield', 'Mace', 'Holy Symbol', "Priest's Pack"],
    druid: ['Leather Armor', 'Shield', 'Sickle', 'Quarterstaff', "Explorer's Pack", 'Herbalism Kit'],
    fighter: ['Chain Mail', 'Greatsword', 'Flail', 'Javelin', 'Javelin', 'Javelin', 'Javelin', "Dungeoneer's Pack"],
    monk: ['Spear', 'Dagger', 'Dagger', 'Dagger', 'Dagger', 'Dagger', "Explorer's Pack"],
    paladin: ['Chain Mail', 'Shield', 'Longsword', 'Javelin', 'Javelin', 'Javelin', "Priest's Pack"],
    ranger: ['Studded Leather', 'Scimitar', 'Shortsword', 'Longbow', 'Arrows (20)', 'Quiver', "Explorer's Pack"],
    rogue: ['Leather Armor', 'Dagger', 'Shortsword', 'Shortbow', 'Arrow', 'Arrow', 'Arrow', 'Quiver', "Burglar's Pack"],
    sorcerer: ['Spear', 'Dagger', 'Dagger', 'Arcane Focus', "Dungeoneer's Pack"],
    warlock: ['Leather Armor', 'Dagger', 'Dagger', 'Arcane Focus', "Scholar's Pack"],
    wizard: ['Robe', 'Dagger', 'Dagger', 'Arcane Focus', "Scholar's Pack"],
};

const CLASS_KIT_GOLD: Record<string, number> = {
    barbarian: 15, bard: 19, cleric: 7, druid: 9, fighter: 4, monk: 11,
    paladin: 9, ranger: 7, rogue: 8, sorcerer: 28, warlock: 15, wizard: 5,
};

const CLASS_OPTION_B_GOLD: Record<string, number> = {
    barbarian: 75, bard: 90, cleric: 110, druid: 50, fighter: 155, monk: 50,
    paladin: 150, ranger: 150, rogue: 100, sorcerer: 50, warlock: 100, wizard: 55,
};

const EquipmentStep: React.FC<EquipmentStepProps> = ({ onComplete, onBack, userId, classes = [] }) => {
    const [allEquipment, setAllEquipment] = useState<EquipmentDetail[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedClassKit, setSelectedClassKit] = useState(0);
    const [selectedKitMode, setSelectedKitMode] = useState<'kit' | 'gold'>('kit');
    const [customizingItem, setCustomizingItem] = useState<EquipmentDetail | null>(null);
    const resolvedItemsRef = useRef<EquipmentDetail[]>([]);

    const startingPacks = allEquipment
        .filter((item: any) => Array.isArray(item.contents) && item.contents.length > 0)
        .map((item: any) => ({
            name: item.name,
            items: item.contents.flatMap((entry: any) =>
                Array.from({ length: Math.max(1, Number(entry.quantity || 1)) }, () => entry.name)
            ),
        }));

    useEffect(() => {
        const load = async () => {
            const results = await fetchEquipment(userId);
            setAllEquipment(results);
            setLoading(false);
        };
        load();
    }, [userId]);

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

    const classKits = classes.map(entry => {
        const definition: any = entry.definition;
        const configured = definition.starting_equipment_options || definition.equipment_options || [];
        const items = configured.length > 0
            ? configured.flatMap((option: any) => option.equipment || option.items || []).map((item: any) => typeof item === 'string' ? item : item.item?.name || item.name).filter(Boolean)
            : (CLASS_STARTING_KITS[definition.index] || []);
        return { classIndex: definition.index, className: definition.name, items, goldA: CLASS_KIT_GOLD[definition.index] || 0, goldB: CLASS_OPTION_B_GOLD[definition.index] || 0 };
    }).filter(kit => kit.items.length > 0);

    const handleNext = async () => {
        setProcessing(true);
        const finalInventory: InventoryItem[] = [];
        const counts: Record<string, number> = {};
        const kitItems = selectedItems.length === 0 && selectedKitMode === 'kit' ? (classKits[selectedClassKit]?.items || []) : [];
        [...selectedItems, ...kitItems].forEach(i => { counts[i] = (counts[i] || 0) + 1; });

        for (const [name, qty] of Object.entries(counts)) {
            const normalized = (value: string) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
            const normalizedName = normalized(name);
            const reversedName = normalizedName.split(' ').reverse().join(' ');
            const searchPool = [...allEquipment, ...resolvedItemsRef.current];
            const match = searchPool.find(eq => normalized(eq.name) === normalizedName)
                || searchPool.find(eq => !eq.is_magic && (normalized(eq.name) === reversedName || normalizedName.includes(normalized(eq.name))))
                || searchPool.find(eq => !eq.is_magic && normalized(eq.name).includes(normalizedName));

            if (match) {
                const isResolvedCopy = resolvedItemsRef.current.includes(match) || Boolean((match as any).base_item && (match as any).damage);
                const detail = isResolvedCopy ? match : await fetchEquipmentDetail(match.index, userId);
                if (detail) {
                    finalInventory.push({
                        ...detail,
                        id: `start-item-${detail.index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        quantity: qty,
                        equipped: /armor|shield|weapon/i.test(String(detail.equipment_category?.name || name)) && /armor|shield/i.test(String(detail.equipment_category?.name || '')) || /shield/i.test(String(detail.name || '')),
                    });
                } else {
                    finalInventory.push({ id: `stub-${name}`, name: name, quantity: qty, weight: 0, equipped: false });
                }
            } else {
                finalInventory.push({ id: `custom-${name}`, name: name, quantity: qty, weight: 0, equipped: false });
            }
        }
        onComplete(
            finalInventory,
            selectedItems.length === 0
                ? { gp: selectedKitMode === 'gold' ? (classKits[selectedClassKit]?.goldB || 0) : (classKits[selectedClassKit]?.goldA || 0), sp: 0, cp: 0 }
                : undefined
        );
    };

    if (loading || processing) return (
        <div className="flex flex-col items-center justify-center h-full text-dnd-gold">
            <div className="w-16 h-16 border-4 border-dnd-gold border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="font-serif italic text-xl">{processing ? 'Packing your satchel...' : 'Forging the armory archives...'}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto pb-24 md:pb-32 px-4 animate-in fade-in duration-500">
            {classKits.length > 0 && (
                <section className="bg-[#1b1c20] border border-gray-800 rounded-xl p-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Class Starting Equipment</h3>
                        <span className="text-[9px] text-gray-500 uppercase font-bold">Used when no items are selected</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {classKits.map((kit, index) => (
                            <div key={kit.classIndex} className="space-y-1">
                                <button type="button" onClick={() => { setSelectedClassKit(index); setSelectedKitMode('kit'); }} className={`w-full text-left p-3 rounded-xl border transition-all ${selectedClassKit === index && selectedKitMode === 'kit' ? 'bg-dnd-gold/10 border-dnd-gold text-white' : 'bg-black/30 border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                                    <div className="text-xs font-bold">{kit.className} Kit + {kit.goldA} GP</div>
                                    <div className="text-[10px] mt-1 leading-relaxed">{kit.items.join(', ')}</div>
                                </button>
                                {kit.goldB > 0 && (
                                    <button type="button" onClick={() => { setSelectedClassKit(index); setSelectedKitMode('gold'); }} className={`w-full text-left p-2 rounded-lg border text-[10px] font-bold transition-all ${selectedClassKit === index && selectedKitMode === 'gold' ? 'bg-dnd-gold/10 border-dnd-gold text-dnd-gold' : 'bg-black/30 border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                                        Option B: {kit.goldB} GP instead
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Available Area */}
                <div className="bg-[#1b1c20] border border-gray-800 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
                    <div className="p-5 bg-[#121316] border-b border-gray-800 shrink-0 flex items-center justify-between">
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

                        <section className="flex flex-col">
                            <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em] mb-4">Individual Gear</h4>
                            <button 
                                onClick={() => setShowSearchModal(true)}
                                className="w-full py-4 bg-black/30 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-dnd-gold hover:border-dnd-gold hover:bg-black/50 transition-all group"
                            >
                                <Search size={24} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black uppercase tracking-widest">Search the Armory</span>
                                <span className="text-[10px] font-serif italic opacity-60">Find weapons, armor, and magic items</span>
                            </button>
                        </section>

                        <ItemSearchModal 
                            isOpen={showSearchModal}
                            onClose={() => setShowSearchModal(false)}
                            items={allEquipment}
                            onSelectItem={(item) => {
                                if ((item as any).template || (item as any).choice) {
                                    setCustomizingItem(item);
                                    return;
                                }
                                toggleItem(item.name);
                                setShowSearchModal(false);
                            }}
                        />
                        {customizingItem && (
                            <ItemCustomizationModal
                                item={customizingItem}
                                allItems={allEquipment}
                                onClose={() => setCustomizingItem(null)}
                                onConfirm={(resolved) => {
                                    resolvedItemsRef.current = [...resolvedItemsRef.current, resolved];
                                    setAllEquipment(prev => [...prev, resolved]);
                                    toggleItem(resolved.name);
                                    setCustomizingItem(null);
                                    setShowSearchModal(false);
                                }}
                            />
                        )}
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
