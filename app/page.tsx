export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { LOGO } from '@/lib/brand';
import { getLeaderboard, getMetadata } from "@/lib/db";
import { getSiteSettingsWithFallback } from "@/lib/site-settings";
import { HeroSection } from '@/components/HeroSection';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';
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
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                  High Stakes Leaderboard
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
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-black px-8 py-4 rounded-full uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 shadow-glow-lg"
            >
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Exclusive Bonuses */}
      <section className="py-20 bg-background-dark border-t border-border-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black mb-12 uppercase italic tracking-tighter">
            Enjoy <span className="text-primary">Exclusive Bonuses</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stake.com */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border-dark bg-card">
              <div className="relative w-full aspect-square">
                <Image
                  src="/stakecom-promo.jpg"
                  alt="Stake.com – GET 3.5% RAKEBACK, USE CODE: RIPS"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4">
                <a
                  href={stakeCom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-primary-foreground text-center font-black uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-glow-lg"
                >
                  CLAIM NOW
                </a>
              </div>
            </div>
            {/* Stake.us */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border-dark bg-card">
              <div className="relative w-full aspect-square">
                <Image
                  src="/stakeus-promo.jpg"
                  alt="Stake.us – INSTANT 3.5% RAKEBACK, 25 STAKE CASH, 250,000 GOLD COINS, USE CODE: RIPS"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4">
                <a
                  href={stakeUs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-primary-foreground text-center font-black uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-glow-lg"
                >
                  CLAIM NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideosSection />
      <CommunitySection />
    </main>
  );
}
