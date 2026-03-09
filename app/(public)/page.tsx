export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { LOGO } from '@/lib/brand';
import { getLeaderboard, getMetadata } from "@/lib/db";
import { getSiteSettingsWithFallback } from "@/lib/site-settings";
import { formatMoney, formatStreak } from '@/lib/utils';
import { HeroSection } from '@/components/HeroSection';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';
import { TectonicOfferCard } from '@/components/TectonicOfferCard';
import { VideosSection } from '@/components/VideosSection';
import { CommunitySection } from '@/components/CommunitySection';

const STAKE_TRACKING = '?offer=rips&c=selling';

function stakeUsLink(base: string): string {
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}${STAKE_TRACKING}`;
}

function stakeComLink(base: string): string {
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}${STAKE_TRACKING}`;
}

export default async function Home() {
  const period = 'all_time';
  const [entries, metadata, site] = await Promise.all([
    getLeaderboard(period, true),
    getMetadata(period),
    getSiteSettingsWithFallback(),
  ]);
  const welcomeCode = site.welcome_code;
  const rakeback = site.rakeback_pct;
  const stakeUs = stakeUsLink(site.stake_us_link);
  const stakeCom = stakeComLink(site.stake_com_link);


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
      <section id="leaderboard" className="scroll-mt-20 py-20 bg-background-dark border-t border-border-dark overflow-hidden relative">
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

      {/* Exclusive Bonuses */}
      <section className="py-20 bg-background-dark border-t border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-black mb-12 uppercase italic tracking-tighter">
            Exclusive <span className="text-primary">Casino Rewards</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-4 lg:gap-8 items-center md:items-stretch perspective-[1000px] py-4">
            <TectonicOfferCard
              tierName="Welcome"
              offerType="Initial Deposit"
              value={<><span className="text-2xl mr-1 align-top text-primary">$</span>25</>}
              description="Initial tectonic deposit match. Claim your welcome bonus on Stake.us."
              promoCode={welcomeCode}
              cta="Ignite Offer"
              href={stakeUs}
              image="/images/bonus_welcome.png"
            />
            
            <TectonicOfferCard
              tierName="Deposit Match"
              offerType="Gilded Tier"
              value={<>200<span className="text-2xl ml-1 align-top text-primary">%</span></>}
              description="Pressure-hardened rewards for the elite. Double your first deposit on Stake.com."
              promoCode="BONUS200"
              cta="Fracture Now"
              href={stakeCom}
              highlight={true}
              image="/images/bonus_deposit.png"
            />

            <TectonicOfferCard
              tierName="Rakeback"
              offerType="Deep Core"
              value={<>{rakeback}<span className="text-2xl ml-1 align-top text-primary">%</span></>}
              description="The ultimate geological event. Get instant rakeback on every single bet you place."
              promoCode={welcomeCode}
              cta="Claim Apex"
              href={stakeUs}
              image="/images/bonus_rakeback.png"
            />
          </div>
        </div>
      </section>

      <VideosSection />
      <CommunitySection />
    </main>
  );
}
