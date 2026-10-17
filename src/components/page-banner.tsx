import Image, { type StaticImageData } from "next/image";

/** A photograph banner with a slanted lower edge and the page title over it. */
export function PageBanner({ image, title, children }: { image: StaticImageData; title: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[75rem] px-0 sm:px-5">
      <div className="slant-bottom-sm relative grid h-64 place-items-center overflow-hidden sm:h-[22rem]">
        <Image src={image} alt="" fill priority placeholder="blur" sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover object-[50%_45%]" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative px-6 pb-8 text-center text-white">
          <h1 className="font-display text-[3.2rem] font-bold uppercase leading-none text-white sm:text-[4.2rem]">{title}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}
