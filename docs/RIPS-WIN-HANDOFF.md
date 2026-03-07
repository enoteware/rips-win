# Rips.win Project - Handoff Documentation

**Date:** 2026-03-06  
**Status:** Base setup complete, deployment in progress  
**Handoff to:** Next developer

---

## Project Overview

Casino leaderboard for Alex's gambling streams (Stake.us & Stake.com).  
Clone/inspired by cabrzy.com design with admin panel for manual updates.

**Client Contact:**
- Savannah: savmediayt@gmail.com (primary)
- Alex: apstudios@gmail.com (via Savannah)

---

## ✅ Completed Setup

### 1. Neon Database (FULLY WORKING)
- **Project:** `rips-win` (ID: long-wind-27935167)
- **Region:** aws-us-west-2
- **Connection:** Set `DATABASE_URL` from Neon dashboard (Connection string) or Vercel Neon integration. See **docs/SECRETS.md** for where to get and set it.
- **Schema Applied:** ✅
  - `leaderboard_entries` table (player data)
  - `leaderboard_metadata` table (last updated timestamps)
  - Indexes, triggers, and constraints in place
- **Test Data Loaded:** ✅
  - 3 sample players: RipsKing (#1), StakeLegend (#2), CasinoWhale (#3)
- **Schema File:** `~/eBot/agents/propfirms/rips-win-schema.sql`

### 2. GitHub Repository
- **URL:** https://github.com/enoteware/rips-win
- **Branch:** main
- **Status:** All code pushed
- **Latest Commit:** Next.js 16.1.6 update (security fix)

### 3. Next.js Application
- **Framework:** Next.js 16.1.6 (Turbopack)
- **Language:** TypeScript
- **Database:** @neondatabase/serverless
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js (configured but not implemented yet)

**Working Features:**
- ✅ Database connection (`lib/db.ts`)
- ✅ Public API route (`/api/leaderboard`)
- ✅ Homepage with leaderboard display (`app/page.tsx`)
- ✅ Dark theme (purple/pink gradient)
- ✅ Referral links (Stake.us & Stake.com)
- ✅ Welcome code display (RIPS)
- ✅ 3.5% rakeback shown
- ✅ Last updated timestamp

**Local Build Status:** ✅ Working perfectly

### 4. Vercel Deployment
- **Project:** https://vercel.com/noteware/rips-win
- **Status:** ⚠️ In progress (build errors being resolved)
- **Issue:** Next.js security vulnerability (CVE-2025-66478)
- **Fix Applied:** Updated to Next.js 16.1.6
- **Env Vars Configured:** ✅
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

**Dev (live Neon):** http://10.112.1.56:3000/ — backed by live Neon; leaderboard data is real.

**Latest Deployments (all failed):**
- https://rips-dao70vujc-noteware.vercel.app (Error)
- https://rips-53dh6fina-noteware.vercel.app (Error)

**Note:** Local build works perfectly. Vercel errors likely related to:
1. Initial Next.js version vulnerability
2. Environment variable timing
3. Possible node_modules issue

---

## 📁 Project Files

### Local Repository
```
~/code/rips-win/
├── app/
│   ├── page.tsx           # Homepage (leaderboard display)
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Tailwind styles
│   └── api/
│       └── leaderboard/
│           └── route.ts   # Public API endpoint
├── lib/
│   └── db.ts             # Neon database functions
├── package.json          # Dependencies (Next 16, Neon, NextAuth, etc.)
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── next.config.ts        # Next.js config
└── .env.local           # Local env vars (not committed)
```

### Documentation Files
```
~/eBot/agents/propfirms/
├── rips-win-schema.sql      # Complete database schema
├── RIPS-WIN-PROJECT.md      # Full project documentation
├── rips-win-api-routes.md   # API reference & queries
└── RIPS-WIN-HANDOFF.md      # This file
```

---

## 🔑 Credentials & Access

### Neon (database auth)
- **Secret:** `DATABASE_URL` (Postgres connection string from Neon).
- **Where to get:** Neon dashboard → project → Connection string; or Vercel Neon integration (auto-injected for prod/preview).
- **Where to set:** `.env.local` (dev), Vercel env or Neon integration (prod). Optionally `~/.secrets/neon.env` or 1Password if you use that. See **docs/SECRETS.md**.

### Database
- **Access:** Via `psql` or Neon dashboard.
- **Test query:** `psql "$DATABASE_URL" -c "SELECT * FROM leaderboard_entries;"`

### Vercel
- **Dashboard:** https://vercel.com/noteware/rips-win
- **CLI Access:** `vercel` command (already authenticated)
- **Org:** noteware

---

## 🚧 Next Steps (Priority Order)

### Immediate (Fix Deployment)
1. **Debug Vercel build errors**
   - Check build logs: `vercel logs <deployment-url>`
   - Verify env vars are set: `vercel env ls`
   - Ensure Next.js 16 compatibility with Vercel
   - Try manual deploy: `cd ~/code/rips-win && vercel --prod`

2. **Test live deployment**
   - Once deployed, verify leaderboard displays
   - Test API endpoint: `/api/leaderboard?period=all_time`
   - Confirm database connection works in production

### Short-Term (Admin Panel)
3. **Build admin authentication**
   - NextAuth.js configuration
   - Protected `/admin` routes
   - Simple email/password login (Savannah)

4. **Create admin CRUD interface**
   - Add player (name, stats, platform, period)
   - Edit player (all fields)
   - Delete player
   - Drag-and-drop rank reordering
   - Publish/unpublish toggle

5. **Implement publish workflow**
   - "Publish" button updates `published = true`
   - Auto-update `leaderboard_metadata.last_updated`
   - Show confirmation before publishing
   - Preview mode (see unpublished entries)

### Medium-Term (Features)
6. **CSV Import**
   - Upload CSV file
   - Parse and validate
   - Bulk insert entries
   - Example format in docs

7. **Period Management**
   - Daily reset (00:00 UTC)
   - Weekly reset (Monday 00:00 UTC)
   - Monthly reset (1st of month)
   - Manual reset button per period

8. **Custom Domain**
   - Point rips.win to Vercel
   - Configure DNS
   - SSL certificate (automatic via Vercel)

---

## 📝 Design Reference

**Primary Inspiration:** https://cabrzy.com/home

**Key Features to Match:**
- Dark theme with vibrant accents
- Bold typography
- Leaderboard table format
- Referral code prominence
- Clean, modern UI

**Current Implementation:**
- Dark gradient background (slate-900 → purple-900)
- Purple/pink accent colors
- Responsive table layout
- Mobile-friendly design

---

## 🐛 Known Issues

1. **Vercel Deployment Failing**
   - Multiple build errors
   - Next.js security warning resolved
   - Needs fresh deployment attempt

2. **Admin Panel Not Built Yet**
   - No authentication
   - No CRUD interface
   - No publish workflow

3. **No Period Auto-Reset**
   - Manual only (not implemented)
   - Needs cron job or scheduled function

---

## 🔍 Testing Checklist

### Database
- [x] Connection works
- [x] Schema applied
- [x] Test data loaded
- [x] Queries return results
- [ ] Production connection tested

### Application
- [x] Local build succeeds
- [x] Homepage displays leaderboard
- [x] API route works
- [x] Styling looks good
- [ ] Production deployment works
- [ ] Database connects in production

### Admin Panel (Not Started)
- [ ] Authentication works
- [ ] Can add entries
- [ ] Can edit entries
- [ ] Can delete entries
- [ ] Can reorder ranks
- [ ] Can publish updates
- [ ] Last updated timestamp updates

---

## 💡 Technical Notes

### Database Functions (lib/db.ts)
```typescript
getLeaderboard(period, publishedOnly) // Get entries
getMetadata(period)                   // Get last updated
updateMetadata(period, updatedBy)    // Update timestamp
createEntry(data)                     // Insert player
updateEntry(id, data)                 // Update player
deleteEntry(id)                       // Delete player
publishPeriod(period, updatedBy)     // Publish all entries
```

### API Routes
- `GET /api/leaderboard?period=all_time` - Public leaderboard
- (Admin routes not built yet)

### Environment Variables Required
See **docs/SECRETS.md** and **.env.example**. Required:
- **DATABASE_URL** — Neon connection string (from Neon dashboard or Vercel Neon integration).
- NEXTAUTH_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD (if using auth).
- NEXT_PUBLIC_STAKE_US_LINK, NEXT_PUBLIC_STAKE_COM_LINK, NEXT_PUBLIC_WELCOME_CODE, NEXT_PUBLIC_RAKEBACK.

---

## 📞 Questions for Client

Before proceeding with admin panel:

1. **Leaderboard Categories:**
   - Single combined board or separate for wagered/wins/streak?

2. **Platform Separation:**
   - One unified board or separate for Stake.us vs Stake.com?

3. **Player Data:**
   - Include avatars/profile pages?
   - Additional stats needed?

4. **Admin Access:**
   - Just Savannah or multiple admins?

5. **Update Frequency:**
   - Daily? Weekly? Manual only?

---

## 🛠️ Quick Commands

### Database
Set `DATABASE_URL` from Neon (see docs/SECRETS.md), then:
```bash
# Test connection
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM leaderboard_entries;"

# View entries
psql "$DATABASE_URL" -c "SELECT * FROM leaderboard_entries ORDER BY rank;"

# Check metadata
psql "$DATABASE_URL" -c "SELECT * FROM leaderboard_metadata;"
```

### Development
```bash
cd ~/code/rips-win

# Install dependencies
npm install

# Run dev server
npm run dev  # http://localhost:3000

# Build for production
npm run build
```

### Deployment
```bash
# Check status
vercel ls rips-win

# Deploy to production
vercel --prod

# Check logs
vercel logs <deployment-url>

# List env vars
vercel env ls
```

### Git
```bash
cd ~/code/rips-win

# Status
git status

# Push changes
git add .
git commit -m "Your message"
git push origin main  # Auto-deploys to Vercel
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "bcryptjs": "^2.4.3",
    "next": "16.1.6",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8",
    "eslint-config-next": "15.1.4",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## ✅ Handoff Checklist

- [x] Neon database created and working
- [x] Schema applied with test data
- [x] GitHub repo created and code pushed
- [x] Next.js app built and tested locally
- [x] Vercel project created
- [x] Environment variables configured
- [x] Documentation written
- [ ] Vercel deployment successful (in progress)
- [ ] Admin panel built
- [ ] Live site tested with client

---

## 🎯 Success Criteria

**Minimum Viable Product (MVP):**
1. Public leaderboard page displays correctly
2. Shows test data from database
3. Referral links work
4. Admin can manually update via database

**Full Feature Set:**
1. Admin panel with CRUD operations
2. Publish workflow with timestamp
3. CSV import
4. Period management (daily/weekly/monthly/all-time)
5. Custom domain (rips.win)

---

## 📧 Contact Info

**For questions about:**
- Database: Check `rips-win-schema.sql` and Neon docs
- API: See `rips-win-api-routes.md`
- Deployment: Vercel dashboard or CLI
- Client requests: Savannah (savmediayt@gmail.com)

**Resources:**
- Project docs: `~/eBot/agents/propfirms/RIPS-WIN-PROJECT.md`
- API reference: `~/eBot/agents/propfirms/rips-win-api-routes.md`
- This handoff: `~/eBot/agents/propfirms/RIPS-WIN-HANDOFF.md`

---

**Last Updated:** 2026-03-06 15:40 PST  
**Created By:** eBot (PropFirms agent)  
**Handoff Status:** Ready for next developer
