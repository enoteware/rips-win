# CMS setup (admin + site content)

## Done for you

- **`site_settings` table** – Already applied. If you use a new DB later, run:
  ```bash
  npm run db:apply-site-settings
  ```

## Add to `.env.local`

1. **NextAuth** (required for `/admin`):
   - `NEXTAUTH_URL` – e.g. `http://localhost:3000` (or your production URL).
   - `NEXTAUTH_SECRET` – random string. Generate one:
     ```bash
     openssl rand -base64 32
     ```

2. **Admin login** (Credentials):
   - `ADMIN_EMAIL` – email you’ll use to sign in (e.g. `admin@example.com`).
   - `ADMIN_PASSWORD_HASH` – bcrypt hash of your password. Generate one and paste the line it prints (already escaped for .env/Vercel):
     ```bash
     npm run admin:hash-password -- yourpassword
     ```

**Example for local dev (password is `admin`):**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-openssl-output-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH="\$2a\$10\$Zez6Phh2Wbht4pm2YYoK5elyvoXSE9dqQA.p/L.IszPmgaZ1rkXgm"
```

Then sign in at **http://localhost:3000/admin/login** with email `admin@example.com` and password `admin`. Change the password in production (generate a new hash and set it in your production env).

## Quick start

```bash
npm run dev
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin (redirects to login if not signed in)  
- **Leaderboard:** http://localhost:3000/admin/leaderboard  
- **Site content:** http://localhost:3000/admin/site  
