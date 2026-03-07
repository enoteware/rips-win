# Rips.win API Routes

## Admin API (Protected)

### GET /api/admin/leaderboard
List all entries (unpublished + published)
Query params: `?period=daily|weekly|monthly|all_time`

### POST /api/admin/leaderboard
Create new entry
Body: `{ player_name, total_wagered, biggest_win, current_streak, platform, period }`

### PATCH /api/admin/leaderboard/[id]
Update entry
Body: `{ player_name?, rank?, total_wagered?, biggest_win?, current_streak?, published? }`

### DELETE /api/admin/leaderboard/[id]
Delete entry

### POST /api/admin/leaderboard/publish
Publish all entries for a period
Body: `{ period, last_updated_by }`
Updates metadata timestamp

### POST /api/admin/leaderboard/reorder
Bulk rank update (drag-and-drop)
Body: `{ entries: [{ id, rank }, ...] }`

### POST /api/admin/leaderboard/import
CSV bulk import
Body: FormData with `file` field

### GET /api/admin/metadata
Get last updated info for all periods

## Public API

### GET /api/leaderboard
Get published entries
Query params: `?period=daily|weekly|monthly|all_time` (default: all_time)

### GET /api/metadata
Get last updated timestamp for current period

## Database Queries

### Get Published Leaderboard
```sql
SELECT * FROM leaderboard_entries
WHERE period = $1 AND published = true
ORDER BY rank ASC;
```

### Update Last Updated
```sql
UPDATE leaderboard_metadata
SET last_updated = NOW(), last_updated_by = $1
WHERE period = $2
RETURNING *;
```

### Reorder Ranks
```sql
UPDATE leaderboard_entries
SET rank = $1, updated_at = NOW()
WHERE id = $2;
```

## Neon Connection (Server-Side)

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getLeaderboard(period: string, publishedOnly = true) {
  const query = publishedOnly
    ? `SELECT * FROM leaderboard_entries WHERE period = $1 AND published = true ORDER BY rank ASC`
    : `SELECT * FROM leaderboard_entries WHERE period = $1 ORDER BY rank ASC`;
  
  return await sql(query, [period]);
}

export async function updateMetadata(period: string, updatedBy: string) {
  return await sql(
    `UPDATE leaderboard_metadata 
     SET last_updated = NOW(), last_updated_by = $1 
     WHERE period = $2 
     RETURNING *`,
    [updatedBy, period]
  );
}

export async function createEntry(data: {
  player_name: string;
  rank: number;
  total_wagered: number;
  biggest_win: number;
  current_streak: number;
  platform: string;
  period: string;
}) {
  return await sql(
    `INSERT INTO leaderboard_entries 
     (player_name, rank, total_wagered, biggest_win, current_streak, platform, period) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [
      data.player_name,
      data.rank,
      data.total_wagered,
      data.biggest_win,
      data.current_streak,
      data.platform,
      data.period,
    ]
  );
}

export async function updateEntry(id: string, data: Partial<typeof createEntry>) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  
  return await sql(
    `UPDATE leaderboard_entries SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
}

export async function deleteEntry(id: string) {
  return await sql(`DELETE FROM leaderboard_entries WHERE id = $1`, [id]);
}
```

## Rate Limiting

For public API, use Vercel Edge Config or Upstash Redis:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

## Webhook (Optional)

For real-time updates, add webhook to notify frontend:

```typescript
// POST /api/admin/leaderboard/publish
// After updating metadata, trigger revalidation:
await fetch('/api/revalidate?path=/');
```
