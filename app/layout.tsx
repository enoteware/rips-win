import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Bangers } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RIPS.WIN - Casino Leaderboard",
  description: "Live casino leaderboard for Stake.us and Stake.com gambling streams. Use code RIPS for 3.5% rakeback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`theme dark ${spaceGrotesk.variable} ${bangers.variable}`}>
      <body className="antialiased bg-background text-foreground font-display">
        <Script
          src="https://tweakcn.com/live-preview.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
