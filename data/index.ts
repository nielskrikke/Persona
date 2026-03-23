import { RACES, ExtendedRaceDetail } from './races';
import { CLASSES, ExtendedClassDetail } from './classes';
import { SUBCLASSES, ExtendedSubclassDetail } from './subclasses';
import { FEATS, ExtendedFeatDetail } from './feats';
import { BACKGROUNDS } from './backgrounds';
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

import { APIReference, RaceDetail, ClassDetail, SubclassDetail, SubraceDetail, EquipmentDetail, SpellDetail, FeatDetail, TraitDetail, BackgroundDetail, CreatureDetail } from '../types';

export { getLocalSpells } from './spells/index';

export const Library = {
    // Race APIs
    getRaces: (): ExtendedRaceDetail[] => RACES,
    getRace: (index: string): ExtendedRaceDetail | undefined => RACES.find(r => r.index === index),
    
    // Class APIs
    getClasses: (): ExtendedClassDetail[] => CLASSES,
    getClass: (index: string): ExtendedClassDetail | undefined => CLASSES.find(c => c.index === index),
    
    // Subclass APIs
    getSubclasses: (classIndex?: string): ExtendedSubclassDetail[] => 
        classIndex ? SUBCLASSES.filter(s => s.class?.index === classIndex) : SUBCLASSES,
    getSubclass: (index: string): ExtendedSubclassDetail | undefined => SUBCLASSES.find(s => s.index === index),

    // Feat APIs
    getFeats: (): ExtendedFeatDetail[] => FEATS,
    getFeat: (index: string): ExtendedFeatDetail | undefined => FEATS.find(f => f.index === index),

    // Background APIs
    getBackgrounds: (): BackgroundDetail[] => BACKGROUNDS,
    getBackground: (indexOrName: string): BackgroundDetail | undefined => BACKGROUNDS.find(b => b.index === indexOrName || b.name === indexOrName),

    // Creatures
    getCreatures: (): CreatureDetail[] => {
        const all = [...COMMON_CREATURES, ...STANDARD_FAMILIARS];
        // Deduplicate by index
        return Array.from(new Map(all.map(c => [c.index, c])).values());
    },

    // Item APIs
    getItem: (index: string): EquipmentDetail | undefined => getItem(index),

    // Comprehensive Search
    search: (query: string) => {
        const q = query.toLowerCase();
        return {
            races: RACES.filter(r => r.name.toLowerCase().includes(q)),
            classes: CLASSES.filter(c => c.name.toLowerCase().includes(q)),
            subclasses: SUBCLASSES.filter(s => s.name.toLowerCase().includes(q)),
            feats: FEATS.filter(f => f.name.toLowerCase().includes(q)),
            backgrounds: BACKGROUNDS.filter(b => b.name.toLowerCase().includes(q)),
            items: ALL_ITEMS.filter(i => i.name.toLowerCase().includes(q)),
            spells: [], 
            creatures: Library.getCreatures().filter(b => b.name.toLowerCase().includes(q))
        };
    }
};

// --- DATA ACCESS ADAPTERS ---

export const fetchRaces = async (userId?: string): Promise<APIReference[]> => {
    const custom = await loadHomebrew('custom_races', userId);
    const combined = [...RACES, ...custom.map((r: any) => ({ ...r, name: `${r.name} (HB)` }))];
    return combined.map(r => ({ index: r.index, name: r.name, url: "", isCustom: r.isCustom }));
};

export const fetchRaceDetail = async (index: string, userId?: string): Promise<RaceDetail | null> => {
    const custom = await loadHomebrew('custom_races', userId);
    const race = [...RACES, ...custom].find(r => r.index === index);
    if (race && custom.some((r: any) => r.index === index)) {
        return { ...race, name: `${race.name} (HB)` };
    }
    return race || null;
};

export const fetchSubraces = async (raceIndex: string, userId?: string): Promise<APIReference[]> => {
    const race = await fetchRaceDetail(raceIndex, userId);
    if (!race || !race.subraces_details) return [];
    return race.subraces_details.map(s => ({ index: s.index, name: s.name, url: "" }));
};

export const fetchSubraceDetail = async (index: string, userId?: string): Promise<SubraceDetail | null> => {
    const races = [...RACES, ...(await loadHomebrew('custom_races', userId))];
    for (const race of races) {
        if (race.subraces_details) {
            const sub = race.subraces_details.find((s: any) => s.index === index);
            if (sub) return sub;
        }
    }
    return null;
};

export const fetchClasses = async (userId?: string): Promise<APIReference[]> => {
    const custom = await loadHomebrew('custom_classes', userId);
    const combined = [...CLASSES, ...custom.map((c: any) => ({ ...c, name: `${c.name} (HB)` }))];
    return combined.map(c => ({ index: c.index, name: c.name, url: "", isCustom: c.isCustom }));
};

export const fetchClassDetail = async (index: string, userId?: string): Promise<ClassDetail | null> => {
    const custom = await loadHomebrew('custom_classes', userId);
    const cls = [...CLASSES, ...custom].find(c => c.index === index);
    if (cls && custom.some((c: any) => c.index === index)) {
        return { ...cls, name: `${cls.name} (HB)` };
    }
    return cls || null;
};

export const fetchSubclasses = async (classIndex: string, userId?: string): Promise<APIReference[]> => {
    const custom = await loadHomebrew('custom_subclasses', userId);
    const combined = [...SUBCLASSES, ...custom.map((s: any) => ({ ...s, name: `${s.name} (HB)` }))];
    return combined
        .filter(s => s.class?.index === classIndex)
        .map(s => ({ index: s.index, name: s.name, url: "", isCustom: s.isCustom }));
};

export const fetchSubclassDetail = async (index: string, userId?: string): Promise<SubclassDetail | null> => {
    const custom = await loadHomebrew('custom_subclasses', userId);
    const sub = [...SUBCLASSES, ...custom].find(s => s.index === index);
    if (sub && custom.some((s: any) => s.index === index)) {
        return { ...sub, name: `${sub.name} (HB)` };
    }
    return sub || null;
};

export const fetchEquipment = async (userId?: string): Promise<EquipmentDetail[]> => {
    const custom = await loadHomebrew('custom_equipment', userId);
    return [...ALL_ITEMS, ...custom.map((i: any) => ({ ...i, name: `${i.name} (HB)` }))];
};

export const fetchEquipmentDetail = async (index: string, userId?: string): Promise<EquipmentDetail | null> => {
    const custom = await loadHomebrew('custom_equipment', userId);
    const item = [...ALL_ITEMS, ...custom].find(i => i.index === index);
    if (item && custom.some((i: any) => i.index === index)) {
        return { ...item, name: `${item.name} (HB)` };
    }
    return item || null;
};

export const fetchBackgrounds = async (userId?: string): Promise<APIReference[]> => {
    const custom = await loadHomebrew('custom_backgrounds', userId);
    const combined = [...BACKGROUNDS, ...custom.map((b: any) => ({ ...b, name: `${b.name} (HB)` }))];
    return combined.map(b => ({ index: b.index, name: b.name, url: "", isCustom: b.isCustom }));
};

export const fetchBackgroundDetail = async (index: string, userId?: string): Promise<BackgroundDetail | null> => {
    const custom = await loadHomebrew('custom_backgrounds', userId);
    const bg = [...BACKGROUNDS, ...custom].find(b => b.index === index);
    if (bg && custom.some((b: any) => b.index === index)) {
        return { ...bg, name: `${bg.name} (HB)` };
    }
    return bg || null;
};

export const fetchSpellsByClass = async (classIndex: string, userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId);
    const local = getLocalSpells(classIndex);
    const customSpells = custom.map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    return [...local, ...customSpells];
};

export const fetchSpellsByClassAndLevel = async (classIndex: string, level: number, userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId);
    const local = getLocalSpells(classIndex).filter(s => s.level === level);
    const customSpells = custom.filter((s: any) => s.level === level).map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    return [...local, ...customSpells];
};

export const fetchAllSpells = async (userId?: string): Promise<SpellDetail[]> => {
    const custom = await loadHomebrew('custom_spells', userId);
    const customSpells = custom.map((s: any) => ({ ...s, name: `${s.name} (HB)` }));
    const all = [
        ...BARD_SPELLS, ...CLERIC_SPELLS, ...DRUID_SPELLS, ...PALADIN_SPELLS, 
        ...RANGER_SPELLS, ...SORCERER_SPELLS, ...WARLOCK_SPELLS, ...WIZARD_SPELLS,
        ...ARTIFICER_SPELLS, ...customSpells
    ];
    return Array.from(new Map(all.map(s => [s.index, s])).values());
};

export const fetchFeatsList = async (): Promise<ExtendedFeatDetail[]> => {
    return FEATS; 
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

    const homebrewClasses = await loadHomebrew('custom_classes', userId);
    for (const c of [...CLASSES, ...homebrewClasses]) {
        if (c.feature_details) {
            const f = findInList(c.feature_details);
            if (f) return f;
        }
    }
    const homebrewSubclasses = await loadHomebrew('custom_subclasses', userId);
    for (const s of [...SUBCLASSES, ...homebrewSubclasses]) {
        if (s.feature_details) {
            const f = findInList(s.feature_details);
            if (f) return f;
        }
    }
    const feat = FEATS.find(f => f.index === index || f.index === cleanIndex);
    if (feat) return feat;

    return null;
};

export const fetchFeatureDetailBySource = async (index: string, source: string, userId?: string): Promise<any | null> => {
    const customClasses = await loadHomebrew('custom_classes', userId);
    const cls = [...CLASSES, ...customClasses].find(c => c.name === source);
    if (cls && cls.feature_details) {
        const feat = cls.feature_details.find((f: any) => f.index === index);
        if (feat) return feat;
    }
    
    const customSubclasses = await loadHomebrew('custom_subclasses', userId);
    const sub = [...SUBCLASSES, ...customSubclasses].find(s => s.name === source);
    if (sub && sub.feature_details) {
        const feat = sub.feature_details.find((f: any) => f.index === index);
        if (feat) return feat;
    }
    
    return fetchFeatureDetail(index, userId);
};

export const fetchTraitDetail = async (index: string, userId?: string): Promise<TraitDetail | null> => {
    const customRaces = await loadHomebrew('custom_races', userId);
    for (const r of [...RACES, ...customRaces]) {
        const t = r.traits.find((tr: any) => tr.index === index);
        if (t) return t;
        if (r.subraces_details) {
            for (const sub of r.subraces_details) {
                const subT = sub.traits.find((tr: any) => tr.index === index);
                if (subT) return subT;
            }
        }
    }
    return null;
};

export const fetchLevelFeatures = async (classIndex: string, level: number, userId?: string): Promise<any[]> => {
    const customClasses = await loadHomebrew('custom_classes', userId);
    const cls = [...CLASSES, ...customClasses].find(c => c.index === classIndex);
    if (!cls) return [];
    
    const levelRow = cls.level_table?.find((l: any) => l.level === level);
    if (!levelRow) return [];

    return levelRow.features.map((fName: string) => {
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
    const customClasses = await loadHomebrew('custom_classes', userId);
    const cls = [...CLASSES, ...customClasses].find(c => c.index === classIndex);
    if (!cls) return [];
    return (cls.level_table || []).map((row: any) => ({
        level: row.level,
        features: row.features.map((fName: string) => {
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
    const customSubs = await loadHomebrew('custom_subclasses', userId);
    const sub = [...SUBCLASSES, ...customSubs].find(s => s.index === subclassIndex);
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

export const fetchCreatures = async (userId?: string): Promise<CreatureDetail[]> => {
    const custom = await loadHomebrew('custom_beasts', userId);
    const all = [...COMMON_CREATURES, ...STANDARD_FAMILIARS, ...custom];
    return Array.from(new Map(all.map(c => [c.index, c])).values());
};

export default Library;