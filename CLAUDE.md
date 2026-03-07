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

## Development Commands
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Start (prod):** `npm start`

## Code Conventions
- ESLint (eslint-config-next). Follow existing patterns; prefer Server Components; use `'use client'` only when needed.

## Shipping / PR
<!-- Added 2025-03-06: agent env has no GitHub credentials -->
- `git push` and `gh pr create` run in an environment without GitHub auth; push and PR creation must be done by the user in their local terminal when using /ship.

## AI Team Configuration
Agent-to-task mappings and usage: see **`.claude/CLAUDE.md`** (configured by setup-agents).
