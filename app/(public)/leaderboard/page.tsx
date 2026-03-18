export const dynamic = 'force-dynamic';

import { getLeaderboard, getAvailableMonths } from '@/lib/db';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';
import { LeaderboardPodium, LeaderboardTable } from '@/components/MonolithLeaderboard';
import { LeaderboardCountdown } from '@/components/LeaderboardCountdown';
import { LeaderboardMonthNav } from '@/components/LeaderboardMonthNav';

function getCurrentMonthKey(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const period = 'all_time';
  const currentMonthKey = getCurrentMonthKey();
  const monthKey = params.month || currentMonthKey;

  const [entries, site, availableMonths] = await Promise.all([
    getLeaderboard(period, true, monthKey),
    getSiteSettingsWithFallback(),
    getAvailableMonths(period),
  ]);

  const stakeLink = site.stake_us_link || 'https://stake.us/?offer=rips&c=selling';

  return (
    <main className="public-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* 1. Prize pool — massive green neon text */}
        {site.prize_pool && (
          <div className="text-center mb-3">
            <span
              className="font-display text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-black text-primary inline-block leading-[0.9]"
              style={{
                textShadow:
                  '0 0 20px rgba(83, 252, 24, 0.9), ' +
                  '0 0 60px rgba(83, 252, 24, 0.6), ' +
                  '0 0 120px rgba(83, 252, 24, 0.4), ' +
                  '0 0 200px rgba(83, 252, 24, 0.2), ' +
                  '0 0 300px rgba(83, 252, 24, 0.1)',
                WebkitTextStroke: '1px rgba(83, 252, 24, 0.3)',
              }}
            >
              {site.prize_pool}
            </span>
          </div>
        )}

        {/* 2. Subtitle */}
        <h1 className="text-center font-display text-xl md:text-2xl font-black uppercase italic tracking-tight text-foreground mb-10">
          Monthly Leaderboard
        </h1>

        {/* 3. Podium cards (top 3) */}
        <LeaderboardPodium entries={entries} prizes={site.prizes} />

        {/* 4. Divider */}
        <div className="my-10 border-t border-border-dark" />

        {/* 5. Countdown timer */}
        <LeaderboardCountdown />

        {/* 6. PLAY NOW + PREVIOUS buttons side by side */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-10">
          <a
            href={stakeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-sm md:text-base font-bold uppercase tracking-wider px-8 py-3 rounded-xl border-2 border-primary hover:brightness-110 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Play Now
          </a>
          <LeaderboardMonthNav
            currentMonth={monthKey}
            availableMonths={availableMonths}
          />
        </div>

        {/* 7. Table (rank 4+) */}
        <LeaderboardTable entries={entries} prizes={site.prizes} />

        {/* 8. Disclaimer */}
        <div className="text-center max-w-2xl mx-auto mt-10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Leaderboard rankings are based on a weighted wager system. Different game types
            contribute varying amounts toward your total wagered. Final rankings and prize
            distribution are determined at the end of each calendar month (UTC).
          </p>
        </div>
      </div>
    </main>
  );
}
