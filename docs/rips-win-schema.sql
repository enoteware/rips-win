-- Rips.win Casino Leaderboard Schema

-- Leaderboard entries table
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  rank INTEGER NOT NULL,
  total_wagered DECIMAL(12,2) DEFAULT 0,
  biggest_win DECIMAL(12,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  avatar_url TEXT,
  platform TEXT CHECK (platform IN ('stake_us', 'stake_com', 'both')),
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')) DEFAULT 'all_time',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard metadata table
CREATE TABLE leaderboard_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')) UNIQUE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  last_updated_by TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(rank);
CREATE INDEX idx_leaderboard_period ON leaderboard_entries(period);
CREATE INDEX idx_leaderboard_published ON leaderboard_entries(published);
CREATE INDEX idx_leaderboard_platform ON leaderboard_entries(platform);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE
ON leaderboard_entries FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default metadata entries
INSERT INTO leaderboard_metadata (period, last_updated_by, active)
VALUES 
  ('daily', 'system', true),
  ('weekly', 'system', true),
  ('monthly', 'system', true),
  ('all_time', 'system', true);

-- Site settings (single row, editable via admin CMS)
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  welcome_code TEXT,
  rakeback_pct TEXT,
  stake_us_link TEXT,
  stake_com_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (welcome_code, rakeback_pct, stake_us_link, stake_com_link)
VALUES (NULL, NULL, NULL, NULL);

-- Bonus cards (promo offers, managed via admin CMS)
CREATE TABLE bonus_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Claim Now',
  cta_link TEXT NOT NULL,
  promo_code TEXT,
  badge_text TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  show_on_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bonus_cards_published ON bonus_cards(published);
CREATE INDEX idx_bonus_cards_sort ON bonus_cards(sort_order);

CREATE TRIGGER update_bonus_cards_updated_at BEFORE UPDATE
ON bonus_cards FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Video clips (YouTube Shorts, managed via admin CMS)
CREATE TABLE video_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_clips_published ON video_clips(published);
CREATE INDEX idx_video_clips_sort ON video_clips(sort_order);

CREATE TRIGGER update_video_clips_updated_at BEFORE UPDATE
ON video_clips FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Social links (flexible social media links, managed via admin CMS)
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_links_published ON social_links(published);
CREATE INDEX idx_social_links_sort ON social_links(sort_order);

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE
ON social_links FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- CMS pages (legal pages, etc., managed via admin CMS)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_pages_slug ON pages(slug);

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE
ON pages FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional - remove for production)
INSERT INTO leaderboard_entries (player_name, rank, total_wagered, biggest_win, current_streak, platform, period, published)
VALUES 
  ('RipsKing', 1, 125000.00, 15000.00, 12, 'both', 'all_time', true),
  ('StakeLegend', 2, 98000.00, 12500.00, 8, 'stake_com', 'all_time', true),
  ('CasinoWhale', 3, 87500.00, 11000.00, 5, 'stake_us', 'all_time', true);

-- Migration: Add prize_pool to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS prize_pool TEXT;

-- Migration: Add month_key to leaderboard_entries for historical months
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS month_key TEXT;
CREATE INDEX IF NOT EXISTS idx_leaderboard_month_key ON leaderboard_entries(month_key, period, published);

-- Backfill existing entries with current month
UPDATE leaderboard_entries SET month_key = to_char(NOW(), 'YYYY-MM') WHERE month_key IS NULL;
