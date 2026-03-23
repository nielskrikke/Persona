
import React, { useState, useMemo } from 'react';
import { EquipmentDetail } from '../../types';
import { 
    Search, X, Filter, Package, Shield, Sword, FlaskConical, Hammer, Scroll, 
    ChevronDown, ChevronUp, Coins, Sparkles, Link, Info, Plus, Save, Trash2
} from 'lucide-react';
import { saveHomebrew } from '../../services/supabase';
import { ABILITY_NAMES, ABILITY_LABELS } from '../../types';

interface ItemSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: EquipmentDetail[];
    onSelectItem: (item: EquipmentDetail) => void;
    initialMode?: 'search' | 'custom';
    initialItem?: EquipmentDetail | null;
    currentUser?: any;
    onDuplicateToHomebrew?: (item: any) => void;
}

const CATEGORIES = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'weapon', name: 'Weapons', icon: Sword },
    { id: 'armor', name: 'Armor', icon: Shield },
    { id: 'gear', name: 'Adventuring Gear', icon: Package },
    { id: 'tools', name: 'Tools', icon: Hammer },
    { id: 'consumable', name: 'Consumables', icon: FlaskConical },
    { id: 'wondrous', name: 'Wondrous Items', icon: Scroll },
];

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'];

const ItemSearchModal: React.FC<ItemSearchModalProps> = ({ isOpen, onClose, items, onSelectItem, initialMode = 'search', initialItem, currentUser, onDuplicateToHomebrew }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [isAddingCustom, setIsAddingCustom] = useState(initialMode === 'custom');
    const [isSavingToHomebrew, setIsSavingToHomebrew] = useState(false);
    const [isSharedGlobally, setIsSharedGlobally] = useState(false);

    // Customization state
    const [selectedCustomization, setSelectedCustomization] = useState<string | null>(null);

    // Reset isAddingCustom when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setIsAddingCustom(initialMode === 'custom');
            if (initialItem && initialMode === 'custom') {
                setCustomName(initialItem.name);
                setCustomWeight(initialItem.weight?.toString() || '');
                setCustomCost(initialItem.cost ? `${initialItem.cost.quantity} ${initialItem.cost.unit}` : '');
                setCustomQuantity(initialItem.quantity?.toString() || '1');
                setCustomDesc(initialItem.desc?.join('\n') || '');
                setCustomRarity(initialItem.rarity || 'Common');
                setCustomCategory(initialItem.equipment_category?.name || 'Other');
                setCustomSubtype(initialItem.subtype || '');
                setCustomIsWondrous(!!initialItem.is_wondrous);
                setCustomAttunement(!!initialItem.requires_attunement);
                setCustomDmgDice(initialItem.damage?.damage_dice || '');
                const dmgType = initialItem.damage?.damage_type;
                setCustomDmgType(typeof dmgType === 'object' ? dmgType.name : (dmgType || 'Piercing'));
                setCustomWeaponType(initialItem.weapon_category || 'Simple');
                setCustomArmorType(initialItem.armor_category || 'Light');
                setCustomAcBase(initialItem.armor_class?.base?.toString() || '');
                setCustomAcDexBonus(!!initialItem.armor_class?.dex_bonus);
                setCustomAcMaxBonus(initialItem.armor_class?.max_bonus?.toString() || '');
                setCustomModifiers(initialItem.modifiers || []);
                setCustomProperties(initialItem.properties?.map(p => typeof p === 'string' ? p : p.name).join(', ') || '');
            } else if (!initialItem) {
                // Reset form if no initial item
                setCustomName(''); setCustomWeight(''); setCustomCost(''); setCustomQuantity('1'); setCustomDesc('');
                setCustomCategory('Other'); setCustomAttunement(false); setCustomModifiers([]);
                setCustomDmgDice(''); setCustomAcBase(''); setCustomProperties('');
            }
        }
    }, [isOpen, initialMode, initialItem]);

    // Advanced Filters
    const [rarityFilter, setRarityFilter] = useState<string[]>([]);
    const [attunementFilter, setAttunementFilter] = useState<'any' | 'required' | 'not-required'>('any');
    const [magicOnly, setMagicOnly] = useState(false);
    const [minCost, setMinCost] = useState<number>(0);
    const [maxCost, setMaxCost] = useState<number>(1000000);

    // Custom Item Form State
    const [customName, setCustomName] = useState('');
    const [customWeight, setCustomWeight] = useState('');
    const [customCost, setCustomCost] = useState('');
    const [customQuantity, setCustomQuantity] = useState('1');
    const [customDesc, setCustomDesc] = useState('');
    const [customRarity, setCustomRarity] = useState('Common');
    const [customCategory, setCustomCategory] = useState('Other');
    const [customSubtype, setCustomSubtype] = useState('');
    const [customIsWondrous, setCustomIsWondrous] = useState(false);
    const [customAttunement, setCustomAttunement] = useState(false);
    const [customDmgDice, setCustomDmgDice] = useState('');
    const [customDmgType, setCustomDmgType] = useState('Piercing');
    const [customWeaponType, setCustomWeaponType] = useState('Simple');
    const [customArmorType, setCustomArmorType] = useState('Light');
    const [customAcBase, setCustomAcBase] = useState('');
    const [customAcDexBonus, setCustomAcDexBonus] = useState(false);
    const [customAcMaxBonus, setCustomAcMaxBonus] = useState('');
    const [customModifiers, setCustomModifiers] = useState<any[]>([]);
    const [customProperties, setCustomProperties] = useState<string>('');

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Category matching
            const catIndex = item.equipment_category?.index || '';
            const catName = item.equipment_category?.name || '';
            
            let matchesCategory = selectedCategory === 'all';
            if (!matchesCategory) {
                if (selectedCategory === 'weapon') matchesCategory = catIndex === 'weapon' || catName.includes('Weapon');
                else if (selectedCategory === 'armor') matchesCategory = catIndex === 'armor' || catName.includes('Armor') || catIndex === 'shields';
                else if (selectedCategory === 'gear') matchesCategory = catIndex === 'adventuring-gear' || catName.includes('Gear');
                else if (selectedCategory === 'tools') matchesCategory = catIndex === 'tools' || catName.includes('Tool');
                else if (selectedCategory === 'consumable') matchesCategory = catIndex === 'potion' || catIndex === 'scroll' || item.index.includes('potion') || item.index.includes('scroll');
                else if (selectedCategory === 'wondrous') matchesCategory = catIndex === 'wondrous-items' || catName.includes('Wondrous');
            }

            // Advanced Filters
            const matchesRarity = rarityFilter.length === 0 || (item.rarity && rarityFilter.includes(item.rarity));
            const matchesAttunement = attunementFilter === 'any' || 
                (attunementFilter === 'required' && item.requires_attunement) || 
                (attunementFilter === 'not-required' && !item.requires_attunement);
            
            const isMagic = item.requires_attunement || 
                           (item.modifiers && item.modifiers.length > 0) || 
                           catIndex.includes('magic') || 
                           catIndex === 'wondrous-items' ||
                           item.index.includes('plus-');
            
            const matchesMagic = !magicOnly || isMagic;
            
            const costInGp = item.cost?.unit === 'gp' ? item.cost.quantity : 
                            item.cost?.unit === 'sp' ? item.cost.quantity / 10 :
                            item.cost?.unit === 'cp' ? item.cost.quantity / 100 : 0;
            
            const matchesCost = costInGp >= minCost && costInGp <= maxCost;

            return matchesSearch && matchesCategory && matchesRarity && matchesAttunement && matchesMagic && matchesCost;
        });
    }, [items, searchQuery, selectedCategory, rarityFilter, attunementFilter, magicOnly, minCost, maxCost]);

    if (!isOpen) return null;

    const toggleRarity = (rarity: string) => {
        setRarityFilter(prev => 
            prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
        );
    };

    const resetFilters = () => {
        setRarityFilter([]);
        setAttunementFilter('any');
        setMagicOnly(false);
        setMinCost(0);
        setMaxCost(1000000);
        setSelectedCategory('all');
        setSearchQuery('');
    };

    const handleAddCustom = async () => {
        if (!customName) return;
        const costParts = customCost.trim().split(' ');
        const costObj = costParts.length >= 2 
            ? { quantity: parseFloat(costParts[0]) || 0, unit: costParts[1] }
            : { quantity: parseFloat(customCost) || 0, unit: 'gp' };

        const newItem: EquipmentDetail = {
            index: `custom-${Date.now()}`,
            name: customName,
            weight: parseFloat(customWeight) || 0,
            quantity: parseInt(customQuantity) || 1,
            cost: costObj,
            desc: [customDesc],
            rarity: customRarity as any,
            equipment_category: { 
                index: customCategory.toLowerCase(), 
                name: customCategory, 
                url: '' 
            },
            subtype: customSubtype,
            is_wondrous: customIsWondrous,
            requires_attunement: customAttunement,
            equipped: false,
            isCustom: true
        };

        if (customCategory === 'Weapon') {
            newItem.weapon_category = customWeaponType;
            if (customDmgDice) {
                newItem.damage = {
                    damage_dice: customDmgDice,
                    damage_type: { name: customDmgType, index: customDmgType.toLowerCase() }
                };
            }
        }

        if (customCategory === 'Armor') {
            newItem.armor_category = customArmorType;
            if (customAcBase) {
                newItem.armor_class = {
                    base: parseInt(customAcBase),
                    dex_bonus: customAcDexBonus,
                    max_bonus: customAcMaxBonus ? parseInt(customAcMaxBonus) : null
                };
            }
        }

        if (customProperties) {
            newItem.properties = customProperties.split(',').map(p => ({ name: p.trim(), index: p.trim().toLowerCase() }));
        }

        if (customModifiers.length > 0) {
            newItem.modifiers = [...customModifiers];
        }

        // Save to Homebrew Forge if toggled
        if (isSavingToHomebrew && currentUser) {
            try {
                await saveHomebrew('custom_equipment', currentUser.id, newItem, isSharedGlobally);
            } catch (err) {
                console.error("Failed to save to Homebrew Forge:", err);
            }
        }

        onSelectItem(newItem);
        
        // Reset form
        setCustomName(''); setCustomWeight(''); setCustomCost(''); setCustomQuantity('1'); setCustomDesc('');
        setCustomCategory('Other'); setCustomAttunement(false); setCustomModifiers([]);
        setCustomDmgDice(''); setCustomAcBase(''); setCustomProperties('');
        setIsAddingCustom(false);
    };

    const DRAGON_TYPES = [
        { name: 'Black', resistance: 'Acid' },
        { name: 'Blue', resistance: 'Lightning' },
        { name: 'Brass', resistance: 'Fire' },
        { name: 'Bronze', resistance: 'Lightning' },
        { name: 'Copper', resistance: 'Acid' },
        { name: 'Gold', resistance: 'Fire' },
        { name: 'Green', resistance: 'Poison' },
        { name: 'Red', resistance: 'Fire' },
        { name: 'Silver', resistance: 'Cold' },
        { name: 'White', resistance: 'Cold' },
    ];

    const handleSelectItemWithCustomization = (item: EquipmentDetail) => {
        if (item.name === 'Dragon Scale Mail' && !selectedCustomization) {
            setExpandedItem(item.index);
            return;
        }

        if (item.name === 'Dragon Scale Mail' && selectedCustomization) {
            const dragon = DRAGON_TYPES.find(d => d.name === selectedCustomization);
            if (dragon) {
                const customizedItem = {
                    ...item,
                    name: `${dragon.name} Dragon Scale Mail`,
                    modifiers: [
                        ...(item.modifiers || []),
                        { type: 'resistance' as const, target: dragon.resistance.toLowerCase(), value: dragon.resistance }
                    ]
                };
                onSelectItem(customizedItem);
                setSelectedCustomization(null);
                return;
            }
        }

        onSelectItem(item);
    };

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1b1c20] border border-gray-800 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-[#121316] border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif text-white">
                            {isAddingCustom ? 'Create Custom Item' : 'Armory Search'}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            {isAddingCustom ? 'Define your own unique piece of gear' : 'Find gear, weapons, and magic items'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAddingCustom && (
                            <button 
                                onClick={() => setIsAddingCustom(false)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Back to Search
                            </button>
                        )}
                        {!isAddingCustom && (
                            <>
                                <button 
                                    onClick={() => setIsAddingCustom(true)}
                                    className="px-4 py-2 bg-blue-900/20 border border-blue-800 hover:border-blue-500 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Create Custom
                                </button>
                                <button 
                                    onClick={resetFilters}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors"
                                >
                                    Reset All
                                </button>
                            </>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {isAddingCustom ? (
                    <div className="flex-grow overflow-y-auto p-8 bg-[#1b1c20]">
                        <div className="max-w-3xl mx-auto space-y-8">
                            {/* Core Identity */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Item Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Vorpal Spork" 
                                        value={customName} 
                                        onChange={e => setCustomName(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                                    <select 
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    >
                                        <option value="Weapon">Weapon</option>
                                        <option value="Armor">Armor</option>
                                        <option value="Tool">Tool</option>
                                        <option value="Consumable">Consumable</option>
                                        <option value="Other">Other / Misc</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Item Subtype</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Longsword, Plate" 
                                        value={customSubtype} 
                                        onChange={e => setCustomSubtype(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rarity</label>
                                    <select 
                                        value={customRarity}
                                        onChange={e => setCustomRarity(e.target.value)}
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    >
                                        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight (lb)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.5" 
                                        value={customWeight} 
                                        onChange={e => setCustomWeight(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cost (e.g. 5 gp)</label>
                                    <input 
                                        type="text" 
                                        placeholder="10 gp" 
                                        value={customCost} 
                                        onChange={e => setCustomCost(e.target.value)} 
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-8 bg-black/20 p-4 rounded-xl border border-gray-800">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${customIsWondrous ? 'bg-purple-600 border-purple-500' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                        {customIsWondrous && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={customIsWondrous} onChange={e => setCustomIsWondrous(e.target.checked)} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wondrous Item</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${customAttunement ? 'bg-blue-600 border-blue-500' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                        {customAttunement && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={customAttunement} onChange={e => setCustomAttunement(e.target.checked)} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Requires Attunement</span>
                                </label>
                            </div>

                            {/* Category Specifics */}
                            {customCategory === 'Weapon' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-red-900/5 p-6 rounded-2xl border border-red-900/20">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-red-400">Weapon Type</label>
                                        <select 
                                            value={customWeaponType}
                                            onChange={e => setCustomWeaponType(e.target.value)}
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        >
                                            <option value="Simple">Simple</option>
                                            <option value="Martial">Martial</option>
                                            <option value="Firearm">Firearm</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-red-400">Damage Dice</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 1d8" 
                                            value={customDmgDice} 
                                            onChange={e => setCustomDmgDice(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-red-400">Damage Type</label>
                                        <select 
                                            value={customDmgType}
                                            onChange={e => setCustomDmgType(e.target.value)}
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        >
                                            {['Piercing', 'Slashing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Force', 'Necrotic', 'Radiant', 'Psychic'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {customCategory === 'Armor' && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-900/5 p-6 rounded-2xl border border-blue-900/20">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Armor Type</label>
                                        <select 
                                            value={customArmorType}
                                            onChange={e => setCustomArmorType(e.target.value)}
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        >
                                            <option value="Light">Light</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Heavy">Heavy</option>
                                            <option value="Shield">Shield</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Base AC</label>
                                        <input 
                                            type="number" 
                                            value={customAcBase} 
                                            onChange={e => setCustomAcBase(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={customAcDexBonus} onChange={e => setCustomAcDexBonus(e.target.checked)} className="accent-dnd-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add Dex Mod</span>
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Max Dex Bonus</label>
                                        <input 
                                            type="number" 
                                            value={customAcMaxBonus} 
                                            onChange={e => setCustomAcMaxBonus(e.target.value)} 
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Properties (Comma separated)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Versatile, Finesse, Light" 
                                    value={customProperties} 
                                    onChange={e => setCustomProperties(e.target.value)} 
                                    className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white focus:border-dnd-gold/50 outline-none"
                                />
                            </div>

                            {/* Modifiers */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mechanical Modifiers</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setCustomModifiers([...customModifiers, { type: 'bonus', target: 'ac', value: 1 }])}
                                        className="text-[10px] bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-white flex items-center gap-2 transition-all"
                                    >
                                        <Plus size={12} /> Add Modifier
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {customModifiers.map((mod, i) => (
                                        <div key={i} className="bg-black/20 p-4 rounded-xl border border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end relative group animate-in slide-in-from-left-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setCustomModifiers(customModifiers.filter((_, idx) => idx !== i))} 
                                                className="absolute top-2 right-4 text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div>
                                                <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Type</label>
                                                <select value={mod.type} onChange={e => { const n = [...customModifiers]; n[i].type = e.target.value; setCustomModifiers(n); }} className="w-full bg-black/60 border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-dnd-gold/50">
                                                    <option value="bonus">Bonus (+)</option>
                                                    <option value="set">Set To (=)</option>
                                                    <option value="resistance">Resistance</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Target</label>
                                                <select value={mod.target} onChange={e => { const n = [...customModifiers]; n[i].target = e.target.value; setCustomModifiers(n); }} className="w-full bg-black/60 border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-dnd-gold/50">
                                                    <option value="ac">AC</option>
                                                    <option value="attack">Attack Rolls</option>
                                                    <option value="damage">Damage Rolls</option>
                                                    <option value="saves">Saving Throws</option>
                                                    {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Value</label>
                                                <input type="text" value={mod.value} onChange={e => { const n = [...customModifiers]; n[i].value = e.target.value; setCustomModifiers(n); }} className="w-full bg-black/60 border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-dnd-gold/50" />
                                            </div>
                                        </div>
                                    ))}
                                    {customModifiers.length === 0 && (
                                        <p className="text-[10px] text-gray-600 italic text-center py-4 border border-dashed border-gray-800 rounded-xl">No active modifiers. Add one to grant mechanical bonuses.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                                <textarea 
                                    placeholder="Enter item details, special properties, lore, etc..." 
                                    value={customDesc} 
                                    onChange={e => setCustomDesc(e.target.value)} 
                                    className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white h-40 focus:border-dnd-gold/50 outline-none resize-none font-serif leading-relaxed"
                                />
                            </div>

                            <div className="pt-6 space-y-6">
                                <div className="flex flex-col items-center gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer group bg-black/40 border border-gray-800 px-6 py-3 rounded-full hover:border-dnd-gold/50 transition-all">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSavingToHomebrew ? 'bg-dnd-gold border-dnd-gold' : 'bg-black/40 border-gray-700 group-hover:border-gray-500'}`}>
                                            {isSavingToHomebrew && <Save size={12} className="text-black" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={isSavingToHomebrew} onChange={e => setIsSavingToHomebrew(e.target.checked)} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Save to Homebrew Forge Archive</span>
                                    </label>

                                    {isSavingToHomebrew && (
                                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-gray-800 animate-in fade-in zoom-in duration-200">
                                            <button 
                                                type="button"
                                                onClick={() => setIsSharedGlobally(false)}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${!isSharedGlobally ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Personal
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setIsSharedGlobally(true)}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${isSharedGlobally ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Global
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleAddCustom}
                                    disabled={!customName}
                                    className="w-full py-5 bg-dnd-gold text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-dnd-gold shadow-2xl shadow-dnd-gold/10 flex items-center justify-center gap-3"
                                >
                                    <Sparkles size={18} />
                                    Forge Item & Add to Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search & Main Categories */}
                        <div className="p-6 space-y-4 bg-[#16171a] border-b border-gray-800">
                            <div className="flex gap-3">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-dnd-gold/50 transition-all"
                                        autoFocus
                                    />
                                </div>
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-4 rounded-xl border transition-all flex items-center gap-2 font-bold text-sm ${
                                        showFilters || rarityFilter.length > 0 || magicOnly || attunementFilter !== 'any'
                                            ? 'bg-dnd-gold border-dnd-gold text-black' 
                                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                                    }`}
                                >
                                    <Filter size={18} />
                                    Filters
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                            selectedCategory === cat.id 
                                                ? 'bg-dnd-gold text-black shadow-lg shadow-dnd-gold/20' 
                                                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        <cat.icon size={14} />
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Advanced Filters Panel */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-black/40 rounded-xl border border-gray-800 animate-in slide-in-from-top-2 duration-200">
                                    {/* Rarity */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                            <Sparkles size={12} /> Rarity
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {RARITIES.map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => toggleRarity(r)}
                                                    className={`px-3 py-1 rounded text-[10px] font-bold border transition-all ${
                                                        rarityFilter.includes(r)
                                                            ? 'bg-purple-600 border-purple-400 text-white'
                                                            : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                                                    }`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Attunement & Magic */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                            <Link size={12} /> Properties
                                        </label>
                                        <div className="space-y-2">
                                            <button 
                                                onClick={() => setMagicOnly(!magicOnly)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded border text-xs font-bold transition-all ${
                                                    magicOnly ? 'bg-blue-900/40 border-blue-500 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500'
                                                }`}
                                            >
                                                Magic Item Only
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${magicOnly ? 'bg-blue-500 border-blue-400' : 'border-gray-700'}`}>
                                                    {magicOnly && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                </div>
                                            </button>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-600 ml-1">Attunement</label>
                                                <div className="flex gap-1 bg-gray-900 p-1 rounded border border-gray-800">
                                                    {['any', 'required', 'not-required'].map(a => (
                                                        <button
                                                            key={a}
                                                            onClick={() => setAttunementFilter(a as any)}
                                                            className={`flex-1 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                                                attunementFilter === a ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                                                            }`}
                                                        >
                                                            {a.replace('-', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                            <Coins size={12} /> Cost (GP)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                placeholder="Min"
                                                value={minCost || ''}
                                                onChange={(e) => setMinCost(Number(e.target.value))}
                                                className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-dnd-gold/50"
                                            />
                                            <span className="text-gray-600">-</span>
                                            <input 
                                                type="number" 
                                                placeholder="Max"
                                                value={maxCost === 1000000 ? '' : maxCost}
                                                onChange={(e) => setMaxCost(e.target.value ? Number(e.target.value) : 1000000)}
                                                className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-dnd-gold/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 bg-[#1b1c20]">
                            {filteredItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-600 italic">
                                    <Package size={48} className="mb-4 opacity-10" />
                                    <p>No items found matching your criteria.</p>
                                    <div className="flex gap-4 mt-4">
                                        <button onClick={resetFilters} className="text-dnd-gold hover:underline text-sm font-bold">Clear all filters</button>
                                        <button onClick={() => setIsAddingCustom(true)} className="text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-bold">Create Custom Item</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredItems.map(item => {
                                        const isExpanded = expandedItem === item.index;
                                        const isMagical = item.requires_attunement || (item.modifiers && item.modifiers.length > 0) || item.index.includes('plus-');
                                        
                                        return (
                                            <div 
                                                key={item.index}
                                                onClick={() => setExpandedItem(isExpanded ? null : item.index)}
                                                className={`flex flex-col bg-black/20 border rounded-xl transition-all overflow-hidden cursor-pointer ${
                                                    isExpanded ? 'border-gray-700 bg-black/40' : 'border-gray-800 hover:border-gray-700 hover:bg-black/30'
                                                }`}
                                            >
                                                <div className="flex items-center p-4 gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                        isMagical ? 'bg-purple-900/20 text-purple-400' : 'bg-gray-800/50 text-gray-500'
                                                    }`}>
                                                        {item.equipment_category?.index === 'weapon' ? <Sword size={20} /> : 
                                                         item.equipment_category?.index === 'armor' ? <Shield size={20} /> : 
                                                         <Package size={20} />}
                                                    </div>
                                                    
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`font-bold text-sm truncate ${isMagical ? 'text-purple-300' : 'text-gray-200'}`}>
                                                                {item.name}
                                                            </h4>
                                                            {item.rarity && (
                                                                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[8px] font-black uppercase tracking-tighter text-gray-400">
                                                                    {item.rarity}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                                                {item.equipment_category?.name || 'Item'}
                                                            </span>
                                                            {item.cost && (
                                                                <span className="text-[10px] text-dnd-gold font-bold flex items-center gap-1">
                                                                    <Coins size={10} /> {item.cost.quantity}{item.cost.unit}
                                                                </span>
                                                            )}
                                                            {item.weight !== undefined && (
                                                                <span className="text-[10px] text-gray-600 font-bold">
                                                                    {item.weight} lb.
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            onClick={(e) => { e.stopPropagation(); onDuplicateToHomebrew?.(item); }}
                                                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-dnd-gold transition-colors"
                                                            title="Duplicate to Homebrew Forge"
                                                        >
                                                            <Sparkles size={18} />
                                                        </div>
                                                        <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}>
                                                            <Info size={18} />
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleSelectItemWithCustomization(item); }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-dnd-gold text-black rounded-lg text-xs font-black uppercase hover:bg-white transition-all shadow-lg shadow-dnd-gold/10"
                                                        >
                                                            <Plus size={14} />
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="px-4 pb-4 pt-2 border-t border-gray-800/50 bg-black/20 animate-in slide-in-from-top-1 duration-200">
                                                        <div className="space-y-4">
                                                            {item.desc && item.desc.length > 0 && (
                                                                <div className="text-xs text-gray-400 leading-relaxed space-y-2">
                                                                    {item.desc.map((d, i) => <p key={i}>{d}</p>)}
                                                                </div>
                                                            )}
                                                            
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                                                {item.name === 'Dragon Scale Mail' && (
                                                                    <div className="col-span-2 bg-orange-900/20 p-3 rounded border border-orange-800/50">
                                                                        <div className="text-[10px] text-orange-400 uppercase font-black mb-2">Select Dragon Type</div>
                                                                        <select 
                                                                            value={selectedCustomization || ''}
                                                                            onChange={(e) => setSelectedCustomization(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-full bg-black/40 border border-gray-700 rounded p-2 text-xs text-white outline-none"
                                                                        >
                                                                            <option value="">Choose a type...</option>
                                                                            {DRAGON_TYPES.map(d => <option key={d.name} value={d.name}>{d.name} ({d.resistance})</option>)}
                                                                        </select>
                                                                    </div>
                                                                )}
                                                                {item.armor_class && (
                                                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                                                        <div className="text-[8px] text-gray-500 uppercase font-black">Armor Class</div>
                                                                        <div className="text-white font-bold text-sm">{item.armor_class.base} {item.armor_class.dex_bonus ? '(+Dex)' : ''}</div>
                                                                    </div>
                                                                )}
                                                                {item.damage && (
                                                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                                                                        <div className="text-[8px] text-gray-500 uppercase font-black">Damage</div>
                                                                        <div className="text-white font-bold text-sm">
                                                                            {item.damage.damage_dice} {typeof item.damage.damage_type === 'string' ? item.damage.damage_type : item.damage.damage_type?.name}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.requires_attunement && (
                                                                    <div className="bg-blue-900/20 p-2 rounded border border-blue-900/30">
                                                                        <div className="text-[8px] text-blue-400 uppercase font-black">Attunement</div>
                                                                        <div className="text-blue-100 font-bold text-xs">Required {item.attunement_description ? `(${item.attunement_description})` : ''}</div>
                                                                    </div>
                                                                )}
                                                                {item.properties && item.properties.length > 0 && (
                                                                    <div className="col-span-2 bg-gray-900/50 p-2 rounded border border-gray-800">
                                                                        <div className="text-[8px] text-gray-500 uppercase font-black">Properties</div>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {item.properties.map((p, i) => (
                                                                                <span key={i} className="px-1.5 py-0.5 rounded bg-gray-800 text-[9px] text-gray-300 border border-gray-700">
                                                                                    {typeof p === 'string' ? p : p.name}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="p-4 bg-[#121316] border-t border-gray-800 text-center">
                    <p className="text-[10px] text-gray-600 font-serif italic">
                        Showing {filteredItems.length} of {items.length} items in the armory
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ItemSearchModal;
