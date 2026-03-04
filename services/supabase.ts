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
    
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
        
    if (error) throw error;
    return data;
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

export const loadHomebrew = async (table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment') => {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error(`Error loading homebrew from ${table}:`, error);
        return [];
    }
    return data.map(item => ({ ...item.data, id: item.id, user_id: item.user_id, isCustom: true }));
};

export const saveHomebrew = async (table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment', userId: string, payload: any) => {
    const { data, error } = await supabase
        .from(table)
        .insert([{ 
            user_id: userId,
            name: payload.name, 
            data: payload 
        }])
        .select()
        .single();
        
    if (error) throw error;
    return data;
};