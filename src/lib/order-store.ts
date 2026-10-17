import { isSizeKey, type SizeKey } from "@/lib/scent";

export type OrderLine = { slug: string; size: SizeKey; qty: number };
export type OrderState = { lines: OrderLine[]; giftBox: boolean; note: string };

export const EMPTY_ORDER: OrderState = { lines: [], giftBox: false, note: "" };

const KEY = "am-order-v1";
const MAX_QTY = 20;

function sanitize(raw: unknown, knownSlugs: Set<string>): OrderState {
  if (!raw || typeof raw !== "object") return EMPTY_ORDER;
  const r = raw as Partial<OrderState>;
  const lines = Array.isArray(r.lines)
    ? r.lines
        .filter((l): l is OrderLine => !!l && knownSlugs.has(l.slug) && isSizeKey(l.size) && Number.isFinite(l.qty))
        .map((l) => ({ slug: l.slug, size: l.size, qty: Math.min(MAX_QTY, Math.max(1, Math.round(l.qty))) }))
    : [];
  return {
    lines,
    giftBox: r.giftBox === true,
    note: typeof r.note === "string" ? r.note.slice(0, 500) : "",
  };
}

/**
 * A tiny store for the order, kept in localStorage so it survives page changes and
 * reloads. Read through useSyncExternalStore: the server always renders an empty order.
 */
export function createOrderStore(knownSlugs: Set<string>) {
  let state: OrderState = EMPTY_ORDER;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) state = sanitize(JSON.parse(raw), knownSlugs);
    } catch {
      // Private mode or blocked storage: start empty.
    }
  }

  function set(next: OrderState) {
    state = next;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Not saved; the order still works for this visit.
    }
    listeners.forEach((l) => l());
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== KEY) return;
        try {
          state = e.newValue ? sanitize(JSON.parse(e.newValue), knownSlugs) : EMPTY_ORDER;
        } catch {
          state = EMPTY_ORDER;
        }
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      load();
      return state;
    },
    getServerSnapshot() {
      return EMPTY_ORDER;
    },
    add(slug: string, size: SizeKey, qty = 1) {
      const n = Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
      const existing = state.lines.find((l) => l.slug === slug && l.size === size);
      set({
        ...state,
        lines: existing
          ? state.lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + n) } : l))
          : [...state.lines, { slug, size, qty: n }],
      });
    },
    setQty(slug: string, size: SizeKey, qty: number) {
      set({
        ...state,
        lines:
          qty < 1
            ? state.lines.filter((l) => !(l.slug === slug && l.size === size))
            : state.lines.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
      });
    },
    setGiftBox(giftBox: boolean) {
      set({ ...state, giftBox });
    },
    setNote(note: string) {
      set({ ...state, note: note.slice(0, 500) });
    },
    clear() {
      set(EMPTY_ORDER);
    },
  };
}
