import Image from 'next/image';
import Link from 'next/link';
import { LOGO, ICONS } from '@/lib/brand';

const footerPlatform = [
  { href: '#', label: 'Games' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/bonuses', label: 'Promotions' },
  { href: '#', label: 'Affiliate' },
] as const;

const footerSupport = [
  { href: '#', label: 'Help Center' },
  { href: '#', label: 'Contact Us' },
  { href: '#', label: 'Responsible Gaming' },
  { href: '#', label: 'Fairness' },
] as const;

const footerLegal = [
  { href: '#', label: 'Terms of Service' },
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Cookie Policy' },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-background-dark border-t border-border-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {footerPlatform.map(({ href, label }) => (
                <li key={label}>
                  {href.startsWith('#') ? (
                    <a href={href} className="hover:text-primary transition-colors">
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
              {footerSupport.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-foreground uppercase text-sm">Legal</h5>
            <ul className="space-y-4 text-muted-foreground text-sm">
              {footerLegal.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Rips Gaming. All rights reserved. Gambling can be addictive. Please play responsibly.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center w-8 h-8" aria-label="Website">
              <Image src={ICONS.globe} alt="" width={20} height={20} className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center w-8 h-8" aria-label="Email">
              <Image src={ICONS.mail} alt="" width={20} height={20} className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center w-8 h-8" aria-label="Chat">
              <Image src={ICONS.chat} alt="" width={20} height={20} className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
