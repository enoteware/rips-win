import Image from 'next/image';

export const metadata = {
  title: 'Bonuses - RIPS.WIN',
  description: 'Exclusive RIPS.WIN bonus offers for Stake.us and Stake.com. Use code RIPS for 3.5% rakeback.',
};

function stakeUsLink(): string {
  const base = process.env.NEXT_PUBLIC_STAKE_US_LINK ?? 'https://stake.us/';
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}?offer=rips&c=selling`;
}

function stakeComLink(): string {
  const base = process.env.NEXT_PUBLIC_STAKE_COM_LINK ?? 'https://stake.com/';
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}?offer=rips&c=selling`;
}

export default function BonusesPage() {
  return (
    <main className="min-h-screen bg-background-dark py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic md:text-5xl">
            Enjoy <span className="text-primary">Exclusive Bonuses</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stake.com */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border-dark bg-card">
            <div className="relative w-full aspect-square">
              <Image
                src="/stakecom-promo.jpg"
                alt="Stake.com – GET 3.5% RAKEBACK, USE CODE: RIPS"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-4">
              <a
                href={stakeComLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-primary-foreground text-center font-black uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-glow-lg"
              >
                CLAIM NOW
              </a>
            </div>
          </div>

          {/* Stake.us */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border-dark bg-card">
            <div className="relative w-full aspect-square">
              <Image
                src="/stakeus-promo.jpg"
                alt="Stake.us – INSTANT 3.5% RAKEBACK, 25 STAKE CASH, 250,000 GOLD COINS, USE CODE: RIPS"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-4">
              <a
                href={stakeUsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-primary-foreground text-center font-black uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-glow-lg"
              >
                CLAIM NOW
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Must be 21+ and in an eligible location. Gambling involves risk. Please gamble responsibly.
        </p>
      </div>
    </main>
  );
}
