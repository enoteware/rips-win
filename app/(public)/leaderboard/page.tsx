export const dynamic = 'force-dynamic';

import { getLeaderboard, getAvailableMonths } from '@/lib/db';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';
import { LeaderboardCountdown } from '@/components/LeaderboardCountdown';
import { LeaderboardMonthNav } from '@/components/LeaderboardMonthNav';
import { Button } from '@/components/ui/button';

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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Prize pool heading */}
        {site.prize_pool && (
          <div className="text-center mb-2">
            <span className="font-display text-5xl md:text-7xl font-black text-primary drop-shadow-glow-logo">
              {site.prize_pool}
            </span>
          </div>
        )}

        {/* Subtitle */}
        <h1 className="text-center font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-8">
          Monthly Leaderboard
        </h1>

        {/* Top 3 Podium + Table */}
        <MonolithLeaderboard entries={entries} />

        {/* Countdown */}
        <div className="my-8">
          <LeaderboardCountdown />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-8">
          <a
            href={stakeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="font-display text-lg font-bold uppercase tracking-wider px-12 py-6">
              Play Now
            </Button>
          </a>
        </div>

        {/* Month navigation */}
        <div className="mb-8">
          <LeaderboardMonthNav
            currentMonth={monthKey}
            availableMonths={availableMonths}
          />
        </div>

        {/* Disclaimer */}
        <div className="text-center max-w-2xl mx-auto">
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
