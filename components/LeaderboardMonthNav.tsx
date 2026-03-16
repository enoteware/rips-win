"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

  if (sortedMonths.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        onClick={() => hasPrev && navigate(sortedMonths[currentIndex - 1])}
        className="font-mono text-xs uppercase tracking-widest"
      >
        Previous
      </Button>
      <span className="font-mono text-sm text-muted-foreground">
        {formatMonthLabel(currentMonth)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => hasNext && navigate(sortedMonths[currentIndex + 1])}
        className="font-mono text-xs uppercase tracking-widest"
      >
        Next
      </Button>
    </div>
  );
}
