-- Run this once against Neon to add site_settings (e.g. psql "$DATABASE_URL" -f scripts/apply-site-settings.sql)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  welcome_code TEXT,
  rakeback_pct TEXT,
  stake_us_link TEXT,
  stake_com_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (id, welcome_code, rakeback_pct, stake_us_link, stake_com_link)
VALUES (1, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
