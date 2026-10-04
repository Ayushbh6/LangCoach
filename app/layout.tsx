import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "German Me · A little, often",
  description: "Your private Goethe A2–B1 practice: 600 vocabulary cards, cases, spaced recall, and hands-free repetition.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
