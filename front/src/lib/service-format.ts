// Hizmet fiyatı ve teslim süresinin gösterim biçimi.
// Sunucu tarafına bağlı değil: hem public sayfa hem admin önizlemesi kullanır.
import type { Lang } from "@/lib/translations";
import { WORK_CATEGORIES, type WorkCategory } from "@/lib/categories";

// Services and showcase cases share one taxonomy; see lib/categories.ts.
export const SERVICE_CATEGORIES = WORK_CATEGORIES;
export type ServiceCategory = WorkCategory;
export { CATEGORY_LABELS, categoryAccent, categoryLabel } from "@/lib/categories";

export const PRICE_TYPES = ["range", "from", "fixed", "quote"] as const;
export type PriceType = (typeof PRICE_TYPES)[number];

export const CURRENCIES = ["TRY", "USD", "EUR"] as const;

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  fixed: "Sabit fiyat",
  range: "Fiyat aralığı",
  from: "Başlangıç fiyatı",
  quote: "Teklife göre (rakam gizli)",
};

export type PriceInput = {
  priceType: string;
  setupPriceMin: number | null;
  setupPriceMax: number | null;
  monthlyPrice: number | null;
  currency: string;
};

export type FormattedPrice = {
  isQuote: boolean;
  setupLabel: string | null;
  setupValue: string | null;
  monthlyLabel: string | null;
  monthlyValue: string | null;
};

const COPY = {
  tr: {
    quote: "Teklife göre",
    setup: "Kurulum",
    from: "Başlangıç",
    monthly: "Aylık",
    days: "gün",
    upTo: (n: string) => `${n} güne kadar`,
    atLeast: (n: string) => `${n} gün+`,
  },
  en: {
    quote: "Custom quote",
    setup: "Setup",
    from: "Starting at",
    monthly: "Monthly",
    days: "days",
    upTo: (n: string) => `up to ${n} days`,
    atLeast: (n: string) => `${n}+ days`,
  },
} as const;

const SYMBOLS: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€" };

/** Binlik ayırıcılı sade sayı. */
function plain(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Sembol yerleşimi dile göre: Türkçede sonda (90.000 ₺), İngilizcede başta ($90,000). */
function money(amount: number, currency: string, lang: Lang): string {
  const symbol = SYMBOLS[currency] ?? currency;
  const n = plain(amount, lang);
  return lang === "tr" ? `${n} ${symbol}` : `${symbol}${n}`;
}

/** Fiyatı ekranda gösterilecek etiket/değer çiftlerine çevirir. */
export function formatPrice(s: PriceInput, lang: Lang): FormattedPrice {
  const c = COPY[lang];
  const empty: FormattedPrice = {
    isQuote: false,
    setupLabel: null,
    setupValue: null,
    monthlyLabel: null,
    monthlyValue: null,
  };

  if (s.priceType === "quote") {
    return { ...empty, isQuote: true };
  }

  const result = { ...empty };
  const min = s.setupPriceMin;
  const max = s.setupPriceMax;

  if (min != null) {
    if (s.priceType === "range" && max != null && max > min) {
      result.setupLabel = c.setup;
      // Türkçede sembol sonda olduğu için aralığın başında tekrar edilmez.
      result.setupValue =
        lang === "tr"
          ? `${plain(min, lang)} - ${money(max, s.currency, lang)}`
          : `${money(min, s.currency, lang)} - ${money(max, s.currency, lang)}`;
    } else if (s.priceType === "from") {
      result.setupLabel = c.from;
      result.setupValue = money(min, s.currency, lang);
    } else {
      result.setupLabel = c.setup;
      result.setupValue = money(min, s.currency, lang);
    }
  }

  if (s.monthlyPrice != null && s.monthlyPrice > 0) {
    result.monthlyLabel = c.monthly;
    result.monthlyValue = money(s.monthlyPrice, s.currency, lang);
  }

  // Hiç rakam girilmemişse yine teklife göre davran.
  if (result.setupValue == null && result.monthlyValue == null) {
    return { ...empty, isQuote: true };
  }
  return result;
}

/** "Teklife göre" / "Custom quote" metni. */
export function quoteLabel(lang: Lang): string {
  return COPY[lang].quote;
}

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
