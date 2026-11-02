import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { supabase as appSupabase } from '../../services/supabase';

const loadEnvFile = () => {
    const envPath = resolve(process.cwd(), '.env.local');
    if (!existsSync(envPath)) return;
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
    }
};

loadEnvFile();

const args = process.argv.slice(2);
const backupArg = args.find(arg => arg.startsWith('--backup='))?.slice('--backup='.length);
const apply = args.includes('--apply');

if (!backupArg) {
    console.error('Usage: npx tsx scripts/content-migration/restore.ts --backup=<backup-dir> [--apply]');
    process.exit(1);
}

const backupDir = resolve(process.cwd(), backupArg);
if (!existsSync(backupDir)) {
    console.error(`Backup directory not found: ${backupDir}`);
    process.exit(1);
}

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : appSupabase;

const manifestPath = resolve(backupDir, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;

const tables = manifest?.tables
    ? Object.keys(manifest.tables)
    : ['custom_classes', 'custom_subclasses', 'custom_races', 'custom_backgrounds', 'custom_feats'];

let total = 0;
let restored = 0;
let failed = 0;

for (const table of tables) {
    const file = resolve(backupDir, `${table}.json`);
    if (!existsSync(file)) continue;
    const rows = JSON.parse(readFileSync(file, 'utf8'));
    total += rows.length;
    console.log(`${table}: ${rows.length} row(s)`);
    if (!apply) continue;

    for (const row of rows) {
        const { error } = await supabase.from(table).update({ data: row.data }).eq('id', row.id);
        if (error) {
            failed += 1;
            console.error(`  ✗ ${table}/${row.name}: ${error.message}`);
        } else {
            restored += 1;
        }
    }
}

if (!apply) {
    console.log(`\nDry-run: ${total} row(s) would be restored from ${backupDir}. Re-run with --apply.`);
} else {
    console.log(`\nRestored: ${restored}/${total}; failed: ${failed}`);
    if (failed > 0) process.exitCode = 1;
}
