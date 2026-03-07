# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project.

- `app/`: Pages, layouts, global styles, and API routes (for example `app/api/leaderboard/route.ts`).
- `lib/`: Shared server utilities, including Neon database access (`lib/db.ts`).
- `public/`: Static assets (logos, promo graphics, exported SVGs).
- `docs/`: Product, API, and schema documentation (`docs/rips-win-schema.sql`).
- `scripts/`: Utility scripts such as `scripts/pdf-to-svg.sh`.
- `.github/workflows/ci.yml`: CI checks run on pull requests and `main` pushes.

## Build, Test, and Development Commands
- `npm run dev`: Start local development server.
- `npm run build`: Create production build (used in CI).
- `npm run start`: Run production server from built output.
- `npm run lint`: Run Next.js ESLint rules.
- `npm run logo:pdf-to-svg -- <input.pdf> [output.svg]`: Convert logo/source art to SVG in `public/`.

Run `npm ci` before first local run to match lockfile dependencies.

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode enabled (`tsconfig.json`).
- Indentation: 2 spaces; keep existing semicolon usage and quote style within each file.
- Components/types: `PascalCase` (for example `LeaderboardEntry`).
- Variables/functions: `camelCase`; constants in meaningful uppercase only when truly constant.
- API routes: `app/api/<resource>/route.ts` with named HTTP exports (`GET`, `POST`, etc.).
- Imports: Use `@/` path alias for project-root imports.

## Testing Guidelines
There is currently no dedicated unit/integration test suite in the repo. Quality gates are:

- `npm run lint`
- `npm run build`

For API/UI changes, include a quick manual verification note in your PR (example: `GET /api/leaderboard?period=all_time` returns 200 and expected JSON).

## Commit & Pull Request Guidelines
Follow the existing commit style from history: short, imperative summaries (for example, `Add Stake.us promo graphic`).

- Keep commits focused to one concern.
- PRs should include: what changed, why, and how it was validated.
- Link related issues/tasks when available.
- Include screenshots or short recordings for visual changes.

## Database
- **Remote Postgres only:** Use Neon for both dev and prod. No local Postgres or Docker DB.
- **Neon is the auth source:** Set `DATABASE_URL` from the Neon dashboard in `.env.local` for dev. For production, use the Vercel Neon integration so `DATABASE_URL` is injected automatically.

## Security & Configuration Tips
- Never commit `.env*` files or secrets.
- Required runtime values include `DATABASE_URL` and public `NEXT_PUBLIC_*` variables used by `app/page.tsx`.
- Prefer server-side data access in `lib/` and avoid exposing sensitive logic in client components.
