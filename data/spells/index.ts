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

const CLASS_NAMES: Record<string, string> = {
    'bard': 'Bard',
    'cleric': 'Cleric',
    'druid': 'Druid',
    'paladin': 'Paladin',
    'ranger': 'Ranger',
    'sorcerer': 'Sorcerer',
    'warlock': 'Warlock',
    'wizard': 'Wizard',
    'artificer': 'Artificer',
    'card-master': 'Sorcerer'
};

export const getLocalSpells = (className: string, level?: number): SpellDetail[] => {
    if (!className) return [];
    const key = className.toLowerCase();
    const spells = (SPELL_DATA[key] || []).map(s => ({
        ...s,
        sourceClassIndex: s.sourceClassIndex || key,
        classes: (s.classes && s.classes.length > 0) ? s.classes : [{ name: CLASS_NAMES[key] || className, index: key }]
    }));
    
    if (level !== undefined) {
        return spells.filter(s => s.level === level);
    }
    return spells;
};