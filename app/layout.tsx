import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEO Carousel Studio",
  description:
    "Generate high-retention Instagram carousels from a prompt or website URL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${bebasNeue.variable} min-h-full bg-zinc-950 font-[family-name:var(--font-inter)] text-zinc-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
