/**
 * FILE: src/app/layout.tsx
 * PURPOSE: Root layout component that wraps all pages. Handles global font loading (Geist), metadata, and global styles.
 * OPTIMIZATION:
 *  - Font loading is optimized using next/font (zero layout shift).
 *  - Consider adding a PWA manifest here for offline capabilities.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yiting's Dev Lab",
  description: "A showcase of my projects, experiments, and ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
