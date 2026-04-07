import { createClient } from '@supabase/supabase-js';

// We keep the client for types if needed, but we'll use API proxies for actual calls to avoid CORS/Load failed errors in the browser
const SUPABASE_URL = 'https://pducitlqzhcjjeqthkof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdWNpdGxxemhjamplcXRoa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQ5MjksImV4cCI6MjA4NTc0MDkyOX0.akpxEEytntkNy8rDjfp4FDOLuQW2LjdYqED1F-Z811g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const loginUser = async (username: string) => {
    const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to login");
    }
    return response.json();
};

export const saveCharacterToDb = async (character: any, userId: string) => {
    const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, userId })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save character");
    }
    return response.json();
};

export const loadCharacters = async (userId: string) => {
    if (!userId) return [];
    const response = await fetch(`/api/characters?userId=${userId}`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to load characters");
    }
    return response.json();
};

export const fetchAllUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch users");
    }
    return response.json();
};

export const shareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const response = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, sharedWithUserId })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to share character");
    }
    return true;
};

export const unshareCharacter = async (characterId: string, sharedWithUserId: string) => {
    const response = await fetch('/api/shares', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, sharedWithUserId })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to unshare character");
    }
    return true;
};

export const fetchShares = async (characterId: string) => {
    const response = await fetch(`/api/shares/${characterId}`);
    if (!response.ok) return [];
    return response.json();
};

export const deleteCharacter = async (id: string) => {
    const response = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete character");
    }
    return true;
};

// --- HOMEBREW SERVICES ---

export const loadHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    userId?: string
) => {
    try {
        const url = userId ? `/api/homebrew/${table}?userId=${userId}` : `/api/homebrew/${table}`;
        const response = await fetch(url);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `Failed to load ${table}`);
        }
        const data = await response.json();
        return data.map((item: any) => ({ 
            ...item.data, 
            id: item.id, 
            user_id: item.user_id, 
            is_public: item.is_public, 
            isCustom: true 
        }));
    } catch (error) {
        console.error(`Error loading homebrew from ${table}:`, error);
        return [];
    }
};

export const saveHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats', 
    userId: string, 
    payload: any,
    isPublic: boolean = false,
    id?: string
) => {
    const response = await fetch(`/api/homebrew/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, payload, isPublic, id })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Failed to save ${table}`);
    }
    return response.json();
};

export const deleteHomebrew = async (
    table: 'custom_races' | 'custom_classes' | 'custom_subclasses' | 'custom_backgrounds' | 'custom_spells' | 'custom_equipment' | 'custom_beasts' | 'custom_familiars' | 'custom_feats',
    id: string,
    userId: string
) => {
    const response = await fetch(`/api/homebrew/${table}/${id}?userId=${userId}`, { method: 'DELETE' });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Failed to delete ${table}`);
    }
    return true;
};
