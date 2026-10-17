import { GREETING } from "@/lib/links";
import { formatRs, sizeLabel, type Scent } from "@/lib/scent";
import type { OrderState } from "@/lib/order-store";

export type PricedLine = { scent: Scent; size: OrderState["lines"][number]["size"]; qty: number; unit: number; total: number };

export function priceLines(order: OrderState, lookup: (slug: string) => Scent | undefined): PricedLine[] {
  return order.lines.flatMap((l) => {
    const scent = lookup(l.slug);
    if (!scent) return [];
    const unit = scent.prices[l.size];
    return [{ scent, size: l.size, qty: l.qty, unit, total: unit * l.qty }];
  });
}

/** The WhatsApp message the order button sends. *Asterisks* are WhatsApp bold. */
export function orderMessage(lines: PricedLine[], order: OrderState): string {
  const total = lines.reduce((sum, l) => sum + l.total, 0);
  const out = [`${GREETING} I'd like to order:`, ""];
  lines.forEach((l, i) => {
    out.push(`${i + 1}. *${l.scent.name}*, ${sizeLabel(l.size)} x ${l.qty} = ${formatRs(l.total)}`);
  });
  out.push("", `*Total: ${formatRs(total)}*`);
  if (order.giftBox) out.push("Please pack it in a gift box.");
  if (order.note.trim()) out.push("", `Note: ${order.note.trim()}`);
  return out.join("\n");
}
