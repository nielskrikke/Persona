import React, { useState, useEffect, useRef } from 'react';
import { CharacterState, SpellDetail, BeastDetail } from '../../../types';
import { STANDARD_ACTIONS, WIDGET_BG } from '../../../data/constants';
import { formatModifier, getSpellDamageString } from '../../../utils/rules';

interface ActionsTabProps {
    character: CharacterState;
    roll: (formula: string, label: string) => void;
    triggerRollMenu: (e: React.MouseEvent, formula: string, label: string) => void;
    setSelectedDetail: (item: any) => void;
    getAttacks: () => any[];
    bonusActionList: any[];
    setShowCustomActionModal: (val: boolean) => void;
    setShowHomebrewModal: (val: boolean, tab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'wildshape' | 'familiar' | 'feat') => void;
    spellSave: number;
    spellMod: number;
}

const IconSword = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>
);

const IconMagic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
);

const IconHand = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
);

const IconInventory = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
);

const IconFeatures = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const ActionsTab: React.FC<ActionsTabProps> = ({ 
    character, roll, triggerRollMenu, setSelectedDetail, getAttacks, bonusActionList, setShowCustomActionModal, setShowHomebrewModal, spellSave, spellMod 
}) => {
    const [actionFilter, setActionFilter] = useState('ALL');

    const allAttacks = getAttacks();
    const favAttacks = allAttacks.filter(a => character.favorites.includes(a.id));
    const favOtherSpells = character.spells.filter(s => character.favorites.includes(s.index) && !favAttacks.some(a => a.id === s.index)).map(spell => {
        const notes = [spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`];
        if(spell.casting_time.toLowerCase().includes('bonus')) notes.push('Bonus');
        const dcType = spell.dc?.dc_type?.name?.substring(0, 3).toUpperCase();
        
        const dmgStr = getSpellDamageString(spell, character.level, spell.level || 1);
        
        return { 
            id: spell.index, 
            name: spell.name, 
            range: spell.range, 
            hit: null, 
            save: dcType ? { type: dcType, dc: spellSave } : null,
            damage: dmgStr || '-', 
            type: spell.damage?.damage_type?.name || spell.school.name, 
            notes, 
            source: spell 
        };
    });
    
    const favTableItems = [...favAttacks, ...favOtherSpells];
    const favBonusActionsNonSpells = bonusActionList.filter(a => character.favorites.includes(a.id) && !((a as any).source && 'school' in (a as any).source));
    const favStandardActions = STANDARD_ACTIONS.map(a => ({...a, id: `action-${a.name}`})).filter(a => character.favorites.includes(a.id));
    
    const favItems = character.inventory.filter(i => 
        character.favorites.includes(i.id) && 
        !allAttacks.some(a => a.id === i.id)
    );
    
    const favFeatures = character.classFeatures.filter(f => character.favorites.includes(f.index));
    
    const hasFavorites = favTableItems.length > 0 || favBonusActionsNonSpells.length > 0 || favStandardActions.length > 0 || favItems.length > 0 || favFeatures.length > 0;

    const renderActionIcon = (attack: any) => {
        const isSpellAttack = attack.source && ('school' in attack.source || attack.type === 'spell');
        const isUnarmed = attack.name === 'Unarmed Strike';
        
        if (isSpellAttack) return <IconMagic />;
        if (isUnarmed) return <IconHand />;
        return <IconSword />;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="hidden md:flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {['ALL', 'ATTACK', 'ACTION', 'BONUS ACTION', 'REACTION', 'OTHER', 'LIMITED USE'].map(filter => (
                        <button key={filter} onClick={() => setActionFilter(filter)} className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${actionFilter === filter ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600 hover:border-gray-400'}`}>{filter}</button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCustomActionModal(true)} className="text-[10px] text-dnd-red font-bold uppercase border border-dnd-red bg-black/40 px-2 py-0.5 rounded hover:bg-dnd-red hover:text-white transition-colors">Manage Custom</button>
                </div>
            </div>

            {hasFavorites && (
                <div className={`${WIDGET_BG} border border-dnd-gold/50 rounded-xl overflow-hidden shadow-sm mb-6`}>
                    <div className="bg-[#121316]/80 px-6 py-2 flex justify-between items-center border-b border-dnd-gold/30">
                        <div className="flex items-center gap-2"><span className="text-dnd-gold">★</span><h3 className="text-xs font-bold text-dnd-gold uppercase tracking-wider">Favorites</h3></div>
                    </div>
                    {favTableItems.length > 0 && (
                        <div className="overflow-x-auto custom-scrollbar">
                            <div className="grid grid-cols-[40px_1fr_80px_120px_120px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider items-center min-w-[600px]"><div>Type</div><div>Action</div><div className="text-center">Range</div><div className="text-center">Damage</div><div className="text-center">Hit / DC</div></div>
                            <div className="divide-y divide-[#2e3036]/60 min-w-[600px]">
                                {favTableItems.map((attack, i) => (
                                    <div key={i} className="grid grid-cols-[40px_1fr_80px_120px_120px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 transition-colors group cursor-pointer" onClick={() => setSelectedDetail(attack.source ? { ...attack.source, id: attack.id } : attack)}>
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-500 shrink-0 border border-gray-600/50 rounded-md bg-gray-800 self-center">
                                            {renderActionIcon(attack)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-200 text-sm group-hover:text-white truncate flex items-center gap-1.5">
                                                {attack.name}
                                                {attack.source && 'concentration' in attack.source && attack.source.concentration && (
                                                    <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded h-3 flex items-center">C</span>
                                                )}
                                                {attack.source && 'ritual' in attack.source && attack.source.ritual && (
                                                    <span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded h-3 flex items-center">R</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 truncate lowercase">{attack.type}{attack.notes?.length ? ` • ${attack.notes.join(' • ')}` : ''}</div>
                                        </div>
                                        <div className="text-center text-[10px] text-gray-400 font-bold uppercase">{attack.range}</div>
                                        <div className="flex justify-center"><button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`); }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center"><span className="text-sm font-bold text-white">{attack.damage}</span><span className="text-[8px] text-gray-500 uppercase">{attack.type}</span></button></div>
                                        <div className="flex justify-center"><button onClick={(e) => { if (attack.hit !== null) { e.stopPropagation(); roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} onContextMenu={(e) => { if (attack.hit !== null) { e.preventDefault(); e.stopPropagation(); triggerRollMenu(e, `1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center">{attack.hit !== null ? (<span className="text-sm font-bold text-white">{formatModifier(attack.hit)}</span>) : attack.save ? (<div className="flex flex-col items-center leading-none"><span className="text-[8px] font-bold text-gray-500 mb-0.5">{attack.save.type}</span><span className="text-sm font-bold text-white">DC {attack.save.dc}</span></div>) : ('-')}</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {(favBonusActionsNonSpells.length > 0 || favStandardActions.length > 0 || favItems.length > 0 || favFeatures.length > 0) && (
                        <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-gray-800/50">
                            {favStandardActions.map(act => (
                                <button key={act.id} onClick={() => setSelectedDetail(act)} className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-md hover:border-white text-sm text-gray-300 font-bold transition-colors flex items-center gap-2">
                                    <span className="text-gray-500"><IconHand /></span>{act.name}
                                </button>
                            ))}
                            {favBonusActionsNonSpells.map((act, i) => (
                                <button key={i} onClick={() => setSelectedDetail((act as any).source ? { ...(act as any).source, id: act.id } : act)} className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-md hover:border-dnd-gold text-sm text-gray-300 font-bold transition-colors flex items-center gap-2">
                                    <span className="text-gray-500">{renderActionIcon(act)}</span>{act.name}
                                </button>
                            ))}
                            {favItems.map(item => (
                                <button key={item.id} onClick={() => setSelectedDetail(item)} className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-md hover:border-dnd-gold text-sm text-gray-300 font-bold transition-colors flex items-center gap-2">
                                    <span className="text-gray-500">{renderActionIcon(item)}</span>{item.name}{item.quantity > 1 && <span className="text-xs text-gray-500 ml-1">x{item.quantity}</span>}
                                </button>
                            ))}
                            {favFeatures.map(feat => (
                                <button key={feat.index} onClick={() => setSelectedDetail(feat)} className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded-md hover:border-dnd-gold text-sm text-gray-300 font-bold transition-colors flex items-center gap-2">
                                    <span className="text-gray-500"><IconFeatures /></span>{feat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}>
                 <div className="bg-[#121316]/80 px-6 py-2 flex justify-between items-center"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attack</h3></div>
                 <div className="overflow-x-auto custom-scrollbar">
                     <div className="grid grid-cols-[40px_1fr_80px_120px_120px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider items-center min-w-[600px]"><div>Type</div><div>Action</div><div className="text-center">Range</div><div className="text-center">Damage</div><div className="text-center">Hit / DC</div></div>
                     <div className="divide-y divide-[#2e3036]/60 min-w-[600px]">
                         {allAttacks.map((attack, i) => (
                             <div key={i} className="grid grid-cols-[40px_1fr_80px_120px_120px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 transition-colors group cursor-pointer" onClick={() => setSelectedDetail(attack.source ? { ...attack.source, id: attack.id } : attack)}>
                                 <div className="w-8 h-8 flex items-center justify-center text-gray-500 shrink-0 border border-gray-600/50 rounded-md bg-gray-800 self-center">
                                     {renderActionIcon(attack)}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="font-bold text-gray-200 text-sm group-hover:text-white truncate flex items-center gap-1.5">
                                        {attack.name}
                                        {attack.source && 'concentration' in attack.source && attack.source.concentration && (
                                            <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded h-3 flex items-center">C</span>
                                        )}
                                        {attack.source && 'ritual' in attack.source && attack.source.ritual && (
                                            <span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded h-3 flex items-center">R</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 truncate lowercase">{attack.type}{attack.notes?.length ? ` • ${attack.notes.join(' • ')}` : ''}</div>
                                 </div>
                                 <div className="text-center text-[10px] text-gray-400 font-bold uppercase">{attack.range}</div>
                                 <div className="flex justify-center"><button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`); }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center"><span className="text-sm font-bold text-white">{attack.damage}</span><span className="text-[8px] text-gray-500 uppercase">{attack.type}</span></button></div>
                                 <div className="flex justify-center"><button onClick={(e) => { if (attack.hit !== null) { e.stopPropagation(); roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} onContextMenu={(e) => { if (attack.hit !== null) { e.preventDefault(); e.stopPropagation(); triggerRollMenu(e, `1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center">{attack.hit !== null ? (<span className="text-sm font-bold text-white">{formatModifier(attack.hit)}</span>) : attack.save ? (<div className="flex flex-col items-center leading-none"><span className="text-[8px] font-bold text-gray-500 mb-0.5">{attack.save.type}</span><span className="text-sm font-bold text-white">DC {attack.save.dc}</span></div>) : ('-')}</button></div>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>
            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}><div className="bg-[#121316]/80 px-6 py-2"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions in Combat</h3></div><div className="px-6 py-4 flex flex-wrap gap-2">{STANDARD_ACTIONS.map(act => (<div key={act.name} className="relative group"><button onClick={() => setSelectedDetail({ ...act, id: `action-${act.name}` })} className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded hover:border-white text-sm text-gray-300 font-bold transition-colors">{act.name}</button></div>))}</div></div>
            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}><div className="bg-[#121316]/80 px-6 py-2 flex justify-between"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bonus Actions</h3></div><div className="px-6 py-4 flex flex-wrap gap-2">{bonusActionList.length > 0 ? bonusActionList.map((act, i) => (
                <div key={i} className="relative group">
                    <button 
                        onClick={() => setSelectedDetail(act.source ? { ...act.source, id: act.id } : act)} 
                        className="px-3 py-2 bg-gray-800/80 border border-gray-600/50 rounded hover:border-dnd-gold text-sm text-gray-300 font-bold transition-colors flex items-center gap-2"
                    >
                        <span className="text-gray-500">{renderActionIcon(act)}</span>
                        {act.name}
                    </button>
                </div>
            )) : (<div className="text-sm text-gray-500 italic">No bonus actions available.</div>)}</div></div>
        </div>
    );
};

export default ActionsTab;