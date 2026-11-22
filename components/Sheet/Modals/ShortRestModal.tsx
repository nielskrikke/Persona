
import React, { useEffect, useState } from 'react';
import { CharacterState, RollResult } from '@/types';
import { calculateModifier, formatModifier, getEffectiveAbilities } from '@/utils/rules';
import { getCasterProfileFor } from '../../../utils/rules';
import { rollDice } from '../../../utils/dice';
import { fetchAllSpells } from '../../../data/index';

const ShortRestModal = ({ 
    isOpen, 
    onClose, 
    character, 
    onUpdate,
    onRoll
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    character: CharacterState, 
    onUpdate: (updates: Partial<CharacterState>) => void,
    onRoll?: (formula: string, label: string, preResult?: any, onComplete?: (result: RollResult) => void) => void
}) => {
    const [rollingSize, setRollingSize] = useState<string | null>(null);
    const [restorationAmount, setRestorationAmount] = useState(0);
    const [arcaneRecovery, setArcaneRecovery] = useState<Record<number, number>>({});
    const [spellCatalog, setSpellCatalog] = useState<any[]>([]);
    const [memorizeOut, setMemorizeOut] = useState('');
    const [memorizeIn, setMemorizeIn] = useState('');
    const arcaneFeature = character.featureUsage['Arcane Recovery'];
    const wizardClass = character.classes.find((cls: any) => cls.definition?.index === 'wizard');
    const arcaneMaxTotal = wizardClass ? Math.max(1, Math.ceil(Number(wizardClass.level) / 2)) : 0;
    const arcaneUsedTotal = Object.entries(arcaneRecovery).reduce((sum, [level, count]) => sum + Number(level) * Number(count || 0), 0);
    const arcaneAvailable = Boolean(arcaneFeature && Number(arcaneFeature.current) > 0 && wizardClass);
    const hasMemorizeSpell = Boolean(wizardClass && Number(wizardClass.level) >= 5 && (character.classFeatures || []).some((feature: any) => /memorize spell/i.test(feature.name || '')));
    const preparedWizardSpells = (character.spells || []).filter((spell: any) => Number(spell.level) > 0 && String(spell.sourceClassIndex || '').toLowerCase() === 'wizard');
    const bookKeys = new Set((character.spellbook || []).map((entry: any) => String(entry).toLowerCase()));
    const bookSpells = spellCatalog.filter((spell: any) => Number(spell.level) > 0
        && (bookKeys.has(String(spell.index).toLowerCase()) || bookKeys.has(String(spell.name).toLowerCase()))
        && !preparedWizardSpells.some((known: any) => known.index === spell.index));
    const restorationFeature = character.featureUsage['Sorcerous Restoration'];
    const sorceryPoints = character.featureUsage['Sorcery Points'];
    const restorationAvailable = Boolean(restorationFeature && restorationFeature.current > 0 && sorceryPoints);
    const maxRestoration = restorationAvailable ? Math.min(7, Math.max(0, Number(sorceryPoints.max || 0) - Number(sorceryPoints.current || 0))) : 0;

    useEffect(() => {
        if (!isOpen) return;
        setRestorationAmount(0);
        setArcaneRecovery({});
        setMemorizeOut('');
        setMemorizeIn('');
        if (hasMemorizeSpell && spellCatalog.length === 0) {
            fetchAllSpells().then(setSpellCatalog).catch(() => {});
        }
    }, [isOpen, hasMemorizeSpell]);

    if (!isOpen) return null;

    // Group available hit dice
    const conMod = calculateModifier(getEffectiveAbilities(character).con);
    const dieGroups: Record<string, { max: number, spent: number }> = {};
    character.classes.forEach(c => {
        const size = String(c.definition.hit_die);
        if (!dieGroups[size]) dieGroups[size] = { max: 0, spent: 0 };
        dieGroups[size].max += c.level;
        dieGroups[size].spent = character.hitDiceUsage[size] || 0;
    });

    const handleSpend = (size: string) => {
        if ((dieGroups[size].max - dieGroups[size].spent) <= 0 || rollingSize !== null) return;

        setRollingSize(size);
        const formula = `1d${size}${formatModifier(conMod)}`;
        const label = `Hit Die (d${size})`;

        const processResult = (rollRes: RollResult) => {
            const healing = Math.max(0, rollRes.total);
            onUpdate({
                currentHp: Math.min(character.maxHp, character.currentHp + healing),
                hitDiceUsage: {
                    ...character.hitDiceUsage,
                    [size]: (character.hitDiceUsage[size] || 0) + 1
                }
            });
            setRollingSize(null);
        };

        if (onRoll) {
            onRoll(formula, label, undefined, processResult);
        } else {
            const result = rollDice(formula, label);
            processResult(result);
        }
    };

    const handleFinish = () => {
        const newFeatures = {...character.featureUsage};
        Object.keys(newFeatures).forEach(key => {
            const resetRule = (newFeatures[key] as any).reset || 'long';
            if (resetRule === 'short') {
                if (/channel divinity|second wind/i.test(key)) {
                    const current = Number(newFeatures[key].current ?? newFeatures[key].max);
                    newFeatures[key].current = Math.min(newFeatures[key].max, current + 1);
                } else {
                    newFeatures[key].current = newFeatures[key].max;
                }
            }
        });

        // Pact Magic slots reset on a short rest. The current slot model merges
        // pact slots with other slots, so only reset them when every caster in
        // the character is a pact caster; otherwise leave them alone rather
        // than giving a multiclass wizard all of its slots back.
        let newSlots = {...character.spellSlots};
        const casterProfiles = character.classes
            .map(c => getCasterProfileFor(c))
            .filter((profile): profile is NonNullable<typeof profile> => !!profile && profile.type !== 'none');
        const hasPact = casterProfiles.some(profile => profile.type === 'pact')
            || character.classes.some(c => (c.subclass as any)?.caster?.type === 'custom' && Array.isArray((c.subclass as any)?.spellcasting_table));
        const hasNonPactCaster = casterProfiles.some(profile => profile.type !== 'pact');
        if (hasPact && !hasNonPactCaster) {
            Object.keys(newSlots).forEach(lvl => {
                const l = parseInt(lvl);
                newSlots[l].current = newSlots[l].max;
            });
        }
        // Crimson Rite ends on a short rest.
        const restState = { activeCards: [], foolStacks: 0, emergencyReserve: (character.emergencyReserve || []).map((entry: any) => ({ ...entry, used: false })), ...(character.activeRite ? { activeRite: null, classFeatures: (character.classFeatures || []).filter((feature: any) => feature.name !== 'Rite of the Dawn (Active)') } : {}) };

        const shortRestSpells = new Set(
            character.spells
                .filter(spell => spell.freeCasts && (spell.freeCastReset || 'long') === 'short')
                .map(spell => spell.index)
        );
        let newSpells = [...character.spells];
        if (hasMemorizeSpell && memorizeOut && memorizeIn) {
            const replacement = spellCatalog.find((spell: any) => spell.index === memorizeIn);
            if (replacement) {
                newSpells = newSpells.filter((spell: any) => !(spell.index === memorizeOut && String(spell.sourceClassIndex || '').toLowerCase() === 'wizard'));
                if (!newSpells.some((spell: any) => spell.index === replacement.index)) {
                    newSpells.push({ ...replacement, sourceClassIndex: 'wizard', isPrepared: true });
                }
            }
        }
        const artificerLevel = Number((character.classes || []).find((cls: any) => cls.definition?.index === 'artificer')?.level || 0);
        if (artificerLevel >= 14 && newFeatures['Flash of Genius']) {
            newFeatures['Flash of Genius'] = {
                ...newFeatures['Flash of Genius'],
                current: Math.min(Number(newFeatures['Flash of Genius'].max || 0), Number(newFeatures['Flash of Genius'].current || 0) + 1),
            };
        }
        const newFreeCastUsage = { ...(character.freeCastUsage || {}) };
        Object.keys(newFreeCastUsage).forEach(index => {
            if (shortRestSpells.has(index)) delete newFreeCastUsage[index];
        });

        if (arcaneAvailable && arcaneUsedTotal > 0) {
            const slots = { ...newSlots };
            Object.entries(arcaneRecovery).forEach(([level, count]) => {
                const slotLevel = Number(level);
                if (!slots[slotLevel] || Number(count) <= 0) return;
                slots[slotLevel] = { ...slots[slotLevel], current: Math.min(Number(slots[slotLevel].max || 0), Number(slots[slotLevel].current || 0) + Number(count)) };
            });
            newSlots = slots;
            newFeatures['Arcane Recovery'] = { ...newFeatures['Arcane Recovery'], current: 0 };
        }

        if (restorationAvailable && restorationAmount > 0) {
            newFeatures['Sorcery Points'] = {
                ...newFeatures['Sorcery Points'],
                current: Math.min(Number(newFeatures['Sorcery Points'].max || 0), Number(newFeatures['Sorcery Points'].current || 0) + restorationAmount),
            };
            newFeatures['Sorcerous Restoration'] = { ...newFeatures['Sorcerous Restoration'], current: 0 };
        }

        onUpdate({ featureUsage: newFeatures, spellSlots: newSlots, freeCastUsage: newFreeCastUsage, spells: newSpells, ...restState });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4">
            <div className="bg-[#1b1c20] border border-dnd-gold rounded-lg w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto overscroll-contain">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
                <h2 className="text-3xl font-serif text-dnd-gold mb-2 text-center">Short Rest</h2>
                <p className="text-gray-400 text-sm mb-6 text-center italic">Take an hour to bind your wounds and gather your strength.</p>

                <div className="bg-black/40 rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-700">
                    <div>
                        <div className="text-[10px] uppercase text-gray-500 font-bold">Health</div>
                        <div className="text-2xl font-bold text-white">{character.currentHp} / {character.maxHp}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase text-gray-500 font-bold">CON Modifier</div>
                        <div className="text-2xl font-bold text-dnd-gold">{formatModifier(conMod)}</div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">Spend Hit Dice</h3>
                    {Object.entries(dieGroups).map(([size, usage]) => (
                        <div key={size} className="flex justify-between items-center bg-gray-800/40 p-3 rounded border border-gray-700">
                            <div>
                                <span className="text-white font-bold">d{size}</span>
                                <span className="ml-3 text-xs text-gray-500">{usage.max - usage.spent} remaining</span>
                            </div>
                            <button 
                                onClick={() => handleSpend(size)}
                                disabled={usage.max - usage.spent <= 0 || character.currentHp >= character.maxHp || rollingSize !== null}
                                className="px-4 py-2 bg-emerald-900/40 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 rounded text-xs font-bold uppercase disabled:opacity-30 disabled:hover:bg-emerald-900/40 transition-colors"
                            >
                                {rollingSize === size ? 'Rolling 3D...' : 'Roll & Heal'}
                            </button>
                        </div>
                    ))}
                </div>

                {arcaneAvailable && (
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                                <h3 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Arcane Recovery</h3>
                                <p className="text-[10px] text-gray-500 mt-1">Recover up to {arcaneMaxTotal} slot levels, none above 5th. Once per Long Rest.</p>
                            </div>
                            <span className="text-[10px] text-gray-500">{arcaneUsedTotal} / {arcaneMaxTotal}</span>
                        </div>
                        <div className="space-y-1.5">
                            {[1,2,3,4,5].map(level => {
                                const slot = character.spellSlots?.[level];
                                if (!slot || Number(slot.max) <= 0 || Number(slot.current) >= Number(slot.max)) return null;
                                const count = Number(arcaneRecovery[level] || 0);
                                const canAdd = arcaneUsedTotal + level <= arcaneMaxTotal;
                                return (
                                    <div key={level} className="flex items-center justify-between text-[10px] text-gray-400">
                                        <span>Level {level} slots ({slot.current}/{slot.max})</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => setArcaneRecovery(prev => ({ ...prev, [level]: Math.max(0, Number(prev[level] || 0) - 1) }))} className="w-5 h-5 rounded border border-gray-700 bg-black/30 text-gray-400">−</button>
                                            <span className="w-4 text-center text-white">{count}</span>
                                            <button type="button" disabled={!canAdd} onClick={() => setArcaneRecovery(prev => ({ ...prev, [level]: Number(prev[level] || 0) + 1 }))} className="w-5 h-5 rounded border border-gray-700 bg-black/30 text-gray-400 disabled:opacity-30">+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {restorationAvailable && (
                    <div className="bg-purple-950/20 border border-purple-900/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                                <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Sorcerous Restoration</h3>
                                <p className="text-[10px] text-gray-500 mt-1">Regain up to 7 Sorcery Points. Once per Long Rest.</p>
                            </div>
                            <span className="text-[10px] text-gray-500">{sorceryPoints?.current} / {sorceryPoints?.max}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="range" min={0} max={maxRestoration} value={restorationAmount} onChange={e => setRestorationAmount(Number(e.target.value))} className="flex-grow accent-purple-500" />
                            <input type="number" min={0} max={maxRestoration} value={restorationAmount} onChange={e => setRestorationAmount(Math.max(0, Math.min(maxRestoration, Number(e.target.value) || 0)))} className="w-16 bg-black/40 border border-purple-900/50 rounded p-2 text-center text-sm text-white outline-none" />
                        </div>
                    </div>
                )}
                {hasMemorizeSpell && bookSpells.length > 0 && preparedWizardSpells.length > 0 && (
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-4 mb-6">
                        <h3 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Memorize Spell</h3>
                        <p className="text-[10px] text-gray-500 mb-3">Replace one prepared Wizard spell with a spell from your spellbook.</p>
                        <div className="space-y-2">
                            <select value={memorizeOut} onChange={e => setMemorizeOut(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-xs text-white">
                                <option value="">Replace prepared spell…</option>
                                {preparedWizardSpells.map((spell: any) => <option key={spell.index} value={spell.index}>{spell.name}</option>)}
                            </select>
                            <select value={memorizeIn} onChange={e => setMemorizeIn(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-xs text-white">
                                <option value="">With spellbook spell…</option>
                                {bookSpells.map((spell: any) => <option key={spell.index} value={spell.index}>{spell.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <button onClick={handleFinish} className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors">
                    Finish Rest
                </button>
            </div>
        </div>
    );
};

export default ShortRestModal;
