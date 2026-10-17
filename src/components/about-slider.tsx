"use client";

import { useState } from "react";

/** A simple slider: one slide at a time, arrows, caption over the image. */
export function AboutSlider({ slides }: { slides: { image: React.ReactNode; title: string; text: string }[] }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);
  return (
    <div className="relative overflow-hidden" aria-roledescription="carousel">
      {slides.map((s, k) => (
        <div key={s.title} className={`transition-opacity duration-700 ${k === i ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`} aria-hidden={k !== i}>
          {s.image}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-10 px-10 text-center text-white">
            <p className="font-display text-[1.6rem] font-bold">{s.title}</p>
            <p className="mx-auto mt-2 max-w-xs text-[15.5px] leading-relaxed">{s.text}</p>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-2xl text-white">
        ‹
      </button>
      <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-2xl text-white">
        ›
      </button>
    </div>
  );
}
