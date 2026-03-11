# rips-win — Agent Configuration

## Tech Stack (detected)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 3, shadcn/ui (tweakcn theme)
- **Data / Auth:** Neon (serverless Postgres), NextAuth, Zod

## Agent Mappings

| Task / scenario | How to proceed |
|-----------------|----------------|
| **Multi-step features, refactors, exploration** | Use Agent tool with `subagent_type=generalPurpose` (or `explore` for codebase search). |
| **Code review before merge / after major work** | Use Agent tool with `subagent_type=code-reviewer`. |
| **React / Next.js components, performance, patterns** | Apply **react-best-practices** (Vercel) or **vercel-react-best-practices** skill when writing or refactoring UI. |
| **Backend, API design, DB, auth** | Use Agent with `subagent_type=backend-expert` or `backend-expert-bertrand`; reference **Neon Postgres** and Prisma skills if adding DB layers. |
| **Tailwind / theme / design tokens** | Use **tailwind-v4** skill if upgrading; follow existing `tailwind.config.ts` and `app/globals.css` (tweakcn) for this project. |
| **Client-facing update recap / sendable HTML export** | Use the **client-update-export** skill. Prefer a single `rips-win-client-update-YYYY-MM-DD.html` file with ScreenshotOne CDN screenshots and production outbound links. |
| **Push with quality checks** | Use **git-push-with-checks** skill so lint/typecheck/build run before push. |
| **Schema / migrations (if Prisma added later)** | Run `schema:generate` / migrations per Prisma docs; use **migration-best-practices** and **schema-conventions** rules if requested. |

## Usage (Cursor)

- **Subagents:** In Cursor, agent invocation uses the built-in Agent/task tool (e.g. `mcp_task` with `subagent_type=...`). Ask for “run this with the code reviewer” or “explore the codebase for X” and the agent will pick the right subagent.
- **Skills:** Reference skills by name when relevant (e.g. “follow react-best-practices”, “use the Neon skill for connection setup”).
- **Client exports:** For polished client recap deliverables, invoke or reference `client-update-export` so the agent follows the one-file HTML + CDN screenshot workflow.

## Example prompts

- *“Add a new API route for X; use the backend agent and keep NextAuth in mind.”*
- *“Refactor this page to be a Server Component and follow react-best-practices.”*
- *“Review my last changes with the code reviewer before I push.”*
- *“Find everywhere we touch the leaderboard and document the flow.”* (explore/generalPurpose)

## Project layout (reference)

- `app/` — routes, layout, API routes (`app/api/`), `globals.css`
- `components/` — shadcn and custom UI
- `lib/` — utils, auth, DB helpers
- `scripts/` — build/utility scripts
- Root `CLAUDE.md` — project overview and dev commands
