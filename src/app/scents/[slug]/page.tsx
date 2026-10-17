import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScent, scents, similarlyPriced } from "@/content/catalogue";
import { ArrowRightIcon, GiftIcon, MixIcon, WhatsAppIcon } from "@/components/icons";
import { AttarBottle, PerfumeBottle } from "@/components/illustrations";
import { JsonLd } from "@/components/json-ld";
import { PriceList } from "@/components/price-list";
import { ScentCard } from "@/components/scent-card";
import { scentQuestion, whatsappLink } from "@/lib/links";
import { formatRs, isBestSeller, type Scent } from "@/lib/scent";
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
    description: `${scent.name}${scent.inspiredBy ? ` (inspired by ${scent.inspiredBy})` : ""} at Arabian Musk, Peshawar: ${summary(scent)}. Order on WhatsApp.`,
    path: `/scents/${scent.slug}`,
    ownShareImage: true,
  });
}

export default async function ScentPage({ params }: Props) {
  const scent = getScent((await params).slug);
  if (!scent) notFound();
  const similar = similarlyPriced(scent);
  const best = isBestSeller(scent);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-sand-100">
        <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-400">
            <Link href="/" className="hover:text-gold-300">Home</Link>
            <span aria-hidden className="px-2">/</span>
            <Link href="/scents" className="hover:text-gold-300">All scents</Link>
            <span aria-hidden className="px-2">/</span>
            <span className="text-sand-200">{scent.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div
              aria-hidden
              className="relative mx-auto flex h-72 w-full max-w-md items-end justify-center gap-4 rounded-[2rem] border border-gold-400/15 bg-[radial-gradient(circle_at_50%_35%,rgba(209,168,95,0.2),rgba(209,168,95,0)_60%)] pb-8 sm:h-96"
            >
              <AttarBottle wisps className="h-[85%] w-auto" />
              <PerfumeBottle className="h-[52%] w-auto" />
            </div>

            <div>
              {best && (
                <p className="mb-4 inline-flex rounded-full border border-gold-400/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-gold-300">
                  Best seller
                </p>
              )}
              <h1 className="font-display text-5xl leading-[1.04] text-sand-50 sm:text-6xl">{scent.name}</h1>
              {scent.inspiredBy && <p className="mt-3 text-lg text-gold-200">Inspired by {scent.inspiredBy}</p>}
              <p className="mt-4 max-w-xl leading-relaxed text-stone-300">
                {best && "One of the scents our customers buy most. "}
                {scent.inspiredBy
                  ? `Our impression of ${scent.inspiredBy}, available as a pure attar or as a perfume made with 40% oil. It is not the original branded perfume.`
                  : `Available as a pure, alcohol-free attar or as a perfume made with 40% oil.`}
              </p>

              <div className="mt-7 max-w-md rounded-2xl border border-gold-400/15 bg-ink-850/80 p-4 sm:p-5">
                <PriceList scent={scent} tone="dark" />
                <p className="mt-3 border-t border-white/10 pt-3 text-sm text-stone-400">
                  Tap a size to add it to your order. We confirm stock and the total on WhatsApp.
                </p>
              </div>

              <a
                href={whatsappLink(scentQuestion(scent.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-gold-200 underline-offset-4 transition hover:text-gold-100 hover:underline"
              >
                <WhatsAppIcon size={18} />
                Ask us about {scent.name}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-label="Good to know">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sand-200 bg-white/80 p-6">
            <h2 className="font-display text-2xl">Attar or perfume?</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Attar is pure oil with no alcohol, dabbed on and close to the skin. Perfume is a spray with 40% oil that
              carries further.{" "}
              <Link href="/#attar-or-perfume" className="text-gold-700 underline-offset-4 hover:underline">
                How to choose
              </Link>
            </p>
          </div>
          <div className="rounded-2xl border border-sand-200 bg-white/80 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <MixIcon size={22} className="text-gold-600" /> Mix it
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              We can blend {scent.name} with another oil in one bottle. Add both and tell us the mix in your order note.
            </p>
          </div>
          <div className="rounded-2xl border border-sand-200 bg-white/80 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <GiftIcon size={22} className="text-gold-600" /> As a gift
            </h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Any bottle can go out in a gift box. Tick &ldquo;gift box&rdquo; when you send your order.
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Similarly priced</h2>
          <Link href="/scents" className="inline-flex items-center gap-2 font-medium text-gold-700 hover:text-ink-900">
            All scents <ArrowRightIcon size={18} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {similar.map((s) => (
            <ScentCard key={s.slug} scent={s} />
          ))}
        </div>
      </section>

      <JsonLd
        data={[
          productSchema(scent),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "All scents", path: "/scents" },
            { name: scent.name, path: `/scents/${scent.slug}` },
          ]),
        ]}
      />
    </>
  );
}
