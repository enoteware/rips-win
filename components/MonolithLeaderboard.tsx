"use client";

import Image from "next/image";
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

function PodiumCard({
  entry,
  rank,
  size,
}: {
  entry: Entry | undefined;
  rank: 1 | 2 | 3;
  size: "lg" | "sm";
}) {
  const colors: Record<number, { text: string; glow: string; border: string }> = {
    1: { text: "text-primary", glow: "shadow-[0_0_40px_rgba(83,252,24,0.15)]", border: "border-primary/40" },
    2: { text: "text-[#C0C0C0]", glow: "", border: "border-[#C0C0C0]/30" },
    3: { text: "text-[#CD7F32]", glow: "", border: "border-[#CD7F32]/30" },
  };
  const c = colors[rank];
  const isLg = size === "lg";

  return (
    <div
      className={`
        relative flex flex-col items-center justify-end
        bg-background-dark border ${c.border} rounded-lg
        ${isLg ? "min-h-[280px] md:min-h-[340px] p-8 md:p-10" : "min-h-[220px] md:min-h-[280px] p-6 md:p-8"}
        ${isLg ? c.glow : ""}
        transition-transform duration-300 hover:-translate-y-1
      `}
    >
      {/* Rank badge */}
      <div className={`${isLg ? "mb-5" : "mb-4"}`}>
        <Image
          src={`/rank/rank-${rank}.svg`}
          alt={`Rank ${rank}`}
          width={isLg ? 64 : 48}
          height={isLg ? 64 : 48}
          className="drop-shadow-lg"
        />
      </div>

      {/* Player name */}
      <div className={`font-display font-bold text-center uppercase tracking-tight mb-1 ${isLg ? "text-xl md:text-2xl" : "text-lg md:text-xl"} ${rank === 1 ? c.text : "text-foreground"}`}>
        {entry?.player_name || "---"}
      </div>

      {/* Wagered label + amount */}
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
        Wagered
      </div>
      <div className="font-mono text-sm text-muted-foreground">
        {entry ? formatMoney(entry.total_wagered) : "---"}
      </div>

      {/* Prize */}
      {entry && PRIZES[rank] && (
        <div className={`font-mono text-sm font-bold mt-3 ${c.text}`}>
          ${PRIZES[rank].toLocaleString()}
        </div>
      )}
    </div>
  );
}

export function MonolithLeaderboard({ entries }: { entries: Entry[] }) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Top 3 Podium: 2nd - 1st - 3rd */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

      {/* Table for rank 4+ */}
      {rest.length > 0 && (
        <section className="border border-border-dark rounded-lg overflow-hidden">
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
      )}
    </div>
  );
}
