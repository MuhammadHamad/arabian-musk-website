import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { OrderProvider } from "@/components/order-provider";
import { RevealObserver, revealBootScript } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL, site } from "@/content/site";
import { storeSchema, websiteSchema } from "@/lib/schema";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });

// Only the Arabic wordmark uses this, so it is not preloaded.
const ruqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ruqaa",
  display: "swap",
  preload: false,
});

const title = "Arabian Musk | Attar & Perfume Shop in Peshawar";
const description =
  "Attar and perfume shop in Jhagra, Peshawar. Over 100 scents as alcohol-free attar or perfume made with 40% oil, from Rs 300. Order on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${site.brand}` },
  description,
  applicationName: site.brand,
  keywords: [
    "Arabian Musk",
    "attar shop Peshawar",
    "perfume shop Peshawar",
    "attar Jhagra",
    "attar",
    "attar price in Pakistan",
    "perfume oil",
    "alcohol-free perfume",
    "inspired perfumes",
    "impression perfumes Pakistan",
    "oud attar",
    "musk attar",
  ],
  openGraph: { type: "website", siteName: site.brand, locale: "en_PK", title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, address: false, email: false },
  other: { "geo.region": "PK-KP", "geo.placename": "Peshawar" },
};

export const viewport: Viewport = {
  themeColor: "#0b0907",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK" className={`${bodoni.variable} ${jost.variable} ${ruqaa.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-gold-300 px-5 py-3 font-medium text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <OrderProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </OrderProvider>
        <RevealObserver />
        <JsonLd data={[storeSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
