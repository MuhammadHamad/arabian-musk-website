import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import heroWide from "@/assets/renders/hero-amber.jpg";
import { getScent, scents, similarlyPriced } from "@/content/catalogue";
import { collections } from "@/content/collections";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ScentImage } from "@/components/scent-image";
import { SizePicker } from "@/components/size-picker";
import { scentQuestion, whatsappLink } from "@/lib/links";
import { arabicNumeral, formatRs, priceRange, type Scent } from "@/lib/scent";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return scents.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function summary(s: Scent): string {
  const p = s.prices;
  return `attar 12 ml ${formatRs(p.attar12)}; perfume 10 ml ${formatRs(p.perfume10)}, 30 ml ${formatRs(p.perfume30)}, 50 ml ${formatRs(p.perfume50)}, 100 ml ${formatRs(p.perfume100)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scent = getScent((await params).slug);
  if (!scent) return {};
  return pageMetadata({
    title: `${scent.name} Attar & Perfume Price`,
    description: `${scent.name}${scent.inspiredBy ? ` (impression of ${scent.inspiredBy})` : ""} at Arabian Musk, Peshawar: ${summary(scent)}. Order on WhatsApp.`,
    path: `/scents/${scent.slug}`,
    ownShareImage: true,
  });
}

export default async function ScentPage({ params }: Props) {
  const scent = getScent((await params).slug);
  if (!scent) notFound();
  const groups = collections.filter((c) => c.match(scent));

  const facts: [string, string][] = [
    ["Attar", `Pure perfume oil with no alcohol. 12 ml at ${formatRs(scent.prices.attar12)}; smaller sizes on request.`],
    ["Perfume", `A spray with 40% perfume oil, extrait strength. 10, 30, 50 and 100 ml.`],
    ...(scent.inspiredBy ? ([["Inspired by", `${scent.inspiredBy}. Our impression, not the original branded perfume.`]] as [string, string][]) : []),
    ["Register number", `N° ${scent.no} on our shop's price list.`],
    ["Mixing", "We can blend it with another oil in one bottle, in the proportion you like."],
    ["Gift box", "Any bottle can go out in a gift box, on request."],
  ];

  return (
    <>
      <div aria-hidden className="mx-auto max-w-[75rem] sm:px-5">
        <div className="slant-bottom-sm relative h-40 overflow-hidden sm:h-64">
          <Image src={heroWide} alt="" fill priority placeholder="blur" sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover object-[50%_40%]" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      <section className="mx-auto grid max-w-[75rem] gap-10 px-5 pb-16 pt-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <ScentImage scent={scent} priority zoom={1.12} sizes="(min-width: 1024px) 560px, 100vw" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <ScentImage scent={scent} square zoom={1.6} sizes="180px" />
            <ScentImage scent={scent} variant="attar" scene="plaster" square zoom={1.3} sizes="180px" />
            <ScentImage scent={scent} variant="attar" scene="wood" square zoom={1.3} sizes="180px" />
          </div>
        </div>

        <div>
          <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
            <Link href="/" className="hover:text-amber">Home</Link>
            <span aria-hidden className="px-2">/</span>
            <Link href="/scents" className="hover:text-amber">Shop</Link>
            <span aria-hidden className="px-2">/</span>
            <span className="text-ink">{scent.name}</span>
          </nav>
          <h1 className="mt-4 text-[2.4rem] leading-tight sm:text-[2.8rem]">
            Arabian Musk – {scent.name}
            {scent.inspiredBy && <span className="block text-[1.5rem] font-semibold text-body">(Impression of {scent.inspiredBy})</span>}
          </h1>
          <p className="mt-4 font-display text-[1.9rem] font-bold tabular-nums text-ink">{priceRange(scent)}</p>
          <p className="mt-2 flex items-center gap-2 text-[14.5px] text-muted">
            N° {scent.no}
            <span lang="ar" className="font-arabic text-lg text-amber">
              {arabicNumeral(scent.no)}
            </span>
          </p>

          <div className="mt-6">
            <SizePicker scent={scent} />
          </div>

          <ul className="mt-8 list-disc space-y-2.5 pl-5 text-[16px] leading-relaxed marker:text-amber">
            {facts.map(([k, v]) => (
              <li key={k}>
                <strong className="text-ink">{k}:</strong> {v}
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink(scentQuestion(scent.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-[15px] font-bold text-amber underline underline-offset-4"
          >
            <WhatsAppIcon size={17} /> Ask us about {scent.name} on WhatsApp
          </a>

          {groups.length > 0 && (
            <p className="mt-7 border-t border-line pt-5 text-[15px]">
              <strong className="text-ink">Category</strong>{" "}
              {groups.map((g, i) => (
                <span key={g.slug}>
                  {i > 0 && ", "}
                  <Link href={`/collections/${g.slug}`} className="hover:text-amber">
                    {g.title}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[75rem] px-5" aria-labelledby="desc-title">
        <div className="border-t border-line pt-12">
          <h2 id="desc-title" className="text-[2rem]">
            Description
          </h2>
          <p className="mt-4 max-w-3xl text-[16.5px] leading-relaxed">
            {scent.inspiredBy
              ? `Arabian Musk's ${scent.name} is our impression of ${scent.inspiredBy}. Wear it as a pure, alcohol-free attar that stays close to the skin, or as a perfume made with 40% oil that carries further. It is not the original branded perfume, and we are not connected to its maker.`
              : `${scent.name} is N° ${scent.no} on our register. Wear it as a pure, alcohol-free attar that stays close to the skin, or as a perfume made with 40% oil that carries further.`}{" "}
            Every bottle is poured at our shop at Malogo Chowk, Jhagra, Peshawar, and we confirm stock and the total on WhatsApp before you pay.
          </p>
          <p className="mt-4 text-[13px] text-muted">Bottles shown are rendered illustrations of our attar and perfume formats.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[75rem] px-5 py-20" aria-labelledby="related-title">
        <h2 id="related-title" className="text-[2.2rem]">
          Related products
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4 lg:gap-x-8">
          {similarlyPriced(scent).map((s) => (
            <ProductCard key={s.slug} scent={s} align="left" />
          ))}
        </div>
      </section>

      <JsonLd
        data={[
          productSchema(scent),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/scents" },
            { name: scent.name, path: `/scents/${scent.slug}` },
          ]),
        ]}
      />
    </>
  );
}
