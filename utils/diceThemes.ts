import {
  OfficialDiceThemeId,
  DiceCustomizationOptions,
  DiceSurface,
  DiceEdgeStyle,
} from '../types';

export interface DiceThemeDefinition {
  id: OfficialDiceThemeId;
  label: string;
  supportsThemeColor: boolean;
  diceAvailable: readonly string[];
  extends?: OfficialDiceThemeId;
  dndFallbackTheme?: OfficialDiceThemeId;
  description: string;
}

export interface RequiredDiceCustomization {
  theme: OfficialDiceThemeId;
  color: string;
  scale: number;
  lightIntensity: number;
  shadowTransparency: number;
  enableShadows: boolean;
  spinForce: number;
  throwForce: number;
  soundEnabled: boolean;
  surface?: DiceSurface;
  edgeStyle?: DiceEdgeStyle;
}

export interface ResolvedTheme {
  definition: DiceThemeDefinition;
  runtimeTheme: OfficialDiceThemeId;
  supportsThemeColor: boolean;
  preloadThemes: string[];
}

export const OFFICIAL_DICE_THEMES: readonly DiceThemeDefinition[] = [
  {
    id: 'default',
    label: 'Default',
    supportsThemeColor: true,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Default customizable standard dice',
  },
  {
    id: 'default-extras',
    label: 'Default Extras',
    supportsThemeColor: true,
    diceAvailable: ['pip', 'fate', 'd2'],
    extends: 'default',
    dndFallbackTheme: 'default',
    description: 'Additional dice shapes (pip, fate, d2) extending Default',
  },
  {
    id: 'blueGreenMetal',
    label: 'Blue Green Metal',
    supportsThemeColor: false,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Metallic finish in vibrant blue-green',
  },
  {
    id: 'diceOfRolling',
    label: 'Dice of Rolling',
    supportsThemeColor: false,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Color-coded tabletop RPG dice',
  },
  {
    id: 'diceOfRolling-fate',
    label: 'Dice of Rolling – Fate',
    supportsThemeColor: false,
    diceAvailable: ['fate'],
    extends: 'diceOfRolling',
    dndFallbackTheme: 'diceOfRolling',
    description: 'Fate dice extending Dice of Rolling',
  },
  {
    id: 'gemstone',
    label: 'Gemstone',
    supportsThemeColor: true,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Facet-cut translucent gemstone finish',
  },
  {
    id: 'gemstoneMarble',
    label: 'Gemstone Marble',
    supportsThemeColor: false,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Swirled rainbow marble gemstone texture',
  },
  {
    id: 'genesys',
    label: 'Genesys',
    supportsThemeColor: false,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Custom symbol dice theme for narrative gameplay',
  },
  {
    id: 'rock',
    label: 'Rock',
    supportsThemeColor: true,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Stone texture with customizable hue',
  },
  {
    id: 'rust',
    label: 'Rust',
    supportsThemeColor: true,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Weathered metallic surface with customizable tint',
  },
  {
    id: 'smooth',
    label: 'Smooth',
    supportsThemeColor: true,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Clean, rounded edges with vibrant solid color',
  },
  {
    id: 'smooth-pip',
    label: 'Smooth – Pip',
    supportsThemeColor: true,
    diceAvailable: ['pip'],
    extends: 'smooth',
    dndFallbackTheme: 'smooth',
    description: 'Pip dice extending Smooth',
  },
  {
    id: 'wooden',
    label: 'Wooden',
    supportsThemeColor: false,
    diceAvailable: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    description: 'Natural carved wood grain finish',
  },
] as const;

const DEFAULT_COLOR = '#eab308';
const RUST_DEFAULT_COLOR = '#aa4f4a';

const warnedUnknownThemes = new Set<string>();

export function getThemeDefinition(themeId: string): DiceThemeDefinition {
  const found = OFFICIAL_DICE_THEMES.find(t => t.id === themeId);
  if (found) return found;

  if (!warnedUnknownThemes.has(themeId)) {
    console.warn(`Unknown dice theme "${themeId}". Falling back to "default".`);
    warnedUnknownThemes.add(themeId);
  }
  return OFFICIAL_DICE_THEMES[0]; // default
}

export function normalizeDiceCustomization(
  value: DiceCustomizationOptions | undefined,
  legacyColor?: string
): RequiredDiceCustomization {
  let theme: OfficialDiceThemeId = 'default';

  if (value?.theme && OFFICIAL_DICE_THEMES.some(t => t.id === value.theme)) {
    theme = value.theme as OfficialDiceThemeId;
  } else if (value?.surface || value?.edgeStyle) {
    if (value.surface === 'marble') {
      theme = 'gemstoneMarble';
    } else if (value.surface === 'solid' || !value.surface) {
      if (value.edgeStyle === 'rounded') {
        theme = 'smooth';
      } else if (value.edgeStyle === 'sharp') {
        theme = 'gemstone';
      } else {
        theme = 'default';
      }
    }
  } else if (value?.theme) {
    if (!warnedUnknownThemes.has(value.theme)) {
      console.warn(`Unknown dice theme "${value.theme}". Falling back to "default".`);
      warnedUnknownThemes.add(value.theme);
    }
    theme = 'default';
  }

  const themeDef = getThemeDefinition(theme);

  let defaultColor = DEFAULT_COLOR;
  if (themeDef.id === 'rust' && !value?.color && !legacyColor) {
    defaultColor = RUST_DEFAULT_COLOR;
  }

  const color = value?.color || legacyColor || defaultColor;

  return {
    theme,
    color,
    scale: value?.scale ?? 5,
    lightIntensity: value?.lightIntensity ?? 1,
    shadowTransparency: value?.shadowTransparency ?? 0.8,
    enableShadows: value?.enableShadows ?? true,
    spinForce: value?.spinForce ?? 6,
    throwForce: value?.throwForce ?? 6,
    soundEnabled: value?.soundEnabled ?? false,
    surface: value?.surface,
    edgeStyle: value?.edgeStyle,
  };
}

export function resolveDiceTheme(themeId: OfficialDiceThemeId | string): ResolvedTheme {
  const definition = getThemeDefinition(themeId);

  const runtimeTheme = definition.dndFallbackTheme || definition.id;
  const preloadThemes: string[] = [];

  if (definition.extends) {
    preloadThemes.push(definition.id, definition.extends);
  } else {
    preloadThemes.push(definition.id);
  }

  return {
    definition,
    runtimeTheme,
    supportsThemeColor: definition.supportsThemeColor,
    preloadThemes,
  };
}

// Legacy backwards compatibility wrapper
export function resolvePersonaDiceTheme(
  surface: DiceSurface = 'solid',
  edgeStyle: DiceEdgeStyle = 'classic'
): { diceBoxTheme: string; supportsThemeColor: boolean } {
  let theme: OfficialDiceThemeId = 'default';
  if (surface === 'marble') {
    theme = 'gemstoneMarble';
  } else if (edgeStyle === 'rounded') {
    theme = 'smooth';
  } else if (edgeStyle === 'sharp') {
    theme = 'gemstone';
  }

  const resolved = resolveDiceTheme(theme);
  return {
    diceBoxTheme: resolved.runtimeTheme,
    supportsThemeColor: resolved.supportsThemeColor,
  };
}
