-- Add all dynamic copy/URL fields to site_settings so every dynamic value is Neon-backed and editable in Admin → Site.
-- Run once: psql "$DATABASE_URL" -f scripts/add-site-copy-columns.sql
-- Or apply via Neon MCP run_sql.

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_leaderboard_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_bonuses_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_clips_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_community_heading TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_community_subtext TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS community_stats JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS live_now_url TEXT;

-- Backfill defaults for existing row (only set if currently null)
UPDATE site_settings SET
  hero_title = COALESCE(hero_title, 'Live Casino Action & High Stakes Gambling'),
  hero_subtitle = COALESCE(hero_subtitle, 'Official Website'),
  section_leaderboard_title = COALESCE(section_leaderboard_title, 'Monthly Leaderboard'),
  section_bonuses_title = COALESCE(section_bonuses_title, 'Enjoy Exclusive Bonuses'),
  section_clips_title = COALESCE(section_clips_title, 'Watch Rips Clips'),
  section_community_heading = COALESCE(section_community_heading, 'Don''t miss a RIPS update.'),
  section_community_subtext = COALESCE(section_community_subtext, 'Check out all of our social platforms to stay connected.'),
  community_stats = COALESCE(community_stats, '[{"value":"164k","label":"Community Members"},{"value":"5.2m","label":"Monthly Views"}]'::jsonb),
  live_now_url = COALESCE(live_now_url, 'https://kick.com/rips')
WHERE id = 1;
