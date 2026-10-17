import type { Metadata } from "next";
import { notFound } from "next/navigation";
import heroWide from "@/assets/renders/hero-amber.jpg";
import { collections, getCollection, inCollection } from "@/content/collections";
import { Catalogue } from "@/components/catalogue";
import { JsonLd } from "@/components/json-ld";
import { PageBanner } from "@/components/page-banner";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.title}: Attars & Perfumes`,
    description: `${c.title} at Arabian Musk, Peshawar: ${c.blurb.toLowerCase()}. ${inCollection(c).length} scents, each as attar or perfume. Order on WhatsApp.`,
    path: `/collections/${c.slug}`,
  });
}

export default async function CollectionPage({ params }: Props) {
  const c = getCollection((await params).slug);
  if (!c) notFound();
  return (
    <>
      <PageBanner image={heroWide} title={c.title}>
        <p className="mx-auto mt-4 max-w-md text-[16px] text-white/90">{c.blurb}.</p>
      </PageBanner>
      <div className="pb-28">
        <Catalogue collection={c.slug} />
      </div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/scents" },
          { name: c.title, path: `/collections/${c.slug}` },
        ])}
      />
    </>
  );
}
