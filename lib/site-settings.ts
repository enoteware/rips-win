import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required. Set it from Neon (dashboard or Vercel Neon integration).'
  );
}
const sql = neon(connectionString);

export interface SiteSettings {
  id: number;
  welcome_code: string | null;
  rakeback_pct: string | null;
  stake_us_link: string | null;
  stake_com_link: string | null;
  prize_pool: string | null;
  updated_at: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const result = await sql(
      `SELECT id, welcome_code, rakeback_pct, stake_us_link, stake_com_link, prize_pool, updated_at FROM site_settings WHERE id = 1 LIMIT 1`
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

/** Get site settings with env fallback for use on public pages. Does not throw if table missing. */
export async function getSiteSettingsWithFallback(): Promise<{
  welcome_code: string;
  rakeback_pct: string;
  stake_us_link: string;
  stake_com_link: string;
  prize_pool: string;
}> {
  try {
    const row = await getSiteSettings();
    return {
      welcome_code: row?.welcome_code ?? process.env.NEXT_PUBLIC_WELCOME_CODE ?? 'RIPS',
      rakeback_pct: row?.rakeback_pct ?? process.env.NEXT_PUBLIC_RAKEBACK ?? '10',
      stake_us_link: row?.stake_us_link ?? process.env.NEXT_PUBLIC_STAKE_US_LINK ?? 'https://stake.us/',
      stake_com_link: row?.stake_com_link ?? process.env.NEXT_PUBLIC_STAKE_COM_LINK ?? 'https://stake.com/',
      prize_pool: row?.prize_pool ?? '',
    };
  } catch (err) {
    console.error('[DB-ERROR] getSiteSettingsWithFallback', err);
    return {
      welcome_code: process.env.NEXT_PUBLIC_WELCOME_CODE ?? 'RIPS',
      rakeback_pct: process.env.NEXT_PUBLIC_RAKEBACK ?? '10',
      stake_us_link: process.env.NEXT_PUBLIC_STAKE_US_LINK ?? 'https://stake.us/',
      stake_com_link: process.env.NEXT_PUBLIC_STAKE_COM_LINK ?? 'https://stake.com/',
      prize_pool: '',
    };
  }
}

export async function updateSiteSettings(data: {
  welcome_code?: string | null;
  rakeback_pct?: string | null;
  stake_us_link?: string | null;
  stake_com_link?: string | null;
  prize_pool?: string | null;
}): Promise<SiteSettings> {
  try {
    const result = await sql(
      `UPDATE site_settings
       SET welcome_code = COALESCE($1, welcome_code),
           rakeback_pct = COALESCE($2, rakeback_pct),
           stake_us_link = COALESCE($3, stake_us_link),
           stake_com_link = COALESCE($4, stake_com_link),
           prize_pool = COALESCE($5, prize_pool),
           updated_at = NOW()
       WHERE id = 1
       RETURNING id, welcome_code, rakeback_pct, stake_us_link, stake_com_link, prize_pool, updated_at`,
      [
        data.welcome_code ?? null,
        data.rakeback_pct ?? null,
        data.stake_us_link ?? null,
        data.stake_com_link ?? null,
        data.prize_pool ?? null,
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
