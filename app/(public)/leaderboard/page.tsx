export const dynamic = 'force-dynamic';

import { getMetadata, getLeaderboard } from '@/lib/db';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';
import { LeaderboardCountdown } from '@/components/LeaderboardCountdown';

export default async function LeaderboardPage() {
  const period = 'all_time';
  const [entries, metadata, site] = await Promise.all([
    getLeaderboard(period, true),
    getMetadata(period),
    getSiteSettingsWithFallback(),
  ]);

  return (
    <main className="public-page min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header / Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground md:text-4xl">Casino Leaderboard</h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/30">
              CODE: {site.welcome_code}
            </span>
          </div>
          <p className="text-muted-foreground font-medium">
            High-stakes racing & exclusive rewards. Ranked by total wagered.
          </p>
          {metadata && (
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date(metadata.last_updated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border-dark p-5 rounded-xl">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Welcome Code</p>
            <p className="text-2xl font-bold text-primary">{site.welcome_code}</p>
          </div>
          <div className="bg-card border border-border-dark p-5 rounded-xl">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Rakeback</p>
            <p className="text-2xl font-bold text-foreground">{site.rakeback_pct}%</p>
          </div>
          <div className="bg-card border border-border-dark p-5 rounded-xl col-span-2 md:col-span-1">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Period</p>
            <p className="text-2xl font-bold text-foreground">Monthly</p>
          </div>
        </div>

        {/* Countdown */}
        <LeaderboardCountdown />

        {/* Leaderboard */}
        <MonolithLeaderboard entries={entries} />
      </div>
    </main>
  );
}
