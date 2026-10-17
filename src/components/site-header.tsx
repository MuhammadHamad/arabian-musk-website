"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { useOrder } from "@/components/order-provider";

const LEFT = [
  { href: "/scents", label: "Collection" },
  { href: "/#attar-or-perfume", label: "Attar & Perfume" },
];
const RIGHT = [{ href: "/#visit", label: "Visit" }];
const MOBILE = [
  { href: "/scents", label: "The collection" },
  { href: "/#most-loved", label: "Most loved" },
  { href: "/#attar-or-perfume", label: "Attar & perfume" },
  { href: "/#bespoke", label: "Made for you" },
  { href: "/#visit", label: "Visit the house" },
  { href: "/#faq", label: "Questions" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper">
      <p className="caps mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center !text-[10.5px] !tracking-[0.18em]">
        <span>Orders on WhatsApp</span>
        <span aria-hidden className="text-gold">·</span>
        <span className="tabular-nums">{site.whatsappDisplay}</span>
        <span aria-hidden className="hidden text-gold sm:inline">·</span>
        <span className="hidden sm:inline">Malogo Chowk, Jhagra, Peshawar</span>
      </p>
    </div>
  );
}

export function SiteHeader() {
  const { count, openOrder } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
        <nav aria-label="Main" className="flex items-center gap-8">
          <button
            type="button"
            className="-ml-2 grid size-11 place-items-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
          {LEFT.map((i) => (
            <Link key={i.href} href={i.href} className="caps hidden text-ink-soft transition hover:text-ink md:inline">
              {i.label}
            </Link>
          ))}
        </nav>

        <Link href="/" onClick={close} aria-label="Arabian Musk, home" className="text-center">
          <Wordmark className="text-[15px] sm:text-[19px]" />
        </Link>

        <div className="flex items-center justify-end gap-8">
          {RIGHT.map((i) => (
            <Link key={i.href} href={i.href} className="caps hidden text-ink-soft transition hover:text-ink md:inline">
              {i.label}
            </Link>
          ))}
          <button type="button" onClick={openOrder} className="caps hidden text-ink-soft transition hover:text-ink md:inline">
            Order ({count})
          </button>
          <button
            type="button"
            onClick={openOrder}
            className="relative -mr-2 grid size-11 place-items-center md:hidden"
            aria-label={count ? `Your order, ${count} ${count === 1 ? "item" : "items"}` : "Your order"}
          >
            <BagIcon size={21} />
            {count > 0 && (
              <span className="absolute right-1 top-1.5 grid min-w-[1.1rem] place-items-center bg-ink px-1 text-[10px] font-medium leading-[1.1rem] text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="fade-in h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-paper px-6 pb-10 pt-6 md:hidden">
          <ul>
            {MOBILE.map((i) => (
              <li key={i.href}>
                <Link href={i.href} onClick={close} className="block border-b border-line py-4 font-display text-[1.7rem]">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <p lang="ar" dir="rtl" className="mt-10 text-center font-arabic text-4xl text-brass">
            {site.arabic}
          </p>
        </nav>
      )}
    </header>
  );
}
