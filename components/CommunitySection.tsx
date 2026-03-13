import Image from 'next/image';
import { ICONS } from '@/lib/brand';
import { SocialMarquee } from '@/components/SocialMarquee';
import type { SocialLink } from '@/lib/social-links';

const STATS = [
  { value: "164k", label: "Community Members" },
  { value: "5.2m", label: "Monthly Views" },
] as const;

const PLATFORM_STYLES: Record<string, { buttonClassName: string; label: string }> = {
  discord: {
    buttonClassName: 'bg-social-discord text-white',
    label: 'Join Discord',
  },
  instagram: {
    buttonClassName: 'bg-social-instagram text-white',
    label: 'Follow Instagram',
  },
  kick: {
    buttonClassName: 'bg-[#53FC18] text-[#0B0E0F]',
    label: 'Follow Stream',
  },
  twitch: {
    buttonClassName: 'bg-[#9146FF] text-white',
    label: 'Follow Stream',
  },
  youtube: {
    buttonClassName: 'bg-[#FF0000] text-white',
    label: 'Follow YouTube',
  },
};

interface CommunitySectionProps {
  socialLinks: SocialLink[];
}

export function CommunitySection({ socialLinks }: CommunitySectionProps) {
  return (
    <section
      id="community"
      className="public-section scroll-mt-20 py-20 border-y border-border-dark overflow-hidden"
    >
      {/* Scrolling brand icon marquee */}
      <div className="mb-12">
        <SocialMarquee />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">
              Don&apos;t miss a <span className="text-primary">RIPS</span> update.
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Check out all of our social platforms to stay connected.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => {
                const platform = link.platform.toLowerCase();
                const iconSrc = ICONS[link.icon as keyof typeof ICONS] || ICONS.globe;
                const platformStyle = PLATFORM_STYLES[platform];
                const buttonClassName = platformStyle?.buttonClassName || 'bg-primary text-primary-foreground';
                const displayLabel = platformStyle?.label || link.label;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClassName} flex min-w-[210px] items-center justify-center gap-3 rounded-xl px-6 py-3 font-bold shadow-hard transition-transform hover:scale-105`}
                    aria-label={displayLabel}
                  >
                    <Image src={iconSrc} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                    {displayLabel}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dark p-8 rounded-2xl border border-border-dark flex flex-col items-center text-center"
              >
                <div className="text-primary text-3xl font-black mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase text-xs font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
