export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { getLeaderboard, getMetadata } from '@/lib/db';
import { ICONS } from '@/lib/brand';
import { getSiteSettingsWithFallback } from '@/lib/site-settings';

function formatMoney(value: number | string | null | undefined): string {
  const n = value != null ? Number(value) : NaN;
  if (Number.isNaN(n) || n === 0) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatStreak(value: number | null | undefined): string {
  const n = value != null ? Number(value) : 0;
  if (n <= 0) return '—';
  return `${n} 🔥`;
}

export default async function LeaderboardPage() {
  const period = 'all_time';
  const [entries, metadata, site] = await Promise.all([
    getLeaderboard(period, true),
    getMetadata(period),
    getSiteSettingsWithFallback(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header / Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Casino Leaderboard</h1>
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
            <p className="text-2xl font-bold text-foreground">All time</p>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-card border border-border-dark rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Image src={ICONS.leaderboard} alt="" width={24} height={24} className="w-6 h-6 text-primary" aria-hidden />
              Top Competitors
            </h2>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to Home
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border-dark">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Wagered</th>
                  <th className="px-6 py-4 text-right">Biggest Win</th>
                  <th className="px-6 py-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark [&>tr:nth-child(even)]:bg-primary/[0.03]">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No leaderboard entries yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="group">
                      <td className="px-6 py-5">
                        <div
                          className={`size-8 rounded flex items-center justify-center font-bold border ${
                            entry.rank === 1
                              ? 'bg-primary/20 text-primary border-primary/50'
                              : entry.rank === 2
                                ? 'bg-slate-400/20 text-slate-400 border-slate-400/30'
                                : entry.rank === 3
                                  ? 'bg-amber-700/20 text-amber-700 border-amber-700/30'
                                  : 'text-muted-foreground border-border-dark'
                          }`}
                        >
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            {entry.avatar_url ? (
                              <img
                                src={entry.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="font-bold text-foreground">
                            {entry.player_name ?? 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium text-foreground">
                        {formatMoney(entry.total_wagered)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-primary font-bold text-lg">
                          {formatMoney(entry.biggest_win)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {formatStreak(entry.current_streak)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
