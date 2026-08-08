# Project Rules & Agent Instructions (AGENTS.md)

This document contains project guidelines, architectural decisions, and key technical learnings to prevent scope creep and avoid recurring issues in production builds.

---

## 1. Scope Discipline & Feature Scope
- **Strict User Intent**: Only implement features, components, and fixes explicitly requested by the user.
- **No Unsolicited Additions**: Do not add extra visual tabs, navigation menus, background logic, or secondary architecture unless directly requested.
- **UI & Layout Integrity**: Maintain existing theme conventions (D&D 5e dark aesthetic, gold accents, crisp typography) without adding unrequested dashboard panels.

---

## 2. Docker & Build Reliability (`npm ci` & Lockfile Sync)
- **Problem Context**: Docker builds execute `RUN npm ci`, which strictly validates that `package.json` and `package-lock.json` are in 100% sync. Missing dependencies (e.g., `@3d-dice/theme-*` packages) cause `npm ci` to fail with code `EUSAGE`.
- **Rule**: Whenever any `@3d-dice` theme, asset sync script, or npm dependency is modified or added in `package.json`, `package-lock.json` MUST be updated using `npm install` before completing the turn.
- **Theme Asset Syncing**: The `scripts/sync-dice-box-assets.mjs` script runs automatically during `postinstall` and `build`. All 13 `@3d-dice` theme packages (including `genesys`) MUST be mapped in `sources.themes`, `OfficialDiceThemeId` in `types.ts`, and `OFFICIAL_DICE_THEMES` in `utils/diceThemes.ts` to ensure consistent bundle creation.

---

## 3. 3D Dice Roller Engine (`DiceRoller3D.tsx`)
- **Hold Duration**: Rolled 3D dice remain visible on screen for **3 seconds (3000ms)** post-roll.
- **Fade Out Transition**: The host container (`#dice-box-host`) uses a **700ms ease-out opacity transition** (`transition-opacity duration-700 ease-out`) when fading out (`setActive(false)`).
- **Physics Scene Clearing**: `boxRef.current.clear()` MUST execute **700ms after** `setActive(false)` is invoked (once opacity reaches 0), preventing sudden pop-out artifacts or floating dice visual glitches.
- **State & Lifecycle Management**: 
  - Parent components (e.g., `CharacterSheet.tsx`) reset `current3DRequest` to `null` upon calling `onComplete`.
  - Timer callbacks in `DiceRoller3D` must NOT be prematurely aborted or cancelled by parent `request` reset triggers; otherwise, the dice will remain visible indefinitely on screen.
