import { BARD_SPELLS } from './bard';
import { CLERIC_SPELLS } from './cleric';
import { DRUID_SPELLS } from './druid';
import { PALADIN_SPELLS } from './paladin';
import { RANGER_SPELLS } from './ranger';
import { SORCERER_SPELLS } from './sorcerer';
import { WARLOCK_SPELLS } from './warlock';
import { WIZARD_SPELLS } from './wizard';
import { ARTIFICER_SPELLS } from './artificer';
import { SpellDetail } from '../../types';

const SPELL_DATA: Record<string, SpellDetail[]> = {
    'bard': BARD_SPELLS,
    'cleric': CLERIC_SPELLS,
    'druid': DRUID_SPELLS,
    'paladin': PALADIN_SPELLS,
    'ranger': RANGER_SPELLS,
    'sorcerer': SORCERER_SPELLS,
    'warlock': WARLOCK_SPELLS,
    'wizard': WIZARD_SPELLS,
    'artificer': ARTIFICER_SPELLS,
    'card-master': SORCERER_SPELLS
};

export const getLocalSpells = (className: string, level?: number): SpellDetail[] => {
    if (!className) return [];
    const key = className.toLowerCase();
    const spells = SPELL_DATA[key] || [];
    if (level !== undefined) {
        return spells.filter(s => s.level === level);
    }
    return spells;
};