import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getStakeContext } from '@/lib/market';
import { getSocialLinks } from "@/lib/social-links";

/**
 * Public site shell: header + main + footer.
 * Admin routes (/admin/*) are not under this group, so they render without the public UI.
 */
export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [socialLinks, stakeContext] = await Promise.all([
    getSocialLinks(true),
    getStakeContext(),
  ]);

  return (
    <div className="public-shell flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter
        socialLinks={socialLinks}
        market={stakeContext.market}
        source={stakeContext.source}
        country={stakeContext.country}
        stakeUrl={stakeContext.defaultStakeUrl}
        marketLabel={stakeContext.marketLabel}
      />
    </div>
  );
}
