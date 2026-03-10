import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pducitlqzhcjjeqthkof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdWNpdGxxemhjamplcXRoa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQ5MjksImV4cCI6MjA4NTc0MDkyOX0.akpxEEytntkNy8rDjfp4FDOLuQW2LjdYqED1F-Z811g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const loginUser = async (username: string) => {
    const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username)
        .single();
    
    if (error) throw error;
    return data;
};

export const saveCharacterToDb = async (character: any, userId: string) => {
    if (!userId) throw new Error("No user ID provided for saving.");

    const { id, user_id, ...charData } = character;
    
    if (!id) {
        // Insert new
        const { data, error } = await supabase
            .from('characters')
            .insert([{ 
                user_id: userId,
                name: character.name || 'Unnamed Hero', 
                data: charData 
            }])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    } else {
        // Update existing
        const { data, error } = await supabase
            .from('characters')
            .update({ 
                name: character.name, 
                data: charData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

export const loadCharacters = async (userId: string) => {
    if (!userId) return [];
    
    // Fetch characters owned by user
    const { data: owned, error: ownedError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId);
        
    if (ownedError) throw ownedError;

    // Fetch characters shared with user
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
    
    const all = [...owned, ...shared];
    return all.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
};

export const fetchAllUsers = async () => {
    const { data, error } = await supabase
        .from('app_users')
        .select('id, username')
        .order('username');
    if (error) throw error;
    return data;
};

export const shareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const { error } = await supabase
        .from('character_shares')
        .insert([{ character_id: characterId, shared_with_user_id: sharedWithUserId }]);
    if (error) throw error;
    return true;
};

export const unshareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const { error } = await supabase
        .from('character_shares')
        .delete()
        .eq('character_id', characterId)
        .eq('shared_with_user_id', sharedWithUserId);
    if (error) throw error;
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

    if (error) throw error;
    return true;
};

// --- HOMEBREW SERVICES ---

export const loadHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    userId?: string
) => {
    let query = supabase.from(table).select('*');
    
    if (userId) {
        // Load items that are either public OR created by this user
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
        // If no user, only load public items
        query = query.eq('is_public', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        console.error(`Error loading homebrew from ${table}:`, error);
        return [];
    }
    return data.map(item => ({ ...item.data, id: item.id, user_id: item.user_id, is_public: item.is_public, isCustom: true }));
};

export const saveHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats', 
    userId: string, 
    payload: any,
    isPublic: boolean = false
) => {
    const { data, error } = await supabase
        .from(table)
        .insert([{ 
            user_id: userId,
            name: payload.name, 
            data: payload,
            is_public: isPublic
        }])
        .select()
        .single();
        
    if (error) throw error;
    return data;
};

export const deleteHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    id: string,
    userId: string
) => {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    
    if (error) throw error;
    return true;
};
