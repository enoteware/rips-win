import Image from 'next/image';
import Link from 'next/link';
import { MarketGuidanceBanner } from '@/components/MarketGuidanceBanner';
import { LOGO, ICONS } from '@/lib/brand';
import type { SocialLink } from '@/lib/social-links';
import type { Market, MarketSource } from '@/lib/stake';

const footerLegal = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
] as const;

interface SiteFooterProps {
  socialLinks?: SocialLink[];
  market: Market;
  source: MarketSource;
  country: string | null;
  stakeUrl: string;
  marketLabel: string;
}

export function SiteFooter({
  socialLinks = [],
  market,
  source,
  country,
  stakeUrl,
  marketLabel,
}: SiteFooterProps) {
  const footerPlatform = [
    { href: stakeUrl, label: 'Games', external: true },
    { href: '/leaderboard', label: 'Leaderboard', external: false },
    { href: '/bonuses', label: 'Promotions', external: false },
    { href: stakeUrl, label: 'Affiliate', external: true },
  ] as const;

  const footerSupport = [
    { href: stakeUrl, label: 'Help Center', external: true },
    { href: stakeUrl, label: 'Contact Us', external: true },
    { href: stakeUrl, label: 'Responsible Gaming', external: true },
    { href: stakeUrl, label: 'Fairness', external: true },
  ] as const;

  return (
    <footer className="public-section border-t border-border-dark pb-12">
      <MarketGuidanceBanner market={market} source={source} country={country} />
      <div className="max-w-7xl mx-auto px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image src={LOGO.main} alt="" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold tracking-tighter text-primary font-display">RIPS</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The world&apos;s premier destination for live casino streaming and high-stakes gambling action. Play smart, play elite.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-foreground uppercase text-sm">Platform</h5>
            <ul className="space-y-4 text-muted-foreground text-sm">
              {footerPlatform.map(({ href, label, external }) => (
                <li key={label}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="hover:text-primary transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-foreground uppercase text-sm">Support</h5>
            <ul className="space-y-4 text-muted-foreground text-sm">
              {footerSupport.map(({ href, label, external }) => (
                <li key={label}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      {label}
                    </a>
                  ) : (
                    <a href={href} className="hover:text-primary transition-colors">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-foreground uppercase text-sm">Legal</h5>
            <ul className="space-y-4 text-muted-foreground text-sm">
              {footerLegal.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Rips Gaming. All rights reserved. Gambling can be addictive. Please play responsibly. Use the {marketLabel} link for your region.
          </p>
          <div className="flex gap-4">
            {socialLinks.length > 0
              ? socialLinks.map((link) => {
                  const iconSrc = ICONS[link.icon as keyof typeof ICONS] || ICONS.globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center w-8 h-8"
                      aria-label={link.label}
                    >
                      <Image src={iconSrc} alt="" width={20} height={20} className="w-5 h-5" />
                    </a>
                  );
                })
              : (
                <>
                  <a href={stakeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center w-8 h-8" aria-label={marketLabel}>
                    <Image src={ICONS.globe} alt="" width={20} height={20} className="w-5 h-5" />
                  </a>
                </>
              )}
          </div>
        </div>
      </div>
    </footer>
  );
}
