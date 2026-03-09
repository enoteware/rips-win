"use client";

import { useRef } from "react";
import Link from 'next/link';

export interface TectonicOfferCardProps {
  tierName: string;
  offerType: string;
  value: React.ReactNode;
  description: string;
  promoCode: string;
  cta: string;
  href: string;
  highlight?: boolean;
  image?: string;
}

export function TectonicOfferCard({
  tierName,
  offerType,
  value,
  description,
  promoCode,
  cta,
  href,
  highlight = false,
  image,
}: TectonicOfferCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const dx = x - xc;
    const dy = y - yc;

    cardRef.current.style.transform = `rotateY(${dx / 10}deg) rotateX(${-dy / 10}deg) translateY(-15px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[320px] mx-auto h-[480px] bg-surface-dark border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col group [perspective:1000px] [transform-style:preserve-3d] ${
        highlight ? "border-primary/40 shadow-glow-lg" : "border-white/5"
      }`}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 92%, 88% 100%, 0 100%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Noise Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* The Glow Vein - Tectonic Fracture hover effect */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(13,242,13,0.15)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-0"></div>

      {image && (
        <>
          <div
            className="absolute inset-0 z-[1] opacity-30 mix-blend-screen bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
            style={{ backgroundImage: `url('${image}')` }}
          ></div>
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-surface-dark via-surface-dark/90 to-surface-dark/40"></div>
        </>
      )}

      {/* The Edge Line */}
      <div
        className={`absolute top-0 right-0 h-full z-10 shadow-glow-primary ${
          highlight ? "w-[6px] bg-logo-gradient" : "w-1 bg-primary/80"
        }`}
      ></div>

      {/* Content Layout */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="mb-6">
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-primary block mb-2 font-bold">
            {offerType}
          </span>
          <h2
            className={`font-display font-black text-2xl tracking-tighter uppercase ${
              highlight
                ? "bg-logo-gradient bg-clip-text text-transparent"
                : "bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent"
            }`}
          >
            {tierName}
          </h2>
        </div>

        <div
          className={`text-[4rem] font-black leading-none mb-4 ${
            highlight ? "text-primary drop-shadow-glow" : "text-white"
          }`}
          style={{ textShadow: highlight ? "none" : "4px 4px 0px rgba(0,0,0,0.5)" }}
        >
          {value}
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed mb-auto">
          {description}
        </p>

        <div className="mt-8">
          <div className="font-mono text-xs bg-white/5 py-2 px-3 border-l-2 border-primary mb-5 inline-block text-white">
            CODE: {promoCode}
          </div>
          
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full p-4 text-center text-xs font-black uppercase tracking-widest relative overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500 before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent ${
              highlight
                ? "bg-primary text-primary-foreground border-2 border-primary/0 shadow-glow"
                : "bg-white text-black hover:bg-white/90"
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)",
            }}
          >
            {cta}
          </Link>
        </div>
      </div>

      {/* Bottom glowing line */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] blur-[1px] ${highlight ? "bg-logo-gradient" : "bg-primary/50"}`}></div>
    </div>
  );
}
