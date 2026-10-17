import { SITE_URL, site } from "@/content/site";
import { HIGHEST_PRICE, LOWEST_PRICE } from "@/content/catalogue";
import type { Faq } from "@/content/faqs";
import { formatRs, SIZES, type Scent } from "@/lib/scent";
import { absoluteUrl } from "@/lib/seo";

const STORE_ID = `${SITE_URL}/#store`;

export function storeSchema() {
  const sameAs = [site.instagram, site.facebook, site.tiktok].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": STORE_ID,
    name: site.brand,
    alternateName: site.arabic,
    description: site.description,
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl("/icon"),
    priceRange: `${formatRs(LOWEST_PRICE)} - ${formatRs(HIGHEST_PRICE)}`,
    currenciesAccepted: "PKR",
    ...(site.phone ? { telephone: site.phone.e164 } : site.whatsapp ? { telephone: `+${site.whatsapp}` } : {}),
    ...(site.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: [site.address.street, site.address.area].filter(Boolean).join(", "),
            addressLocality: site.address.city,
            ...(site.address.region ? { addressRegion: site.address.region } : {}),
            addressCountry: "PK",
          },
          ...(site.address.mapsUrl ? { hasMap: site.address.mapsUrl } : {}),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.brand,
    url: SITE_URL,
    inLanguage: "en-PK",
    publisher: { "@id": STORE_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(scent: Scent) {
  const prices = SIZES.map((s) => scent.prices[s.key]);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${scent.name} attar and perfume`,
    description: scent.inspiredBy
      ? `Inspired by ${scent.inspiredBy}, as alcohol-free attar or perfume with 40% oil. Not the original branded product.`
      : `${scent.name} by Arabian Musk, as alcohol-free attar or perfume with 40% oil.`,
    url: absoluteUrl(`/scents/${scent.slug}`),
    image: absoluteUrl(`/scents/${scent.slug}/opengraph-image`),
    brand: { "@type": "Brand", name: site.brand },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      seller: { "@id": STORE_ID },
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
