import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ICONS } from "@/lib/brand";

export interface RaffleCtaSectionProps {
  /** Optional stats to show (e.g. "Your Tickets", "Total Entries") */
  stats?: Array<{ label: string; value: string }>;
  /** Optional countdown or highlight text in the circle */
  countdown?: string;
  countdownLabel?: string;
  className?: string;
}

/**
 * Stitch-aligned raffle CTA block: badge, headline, primary CTA, optional circle visual.
 * Uses theme tokens for reuse.
 */
export function RaffleCtaSection({
  stats,
  countdown,
  countdownLabel,
  className,
}: RaffleCtaSectionProps) {
  return (
    <section
      className={cn(
        "py-20 bg-card relative overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-background border border-primary/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
              <Image src={ICONS.raffle} alt="" width={24} height={24} className="w-6 h-6 text-primary" aria-hidden />
              WEEKLY RAFFLE
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
              $10,000 PRIZE POOL
            </h2>
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-border-dark/50 p-4 rounded-lg"
                  >
                    <div className="text-muted-foreground text-xs uppercase font-bold mb-1">
                      {label}
                    </div>
                    <div className="text-2xl font-black">{value}</div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/raffle"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-black uppercase text-lg glow-primary inline-block hover:opacity-90 transition-opacity"
            >
              VIEW RAFFLE
            </Link>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="relative size-64 md:size-80">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10 border-4 border-primary/50 rounded-full size-full flex flex-col items-center justify-center text-center p-8 bg-background">
<Image src={ICONS.raffle} alt="" width={48} height={48} className="w-12 h-12 text-primary mb-2" aria-hidden />
                <div className="text-sm text-muted-foreground uppercase font-bold">
                  {countdownLabel ?? "Weekly draw"}
                </div>
                {countdown && (
                  <div className="text-2xl font-black text-foreground mt-2">
                    {countdown}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
