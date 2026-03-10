'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { extractYouTubeId } from '@/lib/youtube';
import { ICONS } from '@/lib/brand';

interface ClipCardProps {
  title: string;
  youtubeUrl: string;
}

export function ClipCard({ title, youtubeUrl }: ClipCardProps) {
  const [playing, setPlaying] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoId = extractYouTubeId(youtubeUrl);

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => setPlaying(true), 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setPlaying(false);
  }, []);

  const handleTap = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1`;

  return (
    <div
      className="group relative flex-shrink-0 w-[200px] sm:w-[220px] aspect-[9/16] rounded-2xl overflow-hidden border border-border-dark bg-surface-dark cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title}`}
    >
      {playing ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
      ) : (
        <>
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="220px"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
              <Image src={ICONS.play} alt="" width={24} height={24} className="w-6 h-6 ml-0.5" />
            </div>
          </div>
        </>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <p className="text-white text-xs font-bold line-clamp-2">{title}</p>
      </div>
    </div>
  );
}
