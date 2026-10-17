import Link from "next/link";
import { site } from "@/content/site";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";
import { FloralSprig } from "@/components/floral";
import { Logo } from "@/components/logo";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";

export function SiteFooter() {
  const socials = [
    site.whatsapp && { href: whatsappLink(GENERAL_MESSAGE), label: "WhatsApp", Icon: WhatsAppIcon },
    site.instagram && { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
    site.facebook && { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
    site.tiktok && { href: site.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <footer id="contact">
      <div className="relative overflow-hidden bg-amber py-24 text-white">
        <FloralSprig className="pointer-events-none absolute left-1/2 top-4 h-[28rem] -translate-x-1/2 text-black opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-[90rem] gap-12 px-6 text-center md:grid-cols-3 md:text-left">
          <div>
            <h2 className="font-display text-[1.75rem] text-white">Address :</h2>
            <ul className="mt-5 space-y-3 text-[16px]">
              {site.address && <li>Shop : {[site.address.street, site.address.area].filter(Boolean).join(", ")}</li>}
              {site.address && <li>City : {site.address.city}</li>}
              <li>Country : Pakistan</li>
              {site.address?.mapsUrl && (
                <li>
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    Get directions
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-end text-center">
            <Logo light />
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-white/90">
              Attars and perfumes, poured for you at Malogo Chowk. Every scent as a pure attar or a perfume with 40% oil.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-4">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Arabian Musk on ${label}`} className="transition hover:opacity-75">
                      <Icon size={22} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:text-right">
            <h2 className="font-display text-[1.75rem] text-white">Info :</h2>
            <ul className="mt-5 space-y-3 text-[16px]">
              {site.whatsappDisplay && (
                <li>
                  <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="tabular-nums hover:underline">
                    WhatsApp : {site.whatsappDisplay}
                  </a>
                </li>
              )}
              {site.hours && <li>Hours : {site.hours}</li>}
              <li>Orders : on WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-white px-6 pb-24 pt-8 text-center sm:pb-10">
        <nav aria-label="Footer" className="eyebrow flex flex-wrap items-center justify-center gap-x-5 gap-y-2 !text-[13px] text-body">
          <Link href="/scents" className="hover:text-amber">Shop</Link>
          <span aria-hidden className="text-amber">•</span>
          <Link href="/#how-to-order" className="hover:text-amber">How to order</Link>
          <span aria-hidden className="text-amber">•</span>
          <Link href="/#faq" className="hover:text-amber">Questions</Link>
        </nav>
        <p className="mx-auto mt-5 max-w-3xl text-[13px] leading-relaxed text-muted">
          Names of other brands are used only to describe the perfumes our scents are inspired by. Our products are not those
          brands&apos; products, and Arabian Musk is not affiliated with them. Bottles are shown as rendered illustrations.
        </p>
        <p className="eyebrow mt-5 !text-[12px] text-body">© {new Date().getFullYear()} Arabian Musk · Peshawar</p>
      </div>
    </footer>
  );
}
