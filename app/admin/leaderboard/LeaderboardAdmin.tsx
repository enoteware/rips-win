'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LeaderboardEntry, LeaderboardMetadata } from '@/lib/db';
import {
  createEntryAction,
  updateEntryAction,
  deleteEntryAction,
  publishPeriodAction,
} from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PLATFORMS = ['stake_us', 'stake_com', 'both'] as const;

type Props = {
  initialEntries: LeaderboardEntry[];
  initialPeriod: string;
  metadata: LeaderboardMetadata | null;
  periods: readonly string[];
};

export function LeaderboardAdmin({
  initialEntries,
  initialPeriod,
  metadata,
  periods,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<LeaderboardEntry | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  function getCurrentMonthKey(): string {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      player_name: (form.querySelector('[name="player_name"]') as HTMLInputElement).value,
      rank: Number((form.querySelector('[name="rank"]') as HTMLInputElement).value),
      total_wagered: Number((form.querySelector('[name="total_wagered"]') as HTMLInputElement).value),
      biggest_win: Number((form.querySelector('[name="biggest_win"]') as HTMLInputElement).value),
      current_streak: Number((form.querySelector('[name="current_streak"]') as HTMLInputElement).value),
      platform: (form.querySelector('[name="platform"]') as HTMLSelectElement).value as (typeof PLATFORMS)[number],
      period: initialPeriod as 'daily' | 'weekly' | 'monthly' | 'all_time',
      avatar_url: (form.querySelector('[name="avatar_url"]') as HTMLInputElement).value || undefined,
      month_key: (form.querySelector('[name="month_key"]') as HTMLInputElement).value || undefined,
    };
    const result = await createEntryAction(initialPeriod, data);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Entry added.' });
      setAdding(false);
      form.reset();
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      player_name: (form.querySelector('[name="player_name"]') as HTMLInputElement).value,
      rank: Number((form.querySelector('[name="rank"]') as HTMLInputElement).value),
      total_wagered: Number((form.querySelector('[name="total_wagered"]') as HTMLInputElement).value),
      biggest_win: Number((form.querySelector('[name="biggest_win"]') as HTMLInputElement).value),
      current_streak: Number((form.querySelector('[name="current_streak"]') as HTMLInputElement).value),
      platform: (form.querySelector('[name="platform"]') as HTMLSelectElement).value as (typeof PLATFORMS)[number],
      avatar_url: (form.querySelector('[name="avatar_url"]') as HTMLInputElement).value || undefined,
      month_key: (form.querySelector('[name="month_key"]') as HTMLInputElement).value || undefined,
    };
    const result = await updateEntryAction(id, data);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Entry updated.' });
      setEditingId(null);
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleDeleteConfirm(id: string) {
    const result = await deleteEntryAction(id);
    setDeletePending(null);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Entry deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handlePublishConfirm() {
    const result = await publishPeriodAction(initialPeriod);
    setPublishDialogOpen(false);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Leaderboard published.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tighter text-secondary md:text-3xl">
            Leaderboard Management
          </h1>
          <div className="mt-2 h-2 w-24 border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Period:</span>
          <select
            value={initialPeriod}
            onChange={(e) => router.push(`/admin/leaderboard?period=${e.target.value}`)}
            className="font-display h-9 min-w-[10rem] rounded-xl border-2 border-border bg-input text-foreground px-3 text-sm shadow-hard"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p.replace('_', ' ')}
              </option>
            ))}
          </select>
          <Button onClick={() => setPublishDialogOpen(true)}>Publish this period</Button>
        </div>
      </div>

      {metadata && (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(metadata.last_updated).toLocaleString()}
          {metadata.last_updated_by && ` by ${metadata.last_updated_by}`}
        </p>
      )}

      {message && (
        <p
          className={
            message.type === 'ok'
              ? 'text-sm text-primary'
              : 'text-sm text-destructive'
          }
          role="alert"
        >
          {message.text}
        </p>
      )}

      <AlertDialog open={!!deletePending} onOpenChange={(open) => !open && setDeletePending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete leaderboard entry?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletePending
                ? `This will permanently delete the entry for "${deletePending.player_name ?? 'Unknown'}" (rank #${deletePending.rank}). This cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePending && handleDeleteConfirm(deletePending.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish this period?</AlertDialogTitle>
            <AlertDialogDescription>
              Publish all entries for <strong>{initialPeriod.replace('_', ' ')}</strong>? They will appear on the public leaderboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishConfirm}>
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {adding ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Add entry</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="add_player_name">Player name</Label>
                <Input id="add_player_name" name="player_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_rank">Rank</Label>
                <Input id="add_rank" name="rank" type="number" min={1} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_total_wagered">Total wagered</Label>
                <Input id="add_total_wagered" name="total_wagered" type="number" min={0} defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_biggest_win">Biggest win</Label>
                <Input id="add_biggest_win" name="biggest_win" type="number" min={0} defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_current_streak">Current streak</Label>
                <Input id="add_current_streak" name="current_streak" type="number" min={0} defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_platform">Platform</Label>
                <select
                  id="add_platform"
                  name="platform"
                  className="font-display h-9 w-full rounded-xl border-2 border-border bg-input text-foreground px-3 text-sm shadow-hard"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_avatar_url">Avatar URL (optional)</Label>
                <Input id="add_avatar_url" name="avatar_url" type="url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_month_key">Month (YYYY-MM)</Label>
                <Input id="add_month_key" name="month_key" placeholder="2026-03" defaultValue={getCurrentMonthKey()} />
              </div>
              <div className="flex items-end">
                <Button type="submit">Add entry</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setAdding(true)}>Add entry</Button>
      )}

      <Card>
        <CardContent className="p-0">
          {initialEntries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No entries for this period.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Wagered</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialEntries.map((entry) =>
                  editingId === entry.id ? (
                    <TableRow key={entry.id}>
                      <TableCell colSpan={6}>
                        <form
                          onSubmit={(e) => handleUpdate(e, entry.id)}
                          className="grid gap-4 rounded-xl border-2 border-border bg-card/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
                          aria-label="Edit entry"
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-player_name`}>Player name</Label>
                            <Input id={`edit-${entry.id}-player_name`} name="player_name" defaultValue={entry.player_name} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-rank`}>Rank</Label>
                            <Input id={`edit-${entry.id}-rank`} name="rank" type="number" min={1} defaultValue={entry.rank} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-total_wagered`}>Total wagered</Label>
                            <Input id={`edit-${entry.id}-total_wagered`} name="total_wagered" type="number" min={0} defaultValue={entry.total_wagered} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-biggest_win`}>Biggest win</Label>
                            <Input id={`edit-${entry.id}-biggest_win`} name="biggest_win" type="number" min={0} defaultValue={entry.biggest_win} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-current_streak`}>Current streak</Label>
                            <Input id={`edit-${entry.id}-current_streak`} name="current_streak" type="number" min={0} defaultValue={entry.current_streak} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-platform`}>Platform</Label>
                            <select
                              id={`edit-${entry.id}-platform`}
                              name="platform"
                              defaultValue={entry.platform}
                              className="font-display h-9 w-full rounded-xl border-2 border-border bg-input text-foreground px-3 text-sm shadow-hard"
                            >
                              {PLATFORMS.map((p) => (
                                <option key={p} value={p}>
                                  {p.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-avatar_url`}>Avatar URL (optional)</Label>
                            <Input id={`edit-${entry.id}-avatar_url`} name="avatar_url" type="url" defaultValue={entry.avatar_url ?? ''} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-${entry.id}-month_key`}>Month (YYYY-MM)</Label>
                            <Input id={`edit-${entry.id}-month_key`} name="month_key" placeholder="2026-03" defaultValue={entry.month_key ?? ''} />
                          </div>
                          <div className="flex gap-2 sm:col-span-4">
                            <Button type="submit" size="sm">
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={entry.id}>
                      <TableCell className="font-bold">#{entry.rank}</TableCell>
                      <TableCell>{entry.player_name}</TableCell>
                      <TableCell className="text-right">
                        ${Number(entry.total_wagered).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {entry.month_key || '—'}
                      </TableCell>
                      <TableCell>
                        {entry.published ? (
                          <Badge variant="secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(entry.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeletePending(entry)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
