import Link from "next/link";
import { getImageProps } from "next/image";
import attarRender from "@/assets/renders/attar.jpg";
import heroTall from "@/assets/renders/hero-tall.jpg";
import heroWide from "@/assets/renders/hero.jpg";
import { bestSellers, LOWEST_ATTAR_PRICE, LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { FaqList } from "@/components/faq-list";
import { ArrowRightIcon, GiftIcon, MixIcon, VialIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { BottleLabel, ScentImage } from "@/components/scent-image";
import { Eyebrow, SectionHeading } from "@/components/section-heading";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";
import { HERO_LABEL, HERO_TALL_LABEL } from "@/lib/renders";
import { formatRs } from "@/lib/scent";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = pageMetadata({
  title: "Arabian Musk | Attar & Perfume Shop in Peshawar",
  description: `Attar and perfume shop at Malogo Chowk, Jhagra, Peshawar. Over 100 scents as alcohol-free attar or perfume made with 40% oil, from ${formatRs(LOWEST_PRICE)}. Order on WhatsApp.`,
  path: "/",
  absoluteTitle: true,
});

const HERO_ALT =
  "An Arabian Musk perfume bottle and two crystal attar flacons on a stone plinth, in sunlight falling through a carved jaali window";

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

const BESPOKE = [
  {
    Icon: MixIcon,
    title: "Two scents, one bottle",
    text: "Torn between two? We blend both oils in one bottle, in the proportion you choose. Tell us in your order note.",
  },
  {
    Icon: GiftIcon,
    title: "In a gift box",
    text: "Any bottle can leave the shop in a gift box. Tick the box when you send your order and we confirm the price.",
  },
  {
    Icon: VialIcon,
    title: "A smaller bottle first",
    text: "Attars also come in sizes below 12 ml, so you can live with a scent before committing to more.",
  },
];

const STEPS = [
  { n: "١", title: "Choose", text: "Pick a scent, then attar or perfume and the size. Add as many as you like." },
  { n: "٢", title: "Send", text: "Your order arrives with us on WhatsApp: every scent, size and the total, in one message." },
  { n: "٣", title: "Receive", text: "We confirm stock and the final price, and arrange how your bottles reach you." },
];

export default function HomePage() {
  const signature = bestSellers[0];
  const address = site.address ? [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ") : null;

  return (
    <>
      {/* Hero: the still life, headline on the open wall */}
      <section aria-labelledby="hero-title" className="relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-plaster md:aspect-[16/9] md:max-h-[calc(100dvh-7rem)] md:min-h-[34rem]">
          <HeroPicture />
          <div className="hidden md:block">
            <BottleLabel box={HERO_LABEL} />
          </div>
          <div className="md:hidden">
            <BottleLabel box={HERO_TALL_LABEL} />
          </div>
          <div className="absolute inset-y-0 left-0 hidden w-[46%] items-center md:flex">
            <HeroText />
          </div>
        </div>
        <div className="px-6 pb-14 pt-10 md:hidden">
          <HeroText />
        </div>
      </section>

      {/* The house */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32" aria-labelledby="house-title">
        <div data-reveal>
          <Eyebrow>The house</Eyebrow>
          <h2 id="house-title" className="sr-only">
            About Arabian Musk
          </h2>
          <p className="mt-8 font-display text-[1.65rem] font-normal leading-[1.45] text-ink sm:text-[2.15rem]">
            At Malogo Chowk in Jhagra, we keep more than a hundred perfume oils: oud and white musk, rose and saffron,
            and our takes on the world&apos;s most loved perfumes. Choose a scent, choose how to wear it, and we pour it
            for you.
          </p>
          <p lang="ar" dir="rtl" className="mt-10 font-arabic text-4xl text-brass">
            {site.arabic}
          </p>
        </div>
      </section>

      {/* Most loved */}
      <section id="most-loved" className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32" aria-labelledby="loved-title">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-14">
          <SectionHeading id="loved-title" eyebrow="Most loved" title="The house favourites" intro="The eight scents our customers chose most over the past year." />
          <Link href="/scents" className="caps link-line text-ink" data-reveal>
            All {SCENT_COUNT} scents
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {bestSellers.map((s, i) => (
            <ProductCard key={s.slug} scent={s} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Attar or perfume: two editorial spreads */}
      <section id="attar-or-perfume" className="bg-plaster" aria-labelledby="formats-title">
        <h2 id="formats-title" className="sr-only">
          Attar or perfume
        </h2>
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="relative aspect-[4/5]">
            <Image src={attarRender} alt="A crystal attar flacon with a gold stopper" fill sizes="(min-width: 768px) 50vw, 100vw" placeholder="blur" className="object-cover" />
          </div>
          <FormatText
            numeral="I"
            name="Attar"
            text="Pure perfume oil, with no alcohol at all. A few touches on the wrists, the neck or your clothes, and it stays close to the skin. The classic choice for every day, for gifts, and for namaz."
            facts={[
              ["What it is", "Pure perfume oil"],
              ["Alcohol", "None"],
              ["Bottle", "12 ml, smaller on request"],
              ["From", formatRs(LOWEST_ATTAR_PRICE)],
            ]}
          />
        </div>
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="md:order-2">
            <ScentImage scent={signature} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <FormatText
            numeral="II"
            name="Perfume"
            text="The same oils, blended with perfumer's alcohol into a spray. Ours are 40% oil, which is extrait strength; most eau de parfums are 15 to 20%. A few sprays carry the scent around you."
            facts={[
              ["What it is", "Spray, 40% perfume oil"],
              ["Strength", "Extrait"],
              ["Bottles", "10, 30, 50 and 100 ml"],
              ["From", formatRs(LOWEST_PRICE)],
            ]}
          />
        </div>
      </section>

      {/* Made for you */}
      <section id="bespoke" className="relative overflow-hidden bg-oud py-24 text-paper sm:py-32" aria-labelledby="bespoke-title">
        <div aria-hidden className="jaali absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading id="bespoke-title" tone="dark" align="center" eyebrow="Made for you" title="A bottle that is yours alone" />
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
            {BESPOKE.map(({ Icon, title, text }) => (
              <div key={title} className="text-center md:px-10" data-reveal>
                <Icon size={30} className="mx-auto text-gold" strokeWidth={1.1} />
                <h3 className="mt-6 font-display text-2xl font-normal">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-paper/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to order */}
      <section id="how-to-order" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32" aria-labelledby="order-title">
        <SectionHeading id="order-title" align="center" eyebrow="How to order" title="Three steps, one message" />
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((s) => (
            <li key={s.title} className="border-t border-line pt-8 text-center" data-reveal>
              <span lang="ar" className="font-arabic text-5xl text-brass">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-2xl font-normal">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 text-center" data-reveal>
          <Link href="/scents" className="btn btn-ink">
            Discover the collection
          </Link>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="bg-plaster" aria-labelledby="visit-title">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[38rem]">
            <Image src={heroTall} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" placeholder="blur" className="object-cover" />
            <BottleLabel box={HERO_TALL_LABEL} />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-14 md:py-24">
            <div data-reveal>
              <Eyebrow>Visit the house</Eyebrow>
              <h2 id="visit-title" className="mt-4 font-display text-[2.4rem] font-normal leading-[1.08] sm:text-5xl">
                Malogo Chowk, Jhagra
              </h2>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
                Come and smell the oils before you choose, or send us your order on WhatsApp.
              </p>
              <dl className="mt-8 max-w-md divide-y divide-line border-y border-line text-[15px]">
                {address && <Fact label="Address" value={address} />}
                {site.hours && <Fact label="Hours" value={site.hours} />}
                {site.whatsappDisplay && <Fact label="WhatsApp" value={site.whatsappDisplay} />}
              </dl>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                  <WhatsAppIcon size={17} />
                  Message us
                </a>
                {site.address?.mapsUrl && (
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="caps link-line">
                    Get directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="faq-title">
        <SectionHeading id="faq-title" eyebrow="Questions" title="Good to know" intro="Anything else, ask us on WhatsApp." />
        <div data-reveal>
          <FaqList faqs={faqs} />
        </div>
      </section>

      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}

function HeroText() {
  return (
    <div className="max-w-[36rem] md:pl-[10%] lg:pl-[14%]">
      <p className="caps text-brass-deep">Attar &amp; perfume house · Peshawar</p>
      <h1 id="hero-title" className="mt-5 font-display text-[3rem] font-normal leading-[1.04] text-ink sm:text-6xl lg:text-[4.4rem]">
        <span className="whitespace-nowrap">Pure attar.</span>
        <br />
        <em className="whitespace-nowrap font-normal">Rich perfume.</em>
      </h1>
      <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-ink-soft">
        More than a hundred scents, each made two ways: as an alcohol-free attar, or as a perfume with 40% oil.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Link href="/scents" className="btn btn-ink">
          Discover the collection
        </Link>
        <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="caps link-line inline-flex items-center gap-2 text-ink">
          Order on WhatsApp <ArrowRightIcon size={14} />
        </a>
      </div>
    </div>
  );
}

function FormatText({ numeral, name, text, facts }: { numeral: string; name: string; text: string; facts: [string, string][] }) {
  return (
    <div className="flex items-center px-6 py-16 sm:px-14 md:py-20">
      <div data-reveal>
        <Eyebrow>{numeral} · Two ways to wear it</Eyebrow>
        <h3 className="mt-4 font-display text-5xl font-normal leading-none sm:text-6xl">{name}</h3>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">{text}</p>
        <dl className="mt-8 max-w-md divide-y divide-line border-y border-line text-[15px]">
          {facts.map(([k, v]) => (
            <Fact key={k} label={k} value={v} />
          ))}
        </dl>
        <Link href="/scents" className="caps link-line mt-8 inline-block">
          Choose a scent
        </Link>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="caps !text-[10.5px] text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
