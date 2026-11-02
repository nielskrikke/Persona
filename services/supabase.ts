import { createClient } from '@supabase/supabase-js';
import { Campaign, CampaignPartyInventory, CampaignRoll } from '../types';
import { mergeContentData } from './contentMerge';

const SUPABASE_URL = 'https://pducitlqzhcjjeqthkof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdWNpdGxxemhjamplcXRoa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQ5MjksImV4cCI6MjA4NTc0MDkyOX0.akpxEEytntkNy8rDjfp4FDOLuQW2LjdYqED1F-Z811g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const loginUser = async (username: string) => {
    const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

    if (error) {
        throw new Error(error.message || "Failed to login");
    }
    return data;
};

export const saveCharacterToDb = async (character: any, userId: string) => {
    if (!userId) throw new Error("User ID required");

    // Safely unwrap nested .data objects if character was passed wrapped in a DB record
    let flatChar = character;
    if (flatChar.data && typeof flatChar.data === 'object' && !Array.isArray(flatChar.data)) {
        let current = flatChar.data;
        while (current.data && typeof current.data === 'object' && !Array.isArray(current.data)) {
            const { data: inner, ...rest } = current;
            current = { ...inner, ...rest };
        }
        flatChar = { ...current, id: flatChar.id || current.id, user_id: flatChar.user_id || current.user_id, name: flatChar.name || current.name };
    }

    const { id, user_id, created_at, updated_at, isShared, ...charData } = flatChar;
    const charName = flatChar.name || charData.name || 'Unnamed Hero';

    if (!id) {
        const { data, error } = await supabase
            .from('characters')
            .insert([{ user_id: userId, name: charName, data: charData }])
            .select()
            .maybeSingle();
        if (error) throw new Error(error.message || "Failed to save character");
        return data;
    } else {
        const { data, error } = await supabase
            .from('characters')
            .update({ name: charName, data: charData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .maybeSingle();
        if (error) throw new Error(error.message || "Failed to save character");
        return data;
    }
};

export const loadCharacters = async (userId: string) => {
    if (!userId) return [];

    // Fetch owned
    const { data: owned, error: ownedError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId);
    if (ownedError) throw new Error(ownedError.message);

    // Fetch shared
    const { data: sharedEntries, error: sharedError } = await supabase
        .from('character_shares')
        .select('character_id')
        .eq('shared_with_user_id', userId);

    let shared: any[] = [];
    if (!sharedError && sharedEntries && sharedEntries.length > 0) {
        const sharedIds = sharedEntries.map(s => s.character_id);
        const { data: sharedChars, error: sharedCharsError } = await supabase
            .from('characters')
            .select('*')
            .in('id', sharedIds);
        if (!sharedCharsError && sharedChars) {
            shared = sharedChars.map(c => ({ ...c, isShared: true }));
        }
    }

    const all = [...owned, ...shared].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Repair any characters that suffered from nested .data corruption
    return all.map(c => {
        let charData = c.data || {};
        while (charData.data && typeof charData.data === 'object' && !Array.isArray(charData.data)) {
            const { data: inner, ...rest } = charData;
            charData = { ...inner, ...rest };
        }
        return {
            ...c,
            name: c.name || charData.name || 'Unnamed Hero',
            data: charData
        };
    });
};

export const fetchAllUsers = async () => {
    const { data, error } = await supabase
        .from('app_users')
        .select('id, username')
        .order('username');
    if (error) throw new Error(error.message || "Failed to fetch users");
    return data;
};

export const shareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const { error } = await supabase
        .from('character_shares')
        .insert([{ character_id: characterId, shared_with_user_id: sharedWithUserId }]);
    if (error) throw new Error(error.message || "Failed to share character");
    return true;
};

export const unshareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const { error } = await supabase
        .from('character_shares')
        .delete()
        .eq('character_id', characterId)
        .eq('shared_with_user_id', sharedWithUserId);
    if (error) throw new Error(error.message || "Failed to unshare character");
    return true;
};

export const fetchShares = async (characterId: string) => {
    const { data, error } = await supabase
        .from('character_shares')
        .select('shared_with_user_id')
        .eq('character_id', characterId);
    if (error) return [];
    return data.map(d => d.shared_with_user_id);
};

export const deleteCharacter = async (id: string) => {
    const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message || "Failed to delete character");
    return true;
};

// --- HOMEBREW SERVICES ---

const homebrewCache: Record<string, { data: any[], timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30 seconds



const getLocalHomebrew = (table: string): any[] => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return [];
        const stored = localStorage.getItem(`persona_homebrew_${table}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                const map = new Map<string, any>();
                parsed.forEach((i: any) => {
                    const key = (i.index || (i.name ? i.name.toLowerCase().replace(/\s+/g, '-') : '') || i.id || '').toLowerCase();
                    if (key) {
                        map.set(key, { ...map.get(key), ...i });
                    }
                });
                return Array.from(map.values());
            }
        }
    } catch (e) {
        console.error(`Error reading local homebrew for ${table}`, e);
    }
    return [];
};

const setLocalHomebrew = (table: string, items: any[]) => {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        localStorage.setItem(`persona_homebrew_${table}`, JSON.stringify(items));
    } catch (e) {
        console.error(`Error writing local homebrew for ${table}`, e);
    }
};

const contentQualityScore = (table: string, item: any): number => {
    let score = 0;
    if (item?.source && String(item.source).toLowerCase() !== 'homebrew') score += 100;
    if (item?.is_homebrew === false || item?.homebrew === false) score += 10;
    switch (table) {
        case 'custom_classes':
            score += (item?.proficiency_choices?.length || 0) * 20;
            score += (item?.level_table || []).some((row: any) => row?.class_specific) ? 60 : 0;
            score += (item?.feature_details?.length || 0);
            score += item?.options ? Object.keys(item.options).length * 5 : 0;
            break;
        case 'custom_subclasses':
            score += (item?.feature_details?.length || 0) * 10;
            score += item?.options ? Object.keys(item.options).length * 5 : 0;
            break;
        case 'custom_races':
            score += (item?.subraces_details?.length || 0) * 10;
            score += (item?.traits?.length || 0);
            score += (item?.choices?.length || 0);
            break;
        case 'custom_backgrounds':
            score += (item?.proficiency_choices?.length || 0) * 10;
            score += (item?.choices?.length || 0) * 5;
            score += item?.languages ? 5 : 0;
            break;
        case 'custom_feats':
            score += (item?.effects?.length || 0) * 10;
            break;
    }
    return score;
};

export const loadHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    userId?: string
) => {
    const cacheKey = `${table}_${userId || 'public'}`;
    const now = Date.now();

    if (homebrewCache[cacheKey] && (now - homebrewCache[cacheKey].timestamp < CACHE_DURATION)) {
        return homebrewCache[cacheKey].data;
    }

    const localItems = getLocalHomebrew(table);
    let remoteItems: any[] = [];

    try {
        let query = supabase.from(table).select('*');

        const isValidUUID = (uuid: any) => {
            if (typeof uuid !== 'string') return false;
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
        };

        if (userId && isValidUUID(userId)) {
            query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
        } else {
            query = query.eq('is_public', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) {
            remoteItems = data.map((item: any) => {
                const itemIndex = (item.data?.index || item.index || (item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : '')).toLowerCase();
                const isHB = item.is_homebrew ?? item.data?.is_homebrew ?? item.homebrew ?? true;
                return {
                    ...(item.data || {}),
                    id: item.id,
                    index: itemIndex || item.data?.index,
                    user_id: item.user_id,
                    is_public: item.is_public,
                    is_homebrew: isHB,
                    isCustom: true
                };
            });
        }
    } catch (error) {
        console.error(`Error loading homebrew from Supabase ${table}:`, error);
    }

    // Merge remote and local items by canonical key
    const itemMap = new Map<string, any>();

    const getItemKey = (item: any) => {
        const idx = item.index || item.id;
        if (idx && typeof idx === 'string') return idx.toLowerCase().trim();
        if (item.name) return item.name.toLowerCase().replace(/\s+/g, '-').trim();
        return '';
    };

    remoteItems.forEach(item => {
        const key = getItemKey(item);
        if (!key) return;
        const existing = itemMap.get(key);
        if (!existing || contentQualityScore(table, item) >= contentQualityScore(table, existing)) {
            itemMap.set(key, {
                ...item,
                is_homebrew: item.is_homebrew ?? item.homebrew ?? true
            });
        }
    });

    localItems.forEach(item => {
        const key = getItemKey(item);
        if (!key) return;
        const existing = itemMap.get(key);
        if (!existing || contentQualityScore(table, item) >= contentQualityScore(table, existing)) {
            itemMap.set(key, {
                ...existing,
                ...item,
                is_homebrew: item.is_homebrew ?? existing?.is_homebrew ?? true
            });
        }
    });

    const results = Array.from(itemMap.values());
    homebrewCache[cacheKey] = { data: results, timestamp: now };
    return results;
};

class ContentSaveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ContentSaveError';
    }
}

export const saveHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    userId?: string,
    payload: any = {},
    isPublic: boolean = false,
    id?: string
) => {
    const isValidUUID = (uuid: any) => {
        if (typeof uuid !== 'string') return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
    };

    const validUserId = (userId && isValidUUID(userId)) ? userId : null;
    const itemIndex = (payload.index || (payload.name ? payload.name.toLowerCase().replace(/\s+/g, '-') : '')).toLowerCase();
    const finalId = id || payload.id || `hb-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;

    // Load the current remote row first. This serves two purposes:
    //   1. we can merge instead of replacing the document;
    //   2. we can refuse to turn a blocked update into a duplicate insert.
    let existingRow: any = null;
    const lookupId = id && isValidUUID(id)
        ? id
        : (payload.id && isValidUUID(payload.id) ? payload.id : undefined);
    if (lookupId) {
        const { data, error } = await supabase
            .from(table)
            .select('id, name, user_id, data, homebrew')
            .eq('id', lookupId)
            .maybeSingle();
        if (error) {
            console.warn(`Could not read ${table}/${lookupId} before save:`, error.message);
        }
        if (data) existingRow = data;
    }

    if (existingRow && existingRow.user_id && existingRow.user_id !== validUserId) {
        throw new ContentSaveError('This content belongs to another user. Duplicate it instead of editing the shared record.');
    }

    const localItems = getLocalHomebrew(table);
    const existingLocalIndex = localItems.findIndex((i: any) =>
        (i.id && String(i.id) === String(finalId)) ||
        (i.index && itemIndex && String(i.index).toLowerCase() === itemIndex) ||
        (i.name && payload.name && String(i.name).toLowerCase() === String(payload.name).toLowerCase())
    );
    const existingLocal = existingLocalIndex >= 0 ? localItems[existingLocalIndex] : null;
    const existingData = existingRow?.data || existingLocal?.data || existingLocal || {};
    const isHB = payload.is_homebrew !== undefined
        ? payload.is_homebrew
        : existingRow?.homebrew !== undefined
            ? existingRow.homebrew
            : existingLocal?.is_homebrew !== undefined
                ? existingLocal.is_homebrew
                : true;

    // Merge the partial Forge payload over the existing document. Fields the
    // form does not know about are preserved.
    const mergedData = mergeContentData(table, existingData, payload);

    const fullItem = {
        ...mergedData,
        index: itemIndex || mergedData.index,
        id: finalId,
        user_id: validUserId,
        is_public: isPublic,
        is_homebrew: isHB,
        isCustom: true
    };

    const persistLocal = (item: any) => {
        const items = getLocalHomebrew(table);
        const idx = items.findIndex((i: any) =>
            (i.id && String(i.id) === String(item.id)) ||
            (i.index && item.index && String(i.index).toLowerCase() === String(item.index).toLowerCase()) ||
            (i.name && item.name && String(i.name).toLowerCase() === String(item.name).toLowerCase())
        );
        if (idx >= 0) items[idx] = item;
        else items.unshift(item);
        setLocalHomebrew(table, items);
    };

    // Invalidate cache
    Object.keys(homebrewCache).forEach(k => {
        if (k.startsWith(table)) delete homebrewCache[k];
    });

    // Sync to Supabase.
    try {
        if (existingRow) {
            const { data, error } = await supabase
                .from(table)
                .update({
                    name: payload.name || existingRow.name || 'Unnamed',
                    data: fullItem,
                    is_public: isPublic
                })
                .eq('id', existingRow.id)
                .select('id, data')
                .maybeSingle();

            if (error) throw new ContentSaveError(error.message || 'Failed to update content');
            if (!data) {
                throw new ContentSaveError('The content update was blocked (0 rows returned). The record was not changed.');
            }

            const saved = {
                ...(data.data || fullItem),
                id: data.id || existingRow.id,
                user_id: existingRow.user_id || validUserId,
                is_public: isPublic,
                is_homebrew: isHB,
                isCustom: true
            };
            persistLocal(saved);
            return saved;
        }

        // Insert new row. Do not look up an existing row by name here: that
        // path is what turned updates into duplicate inserts.
        // New local-only content is kept if the remote insert fails/offline.
        persistLocal(fullItem);

        const insertData: any = {
            name: payload.name || 'Unnamed',
            data: fullItem,
            is_public: isPublic
        };
        if (validUserId) insertData.user_id = validUserId;

        const { data, error } = await supabase
            .from(table)
            .insert([insertData])
            .select('id, data')
            .maybeSingle();

        if (error) throw new ContentSaveError(error.message || 'Failed to insert content');
        if (!data) {
            throw new ContentSaveError('The content insert was blocked (0 rows returned). The record was not created.');
        }

        const insertedRow: any = data;
        const saved = {
            ...(insertedRow.data || fullItem),
            id: insertedRow.id,
            user_id: insertedRow.user_id || validUserId,
            is_public: insertedRow.is_public ?? isPublic,
            is_homebrew: isHB,
            isCustom: true
        };
        persistLocal(saved);
        return saved;
    } catch (error: any) {
        if (error?.name === 'ContentSaveError') throw error;
        console.warn(`Supabase save error for ${table} (retained in localStorage):`, error?.message || error);
    }

    return fullItem;
};

export const deleteHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    id: string,
    userId?: string
) => {
    // 1. Delete from localStorage
    const localItems = getLocalHomebrew(table);
    const filtered = localItems.filter((i: any) => String(i.id) !== String(id) && i.index !== id);
    setLocalHomebrew(table, filtered);

    // Invalidate cache
    Object.keys(homebrewCache).forEach(k => {
        if (k.startsWith(table)) delete homebrewCache[k];
    });

    // 2. Try deleting from Supabase
    try {
        const isValidUUID = (uuid: any) => typeof uuid === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
        if (isValidUUID(id)) {
            let query = supabase.from(table).delete().eq('id', id);
            if (userId && isValidUUID(userId)) {
                query = query.eq('user_id', userId);
            }
            await query;
        }
    } catch (e) {
        console.warn(`Supabase delete warning for ${table}:`, e);
    }

    return true;
};

// --- CAMPAIGN SERVICES ---

export const loadCampaigns = async (userId?: string): Promise<Campaign[]> => {
    // Purge any stale local storage campaigns created before database table existed
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('persona_campaigns');
        }
    } catch (e) {}

    try {
        const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            return data.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                code: c.code,
                created_at: c.created_at,
                created_by: c.created_by,
                characters: c.characters || []
            }));
        } else if (error) {
            console.error("Error loading campaigns from database:", error);
        }
    } catch (e) {
        console.error("Failed to load campaigns from database:", e);
    }
    return [];
};

export const createCampaign = async (name: string, description: string = '', userId?: string): Promise<Campaign> => {
    const code = 'CMP-' + Math.floor(100000 + Math.random() * 900000).toString();

    const isValidUUID = (uuid: any) => {
        if (typeof uuid !== 'string') return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
    };

    const validUserId = isValidUUID(userId) ? userId : null;

    let payload: any = {
        name,
        description,
        code,
        characters: []
    };

    if (validUserId) {
        payload.created_by = validUserId;
    }

    let { data, error } = await supabase.from('campaigns').insert([payload]).select().maybeSingle();

    if (error) {
        console.warn("First campaign creation attempt failed, retrying with fallback payloads:", error.message);

        // Try with user_id
        const payload2: any = { name, description, code, characters: [] };
        if (validUserId) payload2.user_id = validUserId;
        const res2 = await supabase.from('campaigns').insert([payload2]).select().maybeSingle();

        if (!res2.error && res2.data) {
            data = res2.data;
            error = null;
        } else {
            // Try minimal payload without created_by / user_id
            const payload3 = { name, description, code, characters: [] };
            const res3 = await supabase.from('campaigns').insert([payload3]).select().maybeSingle();
            if (!res3.error && res3.data) {
                data = res3.data;
                error = null;
            } else {
                // Try payload with explicit string/UUID id
                const genId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cmp-' + Date.now();
                const payload4 = { id: genId, name, description, code, characters: [] };
                const res4 = await supabase.from('campaigns').insert([payload4]).select().maybeSingle();
                if (!res4.error && res4.data) {
                    data = res4.data;
                    error = null;
                } else if (res4.error) {
                    error = res4.error;
                }
            }
        }
    }

    if (error) {
        console.error("Supabase campaign creation error:", error);
        throw new Error(error.message || "Failed to create campaign in database.");
    }

    if (!data) {
        throw new Error("No data returned from database upon campaign creation.");
    }

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        code: data.code,
        created_at: data.created_at,
        created_by: data.created_by || data.user_id,
        characters: data.characters || []
    };
};

export const deleteCampaign = async (campaignId: string): Promise<boolean> => {
    // Purge stale local storage
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('persona_campaigns');
        }
    } catch (e) {}

    try {
        const { error } = await supabase.from('campaigns').delete().eq('id', campaignId);
        if (error) {
            console.warn("Delete campaign warning from Supabase:", error);
        }
    } catch (e) {
        console.warn("Delete campaign exception:", e);
    }

    return true;
};

export const joinCampaignByCode = async (code: string, character: any, userId?: string): Promise<Campaign> => {
    const cleanCode = code.trim().toUpperCase();

    const { data: campaignData, error: fetchErr } = await supabase
        .from('campaigns')
        .select('*')
        .ilike('code', cleanCode)
        .maybeSingle();

    if (fetchErr || !campaignData) {
        throw new Error("Campaign with that code was not found. Please verify the join code.");
    }

    let flat = character.data ? { ...character.data, id: character.id } : character;
    while (flat.data && typeof flat.data === 'object' && !Array.isArray(flat.data)) {
        const { data: inner, ...rest } = flat;
        flat = { ...inner, ...rest };
    }

    const charEntry = {
        id: flat.id || character.id,
        name: flat.name || character.name || 'Hero',
        avatarUrl: flat.avatarUrl || '',
        user_id: userId || flat.user_id,
        race: flat.race?.name || (typeof flat.race === 'string' ? flat.race : ''),
        className: flat.classes?.[0]?.definition?.name || flat.className || '',
        level: flat.level || 1
    };

    // Remove from other campaigns first
    const { data: allCampaigns } = await supabase.from('campaigns').select('*');
    if (allCampaigns) {
        for (const c of allCampaigns) {
            if (c.id !== campaignData.id && c.characters && Array.isArray(c.characters)) {
                if (c.characters.some((ch: any) => ch.id === charEntry.id)) {
                    const filtered = c.characters.filter((ch: any) => ch.id !== charEntry.id);
                    await supabase.from('campaigns').update({ characters: filtered }).eq('id', c.id);
                }
            }
        }
    }

    const existingChars = campaignData.characters || [];
    const updatedChars = existingChars.filter((c: any) => c.id !== charEntry.id);
    updatedChars.push(charEntry);

    const { data: updatedCampaign, error: updateErr } = await supabase
        .from('campaigns')
        .update({ characters: updatedChars })
        .eq('id', campaignData.id)
        .select()
        .maybeSingle();

    if (updateErr || !updatedCampaign) {
        throw new Error(updateErr?.message || "Failed to join campaign in database.");
    }

    return {
        id: updatedCampaign.id,
        name: updatedCampaign.name,
        description: updatedCampaign.description,
        code: updatedCampaign.code,
        created_at: updatedCampaign.created_at,
        created_by: updatedCampaign.created_by,
        characters: updatedCampaign.characters || []
    };
};

export const linkCharacterToCampaign = async (characterId: string, campaignId: string | null, campaignName?: string | null, characterData?: any, userId?: string): Promise<boolean> => {
    // First, always remove character from any existing campaign
    const { data: allCampaigns } = await supabase.from('campaigns').select('*');
    if (allCampaigns) {
        for (const c of allCampaigns) {
            if (c.id !== campaignId && c.characters && Array.isArray(c.characters)) {
                if (c.characters.some((ch: any) => ch.id === characterId)) {
                    const filtered = c.characters.filter((ch: any) => ch.id !== characterId);
                    await supabase.from('campaigns').update({ characters: filtered }).eq('id', c.id);
                }
            }
        }
    }

    if (campaignId) {
        const { data: target } = await supabase.from('campaigns').select('*').eq('id', campaignId).maybeSingle();
        if (target) {
            let flat = characterData ? (characterData.data ? { ...characterData.data, id: characterId } : characterData) : {};
            while (flat.data && typeof flat.data === 'object' && !Array.isArray(flat.data)) {
                const { data: inner, ...rest } = flat;
                flat = { ...inner, ...rest };
            }

            const charEntry = {
                id: characterId,
                name: flat.name || 'Hero',
                avatarUrl: flat.avatarUrl || '',
                user_id: userId || flat.user_id,
                race: flat.race?.name || (typeof flat.race === 'string' ? flat.race : ''),
                className: flat.classes?.[0]?.definition?.name || flat.className || '',
                level: flat.level || 1
            };
            const updatedChars = (target.characters || []).filter((c: any) => c.id !== characterId);
            updatedChars.push(charEntry);
            await supabase.from('campaigns').update({ characters: updatedChars }).eq('id', campaignId);
        }
    }
    return true;
};

export const loadPartyInventory = async (campaignId: string): Promise<CampaignPartyInventory> => {
    const defaultVal: CampaignPartyInventory = {
        campaign_id: campaignId,
        inventory: [],
        currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
    };

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const local = localStorage.getItem(`persona_campaign_inv_${campaignId}`);
            if (local) {
                const parsed = JSON.parse(local);
                if (parsed) defaultVal.inventory = parsed.inventory || [];
                if (parsed.currency) defaultVal.currency = parsed.currency;
            }
        }
    } catch (e) {}

    try {
        const { data, error } = await supabase.from('campaign_inventory').select('*').eq('campaign_id', campaignId).maybeSingle();
        if (!error && data) {
            const remoteVal: CampaignPartyInventory = {
                campaign_id: campaignId,
                inventory: data.inventory || [],
                currency: data.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
            };
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(`persona_campaign_inv_${campaignId}`, JSON.stringify(remoteVal));
            }
            return remoteVal;
        }
    } catch (e) {}

    return defaultVal;
};

export const savePartyInventory = async (campaignId: string, inventory: any[], currency: any): Promise<boolean> => {
    const payload = { campaign_id: campaignId, inventory, currency };
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(`persona_campaign_inv_${campaignId}`, JSON.stringify(payload));
        }
    } catch (e) {}

    try {
        const { data } = await supabase.from('campaign_inventory').select('campaign_id').eq('campaign_id', campaignId).maybeSingle();
        if (data) {
            await supabase.from('campaign_inventory').update({ inventory, currency, updated_at: new Date().toISOString() }).eq('campaign_id', campaignId);
        } else {
            await supabase.from('campaign_inventory').insert([{ campaign_id: campaignId, inventory, currency }]);
        }
    } catch (e) {}

    return true;
};

export const loadPartyRolls = async (campaignId: string): Promise<CampaignRoll[]> => {
    let localRolls: CampaignRoll[] = [];
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem(`persona_campaign_rolls_${campaignId}`);
            if (stored) localRolls = JSON.parse(stored);
        }
    } catch (e) {}

    try {
        const { data, error } = await supabase.from('campaign_rolls').select('*').eq('campaign_id', campaignId).order('timestamp', { ascending: false }).limit(50);
        if (!error && data && data.length > 0) {
            const remoteRolls: CampaignRoll[] = data.map(r => ({
                id: r.id,
                campaign_id: r.campaign_id,
                character_id: r.character_id,
                character_name: r.character_name,
                formula: r.formula || r.die || '1d20',
                die: r.die,
                rolls: r.rolls || [],
                modifier: r.modifier,
                total: r.total,
                isCrit: r.is_crit,
                isFail: r.is_fail,
                label: r.label,
                timestamp: r.timestamp
            }));
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(`persona_campaign_rolls_${campaignId}`, JSON.stringify(remoteRolls));
            }
            return remoteRolls;
        }
    } catch (e) {}

    return localRolls;
};

export const addPartyRoll = async (campaignId: string, roll: CampaignRoll): Promise<boolean> => {
    let localRolls: CampaignRoll[] = [];
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem(`persona_campaign_rolls_${campaignId}`);
            if (stored) localRolls = JSON.parse(stored);
            localRolls.unshift(roll);
            localRolls = localRolls.slice(0, 50);
            localStorage.setItem(`persona_campaign_rolls_${campaignId}`, JSON.stringify(localRolls));
        }
    } catch (e) {}

    try {
        await supabase.from('campaign_rolls').insert([{
            id: roll.id || `roll-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
            campaign_id: campaignId,
            character_id: roll.character_id,
            character_name: roll.character_name,
            die: roll.die,
            rolls: roll.rolls,
            modifier: roll.modifier,
            total: roll.total,
            is_crit: roll.isCrit,
            is_fail: roll.isFail,
            label: roll.label,
            timestamp: roll.timestamp
        }]);
    } catch (e) {}

    return true;
};


