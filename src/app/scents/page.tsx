import Link from "next/link";
import { LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { Catalogue } from "@/components/catalogue";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { formatRs } from "@/lib/scent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "All Scents & Prices: Attar and Perfume",
  description: `Arabian Musk's full price list: ${SCENT_COUNT} scents, each as a 12 ml attar or a 10, 30, 50 or 100 ml perfume, from ${formatRs(LOWEST_PRICE)}. Search, choose a size and order on WhatsApp.`,
  path: "/scents",
});

export default function ScentsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-sand-100">
        <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-400">
            <Link href="/" className="hover:text-gold-300">Home</Link>
            <span aria-hidden className="px-2">/</span>
            <span className="text-sand-200">All scents</span>
          </nav>
          <h1 className="mt-5 font-display text-5xl leading-[1.04] text-sand-50 sm:text-6xl">All scents</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-300">
            Our full price list: {SCENT_COUNT} scents, each as a 12 ml attar or a perfume from 10 to 100 ml. Tap a size
            and price to add it to your order, then send the order on WhatsApp.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
            Scents marked &ldquo;inspired by&rdquo; are our impressions of famous perfumes, not the original brand products.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6" aria-label="Scents">
        <Catalogue />
      </section>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "All scents", path: "/scents" },
        ])}
      />
    </>
  );
}
