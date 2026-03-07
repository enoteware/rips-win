'use client';

import Image from 'next/image';
import { LOGO } from '@/lib/brand';

const LOGO_SIZE = 240;

export function AnimatedLogo() {
  return (
    <div
      className="animated-logo mx-auto mb-4 inline-block w-40 sm:w-52 md:w-60"
      aria-hidden="true"
    >
      <div className="animated-logo__clip relative overflow-hidden">
        <Image
          src={LOGO.hero}
          alt="RIPS.WIN"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          className="relative z-0 h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}
