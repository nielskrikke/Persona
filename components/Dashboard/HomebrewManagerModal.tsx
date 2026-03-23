import React, { useState, useEffect, useRef } from 'react';
import { saveHomebrew, loadHomebrew, deleteHomebrew } from '../../services/supabase';
import { ABILITY_NAMES, ABILITY_LABELS, APIReference, SpellDetail, EquipmentDetail, CreatureDetail } from '../../types';
import { SKILL_LIST } from '../../utils/rules';
import { SPELL_SCHOOLS } from '../../data/constants';
import { X, Search, Filter, Sparkles, Save, Coins, Link, Trash2, Info, ChevronUp, Plus, PawPrint } from 'lucide-react';

interface HomebrewManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any;
    initialTab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat';
    initialData?: any;
}

// Sub-component for adding "Mechanics" to any feature or trait
const EffectEditor = ({ effects, onChange }: { effects: any[], onChange: (newEffects: any[]) => void }) => {
    const addEffect = () => onChange([...effects, { type: 'feature', name: '', description: '' }]);
    const removeEffect = (i: number) => onChange(effects.filter((_, idx) => idx !== i));
    const updateEffect = (i: number, updates: any) => onChange(effects.map((e, idx) => idx === i ? { ...e, ...updates } : e));

    return (
        <div className="space-y-3 bg-black/40 p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mechanical Effects</span>
                <button type="button" onClick={addEffect} className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">+ Add Logic</button>
            </div>
            {effects.map((eff, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start border-b border-gray-800 pb-3 last:border-0">
                    <select 
                        value={eff.type} 
                        onChange={e => updateEffect(i, { type: e.target.value })}
                        className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white"
                    >
                        <option value="feature">General Feature</option>
                        <option value="stat_bonus">Stat Bonus (Flat)</option>
                        <option value="resistance">Resistance</option>
                        <option value="immunity">Immunity</option>
                        <option value="bonus_action">Bonus Action</option>
                        <option value="reaction">Reaction</option>
                        <option value="proficiency">Proficiency</option>
                    </select>

                    {eff.type === 'stat_bonus' && (
                        <>
                            <select value={eff.stat} onChange={e => updateEffect(i, { stat: e.target.value })} className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white">
                                <option value="ac">AC</option>
                                <option value="speed">Speed</option>
                                <option value="hp_per_level">HP per Lvl</option>
                                <option value="initiative">Initiative</option>
                                <option value="str">Strength</option>
                                <option value="dex">Dexterity</option>
                                <option value="con">Constitution</option>
                                <option value="int">Intelligence</option>
                                <option value="wis">Wisdom</option>
                                <option value="cha">Charisma</option>
                            </select>
                            <input type="number" placeholder="Value" value={eff.value} onChange={e => updateEffect(i, { value: parseInt(e.target.value) })} className="bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                        </>
                    )}

                    {eff.type === 'resistance' && (
                        <input type="text" placeholder="Type (e.g. Fire)" value={eff.value} onChange={e => updateEffect(i, { value: e.target.value })} className="col-span-2 bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                    )}

                    {eff.type !== 'stat_bonus' && eff.type !== 'resistance' && (
                        <input type="text" placeholder="Detail" value={eff.name} onChange={e => updateEffect(i, { name: e.target.value })} className="col-span-2 bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-[10px] text-white" />
                    )}

                    <button type="button" onClick={() => removeEffect(i)} className="text-red-500 text-xs hover:text-red-400 mt-1">Remove Effect</button>
                </div>
            ))}
        </div>
    );
};

const HomebrewManagerModal: React.FC<HomebrewManagerModalProps> = ({ isOpen, onClose, currentUser, initialTab, initialData }) => {
    const [activeTab, setActiveTab] = useState<'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat'>(initialTab || 'race');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [list, setList] = useState<any[]>([]);
    const [isSharedGlobally, setIsSharedGlobally] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Track the last opened state to handle initialTab correctly without glitching
    const prevOpenRef = useRef(false);

    // --- FORM STATES ---
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Race Forge
    const [speeds, setSpeeds] = useState({ walk: 30, fly: 0, swim: 0, climb: 0 });
    const [size, setSize] = useState('Medium');
    const [abilityBonuses, setAbilityBonuses] = useState<{ stat: string, bonus: number }[]>([]);
    const [traits, setTraits] = useState<{ name: string, desc: string, effects: any[] }[]>([]);

    // Class Forge
    const [hitDie, setHitDie] = useState(8);
    const [saves, setSaves] = useState<string[]>([]);
    const [casterType, setCasterType] = useState<'none' | 'full' | 'half' | 'third' | 'pact'>('none');
    const [casterAbility, setCasterAbility] = useState('int');
    const [levelFeatures, setLevelFeatures] = useState<{ level: number, name: string, desc: string, effects: any[] }[]>([]);
    const [armorProfs, setArmorProfs] = useState<string[]>([]);
    const [weaponProfs, setWeaponProfs] = useState<string[]>([]);

    // Subclass Forge
    const [parentClass, setParentClass] = useState('fighter');

    // Item Forge
    const [itemCategory, setItemCategory] = useState('Other');
    const [itemSubtype, setItemSubtype] = useState('');
    const [itemIsWondrous, setItemIsWondrous] = useState(false);
    const [itemRarity, setItemRarity] = useState('Common');
    const [itemWeight, setItemWeight] = useState(0);
    const [itemCost, setItemCost] = useState('0 gp');
    const [itemAttunement, setItemAttunement] = useState(false);
    const [itemDmgDice, setItemDmgDice] = useState('');
    const [itemDmgType, setItemDmgType] = useState('Piercing');
    const [itemWeaponType, setItemWeaponType] = useState('Simple');
    const [itemArmorType, setItemArmorType] = useState('Light');
    const [itemAcBase, setItemAcBase] = useState(0);
    const [itemAcDexBonus, setItemAcDexBonus] = useState(false);
    const [itemAcMaxBonus, setItemAcMaxBonus] = useState<number | null>(null);
    const [itemIsThrown, setItemIsThrown] = useState(false);
    const [itemThrownRange, setItemThrownRange] = useState('');
    const [itemThrownDamage, setItemThrownDamage] = useState('');
    const [itemProperties, setItemProperties] = useState<string[]>([]);
    const [itemModifiers, setItemModifiers] = useState<any[]>([]);

    // Spell Forge
    const [spellLevel, setSpellLevel] = useState(0);
    const [spellSchool, setSpellSchool] = useState('Evocation');
    const [spellCastTime, setSpellCastTime] = useState('1 Action');
    const [spellRange, setSpellRange] = useState('60 feet');
    const [spellDuration, setSpellDuration] = useState('Instantaneous');
    const [spellRitual, setSpellRitual] = useState(false);
    const [spellConcentration, setSpellConcentration] = useState(false);
    const [spellComponents, setSpellComponents] = useState<string[]>(['V', 'S']);
    const [spellMaterial, setSpellMaterial] = useState('');
    const [spellHigherLevel, setSpellHigherLevel] = useState('');
    const [spellHasAttack, setSpellHasAttack] = useState(false);
    const [spellAttackType, setSpellAttackType] = useState('Ranged');
    const [spellHasSave, setSpellHasSave] = useState(false);
    const [spellSaveType, setSpellSaveType] = useState('DEX');
    const [spellDmgFormula, setSpellDmgFormula] = useState('');
    const [spellDmgType, setSpellDmgType] = useState('Force');
    const [spellClasses, setSpellClasses] = useState<string[]>([]);

    // Creature Forge
    const [creatureSize, setCreatureSize] = useState('Medium');
    const [creatureType, setCreatureType] = useState('Creature');
    const [creatureAc, setCreatureAc] = useState(10);
    const [creatureHp, setCreatureHp] = useState(10);
    const [creatureSpeed, setCreatureSpeed] = useState('30 ft.');
    const [creatureAbilities, setCreatureAbilities] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    const [creatureSenses, setCreatureSenses] = useState('');
    const [creatureLanguages, setCreatureLanguages] = useState('');
    const [creatureCr, setCreatureCr] = useState(0);
    const [creatureActions, setCreatureActions] = useState<{ name: string, desc: string, attack_bonus?: number, damage_dice?: string, damage_type?: string }[]>([]);

    // Background Forge
    const [bgSkills, setBgSkills] = useState<string[]>([]);
    const [bgTools, setBgTools] = useState<string[]>([]);
    const [bgFeatureName, setBgFeatureName] = useState('');
    const [bgEquipment, setBgEquipment] = useState('');

    // Feat fields
    const [featPrerequisite, setFeatPrerequisite] = useState('');
    const [featEffects, setFeatEffects] = useState<any[]>([]);

    useEffect(() => { 
        if (isOpen) {
            if (!prevOpenRef.current) {
                // Just opened
                if (initialTab) {
                    setActiveTab(initialTab);
                    setShowForm(true);
                }
            }
            fetchList();
        } 
        prevOpenRef.current = isOpen;
    }, [isOpen, activeTab]); // Removed initialTab from dependencies to prevent glitching back when switching tabs

    // Handle initialData pre-filling
    useEffect(() => {
        if (isOpen && initialData) {
            setShowForm(true);
            if (initialTab === 'item') {
                setName(initialData.name);
                setDescription(initialData.desc?.join('\n') || '');
                setItemCategory(initialData.equipment_category?.name || 'Other');
                setItemRarity(initialData.rarity || 'Common');
                setItemWeight(initialData.weight?.toString() || '0');
                setItemCost(initialData.cost ? `${initialData.cost.quantity} ${initialData.cost.unit}` : '0 gp');
                setItemAttunement(!!initialData.requires_attunement);
                setItemIsWondrous(!!initialData.is_wondrous);
                setItemProperties(initialData.properties?.map((p: any) => typeof p === 'string' ? p : p.name).join(', ') || '');
                setItemModifiers(initialData.modifiers || []);
                
                if (initialData.damage) {
                    setItemDmgDice(initialData.damage.damage_dice || '');
                    setItemDmgType(typeof initialData.damage.damage_type === 'string' ? initialData.damage.damage_type : initialData.damage.damage_type?.name || 'Piercing');
                }
                
                if (initialData.armor_class) {
                    setItemAcBase(initialData.armor_class.base?.toString() || '');
                    setItemAcDexBonus(!!initialData.armor_class.dex_bonus);
                    setItemAcMaxBonus(initialData.armor_class.max_bonus || null);
                }
            } else if (initialTab === 'spell') {
                setName(initialData.name);
                setDescription(initialData.desc?.join('\n') || '');
                setSpellLevel(initialData.level || 0);
                setSpellSchool(initialData.school?.name || 'Abjuration');
                setSpellCastTime(initialData.casting_time || '1 Action');
                setSpellRange(initialData.range || 'Self');
                setSpellDuration(initialData.duration || 'Instantaneous');
                setSpellComponents(initialData.components || ['V']);
                setSpellMaterial(initialData.material || '');
                setSpellRitual(!!initialData.ritual);
                setSpellConcentration(!!initialData.concentration);
                setSpellHigherLevel(initialData.higher_level?.join('\n') || '');
                setSpellClasses(initialData.classes?.map((c: any) => c.name) || []);
            }
        }
    }, [isOpen, initialData, initialTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const fetchList = async () => {
        setLoading(true);
        const tableMap = { 
            race: 'custom_races', 
            class: 'custom_classes', 
            subclass: 'custom_subclasses', 
            background: 'custom_backgrounds',
            spell: 'custom_spells',
            item: 'custom_equipment',
            creature: 'custom_beasts',
            feat: 'custom_feats'
        };
        const data = await loadHomebrew(tableMap[activeTab] as any, currentUser.id);
        setList(data);
        setLoading(false);
    };

    if (!isOpen) return null;

    const resetForm = () => {
        setName(''); setDescription(''); setIsSharedGlobally(false); setEditingId(null);
        setSpeeds({ walk: 30, fly: 0, swim: 0, climb: 0 });
        setAbilityBonuses([]); setTraits([]); setSize('Medium');
        setSaves([]); setLevelFeatures([]); setHitDie(8);
        setCasterType('none'); setCasterAbility('int');
        setBgSkills([]); setBgFeatureName(''); setBgTools([]); setBgEquipment('');
        setArmorProfs([]); setWeaponProfs([]);
        setSpellLevel(0); setSpellSchool('Evocation'); setSpellCastTime('1 Action'); setSpellRange('60 feet'); setSpellDuration('Instantaneous'); setSpellRitual(false); setSpellConcentration(false);
        setSpellComponents(['V', 'S']); setSpellMaterial(''); setSpellHigherLevel(''); setSpellHasAttack(false); setSpellHasSave(false); setSpellDmgFormula('');
        setItemCategory('Other'); setItemSubtype(''); setItemIsWondrous(false); setItemWeight(0); setItemCost('0 gp'); setItemAttunement(false); setItemDmgDice(''); setItemAcBase(0); setItemAcDexBonus(false); setItemModifiers([]);
        setItemIsThrown(false); setItemThrownRange(''); setItemThrownDamage('');
        setCreatureSize('Medium'); setCreatureType('Creature'); setCreatureAc(10); setCreatureHp(10); setCreatureSpeed('30 ft.'); setCreatureAbilities({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }); setCreatureSenses(''); setCreatureLanguages(''); setCreatureCr(0); setCreatureActions([]);
        setFeatPrerequisite(''); setFeatEffects([]);
        setShowForm(false);
    };

    const handleEdit = (item: any) => {
        resetForm();
        setEditingId(item.id);
        setName(item.name || '');
        setDescription(Array.isArray(item.desc) ? item.desc.join('\n') : (item.description || ''));
        setIsSharedGlobally(item.is_public || false);

        if (activeTab === 'race') {
            setSpeeds({ 
                walk: item.speed || 30, 
                fly: item.fly_speed || 0, 
                swim: item.swim_speed || 0, 
                climb: item.climb_speed || 0 
            });
            setSize(item.size || 'Medium');
            if (item.ability_bonuses) {
                setAbilityBonuses(item.ability_bonuses.map((ab: any) => ({
                    stat: ab.ability_score?.index || ab.stat,
                    bonus: ab.bonus
                })));
            }
            if (item.traits) {
                setTraits(item.traits.map((t: any) => ({
                    name: t.name,
                    desc: Array.isArray(t.desc) ? t.desc.join('\n') : t.desc,
                    effects: t.modifiers || t.effects || []
                })));
            }
        } else if (activeTab === 'class') {
            setHitDie(item.hit_die || 8);
            setSaves(item.saving_throws?.map((s: any) => s.index) || []);
            setCasterType(item.spellcasting ? 'full' : 'none'); // Simplified
            setCasterAbility(item.spellcasting?.spellcasting_ability?.index || 'int');
            if (item.feature_details) {
                setLevelFeatures(item.feature_details.map((f: any) => ({
                    level: f.level,
                    name: f.name,
                    desc: Array.isArray(f.desc) ? f.desc.join('\n') : f.desc,
                    effects: f.effects || []
                })));
            }
            // Proficiencies
            const armor = item.proficiencies?.filter((p: any) => ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'].includes(p.name)).map((p: any) => p.name) || [];
            setArmorProfs(armor);
            const weapons = item.proficiencies?.filter((p: any) => !['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'].includes(p.name)).map((p: any) => p.name) || [];
            setWeaponProfs(weapons);
        } else if (activeTab === 'subclass') {
            setParentClass(item.class?.index || 'fighter');
            if (item.feature_details) {
                setLevelFeatures(item.feature_details.map((f: any) => ({
                    level: f.level,
                    name: f.name,
                    desc: Array.isArray(f.desc) ? f.desc.join('\n') : f.desc,
                    effects: f.effects || []
                })));
            }
        } else if (activeTab === 'spell') {
            setSpellLevel(item.level || 0);
            setSpellSchool(item.school?.name || 'Evocation');
            setSpellCastTime(item.casting_time || '1 Action');
            setSpellRange(item.range || '60 feet');
            setSpellDuration(item.duration?.replace("Concentration, ", "") || 'Instantaneous');
            setSpellConcentration(item.concentration || false);
            setSpellRitual(item.ritual || false);
            setSpellComponents(item.components || ['V', 'S']);
            setSpellMaterial(item.material || '');
            setSpellHigherLevel(Array.isArray(item.higher_level) ? item.higher_level.join('\n') : (item.higher_level || ''));
            setSpellHasAttack(!!item.attack_type);
            setSpellAttackType(item.attack_type ? item.attack_type.charAt(0).toUpperCase() + item.attack_type.slice(1) : 'Ranged');
            setSpellHasSave(!!item.dc);
            setSpellSaveType(item.dc?.dc_type?.name?.toUpperCase() || 'DEX');
            if (item.damage) {
                const dmgAtLevel = item.damage.damage_at_slot_level || item.damage.damage_at_character_level;
                if (dmgAtLevel) {
                    const firstKey = Object.keys(dmgAtLevel)[0];
                    setSpellDmgFormula(dmgAtLevel[firstKey]);
                }
                setSpellDmgType(item.damage.damage_type?.name || 'Force');
            }
        } else if (activeTab === 'item') {
            setItemCategory(item.equipment_category?.name || 'Other');
            setItemSubtype(item.subtype || '');
            setItemIsWondrous(item.is_wondrous || false);
            setItemRarity(item.rarity || 'Common');
            setItemWeight(item.weight || 0);
            setItemCost(`${item.cost?.quantity || 0} ${item.cost?.unit || 'gp'}`);
            setItemAttunement(item.requires_attunement || false);
            setItemDmgDice(item.damage?.damage_dice || '');
            setItemDmgType(item.damage?.damage_type?.name || 'Piercing');
            setItemWeaponType(item.weapon_category || 'Simple');
            setItemArmorType(item.armor_category || 'Light');
            setItemAcBase(item.armor_class?.base || 0);
            setItemAcDexBonus(item.armor_class?.dex_bonus || false);
            setItemAcMaxBonus(item.armor_class?.max_bonus || null);
            setItemIsThrown(item.isThrown || false);
            setItemThrownRange(item.thrownRange || '');
            setItemThrownDamage(item.thrownDamage || '');
            setItemProperties(item.properties?.map((p: any) => p.name) || []);
            setItemModifiers(item.modifiers || []);
        } else if (activeTab === 'background') {
            setBgSkills(item.skill_proficiencies || []);
            setBgTools(item.tool_proficiencies || []);
            setBgFeatureName(item.feature?.name || '');
            setBgEquipment(Array.isArray(item.equipment) ? item.equipment.join(', ') : (item.equipment || ''));
        } else if (activeTab === 'feat') {
            setFeatPrerequisite(item.prerequisite || '');
            setFeatEffects(item.effects || []);
        } else if (activeTab === 'creature') {
            setCreatureSize(item.size || 'Medium');
            setCreatureType(item.type || 'Creature');
            setCreatureAc(item.ac || 10);
            setCreatureHp(item.hp || 10);
            setCreatureSpeed(item.speed || '30 ft.');
            setCreatureAbilities({
                str: item.str || 10,
                dex: item.dex || 10,
                con: item.con || 10,
                int: item.int || 10,
                wis: item.wis || 10,
                cha: item.cha || 10
            });
            setCreatureSenses(item.senses || '');
            setCreatureLanguages(item.languages || '');
            setCreatureCr(item.challenge_rating || 0);
            setCreatureActions(item.actions || []);
            if (item.traits) {
                setTraits(item.traits.map((t: any) => ({
                    name: t.name,
                    desc: Array.isArray(t.desc) ? t.desc.join('\n') : t.desc,
                    effects: t.effects || []
                })));
            }
        }

        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you wish to strike this creation from the archives?")) return;
        setLoading(true);
        try {
            const tableMap = { 
                race: 'custom_races', 
                class: 'custom_classes', 
                subclass: 'custom_subclasses', 
                background: 'custom_backgrounds',
                spell: 'custom_spells',
                item: 'custom_equipment',
                creature: 'custom_beasts',
                feat: 'custom_feats'
            };
            await deleteHomebrew(tableMap[activeTab] as any, id, currentUser.id);
            fetchList();
        } catch (err) {
            console.error(err);
            alert("Failed to delete creation.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tableMap = { 
                race: 'custom_races', 
                class: 'custom_classes', 
                subclass: 'custom_subclasses', 
                background: 'custom_backgrounds',
                spell: 'custom_spells',
                item: 'custom_equipment',
                creature: 'custom_beasts',
                feat: 'custom_feats'
            };
            
            let payload: any = { 
                name, 
                index: name.toLowerCase().replace(/\s+/g, '-'), 
                desc: [description],
                is_public: isSharedGlobally
            };
            
            if (activeTab === 'race') {
                payload = { 
                    ...payload, speed: speeds.walk, size, alignment: description,
                    ability_bonuses: abilityBonuses.map(ab => ({ ability_score: { index: ab.stat, name: ab.stat.toUpperCase() }, bonus: ab.bonus })),
                    traits: traits.map(t => ({ index: t.name.toLowerCase().replace(/\s+/g, '-'), name: t.name, desc: [t.desc], modifiers: t.effects })),
                    fly_speed: speeds.fly > 0 ? speeds.fly : undefined,
                    swim_speed: speeds.swim > 0 ? speeds.swim : undefined,
                    climb_speed: speeds.climb > 0 ? speeds.climb : undefined
                };
            } else if (activeTab === 'class') {
                const level_table = Array.from({ length: 20 }, (_, i) => ({
                    level: i + 1,
                    prof_bonus: Math.floor(i / 4) + 2,
                    features: levelFeatures.filter(f => f.level === i + 1).map(f => f.name)
                }));
                const profs = [...armorProfs.map(p => ({name: p})), ...weaponProfs.map(p => ({name: p}))];
                payload = { 
                    ...payload, hit_die: hitDie, saving_throws: saves.map(s => ({ index: s, name: s.toUpperCase() })),
                    proficiency_choices: [], proficiencies: profs, level_table,
                    spellcasting: casterType !== 'none' ? { spellcasting_ability: { index: casterAbility, name: casterAbility.toUpperCase() } } : undefined,
                    feature_details: levelFeatures.map(f => ({ index: f.name.toLowerCase().replace(/\s+/g, '-'), name: f.name, level: f.level, desc: [f.desc], effects: f.effects }))
                };
            } else if (activeTab === 'subclass') {
                payload = { 
                    ...payload, class: { index: parentClass, name: parentClass.charAt(0).toUpperCase() + parentClass.slice(1) },
                    feature_details: levelFeatures.map(f => ({ index: f.name.toLowerCase().replace(/\s+/g, '-'), name: f.name, level: f.level, desc: [f.desc], effects: f.effects }))
                };
            } else if (activeTab === 'background') {
                payload = { 
                    ...payload, skill_proficiencies: bgSkills, equipment: bgEquipment.split(',').map(s => s.trim()), 
                    currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }, 
                    feature: { name: bgFeatureName || 'Custom Feature', desc: [description] } 
                };
            } else if (activeTab === 'spell') {
                payload = {
                    ...payload, level: spellLevel, school: { name: spellSchool, index: spellSchool.toLowerCase() },
                    casting_time: spellCastTime, range: spellRange, duration: (spellConcentration ? "Concentration, " : "") + spellDuration,
                    components: spellComponents, material: spellComponents.includes('M') ? spellMaterial : undefined, 
                    ritual: spellRitual, concentration: spellConcentration,
                    higher_level: spellHigherLevel ? [spellHigherLevel] : undefined,
                    classes: spellClasses.map(c => ({ name: c, index: c.toLowerCase() })),
                    attack_type: spellHasAttack ? spellAttackType.toLowerCase() : undefined,
                    damage: spellDmgFormula ? { 
                        damage_type: { name: spellDmgType, index: spellDmgType.toLowerCase() },
                        [spellLevel === 0 ? 'damage_at_character_level' : 'damage_at_slot_level']: { [spellLevel === 0 ? '1' : spellLevel.toString()]: spellDmgFormula }
                    } : undefined,
                    dc: spellHasSave ? { dc_type: { name: spellSaveType, index: spellSaveType.toLowerCase() }, dc_success: 'half' } : undefined
                };
            } else if (activeTab === 'item') {
                payload = {
                    ...payload, 
                    equipment_category: { name: itemCategory, index: itemCategory.toLowerCase() },
                    subtype: itemSubtype,
                    is_wondrous: itemIsWondrous,
                    rarity: itemRarity,
                    weight: itemWeight, 
                    cost: { quantity: parseInt(itemCost) || 0, unit: itemCost.includes('gp') ? 'gp' : 'sp' },
                    requires_attunement: itemAttunement,
                    isThrown: itemIsThrown,
                    thrownRange: itemThrownRange,
                    thrownDamage: itemThrownDamage,
                    weapon_category: itemCategory === 'Weapon' ? itemWeaponType : undefined,
                    armor_category: itemCategory === 'Armor' ? itemArmorType : undefined,
                    damage: itemDmgDice ? { damage_dice: itemDmgDice, damage_type: { name: itemDmgType, index: itemDmgType.toLowerCase() } } : undefined,
                    armor_class: itemAcBase > 0 ? { base: itemAcBase, dex_bonus: itemAcDexBonus, max_bonus: itemAcMaxBonus } : undefined,
                    properties: itemProperties.map(p => ({ name: p, index: p.toLowerCase() })),
                    modifiers: itemModifiers
                };
            } else if (activeTab === 'creature') {
                payload = {
                    ...payload,
                    size: creatureSize,
                    type: creatureType,
                    ac: creatureAc,
                    hp: creatureHp,
                    speed: creatureSpeed,
                    ...creatureAbilities,
                    senses: creatureSenses,
                    languages: creatureLanguages,
                    challenge_rating: creatureCr,
                    actions: creatureActions,
                    traits: traits.map(t => ({ name: t.name, desc: [t.desc], effects: t.effects }))
                };
            }

            if (activeTab === 'feat') {
                payload = {
                    ...payload,
                    prerequisite: featPrerequisite,
                    effects: featEffects
                };
            }

            await saveHomebrew(tableMap[activeTab] as any, currentUser.id, payload, isSharedGlobally, editingId || undefined);
            alert(`${name} has been ${editingId ? 'updated in' : 'added to'} the Persona network.`);
            resetForm();
            fetchList();
        } catch (err) {
            console.error(err);
            alert("Archive synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
            <div ref={modalRef} className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-6xl shadow-2xl flex flex-col h-[90vh]">
                
                {/* Forge Header */}
                <div className="p-6 border-b border-gray-800 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-serif text-dnd-gold flex items-center gap-3">
                                <span className="opacity-50">⚒️</span>
                                {showForm ? 'Forging Mode' : 'The Homebrew Forge'}
                            </h2>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1 italic">
                                {showForm ? 'Binding mechanics to the weave' : 'Shared creations from across the realms'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors">&times;</button>
                </div>

                <div className="flex border-b border-gray-800 bg-[#1b1c20] shrink-0 overflow-x-auto no-scrollbar">
                    {(['race', 'class', 'subclass', 'background', 'spell', 'item', 'creature', 'feat'] as const).map(t => (
                        <button 
                            key={t}
                            onClick={() => { setActiveTab(t); setShowForm(false); }}
                            className={`px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === t ? 'text-dnd-gold border-dnd-gold bg-dnd-gold/5' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                        >
                            {t === 'class' ? 'Classes' : t === 'subclass' ? 'Subclasses' : t === 'creature' ? 'Creatures' : t === 'feat' ? 'Feats' : `${t}s`}
                        </button>
                    ))}
                </div>

                <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Public Archive Sidebar */}
                    <div className="md:w-72 border-r border-gray-800 bg-black/20 flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">The Archives</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setShowForm(true)} className="text-[10px] text-dnd-gold hover:underline font-bold uppercase">+ Forge New</button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {loading && list.length === 0 ? <div className="p-4 text-xs text-gray-600 animate-pulse">Browsing scrolls...</div> : (
                                list.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => handleEdit(item)}
                                        className="p-3 bg-gray-800/20 rounded-lg border border-gray-700/50 hover:border-dnd-gold transition-colors group relative cursor-pointer"
                                    >
                                        <div className="font-bold text-sm text-gray-300 group-hover:text-white">{item.name} (HB)</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-[8px] text-gray-600 uppercase font-black">By {item.user_id === currentUser.id ? 'You' : item.user_id?.substring(0,8)}</div>
                                            <div className="flex items-center gap-2">
                                                {item.is_public ? (
                                                    <span className="text-[7px] bg-green-900/30 text-green-500 px-1 rounded border border-green-900/50 uppercase font-black">Global</span>
                                                ) : (
                                                    <span className="text-[7px] bg-blue-900/30 text-blue-500 px-1 rounded border border-blue-900/50 uppercase font-black">Personal</span>
                                                )}
                                                {item.user_id === currentUser.id && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                        className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {!loading && list.length === 0 && <div className="p-4 text-xs text-gray-700 italic">The archives are empty.</div>}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar bg-[#1b1c20] relative">
                        {!showForm ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10 max-w-lg mx-auto">
                                <div className="w-24 h-24 bg-dnd-gold/5 border border-dnd-gold/20 rounded-full flex items-center justify-center text-5xl mb-8 opacity-20 shadow-[0_0_50px_rgba(201,173,106,0.1)]">📜</div>
                                <h3 className="text-3xl font-serif text-white mb-4 uppercase tracking-tighter">Forge your own Legend</h3>
                                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-serif italic">"Once committed to the archive, your creation will be available to all heroes within the Persona network."</p>
                                <button onClick={() => setShowForm(true)} className="px-12 py-5 bg-dnd-gold text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">Initialize Craft</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-8 space-y-12 max-w-4xl mx-auto pb-40 animate-in fade-in duration-300">
                                
                                 {/* IDENTITY SECTION */}
                                 <section className="space-y-6">
                                     <div className="border-l-4 border-dnd-gold pl-4 flex justify-between items-center">
                                         <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Basic Identity</h4>
                                         
                                         {/* Sharing Toggle */}
                                         <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-full border border-gray-800">
                                             <button 
                                                 type="button"
                                                 onClick={() => setIsSharedGlobally(false)}
                                                 className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${!isSharedGlobally ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                             >
                                                 Personal
                                             </button>
                                             <button 
                                                 type="button"
                                                 onClick={() => setIsSharedGlobally(true)}
                                                 className={`px-4 py-1 rounded-full text-[9px] font-black uppercase transition-all ${isSharedGlobally ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                             >
                                                 Global
                                             </button>
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div className="md:col-span-2">
                                             <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Entity Name</label>
                                             <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-2xl font-serif text-white outline-none focus:border-dnd-gold shadow-inner" placeholder={`e.g. ${activeTab === 'spell' ? 'Mind Blade' : 'Soulcatcher Amulet'}`} />
                                         </div>
                                         {activeTab !== 'spell' && (
                                             <div className="md:col-span-2">
                                                 <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Flavor Text / Lore</label>
                                                 <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-sm text-gray-400 h-32 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif italic" placeholder="The origins of this legend date back to..." />
                                             </div>
                                         )}
                                     </div>
                                 </section>

                                 {/* TAB SPECIFIC CONFIGS */}

                                 {activeTab === 'creature' && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Size</label>
                                                <select value={creatureSize} onChange={e => setCreatureSize(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option value="Tiny">Tiny</option><option value="Small">Small</option><option value="Medium">Medium</option><option value="Large">Large</option><option value="Huge">Huge</option><option value="Gargantuan">Gargantuan</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Type</label>
                                                <input type="text" value={creatureType} onChange={e => setCreatureType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" placeholder="e.g. Creature, Monstrosity" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Armor Class</label>
                                                <input type="number" value={creatureAc} onChange={e => setCreatureAc(parseInt(e.target.value)||0)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Hit Points</label>
                                                <input type="number" value={creatureHp} onChange={e => setCreatureHp(parseInt(e.target.value)||0)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                        </section>

                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Speed</label>
                                                <input type="text" value={creatureSpeed} onChange={e => setCreatureSpeed(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" placeholder="e.g. 30 ft., fly 60 ft." />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">CR</label>
                                                <input type="number" step="0.125" value={creatureCr} onChange={e => setCreatureCr(parseFloat(e.target.value)||0)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Senses</label>
                                                <input type="text" value={creatureSenses} onChange={e => setCreatureSenses(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" placeholder="e.g. Darkvision 60 ft." />
                                            </div>
                                        </section>

                                        <section className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                            {ABILITY_NAMES.map(s => (
                                                <div key={s}>
                                                    <label className="text-[9px] uppercase font-black text-gray-600 tracking-widest block mb-1 text-center">{s.toUpperCase()}</label>
                                                    <input type="number" value={creatureAbilities[s as keyof typeof creatureAbilities]} onChange={e => setCreatureAbilities({...creatureAbilities, [s]: parseInt(e.target.value)||0})} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center text-sm" />
                                                </div>
                                            ))}
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Special Traits & Abilities</h4>
                                                <button type="button" onClick={() => setTraits([...traits, { name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Trait</button>
                                            </div>
                                            <div className="space-y-4">
                                                {traits.map((t, i) => (
                                                    <div key={i} className="bg-black/20 p-5 rounded-xl border border-gray-800 space-y-4 relative group">
                                                        <button type="button" onClick={() => setTraits(traits.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <input type="text" value={t.name} onChange={e => { const n = [...traits]; n[i].name = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Trait Name (e.g. Keen Smell)" />
                                                        <textarea value={t.desc} onChange={e => { const n = [...traits]; n[i].desc = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-20 resize-none font-serif" placeholder="Description..." />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Actions</h4>
                                                <button type="button" onClick={() => setCreatureActions([...creatureActions, { name: '', desc: '' }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Action</button>
                                            </div>
                                            <div className="space-y-4">
                                                {creatureActions.map((action, i) => (
                                                    <div key={i} className="bg-black/20 p-5 rounded-xl border border-gray-800 space-y-4 relative group">
                                                        <button type="button" onClick={() => setCreatureActions(creatureActions.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <input type="text" value={action.name} onChange={e => { const n = [...creatureActions]; n[i].name = e.target.value; setCreatureActions(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Action Name" />
                                                            <input type="number" value={action.attack_bonus} onChange={e => { const n = [...creatureActions]; n[i].attack_bonus = parseInt(e.target.value); setCreatureActions(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white" placeholder="Atk Bonus" />
                                                            <div className="flex gap-2">
                                                                <input type="text" value={action.damage_dice} onChange={e => { const n = [...creatureActions]; n[i].damage_dice = e.target.value; setCreatureActions(n); }} className="flex-grow bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white" placeholder="Dmg Dice" />
                                                                <input type="text" value={action.damage_type} onChange={e => { const n = [...creatureActions]; n[i].damage_type = e.target.value; setCreatureActions(n); }} className="w-24 bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white" placeholder="Type" />
                                                            </div>
                                                        </div>
                                                        <textarea value={action.desc} onChange={e => { const n = [...creatureActions]; n[i].desc = e.target.value; setCreatureActions(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-20 resize-none font-serif" placeholder="Description..." />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'spell' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spell Level</label>
                                                <select value={spellLevel} onChange={e => setSpellLevel(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option value={0}>Cantrip</option>
                                                    {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">School</label>
                                                <select value={spellSchool} onChange={e => setSpellSchool(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base Casting Time</label>
                                                <select value={spellCastTime} onChange={e => setSpellCastTime(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option>1 Action</option>
                                                    <option>1 Bonus Action</option>
                                                    <option>1 Reaction</option>
                                                    <option>1 Minute</option>
                                                    <option>10 Minutes</option>
                                                    <option>1 Hour</option>
                                                    <option>8 Hours</option>
                                                    <option>Special</option>
                                                </select>
                                            </div>
                                        </section>

                                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Range</label>
                                                <input type="text" value={spellRange} onChange={e => setSpellRange(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold" placeholder="e.g. 60 feet" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Duration</label>
                                                <select value={spellDuration} onChange={e => setSpellDuration(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white outline-none focus:border-dnd-gold">
                                                    <option>Instantaneous</option>
                                                    <option>1 Round</option>
                                                    <option>1 Minute</option>
                                                    <option>10 Minutes</option>
                                                    <option>1 Hour</option>
                                                    <option>8 Hours</option>
                                                    <option>24 Hours</option>
                                                    <option>Until Dispelled</option>
                                                    <option>Special</option>
                                                </select>
                                            </div>
                                        </section>

                                        <section className="bg-black/20 p-6 rounded-2xl border border-gray-800 space-y-6">
                                            <div className="flex flex-wrap gap-8">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={spellConcentration} onChange={e => setSpellConcentration(e.target.checked)} className="accent-blue-500 w-4 h-4" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Concentration</span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={spellRitual} onChange={e => setSpellRitual(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ritual</span>
                                                </label>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Available for Classes</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'].map(cls => (
                                                        <button 
                                                            key={cls} type="button"
                                                            onClick={() => setSpellClasses(prev => prev.includes(cls) ? prev.filter(x => x !== cls) : [...prev, cls])}
                                                            className={`px-3 py-1.5 rounded border text-[10px] font-bold transition-all ${spellClasses.includes(cls) ? 'bg-blue-600 text-white border-blue-600' : 'bg-black/20 text-gray-500 border-gray-700 hover:border-gray-500'}`}
                                                        >
                                                            {cls}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Components</label>
                                                <div className="flex gap-4">
                                                    {['V', 'S', 'M'].map(c => (
                                                        <button 
                                                            key={c} type="button"
                                                            onClick={() => setSpellComponents(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                                            className={`px-4 py-2 rounded border text-xs font-black transition-all ${spellComponents.includes(c) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-700 hover:border-gray-500'}`}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                                {spellComponents.includes('M') && (
                                                    <input 
                                                        type="text" value={spellMaterial} onChange={e => setSpellMaterial(e.target.value)} 
                                                        className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-dnd-gold" 
                                                        placeholder="e.g. a pinch of powdered lead" 
                                                    />
                                                )}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="border-l-4 border-blue-900/50 pl-4">
                                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lore & Description</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spell Effect</label>
                                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-4 text-sm text-gray-300 h-40 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif leading-relaxed" placeholder="Describe the magical effect..." />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">At Higher Levels</label>
                                                    <textarea value={spellHigherLevel} onChange={e => setSpellHigherLevel(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded-lg p-3 text-xs text-gray-500 h-20 resize-none outline-none focus:border-dnd-gold shadow-inner font-serif italic" placeholder="e.g. When you cast this spell using a slot of 2nd level or higher..." />
                                                </div>
                                            </div>
                                        </section>

                                        <section className="bg-purple-900/5 border border-purple-900/20 p-6 rounded-2xl space-y-6">
                                            <h4 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em]">Mechanics</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={spellHasAttack} onChange={e => setSpellHasAttack(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spell Attack</span>
                                                    </label>
                                                    {spellHasAttack && (
                                                        <div className="flex gap-2">
                                                            {['Ranged', 'Melee'].map(t => (
                                                                <button key={t} type="button" onClick={() => setSpellAttackType(t)} className={`flex-1 py-2 rounded border text-[10px] font-black transition-all ${spellAttackType === t ? 'bg-purple-600 text-white border-purple-500' : 'bg-black/20 text-gray-600 border-gray-700'}`}>{t.toUpperCase()}</button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                                                        <input type="checkbox" checked={spellHasSave} onChange={e => setSpellHasSave(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saving Throw</span>
                                                    </label>
                                                    {spellHasSave && (
                                                        <select value={spellSaveType} onChange={e => setSpellSaveType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white outline-none">
                                                            {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base Damage / Healing Formula</label>
                                                        <input type="text" value={spellDmgFormula} onChange={e => setSpellDmgFormula(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-mono" placeholder="e.g. 3d8" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Type</label>
                                                        <select value={spellDmgType} onChange={e => setSpellDmgType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                            {['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Healing', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'].map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 uppercase font-black italic border-t border-purple-900/20 pt-2">Damage automatically scales: by character level for cantrips, by slot level for spells.</p>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'item' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Category</label>
                                                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white">
                                                    <option value="Weapon">Weapon</option>
                                                    <option value="Armor">Armor</option>
                                                    <option value="Tool">Tool</option>
                                                    <option value="Consumable">Consumable</option>
                                                    <option value="Other">Other / Misc</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Item Type / Subtype</label>
                                                <input type="text" value={itemSubtype} onChange={e => setItemSubtype(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white" placeholder="e.g. Longsword, Plate, Wand" />
                                            </div>
                                            <div className="flex items-center pt-6">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${itemIsWondrous ? 'bg-purple-600 border-purple-500' : 'bg-black/40 border-gray-800 group-hover:border-gray-600'}`}>
                                                        {itemIsWondrous && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                    </div>
                                                    <input type="checkbox" className="hidden" checked={itemIsWondrous} onChange={e => setItemIsWondrous(e.target.checked)} />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wondrous Item</span>
                                                </label>
                                            </div>
                                        </section>

                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Rarity</label>
                                                <select value={itemRarity} onChange={e => setItemRarity(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white">
                                                    {['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact'].map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Weight (lb)</label>
                                                <input type="number" value={itemWeight} onChange={e => setItemWeight(parseFloat(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Cost</label>
                                                <input type="text" value={itemCost} onChange={e => setItemCost(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-2 text-white" placeholder="50 gp" />
                                            </div>
                                        </section>

                                        <section className="flex gap-8">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={itemAttunement} onChange={e => setItemAttunement(e.target.checked)} className="accent-dnd-gold" />
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requires Attunement</span>
                                            </label>
                                        </section>

                                        {itemCategory === 'Weapon' && (
                                            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-red-900/5 p-6 rounded-2xl border border-red-900/20">
                                                <h4 className="md:col-span-3 text-[10px] uppercase font-black text-red-400 tracking-[0.2em]">Weapon Statistics</h4>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Weapon Type</label>
                                                    <select value={itemWeaponType} onChange={e => setItemWeaponType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        <option value="Simple">Simple</option>
                                                        <option value="Martial">Martial</option>
                                                        <option value="Firearm">Firearm</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Dice</label>
                                                    <input type="text" value={itemDmgDice} onChange={e => setItemDmgDice(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" placeholder="1d8" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Damage Type</label>
                                                    <select value={itemDmgType} onChange={e => setItemDmgType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        {['Piercing', 'Slashing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Force', 'Necrotic', 'Radiant', 'Psychic'].map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>

                                                <div className="md:col-span-3 pt-4 border-t border-red-900/20">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <input 
                                                                type="checkbox" 
                                                                id="itemIsThrown"
                                                                checked={itemIsThrown} 
                                                                onChange={e => setItemIsThrown(e.target.checked)} 
                                                                className="accent-red-500 w-4 h-4" 
                                                            />
                                                            <label htmlFor="itemIsThrown" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Thrown Weapon</label>
                                                        </div>
                                                    </div>

                                                    {itemIsThrown && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Thrown Range</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={itemThrownRange} 
                                                                    onChange={e => setItemThrownRange(e.target.value)} 
                                                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-mono" 
                                                                    placeholder="e.g. 20/60" 
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Thrown Damage (Optional)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={itemThrownDamage} 
                                                                    onChange={e => setItemThrownDamage(e.target.value)} 
                                                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-mono" 
                                                                    placeholder="e.g. 1d4" 
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        )}

                                        {itemCategory === 'Armor' && (
                                            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-900/5 p-6 rounded-2xl border border-blue-900/20">
                                                <h4 className="md:col-span-4 text-[10px] uppercase font-black text-blue-400 tracking-[0.2em]">Armor Statistics</h4>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Armor Type</label>
                                                    <select value={itemArmorType} onChange={e => setItemArmorType(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        <option value="Light">Light</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="Heavy">Heavy</option>
                                                        <option value="Shield">Shield</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Base AC</label>
                                                    <input type="number" value={itemAcBase} onChange={e => setItemAcBase(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" />
                                                </div>
                                                <div className="flex items-center pt-6">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={itemAcDexBonus} onChange={e => setItemAcDexBonus(e.target.checked)} className="accent-dnd-gold" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Dex Mod</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Max Dex Bonus (opt)</label>
                                                    <input type="number" value={itemAcMaxBonus || ''} onChange={e => setItemAcMaxBonus(parseInt(e.target.value) || null)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white" />
                                                </div>
                                            </section>
                                        )}

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Item Modifiers & Bonuses</h4>
                                                <button type="button" onClick={() => setItemModifiers([...itemModifiers, { type: 'bonus', target: 'ac', value: 1 }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Modifier</button>
                                            </div>
                                            <div className="space-y-4">
                                                {itemModifiers.map((mod, i) => (
                                                    <div key={i} className="bg-black/20 p-4 rounded-xl border border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end relative">
                                                        <button type="button" onClick={() => setItemModifiers(itemModifiers.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Type</label>
                                                            <select value={mod.type} onChange={e => { const n = [...itemModifiers]; n[i].type = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white">
                                                                <option value="bonus">Bonus (+)</option>
                                                                <option value="set">Set To (=)</option>
                                                                <option value="resistance">Resistance</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Target</label>
                                                            <select value={mod.target} onChange={e => { const n = [...itemModifiers]; n[i].target = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white">
                                                                <option value="ac">AC</option>
                                                                <option value="attack">Attack Rolls</option>
                                                                <option value="damage">Damage Rolls</option>
                                                                <option value="saves">Saving Throws</option>
                                                                {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] uppercase font-black text-gray-600 mb-1 block">Value</label>
                                                            <input type="text" value={mod.value} onChange={e => { const n = [...itemModifiers]; n[i].value = e.target.value; setItemModifiers(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-1.5 text-xs text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'race' && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            {Object.keys(speeds).map(s => (
                                                <div key={s}>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">{s} Speed</label>
                                                    <input type="number" value={(speeds as any)[s]} onChange={e => setSpeeds({...speeds, [s]: parseInt(e.target.value)||0})} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center" />
                                                </div>
                                            ))}
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Ability Score Bonuses</h4>
                                                <button type="button" onClick={() => setAbilityBonuses([...abilityBonuses, { stat: 'str', bonus: 1 }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Bonus</button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {abilityBonuses.map((ab, i) => (
                                                    <div key={i} className="flex gap-2 items-center bg-black/20 p-2 rounded border border-gray-800">
                                                        <select value={ab.stat} onChange={e => { const n = [...abilityBonuses]; n[i].stat = e.target.value; setAbilityBonuses(n); }} className="flex-grow bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-xs">
                                                            {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                        </select>
                                                        <input type="number" value={ab.bonus} onChange={e => { const n = [...abilityBonuses]; n[i].bonus = parseInt(e.target.value); setAbilityBonuses(n); }} className="w-16 bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-xs text-center" />
                                                        <button type="button" onClick={() => setAbilityBonuses(abilityBonuses.filter((_, idx) => idx !== i))} className="text-red-500 px-2">&times;</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Racial Traits</h4>
                                                <button type="button" onClick={() => setTraits([...traits, { name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Trait</button>
                                            </div>
                                            <div className="space-y-4">
                                                {traits.map((t, i) => (
                                                    <div key={i} className="bg-black/20 p-5 rounded-xl border border-gray-800 space-y-4 relative group">
                                                        <button type="button" onClick={() => setTraits(traits.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500 hover:text-red-400">&times;</button>
                                                        <input type="text" value={t.name} onChange={e => { const n = [...traits]; n[i].name = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Trait Name (e.g. Relentless Endurance)" />
                                                        <textarea value={t.desc} onChange={e => { const n = [...traits]; n[i].desc = e.target.value; setTraits(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-20 resize-none font-serif" placeholder="Description of the trait's power..." />
                                                        <EffectEditor effects={t.effects} onChange={newE => { const n = [...traits]; n[i].effects = newE; setTraits(n); }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'class' && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Hit Die</label>
                                                <select value={hitDie} onChange={e => setHitDie(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option value={6}>d6</option><option value={8}>d8</option><option value={10}>d10</option><option value={12}>d12</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Save Proficiencies</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {ABILITY_NAMES.map(s => (
                                                        <button key={s} type="button" onClick={() => setSaves(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className={`px-4 py-2 rounded border text-[10px] font-black transition-all ${saves.includes(s) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-800'}`}>{s.toUpperCase()}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        <section className="bg-purple-900/5 border border-purple-900/20 p-6 rounded-2xl space-y-6">
                                            <h4 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em]">Spellcasting Setup</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Caster Type</label>
                                                    <select value={casterType} onChange={e => setCasterType(e.target.value as any)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                        <option value="none">Non-Caster</option>
                                                        <option value="full">Full Caster (Wizard/Cleric)</option>
                                                        <option value="half">Half Caster (Paladin/Ranger)</option>
                                                        <option value="third">Third Caster (EK/AT)</option>
                                                        <option value="pact">Pact Magic (Warlock)</option>
                                                    </select>
                                                </div>
                                                {casterType !== 'none' && (
                                                    <div>
                                                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Spellcasting Ability</label>
                                                        <select value={casterAbility} onChange={e => setCasterAbility(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-white">
                                                            {ABILITY_NAMES.map(s => <option key={s} value={s}>{ABILITY_LABELS[s]}</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                                <h4 className="text-[10px] uppercase font-black text-dnd-gold tracking-[0.2em]">Level Progression (1-20)</h4>
                                                <button type="button" onClick={() => setLevelFeatures([...levelFeatures, { level: 1, name: '', desc: '', effects: [] }])} className="text-[10px] bg-gray-800 px-3 py-1 rounded text-white">+ Add Level Feature</button>
                                            </div>
                                            <div className="space-y-6">
                                                {levelFeatures.map((f, i) => (
                                                    <div key={i} className="bg-black/20 p-6 rounded-xl border border-gray-800 grid grid-cols-[80px_1fr] gap-6 relative">
                                                        <button type="button" onClick={() => setLevelFeatures(levelFeatures.filter((_, idx) => idx !== i))} className="absolute top-2 right-4 text-red-500">&times;</button>
                                                        <div>
                                                            <label className="text-[8px] uppercase font-black text-gray-600 block mb-1">Level</label>
                                                            <input type="number" min="1" max="20" value={f.level} onChange={e => { const n = [...levelFeatures]; n[i].level = parseInt(e.target.value); setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-center font-bold" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <input type="text" value={f.name} onChange={e => { const n = [...levelFeatures]; n[i].name = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-sm text-white font-bold" placeholder="Feature Name" />
                                                            <textarea value={f.desc} onChange={e => { const n = [...levelFeatures]; n[i].desc = e.target.value; setLevelFeatures(n); }} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-xs text-gray-400 h-24 resize-none font-serif" placeholder="Feature description..." />
                                                            <EffectEditor effects={f.effects} onChange={newE => { const n = [...levelFeatures]; n[i].effects = newE; setLevelFeatures(n); }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'background' && (
                                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="space-y-4">
                                            <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Skill Proficiencies</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {SKILL_LIST.map(s => (
                                                    <button key={s.name} type="button" onClick={() => setBgSkills(prev => prev.includes(s.name) ? prev.filter(x => x !== s.name) : [...prev, s.name])} className={`px-2 py-2 rounded border text-[9px] font-black transition-all ${bgSkills.includes(s.name) ? 'bg-dnd-gold text-black border-dnd-gold' : 'bg-black/20 text-gray-600 border-gray-800'}`}>{s.name.toUpperCase()}</button>
                                                ))}
                                            </div>
                                        </section>
                                        <section className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Tool Proficiencies (Comma Separated)</label>
                                                <input type="text" value={bgTools.join(', ')} onChange={e => setBgTools(e.target.value.split(',').map(s => s.trim()))} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm" placeholder="e.g. Cook's Utensils, Dice Set" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Starting Equipment</label>
                                                <input type="text" value={bgEquipment} onChange={e => setBgEquipment(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm" placeholder="e.g. A backpack, 5 gold, a letter from a friend" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Special Feature Name</label>
                                                <input type="text" value={bgFeatureName} onChange={e => setBgFeatureName(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-800 rounded p-3 text-white text-sm font-serif" placeholder="e.g. Position of Privilege" />
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'spell' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Level</label>
                                                <select value={spellLevel} onChange={e => setSpellLevel(parseInt(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option value={0}>Cantrip</option>
                                                    {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">School</label>
                                                <select value={spellSchool} onChange={e => setSpellSchool(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    {SPELL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Casting Time</label>
                                                <input type="text" value={spellCastTime} onChange={e => setSpellCastTime(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Range</label>
                                                <input type="text" value={spellRange} onChange={e => setSpellRange(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Duration</label>
                                                <input type="text" value={spellDuration} onChange={e => setSpellDuration(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={spellConcentration} onChange={e => setSpellConcentration(e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-black" />
                                                <span className="text-[10px] font-black uppercase text-gray-400">Concentration</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={spellRitual} onChange={e => setSpellRitual(e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-black" />
                                                <span className="text-[10px] font-black uppercase text-gray-400">Ritual</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'item' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Category</label>
                                                <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option>Wondrous Item</option><option>Weapon</option><option>Armor</option><option>Consumable</option><option>Tool</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Rarity</label>
                                                <select value={itemRarity} onChange={e => setItemRarity(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white">
                                                    <option>Common</option><option>Uncommon</option><option>Rare</option><option>Very Rare</option><option>Legendary</option><option>Artifact</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Weight (lb)</label>
                                                <input type="number" value={itemWeight} onChange={e => setItemWeight(parseFloat(e.target.value))} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Cost (e.g. 10 gp)</label>
                                                <input type="text" value={itemCost} onChange={e => setItemCost(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" />
                                            </div>
                                            <div className="flex items-center pt-6">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={itemAttunement} onChange={e => setItemAttunement(e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-black" />
                                                    <span className="text-[10px] font-black uppercase text-gray-400">Requires Attunement</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block">Modifiers</label>
                                            <div className="space-y-2">
                                                {itemModifiers.map((mod, i) => (
                                                    <div key={i} className="flex gap-2 items-center bg-black/20 p-2 rounded border border-gray-800">
                                                        <select value={mod.type} onChange={e => { const n = [...itemModifiers]; n[i].type = e.target.value; setItemModifiers(n); }} className="bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-[10px]">
                                                            <option value="bonus">Bonus</option><option value="set">Set</option><option value="resistance">Resistance</option>
                                                        </select>
                                                        <input type="text" placeholder="Target" value={mod.target} onChange={e => { const n = [...itemModifiers]; n[i].target = e.target.value; setItemModifiers(n); }} className="flex-grow bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-[10px]" />
                                                        <input type="text" placeholder="Value" value={mod.value} onChange={e => { const n = [...itemModifiers]; n[i].value = e.target.value; setItemModifiers(n); }} className="w-16 bg-[#0b0c0e] text-white border border-gray-700 rounded p-1 text-[10px] text-center" />
                                                        <button type="button" onClick={() => setItemModifiers(itemModifiers.filter((_, idx) => idx !== i))} className="text-red-500 px-2">&times;</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => setItemModifiers([...itemModifiers, { type: 'bonus', target: 'ac', value: 1 }])} className="text-[10px] text-dnd-gold hover:underline">+ Add Modifier</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'feat' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <section className="space-y-4">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Prerequisite</label>
                                                <input type="text" value={featPrerequisite} onChange={e => setFeatPrerequisite(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-3 text-white" placeholder="e.g. Strength 13 or higher" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-gray-600 tracking-widest block mb-2">Feat Benefits / Effects</label>
                                                <EffectEditor effects={featEffects} onChange={setFeatEffects} />
                                            </div>
                                        </section>
                                    </div>
                                )}

                                <div className="sticky bottom-0 pt-6 pb-4 bg-[#1b1c20] z-10">
                                    <div className="flex gap-4 justify-center items-center">
                                        <button type="button" onClick={resetForm} className="px-6 py-2 text-gray-500 hover:text-white uppercase font-black text-[9px] tracking-widest transition-colors">Discard Draft</button>
                                        <button type="submit" disabled={loading || !name} className="px-10 py-3 bg-dnd-gold text-black rounded-lg font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                                            {loading ? 'Binding...' : 'Forge Entry'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="p-3 bg-[#121316] border-t border-gray-700 rounded-b-xl flex justify-center">
                    <p className="text-[8px] text-gray-700 uppercase font-black tracking-[0.4em]">Vault Network Active • Secure Link 256-BIT • Node Persona-Core</p>
                </div>
            </div>
        </div>
    );
};

export default HomebrewManagerModal;