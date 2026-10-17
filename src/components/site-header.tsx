"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { useOrder } from "@/components/order-provider";

const NAV = [
  { href: "/scents", label: "All scents" },
  { href: "/#attar-or-perfume", label: "Attar or perfume" },
  { href: "/#how-to-order", label: "How to order" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const { count, openOrder } = useOrder();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold-400/15 bg-ink-950/92 text-sand-100 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Link href="/" aria-label="Arabian Musk, home" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-7 text-[15px] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="text-sand-200 transition hover:text-gold-300 aria-[current=page]:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 md:ml-2">
          <button
            type="button"
            onClick={openOrder}
            className="relative grid size-11 place-items-center rounded-full text-sand-100 transition hover:bg-white/5 hover:text-gold-300"
            aria-label={count ? `Your order, ${count} ${count === 1 ? "item" : "items"}` : "Your order"}
          >
            <BagIcon size={22} />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-semibold leading-5 text-ink-950">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full transition hover:bg-white/5 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-gold-400/15 px-4 pb-4 md:hidden">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/5 py-3.5 font-display text-xl text-sand-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
