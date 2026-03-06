import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
