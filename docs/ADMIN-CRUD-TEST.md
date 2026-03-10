# Admin CRUD Test Checklist

Use this checklist to verify all admin CRUD flows in the UI. Dev server: `npm run dev` (default port 3000; if occupied, use `PORT=3001 npm run dev`).

**E2E (Playwright):** With the dev server running on port 3002 and `.env.local` containing `ADMIN_EMAIL` and `ADMIN_PASSWORD`, run: `PLAYWRIGHT_BASE_URL=http://localhost:3002 npm run test:e2e:admin` to exercise leaderboard CRUD and front-end verification automatically.

## Prerequisites

- `.env.local` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (and optionally `ADMIN_PASSWORD` for reference)
- Log in at **/admin/login** with your admin email and password

**Agents (automated browser tests):** Read `.env.local` for `ADMIN_EMAIL` and `ADMIN_PASSWORD` and use those values to sign in at `/admin/login`. Do not hardcode credentials in code or scripts.

---

## 1. Leaderboard (full CRUD)

**Read (list)**

- [ ] Go to **/admin/leaderboard**
- [ ] Confirm period selector (all_time, daily, weekly, monthly) works
- [ ] Confirm table shows: Rank, Player, Wagered, Published, Actions (Biggest win, Streak, Platform are hidden)
- [ ] If no entries, confirm message: "No entries for this period."

**Create**

- [ ] Click **Add entry**
- [ ] Fill: Player name, Rank, Total wagered, Biggest win, Current streak, Platform, (optional) Avatar URL
- [ ] Submit → "Entry added." and new row appears
- [ ] Cancel → form closes without saving

**Update**

- [ ] Click **Edit** on an entry
- [ ] Change one or more fields, click **Save** → "Entry updated." and row shows new values
- [ ] Click **Cancel** → inline form closes without saving

**Delete**

- [ ] Click **Delete** on an entry → confirmation dialog with entry name and rank
- [ ] Click **Delete** in dialog → "Entry deleted." and row disappears
- [ ] Click **Cancel** in dialog → no change

**Publish**

- [ ] Click **Publish this period** → confirmation dialog "Publish all entries for {period}?"
- [ ] Click **Publish** in dialog → "Leaderboard published." and "Last updated" refreshes
- [ ] Click **Cancel** in dialog → no change

---

## 2. Site content (update only)

**Read**

- [ ] Go to **/admin/site**
- [ ] Confirm form shows current: Welcome code, Rakeback (%), Stake.us link, Stake.com link

**Update**

- [ ] Change one or more fields
- [ ] Click **Save** → "Site content saved."
- [ ] Visit **/** (home) and confirm bonus section reflects changes (welcome code, rakeback, links)

---

## Quick verification (no login)

- [ ] **/admin** or **/admin/leaderboard** unauthenticated → redirect to **/admin/login** with `callbackUrl`
- [ ] **/admin/login** shows Email, Password, Sign in; invalid credentials → "Invalid email or password."

---

## Securing future cron / bulk-delete endpoints

If you add API routes or scripts that run destructive operations (e.g. `deleteEntriesByPeriod`, bulk import, or Vercel Cron jobs):

- **Require a shared secret:** Use a header or query param (e.g. `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`) and reject requests that do not match `CRON_SECRET` (or `ADMIN_CRON_SECRET`) from the environment.
- **Avoid accidental triggers:** Do not expose cron endpoints without auth; prefer server-side cron (Vercel Cron, GitHub Actions, etc.) that send the secret.
- **Confirmation for scripts:** For manual or one-off bulk deletes, consider a two-step flow (e.g. dry run then confirm with a flag or second request).
