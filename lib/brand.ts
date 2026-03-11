/**
 * Brand asset paths — single source of truth for logos and icons.
 * Update these when swapping or adding assets.
 */
export const LOGO = {
  /** Main logo for header, footer, and general use */
  main: "/rips-logo.svg",
  /** Hero / animated variant (e.g. AnimatedLogo component) */
  hero: "/rips-logo-ai.svg",
  /** Alt variant if needed */
  alt: "/rips-logo-alt.svg",
} as const;

export const ICONS = {
  discord: "/icons/discord.svg",
  instagram: "/icons/instagram.svg",
  /** Stream / play (Kick, Twitch, etc.) */
  stream: "/icons/stream.svg",
  globe: "/icons/globe.svg",
  globeEmoji: "/icons/globe-emoji.svg",
  flagUsEmoji: "/icons/flag-us-emoji.svg",
  mail: "/icons/mail.svg",
  chat: "/icons/chat.svg",
  /** Leaderboard / trophy */
  leaderboard: "/icons/leaderboard.svg",
  /** Raffle / ticket */
  raffle: "/icons/raffle.svg",
  play: "/icons/play.svg",
  trophy: "/icons/trophy.svg",
} as const;
