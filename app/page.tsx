export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { LOGO } from '@/lib/brand';
import { getLeaderboard, getMetadata } from "@/lib/db";
import { getSiteSettingsWithFallback } from "@/lib/site-settings";
import { formatMoney, formatStreak } from '@/lib/utils';
import { HeroSection } from '@/components/HeroSection';
import { PodiumCard } from '@/components/PodiumCard';
import { BonusCard } from '@/components/BonusCard';
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

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const second = top3[1];
  const first = top3[0];
  const third = top3[2];

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
      <section id="leaderboard" className="scroll-mt-20 py-20 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                High Stakes Leaderboard
              </h2>
              <p className="text-muted-foreground mt-2">Ranked by total wagered amount this month.</p>
            </div>
            {metadata && (
              <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Updated {new Date(metadata.last_updated).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
            {/* 2nd */}
            <PodiumCard
              entry={second}
              place={2}
              className="order-2 md:order-1 h-64 bg-surface-dark/50 border border-border-dark"
              barClass="bg-podium-2"
            />
            {/* 1st */}
            <PodiumCard
              entry={first}
              place={1}
              className="order-1 md:order-2 h-80 bg-surface-dark border-2 border-primary/50 podium-1 shadow-glow-lg"
              barClass="bg-primary"
            />
            {/* 3rd */}
            <PodiumCard
              entry={third}
              place={3}
              className="order-3 h-56 bg-surface-dark/50 border border-border-dark"
              barClass="bg-podium-3"
            />
          </div>

          {/* Table */}
          <div className="bg-surface-dark rounded-xl overflow-hidden border border-border-dark">
            <table className="w-full text-left">
              <thead className="bg-border-dark/50 border-b border-border-dark">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Player</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">Wagered</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">Biggest Win</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {rest.length === 0 && top3.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No leaderboard entries yet.
                    </td>
                  </tr>
                ) : (
                  rest.map((entry) => (
                    <tr key={entry.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-muted-foreground">#{entry.rank}</td>
                      <td className="px-6 py-4 flex items-center gap-3 font-medium">
                        {entry.avatar_url ? (
                          <img
                            src={entry.avatar_url}
                            alt=""
                            className="size-8 rounded bg-border-dark overflow-hidden object-cover"
                          />
                        ) : (
                          <div className="size-8 rounded bg-border-dark" />
                        )}
                        {entry.player_name ?? 'Unknown'}
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">{formatMoney(entry.total_wagered)}</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">{formatMoney(entry.biggest_win)}</td>
                      <td className="px-6 py-4 text-right">{formatStreak(entry.current_streak)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Exclusive Bonuses */}
      <section className="py-20 bg-background-dark border-t border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black mb-12 uppercase italic tracking-tighter">
            Exclusive <span className="text-primary">Casino Rewards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BonusCard
              title={`${welcomeCode} Bonus`}
              description="Claim your welcome bonus with code RIPS on Stake.us."
              cta="CLAIM BONUS"
              href={stakeUs}
              primary
            />
            <BonusCard
              title="Stake.com 200%"
              description="Double your first deposit with BONUS200 on Stake.com."
              cta="CLAIM REWARD"
              href={stakeCom}
            />
            <BonusCard
              title={`RAKEBACK${rakeback}`}
              description={`Get ${rakeback}% rakeback on every bet, credited instantly.`}
              cta="ACTIVATE NOW"
              href={stakeUs}
            />
          </div>
        </div>
      </section>

      <VideosSection />
      <CommunitySection />
    </main>
  );
}
