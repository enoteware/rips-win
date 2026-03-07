#!/usr/bin/env node
/**
 * Apply site_settings table to Neon. Loads .env.local from project root.
 * Run: node scripts/apply-site-settings.mjs   (or npm run db:apply-site-settings)
 */
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

config({ path: join(root, '.env.local') });
config({ path: join(root, '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL. Set it in .env.local (from Neon dashboard).');
  process.exit(1);
}

const sql = neon(connectionString);

const statements = [
  `CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  welcome_code TEXT,
  rakeback_pct TEXT,
  stake_us_link TEXT,
  stake_com_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
)`,
  `INSERT INTO site_settings (id, welcome_code, rakeback_pct, stake_us_link, stake_com_link)
VALUES (1, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING`,
];

async function main() {
  for (const statement of statements) {
    await sql(statement);
  }
  // Seed from env if present (so first-time setup shows correct copy on homepage)
  const welcome = process.env.NEXT_PUBLIC_WELCOME_CODE ?? null;
  const rakeback = process.env.NEXT_PUBLIC_RAKEBACK ?? null;
  const stakeUs = process.env.NEXT_PUBLIC_STAKE_US_LINK ?? null;
  const stakeCom = process.env.NEXT_PUBLIC_STAKE_COM_LINK ?? null;
  if (welcome || rakeback || stakeUs || stakeCom) {
    await sql(
      `UPDATE site_settings SET
        welcome_code = COALESCE($1, welcome_code),
        rakeback_pct = COALESCE($2, rakeback_pct),
        stake_us_link = COALESCE($3, stake_us_link),
        stake_com_link = COALESCE($4, stake_com_link),
        updated_at = NOW()
       WHERE id = 1`,
      [welcome, rakeback, stakeUs, stakeCom]
    );
    console.log('site_settings table ready (seeded from env).');
  } else {
    console.log('site_settings table ready.');
  }
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
