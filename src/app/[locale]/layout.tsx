import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-brand",
  display: "swap",
});
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "WIZL — Scan it. Know it. Track it.",
  description:
    "Discover what you got. AI-powered cannabis strain scanner, check-ins, reviews, and the chillest strain guide on the planet. With love.",
  keywords: ["cannabis", "strains", "scan", "check-in", "reviews", "AI", "WIZL"],
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { rel: "apple-touch-icon", url: "/icons/apple-touch-icon.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#2d8a6e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`h-full antialiased ${montserrat.variable}`}>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <AgeGate>
              <Header />
              <main className="flex-1">{children}</main>
              <Navigation />
            </AgeGate>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
