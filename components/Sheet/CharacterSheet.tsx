import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { CharacterState, ABILITY_NAMES, ABILITY_LABELS, RollResult, AbilityName, SpellDetail, InventoryItem, Currency, RuleEntry, CreatureDetail, EldritchCannonDetail, SteelDefenderDetail, EquipmentDetail, ItemModifier } from '../../types';
import { calculateModifier, formatModifier, calculateProficiency, SKILL_LIST, getSpellSlots, getSpellDamageString, isSpell, getEffectiveAbilities } from '../../utils/rules';
import { rollDice } from '../../utils/dice';
import CreatureManagerModal from './Modals/CreatureManagerModal';
import { WIDGET_LABELS, DEFAULT_LAYOUT, STANDARD_CONDITIONS, CLASS_FEATURES, STANDARD_ACTIONS, STATIC_RULES, WIDGET_BG, PICK_A_CARD_TABLE } from '../../data/constants';
import { Library, fetchEquipment, fetchEquipmentDetail } from '../../data/index';
import DiceRoller3D, { QueuedRoll } from './Shared/DiceRoller3D';
import { saveCharacterToDb } from '../../services/supabase';

import { HeaderStatBox, SquareStatBox } from './Widgets/StatBoxes';
import { RollHistory } from './Widgets/RollHistory';
import { DiceTray } from './Widgets/DiceTray';
import ManageCharacterModal from './Modals/ManageCharacterModal';
import HealthManagerModal from './Modals/HealthManagerModal';
import ShortRestModal from './Modals/ShortRestModal';
import CustomActionModal from './Modals/CustomActionModal';
import ItemSearchModal from '../Builder/ItemSearchModal';
import LayoutManagerModal from './Modals/LayoutManagerModal';
import CustomSpellModal from './Modals/CustomSpellModal';
import ConcentrationCheckModal from './Modals/ConcentrationCheckModal';
import CreatureStatBlockModal from './Modals/CreatureStatBlockModal';
import EldritchCannonModal from './Modals/EldritchCannonModal';
import SteelDefenderModal from './Modals/SteelDefenderModal';
import CardOptionsModal from './Modals/CardOptionsModal';
import CompanionStatBlockModal from './Modals/CompanionStatBlockModal';
import DetailSidePanel from './SidePanels/DetailSidePanel';
import HomebrewManagerModal from '../Dashboard/HomebrewManagerModal';
import SpellManagerModal from './Modals/SpellManagerModal';
import RollContextMenu from './Shared/RollContextMenu';

// Tab Components
import ActionsTab from './Tabs/ActionsTab';
import ErrorBoundary from '../ErrorBoundary';
import SpellsTab from './Tabs/SpellsTab';
import InventoryTab from './Tabs/InventoryTab';
import FeaturesTab from './Tabs/FeaturesTab';
import RulesTab from './Tabs/RulesTab';
import LogTab from './Tabs/LogTab';
import StatsTab from './Tabs/StatsTab';

const cleanProficiencyName = (name: string) => {
    return name.replace(/^(Skill|Musical Instrument|Gaming Set|Tool|Armor|Weapon|Other):\s*/i, '').trim();
};

const getCharacterSpecificRules = (character: CharacterState): RuleEntry[] => {
    const rules: RuleEntry[] = [];
    const classes = character.classes.map(c => c.definition.name.toLowerCase());
    
    const rogue = character.classes.find(c => c.definition.index === 'rogue');
    let sneakDice = '1d6';
    if (rogue) {
        const fullRogueDetail = Library.getClass('rogue');
        const levelData = fullRogueDetail?.level_table.find((l: any) => l.level === rogue.level);
        if (levelData && levelData.class_specific?.sneak_attack) {
            sneakDice = levelData.class_specific.sneak_attack;
        }
    }

    if (classes.includes('rogue')) {
        rules.push({ name: 'Sneak Attack', category: 'Custom', desc: `Once per turn, deal extra ${sneakDice} damage to one creature you hit with advantage, or if an ally is within 5ft of it.` });
        rules.push({ name: 'Cunning Action', category: 'Custom', desc: 'Bonus Action: Dash, Disengage, or Hide.' });
    }
    if (classes.includes('barbarian')) {
        rules.push({ name: 'Rage', category: 'Custom', desc: 'Bonus Action. Adv on Str checks/saves. Bonus melee dmg. Resistance to B/P/S damage.' });
        rules.push({ name: 'Unarmored Defense (Barb)', category: 'Custom', desc: 'AC = 10 + Dex + Con while not wearing armor.' });
    }
    if (classes.includes('arrowsmith')) {
        rules.push({ name: 'Into The Frey', category: 'Custom', desc: 'If within 15ft of 2+ enemies, AC increases by +2, and +1 for every additional 2 enemies.' });
        rules.push({ name: 'Rolling Reload', category: 'Custom', desc: 'When reloading, you can move 5ft without provoking OAs.' });
    }
    
    return rules;
};

const SavingThrowRow: React.FC<{ 
    label: string, 
    stat: AbilityName, 
    isProf: boolean, 
    mod: number, 
    advantage?: boolean, 
    onRoll: (formula: string, label: string) => void, 
    onContextMenu: (e: React.MouseEvent, formula: string, label: string) => void 
}> = ({ label, stat, isProf, mod, advantage, onRoll, onContextMenu }) => (
    <div 
        className="flex items-center justify-between text-xs p-1 hover:bg-[#2e3036]/50 rounded group"
        onContextMenu={(e) => onContextMenu(e, advantage ? `2d20kh1${formatModifier(mod)}` : `1d20${formatModifier(mod)}`, `${label} Save`)}
    >
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full border ${isProf ? 'bg-dnd-gold border-dnd-gold' : 'border-gray-600'}`}></div>
            <span className="text-gray-300 font-bold flex items-center gap-1 flex-wrap">
                {label}
                {advantage && <span className="text-[8px] bg-gray-800/60 text-gray-500 px-1 rounded border border-gray-700/50">ADV</span>}
            </span>
        </div>
        <button
            onClick={() => onRoll(advantage ? `2d20kh1${formatModifier(mod)}` : `1d20${formatModifier(mod)}`, `${label} Save`)}
            className="font-mono text-gray-400 hover:text-white hover:underline"
        >
            {formatModifier(mod)}
        </button>
    </div>
);

const SkillRow: React.FC<{ 
    skill: string, 
    stat: AbilityName, 
    isProf: boolean, 
    isExpertise: boolean, 
    mod: number, 
    advantage?: boolean, 
    onRoll: (formula: string, label: string) => void, 
    onContextMenu: (e: React.MouseEvent, formula: string, label: string) => void 
}> = ({ skill, stat, isProf, isExpertise, mod, advantage, onRoll, onContextMenu }) => (
    <div 
        className="flex items-center justify-between text-xs p-1 hover:bg-[#2e3036]/50 rounded group cursor-pointer" 
        onClick={() => onRoll(advantage ? `2d20kh1${formatModifier(mod)}` : `1d20${formatModifier(mod)}`, `${skill} Check`)}
        onContextMenu={(e) => onContextMenu(e, advantage ? `2d20kh1${formatModifier(mod)}` : `1d20${formatModifier(mod)}`, `${skill} Check`)}
    >
        <div className="flex items-center gap-2">
             <div className={`flex items-center justify-center w-3 h-3`}>
                {isExpertise ? (
                    <div className="w-2 h-2 rotate-45 bg-dnd-gold shadow-[0_0_5px_rgba(201,173,106,0.8)]"></div>
                ) : isProf ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                ) : (
                    <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                )}
            </div>
            <span className={`text-gray-300 flex items-center gap-1 flex-wrap ${isExpertise ? 'text-dnd-gold font-bold' : ''}`}>
                {skill} <span className="text-[9px] text-gray-600 ml-1">({stat.toUpperCase()})</span>
                {advantage && <span className="text-[8px] bg-gray-800/60 text-gray-500 px-1 rounded border border-gray-700/50">ADV</span>}
            </span>
        </div>
        <span className={`font-mono ${isProf ? 'text-white font-bold' : 'text-gray-500'}`}>{formatModifier(mod)}</span>
    </div>
);

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
};

interface CharacterSheetProps {
    character: CharacterState;
    currentUser?: any;
    onOpenVault: () => void;
}

const getEntityId = (entity: any) => entity.id || entity.index;

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character: initialCharacter, currentUser, onOpenVault }) => {
    const [character, setCharacter] = useState<CharacterState>(() => {
        const isImported = !!initialCharacter.spellSlots && Object.keys(initialCharacter.spellSlots).length > 0 && initialCharacter.classFeatures?.length > 0;
        if (isImported) {
             return { 
                 ...initialCharacter, 
                 favorites: initialCharacter.favorites || [], 
                 contacts: initialCharacter.contacts || [], 
                 quests: Array.isArray(initialCharacter.quests) ? initialCharacter.quests : [], 
                 customCreatures: initialCharacter.customCreatures || [], 
                 creatures: initialCharacter.creatures || [],
                 activeWildShape: initialCharacter.activeWildShape ? (
                     ('creature' in initialCharacter.activeWildShape) ? initialCharacter.activeWildShape : { creature: initialCharacter.activeWildShape as any, currentHp: (initialCharacter.activeWildShape as any).hp || 0, maxHp: (initialCharacter.activeWildShape as any).hp || 0 }
                 ) : null,
                 activeFamiliar: initialCharacter.activeFamiliar ? (
                     ('creature' in initialCharacter.activeFamiliar) ? initialCharacter.activeFamiliar : { creature: initialCharacter.activeFamiliar as any, currentHp: (initialCharacter.activeFamiliar as any).hp || 0, maxHp: (initialCharacter.activeFamiliar as any).hp || 0 }
                 ) : null,
                 activePolymorph: initialCharacter.activePolymorph ? (
                     ('creature' in initialCharacter.activePolymorph) ? initialCharacter.activePolymorph : { creature: initialCharacter.activePolymorph as any, currentHp: (initialCharacter.activePolymorph as any).hp || 0, maxHp: (initialCharacter.activePolymorph as any).hp || 0 }
                 ) : null,
                 activeEldritchCannon: initialCharacter.activeEldritchCannon || null,
                 eldritchCannonFreebieUsed: initialCharacter.eldritchCannonFreebieUsed || false,
                 activeSteelDefender: initialCharacter.activeSteelDefender || null,
                 show3DDice: initialCharacter.show3DDice !== false, 
                 diceEffect: initialCharacter.diceEffect || 'standard',
                 backgroundColor: initialCharacter.backgroundColor || '#151515'
             };
        }
        const slots = getSpellSlots(initialCharacter.classes);
        const initialFeatures: any = {};
        initialCharacter.classes.forEach(c => {
            const feat = CLASS_FEATURES[c.definition.name];
            if(feat) {
                const max = feat.formula(c.level, initialCharacter.abilities);
                initialFeatures[feat.name] = { max, current: max, reset: feat.reset };
            }
            if (c.definition.name === 'Paladin' && c.level >= 3) {
                const cdFeat = CLASS_FEATURES['Paladin-CD'];
                const cdMax = cdFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[cdFeat.name] = { max: cdMax, current: cdMax, reset: cdFeat.reset };
            }
            if (c.definition.name === 'Fighter' && c.level >= 2) {
                const asFeat = CLASS_FEATURES['Fighter-AS'];
                const asMax = asFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[asFeat.name] = { max: asMax, current: asMax, reset: asFeat.reset };
            }
            if (c.definition.name === 'Fighter' && c.level >= 9) {
                const indFeat = CLASS_FEATURES['Fighter-Indomitable'];
                const indMax = indFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[indFeat.name] = { max: indMax, current: indMax, reset: indFeat.reset };
            }
            if (c.definition.name === 'Monk' && c.level >= 2) {
                const umFeat = CLASS_FEATURES['Monk-UM'];
                const umMax = umFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[umFeat.name] = { max: umMax, current: umMax, reset: umFeat.reset };
            }
            if (c.definition.name === 'Ranger' && c.level >= 10) {
                const tFeat = CLASS_FEATURES['Ranger-Tireless'];
                const tMax = tFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[tFeat.name] = { max: tMax, current: tMax, reset: tFeat.reset };
            }
            if (c.definition.name === 'Ranger' && c.level >= 14) {
                const nvFeat = CLASS_FEATURES['Ranger-NV'];
                const nvMax = nvFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[nvFeat.name] = { max: nvMax, current: nvMax, reset: nvFeat.reset };
            }
            if (c.definition.name === 'Sorcerer' && c.level >= 1) {
                const isFeat = CLASS_FEATURES['Sorcerer-IS'];
                const isMax = isFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[isFeat.name] = { max: isMax, current: isMax, reset: isFeat.reset };
            }
            if (c.definition.name === 'Artificer' && c.level >= 3 && c.subclass?.index === 'artillerist') {
                const ecFeat = CLASS_FEATURES['Artificer-EC'];
                const ecMax = ecFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[ecFeat.name] = { max: ecMax, current: ecMax, reset: ecFeat.reset };
            }
            if (c.definition.name === 'Artificer' && c.level >= 7) {
                const fgFeat = CLASS_FEATURES['Artificer-FG'];
                const fgMax = fgFeat.formula(c.level, initialCharacter.abilities);
                initialFeatures[fgFeat.name] = { max: fgMax, current: fgMax, reset: fgFeat.reset };
            }
        });
        const inventory = initialCharacter.inventory && initialCharacter.inventory.length > 0 ? initialCharacter.inventory : initialCharacter.equipment.map((item, i) => ({ id: `init-${i}`, name: item, quantity: 1, weight: 5, equipped: true, attuned: false }));
        return {
            ...initialCharacter,
            inventory: inventory,
            currency: initialCharacter.currency || { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 }, 
            spellSlots: slots,
            featureUsage: initialFeatures,
            hitDiceUsage: {},
            classFeatures: initialCharacter.classFeatures || [],
            xp: 0,
            customActions: initialCharacter.customActions || [],
            fontScale: initialCharacter.fontScale || 1.0,
            quests: [],
            contacts: [],
            expertise: initialCharacter.expertise || [],
            customCreatures: [],
            familiars: [],
            activeWildShape: null,
            activeFamiliar: null,
            activePolymorph: null,
            activeEldritchCannon: null,
            eldritchCannonFreebieUsed: false,
            activeSteelDefender: null,
            layout: initialCharacter.layout || { left: [], right: [], mobile: ['actions', 'spells', 'inventory', 'saves', 'hitDice'] },
            favorites: initialCharacter.favorites || [],
            backgroundImageUrl: initialCharacter.backgroundImageUrl || '',
            backgroundColor: initialCharacter.backgroundColor || '#151515',
            themeColor: initialCharacter.themeColor || '',
            themeColorSecondary: initialCharacter.themeColorSecondary || '',
            diceColor: initialCharacter.diceColor || '',
            diceEffect: initialCharacter.diceEffect || 'standard',
            show3DDice: initialCharacter.show3DDice !== false 
        };
    });

    const [saving, setSaving] = useState(false);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedState = useRef<string>(JSON.stringify(character));

    useEffect(() => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        const curStateStr = JSON.stringify(character);
        if (curStateStr === lastSavedState.current) return;
        saveTimeout.current = setTimeout(async () => {
             if (currentUser) {
                 setSaving(true);
                 try {
                     const savedData = await saveCharacterToDb(character, currentUser.id);
                     if (savedData && savedData.id && !character.id) {
                         setCharacter(prev => ({ ...prev, id: savedData.id, user_id: savedData.user_id }));
                     }
                     lastSavedState.current = curStateStr;
                 } catch (e) {
                     console.error("Auto-save failed", e);
                 } finally {
                     setSaving(false);
                 }
             }
        }, 2000);
        return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
    }, [character, currentUser]);

    useEffect(() => {
        const root = document.documentElement;
        if (character.themeColor) {
            const rgb = hexToRgb(character.themeColor);
            if (rgb) root.style.setProperty('--color-accent', rgb);
        } else {
            root.style.setProperty('--color-accent', '201 173 106');
        }
        if (character.themeColorSecondary) {
            const rgb = hexToRgb(character.themeColorSecondary);
            if (rgb) root.style.setProperty('--color-accent-secondary', rgb);
        } else {
            root.style.setProperty('--color-accent-secondary', '138 11 11');
        }
    }, [character.themeColor, character.themeColorSecondary]);

    const [activeTab, setActiveTab] = useState<'actions' | 'spells' | 'inventory' | 'features' | 'rules' | 'log' | 'stats' | 'choices'>('actions');
    const [logs, setLogs] = useState<RollResult[]>([]);
    const [rollHistory, setRollHistory] = useState<RollResult[]>([]); 
    const [activeConditions, setActiveConditions] = useState<string[]>([]);
    const [visibleRules, setVisualRules] = useState<RuleEntry[]>([]);
    
    const [showSpellManager, setShowSpellManager] = useState(false);
    const [showHealthManager, setShowHealthManager] = useState(false);
    const [showShortRestModal, setShowShortRestModal] = useState(false);
    const [showCustomActionModal, setShowCustomActionModal] = useState(false);
    const [showManageCharacterModal, setShowManageCharacterModal] = useState(false);
    const [showItemSearchModal, setShowItemSearchModal] = useState(false);
    const [itemSearchMode, setItemSearchMode] = useState<'search' | 'custom'>('search');
    const [duplicateItem, setDuplicateItem] = useState<EquipmentDetail | null>(null);
    const [duplicateSpell, setDuplicateSpell] = useState<SpellDetail | null>(null);
    const [showLayoutManager, setShowLayoutManager] = useState(false);
    const [showCustomSpellModal, setShowCustomSpellModal] = useState(false);
    const [showCreatureModal, setShowCreatureModal] = useState(false);
    const [creatureModalMode, setCreatureModalMode] = useState<'wildshape' | 'familiar' | 'polymorph'>('wildshape');
    const [showEldritchCannonModal, setShowEldritchCannonModal] = useState(false);
    const [showSteelDefenderModal, setShowSteelDefenderModal] = useState(false);
    const [showCardOptionsModal, setShowCardOptionsModal] = useState(false);
    const [showHomebrewModal, setShowHomebrewModal] = useState(false);
    const [homebrewInitialTab, setHomebrewInitialTab] = useState<'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'creature' | 'feat' | undefined>(undefined);
    const [homebrewInitialData, setHomebrewInitialData] = useState<any>(null);
    const [viewingFamiliar, setViewingFamiliar] = useState<CreatureDetail | null>(null); 
    const [viewingWildShape, setViewingWildShape] = useState<CreatureDetail | null>(null);
    const [viewingCompanion, setViewingCompanion] = useState<any | null>(null);
    const [concentrationCheck, setConcentrationCheck] = useState<{ dc: number; spellName: string } | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
    const [layout, setLayout] = useState(() => {
        const initial = character.layout || DEFAULT_LAYOUT;
        const seen = new Set<string>();
        return {
            left: (initial.left || []).filter(w => { if (seen.has(w)) return false; seen.add(w); return true; }),
            right: (initial.right || []).filter(w => { if (seen.has(w)) return false; seen.add(w); return true; }),
            mobile: Array.from(new Set(initial.mobile || []))
        };
    });
    
    useEffect(() => {
        if (character.classes.some(c => c.definition.index === 'card-master')) {
            setLayout(prev => {
                const hasLeft = prev.left.includes('activeCards');
                const hasRight = prev.right.includes('activeCards');
                
                if (hasLeft && hasRight) {
                    // Remove from left, keep in right
                    return {
                        ...prev,
                        left: prev.left.filter(w => w !== 'activeCards'),
                        right: prev.right.filter((v, i, a) => a.indexOf(v) === i)
                    };
                }
                
                if (hasLeft || hasRight) {
                    // Already in one, just deduplicate within arrays
                    return {
                        ...prev,
                        left: prev.left.filter((v, i, a) => a.indexOf(v) === i),
                        right: prev.right.filter((v, i, a) => a.indexOf(v) === i)
                    };
                }
                
                return { ...prev, right: ['activeCards', ...prev.right] };
            });
        }
    }, [character.classes.length]);
    // Auto-add polymorph widget to layout when active
    useEffect(() => {
        if (character.activePolymorph) {
            setLayout(prev => {
                const isInLayout = prev.left.includes('polymorph') || prev.right.includes('polymorph');
                if (isInLayout) return prev;
                
                // Add to right column by default
                return {
                    ...prev,
                    right: ['polymorph', ...prev.right]
                };
            });
        }
    }, [!!character.activePolymorph]);

    // Auto-add wildshape widget to layout when active
    useEffect(() => {
        if (character.activeWildShape) {
            setLayout(prev => {
                const isInLayout = prev.left.includes('wildshape') || prev.right.includes('wildshape');
                if (isInLayout) return prev;
                
                // Add to right column by default
                return {
                    ...prev,
                    right: ['wildshape', ...prev.right]
                };
            });
        }
    }, [!!character.activeWildShape]);

    // Auto-add familiar widget to layout when active
    useEffect(() => {
        if (character.activeFamiliar) {
            setLayout(prev => {
                const isInLayout = prev.left.includes('familiar') || prev.right.includes('familiar');
                if (isInLayout) return prev;
                
                // Add to right column by default
                return {
                    ...prev,
                    right: ['familiar', ...prev.right]
                };
            });
        }
    }, [!!character.activeFamiliar]);

    const [isSidePanelPinned, setIsSidePanelPinned] = useState(false);
    const [rollMenu, setRollMenu] = useState<{x: number, y: number, formula: string, label: string} | null>(null);
    const [activeRoll, setActiveRoll] = useState<QueuedRoll | null>(null);
    const [allEquipment, setAllEquipment] = useState<EquipmentDetail[]>([]);

    useEffect(() => {
        const loadEquipment = async () => {
            const items = await fetchEquipment(currentUser?.id);
            setAllEquipment(items);
        };
        loadEquipment();
    }, [currentUser?.id]);

    // Sync featureUsage with CLASS_FEATURES to ensure new resources are tracked
    useEffect(() => {
        if (!character) return;
        
        let hasChanges = false;
        const newUsage = { ...character.featureUsage };
        
        character.classes.forEach(c => {
            const feat = CLASS_FEATURES[c.definition.name];
            if (feat) {
                const max = feat.formula(c.level, character.abilities);
                if (!newUsage[feat.name] || newUsage[feat.name].max !== max) {
                    newUsage[feat.name] = {
                        max,
                        current: newUsage[feat.name] ? Math.min(newUsage[feat.name].current, max) : max,
                        reset: feat.reset
                    };
                    hasChanges = true;
                }
            }
            
            // Special cases for subclasses or level-specific features
            const specialFeats = [];
            if (c.definition.name === 'Paladin' && c.level >= 3) specialFeats.push('Paladin-CD');
            if (c.definition.name === 'Fighter' && c.level >= 2) specialFeats.push('Fighter-AS');
            if (c.definition.name === 'Fighter' && c.level >= 9) specialFeats.push('Fighter-Indomitable');
            if (c.definition.name === 'Monk' && c.level >= 2) specialFeats.push('Monk-UM');
            if (c.definition.name === 'Ranger' && c.level >= 10) specialFeats.push('Ranger-Tireless');
            if (c.definition.name === 'Ranger' && c.level >= 14) specialFeats.push('Ranger-NV');
            if (c.definition.name === 'Sorcerer' && c.level >= 1) specialFeats.push('Sorcerer-IS');
            if (c.definition.name === 'Artificer' && c.level >= 3 && c.subclass?.index === 'artillerist') specialFeats.push('Artificer-EC');
            if (c.definition.name === 'Artificer' && c.level >= 7) specialFeats.push('Artificer-FG');

            specialFeats.forEach(key => {
                const sFeat = CLASS_FEATURES[key];
                if (sFeat) {
                    const max = sFeat.formula(c.level, character.abilities);
                    if (!newUsage[sFeat.name] || newUsage[sFeat.name].max !== max) {
                        newUsage[sFeat.name] = {
                            max,
                            current: newUsage[sFeat.name] ? Math.min(newUsage[sFeat.name].current, max) : max,
                            reset: sFeat.reset
                        };
                        hasChanges = true;
                    }
                }
            });
        });
        
        if (hasChanges) {
            setCharacter(prev => ({ ...prev, featureUsage: newUsage }));
        }
    }, [character?.classes, character?.abilities]);

    const prof = calculateProficiency(character.level);
    
    const activeModifiers = React.useMemo(() => {
        const mods: any[] = [];

        // 1. Racial Traits
        if (character.race) {
            const race = character.race as any;
            race.traits?.forEach((trait: any) => {
                trait.modifiers?.forEach((m: any) => mods.push(m));
            });
        }

        // 2. Subracial Traits
        if (character.subrace) {
            const subrace = character.subrace as any;
            subrace.traits?.forEach((trait: any) => {
                trait.modifiers?.forEach((m: any) => mods.push(m));
            });
        }

        // 3. Class Features
        character.classes.forEach(cls => {
            const features = cls.definition.feature_details || [];
            features.forEach(f => {
                if (f.level <= cls.level && f.effects) {
                    f.effects.forEach((e: any) => mods.push(e));
                }
            });
        });

        // 4. Equipped & Attuned Items
        character.inventory.forEach(item => {
            if (item.equipped && (!item.requires_attunement || item.attuned)) {
                item.modifiers?.forEach(m => mods.push(m));
            }
        });

        return mods;
    }, [character.race, character.subrace, character.inventory, character.classes]);

    const effectiveAbilities = useMemo(() => getEffectiveAbilities(character), [character]);

    const getStat = (stat: AbilityName): number => {
        return effectiveAbilities[stat];
    };

    const spellAbilityRef = character.classes[0]?.definition.spellcasting?.spellcasting_ability.index as AbilityName | undefined;
    const spellMod = spellAbilityRef ? calculateModifier(getStat(spellAbilityRef)) : 0;
    
    let extraSpellAttack = 0;
    let extraSpellSave = 0;
    activeModifiers.forEach(m => {
        if (m.type === 'bonus') {
            if (m.target === 'spell_attack') extraSpellAttack += Number(m.value);
            if (m.target === 'spell_save_dc') extraSpellSave += Number(m.value);
        }
    });

    const spellAttack = prof + spellMod + extraSpellAttack;
    const spellAttackStr = formatModifier(spellAttack);
    const spellSave = 8 + prof + spellMod + extraSpellSave;

    const strMod = calculateModifier(getStat('str'));
    const dexMod = calculateModifier(getStat('dex'));
    const initAdv = activeModifiers.some(m => m.type === 'advantage' && m.target === 'initiative');
    const conMod = calculateModifier(getStat('con'));
    const wisMod = calculateModifier(getStat('wis'));
    const intMod = calculateModifier(getStat('int'));
    const chaMod = calculateModifier(getStat('cha'));
    const conSaveBonus = conMod + (character.classes.some(c => c.definition.saving_throws.some(s => s.index === 'con' || s.name === 'CON')) ? prof : 0);
    
    const calculateAC = () => {
        const armor = character.inventory.find(i => i.equipped && i.armor_class && !i.name.toLowerCase().includes('shield'));
        const shield = character.inventory.find(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('shield'));
        
        let baseAC = 10;
        let dexBonus = dexMod;

        // Check for 'set' AC modifiers (like Natural Armor)
        activeModifiers.forEach(m => {
            if (m.type === 'set' && m.target === 'ac') {
                baseAC = Math.max(baseAC, Number(m.value));
            }
        });

        if (armor && armor.armor_class) {
            baseAC = armor.armor_class.base;
            if (armor.armor_class.dex_bonus) {
                if (armor.armor_class.max_bonus !== null) dexBonus = Math.min(dexBonus, armor.armor_class.max_bonus);
            } else {
                dexBonus = 0;
            }
        } else {
             // Unarmored Defense
             const isBarb = character.classes.some(c => c.definition.index === 'barbarian');
             const isMonk = character.classes.some(c => c.definition.index === 'monk');
             if (isBarb) baseAC += conMod;
             else if (isMonk) baseAC += wisMod;
        }

        let total = baseAC + dexBonus;
        if (shield && shield.armor_class) total += shield.armor_class.base;

        // Item/Trait Bonuses
        activeModifiers.forEach(m => {
            if (m.type === 'bonus' && m.target === 'ac') {
                total += Number(m.value);
            }
        });

        return total;
    };

    const getGlobalSaveBonus = () => {
        let bonus = 0;
        activeModifiers.forEach(m => {
            if (m.type === 'bonus' && m.target === 'saves') {
                bonus += Number(m.value);
            }
        });

        // Paladin Aura of Protection
        const paladin = character.classes.find(c => c.definition.name === 'Paladin');
        if (paladin && paladin.level >= 6) bonus += Math.max(1, calculateModifier(getStat('cha')));
        
        return bonus;
    };

    const getACBreakdown = () => {
        const armor = character.inventory.find(i => i.equipped && i.armor_class && !i.name.toLowerCase().includes('shield'));
        const shield = character.inventory.find(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('shield'));
        
        const breakdown: { label: string, value: number }[] = [];
        let baseAC = 10;
        let dexBonus = dexMod;

        // Check for 'set' AC modifiers (like Natural Armor)
        let setAC = -1;
        let setSource = '';
        activeModifiers.forEach(m => {
            if (m.type === 'set' && m.target === 'ac') {
                if (Number(m.value) > setAC) {
                    setAC = Number(m.value);
                    setSource = 'Natural Armor'; // Or more specific if we had the source name
                }
            }
        });

        if (setAC !== -1) {
            baseAC = setAC;
            breakdown.push({ label: setSource, value: setAC });
        }

        if (armor && armor.armor_class) {
            baseAC = armor.armor_class.base;
            breakdown.push({ label: armor.name, value: baseAC });
            if (armor.armor_class.dex_bonus) {
                if (armor.armor_class.max_bonus !== null) {
                    dexBonus = Math.min(dexBonus, armor.armor_class.max_bonus);
                    breakdown.push({ label: `Dexterity (Max ${armor.armor_class.max_bonus})`, value: dexBonus });
                } else {
                    breakdown.push({ label: 'Dexterity', value: dexBonus });
                }
            } else {
                dexBonus = 0;
                breakdown.push({ label: 'Dexterity (No Bonus)', value: 0 });
            }
        } else {
             if (setAC === -1) breakdown.push({ label: 'Base Unarmored', value: 10 });
             
             // Unarmored Defense
             const isBarb = character.classes.some(c => c.definition.index === 'barbarian');
             const isMonk = character.classes.some(c => c.definition.index === 'monk');
             if (isBarb) {
                 breakdown.push({ label: 'Unarmored Defense (Con)', value: conMod });
             } else if (isMonk) {
                 breakdown.push({ label: 'Unarmored Defense (Wis)', value: wisMod });
             }

             if (setAC === -1) breakdown.push({ label: 'Dexterity', value: dexMod });
        }

        if (shield && shield.armor_class) {
            breakdown.push({ label: shield.name, value: shield.armor_class.base });
        }

        // Item/Trait Bonuses
        activeModifiers.forEach(m => {
            if (m.type === 'bonus' && m.target === 'ac') {
                breakdown.push({ label: 'Bonus', value: Number(m.value) });
            }
        });

        return breakdown;
    };

    const getSpeedBreakdown = () => {
        const breakdown: { label: string, value: any }[] = [];
        let baseSpeed = character.race?.speed || 30;
        breakdown.push({ label: 'Base Race Speed', value: baseSpeed });

        // Monk Unarmored Movement
        const monk = character.classes.find(c => c.definition.index === 'monk');
        if (monk && monk.level >= 2) {
            const hasArmor = character.inventory.some(i => i.equipped && i.armor_class && !i.name.toLowerCase().includes('shield'));
            const hasShield = character.inventory.some(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('shield'));
            if (!hasArmor && !hasShield) {
                let bonus = 10;
                if (monk.level >= 18) bonus = 30;
                else if (monk.level >= 14) bonus = 25;
                else if (monk.level >= 10) bonus = 20;
                else if (monk.level >= 6) bonus = 15;
                breakdown.push({ label: 'Unarmored Movement (Monk)', value: `+${bonus}` });
            }
        }

        // Ranger Roving
        const ranger = character.classes.find(c => c.definition.index === 'ranger');
        if (ranger && ranger.level >= 6) {
            const hasHeavy = character.inventory.some(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('plate'));
            if (!hasHeavy) {
                breakdown.push({ label: 'Roving (Ranger)', value: '+10' });
            }
        }

        // Item/Trait Bonuses
        activeModifiers.forEach(m => {
            if (m.target === 'speed') {
                if (m.type === 'bonus') breakdown.push({ label: 'Bonus', value: formatModifier(Number(m.value)) });
                if (m.type === 'set') breakdown.push({ label: 'Set', value: m.value });
            }
        });

        return breakdown;
    };

    const acValue = calculateAC();
    const acBreakdown = getACBreakdown();
    const globalSaveBonus = getGlobalSaveBonus();
    
    const calculateSpeed = () => {
        let baseSpeed = character.race?.speed || 30;
        
        const monk = character.classes.find(c => c.definition.index === 'monk');
        const ranger = character.classes.find(c => c.definition.index === 'ranger');

        if (monk && monk.level >= 2) {
            const hasArmor = character.inventory.some(i => i.equipped && i.armor_class && !i.name.toLowerCase().includes('shield'));
            const hasShield = character.inventory.some(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('shield'));
            if (!hasArmor && !hasShield) {
                if (monk.level >= 18) baseSpeed += 30;
                else if (monk.level >= 14) baseSpeed += 25;
                else if (monk.level >= 10) baseSpeed += 20;
                else if (monk.level >= 6) baseSpeed += 15;
                else baseSpeed += 10;
            }
        }

        if (ranger && ranger.level >= 6) {
            const hasHeavy = character.inventory.some(i => i.equipped && i.armor_class && i.name.toLowerCase().includes('plate'));
            if (!hasHeavy) baseSpeed += 10;
        }

        let total = baseSpeed;
        activeModifiers.forEach(m => {
            if (m.target === 'speed') {
                if (m.type === 'bonus') total += Number(m.value);
                else if (m.type === 'set') total = Math.max(total, Number(m.value));
            }
        });

        return total;
    };

    const speed = calculateSpeed();
    const speedBreakdown = getSpeedBreakdown();
    const currentWeight = character.inventory.reduce((sum: number, item) => sum + (item.weight || 0) * (item.quantity || 1), 0);
    const maxWeight = getStat('str') * 15;

    useEffect(() => {
        if (selectedDetail && 'quantity' in selectedDetail) {
            const updated = character.inventory.find(i => i.id === selectedDetail.id);
            if (updated && (updated.equipped !== selectedDetail.equipped || updated.attuned !== selectedDetail.attuned || updated.quantity !== selectedDetail.quantity)) {
                setSelectedDetail(updated);
            }
        }
    }, [character.inventory, selectedDetail]);

    useEffect(() => { setVisualRules([...STATIC_RULES, ...getCharacterSpecificRules(character)]); }, [character]);

    const roll = (formula: string, label: string, preResult?: RollResult) => {
        const result = preResult || rollDice(formula, label);
        const diceToRoll: { type: string, result: number }[] = [];
        const parts = formula.toLowerCase().split('+');
        let rollIndex = 0;
        parts.forEach(part => {
             const match = part.match(/(\d*)d(\d+)/);
             if (match) {
                 const count = match[1] ? parseInt(match[1]) : 1;
                 const sides = match[2];
                 const type = `d${sides}`;
                 for(let i=0; i<count; i++) { if (rollIndex < result.rolls.length) { diceToRoll.push({ type, result: result.rolls[rollIndex] }); rollIndex++; } }
             }
        });
        if (diceToRoll.length > 0 && character.show3DDice !== false) {
            setActiveRoll({ id: result.timestamp.toString(), dice: diceToRoll, color: character.diceColor || character.themeColor || '#c9ad6a', effect: character.diceEffect || 'standard' });
        }
        setLogs(prev => [...prev, result]);
        setRollHistory(prev => [result, ...prev].slice(0, 50)); 
        setTimeout(() => { setLogs(current => current.filter(l => l.timestamp !== result.timestamp)); }, 5000);
    };

    const handlePickACard = (isFree = false, specificCardName?: string, cost = 1) => {
        const isWorldActive = character.activeCards?.some(c => c.name === 'The World');
        const effectiveIsFree = isFree || isWorldActive;

        if (!effectiveIsFree) {
            const choicePoints = character.featureUsage['Choice Points'];
            if (!choicePoints || choicePoints.current < cost) {
                alert(`Need ${cost} Choice Points!`);
                return;
            }
        }

        let card;
        let rollVal;
        let rollResult;

        const cmClass = character.classes.find(c => c.definition.index === 'card-master');
        const lvl = cmClass ? cmClass.level : 1;
        const dieSize = lvl >= 10 ? 21 : 20;

        if (specificCardName) {
            card = PICK_A_CARD_TABLE.find(c => c.name === specificCardName);
            rollVal = card?.roll || 21;
            // Create a fake roll result for the specific card so dice match
            rollResult = {
                formula: `1d${dieSize}`,
                label: `Pick a Card: ${card?.name || 'Unknown'}`,
                total: rollVal,
                rolls: [rollVal],
                timestamp: Date.now()
            };
        } else {
            rollResult = rollDice(`1d${dieSize}`, 'Pick a Card');
            rollVal = rollResult.total;
            card = PICK_A_CARD_TABLE.find(c => c.roll === rollVal);
        }

        if (card) {
            roll(`1d${dieSize}`, `Pick a Card: ${card.name} (${rollVal})`, rollResult);
            
            const newCard = {
                roll: rollVal,
                name: card.name,
                duration: card.duration,
                timestamp: Date.now()
            };
            
            setCharacter(prev => {
                const activeCards = prev.activeCards || [];
                const updatedCards = [...activeCards, newCard];
                
                const durationCounts: Record<string, number> = {};
                updatedCards.forEach(c => {
                    durationCounts[c.duration] = (durationCounts[c.duration] || 0) + 1;
                });
                
                let totalExhaustion = 0;
                Object.values(durationCounts).forEach(count => {
                    if (count > 2) {
                        totalExhaustion += (count - 2);
                    }
                });
                
                const oldDurationCounts: Record<string, number> = {};
                activeCards.forEach(c => {
                    oldDurationCounts[c.duration] = (oldDurationCounts[c.duration] || 0) + 1;
                });
                let oldExhaustion = 0;
                Object.values(oldDurationCounts).forEach(count => {
                    if (count > 2) oldExhaustion += (count - 2);
                });

                const diff = totalExhaustion - oldExhaustion;
                
                const newFeatureUsage = { ...prev.featureUsage };
                if (!isFree && newFeatureUsage['Choice Points']) {
                    newFeatureUsage['Choice Points'] = {
                        ...newFeatureUsage['Choice Points'],
                        current: newFeatureUsage['Choice Points'].current - cost
                    };
                }

                return {
                    ...prev,
                    activeCards: updatedCards,
                    exhaustion: Math.min(6, (prev.exhaustion || 0) + (diff > 0 ? diff : 0)),
                    featureUsage: newFeatureUsage
                };
            });
        }
    };

    const removeActiveCard = (timestamp: number) => {
        setCharacter(prev => ({
            ...prev,
            activeCards: (prev.activeCards || []).filter(c => c.timestamp !== timestamp)
        }));
    };

    const setExhaustion = (val: number) => {
        setCharacter(prev => ({ ...prev, exhaustion: Math.max(0, Math.min(6, val)) }));
    };

    const triggerRollMenu = (e: React.MouseEvent, formula: string, label: string) => {
        e.preventDefault(); e.stopPropagation();
        setRollMenu({ x: e.clientX, y: e.clientY, formula, label });
    };

    const handleContextMenuRoll = (mode: 'normal' | 'advantage' | 'disadvantage') => {
        if (rollMenu) {
            const { formula, label } = rollMenu;
            let finalFormula = formula;
            if (mode === 'advantage') finalFormula = formula.replace(/(\d*)d20/, '2d20kh1');
            else if (mode === 'disadvantage') finalFormula = formula.replace(/(\d*)d20/, '2d20kl1');
            roll(finalFormula, label + (mode === 'advantage' ? ' (Adv)' : mode === 'disadvantage' ? ' (Dis)' : ''));
            setRollMenu(null);
        }
    };
    
    const handleDamageTrigger = (dmg: number) => {
        if (character.activeWildShape && character.activeWildShape.currentHp === 0) setCharacter(prev => ({ ...prev, activeWildShape: null }));
        if (character.activeConcentration) { const dc = Math.max(10, Math.floor(dmg / 2)); setConcentrationCheck({ dc, spellName: character.activeConcentration.name }); }
    };
    
    const handleCreatureAction = (creature: CreatureDetail) => {
        if (creatureModalMode === 'wildshape') {
            const newFeatures = { ...character.featureUsage };
            if (newFeatures['Wild Shape'] && newFeatures['Wild Shape'].current > 0) {
                newFeatures['Wild Shape'] = { ...newFeatures['Wild Shape'], current: newFeatures['Wild Shape'].current - 1 };
            }
            setCharacter(prev => ({ 
                ...prev, 
                featureUsage: newFeatures, 
                activeWildShape: { creature, currentHp: creature.hp, maxHp: creature.hp } 
            }));
        } else if (creatureModalMode === 'familiar') {
            setCharacter(prev => ({ 
                ...prev, 
                activeFamiliar: { creature, currentHp: creature.hp, maxHp: creature.hp } 
            }));
        } else if (creatureModalMode === 'polymorph') {
            setCharacter(prev => ({ 
                ...prev, 
                activePolymorph: { creature, currentHp: creature.hp, maxHp: creature.hp } 
            }));
        }
        setShowCreatureModal(false);
    };

    const handleWildShapeRevert = () => {
        setCharacter(prev => ({ ...prev, activeWildShape: null }));
    };

    const handleCreatureHpChange = (type: 'wildshape' | 'familiar' | 'polymorph', amount: number) => {
        setCharacter(prev => {
            const key = type === 'wildshape' ? 'activeWildShape' : type === 'familiar' ? 'activeFamiliar' : 'activePolymorph';
            const active = prev[key];
            if (!active) return prev;
            
            const newHp = Math.max(0, Math.min(active.maxHp, active.currentHp + amount));
            if (newHp === 0) {
                // All active creature forms (wild shape, familiar, polymorph) drop on 0 HP
                return { ...prev, [key]: null };
            }
            return { ...prev, [key]: { ...active, currentHp: newHp } };
        });
    };

    const handleSummonCannon = (cannon: EldritchCannonDetail, slotLevel: number) => {
        setCharacter(prev => {
            const newSlots = { ...prev.spellSlots };
            if (slotLevel > 0) {
                newSlots[slotLevel] = { ...newSlots[slotLevel], current: Math.max(0, newSlots[slotLevel].current - 1) };
            }
            return {
                ...prev,
                activeEldritchCannon: cannon,
                eldritchCannonFreebieUsed: true,
                spellSlots: newSlots
            };
        });
    };

    const handleSummonDefender = (defender: SteelDefenderDetail) => {
        setCharacter(prev => ({ ...prev, activeSteelDefender: defender }));
    };
    
    const handleRest = (type: 'short' | 'long') => {
        if (type === 'short') { setShowShortRestModal(true); return; }
        setCharacter(prev => {
            const newSlots = {...prev.spellSlots};
            Object.keys(newSlots).forEach(lvl => { newSlots[parseInt(lvl)].current = newSlots[parseInt(lvl)].max; });
            const newFeatures = {...prev.featureUsage};
            Object.keys(newFeatures).forEach(key => {
                const featureDef = Object.values(CLASS_FEATURES).find(f => f.name === key);
                const resetRule = (newFeatures[key] as any).reset || featureDef?.reset || 'long';
                if (type === 'long' || resetRule === 'short') newFeatures[key].current = newFeatures[key].max;
            });
            const newHitDiceUsage = { ...prev.hitDiceUsage };
            const totalDicePerSize: Record<string, number> = {};
            prev.classes.forEach(c => { const size = String(c.definition.hit_die); totalDicePerSize[size] = (totalDicePerSize[size] || 0) + c.level; });
            let recoveryPool = Math.max(1, Math.floor(prev.level / 2));
            const sortedSizes = Object.keys(totalDicePerSize).sort((a, b) => parseInt(b) - parseInt(a));
            for (const size of sortedSizes) {
                const spent = newHitDiceUsage[size] || 0;
                const recovery = Math.min(spent, recoveryPool);
                newHitDiceUsage[size] = spent - recovery;
                recoveryPool -= recovery;
                if (recoveryPool <= 0) break;
            }
            return { 
                ...prev, 
                currentHp: prev.maxHp, 
                spellSlots: newSlots, 
                featureUsage: newFeatures, 
                hitDiceUsage: newHitDiceUsage,
                eldritchCannonFreebieUsed: false 
            };
        });
    };
    
    const performLevelUp = async (classIndex: string, updates: Partial<CharacterState>) => {
        const newClasses = updates.classes || character.classes;
        const newSlots = getSpellSlots(newClasses);
        const newFeatures = { ...character.featureUsage };
        newClasses.forEach(c => {
             const feat = CLASS_FEATURES[c.definition.name];
             if (feat) {
                 const max = feat.formula(c.level, updates.abilities || character.abilities);
                 const current = (newFeatures[feat.name]?.current || 0) + (max - (newFeatures[feat.name]?.max || 0));
                 newFeatures[feat.name] = { max, current, reset: feat.reset };
             }
             if (c.definition.name === 'Paladin' && c.level >= 3) {
                const cdFeat = CLASS_FEATURES['Paladin-CD'];
                const cdMax = cdFeat.formula(c.level, initialCharacter.abilities);
                newFeatures[cdFeat.name] = { max: cdMax, current: cdMax, reset: cdFeat.reset };
             }
        });
        setCharacter(prev => ({ ...prev, ...updates, spellSlots: newSlots, featureUsage: newFeatures }));
    };
    
    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", `${character.name.replace(/\s+/g, '_')}_sheet.json`);
        anchor.click();
        anchor.remove();
    };
    
    const updateQuantity = (id: string, newQty: number) => {
        if (newQty <= 0) { setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) })); if (selectedDetail?.id === id) setSelectedDetail(null); return; }
        setCharacter(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === id ? { ...i, quantity: newQty } : i) }));
    };

    const handleDuplicateToHomebrew = (type: 'item' | 'spell', data: any) => {
        setHomebrewInitialTab(type);
        setHomebrewInitialData(data);
        setShowHomebrewModal(true);
    };

    const handleAddItem = async (item: EquipmentDetail) => {
        const newItem: InventoryItem = {
            ...item,
            id: `${item.index}-${Date.now()}`,
            quantity: 1,
            equipped: false,
            attuned: false
        };
        setCharacter(prev => ({
            ...prev,
            inventory: [...prev.inventory, newItem]
        }));
        setShowItemSearchModal(false);
    };

    const toggleAttunement = (id: string) => {
        setCharacter(prev => {
            const item = prev.inventory.find(i => i.id === id);
            if (!item) return prev;
            if (!item.attuned && prev.inventory.filter(i => i.attuned).length >= 3) { alert("Maximum attunement slots (3) reached."); return prev; }
            return { ...prev, inventory: prev.inventory.map(i => i.id === id ? { ...i, attuned: !i.attuned } : i) };
        });
    };
    const toggleEquipped = (id: string) => { setCharacter(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === id ? { ...i, equipped: !i.equipped } : i) })); };
    const toggleItemFlag = (id: string, flag: keyof InventoryItem) => {
        setCharacter(prev => ({
            ...prev,
            inventory: prev.inventory.map(i => i.id === id ? { ...i, [flag]: !i[flag] } : i)
        }));
    };
    const toggleFavorite = (id: string) => {
        setCharacter(prev => {
            const newFavs = prev.favorites?.includes(id) ? (prev.favorites || []).filter(fav => fav !== id) : [...(prev.favorites || []), id];
            return { ...prev, favorites: newFavs };
        });
    };

    const renderWidget = (type: string, key?: string) => {
        const widgetKey = key || type;
        switch (type) {
            case 'steelDefender':
                const isBattleSmith = character.classes.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'battle-smith' && c.level >= 3);
                if (!isBattleSmith) return null;
                const defender = character.activeSteelDefender;
                return (
                    <div 
                        key={widgetKey} 
                        className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative group cursor-pointer hover:border-orange-400 transition-colors`}
                        onClick={() => {
                            if (defender) {
                                setViewingCompanion({
                                    name: 'Steel Defender',
                                    type: 'construct',
                                    size: 'Medium',
                                    ac: 15,
                                    hp: defender.hp,
                                    maxHp: defender.maxHp,
                                    speed: '40 ft.',
                                    abilities: { str: 14, dex: 12, con: 14, int: 4, wis: 10, cha: 6 },
                                    traits: [
                                        { name: 'Vigilant', desc: 'The defender can\'t be surprised.' }
                                    ],
                                    actions: [
                                        { name: 'Force-Empowered Slam', desc: `Melee Weapon Attack: +${spellAttack} to hit, reach 5 ft., one target. Hit: 1d8 + ${prof} force damage.` },
                                        { name: 'Repair (3/Day)', desc: 'The magical mechanisms inside the defender restore 2d8 + PB hit points to itself or to one construct or object within 5 feet of it.' },
                                        { name: 'Deflect Attack (Reaction)', desc: 'The defender imposes disadvantage on the attack roll of one creature it can see that is within 5 feet of it, provided the attack roll is against a creature other than the defender.' }
                                    ]
                                });
                            }
                        }}
                    >
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest flex items-center gap-2">Steel Defender</h3>
                             <button onClick={(e) => { e.stopPropagation(); setShowSteelDefenderModal(true); }} className="text-[10px] uppercase font-bold text-gray-500 hover:text-white border border-gray-600 bg-black/40 px-2 py-0.5 rounded transition-colors">Manage</button>
                         </div>
                         {defender ? (
                             <div className="space-y-3">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <div className="font-bold text-white text-sm">Automaton Companion</div>
                                         <div className="text-[9px] text-gray-500 uppercase">Medium Construct</div>
                                     </div>
                                     <button onClick={(e) => { e.stopPropagation(); setCharacter(p => ({ ...p, activeSteelDefender: null })); }} className="text-gray-500 hover:text-red-500">&times;</button>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 text-center bg-gray-800/40 rounded p-2">
                                     <div><div className="text-[9px] text-gray-500 uppercase">AC</div><div className="text-white font-bold text-sm">15</div></div>
                                     <div className="cursor-pointer" onClick={(e) => {
                                         e.stopPropagation();
                                         const dmg = prompt("Enter damage taken by defender:");
                                         if(dmg) {
                                             const newHp = Math.max(0, defender.hp - parseInt(dmg));
                                             if (newHp === 0) setCharacter(p => ({ ...p, activeSteelDefender: null }));
                                             else setCharacter(p => ({ ...p, activeSteelDefender: { ...defender, hp: newHp } }));
                                         }
                                     }}>
                                         <div className="text-[9px] text-gray-500 uppercase">HP</div>
                                         <div className="text-orange-400 font-bold text-sm">{defender.hp}/{defender.maxHp}</div>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); roll(`1d20${formatModifier(spellAttack)}`, 'Steel Defender Slam Attack'); roll(`1d8${formatModifier(prof)}`, 'Slam Force Damage'); }}
                                    className="w-full py-1.5 bg-gray-800 border border-gray-700 text-gray-300 rounded text-[10px] font-bold uppercase hover:bg-gray-700 transition-colors"
                                 >
                                     Force-Empowered Slam
                                 </button>
                             </div>
                         ) : <div className="text-center py-4 text-gray-600 italic text-[10px]">No defender active.</div>}
                    </div>
                );
            case 'eldritchCannon':
                const isArtillerist = character.classes.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'artillerist' && c.level >= 3);
                if (!isArtillerist) return null;
                const cannon = character.activeEldritchCannon;
                return (
                    <div 
                        key={widgetKey} 
                        className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative group cursor-pointer hover:border-dnd-gold transition-colors`}
                        onClick={() => {
                            if (cannon) {
                                setViewingCompanion({
                                    name: cannon.type,
                                    type: 'object',
                                    size: cannon.size,
                                    ac: 18,
                                    hp: cannon.hp,
                                    maxHp: cannon.maxHp,
                                    speed: '15 ft. (Walk/Climb)',
                                    actions: [
                                        cannon.type === 'Flamethrower' ? { name: 'Flamethrower', desc: 'The cannon exhales fire in an adjacent 15-foot cone. Each creature in that area must make a Dexterity saving throw against your spell save DC, taking 2d8 fire damage on a failed save or half as much damage on a successful one.' } :
                                        cannon.type === 'Force Ballista' ? { name: 'Force Ballista', desc: 'Make a ranged spell attack, originating from the cannon, at one creature or object within 120 feet of it. On a hit, the target takes 2d8 force damage, and if the target is a creature, it is pushed up to 5 feet away from the cannon.' } :
                                        { name: 'Protector', desc: 'The cannon emits a burst of positive energy that grants itself and each creature of your choice within 10 feet of it a number of temporary hit points equal to 1d8 + your Intelligence modifier (minimum of +1).' },
                                        { name: 'Detonate (Action)', desc: 'As an action, you can command the cannon to detonate. Each creature within 20 feet of it must make a Dexterity saving throw against your spell save DC, taking 3d8 force damage on a failed save or half as much on a successful one. The cannon is destroyed.' }
                                    ]
                                });
                            }
                        }}
                    >
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Eldritch Cannon</h3>
                             <button onClick={(e) => { e.stopPropagation(); setShowEldritchCannonModal(true); }} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white border border-gray-600 bg-black/40 px-2 py-0.5 rounded transition-colors">Summon</button>
                         </div>
                         {cannon ? (
                             <div className="space-y-3">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <div className="font-bold text-white text-sm">{cannon.type}</div>
                                         <div className="text-[9px] text-gray-500 uppercase">{cannon.size} Object</div>
                                     </div>
                                     <button onClick={(e) => { e.stopPropagation(); setCharacter(p => ({ ...p, activeEldritchCannon: null })); }} className="text-gray-500 hover:text-red-500">&times;</button>
                                 </div>
                                 <div className="flex items-center gap-2 bg-gray-800/40 rounded p-2 overflow-hidden">
                                     <div className="flex-1 text-center border-r border-gray-700/50">
                                         <div className="text-[9px] text-gray-500 uppercase leading-none mb-1">AC</div>
                                         <div className="text-white font-bold text-sm">18</div>
                                     </div>
                                     <div className="flex-[2] flex items-center justify-center gap-3">
                                         <button onClick={(e) => {
                                             e.stopPropagation();
                                             const cur = character.activeEldritchCannon;
                                             if (cur) setCharacter(p => ({ ...p, activeEldritchCannon: { ...cur, hp: Math.max(0, cur.hp - 1) } }));
                                         }} className="w-5 h-5 flex items-center justify-center bg-red-900/30 text-red-400 rounded-full hover:bg-red-900/50 transition-colors">&minus;</button>
                                         <div className="text-center">
                                             <div className="text-[9px] text-gray-500 uppercase leading-none mb-1">HP</div>
                                             <div className="text-dnd-gold font-bold text-sm leading-none">{cannon.hp}/{cannon.maxHp}</div>
                                         </div>
                                         <button onClick={(e) => {
                                             e.stopPropagation();
                                             const cur = character.activeEldritchCannon;
                                             if (cur) setCharacter(p => ({ ...p, activeEldritchCannon: { ...cur, hp: Math.min(cur.maxHp, cur.hp + 1) } }));
                                         }} className="w-5 h-5 flex items-center justify-center bg-green-900/30 text-green-400 rounded-full hover:bg-green-900/50 transition-colors">+</button>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if(cannon.type === 'Flamethrower') roll('2d8', 'Flamethrower Fire Damage');
                                            else if(cannon.type === 'Force Ballista') roll(`1d20${spellAttackStr}`, 'Force Ballista Attack');
                                            else roll('1d8' + formatModifier(spellMod), 'Defender Temp HP Pulse');
                                        }}
                                        className="py-1.5 bg-gray-800 border border-gray-700 text-gray-300 rounded text-[10px] font-bold uppercase hover:border-dnd-gold transition-colors"
                                     >
                                         Activate
                                     </button>
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            roll('3d8', 'Detonate Explosion Damage');
                                            setCharacter(p => ({ ...p, activeEldritchCannon: null }));
                                        }}
                                        className="py-1.5 bg-red-900/20 border border-red-900 text-red-500 rounded text-[10px] font-bold uppercase hover:bg-red-900/40 transition-colors"
                                     >
                                         Detonate
                                     </button>
                                 </div>
                             </div>
                         ) : <div className="text-center py-4 text-gray-600 italic text-[10px]">No cannon summoned.</div>}
                    </div>
                );
            case 'familiar':
                return (
                    <div key={widgetKey} onClick={() => character.activeFamiliar?.creature && setViewingFamiliar(character.activeFamiliar.creature)} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative group ${character.activeFamiliar ? 'cursor-pointer hover:border-pink-400 transition-colors' : ''}`}>
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest flex items-center gap-2">Familiar</h3>
                             <button onClick={(e) => { e.stopPropagation(); setCreatureModalMode('familiar'); setShowCreatureModal(true); }} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white border border-gray-600 bg-black/40 px-2 py-0.5 rounded transition-colors">Manage</button>
                         </div>
                         {character.activeFamiliar?.creature ? (
                             <div className="space-y-2">
                                 <div className="flex justify-between items-start"><div className="font-bold text-white">{character.activeFamiliar.creature.name}</div><div className="text-[10px] text-gray-400">{character.activeFamiliar.creature.size} {character.activeFamiliar.creature.type}</div></div>
                                 <div className="grid grid-cols-3 gap-1 text-center bg-gray-800/50 rounded p-1">
                                     <div><div className="text-[9px] text-gray-500 uppercase">AC</div><div className="text-white font-bold text-sm">{character.activeFamiliar.creature.ac}</div></div>
                                     <div className="flex flex-col items-center">
                                         <div className="text-[9px] text-gray-500 uppercase">HP</div>
                                         <div className="flex items-center gap-1">
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('familiar', -1); }} className="w-4 h-4 flex items-center justify-center bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">-</button>
                                             <div className="text-white font-bold text-sm">{character.activeFamiliar.currentHp}</div>
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('familiar', 1); }} className="w-4 h-4 flex items-center justify-center bg-green-900/30 text-green-400 rounded hover:bg-green-900/50">+</button>
                                         </div>
                                     </div>
                                     <div><div className="text-[9px] text-gray-500 uppercase">Spd</div><div className="text-white font-bold text-[10px] leading-tight mt-0.5">{character.activeFamiliar.creature.speed.replace(' ft.', '')}</div></div>
                                 </div>
                                 <div className="text-[10px] text-gray-400 space-y-1">{character.activeFamiliar.creature.senses && <div><span className="font-bold text-gray-500">Senses:</span> {character.activeFamiliar.creature.senses}</div>}{character.activeFamiliar.creature.actions?.length > 0 && (<div><span className="font-bold text-gray-500 block">Actions:</span>{character.activeFamiliar.creature.actions.map(a => (<div key={a.name} className="truncate pl-1">• {a.name}</div>))}</div>)}</div>
                             </div>
                         ) : <div className="text-center py-4 text-gray-600 italic text-xs">No familiar summoned.</div>}
                    </div>
                );
            case 'wildshape':
                if (!character.activeWildShape) return null;
                return (
                    <div key={widgetKey} onClick={() => character.activeWildShape?.creature && setViewingWildShape(character.activeWildShape.creature)} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative group ${character.activeWildShape ? 'cursor-pointer hover:border-dnd-gold transition-colors' : ''}`}>
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest flex items-center gap-2">Wild Shape</h3>
                             <div className="flex gap-1">
                                 <button onClick={(e) => { e.stopPropagation(); setCreatureModalMode('wildshape'); setShowCreatureModal(true); }} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white border border-gray-600 bg-black/40 px-2 py-0.5 rounded transition-colors">Manage</button>
                                 {character.activeWildShape && (
                                     <button onClick={(e) => { e.stopPropagation(); handleWildShapeRevert(); }} title="Revert Form" className="text-[10px] text-red-400 hover:text-white border border-red-900/50 bg-red-900/20 px-1.5 py-0.5 rounded transition-colors">✕</button>
                                 )}
                             </div>
                         </div>
                        {character.activeWildShape?.creature ? (
                             <div className="space-y-2">
                                 <div className="flex justify-between items-start"><div className="font-bold text-white">{character.activeWildShape.creature.name}</div><div className="text-[10px] text-gray-400">{character.activeWildShape.creature.size} {character.activeWildShape.creature.type}</div></div>
                                 <div className="grid grid-cols-3 gap-1 text-center bg-gray-800/50 rounded p-1">
                                     <div><div className="text-[9px] text-gray-500 uppercase">AC</div><div className="text-white font-bold text-sm">{character.activeWildShape.creature.ac}</div></div>
                                     <div className="flex flex-col items-center">
                                         <div className="text-[9px] text-gray-500 uppercase">HP</div>
                                         <div className="flex items-center gap-1">
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('wildshape', -1); }} className="w-4 h-4 flex items-center justify-center bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">-</button>
                                             <div className="text-white font-bold text-sm">{character.activeWildShape.currentHp}</div>
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('wildshape', 1); }} className="w-4 h-4 flex items-center justify-center bg-green-900/30 text-green-400 rounded hover:bg-green-900/50">+</button>
                                         </div>
                                     </div>
                                     <div><div className="text-[9px] text-gray-500 uppercase">Spd</div><div className="text-white font-bold text-[10px] leading-tight mt-0.5">{character.activeWildShape.creature.speed.replace(' ft.', '')}</div></div>
                                 </div>
                                 <div className="text-[10px] text-gray-400 space-y-1">{character.activeWildShape.creature.actions?.length > 0 && (<div><span className="font-bold text-gray-500 block">Actions:</span>{character.activeWildShape.creature.actions.map(a => (<div key={a.name} className="truncate pl-1">• {a.name}</div>))}</div>)}</div>
                             </div>
                        ) : null}
                    </div>
                );
            case 'polymorph':
                if (!character.activePolymorph) return null;
                return (
                    <div key={widgetKey} onClick={() => character.activePolymorph?.creature && setViewingWildShape(character.activePolymorph.creature)} className={`${WIDGET_BG} border border-purple-900/30 rounded-lg p-3 relative group ${character.activePolymorph ? 'cursor-pointer hover:border-purple-400 transition-colors' : ''}`}>
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-xs text-purple-400 uppercase tracking-widest flex items-center gap-2">Polymorph</h3>
                             <button onClick={(e) => { e.stopPropagation(); setCreatureModalMode('polymorph'); setShowCreatureModal(true); }} className="text-[10px] uppercase font-bold text-gray-400 hover:text-white border border-gray-600 bg-black/40 px-2 py-0.5 rounded transition-colors">Manage</button>
                         </div>
                         {character.activePolymorph?.creature ? (
                             <div className="space-y-2">
                                 <div className="flex justify-between items-start"><div className="font-bold text-white">{character.activePolymorph.creature.name}</div><div className="text-[10px] text-gray-400">{character.activePolymorph.creature.size} {character.activePolymorph.creature.type}</div></div>
                                 <div className="grid grid-cols-3 gap-1 text-center bg-gray-800/50 rounded p-1">
                                     <div><div className="text-[9px] text-gray-500 uppercase">AC</div><div className="text-white font-bold text-sm">{character.activePolymorph.creature.ac}</div></div>
                                     <div className="flex flex-col items-center">
                                         <div className="text-[9px] text-gray-500 uppercase">HP</div>
                                         <div className="flex items-center gap-1">
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('polymorph', -1); }} className="w-4 h-4 flex items-center justify-center bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">-</button>
                                             <div className="text-white font-bold text-sm">{character.activePolymorph.currentHp}</div>
                                             <button onClick={(e) => { e.stopPropagation(); handleCreatureHpChange('polymorph', 1); }} className="w-4 h-4 flex items-center justify-center bg-green-900/30 text-green-400 rounded hover:bg-green-900/50">+</button>
                                         </div>
                                     </div>
                                     <div><div className="text-[9px] text-gray-500 uppercase">Spd</div><div className="text-white font-bold text-[10px] leading-tight mt-0.5">{character.activePolymorph.creature.speed.replace(' ft.', '')}</div></div>
                                 </div>
                                 <div className="text-[10px] text-gray-400 space-y-1">{character.activePolymorph.creature.actions?.length > 0 && (<div><span className="font-bold text-gray-500 block">Actions:</span>{character.activePolymorph.creature.actions.map(a => (<div key={a.name} className="truncate pl-1">• {a.name}</div>))}</div>)}</div>
                             </div>
                         ) : <div className="text-center py-4 text-gray-600 italic text-xs">Not polymorphed.</div>}
                    </div>
                );
            case 'concentration':
                 const bonusStr = conSaveBonus >= 0 ? `+${conSaveBonus}` : `${conSaveBonus}`;
                 return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative overflow-hidden group`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2 flex items-center gap-2">Concentration {character.activeConcentration && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"/>}</h3>
                        {character.activeConcentration ? (
                            <div className="bg-blue-900/20 border-blue-500/30 rounded p-3">
                                <div className="flex justify-between items-start mb-2"><div><div className="font-bold text-blue-100 text-sm">{character.activeConcentration.name}</div><div className="text-[10px] text-blue-300 italic">{character.activeConcentration.duration || 'Concentration'}</div></div><button onClick={() => setCharacter(prev => ({ ...prev, activeConcentration: null }))} className="text-gray-400 hover:text-red-400 p-1" title="Drop Concentration">&times;</button></div>
                                <div className="flex items-center gap-2 mt-3"><div className="text-xs text-gray-400 font-bold uppercase">Con Save: <span className="text-white">{bonusStr}</span></div><button onClick={() => setConcentrationCheck({ dc: 10, spellName: character.activeConcentration!.name })} className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase rounded shadow-sm transition-colors">Roll Check</button></div>
                            </div>
                        ) : <div className="text-xs text-gray-500 italic text-center py-2">Not concentrating on any spell.</div>}
                    </div>
                );
            case 'features':
                const isDruid = character.classes.some(c => c.definition.index === 'druid');
                return (
                    <div key={widgetKey} className="space-y-4">
                        {isDruid && !character.featureUsage['Wild Shape']?.hidden && (
                             <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 transition-colors`}>
                                 <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Wild Shape</h3><button onClick={() => { setCreatureModalMode('wildshape'); setShowCreatureModal(true); }} disabled={!!character.activeWildShape} className="text-[9px] bg-dnd-gold/10 text-dnd-gold border border-dnd-gold/50 hover:bg-dnd-gold hover:text-black px-2 py-0.5 rounded uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed">{character.activeWildShape ? 'Active' : 'Transform'}</button></div>
                                 <div className="flex gap-1.5 justify-start">
                                     {Array.from({length: character.featureUsage['Wild Shape']?.max || 2}).map((_, i) => {
                                         const usage = character.featureUsage['Wild Shape']; if (!usage) return null; const usedCount = usage.max - usage.current; const isUsed = i < usedCount;
                                         return (<div key={i} className={`w-4 h-4 cursor-pointer transition-colors border rounded-full ${isUsed ? 'bg-dnd-red border-dnd-red' : 'bg-transparent border-gray-600 hover:border-gray-300'}`} onClick={() => { let used = i + 1; if (usedCount === used) used = i; setCharacter(prev => ({...prev, featureUsage: {...prev.featureUsage, ['Wild Shape']: {...usage, current: usage.max - used}}})); }}></div>);
                                     })}
                                 </div>
                             </div>
                        )}
                        {Object.entries(character.featureUsage).filter(([name, usage]) => name !== 'Wild Shape' && !usage.hidden).map(([name, usage]: [string, any]) => {
                            const usedCount = usage.max - usage.current;
                            return (
                            <div key={name} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                                <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">{name}</h3><span className="text-[10px] text-gray-500">Reset: {usage.reset || CLASS_FEATURES[character.classes.find(c => CLASS_FEATURES[c.definition.name]?.name === name)?.definition.name || '']?.reset || 'Long'}</span></div>
                                <div className="flex gap-1.5 justify-start">{Array.from({length: usage.max}).map((_, i) => { const isUsed = i < usedCount; return (<div key={i} className={`w-4 h-4 cursor-pointer transition-colors border rounded-full ${isUsed ? 'bg-dnd-red border-dnd-red' : 'bg-transparent border-gray-600 hover:border-gray-300'}`} onClick={() => { let used = i + 1; if (usedCount === used) used = i; setCharacter(prev => ({...prev, featureUsage: {...prev.featureUsage, [name]: {...usage, current: usage.max - used}}})); }}></div>); })}</div>
                                {name === 'Arrow Crafting' && (
                                    <button 
                                        onClick={() => setActiveTab('inventory')}
                                        className="mt-3 text-[9px] text-dnd-gold hover:text-white uppercase font-black tracking-widest flex items-center gap-1.5 transition-colors pt-2 border-t border-gray-800/50 w-full"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                                        Manage Quiver
                                    </button>
                                )}
                            </div>
                        )})}
                    </div>
                );
            case 'activeCards': {
                const cmClass = character.classes.find(c => c.definition.index === 'card-master');
                if (!cmClass) return null;
                const cmLevel = cmClass.level;
                const foolStacks = character.foolStacks || 0;

                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest flex items-center gap-2">
                                Active Cards
                                <button 
                                    onClick={() => setShowCardOptionsModal(true)}
                                    className="text-gray-500 hover:text-dnd-gold transition-colors"
                                    title="View Card Reference"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </button>
                            </h3>
                            <div className="text-[10px] text-gray-500 font-bold">DC {spellSave}</div>
                        </div>
                        
                        <div className="space-y-2">
                            {character.activeCards && character.activeCards.length > 0 ? (
                                character.activeCards.map((card, idx) => (
                                    <div key={`${card.name}-${idx}`} className="bg-gray-800/30 border border-gray-700/50 rounded p-2 flex justify-between items-center">
                                        <div>
                                            <div className="text-xs font-bold text-white">{card.name}</div>
                                            <div className="text-[9px] text-gray-500 uppercase">{card.duration}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {cmLevel >= 4 && (
                                                <button 
                                                    onClick={() => {
                                                        const isWorldActive = character.activeCards?.some(c => c.name === 'The World');
                                                        const stacksToAdd = isWorldActive ? 2 : 1;
                                                        
                                                        setCharacter(prev => ({
                                                            ...prev,
                                                            activeCards: prev.activeCards?.filter((_, i) => i !== idx),
                                                            foolStacks: (prev.foolStacks || 0) + stacksToAdd
                                                        }));
                                                        
                                                        if (cmLevel >= 20) {
                                                            handlePickACard(true);
                                                        }
                                                    }}
                                                    className="text-[9px] bg-gray-800/40 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white px-1.5 py-0.5 rounded uppercase font-bold transition-colors"
                                                    title="Sacrifice card for a Fool Stack"
                                                >
                                                    Sacrifice
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setCharacter(prev => ({
                                                    ...prev,
                                                    activeCards: prev.activeCards?.filter((_, i) => i !== idx)
                                                }))}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-600 italic text-[10px]">No cards currently active.</div>
                            )}
                        </div>

                        {cmLevel >= 4 && (
                            <div className="mt-4 pt-3 border-t border-gray-800/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fool Stacks</span>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setCharacter(prev => ({ ...prev, foolStacks: Math.max(0, (prev.foolStacks || 0) - 1) }))}
                                            className="w-5 h-5 flex items-center justify-center bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-bold text-purple-400 w-4 text-center">{foolStacks}</span>
                                        <button 
                                            onClick={() => setCharacter(prev => ({ ...prev, foolStacks: (prev.foolStacks || 0) + 1 }))}
                                            className="w-5 h-5 flex items-center justify-center bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <p className="text-[9px] text-gray-500 italic leading-tight flex-1">
                                        Sacrifice active cards to gain stacks. Expend all stacks to cast the Fool Spell.
                                    </p>
                                    {foolStacks > 0 && (
                                        <button 
                                            onClick={() => {
                                                const isWorldActive = character.activeCards?.some(c => c.name === 'The World');
                                                const isLevel20 = cmLevel >= 20;
                                                let diceCount = 3 + (isLevel20 ? foolStacks * 2 : foolStacks);
                                                if (isWorldActive) diceCount *= 2;
                                                
                                                roll(`${diceCount}d8`, 'The Fool Spell Damage');
                                                setCharacter(prev => ({ ...prev, foolStacks: 0 }));
                                            }}
                                            className="text-[9px] bg-purple-900/40 text-purple-300 border border-purple-700 hover:bg-purple-700 hover:text-white px-2 py-1 rounded uppercase font-black tracking-widest transition-colors"
                                        >
                                            Cast
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {character.exhaustion > 0 && (
                            <div className="mt-3 pt-2 border-t border-red-900/30 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-red-500 uppercase">Exhaustion Level</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-red-400">{character.exhaustion}</span>
                                    <button 
                                        onClick={() => setExhaustion(0)}
                                        className="text-[9px] bg-red-900/20 text-red-400 border border-red-900/40 hover:bg-red-900/40 hover:text-white px-1.5 py-0.5 rounded uppercase font-bold transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
            case 'saves':
                const situationalSaves = activeModifiers.filter(m => m.type === 'advantage' && m.target === 'saves' && m.filter);
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                         <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Saving Throws</h3></div>
                         <div className="space-y-1">{ABILITY_NAMES.map(stat => { 
                             const isProf = !!character.classes.some(c => c.definition.saving_throws.some(s => s.name === stat.substring(0,3).toUpperCase())); 
                             const mod = calculateModifier(getStat(stat)) + (isProf ? prof : 0) + globalSaveBonus; 
                             const hasFullAdv = activeModifiers.some(m => m.type === 'advantage' && (m.target === `${stat}_save` || (m.target === 'saves' && (!m.filter || m.filter.toLowerCase() === ABILITY_LABELS[stat].toLowerCase()))));
                             
                             return <SavingThrowRow key={stat} label={ABILITY_LABELS[stat]} stat={stat} isProf={isProf} mod={mod} advantage={hasFullAdv} onRoll={roll} onContextMenu={triggerRollMenu} />; 
                         })}</div>
                         {situationalSaves.length > 0 && (
                             <div className="mt-3 pt-2 border-t border-gray-800/50">
                                 <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Situational Advantages</span>
                                 <div className="flex flex-wrap gap-1">
                                     {situationalSaves.map((m, i) => (
                                         <span key={i} className="text-[8px] bg-gray-800/60 text-gray-500 px-1.5 py-0.5 rounded border border-gray-700/50">Adv vs {m.filter}</span>
                                     ))}
                                 </div>
                             </div>
                         )}
                    </div>
                );
            case 'skills':
                const situationalSkills = activeModifiers.filter(m => m.type === 'advantage' && m.target === 'skills' && m.filter);
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Skills</h3>
                        <div className="space-y-0.5">
                            {SKILL_LIST.map(skill => { 
                                const hasFeatureProf = activeModifiers.some(m => m.type === 'proficiency' && m.target === skill.name && m.category === 'skill');
                                const hasFeatureExpertise = activeModifiers.some(m => m.type === 'expertise' && m.target === skill.name);
                                
                                // Special logic for "Trust the Destiny"
                                const isCardMaster2 = character.classes.some(c => c.definition.index === 'card-master' && c.level >= 2);
                                const isTrustSkill = isCardMaster2 && (skill.name === 'Arcana' || skill.name === 'Religion');
                                
                                const isProf = character.skills.includes(skill.name) || hasFeatureProf || isTrustSkill; 
                                
                                // Expertise if already proficient and has the feature
                                const isExpertise = character.expertise?.includes(skill.name) || 
                                                  hasFeatureExpertise || 
                                                  (isTrustSkill && character.skills.includes(skill.name)); 
                                
                                const mod = calculateModifier(getStat(skill.ability)) + (isProf ? prof : 0) + (isExpertise ? prof : 0); 
                                const hasFullAdv = activeModifiers.some(m => m.type === 'advantage' && (m.target === skill.name.toLowerCase().replace(/\s+/g, '_') || (m.target === 'skills' && (!m.filter || m.filter.toLowerCase() === skill.name.toLowerCase())))) || isTrustSkill;

                                return <SkillRow key={skill.name} skill={skill.name} stat={skill.ability} isProf={isProf} isExpertise={isExpertise} mod={mod} advantage={hasFullAdv} onRoll={roll} onContextMenu={triggerRollMenu} />; 
                            })}
                        </div>
                        {situationalSkills.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-800/50">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Situational Advantages</span>
                                <div className="flex flex-wrap gap-1">
                                    {situationalSkills.map((m, i) => (
                                        <span key={i} className="text-[8px] bg-gray-800/60 text-gray-500 px-1.5 py-0.5 rounded border border-gray-700/50">Adv on {m.filter}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'proficiencies':
                const charLanguages = Array.from(new Set([...(character.languages || []), ...(character.race?.languages?.map(l => l.name) || [])]));
                const charTools = Array.from(new Set([...(character.toolProficiencies || [])]));
                const allProfs = Array.from(new Set([...character.classes.flatMap(c => c.definition.proficiencies.map(p => p.name)), ...(character.race?.starting_proficiencies?.map(p => p.name) || [])]));
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Proficiencies & Languages</h3>
                        <div className="text-xs text-gray-300 space-y-4">
                            <div><span className="font-bold text-gray-500 block mb-1 uppercase text-[10px] tracking-wider">Armor & Weapons</span><div className="flex flex-wrap gap-1">{allProfs.map((p, i) => (<span key={i} className="bg-gray-800/80 px-2 py-0.5 rounded text-gray-300 border border-gray-700/50">{cleanProficiencyName(p)}</span>))}</div></div>
                            {charTools.length > 0 && (<div><span className="font-bold text-gray-500 block mb-1 uppercase text-[10px] tracking-wider">Tools</span><div className="flex flex-wrap gap-1">{charTools.map(t => (<span key={t} className="bg-gray-800/80 px-2 py-0.5 rounded text-gray-300 border border-gray-700/50">{cleanProficiencyName(t)}</span>))}</div></div>)}
                            <div><span className="font-bold text-gray-500 block mb-1 uppercase text-[10px] tracking-wider">Languages</span><div className="flex flex-wrap gap-1">{charLanguages.map(l => <span key={l} className="bg-gray-800/80 px-2 py-0.5 rounded text-gray-300 border border-gray-700/50">{l}</span>)}</div></div>
                        </div>
                    </div>
                );
            case 'spells':
                if (false) return null; // Removed Wild Shape spellcasting restriction
                const widgetSlots = (Object.entries(character.spellSlots) as [string, {max: number, current: number}][]).map(([l, s]) => ({ level: parseInt(l), ...s })).filter(s => (s.max as number) > 0).sort((a, b) => a.level - b.level);
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-2 cursor-pointer hover:text-dnd-gold" onClick={() => setActiveTab('spells')}><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Spells</h3><span className="text-[10px] text-gray-500">View All &rarr;</span></div>
                        <div className="flex justify-between text-xs text-gray-300 mb-2"><span>DC: <strong className="text-white">{spellSave}</strong></span><span>Attack: <strong className="text-white">+{spellAttack}</strong></span></div>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">{widgetSlots.map(slot => (<div key={slot.level} className="flex gap-1 items-center"><span className="text-[9px] font-bold text-gray-500 w-4">{slot.level}</span><div className="flex gap-0.5 flex-wrap">{Array.from({length: slot.max}).map((_, i) => { const usedCount = (slot.max as number) - (slot.current as number); const isUsed = i < usedCount; return (<div key={i} className={`w-2.5 h-2.5 rounded-full border ${isUsed ? 'bg-dnd-red border-dnd-red' : 'bg-transparent border-gray-600'}`}></div>); })}</div></div>))}{widgetSlots.length === 0 && <span className="text-gray-500 text-[10px]">No slots.</span>}</div>
                    </div>
                );
            case 'inventory':
                const { cp, sp, ep, gp, pp } = character.currency;
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 h-min overflow-hidden flex flex-col`}>
                        <div className="flex justify-between items-center mb-2 cursor-pointer hover:text-dnd-gold" onClick={() => setActiveTab('inventory')}><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Inventory</h3><span className="text-[10px] text-gray-500">View All &rarr;</span></div>

                        <div className="mb-3 space-y-1"><div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase"><span>Encumbrance</span><span className={Number(currentWeight) > Number(maxWeight) ? 'text-dnd-red' : 'text-gray-400'}>{currentWeight} / {maxWeight} lb</span></div><div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden"><div className={`h-full ${Number(currentWeight) > Number(maxWeight) ? 'bg-dnd-red' : 'bg-gray-500'}`} style={{width: `${Math.min(100, (Number(currentWeight)/Number(maxWeight))*100)}%`}}></div></div></div>
                        <div className="grid grid-cols-5 gap-1">{[{ label: 'PP', val: pp }, { label: 'GP', val: gp, highlight: true }, { label: 'EP', val: ep }, { label: 'SP', val: sp }, { label: 'CP', val: cp }].map((c) => (<div key={c.label} className={`flex flex-col items-center p-1 rounded ${c.highlight ? 'bg-dnd-gold/10 border border-dnd-gold/30' : 'bg-gray-800/30 border border-gray-800/50'}`}><span className={`text-[8px] font-bold uppercase mb-0.5 ${c.highlight ? 'text-dnd-gold' : 'text-gray-500'}`}>{c.label}</span><span className={`text-[10px] font-bold leading-none ${c.highlight ? 'text-white' : 'text-gray-300'}`}>{c.val}</span></div>))}</div>
                    </div>
                );
            case 'actions': {
                const topAttacks = getAttacks().slice(0, 3);
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-2 cursor-pointer hover:text-dnd-gold" onClick={() => setActiveTab('actions')}>
                            <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Actions</h3>
                            <span className="text-[10px] text-gray-500">View All &rarr;</span>
                        </div>
                        <div className="space-y-1">{topAttacks.map((att, i) => (<div key={i} className="flex justify-between items-center text-xs text-gray-300"><span className="truncate w-24">{att.name}</span><span className="font-bold text-gray-400">+{att.hit || 0}</span></div>))}</div>
                    </div>
                );
            }
            case 'exhaustion':
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-dnd-red/30 rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-xs text-dnd-red uppercase tracking-widest">Exhaustion</h3>
                            {(character.exhaustion || 0) > 0 && (
                                <button 
                                    onClick={() => setExhaustion(0)}
                                    className="text-[9px] text-gray-500 hover:text-white uppercase font-bold"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(lvl => (
                                    <button 
                                        key={lvl} 
                                        onClick={() => setExhaustion(character.exhaustion === lvl ? lvl - 1 : lvl)}
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${lvl <= (character.exhaustion || 0) ? 'bg-dnd-red border-dnd-red text-white' : 'bg-gray-800 border-gray-600 text-gray-500 hover:border-dnd-red'}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Level {character.exhaustion || 0}</span>
                        </div>
                        {character.exhaustion && character.exhaustion > 0 && (
                            <div className="mt-2 text-[9px] text-gray-400 italic">
                                {character.exhaustion === 1 && "Disadvantage on ability checks"}
                                {character.exhaustion === 2 && "Speed halved"}
                                {character.exhaustion === 3 && "Disadvantage on attack rolls and saving throws"}
                                {character.exhaustion === 4 && "Hit point maximum halved"}
                                {character.exhaustion === 5 && "Speed reduced to 0"}
                                {character.exhaustion === 6 && "Death"}
                            </div>
                        )}
                    </div>
                );
            case 'rules':
                return (<div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}><div className="flex justify-between items-center mb-2 cursor-pointer hover:text-dnd-gold" onClick={() => setActiveTab('rules')}><h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest">Rules</h3><span className="text-[10px] text-gray-500">View All &rarr;</span></div><div className="grid grid-cols-2 gap-2"><button onClick={() => setActiveTab('rules')} className="bg-gray-800/60 border border-gray-600 rounded p-1 text-[10px] hover:border-dnd-gold">Conditions</button><button onClick={() => setActiveTab('rules')} className="bg-gray-800/60 border border-gray-600 rounded p-1 text-[10px] hover:border-dnd-gold">General</button></div></div>);
            case 'senses':
                const passPerc = 10 + calculateModifier(getStat('wis')) + (character.skills.includes('Perception') ? prof : 0) + (character.expertise?.includes('Perception') ? prof : 0);
                const passInv = 10 + calculateModifier(getStat('int')) + (character.skills.includes('Investigation') ? prof : 0) + (character.expertise?.includes('Investigation') ? prof : 0);
                const passIns = 10 + calculateModifier(getStat('wis')) + (character.skills.includes('Insight') ? prof : 0) + (character.expertise?.includes('Insight') ? prof : 0);
                const dv = (character.race?.traits?.find(t => t.index === 'darkvision') ? '60ft' : 'None');
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                         <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Senses</h3>
                         <div className="grid grid-cols-2 gap-y-2 text-xs"><div className="flex items-center gap-2"><span className="bg-gray-800 w-6 h-6 flex items-center justify-center rounded font-bold text-white border border-gray-600">{passPerc}</span><span className="text-gray-400">Passive Percep.</span></div><div className="flex items-center gap-2"><span className="bg-gray-800 w-6 h-6 flex items-center justify-center rounded font-bold text-white border border-gray-600">{passIns}</span><span className="text-gray-400">Passive Insight</span></div><div className="flex items-center gap-2"><span className="bg-gray-800 w-6 h-6 flex items-center justify-center rounded font-bold text-white border border-gray-600">{passInv}</span><span className="text-gray-400">Passive Invest.</span></div><div className="flex items-center gap-2"><span className="bg-gray-800 w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold text-white border border-gray-600 italic">DV</span><span className="text-gray-400">Darkvision: {dv}</span></div></div>
                    </div>
                );
            case 'movement':
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3 relative`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Movement</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <SquareStatBox 
                                label="Walking" 
                                subLabel="Speed" 
                                value={`${speed} ft.`} 
                                tooltip={
                                    <div className="space-y-1">
                                        {speedBreakdown.map((entry, i) => (
                                            <div key={i} className="flex justify-between text-[10px]">
                                                <span className="text-gray-400">{entry.label}</span>
                                                <span className="text-white font-mono">{entry.value}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px] font-bold">
                                            <span className="text-dnd-gold">Total</span>
                                            <span className="text-white">{speed} ft.</span>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                );
            case 'defenses':
                const res = activeModifiers.filter(m => m.type === 'resistance').map(m => String(m.value));
                const imm = activeModifiers.filter(m => m.type === 'immunity').map(m => String(m.value));
                const advDef = activeModifiers.filter(m => m.type === 'advantage' && (m.target === 'saves' || m.target === 'skills') && m.filter).map(m => String(m.filter));
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Defenses</h3>
                        <div className="flex flex-wrap gap-1">
                            {res.map(r => (<span key={`res-${r}`} className="bg-blue-900/30 border border-blue-800/50 px-1.5 py-0.5 rounded text-[9px] text-blue-200 font-bold uppercase">Resist: {r}</span>))}
                            {imm.map(i => (<span key={`imm-${i}`} className="bg-purple-900/30 border border-purple-800/50 px-1.5 py-0.5 rounded text-[9px] text-purple-200 font-bold uppercase">Immune: {i}</span>))}
                            {advDef.map(a => (<span key={`adv-${a}`} className="bg-green-900/30 border border-green-800/50 px-1.5 py-0.5 rounded text-[9px] text-green-200 font-bold uppercase">Adv vs {a}</span>))}
                            {res.length === 0 && imm.length === 0 && advDef.length === 0 && <span className="text-gray-600 text-xs italic">No special defenses.</span>}
                        </div>
                    </div>
                );
            case 'conditions':
                const sortedConditions = [...STANDARD_CONDITIONS].sort((a, b) => {
                    const aActive = activeConditions.includes(a) || (a === 'Exhaustion' && (character.exhaustion || 0) > 0);
                    const bActive = activeConditions.includes(b) || (b === 'Exhaustion' && (character.exhaustion || 0) > 0);
                    return (bActive ? 1 : 0) - (aActive ? 1 : 0);
                });
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Condition Tracker</h3>
                        <div className="flex flex-wrap gap-1">
                            {sortedConditions.map(c => {
                                const isActive = activeConditions.includes(c) || (c === 'Exhaustion' && (character.exhaustion || 0) > 0);
                                return (
                                    <button 
                                        key={c} 
                                        onClick={() => {
                                            if (c === 'Exhaustion' && (character.exhaustion || 0) > 0) {
                                                // If exhaustion is from cards, maybe we shouldn't allow toggling it here?
                                                // Or we toggle the manual condition.
                                            }
                                            setActiveConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
                                        }} 
                                        className={`px-2 py-1 rounded text-[9px] uppercase font-bold border transition-colors ${isActive ? 'bg-dnd-red border-dnd-red text-white' : 'bg-[#0b0c0e] border-gray-800 text-gray-700 hover:text-gray-500'}`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'hitDice':
                const dieGroups: Record<string, { max: number, spent: number }> = {};
                character.classes.forEach(c => { const size = String(c.definition.hit_die); if (!dieGroups[size]) dieGroups[size] = { max: 0, spent: 0 }; dieGroups[size].max += c.level; dieGroups[size].spent = character.hitDiceUsage[size] || 0; });
                return (
                    <div key={widgetKey} className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-lg p-3`}>
                        <h3 className="font-bold text-xs text-dnd-gold uppercase tracking-widest mb-2">Hit Dice</h3>
                        <div className="space-y-3">{Object.entries(dieGroups).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([size, usage]) => (<div key={size} className="space-y-1"><div className="flex justify-between text-[10px] font-bold uppercase text-gray-500"><span>d{size}</span><span>{usage.max - usage.spent} / {usage.max} remaining</span></div><div className="flex flex-wrap gap-1">{Array.from({ length: usage.max }).map((_, i) => (<div key={i} onClick={() => { const newSpent = i < usage.spent ? i : i + 1; setCharacter(prev => ({...prev, hitDiceUsage: { ...prev.hitDiceUsage, [size]: newSpent }})); }} className={`w-3 h-3 rounded-full border cursor-pointer transition-all ${i < usage.spent ? 'bg-[#0b0c0e] border-gray-800' : 'bg-dnd-red/20 border-dnd-red/50 hover:border-dnd-red'}`}/>))}</div></div>))}</div>
                    </div>
                );
            default: return null;
        }
    };
    
    const getAttacks = () => {
        const attacks: any[] = [];
        const overrides = character.combatOverrides || { hitBonus: 0, damageBonus: 0, hitOverride: null, damageOverride: null };

        // Helper to apply overrides
        const applyOverrides = (baseHit: number | null, baseDamage: string) => {
            let finalHit = baseHit;
            let finalDamage = baseDamage;

            if (finalHit !== null) {
                if (overrides.hitOverride !== null && overrides.hitOverride !== undefined) {
                    finalHit = overrides.hitOverride;
                } else {
                    finalHit += (overrides.hitBonus || 0);
                }
            }

            if (overrides.damageOverride !== null && overrides.damageOverride !== undefined) {
                const diceMatch = baseDamage.match(/^(\d+d\d+)/);
                if (diceMatch) {
                    finalDamage = `${diceMatch[1]}${formatModifier(overrides.damageOverride)}`;
                } else {
                    finalDamage = formatModifier(overrides.damageOverride);
                }
            } else if (overrides.damageBonus && overrides.damageBonus !== 0) {
                const modMatch = baseDamage.match(/([+-]\d+)$/);
                if (modMatch) {
                    const currentMod = parseInt(modMatch[1]);
                    const newMod = currentMod + overrides.damageBonus;
                    finalDamage = baseDamage.replace(/[+-]\d+$/, formatModifier(newMod));
                } else {
                    finalDamage = `${baseDamage}${formatModifier(overrides.damageBonus)}`;
                }
            }

            return { hit: finalHit, damage: finalDamage };
        };

        const monk = character.classes.find(c => c.definition.index === 'monk');
        let unarmedDie = '1';
        let unarmedHitMod = strMod;
        if (monk) {
            const ml = monk.level;
            if (ml >= 17) unarmedDie = '1d12';
            else if (ml >= 11) unarmedDie = '1d10';
            else if (ml >= 5) unarmedDie = '1d8';
            else unarmedDie = '1d6';
            unarmedHitMod = Math.max(strMod, dexMod);
        }

        const { hit: unarmedHit, damage: unarmedDmg } = applyOverrides(prof + unarmedHitMod, `${unarmedDie}${formatModifier(unarmedHitMod)}`);
        attacks.push({ id: 'action-unarmed', name: 'Unarmed Strike', range: '5 ft.', hit: unarmedHit, damage: unarmedDmg, type: 'Bludgeoning', notes: [], source: { name: 'Unarmed Strike', desc: 'A punch, kick, head-butt, or similar forceful blow.' } });
        
        // --- Card Master: The Fool Spell ---
        const cmClass = character.classes.find(c => c.definition.index === 'card-master');
        if (cmClass && cmClass.level >= 4 && (character.foolStacks || 0) > 0) {
            const foolStacks = character.foolStacks || 0;
            const isWorldActive = character.activeCards?.some(c => c.name === 'The World');
            const isLevel20 = cmClass.level >= 20;
            
            let diceCount = 3 + (isLevel20 ? foolStacks * 2 : foolStacks);
            if (isWorldActive) diceCount *= 2;
            
            const damageDice = `${diceCount}d8`;
            const { hit: foolHit, damage: foolDmg } = applyOverrides(null, damageDice);
            attacks.push({
                id: 'action-fool-spell',
                name: 'The Fool Spell',
                range: '20 ft radius',
                hit: foolHit,
                save: { dc: spellSave, type: 'WIS' },
                damage: foolDmg,
                type: 'Necrotic',
                notes: [`Consumes all ${foolStacks} Fool Stacks on use.`, 'Half damage on save.'],
                source: { 
                    name: 'The Fool Spell', 
                    desc: [
                        `As an action, you expend all ${foolStacks} Fool Stacks to cast this spell.`,
                        `The spell deals ${damageDice} necrotic damage in a 20-foot radius. Targets that pass a Wisdom Saving Throw take half damage.`
                    ],
                    level: 0,
                    school: { index: 'necromancy', name: 'Necromancy' },
                    casting_time: '1 Action',
                    range: '20 ft radius',
                    components: ['V', 'S'],
                    duration: 'Instantaneous'
                }
            });
        }
        
        // --- Arrowsmith Specific Arrows ---
        const arrowsmithCls = character.classes.find(c => c.definition.index === 'arrowsmith');
        if (arrowsmithCls) {
            const lvl = arrowsmithCls.level;
            const asDC = 8 + prof + intMod;
            const bow = character.inventory.find(i => i.equipped && (i.name.toLowerCase().includes('bow') || i.name.toLowerCase().includes('crossbow')));
            const rangeStr = bow?.range || '80/320 ft.';
            
            // Made to Kill Bonus: +1 at 10, +2 at 15, +3 at 20
            const mtkBonus = lvl >= 20 ? 3 : lvl >= 15 ? 2 : lvl >= 10 ? 1 : 0;
            // Trained Archer Bonus (Lvl 17): Add Int to hit/dmg
            const taBonus = lvl >= 17 ? intMod : 0;
            
            const bowHit = prof + dexMod + mtkBonus + taBonus;
            const bowDmg = bow?.damage?.damage_dice || '1d8';
            const baseDmgBonus = dexMod + mtkBonus + taBonus;
            const finalBowDmg = `${bowDmg}${formatModifier(baseDmgBonus)}`;

            // Arrowsmith Master Reference
            const allArrowDefinitions = [
                { name: 'Silent', desc: 'Hidden hits don\'t reveal position. Crits on surprised.', extraNotes: ['Crit Surprised'], level: 1 },
                { name: 'Forceful', desc: 'On hit, STR Save DC ' + asDC + ' or pushed 20ft.', save: { type: 'STR', dc: asDC }, level: 1 },
                { name: 'Fire', desc: 'Extra 1d10 fire. Ignites for 1d6/turn (DC 10 Dex).', dmgPlus: '+1d10', type: 'Fire', level: 1 },
                { name: 'Shattering', desc: '10ft cone behind target. DEX Save ' + asDC + ' half.', save: { type: 'DEX', dc: asDC }, level: 2 },
                { name: 'Smokescreen', desc: 'Creates 20ft fog sphere centered on hit. 1 min.', type: 'Other', level: 2 },
                { name: 'Light', desc: 'Bonus action attack. Ignore reload.', type: 'Piercing', notes: ['Bonus Action', 'Ignore Reload'], level: 3 },
                { name: 'Sniper', desc: 'Double normal and long range for this shot.', rangeLabel: 'Double Range', level: 3 },
                { name: 'Piercing', desc: 'Pierce 20ft line. Ignore resistance.', notes: ['Ignore Resist'], level: 4 },
                { name: 'Blinding', desc: 'Explodes after 10-30ft. CON Save ' + asDC + ' or Blinded.', save: { type: 'CON', dc: asDC }, level: 4 },
                { name: 'Explosive', desc: '5d6 Force AoE (Dex Save ' + asDC + ' half).', dmg: '5d6' + formatModifier(baseDmgBonus), type: 'Force', save: { type: 'DEX', dc: asDC }, level: 5 },
                { name: 'Knockdown', desc: 'On hit, STR Save ' + asDC + ' or knocked prone.', save: { type: 'STR', dc: asDC }, level: 5 },
                // Specialization: Magic
                { name: 'Elemental', spec: 'magic-as', desc: '+2d6 Cold/Fire/Lit/Necro/Rad.', dmgPlus: '+2d6', level: 5 },
                { name: 'Spectral', spec: 'magic-as', desc: 'Traverses matter. Ignore all cover.', notes: ['Ignore Cover'], level: 6 },
                { name: 'Cursed', spec: 'magic-as', desc: '+1d8 Necrotic. No healing for target.', dmgPlus: '+1d8', type: 'Necrotic', level: 7 },
                { name: 'Seeking', spec: 'magic-as', desc: 'Auto-hit any opponent you see.', hit: null, notes: ['Auto-Hit'], level: 8 },
                { name: 'Shifter', spec: 'magic-as', desc: 'Teleport to arrow location (Max 50ft).', level: 9 },
                // Specialization: Toxins
                { name: 'Intoxicating', spec: 'toxins-as', desc: 'Disadv on attacks until end of next turn.', notes: ['Debuff'], level: 5 },
                { name: 'Paralytic', spec: 'toxins-as', desc: 'Con Save DC ' + asDC + ' or Paralyzed.', save: { type: 'CON', dc: asDC }, level: 6 },
                { name: 'Toxic Cloud', spec: 'toxins-as', desc: '15ft cloud. Con Save or 1d10 Poison + Stunned.', save: { type: 'CON', dc: asDC }, level: 7 },
                { name: 'Furious', spec: 'toxins-as', desc: 'Wis Save DC ' + asDC + ' or attack closest.', save: { type: 'WIS', dc: asDC }, level: 8 },
                { name: 'Sleeping', spec: 'toxins-as', desc: '1d6s vs HP. Success = Sleep.', level: 9 },
                // Specialization: Support
                { name: 'Healing', spec: 'support-as', desc: 'Heals target for half damage rolled.', dmg: `(${bowDmg}/2)${formatModifier(Math.floor(baseDmgBonus/2))}`, type: 'Healing', level: 5 },
                { name: 'Vigorous', spec: 'support-as', desc: 'Grant Int+Prof Temp HP and +2 AC.', type: 'Buff', level: 6 },
                { name: 'Anti-Healing', spec: 'support-as', desc: 'Target cannot regain health for 1 min.', level: 7 },
                { name: 'Adrenaline', spec: 'support-as', desc: '+15ft move and Adv on attacks/saves.', type: 'Buff', level: 8 },
                { name: 'Affection', spec: 'support-as', desc: 'Wis Save DC ' + asDC + ' or Charmed.', save: { type: 'WIS', dc: asDC }, level: 9 }
            ];

            // Only show arrows that are actually in the inventory (quantity > 0)
            const arrowInventory = character.inventory.filter(i => i.id.startsWith('as-arrow-') && i.quantity > 0);
            
            arrowInventory.forEach(invItem => {
                // Extract base name from ID as-arrow-silent -> silent
                const arrowBaseName = invItem.id.replace('as-arrow-', '').replace(/-/g, ' ');
                const def = allArrowDefinitions.find(d => d.name.toLowerCase() === arrowBaseName);
                
                if (def && def.level <= lvl) {
                    const { hit: arrowHit, damage: arrowDmg } = applyOverrides(def.hit === null ? null : bowHit, def.dmg || (def.dmgPlus ? `${bowDmg}${def.dmgPlus}${formatModifier(baseDmgBonus)}` : finalBowDmg));
                    attacks.push({ 
                        id: invItem.id, 
                        name: `${def.name} Arrow`, 
                        range: def.rangeLabel || rangeStr, 
                        hit: arrowHit, 
                        damage: arrowDmg, 
                        type: def.type || 'Piercing', 
                        save: def.save || null,
                        notes: ['Arrowsmith', `Qty: ${invItem.quantity}`, ...(def.notes || [])], 
                        source: { name: `${def.name} Arrow`, desc: def.desc } 
                    });
                }
            });
        }

        character.inventory.forEach(item => {
            if (!item.equipped || !item.damage || item.id.startsWith('as-arrow-')) return;
            
            const properties = item.properties?.map(p => typeof p === 'string' ? p : p.name) || [];
            const isFinesse = properties.includes('Finesse');
            const isThrown = item.isThrown || properties.includes('Thrown') || (item.range && item.weapon_range !== 'Ranged' && !item.weapon_category?.toLowerCase().includes('ranged'));
            const isReach = properties.includes('Reach');
            const isRanged = item.weapon_range === 'Ranged' || item.weapon_category?.toLowerCase().includes('ranged') || item.equipment_category?.name?.toLowerCase().includes('ranged') || properties.includes('Ammunition');
            const isMonkWeapon = item.isMonkWeapon || item.isKenseiWeapon || (monk && (item.equipment_category?.index === 'weapon' && (Library.getItem(item.index || '')?.properties?.some(p => (typeof p === 'string' ? p : p.index) === 'simple') || item.name === 'Shortsword')));
            
            // Special Attack Modifiers
            const isMagic = item.requires_attunement || (item.modifiers && item.modifiers.length > 0) || item.isInfusion;
            const canUseInt = item.isBattleReady && isMagic;
            const canUseCha = item.isHexWeapon || item.isPactWeapon;
            const canUseWis = item.isShillelagh;
            
            let statMod = strMod;
            if (isFinesse || isMonkWeapon) statMod = Math.max(statMod, dexMod);
            if (canUseInt) statMod = Math.max(statMod, intMod);
            if (canUseCha) statMod = Math.max(statMod, chaMod);
            if (canUseWis) statMod = Math.max(statMod, wisMod);
            
            let hitBonus = 0; let damageBonus = 0;
            item.modifiers?.forEach(mod => { if (mod.type === 'bonus') { if (mod.target === 'attack') hitBonus += Number(mod.value); if (mod.target === 'damage') damageBonus += Number(mod.value); } });
            
            const fightingStyles = character.classFeatures.filter(f => f.name.includes('Fighting Style'));
            fightingStyles.forEach(fs => { 
                const desc = fs.desc?.join(' ') || ''; 
                if (desc.includes('Archery') && (properties.includes('Ammunition') || (isRanged && item.range))) hitBonus += 2; 
                if (desc.includes('Dueling') && !properties.includes('Two-Handed')) damageBonus += 2; 
            });
            
            let damageDice = item.damage.damage_dice;
            if (item.isShillelagh) damageDice = '1d8';
            if (isMonkWeapon && parseInt(unarmedDie.slice(2)) > (parseInt(damageDice.match(/d(\d+)/)?.[1] || '0'))) {
                damageDice = unarmedDie;
            }

            let baseRangeVal = isRanged ? (typeof item.range === 'string' ? item.range : (item.range ? `${item.range.normal}${item.range.long ? `/${item.range.long}` : ''} ft.` : '')) : (isReach ? '10 ft.' : '5 ft.');
            let rangeStr = baseRangeVal;
            
            if (typeof item.range === 'string' && !isRanged && item.range.includes('(')) {
                rangeStr = item.range;
            } else if (isThrown) {
                let tr = '';
                if (item.thrownRange) {
                    tr = item.thrownRange.includes('ft') ? item.thrownRange : `${item.thrownRange} ft.`;
                } else if (item.range) {
                    if (typeof item.range === 'string') {
                        if (item.range !== '5 ft.' && item.range !== '10 ft.') {
                            tr = item.range;
                        }
                    } else if (item.range.normal) {
                        tr = `${item.range.normal}${item.range.long ? `/${item.range.long}` : ''} ft.`;
                    }
                }
                
                if (tr && tr !== baseRangeVal) {
                    if (!isRanged) {
                        if (!rangeStr.includes(tr)) {
                            rangeStr = `${baseRangeVal} (${tr})`;
                        }
                    } else {
                        rangeStr = tr;
                    }
                }
            }

            const damageType = item.isShillelagh ? 'Bludgeoning' : (typeof item.damage.damage_type === 'string' ? item.damage.damage_type : item.damage.damage_type.name);
            const notes = [...(item.properties?.map(p => typeof p === 'string' ? p : p.name) || [])];
            if (item.isMonkWeapon) notes.push('Monk Weapon');
            if (item.isPactWeapon) notes.push('Pact Weapon');
            if (item.isKenseiWeapon) notes.push('Kensei Weapon');
            if (item.isHexWeapon) notes.push('Hex Weapon');
            if (item.isShillelagh) notes.push('Shillelagh');
            if (item.isBattleReady) notes.push('Battle Ready');
            if (isThrown && !notes.includes('Thrown')) notes.push('Thrown');

            const baseHit = prof + statMod + hitBonus;
            const baseDamage = `${damageDice}${formatModifier(statMod + damageBonus)}`;
            
            const { hit: finalHit, damage: finalDamage } = applyOverrides(baseHit, baseDamage);

            // If thrown damage differs, show it in damage string or notes?
            // User said: "and the damage roll (if it differs) + the thrown range"
            let displayDamage = finalDamage;
            if (isThrown && item.thrownDamage && item.thrownDamage !== damageDice) {
                const { damage: finalThrownDamage } = applyOverrides(null, `${item.thrownDamage}${formatModifier(statMod + damageBonus)}`);
                displayDamage = `${finalDamage} / ${finalThrownDamage}`;
            }

            attacks.push({ id: item.id, name: item.name, range: rangeStr, hit: finalHit, damage: displayDamage, type: damageType, notes: notes, source: item });
        });

        character.spells.forEach(spell => {
            const desc = spell.desc?.join(' ').toLowerCase() || '';
            if (desc.includes('spell attack') || spell.attack_type !== undefined) {
                const dmgStr = getSpellDamageString(spell, character.level, spell.level || 1);
                const dc = (spell as any).dc?.dc_type?.name?.substring(0, 3).toUpperCase();
                const { hit: spellHit, damage: spellDmg } = applyOverrides(spellAttack, dmgStr || 'See Desc');
                attacks.push({ id: spell.index, name: spell.name, range: spell.range, hit: spellHit, save: dc ? { dc: spellSave, type: dc } : null, damage: spellDmg, type: spell.damage?.damage_type?.name || 'Magic', notes: [spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`], source: spell });
            }
        });
        character.customActions?.forEach(action => {
            let hit: number | null = null;
            let save: { type: string, dc: number } | null = null;

            if (action.saveDC !== undefined) {
                save = { 
                    type: action.saveAbility?.toUpperCase() || 'DC', 
                    dc: action.saveDC 
                };
            } else if (action.hit !== undefined) {
                hit = action.hit;
            } else if (action.ability) {
                const mod = calculateModifier(getStat(action.ability));
                hit = (action.isProficient ? prof : 0) + mod + (action.bonus || 0);
            }

            const { hit: finalHit, damage: finalDamage } = applyOverrides(hit, action.damage || '0');

            attacks.push({ 
                id: action.id, 
                name: action.name, 
                range: action.range || '-', 
                hit: finalHit,
                save,
                damage: finalDamage,
                type: action.damageType || 'Other',
                notes: [action.type],
                source: action
            });
        });

        return attacks;
    };

    const enrichFeature = (f_item: any) => {
        if (f_item.index === 'the-fool') {
            const cmClass = character.classes.find(c => c.definition.index === 'card-master');
            const foolStacks = character.foolStacks || 0;
            const isWorldActive = character.activeCards?.some(c => c.name === 'The World');
            const isLevel20 = (cmClass?.level || 0) >= 20;
            
            let diceCount = 3 + (isLevel20 ? foolStacks * 2 : foolStacks);
            if (isWorldActive) diceCount *= 2;
            
            const damageDice = `${diceCount}d8`;
            
            return {
                ...f_item,
                damage: damageDice,
                save: { dc: spellSave, type: 'WIS' },
                desc: [
                    "As an action, you can sacrifice an active card to gain a Fool Stack. You can expend all stacks to cast the Fool Spell.",
                    `The spell deals ${damageDice} necrotic damage in a 20-foot radius. For every Fool Stack consumed, the damage increases by 1d8 (or 2d8 at level 20). If 'The World' card is active, the total damage is doubled. Targets that pass a Wisdom Saving Throw take half damage.`
                ]
            };
        }

        const isChoice = f_item.name.includes(': ');
        const baseName = isChoice ? f_item.name.split(': ')[0] : f_item.name.replace(/\s*\(.*?\)/, '').trim();
        const selection = isChoice ? f_item.name.split(': ')[1] : null;

        if (isChoice) {
            for(const c_item of Library.getClasses()) {
                const match_f = c_item.feature_details.find(fd => fd.index === f_item.index || fd.name === baseName);
                if(match_f && match_f.effects) {
                    const choiceEff = match_f.effects.find(e => e.type === 'feature_choice' || e.type === 'proficiency_choice');
                    if (choiceEff && choiceEff.options) {
                        const opt = choiceEff.options.find((o: any) => o.name === selection || o.item?.name === selection);
                        if (opt && opt.desc) return { ...f_item, desc: [opt.desc] };
                    }
                }
            }
        }

        if (f_item.desc && Array.isArray(f_item.desc) && f_item.desc.length > 0 && !isChoice) return f_item;
        
        for(const c_item of Library.getClasses()) {
            const match_f = c_item.feature_details.find(fd => fd.index === f_item.index || fd.name === baseName);
            if(match_f && match_f.desc) return { ...f_item, desc: match_f.desc };
        }

        for(const s_item of Library.getSubclasses()) {
            const match_s = s_item.feature_details.find(fd => fd.index === f_item.index || fd.name === baseName);
            if(match_s && match_s.desc) return { ...f_item, desc: match_s.desc };
        }

        for(const r_item of Library.getRaces()) {
            const match_r = r_item.traits.find(tr => tr.index === f_item.index || tr.name === f_item.name);
            if(match_r && match_r.desc) return { ...f_item, desc: match_r.desc };
            if(r_item.subraces_details) {
                for(const sub_item of r_item.subraces_details) {
                    const match_st = sub_item.traits.find(tr => tr.index === f_item.index || tr.name === f_item.name);
                    if(match_st && match_st.desc) return { ...f_item, desc: match_st.desc };
                }
            }
        }

        const feat_item = Library.getFeat(f_item.index);
        if(feat_item && feat_item.desc) return { ...f_item, desc: feat_item.desc };
        
        return f_item;
    };

    const getBonusActions = () => {
         const list: any[] = [];
         
         // 1. Spells with bonus action casting time
         character.spells.forEach(spell => { 
             if (spell.casting_time.toLowerCase().includes('bonus')) {
                 list.push({ 
                     id: spell.index, 
                     name: spell.name, 
                     category: 'Action', 
                     desc: `Cast ${spell.name} as a bonus action.`, 
                     source: spell 
                 }); 
             }
         });

         // 2. Hardcoded common bonus actions (for features that might not have explicit "bonus action" text or need specific handling)
         const classes = character.classes.map(c => c.definition.name.toLowerCase());
         if (classes.includes('bard')) list.push(enrichFeature({ id: 'feature-bardic-inspiration', index: 'bardic-inspiration', name: 'Bardic Inspiration', category: 'Action' }));
         if (classes.includes('barbarian')) list.push(enrichFeature({ id: 'feature-rage', index: 'rage', name: 'Rage', category: 'Action' }));
         if (classes.includes('fighter')) list.push(enrichFeature({ id: 'feature-second-wind', index: 'second-wind', name: 'Second Wind', category: 'Action' }));
         if (classes.includes('rogue') && character.level >= 2) list.push(enrichFeature({ id: 'feature-cunning-action', index: 'cunning-action', name: 'Cunning Action', category: 'Action' }));
         
         const monk = character.classes.find(c => c.definition.index === 'monk');
         if (monk && monk.level >= 2) {
            list.push(enrichFeature({ id: 'feature-flurry-of-blows', index: 'flurry-of-blows', name: 'Flurry of Blows', category: 'Action' }));
            list.push(enrichFeature({ id: 'feature-patient-defense', index: 'patient-defense', name: 'Patient Defense', category: 'Action' }));
            list.push(enrichFeature({ id: 'feature-step-of-the-wind', index: 'step-of-the-wind', name: 'Step of the Wind', category: 'Action' }));
         }

         const paladin = character.classes.find(c => c.definition.index === 'paladin');
         if (paladin) {
             if (paladin.level >= 1) list.push(enrichFeature({ id: 'feature-lay-on-hands', index: 'lay-on-hands-2024', name: 'Lay on Hands', category: 'Action' }));
             if (paladin.level >= 2) list.push(enrichFeature({ id: 'feature-paladins-smite', index: 'paladins-smite', name: "Paladin's Smite", category: 'Action' }));
         }

         const ranger = character.classes.find(c => c.definition.index === 'ranger');
         if (ranger && ranger.level >= 14) {
             list.push(enrichFeature({ id: 'feature-natures-veil', index: 'natures-veil', name: "Nature's Veil", category: 'Action' }));
         }
         
         const rogue = character.classes.find(c => c.definition.index === 'rogue');
         if (rogue && rogue.level >= 3) {
             list.push(enrichFeature({ id: 'feature-steady-aim', index: 'steady-aim', name: "Steady Aim", category: 'Action' }));
         }

         const sorcerer = character.classes.find(c => c.definition.index === 'sorcerer');
         if (sorcerer && sorcerer.level >= 1) {
             list.push(enrichFeature({ id: 'feature-innate-sorcery', index: 'innate-sorcery', name: "Innate Sorcery", category: 'Action' }));
         }

         const bloodHunter = character.classes.find(c => c.definition.index === 'blood-hunter');
         if (bloodHunter && bloodHunter.level >= 2) {
             list.push(enrichFeature({ id: 'feature-crimson-rite', index: 'crimson-rite', name: "Crimson Rite", category: 'Action' }));
         }

         const pugilist = character.classes.find(c => c.definition.index === 'pugilist');
         if (pugilist) {
             if (pugilist.level >= 1) list.push(enrichFeature({ id: 'feature-fisticuffs', index: 'fisticuffs', name: "Fisticuffs", category: 'Action' }));
             if (pugilist.level >= 4) list.push(enrichFeature({ id: 'feature-dig-deep', index: 'dig-deep', name: "Dig Deep", category: 'Action' }));
             if (pugilist.level >= 7) list.push(enrichFeature({ id: 'feature-shake-it-off', index: 'shake-it-off', name: "Shake It Off", category: 'Action' }));
         }

         const druid = character.classes.find(c => c.definition.index === 'druid');
         if (druid && druid.subclass?.index === 'circle-of-the-moon') {
             list.push(enrichFeature({ id: 'feature-combat-wild-shape', index: 'combat-wild-shape', name: "Combat Wild Shape", category: 'Action' }));
         }

         const cardMaster = character.classes.find(c => c.definition.index === 'card-master');
         if (cardMaster) {
             const lvl = cardMaster.level;
             list.push(enrichFeature({ id: 'feature-pick-a-card', index: 'pick-a-card', name: 'Pick a Card', category: 'Action' }));
             if (lvl >= 2) list.push(enrichFeature({ id: 'feature-trust-destiny', index: 'trust-the-destiny', name: 'Trust the Destiny', category: 'Action' }));
             if (lvl >= 2) list.push(enrichFeature({ id: 'feature-chiromancy', index: 'chiromancy', name: 'Chiromancy', category: 'Action' }));
             if (lvl >= 7) list.push(enrichFeature({ id: 'feature-mystic-shuffle', index: 'mystic-shuffle', name: 'Mystic Shuffle', category: 'Action' }));
             if (lvl >= 8) list.push(enrichFeature({ id: 'feature-foresight-touch', index: 'chiromancy-lines-of-fate', name: 'Foresight Touch', category: 'Action' }));
             if (lvl >= 10) list.push(enrichFeature({ id: 'feature-the-world', index: 'the-world', name: 'The World', category: 'Action' }));
         }

         // 3. Dynamic scanning of all class features for "bonus action" keywords
         character.classFeatures.forEach(feat => {
             // Skip if already in list
             if (list.some(item => item.index === feat.index || item.name === feat.name)) return;

             const enriched = enrichFeature(feat);
             const descStr = Array.isArray(enriched.desc) 
                ? enriched.desc.join(' ').toLowerCase() 
                : (enriched.desc || '').toLowerCase();
             
             if (descStr.includes('bonus action')) {
                 list.push({ 
                     ...enriched, 
                     id: enriched.id || `feature-${enriched.index || enriched.name.toLowerCase().replace(/\s+/g, '-')}`,
                     category: 'Action' 
                 });
             }
         });

         // 4. Custom Actions
         character.customActions?.forEach(action => {
            if (action.activationType === 'bonus') {
                list.push({ 
                    id: action.id, 
                    name: action.name, 
                    category: 'Custom', 
                    desc: action.description || action.desc || '', 
                    source: { ...action, category: 'Custom' } 
                });
            }
        });

         return list;
    };


    const tabIcons: Record<string, React.ReactNode> = {
        actions: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>,
        spells: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>,
        inventory: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>,
        features: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="17" r="5"/></svg>,
        rules: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
        log: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/></svg>,
        stats: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>,
        choices: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 10h6"/><path d="M9 18h6"/></svg>
    };

    const getAllFeaturesSorted = () => {
         const list: any[] = [];
         
        character.classFeatures.forEach((feat, idx) => list.push({ ...enrichFeature(feat), type: 'Class', uniqueId: `class-${feat.index}-${feat.level}-${idx}` }));
        character.feats.forEach((feat, idx) => list.push({ ...enrichFeature(feat), type: 'Feat', source: 'Feat', level: '-', uniqueId: `feat-${feat.index}-${idx}` }));
        character.race?.traits.forEach((trait, idx) => list.push({ ...enrichFeature(trait), type: 'Race', source: character.race?.name, level: '-', uniqueId: `race-${trait.index}-${idx}` }));
        character.subrace?.traits.forEach((trait, idx) => list.push({ ...enrichFeature(trait), type: 'Race', source: character.subrace?.name, level: '-', uniqueId: `subrace-${trait.index}-${idx}` }));
        
        return list.sort((a,b) => {
             if (a.type !== b.type) return a.type.localeCompare(b.type);
             const la = parseInt(a.level) || 0;
             const lb = parseInt(b.level) || 0;
             return la - lb || a.name.localeCompare(b.name);
        });
    };

    const cmClass = character.classes.find(c => c.definition.index === 'card-master');
    const cmLevel = cmClass ? cmClass.level : 0;

    return (
        <div className="flex flex-col h-full text-gray-200 overflow-hidden font-scalable relative" style={{ '--sheet-scale': character.fontScale || 1.0, backgroundColor: character.backgroundColor || '#151515' } as any}>
            {saving && <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000] bg-black/80 text-dnd-gold px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-dnd-gold shadow-lg animate-pulse">Saving...</div>}
            {character.backgroundImageUrl && <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: `url('${character.backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}/>}
            
            <DiceRoller3D rollQueue={activeRoll} onRollComplete={() => setActiveRoll(null)} />
            {rollMenu && <RollContextMenu x={rollMenu.x} y={rollMenu.y} onClose={() => setRollMenu(null)} onOptionSelect={handleContextMenuRoll} />}
            <RollHistory history={rollHistory} onClear={() => setRollHistory([])} />
            <DiceTray logs={logs} onRoll={(f) => roll(f, 'Manual')} />
            
            <ManageCharacterModal isOpen={showManageCharacterModal} character={character} onClose={() => setShowManageCharacterModal(false)} onUpdate={(updates) => setCharacter(prev => ({...prev, ...updates}))} onLevelUp={performLevelUp} />
            <HealthManagerModal 
                isOpen={showHealthManager} 
                character={character} 
                onClose={() => setShowHealthManager(false)} 
                onUpdate={(updates) => setCharacter(prev => ({ ...prev, ...updates }))} 
                onTakeDamage={handleDamageTrigger} 
            />
            <ShortRestModal isOpen={showShortRestModal} character={character} onUpdate={(updates) => setCharacter(prev => ({...prev, ...updates}))} onClose={() => setShowShortRestModal(false)} onRoll={roll} />
            <CustomActionModal 
                isOpen={showCustomActionModal} 
                onClose={() => setShowCustomActionModal(false)} 
                onSave={(action) => setCharacter(prev => {
                    const newState = { ...prev, customActions: [...(prev.customActions || []), action] };
                    if (action.maxUses) {
                        newState.featureUsage = {
                            ...newState.featureUsage,
                            [action.name]: { max: action.maxUses, current: action.maxUses, reset: action.reset || 'long' }
                        };
                    }
                    return newState;
                })} 
            />
            <ItemSearchModal 
                isOpen={showItemSearchModal} 
                onClose={() => { setShowItemSearchModal(false); setDuplicateItem(null); }} 
                items={allEquipment} 
                onSelectItem={handleAddItem} 
                initialMode={itemSearchMode}
                initialItem={duplicateItem}
                currentUser={character?.user_id ? { id: character.user_id } : undefined}
                onDuplicateToHomebrew={(item) => handleDuplicateToHomebrew('item', item)}
            />
            <LayoutManagerModal 
                isOpen={showLayoutManager} 
                onClose={() => setShowLayoutManager(false)} 
                layout={layout} 
                onSave={(newLayout) => { 
                    const seen = new Set<string>();
                    const cleanLayout = {
                        left: (newLayout.left || []).filter(w => { if (seen.has(w)) return false; seen.add(w); return true; }),
                        right: (newLayout.right || []).filter(w => { if (seen.has(w)) return false; seen.add(w); return true; }),
                        mobile: Array.from(new Set(newLayout.mobile || []))
                    };
                    setLayout(cleanLayout); 
                    setCharacter(prev => ({ ...prev, layout: cleanLayout })); 
                }} 
                character={character} 
            />
            <CustomSpellModal 
                isOpen={showCustomSpellModal} 
                onClose={() => { setShowCustomSpellModal(false); setDuplicateSpell(null); }} 
                onSave={(spell) => setCharacter(prev => ({...prev, spells: [...prev.spells, spell]}))} 
                currentUser={character?.user_id ? { id: character.user_id } : undefined}
                initialSpell={duplicateSpell}
            />
            <CreatureStatBlockModal creature={viewingFamiliar} onClose={() => setViewingFamiliar(null)} variant="familiar" />
            <CreatureStatBlockModal creature={viewingWildShape} onClose={() => setViewingWildShape(null)} variant={creatureModalMode === 'polymorph' ? 'polymorph' : 'wildshape'} />
            <CompanionStatBlockModal companion={viewingCompanion} onClose={() => setViewingCompanion(null)} />
            <EldritchCannonModal isOpen={showEldritchCannonModal} onClose={() => setShowEldritchCannonModal(false)} character={character} onSummon={handleSummonCannon} />
            <SteelDefenderModal isOpen={showSteelDefenderModal} onClose={() => setShowSteelDefenderModal(false)} character={character} onSummon={handleSummonDefender} />
            <CardOptionsModal isOpen={showCardOptionsModal} onClose={() => setShowCardOptionsModal(false)} isWorldUnlocked={cmLevel >= 10} />
            
            <HomebrewManagerModal 
                isOpen={showHomebrewModal}
                onClose={() => { setShowHomebrewModal(false); setHomebrewInitialData(null); }}
                currentUser={{ id: character.user_id || 'anonymous' }}
                initialTab={homebrewInitialTab}
                initialData={homebrewInitialData}
            />

            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#121316] border-b border-[#3e4149] px-4 py-2 flex items-center justify-between shadow-lg h-[52px]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-cover bg-center rounded-full border border-dnd-gold shrink-0" style={{backgroundImage: `url('${character.avatarUrl || 'https://www.dndbeyond.com/content/skins/waterdeep/images/character-placeholder.jpg'}')`}}/>
                    <div className="flex flex-col overflow-hidden"><span className="text-sm font-bold text-white truncate">{character.name}</span><span className="text-[9px] text-gray-400 truncate">{character.race?.name} | {character.classes.map(c => `${c.definition.name} ${c.level}`).join(' / ')}</span></div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                        <div className="text-[9px] uppercase text-gray-500 font-bold">HP</div>
                        <div className={`text-sm font-bold ${character.currentHp < character.maxHp/2 ? 'text-red-400' : 'text-green-400'}`}>{character.currentHp}/{character.maxHp}</div>
                    </div>
                    <SquareStatBox 
                        label="Armor" 
                        subLabel="Class" 
                        value={`${acValue}`} 
                        tooltipPosition="bottom"
                        tooltip={
                            <div className="space-y-1">
                                {acBreakdown.map((entry, i) => (
                                    <div key={i} className="flex justify-between text-[10px]">
                                        <span className="text-gray-400">{entry.label}</span>
                                        <span className="text-white font-mono">{formatModifier(entry.value)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px] font-bold">
                                    <span className="text-dnd-gold">Total</span>
                                    <span className="text-white">{acValue}</span>
                                </div>
                            </div>
                        }
                    />
                    <button onClick={() => setShowManageCharacterModal(true)} className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                </div>
            </div>

            <header className="hidden md:block shrink-0 z-20 shadow-xl relative">
                <div className="bg-[#121316]/80 backdrop-blur-md border-b border-[#3e4149]">
                     <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className={`w-20 h-20 bg-cover bg-center rounded-full border-2 shadow-[0_0_15px_rgba(201,173,106,0.3)] shrink-0 border-dnd-gold`} style={{backgroundImage: `url('${character.avatarUrl || 'https://www.dndbeyond.com/content/skins/waterdeep/images/character-placeholder.jpg'}')`}}>
                                {!character.avatarUrl && <div className="w-full h-full flex items-center justify-center bg-black/50 text-3xl font-serif text-dnd-gold rounded-full">{character.name.charAt(0)}</div>}
                            </div>
                            <div>
                                <div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-white font-serif tracking-tight leading-none truncate max-w-[200px] sm:max-w-md">{character.name}</h1><div className="flex gap-2"><button onClick={() => setShowManageCharacterModal(true)} className="text-[10px] font-bold uppercase border border-gray-600 bg-black/40 text-gray-400 hover:text-white hover:border-dnd-gold px-2 py-0.5 rounded transition-colors">Manage</button><button onClick={() => setShowLayoutManager(true)} className="text-[10px] font-bold uppercase border border-gray-600 bg-black/40 text-gray-400 hover:text-white hover:border-dnd-gold px-2 py-0.5 rounded transition-colors">Layout</button><button onClick={onOpenVault} className="text-[10px] font-bold uppercase border border-gray-600 bg-black/40 text-gray-400 hover:text-dnd-gold hover:border-dnd-gold px-2 py-0.5 rounded transition-colors flex items-center gap-1">Vault</button></div></div>
                                <div className="flex items-center gap-3 mt-1"><div className="text-sm text-gray-400 font-medium uppercase tracking-wide">{`${character.race?.name} | ${character.classes.map(c => `${c.definition.name} ${c.level}`).join(' / ')}`}</div>{character.activeConcentration && (<div className="flex items-center gap-2 bg-blue-900/40 border border-blue-500 rounded px-2 py-0.5 text-[10px] font-bold text-blue-100 uppercase animate-in fade-in duration-500"><span className="animate-pulse">●</span> Concentrating: {character.activeConcentration.name}<button onClick={() => setCharacter(p => ({ ...p, activeConcentration: null }))} className="ml-1 text-blue-400 hover:text-white transition-colors" title="Break Concentration">&times;</button></div>)}</div>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1"><button onClick={() => handleRest('short')} className="flex items-center gap-2 px-4 py-2 bg-[#1b1c20]/80 border border-gray-600 hover:border-dnd-gold text-gray-300 hover:text-white rounded transition-colors group shrink-0"><span className="text-lg group-hover:text-dnd-red">🪑</span><div className="text-left"><div className="text-[10px] font-bold uppercase leading-none">Short</div><div className="text-xs font-bold uppercase leading-none">Rest</div></div></button><button onClick={() => handleRest('long')} className="flex items-center gap-2 px-4 py-2 bg-[#1b1c20]/80 border border-gray-600 hover:border-dnd-gold text-gray-300 hover:text-white rounded transition-colors group shrink-0"><span className="text-lg group-hover:text-dnd-gold">🌙</span><div className="text-left"><div className="text-[10px] font-bold uppercase leading-none">Long</div><div className="text-xs font-bold uppercase leading-none">Rest</div></div></button></div>
                     </div>
                </div>
                <div className="bg-[#121316]/80 backdrop-blur-md border-b border-[#3e4149]/40 py-3 overflow-x-auto custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center min-w-max">
                        <div className="flex gap-3">{ABILITY_NAMES.map(stat => (<HeaderStatBox key={stat} label={stat} value={getStat(stat)} modifier={calculateModifier(getStat(stat))} onRoll={roll} onContextMenu={triggerRollMenu} />))}</div>
                        <div className="flex gap-3 border-l border-gray-700/50 pl-4 md:pl-8">
                             <SquareStatBox 
                                label="Armor" 
                                subLabel="Class" 
                                value={`${acValue}`} 
                                tooltipPosition="bottom"
                                tooltip={
                                    <div className="space-y-1">
                                        {acBreakdown.map((entry, i) => (
                                            <div key={i} className="flex justify-between text-[10px]">
                                                <span className="text-gray-400">{entry.label}</span>
                                                <span className="text-white font-mono">{formatModifier(entry.value)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px] font-bold">
                                            <span className="text-dnd-gold">Total</span>
                                            <span className="text-white">{acValue}</span>
                                        </div>
                                    </div>
                                }
                             />
                             <div 
                                onClick={() => roll(initAdv ? `2d20kh1${formatModifier(dexMod)}` : `1d20${formatModifier(dexMod)}`, "Initiative Roll")} 
                                onContextMenu={(e) => triggerRollMenu(e, initAdv ? `2d20kh1${formatModifier(dexMod)}` : `1d20${formatModifier(dexMod)}`, "Initiative Roll")} 
                                className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-gray-600 rounded bg-[#1b1c20]/80 cursor-pointer hover:border-dnd-gold group transition-colors relative"
                             >
                                {initAdv && <span className="absolute top-1 right-1 text-[7px] bg-gray-800/60 text-gray-500 px-0.5 rounded border border-gray-700/50">ADV</span>}
                                <div className="text-xl font-bold text-white group-hover:text-dnd-gold leading-none">{formatModifier(dexMod)}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase mt-1 text-center leading-tight group-hover:text-dnd-gold">Initiative<br/>Roll</div>
                             </div>
                             <SquareStatBox label="Proficiency" subLabel="Bonus" value={`+${prof}`} />
                             <SquareStatBox 
                                label="Walking" 
                                subLabel="Speed" 
                                value={`${speed} ft.`} 
                                tooltipPosition="bottom"
                                tooltip={
                                    <div className="space-y-1">
                                        {speedBreakdown.map((entry, i) => (
                                            <div key={i} className="flex justify-between text-[10px]">
                                                <span className="text-gray-400">{entry.label}</span>
                                                <span className="text-white font-mono">{entry.value}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between text-[10px] font-bold">
                                            <span className="text-dnd-gold">Total</span>
                                            <span className="text-white">{speed} ft.</span>
                                        </div>
                                    </div>
                                }
                             />
                             <div onClick={() => setCharacter(p => ({...p, inspiration: !p.inspiration}))} className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-gray-600 rounded bg-[#1b1c20]/80 cursor-pointer hover:border-dnd-gold"><div className={`w-6 h-6 border-2 transform rotate-45 ${character.inspiration ? 'bg-dnd-gold border-dnd-gold' : 'border-gray-500'}`}></div><div className="text-[8px] font-bold text-gray-500 uppercase mt-1 text-center leading-none">Heroic<br/>Inspiration</div></div>
                             <div className={`flex flex-col h-16 md:h-20 border rounded bg-[#1b1c20]/80 overflow-hidden min-w-[140px] cursor-pointer transition-colors border-gray-600 hover:border-dnd-gold`} onClick={() => setShowHealthManager(true)}>
                                 <div className="flex-grow flex items-center justify-between px-3 gap-2"><div className="flex flex-col items-center"><span className="text-[9px] font-bold text-gray-500 uppercase">Current</span><span className={`text-xl font-bold text-white`}>{character.currentHp}</span></div><span className="text-gray-600 text-xl font-light">/</span><div className="flex flex-col items-center"><span className="text-[9px] font-bold text-gray-500 uppercase">Max</span><span className="text-xl font-bold text-gray-400">{character.maxHp}</span></div><div className="w-px h-8 bg-gray-700/50 mx-1"></div><div className="flex flex-col items-center"><span className="text-[9px] font-bold text-gray-500 uppercase">Temp</span><span className="text-lg font-bold text-gray-300">{character.tempHp || '--'}</span></div></div>
                                 <div className={`py-0.5 text-center border-t bg-[#0b0c0e]/50 border-gray-600/50`}><span className={`text-[9px] font-bold uppercase text-gray-500`}>Hit Points</span></div>
                             </div>
                        </div>
                    </div>
                </div>
            </header>

            <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121316] border-t border-[#3e4149] px-4 py-2 flex items-center justify-between shadow-lg h-[64px]">
                {['stats', 'actions', 'spells', 'inventory', 'log'].map((tab_btn) => (
                    <button key={tab_btn} onClick={() => setActiveTab(tab_btn as any)} className={`flex flex-col items-center justify-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === tab_btn ? 'text-dnd-gold' : 'text-gray-500'}`}>
                        <div className={`${activeTab === tab_btn ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>{tabIcons[tab_btn]}</div>
                        <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">{tab_btn === 'log' ? 'Journal' : tab_btn === 'inventory' ? 'Items' : tab_btn}</span>
                    </button>
                ))}
            </footer>

            <main className="flex-grow flex flex-col md:flex-row overflow-hidden max-w-[1400px] mx-auto w-full relative font-scalable-text z-10 pt-0 pb-[64px] md:pb-0">
                <aside className={isSidePanelPinned && !!selectedDetail 
                    ? "hidden md:flex flex-col md:w-[340px] lg:w-[320px] bg-[#121316]/50 border-r border-[#3e4149] p-4 gap-4 overflow-y-auto custom-scrollbar shrink-0 backdrop-blur-md" 
                    : "hidden md:flex md:flex-col lg:grid lg:grid-cols-2 md:w-[340px] lg:w-[600px] bg-[#121316]/50 border-r border-[#3e4149] p-4 gap-4 overflow-y-auto custom-scrollbar shrink-0 backdrop-blur-md"
                }>
                    <div className="flex flex-col gap-4">
                         {/* Active Form Widget removed */}
                        {layout.left.map((w, idx) => renderWidget(w, `left-${w}-${idx}`))}
                    </div>
                    <div className="flex flex-col h-full gap-4">
                        {layout.left.length === 0 && layout.right.length === 0 && (<div className={`flex flex-col items-center justify-center h-full border border-[#3e4149] rounded-lg ${WIDGET_BG} p-8 text-center animate-in fade-in zoom-in duration-500`}><div className="text-6xl mb-4 text-dnd-gold opacity-50">🛠️</div><h2 className="text-2xl font-serif text-white mb-2">Your Sheet is Empty</h2><p className="text-gray-400 mb-6 max-w-sm">This character sheet is a blank canvas. Start by adding widgets to track your abilities, skills, and gear.</p><button onClick={() => setShowLayoutManager(true)} className="px-8 py-3 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-all transform hover:scale-105">Start Building Sheet</button></div>)}
                        {layout.right.map((w, idx) => renderWidget(w, `right-${w}-${idx}`))}
                    </div>
                </aside>

                <section className={`flex-grow flex flex-col ${character.backgroundImageUrl ? "bg-[#121316]/50" : "bg-transparent"} overflow-hidden backdrop-blur-md`}>
                    <nav className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#121316]/50 shrink-0 overflow-x-auto custom-scrollbar border-b border-[#3e4149]/40">{['actions', 'spells', 'inventory', 'features', 'rules', 'log'].map(tab_key => (<button key={tab_key} onClick={() => setActiveTab(tab_key as any)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap shadow-sm border ${activeTab === tab_key ? 'text-white border-dnd-red bg-dnd-red/20 ring-1 ring-dnd-red/50' : 'text-gray-500 border-[#3e4149]/50 bg-black/40 hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800'}`}>{tabIcons[tab_key]}<span>{tab_key === 'log' ? 'Journal' : tab_key}</span></button>))}</nav>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-4 bg-fixed bg-cover">
                        {activeTab === 'stats' && <StatsTab character={character} roll={roll} layout={layout} renderWidget={renderWidget} setShowLayoutManager={setShowLayoutManager} />}
                        {activeTab === 'actions' && (
                            <ErrorBoundary>
                                <ActionsTab character={character} roll={roll} triggerRollMenu={triggerRollMenu} setSelectedDetail={setSelectedDetail} getAttacks={getAttacks} bonusActionList={getBonusActions()} setShowCustomActionModal={setShowCustomActionModal} setShowHomebrewModal={(val, tab) => { setHomebrewInitialTab(tab); setShowHomebrewModal(val); }} spellSave={spellSave} spellMod={spellMod} />
                            </ErrorBoundary>
                        )}
                        {activeTab === 'spells' && <SpellsTab character={character} setCharacter={setCharacter} roll={roll} triggerRollMenu={triggerRollMenu} setSelectedDetail={setSelectedDetail} spellSave={spellSave} spellAttackStr={spellAttackStr} spellMod={spellMod} setShowSpellManager={setShowSpellManager} setShowHomebrewModal={(val, tab) => { setHomebrewInitialTab(tab); setShowHomebrewModal(val); }} onPolymorphCast={() => { setCreatureModalMode('polymorph'); setShowCreatureModal(true); }} />}
                        {activeTab === 'inventory' && <InventoryTab character={character} currentWeight={currentWeight} maxWeight={maxWeight} updateQuantity={updateQuantity} toggleAttunement={toggleAttunement} setSelectedDetail={setSelectedDetail} setShowItemSearchModal={(val, mode) => { setItemSearchMode(mode || 'search'); setShowItemSearchModal(val); }} setShowHomebrewModal={(val, tab) => { setHomebrewInitialTab(tab); setShowHomebrewModal(val); }} setCharacter={setCharacter} />}
                        {activeTab === 'features' && <FeaturesTab character={character} setCharacter={setCharacter} getAllFeatures={getAllFeaturesSorted} setSelectedDetail={setSelectedDetail} onTabChange={setActiveTab} setShowHomebrewModal={(val, tab) => { setHomebrewInitialTab(tab); setShowHomebrewModal(val); }} setShowCardOptionsModal={setShowCardOptionsModal} />}
                        {activeTab === 'rules' && <RulesTab visibleRules={visibleRules} setSelectedDetail={setSelectedDetail} />}
                        {activeTab === 'log' && <LogTab character={character} setCharacter={setCharacter} onOpenVault={onOpenVault} setShowLayoutManager={setShowLayoutManager} handleRest={handleRest} />}
                    </div>
                </section>
                
                {!!selectedDetail && !isSidePanelPinned && (<div className="absolute inset-0 z-[150] bg-transparent" onClick={() => { setSelectedDetail(null); }}></div>)}
                <DetailSidePanel 
                    item={selectedDetail} 
                    character={character} 
                    onClose={() => setSelectedDetail(null)} 
                    onAction={(action, itm) => { 
                        if (action === 'toggleFeatureUsage') {
                            setCharacter(prev => {
                                const newUsage = { ...prev.featureUsage };
                                if (newUsage[itm.name]) {
                                    newUsage[itm.name].current = Math.max(0, Math.min(newUsage[itm.name].max, newUsage[itm.name].current + itm.delta));
                                }
                                return { ...prev, featureUsage: newUsage };
                            });
                        }
                        if (action === 'toggleEquip') toggleEquipped(itm.id); 
                        if (action === 'toggleAttune') toggleAttunement(itm.id); 
                        if (action === 'toggleFlag') toggleItemFlag(itm.id, itm.flag);
                        if (action === 'updateItem') {
                            setCharacter(prev => ({
                                ...prev,
                                inventory: prev.inventory.map(i => i.id === itm.id ? { ...i, ...itm.updates } : i)
                            }));
                        }
                        if (action === 'pickCard') handlePickACard();
                        if (action === 'chiromancy') {
                            const log = {
                                timestamp: Date.now(),
                                label: 'Chiromancy',
                                formula: 'Advantage',
                                total: 0,
                                rolls: [],
                                details: 'Granted advantage on next roll to target.'
                            };
                            setLogs(prev => [log, ...prev].slice(0, 50));
                        }
                        if (action === 'duplicate') {
                            if (isSpell(itm)) {
                                setDuplicateSpell(itm);
                                setShowCustomSpellModal(true);
                            } else {
                                setDuplicateItem(itm.details || itm);
                                setItemSearchMode('custom');
                                setShowItemSearchModal(true);
                            }
                            setSelectedDetail(null);
                        }
                        if (action === 'cast') {
                            if (isSpell(itm)) {
                                roll((itm as any).formula || '1d20', `Casting ${itm.name}`);
                                
                                // Trigger Polymorph Modal
                                if (itm.name === 'Polymorph') {
                                    setCreatureModalMode('polymorph');
                                    setShowCreatureModal(true);
                                }

                                // If it's a leveled spell, consume slot if possible
                                if (itm.level > 0) {
                                    setCharacter(prev => {
                                        const newSlots = { ...prev.spellSlots };
                                        if (newSlots[itm.level] && newSlots[itm.level].current > 0) {
                                            newSlots[itm.level] = { ...newSlots[itm.level], current: newSlots[itm.level].current - 1 };
                                        }
                                        return { ...prev, spellSlots: newSlots };
                                    });
                                }
                            }
                        }
                        if (action === 'remove') { 
                            if ('quantity' in itm) updateQuantity(itm.id, 0); 
                            else setCharacter(prev => ({ ...prev, spells: prev.spells.filter(s => s.index !== itm.index || s.sourceClassIndex !== itm.sourceClassIndex) })); 
                            setSelectedDetail(null); 
                        } 
                    }} 
                    isPinned={isSidePanelPinned} 
                    onTogglePin={() => setIsSidePanelPinned(!isSidePanelPinned)} 
                    isFavorite={selectedDetail ? character.favorites.includes(getEntityId(selectedDetail)) : false} 
                    onToggleFavorite={() => { if (selectedDetail) toggleFavorite(getEntityId(selectedDetail)); }} 
                />
            </main>
            <CreatureManagerModal
                isOpen={showCreatureModal}
                onClose={() => setShowCreatureModal(false)}
                character={character}
                mode={creatureModalMode}
                onAction={handleCreatureAction}
                onAddCustom={(creature) => setCharacter(prev => ({...prev, customCreatures: [...(prev.customCreatures || []), creature]}))}
                onRemoveCustom={(id) => setCharacter(prev => ({...prev, customCreatures: (prev.customCreatures || []).filter(b => b.index !== id)}))}
                onOpenForge={() => { setHomebrewInitialTab('creature'); setShowHomebrewModal(true); setShowCreatureModal(false); }}
            />
            <SpellManagerModal 
                character={character} 
                isOpen={showSpellManager} 
                onClose={() => setShowSpellManager(false)} 
                onUpdateSpells={(spells) => setCharacter(prev => ({...prev, spells}))} 
                onAddCustom={() => setShowCustomSpellModal(true)} 
                onDuplicateToHomebrew={(spell) => handleDuplicateToHomebrew('spell', spell)}
            />
        </div>
    );
};