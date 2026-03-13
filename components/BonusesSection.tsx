import type { ReactNode } from 'react';
import Image from 'next/image';

export interface PublicBonusCardItem {
  id: string;
  headline: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  ctaText: string;
  ctaLink: string;
  promoCode?: string | null;
  badgeText?: string | null;
}

interface BonusesSectionProps {
  cards: PublicBonusCardItem[];
  title: ReactNode;
  subtitle?: ReactNode;
  titleAs?: 'h1' | 'h2';
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  emptyMessage?: string;
  showDisclaimer?: boolean;
}

export function BonusesSection({
  cards,
  title,
  subtitle,
  titleAs = 'h2',
  className = '',
  containerClassName = '',
  gridClassName = 'mx-auto grid max-w-4xl gap-8 md:grid-cols-2',
  emptyMessage = 'No bonuses available at the moment. Check back soon!',
  showDisclaimer = true,
}: BonusesSectionProps) {
  const TitleTag = titleAs;

  return (
    <section className={className}>
      <div className={containerClassName}>
        <div className="mb-12 text-center">
          <TitleTag className="text-5xl font-black uppercase tracking-tighter italic md:text-7xl">{title}</TitleTag>
          {subtitle ? <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p> : null}
        </div>

        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className={gridClassName}>
            {cards.map((card) => (
              <a
                key={card.id}
                href={card.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${card.headline} — ${card.ctaText}`}
                className="bonus-card group flex flex-col overflow-hidden border-2 border-border bg-card shadow-hard-lg transition-all hover:scale-[1.01] hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {card.imageUrl ? (
                  <div className="relative w-full bg-muted">
                    <Image
                      src={card.imageUrl}
                      alt={card.headline}
                      width={800}
                      height={450}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  {card.subtitle ? (
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {card.subtitle}
                    </p>
                  ) : null}
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">{card.headline}</h3>
                  {card.badgeText ? (
                    <span className="mt-2 inline-block w-fit rounded border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold uppercase text-primary">
                      {card.badgeText}
                    </span>
                  ) : null}
                  {card.promoCode ? (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Use Code:</span>
                      <span className="font-mono font-black text-primary">{card.promoCode}</span>
                    </div>
                  ) : null}
                  {card.description ? <p className="mt-3 text-sm text-muted-foreground">{card.description}</p> : null}
                  <div className="mt-auto pt-6">
                    <span className="glow-primary block w-full rounded-xl bg-primary px-6 py-3 text-center font-black uppercase tracking-widest text-primary-foreground transition-transform group-hover:scale-105">
                      {card.ctaText}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {showDisclaimer ? (
          <p className="mt-10 text-center text-xs text-muted-foreground">
            Must be 21+ and in an eligible location. Gambling involves risk. Please gamble responsibly.
          </p>
        ) : null}
      </div>
    </section>
  );
}