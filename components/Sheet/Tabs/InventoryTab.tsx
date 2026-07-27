import React, { useState, useEffect } from 'react';
import { Plus, Users, ArrowRightLeft, PackageCheck, PackagePlus, Shield } from 'lucide-react';
import { CharacterState, InventoryItem, Currency } from '../../../types';
import { WIDGET_BG } from '../../../data/constants';
import { loadPartyInventory, savePartyInventory } from '../../../services/supabase';

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
    const [inventorySearch, setInventorySearch] = useState('');
    const [inventoryMode, setInventoryMode] = useState<'personal' | 'party'>('personal');
    const [partyInventory, setPartyInventory] = useState<InventoryItem[]>([]);
    const [partyCurrency, setPartyCurrency] = useState<Currency>({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
    const [loadingParty, setLoadingParty] = useState(false);
    const [claimPopover, setClaimPopover] = useState<{ itemId: string; qty: number } | null>(null);

    const hasCampaign = !!character.campaign_id;

    useEffect(() => {
        if (hasCampaign && character.campaign_id) {
            fetchPartyInventory(character.campaign_id);
        }
    }, [hasCampaign, character.campaign_id]);

    const fetchPartyInventory = async (cmpId: string) => {
        setLoadingParty(true);
        try {
            const data = await loadPartyInventory(cmpId);
            setPartyInventory(data.inventory || []);
            setPartyCurrency(data.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 });
        } catch (e) {
            console.error("Error loading party inventory:", e);
        } finally {
            setLoadingParty(false);
        }
    };

    const updateCurrency = (key: keyof Currency, value: string) => { 
        setCharacter(prev => ({ ...prev, currency: { ...prev.currency, [key]: parseInt(value) || 0 } })); 
    };

    const updatePartyCurrency = async (key: keyof Currency, value: string) => {
        if (!character.campaign_id) return;
        const newPartyCurrency = { ...partyCurrency, [key]: parseInt(value) || 0 };
        setPartyCurrency(newPartyCurrency);
        await savePartyInventory(character.campaign_id, partyInventory, newPartyCurrency);
    };

    // Transfer item from Personal Inventory -> Party Inventory
    const transferToParty = async (item: InventoryItem, transferQty: number = 1) => {
        if (!character.campaign_id) return;
        const qtyToTransfer = Math.min(item.quantity, transferQty);
        if (qtyToTransfer <= 0) return;

        // 1. Update Personal Inventory
        const newPersonalInventory = character.inventory.map(i => {
            if (i.id === item.id) {
                return { ...i, quantity: i.quantity - qtyToTransfer };
            }
            return i;
        }).filter(i => i.quantity > 0);

        setCharacter(prev => ({ ...prev, inventory: newPersonalInventory }));

        // 2. Update Party Inventory
        const partyCopy = [...partyInventory];
        const existingIdx = partyCopy.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
        if (existingIdx >= 0) {
            partyCopy[existingIdx] = {
                ...partyCopy[existingIdx],
                quantity: partyCopy[existingIdx].quantity + qtyToTransfer
            };
        } else {
            partyCopy.push({
                ...item,
                id: `party-item-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
                quantity: qtyToTransfer,
                equipped: false,
                attuned: false
            });
        }

        setPartyInventory(partyCopy);
        await savePartyInventory(character.campaign_id, partyCopy, partyCurrency);
    };

    // Claim item from Party Inventory -> Personal Inventory
    const claimToPersonal = async (partyItem: InventoryItem, claimQty: number = 1) => {
        if (!character.campaign_id) return;
        const qtyToClaim = Math.min(partyItem.quantity, claimQty);
        if (qtyToClaim <= 0) return;

        // 1. Update Party Inventory
        const updatedParty = partyInventory.map(i => {
            if (i.id === partyItem.id) {
                return { ...i, quantity: i.quantity - qtyToClaim };
            }
            return i;
        }).filter(i => i.quantity > 0);

        setPartyInventory(updatedParty);
        await savePartyInventory(character.campaign_id, updatedParty, partyCurrency);

        // 2. Update Personal Inventory
        setCharacter(prev => {
            const personalCopy = [...prev.inventory];
            const existingIdx = personalCopy.findIndex(i => i.name.toLowerCase() === partyItem.name.toLowerCase());
            if (existingIdx >= 0) {
                personalCopy[existingIdx] = {
                    ...personalCopy[existingIdx],
                    quantity: personalCopy[existingIdx].quantity + qtyToClaim
                };
            } else {
                personalCopy.push({
                    ...partyItem,
                    id: `item-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
                    quantity: qtyToClaim,
                    equipped: false,
                    attuned: false
                });
            }
            return { ...prev, inventory: personalCopy };
        });
    };

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
            {/* Campaign Inventory Switcher - Only shown if character is linked to a campaign */}
            {hasCampaign && (
                <div className="flex justify-center">
                    <div className="inline-flex bg-black/60 p-1 rounded-lg border border-gray-800 shadow-md">
                        <button 
                            onClick={() => setInventoryMode('personal')}
                            className={`py-1 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${inventoryMode === 'personal' ? 'bg-dnd-gold text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Shield size={12} /> Personal
                        </button>
                        <button 
                            onClick={() => setInventoryMode('party')}
                            className={`py-1 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${inventoryMode === 'party' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Users size={12} /> Party ({partyInventory.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Currency & Encumbrance Header */}
            {inventoryMode === 'personal' ? (
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
                            <span>Personal Encumbrance</span>
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
            ) : (
                <div className={`flex gap-4 bg-purple-950/20 p-4 rounded-xl border border-purple-800/50 shadow-sm items-center justify-between`}>
                    <div className="flex gap-3 items-center overflow-x-auto pb-1">
                        <div className="text-purple-300 font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 pr-2">
                            <Users size={16} /> Party Treasury:
                        </div>
                        {['cp', 'sp', 'ep', 'gp', 'pp'].map(curr => (
                            <div key={curr} className="flex flex-col items-center bg-purple-900/30 p-2 rounded border border-purple-700/50 shrink-0">
                                <span className="text-[10px] font-bold text-purple-400 uppercase">{curr}</span>
                                <input 
                                    type="number" 
                                    value={partyCurrency[curr as keyof Currency]} 
                                    onChange={(e) => updatePartyCurrency(curr as keyof Currency, e.target.value)} 
                                    className="w-12 bg-transparent text-center font-bold text-white outline-none focus:border-b border-purple-400" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Arrowsmith Quiver Section (Personal view only) */}
            {inventoryMode === 'personal' && isArrowsmith && (
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

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
                    {inventoryMode === 'personal' && (
                        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold uppercase text-gray-400 bg-black/40 px-3 py-1.5 rounded border border-gray-700/50">
                            <span className={character.inventory.filter(i => i.attuned).length >= 3 ? 'text-red-400' : 'text-blue-400'}>
                                {character.inventory.filter(i => i.attuned).length} / 3
                            </span>
                            <span>Attuned</span>
                        </div>
                    )}
                    <input 
                        type="text" 
                        placeholder={inventoryMode === 'personal' ? "Filter personal items..." : "Filter party items..."} 
                        value={inventorySearch} 
                        onChange={(e) => setInventorySearch(e.target.value)} 
                        className="text-[9px] font-bold uppercase px-3 py-1.5 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-64 placeholder:text-gray-600" 
                    />
                </div>
                {inventoryMode === 'personal' && (
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => setShowItemSearchModal(true)} 
                            className="text-[10px] text-dnd-red font-bold uppercase border border-dnd-red bg-black/40 px-4 py-1.5 rounded hover:bg-dnd-red hover:text-white transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            Search Armory
                        </button>
                    </div>
                )}
            </div>

            {/* Personal Inventory Views */}
            {inventoryMode === 'personal' && [{ title: "Equipped Items", items: character.inventory.filter(i => i.equipped && !i.id.startsWith('as-arrow-')) }, { title: "Backpack", items: character.inventory.filter(i => !i.equipped && !i.id.startsWith('as-arrow-')) }].map((section, idx) => {
                const filteredItems = section.items
                    .filter(i => i.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name));
                if (section.items.length === 0 && idx === 0 && !inventorySearch) return null;
                return (
                    <div key={section.title} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}>
                        <div className="bg-[#121316]/80 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{section.title}</h3>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <div className="grid grid-cols-[1fr_50px_80px_60px_40px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase items-center min-w-[500px]">
                                <div>Item</div>
                                <div className="text-center">Wgt</div>
                                <div className="text-center">Qty</div>
                                <div className="text-center">Cost</div>
                                <div className="text-center">Attune</div>
                            </div>
                            <div className="divide-y divide-[#2e3036]/60 min-w-[500px]">
                                {filteredItems.map(item => {
                                    const isMagical = item.requires_attunement || (item.modifiers && item.modifiers.length > 0);
                                    const isWondrous = item.equipment_category?.index === 'wondrous-items' || item.equipment_category?.name?.includes('Wondrous');
                                    return (
                                        <div key={item.id} onClick={() => setSelectedDetail({ ...item, isPartyItem: false })} className="grid grid-cols-[1fr_50px_80px_60px_40px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 cursor-pointer group">
                                            <div className="min-w-0">
                                                <div className={`font-bold text-sm truncate ${isWondrous ? 'text-purple-400' : isMagical ? 'text-sky-300' : 'text-gray-200'}`}>{item.name}</div>
                                            </div>
                                            <div className="text-center text-xs text-gray-400">{item.weight}</div>
                                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-800 text-gray-400">-</button>
                                                <span className="w-8 text-center text-xs text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-800 text-gray-400">+</button>
                                            </div>
                                            <div className="text-center text-xs text-gray-400">{typeof item.cost === 'object' && item.cost ? `${item.cost.quantity}${item.cost.unit}` : (typeof item.cost === 'string' ? item.cost : '-')}</div>
                                            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                                {item.requires_attunement && (
                                                    <div onClick={() => toggleAttunement(item.id)} className={`w-4 h-4 rounded-full border cursor-pointer ${item.attuned ? 'bg-cyan-500 border-cyan-400' : 'bg-transparent border-gray-600'}`}></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Party Inventory Views */}
            {inventoryMode === 'party' && (
                <div className={`${WIDGET_BG} border border-purple-800/40 rounded-xl overflow-hidden shadow-sm`}>
                    <div className="bg-purple-950/40 px-6 py-4 flex justify-between items-center border-b border-purple-900/40">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-purple-300" />
                            <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wider">Party Inventory Stash</h3>
                        </div>
                        <span className="text-[10px] text-purple-400 font-bold uppercase">{partyInventory.length} Item Type(s)</span>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="grid grid-cols-[1fr_60px_90px_100px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase items-center min-w-[500px]">
                            <div>Item</div>
                            <div className="text-center">Wgt</div>
                            <div className="text-center">Party Qty</div>
                            <div className="text-center">Action</div>
                        </div>

                        <div className="divide-y divide-[#2e3036]/60 min-w-[500px]">
                            {partyInventory
                                .filter(i => i.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                                .map(partyItem => {
                                    const isMagical = partyItem.requires_attunement || (partyItem.modifiers && partyItem.modifiers.length > 0);
                                    const isWondrous = partyItem.equipment_category?.index === 'wondrous-items' || partyItem.equipment_category?.name?.includes('Wondrous');
                                    
                                    return (
                                        <div key={partyItem.id} onClick={() => setSelectedDetail({ ...partyItem, isPartyItem: true })} className="grid grid-cols-[1fr_60px_90px_100px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 cursor-pointer group">
                                            <div className="min-w-0">
                                                <div className={`font-bold text-sm truncate ${isWondrous ? 'text-purple-400' : isMagical ? 'text-sky-300' : 'text-gray-200'}`}>{partyItem.name}</div>
                                            </div>
                                            <div className="text-center text-xs text-gray-400">{partyItem.weight || '-'}</div>
                                            <div className="text-center font-mono font-bold text-dnd-gold text-sm">{partyItem.quantity}</div>
                                            <div className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => {
                                                        if (partyItem.quantity > 1) {
                                                            setClaimPopover({ itemId: partyItem.id, qty: 1 });
                                                        } else {
                                                            claimToPersonal(partyItem, 1);
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-dnd-gold hover:bg-amber-400 text-black text-[10px] font-bold uppercase rounded transition-colors flex items-center gap-1 shadow"
                                                    title="Claim item to Personal Inventory"
                                                >
                                                    <PackageCheck size={12} /> Claim
                                                </button>

                                                {claimPopover?.itemId === partyItem.id && (
                                                    <div className="absolute right-0 bottom-full mb-2 z-50 w-56 bg-[#1e2026] border border-amber-500/50 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                                                                <PackageCheck size={13} /> Claim Qty
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-mono">
                                                                Max: {partyItem.quantity}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 mb-2.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setClaimPopover(p => p ? { ...p, qty: Math.max(1, p.qty - 1) } : null)}
                                                                className="w-7 h-7 rounded bg-black/40 border border-gray-700 hover:border-gray-500 text-white font-bold text-xs flex items-center justify-center transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <input 
                                                                type="number"
                                                                min={1}
                                                                max={partyItem.quantity}
                                                                value={claimPopover.qty}
                                                                onChange={(e) => {
                                                                    const v = parseInt(e.target.value) || 1;
                                                                    const clamped = Math.max(1, Math.min(partyItem.quantity, v));
                                                                    setClaimPopover(p => p ? { ...p, qty: clamped } : null);
                                                                }}
                                                                className="w-14 h-7 text-center bg-black/60 border border-gray-700 rounded text-white font-mono font-bold text-xs focus:border-amber-500 outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setClaimPopover(p => p ? { ...p, qty: Math.min(partyItem.quantity, p.qty + 1) } : null)}
                                                                className="w-7 h-7 rounded bg-black/40 border border-gray-700 hover:border-gray-500 text-white font-bold text-xs flex items-center justify-center transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setClaimPopover(p => p ? { ...p, qty: partyItem.quantity } : null)}
                                                                className="px-2 h-7 rounded bg-amber-950/60 border border-amber-600/60 text-amber-300 font-bold text-[9px] uppercase hover:bg-amber-900 transition-colors"
                                                            >
                                                                All
                                                            </button>
                                                        </div>

                                                        <div className="flex gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setClaimPopover(null)}
                                                                className="flex-1 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] font-bold uppercase transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const q = claimPopover.qty;
                                                                    setClaimPopover(null);
                                                                    claimToPersonal(partyItem, q);
                                                                }}
                                                                className="flex-1 py-1 bg-dnd-gold hover:bg-amber-400 text-black rounded text-[10px] font-bold uppercase transition-colors shadow"
                                                            >
                                                                Claim ({claimPopover.qty})
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            {partyInventory.length === 0 && (
                                <div className="text-center py-16 text-gray-500 italic text-xs space-y-2">
                                    <PackagePlus size={32} className="mx-auto text-gray-600 opacity-50" />
                                    <div>Party Inventory is currently empty.</div>
                                    <div className="text-[10px] text-gray-600">Switch to Personal Inventory and click "Party" on any item to transfer it here!</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryTab;
