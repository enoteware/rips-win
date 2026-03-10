'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import type { VideoClip } from '@/lib/clips';
import { extractYouTubeId } from '@/lib/youtube';
import {
  createClipAction,
  updateClipAction,
  deleteClipAction,
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

type Props = { initialClips: VideoClip[] };

function YouTubeThumbnail({ url }: { url: string }) {
  const id = extractYouTubeId(url);
  if (!id) return <span className="text-xs text-muted-foreground">Invalid URL</span>;
  return (
    <Image
      src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
      alt="Thumbnail"
      width={120}
      height={68}
      className="rounded border border-border object-cover"
      unoptimized
    />
  );
}

export function ClipsAdmin({ initialClips }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<VideoClip | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await createClipAction({
      title: val('title'),
      youtube_url: val('youtube_url'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Clip added.' });
      setAdding(false);
      setPreviewUrl('');
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await updateClipAction(id, {
      title: val('title'),
      youtube_url: val('youtube_url'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Clip updated.' });
      setEditingId(null);
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleDeleteConfirm(id: string) {
    const result = await deleteClipAction(id);
    setDeletePending(null);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Clip deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tighter text-secondary md:text-3xl">
          Video Clips
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
            <AlertDialogTitle>Delete clip?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletePending?.title}&quot;. This cannot be undone.
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Add clip</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setPreviewUrl(''); }}>Cancel</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL *</Label>
                <Input
                  name="youtube_url"
                  type="url"
                  required
                  placeholder="https://youtube.com/shorts/..."
                  onChange={(e) => setPreviewUrl(e.target.value)}
                />
                {previewUrl && extractYouTubeId(previewUrl) && (
                  <YouTubeThumbnail url={previewUrl} />
                )}
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input name="sort_order" type="number" min={0} defaultValue={0} />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" />
                  Published
                </label>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">Add clip</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setAdding(true)}>Add clip</Button>
      )}

      <Card>
        <CardContent className="p-0">
          {initialClips.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No clips yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialClips.map((clip) =>
                  editingId === clip.id ? (
                    <TableRow key={clip.id}>
                      <TableCell colSpan={5}>
                        <div className="rounded-xl border-2 border-border bg-card/50 p-4">
                          <form onSubmit={(e) => handleUpdate(e, clip.id)} className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Title *</Label>
                              <Input name="title" required defaultValue={clip.title} />
                            </div>
                            <div className="space-y-2">
                              <Label>YouTube URL *</Label>
                              <Input name="youtube_url" type="url" required defaultValue={clip.youtube_url} />
                            </div>
                            <div className="space-y-2">
                              <Label>Sort Order</Label>
                              <Input name="sort_order" type="number" min={0} defaultValue={clip.sort_order} />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name="published" defaultChecked={clip.published} />
                                Published
                              </label>
                            </div>
                            <div className="flex gap-2 sm:col-span-2">
                              <Button type="submit" size="sm">Save</Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                            </div>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={clip.id}>
                      <TableCell><YouTubeThumbnail url={clip.youtube_url} /></TableCell>
                      <TableCell className="font-bold">{clip.title}</TableCell>
                      <TableCell>{clip.sort_order}</TableCell>
                      <TableCell>
                        {clip.published ? <Badge variant="secondary">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(clip.id)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeletePending(clip)}>Delete</Button>
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
