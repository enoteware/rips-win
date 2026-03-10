export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { getBonusCards } from '@/lib/bonuses';

export const metadata = {
  title: 'Bonuses - RIPS.WIN',
  description: 'Exclusive RIPS.WIN bonus offers for Stake.us and Stake.com.',
};

export default async function BonusesPage() {
  const cards = await getBonusCards(true);

  return (
    <main className="public-page min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic md:text-5xl">
            Exclusive <span className="text-primary">Bonuses</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Claim your exclusive casino rewards and bonuses
          </p>
        </div>

        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground">No bonuses available at the moment. Check back soon!</p>
        ) : (
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bonus-card flex flex-col overflow-hidden border-2 border-border bg-card shadow-hard-lg"
              >
                {card.image_url && (
                  <div className="relative w-full bg-muted">
                    <Image
                      src={card.image_url}
                      alt={card.headline}
                      width={800}
                      height={450}
                      className="w-full h-auto object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {card.subtitle && (
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {card.subtitle}
                    </p>
                  )}
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                    {card.headline}
                  </h2>
                  {card.badge_text && (
                    <span className="mt-2 inline-block text-xs font-bold uppercase bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 w-fit">
                      {card.badge_text}
                    </span>
                  )}
                  {card.promo_code && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Use Code:</span>
                      <span className="font-mono font-black text-primary">{card.promo_code}</span>
                    </div>
                  )}
                  {card.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  )}
                  <div className="mt-auto pt-6">
                    <a
                      href={card.cta_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-primary text-primary-foreground rounded-xl font-black py-3 px-6 uppercase tracking-widest glow-primary hover:scale-105 transition-transform"
                    >
                      {card.cta_text}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Must be 21+ and in an eligible location. Gambling involves risk. Please gamble responsibly.
        </p>
      </div>
    </main>
  );
}
