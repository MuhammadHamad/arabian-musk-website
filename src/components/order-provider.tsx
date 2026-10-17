"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { scents } from "@/content/scents";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { ATTAR_RENDERS, PERFUME_BY_SCENE } from "@/components/scent-image";
import { SizePicker } from "@/components/size-picker";
import { whatsappLink } from "@/lib/links";
import { orderMessage, priceLines } from "@/lib/order-message";
import { createOrderStore } from "@/lib/order-store";
import { formatRs, priceRange, sceneFor, sizeLabel, sizeOf, type Scent, type SizeKey } from "@/lib/scent";

const BY_SLUG = new Map(scents.map((s) => [s.slug, s]));
const store = createOrderStore(new Set(BY_SLUG.keys()));

type OrderContextValue = {
  add: (scent: Scent, size: SizeKey, qty?: number) => void;
  openOrder: () => void;
  openPicker: (scent: Scent) => void;
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

  const drawerRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [picking, setPicking] = useState<Scent | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openOrder = useCallback(() => {
    sheetRef.current?.close();
    setToast(null);
    drawerRef.current?.showModal();
    setDrawerOpen(true);
  }, []);

  const openPicker = useCallback((scent: Scent) => {
    setPicking(scent);
    sheetRef.current?.showModal();
  }, []);

  const add = useCallback((scent: Scent, size: SizeKey, qty = 1) => {
    store.add(scent.slug, size, qty);
    setToast({ id: Date.now(), text: `${scent.name}, ${sizeLabel(size)}${qty > 1 ? ` × ${qty}` : ""}` });
  }, []);

  const value = useMemo(() => ({ add, openOrder, openPicker, count, total }), [add, openOrder, openPicker, count, total]);
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
          className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 bg-amber py-3.5 pl-5 pr-4 text-left text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] transition hover:bg-amber-deep sm:inset-x-auto sm:bottom-6 sm:right-6 sm:min-w-[22rem]"
        >
          {toast ? (
            <span key={toast.id} className="fade-in flex min-w-0 flex-1 items-center gap-2.5">
              <span className="eyebrow shrink-0 !text-[12px]">Added</span>
              <span className="truncate text-[14px]">{toast.text}</span>
            </span>
          ) : (
            <span className="flex flex-1 items-center gap-3">
              <BagIcon size={18} className="shrink-0" />
              <span className="eyebrow !text-[12px]">Your order</span>
              <span className="text-[13px] text-white/75">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </span>
          )}
          <span className="shrink-0 text-[14px] tabular-nums">{formatRs(total)}</span>
        </button>
      )}

      {/* Size sheet */}
      <dialog
        ref={sheetRef}
        className="sheet"
        aria-labelledby="sheet-title"
        onClose={() => setPicking(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) sheetRef.current?.close();
        }}
      >
        {picking && (
          <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                <Image src={PERFUME_BY_SCENE[sceneFor(picking)]} alt="" fill sizes="120px" className="scale-[1.7] object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-muted">N° {picking.no}</p>
                <h2 id="sheet-title" className="mt-0.5 font-display text-[1.7rem] leading-tight">
                  {picking.name}
                </h2>
                {picking.inspiredBy && <p className="mt-0.5 text-[13px] text-muted">Impression of {picking.inspiredBy}</p>}
                <p className="mt-1 text-[15px] tabular-nums">{priceRange(picking)}</p>
              </div>
              <button
                type="button"
                onClick={() => sheetRef.current?.close()}
                className="-mr-2 -mt-2 grid size-10 place-items-center text-muted transition hover:text-ink"
                aria-label="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="mt-6">
              <SizePicker key={picking.slug} scent={picking} onAdded={() => sheetRef.current?.close()} />
            </div>
            <Link
              href={`/scents/${picking.slug}`}
              onClick={() => sheetRef.current?.close()}
              className="mt-5 inline-block text-[14px] text-amber underline underline-offset-4"
            >
              View the scent
            </Link>
          </div>
        )}
      </dialog>

      {/* Order drawer */}
      <dialog
        ref={drawerRef}
        className="drawer"
        aria-labelledby="order-title"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) drawerRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h2 id="order-title" className="font-display text-[1.6rem]">
              Your order {count > 0 && <span className="font-sans text-base font-normal text-muted">({count})</span>}
            </h2>
            <button
              type="button"
              onClick={() => drawerRef.current?.close()}
              className="-mr-2 grid size-10 place-items-center text-muted transition hover:text-ink"
              aria-label="Close your order"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            {lines.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-display text-[1.7rem]">Your order is empty</p>
                <p className="mx-auto mt-3 max-w-xs text-[15px] text-muted">Choose a scent and a size, and it will wait for you here.</p>
                <Link href="/scents" onClick={() => drawerRef.current?.close()} className="btn btn-amber mt-8">
                  Shop now
                </Link>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-line">
                  {lines.map((l) => {
                    const attar = sizeOf(l.size).kind === "Attar";
                    return (
                      <li key={`${l.scent.slug}-${l.size}`} className="flex gap-4 py-5">
                        <div className="relative h-24 w-[4.75rem] shrink-0 overflow-hidden bg-cream">
                          <Image src={attar ? ATTAR_RENDERS.plaster : PERFUME_BY_SCENE[sceneFor(l.scent)]} alt="" fill sizes="120px" className="scale-[1.7] object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <Link
                              href={`/scents/${l.scent.slug}`}
                              onClick={() => drawerRef.current?.close()}
                              className="font-display text-xl leading-tight hover:text-amber"
                            >
                              {l.scent.name}
                            </Link>
                            <span className="text-[14px] tabular-nums">{formatRs(l.total)}</span>
                          </div>
                          <p className="text-[13px] text-muted">
                            {sizeLabel(l.size)} · {formatRs(l.unit)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center border border-line">
                              <button
                                type="button"
                                onClick={() => store.setQty(l.scent.slug, l.size, l.qty - 1)}
                                className="grid size-8 place-items-center transition hover:opacity-60"
                                aria-label={`One fewer ${l.scent.name}, ${sizeLabel(l.size)}`}
                              >
                                <MinusIcon size={13} />
                              </button>
                              <span className="w-6 text-center text-[14px] tabular-nums">{l.qty}</span>
                              <button
                                type="button"
                                onClick={() => store.setQty(l.scent.slug, l.size, l.qty + 1)}
                                className="grid size-8 place-items-center transition hover:opacity-60"
                                aria-label={`One more ${l.scent.name}, ${sizeLabel(l.size)}`}
                              >
                                <PlusIcon size={13} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => store.setQty(l.scent.slug, l.size, 0)}
                              className="text-[13px] text-muted underline underline-offset-4 hover:text-amber"
                              aria-label={`Remove ${l.scent.name}, ${sizeLabel(l.size)}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="space-y-5 border-t border-line py-6">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={order.giftBox}
                      onChange={(e) => store.setGiftBox(e.target.checked)}
                      className="mt-1 size-4 accent-[#8c4e03]"
                    />
                    <span>
                      <span className="text-[15px]">Pack it in a gift box</span>
                      <span className="block text-[13px] text-muted">We confirm the box price with your total.</span>
                    </span>
                  </label>
                  <label className="block">
                    <span className="text-[14px] text-ink">A note for us <span className="text-muted">(optional)</span></span>
                    <textarea
                      value={order.note}
                      onChange={(e) => store.setNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Your name and area, or a request such as mixing two scents in one bottle."
                      className="mt-2 block w-full resize-none border border-line bg-white px-3 py-2.5 text-[15px] placeholder:text-muted/80 focus:border-amber focus:outline-none"
                    />
                  </label>
                </div>
              </>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-line px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl">Total</span>
                <span className="font-display text-2xl font-bold tabular-nums text-amber">{formatRs(total)}</span>
              </div>
              <p className="mt-1 text-[13px] text-muted">We confirm stock and the final total on WhatsApp before you pay.</p>
              <a href={sendHref} target="_blank" rel="noopener noreferrer" className="btn btn-amber mt-5 w-full !px-4">
                <WhatsAppIcon size={18} />
                Send order on WhatsApp
              </a>
              <button type="button" onClick={() => store.clear()} className="mx-auto mt-4 block text-[13px] text-muted underline underline-offset-4 hover:text-amber">
                Clear order
              </button>
            </div>
          )}
        </div>
      </dialog>
    </OrderContext.Provider>
  );
}
