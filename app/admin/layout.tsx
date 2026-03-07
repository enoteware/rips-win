import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background text-foreground font-display">
      <header className="border-b-2 border-border bg-card px-4 py-3">
        <div className="container mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="font-semibold text-primary hover:underline"
              >
                Rips CMS
              </Link>
            <Link
              href="/admin/leaderboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Leaderboard
            </Link>
            <Link
              href="/admin/site"
              className="text-muted-foreground hover:text-foreground"
            >
              Site content
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              View site
            </Link>
          </nav>
          {session?.user?.email && (
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
          </div>
          <div className="h-2 w-full max-w-xs border-2 border-border bg-logo-gradient shadow-hard" aria-hidden />
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
