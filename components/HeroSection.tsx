import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  /** Slot for logo (e.g. Image or AnimatedLogo) */
  logo: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** Anchor id of the next section for "Explore More" chevron */
  exploreAnchor?: string;
  className?: string;
}

/**
 * Cabrzy-style full-viewport hero: giant logo, tagline, two CTAs, explore-more chevron.
 */
export function HeroSection({
  logo,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  exploreAnchor = "leaderboard",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "public-hero min-h-[100dvh] flex flex-col border-b border-border-dark",
        className
      )}
    >
      {/* Topographic contour lines overlay */}
      {/* Topographic contour lines — animated slow pulse */}
      <div
        className="topo-ripple pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-radial-gradient(ellipse at 50% 40%, transparent, transparent 48px, rgba(83,252,24,0.55) 48px, rgba(83,252,24,0.55) 49px)`,
        }}
      />

      {/* sr-only h1 for SEO */}
      <h1 className="sr-only">{title}</h1>

      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pb-[20vh]">
        {/* Logo — large, no bubble */}
        <div className="mb-6 drop-shadow-glow-logo">
          {logo}
        </div>

        {/* Tagline */}
        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-muted-foreground mb-8">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={primaryCta.href}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-base uppercase tracking-widest hover:scale-105 transition-transform shadow-glow-lg inline-block"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="bg-transparent border border-border-dark px-10 py-4 rounded-xl font-black text-base uppercase tracking-widest hover:bg-white/5 transition-colors inline-block"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* Explore More anchor */}
      <div className="pb-10 flex flex-col items-center gap-2 relative z-10">
        <a
          href={`#${exploreAnchor}`}
          className="flex flex-col items-center gap-1 group text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Explore More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  );
}
