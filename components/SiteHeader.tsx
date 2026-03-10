'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LOGO } from '@/lib/brand';

const navLinks = [
  { href: '/leaderboard', label: 'LEADERBOARD' },
  { href: '/bonuses', label: 'BONUSES' },
  { href: '/#videos', label: 'VIDEOS' },
  { href: '/#community', label: 'COMMUNITY' },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="public-chrome sticky top-0 z-50 w-full border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            aria-label="RIPS Home"
          >
            <Image
              src={LOGO.main}
              alt="RIPS"
              width={128}
              height={128}
              className="h-24 md:h-28 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center gap-7" aria-label="Main">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Button asChild variant="site" className="hidden h-auto px-5 py-3 md:inline-flex">
              <Link href="/bonuses">CLAIM BONUSES</Link>
            </Button>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-dark bg-card text-foreground hover:text-primary md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        id="mobile-nav"
        className={menuOpen ? 'public-chrome block border-t border-border-dark md:hidden' : 'hidden md:hidden'}
        aria-hidden={!menuOpen}
      >
        <nav className="max-w-7xl mx-auto flex flex-col gap-0 px-4 py-4" aria-label="Main mobile">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-3 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Button asChild variant="site" className="mt-3 inline-flex h-auto w-full px-5 py-3">
            <Link href="/bonuses" onClick={() => setMenuOpen(false)}>
              CLAIM BONUSES
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
