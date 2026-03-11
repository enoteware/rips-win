'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { ICONS } from '@/lib/brand';
import { cn } from '@/lib/utils';
import type { Market } from '@/lib/stake';

interface MarketPreferenceSwitcherProps {
  market: Market;
}

export function MarketPreferenceSwitcher({ market }: MarketPreferenceSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnTo = `${pathname}${query ? `?${query}` : ''}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {([
        ['us', 'US / Stake.us', ICONS.flagUsEmoji],
        ['intl', 'International / Stake.com', ICONS.globeEmoji],
      ] as const).map(([option, label, iconSrc]) => (
        <form key={option} action="/api/market" method="post">
          <input type="hidden" name="market" value={option} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
              option === market
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border-dark bg-card text-foreground hover:border-primary/50 hover:text-primary'
            )}
          >
            <Image src={iconSrc} alt="" width={18} height={18} className="size-[18px] shrink-0" aria-hidden />
            {label}
          </button>
        </form>
      ))}
    </div>
  );
}