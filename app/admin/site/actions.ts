'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { updateSiteSettings } from '@/lib/site-settings';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/validations';

async function requireAdmin() {
  if (isLocalDevBypass()) return;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateSiteSettingsAction(
  input: SiteSettingsInput
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
  });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await updateSiteSettings({
      welcome_code: parsed.data.welcome_code || null,
      rakeback_pct: parsed.data.rakeback_pct || null,
      stake_us_link: parsed.data.stake_us_link || null,
      stake_com_link: parsed.data.stake_com_link || null,
      prize_pool: parsed.data.prize_pool || null,
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
