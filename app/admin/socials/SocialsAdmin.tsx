'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SocialLink } from '@/lib/social-links';
import {
  createSocialLinkAction,
  updateSocialLinkAction,
  deleteSocialLinkAction,
} from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ICON_OPTIONS = [
  { value: 'discord', label: 'Discord' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'stream', label: 'Stream (Kick/Twitch)' },
  { value: 'globe', label: 'Globe (Website)' },
  { value: 'mail', label: 'Mail (Email)' },
  { value: 'chat', label: 'Chat' },
  { value: 'play', label: 'Play (YouTube)' },
  { value: 'trophy', label: 'Trophy' },
] as const;

type Props = { initialLinks: SocialLink[] };

export function SocialsAdmin({ initialLinks }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<SocialLink | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await createSocialLinkAction({
      platform: val('platform'),
      label: val('label'),
      url: val('url'),
      icon: val('icon'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Social link added.' });
      setAdding(false);
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await updateSocialLinkAction(id, {
      platform: val('platform'),
      label: val('label'),
      url: val('url'),
      icon: val('icon'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Social link updated.' });
      setEditingId(null);
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleDeleteConfirm(id: string) {
    const result = await deleteSocialLinkAction(id);
    setDeletePending(null);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Social link deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  function renderForm(
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    defaults?: SocialLink
  ) {
    return (
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Platform *</Label>
          <Input name="platform" required defaultValue={defaults?.platform ?? ''} placeholder="e.g. discord" />
        </div>
        <div className="space-y-2">
          <Label>Display Label *</Label>
          <Input name="label" required defaultValue={defaults?.label ?? ''} placeholder="e.g. Discord" />
        </div>
        <div className="space-y-2">
          <Label>URL *</Label>
          <Input name="url" type="url" required defaultValue={defaults?.url ?? ''} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Icon *</Label>
          <select
            name="icon"
            defaultValue={defaults?.icon ?? 'globe'}
            className="font-display h-9 w-full rounded-xl border-2 border-border bg-input text-foreground px-3 text-sm shadow-hard"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input name="sort_order" type="number" min={0} defaultValue={defaults?.sort_order ?? 0} />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={defaults?.published ?? true} />
            Published
          </label>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <Button type="submit">{defaults ? 'Save' : 'Add Link'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tighter text-secondary md:text-3xl">
          Social Links
        </h1>
        <div className="mt-2 h-2 w-24 border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
      </div>

      {message && (
        <p className={message.type === 'ok' ? 'text-sm text-primary' : 'text-sm text-destructive'} role="alert">
          {message.text}
        </p>
      )}

      <AlertDialog open={!!deletePending} onOpenChange={(open) => !open && setDeletePending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete social link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deletePending?.label} link. This cannot be undone.
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

      {adding ? (
        <Card>
          <CardHeader><CardTitle>Add social link</CardTitle></CardHeader>
          <CardContent>{renderForm(handleCreate)}</CardContent>
        </Card>
      ) : (
        <Button onClick={() => setAdding(true)}>Add social link</Button>
      )}

      <Card>
        <CardContent className="p-0">
          {initialLinks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No social links yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Platform</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialLinks.map((link) =>
                  editingId === link.id ? (
                    <TableRow key={link.id}>
                      <TableCell colSpan={6}>
                        <div className="rounded-xl border-2 border-border bg-card/50 p-4">
                          {renderForm((e) => handleUpdate(e, link.id), link)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={link.id}>
                      <TableCell className="font-bold">{link.platform}</TableCell>
                      <TableCell>{link.label}</TableCell>
                      <TableCell><Badge variant="outline">{link.icon}</Badge></TableCell>
                      <TableCell>{link.sort_order}</TableCell>
                      <TableCell>
                        {link.published ? <Badge variant="secondary">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(link.id)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeletePending(link)}>Delete</Button>
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
