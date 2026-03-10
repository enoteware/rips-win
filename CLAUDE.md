# Project: rips-win

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 3, shadcn/ui theme (tweakcn)
- NextAuth, Neon (serverless Postgres), Zod

## Database
- Remote Postgres only (Neon). Neon is the auth source: `DATABASE_URL` from Neon dashboard (dev) or Vercel Neon integration (prod).

## Project Structure
- `app/` — App Router: layout, page, globals.css, API routes (e.g. `api/leaderboard`)
- `components/` — UI components (shadcn)
- `lib/` — utils, auth, db helpers
- `scripts/` — build/utility scripts
- `tailwind.config.ts`, `components.json` — Tailwind + shadcn config

## Remote / SSH (Cursor on mini)
Cursor is often connected via SSH to the mini where the repo lives. Commands run on the mini; the dev server listens there. To use it from your local machine: forward port 3000 when connecting (e.g. `ssh -L 3000:localhost:3000 user@mini`) and open http://localhost:3000 locally, or use the mini’s hostname/IP if it’s on the same network.

## Development Commands
- **Dev server:** `npm run dev` (use `npm run dev -- --webpack` if Turbopack hits permission errors on the mini)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Start (prod):** `npm start`

## Code Conventions
- ESLint (eslint-config-next). Follow existing patterns; prefer Server Components; use `'use client'` only when needed.

## Shipping / PR
<!-- Added 2025-03-06: agent env has no GitHub credentials -->
- `git push` and `gh pr create` run in an environment without GitHub auth; push and PR creation must be done by the user in their local terminal when using /ship.

## Admin UI testing (agents)
When testing admin (login, leaderboard, site settings) in the browser: use credentials from `.env.local` — read `ADMIN_EMAIL` and `ADMIN_PASSWORD` and sign in at `/admin/login`. See `docs/ADMIN-CRUD-TEST.md` for the checklist.

## E2E (Playwright)
- `npm run test:e2e` — all e2e tests (starts dev server if needed).
- `npm run test:e2e:admin` — admin leaderboard CRUD only. With server on 3002: `PLAYWRIGHT_BASE_URL=http://localhost:3002 npm run test:e2e:admin`. Requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` for authenticated tests.

## AI Team Configuration
Agent-to-task mappings and usage: see **`.claude/CLAUDE.md`** (configured by setup-agents).



## Affiliate Links
<!-- Updated 2026-03-10: all outbound links must carry affiliate tracking -->
- Every external/outbound link on the public site MUST use Stake affiliate tracking URLs.
- **Stake.us:** `https://stake.us/?offer=rips&c=selling`
- **Stake.com:** `https://stake.com/?offer=rips&c=selling`
- No `href="#"` placeholders — use the appropriate Stake URL instead.
- External links open in a new tab (`target="_blank" rel="noopener noreferrer"`).

## Client/Server Code Separation
<!-- Added 2026-03-10: caused DATABASE_URL runtime error in browser -->
- Never import from `lib/` files that initialize `neon()` (or any server-only code) in client components.
- If a client component needs a utility from a `lib/` file that also has DB code, extract the utility into a separate client-safe module (e.g. `lib/youtube.ts`).