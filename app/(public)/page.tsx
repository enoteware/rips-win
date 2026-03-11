export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { LOGO } from '@/lib/brand';
import { getLeaderboard, getMetadata } from "@/lib/db";
import { getBonusCards } from '@/lib/bonuses';
import { getClips } from '@/lib/clips';
import { getSocialLinks } from '@/lib/social-links';
import { getStakeContext } from '@/lib/market';
import { resolveStakeUrlForMarket } from '@/lib/stake';
import { BonusesSection } from '@/components/BonusesSection';
import { HeroSection } from '@/components/HeroSection';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';
import { VideosSection } from '@/components/VideosSection';
import { CommunitySection } from '@/components/CommunitySection';

export default async function Home() {
  const period = 'all_time';
  const [entries, metadata, bonusCards, clips, socialLinks, stakeContext] = await Promise.all([
    getLeaderboard(period, true),
    getMetadata(period),
    getBonusCards(true),
    getClips(true),
    getSocialLinks(true),
    getStakeContext(),
  ]);

  const homepageBonusItems = bonusCards.map((card) => ({
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
    <main className="min-h-screen">
      <HeroSection
        logo={
          <Image
            src={LOGO.main}
            alt="Rips"
            width={128}
            height={128}
            className="h-32 w-auto drop-shadow-glow-logo"
          />
        }
        title={
          <>
            Live Casino <span className="text-primary">Action</span> & High Stakes Gambling
          </>
        }
        subtitle="Experience the adrenaline of high-stakes gambling with our top-tier Streams and exclusive Stake rewards."
        primaryCta={{ label: 'CLAIM BONUSES', href: '/bonuses' }}
        secondaryCta={{ label: 'VIEW LEADERBOARD', href: '/leaderboard' }}
      />

      {/* Leaderboard Section */}
      <section id="leaderboard" className="public-section scroll-mt-20 py-20 border-t border-border-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <h2 className="font-display text-3xl font-black uppercase tracking-tighter italic">
                  <span className="text-primary">$150,000</span> High Stakes Leaderboard
                </h2>
                <p className="text-muted-foreground mt-2">Ranked by total wagered amount this month.</p>
              </div>
              {metadata && (
                <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap mb-2">
                  Updated {new Date(metadata.last_updated).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <MonolithLeaderboard entries={entries.slice(0, 10)} />

          <div className="flex justify-center mt-8">
            <Link 
              href="/leaderboard" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 shadow-glow-lg"
            >
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      <BonusesSection
        cards={homepageBonusItems}
        title={<>Exclusive <span className="text-primary">Casino Rewards</span></>}
        className="public-section py-20 border-t border-border-dark"
        containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        gridClassName="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3"
        showDisclaimer={false}
      />

      <VideosSection clips={clips} />
      <CommunitySection socialLinks={socialLinks} />
    </main>
  );
}
