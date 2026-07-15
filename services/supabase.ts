import { createClient } from '@supabase/supabase-js';

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
    const { id, user_id, ...charData } = character;
    
    if (!id) {
        const { data, error } = await supabase
            .from('characters')
            .insert([{ user_id: userId, name: character.name || 'Unnamed Hero', data: charData }])
            .select()
            .maybeSingle();
        if (error) throw new Error(error.message || "Failed to save character");
        return data;
    } else {
        const { data, error } = await supabase
            .from('characters')
            .update({ name: character.name, data: charData, updated_at: new Date().toISOString() })
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
    return all;
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

export const loadHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    userId?: string
) => {
    const cacheKey = `${table}_${userId || 'public'}`;
    const now = Date.now();
    
    if (homebrewCache[cacheKey] && (now - homebrewCache[cacheKey].timestamp < CACHE_DURATION)) {
        return homebrewCache[cacheKey].data;
    }

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
        if (error) throw error;

        const results = (data || []).map((item: any) => ({ 
            ...item.data, 
            id: item.id, 
            user_id: item.user_id, 
            is_public: item.is_public, 
            is_homebrew: item.is_homebrew ?? item.data?.is_homebrew ?? item.homebrew ?? false,
            isCustom: true 
        }));
        
        homebrewCache[cacheKey] = { data: results, timestamp: now };
        return results;
    } catch (error) {
        console.error(`Error loading homebrew from ${table}:`, error);
    }

    return [];
};

export const saveHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats', 
    userId: string, 
    payload: any,
    isPublic: boolean = false,
    id?: string
) => {
    const isValidUUID = (uuid: any) => {
        if (typeof uuid !== 'string') return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
    };

    try {
        if (id && isValidUUID(id)) {
            // Check if row belongs to user
            const { data: existing, error: fetchErr } = await supabase.from(table).select('user_id').eq('id', id).maybeSingle();
            if (!fetchErr && existing && existing.user_id === userId) {
                const { data, error } = await supabase
                    .from(table)
                    .update({ 
                        name: payload.name, 
                        data: payload,
                        is_public: isPublic
                    })
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select()
                    .maybeSingle();
                    
                if (error) throw new Error(error.message);
                return {
                    ...data.data,
                    id: data.id,
                    user_id: data.user_id,
                    is_public: data.is_public,
                    is_homebrew: data.is_homebrew ?? data.data?.is_homebrew ?? data.homebrew ?? false,
                    isCustom: true
                };
            }
        }

        // Insert as new row (or user override copy)
        const { data, error } = await supabase
            .from(table)
            .insert([{ 
                user_id: userId,
                name: payload.name, 
                data: payload,
                is_public: isPublic
            }])
            .select()
            .maybeSingle();
            
        if (error) throw new Error(error.message);
        return {
            ...data.data,
            id: data.id,
            user_id: data.user_id,
            is_public: data.is_public,
            is_homebrew: data.is_homebrew ?? data.data?.is_homebrew ?? data.homebrew ?? false,
            isCustom: true
        };
    } catch (error: any) {
        throw new Error(error.message || `Failed to save ${table}`);
    }
};

export const deleteHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    id: string,
    userId: string
) => {
    const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

    if (!userId || typeof userId !== 'string' || !isValidUUID(userId)) {
        throw new Error("Valid User ID required");
    }

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    return true;
};

