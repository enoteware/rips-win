import { neon } from '@neondatabase/serverless';

// Neon is the auth source: set DATABASE_URL from Neon dashboard or Vercel Neon integration.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required. Set it from Neon (dashboard or Vercel Neon integration).'
  );
}
const sql = neon(connectionString);

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  rank: number;
  total_wagered: number;
  biggest_win: number;
  current_streak: number;
  avatar_url: string | null;
  platform: 'stake_us' | 'stake_com' | 'both';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  published: boolean;
  month_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardMetadata {
  id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  last_updated: string;
  last_updated_by: string;
  active: boolean;
}

export async function getLeaderboard(
  period: string = 'all_time',
  publishedOnly: boolean = true,
  monthKey?: string
): Promise<LeaderboardEntry[]> {
  if (monthKey) {
    const query = publishedOnly
      ? `SELECT * FROM leaderboard_entries WHERE period = $1 AND published = true AND month_key = $2 ORDER BY rank ASC`
      : `SELECT * FROM leaderboard_entries WHERE period = $1 AND month_key = $2 ORDER BY rank ASC`;
    return await sql(query, [period, monthKey]) as LeaderboardEntry[];
  }

  const query = publishedOnly
    ? `SELECT * FROM leaderboard_entries WHERE period = $1 AND published = true ORDER BY rank ASC`
    : `SELECT * FROM leaderboard_entries WHERE period = $1 ORDER BY rank ASC`;

  return await sql(query, [period]) as LeaderboardEntry[];
}

export async function getAvailableMonths(period: string = 'all_time'): Promise<string[]> {
  const result = await sql(
    `SELECT DISTINCT month_key FROM leaderboard_entries WHERE period = $1 AND published = true AND month_key IS NOT NULL ORDER BY month_key DESC`,
    [period]
  ) as Array<{ month_key: string }>;
  return result.map(r => r.month_key);
}

export async function getMetadata(period: string): Promise<LeaderboardMetadata | null> {
  const result = await sql(
    `SELECT * FROM leaderboard_metadata WHERE period = $1 LIMIT 1`,
    [period]
  ) as LeaderboardMetadata[];

  return result[0] || null;
}

export async function updateMetadata(period: string, updatedBy: string): Promise<LeaderboardMetadata> {
  const result = await sql(
    `UPDATE leaderboard_metadata
     SET last_updated = NOW(), last_updated_by = $1
     WHERE period = $2
     RETURNING *`,
    [updatedBy, period]
  ) as LeaderboardMetadata[];

  return result[0];
}

export async function createEntry(data: {
  player_name: string;
  rank: number;
  total_wagered: number;
  biggest_win: number;
  current_streak: number;
  platform: string;
  period: string;
  avatar_url?: string;
  month_key?: string;
}): Promise<LeaderboardEntry> {
  const result = await sql(
    `INSERT INTO leaderboard_entries
     (player_name, rank, total_wagered, biggest_win, current_streak, platform, period, avatar_url, month_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.player_name,
      data.rank,
      data.total_wagered,
      data.biggest_win,
      data.current_streak,
      data.platform,
      data.period,
      data.avatar_url || null,
      data.month_key || null,
    ]
  ) as LeaderboardEntry[];

  return result[0];
}

export async function updateEntry(
  id: string,
  data: Partial<LeaderboardEntry>
): Promise<LeaderboardEntry> {
  const fields = Object.keys(data).filter(k => k !== 'id');
  const values = fields.map(f => data[f as keyof typeof data]);

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const result = await sql(
    `UPDATE leaderboard_entries
     SET ${setClause}, updated_at = NOW()
     WHERE id = $${fields.length + 1}
     RETURNING *`,
    [...values, id]
  ) as LeaderboardEntry[];

  return result[0];
}

export async function deleteEntry(id: string): Promise<void> {
  await sql(`DELETE FROM leaderboard_entries WHERE id = $1`, [id]);
}

export async function publishPeriod(period: string, updatedBy: string): Promise<void> {
  // Publish all entries for this period
  await sql(
    `UPDATE leaderboard_entries SET published = true WHERE period = $1`,
    [period]
  );

  // Update metadata
  await updateMetadata(period, updatedBy);
}

/** Delete all entries for a period (e.g. before bulk import). */
export async function deleteEntriesByPeriod(period: string): Promise<void> {
  await sql(`DELETE FROM leaderboard_entries WHERE period = $1`, [period]);
}

/** Bulk insert entries for a period. Caller may delete existing first via deleteEntriesByPeriod. */
export async function createEntries(
  period: string,
  entries: Array<{
    player_name: string;
    rank: number;
    total_wagered: number;
    biggest_win: number;
    current_streak: number;
    platform: string;
    avatar_url?: string | null;
  }>,
  published: boolean = false
): Promise<number> {
  let inserted = 0;
  for (const e of entries) {
    await sql(
      `INSERT INTO leaderboard_entries
       (player_name, rank, total_wagered, biggest_win, current_streak, platform, period, avatar_url, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        e.player_name,
        e.rank,
        e.total_wagered,
        e.biggest_win,
        e.current_streak,
        e.platform,
        period,
        e.avatar_url ?? null,
        published,
      ]
    );
    inserted += 1;
  }
  return inserted;
}
