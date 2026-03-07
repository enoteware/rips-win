import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const welcomeCode = process.env.NEXT_PUBLIC_WELCOME_CODE ?? 'RIPS';
const rakeback = process.env.NEXT_PUBLIC_RAKEBACK ?? '10';

function stakeUsLink(): string {
  const base = process.env.NEXT_PUBLIC_STAKE_US_LINK ?? 'https://stake.us/';
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}?offer=rips&c=selling`;
}

function stakeComLink(): string {
  const base = process.env.NEXT_PUBLIC_STAKE_COM_LINK ?? 'https://stake.com/';
  return base.includes('?') ? base : `${base.replace(/\/$/, '')}?offer=rips&c=selling`;
}

export const metadata = {
  title: 'Bonuses - RIPS.WIN',
  description: 'Exclusive RIPS.WIN bonus offers for Stake.us and Stake.com. USA bonuses.',
};

export default function BonusesPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-foreground md:text-5xl">
          ENJOY EXCLUSIVE BONUSES
        </h1>
        <p className="mt-3 text-center text-lg text-muted-foreground">
          USA Bonuses
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-2 border-primary bg-primary/10 shadow-hard-lg">
            <div className="relative h-40 w-full bg-muted">
              <Image src="/stakeus-promo.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-primary">{welcomeCode}</p>
              <p className="mt-1 text-sm text-muted-foreground">bonus offer</p>
              <Button asChild className="mt-4 w-full">
                <a href={stakeUsLink()} target="_blank" rel="noopener noreferrer">
                  Claim {welcomeCode}
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2 border-secondary bg-secondary/10 shadow-hard-lg">
            <div className="relative h-40 w-full bg-muted">
              <Image src="/stakecom-promo.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-secondary">BONUS200</p>
              <p className="mt-1 text-sm text-muted-foreground">bonus offer</p>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <a href={stakeComLink()} target="_blank" rel="noopener noreferrer">
                  Claim BONUS200
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2 border-chart-3 bg-chart-3/10 shadow-hard-lg sm:col-span-2 lg:col-span-1">
            <div className="relative h-40 w-full bg-muted">
              <Image src="/stakecom-banner.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-chart-3">RAKEBACK{rakeback}</p>
              <p className="mt-1 text-sm text-muted-foreground">bonus offer</p>
              <Button asChild variant="outline" className="mt-4 w-full border-chart-3 text-chart-3 hover:bg-chart-3 hover:text-background">
                <a href={stakeUsLink()} target="_blank" rel="noopener noreferrer">
                  Claim RAKEBACK{rakeback}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="mt-10 text-center text-muted-foreground">
          <Link href="/" className="font-semibold text-primary underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
