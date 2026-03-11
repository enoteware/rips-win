import { MarketPreferenceSwitcher } from '@/components/MarketPreferenceSwitcher';
import type { Market, MarketSource } from '@/lib/stake';
import { getMarketLabel } from '@/lib/stake';

interface MarketGuidanceBannerProps {
  market: Market;
  source: MarketSource;
  country: string | null;
}

export function MarketGuidanceBanner({ market, source, country }: MarketGuidanceBannerProps) {
  const marketLabel = getMarketLabel(market);
  const detail = source === 'preference'
    ? `You selected ${marketLabel}. Change it anytime if you need the other option.`
    : source === 'detected' && country
      ? market === 'us'
        ? `You appear to be in the United States (${country}), so we’re showing Stake.us links.`
        : `You appear to be outside the United States (${country}), so we’re showing Stake.com links.`
      : `We couldn’t detect your region, so we’re showing International / Stake.com links by default.`;

  return (
    <section className="border-b border-border-dark bg-card/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-bold uppercase tracking-wide text-foreground">Choose the Stake link for your region.</p>
          <p className="mt-1 text-muted-foreground">{detail} Switch anytime if that looks wrong.</p>
        </div>
        <MarketPreferenceSwitcher market={market} />
      </div>
    </section>
  );
}