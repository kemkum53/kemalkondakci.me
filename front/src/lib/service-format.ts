// Hizmet teslim süresinin gösterim biçimi.
// Sunucu tarafına bağlı değil: hem public sayfa hem admin önizlemesi kullanır.
import type { Lang } from "@/lib/translations";
import { WORK_CATEGORIES, type WorkCategory } from "@/lib/categories";

// Services and showcase cases share one taxonomy; see lib/categories.ts.
export const SERVICE_CATEGORIES = WORK_CATEGORIES;
export type ServiceCategory = WorkCategory;
export { CATEGORY_LABELS, categoryAccent, categoryLabel } from "@/lib/categories";

const COPY = {
  tr: {
    days: "gün",
    upTo: (n: string) => `${n} güne kadar`,
    atLeast: (n: string) => `${n} gün+`,
  },
  en: {
    days: "days",
    upTo: (n: string) => `up to ${n} days`,
    atLeast: (n: string) => `${n}+ days`,
  },
} as const;

export type DeliveryInput = {
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  deliveryNoteTr: string;
  deliveryNoteEn: string;
};

/** Teslim süresini tek satır metne çevirir. Not alanı doluysa süreye eklenir. */
export function formatDelivery(s: DeliveryInput, lang: Lang): string | null {
  const c = COPY[lang];
  const note = (lang === "tr" ? s.deliveryNoteTr : s.deliveryNoteEn).trim();
  const min = s.deliveryMinDays;
  const max = s.deliveryMaxDays;

  let range: string | null = null;
  if (min != null && max != null) {
    range = max > min ? `${min} - ${max} ${c.days}` : `${min} ${c.days}`;
  } else if (min != null) {
    range = c.atLeast(String(min));
  } else if (max != null) {
    range = c.upTo(String(max));
  }

  if (range && note) return `${range} (${note})`;
  return range ?? (note || null);
}
