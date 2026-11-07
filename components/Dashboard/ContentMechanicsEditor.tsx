import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ABILITY_LABELS, ABILITY_NAMES, AbilityName, ContentChoice, ResourceDefinition } from '../../types';

interface ContentMechanicsEditorProps {
    resources: ResourceDefinition[];
    choices: ContentChoice[];
    onResourcesChange: (value: ResourceDefinition[]) => void;
    onChoicesChange: (value: ContentChoice[]) => void;
    renderOptionEffects?: (effects: any[], onChange: (effects: any[]) => void) => React.ReactNode;
    showResources?: boolean;
}

const inputClass = 'w-full bg-[#0b0c0e] border border-gray-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-dnd-gold/60';
const labelClass = 'text-[9px] uppercase font-black text-gray-500 tracking-widest block mb-1.5';

const RESOURCE_TYPES: { value: ResourceDefinition['max']['type']; label: string }[] = [
    { value: 'fixed', label: 'A fixed number of uses' },
    { value: 'level', label: 'Scales with class level' },
    { value: 'ability', label: 'Ability modifier' },
    { value: 'proficiency', label: 'Proficiency bonus' },
    { value: 'table', label: 'A different number at each level' },
    { value: 'formula', label: 'Custom formula' },
];

const CHOICE_KINDS: { value: ContentChoice['kind']; label: string; hint: string }[] = [
    { value: 'skill', label: 'Skill proficiency', hint: 'Choose one or more skills.' },
    { value: 'tool', label: 'Tool proficiency', hint: 'Choose one or more tools.' },
    { value: 'language', label: 'Language', hint: 'Choose one or more languages.' },
    { value: 'ability', label: 'Ability score increase', hint: 'Choose which ability scores to increase.' },
    { value: 'ancestry', label: 'Ancestry / lineage', hint: 'Choose a lineage or ancestry option.' },
    { value: 'feature', label: 'Feature', hint: 'Choose one of the listed features.' },
    { value: 'spell', label: 'Spell', hint: 'Choose a spell from a spell list.' },
    { value: 'subclass', label: 'Subclass', hint: 'Choose a subclass.' },
    { value: 'proficiency', label: 'Any proficiency', hint: 'Choose from a mixed list of proficiencies.' },
    { value: 'feat', label: 'Origin feat', hint: 'Choose a feat. Leave options empty to let the player pick any feat.' },
    { value: 'spellcasting_ability', label: 'Spellcasting ability', hint: 'Choose Intelligence, Wisdom, or Charisma for racial spells.' },
    { value: 'weapon_mastery', label: 'Weapon Mastery', hint: 'Choose the weapons whose mastery properties the character can use.' },
];

const optionLabel = (option: any): string => {
    if (typeof option === 'string') return option;
    return option?.name || option?.label || option?.rawName || option?.index || 'Unnamed option';
};

const ResourceRow = ({ resource, onChange, onRemove }: { resource: ResourceDefinition; onChange: (value: ResourceDefinition) => void; onRemove: () => void }) => {
    const updateMax = (patch: Partial<ResourceDefinition['max']>) => onChange({ ...resource, max: { ...resource.max, ...patch } });
    return (
        <div className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Resource Name</label>
                    <input className={inputClass} value={resource.name} onChange={e => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || `resource_${Date.now()}`;
                        onChange({ ...resource, name, key: String(resource.key).startsWith('resource-') ? slug : resource.key });
                    }} placeholder="Rage" />
                </div>
                <div>
                    <label className={labelClass}>Unlocks at Level</label>
                    <input type="number" min={1} max={20} className={inputClass} value={resource.level ?? 1} onChange={e => onChange({ ...resource, level: Number(e.target.value) })} />
                </div>
                <div>
                    <label className={labelClass}>How many uses?</label>
                    <select className={inputClass} value={resource.max.type} onChange={e => updateMax({ type: e.target.value as ResourceDefinition['max']['type'] })}>
                        {RESOURCE_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Recharges On</label>
                    <select className={inputClass} value={resource.reset} onChange={e => onChange({ ...resource, reset: e.target.value as 'short' | 'long' })}>
                        <option value="short">Short Rest</option>
                        <option value="long">Long Rest</option>
                    </select>
                </div>
                {resource.max.type === 'fixed' && (
                    <div>
                        <label className={labelClass}>Number of Uses</label>
                        <input type="number" min={0} className={inputClass} value={resource.max.value ?? 1} onChange={e => updateMax({ value: Number(e.target.value) })} />
                    </div>
                )}
                {resource.max.type === 'level' && (
                    <div>
                        <label className={labelClass}>Uses per Class Level</label>
                        <input type="number" min={0} step={0.5} className={inputClass} value={resource.max.multiplier ?? 1} onChange={e => updateMax({ multiplier: Number(e.target.value) })} />
                    </div>
                )}
                {resource.max.type === 'ability' && (
                    <>
                        <div>
                            <label className={labelClass}>Ability</label>
                            <select className={inputClass} value={resource.max.ability || 'cha'} onChange={e => updateMax({ ability: e.target.value as AbilityName })}>
                                {ABILITY_NAMES.map(ability => <option key={ability} value={ability}>{ABILITY_LABELS[ability]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Flat Bonus</label>
                            <input type="number" className={inputClass} value={resource.max.bonus ?? 0} onChange={e => updateMax({ bonus: Number(e.target.value) || 0 })} />
                            <p className="text-[10px] text-gray-600 mt-1">For formulas like “3 + Charisma modifier.”</p>
                        </div>
                    </>
                )}
                {resource.max.type === 'table' && (
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Uses at Each Level</label>
                        <input className={inputClass} value={(resource.max.values || []).join(', ')} onChange={e => updateMax({ values: e.target.value.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v)) })} placeholder="2, 2, 2, 3, 3, 3, 4..." />
                        <p className="text-[10px] text-gray-600 mt-1">Enter one number per class level, separated by commas.</p>
                    </div>
                )}
                {resource.max.type === 'formula' && (
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Custom Formula</label>
                        <input className={inputClass} value={resource.max.expression || ''} onChange={e => updateMax({ expression: e.target.value })} placeholder="level * 2" />
                        <p className="text-[10px] text-gray-600 mt-1">Only use this if the other options do not fit.</p>
                    </div>
                )}
            </div>
            <button type="button" onClick={onRemove} className="text-[10px] uppercase font-black tracking-widest text-red-400/80 hover:text-red-300 flex items-center gap-1.5">
                <Trash2 size={12} /> Remove Resource
            </button>
        </div>
    );
};

const OptionListEditor = ({ options, onChange, renderEffects }: { options: any[]; onChange: (value: any[]) => void; renderEffects?: (effects: any[], onChange: (effects: any[]) => void) => React.ReactNode }) => {
    const [newOption, setNewOption] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const addOption = () => {
        const value = newOption.trim();
        if (!value) return;
        onChange([...options, value]);
        setNewOption('');
    };
    const toObject = (option: any) => typeof option === 'object' && option !== null ? option : { name: String(option), effects: [] };
    const updateOption = (index: number, patch: any) => onChange(options.map((option, i) => i === index ? { ...toObject(option), ...patch } : option));
    const effectsFor = (option: any) => Array.isArray(option?.effects) ? option.effects : [];

    return (
        <div>
            <label className={labelClass}>Available Options</label>
            <div className="space-y-3">
                {options.length === 0 ? (
                    <p className="text-[11px] text-gray-600 italic">No options yet. Add the choices the player can pick from.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {options.map((option, index) => {
                            const effects = effectsFor(option);
                            return (
                                <span key={index} className="inline-flex items-center gap-1.5 bg-gray-800/80 border border-gray-700 rounded-full pl-3 pr-1.5 py-1 text-xs text-gray-200">
                                    {optionLabel(option)}
                                    {effects.length > 0 && (
                                        <span className="text-[9px] font-black text-dnd-gold bg-dnd-gold/10 border border-dnd-gold/30 rounded-full px-1.5 py-0.5" title={`${effects.length} effect(s)`}>
                                            {effects.length} fx
                                        </span>
                                    )}
                                    {renderEffects && (
                                        <button type="button" onClick={() => setEditingIndex(editingIndex === index ? null : index)} className="w-5 h-5 rounded-full text-gray-400 hover:text-dnd-gold hover:bg-dnd-gold/10 flex items-center justify-center text-[9px] font-black" title="Edit option effects">
                                            fx
                                        </button>
                                    )}
                                    <button type="button" onClick={() => onChange(options.filter((_, i) => i !== index))} className="w-5 h-5 rounded-full text-gray-500 hover:text-red-300 hover:bg-red-900/30 flex items-center justify-center" title="Remove option">
                                        <Trash2 size={11} />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        className={inputClass}
                        value={newOption}
                        onChange={e => setNewOption(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                        placeholder="Add an option, then press Enter"
                    />
                    <button type="button" onClick={addOption} className="px-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:border-dnd-gold/50">
                        Add
                    </button>
                </div>
                {renderEffects && editingIndex !== null && options[editingIndex] !== undefined && (
                    <div className="bg-black/40 border border-gray-700 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[10px] font-black text-dnd-gold uppercase tracking-widest">Effects for {optionLabel(options[editingIndex])}</p>
                            <button type="button" onClick={() => setEditingIndex(null)} className="text-[10px] text-gray-500 hover:text-white">Close</button>
                        </div>
                        {renderEffects(effectsFor(options[editingIndex]), (effects) => updateOption(editingIndex, { effects }))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ChoiceRow = ({ choice, onChange, onRemove, renderEffects }: { choice: ContentChoice; onChange: (value: ContentChoice) => void; onRemove: () => void; renderEffects?: (effects: any[], onChange: (effects: any[]) => void) => React.ReactNode }) => {
    const kind = CHOICE_KINDS.find(item => item.value === choice.kind) || CHOICE_KINDS[0];
    return (
        <div className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className={labelClass}>What does the player choose?</label>
                    <select
                        className={inputClass}
                        value={choice.kind}
                        onChange={e => {
                            const kind = e.target.value as ContentChoice['kind'];
                            const options = kind === 'spellcasting_ability'
                                ? (choice.options && choice.options.length > 0 ? choice.options : ['int', 'wis', 'cha'])
                                : kind === 'ability' && (!choice.options || choice.options.length === 0)
                                    ? ['str', 'dex', 'con', 'int', 'wis', 'cha']
                                    : choice.options;
                            onChange({ ...choice, kind, options });
                        }}
                    >
                        {CHOICE_KINDS.map(kind => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Available at Level</label>
                    <input type="number" min={1} max={20} className={inputClass} value={choice.level ?? 1} onChange={e => onChange({ ...choice, level: Number(e.target.value) })} />
                </div>
                <div>
                    <label className={labelClass}>How many picks?</label>
                    <input type="number" min={1} className={inputClass} value={choice.count ?? 1} onChange={e => onChange({ ...choice, count: Number(e.target.value) })} />
                </div>
                {choice.kind === 'ability' && (
                    <div>
                        <label className={labelClass}>Increase per Pick</label>
                        <input type="number" min={1} className={inputClass} value={choice.amount ?? 1} onChange={e => onChange({ ...choice, amount: Number(e.target.value) })} />
                    </div>
                )}
                {choice.kind === 'spell' && (
                    <div>
                        <label className={labelClass}>Spell List</label>
                        <input className={inputClass} value={choice.sourceClass || ''} onChange={e => onChange({ ...choice, sourceClass: e.target.value })} placeholder="wizard" />
                        <p className="text-[10px] text-gray-600 mt-1">The class spell list this choice pulls from, such as wizard or cleric.</p>
                    </div>
                )}
            </div>
            <p className="text-[11px] text-gray-500">{kind.hint}</p>
            <OptionListEditor options={choice.options || []} onChange={options => onChange({ ...choice, options })} renderEffects={renderEffects} />
            <button type="button" onClick={onRemove} className="text-[10px] uppercase font-black tracking-widest text-red-400/80 hover:text-red-300 flex items-center gap-1.5">
                <Trash2 size={12} /> Remove Choice
            </button>
        </div>
    );
};

const ContentMechanicsEditor: React.FC<ContentMechanicsEditorProps> = ({
    resources,
    choices,
    onResourcesChange,
    onChoicesChange,
    renderOptionEffects,
    showResources = true,
}) => {
    const addResource = () => onResourcesChange([
        ...resources,
        { key: `resource-${Date.now()}`, name: 'New Resource', level: 1, reset: 'long', max: { type: 'fixed', value: 1 } },
    ]);
    const addChoice = () => onChoicesChange([
        ...choices,
        { id: `choice-${Date.now()}`, kind: 'skill', count: 1, level: 1, options: [] },
    ]);

    return (
        <div className="space-y-6">
            {showResources && (
                <section className="bg-black/20 border border-gray-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Limited-Use Resources</h4>
                            <p className="text-[10px] text-gray-500 mt-1">Pools the character spends and recovers, such as Rage, Focus, or charges. Leave empty if the class has none.</p>
                        </div>
                        <button type="button" onClick={addResource} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dnd-gold/10 border border-dnd-gold/40 text-dnd-gold text-[10px] font-black uppercase tracking-widest hover:bg-dnd-gold hover:text-black transition-colors">
                            <Plus size={12} /> Add
                        </button>
                    </div>
                    {resources.length === 0 ? (
                        <p className="text-[11px] text-gray-600 italic">No resources. That is normal for many classes.</p>
                    ) : resources.map((resource, index) => (
                        <ResourceRow
                            key={index}
                            resource={resource}
                            onChange={next => onResourcesChange(resources.map((item, i) => i === index ? next : item))}
                            onRemove={() => onResourcesChange(resources.filter((_, i) => i !== index))}
                        />
                    ))}
                </section>
            )}

            <section className="bg-black/20 border border-gray-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h4 className="text-[10px] font-black text-dnd-gold uppercase tracking-[0.2em]">Class / Ancestry Choices</h4>
                        <p className="text-[10px] text-gray-500 mt-1">
                            Choices made when this content is picked, such as “choose 2 skills” or “choose a lineage.” Choices inside a specific feature belong under Level Features → Mechanical Effects &amp; Choices instead.
                        </p>
                    </div>
                    <button type="button" onClick={addChoice} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dnd-gold/10 border border-dnd-gold/40 text-dnd-gold text-[10px] font-black uppercase tracking-widest hover:bg-dnd-gold hover:text-black transition-colors">
                        <Plus size={12} /> Add
                    </button>
                </div>
                {choices.length === 0 ? (
                    <p className="text-[11px] text-gray-600 italic">No class/ancestry choices. Most subclasses and feats do not need any.</p>
                ) : choices.map((choice, index) => (
                    <ChoiceRow
                        key={index}
                        choice={choice}
                        onChange={next => onChoicesChange(choices.map((item, i) => i === index ? next : item))}
                        onRemove={() => onChoicesChange(choices.filter((_, i) => i !== index))}
                        renderEffects={renderOptionEffects}
                    />
                ))}
            </section>
        </div>
    );
};

export default ContentMechanicsEditor;
