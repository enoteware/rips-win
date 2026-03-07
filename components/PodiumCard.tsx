import Image from "next/image";
import { formatMoney } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ICONS } from "@/lib/brand";

const PRIZE_LABELS: Record<number, string> = {
  1: "$50,000 Prize",
  2: "$30,000 Prize",
  3: "$20,000 Prize",
};

export interface PodiumCardProps {
  entry: LeaderboardEntry | undefined;
  place: 1 | 2 | 3;
  className?: string;
  barClass?: string;
}

export function PodiumCard({ entry, place, className, barClass }: PodiumCardProps) {
  const isFirst = place === 1;
  const defaultBarClass =
    place === 1 ? "bg-primary" : place === 2 ? "bg-podium-2" : "bg-podium-3";

  return (
    <div
      className={cn(
        "rounded-xl flex flex-col items-center p-8 relative overflow-hidden",
        "border-border-dark",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-full",
          isFirst ? "h-2" : "h-1",
          barClass ?? defaultBarClass
        )}
      />
      {isFirst && (
        <Image
          src={ICONS.trophy}
          alt=""
          width={48}
          height={48}
          className="text-primary w-12 h-12 mb-4"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "rounded-full overflow-hidden border-2 mb-4",
          isFirst && "size-20 border-primary bg-primary/20",
          place === 2 && !isFirst && "size-16 border-podium-2",
          place === 3 && "size-14 border-podium-3"
        )}
      >
        {entry?.avatar_url ? (
          <img
            src={entry.avatar_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>
      <div
        className={cn(
          isFirst ? "text-2xl font-black uppercase" : "text-lg font-bold"
        )}
      >
        {entry?.player_name ?? `#${place}`}
      </div>
      <div className="text-primary font-mono">
        {entry ? formatMoney(entry.total_wagered) : "—"}
      </div>
      {PRIZE_LABELS[place] && (
        <div
          className={cn(
            "mt-4 px-4 py-1 rounded-lg text-sm font-bold",
            isFirst && "bg-primary text-primary-foreground",
            place === 2 && "bg-podium-2/20 text-podium-2",
            place === 3 && "bg-podium-3/20 text-podium-3"
          )}
        >
          {PRIZE_LABELS[place]}
        </div>
      )}
    </div>
  );
}
