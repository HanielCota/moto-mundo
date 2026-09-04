import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MiniFooter } from "@/components/layout/mini-footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://moto-mundo.vercel.app")
  ),
  title: {
    default: "Moto Mundo | Marketplace de Peças e Equipamentos Off-Road",
    template: "%s | Moto Mundo",
  },
  description:
    "Marketplace completo especializado em peças, pneus, escapamentos, proteções e acessórios para motos de trilha, motocross e velocross.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Moto Mundo | Marketplace Off-Road",
    description:
      "Peças, botas, capacetes e acessórios para motos off-road das melhores lojas do Brasil.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col antialiased selection:bg-orange-600 selection:text-white"
      >
        <Header />
        <main className="flex-1">{children}</main>
        <MiniFooter />
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}
