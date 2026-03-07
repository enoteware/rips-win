# Stitch design reference

Design screens for **Rips CMS** are in Google Stitch. Use the Stitch MCP (when connected in Cursor) or the Stitch web app to fetch images and code.

## Project

- **Project ID:** `11010436019750219120`

## Screens

| Screen name | Screen ID | File(s) |
|-------------|-----------|---------|
| Rips CMS - Leaderboard Management | `3ef30c10751c4bbbb39eba5578e66b63` | (legacy: rips-cms-leaderboard.*) |
| Rips Leaderboard Page | `deef04cf30bb454398e33253b7a13ea7` | rips-leaderboard-page.png, .html |
| Rips Home Page | `43c40161904f4de08f878e004d3717ca` | rips-home-page.png, .html |
| Rips Home Page - Official Logo Update | `c1b6ab472b8d42c99b9f4ec49e1dde6b` | rips-home-official-logo.png, .html |

## Getting images and code

### Option 1: Stitch MCP (Cursor)

When the **Stitch** MCP server is available in your session:

1. Call `get_screen` with `project_id: "11010436019750219120"` and `screen_id: "3ef30c10751c4bbbb39eba5578e66b63"`.
2. If the response includes hosted image or code URLs, download with:
   ```bash
   curl -L -o docs/stitch/rips-cms-leaderboard.png "<image_url>"
   curl -L -o docs/stitch/rips-cms-leaderboard.html "<code_url>"
   ```
3. If Stitch returns base64 image or inline code, save the decoded content to `docs/stitch/` (e.g. `rips-cms-leaderboard.png`, `rips-cms-leaderboard.html`).

### Option 2: Stitch web app

1. Open [stitch.withgoogle.com](https://stitch.withgoogle.com) and open the project.
2. Open the screen **Rips CMS - Leaderboard Management**.
3. Export image (preview) and copy code (HTML/CSS) from the UI.
4. Save to `docs/stitch/rips-cms-leaderboard.png` and `docs/stitch/rips-cms-leaderboard.html` (or `.tsx` if you adapt the markup).

### Option 3: Batch download (recommended)

Set `STITCH_API_KEY` in `.env.local` (from [Stitch Settings](https://stitch.withgoogle.com) → Create API Key) and run:

```bash
npm run stitch:download
```

This downloads all screens defined in `scripts/stitch-download-screens.mjs` (images and HTML) into `docs/stitch/`. To add a screen, add its id and a filename slug to the `SCREENS` array in that script.

For a single screen with curl-style URLs, use `node scripts/stitch-fetch-screen.mjs` (edit `SCREEN_ID` in the script first); it prints `curl -L -o ...` commands if the API returns hosted URLs.

## Stitch → Tailwind components

Stitch exports HTML that uses Tailwind-style classes. We convert that into **reusable React components** that use our theme tokens so they work across the app.

1. **Reference:** Keep the exported `.html` (and `.png`) in `docs/stitch/` as the design source.
2. **Map classes:** Stitch may use `bg-background-dark`, `bg-surface-dark`, `border-border-dark`. Our theme already defines these in `tailwind.config.ts` and `app/globals.css` (e.g. `--background`, `--card`, `border-dark`).
3. **Components:** Implement sections as components in `components/` using our tokens:
   - `bg-card`, `border-border-dark`, `text-primary`, `bg-primary`, `glow-primary`, `podium-1`, etc.
   - Use `next/link`, `next/image`, and shared UI from `components/ui/` where appropriate.
4. **Reuse:** Use these components in `app/page.tsx` and other routes so the theme stays consistent and Stitch design updates can be applied in one place.

Current Stitch-aligned components: `HeroSection`, `PodiumCard`, `BonusCard`, `RaffleCtaSection`.

## Styling the admin to match

The admin leaderboard at `/admin/leaderboard` is styled to match the Rips brand (lime primary, green secondary, hard shadows, logo gradient accents). Design tokens live in `app/globals.css`. Use the Stitch export as a visual reference to align layout, spacing, and hierarchy; keep using the existing Tailwind theme for consistency.
