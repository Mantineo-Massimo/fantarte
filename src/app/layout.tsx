import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FantArte | Morgana e Orum",
  description: "Costruisci la tua squadra, scommetti sui tuoi Armoni e conquista la Classifica Generale delle associazioni Morgana e Orum.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://fantarte.it"),
  openGraph: {
    title: "FantArte | Il gioco d'arte delle associazioni Morgana e Orum",
    description: "Crea la tua squadra, scegli i tuoi Armoni e scala la classifica della Piazza!",
    url: "/",
    siteName: "FantArte",
    images: [
      {
        url: "/fanta-logo.png",
        width: 1200,
        height: 630,
        alt: "FantArte Logo",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FantArte | Morgana e Orum",
    description: "Il Fantagioco dove l'Arte incontra la Piazza",
    images: ["/fanta-logo.png"],
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
          <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-[0.06] mix-blend-overlay" />
        </div>

        <NextAuthProvider>
          <div className="relative z-10 font-sans flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
          <Analytics />
        </NextAuthProvider>
      </body>
    </html>
  );
}
