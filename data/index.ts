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
        const classes = await loadHomebrew('custom_classes', userId);
        if (classes && classes.length > 0) {
            return classes.map((c: any) => ({ index: c.index, name: c.name, url: "", isCustom: c.isCustom, is_homebrew: c.is_homebrew }));
        }
    } catch (e) {}
    return [];
};

export const fetchClassDetail = async (index: string, userId?: string): Promise<ClassDetail | null> => {
    try {
        const classes = await loadHomebrew('custom_classes', userId);
        const found = classes.find((c: any) => c.index === index);
        if (found) return found;
    } catch (e) {}
    return null;
};

export const fetchSubclasses = async (classIndex: string, userId?: string): Promise<APIReference[]> => {
    try {
        const subclasses = await loadHomebrew('custom_subclasses', userId);
        if (subclasses && subclasses.length > 0) {
            return subclasses
                .filter((s: any) => !classIndex || s.class?.index === classIndex)
                .map((s: any) => ({ index: s.index, name: s.name, url: "", isCustom: s.isCustom, is_homebrew: s.is_homebrew }));
        }
    } catch (e) {}
    return [];
};

export const fetchSubclassDetail = async (index: string, userId?: string): Promise<SubclassDetail | null> => {
    try {
        const subclasses = await loadHomebrew('custom_subclasses', userId);
        const found = subclasses.find((s: any) => s.index === index);
        if (found) return found;
    } catch (e) {}
    return null;
};

export const fetchEquipment = async (userId?: string): Promise<EquipmentDetail[]> => {
    try {
        const custom = await loadHomebrew('custom_equipment', userId);
        return [...ALL_ITEMS, ...custom.map((i: any) => ({ ...i, name: `${i.name} (HB)` }))];
    } catch (e) {}
    return ALL_ITEMS;
};

export const fetchEquipmentDetail = async (index: string, userId?: string): Promise<EquipmentDetail | null> => {
    try {
        const custom = await loadHomebrew('custom_equipment', userId);
        const item = [...ALL_ITEMS, ...custom].find(i => i.index === index);
        if (item && custom.some((i: any) => i.index === index)) {
            return { ...item, name: `${item.name} (HB)` };
        }
        return item || null;
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
    const customSpells = custom.map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    return [...local, ...customSpells];
};

export const fetchSpellsByClassAndLevel = async (classIndex: string, level: number, userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId).catch(() => []);
    const local = getLocalSpells(classIndex).filter(s => s.level === level);
    const customSpells = custom.filter((s: any) => s.level === level).map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    return [...local, ...customSpells];
};

export const fetchAllSpells = async (userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId).catch(() => []);
    const customSpells = custom.map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    
    const classes = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard', 'artificer'];
    const allLocal = classes.flatMap(c => getLocalSpells(c));
    
    const all = [...allLocal, ...customSpells];
    const spellMap = new Map<string, SpellDetail>();
    
    all.forEach(s => {
        const existing = spellMap.get(s.index);
        if (existing) {
            const existingClasses = existing.classes || [];
            const newClasses = s.classes || [];
            newClasses.forEach(nc => {
                if (!existingClasses.some(ec => ec.name === nc.name)) {
                     existing.classes = [...existingClasses, nc];
                }
            });
        } else {
            spellMap.set(s.index, { ...s, classes: [...(s.classes || [])] });
        }
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
    let classes: any[] = [];
    try {
        classes = await loadHomebrew('custom_classes', userId);
    } catch (e) {}
    if (!classes || classes.length === 0) classes = CLASSES;

    const cls = classes.find((c: any) => c.index === classIndex);
    if (!cls) return [];
    
    const levelRow = cls.level_table?.find((l: any) => l.level === level);
    if (!levelRow) return [];

    return levelRow.features
        .filter((fName: string) => fName !== "Subclass feature" && fName !== "Subclass Feature")
        .map((fName: string) => {
            const cleanName = fName.replace(/\s*\(.*?\)/g, '').trim();
            const detail = cls.feature_details?.find((fd: any) => 
                fd.name === fName || 
                fd.name === cleanName ||
                fd.name.toLowerCase() === cleanName.toLowerCase()
            );
            if (detail) return detail;
            return { index: fName.toLowerCase().replace(/\s+/g, '-'), name: fName, url: "", desc: [] };
        });
};

export const fetchClassLevels = async (classIndex: string, userId?: string): Promise<any[]> => {
    let classes: any[] = [];
    try {
        classes = await loadHomebrew('custom_classes', userId);
    } catch (e) {}
    if (!classes || classes.length === 0) classes = CLASSES;

    const cls = classes.find((c: any) => c.index === classIndex);
    if (!cls) return [];
    return (cls.level_table || []).map((row: any) => ({
        level: row.level,
        features: row.features
            .filter((fName: string) => fName !== "Subclass feature" && fName !== "Subclass Feature")
            .map((fName: string) => {
                const cleanName = fName.replace(/\s*\(.*?\)/g, '').trim();
                const detail = cls.feature_details?.find((fd: any) => 
                    fd.name === fName || 
                    fd.name === cleanName
                );
                if (detail) return detail;
                return { name: fName, index: fName.toLowerCase().replace(/\s+/g, '-'), desc: [] };
            })
    }));
};

export const fetchSubclassLevels = async (subclassIndex: string, userId?: string): Promise<any[]> => {
    let subclasses: any[] = [];
    try {
        subclasses = await loadHomebrew('custom_subclasses', userId);
    } catch (e) {}
    if (!subclasses || subclasses.length === 0) subclasses = SUBCLASSES;

    const sub = subclasses.find((s: any) => s.index === subclassIndex);
    if (!sub) return [];
    
    const levelMap = new Map<number, any>();
    (sub.feature_details || []).forEach((feat: any) => {
        if (!levelMap.has(feat.level)) {
            levelMap.set(feat.level, { level: feat.level, features: [] });
        }
        levelMap.get(feat.level).features.push({ ...feat, name: feat.name, index: feat.index });
    });
    return Array.from(levelMap.values());
};

export const fetchCreatures = async (userId?: string): Promise<any[]> => {
    const custom = await loadHomebrew('custom_beasts', userId).catch(() => []);
    const all = [...COMMON_CREATURES, ...STANDARD_FAMILIARS, ...custom];
    return Array.from(new Map(all.map(c => [c.index, c])).values());
};

export default Library;
