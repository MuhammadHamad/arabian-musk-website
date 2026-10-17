import Link from "next/link";
import { FloralSprig } from "@/components/floral";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden px-6 py-32 text-center">
      <FloralSprig className="pointer-events-none absolute left-1/2 top-6 h-96 -translate-x-1/2 text-peach opacity-50" />
      <div className="relative">
        <p className="eyebrow text-amber">Page not found</p>
        <h1 className="mt-4 text-[3rem]">This Scent Has Evaporated</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px]">The link may be old, or the scent may have a new name.</p>
        <Link href="/scents" className="btn btn-amber mt-10">
          Shop now
        </Link>
      </div>
    </section>
  );
}
