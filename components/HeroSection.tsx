import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  /** Slot for logo (e.g. Image or AnimatedLogo) */
  logo: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  className?: string;
}

/**
 * Stitch-aligned hero: logo, headline, subtitle, two CTAs.
 * Uses theme tokens (primary, border-border-dark, bg-card, etc.) for reuse.
 */
export function HeroSection({
  logo,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 lg:py-32 border-b border-border-dark",
        "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background-dark to-background-dark",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 p-4 bg-primary/5 rounded-full border border-primary/20">
            {logo}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase italic">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={primaryCta.href}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform glow-primary inline-block"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="bg-card border border-border-dark px-10 py-4 rounded-xl font-black text-lg hover:bg-border-dark transition-colors inline-block"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
