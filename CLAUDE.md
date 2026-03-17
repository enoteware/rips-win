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

## Public Content Gotchas
<!-- Added 2026-03-11 after homepage/footer/clips updates -->
- Homepage bonuses should reuse the shared public bonuses cards/component and the same published bonus set as `/bonuses`; do not reintroduce separate homepage-only bonus card markup unless explicitly requested.
- Public clips can mix YouTube Shorts and standard videos. Preserve portrait `9:16` for `/shorts/` URLs and landscape `16:9` for standard videos while keeping consistent card heights in the carousel.
- Market routing is soft guidance only: detect US vs international for Stake link defaults, allow manual override, and do not treat region detection as access control or geo-blocking.

## Client Update Export Gotchas
<!-- Added 2026-03-11 after ScreenshotOne-based client export workflow -->
- For client-facing recap exports, prefer a single sendable HTML file under `docs/client-updates/YYYY-MM-DD/` named like `rips-win-client-update-YYYY-MM-DD.html`.
- Final sendable HTML should default to ScreenshotOne CDN `cache_url` images unless the user explicitly asks for an embedded-image variant.
- Final outbound links in the sendable HTML should point to production unless the user explicitly asks for preview/dev links.
- If ScreenshotOne selector captures are unreliable on the live site, a reliable fallback is to POST raw HTML containing base64-embedded local screenshots to ScreenshotOne and then use the returned CDN `cache_url` values in the export.
- When POSTing to ScreenshotOne, send JSON with correct types and use `wait_until` as an array (for example `['load']`).
- Telegram may open the HTML file but fail to reliably open remote screenshot URLs from inside that local attachment; if that delivery path matters, create a separate embedded-image fallback file instead of replacing the main CDN export.
- Never expose or commit `SS_ONE_API` or `SS_ONE_API_SECRET`.
- ScreenshotOne **cannot reach localhost** — use Playwright for local dev server screenshots and ScreenshotOne only for public URLs.
- ScreenshotOne keys live in `.env.local` as `SS_ONE_API` and `SS_ONE_API_SECRET`.

## Design System

<!-- Added 2026-03-13: Cabrzy-style design refresh -->
- Primary brand color is `#53FC18` (Kick green) — matches logo gradient hue range. Do NOT revert to `#b2fc15`.
- All glow rgba values must match the current primary: `rgba(83, 252, 24, ...)`.
- Background tokens are near-black (`#080808`) — not green-tinted. Do not re-introduce green backgrounds.
- Button base class uses `rounded-xl border-2` (see `components/ui/button.tsx`). Any custom button-like element must match these tokens.
- `BonusesSection` accepts `compactCards` (image-led, hides text body) and `showTextList` (stacked text list below cards). Homepage uses both.
- LIVE NOW nav button is spoofed — links to `kick.com/rips`. Update the href when the actual stream URL is confirmed.
- Hero dead-space is controlled via `pb-[20vh]` on the content wrapper. Adjust there, not via padding/margin on individual elements.
- Topographic ripple animation class is `.topo-ripple` in `globals.css` — 10s ease-in-out loop. Respects `prefers-reduced-motion`.
- Leaderboard prizes are frontend-only (no DB column) — stored in the `PRIZES` constant in `MonolithLeaderboard.tsx`.
- Social CTA buttons in `CommunitySection` use `rounded-full` pill + `›` chevron — they are custom `<a>` tags, NOT the base `Button` component. Do not apply `rounded-xl border-2` to them.
- Stats cards use `bg-transparent border border-border-dark` (no fill). Do not re-add `bg-surface-dark`.
- `SocialMarquee` accepts `platforms?: string[]` — pass `socialLinks.map(l => l.platform.toLowerCase())` to filter marquee to DB-defined platforms only. Hardcoded icons: YouTube, Kick, TikTok, Twitch, X, Snapchat, Discord, Instagram (title-cased, matched case-insensitively).
- Community section marquee is a background layer: `absolute inset-0 overflow-hidden pointer-events-none`, `opacity-20 grayscale`, top/bottom/left/right gradient fades, content overlaid `relative z-10 py-24`.
- Marquee animation speed: 60s (`animate-marquee-left` / `animate-marquee-right` in `globals.css`). Do not revert to 30s.
- Footer is a minimal single bar (no multi-column PLATFORM/SUPPORT/LEGAL): Logo left | `Home · Leaderboard · Bonuses` center | social icons right. See `SiteFooter.tsx`.
- `bg-radial-[ellipse_at_center]` is Tailwind v4 syntax — does NOT work in this project (Tailwind v3). Use stacked gradient divs for vignette effects instead.
- The `zoom` tool in Claude-in-Chrome returns black on dark backgrounds — use full `screenshot` instead for visual review of dark-themed sections.