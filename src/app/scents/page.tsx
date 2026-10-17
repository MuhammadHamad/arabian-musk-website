import heroWide from "@/assets/renders/hero-amber.jpg";
import { LOWEST_PRICE, SCENT_COUNT } from "@/content/catalogue";
import { Catalogue } from "@/components/catalogue";
import { JsonLd } from "@/components/json-ld";
import { PageBanner } from "@/components/page-banner";
import { breadcrumbSchema } from "@/lib/schema";
import { formatRs } from "@/lib/scent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop Attars & Perfumes",
  description: `All ${SCENT_COUNT} Arabian Musk scents, each as a 12 ml attar or a 10, 30, 50 or 100 ml perfume, from ${formatRs(LOWEST_PRICE)}. Choose a size and order on WhatsApp.`,
  path: "/scents",
});

export default function ScentsPage() {
  return (
    <>
      <PageBanner image={heroWide} title="Shop">
        <p className="mx-auto mt-4 max-w-md text-[16px] text-white/90">Every scent as attar or perfume. Scents marked &ldquo;impression of&rdquo; are not the original brands.</p>
      </PageBanner>
      <div className="pb-28">
        <Catalogue />
      </div>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/scents" }])} />
    </>
  );
}
