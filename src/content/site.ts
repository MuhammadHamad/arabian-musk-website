/**
 * The shop's public details. Anything left null is simply not shown on the site,
 * so fill these in as the shop confirms them.
 */
export type Site = {
  brand: string;
  /** "The Arabian Musk", used as a decorative mark. */
  arabic: string;
  description: string;
  /** International format, digits only, e.g. "923001234567". Orders are sent here. */
  whatsapp: string | null;
  /** The same number as people write it. */
  whatsappDisplay: string | null;
  phone: { display: string; e164: string } | null;
  address: { street: string; area?: string; city: string; region?: string; mapsUrl?: string } | null;
  /** Free text, e.g. "Every day, 12 pm to 11 pm". */
  hours: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
};

export const site: Site = {
  brand: "Arabian Musk",
  arabic: "المسك العربي",
  description:
    "Arabian Musk is an attar and perfume shop at Malogo Chowk, Jhagra, Peshawar, with over 100 scents: oud, musk, florals and scents inspired by famous perfumes, as alcohol-free attar or as perfume made with 40% oil.",
  whatsapp: "923705007404",
  whatsappDisplay: "+92 370 5007404",
  phone: null,
  address: {
    street: "Malogo Chowk",
    area: "Jhagra",
    city: "Peshawar",
    region: "Khyber Pakhtunkhwa",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Malogo+Chowk%2C+Jhagra%2C+Peshawar",
  },
  hours: null,
  instagram: null,
  facebook: null,
  tiktok: null,
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabianmusk.co").replace(/\/$/, "");
