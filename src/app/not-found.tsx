import Link from "next/link";
import { StarMark } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-ink-950 px-4 py-28 text-center text-sand-100">
      <div aria-hidden className="pattern-stars absolute inset-0 opacity-[0.06]" />
      <div className="relative">
        <StarMark size={40} className="mx-auto text-gold-400" />
        <h1 className="mt-6 font-display text-5xl">This page has evaporated</h1>
        <p className="mx-auto mt-4 max-w-md text-stone-300">The link may be old, or the scent may have a new name.</p>
        <Link
          href="/scents"
          className="mt-8 inline-flex rounded-full bg-gold-400 px-7 py-3.5 font-medium text-ink-950 transition hover:bg-gold-300"
        >
          Browse all scents
        </Link>
      </div>
    </section>
  );
}
