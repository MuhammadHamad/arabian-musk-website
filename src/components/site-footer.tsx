import Link from "next/link";
import { site } from "@/content/site";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";

export function SiteFooter() {
  const socials = [
    site.instagram && { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
    site.facebook && { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
    site.tiktok && { href: site.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];
  const address = site.address ? [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ") : null;

  return (
    <footer className="relative overflow-hidden bg-oud pb-24 pt-20 text-paper/80 sm:pb-12">
      <div aria-hidden className="jaali absolute inset-0 opacity-[0.07]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center">
          <p lang="ar" dir="rtl" className="font-arabic text-5xl text-gold sm:text-6xl">
            {site.arabic}
          </p>
          <Wordmark className="mt-5 block text-[17px] text-paper" />
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-paper/60">
            Attar and perfume from Malogo Chowk, Jhagra, Peshawar.
          </p>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 text-center sm:grid-cols-3 sm:text-left">
          <nav aria-label="Footer">
            <p className="caps text-gold">The collection</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link href="/scents" className="transition hover:text-paper">All scents</Link></li>
              <li><Link href="/#most-loved" className="transition hover:text-paper">Most loved</Link></li>
              <li><Link href="/#attar-or-perfume" className="transition hover:text-paper">Attar or perfume</Link></li>
              <li><Link href="/#bespoke" className="transition hover:text-paper">Mixing and gift boxes</Link></li>
            </ul>
          </nav>
          <div>
            <p className="caps text-gold">The house</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {address && (
                <li>
                  {site.address?.mapsUrl ? (
                    <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-paper">
                      {address}
                    </a>
                  ) : (
                    address
                  )}
                </li>
              )}
              {site.hours && <li>{site.hours}</li>}
              {site.whatsappDisplay && (
                <li>
                  <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="tabular-nums transition hover:text-paper">
                    WhatsApp {site.whatsappDisplay}
                  </a>
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-5 flex justify-center gap-2 sm:justify-start">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Arabian Musk on ${label}`}
                      className="grid size-10 place-items-center border border-white/15 transition hover:border-gold hover:text-gold"
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="caps text-gold">Help</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link href="/#how-to-order" className="transition hover:text-paper">How to order</Link></li>
              <li><Link href="/#faq" className="transition hover:text-paper">Questions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-[12.5px] leading-relaxed text-paper/45 md:flex-row md:justify-between">
          <p className="max-w-3xl">
            Names of other brands are used only to describe the perfumes our scents are inspired by. Our products are
            not those brands&apos; products, and Arabian Musk is not affiliated with them. Bottles are shown as rendered
            illustrations.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} Arabian Musk</p>
        </div>
      </div>
    </footer>
  );
}
