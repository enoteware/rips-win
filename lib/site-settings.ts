import { neon } from '@neondatabase/serverless';
import { parsePrizes } from './prizes';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required. Set it from Neon (dashboard or Vercel Neon integration).'
  );
}
const sql = neon(connectionString);

export interface CommunityStat {
  value: string;
  label: string;
}

export interface SiteSettings {
  id: number;
  welcome_code: string | null;
  rakeback_pct: string | null;
  stake_us_link: string | null;
  stake_com_link: string | null;
  prize_pool: string | null;
  prizes: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  section_leaderboard_title: string | null;
  section_bonuses_title: string | null;
  section_clips_title: string | null;
  section_community_heading: string | null;
  section_community_subtext: string | null;
  community_stats: CommunityStat[] | null;
  live_now_url: string | null;
  updated_at: string;
}

export { DEFAULT_PRIZES } from './prizes';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const result = await sql(
      `SELECT id, welcome_code, rakeback_pct, stake_us_link, stake_com_link, prize_pool, prizes,
              hero_title, hero_subtitle, section_leaderboard_title, section_bonuses_title, section_clips_title,
              section_community_heading, section_community_subtext, community_stats, live_now_url, updated_at
       FROM site_settings WHERE id = 1 LIMIT 1`
    ) as SiteSettings[];
    const row = result[0] ?? null;
    if (row) {
      console.log('[DB-DEBUG] getSiteSettings success', { hasRow: true });
    }
    return row;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === '42P01') {
      console.warn('[DB-DEBUG] site_settings table does not exist yet; run scripts/apply-site-settings.sql');
      return null;
    }
    console.error('[DB-ERROR] getSiteSettings', err);
    throw err;
  }
}

/** Get site settings from Neon only. No fallback data. On error or no row, returns empty strings and prizes: null (UI shows "Error"). */
export async function getSiteSettingsWithFallback(): Promise<{
  welcome_code: string;
  rakeback_pct: string;
  stake_us_link: string;
  stake_com_link: string;
  prize_pool: string;
  prizes: Record<number, number> | null;
  hero_title: string;
  hero_subtitle: string;
  section_leaderboard_title: string;
  section_bonuses_title: string;
  section_clips_title: string;
  section_community_heading: string;
  section_community_subtext: string;
  community_stats: CommunityStat[];
  live_now_url: string;
}> {
  const emptyCopy = {
    hero_title: '',
    hero_subtitle: '',
    section_leaderboard_title: '',
    section_bonuses_title: '',
    section_clips_title: '',
    section_community_heading: '',
    section_community_subtext: '',
    community_stats: [] as CommunityStat[],
    live_now_url: '',
  };
  try {
    const row = await getSiteSettings();
    if (!row) {
      return {
        welcome_code: '',
        rakeback_pct: '',
        stake_us_link: '',
        stake_com_link: '',
        prize_pool: '',
        prizes: null,
        ...emptyCopy,
      };
    }
    const rawStats = row.community_stats;
    const community_stats: CommunityStat[] = Array.isArray(rawStats)
      ? rawStats.filter((s): s is CommunityStat => s && typeof s.value === 'string' && typeof s.label === 'string')
      : [];
    return {
      welcome_code: row.welcome_code ?? '',
      rakeback_pct: row.rakeback_pct ?? '',
      stake_us_link: row.stake_us_link ?? '',
      stake_com_link: row.stake_com_link ?? '',
      prize_pool: row.prize_pool ?? '',
      prizes: parsePrizes(row.prizes),
      hero_title: row.hero_title ?? '',
      hero_subtitle: row.hero_subtitle ?? '',
      section_leaderboard_title: row.section_leaderboard_title ?? '',
      section_bonuses_title: row.section_bonuses_title ?? '',
      section_clips_title: row.section_clips_title ?? '',
      section_community_heading: row.section_community_heading ?? '',
      section_community_subtext: row.section_community_subtext ?? '',
      community_stats,
      live_now_url: row.live_now_url ?? '',
    };
  } catch (err) {
    console.error('[DB-ERROR] getSiteSettingsWithFallback', err);
    return {
      welcome_code: '',
      rakeback_pct: '',
      stake_us_link: '',
      stake_com_link: '',
      prize_pool: '',
      prizes: null,
      ...emptyCopy,
    };
  }
}

export async function updateSiteSettings(data: {
  welcome_code?: string | null;
  rakeback_pct?: string | null;
  stake_us_link?: string | null;
  stake_com_link?: string | null;
  prize_pool?: string | null;
  prizes?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  section_leaderboard_title?: string | null;
  section_bonuses_title?: string | null;
  section_clips_title?: string | null;
  section_community_heading?: string | null;
  section_community_subtext?: string | null;
  community_stats?: string | null;
  live_now_url?: string | null;
}): Promise<SiteSettings> {
  try {
    const result = await sql(
      `UPDATE site_settings
       SET welcome_code = COALESCE($1, welcome_code),
           rakeback_pct = COALESCE($2, rakeback_pct),
           stake_us_link = COALESCE($3, stake_us_link),
           stake_com_link = COALESCE($4, stake_com_link),
           prize_pool = COALESCE($5, prize_pool),
           prizes = $6,
           hero_title = COALESCE($7, hero_title),
           hero_subtitle = COALESCE($8, hero_subtitle),
           section_leaderboard_title = COALESCE($9, section_leaderboard_title),
           section_bonuses_title = COALESCE($10, section_bonuses_title),
           section_clips_title = COALESCE($11, section_clips_title),
           section_community_heading = COALESCE($12, section_community_heading),
           section_community_subtext = COALESCE($13, section_community_subtext),
           community_stats = COALESCE($14::jsonb, community_stats),
           live_now_url = COALESCE($15, live_now_url),
           updated_at = NOW()
       WHERE id = 1
       RETURNING id, welcome_code, rakeback_pct, stake_us_link, stake_com_link, prize_pool, prizes,
                 hero_title, hero_subtitle, section_leaderboard_title, section_bonuses_title, section_clips_title,
                 section_community_heading, section_community_subtext, community_stats, live_now_url, updated_at`,
      [
        data.welcome_code ?? null,
        data.rakeback_pct ?? null,
        data.stake_us_link ?? null,
        data.stake_com_link ?? null,
        data.prize_pool ?? null,
        data.prizes ?? null,
        data.hero_title ?? null,
        data.hero_subtitle ?? null,
        data.section_leaderboard_title ?? null,
        data.section_bonuses_title ?? null,
        data.section_clips_title ?? null,
        data.section_community_heading ?? null,
        data.section_community_subtext ?? null,
        data.community_stats ?? null,
        data.live_now_url ?? null,
      ]
    ) as SiteSettings[];
    const row = result[0];
    if (!row) {
      console.error('[DB-ERROR] updateSiteSettings no row returned');
      throw new Error('Site settings not found');
    }
    console.log('[DB-DEBUG] updateSiteSettings success');
    return row;
  } catch (err) {
    console.error('[DB-ERROR] updateSiteSettings', err);
    throw err;
  }
}
