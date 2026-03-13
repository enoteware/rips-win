import Image from 'next/image';
import Link from 'next/link';
import { MarketGuidanceBanner } from '@/components/MarketGuidanceBanner';
import { LOGO, ICONS } from '@/lib/brand';
import type { SocialLink } from '@/lib/social-links';
import type { Market, MarketSource } from '@/lib/stake';

interface SiteFooterProps {
  socialLinks?: SocialLink[];
  market: Market;
  source: MarketSource;
  country: string | null;
  stakeUrl: string;
  marketLabel: string;
}

const NAV_LINKS = [
  { href: '/', label: 'Home', external: false },
  { href: '/leaderboard', label: 'Leaderboard', external: false },
  { href: '/bonuses', label: 'Bonuses', external: false },
] as const;

export function SiteFooter({
  socialLinks = [],
  market,
  source,
  country,
  stakeUrl,
  marketLabel,
}: SiteFooterProps) {
  return (
    <footer className="public-section border-t border-border-dark">
      <MarketGuidanceBanner market={market} source={source} country={country} />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src={LOGO.main} alt="RIPS" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tighter text-primary font-display">RIPS</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social icons — DB-driven, icon only */}
          <div className="flex items-center gap-3 shrink-0">
            {socialLinks.length > 0
              ? socialLinks.map((link) => {
                  const iconSrc = ICONS[link.icon as keyof typeof ICONS] || ICONS.globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-8 h-8"
                    >
                      <Image src={iconSrc} alt="" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })
              : (
                <a href={stakeUrl} target="_blank" rel="noopener noreferrer" aria-label={marketLabel}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-8 h-8">
                  <Image src={ICONS.globe} alt="" width={20} height={20} className="w-5 h-5" />
                </a>
              )}
          </div>
        </div>
      </div>
    </footer>
  );
}
