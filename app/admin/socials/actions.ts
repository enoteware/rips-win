'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { createSocialLink, updateSocialLink, deleteSocialLink, type SocialLink } from '@/lib/social-links';
import { socialLinkSchema } from '@/lib/validations';

async function requireAdmin(): Promise<string> {
  if (isLocalDevBypass()) return 'dev@local';
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createSocialLinkAction(
  input: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = socialLinkSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await createSocialLink(parsed.data);
    revalidatePath('/admin/socials');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] createSocialLinkAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function updateSocialLinkAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    const update: Partial<SocialLink> = {};
    if (data.platform !== undefined) update.platform = data.platform as string;
    if (data.label !== undefined) update.label = data.label as string;
    if (data.url !== undefined) update.url = data.url as string;
    if (data.icon !== undefined) update.icon = data.icon as string;
    if (data.sort_order !== undefined) update.sort_order = data.sort_order as number;
    if (data.published !== undefined) update.published = data.published as boolean;

    await updateSocialLink(id, update);
    revalidatePath('/admin/socials');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updateSocialLinkAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await deleteSocialLink(id);
    revalidatePath('/admin/socials');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] deleteSocialLinkAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
