# Secrets and Neon

Neon is the auth source for the database. Use these secrets in the right places; never commit real values.

## Neon (required)

| Secret         | Description | Where to get it | Where to set it |
|----------------|-------------|------------------|-----------------|
| **DATABASE_URL** | Postgres connection string (Neon) | Neon dashboard → your project → **Connection string** (pooled or direct), or **Vercel Neon integration** (auto-injected) | `.env.local` (dev), Vercel env or Neon integration (prod), 1Password / `~/.secrets/neon.env` if you use that |

- **Dev:** Copy the connection string from [Neon Console](https://console.neon.tech) → your project → Connection string. Put it in `.env.local` as `DATABASE_URL=...`.
- **Prod (Vercel):** Link the Neon project in Vercel (Neon integration) so `DATABASE_URL` is set automatically. Otherwise add `DATABASE_URL` in Vercel → Project → Settings → Environment Variables.

## Other env (see .env.example)

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` if using auth.
- `NEXT_PUBLIC_WELCOME_CODE`, `NEXT_PUBLIC_RAKEBACK`, `NEXT_PUBLIC_STAKE_US_LINK`, `NEXT_PUBLIC_STAKE_COM_LINK` for the homepage.

## Environments

- **http://10.112.1.56:3000/** — Dev instance backed by **live Neon** (same `DATABASE_URL`). Leaderboard and API there use the real Neon database.

## Checklist

- [ ] `DATABASE_URL` set from Neon (dashboard or Vercel integration).
- [ ] `.env.local` not committed; real values only in env or secret store.
