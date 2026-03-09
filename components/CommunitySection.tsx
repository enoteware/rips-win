import Image from 'next/image';
import { ICONS } from '@/lib/brand';

const STATS = [
  { value: "45k+", label: "Community Members" },
  { value: "1.2m", label: "Monthly Views" },
  { value: "800+", label: "Daily Winners" },
  { value: "$500k+", label: "Bonuses Awarded" },
] as const;

export function CommunitySection() {
  return (
    <section
      id="community"
      className="scroll-mt-20 py-20 bg-background-dark border-y border-border-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl font-black mb-6 uppercase italic tracking-tighter">
              Join the <span className="text-primary">Rips</span> Squad
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Catch the best live streams, enter exclusive gambling giveaways, and connect with the squad.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="bg-social-discord text-foreground flex items-center gap-3 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                aria-label="Join Discord"
              >
                <Image src={ICONS.discord} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                Discord
              </a>
              <a
                href="#"
                className="bg-primary text-primary-foreground flex items-center gap-3 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                aria-label="Watch on Kick or Twitch"
              >
                <Image src={ICONS.stream} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                Kick / Twitch
              </a>
              <a
                href="#"
                className="bg-social-instagram text-foreground flex items-center gap-3 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                aria-label="Follow on Instagram"
              >
                <Image src={ICONS.instagram} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                Instagram
              </a>
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
