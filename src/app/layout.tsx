import type { Metadata, Viewport } from "next";
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
  title: "Arshin Bhande | Full-Stack Developer",
  description:
    "Full-Stack Developer building modern web applications, practical digital products, and reliable backend systems. Specializing in React, Next.js, Node.js, REST APIs, and PostgreSQL.",
  keywords: [
    "Arshin Bhande",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "REST API",
    "TypeScript",
  ],
  authors: [{ name: "Arshin Bhande", url: "https://github.com/arshin29" }],
  creator: "Arshin Bhande",
  metadataBase: new URL("https://arshinbhande.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arshinbhande.dev",
    siteName: "Arshin Bhande | Full-Stack Developer",
    title: "Arshin Bhande | Full-Stack Developer",
    description:
      "Full-Stack Developer building modern web applications, practical digital products, and reliable backend systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arshin Bhande | Full-Stack Developer",
    description:
      "Full-Stack Developer building modern web applications, practical digital products, and reliable backend systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#080e18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Unified atmospheric night-sky background canvas */}
        <div className="night-sky-canvas" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
