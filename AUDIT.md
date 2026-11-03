# Persona — functionality and bug audit

**Date:** 2026-11-01  
**Scope:** the `Persona` app in `/Users/nielskrikke/code/Persona`  
**Method:** static review of the app source, data adapters, Supabase service, builder, and SQL migration; read-only queries against the Supabase content tables; pure-function checks with `tsx`. No production writes.  
**Type check:** `npm run lint` (`tsc --noEmit`) passes. These are logic/schema bugs, not type errors.

---

## 0. Bottom line

The four issues reported by Claude are **substantially real**. Two are systemic:

1. **Saving through the Forge is a full-record overwrite, not a patch.** The form only knows a subset of each record, so every save destroys fields the form did not load. This affects classes, but also races, backgrounds, subclasses, items, spells, and feats to varying degrees.
2. **The rules engine is hard-coded by class index/name while the content is data-driven.** The database already carries 2024 class tables, but `getSpellSlots` and `getSpellsKnownCount` ignore them. That is why homebrew casters, and even several official classes, get wrong slots/spell limits.

There are also several high-impact issues outside the original report:

- **Class skill/tool proficiency choices are not selectable anywhere in character creation.** `ClassStep` has the state and handlers, but no UI renders them, and it calls `onSelect(..., [], [], ...)`.
- **Single-class half-casters and third-casters get the wrong spell slots.** `getSpellSlots` uses the multiclass slot table for everyone. A level 5 Paladin gets 3 first-level slots instead of 4 first + 2 second; a level 7 Eldritch Knight gets 3 first-level slots instead of 4 first + 2 second.
- **HP ignores effective Constitution and `hp_per_level` effects.** A Dwarf's +2 Con does not increase HP; the Tough feat and Draconic Resilience do nothing to HP.
- **Saving the Manage Character dialog resets every spell slot to full**, even if only the name was changed.
- **Background mechanical effects are collected by the Forge but never applied**, because only `background.name` is stored.
- **Production content already contains damage**: 24 class rows for 18 unique classes (six Fighter rows, two Arrowsmith rows), and 117 subclass rows for 105 unique subclasses (12 duplicate indexes). Five Fighter rows have exactly the shape produced by the class Forge save path.

**Practical recommendation:** do not use the Forge to edit core classes/races until the save is non-destructive. Fix the save + rules engine first, then repair the existing rows with an exported, reviewed migration.

---

## 1. Verification of the reported issues

### 1.1 Saving an existing class through the Forge destroys data

**Verdict: TRUE, high severity (P0).**

The class save path is in `components/Dashboard/HomebrewManagerModal.tsx:1225-1350`. It builds a brand-new payload from form state and passes it to `saveHomebrew`:

```ts
// HomebrewManagerModal.tsx:1256-1267
const level_table = Array.from({ length: 20 }, (_, i) => ({
    level: i + 1,
    prof_bonus: Math.floor(i / 4) + 2,
    features: levelFeatures.filter(f => f.level === i + 1).map(f => f.name)
}));
const profs = [...armorProfs.map(p => ({name: p})), ...weaponProfs.map(p => ({name: p}))];
payload = {
    ...payload, hit_die: hitDie,
    saving_throws: saves.map(s => ({ index: s, name: s.toUpperCase() })),
    proficiency_choices: [], proficiencies: profs, level_table,
    spellcasting: casterType !== 'none'
        ? { spellcasting_ability: { index: casterAbility, name: casterAbility.toUpperCase() } }
        : undefined,
    feature_details: levelFeatures.map(f => ({
        index: f.name.toLowerCase().replace(/\s+/g, '-'),
        name: f.name, level: f.level, desc: [f.desc], effects: f.effects
    }))
};
```

`saveHomebrew` then writes that payload as the **entire** `data` document:

```ts
// services/supabase.ts:339-349
if (existingRow && (!existingRow.user_id || existingRow.user_id === validUserId)) {
    const { data, error } = await supabase
        .from(table)
        .update({
            name: payload.name || 'Unnamed',
            data: fullItem,          // <-- replaces the whole JSON document
            is_public: isPublic
        })
        .eq('id', existingRow.id)
        ...
}
```

There is no merge with the existing row.

#### What is lost

| Field | Where it lives | Forge behavior |
|---|---|---|
| `proficiency_choices` (skill/tool choices) | top level | hard-coded to `[]` |
| `class_specific` (sneak attack, prepared, slots, uses, etc.) | **inside every `level_table` row**, not top level | rows rebuilt with only `level`, `prof_bonus`, `features` |
| `spellcasting.info` | inside `spellcasting` | dropped |
| `spellcasting.level` | inside `spellcasting` | dropped |
| `multi_classing` | top level | dropped |
| `subclasses` | top level | dropped |
| `source` | top level | dropped (there is no source field in the form at all) |
| `proficiencies[].index` / `url` | inside each proficiency | rewritten as `{ name }` only |
| any future/unknown class field | top level | dropped |

The report's “class_specific” phrasing is slightly off: it is not a top-level field. It is nested per level row, and the rebuild removes it from all 20 rows.

#### Caster type

`spellcasting` is not a caster-type field; it only proves “this class has spellcasting.” The Forge has a “Caster Type” dropdown (`HomebrewManagerModal.tsx:2081-2092`), but the value is **never written** to the payload. On edit it is also guessed:

```ts
// HomebrewManagerModal.tsx:1078
setCasterType(item.spellcasting ? 'full' : 'none'); // Simplified
```

So editing a Paladin/Ranger shows **“Full Caster”** in the form. Today the sheet's slot math does not read this form value (it still hard-codes class indexes), so this is not yet what makes Paladin/Ranger slots wrong — but it is a real data/UI bug, and it blocks any data-driven caster support. A homebrew half-caster cannot be expressed at all.

#### Production evidence

Read-only query of `custom_classes` (2026-11-01):

- 24 rows, 18 unique `data.index` values.
- `fighter`: **6 rows**.
- `arrowsmith`: 2 rows.
- Five Fighter rows have the Forge-shaped payload (plus local metadata such as `id`/`user_id`/`isCustom`):
  - payload fields: `desc`, `feature_details`, `hit_die`, `index`, `is_public`, `level_table`, `name`, `proficiencies`, `proficiency_choices`, `saving_throws`;
  - `source` absent;
  - `proficiency_choices` empty;
  - no `class_specific` in any level row.
- The one original Fighter row has `source: "Player's Handbook 2024"`, one `proficiency_choices` entry, and `class_specific` in its level rows.

That is not a hypothetical failure; it has already happened in the content database.

#### Why it may not have been obvious

`loadHomebrew` collapses rows by `data.index` (`services/supabase.ts:240-274`). It queries newest-first and uses a `Map.set` loop, so **the last row wins = the oldest row**. For Fighter, the oldest row is the original, so the five stripped copies are currently shadowed. But the original is the row the Forge edits (same owner). If the DM saves the original through the form, it becomes stripped too, remains the oldest, and therefore becomes the visible winner. The other five copies then cannot rescue it.

For subclasses, duplicates have identical timestamps and different feature counts, so the winner is not deterministic.

The local cache is not a reliable safety net: after a successful remote update `saveHomebrew` replaces the local row with the returned `data.data` (the stripped payload), so the loss becomes visible on the next list load. If the remote write fails, the earlier local merge `{...existing, ...fullItem}` can temporarily hide it; that inconsistency is itself a problem.

#### Duplicate/ownership bug in `saveHomebrew`

Two additional paths can create duplicates:

```ts
// services/supabase.ts:330-337
if (id && isValidUUID(id)) {
    const { data } = await supabase.from(table).select('id, user_id').eq('id', id).maybeSingle();
    if (data) existingRow = data;
} else if (payload.name) {
    const { data } = await supabase.from(table).select('id, user_id').ilike('name', payload.name).maybeSingle();
    if (data) existingRow = data;
}
```

- `.maybeSingle()` on a duplicate name returns an error. The code ignores its `error` and falls through to **insert**, creating another duplicate.
- If the row belongs to another user (e.g. a player edits public core content owned by the DM), the ownership check at line 339 fails and the code **inserts a new row with the same `data.index`** instead of updating or explicitly forking.
- The insert doesn't include the row `id`; it stores the old `id` inside `data`, which is confusing and leaves locals/remote ids mismatched.

#### The right fix

**Do not patch only `proficiency_choices`.** The form must become a **partial editor over a preserved document**:

1. Keep the original loaded record in state (`editingItem`), not only `editingId`.
2. Build a patch that contains only fields the form actually edits.
3. Merge schema-aware:
   - top-level: `{ ...existing, ...patch }`;
   - `level_table`: merge by `level`, preserve `class_specific` unless the form explicitly edits it;
   - `spellcasting`: merge `info`, `level`, `spellcasting_ability`, and a new `progression`/`caster_type`;
   - `proficiency_choices`: preserve unless the form explicitly edits it;
   - preserve `multi_classing`, `subclasses`, `source`.
4. Make `saveHomebrew` resolve the row by `id` only for edits. If a non-owner edits public content, either reject with a clear message or create an explicit fork with a **new** index and a “derived from” marker — never silently insert a same-index duplicate.
5. Add a migration/cleanup for the existing duplicates and stripped rows (see §4.1).
6. Add a snapshot test: load a real class, fill the form without changes, save, assert deep equality (except `updated_at`).

A minimal safety measure until then: **do not save existing core classes through the Forge**. Edit the `data` JSON in an exported copy and update the row deliberately.

---

### 1.2 Proficiency effects from the editor never apply

**Verdict: TRUE, and broader than reported.**

The editor writes:

```tsx
// HomebrewManagerModal.tsx:758-769
<input
    value={eff.name || eff.value || ''}
    onChange={e => updateEffect(i, { name: e.target.value, value: e.target.value })}
/>
<select value={eff.category || 'skill'} onChange={e => updateEffect(i, { category: e.target.value })}>
    <option value="skill">Skill</option>
    <option value="armor">Armor</option>
    <option value="weapon">Weapon</option>
    <option value="tool">Tool</option>
    <option value="saving_throw">Saving Throw</option>
</select>
```

The sheet reads `target` and `category === 'save'`:

```tsx
// CharacterSheet.tsx:2207-2209
const isProf = ...
    || activeModifiers.some(m =>
        m.type === 'proficiency'
        && m.target === stat.substring(0,3).toUpperCase()
        && m.category === 'save'
    );
```

So there are **two** mismatches for saving throws (no `target`, `saving_throw` vs `save`), and the editor never writes `target` for skills, armor, weapons, or tools either. The existing data schema confirms the engine's expectation:

- Monk level 14 feature data: `{ "type": "proficiency", "target": "STR", "category": "save" }`
- Card Master Trust the Destiny: `{ "type": "proficiency", "target": "Religion", "category": "skill" }`

The same class of bug exists for **Advantage**:

```tsx
// HomebrewManagerModal.tsx:~800
<input
    value={eff.stat || eff.target || ''}
    onChange={e => updateEffect(i, { stat: e.target.value, target: e.target.value })}
/>
<input value={eff.condition || ''} onChange={e => updateEffect(i, { condition: e.target.value })} />
```

The engine expects:

```tsx
// CharacterSheet.tsx:2222, 2270
m.target === `${stat}_save` || (m.target === 'saves' && filter === ability label)
m.target === skill.name.toLowerCase().replace(/\s+/g, '_')
    || (m.target === 'skills' && filter === skill name)
```

Data uses `{ type: 'advantage', target: 'saves', filter: 'Charmed' }` (Half-Elf Fey Ancestry). The editor's free-text “DEX Saves” or “Perception” does not match any of those checks, so advantage effects created in the Forge also never apply.

**The right fix:** align the editor to the existing data schema, not the other way around. Use explicit fields:

- Proficiency:
  - skill: `category: 'skill'`, `target: <skill name>`
  - save: `category: 'save'`, `target: 'STR' | 'DEX' | ...`
  - tool/armor/weapon: same category, `target` name
- Advantage:
  - `target: 'skills'` + `filter: <skill>`
  - `target: 'saves'` + `filter: <ability label>`
  - `target: 'initiative'`
- Add a shared `FeatureEffect` normalizer/validator so there is one schema for the editor, data import, and the sheet.

Do not change the sheet to accept `name`/`saving_throw`; existing content and the feature data already use `target`/`save`, and loosening the engine would create two permanent dialects.

---

### 1.3 Spell slots and known/prepared counts are hard-coded

**Verdict: TRUE, and the problem is larger than the report.**

#### Homebrew casters get no slots or spells

`getSpellSlots` recognizes only these indexes (`utils/rules.ts:227-240`):

```ts
['bard','cleric','druid','sorcerer','wizard','card-master']
['paladin','ranger']
'artificer'
subclass index in ['arcane-trickster','eldritch-knight']
```

A synthetic homebrew caster with `spellcasting` and a `level_table` produced `{}` slots:

```
slots homebrew5 {}
```

`getSpellsKnownCount` is a `switch (definition.index)` over the 13 official indexes; its default is `{ cantrips: 0, spells: 0 }`. A synthetic homebrew caster with `spellcasting` and `class_specific.prepared = 6` produced `{ cantrips: 0, spells: 0 }`.

So a new homebrew caster from the wiki gets no slots, no spell limits, and the builder does not offer the spell step for it.

#### The hard-coded tables are 2014 “spells known,” while data is 2024 “prepared”

`utils/rules.ts:296-344`:

| Class | Code at L5 | Data `class_specific.prepared` at L5 | Code at L10 | Data L10 |
|---|---:|---:|---:|---:|
| Bard | 8 | 9 | 14 | 15 |
| Sorcerer | 6 | 9 | 11 | 15 |
| Ranger | 4 | 6 | 6 | 9 |
| Wizard | 8 | 9 | 13 | 15 |
| Cleric | 8 | 9 | 13 | 15 |
| Druid | 8 | 9 | 13 | 15 |
| Paladin | 5 | 6 | 8 | 9 |

(Values assume a +3 ability modifier where the code uses `mod + level` / `mod + floor(level/2)`; the mismatch is the point. The data table is independent of the modifier.)

The Bard/Sorcerer/Ranger rows are indeed the 2014 “spells known” arrays; Wizard/Cleric/Druid/Paladin use `mod + level` / `mod + floor(level/2)` formulas, which also do not match the 2024 prepared table.

Druid cantrips are also wrong: the code shares the Cleric table (3 at level 1, 4 at level 4, 5 at level 10), while the data says 2 at level 1, 3 at level 4, 4 at level 10.

#### Single-class half-casters and third-casters get the wrong slots

`getSpellSlots` computes a multiclass caster level and then always indexes the **full-caster** table:

```ts
// utils/rules.ts:227-254
if (['paladin','ranger'].includes(index)) casterLevel += Math.floor(c.level / 2);
else if (index === 'artificer') casterLevel += Math.ceil(c.level / 2);
else if (subclass is EK/AT) casterLevel += Math.floor(c.level / 3);
...
const levelSlots = slotTable[Math.min(casterLevel, 20)] ...
```

That is the **multiclass** contribution rule. It is correct for a multiclass character's combined table, but it is not the same as the single-class half/third-caster tables. Measured output:

| Character | Expected (5e half/third table) | Current output |
|---|---|---|
| Paladin 1 | 2 first | `{}` |
| Paladin 5 | 4 first, 2 second | 3 first |
| Paladin 9 | 4 first, 3 second, 2 third | 4 first, 3 second |
| Paladin 17 | 4/3/3/3/1 | 4/3/3/2 (no 5th) |
| Ranger 5 | 4 first, 2 second | 3 first |
| Eldritch Knight 7 | 4 first, 2 second | 3 first |
| Eldritch Knight 13 | 4 first, 3 second, 2 third | 4 first, 3 second |
| Eldritch Knight 19 | 4/3/3/1 | 4/3/3 (no 4th) |

Artificer happens to line up because its single-class table is the “round up half” table; Paladin/Ranger/EK/AT do not.

#### Paladin/Ranger level 1

The 2024 data says both get Spellcasting at level 1 and `prepared: 2`. The app gates them at level 2 in multiple places:

- `SpellSelectionStep.tsx:17` (`c.level >= 2`)
- `App.tsx:234, 394` (`c.level >= 2`)
- `SpellManagerModal.tsx` half-caster `getMaxSpellLevel` returns 0 at level 1

At level 1 they get no spell selection and no slots. That is correct for 2014, wrong for the 2024 data the app is using.

#### Eldritch Knight / Arcane Trickster

`getSpellsKnownCount` has no case for `fighter`/`rogue` subclasses, so it returns `0 / 0` for EK/AT. `SpellSelectionStep` includes them as casters at level 3+, but their limits are zero, so the builder cannot select their spells. After creation, `SpellManagerModal` lets them add spells because `limits.spells === 0` disables the over-limit check (`limits.spells > 0 && currentLeveled >= limits.spells`). The result is “no spells at creation, unlimited spells afterward.”

#### Domain spells inflate the prepared limit

`getSpellsKnownCount` also walks `classFeatures` and adds every `spell_access` with a `level`:

```ts
// utils/rules.ts:350-361
if (e.type === 'spell_access') {
    if ((!e.filter_class || e.filter_class.toLowerCase() === definition.index.toLowerCase()) && e.level !== undefined) {
        if (e.level === 0) cantrips += (e.count || 1);
        else spells += (e.count || 1);
    }
}
```

Domain spells have both `spell` and `level` (e.g. Trickery Domain: Bless/level 1, Cure Wounds/level 1, ...). They are always prepared and should not count against the prepared limit. With three such features, a level 5 Cleric's code limit goes from 8 to 11. Because `character.classFeatures` contains all classes' features, these also inflate other classes' limits in a multiclass character.

#### Raw abilities are used at creation

`SpellSelectionStep` and `CharacterSheet.hasPendingSpells` pass `character.abilities` (base scores) to `getSpellsKnownCount`; `SpellManagerModal` correctly passes `getEffectiveAbilities(character)`. A Wizard with a racial Int bonus gets a lower prepared limit at creation than later in the sheet.

#### The right fix

- Read `class_specific.prepared` / `class_specific.cantrips` from `definition.level_table[level-1]` first. Use the hard-coded switch only as a legacy fallback.
- For slots:
  - single class: use that class's own table (`class_specific.spell_slots` if present, otherwise progression-specific table);
  - multiclass: use the multiclass contribution + combined table;
  - keep pact magic separate (see §2.6).
- Add explicit caster progression metadata to class data (`caster_type` or `spellcasting.progression`: `full | half | third | pact | artificer`) and migrate existing rows.
- Centralize caster detection in one helper used by `App`, `SpellSelectionStep`, `SpellManagerModal`, and level-up.
- Use `getEffectiveAbilities` everywhere a formula uses an ability modifier.
- Skip fixed-granted spells (`e.spell`) when counting prepared spells; scope class features by source class; mark always-prepared spells and exclude them from the limit.

---

### 1.4 Subclass-selection levels are hard-coded

**Verdict: TRUE, with a nuance.**

Builder creation uses a hard-coded list:

```ts
// LevelingStep.tsx:56-59
const isSub = (
    (['cleric','warlock','sorcerer','druid','wizard'].includes(cls.definition.index) && i === 3) ||
    (['bard','barbarian','fighter','monk','paladin','ranger','rogue','artificer','pugilist','arrowsmith'].includes(cls.definition.index) && i === 3) ||
    (['arrowsmith'].includes(cls.definition.index) && i === 5)
);
```

Missing: `card-master`, `blood-hunter`, `gunslinger` (and any new homebrew class). Also, `arrowsmith` matches both the second and third clauses, so it can queue a subclass choice at both level 3 and level 5.

Level-up (the live path) uses a feature-name regex instead:

```ts
// ManageCharacterModal.tsx:340-344
const requiredSubclassLevel = SUBCLASS_LEVELS[sourceName] || 3;
const needsSubclass = levelFeatures.some(f =>
    /subclass|archetype|domain|origin|college|circle|oath|tradition|patron|specialist|club|path/i.test(f.name)
) || (isInitiation && ['cleric','warlock','sorcerer'].includes(classIndex));
```

Consequences:

- **Blood Hunter** level 3 feature is “Blood Hunter Order” — `order` is not in the regex, so no prompt.
- **Gunslinger** level 3 feature is “Gunslinger Bravado” — `bravado` is not in the regex, so no prompt.
- **Card Master** level 3 feature is “Share Destiny”; its real subclass feature is “Choose your Path” at **level 4**. The builder list omits Card Master entirely; the level-up regex would prompt at 4 because “path” matches. A Card Master created directly at level 4+ in the builder never gets the prompt.
- `SUBCLASS_LEVELS` in `ManageCharacterModal.tsx:10-14` is the 2014 table (Cleric 1, Warlock 1, Sorcerer 1, Druid 2, Wizard 2), not 2024. It is used for backfill labels and for `canPickSubclass`, but `canPickSubclass` is computed and never rendered.
- There is no manual subclass picker in the Manage Character classes tab. `handleSubclassChange` exists, but it is only called from a choice. If no choice was queued, the user cannot set the subclass at all.

**The right fix:** add `subclass_level` (or `subclass_feature_level`) to class data and read it everywhere. Use a manual “Choose Subclass” dropdown in Manage Character as a fallback. Do not add three more hard-coded class names.

---

## 2. Additional bugs and missing hooks

### 2.1 Race/background/etc. Forge edits are also destructive

The class path is the worst, but it is not alone.

| Forge type | Fields the form does not load/save | Consequence |
|---|---|---|
| Race | `age`, `language_desc`, `language_options`, `languages`, `size_description`, `source`, `subraces_details`; also overwrites `alignment` with the description (`HomebrewManagerModal.tsx:1249`) | Edits delete racial languages, extra-language choices, subraces, and alignment; new characters lose those options. |
| Background | `languages` count, `proficiency_choices`, `source`; resets `currency` to 10 gp (`:1282`) | Edits remove language and proficiency choices and change starting gold (e.g. Archaeologist 25 gp → 10 gp). |
| Subclass | `source`, `desc`, `subclass_flavor`; parent class select only lists the 13 official classes (`:2135-2148`) | Cannot create a subclass for Card Master, Blood Hunter, Gunslinger, Pugilist, Arrowsmith, or any new homebrew class; source lost. |
| Item | `mastery`, `versatileDamage`, `range`, `weapon_range`, `isSpellFocus`, `specialDescription`, `attunement_description` | Editing a longsword can silently remove its mastery/versatile properties. |
| Spell | `source`, `subclasses`; class selector only lists the 9 official classes (`:1735`) | Cannot assign a spell to a homebrew class; source lost. |
| Feat | `source`, `prerequisites` array | Source/prereqs lost. |

This is the same root cause: the form is a partial view but the save is a full replacement.

### 2.2 Class skill/tool choices are not selectable

`ClassStep.tsx` has `chosenProficiencies`, `toggleProficiency`, `updateSubclass`, `handleFeatureChoice`, and `getAvailableExpertiseOptions`, but **none of them are rendered**. The confirm handler always passes empty arrays:

```ts
// ClassStep.tsx:214-216
const levelChoices: any[] = [];
onSelect(finalClasses, [], [], levelChoices);
```

So a Bard/Rogue/Wizard/etc. never gets its class skill choices during creation. `handleClassSelect` merges only race/background skills. The user can manually add skills in Manage Character, but the builder flow is incomplete. `LevelingStep` does not process `proficiency_choices` either; it only processes feature `effects`.

The Forge class form also hard-codes `proficiency_choices: []` and has no UI for them, so even after adding a ClassStep UI, edited homebrew classes would still lose their choices.

### 2.3 HP ignores effective Constitution and HP-per-level effects

At creation:

```ts
// App.tsx:383-386
const conMod = Math.floor((abilities.con - 10) / 2);   // base score, not effective
const hpWithCon = character.maxHp + (character.level * conMod);
```

`getEffectiveAbilities` is used for AC/skills/saves/spell DC, but not for HP. A Hill Dwarf's +2 Con does not increase HP. Level-up and short rests have the same issue (`ManageCharacterModal.tsx:324`, `ShortRestModal.tsx:26`).

Also, `hp_per_level` effects are offered by the editor (`HomebrewManagerModal.tsx:716`) and exist in data:

- Tough feat: `{ type: 'stat_bonus', stat: 'hp_per_level', value: 2 }`
- Draconic Resilience: `hp_per_level: 1`
- Gunslinger CQC Combat Conditioning: `hp_per_level: 2`

No code consumes `hp_per_level`. `grep` finds only producers, no consumer. Tough and Draconic Resilience therefore do nothing to max HP.

Related: static ability increases on feats are also missed. `getEffectiveAbilities` applies `asi` only when `m.target`/`m.stat`/`m.attribute` is an ability, but Durable and Actor use `attributes: ['con']`/`['cha']` and `amount: 1`. Those +1s are not applied.

**Fix:** add a single `computeMaxHp(character)` that uses effective Con, class hit dice, and `hp_per_level` effects; call it when abilities/classes/feats change, preserving current HP. Extend `getEffectiveAbilities` to handle `attributes` arrays and `amount`.

### 2.4 Spell slots are reset on every Manage Character save

```ts
// ManageCharacterModal.tsx:573
spellSlots: getSpellSlots(overrides.classes || localClasses)
```

`getSpellSlots` returns `{ max, current: max }`. `handleSave` always calls `getGlobalUpdates`, so opening Manage Character and saving (even just changing the name, alignment, or theme) **refills all expended slots**. Level-up and class removal do the same. This is both a rules bug and a data-loss bug.

**Fix:** separate max-slot calculation from current-slot state. On recalculation, preserve existing current values:

```ts
const fresh = getSpellSlots(classes);
for (const [lvl, slot] of Object.entries(fresh)) {
    const old = character.spellSlots[lvl];
    slot.current = Math.min(old?.current ?? slot.max, slot.max);
}
```

Grant new slots at full only for levels that did not exist before.

### 2.5 Warlock short rest restores all slots in a multiclass character

```ts
// ShortRestModal.tsx:72-79
const hasWarlock = character.classes.some(c => c.definition.name.toLowerCase() === 'warlock');
if (hasWarlock) {
    Object.keys(newSlots).forEach(lvl => {
        newSlots[l].current = newSlots[l].max;
    });
}
```

A Warlock/Wizard multiclass gets **all** slots back on a short rest, including the Wizard's. The data model merges pact slots into the same `spellSlots` table, so it cannot distinguish them.

**Fix:** store pact slots separately (`pactSlots: { level, count, current }` or a `pact: true` marker per slot), then short rest resets only pact slots. Long rest resets all.

### 2.6 Multiclass spell attack/DC uses only the first class's ability

```ts
// CharacterSheet.tsx:802
const spellAbilityRef = character.classes[0]?.definition.spellcasting?.spellcasting_ability.index;
```

`spellMod`, `spellAttack`, and `spellSave` are then used for every spell. A Wizard/Cleric multiclass uses only the first class's ability for all spell attacks and DCs. The spell already has `sourceClassIndex`; use it to select the matching class's `spellcasting_ability`. Class features that grant spells should use the granting class's ability or an explicit override.

### 2.7 Background effects are dropped

`HomebrewManagerModal` can store background `effects`, and `activeModifiers` tries to read them:

```tsx
// CharacterSheet.tsx:698-703
if (character.background) {
    const bg = character.background as any;
    if (bg.modifiers) ...
    processEffects(bg.effects);
    if (bg.feature) processEffects(bg.feature.effects);
}
```

But `CharacterState.background` is a **string** (`types.ts`), and `App.handleBackgroundComplete` stores only `background.name` (`App.tsx:446`). It creates a `bgFeature` with only name/desc, no `effects` (`App.tsx:424-431`). So background effects never apply, and the code at CharacterSheet:698 is effectively dead.

**Fix:** store the full `BackgroundDetail` (or a normalized `backgroundEffects` + `backgroundFeature`), and copy `background.effects`/`background.feature.effects` onto the `bgFeature`.

### 2.8 Racial fixed proficiencies and languages are not merged into character state

`App.handleRaceSelect` adds only `extraData.skills`/`languages`/`toolProficiencies` (Half-Elf choices, custom origin swaps). It does **not** merge:

- `race.starting_proficiencies`
- `subrace.starting_proficiencies`
- `race.languages`
- `subrace.languages`

The sheet's proficiencies widget displays race languages (`character.race.languages`) and race starting proficiencies, so it can look correct, but:

- `character.skills` does not contain fixed racial skill proficiencies (e.g. Elf Keen Senses → Perception, Half-Orc Menacing → Intimidation). The skill widget only checks `character.skills`, so those proficiencies do not affect skill modifiers.
- `character.toolProficiencies` does not contain fixed racial tools.
- `character.languages` does not contain racial languages (e.g. Elvish); the Manage Character language list will show only the initial `Common`.
- Subrace fixed proficiencies (High Elf longsword/shortbow) are not displayed or applied by `DetailSidePanel`, which only reads `character.race.starting_proficiencies`.

**Fix:** normalize race/subrace fixed proficiencies and languages into character state at creation (and when race changes), or make every consumer derive them from `race`/`subrace`. The former is simpler and consistent with how background skills are stored.

### 2.9 `Library` is a set of empty stubs, breaking Sneak Attack scaling

`data/index.ts`:

```ts
export const CLASSES: any[] = [];
export const SUBCLASSES: any[] = [];
export const FEATS: any[] = [];
export const RACES: any[] = [];

export const Library = {
    getRaces: () => [],
    getRace: () => undefined,
    getClasses: () => [],
    getClass: () => undefined,
    getSubclasses: () => [],
    getSubclass: () => undefined,
    getFeats: () => [],
    getFeat: () => undefined,
    ...
};
```

Two Sneak Attack paths use `Library.getClass('rogue')`, which always returns `undefined`:

```ts
// CharacterSheet.tsx:139-143 and 2709-2712
const fullRogueDetail = Library.getClass('rogue');
const levelData = fullRogueDetail?.level_table.find(l => l.level === rogue.level);
const sDice = levelData?.class_specific?.sneak_attack || '1d6';
```

So Sneak Attack is always `1d6`, regardless of Rogue level. The data is already on the character (`character.classes.find(...).definition.level_table`); use that. The same stubs make `enrichFeature` unable to look up class/subclass/race/feat descriptions if a stored feature lacks `desc`.

### 2.10 Spell Manager: third-caster logic applies to every Fighter/Rogue, and homebrew defaults to level 9

```ts
// SpellManagerModal.tsx getMaxSpellLevel
if (['fighter','rogue'].includes(name)) {
    // third-caster table by class level
}
...
return 9; // unknown class
```

- A Champion Fighter or Thief Rogue is treated as a third-caster after creation and can add spells. The subclass is not checked.
- A homebrew class falls through to `9`, so it can add any spell level.
- If `limits.spells` is 0 (homebrew/EK/AT), `overLimit` is false (`limits.spells > 0 && ...`), so spells can be added without limit.

**Fix:** derive the caster profile from class data and subclass metadata; return 0 for non-casters; use the same helper as creation and level-up.

### 2.11 Custom spells are not filtered by class

`fetchSpellsByClass` appends every custom spell to every class:

```ts
// data/index.ts:245-263
const customSpells = Array.from(customMap.values()).map(...);
return [...mergedLocal, ...customSpells];
```

The custom spell's `classes` field is ignored. A spell marked “Wizard only” appears for Clerics, Warlocks, and every homebrew class. `CustomSpellModal` saves `classes: []`, so new custom spells are effectively universal.

**Fix:** filter custom spells by `classes` membership, and allow the spell Forge to assign homebrew classes (dynamic list, not only the 9 official classes).

### 2.12 Class resources/trackers are hard-coded

`CLASS_FEATURES` in `data/constants.ts` is a name-keyed table of formulas. It covers some official resources and a few homebrew classes, but:

- A new homebrew class/feature cannot define a resource/tracker.
- The class data's `class_specific` fields (`prepared`, `sneak_attack`, `slots`, `choice_points`, `hemocraft_die`, ...) are mostly ignored.
- `Druid` Wild Shape formula returns 2 at level 1 (`data/constants.ts:96`) even though Wild Shape starts at level 2. A level 1 Druid gets a Wild Shape tracker.
- `CharacterSheet` and `LevelUpWizard` use base `character.abilities` for formulas like Bardic Inspiration, Flash of Genius, and Gunslinger Grit, so racial ability bonuses are ignored.
- `ShortRestModal`/`handleRest` use `CLASS_FEATURES` by name to reset resources; homebrew resources are not reset.

**Fix:** add a data-driven `resources`/`class_specific` schema (name, max formula or per-level table, reset type, source class) and generate trackers from it. Keep `CLASS_FEATURES` only as a migration fallback. Use effective abilities in formulas. Fix the Druid level-1 formula.

### 2.13 “Duplicate” in the Forge can overwrite the original

`handleDuplicate` calls `handleEdit(item)` and then clears `editingId` (`HomebrewManagerModal.tsx:1019-1024`). If the user saves without renaming, `saveHomebrew` sees no `id` and looks up an existing row by `name` (`services/supabase.ts:334-336`), then updates it. The “duplicate” action can therefore overwrite the original instead of creating a copy. It should force a new name/index and an explicit insert path.

### 2.14 Renaming content changes its `index`

Every save sets `index: name.toLowerCase().replace(/\s+/g, '-')` (`HomebrewManagerModal.tsx:1242`). Renaming a class/race/item changes its base index, which can break subclasses, character references, spell class lists, and local caches. Edits should preserve the original `index`; only a deliberate “change index” action should alter it.

### 2.15 Pre-filled choices do not apply their side effects

`ChoicesTab.handleMakeChoice` is the only place that applies many choice side effects (skills, languages, expertise, spells, features). Choices created with a non-null value (race trait selections such as Kenku Training, Changeling Instincts, Warforged Specialized Design, Centaur Survivor, etc.) are treated as “completed” and do not go through `handleMakeChoice`. Their chosen skills/tools/languages are not added to `character.*`. Background choices are separately applied in `App.handleBackgroundComplete`, which masks the issue for backgrounds; race trait choices are not.

**Fix:** apply side effects when a choice is created/resolved programmatically, or store the resolved effects in a normalized place and have the sheet consume them. Don't rely on a click handler as the only mutation path.

### 2.16 Dead/duplicated code increases the risk

- `LevelUpWizard.tsx` is never imported. It contains a second subclass/caster/spell logic that is not used.
- `CharacterSheet.performLevelUp` is passed to `ManageCharacterModal` but the prop `onLevelUp` is never called.
- `ManageCharacterModal` has unused `requiredSubclassLevel`, `canPickSubclass`, `loadSubclasses`, and `classSubclassOptions`.
- Caster detection is duplicated in `App.tsx` (three times), `SpellSelectionStep.tsx`, `SpellManagerModal.tsx`, and the dead `LevelUpWizard.tsx`.
- `data/index.ts` exports empty `CLASSES`/`SUBCLASSES`/`FEATS`/`RACES` and empty `Library` getters that still have callers.

This is not cosmetic: the dead paths encode old rules (e.g. 2014 subclass levels, level 2 Paladin/Ranger casting) and make it easy to fix one path while another still behaves differently.

### 2.17 Known security limitation (not a quick bug fix)

Login is username-only (`loginUser` queries `app_users` by username with no password), and the client uses the public anon key. The RLS migration explicitly documents that per-user ownership cannot be enforced without Supabase Auth:

`supabase/migrations/20250828120000_add_rls_policies.sql` — “HONEST LIMITATION” section.

This is not part of the reported bug set, but it is relevant if the tool is exposed beyond a trusted group. The fix is Supabase Auth + `auth.uid()` ownership, not more client-side checks.

---

## 3. Missing hooks/features (the extension points that do not exist)

| Missing hook | Current state | Why it matters |
|---|---|---|
| Caster progression metadata | Only “has `spellcasting`”; no `caster_type`/`progression` | Homebrew/full/half/third/pact casters cannot be expressed; Forge caster dropdown is cosmetic. |
| Subclass-level metadata | Hard-coded lists/regex | Homebrew classes and Card Master/Blood Hunter/Gunslinger are wrong or unprompted. |
| Data-driven spell tables | 2014 arrays in `utils/rules.ts` | Data already has 2024 prepared/cantrip tables; code ignores them. |
| Class skill/tool choice UI | Dead handlers in `ClassStep`; Forge hard-codes `[]` | Characters cannot pick class skills; homebrew classes cannot define them. |
| Homebrew spell-list association | `fetchSpellsByClass` ignores custom `classes`; Forge class picker is official-only | Custom spells appear for every class. |
| Generic resource/tracker schema | `CLASS_FEATURES` by class name | Homebrew resources, subclass resources, and many official features cannot be tracked. |
| Effect schema/normalizer/validation | Editor and engine use different field shapes | Proficiency/advantage effects silently do nothing; malformed data is accepted. |
| Background detail/effects | `background` is a string; effects dropped | Forge background effects never apply. |
| HP recomputation hook | HP is a stored number, calculated only at creation | Racial Con, ASI Con, Tough, Draconic Resilience, and Cynical CQC do not affect HP. |
| Multiclass spell ability | One global `spellAbilityRef` | Wrong attack/DC for multiclass casters. |
| Non-destructive content editing | Full `data` overwrite | Every Forge edit risks losing fields. |
| Multiclass prerequisites | `multi_classing` is not read | Prerequisites are not validated; the data is dropped by the Forge. |
| Feature automation examples | Data has `effects: null` for many features | Jack of All Trades, Reliable Talent, Eldritch Invocations, Battle Master maneuvers, Magical Secrets, Artificer infusions, Pact Boons, etc. are not modeled. |

---

## 4. Initial fix plan

> **Superseded by §6.** After the requirement that **no class/race/subclass/feat/background settings may be hardcoded**, the end state must be fully data-driven. Any item below that suggests a class-name branch or a formula keyed by class name is only a temporary migration/fallback, not the target design. See §6 for the revised plan.

### P0 — stop data loss before doing anything else

1. **Make `saveHomebrew` a patch/merge operation.**
   - Resolve edits by `id`, not by name.
   - Reject non-owner updates of public core content, or create an explicit fork with a new index.
   - Preserve unknown fields; merge `level_table`, `spellcasting`, `proficiency_choices`, `class_specific`, `multi_classing`, `subclasses`, `source`.
   - Never insert a same-index duplicate on an ownership mismatch.

2. **Change the Forge forms to preserve + expose fields.**
   - Keep `editingItem`; send only changed fields.
   - Add UI for class `proficiency_choices`, armor/weapon proficiencies, source, subclass references, multiclassing, and per-level `class_specific` (or mark them read-only/preserved).
   - Add race languages/subraces, background languages/proficiency choices/currency, item mastery/versatile properties.
   - Preserve `index` on rename.

3. **Repair existing content.**
   - Export `custom_classes` and `custom_subclasses` first.
   - Deduplicate by `data.index`, preferring the row with `source`, non-empty `proficiency_choices`, and `class_specific`; keep a reviewed original.
   - Re-seed the stripped Fighter/Arrowsmith rows from the original source.
   - Add a uniqueness strategy for content (e.g. unique per owner + index, with a separate public/core row) after deciding how overrides should work.

4. **Add a snapshot regression test** for Forge edit round-trips: load → save without changes → deep equality.

### P1 — correct the rules engine

5. **Make spell slots/known counts data-driven.**
   - `getSpellsKnownCount`: read `level_table[level-1].class_specific.prepared/cantrips`; fallback to the legacy switch only for data without tables.
   - `getSpellSlots`: use single-class tables for single-class characters; use the multiclass table only when multiple classes cast; keep pact slots separate.
   - Add `caster_type`/`progression` to class data and a `subclass_caster` profile for EK/AT.
   - Fix Paladin/Ranger level 1 casting, Druid cantrips, and domain-spell counting.
   - Use `getEffectiveAbilities` at every call site.

6. **Centralize caster/spell-step detection.**
   - One helper such as `getCasterProfile(classDef, level)` used by `App`, `SpellSelectionStep`, `SpellManagerModal`, and level-up.
   - Include Card Master and any homebrew class with a caster profile.
   - Fix third-caster logic to require the EK/AT subclass.

7. **Fix HP and resource math.**
   - `computeMaxHp` using effective Con, class hit dice, and `hp_per_level`.
   - Apply `asi` effects with `attributes`/`amount` (Durable, Actor).
   - Fix the Druid level-1 Wild Shape formula.
   - Add a generic resource schema; generate trackers from class/subclass data.

8. **Preserve slot state.**
   - Separate max-slot calculation from current-slot state.
   - Merge current values on save/level-up; only new slots start full.
   - Store pact slots separately; short rest resets only pact slots.

9. **Fix per-spell ability selection.**
   - Use `spell.sourceClassIndex` to look up the class's `spellcasting_ability` for attack/DC.
   - Fall back to the first caster only for legacy spells without a source.

10. **Fix the Forge effect schema.**
    - Proficiency: write `target` and map `saving_throw` → `save`.
    - Advantage: write `target: skills|saves|initiative` + `filter`.
    - Add `hp_per_level` consumption or remove it from the editor.
    - Add validation/round-trip tests for every effect type.

11. **Normalize race/background data at creation.**
    - Merge fixed racial/subracial proficiencies and languages into character state.
    - Store background detail/effects (or copy feature effects onto `bgFeature`).

12. **Fix class skills.**
    - Render `detail.proficiency_choices` in `ClassStep` (or `LevelingStep`), collect skills/tools, and pass them to `onSelect`.
    - Add the same editor to the class Forge.

### P2 — polish and missing features

13. **Make Forge lists dynamic:** subclass parent classes, spell classes, and any class-specific pickers should come from the content tables, not hard-coded official lists.
14. **Fix “Duplicate”** to force a new name/index and insert path.
15. **Add a manual subclass picker** in Manage Character for data that has no prompt.
16. **Add level-up spell selection** (currently only a pending dot; the dead `LevelUpWizard` had a hint of this).
17. **Add feature automation incrementally:** start with Bard Jack of All Trades and Rogue Reliable Talent (generic check bonuses), then Warlock invocations, Battle Master maneuvers, Artificer infusions, and Pact Boons.
18. **Remove/repair dead code** (`LevelUpWizard`, `performLevelUp`, `canPickSubclass`, empty `Library`) so there is one source of truth.
19. **Move to Supabase Auth** if the app is exposed beyond a trusted group.

---

## 5. Is this the right thing to do?

> **See §6 for the authoritative plan.** This section is the short version. With the requirement that no class/race/subclass/feat/background setting may be hardcoded, “data-driven” is not an optimization — it is the target architecture.

**Yes — but the fixes must target the root causes, not just the reported symptoms.**

- Adding `card-master`, `blood-hunter`, and `gunslinger` to the hard-coded subclass list would fix three examples and leave the next homebrew class broken. Add `subclass_level` to class data.
- Adding the missing classes to `getSpellSlots`/`getSpellsKnownCount` would fix a few cases and leave homebrew broken. Read the data tables.
- Adding `saving_throw`/`name` support to the sheet would create a second effect dialect and leave existing data inconsistent. Align the editor to the existing `target`/`save` schema.
- Patching `proficiency_choices` preservation in the class save would leave `class_specific`, `spellcasting`, `source`, etc. vulnerable. Make the save a patch and preserve unknown fields.
- Fixing the Forge without cleaning the database leaves the stripped Fighter rows and duplicate subclasses in place. The code fix prevents new damage; a reviewed data migration is required for existing damage.

The correct sequence is:

1. **Stop the bleeding:** non-destructive save, backup/export, dedupe/striped-row repair.
2. **Make the rules data-driven:** caster profile, subclass level, prepared/cantrip/slot tables, resources.
3. **Align the editor to the data schema:** effects, class skills, race/background fields.
4. **Fix secondary math:** HP, slot preservation, pact slots, per-spell ability.
5. **Add the missing feature hooks** in priority order based on what the table actually plays.

A useful acceptance test set:

- Load/save every content type through the Forge without changing anything; assert no field is lost.
- For every class/level, compare `getSpellsKnownCount` to `class_specific.prepared/cantrips`.
- For every class/subclass, compare `getSpellSlots` to the 2024 single-class and multiclass tables.
- Create a homebrew caster with a prepared table and slots; verify the builder offers the spell step, the sheet shows slots, and level-up respects the table.
- Create a level 4 Card Master, a level 3 Blood Hunter, and a level 3 Gunslinger; verify the subclass prompt/manual picker.
- Create a level 1 Paladin/Ranger; verify 2 first-level slots and spell selection.
- Give a character a +2 racial Con and the Tough feat; verify max HP.
- Expend slots, open Manage Character, change the name, save; verify slots are unchanged.
- Short rest a Warlock/Wizard; verify only pact slots return.
- Create a Cleric with a domain; verify domain spells are always prepared and do not inflate the prepared limit.

---

## 6. Revised plan (supersedes §4–§5): no hardcoded class/race/subclass/feat/background settings

### 6.1 Principle

The engine should know **generic D&D rules**, not **specific content**. A class, race, subclass, feat, or background should be able to be added, edited, or imported as data without a code deploy.

Allowed in code:

- Generic rules: ability names, skill list, proficiency bonus, conditions, standard actions, dice notation, rest semantics.
- Generic UI: a component that renders a companion, tracker, or choice type.
- A registry that maps a data-declared component/kind to a renderer.
- Migration scripts, tests, comments.

Not allowed in engine/builder/UI logic:

- `if (class === 'paladin')`, `['bard','cleric',...].includes(index)`, `switch (definition.index)`.
- Resource formulas keyed by class/subclass name.
- Subclass-level lists/regex keyed by class name.
- Race-name checks in `RaceStep`/`App`.
- Feat-name heuristics at runtime: moved to the one-off migration tool (`scripts/content-migration/legacyInferEffects.ts`); runtime callers now use explicit data effects.
- Hardcoded parent-class or spell-class lists in the Forge.
- Hardcoded mappings like `card-master -> SORCERER_SPELLS`.

The rule of thumb: **the data says what a class/race/etc. does; the code says how to execute an effect type.**

### 6.2 Hardcoded domain logic to remove

| Area | Hardcoded today | Move to data |
|---|---|---|
| Class resources | `CLASS_FEATURES` in `data/constants.ts:88-130` (Bardic Inspiration, Rages, Second Wind, Superiority Dice, Wild Shape, Focus, Lay on Hands, Sorcery Points, Channel Divinity, Favored Enemy, Grit, Choice Points, Arrow Crafting, Action Surge, etc.) plus special cases in `CharacterSheet.tsx:266-330` and `:600-640` | `ClassDetail.resources[]` / `SubclassDetail.resources[]` with max formula/table, reset, level gate, source |
| Caster progression | `getSpellSlots` class-index lists (`utils/rules.ts:227-240`), `getSpellsKnownCount` switch (`:296-348`), `isPreparedCaster` (`:158-160`), caster lists in `App.tsx`, `SpellSelectionStep.tsx`, `SpellManagerModal.tsx` | `ClassDetail.caster` / `SubclassDetail.caster` (`full/half/third/pact/artificer/custom`, ability, rounding, tables) |
| Subclass level | `LevelingStep.tsx:56-59`, `ManageCharacterModal.tsx:10-14, 340-344`, `LevelUpWizard.tsx:68-72` | `ClassDetail.subclass_level` (Card Master 4, most 3) |
| Subclass terminology | `LevelingStep.tsx:228-243`, `CharacterSheet.tsx:3550-3570` | `ClassDetail.subclass_label` / `SubclassDetail.flavor` |
| Class skill/tool choices | dead `ClassStep.tsx` handlers; Forge hard-codes `proficiency_choices: []` | `ClassDetail.proficiency_choices` with full choice schema rendered generically |
| Caster spell lists | `data/spells/index.ts` `card-master -> SORCERER_SPELLS`; `fetchAllSpells` hardcoded class array; Forge 9-class list | `ClassDetail.spell_list[]` / tags; spell `classes` membership |
| Extra Attack | `CharacterSheet.tsx:2763-2790` (fighter 5/11/20, barbarian/monk/paladin/ranger 5, class-specific subclasses, Thirsting Blade) | `extra_attack` effects on features/subclasses; `ClassDetail.level_table[].class_specific` |
| Unarmored Defense / AC formulas | `CharacterSheet.tsx:930-950` (barbarian Con, monk Wis) | `stat_bonus_attribute`/`set` effects on features |
| Speed bonuses | `CharacterSheet.tsx:1085-1140` (monk levels, ranger Roving) | `stat_bonus`/`set` speed effects |
| Save/aura bonuses | `CharacterSheet.tsx:975-985` (Paladin Aura of Protection) | `bonus`/`stat_bonus` `saves` effects |
| Attack riders | `CharacterSheet.tsx:2680-2760` (Sneak Attack, Divine Smite, Radiant Strikes, Reckless/Brutal Strike, Foe Slayer, Empowered Strikes, Agonizing Blast, Potent Cantrip) | feature `effects` (e.g. `attack_rider`, `bonus_damage`, `smite`, conditions) |
| Bonus actions | `CharacterSheet.tsx:3360-3440` (hardcoded barbarian/rogue/monk/paladin/ranger/sorcerer/blood-hunter/pugilist/druid/card-master) | `bonus_action`/`action`/`reaction` effects on data |
| Subclass companions/widgets | `CharacterSheet.tsx` Artificer (`artillerist`, `battle-smith`), Card Master; `LayoutManagerModal`, `StatsTab`, `EldritchCannonModal`, `SteelDefenderModal`, `CardOptionsModal` | `SubclassDetail.ui` / `companions` / `widgets` metadata; renderer registry keyed by declared kind |
| Class-specific rules text | `getCharacterSpecificRules` (`CharacterSheet.tsx:132-160`) | data `rules` entries on class/subclass/feat/race/background |
| Race choices | `RaceStep.tsx` Dragonborn ancestry, Half-Elf skills/ASI, High Elf cantrip, Kenku/Changeling/Warforged/Centaur/Minotaur/Leonin/Githyanki validation and option lists; `App.tsx:250-330` hardcoded half-elf/draconic branches | `RaceDetail.choices[]` / `traits[].choices[]` with generic choice kinds and effects |
| Racial fixed proficiencies/languages | `App.handleRaceSelect` does not merge them; sheet special-cases race fields | `RaceDetail`/`SubraceDetail` data merged generically into character state |
| Background effects/choices | `App.handleBackgroundComplete`; `CharacterSheet.tsx:698-703`; Forge background form | `BackgroundDetail.effects`, `feature.effects`, `proficiency_choices`, `languages`, `currency`, `equipment` |
| Feat effects | `inferOptionEffects` was a runtime name heuristic (Archery, Defense, Dueling, Mariner, Tough, Alert, resistances, etc.). It now lives only in the migration tool. | `FeatDetail.effects[]` / option `effects[]`; runtime uses the data |
| Feat ability choices | `Resilient` linked save handled only in `ManageCharacterModal.tsx:893-900` | generic `choice`/`effect` with `linked_save_proficiency` |
| Class/subclass option tables | `METAMAGIC_OPTIONS`, `PICK_A_CARD_TABLE` in `data/constants.ts` | `ClassDetail.options` / `SubclassDetail.options` (or `choices` with option effects) |
| Forge lists | subclass parent list `HomebrewManagerModal.tsx:2135-2148`; spell class list `:1735-1745` | query `custom_classes` / content tables dynamically |

### 6.3 Target data model

Add a small, generic schema. Exact names can change; the point is that entity behavior is expressed as data.

```ts
type CasterProgression =
  | { type: 'full' | 'half' | 'third' | 'pact' | 'artificer'; ability: AbilityName; rounding?: 'up' | 'down' }
  | { type: 'custom'; ability: AbilityName; casterLevelTable: number[]; slotTable?: number[][] | Record<number, number[]> }
  | { type: 'none' };

interface ResourceDef {
  key: string;
  name: string;
  level?: number;                       // first level where it exists
  max:
    | { type: 'fixed'; value: number }
    | { type: 'level' }
    | { type: 'ability'; ability: AbilityName; min?: number }
    | { type: 'proficiency' }
    | { type: 'table'; values: Record<number, number> }
    | { type: 'formula'; expression: string };
  reset: 'short' | 'long';
  source?: string;                      // class/subclass/feat name for display
}

interface ChoiceDef {
  id: string;
  kind: 'skill' | 'tool' | 'language' | 'ability' | 'ancestry' | 'feature' | 'spell' | 'subclass';
  count: number;
  level?: number;
  options?: any[];                      // or a source/filter descriptor
  effects?: FeatureEffect[];            // applied when chosen
  linked_save_proficiency?: boolean;
}

interface UiHook {
  widgets?: string[];                   // e.g. ['activeCards']
  companion?: { kind: 'eldritch-cannon' | 'steel-defender' | 'deck' | string; options?: any };
  extraActions?: string[];
}
```

Extend the existing types:

```ts
interface ClassDetail {
  // existing ...
  caster?: CasterProgression;
  subclass_level?: number;
  subclass_label?: string;
  resources?: ResourceDef[];
  choices?: ChoiceDef[];               // class-level skill/tool/etc.
  spell_list?: string[];               // spell indexes or tags
  multi_classing?: any;
  starting_equipment?: any[];
  ui?: UiHook;
  rules?: RuleEntry[];
}

interface SubclassDetail {
  // existing ...
  subclass_level?: number;
  caster?: CasterProgression;          // for EK/AT-style subclasses
  resources?: ResourceDef[];
  choices?: ChoiceDef[];
  ui?: UiHook;
  rules?: RuleEntry[];
}

interface RaceDetail / SubraceDetail {
  // existing ...
  choices?: ChoiceDef[];               // ancestry, skills, ASI, cantrip, etc.
  traits?: Array<{ ...; effects?: FeatureEffect[]; choices?: ChoiceDef[] }>;
}

interface BackgroundDetail {
  // existing ...
  effects?: FeatureEffect[];
  feature: { name: string; desc: string[]; effects?: FeatureEffect[] };
}

interface FeatDetail {
  // existing ...
  effects?: FeatureEffect[];
  prerequisites?: any[];
  choices?: ChoiceDef[];
}
```

Normalize `FeatureEffect` so the editor, import, and engine share one dialect. Include every type currently used by data: `bonus`, `set`, `resistance`, `immunity`, `stat_bonus`, `stat_bonus_attribute`, `advantage`, `proficiency`, `expertise`, `proficiency_choice`, `expertise_choice`, `feature_choice`, `spell_access`, `extra_attack`, `unarmed_strike`, `natural_weapon`, `bonus_action`, `action`, `reaction`, `asi`, `asi_choice`, `feature`, `class_choice`, plus `hp_per_level`, `attack_rider`, `smite`, `resource`, etc. Every effect gets a validator and a generic consumer.

### 6.4 Generic resolvers

Replace each hardcoded branch with a resolver that reads data. Suggested surface:

```ts
getCasterProfile(classDef, level, subclassDef?)       // caster type/ability/tables
getSpellSlots(classes)                                // single vs multiclass, pact separate
getSpellsKnownCount(characterClass)                   // data prepared/cantrips + explicit choices
getSpellList(classDef, subclassDef?)                  // spell membership
getSubclassLevel(classDef)                            // data
getResources(character)                               // class/subclass/feat resources
getSkillChoices(classDef)                             // proficiency_choices
getMaxHp(character)                                   // hit dice + Con + hp_per_level
getArmorClass(character)                              // effects only
getSpeed(character)                                   // effects only
getExtraAttacks(character)                            // extra_attack effects
getAttackRiders(character, attack)                    // feature effects
getBonusActions(character)                            // action/bonus_action effects
getSavingThrowBonuses(character)                      // effects
getSpellAbility(character, spell)                     // spell.sourceClassIndex -> class caster ability
getUiHooks(character)                                 // data-declared widgets/companions
getRulesEntries(character)                            // data rules text
```

The resolvers can be memoized and combined, but each must be **entity-name-free**. If a rule is genuinely special (e.g. Pact Magic), express it as a progression `type: 'pact'` and implement the generic pact algorithm once; do not branch on `'warlock'`.

### 6.5 Migration phases

**Phase 0 — stop data loss (P0).**
- Non-destructive Forge save/merge; backup/export; dedupe/stripped-row repair as in §4 P0.
- This must happen before the schema migration so the migration is not immediately overwritten.

**Phase 1 — schema + content enrichment.**
- Add the new fields to the TypeScript types and a schema version.
- Write a one-off migration/enrichment script that:
  - adds `caster` to every class/subclass (standard: full/half/third/pact/artificer; EK/AT: third);
  - adds `subclass_level` (Card Master 4, most 3);
  - moves `CLASS_FEATURES` formulas into `resources` (including special resources currently added in `CharacterSheet`);
  - moves `METAMAGIC_OPTIONS` and `PICK_A_CARD_TABLE` into class/subclass data;
  - moves `inferOptionEffects` heuristics into explicit `effects` on feats/options;
  - adds `choices` to races/subraces for ancestry/half-elf/high-elf/kenku/etc.;
  - adds `effects` to backgrounds and `feature.effects`;
  - adds `ui`/`companions` to Artificer/Card Master subclasses;
  - adds `rules` entries for class-specific text;
  - adds `spell_list`/class membership for spell lists.
- Validate every record against the schema. Fail the migration on missing data rather than falling back silently.

**Phase 2 — generic engine with a compatibility layer.**
- Implement the resolvers.
- Keep the old hardcoded functions temporarily behind a feature flag or adapter, and add golden tests comparing old vs new for all official content.
- Do not ship new content through the new path until the golden tests match.

**Phase 3 — switch call sites and delete branches.**
- `utils/rules.ts`, `CharacterSheet.tsx`, `App.tsx`, `SpellSelectionStep.tsx`, `SpellManagerModal.tsx`, `LevelingStep.tsx`, `ManageCharacterModal.tsx`, `RaceStep.tsx`, `ClassStep.tsx`, `LayoutManagerModal.tsx`, `StatsTab.tsx`, and the companion modals.
- Remove `CLASS_FEATURES`, `SUBCLASS_LEVELS`, hardcoded caster lists, hardcoded subclass terminology, hardcoded parent/spell class lists. (`CLASS_FEATURES`, `LevelUpWizard`, and runtime `inferOptionEffects` are already removed.)
- Keep component implementations for companion/UI kinds; select them by data-declared `kind`.

**Phase 4 — Forge.**
- Dynamic parent-class/spell-class lists from the tables.
- Add editors for the new schema (resources, choices, effects, caster progression, subclass level, `ui` hooks).
- Non-destructive merge; snapshot tests.

**Phase 5 — cleanup and guardrails.**
- Delete `LevelUpWizard`, `performLevelUp`, `canPickSubclass`, empty `Library` stubs, and duplicate caster detection.
- Add a static guard test: fail if entity names appear in engine/builder logic (allow data files, migrations, tests, comments). Start with a curated list of class/race/subclass/feat/background names and a path allowlist.
- Add a “new content” integration test that creates a homebrew class/race/subclass/feat/background **as data only** and asserts:
  - it appears in the builder;
  - caster slots/spells work;
  - subclass prompt appears at the right level;
  - resources/trackers appear and reset;
  - skill choices/effects/background effects apply;
  - Forge round-trip is lossless.

### 6.6 Acceptance criteria

- Grep for entity names in `utils/rules.ts`, `CharacterSheet.tsx`, `App.tsx`, `SpellSelectionStep.tsx`, `SpellManagerModal.tsx`, `LevelingStep.tsx`, `ManageCharacterModal.tsx`, `RaceStep.tsx`, `ClassStep.tsx` returns only comments/tests/data-migration references.
- A new homebrew class with `caster`, `subclass_level`, `resources`, and `spell_list` works end-to-end with **zero code changes**.
- A new race with `choices`/`effects`/languages/proficiencies works end-to-end.
- A new subclass with `resources`/`effects`/`ui` works end-to-end.
- A new feat with explicit `effects` works end-to-end; no name heuristics.
- A new background with `effects`/`proficiency_choices` works end-to-end.
- Standard content matches golden outputs from the old engine.
- Forge edit round-trip preserves unknown fields for every content type.

### 6.7 What may legitimately stay hardcoded

- Generic 5e rules: ability names, skill list, proficiency bonus, conditions, standard actions, exhaustion, rests, dice.
- UI layout/theme and component implementations.
- A registry of companion/UI kinds (`eldritch-cannon`, `steel-defender`, `deck`) — the data selects the kind; the code renders it.
- Migration mappings from old data to new data (one-off, versioned, not runtime logic).

### 6.8 Why this is the right target

- It removes the entire class of “new content is invisible to the engine” bugs: no missing class in a caster list, no missing subclass level, no missing resource tracker, no missing effect.
- It makes the Forge safe and complete: every field the engine needs has a data home and an editor.
- It makes standard and homebrew content use the same path, so a fix for one benefits the other.
- It lets the data carry 2014/2024 variants, house rules, and wiki imports without code changes.

Risks and mitigations:

- **Large migration:** do it in phases with golden tests and a schema version; keep old data readable.
- **Special mechanics:** express them as progression/resource/effect types (e.g. `pact`, `rounding: 'up'`), not class-name branches.
- **UI companions:** code still needs a renderer per kind; data decides which kind a subclass uses. That is acceptable and not a class-name hardcode.
- **Incomplete imported data:** validate and fail closed; provide a migration/enrichment tool rather than silent fallbacks. Do not keep permanent class-name defaults.

---

## 7. Migration artifacts (implemented 2026-11-01)

The schema and data migration are prepared in the repo:

| Artifact | Purpose |
|---|---|
| `supabase/migrations/20261101160000_content_library_v2.sql` | Adds metadata columns, `content_revisions`, `content_migrations`, indexes, triggers, duplicate/canonical views. |
| `supabase/migrations/20261101160001_content_library_data.sql` | Generated data migration: 239 records, full enriched JSON documents + metadata. |
| `supabase/migrations/20261101160002_content_library_data_rollback.sql` | Exact pre-migration rollback for those 239 records. |
| `MIGRATION_STEPS.md` | Non-technical run/rollback instructions. |
| `scripts/content-migration/migrate.ts` | Dry-run/apply TypeScript migration with backup, validation, plan, and apply report. |
| `scripts/content-migration/generate-sql.ts` | Generates the SQL data migration from a reviewed plan. |
| `scripts/content-migration/restore.ts` | Restores a backup directory. |
| `scripts/content-migration/README.md` | Apply/restore/verify instructions. |

**Status:** the migration **was applied on 2026-11-01**. Verified live: 239 `content_revisions`, two ledger rows (`20261101160000_content_library_v2`, `20261101160001_content_library_data`), all 239 documents at `schema_version: 2`, and the new class fields present (e.g. Paladin: `caster: half`, resources, choices, effects).

The earlier anon-key apply attempt was a no-op: PostgREST returned HTTP 200 with 0 updated rows because RLS filtered the writes. The generated SQL was run in the Supabase SQL editor instead.

**Verified before generating the SQL:**

- 239 records read across the five content types.
- 0 validation errors.
- Backups written under `scripts/content-migration/backups/<timestamp>/` (gitignored).
- The generated SQL parses (239 `update` statements + ledger insert).
- Every update sets `data`, `schema_version`, `slug`, `source`, and `migrated_at`; the schema trigger snapshots the old document into `content_revisions` and refreshes `content_hash`/`revision`.

**Already implemented in this pass:**

- `saveHomebrew` now merges the partial Forge payload over the existing document instead of replacing it (`services/contentMerge.ts`). It preserves `proficiency_choices`, `level_table.class_specific`, `spellcasting.info/level`, `source`, `multi_classing`, `subclasses`, race subraces/languages, background choices/currency, item mastery, etc.
- It refuses to turn a blocked update into a duplicate insert. A non-owner edit or a 0-row RLS-filtered update now throws a clear error.
- The schema migration adds/repairs the anon content-table policies so the Forge can update after you run it.

**Code migration progress is tracked in §8.** The Forge is safe to save existing records (fields are preserved), but the remaining new settings still need SQL/import or the Forge editors listed in §8.

---

## 8. Code migration progress (2026-11-01)

**Done in this pass**

- `getSpellSlots` and `getSpellsKnownCount` now read class/subclass data:
  - single-class full/half/third/artificer/pact/custom tables;
  - multiclass combined caster level;
  - 2024 prepared/cantrip tables from `level_table[].class_specific`;
  - EK/AT third-caster profile, Card Master custom slots, Paladin/Ranger level 1.
- Caster detection is centralized via `getCasterProfileFor` in `App`, `SpellSelectionStep`, `SpellManagerModal`, `ShortRestModal`.
- Resources/trackers come from `ClassDetail.resources` / `SubclassDetail.resources` via `getResourceDefinitions`; `CLASS_FEATURES` was removed.
- Max HP uses effective Constitution and `hp_per_level` effects; `attributes` ability bonuses (Durable/Actor) apply.
- AC/speed/aura bonuses were moved to data effects (Unarmored Defense, Unarmored Movement, Roving, Fast Movement, Aura of Protection).
- Subclass levels/labels come from data (`subclass_level`, `subclass_label`); the builder and level-up no longer use the hardcoded class list/regex. Manage Character has a manual subclass picker.
- Class skill/tool choices are rendered in the builder and passed into character creation.
- Existing characters are hydrated from the content library on load, so old class snapshots use the current documents; spell slots are recalculated while preserving current values.
- Race creation now renders `RaceDetail.choices` / `SubraceDetail.choices` generically (ancestry, skills, tools, languages, ability increases, cantrips, fixed proficiencies); the race-specific builder branches were removed.
- Runtime `inferOptionEffects` name heuristics were removed; only the one-off migration tool still uses them to materialize data.
- `METAMAGIC_OPTIONS` and `PICK_A_CARD_TABLE` were moved into Sorcerer/Card Master `options` data; the runtime reads them from the class document. The data was patched with revision snapshots and a backup.
- Bonus actions are built from class/subclass feature data and `bonus_action`/`action` effects, not a class-name list.
- Artificer/Card Master widgets and companions are selected by `ui.widgets`/`ui.companion` data (`eldritchCannon`, `steelDefender`, `activeCards`).
- Subclass terminology/levels and the defenses widget use class/subclass data instead of hardcoded class names.
- Attack riders (Sneak Attack, Divine Smite, Radiant/Brutal Strike, Foe Slayer, Empowered Strikes, Cunning Strike) are data `attack_rider` effects; Fighter extra attacks are `extra_attack` data. The class-name combat branches were removed.
- Monk unarmed progression reads `level_table.class_specific.martial_arts`.
- Arrowsmith ammunition definitions live in `options.arrows`; both attack generation and the quiver UI read the class document.
- Warlock Eldritch Invocations are data-driven: the class has `options.invocations`, the builder/level-up queue choices from `class_specific.invocations`, and Agonizing Blast/Thirsting Blade effects are applied generically.
- Pugilist's Iron Chin description now matches the implemented 10 + DEX + CON unarmored formula, and the unarmed die reads either `martial_arts` or `fisticuffs`.
- Darkvision now displays the range from its `set` effect (60/120/etc.), Harengon's initiative bonus scales with Proficiency Bonus, and flat `set` AC (Tortle 17) no longer adds Dexterity.
- Background creation now honors generic ability/skill/tool/language/feat choices, applies fixed tool proficiencies, stores chosen ability bonuses/feats, and supports editable currency. The Forge loads the background feature description into Lore.
- Background and race ability choices now offer the standard +2/+1 or the +1/+1/+1 alternative when the content has a +2 and +1 choice pair.
- Flat `max_hp` bonuses are now included in max-HP calculation (Boon of Fortitude), and selecting a feat/feature that changes HP recalculates the sheet total.
- `proficiency_choice` effects can mark `expertise_if_proficient`; Observant and Keen Mind use it, and the Forge exposes the toggle. It is applied on both the sheet and Manage paths.
- Named `spell_access` grants are hydrated as always-prepared spells with `min_level`, free-cast/reset metadata, and optional spellcasting ability; this covers class, subclass, race, background, and feat grants.
- Race/class feature effects are deduplicated when both `effects` and legacy `modifiers` exist; the race Forge now writes only `effects`.
- Manage → Choices now attaches the chosen subclass correctly. Background/race feats get sub-choices, and feat pickers filter Origin/General/Epic Boon prerequisites. Race/subrace descriptions come from the content library, and feat actions use their effect names.
- Developer JSON can now intentionally override `level_table[].class_specific`; omitted values still preserve the existing data.
- Legacy `proficiency_choices` was removed from class documents (18 rows); the builder uses `choices`. Backgrounds still use their `proficiency_choices` because its builder reads them.
- The Forge choice editor now supports feat and spellcasting-ability choices, and ancestry options expose the same per-option effect editor used by Feature Choice options.
- Background feature effects are copied onto the character and rehydrated from the content library for existing characters; changing background in Manage Character also refreshes them.
- Racial spell choices load spells by the choice's `sourceClass` instead of a hardcoded Wizard list.
- Item flags, Artificer companion layout, and card/Artificer widget selection use data `ui`/`options` flags.
- The Forge now has structured editors for limited-use resources and class/ancestry choices; raw option JSON was replaced with a plain add-option list. UI hooks are kept as data but removed from the creator UI, and raw JSON is hidden under an optional developer section.
- The Forge modal uses an opaque background and fixed 90dvh shell to stop scroll-through see-through glitches.
- The Forge subclass parent picker no longer defaults to Fighter; it uses the first content class and the live list.
- Duplicate content resolution is deterministic: `loadHomebrew` scores rows (source, proficiency choices, class_specific, feature count, etc.) instead of taking the oldest/newest arbitrarily. For Fighter, the canonical PHB row now wins over the stripped copies.
- `CORE_INDICES` was removed; core/homebrew status comes from the content `homebrew`/`is_homebrew` data, and Forge edits preserve it.
- Forge class/subclass forms persist `caster`, `subclass_level`, and `subclass_label`; parent-class and spell-class lists are queried from the content library.
- Custom spell lists are resolved from `ClassDetail.spell_list`; custom spells are filtered by their `classes` data.
- Forge saves merge instead of replacing; blocked/non-owner updates no longer create duplicate inserts.
- Removed `LevelUpWizard.tsx` and the `CLASS_FEATURES` table.

**Remaining hardcoded domain logic**

- Duplicate cleanup completed: all 14 duplicate groups were removed (18 lower-quality copies), with backups under `scripts/content-migration/backups/duplicate-cleanup-*`. The data SQL was regenerated with the canonical 18 classes / 105 subclasses.
- Remaining polish is content expansion, not hardcoded settings: additional invocations/spells and any missing feature data (for example Potent Cantrip).
- Forge editors for `resources`, `choices`, `effects`, `spell_list`, and `ui` are not built yet.
- Duplicate content rows were not deleted; use the canonical/duplicate views for a reviewed cleanup.

## Appendix A — Production content snapshot (read-only)

**`custom_classes`:** 24 rows, 18 unique indexes.

| Index | Rows |
|---|---:|
| fighter | 6 |
| arrowsmith | 2 |
| all others | 1 each |

Five Fighter rows are Forge-shaped (no `source`, empty `proficiency_choices`, no `class_specific`); one original Fighter row has `source: "Player's Handbook 2024"` and `class_specific`.

**`custom_subclasses`:** 117 rows, 105 unique indexes. Duplicate indexes (12):

`totem-warrior`, `glamour`, `valor`, `berserker`, `lore`, `moon`, `dreams`, `champion`, `battle-master`, `land`, `eldritch-knight`, `ancestral-guardian`.

The duplicate pairs have identical `created_at` timestamps and different feature counts (e.g. Champion has a 3-feature row and a 1-feature row). Because `loadHomebrew` collapses by index with a `Map`, the winner is not deterministic.

**Other content tables:** `custom_races` 45, `custom_backgrounds` 22, `custom_feats` 31, `custom_spells` 1, `custom_equipment` 0, `custom_beasts` 0, `custom_familiars` 0.

## Appendix B — Key code locations

| Concern | Location |
|---|---|
| Class Forge save | `components/Dashboard/HomebrewManagerModal.tsx:1225-1350` |
| Caster type guessed | `components/Dashboard/HomebrewManagerModal.tsx:1078` |
| Proficiency editor | `components/Dashboard/HomebrewManagerModal.tsx:758-769` |
| Advantage editor | `components/Dashboard/HomebrewManagerModal.tsx:~798-806` |
| Whole-record update | `services/supabase.ts:339-349` |
| Duplicate/upsert lookup | `services/supabase.ts:330-337, 367-379` |
| Local/remote merge | `services/supabase.ts:240-274` |
| Spell slots | `utils/rules.ts:227-268` |
| Spell counts | `utils/rules.ts:277-364` |
| Subclass list (builder) | `components/Builder/LevelingStep.tsx:56-59` |
| Subclass regex (level-up) | `components/Sheet/Modals/ManageCharacterModal.tsx:340-344` |
| Class skill dead code | `components/Builder/ClassStep.tsx:127-216` |
| HP at creation | `App.tsx:383-386` |
| Slot reset | `components/Sheet/Modals/ManageCharacterModal.tsx:573` |
| Warlock short rest | `components/Sheet/Modals/ShortRestModal.tsx:72-79` |
| Global spell ability | `components/Sheet/CharacterSheet.tsx:802` |
| Background effects | `App.tsx:413-456`, `CharacterSheet.tsx:698-703` |
| Sneak Attack via empty Library | `data/index.ts:16-41`, `CharacterSheet.tsx:139-143, 2709-2712` |
| Third-caster max level | `components/Sheet/Modals/SpellManagerModal.tsx` (`getMaxSpellLevel`) |
| Custom spell class filter | `data/index.ts:245-263` |
| Class resources | `data/constants.ts:88-130` |
| Druid Wild Shape formula | `data/constants.ts:96` |
