import { site } from "@/content/site";

/** Opens a chat with the shop. Without a number it opens WhatsApp's own chat picker. */
export function whatsappLink(message: string): string {
  const base = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const GREETING = "Assalam o Alaikum Arabian Musk!";

export const GENERAL_MESSAGE = `${GREETING} I'd like to ask about your attars and perfumes.`;

export function scentQuestion(name: string): string {
  return `${GREETING} Is ${name} available? I'd like to know more about it.`;
}

export const telLink = site.phone ? `tel:${site.phone.e164}` : null;
