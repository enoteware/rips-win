export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getLeaderboard, getMetadata } from '@/lib/db';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';
import { MonolithLeaderboard } from '@/components/MonolithLeaderboard';

export default async function LeaderboardPage() {
  const period = 'all_time';
  const [entries, metadata, site] = await Promise.all([
    getLeaderboard(period, true),
    getMetadata(period),
    getSiteSettingsWithFallback(),
  ]);

  return (
    <main className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              High Stakes Leaderboard
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/30">
              CODE: {site.welcome_code}
            </span>
          </div>
          <p className="text-muted-foreground">
            Ranked by total wagered amount. Use code <span className="text-primary font-bold">{site.welcome_code}</span> for {site.rakeback_pct}% rakeback.
          </p>
          {metadata && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(metadata.last_updated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
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
            <p className="text-2xl font-bold text-foreground">All Time</p>
          </div>
        </div>

        {/* Leaderboard */}
        <MonolithLeaderboard entries={entries} />

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
