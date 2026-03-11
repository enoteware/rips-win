---
name: client-update-export
description: Creates client-facing update exports for rips-win as a single portable HTML file with ScreenshotOne CDN-hosted screenshots by default, production outbound links, and reusable request-based summary sections.
---

# Client Update Export (rips-win)

Use this skill when preparing a polished client-facing recap of completed site work.

## Goal

Produce a **single sendable HTML file** that:

- lives under `docs/client-updates/YYYY-MM-DD/`
- includes the project name in the filename
- uses **ScreenshotOne CDN-hosted screenshots** by default (with embedded-image fallbacks only when explicitly needed)
- points outbound links at the **production build**
- summarizes work in a clean, client-readable format

## File naming

Prefer:

- `docs/client-updates/YYYY-MM-DD/rips-win-client-update-YYYY-MM-DD.html`

Keep support files nearby if regeneration is useful:

- `generate-screenshotone-urls.mjs`
- `screenshotone-urls.json`
- local `screenshots/` source captures

## Screenshot workflow

### Preferred output

The default final HTML should reference ScreenshotOne `cache_url` images like:

- `https://cache.screenshotone.com/...png`

Only create a Telegram or messaging-app fallback file with fully embedded images like:

- `data:image/png;base64,...`

Do **not** leave final `<img>` tags pointing at:

- `./screenshots/...`
- `localhost`
- temporary dev-only assets

### Reliable ScreenshotOne fallback

If direct production URL + selector captures are unreliable:

1. Capture the needed local screenshots first.
2. Read the local PNGs.
3. Wrap each image in simple HTML using a base64 `data:image/png;base64,...` source.
4. POST that HTML to ScreenshotOne.
5. Use the returned `cache_url` in the final HTML export.

This is the reliable way to turn local captures into portable CDN-backed images.

### Telegram-safe final export

If the user needs to send the HTML through Telegram, Slack, or another messaging app that may open the HTML locally, the safest fallback export is a **separate self-contained HTML file with embedded `data:` image sources**.

Reason: the remote ScreenshotOne URLs may still be valid in normal browsers but fail to open reliably from inside the messaging app's local attachment viewer.

## ScreenshotOne API learnings

- Use `POST https://api.screenshotone.com/take`
- Send `content-type: application/json`
- Use proper JSON types (booleans/numbers), not everything as strings
- `wait_until` should be an array like `['load']`
- Never expose or commit `SS_ONE_API` / `SS_ONE_API_SECRET`

## Content / wording rules

- Keep the recap client-friendly and concise.
- If the user asks for grouped asks, use one **Requested updates** section with:
  - `Request 1`
  - `Request 2`
  - `Request 3`
- If screenshots were taken from dev but the file is client-facing, keep the **outbound links** pointed at production unless the user explicitly wants preview links.
- Mention that the file is a single portable HTML export when helpful.

## Validation checklist

Before calling the export done, verify:

- [ ] final HTML filename includes `rips-win`
- [ ] main final HTML uses ScreenshotOne CDN image URLs unless the user explicitly requested an embedded-image variant
- [ ] no `./screenshots/...` references remain in the sendable file
- [ ] no `localhost` links remain in the sendable file unless explicitly requested
- [ ] outbound links point to the intended production pages
- [ ] if using ScreenshotOne images, each image URL returns `200 OK`

## Current repo reference

The March 11, 2026 implementation lives in:

- `docs/client-updates/2026-03-11/rips-win-client-update-2026-03-11.html`
- `docs/client-updates/2026-03-11/generate-screenshotone-urls.mjs`
- `docs/client-updates/2026-03-11/screenshotone-urls.json`

