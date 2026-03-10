'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import type { BonusCard } from '@/lib/bonuses';
import {
  createBonusCardAction,
  updateBonusCardAction,
  deleteBonusCardAction,
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

type Props = { initialCards: BonusCard[] };

export function BonusesAdmin({ initialCards }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState<BonusCard | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  async function handleUpload(file: File, setter: (url: string) => void) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.url) setter(json.url);
      else setMessage({ type: 'err', text: json.error || 'Upload failed' });
    } catch {
      setMessage({ type: 'err', text: 'Upload failed' });
    }
    setUploading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value ?? '';
    const checked = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement)?.checked ?? false;

    const result = await createBonusCardAction({
      headline: val('headline'),
      subtitle: val('subtitle'),
      description: val('description'),
      image_url: imageUrl || val('image_url'),
      cta_text: val('cta_text'),
      cta_link: val('cta_link'),
      promo_code: val('promo_code'),
      badge_text: val('badge_text'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
      show_on_homepage: checked('show_on_homepage'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Bonus card added.' });
      setAdding(false);
      setImageUrl('');
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

    const result = await updateBonusCardAction(id, {
      headline: val('headline'),
      subtitle: val('subtitle'),
      description: val('description'),
      image_url: editImageUrl || val('image_url'),
      cta_text: val('cta_text'),
      cta_link: val('cta_link'),
      promo_code: val('promo_code'),
      badge_text: val('badge_text'),
      sort_order: Number(val('sort_order')) || 0,
      published: checked('published'),
      show_on_homepage: checked('show_on_homepage'),
    });
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Bonus card updated.' });
      setEditingId(null);
      setEditImageUrl('');
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  async function handleDeleteConfirm(id: string) {
    const result = await deleteBonusCardAction(id);
    setDeletePending(null);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Bonus card deleted.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  function renderForm(
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    defaults?: BonusCard,
    isEdit = false
  ) {
    const currentImage = isEdit ? (editImageUrl || defaults?.image_url || '') : imageUrl;
    return (
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Headline *</Label>
          <Input name="headline" required defaultValue={defaults?.headline ?? ''} />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input name="subtitle" defaultValue={defaults?.subtitle ?? ''} placeholder="e.g. Stake.com" />
        </div>
        <div className="space-y-2">
          <Label>Promo Code</Label>
          <Input name="promo_code" defaultValue={defaults?.promo_code ?? ''} />
        </div>
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label>Description</Label>
          <textarea
            name="description"
            rows={3}
            defaultValue={defaults?.description ?? ''}
            className="flex w-full rounded-xl border-2 border-border bg-input text-foreground px-3 py-2 text-sm shadow-hard"
          />
        </div>
        <div className="space-y-2">
          <Label>CTA Text *</Label>
          <Input name="cta_text" required defaultValue={defaults?.cta_text ?? 'Claim Now'} />
        </div>
        <div className="space-y-2">
          <Label>CTA Link *</Label>
          <Input name="cta_link" type="url" required defaultValue={defaults?.cta_link ?? ''} />
        </div>
        <div className="space-y-2">
          <Label>Badge Text</Label>
          <Input name="badge_text" defaultValue={defaults?.badge_text ?? ''} placeholder="e.g. BEST VALUE" />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input name="image_url" defaultValue={currentImage} placeholder="Paste URL or upload below" />
        </div>
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, isEdit ? setEditImageUrl : setImageUrl);
            }}
            className="text-sm text-muted-foreground"
          />
          {currentImage && (
            <Image src={currentImage} alt="Preview" width={120} height={68} className="mt-2 rounded border border-border object-cover" />
          )}
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input name="sort_order" type="number" min={0} defaultValue={defaults?.sort_order ?? 0} />
        </div>
        <div className="flex items-center gap-6 sm:col-span-2 lg:col-span-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={defaults?.published ?? false} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="show_on_homepage" defaultChecked={defaults?.show_on_homepage ?? false} />
            Show on Homepage
          </label>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <Button type="submit" disabled={uploading}>{isEdit ? 'Save' : 'Add Card'}</Button>
          <Button type="button" variant="ghost" onClick={() => { setAdding(false); setEditingId(null); setImageUrl(''); setEditImageUrl(''); }}>
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
          Bonus Cards
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
            <AlertDialogTitle>Delete bonus card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletePending?.headline}&quot;. This cannot be undone.
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
            <CardTitle>Add bonus card</CardTitle>
          </CardHeader>
          <CardContent>{renderForm(handleCreate)}</CardContent>
        </Card>
      ) : (
        <Button onClick={() => setAdding(true)}>Add bonus card</Button>
      )}

      <Card>
        <CardContent className="p-0">
          {initialCards.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No bonus cards yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Image</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialCards.map((card) =>
                  editingId === card.id ? (
                    <TableRow key={card.id}>
                      <TableCell colSpan={6}>
                        <div className="rounded-xl border-2 border-border bg-card/50 p-4">
                          {renderForm((e) => handleUpdate(e, card.id), card, true)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={card.id}>
                      <TableCell>
                        {card.image_url ? (
                          <Image src={card.image_url} alt="" width={60} height={34} className="rounded border border-border object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="font-bold">{card.headline}</TableCell>
                      <TableCell>{card.subtitle || '—'}</TableCell>
                      <TableCell>{card.sort_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {card.published ? <Badge variant="secondary">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                          {card.show_on_homepage && <Badge variant="secondary">Homepage</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingId(card.id); setEditImageUrl(card.image_url || ''); }}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeletePending(card)}>
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
