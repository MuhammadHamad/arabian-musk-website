import Image, { getImageProps } from "next/image";
import Link from "next/link";
import attarWood from "@/assets/renders/attar-wood.jpg";
import heroTall from "@/assets/renders/hero-amber-tall.jpg";
import heroWide from "@/assets/renders/hero-amber.jpg";
import { bestSellers, LOWEST_ATTAR_PRICE, LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { collections, inCollection } from "@/content/collections";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { Accordion } from "@/components/accordion";
import { AboutSlider } from "@/components/about-slider";
import { FloralSprig } from "@/components/floral";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { BottleLabel, ScentImage } from "@/components/scent-image";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";
import { HERO_LABEL, HERO_TALL_LABEL } from "@/lib/renders";
import { formatRs, priceRange } from "@/lib/scent";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Arabian Musk | Attar & Perfume Shop in Peshawar",
  description: `Attar and perfume shop at Malogo Chowk, Jhagra, Peshawar. Over 100 scents as alcohol-free attar or perfume made with 40% oil, from ${formatRs(LOWEST_PRICE)}. Order on WhatsApp.`,
  path: "/",
  absoluteTitle: true,
});

const HERO_ALT = "Arabian Musk perfume bottle and crystal attar flacons on a dark wood block, in amber light through a carved jaali window";

function HeroPicture() {
  const common = { alt: HERO_ALT, sizes: "100vw", priority: true, quality: 82 } as const;
  const { props: { srcSet: wide } } = getImageProps({ ...common, src: heroWide });
  const { props: { srcSet: tall, ...rest } } = getImageProps({ ...common, src: heroTall });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={wide} />
      <source media="(max-width: 767px)" srcSet={tall} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img {...rest} className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

const ABOUT_POINTS = [
  { title: "Pure, Alcohol-Free Attar", body: "Our attars are pure perfume oil with no alcohol. A few touches on the wrists or clothes, and the scent stays close to the skin." },
  { title: "Perfume With 40% Oil", body: "Every perfume we make is 40% perfume oil, extrait strength, where most eau de parfums are 15 to 20%. A few sprays go a long way." },
  { title: "Two Scents in One Bottle", body: "Can't choose? We blend two oils in one bottle, in the proportion you like. Tell us in your order note." },
];

const STEPS = [
  { title: "Choose", text: "Pick a scent and press Select options to choose attar or perfume and the size." },
  { title: "Send on WhatsApp", text: "Your order, sizes and total arrive with us in one WhatsApp message." },
  { title: "We Confirm", text: "We confirm stock and the final price, then arrange how your bottles reach you." },
];

export default function HomePage() {
  const featured = bestSellers.slice(0, 4);
  const listed = bestSellers.slice(4, 8);
  const address = site.address ? [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ") : null;

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative slant-bottom">
        <div className="relative h-[calc(100svh-8rem)] min-h-[34rem] w-full overflow-hidden bg-oud md:h-auto md:min-h-0 md:aspect-[16/9] md:max-h-[calc(100dvh-8rem)]">
          <HeroPicture />
          <div className="hidden md:block">
            <BottleLabel box={HERO_LABEL} />
          </div>
          <div className="md:hidden">
            <BottleLabel box={HERO_TALL_LABEL} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent" />
          <div className="absolute inset-x-0 bottom-16 px-6 text-center text-white md:inset-y-0 md:bottom-auto md:flex md:max-w-[52%] md:items-center md:px-[4.5%] md:pb-10 md:pt-16 md:text-left">
            <div>
              <p className="eyebrow">
                Arabian Musk
                <br />
                Perfume store in Peshawar
              </p>
              <h1 id="hero-title" className="mt-5 font-display text-[3.4rem] font-bold leading-[0.98] text-white sm:text-[5rem] lg:text-[6rem]">
                Attar &amp;
                <span className="sr-only"> Perfume</span>
                <span aria-hidden className="word-cycle relative block h-[1.05em]">
                  <span className="absolute inset-x-0 md:left-0">Perfume</span>
                  <span className="absolute inset-x-0 md:left-0">Oud</span>
                  <span className="absolute inset-x-0 md:left-0">Musk</span>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-white/95 md:mx-0">
                More than a hundred scents, each as a pure, alcohol-free attar or a rich perfume made with 40% oil. Poured for you at Malogo Chowk, Jhagra.
              </p>
              <Link href="/scents" className="btn btn-white mt-8">
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="about-title">
        <FloralSprig className="pointer-events-none absolute -right-16 top-24 hidden h-[32rem] text-peach opacity-60 lg:block" />
        <div className="relative mx-auto grid max-w-[90rem] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-11">
          <div data-reveal>
            <AboutSlider
              slides={[
                {
                  image: <Image src={attarWood} alt="A crystal attar flacon with a gold stopper on dark wood" placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-square w-full object-cover" />,
                  title: "Pure Attar",
                  text: "Perfume oil with no alcohol, close to the skin.",
                },
                {
                  image: <ScentImage scent={bestSellers[0]} scene="marble" square zoom={1.25} sizes="(min-width: 1024px) 45vw, 100vw" />,
                  title: "Rich Perfume",
                  text: "The same oils as a spray, at 40% oil.",
                },
                {
                  image: <ScentImage scent={bestSellers[2]} scene="sand" square zoom={1.25} sizes="(min-width: 1024px) 45vw, 100vw" />,
                  title: "Poured in Peshawar",
                  text: "At our shop at Malogo Chowk, Jhagra.",
                },
              ]}
            />
          </div>
          <div data-reveal>
            <p className="eyebrow text-amber">Welcome to Arabian Musk</p>
            <h2 id="about-title" className="mt-4 text-[2.5rem] sm:text-[2.6rem]">
              Where Every Bottle Is Poured for You
            </h2>
            <p className="mt-6 text-[16.5px] leading-relaxed">
              At our shop at Malogo Chowk in Jhagra, we keep more than a hundred perfume oils: oud and white musk, rose and saffron,
              fruity attars, and our takes on the world&apos;s best-loved perfumes.
            </p>
            <p className="mt-4 text-[16.5px] leading-relaxed">
              Choose any scent and decide how to wear it: as a pure attar, or as a perfume made with 40% oil. Then send us your order on
              WhatsApp. <Link href="/scents" className="font-bold text-ink hover:text-amber">Shop attars and perfumes online.</Link>
            </p>
            <div className="mt-8 border-y border-line">
              <Accordion items={ABOUT_POINTS.map((p) => ({ title: p.title, body: p.body }))} />
            </div>
            <Link href="/scents" className="btn btn-outline-amber mt-9">
              Explore scents
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="border-y border-line py-16" aria-labelledby="collections-title">
        <h2 id="collections-title" className="sr-only">
          Collections
        </h2>
        <ul className="mx-auto flex max-w-[90rem] snap-x gap-6 overflow-x-auto px-5 pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-11">
          {collections.map((c) => {
            const lead = inCollection(c).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))[0];
            return (
              <li key={c.slug} className="w-44 shrink-0 snap-start text-center lg:w-auto">
                <Link href={`/collections/${c.slug}`} className="group block">
                  <div className="mx-auto size-36 overflow-hidden rounded-full sm:size-40">
                    <ScentImage scent={lead} scene={c.scene} square zoom={1.45} sizes="160px" className="transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-5 font-display text-[1.45rem] font-bold text-ink group-hover:text-amber">{c.title}</p>
                  <p className="mt-1 text-[14.5px] text-body">{c.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Collection panel + featured products */}
      <section className="grid lg:grid-cols-2" aria-labelledby="featured-title">
        <div className="relative min-h-[34rem] overflow-hidden lg:min-h-0">
          <Image src={heroTall} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_45%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-14">
            <h2 id="featured-title" className="font-display text-[4rem] font-bold leading-[0.95] text-white sm:text-[6.5rem]">
              The
              <br />
              Register
            </h2>
            <p className="mt-6 max-w-md text-[18px] leading-relaxed">
              {SCENT_COUNT} oils on our shop&apos;s register, from oud and musk to famous impressions. Each comes as attar or perfume.
            </p>
            <Link href="/scents" className="btn btn-amber mt-8">
              View more
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 px-5 py-16 sm:gap-x-10 sm:px-14 lg:py-20">
          {featured.map((s) => (
            <ProductCard key={s.slug} scent={s} />
          ))}
        </div>
      </section>

      {/* Attar or perfume: mosaic */}
      <section id="attar-or-perfume" aria-labelledby="mosaic-title" className="border-t border-line">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative flex flex-col justify-center overflow-hidden px-8 py-16 sm:col-span-2 sm:px-16">
            <FloralSprig className="pointer-events-none absolute -bottom-10 left-6 h-72 text-peach opacity-60" />
            <h2 id="mosaic-title" className="relative text-[2.8rem] sm:text-[3.4rem]">
              Attar or Perfume?
            </h2>
            <p className="relative mt-5 max-w-lg text-[16.5px] leading-relaxed">
              Every scent on our list comes both ways. Attar is pure oil, alcohol-free, from {formatRs(LOWEST_ATTAR_PRICE)}. Perfume is a spray
              with 40% oil, from {formatRs(LOWEST_PRICE)}.
            </p>
            <Link href="/#faq" className="btn btn-outline relative mt-8 self-start">
              Find out more
            </Link>
          </div>
          <MosaicAmber shape="quatrefoil">
            <Image src={attarWood} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
          </MosaicAmber>
          <div className="relative aspect-square">
            <ScentImage scent={bestSellers[1]} scene="marble" square zoom={1.35} sizes="(min-width: 1024px) 25vw, 50vw" className="h-full" />
            <Caption>Perfume · 40% oil</Caption>
          </div>
          <div className="relative aspect-square">
            <ScentImage scent={bestSellers[3]} variant="attar" scene="plaster" square zoom={1.2} sizes="(min-width: 1024px) 25vw, 50vw" className="h-full" />
            <Caption>Attar · pure oil</Caption>
          </div>
          <MosaicAmber shape="arch">
            <ScentImage scent={bestSellers[4]} scene="sand" square zoom={1.6} sizes="(min-width: 1024px) 20vw, 50vw" className="h-full" />
          </MosaicAmber>
          <div className="relative aspect-square overflow-hidden sm:col-span-2 sm:aspect-[2/1]">
            <ScentImage scent={bestSellers[5]} scene="wood" square zoom={1.2} sizes="(min-width: 1024px) 50vw, 100vw" className="!absolute inset-0 h-full sm:!aspect-auto" />
            <Caption>In a gift box, on request</Caption>
          </div>
        </div>
      </section>

      {/* Made for you */}
      <section id="bespoke" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="bespoke-title">
        <FloralSprig className="pointer-events-none absolute left-[18%] top-10 h-[34rem] text-peach opacity-50" />
        <div className="relative mx-auto grid max-w-[90rem] items-center gap-12 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-11">
          <div data-reveal>
            <p className="eyebrow text-[#6b2f1d]">
              Arabian Musk
              <br />
              Malogo Chowk, Peshawar
            </p>
            <h2 id="bespoke-title" className="mt-5 text-[2.8rem] sm:text-[3.4rem]">
              A Bottle That Is Yours
            </h2>
            <div className="mt-6 grid gap-6 text-[16.5px] leading-relaxed sm:grid-cols-2">
              <p>Torn between two scents? We blend both oils in one bottle, in the proportion you choose. Just tell us in your order note.</p>
              <p>Any bottle can leave the shop in a gift box, and attars also come in sizes below 12 ml, so you can try a scent first.</p>
            </div>
            <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-9">
              Order on WhatsApp
            </a>
          </div>
          <div data-reveal>
            <ScentImage scent={bestSellers[1]} scene="wood" zoom={1.15} sizes="(min-width: 1024px) 38vw, 100vw" />
          </div>
        </div>
      </section>

      {/* Best sellers price list */}
      <section id="best-sellers" className="grid lg:grid-cols-2" aria-labelledby="list-title">
        <div className="relative min-h-[26rem]">
          <ScentImage scent={bestSellers[0]} scene="sand" zoom={1.1} sizes="(min-width: 1024px) 50vw, 100vw" className="!absolute inset-0 h-full !aspect-auto" />
        </div>
        <div className="relative overflow-hidden bg-amber px-8 py-20 text-white sm:px-20">
          <div aria-hidden className="jaali absolute inset-0 opacity-[0.07]" />
          <div className="relative">
            <p className="eyebrow">Our best sellers</p>
            <h2 id="list-title" className="mt-4 text-[2.8rem] text-white sm:text-[3.2rem]">
              Most Loved This Year
            </h2>
            <ul className="mt-10 space-y-8">
              {listed.map((s) => (
                <li key={s.slug} className="grid grid-cols-[1fr_auto] gap-6">
                  <div>
                    <Link href={`/scents/${s.slug}`} className="font-display text-[1.6rem] font-bold leading-tight text-white hover:underline">
                      {s.name}
                    </Link>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-white/85">
                      {s.inspiredBy ? `Our impression of ${s.inspiredBy}, as attar or perfume.` : `N° ${s.no} on our register, as attar or perfume.`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[1.45rem] font-bold tabular-nums">{priceRange(s).replace(/Rs /g, "")}</p>
                    <span className="mt-2 inline-block bg-white px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[2px] text-ink">Best</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/collections/best-sellers" className="btn btn-white mt-12">
              Shop all best sellers
            </Link>
          </div>
        </div>
      </section>

      {/* How to order */}
      <section id="how-to-order" className="mx-auto max-w-[90rem] px-5 py-20 sm:py-28 lg:px-11" aria-labelledby="steps-title">
        <div className="text-center">
          <p className="eyebrow text-amber">How to order</p>
          <h2 id="steps-title" className="mt-4 text-[2.8rem] sm:text-[3.2rem]">
            Three Easy Steps
          </h2>
        </div>
        <ol className="mt-14 grid gap-12 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="text-center" data-reveal>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber font-display text-[1.8rem] font-bold text-white">{i + 1}</span>
              <h3 className="mt-5 text-[1.7rem]">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-[16px] leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Visit */}
      <section id="visit" className="relative overflow-hidden" aria-labelledby="visit-title">
        <Image src={heroWide} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center text-white sm:py-32">
          <p className="eyebrow">Visit the shop</p>
          <h2 id="visit-title" className="mt-4 text-[2.8rem] text-white sm:text-[3.4rem]">
            Come and Smell the Oils
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-white/90">
            {address ? `Find us at ${address}.` : "Find us in Peshawar."} Try the scents before you choose, or send us your order on WhatsApp.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-amber">
              <WhatsAppIcon size={18} /> Message us
            </a>
            {site.address?.mapsUrl && (
              <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                Get directions
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section id="faq" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="faq-title">
        <FloralSprig className="pointer-events-none absolute -left-10 bottom-0 h-[30rem] text-peach opacity-50" />
        <div className="relative mx-auto grid max-w-[90rem] gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-11">
          <div>
            <p className="eyebrow text-amber">Questions</p>
            <h2 id="faq-title" className="mt-4 text-[2.8rem] sm:text-[3.2rem]">
              Good to Know
            </h2>
            <p className="mt-5 max-w-sm text-[16.5px] leading-relaxed">Anything else, ask us on WhatsApp at {site.whatsappDisplay}.</p>
          </div>
          <div className="border-y border-line">
            <Accordion items={faqs.map((f) => ({ title: f.q, body: f.a }))} />
          </div>
        </div>
      </section>

      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12 !text-[12px] text-white">
      {children}
    </span>
  );
}

const QUATREFOIL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0a25 25 0 0 1 25 25a25 25 0 1 1 0 50a25 25 0 0 1-50 0a25 25 0 1 1 0-50a25 25 0 0 1 25-25z'/%3E%3C/svg%3E\")";

/** An amber square with an image cut to a quatrefoil or an arch in its centre. */
function MosaicAmber({ shape, children }: { shape: "quatrefoil" | "arch"; children: React.ReactNode }) {
  return (
    <div className="relative grid aspect-square place-items-center bg-amber">
      <div
        className={`relative size-[58%] overflow-hidden ${shape === "arch" ? "rounded-t-full" : ""}`}
        style={shape === "quatrefoil" ? { maskImage: QUATREFOIL, WebkitMaskImage: QUATREFOIL, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
