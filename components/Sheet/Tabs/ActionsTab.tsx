import React, { useState, useEffect, useRef } from 'react';
import { CharacterState, SpellDetail, CreatureDetail } from '../../../types';
import { STANDARD_ACTIONS, WIDGET_BG, MASTERY_DESCRIPTIONS, STANDARD_CONDITIONS } from '../../../data/constants';
import { formatModifier, getSpellDamageString, getSpellCastLevel, hasUiWidget } from '../../../utils/rules';

interface ActionsTabProps {
    character: CharacterState;
    roll: (formula: string, label: string, preResult?: any, onComplete?: (result: any) => void) => any;
    triggerRollMenu: (e: React.MouseEvent, formula: string, label: string) => void;
    setSelectedDetail: (item: any) => void;
    getAttacks: () => any[];
    bonusActionList: any[];
    setShowCustomActionModal: (val: boolean) => void;
    setShowHomebrewModal: (val: boolean, tab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat') => void;
    spellSave: number;
    spellMod: number;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
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
    character, roll, triggerRollMenu, setSelectedDetail, getAttacks, bonusActionList, setShowCustomActionModal, setShowHomebrewModal, spellSave, spellMod, setCharacter
}) => {
    const [actionFilter, setActionFilter] = useState('ALL');

    const recordAttackRoll = (total: number) => {
        const target = character.combatTarget;
        if (!target || target.ac === undefined) return;
        setCharacter(prev => ({ ...prev, combatTarget: { ...(prev.combatTarget || target), lastAttack: total, lastHit: total >= Number(target.ac) } }));
    };
    const applyTargetDamage = (amount: number, damageType: string) => {
        const target = character.combatTarget;
        if (!target || target.hp === undefined) return;
        const type = String(damageType || '').toLowerCase();
        const effects = [
            ...(character.classFeatures || []).flatMap((feature: any) => feature.effects || []),
            ...(character.feats || []).flatMap((feat: any) => feat.effects || []),
            ...(character.race?.traits || []).flatMap((trait: any) => trait.effects || []),
        ];
        const ignores = effects.some((effect: any) => effect.type === 'ignore_resistance' && String(effect.damage_type || '').toLowerCase() === type);
        const immune = !ignores && (target.immunities || []).some(value => value.toLowerCase() === type);
        const resistant = !ignores && (target.resistances || []).some(value => value.toLowerCase() === type);
        const applied = immune ? 0 : resistant ? Math.floor(amount / 2) : amount;
        setCharacter(prev => {
            if (!prev.combatTarget || prev.combatTarget.hp === undefined) return prev;
            return { ...prev, combatTarget: { ...prev.combatTarget, hp: Math.max(0, prev.combatTarget.hp - applied) } };
        });
    };

    const isCardMaster = hasUiWidget(character, 'activeCards');

    const allAttacks = getAttacks();
    
    const filteredAttacks = allAttacks.filter(attack => {
        if (actionFilter === 'ALL') return true;
        if (actionFilter === 'ATTACK') return true; // Attacks are always attacks
        
        const activation = attack.source?.activationType?.toLowerCase();
        if (actionFilter === 'ACTION' && (activation === 'action' || !activation)) return true;
        if (actionFilter === 'BONUS ACTION' && activation === 'bonus') return true;
        if (actionFilter === 'REACTION' && activation === 'reaction') return true;
        if (actionFilter === 'OTHER' && (activation === 'legendary' || activation === 'other')) return true;
        if (actionFilter === 'LIMITED USE' && attack.source?.maxUses) return true;
        
        return false;
    });

    const favAttacks = allAttacks.filter(a => character.favorites.includes(a.id));
    const favOtherSpells = character.spells.filter(s => character.favorites.includes(s.index) && !favAttacks.some(a => a.id === s.index)).map(spell => {
        const notes = [spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`];
        if(spell.casting_time.toLowerCase().includes('bonus')) notes.push('Bonus');
        const dcType = spell.dc?.dc_type?.name?.substring(0, 3).toUpperCase();
        
        const dmgStr = getSpellDamageString(spell, character.level, getSpellCastLevel(character, spell));
        
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
    const favBonusActionsNonSpells = bonusActionList.filter(a => character.favorites.includes(a.id) && !(a.source && typeof a.source === 'object' && 'school' in a.source));
    const favStandardActions = STANDARD_ACTIONS.map(a => ({...a, id: `action-${a.name}`})).filter(a => character.favorites.includes(a.id));
    
    const favItems = character.inventory.filter(i => 
        character.favorites.includes(i.id) && 
        !allAttacks.some(a => a.id === i.id)
    );
    
    const favFeatures = character.classFeatures.filter(f => character.favorites.includes(f.index));
    
    const hasFavorites = favTableItems.length > 0 || favBonusActionsNonSpells.length > 0 || favStandardActions.length > 0 || favItems.length > 0 || favFeatures.length > 0;

    const renderActionIcon = (attack: any) => {
        const isSpellAttack = attack.source && typeof attack.source === 'object' && ('school' in attack.source || attack.type === 'spell');
        const isUnarmed = attack.name === 'Unarmed Strike';
        
        if (isSpellAttack) return <IconMagic />;
        if (isUnarmed) return <IconHand />;
        return <IconSword />;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {['ALL', 'ATTACK', 'ACTION', 'BONUS ACTION', 'REACTION', 'OTHER', 'LIMITED USE'].map(filter => (
                        <button key={filter} onClick={() => setActionFilter(filter)} className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded border transition-colors ${actionFilter === filter ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600 hover:border-gray-400'}`}>{filter}</button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCustomActionModal(true)} className="text-[10px] text-dnd-red font-bold uppercase border border-dnd-red bg-black/40 px-3 py-1.5 rounded hover:bg-dnd-red hover:text-white transition-colors">Manage Custom</button>
                </div>
            </div>

            <section className={`${WIDGET_BG} border border-gray-700 rounded-xl p-4 space-y-3`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-dnd-gold">Combat Target</span>
                        <input
                            value={character.combatTarget?.name || ''}
                            onChange={e => setCharacter(prev => ({
                                ...prev,
                                combatTarget: { name: e.target.value, resistances: [], immunities: [], conditions: [], ...(prev.combatTarget || {}) },
                            }))}
                            placeholder="Target name"
                            className="bg-black/30 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-dnd-gold"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="text-[9px] uppercase text-gray-500 font-bold">AC</label>
                        <input type="number" value={character.combatTarget?.ac ?? ''} onChange={e => setCharacter(prev => ({ ...prev, combatTarget: { name: '', resistances: [], immunities: [], conditions: [], ...(prev.combatTarget || {}), ac: e.target.value ? Number(e.target.value) : undefined } }))} className="w-16 bg-black/30 border border-gray-700 rounded px-2 py-1 text-xs text-white" />
                        <label className="text-[9px] uppercase text-gray-500 font-bold">HP</label>
                        <input type="number" value={character.combatTarget?.hp ?? ''} onChange={e => setCharacter(prev => ({ ...prev, combatTarget: { name: '', resistances: [], immunities: [], conditions: [], ...(prev.combatTarget || {}), hp: e.target.value ? Number(e.target.value) : undefined } }))} className="w-16 bg-black/30 border border-gray-700 rounded px-2 py-1 text-xs text-white" />
                        {character.combatTarget?.lastAttack !== undefined && (
                            <span className={`text-[9px] font-black uppercase ${character.combatTarget.lastHit ? 'text-emerald-400' : 'text-red-400'}`}>
                                Last: {character.combatTarget.lastAttack} {character.combatTarget.lastHit ? 'HIT' : 'MISS'}
                            </span>
                        )}
                        <button type="button" onClick={() => setCharacter(prev => ({ ...prev, masteryUsage: {} }))} className="text-[9px] uppercase font-bold text-gray-500 hover:text-dnd-gold">New Turn</button>
                        <button type="button" onClick={() => setCharacter(prev => ({ ...prev, combatTarget: null }))} className="text-[9px] uppercase font-bold text-gray-500 hover:text-red-400">Clear</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(['resistances', 'immunities'] as const).map(kind => (
                        <div key={kind} className="flex items-center gap-2">
                            <span className="text-[9px] uppercase text-gray-500 font-bold w-20">{kind}</span>
                            <select
                                value=""
                                onChange={e => {
                                    if (!e.target.value) return;
                                    setCharacter(prev => {
                                        const current = prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] };
                                        const list = Array.from(new Set([...(current[kind] || []), e.target.value]));
                                        return { ...prev, combatTarget: { ...current, [kind]: list } };
                                    });
                                }}
                                className="bg-black/30 border border-gray-700 rounded px-2 py-1 text-[10px] text-white"
                            >
                                <option value="">Add...</option>
                                {['Acid','Cold','Fire','Force','Lightning','Necrotic','Poison','Psychic','Radiant','Thunder','Bludgeoning','Piercing','Slashing'].map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <div className="flex flex-wrap gap-1">
                                {(character.combatTarget?.[kind] || []).map((type: string) => (
                                    <button key={type} type="button" onClick={() => setCharacter(prev => ({ ...prev, combatTarget: { ...(prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] }), [kind]: (prev.combatTarget?.[kind] || []).filter((value: string) => value !== type) } }))} className="text-[9px] bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5 text-gray-300">{type} ×</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase text-gray-500 font-bold">Conditions</span>
                    <select value="" onChange={e => {
                        if (!e.target.value) return;
                        setCharacter(prev => {
                            const current = prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] };
                            return { ...prev, combatTarget: { ...current, conditions: Array.from(new Set([...(current.conditions || []), e.target.value])) } };
                        });
                    }} className="bg-black/30 border border-gray-700 rounded px-2 py-1 text-[10px] text-white">
                        <option value="">Add condition...</option>
                        {STANDARD_CONDITIONS.map((condition: any) => <option key={condition.name} value={condition.name}>{condition.name}</option>)}
                    </select>
                    {(character.combatTarget?.conditions || []).map((condition: string) => (
                        <button key={condition} type="button" onClick={() => setCharacter(prev => ({ ...prev, combatTarget: { ...(prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] }), conditions: (prev.combatTarget?.conditions || []).filter((value: string) => value !== condition) } }))} className="text-[9px] bg-purple-900/30 border border-purple-700/50 rounded-full px-2 py-0.5 text-purple-200">{condition} ×</button>
                    ))}
                </div>
            </section>

            {hasFavorites && (
                <div className={`${WIDGET_BG} border border-dnd-gold/50 rounded-xl overflow-hidden shadow-sm mb-6`}>
                    <div className="bg-[#121316]/80 px-6 py-2 flex justify-between items-center border-b border-dnd-gold/30">
                        <div className="flex items-center gap-2"><span className="text-dnd-gold">★</span><h3 className="text-xs font-bold text-dnd-gold uppercase tracking-wider">Favorites</h3></div>
                    </div>
                    {favTableItems.length > 0 && (
                        <>
                        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                            <div className="grid grid-cols-[40px_1fr_120px_110px_110px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider items-center min-w-[600px]"><div>Type</div><div>Action</div><div className="text-center">Range</div><div className="text-center">Damage</div><div className="text-center">Hit / DC</div></div>
                            <div className="divide-y divide-[#2e3036]/60 min-w-[600px]">
                                {favTableItems.map((attack, i) => (
                                    <div key={i} className="grid grid-cols-[40px_1fr_120px_110px_110px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 transition-colors group cursor-pointer" onClick={() => setSelectedDetail(attack.source && typeof attack.source === 'object' ? { ...attack.source, id: attack.id } : attack)}>
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-500 shrink-0 border border-gray-600/50 rounded-md bg-gray-800 self-center">
                                            {renderActionIcon(attack)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-200 text-sm group-hover:text-white truncate flex items-center gap-1.5">
                                                {attack.name}
                                                {attack.attackCount && attack.attackCount > 1 && (
                                                    <span className="text-[10px] text-dnd-gold font-black ml-1">x{attack.attackCount}</span>
                                                )}
                                                {attack.source && typeof attack.source === 'object' && 'concentration' in attack.source && attack.source.concentration && (
                                                    <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded h-3 flex items-center">C</span>
                                                )}
                                                {attack.source && typeof attack.source === 'object' && 'ritual' in attack.source && attack.source.ritual && (
                                                    <span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded h-3 flex items-center">R</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 lowercase line-clamp-2 leading-tight">{attack.type}{attack.notes?.length ? ` • ${attack.notes.join(' • ')}` : ''}</div>
                                            {attack.mastery && (
                                        <div className="flex flex-wrap gap-1 mt-1 items-center">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-dnd-gold">Mastery: {attack.mastery.name}</span>
                                            {attack.mastery.saveDC && (
                                                <button onClick={(e) => { e.stopPropagation(); roll('1d20', `${attack.mastery.saveAbility} Save vs ${attack.mastery.name}`); }} className="text-[9px] bg-purple-900/30 text-purple-200 border border-purple-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    {attack.mastery.saveAbility} DC {attack.mastery.saveDC}
                                                </button>
                                            )}
                                            {attack.mastery.missDamage !== undefined && (
                                                <button onClick={(e) => { e.stopPropagation(); roll(String(attack.mastery.missDamage), `Graze Miss ${attack.name}`); }} className="text-[9px] bg-gray-800/60 text-gray-200 border border-gray-600/50 px-1.5 py-0.5 rounded font-bold">
                                                    Miss: {attack.mastery.missDamage}
                                                </button>
                                            )}
                                            {attack.mastery.extraAttack && (() => {
                                                const masteryKey = `${attack.mastery.name}-${attack.id}`;
                                                const used = !!character.masteryUsage?.[masteryKey];
                                                return (
                                                    <button disabled={used} onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (used) return;
                                                        if (attack.mastery.hit !== null) roll(`1d20${formatModifier(attack.mastery.hit)}`, `Extra Attack ${attack.name}`);
                                                        if (attack.mastery.damage) roll(attack.mastery.damage, `Extra Damage ${attack.name}`);
                                                        setCharacter(prev => ({ ...prev, masteryUsage: { ...(prev.masteryUsage || {}), [masteryKey]: true } }));
                                                    }} className={`text-[9px] border px-1.5 py-0.5 rounded font-bold ${used ? 'bg-gray-800/50 text-gray-600 border-gray-700 cursor-not-allowed' : 'bg-emerald-900/30 text-emerald-200 border-emerald-700/50'}`}>
                                                        {used ? 'Extra Attack Used' : 'Extra Attack'}
                                                    </button>
                                                );
                                            })()}
                                            {['topple','push','sap','slow','vex'].includes(String(attack.mastery.name).toLowerCase()) && (
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    const label = String(attack.mastery.name);
                                                    setCharacter(prev => {
                                                        const current = prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] };
                                                        return { ...prev, combatTarget: { ...current, conditions: Array.from(new Set([...(current.conditions || []), label])) } };
                                                    });
                                                }} className="text-[9px] bg-amber-900/30 text-amber-200 border border-amber-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    Apply {attack.mastery.name}
                                                </button>
                                            )}
                                            {attack.mastery.missDamage !== undefined && character.combatTarget?.hp !== undefined && (
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCharacter(prev => {
                                                        if (!prev.combatTarget || prev.combatTarget.hp === undefined) return prev;
                                                        return { ...prev, combatTarget: { ...prev.combatTarget, hp: Math.max(0, prev.combatTarget.hp - Number(attack.mastery.missDamage || 0)) } };
                                                    });
                                                }} className="text-[9px] bg-red-900/30 text-red-200 border border-red-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    Apply Miss Damage
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {attack.modifiers && attack.modifiers.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {attack.modifiers.map((mod: any, idx: number) => (
                                                        <div key={idx} className="group/mod relative">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-[9px] bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/30 px-1.5 py-0.5 rounded cursor-help font-bold uppercase tracking-tighter focus:outline-none group-focus-within/mod:bg-dnd-gold group-focus-within/mod:text-black"
                                                            >
                                                                {mod.name}
                                                            </button>
                                                            <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 border border-gray-700 rounded shadow-xl opacity-0 group-focus-within/mod:opacity-100 group-hover/mod:opacity-100 transition-opacity pointer-events-none z-50 text-[10px] normal-case text-gray-200">
                                                                <div className="font-bold text-dnd-gold mb-1 uppercase tracking-wider">{mod.name}</div>
                                                                {mod.desc}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center text-[10px] text-gray-400 font-bold">{attack.range}</div>
                                        <div className="flex justify-center"><button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`, undefined, (result) => applyTargetDamage(result.total, attack.type)); }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center"><span className="text-sm font-bold text-white">{attack.damage}</span><span className="text-[8px] text-gray-500 uppercase">{attack.type}</span></button></div>
                                        <div className="flex justify-center"><button onClick={(e) => { if (attack.hit !== null) { e.stopPropagation(); roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`, undefined, (result) => recordAttackRoll(result.total)); } }} onContextMenu={(e) => { if (attack.hit !== null) { e.preventDefault(); e.stopPropagation(); triggerRollMenu(e, `1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center">{attack.hit !== null ? (<span className="text-sm font-bold text-white">{formatModifier(attack.hit)}</span>) : attack.save ? (<div className="flex flex-col items-center leading-none"><span className="text-[8px] font-bold text-gray-500 mb-0.5">{attack.save.type}</span><span className="text-sm font-bold text-white">DC {attack.save.dc}</span></div>) : ('-')}</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mobile: tappable rows (tap row for details) */}
                        <div className="lg:hidden divide-y divide-[#2e3036]/60">
                            {favTableItems.map((attack, i) => (
                                <div key={i} onClick={() => setSelectedDetail(attack.source && typeof attack.source === 'object' ? { ...attack.source, id: attack.id } : attack)} className="flex items-center gap-3 px-4 py-3 active:bg-[#2e3036]/60 transition-colors cursor-pointer">
                                    <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-600/50 flex items-center justify-center text-gray-500 shrink-0">
                                        {renderActionIcon(attack)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-gray-200 truncate flex items-center gap-1">
                                            {attack.name}
                                            {attack.attackCount && attack.attackCount > 1 && <span className="text-[10px] text-dnd-gold font-black">x{attack.attackCount}</span>}
                                        </div>
                                        <div className="text-[10px] text-gray-500 truncate">{attack.type}{attack.notes?.length ? ` • ${attack.notes.join(' • ')}` : ''}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`, undefined, (result) => applyTargetDamage(result.total, attack.type)); }} className="px-2.5 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-xs font-bold text-white min-w-[52px]">{attack.damage}</button>
                                        <button onClick={(e) => { e.stopPropagation(); if (attack.hit !== null) roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`, undefined, (result) => recordAttackRoll(result.total)); }} className="px-2.5 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-xs font-bold text-gray-300 min-w-[52px]">{attack.hit !== null ? formatModifier(attack.hit) : attack.save ? `DC ${attack.save.dc}` : '-'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
                    )}
                    {(favBonusActionsNonSpells.length > 0 || favStandardActions.length > 0 || favItems.length > 0 || favFeatures.length > 0) && (
                        <div className="px-6 py-3 flex flex-wrap gap-2 border-t border-gray-800/50">
                            {favStandardActions.map(act => (
                                <button key={act.id} onClick={() => setSelectedDetail(act)} className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-white text-[10px] text-gray-300 font-bold transition-colors flex items-center gap-1.5">
                                    <span className="text-gray-500 scale-75"><IconHand /></span>{act.name}
                                </button>
                            ))}
                            {favBonusActionsNonSpells.map((act, i) => (
                                <button key={i} onClick={() => setSelectedDetail((act as any).source && typeof (act as any).source === 'object' ? { ...(act as any).source, id: act.id } : act)} className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-dnd-gold text-[10px] text-gray-300 font-bold transition-colors flex items-center gap-1.5">
                                    <span className="text-gray-500 scale-75">{renderActionIcon(act)}</span>{act.name}
                                </button>
                            ))}
                            {favItems.map(item => (
                                <button key={item.id} onClick={() => setSelectedDetail(item)} className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-dnd-gold text-[10px] text-gray-300 font-bold transition-colors flex items-center gap-1.5">
                                    <span className="text-gray-500 scale-75">{renderActionIcon(item)}</span>{item.name}{item.quantity > 1 && <span className="text-[8px] text-gray-500 ml-1">x{item.quantity}</span>}
                                </button>
                            ))}
                            {favFeatures.map(feat => (
                                <button key={feat.index} onClick={() => setSelectedDetail(feat)} className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-dnd-gold text-[10px] text-gray-300 font-bold transition-colors flex items-center gap-1.5">
                                    <span className="text-gray-500 scale-75"><IconFeatures /></span>{feat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}>
                 <div className="bg-[#121316]/80 px-6 py-2 flex justify-between items-center"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attack</h3></div>
                 <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                     <div className="grid grid-cols-[40px_1fr_120px_110px_110px] gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider items-center min-w-[600px]"><div>Type</div><div>Action</div><div className="text-center">Range</div><div className="text-center">Damage</div><div className="text-center">Hit / DC</div></div>
                     <div className="divide-y divide-[#2e3036]/60 min-w-[600px]">
                         {filteredAttacks.map((attack, i) => (
                             <div key={i} className="grid grid-cols-[40px_1fr_120px_110px_110px] gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 transition-colors group cursor-pointer" onClick={() => setSelectedDetail(attack.source && typeof attack.source === 'object' ? { ...attack.source, id: attack.id } : attack)}>
                                 <div className="w-8 h-8 flex items-center justify-center text-gray-500 shrink-0 border border-gray-600/50 rounded-md bg-gray-800 self-center">
                                     {renderActionIcon(attack)}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="font-bold text-gray-200 text-sm group-hover:text-white truncate flex items-center gap-1.5">
                                        {attack.name}
                                        {attack.attackCount && attack.attackCount > 1 && (
                                            <span className="text-[10px] text-dnd-gold font-black ml-1">x{attack.attackCount}</span>
                                        )}
                                        {attack.source && typeof attack.source === 'object' && 'concentration' in attack.source && attack.source.concentration && (
                                            <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded h-3 flex items-center">C</span>
                                        )}
                                        {attack.source && typeof attack.source === 'object' && 'ritual' in attack.source && attack.source.ritual && (
                                            <span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded h-3 flex items-center">R</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 lowercase line-clamp-2 leading-tight">
                                        {attack.type}
                                        {attack.notes?.map((note: string, idx: number) => {
                                            const description = MASTERY_DESCRIPTIONS[note];
                                            return (
                                                <React.Fragment key={idx}>
                                                    {' • '}
                                                    {description ? (
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="group/mastery relative cursor-help focus:outline-none"
                                                        >
                                                            {note}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-gray-700 rounded shadow-xl opacity-0 group-focus-within/mastery:opacity-100 group-hover/mastery:opacity-100 transition-opacity pointer-events-none z-50 text-[10px] normal-case text-gray-200">
                                                                <div className="font-bold text-dnd-gold mb-1 uppercase tracking-wider">{note}</div>
                                                                {description}
                                                            </div>
                                                        </button>
                                                    ) : note}
                                                </React.Fragment>
                                            );
                                        })}
                                        {attack.source?.maxUses && (
                                            <span className="ml-2 text-dnd-gold font-bold uppercase text-[8px]">
                                                Limited: {character.featureUsage[attack.name]?.current || attack.source.maxUses}/{attack.source.maxUses}
                                            </span>
                                        )}
                                    </div>
                                    {attack.mastery && (
                                        <div className="flex flex-wrap gap-1 mt-1 items-center">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-dnd-gold">Mastery: {attack.mastery.name}</span>
                                            {attack.mastery.saveDC && (
                                                <button onClick={(e) => { e.stopPropagation(); roll('1d20', `${attack.mastery.saveAbility} Save vs ${attack.mastery.name}`); }} className="text-[9px] bg-purple-900/30 text-purple-200 border border-purple-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    {attack.mastery.saveAbility} DC {attack.mastery.saveDC}
                                                </button>
                                            )}
                                            {attack.mastery.missDamage !== undefined && (
                                                <button onClick={(e) => { e.stopPropagation(); roll(String(attack.mastery.missDamage), `Graze Miss ${attack.name}`); }} className="text-[9px] bg-gray-800/60 text-gray-200 border border-gray-600/50 px-1.5 py-0.5 rounded font-bold">
                                                    Miss: {attack.mastery.missDamage}
                                                </button>
                                            )}
                                            {attack.mastery.extraAttack && (() => {
                                                const masteryKey = `${attack.mastery.name}-${attack.id}`;
                                                const used = !!character.masteryUsage?.[masteryKey];
                                                return (
                                                    <button disabled={used} onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (used) return;
                                                        if (attack.mastery.hit !== null) roll(`1d20${formatModifier(attack.mastery.hit)}`, `Extra Attack ${attack.name}`);
                                                        if (attack.mastery.damage) roll(attack.mastery.damage, `Extra Damage ${attack.name}`);
                                                        setCharacter(prev => ({ ...prev, masteryUsage: { ...(prev.masteryUsage || {}), [masteryKey]: true } }));
                                                    }} className={`text-[9px] border px-1.5 py-0.5 rounded font-bold ${used ? 'bg-gray-800/50 text-gray-600 border-gray-700 cursor-not-allowed' : 'bg-emerald-900/30 text-emerald-200 border-emerald-700/50'}`}>
                                                        {used ? 'Extra Attack Used' : 'Extra Attack'}
                                                    </button>
                                                );
                                            })()}
                                            {['topple','push','sap','slow','vex'].includes(String(attack.mastery.name).toLowerCase()) && (
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    const label = String(attack.mastery.name);
                                                    setCharacter(prev => {
                                                        const current = prev.combatTarget || { name: '', resistances: [], immunities: [], conditions: [] };
                                                        return { ...prev, combatTarget: { ...current, conditions: Array.from(new Set([...(current.conditions || []), label])) } };
                                                    });
                                                }} className="text-[9px] bg-amber-900/30 text-amber-200 border border-amber-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    Apply {attack.mastery.name}
                                                </button>
                                            )}
                                            {attack.mastery.missDamage !== undefined && character.combatTarget?.hp !== undefined && (
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCharacter(prev => {
                                                        if (!prev.combatTarget || prev.combatTarget.hp === undefined) return prev;
                                                        return { ...prev, combatTarget: { ...prev.combatTarget, hp: Math.max(0, prev.combatTarget.hp - Number(attack.mastery.missDamage || 0)) } };
                                                    });
                                                }} className="text-[9px] bg-red-900/30 text-red-200 border border-red-700/50 px-1.5 py-0.5 rounded font-bold">
                                                    Apply Miss Damage
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {attack.modifiers && attack.modifiers.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {attack.modifiers.map((mod: any, idx: number) => (
                                                <div key={idx} className="group/mod relative">
                                                    <span className="text-[9px] bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/30 px-1.5 py-0.5 rounded cursor-help font-bold uppercase tracking-tighter">
                                                        {mod.name}
                                                    </span>
                                                    <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 border border-gray-700 rounded shadow-xl opacity-0 group-hover/mod:opacity-100 transition-opacity pointer-events-none z-50 text-[10px] normal-case text-gray-200">
                                                        <div className="font-bold text-dnd-gold mb-1 uppercase tracking-wider">{mod.name}</div>
                                                        {mod.desc}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                 </div>
                                 <div className="text-center text-[10px] text-gray-400 font-bold">{attack.range}</div>
                                 <div className="flex justify-center"><button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`, undefined, (result) => applyTargetDamage(result.total, attack.type)); }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center"><span className="text-sm font-bold text-white">{attack.damage}</span><span className="text-[8px] text-gray-500 uppercase">{attack.type}</span></button></div>
                                 <div className="flex justify-center"><button onClick={(e) => { if (attack.hit !== null) { e.stopPropagation(); roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`, undefined, (result) => recordAttackRoll(result.total)); } }} onContextMenu={(e) => { if (attack.hit !== null) { e.preventDefault(); e.stopPropagation(); triggerRollMenu(e, `1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`); } }} className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full flex flex-col items-center justify-center text-center">{attack.hit !== null ? (<span className="text-sm font-bold text-white">{formatModifier(attack.hit)}</span>) : attack.save ? (<div className="flex flex-col items-center leading-none"><span className="text-[8px] font-bold text-gray-500 mb-0.5">{attack.save.type}</span><span className="text-sm font-bold text-white">DC {attack.save.dc}</span></div>) : ('-')}</button></div>
                             </div>
                         ))}
                     </div>
                 </div>
                 {/* Mobile: tappable attack rows (tap row for details) */}
                 <div className="lg:hidden divide-y divide-[#2e3036]/60">
                     {filteredAttacks.map((attack, i) => (
                         <div key={i} onClick={() => setSelectedDetail(attack.source && typeof attack.source === 'object' ? { ...attack.source, id: attack.id } : attack)} className="flex items-center gap-3 px-4 py-3 active:bg-[#2e3036]/60 transition-colors cursor-pointer">
                             <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-600/50 flex items-center justify-center text-gray-500 shrink-0">
                                 {renderActionIcon(attack)}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="font-bold text-sm text-gray-200 truncate flex items-center gap-1">
                                     {attack.name}
                                     {attack.attackCount && attack.attackCount > 1 && <span className="text-[10px] text-dnd-gold font-black">x{attack.attackCount}</span>}
                                     {attack.source && typeof attack.source === 'object' && 'concentration' in attack.source && attack.source.concentration && (
                                         <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded">C</span>
                                     )}
                                     {attack.source?.maxUses && (
                                         <span className="text-[9px] text-dnd-gold font-bold">{character.featureUsage[attack.name]?.current || attack.source.maxUses}/{attack.source.maxUses}</span>
                                     )}
                                 </div>
                                 <div className="text-[10px] text-gray-500 truncate">{attack.type}{attack.notes?.length ? ` • ${attack.notes.join(' • ')}` : ''}</div>
                             </div>
                             <div className="flex items-center gap-1.5 shrink-0">
                                 <button onClick={(e) => { e.stopPropagation(); roll(attack.damage, `Damage ${attack.name}`, undefined, (result) => applyTargetDamage(result.total, attack.type)); }} className="px-2.5 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-xs font-bold text-white min-w-[52px]">{attack.damage}</button>
                                 <button onClick={(e) => { e.stopPropagation(); if (attack.hit !== null) roll(`1d20${formatModifier(attack.hit)}`, `Attack ${attack.name}`, undefined, (result) => recordAttackRoll(result.total)); }} className="px-2.5 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-xs font-bold text-gray-300 min-w-[52px]">{attack.hit !== null ? formatModifier(attack.hit) : attack.save ? `DC ${attack.save.dc}` : '-'}</button>
                             </div>
                         </div>
                     ))}
                     {filteredAttacks.length === 0 && (
                         <div className="px-6 py-10 text-center text-gray-600 italic text-sm">No attacks found for this filter.</div>
                     )}
                 </div>
            </div>
            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}><div className="bg-[#121316]/80 px-6 py-2"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions in Combat</h3></div><div className="px-6 py-3 flex flex-wrap gap-2">{STANDARD_ACTIONS.map(act => (<div key={act.name} className="relative group"><button onClick={() => setSelectedDetail({ ...act, id: `action-${act.name}` })} className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-white text-[10px] text-gray-300 font-bold transition-colors">{act.name}</button></div>))}</div></div>
            <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}><div className="bg-[#121316]/80 px-6 py-2 flex justify-between"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions, Bonus Actions & Reactions</h3></div><div className="px-6 py-3 flex flex-wrap gap-2">{bonusActionList.length > 0 ? bonusActionList.map((act, i) => (
                <div key={i} className="relative group">
                    <button 
                        onClick={() => setSelectedDetail(act.source && typeof act.source === 'object' ? { ...act.source, id: act.id } : act)} 
                        className="px-2 py-1 bg-gray-800/80 border border-gray-600/50 rounded hover:border-dnd-gold text-[10px] text-gray-300 font-bold transition-colors flex items-center gap-1.5"
                    >
                        <span className="text-gray-500 scale-75">{renderActionIcon(act)}</span>
                        {act.name}
                        {act.category && <span className="text-[8px] text-gray-500 uppercase">{act.category}</span>}
                    </button>
                    {act.source?.toggle && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                const key = act.source.toggle;
                                const cost = act.source.cost;
                                if (cost && !character.activeConditions?.[key]) {
                                    const item = character.inventory.find((entry: any) => entry.id === act.source.itemId);
                                    const resource = (item?.resources || []).find((entry: any) => entry.key === cost.resource);
                                    const resourceName = item && resource ? `${item.name}: ${resource.name || resource.key}` : '';
                                    const usage = character.featureUsage?.[resourceName];
                                    if (!item || !usage || Number(usage.current) < Number(cost.amount || 1)) {
                                        alert(`${act.name} does not have enough charges.`);
                                        return;
                                    }
                                    setCharacter(prev => ({
                                        ...prev,
                                        activeConditions: { ...(prev.activeConditions || {}), [key]: true },
                                        featureUsage: {
                                            ...prev.featureUsage,
                                            [resourceName]: { ...usage, current: Number(usage.current) - Number(cost.amount || 1) },
                                        },
                                    }));
                                    return;
                                }
                                setCharacter(prev => ({ ...prev, activeConditions: { ...(prev.activeConditions || {}), [key]: !prev.activeConditions?.[key] } }));
                            }}
                            className={`ml-1 px-2 py-1 rounded text-[9px] font-black uppercase border ${character.activeConditions?.[act.source.toggle] ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/40 text-gray-400 border-gray-600'}`}
                        >
                            {character.activeConditions?.[act.source.toggle] ? 'On' : 'Off'}
                        </button>
                    )}
                </div>
            )) : (<div className="text-[10px] text-gray-500 italic">No bonus actions available.</div>)}</div></div>
        </div>
    );
};

export default ActionsTab;