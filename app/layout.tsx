import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "German Me · A little, often",
  description: "Everyday German through scenarios, repeated recall and one private learning record.",
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
