import Image from 'next/image';
import { ICONS } from '@/lib/brand';

const VIDEOS = [
  { title: "INSANE BIG SLOT WINS!", views: "24K", ago: "2 days ago", duration: "12:45" },
  { title: "PRO POKER HIGHLIGHTS & BLUFFS", views: "12K", ago: "5 days ago", duration: "08:12" },
  { title: "HIGH STAKES LIVE ROULETTE ACTION", views: "8K", ago: "1 week ago", duration: "15:20" },
  { title: "LIVE HIGH STAKES ROULETTE SESSION", views: "45K", ago: "2 weeks ago", duration: "10:05" },
] as const;

export function VideosSection() {
  return (
    <section id="videos" className="scroll-mt-20 py-20 bg-background-dark border-t border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black mb-12 uppercase italic tracking-tighter">
          High Stakes <span className="text-primary">Highlights</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VIDEOS.map((video) => (
            <a
              key={video.title}
              href="#"
              className="group cursor-pointer block"
              aria-label={`Watch ${video.title}`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-surface-dark border border-border-dark">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-border-dark" />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image src={ICONS.play} alt="" width={48} height={48} className="w-12 h-12 text-background" aria-hidden />
                </div>
                <div className="absolute bottom-2 right-2 bg-foreground/80 px-2 py-1 rounded text-xs font-bold text-background">
                  {video.duration}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {video.views} Views • {video.ago}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
