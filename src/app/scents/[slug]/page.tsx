import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScent, scents, similarlyPriced } from "@/content/catalogue";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ScentImage } from "@/components/scent-image";
import { SizePicker } from "@/components/size-picker";
import { scentQuestion, whatsappLink } from "@/lib/links";
import { arabicNumeral, formatRs, isBestSeller, type Scent } from "@/lib/scent";
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

const GALLERY_SIZES = "(min-width: 1024px) 50vw, 100vw";

export default async function ScentPage({ params }: Props) {
  const scent = getScent((await params).slug);
  if (!scent) notFound();
  const best = isBestSeller(scent);

  const about = scent.inspiredBy
    ? `Our impression of ${scent.inspiredBy}. It is not the original branded perfume, and we are not connected to its maker.`
    : `${scent.name} is one of the oils on our register, made as a pure attar or a perfume.`;

  const details: [string, React.ReactNode][] = [
    ["About this scent", <p key="a">{about}{best && " It is one of the scents our customers choose most."}</p>],
    [
      "Attar or perfume",
      <p key="b">
        Attar is pure perfume oil with no alcohol: touched on and close to the skin. Perfume is the same oil blended
        into a spray at 40%, extrait strength, and carries further. Attar comes in 12 ml, with smaller sizes on request.
      </p>,
    ],
    [
      "Mixing and gift boxes",
      <p key="c">
        We can blend {scent.name} with another oil in one bottle, in the proportion you like: add both and tell us in the
        order note. Any bottle can go in a gift box; tick it when you send your order.
      </p>,
    ],
    [
      "How ordering works",
      <p key="d">
        Your order goes to us on WhatsApp with every size and the total. We confirm stock and the final price before you
        pay, and arrange how it reaches you.
      </p>,
    ],
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className="caps !text-[10.5px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span aria-hidden className="px-2">/</span>
          <Link href="/scents" className="hover:text-ink">Collection</Link>
          <span aria-hidden className="px-2">/</span>
          <span className="text-ink">{scent.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Gallery: stacked on large screens, swiped on phones */}
        <div className="-mx-4 flex snap-x snap-mandatory overflow-x-auto sm:mx-0 lg:block lg:space-y-4 lg:overflow-visible" aria-label="Images">
          <ScentImage scent={scent} sizes={GALLERY_SIZES} priority className="w-full shrink-0 snap-center" />
          <ScentImage scent={scent} variant="attar" sizes={GALLERY_SIZES} className="w-full shrink-0 snap-center" />
        </div>

        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="caps flex items-center gap-3 text-muted">
            <span>N° {scent.no}</span>
            <span lang="ar" className="font-arabic text-2xl leading-none normal-case tracking-normal text-brass">
              {arabicNumeral(scent.no)}
            </span>
            {best && <span className="border border-line px-2 py-0.5 !text-[10px] text-ink">Best seller</span>}
          </p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.02] sm:text-6xl">{scent.name}</h1>
          <p className="mt-3 text-[16px] text-muted">{scent.inspiredBy ? `Inspired by ${scent.inspiredBy}` : "Attar & perfume"}</p>

          <div className="mt-8 border-t border-line pt-8">
            <SizePicker scent={scent} />
          </div>

          <a
            href={whatsappLink(scentQuestion(scent.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="caps mt-6 inline-flex items-center gap-2 text-ink-soft transition hover:text-ink"
          >
            <WhatsAppIcon size={15} /> <span className="link-line">Ask us about {scent.name}</span>
          </a>

          <ul className="mt-8 grid grid-cols-3 border-y border-line text-center text-[12.5px] text-muted">
            <li className="py-4">40% oil in every perfume</li>
            <li className="border-x border-line py-4">Alcohol-free attar</li>
            <li className="py-4">Gift box on request</li>
          </ul>

          <div className="mt-2 divide-y divide-line border-b border-line">
            {details.map(([title, body], i) => (
              <details key={title} className="group" open={i === 0}>
                <summary className="caps flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
                  {title}
                  <span aria-hidden className="text-lg leading-none text-brass transition duration-500 group-open:rotate-45">+</span>
                </summary>
                <div className="pb-6 text-[15.5px] leading-relaxed text-ink-soft">{body}</div>
              </details>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-muted/80">Bottles shown are rendered illustrations of our attar and perfume formats.</p>
        </div>
      </section>

      <section className="border-t border-line bg-plaster/50 py-20 sm:py-24" aria-labelledby="similar-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="similar-title" className="font-display text-4xl font-normal">
              At a similar price
            </h2>
            <Link href="/scents" className="caps link-line">
              The full collection
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {similarlyPriced(scent).map((s) => (
              <ProductCard key={s.slug} scent={s} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          productSchema(scent),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The collection", path: "/scents" },
            { name: scent.name, path: `/scents/${scent.slug}` },
          ]),
        ]}
      />
    </>
  );
}
