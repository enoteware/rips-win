export type Market = 'us' | 'intl';
export type MarketSource = 'preference' | 'detected' | 'default';

export interface StakeLinkSet {
  stakeUsUrl: string;
  stakeComUrl: string;
}

export const MARKET_COOKIE_NAME = 'rips_market';
export const MARKET_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const DEFAULT_STAKE_US_URL = 'https://stake.us/';
const DEFAULT_STAKE_COM_URL = 'https://stake.com/';

export function isMarket(value: unknown): value is Market {
  return value === 'us' || value === 'intl';
}

export function getMarketLabel(market: Market): 'Stake.us' | 'Stake.com' {
  return market === 'us' ? 'Stake.us' : 'Stake.com';
}

function isStakeHost(hostname: string): boolean {
  return hostname === 'stake.us' || hostname === 'stake.com';
}

function addAffiliateParams(url: URL): URL {
  url.searchParams.set('offer', 'rips');
  url.searchParams.set('c', 'selling');
  return url;
}

export function ensureAffiliateStakeUrl(rawUrl: string | null | undefined, fallback: string): string {
  try {
    return addAffiliateParams(new URL(rawUrl?.trim() || fallback)).toString();
  } catch {
    return addAffiliateParams(new URL(fallback)).toString();
  }
}

export function getStakeLinkSet(input?: Partial<StakeLinkSet>): StakeLinkSet {
  return {
    stakeUsUrl: ensureAffiliateStakeUrl(input?.stakeUsUrl, DEFAULT_STAKE_US_URL),
    stakeComUrl: ensureAffiliateStakeUrl(input?.stakeComUrl, DEFAULT_STAKE_COM_URL),
  };
}

export function resolveStakeUrlForMarket(
  rawUrl: string | null | undefined,
  market: Market,
  links: StakeLinkSet
): string {
  const fallbackUrl = market === 'us' ? links.stakeUsUrl : links.stakeComUrl;
  if (!rawUrl) return fallbackUrl;

  try {
    const url = new URL(rawUrl);
    if (!isStakeHost(url.hostname)) return rawUrl;

    const hasCustomDestination =
      url.pathname !== '/' ||
      Array.from(url.searchParams.keys()).some((key) => key !== 'offer' && key !== 'c');

    if (!hasCustomDestination) return fallbackUrl;

    const targetBase = new URL(fallbackUrl);
    url.protocol = targetBase.protocol;
    url.host = targetBase.host;
    return addAffiliateParams(url).toString();
  } catch {
    return fallbackUrl;
  }
}