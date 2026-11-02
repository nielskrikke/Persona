/**
 * Content documents are rich JSON blobs. The Forge forms are partial views:
 * they only know about a subset of the document. Saving must therefore be a
 * merge, not a replace.
 *
 * Rules:
 * - fields absent from the patch are preserved;
 * - fields the form cannot edit yet are preserved even if the form sends a
 *   default/empty value (e.g. proficiency_choices: [], currency: 10 gp);
 * - structured arrays that the form does rebuild are merged by their stable
 *   identity where that identity exists (level_table by level).
 */
export const mergeContentData = (table: string, existingData: any, patch: any): any => {
    const existing = existingData && typeof existingData === 'object' && !Array.isArray(existingData)
        ? existingData
        : {};
    const next = patch && typeof patch === 'object' && !Array.isArray(patch)
        ? patch
        : {};

    const merged: any = { ...existing, ...next };

    switch (table) {
        case 'custom_classes': {
            // Preserve migrated values when a form sends an empty/default value.
            merged.proficiency_choices =
                Array.isArray(next.proficiency_choices) && next.proficiency_choices.length > 0
                    ? next.proficiency_choices
                    : existing.proficiency_choices;
            merged.source = next.source || existing.source;
            merged.multi_classing = next.multi_classing ?? existing.multi_classing;
            merged.subclasses = next.subclasses ?? existing.subclasses;
            merged.level_table = mergeLevelTable(existing.level_table, next.level_table);
            merged.spellcasting = mergeSpellcasting(existing.spellcasting, next.spellcasting);

            // New v2 fields: preserve unless the form explicitly edits them.
            for (const key of ['caster', 'subclass_level', 'subclass_label', 'resources', 'choices', 'spell_list', 'ui', 'rules']) {
                if (!(key in next)) merged[key] = existing[key];
            }
            break;
        }

        case 'custom_subclasses': {
            merged.source = next.source || existing.source;
            merged.desc = next.desc ?? existing.desc;
            merged.subclass_flavor = next.subclass_flavor ?? existing.subclass_flavor;
            for (const key of ['caster', 'subclass_level', 'subclass_label', 'resources', 'choices', 'spell_list', 'ui', 'rules']) {
                if (!(key in next)) merged[key] = existing[key];
            }
            break;
        }

        case 'custom_races': {
            // Race Forge does not edit these yet; a save must not delete them.
            merged.languages = next.languages ?? existing.languages;
            merged.language_options = next.language_options ?? existing.language_options;
            merged.subraces_details = next.subraces_details ?? existing.subraces_details;
            merged.starting_proficiencies = next.starting_proficiencies ?? existing.starting_proficiencies;
            merged.age = next.age ?? existing.age;
            merged.size_description = next.size_description ?? existing.size_description;
            merged.source = next.source || existing.source;
            merged.choices = next.choices ?? existing.choices;

            // Race Forge writes `alignment: description`. Preserve the real
            // alignment when that is what happened.
            const description = Array.isArray(next.desc) ? next.desc[0] : next.desc;
            if (existing.alignment && next.alignment && next.alignment === description) {
                merged.alignment = existing.alignment;
            }
            break;
        }

        case 'custom_backgrounds': {
            // Background Forge does not edit these yet.
            merged.languages = next.languages ?? existing.languages;
            merged.proficiency_choices = next.proficiency_choices ?? existing.proficiency_choices;
            merged.source = next.source || existing.source;
            merged.currency = existing.currency || next.currency;
            merged.choices = next.choices ?? existing.choices;

            if (existing.feature || next.feature) {
                const feature = { ...(existing.feature || {}), ...(next.feature || {}) };
                const description = Array.isArray(next.desc) ? next.desc[0] : next.desc;
                if (existing.feature?.desc && (!next.feature?.desc || next.feature.desc[0] === description)) {
                    feature.desc = existing.feature.desc;
                }
                if (existing.feature?.effects && (!next.feature?.effects || next.feature.effects.length === 0)) {
                    feature.effects = existing.feature.effects;
                }
                merged.feature = feature;
            }
            break;
        }

        case 'custom_spells': {
            merged.source = next.source || existing.source;
            merged.subclasses = next.subclasses ?? existing.subclasses;
            if (!Array.isArray(next.classes) || next.classes.length === 0) {
                merged.classes = existing.classes;
            }
            break;
        }

        case 'custom_equipment': {
            for (const key of [
                'mastery', 'versatileDamage', 'range', 'weapon_range', 'isSpellFocus',
                'specialDescription', 'attunement_description', 'subtype',
            ]) {
                if (next[key] === undefined) merged[key] = existing[key];
            }
            break;
        }

        case 'custom_feats': {
            merged.source = next.source || existing.source;
            merged.prerequisites = next.prerequisites ?? existing.prerequisites;
            break;
        }

        default:
            break;
    }

    return merged;
};

const mergeSpellcasting = (existing: any, patch: any): any => {
    if (!existing) return patch;
    if (!patch) return existing;
    return {
        ...existing,
        ...patch,
        info: patch.info ?? existing.info,
        level: patch.level ?? existing.level,
        spellcasting_ability: patch.spellcasting_ability ?? existing.spellcasting_ability,
    };
};

const mergeLevelTable = (existing: any, patch: any): any => {
    if (!Array.isArray(existing)) return patch;
    if (!Array.isArray(patch)) return existing;

    const patchByLevel = new Map<number, any>();
    for (const row of patch) {
        if (row && typeof row.level === 'number') patchByLevel.set(row.level, row);
    }

    const merged = existing.map((row: any) => {
        const nextRow = patchByLevel.get(row?.level);
        if (!nextRow) return row;
        return {
            ...row,
            ...nextRow,
            // class_specific is not editable in the Forge yet. Keep the data.
            class_specific: row.class_specific ?? nextRow.class_specific,
        };
    });

    for (const row of patch) {
        if (row && typeof row.level === 'number' && !existing.some((r: any) => r?.level === row.level)) {
            merged.push(row);
        }
    }

    return merged;
};
