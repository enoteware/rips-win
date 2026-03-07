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

-- Sample data for testing (optional - remove for production)
INSERT INTO leaderboard_entries (player_name, rank, total_wagered, biggest_win, current_streak, platform, period, published)
VALUES 
  ('RipsKing', 1, 125000.00, 15000.00, 12, 'both', 'all_time', true),
  ('StakeLegend', 2, 98000.00, 12500.00, 8, 'stake_com', 'all_time', true),
  ('CasinoWhale', 3, 87500.00, 11000.00, 5, 'stake_us', 'all_time', true);
