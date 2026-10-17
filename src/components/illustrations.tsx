import { useId } from "react";
import { starPath } from "@/lib/star";

/**
 * Line drawings of the shop's two formats. Decorative; they stand for attar and
 * perfume in general, not for any particular bottle the shop sells.
 */

export function AttarBottle({ className, wisps = false }: { className?: string; wisps?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 460" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7ecd2" />
          <stop offset=".45" stopColor="#d1a85f" />
          <stop offset="1" stopColor="#8f6527" />
        </linearGradient>
        <radialGradient id={`${id}-glass`} cx=".34" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff6e2" stopOpacity=".22" />
          <stop offset=".6" stopColor="#d1a85f" stopOpacity=".06" />
          <stop offset="1" stopColor="#d1a85f" stopOpacity=".02" />
        </radialGradient>
        <linearGradient id={`${id}-oil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0b75a" stopOpacity=".95" />
          <stop offset=".55" stopColor="#b8691f" stopOpacity=".92" />
          <stop offset="1" stopColor="#5e2c0c" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id={`${id}-wisp`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e2c07f" stopOpacity=".8" />
          <stop offset="1" stopColor="#e2c07f" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-body`}>
          <path d="M98 230C64 248 34 290 34 342c0 56 36 90 76 90s76-34 76-90c0-52-30-94-64-112Z" />
        </clipPath>
      </defs>

      {wisps && (
        <g fill="none" stroke={`url(#${id}-wisp)`} strokeWidth="1.6" strokeLinecap="round" className="wisps">
          <path d="M110 86C92 70 128 56 108 38C92 24 120 14 104 2" />
          <path d="M116 88C138 68 100 54 126 36C142 22 118 12 134 0" />
          <path d="M104 90C84 70 98 52 80 36C70 26 84 12 72 2" />
        </g>
      )}

      <g stroke={`url(#${id}-gold)`} strokeWidth="2" strokeLinejoin="round" fill="none">
        {/* stopper */}
        <circle cx="110" cy="94" r="3.2" fill={`url(#${id}-gold)`} stroke="none" />
        <path d="M110 98c11 22 26 37 26 56 0 18-12 28-26 28s-26-10-26-28c0-19 15-34 26-56Z" fill={`url(#${id}-glass)`} />
        <path d="M110 98v84M84 154c12 6 40 6 52 0" strokeWidth="1.2" opacity=".7" />
        <rect x="97" y="182" width="26" height="10" rx="2" fill="#120d08" />
        <rect x="92" y="192" width="36" height="7" rx="3.5" fill="#120d08" />
        {/* neck */}
        <path d="M100 199h20l2 31H98Z" fill={`url(#${id}-glass)`} />
        {/* body */}
        <g clipPath={`url(#${id}-body)`}>
          <path d="M20 350c40-8 70 8 100 0s55 6 80-2v100H20Z" fill={`url(#${id}-oil)`} stroke="none" />
        </g>
        <path d="M98 230C64 248 34 290 34 342c0 56 36 90 76 90s76-34 76-90c0-52-30-94-64-112Z" fill={`url(#${id}-glass)`} />
        <path d="M110 230v202M98 230c-22 50-26 140-10 200M122 230c22 50 26 140 10 200M34 342c46 14 106 14 152 0" strokeWidth="1.1" opacity=".55" />
        {/* base */}
        <path d="M84 432l-6 16h64l-6-16" fill="#120d08" />
        <path d="M70 448h80" />
      </g>
      <path d="M60 300c-8 30-6 70 10 98" stroke="#fff8e8" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M150 270c10 10 16 22 18 36" stroke="#fff8e8" strokeOpacity=".2" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function PerfumeBottle({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 330" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7ecd2" />
          <stop offset=".45" stopColor="#d1a85f" />
          <stop offset="1" stopColor="#8f6527" />
        </linearGradient>
        <radialGradient id={`${id}-glass`} cx=".3" cy=".25" r=".9">
          <stop offset="0" stopColor="#fff6e2" stopOpacity=".2" />
          <stop offset="1" stopColor="#d1a85f" stopOpacity=".03" />
        </radialGradient>
        <linearGradient id={`${id}-oil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3c877" stopOpacity=".85" />
          <stop offset="1" stopColor="#9a5418" stopOpacity=".9" />
        </linearGradient>
        <clipPath id={`${id}-inner`}>
          <rect x="40" y="104" width="120" height="196" rx="14" />
        </clipPath>
      </defs>
      <g stroke={`url(#${id}-gold)`} strokeWidth="2" strokeLinejoin="round" fill="none">
        <rect x="70" y="12" width="60" height="62" rx="7" fill="#120d08" />
        <path d="M85 12v62M100 12v62M115 12v62" strokeWidth="1" opacity=".5" />
        <rect x="83" y="74" width="34" height="18" rx="2" fill="#120d08" />
        <rect x="28" y="92" width="144" height="220" rx="22" fill={`url(#${id}-glass)`} />
        <g clipPath={`url(#${id}-inner)`}>
          <rect x="30" y="150" width="140" height="170" fill={`url(#${id}-oil)`} stroke="none" />
        </g>
        <rect x="40" y="104" width="120" height="196" rx="14" strokeWidth="1.1" opacity=".6" />
        <path d={starPath(100, 222, 22)} strokeWidth="1.4" fill="#120d08" fillOpacity=".55" />
      </g>
      <path d="M52 124v150" stroke="#fff8e8" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A gold hairline with a small star in the middle. */
export function StarDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/60" />
      <svg width="14" height="14" viewBox="0 0 24 24" className="text-gold-400">
        <path d={starPath(12, 12, 11)} fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/60" />
    </div>
  );
}
