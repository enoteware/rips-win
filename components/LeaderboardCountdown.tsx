'use client';

import { useEffect, useState } from 'react';

function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
}

function getTimeLeft(): { days: number; hours: number; mins: number; secs: number; done: boolean } {
  const now = Date.now();
  const end = getEndOfMonth().getTime();
  const diff = Math.max(0, end - now);

  if (diff === 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, mins, secs, done: false };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

interface UnitBlockProps {
  value: string;
  label: string;
}

function UnitBlock({ value, label }: UnitBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-background-dark border border-border-dark px-4 py-3 min-w-[64px] md:min-w-[80px] flex items-center justify-center">
        <span className="font-mono font-black text-3xl md:text-4xl text-foreground tabular-nums leading-none">
          {value}
        </span>
      </div>
      <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function LeaderboardCountdown() {
  const [time, setTime] = useState(getTimeLeft);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  if (time.done) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
          Resetting soon…
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Resets in
      </p>
      <div className="flex items-start gap-3 md:gap-4">
        <UnitBlock value={pad(time.days)} label="Days" />
        <span className="font-mono font-black text-2xl text-muted-foreground/40 mt-3 leading-none select-none">:</span>
        <UnitBlock value={pad(time.hours)} label="Hours" />
        <span className="font-mono font-black text-2xl text-muted-foreground/40 mt-3 leading-none select-none">:</span>
        <UnitBlock value={pad(time.mins)} label="Mins" />
        <span className="font-mono font-black text-2xl text-muted-foreground/40 mt-3 leading-none select-none">:</span>
        <UnitBlock value={pad(time.secs)} label="Secs" />
      </div>
    </div>
  );
}
