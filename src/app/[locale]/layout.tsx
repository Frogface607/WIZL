import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import SmokeLayer from "@/components/SmokeLayer";

export const metadata: Metadata = {
  metadataBase: new URL("https://wizl.space"),
  title: "WIZL | Cannabis Field Guide and Private Journal",
  description:
    "Read cannabis package labels, explore 3,000+ strain references, and keep private field notes with WIZL.",
  keywords: [
    "cannabis field guide",
    "cannabis label reader",
    "strain reference",
    "private cannabis journal",
    "field notes",
    "WIZL",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "WIZL | Read the label. Remember the experience.",
    description:
      "A magical cannabis field guide with 3,000+ references and private field notes on your device.",
    url: "https://wizl.space/en",
    siteName: "WIZL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WIZL, a weasel wizard holding the Book",
      },
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WIZL | Cannabis Field Guide",
    description:
      "Read the label, explore the Book, and remember your own experience.",
    images: ["/og-image.png"],
  },
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

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  // Required for static export: tells next-intl to use the URL segment
  // instead of headers() for locale detection.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`h-full antialiased ${montserrat.variable}`}>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <AgeGate>
              <SmokeLayer />
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
