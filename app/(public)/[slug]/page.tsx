import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPageBySlug } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page || !page.published) return { title: 'Not Found' };
  return {
    title: `${page.title} - RIPS.WIN`,
    description: `${page.title} for rips.win`,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <main className="public-page min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic md:text-5xl mb-8">
            {page.title}
          </h1>
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-primary prose-strong:text-foreground">
            <ReactMarkdown>{page.content}</ReactMarkdown>
          </div>
          <p className="mt-12 text-xs text-muted-foreground">
            Last updated: {new Date(page.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
