import Link from "next/link";
import { site } from "@/content/site";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { StarDivider } from "@/components/illustrations";

export function SiteFooter() {
  const socials = [
    site.instagram && { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
    site.facebook && { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
    site.tiktok && { href: site.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <footer className="relative overflow-hidden bg-ink-950 pb-28 pt-16 text-sand-200 sm:pb-16">
      <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-sand-50" />
            <p lang="ar" dir="rtl" className="mt-3 text-left font-arabic text-3xl text-gold-400/80">
              {site.arabic}
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-stone-400">{site.description}</p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-300">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link href="/scents" className="transition hover:text-gold-300">All scents</Link></li>
              <li><Link href="/#best-sellers" className="transition hover:text-gold-300">Best sellers</Link></li>
              <li><Link href="/#attar-or-perfume" className="transition hover:text-gold-300">Attar or perfume</Link></li>
              <li><Link href="/#how-to-order" className="transition hover:text-gold-300">How to order</Link></li>
              <li><Link href="/#faq" className="transition hover:text-gold-300">Questions</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-300">The shop</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-stone-400">
              {site.address && (
                <li>
                  {site.address.mapsUrl ? (
                    <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-300">
                      {[site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ")}
                    </a>
                  ) : (
                    [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ")
                  )}
                </li>
              )}
              {site.hours && <li>{site.hours}</li>}
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.e164}`} className="transition hover:text-gold-300">{site.phone.display}</a>
                </li>
              )}
              {site.whatsappDisplay && (
                <li>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-gold-300"
                  >
                    WhatsApp {site.whatsappDisplay}
                  </a>
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Arabian Musk on ${label}`}
                      className="grid size-10 place-items-center rounded-full border border-gold-400/30 text-gold-300 transition hover:bg-gold-400 hover:text-ink-950"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <StarDivider className="mt-12" />
        <div className="mt-6 flex flex-col gap-3 text-[13px] leading-relaxed text-stone-500 md:flex-row md:justify-between">
          <p className="max-w-3xl">
            Names of other brands are used only to describe the perfumes our scents are inspired by. Our products are
            not those brands&apos; products, and Arabian Musk is not affiliated with them.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} Arabian Musk</p>
        </div>
      </div>
    </footer>
  );
}
