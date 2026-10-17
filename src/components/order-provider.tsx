"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { scents } from "@/content/scents";
import { site } from "@/content/site";
import { BagIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from "@/components/icons";
import { GENERAL_MESSAGE, whatsappLink } from "@/lib/links";
import { orderMessage, priceLines } from "@/lib/order-message";
import { createOrderStore } from "@/lib/order-store";
import { formatRs, sizeLabel, type Scent, type SizeKey } from "@/lib/scent";

const BY_SLUG = new Map(scents.map((s) => [s.slug, s]));
const store = createOrderStore(new Set(BY_SLUG.keys()));

type OrderContextValue = {
  add: (scent: Scent, size: SizeKey) => void;
  openOrder: () => void;
  count: number;
  total: number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside <OrderProvider>");
  return ctx;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const order = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const lines = useMemo(() => priceLines(order, (slug) => BY_SLUG.get(slug)), [order]);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.total, 0);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openOrder = useCallback(() => {
    setToast(null);
    dialogRef.current?.showModal();
    setDrawerOpen(true);
  }, []);

  const add = useCallback((scent: Scent, size: SizeKey) => {
    store.add(scent.slug, size);
    setToast({ id: Date.now(), text: `${scent.name}, ${sizeLabel(size)}` });
  }, []);

  const value = useMemo(() => ({ add, openOrder, count, total }), [add, openOrder, count, total]);
  const sendHref = whatsappLink(orderMessage(lines, order));

  return (
    <OrderContext.Provider value={value}>
      {children}

      <p aria-live="polite" className="sr-only">
        {toast ? `Added to your order: ${toast.text}` : ""}
      </p>

      {count > 0 && !drawerOpen && (
        <button
          type="button"
          onClick={openOrder}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-gold-400 py-3 pl-5 pr-3 text-ink-950 shadow-xl shadow-black/30 transition hover:bg-gold-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:min-w-80"
        >
          {toast ? (
            <span key={toast.id} className="toast-in flex min-w-0 items-center gap-2">
              <CheckIcon size={20} className="shrink-0" />
              <span className="truncate font-medium">Added {toast.text}</span>
            </span>
          ) : (
            <>
              <BagIcon size={20} className="shrink-0" />
              <span className="font-medium">View order</span>
              <span className="text-sm text-ink-800">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </>
          )}
          <span className="ml-auto shrink-0 rounded-full bg-ink-950 px-3 py-1 text-sm font-medium tabular-nums text-gold-200">
            {formatRs(total)}
          </span>
        </button>
      )}

      {count === 0 && site.whatsapp && (
        <a
          href={whatsappLink(GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Arabian Musk on WhatsApp"
          className="fixed bottom-5 right-5 z-40 hidden size-14 place-items-center rounded-full bg-[#25d366] min-[1400px]:grid text-white shadow-xl shadow-black/30 transition hover:scale-105"
        >
          <WhatsAppIcon size={28} />
        </a>
      )}

      <dialog
        ref={dialogRef}
        className="order-drawer"
        aria-labelledby="order-title"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
            <h2 id="order-title" className="font-display text-2xl">
              Your order
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="grid size-10 place-items-center rounded-full text-stone-600 transition hover:bg-sand-200 hover:text-ink-900"
              aria-label="Close your order"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {lines.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-display text-xl">Your order is empty.</p>
                <p className="mt-2 text-stone-600">Tap any size and price on a scent to add it here.</p>
                <Link
                  href="/scents"
                  onClick={() => dialogRef.current?.close()}
                  className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-sand-50 transition hover:bg-ink-700"
                >
                  Browse all scents
                </Link>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-sand-200">
                  {lines.map((l) => (
                    <li key={`${l.scent.slug}-${l.size}`} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/scents/${l.scent.slug}`}
                            onClick={() => dialogRef.current?.close()}
                            className="font-display text-lg leading-tight hover:text-gold-700"
                          >
                            {l.scent.name}
                          </Link>
                          <p className="text-sm text-stone-600">
                            {sizeLabel(l.size)} · {formatRs(l.unit)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => store.setQty(l.scent.slug, l.size, 0)}
                          className="grid size-9 shrink-0 place-items-center rounded-full text-stone-500 transition hover:bg-sand-200 hover:text-ink-900"
                          aria-label={`Remove ${l.scent.name}, ${sizeLabel(l.size)}`}
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-sand-300">
                          <button
                            type="button"
                            onClick={() => store.setQty(l.scent.slug, l.size, l.qty - 1)}
                            className="grid size-9 place-items-center rounded-full transition hover:bg-sand-200"
                            aria-label={`One fewer ${l.scent.name}, ${sizeLabel(l.size)}`}
                          >
                            <MinusIcon size={16} />
                          </button>
                          <span className="w-8 text-center tabular-nums" aria-label={`Quantity ${l.qty}`}>
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => store.setQty(l.scent.slug, l.size, l.qty + 1)}
                            className="grid size-9 place-items-center rounded-full transition hover:bg-sand-200"
                            aria-label={`One more ${l.scent.name}, ${sizeLabel(l.size)}`}
                          >
                            <PlusIcon size={16} />
                          </button>
                        </div>
                        <span className="font-medium tabular-nums">{formatRs(l.total)}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-4 rounded-2xl bg-sand-100 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={order.giftBox}
                      onChange={(e) => store.setGiftBox(e.target.checked)}
                      className="mt-1 size-4 accent-gold-600"
                    />
                    <span>
                      <span className="font-medium">Pack it in a gift box</span>
                      <span className="block text-sm text-stone-600">We&apos;ll confirm the box price with your total.</span>
                    </span>
                  </label>
                  <label className="block">
                    <span className="font-medium">Note</span>
                    <span className="text-sm text-stone-600"> (optional)</span>
                    <textarea
                      value={order.note}
                      onChange={(e) => store.setNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Your name and area, or a request such as: mix two of these in one bottle."
                      className="mt-1.5 block w-full resize-none rounded-xl border border-sand-300 bg-white px-3 py-2 text-[15px] placeholder:text-stone-500 focus:border-gold-500 focus:outline-none"
                    />
                  </label>
                </div>
              </>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-sand-200 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-stone-600">Total</span>
                <span className="font-display text-2xl tabular-nums">{formatRs(total)}</span>
              </div>
              <p className="mt-1 text-sm text-stone-600">We confirm stock and the final total on WhatsApp before you pay.</p>
              <a
                href={sendHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2.5 rounded-full bg-[#1f9d55] px-6 py-3.5 font-medium text-white transition hover:bg-[#188a49]"
              >
                <WhatsAppIcon size={22} />
                Send order on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => store.clear()}
                className="mt-2 w-full rounded-full py-2 text-sm text-stone-600 transition hover:text-ink-900"
              >
                Clear order
              </button>
            </div>
          )}
        </div>
      </dialog>
    </OrderContext.Provider>
  );
}
