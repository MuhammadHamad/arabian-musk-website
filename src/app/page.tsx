import Link from "next/link";
import { bestSellers, LOWEST_ATTAR_PRICE, LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { FaqList } from "@/components/faq-list";
import { ArrowRightIcon, ClockIcon, GiftIcon, MixIcon, PhoneIcon, PinIcon, VialIcon, WhatsAppIcon } from "@/components/icons";
import { AttarBottle, PerfumeBottle, StarDivider } from "@/components/illustrations";
import { JsonLd } from "@/components/json-ld";
import { ScentCard } from "@/components/scent-card";
import { SectionHeading } from "@/components/section-heading";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";
import { formatRs } from "@/lib/scent";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Arabian Musk | Attar & Perfume Shop in Peshawar",
  description: `Attar and perfume shop at Malogo Chowk, Jhagra, Peshawar. Over 100 scents as alcohol-free attar or perfume made with 40% oil, from ${formatRs(LOWEST_PRICE)}. Order on WhatsApp.`,
  path: "/",
  absoluteTitle: true,
});

const FACTS = [
  { value: String(SCENT_COUNT), label: "Scents on our price list" },
  { value: "0%", label: "Alcohol in our attars" },
  { value: "40%", label: "Oil in every perfume" },
  { value: formatRs(LOWEST_PRICE), label: "Prices start at" },
];

const EXTRAS = [
  {
    Icon: MixIcon,
    title: "Mix two scents",
    text: "Can't choose between two? We can blend both oils in one bottle, in the proportion you like. Add both and tell us in your order note.",
  },
  {
    Icon: GiftIcon,
    title: "In a gift box",
    text: "Any bottle can go out in a gift box. Tick \"gift box\" when you send your order and we'll confirm the price.",
  },
  {
    Icon: VialIcon,
    title: "Smaller sizes",
    text: "Want to try a scent first? Attars also come in sizes smaller than 12 ml. Ask us on WhatsApp.",
  },
];

const STEPS = [
  { title: "Choose your scents", text: "Tap any size and price to add it to your order. Mix attars and perfumes as you like." },
  { title: "Send it on WhatsApp", text: "Your list, sizes and total arrive with us in one message, ready to confirm." },
  { title: "We confirm", text: "We check stock, confirm the final total and arrange how you'll get your order." },
];

export default function HomePage() {
  const hasVisitDetails = Boolean(site.address || site.hours || site.phone || site.whatsappDisplay);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-sand-100" aria-labelledby="hero-title">
        <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.07]" />
        <div
          aria-hidden
          className="absolute -right-40 top-0 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(209,168,95,0.22),rgba(209,168,95,0)_65%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-12 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:pb-16 md:pt-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-300">Attar &amp; perfume house</p>
            <h1 id="hero-title" className="mt-5 font-display text-[2.75rem] leading-[1.02] text-sand-50 sm:text-6xl lg:text-7xl">
              Pure attars.
              <br />
              Rich perfumes.
              <br />
              <em className="text-gold-sheen font-medium">Over 100 scents.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
              Oud, musk, florals and scents inspired by the world&apos;s best-loved perfumes. Every one comes as an
              alcohol-free attar or as a perfume made with 40% oil.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/scents"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 font-medium text-ink-950 transition hover:bg-gold-300"
              >
                Browse all scents
                <ArrowRightIcon size={18} />
              </Link>
              <a
                href={whatsappLink(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-7 py-3.5 font-medium text-sand-100 transition hover:border-gold-300 hover:text-gold-200"
              >
                <WhatsAppIcon size={19} />
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-[270px] w-full max-w-[22rem] sm:h-[460px]" aria-hidden>
            <p
              lang="ar"
              dir="rtl"
              className="absolute inset-x-0 top-[38%] text-center font-arabic text-[4.25rem] leading-none text-gold-400/[0.13] sm:text-[7.5rem]"
            >
              {site.arabic}
            </p>
            <AttarBottle wisps className="float-slow absolute left-1/2 top-0 h-full -translate-x-[62%]" />
            <PerfumeBottle className="absolute bottom-1 right-0 h-[42%] sm:right-2" />
          </div>
        </div>

        <dl className="relative mx-auto grid max-w-7xl grid-cols-2 border-t border-gold-400/15 px-4 sm:px-6 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse gap-1 py-6 ${i % 2 ? "pl-5" : "pr-5"} md:px-0 ${i > 0 ? "md:border-l md:border-gold-400/15 md:pl-8" : ""}`}
            >
              <dt className="text-[13px] uppercase tracking-[0.16em] text-stone-400">{f.label}</dt>
              <dd className="font-display text-3xl text-gold-300 sm:text-4xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Best sellers */}
      <section id="best-sellers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="best-sellers-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="best-sellers-title"
            eyebrow="Customer favourites"
            title="Our most-loved scents"
            intro="The eight scents our customers bought most over the past year. Tap a size to add it to your order."
          />
          <Link
            href="/scents"
            className="inline-flex items-center gap-2 font-medium text-gold-700 transition hover:text-ink-900"
            data-reveal
          >
            See all {SCENT_COUNT} scents <ArrowRightIcon size={18} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((s) => (
            <ScentCard key={s.slug} scent={s} />
          ))}
        </div>
      </section>

      {/* Attar or perfume */}
      <section
        id="attar-or-perfume"
        className="relative overflow-hidden bg-ink-900 py-20 text-sand-100 md:py-28"
        aria-labelledby="formats-title"
      >
        <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="formats-title"
            tone="dark"
            eyebrow="Two ways to wear it"
            title="Attar or perfume?"
            intro="Every scent on our list comes both ways. Here is how to choose."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              {
                name: "Attar",
                art: <AttarBottle className="h-44 w-auto" />,
                text: "Pure perfume oil with no alcohol. Dab a little on your wrists, neck or clothes. It stays close to the skin and is the classic choice for everyday wear, gifts and namaz.",
                specs: ["12 ml bottle", "Smaller sizes on request", `From ${formatRs(LOWEST_ATTAR_PRICE)}`],
              },
              {
                name: "Perfume",
                art: <PerfumeBottle className="h-40 w-auto" />,
                text: "A spray made with 40% perfume oil. That is extrait strength; most eau de parfums are 15 to 20%. A few sprays go a long way and carry the scent around you.",
                specs: ["10, 30, 50 and 100 ml", "40% oil", `From ${formatRs(LOWEST_PRICE)}`],
              },
            ].map((f) => (
              <article
                key={f.name}
                data-reveal
                className="grid grid-cols-[auto_1fr] items-center gap-6 rounded-3xl border border-gold-400/15 bg-ink-850/80 p-6 sm:gap-8 sm:p-8"
              >
                <div className="grid w-24 place-items-center sm:w-32">{f.art}</div>
                <div>
                  <h3 className="font-display text-3xl text-sand-50">{f.name}</h3>
                  <p className="mt-3 leading-relaxed text-stone-300">{f.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {f.specs.map((s) => (
                      <li key={s} className="rounded-full border border-gold-400/25 px-3 py-1 text-sm text-gold-200">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Extras + how to order */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="extras-title">
        <SectionHeading id="extras-title" eyebrow="Made your way" title="A bottle that's yours" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {EXTRAS.map(({ Icon, title, text }) => (
            <article key={title} data-reveal className="rounded-2xl border border-sand-200 bg-white/80 p-6">
              <span className="grid size-12 place-items-center rounded-full bg-gold-100 text-gold-700">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 font-display text-2xl">{title}</h3>
              <p className="mt-2 leading-relaxed text-stone-600">{text}</p>
            </article>
          ))}
        </div>

        <div id="how-to-order" className="mt-24">
          <SectionHeading eyebrow="How to order" title="Ordering takes a minute" />
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} data-reveal className="border-t border-gold-500/40 pt-6">
                <span className="font-display text-5xl text-gold-500">{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-stone-600">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12" data-reveal>
            <Link
              href="/scents"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 font-medium text-sand-50 transition hover:bg-ink-700"
            >
              Start choosing <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-sand-100 py-20 md:py-28" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="Questions" title="Good to know" intro="Still unsure about something? Ask us on WhatsApp." />
          <div data-reveal>
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Visit / contact */}
      <section id="visit" className="relative overflow-hidden bg-ink-900 py-20 text-sand-100 md:py-24" aria-labelledby="visit-title">
        <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.05]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p lang="ar" dir="rtl" className="font-arabic text-4xl text-gold-400/80" aria-hidden>
            {site.arabic}
          </p>
          <h2 id="visit-title" className="mt-4 font-display text-4xl leading-tight text-sand-50 sm:text-5xl" data-reveal>
            {hasVisitDetails ? "Visit the shop or message us" : "Found your scent?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-300" data-reveal>
            {hasVisitDetails
              ? "Come and try the scents in person at Malogo Chowk, or send us your order on WhatsApp."
              : "Send us your order or any question on WhatsApp. We reply with stock and the final price."}
          </p>
          {hasVisitDetails && (
            <ul className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 text-stone-300 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
              {site.address && (
                <li className="flex items-center gap-2">
                  <PinIcon size={18} className="text-gold-300" />
                  {site.address.mapsUrl ? (
                    <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {[site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ")}
                    </a>
                  ) : (
                    [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ")
                  )}
                </li>
              )}
              {site.hours && (
                <li className="flex items-center gap-2">
                  <ClockIcon size={18} className="text-gold-300" />
                  {site.hours}
                </li>
              )}
              {site.whatsappDisplay && (
                <li className="flex items-center gap-2">
                  <WhatsAppIcon size={18} className="text-gold-300" />
                  <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="hover:text-gold-200">
                    {site.whatsappDisplay}
                  </a>
                </li>
              )}
              {site.phone && (
                <li className="flex items-center gap-2">
                  <PhoneIcon size={18} className="text-gold-300" />
                  <a href={`tel:${site.phone.e164}`} className="hover:text-gold-200">
                    {site.phone.display}
                  </a>
                </li>
              )}
            </ul>
          )}
          <StarDivider className="mx-auto mt-10 max-w-xs" />
          <a
            href={whatsappLink(GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-gold-400 px-8 py-4 font-medium text-ink-950 transition hover:bg-gold-300"
          >
            <WhatsAppIcon size={20} />
            Message us on WhatsApp
          </a>
        </div>
      </section>

      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
