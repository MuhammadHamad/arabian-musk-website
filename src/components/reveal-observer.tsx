"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades in [data-reveal] elements as they scroll into view. Without JavaScript nothing is
 * hidden: the hiding class is only added by the inline script in the root layout.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & { __revealReady?: boolean }).__revealReady = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

export const revealBootScript =
  "document.documentElement.classList.add('js-reveal');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('js-reveal')},3500);";
