import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SidePanelLayout from '../Shared/SidePanelLayout';
import { SpellDetail, InventoryItem, APIReference, RuleEntry, CharacterState } from '../../../types';
import { isSpell } from '../../../utils/rules';
import { fetchEquipmentDetail, fetchFeatureDetail, fetchTraitDetail } from '../../../data/index';
import { MASTERY_DESCRIPTIONS, WIDGET_BG } from '../../../data/constants';

// Heuristic maps for proficiency checking
const PROFICIENCY_MAP: Record<string, string[]> = {
    'Simple Weapons': ['club', 'dagger', 'greatclub', 'handaxe', 'javelin', 'light hammer', 'mace', 'quarterstaff', 'sickle', 'spear', 'crossbow, light', 'dart', 'shortbow', 'sling', 'light crossbow'],
    'Martial Weapons': ['battleaxe', 'flail', 'glaive', 'greataxe', 'greatsword', 'halberd', 'lance', 'longsword', 'maul', 'morningstar', 'pike', 'rapier', 'scimitar', 'shortsword', 'trident', 'war pick', 'warhammer', 'whip', 'blowgun', 'crossbow, hand', 'crossbow, heavy', 'longbow', 'net', 'hand crossbow', 'heavy crossbow'],
    'Light Armor': ['padded armor', 'leather armor', 'studded leather armor'],
    'Medium Armor': ['hide armor', 'chain shirt', 'scale mail', 'breastplate', 'half plate'],
    'Heavy Armor': ['ring mail', 'chain mail', 'splint armor', 'plate armor'],
    'Shields': ['shield']
};

const cleanProfName = (name: string) => {
    return name.toLowerCase()
        .replace(/^(skill|musical instrument|gaming set|tool|armor|weapon|other):\s*/i, '')
        .trim();
};

const DetailSidePanel = ({ 
    item, 
    character,
    onClose,
    onAction,
    isPinned,
    onTogglePin,
    isFavorite,
    onToggleFavorite
}: { 
    item: SpellDetail | InventoryItem | APIReference | any | null, 
    character?: CharacterState;
    onClose: () => void,
    onAction?: (action: string, payload?: any) => void;
    isPinned: boolean;
    onTogglePin: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}) => {
    const [fullDetail, setFullDetail] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!item) {
            setFullDetail(null);
            return;
        }

        // If we already have a fullDetail for this item, just update it with latest item props
        // This prevents resetting to null and re-fetching when only a flag or property changed
        if (fullDetail && (
            (item.id && fullDetail.id === item.id) || 
            (item.index && fullDetail.index === item.index) ||
            (item.name && fullDetail.name === item.name && !item.id && !item.index)
        )) {
            const propsToSync = ['equipped', 'attuned', 'quantity', 'wieldedTwoHanded', 'isMonkWeapon', 'isKenseiWeapon', 'isPactWeapon', 'isHexWeapon', 'isSpellFocus', 'isInfusion', 'isShillelagh', 'isBattleReady', 'thrownRange', 'thrownDamage'];
            const hasChanged = propsToSync.some(key => (item as any)[key] !== (fullDetail as any)[key]);
            
            if (hasChanged) {
                setFullDetail(prev => ({ ...prev, ...item }));
            }
            return;
        }

        setFullDetail(null);
        
        // Standard Action / Rule Mock / Simple Objects without Index
        if (!item.index && !item.url && item.name && (item.desc || item.description)) {
            setFullDetail(item);
            return;
        }
        
        // If it's a rule category object
        if (item.category && !item.index) {
             setFullDetail(item);
             return;
        }

        const load = async () => {
            // Case 1: It's a Spell (has school)
            if ('school' in item) { 
                setFullDetail(item);
                return;
            } 
            
            // Case 2: It's an Inventory Item from state (has quantity)
            if ('quantity' in item) {
                // If it has API index but missing detailed fields (like desc or cost), fetch fresh
                if (item.index && (!item.description || !item.cost || !item.modifiers)) {
                    setLoading(true);
                    const detail = await fetchEquipmentDetail(item.index);
                    setLoading(false);
                    // Merge API detail with Inventory state
                    if (detail) {
                        setFullDetail({
                            ...item,
                            description: detail.desc?.join('\n') || item.description || '',
                            cost: detail.cost ? `${detail.cost.quantity} ${detail.cost.unit}` : undefined,
                            weight: detail.weight,
                            properties: detail.properties?.map((p: any) => p.name),
                            range: (() => {
                                const props = detail.properties?.map((p: any) => p.name) || [];
                                const isThrown = item.isThrown || props.includes('Thrown') || (detail.range && detail.weapon_range !== 'Ranged' && !detail.weapon_category?.toLowerCase().includes('ranged'));
                                const isReach = props.includes('Reach');
                                const isRanged = detail.weapon_range === 'Ranged' || detail.weapon_category?.toLowerCase().includes('ranged') || props.includes('Ammunition');
                                const baseRange = isRanged ? (detail.range ? (typeof detail.range === 'string' ? detail.range : `${detail.range.normal}${detail.range.long ? `/${detail.range.long}` : ''} ft.`) : '') : (isReach ? '10 ft.' : '5 ft.');
                                if (isThrown) {
                                    let tr = '';
                                    if (item.thrownRange) {
                                        tr = item.thrownRange.includes('ft') ? item.thrownRange : `${item.thrownRange} ft.`;
                                    } else if (detail.range) {
                                        if (typeof detail.range === 'string') {
                                            if (detail.range !== '5 ft.' && detail.range !== '10 ft.') {
                                                tr = detail.range;
                                            }
                                        } else if (detail.range.normal) {
                                            tr = `${detail.range.normal}${detail.range.long ? `/${detail.range.long}` : ''} ft.`;
                                        }
                                    }
                                    if (tr && tr !== baseRange) {
                                        return isRanged ? tr : `${baseRange} (${tr})`;
                                    }
                                }
                                return baseRange || (detail.range ? (typeof detail.range === 'string' ? detail.range : `${detail.range.normal}${detail.range.long ? `/${detail.range.long}` : ''} ft.`) : undefined);
                            })(),
                            armor_class: detail.armor_class,
                            equipment_category: detail.equipment_category,
                            requires_attunement: detail.requires_attunement,
                            modifiers: detail.modifiers
                        });
                    } else {
                        setFullDetail(item);
                    }
                } else {
                    setFullDetail(item);
                }
                return;
            } 
            
            // Case 3: Fully populated Feature/Trait (has desc array)
            if (item.desc && Array.isArray(item.desc) && item.desc.length > 0) {
                setFullDetail(item);
                return;
            }

            // Case 4: Reference needing fetch
            if ('url' in item || 'index' in item) { 
                setLoading(true);
                let data = null;
                
                // Try to guess type from URL or Index hints
                if (item.url?.includes('features') || item.index?.includes('feature')) {
                    data = await fetchFeatureDetail(item.index);
                } else if (item.url?.includes('traits') || item.index?.includes('trait')) {
                    data = await fetchTraitDetail(item.index);
                } else if (item.url?.includes('equipment')) {
                    data = await fetchEquipmentDetail(item.index);
                } else {
                    // Fallback search
                     data = await fetchFeatureDetail(item.index);
                     if (!data) data = await fetchTraitDetail(item.index);
                }
                
                setFullDetail(data || item);
                setLoading(false);
            } else {
                setFullDetail(item);
            }
        };
        load();
    }, [item, fullDetail]);

    // Helper to check if it looks like an equipment detail (has cost/weight/category) or is an InventoryItem
    const isItemLike = (i: any) => i && ('quantity' in i || 'equipment_category' in i || 'weight' in i || 'cost' in i);
    const isRule = (i: any): i is RuleEntry => i && 'category' in i;
    
    // Determine title/subtitle
    const itemNameRaw = fullDetail?.name || item?.name || 'Detail';
    const itemName = typeof itemNameRaw === 'object' ? (itemNameRaw.name || itemNameRaw.label || 'Detail') : itemNameRaw;
    
    const titleNode = (
        <div className="flex items-center gap-3">
            <span className="truncate">{itemName}</span>
            <div className="flex items-center gap-2">
                {onToggleFavorite && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                        className={`text-lg transition-transform hover:scale-110 leading-none ${isFavorite ? 'text-dnd-gold' : 'text-gray-600 hover:text-gray-400'}`}
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        {isFavorite ? '★' : '☆'}
                    </button>
                )}
                {onAction && (isItemLike(fullDetail) || isSpell(fullDetail)) && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAction('duplicate', item); }}
                        className="text-gray-600 hover:text-purple-400 transition-colors p-1"
                        title="Duplicate to Homebrew"
                    >
                        <Sparkles size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    const getDetailedCategory = (itm: any) => {
        const rawName = (typeof itm.name === 'string' ? itm.name : (itm.name?.name || 'Item')).toLowerCase();
        
        // Check Shield first
        if (rawName.includes('shield')) return 'Shield';

        // Check map for specific weapon/armor types
        for (const [category, items] of Object.entries(PROFICIENCY_MAP)) {
             if (items.some(i => rawName.includes(i))) return category.replace(/s$/, ''); // Singularize
        }
        
        const catName = itm.equipment_category?.name || (typeof itm.type === 'object' ? itm.type.name : itm.type);
        return catName ? catName.toUpperCase() : (itm.quantity ? 'Item' : 'Equipment');
    };

    let subtitle = 'Detail';
    if (fullDetail?.index?.includes('feature') || fullDetail?.type === 'Class') {
        const levelStr = fullDetail.level ? `Level ${fullDetail.level} ` : '';
        if (fullDetail.casting_time) {
            subtitle = `${levelStr}Spell Feature • ${fullDetail.school?.name || 'Class'}`;
        } else {
            subtitle = `${levelStr}Class Feature` + (fullDetail.school ? ` • ${fullDetail.school.name}` : '');
        }
    } else if (isSpell(fullDetail)) {
        subtitle = `${fullDetail.level === 0 ? 'Cantrip' : `Level ${fullDetail.level} Spell`} • ${fullDetail.school.name}`;
    } else if (isItemLike(fullDetail)) {
        subtitle = getDetailedCategory(fullDetail);
    } else if (isRule(fullDetail)) {
        subtitle = fullDetail.category;
    } else if (fullDetail?.index?.includes('feature')) {
        subtitle = 'Class Feature';
    } else if (fullDetail?.index?.includes('trait')) {
        subtitle = 'Racial Trait';
    }

    const renderTags = (tags: any[]) => (
        <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((t, idx) => {
                const label = typeof t === 'object' ? (t.name || t.label || JSON.stringify(t)) : t;
                const key = typeof t === 'object' ? (t.index || t.id || idx) : t;
                return (
                    <span key={key} className="px-2 py-0.5 bg-[#25262b] border border-gray-600 rounded text-[10px] uppercase text-gray-400 tracking-wider">
                        {label}
                    </span>
                );
            })}
        </div>
    );

    const renderDescription = (desc: string[] | string | any[] | undefined) => {
        if (!desc) return <p className="italic text-gray-500">The scrolls have no entry for this item's specific lore...</p>;
        
        let markdown = '';
        if (Array.isArray(desc)) {
            markdown = desc.map(line => {
                if (typeof line === 'object') return line.name || line.label || JSON.stringify(line);
                return line;
            }).join('\n\n');
        } else {
            markdown = desc;
        }

        return (
            <div className="markdown-body text-gray-400 text-sm leading-relaxed">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        );
    };

    const getProficiencyStatus = (): boolean | null => {
        if (!character || !isItemLike(fullDetail)) return null;

        const rawName = itemName.toLowerCase();
        const namesToCheck = [rawName];
        
        // Handle "Crossbow, Light" -> "light crossbow"
        if (rawName.includes(', ')) {
            const parts = rawName.split(', ');
            if (parts.length === 2) {
                namesToCheck.push(`${parts[1]} ${parts[0]}`);
            }
        }
        
        // Handle magic items with "+1", etc.
        const cleanName = rawName.replace(/\s\+\d+/, '').trim();
        if (cleanName !== rawName) {
             namesToCheck.push(cleanName);
             if (cleanName.includes(', ')) {
                 const parts = cleanName.split(', ');
                 if (parts.length === 2) {
                     namesToCheck.push(`${parts[1]} ${parts[0]}`);
                 }
             }
        }

        // Gather all character proficiencies (cleaned)
        const charProfs = new Set<string>();
        character.classes.forEach(c => c.definition.proficiencies.forEach(p => charProfs.add(cleanProfName(p.name))));
        character.race?.starting_proficiencies?.forEach(p => charProfs.add(cleanProfName(p.name)));
        // Include direct tool proficiencies from character state
        character.toolProficiencies?.forEach(t => charProfs.add(cleanProfName(t)));
        
        // --- 1. Direct & Fuzzy Matches ---
        for (const checkName of namesToCheck) {
             const cleanedCheckName = cleanProfName(checkName);
             if (charProfs.has(cleanedCheckName)) return true;
             
             // Check plural forms and other variations in charProfs
             for (const prof of charProfs) {
                 if (prof === cleanedCheckName + 's' || prof === cleanedCheckName + 'es') return true;
                 if (prof.includes(cleanedCheckName) && Math.abs(prof.length - cleanedCheckName.length) <= 2) return true;
                 
                 // Tool specific logic (e.g., "leatherworker's tools" matches "leatherworker's tools")
                 if (cleanedCheckName.includes(prof) && (cleanedCheckName.includes('tool') || cleanedCheckName.includes('set') || cleanedCheckName.includes('kit'))) return true;
                 if (prof.includes(cleanedCheckName) && (prof.includes('tool') || prof.includes('set') || prof.includes('kit'))) return true;
             }
        }
        
        // --- 2. Category Matches ---
        if (charProfs.has('all armor') && fullDetail.armor_class) return true;
        if (charProfs.has('shields') && rawName.includes('shield')) return true;

        for (const [category, items] of Object.entries(PROFICIENCY_MAP)) {
             // Check if any of our name variations match a mapped item
             const isInCategory = items.some(i => namesToCheck.some(n => n.includes(i)));
             if (isInCategory) {
                 if (charProfs.has(category.toLowerCase())) return true;
             }
        }
        
        // Is it a weapon/armor/tool? If so, and no match found -> Not Proficient
        const isWeapon = fullDetail.damage || fullDetail.equipment_category?.index === 'weapon' || fullDetail.type === 'weapon';
        const isArmor = fullDetail.armor_class || fullDetail.equipment_category?.index === 'armor';
        const isTool = fullDetail.equipment_category?.index === 'tools' || fullDetail.equipment_category?.name?.includes('Tool') || rawName.includes('tool') || rawName.includes('kit') || rawName.includes('set');
        
        if (isWeapon || isArmor || isTool) return false;

        return null;
    };

    const isProficient = getProficiencyStatus();

    return (
        <SidePanelLayout
            title={titleNode}
            subtitle={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span>{subtitle}</span>
                        {isProficient !== null && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isProficient ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                                {isProficient ? 'Proficient' : 'Not Proficient'}
                            </span>
                        )}
                    </div>
                     {isItemLike(fullDetail) && fullDetail.requires_attunement && (
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Requires Attunement</span>
                             <span className={`w-2 h-2 rounded-full ${fullDetail.attuned ? 'bg-cyan-400 shadow-[0_0_5px_cyan]' : 'bg-gray-700'}`} />
                        </div>
                    )}
                </div>
            }
            isOpen={!!item}
            onClose={onClose}
            isPinned={isPinned}
            onTogglePin={onTogglePin}
            footer={onAction && (
                <div className="flex flex-wrap gap-2">
                     {isItemLike(fullDetail) && fullDetail.requires_attunement && (
                        <button 
                            onClick={() => onAction('toggleAttune', item)}
                            className="flex-1 min-w-[100px] py-1.5 border border-gray-700 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors"
                        >
                            {fullDetail.attuned ? 'End Attunement' : 'Attune'}
                        </button>
                    )}

                    {isSpell(fullDetail) && (
                        <button 
                            onClick={() => onAction('cast', item)}
                            className="flex-1 min-w-[100px] py-1.5 border border-gray-700 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                            Cast Spell
                        </button>
                    )}

                    {fullDetail?.name === 'Pick a Card' && (
                        <button 
                            onClick={() => onAction('pickCard')}
                            className="flex-1 min-w-[100px] py-1.5 border border-gray-700 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                            Pick a Card
                        </button>
                    )}

                    {fullDetail?.name === 'Chiromancy' && (
                        <button 
                            onClick={() => onAction('chiromancy')}
                            className="flex-1 min-w-[100px] py-1.5 border border-gray-700 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                            Use Chiromancy
                        </button>
                    )}

                    <div className="flex gap-2 w-full">
                        {isItemLike(fullDetail) && (
                            <button 
                                onClick={() => onAction('toggleEquip', item)}
                                className="flex-1 py-1.5 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors"
                            >
                                {fullDetail.equipped ? 'Unequip' : 'Equip'}
                            </button>
                        )}
                        {(isSpell(fullDetail) || (fullDetail && 'quantity' in fullDetail)) && (
                            <button 
                               onClick={() => onAction('remove', item)}
                               className="flex-1 py-1.5 bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60 rounded font-bold uppercase text-[10px] tracking-wider transition-colors"
                           >
                               Delete
                           </button>
                        )}
                    </div>
                </div>
            )}
        >
            {loading && <div className="text-dnd-gold animate-pulse">Unfurling scroll...</div>}
                 
            {!loading && fullDetail && (
                <>
                {character?.featureUsage?.[fullDetail.name] && (
                    <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl p-4 shadow-xl mb-6`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-white text-sm truncate">{fullDetail.name}</h4>
                                <div className="text-[9px] text-gray-500 font-bold tracking-tight">
                                    Resets on {character.featureUsage[fullDetail.name].reset || 'long'} rest
                                </div>
                            </div>
                            <div className="bg-black/40 px-2 py-0.5 rounded border border-gray-800 text-[10px] font-bold text-gray-400">
                                {character.featureUsage[fullDetail.name].current} / {character.featureUsage[fullDetail.name].max}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: character.featureUsage[fullDetail.name].max }).map((_, i) => {
                                const usage = character.featureUsage[fullDetail.name];
                                const usedCount = usage.max - usage.current;
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => {
                                            const targetUsed = i + 1;
                                            const finalUsed = usedCount === targetUsed ? i : targetUsed;
                                            onAction && onAction('toggleFeatureUsage', { name: fullDetail.name, value: finalUsed });
                                        }}
                                        className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${
                                            i < usedCount 
                                            ? 'bg-dnd-red border-dnd-red shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]' 
                                            : 'bg-transparent border-gray-600'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* SPELL LAYOUT */}
                {(isSpell(fullDetail) || fullDetail.casting_time) && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-800 p-3 rounded border border-gray-600">
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase block">Casting Time</span> 
                                {fullDetail.casting_time}{fullDetail.ritual && !fullDetail.casting_time.toLowerCase().includes('ritual') ? ' (Ritual)' : ''}
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase block">Range</span> 
                                {typeof fullDetail.range === 'object' 
                                    ? `${fullDetail.range.normal || 0}${fullDetail.range.long ? `/${fullDetail.range.long}` : ''} ft` 
                                    : fullDetail.range}
                            </div>
                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Components</span> {fullDetail.components?.join(', ') || 'V, S'}</div>
                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Duration</span> {fullDetail.duration}</div>
                            {fullDetail.damage && (
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Damage</span> 
                                    {typeof fullDetail.damage === 'string' 
                                        ? fullDetail.damage 
                                        : (typeof fullDetail.damage.damage_dice === 'object' ? JSON.stringify(fullDetail.damage.damage_dice) : fullDetail.damage.damage_dice)}
                                </div>
                            )}
                            {fullDetail.save && (
                                <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Save</span> {fullDetail.save.type || fullDetail.save.dc_type?.name}{fullDetail.save.dc ? ` DC ${fullDetail.save.dc}` : ''}</div>
                            )}
                        </div>
                        
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                            {renderDescription(fullDetail.desc)}
                        </div>


                        {fullDetail.higher_level && fullDetail.higher_level.length > 0 && (
                            <div className="mt-4 border-t border-gray-700 pt-3">
                                <h4 className="text-dnd-gold font-bold uppercase text-xs mb-2">At Higher Levels</h4>
                                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                    {renderDescription(fullDetail.higher_level)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ITEM / EQUIPMENT LAYOUT */}
                {isItemLike(fullDetail) && (
                    <div className="space-y-4">
                        <div className="bg-[#1b1c20] border border-gray-700 rounded p-4 text-sm space-y-3">
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-700 pb-3">
                                <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Type</span> <span className="text-white">{getDetailedCategory(fullDetail)}</span></div>
                                <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Cost</span> <span className="text-dnd-gold">{typeof fullDetail.cost === 'object' ? `${fullDetail.cost.quantity} ${fullDetail.cost.unit}` : (fullDetail.cost || '--')}</span></div>
                                <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Weight</span> <span className="text-white">{fullDetail.weight ? `${typeof fullDetail.weight === 'object' ? (fullDetail.weight.quantity || fullDetail.weight.value || JSON.stringify(fullDetail.weight)) : fullDetail.weight} lb` : '--'}</span></div>
                                <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Quantity</span> <span className="text-white">{typeof fullDetail.quantity === 'object' ? (fullDetail.quantity.value || JSON.stringify(fullDetail.quantity)) : (fullDetail.quantity || 1)}</span></div>
                            </div>
                            
                            {(fullDetail.damage || fullDetail.armor_class) && (
                                <div className="grid grid-cols-2 gap-4 border-b border-gray-700 pb-3">
                                    {fullDetail.damage && (
                                        <>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Damage</span> <span className="text-white font-bold">{typeof fullDetail.damage.damage_dice === 'object' ? JSON.stringify(fullDetail.damage.damage_dice) : fullDetail.damage.damage_dice}</span></div>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Damage Type</span> <span className="text-white">{fullDetail.damage.damage_type?.name || (typeof fullDetail.damage.damage_type === 'object' ? fullDetail.damage.damage_type.name : fullDetail.damage.damage_type)}</span></div>
                                        </>
                                    )}
                                    {fullDetail.versatileDamage && (
                                        <>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Versatile Damage</span> <span className="text-white font-bold">{typeof fullDetail.versatileDamage.damage_dice === 'object' ? JSON.stringify(fullDetail.versatileDamage.damage_dice) : fullDetail.versatileDamage.damage_dice}</span></div>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Versatile Type</span> <span className="text-white">{fullDetail.versatileDamage.damage_type?.name || (typeof fullDetail.versatileDamage.damage_type === 'object' ? fullDetail.versatileDamage.damage_type.name : fullDetail.versatileDamage.damage_type)}</span></div>
                                        </>
                                    )}
                                    {fullDetail.armor_class && (
                                        <>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">AC</span> <span className="text-white font-bold">{fullDetail.armor_class.base}</span></div>
                                            <div><span className="text-[10px] font-bold text-gray-500 uppercase block">Dex Bonus</span> <span className="text-white">{fullDetail.armor_class.dex_bonus ? 'Yes' : 'No'} {fullDetail.armor_class.max_bonus ? `(Max ${fullDetail.armor_class.max_bonus})` : ''}</span></div>
                                        </>
                                    )}
                                </div>
                            )}

                            {isItemLike(fullDetail) && 'quantity' in fullDetail && fullDetail.versatileDamage && (
                                <div className="space-y-2 pt-2 border-t border-gray-700">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Wielding Style</span>
                                    <div className="flex bg-gray-900/60 p-1 rounded-lg border border-gray-700 relative h-8 items-center">
                                        <div 
                                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-dnd-gold rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(193,160,82,0.3)] ${fullDetail.wieldedTwoHanded ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                                        />
                                        <button 
                                            onClick={() => !fullDetail.wieldedTwoHanded ? null : onAction && onAction('updateItem', { id: fullDetail.id, updates: { wieldedTwoHanded: false } })}
                                            className={`flex-1 z-10 text-[10px] font-bold uppercase transition-colors text-center ${!fullDetail.wieldedTwoHanded ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            One-Handed
                                        </button>
                                        <button 
                                            onClick={() => fullDetail.wieldedTwoHanded ? null : onAction && onAction('updateItem', { id: fullDetail.id, updates: { wieldedTwoHanded: true } })}
                                            className={`flex-1 z-10 text-[10px] font-bold uppercase transition-colors text-center ${fullDetail.wieldedTwoHanded ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Two-Handed
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Special Properties Toggles */}
                            {isItemLike(fullDetail) && 'quantity' in fullDetail && character && (
                                (() => {
                                    const classes = character.classes.map(c => c.definition.index);
                                    const subclasses = character.classes.map(c => c.subclass?.index).filter(Boolean);
                                    
                                    const isMonk = classes.includes('monk');
                                    const isWarlock = classes.includes('warlock');
                                    const isArtificer = classes.includes('artificer');
                                    const isDruid = classes.includes('druid');
                                    const isSpellcaster = classes.some(c => ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard', 'artificer'].includes(c));
                                    
                                    const availableFlags = [
                                        { id: 'isMonkWeapon', label: 'Monk Weapon', visible: isMonk },
                                        { id: 'isKenseiWeapon', label: 'Kensei Weapon', visible: isMonk && subclasses.includes('kensei') },
                                        { id: 'isPactWeapon', label: 'Pact Weapon', visible: isWarlock },
                                        { id: 'isHexWeapon', label: 'Hex Weapon', visible: isWarlock && subclasses.includes('hexblade') },
                                        { id: 'isSpellFocus', label: 'Spell Focus', visible: isSpellcaster },
                                        { id: 'isInfusion', label: 'Artificer Infusion', visible: isArtificer },
                                        { id: 'isShillelagh', label: 'Shillelagh', visible: isDruid || classes.includes('cleric') },
                                        { id: 'isBattleReady', label: 'Battle Ready', visible: isArtificer && subclasses.includes('battle-smith') },
                                    ].filter(f => f.visible);

                                    if (availableFlags.length === 0) return null;

                                    return (
                                        <div className="space-y-2 pt-2 border-t border-gray-700">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Special Designations</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableFlags.map(flag => (
                                                    <button
                                                        key={flag.id}
                                                        onClick={() => onAction && onAction('toggleFlag', { id: fullDetail.id, flag: flag.id })}
                                                        className={`text-[10px] px-2 py-1 rounded border transition-colors text-left flex items-center justify-between ${fullDetail[flag.id] ? 'bg-dnd-gold/20 border-dnd-gold text-dnd-gold' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'}`}
                                                    >
                                                        {flag.label}
                                                        {fullDetail[flag.id] && <span className="w-1.5 h-1.5 rounded-full bg-dnd-gold shadow-[0_0_3px_#c1a052]" />}
                                                    </button>
                                                ))}
                                            </div>
                                            {fullDetail.isThrown && (
                                                <div className="grid grid-cols-2 gap-2 mt-2 animate-in slide-in-from-top-1 duration-200">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase">Thrown Range</label>
                                                        <input 
                                                            type="text"
                                                            value={fullDetail.thrownRange || ''}
                                                            onChange={(e) => onAction && onAction('updateItem', { id: fullDetail.id, updates: { thrownRange: e.target.value } })}
                                                            placeholder="20/60"
                                                            className="w-full bg-black/40 border border-gray-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-dnd-gold/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase">Thrown Damage</label>
                                                        <input 
                                                            type="text"
                                                            value={fullDetail.thrownDamage || ''}
                                                            onChange={(e) => onAction && onAction('updateItem', { id: fullDetail.id, updates: { thrownDamage: e.target.value } })}
                                                            placeholder="1d4"
                                                            className="w-full bg-black/40 border border-gray-700 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-dnd-gold/50"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()
                            )}

                            {(fullDetail.range || (fullDetail.properties && fullDetail.properties.length > 0)) && (
                                <div>
                                    {fullDetail.range && (
                                        <div className="mb-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase mr-2">Range</span> 
                                            <span className="text-white">
                                                {typeof fullDetail.range === 'object' 
                                                    ? `${fullDetail.range.normal || 0}${fullDetail.range.long ? `/${fullDetail.range.long}` : ''} ft` 
                                                    : fullDetail.range}
                                            </span>
                                        </div>
                                    )}
                                    {fullDetail.properties && <div><span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Properties</span> {renderTags(fullDetail.properties)}</div>}
                                    {fullDetail.mastery && (
                                        <div className="mt-2 group relative">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mastery</span>
                                            <div className="inline-block px-2 py-0.5 rounded-full bg-dnd-gold/10 border border-dnd-gold/30 text-[10px] text-dnd-gold font-medium cursor-help">
                                                {typeof fullDetail.mastery === 'string' ? fullDetail.mastery : fullDetail.mastery.name}
                                            </div>
                                            {/* Mastery Description Tooltip */}
                                            {(() => {
                                                const mName = typeof fullDetail.mastery === 'string' ? fullDetail.mastery : fullDetail.mastery.name;
                                                const mDesc = MASTERY_DESCRIPTIONS[mName];
                                                if (!mDesc) return null;
                                                return (
                                                    <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-[#1b1c20] border border-gray-700 rounded shadow-2xl text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                                                        <span className="text-dnd-gold font-bold block mb-1 uppercase tracking-wider">{mName}</span>
                                                        {mDesc}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                            {renderDescription(fullDetail.description || fullDetail.desc)}
                        </div>

                        {fullDetail.specialDescription && (
                            <div className="mt-4 border-t border-gray-700 pt-3">
                                <h4 className="text-dnd-red font-bold uppercase text-[10px] tracking-widest mb-2">Special Rules</h4>
                                <div className="prose prose-invert prose-sm max-w-none text-gray-300 italic">
                                    {renderDescription(fullDetail.specialDescription)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FEATURE / TRAIT LAYOUT */}
                {(!isSpell(fullDetail) && !isItemLike(fullDetail)) && (
                    <div className="space-y-4">
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                            {renderDescription(fullDetail.desc || fullDetail.description)}
                        </div>
                    </div>
                )}
                </>
            )}
        </SidePanelLayout>
    );
};

export default DetailSidePanel;