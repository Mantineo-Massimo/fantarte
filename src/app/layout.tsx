import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FantArte | Piazza dell'Arte 2026",
  description: "Crea la tua squadra, scegli i tuoi partecipanti e scala la classifica della Piazza dell'Arte di Messina.",
  metadataBase: new URL("https://fantarte.it"),
  openGraph: {
    title: "FantArte | Il Gioco Ufficiale della Piazza dell'Arte",
    description: "Fonda il tuo quintetto, gestisci i tuoi Armoni e sfida gli altri partecipanti. Il fantagioco dove l'arte prende vita.",
    url: "https://fantarte.it",
    siteName: "FantArte",
    images: [
      {
        url: "https://fantarte.it/og-preview.webp",
        width: 1200,
        height: 1200,
        alt: "FantArte Preview",
        type: "image/webp",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FantArte | Piazza dell'Arte",
    description: "Il Fantagioco dove l'Arte incontra la Piazza",
    images: ["https://fantarte.it/og-preview.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicon/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen relative overflow-x-hidden`}
      >
        {/* Cinematic Fixed Background (Static & Cross-page) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Top Left Viola Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-viola opacity-[0.08] blur-[150px] rounded-full" />
          {/* Bottom Right Oro Glow */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-oro opacity-[0.05] blur-[150px] rounded-full" />
          {/* Center-ish Ocra Glow */}
          <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-ocra opacity-[0.03] blur-[120px] rounded-full" />
          {/* Texture Overlay (Scalinata) */}
          <div className="absolute inset-0 bg-[url('/background.webp')] bg-cover bg-center opacity-[0.06] mix-blend-overlay" />
        </div>

        <NextAuthProvider>
          <div className="relative font-sans flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
          <CookieConsent />
        </NextAuthProvider>
      </body>
    </html>
  );
}
