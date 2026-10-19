"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { collections } from "@/content/collections";
import { site } from "@/content/site";
import { ArrowRightIcon, BagIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
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
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inertRef = useRef<HTMLElement[]>([]);

  // Everything outside the header and the menu goes inert while the menu is open, and the page stops scrolling.
  // Done in the open/close handlers (not effects) so a dialog opened right after closing is never inert.
  const unlock = useCallback(() => {
    document.documentElement.classList.remove("menu-open");
    inertRef.current.forEach((el) => (el.inert = false));
    inertRef.current = [];
  }, []);

  const openMenu = useCallback(() => {
    const header = headerRef.current;
    const panel = panelRef.current;
    if (!header || !panel) return;
    panel.style.setProperty("--menu-top", `${Math.round(header.getBoundingClientRect().bottom)}px`);
    inertRef.current = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== header && el !== panel && !el.inert,
    );
    inertRef.current.forEach((el) => (el.inert = true));
    document.documentElement.classList.add("menu-open");
    setCollectionsOpen(false);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(
    (focusToggle = false) => {
      unlock();
      setOpen(false);
      if (focusToggle) toggleRef.current?.focus();
    },
    [unlock],
  );

  // Escape closes; growing past the phone/tablet layout closes; leaving the page cleans up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = () => wide.matches && closeMenu();
    // Keep the panel's top edge on the header's bottom edge if anything moves the page or resizes it.
    const place = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom;
      if (bottom !== undefined) panelRef.current?.style.setProperty("--menu-top", `${Math.round(bottom)}px`);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.clearTimeout(t);
    };
  }, [open, closeMenu]);

  useEffect(() => unlock, [unlock]);

  /** Close the menu, then go. Links on the current page scroll once the page is unlocked. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu();
    const [path, hash] = href.split("#");
    if ((path || "/") !== pathname) return; // another page: let the link navigate
    e.preventDefault();
    requestAnimationFrame(() => {
      const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior, block: "start" });
        window.history.replaceState(null, "", href);
      } else {
        window.scrollTo({ top: 0, behavior });
      }
    });
  };

  const isActive = (href: string) =>
    href === pathname || (href === "/scents" && pathname.startsWith("/scents")) || (href === "/#collections" && pathname.startsWith("/collections"));

  let i = 0;
  const step = () => ({ "--i": i++ }) as React.CSSProperties;

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-[44] border-b border-line bg-white/97 backdrop-blur">
        <FloralSprig className="pointer-events-none absolute -top-10 left-[14%] hidden h-48 rotate-12 text-peach opacity-50 lg:block" />
        <div className="relative mx-auto flex h-[5.5rem] max-w-[90rem] items-center gap-3 px-4 sm:gap-6 sm:px-5 lg:h-[7.75rem]">
          <Link href="/" onClick={() => open && closeMenu()} aria-label="Arabian Musk, home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="mx-auto hidden items-center gap-6 xl:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`nav-link transition hover:text-amber ${isActive(n.href) ? "text-amber" : "text-ink"}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 xl:ml-0">
            <button
              type="button"
              onClick={() => {
                if (open) closeMenu();
                openOrder();
              }}
              className="flex items-center gap-3 text-ink transition hover:text-amber"
              aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}, ${formatRs(total)}`}
            >
              <span className="hidden text-[16px] tabular-nums sm:inline">{formatRs(total)}</span>
              <span className="relative">
                <BagIcon size={26} className="text-amber" />
                <span className="absolute -right-2 -top-2 grid min-w-[1.15rem] place-items-center rounded-full bg-amber px-1 text-[10px] font-bold leading-[1.15rem] text-white">
                  {count}
                </span>
              </span>
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle grid size-11 place-items-center bg-amber text-white transition-transform duration-200 active:scale-95 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? closeMenu() : openMenu())}
            >
              <span aria-hidden className="burger">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={panelRef}
        id="mobile-menu"
        className="mobile-menu xl:hidden"
        data-open={open}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <FloralSprig className="pointer-events-none absolute -bottom-6 -right-10 h-80 text-peach opacity-50" />
        <div className="relative flex min-h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-8">
          <nav aria-label="Main">
            <ul>
              {NAV.map((n) =>
                n.href === "/#collections" ? (
                  <li key={n.href} className="menu-item border-b border-line" style={step()}>
                    <div className="flex items-center">
                      <Link
                        href={n.href}
                        onClick={(e) => go(e, n.href)}
                        className={`menu-link flex-1 ${isActive(n.href) ? "text-amber" : "text-ink"}`}
                      >
                        {n.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setCollectionsOpen((v) => !v)}
                        aria-expanded={collectionsOpen}
                        aria-controls="menu-collections"
                        aria-label={collectionsOpen ? "Hide collections" : "Show collections"}
                        className="grid size-11 place-items-center text-amber transition active:scale-90"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={`transition-transform duration-300 ${collectionsOpen ? "rotate-180" : ""}`}>
                          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <div id="menu-collections" className="menu-sub" data-open={collectionsOpen} inert={!collectionsOpen}>
                      <div>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                          {collections.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={`/collections/${c.slug}`}
                                onClick={(e) => go(e, `/collections/${c.slug}`)}
                                className={`block py-2 text-[15px] transition active:text-amber ${pathname === `/collections/${c.slug}` ? "text-amber" : "text-body"}`}
                              >
                                {c.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={n.href} className="menu-item border-b border-line" style={step()}>
                    <Link href={n.href} onClick={(e) => go(e, n.href)} className={`menu-link flex items-center ${isActive(n.href) ? "text-amber" : "text-ink"}`}>
                      <span className="flex-1">{n.label}</span>
                      <ArrowRightIcon size={18} className="menu-arrow text-amber" />
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <button
              type="button"
              className="menu-item btn btn-amber w-full whitespace-nowrap !px-4 !tracking-[2px] min-[360px]:!tracking-[3px]"
              style={step()}
              onClick={() => {
                closeMenu();
                openOrder();
              }}
            >
              <BagIcon size={18} />
              Your order ({count}) · {formatRs(total)}
            </button>
            <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="menu-item btn btn-outline-amber w-full" style={step()}>
              <WhatsAppIcon size={18} />
              WhatsApp us
            </a>
            <div className="menu-item pt-3 text-center text-[14.5px] text-muted" style={step()}>
              {site.address && (
                <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-amber">
                  <PinIcon size={15} />
                  {[site.address.street, site.address.area, site.address.city].filter(Boolean).join(", ")}
                </a>
              )}
              <p lang="ar" dir="rtl" className="mt-2 font-arabic text-2xl text-amber">
                {site.arabic}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
