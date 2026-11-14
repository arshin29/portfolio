import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Kalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#172340" },
    { media: "(prefers-color-scheme: light)", color: "#4782bb" },
  ],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=new Date();var h=d.getHours()+d.getMinutes()/60;var n=h<5.5||h>=18.5;var r=document.documentElement;if(n){r.classList.add('dark');r.setAttribute('data-theme','night');r.style.setProperty('--theme-blend','0');r.style.setProperty('--daylight','0');r.style.setProperty('--sky-ink','#f6f8fd');r.style.setProperty('--sky-secondary','#cbd5e1');r.style.setProperty('--sky-top','#172340');r.style.setProperty('--sky-mid','#202d4b');r.style.setProperty('--sky-bottom','#2b3b56');}else{r.classList.remove('dark');r.setAttribute('data-theme','day');r.style.setProperty('--theme-blend','1');r.style.setProperty('--daylight','1');r.style.setProperty('--sky-ink','#162332');r.style.setProperty('--sky-secondary','#344353');r.style.setProperty('--sky-top','#4782bb');r.style.setProperty('--sky-mid','#7daee0');r.style.setProperty('--sky-bottom','#cbe0f4');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${kalam.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Unified atmospheric night-sky background canvas */}
        <div className="night-sky-canvas" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
