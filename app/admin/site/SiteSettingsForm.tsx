'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateSiteSettingsAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  initial: {
    welcome_code: string;
    rakeback_pct: string;
    stake_us_link: string;
    stake_com_link: string;
  };
};

export function SiteSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';
    const result = await updateSiteSettingsAction({
      welcome_code: get('welcome_code') || null,
      rakeback_pct: get('rakeback_pct') || null,
      stake_us_link: get('stake_us_link') || null,
      stake_com_link: get('stake_com_link') || null,
    });
    setLoading(false);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Site content saved.' });
      router.refresh();
    } else {
      setMessage({ type: 'err', text: result.error });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage copy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome_code">Welcome code</Label>
            <Input
              id="welcome_code"
              name="welcome_code"
              defaultValue={initial.welcome_code}
              placeholder="e.g. rips"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rakeback_pct">Rakeback (%)</Label>
            <Input
              id="rakeback_pct"
              name="rakeback_pct"
              defaultValue={initial.rakeback_pct}
              placeholder="e.g. 10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stake_us_link">Stake.us link</Label>
            <Input
              id="stake_us_link"
              name="stake_us_link"
              type="url"
              defaultValue={initial.stake_us_link}
              placeholder="https://stake.us/"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stake_com_link">Stake.com link</Label>
            <Input
              id="stake_com_link"
              name="stake_com_link"
              type="url"
              defaultValue={initial.stake_com_link}
              placeholder="https://stake.com/"
            />
          </div>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
