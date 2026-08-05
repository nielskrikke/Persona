import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import {
  OFFICIAL_DICE_THEMES,
  normalizeDiceCustomization,
  resolveDiceTheme,
  getThemeDefinition,
} from '../utils/diceThemes.js';

describe('Official Dice Theme Catalog', () => {
  test('catalog contains exactly 12 themes in required order', () => {
    assert.equal(OFFICIAL_DICE_THEMES.length, 12);
    const expectedIds = [
      'default',
      'default-extras',
      'blueGreenMetal',
      'diceOfRolling',
      'diceOfRolling-fate',
      'gemstone',
      'gemstoneMarble',
      'rock',
      'rust',
      'smooth',
      'smooth-pip',
      'wooden',
    ];

    const actualIds = OFFICIAL_DICE_THEMES.map(t => t.id);
    assert.deepEqual(actualIds, expectedIds);
  });

  test('colorable vs fixed themes match specification', () => {
    const colorableMap: Record<string, boolean> = {
      'default': true,
      'default-extras': true,
      'blueGreenMetal': false,
      'diceOfRolling': false,
      'diceOfRolling-fate': false,
      'gemstone': true,
      'gemstoneMarble': false,
      'rock': true,
      'rust': true,
      'smooth': true,
      'smooth-pip': true,
      'wooden': false,
    };

    for (const [id, expectedColorable] of Object.entries(colorableMap)) {
      const def = getThemeDefinition(id);
      assert.equal(def.supportsThemeColor, expectedColorable, `Theme ${id} colorable status mismatch`);
    }
  });

  test('legacy character customization migration', () => {
    // solid + rounded -> smooth
    const legacy1 = normalizeDiceCustomization({ surface: 'solid', edgeStyle: 'rounded' });
    assert.equal(legacy1.theme, 'smooth');

    // solid + classic -> default
    const legacy2 = normalizeDiceCustomization({ surface: 'solid', edgeStyle: 'classic' });
    assert.equal(legacy2.theme, 'default');

    // solid + sharp -> gemstone
    const legacy3 = normalizeDiceCustomization({ surface: 'solid', edgeStyle: 'sharp' });
    assert.equal(legacy3.theme, 'gemstone');

    // marble + any edge -> gemstoneMarble
    const legacy4 = normalizeDiceCustomization({ surface: 'marble', edgeStyle: 'rounded' });
    assert.equal(legacy4.theme, 'gemstoneMarble');

    // unconfigured -> default
    const legacy5 = normalizeDiceCustomization(undefined);
    assert.equal(legacy5.theme, 'default');
    assert.equal(legacy5.enableShadows, true);
    assert.equal(legacy5.shadowTransparency, 0.8);
    assert.equal(legacy5.lightIntensity, 1);
    assert.equal(legacy5.scale, 5);
  });

  test('rust default color behavior', () => {
    // Rust with no saved color defaults to #aa4f4a
    const rust1 = normalizeDiceCustomization({ theme: 'rust' });
    assert.equal(rust1.color, '#aa4f4a');

    // Rust with explicit user color preserves existing color
    const rust2 = normalizeDiceCustomization({ theme: 'rust', color: '#2563eb' });
    assert.equal(rust2.color, '#2563eb');
  });

  test('extension theme parent resolution', () => {
    const ext1 = resolveDiceTheme('default-extras');
    assert.equal(ext1.runtimeTheme, 'default');
    assert.deepEqual(ext1.preloadThemes, ['default-extras', 'default']);

    const ext2 = resolveDiceTheme('diceOfRolling-fate');
    assert.equal(ext2.runtimeTheme, 'diceOfRolling');
    assert.deepEqual(ext2.preloadThemes, ['diceOfRolling-fate', 'diceOfRolling']);

    const ext3 = resolveDiceTheme('smooth-pip');
    assert.equal(ext3.runtimeTheme, 'smooth');
    assert.deepEqual(ext3.preloadThemes, ['smooth-pip', 'smooth']);
  });

  test('unknown theme fallback', () => {
    const unknown = normalizeDiceCustomization({ theme: 'nonexistent-theme' as any });
    assert.equal(unknown.theme, 'default');
  });
});
