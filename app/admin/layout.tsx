import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions, isLocalDevBypass } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const devBypass = isLocalDevBypass();
  const displayEmail = session?.user?.email ?? (devBypass ? 'dev (local)' : null);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground font-display">
      <header className="w-full border-b-2 border-border bg-card px-4 sm:px-6 lg:px-8 py-3 shrink-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin"
              className="font-display font-semibold text-primary hover:underline"
            >
              Rips CMS
            </Link>
            <Link
              href="/admin/leaderboard"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/admin/site"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Site content
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
              View site
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {displayEmail && (
              <span className="text-sm text-muted-foreground">
                {displayEmail}
              </span>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href="/api/auth/signout">Sign out</Link>
            </Button>
          </div>
        </div>
        <div className="mt-2 h-2 w-full max-w-xs border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
      </header>
      <main className="flex-1 w-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
