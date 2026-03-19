# Dynamic content audit — all from Neon, all editable

Every dynamic value in the app is stored in Neon and editable in the admin UI.

## Source: `site_settings` (Admin → Site content)

| Field | Editable | Used on |
|-------|----------|--------|
| welcome_code | ✅ | (Copy / promo) |
| rakeback_pct | ✅ | (Copy / promo) |
| stake_us_link | ✅ | Leaderboard “Play Now”, market default |
| stake_com_link | ✅ | Market default |
| prize_pool | ✅ | Homepage + Leaderboard hero |
| prizes | ✅ | Leaderboard podium + table |
| hero_title | ✅ | Homepage hero |
| hero_subtitle | ✅ | Homepage hero |
| section_leaderboard_title | ✅ | Homepage + Leaderboard page section title |
| section_bonuses_title | ✅ | Homepage Bonuses section title |
| section_clips_title | ✅ | Homepage Videos section title |
| section_community_heading | ✅ | Homepage Community section heading |
| section_community_subtext | ✅ | Homepage Community section subtext |
| community_stats | ✅ | Homepage Community section stat cards (JSON array) |
| live_now_url | ✅ | Header “Live Now” button |

## Source: `leaderboard_entries` (Admin → Leaderboard)

- Entries (player_name, rank, total_wagered, etc.), month_key, published.  
- Public leaderboard and homepage leaderboard block read from here.

## Source: `leaderboard_metadata` (Admin → Leaderboard)

- last_updated, etc. Shown on homepage leaderboard section.

## Source: `bonus_cards` (Admin → Bonuses)

- Headline, subtitle, description, image, CTA, promo code, badge, sort_order, published, show_on_homepage.  
- Homepage and /bonuses page.

## Source: `video_clips` (Admin → Clips)

- Title, youtube_url, sort_order, published.  
- Homepage Videos section and /#videos.

## Source: `social_links` (Admin → Socials)

- Platform, label, url, icon, sort_order, published.  
- Layout footer, homepage Community section, SocialMarquee.

## Source: `pages` (Admin → Pages)

- slug, title, content, published.  
- Dynamic routes /[slug] for legal/static pages.

## Static (not in DB)

- Nav links (LEADERBOARD, BONUSES, VIDEOS, COMMUNITY) — fixed structure.
- Footer nav (Home, Leaderboard, Bonuses) — fixed structure.
- CTA labels “CLAIM BONUSES”, “VIEW LEADERBOARD” — fixed.
- Market guidance banner copy — fixed.

## Migration

New site_settings columns were added via `scripts/add-site-copy-columns.sql` (and applied with Neon MCP). Defaults were backfilled for the existing row.
