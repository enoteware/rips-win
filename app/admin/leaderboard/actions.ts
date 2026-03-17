'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import {
  createEntry,
  updateEntry,
  deleteEntry,
  publishPeriod,
  type LeaderboardEntry,
} from '@/lib/db';
import {
  leaderboardEntrySchema,
  leaderboardUpdateSchema,
  type LeaderboardEntryInput,
} from '@/lib/validations';
import { isLocalDevBypass } from '@/lib/auth';

async function requireAdmin(): Promise<string> {
  if (isLocalDevBypass()) return 'dev@local';
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createEntryAction(
  period: string,
  input: LeaderboardEntryInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = leaderboardEntrySchema.safeParse({ ...input, period });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  try {
    await createEntry({
      ...parsed.data,
      period: parsed.data.period,
      avatar_url: parsed.data.avatar_url || undefined,
      month_key: parsed.data.month_key || undefined,
    });
    revalidatePath('/admin/leaderboard');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] createEntryAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function updateEntryAction(
  id: string,
  data: Partial<LeaderboardEntryInput>
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  const parsed = leaderboardUpdateSchema.safeParse({ id, ...data });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    const first = Object.values(msg).flat()[0];
    return { ok: false, error: first ?? 'Validation failed' };
  }
  const { id: _id, ...rest } = parsed.data;
  const update: Partial<LeaderboardEntry> = {};
  if (rest.player_name !== undefined) update.player_name = rest.player_name;
  if (rest.rank !== undefined) update.rank = rest.rank;
  if (rest.total_wagered !== undefined) update.total_wagered = rest.total_wagered;
  if (rest.biggest_win !== undefined) update.biggest_win = rest.biggest_win;
  if (rest.current_streak !== undefined) update.current_streak = rest.current_streak;
  if (rest.platform !== undefined) update.platform = rest.platform;
  if (rest.period !== undefined) update.period = rest.period;
  if (rest.avatar_url !== undefined) update.avatar_url = rest.avatar_url || null;
  if (rest.month_key !== undefined) (update as Record<string, unknown>).month_key = rest.month_key || null;
  try {
    await updateEntry(id, update);
    revalidatePath('/admin/leaderboard');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] updateEntryAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function deleteEntryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await deleteEntry(id);
    revalidatePath('/admin/leaderboard');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] deleteEntryAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}

export async function publishPeriodAction(period: string): Promise<ActionResult> {
  let email: string;
  try {
    email = await requireAdmin();
  } catch {
    return { ok: false, error: 'Unauthorized' };
  }
  try {
    await publishPeriod(period, email);
    revalidatePath('/admin/leaderboard');
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    console.error('[DB-ERROR] publishPeriodAction', err);
    return { ok: false, error: 'Something went wrong.' };
  }
}
