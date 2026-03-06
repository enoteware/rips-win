export const dynamic = 'force-dynamic';

import { getLeaderboard, getMetadata } from '@/lib/db';

export default async function Home() {
  const period = 'all_time';
  const entries = await getLeaderboard(period, true);
  const metadata = await getMetadata(period);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            RIPS.WIN
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Casino Leaderboard
          </p>
          
          {/* Referral Info */}
          <div className="inline-flex flex-col gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
            <div className="text-sm text-gray-400">Welcome Code</div>
            <div className="text-3xl font-mono font-bold text-purple-400">
              {process.env.NEXT_PUBLIC_WELCOME_CODE}
            </div>
            <div className="text-sm text-gray-400">
              {process.env.NEXT_PUBLIC_RAKEBACK}% Rakeback
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href={process.env.NEXT_PUBLIC_STAKE_US_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
              >
                Stake.us
              </a>
              <a
                href={process.env.NEXT_PUBLIC_STAKE_COM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition-colors"
              >
                Stake.com
              </a>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {metadata && (
          <div className="text-center text-sm text-gray-400 mb-8">
            Last updated: {new Date(metadata.last_updated).toLocaleString()}
          </div>
        )}

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-purple-900/50 font-semibold border-b border-purple-500/30">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-right">Wagered</div>
              <div className="text-right">Biggest Win</div>
              <div className="text-right">Streak</div>
            </div>

            {/* Entries */}
            {entries.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No leaderboard entries yet
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-5 gap-4 p-4 border-b border-purple-500/10 hover:bg-purple-900/20 transition-colors"
                >
                  <div className="font-bold text-2xl text-purple-400">
                    #{entry.rank}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.avatar_url && (
                      <img
                        src={entry.avatar_url}
                        alt={entry.player_name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="font-semibold">{entry.player_name}</span>
                  </div>
                  <div className="text-right text-green-400">
                    ${entry.total_wagered.toLocaleString()}
                  </div>
                  <div className="text-right text-yellow-400">
                    ${entry.biggest_win.toLocaleString()}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-600/50 text-sm font-semibold">
                      {entry.current_streak} 🔥
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
