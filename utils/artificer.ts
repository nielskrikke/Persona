import { CharacterState } from '../types';

const MANAGED_WIDGETS = ['steelDefender', 'eldritchCannon', 'magicItemTinker', 'mapHolders', 'experimentalElixir', 'spellStoringItem'];

export const artificerWidgetIds = (character: CharacterState): string[] => {
    const artificer = (character.classes || []).find((cls: any) => cls.definition?.index === 'artificer');
    if (!artificer) return [];
    const subclass = String(artificer.subclass?.name || '');
    const desired: string[] = [];
    if (/battle smith/i.test(subclass)) desired.push('steelDefender');
    if (/artillerist/i.test(subclass)) desired.push('eldritchCannon');
    if (Number(artificer.level || 0) >= 2) desired.push('magicItemTinker');
    if (/cartographer/i.test(subclass)) desired.push('mapHolders');
    if (/alchemist/i.test(subclass)) desired.push('experimentalElixir');
    if (Number(artificer.level || 0) >= 11) desired.push('spellStoringItem');
    return desired;
};

export const reconcileArtificerLayout = (character: CharacterState): CharacterState['layout'] => {
    const fallback = character.layout || {
        left: ['senses', 'proficiencies', 'skills', 'saves'],
        right: ['actions', 'features', 'inventory', 'movement', 'defenses'],
        mobile: ['actions', 'spells', 'inventory', 'saves', 'hitDice'],
    };
    const desired = artificerWidgetIds(character);
    if (desired.length === 0 && !MANAGED_WIDGETS.some(widget => [...(fallback.left || []), ...(fallback.right || []), ...(fallback.mobile || [])].includes(widget))) return fallback;
    const stale = MANAGED_WIDGETS.filter(widget => !desired.includes(widget));
    const add = (entries: string[] = []) => [
        ...desired.filter(widget => !entries.includes(widget)),
        ...entries.filter(id => !stale.includes(id)),
    ];
    return {
        ...fallback,
        left: (fallback.left || []).filter(id => !stale.includes(id)),
        right: add(fallback.right),
        mobile: add(fallback.mobile),
    };
};
