"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RafflePage() {
  const [qty, setQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 2, s: 59 });
  const moldRef = useRef<HTMLDivElement>(null);

  const adjustQty = (val: number) => {
    setQty((prev) => Math.max(1, prev + val));
    
    // Feedback animation
    if (moldRef.current) {
      moldRef.current.style.transform = "scale(0.995) translateY(2px)";
      setTimeout(() => {
        if (moldRef.current) moldRef.current.style.transform = "scale(1) translateY(0)";
      }, 100);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          return { h: 0, m: 0, s: 0 }; // Finished
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!moldRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 120;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 120;
      moldRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-background-dark text-foreground font-sans overflow-x-hidden flex flex-col justify-center items-center py-20 px-4 relative">
      <Link href="/" className="absolute top-8 left-8 font-mono text-sm text-primary hover:underline uppercase z-50">
        &larr; Return to Base
      </Link>

      {/* SVG Grain Filter */}
      <svg id="noise-svg" className="absolute w-0 h-0">
        <filter id="grainy">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.60"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-40 mix-blend-overlay"
        style={{ filter: "url(#grainy)" }}
      ></div>

      {/* Topographical Background Elements Using Primary Glow */}
      <div className="fixed w-[150vw] h-[150vh] z-0 blur-[80px] pointer-events-none animate-pulse duration-10000" style={{
        background: `radial-gradient(circle at 20% 30%, rgba(13, 242, 13, 0.08) 0%, transparent 40%),
                     radial-gradient(circle at 80% 70%, rgba(13, 242, 13, 0.08) 0%, transparent 40%)`
      }}></div>

      <div
        ref={moldRef}
        className="relative w-full max-w-[1100px] bg-surface-dark border border-border-dark rounded-[40px] md:rounded-[60px] p-6 md:p-10 shadow-glow-lg grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 transition-transform duration-500 z-10 [perspective:1000px] [transform-style:preserve-3d]"
      >
        {/* Left Section: The Prize Hero */}
        <section className="relative bg-background-dark border border-border-dark rounded-[30px] md:rounded-[40px] h-[350px] md:h-[500px] flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
          <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest z-10 shadow-glow glow-primary">
            Live Raffle
          </div>
          
          <div className="relative w-4/5 h-4/5 bg-surface-dark/50 border border-primary/20 rounded-[24px] md:rounded-[30px] -rotate-2 flex items-center justify-center transition-transform hover:rotate-0 hover:scale-105 duration-300 drop-shadow-glow-logo">
            {/* Sneaker SVG Placeholder */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary opacity-80"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </section>

        {/* Right Section: Interaction */}
        <section className="flex flex-col justify-between">
          <div className="mb-6 md:mb-0">
            <span className="font-mono text-sm text-muted-foreground uppercase block mb-6 tracking-widest">
              Series 004 // Topography
            </span>
            <h1 className="text-4xl md:text-[3.5rem] font-black leading-none tracking-tighter uppercase italic drop-shadow-md bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              RIPS<br />PLATINUM
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 mt-6 lg:mt-0">
            <div className="bg-background-dark border border-border-dark p-5 rounded-3xl shadow-sm flex flex-col justify-center">
              <span className="block font-mono text-[10px] text-muted-foreground uppercase mb-1">Time Left</span>
              <span className="text-2xl font-black font-mono tracking-tight text-foreground">
                {String(timeLeft.h).padStart(2, "0")}:{String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
              </span>
            </div>
            <div className="bg-background-dark border border-border-dark p-5 rounded-3xl shadow-sm flex flex-col justify-center">
              <span className="block font-mono text-[10px] text-muted-foreground uppercase mb-1">Entry Price</span>
              <span className="text-2xl font-black tracking-tight text-primary">$2.50</span>
            </div>
            <div className="bg-background-dark border border-border-dark p-5 rounded-3xl shadow-sm flex flex-col justify-center">
              <span className="block font-mono text-[10px] text-muted-foreground uppercase mb-1">Tickets Sold</span>
              <span className="text-xl font-bold tracking-tight text-foreground">842/1000</span>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-5 rounded-3xl shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
              <span className="relative block font-mono text-[10px] text-primary uppercase mb-1 z-10">Odds</span>
              <span className="relative text-xl font-bold tracking-tight text-primary z-10">0.12%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center bg-background-dark border border-border-dark p-2 rounded-full mb-3 shadow-inner">
              <button
                className="w-12 h-12 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center font-black text-xl hover:bg-white/5 transition-colors focus:outline-none"
                onClick={() => adjustQty(-1)}
              >
                &minus;
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-transparent border-none flex-1 text-center font-mono font-bold text-xl outline-none text-foreground appearance-none m-0"
                min="1"
              />
              <button
                className="w-12 h-12 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center font-black text-xl hover:bg-white/5 transition-colors focus:outline-none"
                onClick={() => adjustQty(1)}
              >
                +
              </button>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-6 rounded-xl font-black text-xl uppercase tracking-wider transition-all hover:scale-105 hover:bg-primary/90 focus:scale-[0.98] glow-primary shadow-glow-lg">
              Secure Tickets
            </button>
          </div>

          <div className="mt-8">
            <div className="font-mono text-[11px] text-muted-foreground mb-4 flex justify-between uppercase">
              <span>Recent Mints</span>
              <span className="text-primary font-bold">42 Online</span>
            </div>
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-surface-dark bg-gradient-to-tr from-pink-500 to-orange-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-surface-dark bg-gradient-to-t from-purple-500 to-pink-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-surface-dark bg-gradient-to-r from-yellow-200 to-orange-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-surface-dark bg-background-dark flex items-center justify-center text-[10px] font-bold text-muted-foreground z-10">
                +12
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
