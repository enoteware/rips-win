# Rips.win Documentation

This folder contains all project documentation and database schema files.

## Files

- **`rips-win-schema.sql`** - Complete PostgreSQL schema for Neon database
- **`SECRETS.md`** - Neon and env secrets: what to set and where (DATABASE_URL, etc.)
- **`RIPS-WIN-PROJECT.md`** - Full project specifications and requirements
- **`rips-win-api-routes.md`** - API endpoints reference and database queries
- **`RIPS-WIN-HANDOFF.md`** - Developer handoff documentation (comprehensive)
- **`RIPS-WIN-SUMMARY.txt`** - Quick status summary
- **`stitch/`** - Stitch design assets (screen images and HTML). See `stitch/README.md` for how to re-download via `npm run stitch:download`.

## Quick Links

- **Database:** Neon PostgreSQL (long-wind-27935167)
- **GitHub:** https://github.com/enoteware/rips-win
- **Vercel:** https://vercel.com/noteware/rips-win

## Getting Started

1. Read `RIPS-WIN-HANDOFF.md` for complete setup status
2. Check `RIPS-WIN-SUMMARY.txt` for quick overview
3. Review `rips-win-api-routes.md` for API details
4. Set `DATABASE_URL` from Neon (auth source): in `.env.local` for dev; use Vercel Neon integration for prod so it’s set automatically.
5. Run database schema: `psql $DATABASE_URL -f docs/rips-win-schema.sql`

## Client Contact

- **Savannah:** savmediayt@gmail.com (primary)
- **Alex:** apstudios@gmail.com (via Savannah)
