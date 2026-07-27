import { ExtendedFeatDetail } from '../types';
import { ALL_ITEMS, getItem } from './items/index';
import { getLocalSpells } from './spells/index';
import { BARD_SPELLS } from './spells/bard';
import { CLERIC_SPELLS } from './spells/cleric';
import { DRUID_SPELLS } from './spells/druid';
import { PALADIN_SPELLS } from './spells/paladin';
import { RANGER_SPELLS } from './spells/ranger';
import { SORCERER_SPELLS } from './spells/sorcerer';
import { WARLOCK_SPELLS } from './spells/warlock';
import { WIZARD_SPELLS } from './spells/wizard';
import { ARTIFICER_SPELLS } from './spells/artificer';
import { COMMON_CREATURES } from './beasts';
import { STANDARD_FAMILIARS } from './familiars';
import { loadHomebrew } from '../services/supabase';

export const CLASSES: any[] = [];
export const SUBCLASSES: any[] = [];
export const FEATS: any[] = [];
export const RACES: any[] = [];

import { APIReference, RaceDetail, ClassDetail, SubclassDetail, SubraceDetail, EquipmentDetail, SpellDetail, FeatDetail, TraitDetail, BackgroundDetail, CreatureDetail } from '../types';

export { getLocalSpells } from './spells/index';

export const Library = {
    // Race APIs
    getRaces: (): any[] => [],
    getRace: (index: string): any | undefined => undefined,
    
    // Class APIs
    getClasses: (): any[] => [],
    getClass: (index: string): any | undefined => undefined,
    
    // Subclass APIs
    getSubclasses: (classIndex?: string): any[] => [],
    getSubclass: (index: string): any | undefined => undefined,

    // Feat APIs
    getFeats: (): any[] => [],
    getFeat: (index: string): any | undefined => undefined,

    // Background APIs
    getBackgrounds: (): BackgroundDetail[] => [],
    getBackground: (indexOrName: string): BackgroundDetail | undefined => undefined,

    // Creatures
    getCreatures: (): CreatureDetail[] => {
        const all = [...COMMON_CREATURES, ...STANDARD_FAMILIARS];
        return Array.from(new Map(all.map(c => [c.index, c])).values());
    },

    // Item APIs
    getItem: (index: string): EquipmentDetail | undefined => getItem(index),

    // Comprehensive Search
    search: (query: string) => {
        const q = query.toLowerCase();
        return {
            races: [],
            classes: [],
            subclasses: [],
            feats: [],
            backgrounds: [],
            items: ALL_ITEMS.filter(i => i.name.toLowerCase().includes(q)),
            spells: [], 
            creatures: Library.getCreatures().filter(b => b.name.toLowerCase().includes(q))
        };
    }
};

// --- DATA ACCESS ADAPTERS (Database / Content Library) ---

export const fetchRaces = async (userId?: string): Promise<APIReference[]> => {
    try {
        const races = await loadHomebrew('custom_races', userId);
        if (races && races.length > 0) {
            return races.map((r: any) => ({ index: r.index, name: r.name, url: "", isCustom: r.isCustom, is_homebrew: r.is_homebrew }));
        }
    } catch (e) {}
    return [];
};

export const fetchRaceDetail = async (index: string, userId?: string): Promise<RaceDetail | null> => {
    try {
        const races = await loadHomebrew('custom_races', userId);
        const found = races.find((r: any) => r.index === index);
        if (found) return found;
    } catch (e) {}
    return null;
};

export const fetchSubraces = async (raceIndex: string, userId?: string): Promise<APIReference[]> => {
    const race = await fetchRaceDetail(raceIndex, userId);
    if (!race || !race.subraces_details) return [];
    return race.subraces_details.map((s: any) => ({ index: s.index, name: s.name, url: "" }));
};

export const fetchSubraceDetail = async (index: string, userId?: string): Promise<SubraceDetail | null> => {
    try {
        const races = await loadHomebrew('custom_races', userId);
        for (const race of races) {
            if (race.subraces_details) {
                const sub = race.subraces_details.find((s: any) => s.index === index);
                if (sub) return sub;
            }
        }
    } catch (e) {}
    return null;
};

export const fetchClasses = async (userId?: string): Promise<APIReference[]> => {
    try {
        const custom = await loadHomebrew('custom_classes', userId);
        const customRefs = (custom || []).map((c: any) => ({
            index: c.index || c.id || (c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : ''),
            name: c.name,
            url: "",
            isCustom: true,
            is_homebrew: c.is_homebrew ?? false
        }));
        const standardRefs = CLASSES.map(c => ({ index: c.index, name: c.name, url: "" }));
        const customIndices = new Set(customRefs.map(c => c.index.toLowerCase()));
        const filteredStandard = standardRefs.filter(s => !customIndices.has(s.index.toLowerCase()));
        return [...filteredStandard, ...customRefs];
    } catch (e) {}
    return CLASSES.map(c => ({ index: c.index, name: c.name, url: "" }));
};

export const fetchClassDetail = async (index: string, userId?: string): Promise<ClassDetail | null> => {
    const cleanIndex = index.toLowerCase().replace(/\s+/g, '-');
    try {
        const classes = await loadHomebrew('custom_classes', userId);
        const found = classes.find((c: any) => 
            c.index === index || 
            c.id === index || 
            c.index === cleanIndex ||
            c.id === cleanIndex ||
            (c.name && c.name.toLowerCase().replace(/\s+/g, '-') === cleanIndex)
        );
        if (found) return found;
    } catch (e) {}
    return CLASSES.find(c => c.index === index || c.index === cleanIndex || c.name.toLowerCase().replace(/\s+/g, '-') === cleanIndex) || null;
};

export const fetchSubclasses = async (classIndex: string, userId?: string): Promise<APIReference[]> => {
    const cleanClassIndex = classIndex ? classIndex.toLowerCase().replace(/\s+/g, '-') : '';
    try {
        const custom = await loadHomebrew('custom_subclasses', userId);
        const standardFiltered = SUBCLASSES
            .filter(s => !classIndex || s.class?.index === classIndex || s.class_index === classIndex || s.class?.index === cleanClassIndex || s.class_index === cleanClassIndex)
            .map(s => ({ index: s.index, name: s.name, url: "", isCustom: false }));

        const customFiltered = (custom || [])
            .filter((s: any) => !classIndex || s.class?.index === classIndex || s.class_index === classIndex || s.class?.index === cleanClassIndex || s.class_index === cleanClassIndex)
            .map((s: any) => ({ 
                index: s.index || s.id || (s.name ? s.name.toLowerCase().replace(/\s+/g, '-') : ''), 
                name: s.name, 
                url: "", 
                isCustom: true, 
                is_homebrew: s.is_homebrew ?? true 
            }));

        const customIndices = new Set(customFiltered.map(c => c.index));
        const filteredStandard = standardFiltered.filter(s => !customIndices.has(s.index));
        return [...filteredStandard, ...customFiltered];
    } catch (e) {}
    return SUBCLASSES
        .filter(s => !classIndex || s.class?.index === classIndex || s.class_index === classIndex || s.class?.index === cleanClassIndex || s.class_index === cleanClassIndex)
        .map(s => ({ index: s.index, name: s.name, url: "" }));
};

export const fetchSubclassDetail = async (index: string, userId?: string): Promise<SubclassDetail | null> => {
    const cleanIndex = index.toLowerCase().replace(/\s+/g, '-');
    try {
        const subclasses = await loadHomebrew('custom_subclasses', userId);
        const found = subclasses.find((s: any) => 
            s.index === index || 
            s.id === index || 
            s.index === cleanIndex ||
            s.id === cleanIndex ||
            (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === cleanIndex) ||
            (s.name && s.name.toLowerCase() === index.toLowerCase())
        );
        if (found) return found;
    } catch (e) {}
    return SUBCLASSES.find(s => 
        s.index === index || 
        s.index === cleanIndex || 
        (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === cleanIndex) ||
        (s.name && s.name.toLowerCase() === index.toLowerCase())
    ) || null;
};

export const fetchEquipment = async (userId?: string): Promise<EquipmentDetail[]> => {
    try {
        const custom = await loadHomebrew('custom_equipment', userId);
        const customMap = new Map(custom.map((i: any) => [(i.index || i.name || '').toLowerCase(), i]));
        const mergedStandard = ALL_ITEMS.map(item => {
            const key = item.index.toLowerCase();
            if (customMap.has(key)) {
                const override = customMap.get(key);
                customMap.delete(key);
                return override;
            }
            return item;
        });
        const remainingCustom = Array.from(customMap.values()).map((i: any) => ({
            ...i,
            name: i.is_homebrew === false ? i.name : (i.name.endsWith('(HB)') ? i.name : `${i.name} (HB)`)
        }));
        return [...mergedStandard, ...remainingCustom];
    } catch (e) {}
    return ALL_ITEMS;
};

export const fetchEquipmentDetail = async (index: string, userId?: string): Promise<EquipmentDetail | null> => {
    try {
        const custom = await loadHomebrew('custom_equipment', userId);
        const foundCustom = custom.find((i: any) => i.index === index || (i.name && i.name.toLowerCase().replace(/\s+/g, '-') === index));
        if (foundCustom) return foundCustom;
    } catch (e) {}
    return ALL_ITEMS.find(i => i.index === index) || null;
};

export const fetchBackgrounds = async (userId?: string): Promise<APIReference[]> => {
    try {
        const backgrounds = await loadHomebrew('custom_backgrounds', userId);
        if (backgrounds && backgrounds.length > 0) {
            return backgrounds.map((b: any) => ({ index: b.index, name: b.name, url: "", isCustom: b.isCustom, is_homebrew: b.is_homebrew }));
        }
    } catch (e) {}
    return [];
};

export const fetchBackgroundDetail = async (index: string, userId?: string): Promise<BackgroundDetail | null> => {
    try {
        const backgrounds = await loadHomebrew('custom_backgrounds', userId);
        const found = backgrounds.find((b: any) => b.index === index || b.name === index);
        if (found) return found;
    } catch (e) {}
    return null;
};

export const fetchSpellsByClass = async (classIndex: string, userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId).catch(() => []);
    const local = getLocalSpells(classIndex);
    const customMap = new Map(custom.map((s: any) => [(s.index || s.name || '').toLowerCase(), s]));
    const mergedLocal = local.map(s => {
        const key = s.index.toLowerCase();
        if (customMap.has(key)) {
            const override = customMap.get(key);
            customMap.delete(key);
            return override;
        }
        return s;
    });
    const customSpells = Array.from(customMap.values()).map((s: any) => ({
        ...s,
        name: s.is_homebrew === false ? s.name : (s.name.endsWith('(HB)') ? s.name : `${s.name} (HB)`)
    }));
    return [...mergedLocal, ...customSpells];
};

export const fetchSpellsByClassAndLevel = async (classIndex: string, level: number, userId?: string): Promise<SpellDetail[]> => {
    const spells = await fetchSpellsByClass(classIndex, userId);
    return spells.filter(s => s.level === level);
};

export const fetchAllSpells = async (userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId).catch(() => []);
    const classes = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard', 'artificer'];
    const allLocal = classes.flatMap(c => getLocalSpells(c));
    
    const customMap = new Map(custom.map((s: any) => [(s.index || s.name || '').toLowerCase(), s]));
    const spellMap = new Map<string, SpellDetail>();
    
    allLocal.forEach(s => {
        const key = s.index.toLowerCase();
        if (customMap.has(key)) {
            const override = customMap.get(key);
            customMap.delete(key);
            spellMap.set(key, override);
        } else {
            spellMap.set(key, { ...s, classes: [...(s.classes || [])] });
        }
    });

    customMap.forEach((s, key) => {
        const displayName = s.is_homebrew === false ? s.name : (s.name.endsWith('(HB)') ? s.name : `${s.name} (HB)`);
        spellMap.set(key, { ...s, name: displayName });
    });

    return Array.from(spellMap.values());
};

export const fetchFeatsList = async (userId?: string): Promise<ExtendedFeatDetail[]> => {
    try {
        const feats = await loadHomebrew('custom_feats', userId);
        if (feats && feats.length > 0) return feats;
    } catch (e) {}
    return [];
};

export const fetchFeatureDetail = async (index: string, userId?: string): Promise<any | null> => {
    const cleanName = index.replace(/\s*\(.*?\)/g, '').trim();
    const cleanIndex = cleanName.toLowerCase().replace(/\s+/g, '-');

    const findInList = (list: any[]) => {
        return list.find(f => {
            if (f.index === index || f.name === index) return true;
            if (f.name === cleanName || f.index === cleanIndex) return true;
            if (f.name.toLowerCase() === cleanName.toLowerCase()) return true;
            return false;
        });
    };

    try {
        const classes = await loadHomebrew('custom_classes', userId);
        for (const c of classes) {
            if (c.feature_details) {
                const f = findInList(c.feature_details);
                if (f) return f;
            }
        }
    } catch (e) {}

    for (const c of CLASSES) {
        if (c.feature_details) {
            const f = findInList(c.feature_details);
            if (f) return f;
        }
    }

    try {
        const subclasses = await loadHomebrew('custom_subclasses', userId);
        for (const s of subclasses) {
            if (s.feature_details) {
                const f = findInList(s.feature_details);
                if (f) return f;
            }
        }
    } catch (e) {}

    for (const s of SUBCLASSES) {
        if (s.feature_details) {
            const f = findInList(s.feature_details);
            if (f) return f;
        }
    }

    try {
        const feats = await loadHomebrew('custom_feats', userId);
        const feat = feats.find((f: any) => f.index === index || f.index === cleanIndex);
        if (feat) return feat;
    } catch (e) {}

    const feat = FEATS.find(f => f.index === index || f.index === cleanIndex);
    if (feat) return feat;

    return null;
};

export const fetchFeatureDetailBySource = async (index: string, source: string, userId?: string): Promise<any | null> => {
    try {
        const classes = await loadHomebrew('custom_classes', userId);
        const cls = classes.find((c: any) => c.name === source);
        if (cls && cls.feature_details) {
            const feat = cls.feature_details.find((f: any) => f.index === index);
            if (feat) return feat;
        }
    } catch (e) {}

    const cls = CLASSES.find(c => c.name === source);
    if (cls && cls.feature_details) {
        const feat = cls.feature_details.find((f: any) => f.index === index);
        if (feat) return feat;
    }

    try {
        const subclasses = await loadHomebrew('custom_subclasses', userId);
        const sub = subclasses.find((s: any) => s.name === source);
        if (sub && sub.feature_details) {
            const feat = sub.feature_details.find((f: any) => f.index === index);
            if (feat) return feat;
        }
    } catch (e) {}

    const sub = SUBCLASSES.find(s => s.name === source);
    if (sub && sub.feature_details) {
        const feat = sub.feature_details.find((f: any) => f.index === index);
        if (feat) return feat;
    }
    
    return fetchFeatureDetail(index, userId);
};

export const fetchTraitDetail = async (index: string, userId?: string): Promise<TraitDetail | null> => {
    try {
        const races = await loadHomebrew('custom_races', userId);
        for (const r of races) {
            const t = r.traits?.find((tr: any) => tr.index === index);
            if (t) return t;
            if (r.subraces_details) {
                for (const sub of r.subraces_details) {
                    const subT = sub.traits?.find((tr: any) => tr.index === index);
                    if (subT) return subT;
                }
            }
        }
    } catch (e) {}

    for (const r of RACES) {
        const t = r.traits?.find(tr => tr.index === index);
        if (t) return t;
        if (r.subraces_details) {
            for (const sub of r.subraces_details) {
                const subT = sub.traits?.find(tr => tr.index === index);
                if (subT) return subT;
            }
        }
    }
    return null;
};

export const fetchLevelFeatures = async (classIndex: string, level: number, userId?: string): Promise<any[]> => {
    let customClasses: any[] = [];
    try {
        customClasses = await loadHomebrew('custom_classes', userId);
    } catch (e) {}
    const allClasses = [...CLASSES, ...(customClasses || [])];
    const cleanClassIndex = classIndex ? classIndex.toLowerCase().replace(/\s+/g, '-') : '';

    const cls = allClasses.find((c: any) => 
        c.index === classIndex || 
        c.id === classIndex ||
        c.index === cleanClassIndex ||
        c.id === cleanClassIndex ||
        (c.name && c.name.toLowerCase().replace(/\s+/g, '-') === cleanClassIndex)
    );
    if (!cls) return [];
    
    const levelRow = cls.level_table?.find((l: any) => l.level === level);
    if (!levelRow || !Array.isArray(levelRow.features)) return [];

    return levelRow.features
        .filter((fName: string) => fName !== "Subclass feature" && fName !== "Subclass Feature")
        .map((fName: string) => {
            const cleanName = fName.replace(/\s*\(.*?\)/g, '').trim();
            const cleanFNameIndex = cleanName.toLowerCase().replace(/\s+/g, '-');
            const detail = cls.feature_details?.find((fd: any) => 
                fd.name === fName || 
                fd.name === cleanName ||
                fd.name.toLowerCase() === cleanName.toLowerCase() ||
                fd.index === cleanFNameIndex
            );
            if (detail) return detail;
            return { index: cleanFNameIndex, name: fName, url: "", desc: [] };
        });
};

export const fetchClassLevels = async (classIndex: string, userId?: string): Promise<any[]> => {
    let customClasses: any[] = [];
    try {
        customClasses = await loadHomebrew('custom_classes', userId);
    } catch (e) {}
    const allClasses = [...CLASSES, ...(customClasses || [])];
    const cleanClassIndex = classIndex ? classIndex.toLowerCase().replace(/\s+/g, '-') : '';

    const cls = allClasses.find((c: any) => 
        c.index === classIndex || 
        c.id === classIndex ||
        c.index === cleanClassIndex ||
        c.id === cleanClassIndex ||
        (c.name && c.name.toLowerCase().replace(/\s+/g, '-') === cleanClassIndex)
    );
    if (!cls) return [];
    return (cls.level_table || []).map((row: any) => ({
        level: row.level,
        features: (row.features || [])
            .filter((fName: string) => fName !== "Subclass feature" && fName !== "Subclass Feature")
            .map((fName: string) => {
                const cleanName = fName.replace(/\s*\(.*?\)/g, '').trim();
                const cleanFNameIndex = cleanName.toLowerCase().replace(/\s+/g, '-');
                const detail = cls.feature_details?.find((fd: any) => 
                    fd.name === fName || 
                    fd.name === cleanName ||
                    fd.index === cleanFNameIndex
                );
                if (detail) return detail;
                return { name: fName, index: cleanFNameIndex, desc: [] };
            })
    }));
};

export const fetchSubclassLevels = async (subclassIndex: string, userId?: string): Promise<any[]> => {
    let customSubclasses: any[] = [];
    try {
        customSubclasses = await loadHomebrew('custom_subclasses', userId);
    } catch (e) {}
    const allSubclasses = [...SUBCLASSES, ...(customSubclasses || [])];
    const cleanSubIndex = subclassIndex ? subclassIndex.toLowerCase().replace(/\s+/g, '-') : '';

    const sub = allSubclasses.find((s: any) => 
        s.index === subclassIndex || 
        s.id === subclassIndex || 
        s.index === cleanSubIndex ||
        s.id === cleanSubIndex ||
        (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === cleanSubIndex) ||
        (s.name && s.name.toLowerCase() === subclassIndex.toLowerCase())
    );
    if (!sub) return [];
    
    const levelMap = new Map<number, any>();
    const rawFeatures = sub.feature_details || sub.features || [];
    rawFeatures.forEach((feat: any) => {
        const lvl = feat.level || 1;
        if (!levelMap.has(lvl)) {
            levelMap.set(lvl, { level: lvl, features: [] });
        }
        const featName = typeof feat === 'string' ? feat : (feat.name || feat.title || '');
        const featIndex = (typeof feat === 'object' && feat.index) ? feat.index : featName.toLowerCase().replace(/\s+/g, '-');
        levelMap.get(lvl).features.push({
            ...(typeof feat === 'object' ? feat : {}),
            name: featName,
            index: featIndex
        });
    });
    return Array.from(levelMap.values());
};

export const fetchCreatures = async (userId?: string): Promise<any[]> => {
    const custom = await loadHomebrew('custom_beasts', userId).catch(() => []);
    const all = [...COMMON_CREATURES, ...STANDARD_FAMILIARS, ...custom];
    return Array.from(new Map(all.map(c => [c.index, c])).values());
};

export default Library;
