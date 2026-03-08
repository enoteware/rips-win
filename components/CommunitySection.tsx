import Image from 'next/image';
import { ICONS } from '@/lib/brand';

const STATS = [
  { value: "164k", label: "Community Members" },
  { value: "5.2m", label: "Monthly Views" },
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
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">
              Join the <span className="text-primary">Rips</span> Squad
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Catch the best live streams, enter exclusive gambling giveaways, and connect with the squad.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://kick.com/sellingrips"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground flex items-center gap-3 px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                aria-label="Watch on Kick"
              >
                <Image src={ICONS.stream} alt="" width={24} height={24} className="w-6 h-6 shrink-0" aria-hidden />
                Kick / Twitch
              </a>
              <a
                href="https://www.instagram.com/ripstrades"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-social-instagram text-foreground flex items-center gap-3 px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
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
