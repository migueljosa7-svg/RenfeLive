import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/utils";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RenfeLive · Estado de Cercanías, AVE y Metro en tiempo real",
    template: "%s | RenfeLive",
  },
  description:
    "Consulta en directo retrasos, incidencias y rutas alternativas de Cercanías Madrid, Barcelona, Valencia, AVE, Ouigo, Iryo y Metro.",
  applicationName: "RenfeLive",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "RenfeLive",
    title: "RenfeLive · Estado del transporte público en España",
    description: "Retrasos e incidencias de Cercanías, AVE y Metro en tiempo real.",
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "8pD-WHdPGed-RtgDkXZTN0LE3UUMLYH9LFPUoxspwCU",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
