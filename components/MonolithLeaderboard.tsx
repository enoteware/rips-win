"use client";

import { formatMoney } from "@/lib/utils";

const PRIZES: Record<number, number> = {
  1: 75000, 2: 25000, 3: 12500,
  4: 3000, 5: 2500, 6: 2000, 7: 1750, 8: 1500, 9: 1250, 10: 1000,
  11: 900, 12: 900, 13: 900, 14: 900, 15: 900,
  16: 800, 17: 800,
  18: 700, 19: 700, 20: 700, 21: 700, 22: 700,
  23: 500, 24: 500, 25: 500, 26: 500, 27: 500, 28: 500,
  29: 400, 30: 400, 31: 400, 32: 400, 33: 400, 34: 400, 35: 400, 36: 400, 37: 400, 38: 400,
  39: 300, 40: 300, 41: 300, 42: 300, 43: 300, 44: 300, 45: 300,
  46: 200, 47: 200, 48: 200, 49: 200, 50: 200, 51: 200,
  52: 150, 53: 150, 54: 150, 55: 150, 56: 150, 57: 150, 58: 150, 59: 150, 60: 150, 61: 150,
  62: 125, 63: 125, 64: 125, 65: 125, 66: 125, 67: 125, 68: 125, 69: 125, 70: 125, 71: 125,
  72: 100, 73: 100, 74: 100, 75: 100, 76: 100, 77: 100, 78: 100, 79: 100, 80: 100, 81: 100,
  82: 75, 83: 75, 84: 75, 85: 75, 86: 75, 87: 75, 88: 75, 89: 75, 90: 75, 91: 75,
  92: 50, 93: 50, 94: 50, 95: 50, 96: 50, 97: 50, 98: 50, 99: 50, 100: 50, 101: 50,
};

interface Entry {
  id: string | number;
  rank: number;
  player_name: string | null;
  total_wagered: number;
  avatar_url?: string | null;
}

/** Spiral/swirl avatar placeholder matching Cabrzy's style */
function AvatarSpiral({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="3" fill="none" opacity="0.3" />
      <path
        d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 16c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 24c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="3" fill={color} />
    </svg>
  );
}

const CARD_CONFIG: Record<number, {
  borderColor: string;
  cardBg: string;
  textColor: string;
  prizeBarBg: string;
  prizeBarText: string;
  spiralColor: string;
  rankColor: string;
  glowShadow: string;
}> = {
  1: {
    borderColor: "border-[#FFD700]",
    cardBg: "bg-[#0e0e08]",
    textColor: "text-white",
    prizeBarBg: "bg-[#FFD700]",
    prizeBarText: "text-black",
    spiralColor: "#FFD700",
    rankColor: "text-[#53FC18]",
    glowShadow: "shadow-[0_0_60px_rgba(255,215,0,0.15)]",
  },
  2: {
    borderColor: "border-[#9CA3AF]",
    cardBg: "bg-[#151518]",
    textColor: "text-white",
    prizeBarBg: "bg-[#6B7280]",
    prizeBarText: "text-white",
    spiralColor: "#C0C0C0",
    rankColor: "text-[#C0C0C0]",
    glowShadow: "",
  },
  3: {
    borderColor: "border-[#CD7F32]",
    cardBg: "bg-[#1a1410]",
    textColor: "text-white",
    prizeBarBg: "bg-[#CD7F32]",
    prizeBarText: "text-white",
    spiralColor: "#CD7F32",
    rankColor: "text-[#CD7F32]",
    glowShadow: "",
  },
};

function PodiumCard({
  entry,
  rank,
  size,
}: {
  entry: Entry | undefined;
  rank: 1 | 2 | 3;
  size: "lg" | "sm";
}) {
  const cfg = CARD_CONFIG[rank];
  const isLg = size === "lg";

  return (
    <div
      className={`
        relative flex flex-col items-center
        ${cfg.cardBg} border-2 ${cfg.borderColor} rounded-xl overflow-hidden
        ${isLg ? "min-h-[300px] md:min-h-[380px]" : "min-h-[240px] md:min-h-[300px]"}
        ${cfg.glowShadow}
        transition-transform duration-300 hover:-translate-y-1
      `}
    >
      {/* Card body */}
      <div className={`flex flex-col items-center justify-center flex-1 w-full ${isLg ? "px-8 pt-6 pb-4" : "px-6 pt-5 pb-3"}`}>
        {/* Rank number top-left */}
        <div className="absolute top-3 left-4">
          <span className={`font-display text-xl font-bold ${cfg.rankColor}`}>
            {rank}
          </span>
        </div>

        {/* Avatar spiral */}
        <div className={`${isLg ? "mb-4" : "mb-3"}`}>
          <AvatarSpiral color={cfg.spiralColor} size={isLg ? 120 : 80} />
        </div>

        {/* Player name */}
        <div className={`font-display font-bold text-center uppercase tracking-tight mb-1 ${isLg ? "text-lg md:text-xl" : "text-base md:text-lg"} ${cfg.textColor}`}>
          {entry?.player_name || "---"}
        </div>

        {/* Wagered label + amount */}
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Wagered
        </div>
        <div className={`font-mono font-bold text-primary ${isLg ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>
          {entry ? formatMoney(entry.total_wagered) : "---"}
        </div>
      </div>

      {/* Prize bar at bottom */}
      {entry && PRIZES[rank] && (
        <div className={`w-full ${cfg.prizeBarBg} py-3 flex items-center justify-center`}>
          <span className={`font-display ${isLg ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"} font-black ${cfg.prizeBarText}`}>
            ${PRIZES[rank].toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

export function LeaderboardPodium({ entries }: { entries: Entry[] }) {
  const top3 = entries.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end w-full max-w-5xl mx-auto">
      {/* 2nd place */}
      <div className="md:order-1 order-2">
        <PodiumCard entry={second} rank={2} size="sm" />
      </div>
      {/* 1st place */}
      <div className="md:order-2 order-1">
        <PodiumCard entry={first} rank={1} size="lg" />
      </div>
      {/* 3rd place */}
      <div className="md:order-3 order-3">
        <PodiumCard entry={third} rank={3} size="sm" />
      </div>
    </section>
  );
}

export function LeaderboardTable({ entries }: { entries: Entry[] }) {
  const rest = entries.slice(3);
  if (rest.length === 0) return null;

  return (
    <section className="border border-border-dark rounded-lg overflow-hidden w-full max-w-5xl mx-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-dark/50 border-b border-border-dark">
            <th className="text-left font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-3 px-4 md:px-6 w-16">
              Rank
            </th>
            <th className="text-left font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-3 px-4 md:px-6">
              User
            </th>
            <th className="text-right font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-3 px-4 md:px-6">
              Wagered
            </th>
            <th className="text-right font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground py-3 px-4 md:px-6 w-24">
              Prize
            </th>
          </tr>
        </thead>
        <tbody>
          {rest.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-border-dark last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <td className="font-mono text-sm text-muted-foreground py-3 px-4 md:px-6">
                {entry.rank}
              </td>
              <td className="font-display font-semibold text-sm md:text-base text-foreground uppercase tracking-tight py-3 px-4 md:px-6">
                {entry.player_name || "Unknown"}
              </td>
              <td className="font-mono text-sm text-foreground text-right py-3 px-4 md:px-6">
                {formatMoney(entry.total_wagered)}
              </td>
              <td className="font-mono text-sm font-bold text-primary text-right py-3 px-4 md:px-6">
                {PRIZES[entry.rank]
                  ? `$${PRIZES[entry.rank].toLocaleString()}`
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** @deprecated Use LeaderboardPodium + LeaderboardTable separately */
export function MonolithLeaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <LeaderboardPodium entries={entries} />
      <LeaderboardTable entries={entries} />
    </div>
  );
}
