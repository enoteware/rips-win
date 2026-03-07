import { getLeaderboard, getMetadata } from '@/lib/db';
import { LeaderboardAdmin } from './LeaderboardAdmin';

const PERIODS = ['all_time', 'daily', 'weekly', 'monthly'] as const;

export default async function AdminLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period =
    PERIODS.includes(periodParam as (typeof PERIODS)[number]) ? periodParam! : 'all_time';
  const [entries, metadata] = await Promise.all([
    getLeaderboard(period, false),
    getMetadata(period),
  ]);

  return (
    <LeaderboardAdmin
      initialEntries={entries}
      initialPeriod={period}
      metadata={metadata}
      periods={PERIODS}
    />
  );
}
