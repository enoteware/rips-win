"use client";

import { formatMoney } from "@/lib/utils";

interface Entry {
  id: string | number;
  rank: number;
  player_name: string | null;
  total_wagered: number;
  avatar_url?: string | null;
}

export function MonolithLeaderboard({ entries }: { entries: Entry[] }) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const second = top3[1];
  const first = top3[0];
  const third = top3[2];

  // Mouse move effect for sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const sheen = item.querySelector(".sheen") as HTMLElement;
    if (sheen) {
      sheen.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(13, 242, 13, 0.15) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const sheen = item.querySelector(".sheen") as HTMLElement;
    if (sheen) {
      sheen.style.background = `linear-gradient(125deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)`;
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Background Grain */}
      <div 
        className="pointer-events-none absolute -inset-10 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} 
      />

      {/* Podium */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Silver */}
        <div 
          className="bg-gradient-to-b from-surface-dark to-background-dark border border-border-dark p-6 md:p-10 relative flex flex-col items-center justify-end min-h-[220px] md:min-h-[280px] overflow-hidden transition-transform duration-400 hover:-translate-y-1 hover:border-white/10 group border-t-2 border-t-podium-2 md:order-1 order-2"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="sheen absolute inset-0 pointer-events-none bg-[size:200%_200%]"
            style={{ background: `linear-gradient(125deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)` }}
          />
<span className="font-display text-5xl md:text-[4rem] font-light absolute top-4 left-6 md:-top-2 md:left-2 opacity-10">02</span>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-14 md:h-14 mb-3 z-10 text-podium-2 opacity-90"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>

          <div className="font-display font-bold text-lg md:text-xl text-center mb-2 z-10 uppercase tracking-tight">{second?.player_name || '---'}</div>
          <div className="font-mono text-muted-foreground text-sm z-10">{second ? formatMoney(second.total_wagered) : '---'}</div>
        </div>

        {/* Gold */}
        <div 
          className="bg-gradient-to-b from-surface-dark to-background-dark border border-border-dark p-6 md:p-10 relative flex flex-col items-center justify-end min-h-[260px] md:min-h-[340px] md:-mt-[40px] overflow-hidden transition-transform duration-400 hover:-translate-y-1 hover:border-white/10 group border-t-2 border-t-primary shadow-glow-lg md:order-2 order-1"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="sheen absolute inset-0 pointer-events-none bg-[size:200%_200%]"
            style={{ background: `linear-gradient(125deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)` }}
          />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
<span className="font-display text-5xl md:text-[4rem] font-light absolute top-4 left-6 md:-top-2 md:left-2 opacity-[0.15] text-primary">01</span>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16 mb-4 z-10 text-primary drop-shadow-glow-logo"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>

          <div className="font-display font-black text-xl md:text-2xl text-center mb-2 z-10 text-primary drop-shadow-glow-logo uppercase tracking-tighter">{first?.player_name || '---'}</div>
          <div className="font-mono text-muted-foreground text-sm z-10">{first ? formatMoney(first.total_wagered) : '---'}</div>
        </div>

        {/* Bronze */}
        <div 
          className="bg-gradient-to-b from-surface-dark to-background-dark border border-border-dark p-6 md:p-10 relative flex flex-col items-center justify-end min-h-[220px] md:min-h-[240px] overflow-hidden transition-transform duration-400 hover:-translate-y-1 hover:border-white/10 group border-t-2 border-t-podium-3 md:order-3 order-3"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="sheen absolute inset-0 pointer-events-none bg-[size:200%_200%]"
            style={{ background: `linear-gradient(125deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)` }}
          />
<span className="font-display text-5xl md:text-[4rem] font-light absolute top-4 left-6 md:-top-2 md:left-2 opacity-10">03</span>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-14 md:h-14 mb-3 z-10 text-podium-3 opacity-90"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>

          <div className="font-display font-bold text-lg md:text-xl text-center mb-2 z-10 uppercase tracking-tight">{third?.player_name || '---'}</div>
          <div className="font-mono text-muted-foreground text-sm z-10">{third ? formatMoney(third.total_wagered) : '---'}</div>
        </div>
      </section>

      {/* List container */}
      <section className="flex flex-col border border-border-dark bg-background-dark/50 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
        {rest.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono">No supplementary strata found.</div>
        ) : rest.map((entry) => (
            <div 
                key={entry.id}
                className="grid grid-cols-[50px_1fr_100px] md:grid-cols-[80px_1fr_120px] items-center p-4 md:p-5 md:px-8 border-b border-border-dark last:border-b-0 transition-all duration-300 relative hover:bg-white/5 hover:pl-6 md:hover:pl-10 group"
            >
                {/* Hover Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rank */}
                <span className="font-mono text-muted-foreground text-sm md:text-base">
                    {entry.rank.toString().padStart(2, '0')}
                </span>
                
                {/* Player Name */}
                <span className="font-display font-semibold text-base md:text-lg tracking-tight flex items-center gap-3 uppercase">
                    {entry.player_name || 'Unknown'}
                </span>
                
                {/* Score */}
                <span className="font-mono text-right text-sm md:text-base text-foreground font-medium">
                    {formatMoney(entry.total_wagered)}
                </span>
            </div>
        ))}
      </section>
    </div>
  );
}
