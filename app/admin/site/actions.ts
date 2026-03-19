'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { DEFAULT_PRIZES, updateSiteSettings } from '@/lib/site-settings';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/validations';

async function requireAdmin() {
  if (isLocalDevBypass()) return;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateSiteSettingsAction(
  input: SiteSettingsInput & { prizes?: string | null }
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = siteSettingsSchema.safeParse({
    welcome_code: input.welcome_code ?? '',
    rakeback_pct: input.rakeback_pct ?? '',
    stake_us_link: input.stake_us_link === '' ? null : input.stake_us_link,
    stake_com_link: input.stake_com_link === '' ? null : input.stake_com_link,
    prize_pool: input.prize_pool ?? '',
    prizes: input.prizes ?? null,
    hero_title: input.hero_title ?? '',
    hero_subtitle: input.hero_subtitle ?? '',
    section_leaderboard_title: input.section_leaderboard_title ?? '',
    section_bonuses_title: input.section_bonuses_title ?? '',
    section_clips_title: input.section_clips_title ?? '',
    section_community_heading: input.section_community_heading ?? '',
    section_community_subtext: input.section_community_subtext ?? '',
    community_stats: input.community_stats ?? null,
    live_now_url: input.live_now_url === '' ? null : input.live_now_url,
  });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  const d = parsed.data;
  try {
    await updateSiteSettings({
      welcome_code: d.welcome_code || null,
      rakeback_pct: d.rakeback_pct || null,
      stake_us_link: d.stake_us_link || null,
      stake_com_link: d.stake_com_link || null,
      prize_pool: d.prize_pool || null,
      prizes: d.prizes ?? null,
      hero_title: d.hero_title || null,
      hero_subtitle: d.hero_subtitle || null,
      section_leaderboard_title: d.section_leaderboard_title || null,
      section_bonuses_title: d.section_bonuses_title || null,
      section_clips_title: d.section_clips_title || null,
      section_community_heading: d.section_community_heading || null,
      section_community_subtext: d.section_community_subtext || null,
      community_stats: d.community_stats ?? null,
      live_now_url: d.live_now_url || null,
    });
    revalidatePath('/admin/site');
    revalidatePath('/');
    revalidatePath('/leaderboard');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updateSiteSettingsAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

/** Write current default prizes (from code) to Neon. Use to sync DB to defaults. */
export async function updatePrizesToDefaultsAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await updateSiteSettings({ prizes: JSON.stringify(DEFAULT_PRIZES) });
    revalidatePath('/admin/site');
    revalidatePath('/');
    revalidatePath('/leaderboard');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updatePrizesToDefaultsAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
