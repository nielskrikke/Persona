import { cp, mkdir, rm, rename, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const sources = {
  ammo: resolve(root, 'node_modules/@3d-dice/dice-box/dist/assets/ammo'),
  defaultTheme: resolve(root, 'node_modules/@3d-dice/dice-box/dist/assets/themes/default'),
  gemstoneTheme: resolve(root, 'node_modules/@3d-dice/theme-gemstone'),
  gemstoneMarbleTheme: resolve(root, 'node_modules/@3d-dice/theme-gemstone-marble'),
  smoothTheme: resolve(root, 'node_modules/@3d-dice/theme-smooth'),
};

// Validate source paths
for (const [name, path] of Object.entries(sources)) {
  try {
    await stat(path);
  } catch (err) {
    console.error(`ERROR: Required dice asset source "${name}" is missing at ${path}`);
    process.exit(1);
  }
}

const target = resolve(root, 'public/assets/dice-box');
const tempTarget = resolve(root, 'public/assets/dice-box_tmp');

await rm(tempTarget, { recursive: true, force: true });
await mkdir(resolve(tempTarget, 'themes'), { recursive: true });

await cp(sources.ammo, resolve(tempTarget, 'ammo'), { recursive: true });
await cp(sources.defaultTheme, resolve(tempTarget, 'themes/default'), { recursive: true });
await cp(sources.gemstoneTheme, resolve(tempTarget, 'themes/gemstone'), { recursive: true });
await cp(sources.gemstoneMarbleTheme, resolve(tempTarget, 'themes/gemstoneMarble'), { recursive: true });
await cp(sources.smoothTheme, resolve(tempTarget, 'themes/smooth'), { recursive: true });

// Assert expected output files
const expectedFiles = [
  'themes/default/theme.config.json',
  'themes/default/default.json',
  'themes/gemstone/theme.config.json',
  'themes/gemstone/gemstone.json',
  'themes/gemstoneMarble/theme.config.json',
  'themes/gemstoneMarble/gemstone.json',
  'themes/gemstoneMarble/diffuse.jpg',
  'themes/gemstoneMarble/normal.png',
  'themes/gemstoneMarble/roughness.jpg',
  'themes/smooth/theme.config.json',
  'themes/smooth/smoothDice.json'
];

for (const relFile of expectedFiles) {
  const fullPath = resolve(tempTarget, relFile);
  try {
    await stat(fullPath);
  } catch (err) {
    console.error(`ERROR: Expected synced asset file "${relFile}" is missing at ${fullPath}`);
    await rm(tempTarget, { recursive: true, force: true });
    process.exit(1);
  }
}

// Atomically replace target
await rm(target, { recursive: true, force: true });
await rename(tempTarget, target);

console.log('Dice Box assets synced successfully to public/assets/dice-box');
