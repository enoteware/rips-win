import Image from 'next/image';
import { ICONS } from '@/lib/brand';
import { SocialMarquee } from '@/components/SocialMarquee';
import type { SocialLink } from '@/lib/social-links';
import type { CommunityStat } from '@/lib/site-settings';

const DEFAULT_STATS: { value: string; label: string }[] = [
  { value: '164k', label: 'Community Members' },
  { value: '5.2m', label: 'Monthly Views' },
];

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
  heading?: string;
  subtext?: string;
  stats?: CommunityStat[];
}

export function CommunitySection({ socialLinks, heading = "Don't miss a RIPS update.", subtext = 'Check out all of our social platforms to stay connected.', stats }: CommunitySectionProps) {
  const platforms = socialLinks.map((l) => l.platform.toLowerCase());
  const statsList = stats && stats.length > 0 ? stats : DEFAULT_STATS;

  return (
    <section
      id="community"
      className="public-section scroll-mt-20 relative border-y border-border-dark overflow-hidden"
    >
      {/* Background marquee — absolutely positioned, fades into bg */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <div className="opacity-20 grayscale space-y-3 pt-4">
          <SocialMarquee platforms={platforms} />
          <SocialMarquee platforms={platforms} />
          <SocialMarquee platforms={platforms} />
          <SocialMarquee platforms={platforms} />
        </div>
        {/* Top + bottom edge fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        {/* Left + right edge fade */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">
              {heading}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {subtext}
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
                    className={`${buttonClassName} flex items-center gap-3 rounded-full px-6 py-3 font-bold shadow-hard transition-transform hover:scale-105`}
                    aria-label={displayLabel}
                  >
                    <Image src={iconSrc} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                    <span>{displayLabel}</span>
                    <span className="ml-auto text-lg leading-none opacity-80">›</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {statsList.map((stat) => (
              <div
                key={stat.label}
                className="bg-transparent p-8 rounded-2xl border border-border-dark flex flex-col items-center text-center"
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
