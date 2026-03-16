/**
 * Seed leaderboard entries for a previous month.
 *
 * Usage:
 *   npx tsx scripts/seed-previous-month.ts 2026-02
 *
 * This generates sample data for the given month_key.
 * For real data, modify the `sampleEntries` array or accept a JSON file path as a second arg.
 */

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = neon(connectionString);

const monthKey = process.argv[2];
if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
  console.error('Usage: npx tsx scripts/seed-previous-month.ts YYYY-MM [data.json]');
  console.error('Example: npx tsx scripts/seed-previous-month.ts 2026-02');
  process.exit(1);
}

const jsonPath = process.argv[3];

interface EntryInput {
  player_name: string;
  rank: number;
  total_wagered: number;
  biggest_win: number;
  current_streak: number;
  platform: string;
}

async function main() {
  let entries: EntryInput[];

  if (jsonPath && fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    entries = JSON.parse(raw) as EntryInput[];
    console.log(`Loaded ${entries.length} entries from ${jsonPath}`);
  } else {
    // Sample data for testing
    const names = [
      'CryptoKing', 'LuckyDraw', 'HighRoller', 'SlotMaster', 'BigBetBob',
      'AceHigh', 'DiamondDan', 'GoldenGoose', 'JackpotJoe', 'RoyalFlush',
      'WildCard', 'PokerFace', 'SpinWinner', 'BetMax', 'CashOut',
    ];
    entries = names.map((name, i) => ({
      player_name: name,
      rank: i + 1,
      total_wagered: Math.round((150000 - i * 8000) * (0.8 + Math.random() * 0.4)),
      biggest_win: Math.round((20000 - i * 1000) * (0.5 + Math.random() * 0.5)),
      current_streak: Math.max(0, 15 - i * 2 + Math.floor(Math.random() * 5)),
      platform: i % 3 === 0 ? 'stake_us' : i % 3 === 1 ? 'stake_com' : 'both',
    }));
    console.log(`Generated ${entries.length} sample entries for ${monthKey}`);
  }

  let inserted = 0;
  for (const e of entries) {
    await sql(
      `INSERT INTO leaderboard_entries
       (player_name, rank, total_wagered, biggest_win, current_streak, platform, period, published, month_key)
       VALUES ($1, $2, $3, $4, $5, $6, 'all_time', true, $7)`,
      [e.player_name, e.rank, e.total_wagered, e.biggest_win, e.current_streak, e.platform, monthKey]
    );
    inserted++;
  }

  console.log(`Inserted ${inserted} entries for month_key=${monthKey}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
