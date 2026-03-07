import Link from 'next/link';

export const metadata = {
  title: 'Weekly Raffle - RIPS.WIN',
  description: 'RIPS.WIN weekly raffle. Compete for prize pools.',
};

export default function RafflePage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-primary md:text-5xl">
          $10,000
        </h1>
        <p className="mt-2 text-center text-xl font-semibold text-foreground">
          WEEKLY RAFFLE
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center rounded-none border-2 border-border bg-card p-6 text-center shadow-hard"
            >
              <span className="text-3xl">???</span>
              <span className="mt-2 text-xs font-medium uppercase text-muted-foreground">Ticket</span>
              <span className="mt-3 text-lg font-bold text-primary">PRIZE</span>
              <span className="text-2xl font-bold text-foreground">$2,000</span>
              <span className="text-muted-foreground">—</span>
            </div>
          ))}
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
