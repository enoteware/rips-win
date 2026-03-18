'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateSiteSettingsAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_PRIZES,
  PRIZE_TIERS,
  parsePrizes,
  prizesToTierValues,
  serializeTierValues,
} from '@/lib/prizes';

type Props = {
  initial: {
    welcome_code: string;
    rakeback_pct: string;
    stake_us_link: string;
    stake_com_link: string;
    prize_pool: string;
    prizes: string | null;
  };
};

export function SiteSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize tier values from DB prizes JSON, falling back to defaults
  const initialPrizes = parsePrizes(initial.prizes);
  const [tierValues, setTierValues] = useState<number[]>(
    prizesToTierValues(initialPrizes)
  );

  function setTierValue(index: number, value: number) {
    setTierValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';

    const prizesJson = serializeTierValues(tierValues);

    const result = await updateSiteSettingsAction({
      welcome_code: get('welcome_code') || null,
      rakeback_pct: get('rakeback_pct') || null,
      stake_us_link: get('stake_us_link') || null,
      stake_com_link: get('stake_com_link') || null,
      prize_pool: get('prize_pool') || null,
      prizes: prizesJson,
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
    <div className="space-y-6">
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
            <div className="space-y-2">
              <Label htmlFor="prize_pool">Prize pool banner (e.g. $150,000)</Label>
              <Input
                id="prize_pool"
                name="prize_pool"
                defaultValue={initial.prize_pool}
                placeholder="e.g. $150,000"
              />
            </div>

            {/* Prize Tiers Editor */}
            <div className="space-y-3 pt-2">
              <div>
                <p className="text-sm font-semibold text-foreground">Prize Tiers</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Per-rank prize amounts shown on the leaderboard podium and table.
                </p>
              </div>
              <div className="border border-border-dark rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-dark/50 border-b border-border-dark">
                      <th className="text-left font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-2 px-4 w-28">
                        Ranks
                      </th>
                      <th className="text-left font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-2 px-4">
                        Prize ($)
                      </th>
                      <th className="text-right font-mono text-xs text-muted-foreground py-2 px-4 hidden sm:table-cell">
                        Default
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIZE_TIERS.map((tier, i) => (
                      <tr
                        key={tier.label}
                        className="border-b border-border-dark last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="font-mono text-sm text-muted-foreground py-2 px-4 whitespace-nowrap">
                          {tier.label}
                        </td>
                        <td className="py-1.5 px-3">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            value={tierValues[i] ?? 0}
                            onChange={(e) => setTierValue(i, Number(e.target.value))}
                            className="h-8 w-28 font-mono text-sm"
                          />
                        </td>
                        <td className="font-mono text-xs text-muted-foreground text-right py-2 px-4 hidden sm:table-cell">
                          ${(DEFAULT_PRIZES[tier.ranks[0]] ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTierValues(prizesToTierValues(DEFAULT_PRIZES))}
                className="text-xs"
              >
                Reset to defaults
              </Button>
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
    </div>
  );
}
