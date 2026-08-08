import { cp, mkdir, rm, rename, stat, readFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const sources = {
  ammo: resolve(root, 'node_modules/@3d-dice/dice-box/dist/assets/ammo'),
  themes: {
    'default': resolve(root, 'node_modules/@3d-dice/dice-box/dist/assets/themes/default'),
    'default-extras': resolve(root, 'node_modules/@3d-dice/theme-default-extras'),
    'blueGreenMetal': resolve(root, 'node_modules/@3d-dice/theme-blue-green-metal'),
    'diceOfRolling': resolve(root, 'node_modules/@3d-dice/theme-dice-of-rolling'),
    'diceOfRolling-fate': resolve(root, 'node_modules/@3d-dice/theme-dice-of-rolling-fate'),
    'gemstone': resolve(root, 'node_modules/@3d-dice/theme-gemstone'),
    'gemstoneMarble': resolve(root, 'node_modules/@3d-dice/theme-gemstone-marble'),
    'genesys': resolve(root, 'node_modules/@3d-dice/theme-genesys'),
    'rock': resolve(root, 'node_modules/@3d-dice/theme-rock'),
    'rust': resolve(root, 'node_modules/@3d-dice/theme-rust'),
    'smooth': resolve(root, 'node_modules/@3d-dice/theme-smooth'),
    'smooth-pip': resolve(root, 'node_modules/@3d-dice/theme-smooth-pip'),
    'wooden': resolve(root, 'node_modules/@3d-dice/theme-wooden'),
  }
};

// Validate source existence
try {
  await stat(sources.ammo);
} catch {
  console.error(`ERROR: Ammo asset source is missing at ${sources.ammo}`);
  process.exit(1);
}

for (const [themeName, themePath] of Object.entries(sources.themes)) {
  try {
    await stat(themePath);
  } catch {
    console.error(`ERROR: Theme asset source "${themeName}" is missing at ${themePath}`);
    process.exit(1);
  }
}

const target = resolve(root, 'public/assets/dice-box');
const tempTarget = resolve(root, 'public/assets/dice-box_tmp');

await rm(tempTarget, { recursive: true, force: true });
await mkdir(resolve(tempTarget, 'themes'), { recursive: true });

// Copy Ammo assets
await cp(sources.ammo, resolve(tempTarget, 'ammo'), { recursive: true });

// Copy all 13 theme assets
for (const [systemName, srcPath] of Object.entries(sources.themes)) {
  const destDir = resolve(tempTarget, 'themes', systemName);
  await cp(srcPath, destDir, { recursive: true });
}

// Function to collect file references from theme.config.json recursively
function collectReferencedFiles(obj, files = new Set()) {
  if (!obj || typeof obj !== 'object') return files;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      collectReferencedFiles(item, files);
    }
    return files;
  }

  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      // Check for known file keys or texture/json file extensions
      const isFileKey = [
        'meshFile', 'diffuseTexture', 'bumpTexture', 'normalTexture',
        'specularTexture', 'roughnessTexture', 'materialMap', 'texture'
      ].includes(key);
      const hasExtension = /\.(json|jpg|jpeg|png|webp|glb|gltf|wasm)$/i.test(val);

      if (isFileKey || hasExtension) {
        files.add(val);
      }
    } else if (typeof val === 'object') {
      collectReferencedFiles(val, files);
    }
  }

  return files;
}

// Comprehensive asset validation
for (const systemName of Object.keys(sources.themes)) {
  const themeDir = resolve(tempTarget, 'themes', systemName);
  const configFile = resolve(themeDir, 'theme.config.json');

  try {
    await stat(configFile);
  } catch {
    console.error(`ERROR: Required config file missing for theme "${systemName}": ${configFile}`);
    await rm(tempTarget, { recursive: true, force: true });
    process.exit(1);
  }

  let configJson;
  try {
    const raw = await readFile(configFile, 'utf-8');
    configJson = JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR: Failed to parse theme.config.json for theme "${systemName}": ${err.message}`);
    await rm(tempTarget, { recursive: true, force: true });
    process.exit(1);
  }

  const referencedFiles = collectReferencedFiles(configJson);

  for (const relPath of referencedFiles) {
    // Strip leading ./ if present
    const cleanRelPath = relPath.replace(/^\.\//, '');
    const fullPath = resolve(themeDir, cleanRelPath);

    try {
      await stat(fullPath);
    } catch {
      console.error(`ERROR: Theme "${systemName}" references missing asset file "${relPath}" expected at ${fullPath}`);
      await rm(tempTarget, { recursive: true, force: true });
      process.exit(1);
    }
  }
}

// Atomically replace target directory
await rm(target, { recursive: true, force: true });
await rename(tempTarget, target);

console.log('Successfully validated and synced all 13 official Dice Box theme asset bundles to public/assets/dice-box');
