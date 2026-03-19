import type { VideoClip } from '@/lib/clips';
import { ClipCard } from './ClipCard';

interface VideosSectionProps {
  clips: VideoClip[];
  title?: string;
}

export function VideosSection({ clips, title = 'Watch Rips Clips' }: VideosSectionProps) {
  if (clips.length === 0) return null;

  return (
    <section id="videos" className="public-section scroll-mt-20 py-20 border-t border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-5xl md:text-7xl font-black mb-10 uppercase italic tracking-tighter text-center">
          {title}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {clips.map((clip) => (
            <div key={clip.id} className="snap-start">
              <ClipCard title={clip.title} youtubeUrl={clip.youtube_url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
