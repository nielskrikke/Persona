import { MigrationIssue } from './types';

const isObject = (value: any) => value && typeof value === 'object' && !Array.isArray(value);
const isArray = (value: any) => Array.isArray(value);
const isNonEmptyString = (value: any) => typeof value === 'string' && value.trim().length > 0;

const requireField = (issues: MigrationIssue[], data: any, path: string, condition: boolean, message: string) => {
    if (!condition) issues.push({ severity: 'error', path, message });
};

const warnField = (issues: MigrationIssue[], data: any, path: string, condition: boolean, message: string) => {
    if (!condition) issues.push({ severity: 'warning', path, message });
};

const validateResource = (issues: MigrationIssue[], path: string, resource: any) => {
    if (!resource || typeof resource !== 'object') {
        issues.push({ severity: 'error', path, message: 'Resource must be an object' });
        return;
    }
    requireField(issues, resource, `${path}.key`, isNonEmptyString(resource.key), 'Resource key is required');
    requireField(issues, resource, `${path}.name`, isNonEmptyString(resource.name), 'Resource name is required');
    requireField(issues, resource, `${path}.max`, isObject(resource.max), 'Resource max descriptor is required');
    if (resource.max?.type === 'table') {
        requireField(issues, resource, `${path}.max.values`, isArray(resource.max.values) && resource.max.values.length === 20,
            'Table resource must have 20 values (levels 1-20)');
        if (isArray(resource.max.values)) {
            resource.max.values.forEach((value: any, index: number) => {
                if (typeof value !== 'number' || !Number.isFinite(value)) {
                    issues.push({ severity: 'error', path: `${path}.max.values[${index}]`, message: 'Table value must be a finite number' });
                }
            });
        }
    }
    if (resource.max?.type === 'ability' && !['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(resource.max.ability)) {
        issues.push({ severity: 'error', path: `${path}.max.ability`, message: 'Ability resource must name a valid ability' });
    }
};

const validateChoice = (issues: MigrationIssue[], path: string, choice: any) => {
    if (!choice || typeof choice !== 'object') {
        issues.push({ severity: 'error', path, message: 'Choice must be an object' });
        return;
    }
    requireField(issues, choice, `${path}.id`, isNonEmptyString(choice.id), 'Choice id is required');
    requireField(issues, choice, `${path}.kind`, isNonEmptyString(choice.kind), 'Choice kind is required');
    requireField(issues, choice, `${path}.count`, typeof choice.count === 'number' && choice.count > 0, 'Choice count must be a positive number');
    warnField(issues, choice, `${path}.options`, isArray(choice.options) && choice.options.length > 0, 'Choice has no options');
};

const validateCaster = (issues: MigrationIssue[], path: string, caster: any) => {
    requireField(issues, caster, path, isObject(caster), 'Caster profile is required');
    if (!isObject(caster)) return;
    const validTypes = ['full', 'half', 'third', 'pact', 'artificer', 'custom', 'none'];
    requireField(issues, caster, `${path}.type`, validTypes.includes(caster.type), `Caster type must be one of ${validTypes.join(', ')}`);
    if (caster.type !== 'none' && !['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(caster.ability)) {
        issues.push({ severity: 'error', path: `${path}.ability`, message: 'Caster ability is required for a caster' });
    }
    if (caster.note && /inferred/i.test(caster.note)) {
        issues.push({ severity: 'warning', path, message: caster.note });
    }
};

export const validateRecord = (table: string, data: any): MigrationIssue[] => {
    const issues: MigrationIssue[] = [];
    requireField(issues, data, 'index', isNonEmptyString(data?.index), 'index is required');
    requireField(issues, data, 'name', isNonEmptyString(data?.name), 'name is required');
    requireField(issues, data, 'schema_version', data?.schema_version === 2, 'schema_version must be 2');

    if (table === 'custom_classes') {
        requireField(issues, data, 'hit_die', typeof data?.hit_die === 'number', 'hit_die is required');
        requireField(issues, data, 'level_table', isArray(data?.level_table) && data.level_table.length === 20, 'level_table must have 20 levels');
        requireField(issues, data, 'feature_details', isArray(data?.feature_details), 'feature_details must be an array');
        requireField(issues, data, 'resources', isArray(data?.resources), 'resources must be an array');
        requireField(issues, data, 'choices', isArray(data?.choices), 'choices must be an array');
        validateCaster(issues, 'caster', data?.caster);
        requireField(issues, data, 'subclass_level', typeof data?.subclass_level === 'number' && data.subclass_level >= 1 && data.subclass_level <= 20,
            'subclass_level must be between 1 and 20');
        (data?.resources || []).forEach((resource: any, index: number) => validateResource(issues, `resources[${index}]`, resource));
        (data?.choices || []).forEach((choice: any, index: number) => validateChoice(issues, `choices[${index}]`, choice));
        if (!data?.source) issues.push({ severity: 'warning', path: 'source', message: 'Class has no source' });
        if (!Array.isArray(data?.proficiency_choices) || data.proficiency_choices.length === 0) {
            issues.push({ severity: 'warning', path: 'proficiency_choices', message: 'Class has no proficiency_choices (may be intentional)' });
        }
    }

    if (table === 'custom_subclasses') {
        requireField(issues, data, 'class', isObject(data?.class) || isNonEmptyString(data?.class_index), 'class or class_index is required');
        requireField(issues, data, 'feature_details', isArray(data?.feature_details), 'feature_details must be an array');
        requireField(issues, data, 'subclass_level', typeof data?.subclass_level === 'number' && data.subclass_level >= 1 && data.subclass_level <= 20,
            'subclass_level must be between 1 and 20');
        requireField(issues, data, 'resources', isArray(data?.resources), 'resources must be an array');
        (data?.resources || []).forEach((resource: any, index: number) => validateResource(issues, `resources[${index}]`, resource));
        if (data?.caster) validateCaster(issues, 'caster', data.caster);
        if (!data?.source) issues.push({ severity: 'warning', path: 'source', message: 'Subclass has no source' });
    }

    if (table === 'custom_races') {
        requireField(issues, data, 'speed', typeof data?.speed === 'number', 'speed is required');
        requireField(issues, data, 'ability_bonuses', isArray(data?.ability_bonuses), 'ability_bonuses must be an array');
        requireField(issues, data, 'languages', isArray(data?.languages), 'languages must be an array');
        requireField(issues, data, 'traits', isArray(data?.traits), 'traits must be an array');
        requireField(issues, data, 'choices', isArray(data?.choices), 'choices must be an array');
        (data?.choices || []).forEach((choice: any, index: number) => validateChoice(issues, `choices[${index}]`, choice));
        if (!data?.source) issues.push({ severity: 'warning', path: 'source', message: 'Race has no source' });
    }

    if (table === 'custom_backgrounds') {
        requireField(issues, data, 'feature', isObject(data?.feature), 'feature is required');
        requireField(issues, data, 'skill_proficiencies', isArray(data?.skill_proficiencies), 'skill_proficiencies must be an array');
        requireField(issues, data, 'effects', isArray(data?.effects), 'effects must be an array');
        requireField(issues, data, 'choices', isArray(data?.choices), 'choices must be an array');
        (data?.choices || []).forEach((choice: any, index: number) => validateChoice(issues, `choices[${index}]`, choice));
        if (!data?.source) issues.push({ severity: 'warning', path: 'source', message: 'Background has no source' });
        if (!data?.currency) issues.push({ severity: 'warning', path: 'currency', message: 'Background has no currency' });
    }

    if (table === 'custom_feats') {
        requireField(issues, data, 'desc', isArray(data?.desc), 'desc must be an array');
        requireField(issues, data, 'effects', isArray(data?.effects), 'effects must be an array');
        if (!data?.source) issues.push({ severity: 'warning', path: 'source', message: 'Feat has no source' });
        if (!Array.isArray(data?.effects) || data.effects.length === 0) {
            issues.push({ severity: 'warning', path: 'effects', message: 'Feat has no mechanical effects' });
        }
    }

    return issues;
};
