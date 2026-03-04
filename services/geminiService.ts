import { CharacterState, SpellDetail } from '../types';

export const askTheDM = async (query: string, character: CharacterState): Promise<string> => {
    return "AI Services have been disabled.";
};

export const parseCustomSpell = async (text: string): Promise<Partial<SpellDetail> | null> => {
    return null;
};