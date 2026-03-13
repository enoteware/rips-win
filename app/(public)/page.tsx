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
import { LeaderboardCountdown } from '@/components/LeaderboardCountdown';
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
            width={600}
            height={400}
            className="w-[60vw] md:w-[50vw] max-w-[600px] h-auto"
          />
        }
        title={
          <>
            Live Casino <span className="text-primary">Action</span> & High Stakes Gambling
          </>
        }
        subtitle="Official Website"
        primaryCta={{ label: 'CLAIM BONUSES', href: '/bonuses' }}
        secondaryCta={{ label: 'VIEW LEADERBOARD', href: '/leaderboard' }}
      />

      {/* Leaderboard Section */}
      <section id="leaderboard" className="public-section scroll-mt-20 py-20 border-t border-border-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col items-center text-center relative z-10 gap-3">
            {/* Prize pool amount — Cabrzy-style giant neon number */}
            <div className="font-display text-7xl md:text-9xl font-black text-primary drop-shadow-glow-logo leading-none tracking-tighter italic">
              $1,000
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-black uppercase tracking-widest italic text-foreground/90">
              Monthly Leaderboard
            </h2>
            {metadata && (
              <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
                Updated {new Date(metadata.last_updated).toLocaleDateString()}
              </span>
            )}
          </div>

          <LeaderboardCountdown />
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
        title={<>Enjoy Exclusive <span className="text-primary">Bonuses</span></>}
        className="public-section py-20 border-t border-border-dark"
        containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        gridClassName="mx-auto flex flex-wrap justify-center max-w-6xl gap-8 [&>*]:w-full [&>*]:md:w-[calc(50%-1rem)] [&>*]:xl:w-[calc(33.333%-1.375rem)]"
        showDisclaimer={false}
        compactCards
        showTextList
      />

      <VideosSection clips={clips} />
      <CommunitySection socialLinks={socialLinks} />
    </main>
  );
}
