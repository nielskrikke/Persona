import React from 'react';
import { Plus } from 'lucide-react';
import { CharacterState, InventoryItem, Currency } from '../../../types';
import { WIDGET_BG } from '../../../data/constants';

interface InventoryTabProps {
    character: CharacterState;
    currentWeight: number;
    maxWeight: number;
    updateQuantity: (id: string, newQty: number) => void;
    toggleAttunement: (id: string) => void;
    setSelectedDetail: (item: any) => void;
    setShowItemSearchModal: (val: boolean, mode?: 'search' | 'custom') => void;
    setShowHomebrewModal: (val: boolean, tab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat') => void;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ 
    character, currentWeight, maxWeight, updateQuantity, toggleAttunement, setSelectedDetail, setShowItemSearchModal, setShowHomebrewModal, setCharacter 
}) => {
    const [inventorySearch, setInventorySearch] = React.useState('');
    const updateCurrency = (key: keyof Currency, value: string) => { setCharacter(prev => ({ ...prev, currency: { ...prev.currency, [key]: parseInt(value) || 0 } })); };

    const arrowsmithCls = character.classes.find(c => c.definition.index === 'arrowsmith');
    const isArrowsmith = !!arrowsmithCls;
    const arrowsmithLvl = arrowsmithCls?.level || 0;

    const getArrowsmithMax = (l: number) => {
        if (l <= 0) return 0;
        if (l < 10) return l * 2 + 2;
        if (l < 19) return 20 + (l - 9);
        return 30;
    };

    const maxCustomArrows = getArrowsmithMax(arrowsmithLvl);
    const customArrowsInQuiver = character.inventory.filter(i => i.id.startsWith('as-arrow-'));
    const totalCustomCount = customArrowsInQuiver.reduce((sum, i) => sum + i.quantity, 0);
    const craftingPool = character.featureUsage['Arrow Crafting'];

    const craftArrow = (name: string, desc: string) => {
        if (totalCustomCount >= maxCustomArrows) {
            alert(`Quiver is full! You can only carry up to ${maxCustomArrows} Custom Arrows total. Use or remove existing arrows to make room.`);
            return;
        }

        if (!craftingPool || craftingPool.current <= 0) {
            alert("No crafting points remaining! Finish a Short or Long Rest to replenish your supplies.");
            return;
        }

        setCharacter(prev => {
            const arrowId = `as-arrow-${name.toLowerCase().replace(/\s+/g, '-')}`;
            const existing = prev.inventory.find(i => i.id === arrowId);
            
            const newInventory = existing 
                ? prev.inventory.map(i => i.id === arrowId ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev.inventory, {
                    id: arrowId,
                    name: `Custom Arrow: ${name}`,
                    quantity: 1,
                    weight: 0.05,
                    description: desc,
                    equipped: true,
                    equipment_category: { index: 'ammunition', name: 'Ammunition' }
                }];

            return {
                ...prev,
                inventory: newInventory,
                featureUsage: {
                    ...prev.featureUsage,
                    ['Arrow Crafting']: { ...craftingPool, current: craftingPool.current - 1 }
                }
            };
        });
    };

    const fireArrow = (id: string) => {
        const item = character.inventory.find(i => i.id === id);
        if (item && item.quantity > 0) {
            updateQuantity(id, item.quantity - 1);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${WIDGET_BG} p-4 rounded-xl border border-[#3e4149]/50 shadow-sm`}>
                <div className="lg:col-span-2 flex gap-2 items-center justify-between lg:justify-start overflow-x-auto pb-1">
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map(curr => (
                        <div key={curr} className="flex flex-col items-center bg-gray-800/50 p-2 rounded border border-gray-700/50 shrink-0">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{curr}</span>
                            <input 
                                type="number" 
                                value={character.currency[curr as keyof Currency]} 
                                onChange={(e) => updateCurrency(curr as keyof Currency, e.target.value)} 
                                className="w-12 bg-transparent text-center font-bold text-white outline-none focus:border-b border-dnd-gold" 
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col justify-center border-l border-gray-700/50 pl-0 lg:pl-6 pt-4 lg:pt-0">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                        <span>Encumbrance</span>
                        <span>{currentWeight} / {maxWeight} lb</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${currentWeight > maxWeight ? 'bg-dnd-red' : 'bg-gray-500'}`} 
                            style={{width: `${Math.min(100, (currentWeight/maxWeight)*100)}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Arrowsmith Quiver Section */}
            {isArrowsmith && (
                <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm animate-in slide-in-from-top-4 duration-500`}>
                    <div className="bg-[#121316] px-6 py-4 border-b border-[#3e4149]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-dnd-gold uppercase tracking-widest">Specialized Quiver</h3>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Manage Blueprinted Ammunition</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-black/40 px-3 py-1 rounded border border-gray-800 text-center min-w-[120px]">
                                <div className="text-[9px] text-gray-500 font-bold uppercase">Crafting Points</div>
                                <div className={`text-sm font-black ${craftingPool?.current === 0 ? 'text-dnd-red' : 'text-gray-100'}`}>
                                    {craftingPool?.current || 0} / {craftingPool?.max || 0}
                                </div>
                            </div>
                            <div className="bg-black/40 px-3 py-1 rounded border border-gray-800 text-center min-w-[120px]">
                                <div className="text-[9px] text-gray-500 font-bold uppercase">Carrying Capacity</div>
                                <div className={`text-sm font-black ${totalCustomCount >= maxCustomArrows ? 'text-dnd-red' : 'text-gray-100'}`}>
                                    {totalCustomCount} / {maxCustomArrows}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: 'Silent', level: 1, desc: 'Hidden misses don\'t reveal. Crit vs surprised.' },
                            { name: 'Forceful', level: 1, desc: 'Str save or pushed 20ft.' },
                            { name: 'Fire', level: 1, desc: '+1d10 Fire. Ignite 1d6/turn (DC 10 Dex).' },
                            { name: 'Shattering', level: 2, desc: '10ft cone behind target (Dex save half).' },
                            { name: 'Smokescreen', level: 2, desc: '20ft radius fog (1 min).' },
                            { name: 'Light', level: 3, desc: 'Bonus Action attack. Ignore reload.' },
                            { name: 'Sniper', level: 3, desc: 'Double weapon range.' },
                            { name: 'Piercing', level: 4, desc: '20ft line. Ignore resistance.' },
                            { name: 'Blinding', level: 4, desc: '30ft burst (Con save or blinded).' },
                            { name: 'Explosive', level: 5, desc: '5d6 Force damage (10ft AoE).' },
                            { name: 'Knockdown', level: 5, desc: 'Str save or knocked prone.' },
                        ].filter(a => a.level <= arrowsmithLvl).sort((a, b) => a.name.localeCompare(b.name)).map(arrow => {
                            const arrowId = `as-arrow-${arrow.name.toLowerCase().replace(/\s+/g, '-')}`;
                            const count = character.inventory.find(i => i.id === arrowId)?.quantity || 0;
                            return (
                                <div key={arrow.name} className="bg-[#0b0c0e]/40 border border-gray-700/50 rounded-lg p-3 flex flex-col justify-between hover:border-gray-500 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-bold text-gray-200 text-xs group-hover:text-dnd-gold transition-colors">{arrow.name} Arrow</div>
                                            <div className="text-[9px] text-gray-500 leading-tight pr-2">{arrow.desc}</div>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-black min-w-[30px] text-center ${count > 0 ? 'bg-dnd-gold text-black' : 'bg-gray-800 text-gray-500'}`}>
                                            x{count}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => craftArrow(arrow.name, arrow.desc)}
                                            className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-[10px] font-bold uppercase rounded transition-colors"
                                        >
                                            Craft
                                        </button>
                                        {count > 0 && (
                                            <button 
                                                onClick={() => fireArrow(arrowId)}
                                                className="px-3 py-1.5 bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 text-red-500 text-[10px] font-bold uppercase rounded transition-colors"
                                            >
                                                Use
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
                    <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold uppercase text-gray-400 bg-black/40 px-3 py-1.5 rounded border border-gray-700/50">
                        <span className={character.inventory.filter(i => i.attuned).length >= 3 ? 'text-red-400' : 'text-blue-400'}>
                            {character.inventory.filter(i => i.attuned).length} / 3
                        </span>
                        <span>Attuned</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Filter items..." 
                        value={inventorySearch} 
                        onChange={(e) => setInventorySearch(e.target.value)} 
                        className="text-[9px] font-bold uppercase px-3 py-1.5 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-64 placeholder:text-gray-600" 
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setShowItemSearchModal(true)} 
                        className="text-[10px] text-dnd-red font-bold uppercase border border-dnd-red bg-black/40 px-4 py-1.5 rounded hover:bg-dnd-red hover:text-white transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        Search Armory
                    </button>
                </div>
            </div>
            {[{ title: "Equipped Items", items: character.inventory.filter(i => i.equipped && !i.id.startsWith('as-arrow-')) }, { title: "Backpack", items: character.inventory.filter(i => !i.equipped && !i.id.startsWith('as-arrow-')) }].map((section, idx) => {
                const filteredItems = section.items
                    .filter(i => i.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name));
                if (section.items.length === 0 && idx === 0 && !inventorySearch) return null;
                return (
                    <div key={section.title} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}>
                        <div className="bg-[#121316]/80 px-6 py-4"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{section.title}</h3></div>
                        <div className="overflow-x-auto custom-scrollbar"><div className="grid grid-cols-[1fr_50px_80px_60px_40px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase items-center min-w-[500px]"><div>Item</div><div className="text-center">Wgt</div><div className="text-center">Qty</div><div className="text-center">Cost</div><div className="text-center">Attune</div></div><div className="divide-y divide-[#2e3036]/60 min-w-[500px]">{filteredItems.map(item => {
                            const isMagical = item.requires_attunement || (item.modifiers && item.modifiers.length > 0);
                            const isWondrous = item.equipment_category?.index === 'wondrous-items' || item.equipment_category?.name?.includes('Wondrous');
                            return (<div key={item.id} onClick={() => setSelectedDetail(item)} className="grid grid-cols-[1fr_50px_80px_60px_40px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 cursor-pointer group"><div className="min-w-0"><div className={`font-bold text-sm truncate ${isWondrous ? 'text-purple-400' : isMagical ? 'text-sky-300' : 'text-gray-200'}`}>{item.name}</div></div><div className="text-center text-xs text-gray-400">{item.weight}</div><div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-800 text-gray-400">-</button><span className="w-8 text-center text-xs text-white">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-800 text-gray-400">+</button></div><div className="text-center text-xs text-gray-400">{typeof item.cost === 'object' && item.cost ? `${item.cost.quantity}${item.cost.unit}` : (typeof item.cost === 'string' ? item.cost : '-')}</div><div className="flex justify-center" onClick={(e) => e.stopPropagation()}>{item.requires_attunement && (<div onClick={() => toggleAttunement(item.id)} className={`w-4 h-4 rounded-full border cursor-pointer ${item.attuned ? 'bg-cyan-500 border-cyan-400' : 'bg-transparent border-gray-600'}`}></div>)}</div></div>);
                        })}</div></div>
                    </div>
                );
            })}
        </div>
    );
};

export default InventoryTab;