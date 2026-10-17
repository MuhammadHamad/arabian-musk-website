import Link from "next/link";
import { LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { Catalogue } from "@/components/catalogue";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { formatRs } from "@/lib/scent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Collection: All Attars & Perfumes",
  description: `All ${SCENT_COUNT} Arabian Musk scents, each as a 12 ml attar or a 10, 30, 50 or 100 ml perfume, from ${formatRs(LOWEST_PRICE)}. Choose a size and order on WhatsApp.`,
  path: "/scents",
});

export default function ScentsPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-10 text-center sm:pb-16 sm:pt-14">
        <nav aria-label="Breadcrumb" className="caps !text-[10.5px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span aria-hidden className="px-2">/</span>
          <span className="text-ink">The collection</span>
        </nav>
        <h1 className="mt-8 font-display text-5xl font-normal leading-[1.04] sm:text-6xl">The collection</h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
          Every scent on our register, {SCENT_COUNT} in all. Each comes as a pure attar or as a perfume with 40% oil.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-muted/90">
          Scents marked &ldquo;inspired by&rdquo; are our impressions of famous perfumes, not the original brand products.
        </p>
      </section>
      <section className="pb-28" aria-label="Scents">
        <Catalogue />
      </section>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The collection", path: "/scents" },
        ])}
      />
    </>
  );
}
