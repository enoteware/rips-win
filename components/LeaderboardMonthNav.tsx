"use client";

import { useRouter, useSearchParams } from "next/navigation";

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** History/clock icon */
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

export function LeaderboardMonthNav({
  currentMonth,
  availableMonths,
}: {
  currentMonth: string;
  availableMonths: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortedMonths = [...availableMonths].sort();
  const currentIndex = sortedMonths.indexOf(currentMonth);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sortedMonths.length - 1;

  function navigate(monthKey: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", monthKey);
    router.push(`/leaderboard?${params.toString()}`);
  }

  // Viewing a past month — show button with month label to go back to current
  if (hasNext) {
    return (
      <button
        onClick={() => navigate(sortedMonths[currentIndex + 1])}
        className="inline-flex items-center gap-2 bg-[#1a1a2e] text-foreground font-display text-sm md:text-base font-bold uppercase tracking-wider px-8 py-3 rounded-xl border-2 border-border-dark hover:bg-[#252540] transition-all"
      >
        <HistoryIcon />
        {formatMonthLabel(currentMonth)}
      </button>
    );
  }

  // On current month — always show PREVIOUS button
  return (
    <button
      onClick={() => hasPrev && navigate(sortedMonths[currentIndex - 1])}
      disabled={!hasPrev}
      className="inline-flex items-center gap-2 bg-[#1a1a2e] text-foreground font-display text-sm md:text-base font-bold uppercase tracking-wider px-8 py-3 rounded-xl border-2 border-border-dark hover:bg-[#252540] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <HistoryIcon />
      Previous
    </button>
  );
}
