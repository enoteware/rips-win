'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { createBonusCard, updateBonusCard, deleteBonusCard, type BonusCard } from '@/lib/bonuses';
import { bonusCardSchema } from '@/lib/validations';

async function requireAdmin(): Promise<string> {
  if (isLocalDevBypass()) return 'dev@local';
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createBonusCardAction(
  input: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = bonusCardSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await createBonusCard({
      ...parsed.data,
      subtitle: parsed.data.subtitle || undefined,
      description: parsed.data.description || undefined,
      image_url: parsed.data.image_url || undefined,
      promo_code: parsed.data.promo_code || undefined,
      badge_text: parsed.data.badge_text || undefined,
    });
    revalidatePath('/admin/bonuses');
    revalidatePath('/bonuses');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] createBonusCardAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function updateBonusCardAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    const update: Partial<BonusCard> = {};
    if (data.headline !== undefined) update.headline = data.headline as string;
    if (data.subtitle !== undefined) update.subtitle = (data.subtitle as string) || null;
    if (data.description !== undefined) update.description = (data.description as string) || null;
    if (data.image_url !== undefined) update.image_url = (data.image_url as string) || null;
    if (data.cta_text !== undefined) update.cta_text = data.cta_text as string;
    if (data.cta_link !== undefined) update.cta_link = data.cta_link as string;
    if (data.promo_code !== undefined) update.promo_code = (data.promo_code as string) || null;
    if (data.badge_text !== undefined) update.badge_text = (data.badge_text as string) || null;
    if (data.sort_order !== undefined) update.sort_order = data.sort_order as number;
    if (data.published !== undefined) update.published = data.published as boolean;
    if (data.show_on_homepage !== undefined) update.show_on_homepage = data.show_on_homepage as boolean;

    await updateBonusCard(id, update);
    revalidatePath('/admin/bonuses');
    revalidatePath('/bonuses');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updateBonusCardAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function deleteBonusCardAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await deleteBonusCard(id);
    revalidatePath('/admin/bonuses');
    revalidatePath('/bonuses');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] deleteBonusCardAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
