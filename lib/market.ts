import 'server-only';

import { cookies, headers } from 'next/headers';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';
import {
  getMarketLabel,
  getStakeLinkSet,
  isMarket,
  MARKET_COOKIE_NAME,
  type Market,
  type MarketSource,
} from '@/lib/stake';

export interface StakeContext {
  market: Market;
  source: MarketSource;
  country: string | null;
  marketLabel: 'Stake.us' | 'Stake.com';
  stakeUsUrl: string;
  stakeComUrl: string;
  defaultStakeUrl: string;
}

export async function getStakeContext(): Promise<StakeContext> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const override = cookieStore.get(MARKET_COOKIE_NAME)?.value;
  const country = headerStore.get('x-vercel-ip-country')?.toUpperCase() ?? null;

  const market: Market = isMarket(override)
    ? override
    : country === 'US'
      ? 'us'
      : 'intl';

  const source: MarketSource = isMarket(override)
    ? 'preference'
    : country
      ? 'detected'
      : 'default';

  const site = await getSiteSettingsWithFallback();
  const links = getStakeLinkSet({
    stakeUsUrl: site.stake_us_link,
    stakeComUrl: site.stake_com_link,
  });

  return {
    market,
    source,
    country,
    marketLabel: getMarketLabel(market),
    stakeUsUrl: links.stakeUsUrl,
    stakeComUrl: links.stakeComUrl,
    defaultStakeUrl: market === 'us' ? links.stakeUsUrl : links.stakeComUrl,
  };
}