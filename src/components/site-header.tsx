"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/content/site";
import { BagIcon, CloseIcon, MenuIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { FloralSprig } from "@/components/floral";
import { Logo } from "@/components/logo";
import { useOrder } from "@/components/order-provider";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";
import { formatRs } from "@/lib/scent";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/scents", label: "Shop" },
  { href: "/#collections", label: "Collections" },
  { href: "/#how-to-order", label: "How to order" },
  { href: "/#contact", label: "Contact" },
];

export function AnnouncementBar() {
  const address = site.address ? [site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ") : null;
  return (
    <div className="relative overflow-hidden bg-amber text-white">
      <div aria-hidden className="jaali absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto flex max-w-[90rem] items-center justify-center gap-6 px-4 py-2.5 text-[14.5px] sm:justify-between sm:px-5">
        <div className="flex items-center gap-6">
          {site.whatsappDisplay && (
            <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <WhatsAppIcon size={16} />
              <span className="tabular-nums">{site.whatsappDisplay}</span>
            </a>
          )}
          {address && (
            <span className="hidden items-center gap-2 md:flex">
              <PinIcon size={16} />
              {address}
            </span>
          )}
        </div>
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/#how-to-order" className="hover:underline">How to order</Link>
          <Link href="/#faq" className="hover:underline">Questions</Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { count, total, openOrder } = useOrder();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/97 backdrop-blur">
      <FloralSprig className="pointer-events-none absolute -top-10 left-[14%] hidden h-48 rotate-12 text-peach opacity-50 lg:block" />
      <div className="relative mx-auto flex h-[5.5rem] max-w-[90rem] items-center gap-3 px-4 sm:gap-6 sm:px-5 lg:h-[7.75rem]">
        <Link href="/" onClick={close} aria-label="Arabian Musk, home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="mx-auto hidden items-center gap-6 xl:flex">
          {NAV.map((i) => {
            const active = i.href === pathname || (i.href === "/scents" && pathname.startsWith("/scents"));
            return (
              <Link key={i.href} href={i.href} className={`nav-link transition hover:text-amber ${active ? "text-amber" : "text-ink"}`}>
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <button type="button" onClick={openOrder} className="flex items-center gap-3 text-ink transition hover:text-amber" aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}, ${formatRs(total)}`}>
            <span className="hidden text-[16px] tabular-nums sm:inline">{formatRs(total)}</span>
            <span className="relative">
              <BagIcon size={26} className="text-amber" />
              <span className="absolute -right-2 -top-2 grid min-w-[1.15rem] place-items-center rounded-full bg-amber px-1 text-[10px] font-bold leading-[1.15rem] text-white">
                {count}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center bg-amber text-white xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="fade-in border-t border-line bg-white px-5 pb-6 xl:hidden">
          <ul>
            {NAV.map((i) => (
              <li key={i.href}>
                <Link href={i.href} onClick={close} className="nav-link block border-b border-line py-4 text-ink hover:text-amber">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
