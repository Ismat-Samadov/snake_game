import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snake Game - Classic Arcade Fun",
  description: "Play the classic Snake game. Eat food, grow longer, and avoid hitting yourself!",
  keywords: ["snake game", "classic game", "arcade game", "browser game", "retro game"],
  authors: [{ name: "Snake Game" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4ecdc4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
