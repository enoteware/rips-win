import Image from 'next/image';

export const metadata = {
  title: 'Bonuses - RIPS.WIN',
  description: 'Exclusive RIPS.WIN bonus offers for Stake.us and Stake.com. Use code RIPS for 3.5% rakeback.',
};

const welcomeCode = process.env.NEXT_PUBLIC_WELCOME_CODE ?? 'RIPS';
const rakeback = process.env.NEXT_PUBLIC_RAKEBACK ?? '3.5';

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
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic md:text-5xl">
            Exclusive <span className="text-primary">Bonuses</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Use code <span className="font-mono font-bold text-primary">{welcomeCode}</span> to claim your rewards
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Stake.com Card */}
          <div className="bonus-card bonus-card-1 flex flex-col overflow-hidden border-2 border-border bg-card shadow-hard-lg">
            <div className="relative w-full bg-muted">
              <Image
                src="/stakecom-promo.jpg"
                alt="Stake.com"
                width={800}
                height={450}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Stake.com
              </p>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Get {rakeback}% Rakeback
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Use Code:</span>
                <span className="font-mono font-black text-primary">{welcomeCode}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Sign up on Stake.com with code{' '}
                <strong className="text-foreground">{welcomeCode}</strong> and receive{' '}
                {rakeback}% rakeback on every bet — automatically applied.
              </p>
              <div className="mt-auto pt-6">
                <a
                  href={stakeComLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary text-primary-foreground rounded-xl font-black py-3 px-6 uppercase tracking-widest glow-primary hover:scale-105 transition-transform"
                >
                  Claim on Stake.com
                </a>
              </div>
            </div>
          </div>

          {/* Stake.us Card */}
          <div className="bonus-card bonus-card-2 flex flex-col overflow-hidden border-2 border-border bg-card shadow-hard-lg">
            <div className="relative w-full bg-muted">
              <Image
                src="/stakeus-promo.jpg"
                alt="Stake.us"
                width={800}
                height={450}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Stake.us
              </p>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Get Instant {rakeback}% Rakeback
              </h2>
              <ul className="mt-2 space-y-0.5 text-sm font-semibold text-foreground">
                <li>$25 Stake Cash</li>
                <li>250,000 Gold Coins</li>
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Use Code:</span>
                <span className="font-mono font-black text-primary">{welcomeCode}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Sign up on Stake.us with code{' '}
                <strong className="text-foreground">{welcomeCode}</strong> and instantly unlock{' '}
                {rakeback}% rakeback plus your welcome bonus.
              </p>
              <div className="mt-auto pt-6">
                <a
                  href={stakeUsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary text-primary-foreground rounded-xl font-black py-3 px-6 uppercase tracking-widest glow-primary hover:scale-105 transition-transform"
                >
                  Claim on Stake.us
                </a>
              </div>
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
