'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { createPage, updatePage, deletePage, type CmsPage } from '@/lib/pages';
import { cmsPageSchema } from '@/lib/validations';

async function requireAdmin(): Promise<string> {
  if (isLocalDevBypass()) return 'dev@local';
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createPageAction(
  input: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = cmsPageSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await createPage(parsed.data);
    revalidatePath('/admin/pages');
    revalidatePath(`/${parsed.data.slug}`);
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] createPageAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function updatePageAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    const update: Partial<CmsPage> = {};
    if (data.slug !== undefined) update.slug = data.slug as string;
    if (data.title !== undefined) update.title = data.title as string;
    if (data.content !== undefined) update.content = data.content as string;
    if (data.published !== undefined) update.published = data.published as boolean;

    await updatePage(id, update);
    revalidatePath('/admin/pages');
    if (data.slug) revalidatePath(`/${data.slug}`);
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updatePageAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function deletePageAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await deletePage(id);
    revalidatePath('/admin/pages');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] deletePageAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
