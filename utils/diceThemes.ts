import { DiceSurface, DiceEdgeStyle, DiceCustomizationOptions } from '../types';

export interface PersonaDiceThemeDefinition {
  id: string;
  diceBoxTheme: string;
  surface: DiceSurface;
  edgeStyle: DiceEdgeStyle;
  supportsThemeColor: boolean;
  available: boolean;
  unavailableReason?: string;
}

export interface RequiredDiceCustomization {
  color: string;
  surface: DiceSurface;
  edgeStyle: DiceEdgeStyle;
  scale: number;
  lightIntensity: number;
  shadowTransparency: number;
  spinForce: number;
  throwForce: number;
  soundEnabled: boolean;
}

const DEFAULT_COLOR = '#eab308';

export function normalizeDiceCustomization(
  value: DiceCustomizationOptions | undefined,
  legacyColor?: string
): RequiredDiceCustomization {
  return {
    color: value?.color || legacyColor || DEFAULT_COLOR,
    surface: value?.surface || 'solid',
    edgeStyle: value?.edgeStyle || 'classic',
    scale: value?.scale ?? 6,
    lightIntensity: value?.lightIntensity ?? 1.4,
    shadowTransparency: value?.shadowTransparency ?? 0.7,
    spinForce: value?.spinForce ?? 6,
    throwForce: value?.throwForce ?? 6,
    soundEnabled: value?.soundEnabled ?? false,
  };
}

export const THEME_DEFINITIONS: Record<string, PersonaDiceThemeDefinition> = {
  'solid-rounded': {
    id: 'solid-rounded',
    diceBoxTheme: 'smooth',
    surface: 'solid',
    edgeStyle: 'rounded',
    supportsThemeColor: true,
    available: true,
  },
  'solid-classic': {
    id: 'solid-classic',
    diceBoxTheme: 'default',
    surface: 'solid',
    edgeStyle: 'classic',
    supportsThemeColor: true,
    available: true,
  },
  'solid-sharp': {
    id: 'solid-sharp',
    diceBoxTheme: 'gemstone',
    surface: 'solid',
    edgeStyle: 'sharp',
    supportsThemeColor: true,
    available: true,
  },
  'marble-sharp': {
    id: 'marble-sharp',
    diceBoxTheme: 'gemstoneMarble',
    surface: 'marble',
    edgeStyle: 'sharp',
    supportsThemeColor: false,
    available: true,
  },
  'marble-rounded': {
    id: 'marble-rounded',
    diceBoxTheme: 'gemstoneMarble',
    surface: 'marble',
    edgeStyle: 'rounded',
    supportsThemeColor: false,
    available: false,
    unavailableReason: 'Marble texture is tailored for the Sharp gemstone model.',
  },
  'marble-classic': {
    id: 'marble-classic',
    diceBoxTheme: 'gemstoneMarble',
    surface: 'marble',
    edgeStyle: 'classic',
    supportsThemeColor: false,
    available: false,
    unavailableReason: 'Marble texture is tailored for the Sharp gemstone model.',
  },
};

const warnedKeys = new Set<string>();

export function resolvePersonaDiceTheme(
  surface: DiceSurface = 'solid',
  edgeStyle: DiceEdgeStyle = 'classic'
): PersonaDiceThemeDefinition {
  const key = `${surface}-${edgeStyle}`;
  const def = THEME_DEFINITIONS[key];

  if (def && def.available) {
    return def;
  }

  if (surface === 'marble') {
    const marbleSharp = THEME_DEFINITIONS['marble-sharp'];
    if (marbleSharp && marbleSharp.available) {
      if (!warnedKeys.has(key)) {
        console.warn(`Dice theme combination "${key}" unavailable. Falling back to marble-sharp.`);
        warnedKeys.add(key);
      }
      return marbleSharp;
    }
  }

  if (!warnedKeys.has(key)) {
    console.warn(`Dice theme combination "${key}" unavailable or invalid. Falling back to solid-classic.`);
    warnedKeys.add(key);
  }
  return THEME_DEFINITIONS['solid-classic'];
}
