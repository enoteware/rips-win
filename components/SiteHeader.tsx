'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label="RIPS Home"
            >
              <Image
                src={LOGO.main}
                alt="RIPS"
                width={96}
                height={96}
                className="h-20 md:h-24 w-auto object-contain"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6" aria-label="Main">
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
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors hidden md:inline-block"
            >
              LOGIN
            </Link>
            <Link
              href="/bonuses"
              className="bg-primary text-primary-foreground text-sm font-bold px-6 py-2 rounded-xl glow-primary hidden md:inline-block hover:opacity-90 transition-opacity"
            >
              SIGN UP
            </Link>
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
        className={menuOpen ? 'block border-t border-border-dark bg-background md:hidden' : 'hidden md:hidden'}
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
          <Link href="/admin/login" className="py-3 text-sm font-bold text-foreground hover:text-primary" onClick={() => setMenuOpen(false)}>
            LOGIN
          </Link>
          <Link href="/bonuses" className="py-3 text-sm font-bold text-primary" onClick={() => setMenuOpen(false)}>
            SIGN UP
          </Link>
        </nav>
      </div>
    </header>
  );
}
