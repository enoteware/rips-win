'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { CmsPage } from '@/lib/pages';
import {
  createPageAction,
  updatePageAction,
  deletePageAction,
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

type Props = { initialPages: CmsPage[] };

export function PagesAdmin({ initialPages }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<CmsPage | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await createPageAction({
      slug: val('slug'),
      title: val('title'),
      content: val('content'),
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Page created.' });
      setAdding(false);
      setPreviewContent('');
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await updatePageAction(id, {
      slug: val('slug'),
      title: val('title'),
      content: val('content'),
      published: checked('published'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Page updated.' });
      setEditingId(null);
      setPreviewContent('');
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleDeleteConfirm(id: string) {
    const result = await deletePageAction(id);
    setDeletePending(null);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Page deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  function renderEditor(
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    defaults?: CmsPage
  ) {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Slug * <span className="text-xs text-muted-foreground">(URL path)</span></Label>
            <Input name="slug" required defaultValue={defaults?.slug ?? ''} placeholder="e.g. terms" />
          </div>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input name="title" required defaultValue={defaults?.title ?? ''} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={defaults?.published ?? true} />
              Published
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Content (Markdown)</Label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
          <div className={showPreview ? 'grid grid-cols-2 gap-4' : ''}>
            <textarea
              name="content"
              rows={20}
              defaultValue={defaults?.content ?? ''}
              onChange={(e) => setPreviewContent(e.target.value)}
              className="flex w-full rounded-xl border-2 border-border bg-input text-foreground px-3 py-2 text-sm shadow-hard font-mono"
              placeholder="Write your page content in Markdown..."
            />
            {showPreview && (
              <div className="rounded-xl border-2 border-border bg-card p-4 overflow-y-auto max-h-[600px] prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{previewContent || defaults?.content || ''}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{defaults ? 'Save' : 'Create Page'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setAdding(false); setEditingId(null); setPreviewContent(''); }}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tighter text-secondary md:text-3xl">
          CMS Pages
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
            <AlertDialogTitle>Delete page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{deletePending?.title}&quot; page (/{deletePending?.slug}). This cannot be undone.
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
          <CardHeader><CardTitle>Create page</CardTitle></CardHeader>
          <CardContent>{renderEditor(handleCreate)}</CardContent>
        </Card>
      ) : (
        <Button onClick={() => setAdding(true)}>Create page</Button>
      )}

      {!adding && !editingId && (
        <Card>
          <CardContent className="p-0">
            {initialPages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No pages yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Slug</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                      <TableCell className="font-bold">{page.title}</TableCell>
                      <TableCell>
                        {page.published ? <Badge variant="secondary">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingId(page.id); setPreviewContent(page.content); }}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeletePending(page)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {editingId && (() => {
        const page = initialPages.find((p) => p.id === editingId);
        if (!page) return null;
        return (
          <Card>
            <CardHeader><CardTitle>Edit: {page.title}</CardTitle></CardHeader>
            <CardContent>{renderEditor((e) => handleUpdate(e, page.id), page)}</CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
