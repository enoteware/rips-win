'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { createClip, updateClip, deleteClip, type VideoClip } from '@/lib/clips';
import { videoClipSchema } from '@/lib/validations';

async function requireAdmin(): Promise<string> {
  if (isLocalDevBypass()) return 'dev@local';
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createClipAction(
  input: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = videoClipSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await createClip(parsed.data);
    revalidatePath('/admin/clips');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] createClipAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function updateClipAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    const update: Partial<VideoClip> = {};
    if (data.title !== undefined) update.title = data.title as string;
    if (data.youtube_url !== undefined) update.youtube_url = data.youtube_url as string;
    if (data.sort_order !== undefined) update.sort_order = data.sort_order as number;
    if (data.published !== undefined) update.published = data.published as boolean;

    await updateClip(id, update);
    revalidatePath('/admin/clips');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updateClipAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function deleteClipAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await deleteClip(id);
    revalidatePath('/admin/clips');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] deleteClipAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
