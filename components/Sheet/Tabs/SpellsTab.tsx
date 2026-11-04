
import React, { useState } from 'react';
import { CharacterState, SpellDetail } from '../../../types';
import { WIDGET_BG } from '../../../data/constants';
import { getSpellDamageString, getSpellSecondaryDamageString, calculateModifier, calculateProficiency, formatModifier, getEffectiveAbilities, resolveDamageFormula, appendMinDie } from '../../../utils/rules';

interface SpellsTabProps {
    character: CharacterState;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
    roll: (formula: string, label: string, preResult?: any, onComplete?: (result: any) => void) => any;
    triggerRollMenu: (e: React.MouseEvent, formula: string, label: string) => void;
    setSelectedDetail: (item: any) => void;
    spellSave: number;
    spellAttackStr: string;
    spellMod: number;
    setShowSpellManager: (val: boolean) => void;
    setShowHomebrewModal: (val: boolean, tab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat') => void;
    onPolymorphCast?: () => void;
    hasPendingSpells?: boolean;
}

const SpellsTab: React.FC<SpellsTabProps> = ({
    character, setCharacter, roll, triggerRollMenu, setSelectedDetail, spellSave, spellAttackStr, spellMod, setShowSpellManager, setShowHomebrewModal, onPolymorphCast, hasPendingSpells
}) => {
    const [spellFilter, setSpellFilter] = useState<number | 'all'>('all');
    const effectiveAbilities = getEffectiveAbilities(character);
    const proficiency = calculateProficiency(character.level);
    const spellAttackFor = (spell: SpellDetail) => spell.spellcastingAbility
        ? formatModifier(proficiency + calculateModifier(effectiveAbilities[spell.spellcastingAbility]))
        : spellAttackStr;
    const spellSaveFor = (spell: SpellDetail) => spell.spellcastingAbility
        ? 8 + proficiency + calculateModifier(effectiveAbilities[spell.spellcastingAbility])
        : spellSave;
    const grantMetaFor = (spell: SpellDetail) => {
        const effects = [
            ...(character.classFeatures || []).flatMap((feature: any) => feature.effects || []),
            ...(character.feats || []).flatMap((feat: any) => feat.effects || []),
            ...(character.race?.traits || []).flatMap((trait: any) => trait.effects || []),
            ...(character.subrace?.traits || []).flatMap((trait: any) => trait.effects || []),
        ];
        const effect = effects.find((entry: any) =>
            entry.type === 'spell_access'
            && entry.spell
            && (String(entry.spell).toLowerCase() === String(spell.index).toLowerCase()
                || String(entry.spell).toLowerCase() === String(spell.name).toLowerCase())
        );
        return effect ? {
            freeCasts: Number(effect.free_casts || 0),
            freeCastReset: effect.free_cast_reset || effect.reset || 'long',
            grantedBy: effect.name || 'Feature',
        } : null;
    };
    const freeCastTotal = (spell: SpellDetail) => {
        const stored = Number((spell as any).freeCasts || (spell as any).free_casts || 0);
        return stored || Number(grantMetaFor(spell)?.freeCasts || 0);
    };
    const freeCastRemaining = (spell: SpellDetail) => Math.max(0, freeCastTotal(spell) - Number(character.freeCastUsage?.[spell.index] || 0));
    const hasGrantBadge = (spell: SpellDetail) => Boolean(
        (spell as any).isGranted
        || (spell as any).is_granted
        || spell.grantedBy
        || freeCastTotal(spell) > 0
        || grantMetaFor(spell)
    );
    const spellModifierFor = (spell: SpellDetail) => spell.spellcastingAbility
        ? calculateModifier(effectiveAbilities[spell.spellcastingAbility])
        : spellMod;
    const resolveSpellDamage = (formula: string, spell: SpellDetail) => {
        const damageType = String(spell.damage?.damage_type?.name || '').toLowerCase();
        const minimum = character.classFeatures
            .flatMap((feature: any) => feature.effects || [])
            .filter((effect: any) => effect.type === 'damage_die_min' && String(effect.damage_type || '').toLowerCase() === damageType)
            .reduce((max: number, effect: any) => Math.max(max, Number(effect.value || 0)), 0);
        const resolved = resolveDamageFormula(
            formula,
            spellModifierFor(spell),
            Number(character.classes?.[0]?.definition?.hit_die || 8),
        );
        return minimum > 1 ? appendMinDie(resolved, minimum) : resolved;
    };
    const applyTargetDamage = (amount: number, damageType: string) => {
        const target = character.combatTarget;
        if (!target || target.hp === undefined) return;
        const type = String(damageType || '').toLowerCase();
        const effects = [
            ...(character.classFeatures || []).flatMap((feature: any) => feature.effects || []),
            ...(character.feats || []).flatMap((feat: any) => feat.effects || []),
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
    const castSpell = (spell: SpellDetail) => {
        const remaining = freeCastRemaining(spell);
        if (remaining > 0) {
            setCharacter(prev => ({
                ...prev,
                freeCastUsage: { ...(prev.freeCastUsage || {}), [spell.index]: Number(prev.freeCastUsage?.[spell.index] || 0) + 1 },
                activeConcentration: spell.concentration ? spell : prev.activeConcentration,
            }));
        } else if (spell.level > 0) {
            const slots = character.spellSlots[spell.level];
            if (!slots || Number(slots.current) <= 0) { alert('No spell slots!'); return; }
            setCharacter(prev => ({
                ...prev,
                spellSlots: { ...prev.spellSlots, [spell.level]: { ...slots, current: Math.max(0, Number(slots.current) - 1) } },
                activeConcentration: spell.concentration ? spell : prev.activeConcentration,
            }));
        } else if (spell.concentration) {
            setCharacter(prev => ({ ...prev, activeConcentration: spell }));
        }
        const descText = spell.desc?.join(' ').toLowerCase() || '';
        if (descText.includes('spell attack')) roll(`1d20${spellAttackFor(spell)}`, `Attack: ${spell.name}`);
        if (spell.name.toLowerCase() === 'polymorph' && onPolymorphCast) onPolymorphCast();
    };
    const [spellSearch, setSpellSearch] = useState('');
    const [ritualOnly, setRitualOnly] = useState(false);
    const [concentrationOnly, setConcentrationOnly] = useState(false);

    const getDcType = (spell: SpellDetail) => spell.dc?.dc_type?.name?.substring(0, 3).toUpperCase() || null;

    const availableLevels = Array.from(new Set([
        ...character.spells.map(s => s.level),
        ...Object.entries(character.spellSlots)
            .filter(([_, slots]) => (slots as any).max > 0)
            .map(([lvl]) => parseInt(lvl))
    ]));
    const maxLevel = availableLevels.length > 0 ? Math.max(...availableLevels) : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${WIDGET_BG} p-4 rounded-xl border border-[#3e4149]/50 shadow-sm`}>
                <div className="flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Modifier</span>
                    <span className="text-2xl font-bold text-dnd-gold">{formatModifier(spellMod)}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Spell Attack</span>
                    <span className="text-2xl font-bold text-white">{spellAttackStr}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Save DC</span>
                    <span className="text-2xl font-bold text-white">{spellSave}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level</span>
                    <span className="text-2xl font-bold text-gray-400">{character.level}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 w-full md:w-auto">
                        <button
                            onClick={() => setSpellFilter('all')}
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${spellFilter === 'all' ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600'}`}
                        >
                            All
                        </button>
                        {[0,1,2,3,4,5,6,7,8,9].filter(l => l <= maxLevel).map(l => (
                            <button
                                key={l}
                                onClick={() => setSpellFilter(l)}
                                className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${spellFilter === l ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600'}`}
                            >
                                {l === 0 ? 'C' : l}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <button
                            onClick={() => setConcentrationOnly(!concentrationOnly)}
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded border transition-colors ${concentrationOnly ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/40 text-gray-500 border-gray-700'}`}
                        >
                            Concentration
                        </button>
                        <button
                            onClick={() => setRitualOnly(!ritualOnly)}
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded border transition-colors ${ritualOnly ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-black/40 text-gray-500 border-gray-700'}`}
                        >
                            Ritual
                        </button>
                        <input
                            type="text"
                            placeholder="Search spells..."
                            value={spellSearch}
                            onChange={(e) => setSpellSearch(e.target.value)}
                            className="text-[9px] font-bold uppercase px-3 py-1 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-48 placeholder:text-gray-600"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setShowSpellManager(true)}
                    className="text-[10px] text-dnd-red font-bold uppercase border border-dnd-red bg-black/40 px-4 py-1.5 rounded hover:bg-dnd-red hover:text-white transition-colors whitespace-nowrap relative"
                >
                    Manage Spells
                    {hasPendingSpells && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-dnd-red rounded-full border-2 border-[#1b1c20] animate-pulse" />
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {[0,1,2,3,4,5,6,7,8,9].map(lvl => {
                    if (spellFilter !== 'all' && spellFilter !== lvl) return null;
                    const spells = character.spells.filter(s => {
                        if (s.level !== lvl) return false;
                        if (!s.name.toLowerCase().includes(spellSearch.toLowerCase())) return false;
                        if (ritualOnly && !s.ritual) return false;
                        if (concentrationOnly && !s.concentration) return false;
                        return true;
                    }).sort((a,b) => a.name.localeCompare(b.name));
                    const slots = (character.spellSlots as Record<number, {max: number, current: number}>)[lvl];
                    if (spells.length === 0 && (!slots || Number(slots.max) === 0)) return null;
                    return (
                        <div key={lvl} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm`}>
                            <div className="bg-[#121316]/80 px-6 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3e4149]/30">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{lvl === 0 ? 'Cantrips' : `Level ${lvl} Spells`}</h4>
                                <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1">
                                    {slots && Number(slots.max) > 0 && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Slots</span>
                                            <div className="flex gap-1.5">
                                                {Array.from({length: Number(slots.max)}).map((_, i) => {
                                                    const isSpent = i < (Number(slots.max) - Number(slots.current));
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                const newCurrent = isSpent ? Number(slots.current) + 1 : Number(slots.current) - 1;
                                                                setCharacter(prev => ({ ...prev, spellSlots: { ...prev.spellSlots, [lvl]: { ...slots, current: newCurrent } } }));
                                                            }}
                                                            className={`w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all ${isSpent ? 'bg-dnd-red border-dnd-red' : 'bg-transparent border-gray-600 hover:border-gray-400'}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-gray-500 uppercase border-l border-gray-700/50 pl-4 py-2 shrink-0">{spells.length} known / prepared</span>
                                </div>
                            </div>
                            <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                                <div className={`grid gap-2 px-6 py-2 bg-[#121316]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider grid-cols-[1fr_60px_80px_60px] md:grid-cols-[1fr_80px_120px_80px] min-w-[500px]`}>
                                    <div>Spell</div><div className="text-center">DC</div><div className="text-center">Damage</div><div className="text-center">Cast</div>
                                </div>
                                <div className="divide-y divide-[#2e3036]/60 min-w-[500px]">
                                    {spells.map(spell => {
                                        const dmg = resolveSpellDamage(getSpellDamageString(spell, character.level, spell.level === 0 ? character.level : Math.max(spell.level, 1)), spell);
                                    const secondaryDmg = resolveSpellDamage(getSpellSecondaryDamageString(spell, character.level, spell.level === 0 ? character.level : Math.max(spell.level, 1)), spell);
                                        const dcType = getDcType(spell);
                                        return (
                                            <div key={spell.index} onClick={() => setSelectedDetail(spell)} className={`grid gap-2 items-center px-6 py-4 hover:bg-[#2e3036]/50 cursor-pointer group transition-colors grid-cols-[1fr_60px_80px_60px] md:grid-cols-[1fr_80px_120px_80px]`}>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-200 text-sm group-hover:text-white truncate flex items-center gap-1.5">
                                                        {spell.name}
                                                        {spell.name === 'Eldritch Blast' && (
                                                            <span className="text-[10px] text-dnd-gold font-black ml-1">
                                                                x{character.level >= 17 ? 4 : character.level >= 11 ? 3 : character.level >= 5 ? 2 : 1}
                                                            </span>
                                                        )}
                                                        <div className="flex gap-1">
                                                            {spell.concentration && (<span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded">C</span>)}
                                                            {spell.ritual && (<span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded">R</span>)}
                                                            {hasGrantBadge(spell) && (<span className="text-[8px] bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/40 px-1 rounded" title={spell.grantedBy}>Granted</span>)}
                                                            {freeCastTotal(spell) > 0 ? (<span className="text-[8px] bg-purple-900/40 text-purple-300 border border-purple-800/60 px-1 rounded">{freeCastRemaining(spell)}/{freeCastTotal(spell)} {(spell.freeCastReset || 'long') === 'short' ? 'SR' : 'LR'}</span>) : null}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 truncate">{spell.casting_time} • {spell.range} • {spell.duration}</div>
                                                </div>
                                                <div className="text-center">
                                                    {dcType ? (
                                                        <div className="flex flex-col items-center leading-none">
                                                            <span className="text-[10px] font-bold text-gray-500 mb-0.5">{dcType}</span>
                                                            <span className="text-sm font-bold text-white">{spellSaveFor(spell)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600 text-[10px]">-</span>
                                                    )}
                                                </div>
                                                <div className="text-center flex justify-center">
                                                    {dmg ? (
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <button onClick={(e) => { e.stopPropagation(); roll(dmg, `Damage ${spell.name}`, undefined, (result) => applyTargetDamage(result.total, String(spell.damage?.damage_type?.name || ''))); }} className="text-xs font-bold text-white bg-black/40 hover:bg-gray-700 border border-gray-600/50 rounded px-2 py-1 transition-colors truncate max-w-full">{dmg}</button>
                                                            {secondaryDmg && <button onClick={(e) => { e.stopPropagation(); roll(secondaryDmg, `Secondary Damage ${spell.name}`, undefined, (result) => applyTargetDamage(result.total, String(spell.damage?.damage_type?.name || ''))); }} className="text-[9px] font-bold text-dnd-gold bg-dnd-gold/10 hover:bg-dnd-gold/20 border border-dnd-gold/30 rounded px-2 py-0.5 transition-colors">{secondaryDmg}</button>}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600 text-[10px]">-</span>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); castSpell(spell); }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (spell.desc?.join(' ').toLowerCase().includes('spell attack')) triggerRollMenu(e, `1d20${spellAttackFor(spell)}`, `Attack: ${spell.name}`);
                                                        }}
                                                        className="text-[10px] font-bold uppercase bg-black/40 border border-gray-600/50 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full"
                                                    >
                                                        Cast
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Mobile: tappable spell rows (tap row for details) */}
                            <div className="lg:hidden divide-y divide-[#2e3036]/60">
                                {spells.map(spell => {
                                    const dmg = resolveSpellDamage(getSpellDamageString(spell, character.level, spell.level === 0 ? character.level : Math.max(spell.level, 1)), spell);
                                    const secondaryDmg = resolveSpellDamage(getSpellSecondaryDamageString(spell, character.level, spell.level === 0 ? character.level : Math.max(spell.level, 1)), spell);
                                    const dcType = getDcType(spell);
                                    const ebCount = spell.name === 'Eldritch Blast' ? (character.level >= 17 ? 4 : character.level >= 11 ? 3 : character.level >= 5 ? 2 : 1) : 0;
                                    return (
                                        <div key={spell.index} onClick={() => setSelectedDetail(spell)} className="flex items-center gap-3 px-4 py-3 active:bg-[#2e3036]/60 transition-colors cursor-pointer">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-gray-200 truncate flex items-center gap-1.5">
                                                    {spell.name}
                                                    {ebCount > 0 && <span className="text-[10px] text-dnd-gold font-black">x{ebCount}</span>}
                                                    {spell.concentration && <span className="text-[8px] bg-blue-900/40 text-blue-400 border border-blue-800/60 px-1 rounded">C</span>}
                                                    {spell.ritual && <span className="text-[8px] bg-yellow-900/40 text-yellow-500 border border-yellow-800/60 px-1 rounded">R</span>}
                                                    {hasGrantBadge(spell) && <span className="text-[8px] bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/40 px-1 rounded" title={spell.grantedBy}>Granted</span>}
                                                    {freeCastTotal(spell) > 0 ? <span className="text-[8px] bg-purple-900/40 text-purple-300 border border-purple-800/60 px-1 rounded">{freeCastRemaining(spell)}/{freeCastTotal(spell)} {(spell.freeCastReset || 'long') === 'short' ? 'SR' : 'LR'}</span> : null}
                                                </div>
                                                <div className="text-[10px] text-gray-500 truncate">{spell.casting_time} • {spell.range} • {spell.duration}</div>
                                                {dmg && (
                                                    <div className="text-[10px] text-gray-400 truncate">Dmg: <span className="text-white font-bold">{dmg}</span>{dcType ? ` • ${dcType} ${spellSaveFor(spell)}` : ''}</div>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); castSpell(spell); }}
                                                className="text-[10px] font-bold uppercase bg-dnd-gold/15 border border-dnd-gold/40 text-dnd-gold active:bg-dnd-gold active:text-black px-4 py-2 rounded-lg transition-colors shrink-0"
                                            >
                                                Cast
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpellsTab;
