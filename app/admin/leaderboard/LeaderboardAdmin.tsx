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

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return;
    const result = await deleteEntryAction(id);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Entry deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handlePublish() {
    const result = await publishPeriodAction(initialPeriod);
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
          <h1 className="font-serif text-2xl font-bold tracking-tight text-secondary md:text-3xl">
            Leaderboard Management
          </h1>
          <div className="mt-2 h-2 w-24 border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Period:</span>
          <select
            value={initialPeriod}
            onChange={(e) => router.push(`/admin/leaderboard?period=${e.target.value}`)}
            className="h-9 rounded-none border-2 border-border bg-input text-foreground px-3 text-sm"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p.replace('_', ' ')}
              </option>
            ))}
          </select>
          <Button onClick={handlePublish}>Publish this period</Button>
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

      {adding ? (
        <Card className="shadow-hard-lg">
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
                  className="h-9 w-full rounded-none border-2 border-border bg-input text-foreground px-3 text-sm"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="add_avatar_url">Avatar URL (optional)</Label>
                <Input id="add_avatar_url" name="avatar_url" type="url" />
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

      <Card className="shadow-hard-lg">
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
                  <TableHead className="text-right">Biggest win</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialEntries.map((entry) =>
                  editingId === entry.id ? (
                    <TableRow key={entry.id}>
                      <TableCell colSpan={8}>
                        <form
                          onSubmit={(e) => handleUpdate(e, entry.id)}
                          className="grid gap-2 rounded border border-border p-4 sm:grid-cols-4"
                        >
                          <Input name="player_name" defaultValue={entry.player_name} required />
                          <Input name="rank" type="number" min={1} defaultValue={entry.rank} required />
                          <Input name="total_wagered" type="number" min={0} defaultValue={entry.total_wagered} />
                          <Input name="biggest_win" type="number" min={0} defaultValue={entry.biggest_win} />
                          <Input name="current_streak" type="number" min={0} defaultValue={entry.current_streak} />
                          <select
                            name="platform"
                            defaultValue={entry.platform}
                            className="h-9 rounded-none border-2 border-border bg-input text-foreground px-3 text-sm"
                          >
                            {PLATFORMS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <Input name="avatar_url" type="url" defaultValue={entry.avatar_url ?? ''} className="sm:col-span-2" />
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
                      <TableCell className="text-right">
                        ${Number(entry.biggest_win).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{entry.current_streak}</TableCell>
                      <TableCell>{entry.platform}</TableCell>
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
                            onClick={() => handleDelete(entry.id)}
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
