# Leaderboard data map

Reference for `leaderboard_entries` columns. Data is populated via admin/API or manual entry.

## Schema → source

| Column | Source | Notes |
|--------|--------|------|
| **id** | DB `gen_random_uuid()` | Not from import. |
| **player_name** | Admin/API input | Required. |
| **rank** | Admin/API input | Integer, 1-based. |
| **total_wagered** | Admin/API input | Decimal; display as $ or — when 0. |
| **biggest_win** | Admin/API input | Decimal; display as $ or — when 0. |
| **current_streak** | Admin/API input | Integer; display as — when 0. |
| **avatar_url** | Admin/API input | Optional image URL. |
| **platform** | Admin/API input | `stake_us` \| `stake_com` \| `both`. |
| **period** | Admin/API input | `daily` \| `weekly` \| `monthly` \| `all_time`. |
| **published** | Admin/API | Boolean; controls visibility on public leaderboard. |
| **created_at** | DB `DEFAULT NOW()` | Not from import. |
| **updated_at** | DB `DEFAULT NOW()` | Not from import. |

## Where it's applied

- **DB** (`lib/db.ts`): `createEntry`, `createEntries`, `updateEntry`, etc. insert/update the columns above.
- **Public API** (`app/api/leaderboard`): Returns published entries for a period.
- **UI** (`app/page.tsx`): Displays leaderboard; formats money and streak (0 → —).
