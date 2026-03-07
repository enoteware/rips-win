# Rips.win Casino Leaderboard

## Project Overview
Casino leaderboard for Alex's gambling streams, cloned from cabrzy.com design.

**Live Site:** https://rips.win
**Client:** Alex (PropFirms group contact)

## Features
- Manual leaderboard updates via admin panel
- Auto "Last Updated" timestamp
- Dual platform support (Stake.us & Stake.com)
- Real-time leaderboard display
- Responsive design (dark theme)

## Tech Stack
- **Framework:** Next.js 15
- **Database:** Neon (PostgreSQL)
- **Auth:** NextAuth.js (admin only)
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

## Database Schema
See `rips-win-schema.sql` for complete schema.

### Tables
- `leaderboard_entries` - Player data (name, rank, stats, platform, period)
- `leaderboard_metadata` - Last updated timestamps per period

### Periods
- Daily (resets 00:00 UTC)
- Weekly (resets Monday 00:00 UTC)
- Monthly (resets 1st of month)
- All-time (never resets)

## Referral Links
- **Stake.us:** https://stake.us/?offer=rips&c=selling
- **Stake.com:** https://stake.com/?offer=rips&c=selling
- **Welcome Code:** rips
- **Rakeback:** 3.5%

## Admin Panel Routes
- `/admin` - Login
- `/admin/leaderboard` - Manage entries
- `/admin/settings` - Period management

## Public Routes
- `/` - Current leaderboard (all-time default)
- `/daily` - Daily leaderboard
- `/weekly` - Weekly leaderboard
- `/monthly` - Monthly leaderboard

## Development Setup

### 1. Create Neon Database
```bash
# Create project via Neon dashboard or CLI
neon projects create --name rips-win

# Get connection string
neon connection-string --project-id <project-id>

# Apply schema
psql <connection-string> -f rips-win-schema.sql
```

### 2. Environment Variables
```env
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
ADMIN_EMAIL="savmediayt@gmail.com"
ADMIN_PASSWORD_HASH="<bcrypt-hash>"
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## Admin Panel Features

### Leaderboard Management
- ✅ Add player (name, stats, platform, period)
- ✅ Edit player (all fields)
- ✅ Delete player
- ✅ Reorder ranks (drag-and-drop)
- ✅ Bulk CSV import
- ✅ Publish/unpublish toggle
- ✅ Preview before publish
- ✅ Auto-timestamp on publish

### CSV Import Format
```csv
player_name,total_wagered,biggest_win,current_streak,platform,period
RipsKing,125000.00,15000.00,12,both,all_time
StakeLegend,98000.00,12500.00,8,stake_com,all_time
```

## Design References
- **Primary:** https://cabrzy.com/home
- **Promo Graphics:** Dark theme, bold typography
- **RIPS Logo:** Provided by client

## Next Steps
1. Set up Neon database
2. Initialize Next.js project
3. Build admin authentication
4. Create admin CRUD interface
5. Build public leaderboard page
6. Deploy to Vercel
7. Connect custom domain (rips.win)

## Questions for Client
1. Should there be player profile pages?
2. Separate leaderboards for .us vs .com or combined?
3. Any additional stats to track (win rate, sessions, etc.)?
4. Notification preferences when leaderboard updates?
5. Historical data retention (archive old periods)?

## Contact
- **Savannah:** savmediayt@gmail.com
- **Alex:** apstudios@gmail.com (via Savannah)
