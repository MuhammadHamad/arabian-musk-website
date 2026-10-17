import Link from "next/link";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p lang="ar" dir="rtl" className="font-arabic text-5xl text-brass">
        {site.arabic}
      </p>
      <h1 className="mt-8 font-display text-5xl font-normal">This page has evaporated</h1>
      <p className="mx-auto mt-5 max-w-md text-[17px] text-muted">The link may be old, or the scent may have a new name.</p>
      <Link href="/scents" className="btn btn-ink mt-10">
        Discover the collection
      </Link>
    </section>
  );
}
