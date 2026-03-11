export const dynamic = 'force-dynamic';

import { getBonusCards } from '@/lib/bonuses';
import { BonusesSection } from '@/components/BonusesSection';
import { getStakeContext } from '@/lib/market';
import { resolveStakeUrlForMarket } from '@/lib/stake';

export const metadata = {
  title: 'Bonuses - RIPS.WIN',
  description: 'Exclusive RIPS.WIN bonus offers with region-aware Stake links.',
};

export default async function BonusesPage() {
  const [cards, stakeContext] = await Promise.all([
    getBonusCards(true),
    getStakeContext(),
  ]);

  const bonusItems = cards.map((card) => ({
    id: card.id,
    headline: card.headline,
    subtitle: card.subtitle,
    description: card.description,
    imageUrl: card.image_url,
    ctaText: card.cta_text,
    ctaLink: resolveStakeUrlForMarket(card.cta_link, stakeContext.market, stakeContext),
    promoCode: card.promo_code,
    badgeText: card.badge_text,
  }));

  return (
    <main className="public-page min-h-screen py-16">
      <BonusesSection
        cards={bonusItems}
        title={<>Exclusive <span className="text-primary">Bonuses</span></>}
        subtitle="Claim your exclusive casino rewards and bonuses"
        titleAs="h1"
        containerClassName="container mx-auto px-4"
      />
    </main>
  );
}
