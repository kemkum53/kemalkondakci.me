// Shared work-area taxonomy. The same keys drive the services filter, the
// project category and the /showcase/<area> pages, so a case study and the
// priced service behind it stay in one bucket.
import type { Lang } from "@/lib/translations";

export const WORK_CATEGORIES = ["web", "ai", "automation", "devops", "other"] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Lang, Record<WorkCategory, string>> = {
  tr: {
    web: "Web ve E-ticaret",
    ai: "Yapay Zekâ ve Chatbot",
    automation: "Otomasyon ve Entegrasyon",
    devops: "DevOps ve Altyapı",
    other: "Diğer",
  },
  en: {
    web: "Web and E-commerce",
    ai: "AI and Chatbots",
    automation: "Automation and Integration",
    devops: "DevOps and Infrastructure",
    other: "Other",
  },
};

/** Accent colour per area. CSS derives lighter tints from it with color-mix. */
export const CATEGORY_ACCENTS: Record<WorkCategory, string> = {
  web: "#7A3CFF",
  ai: "#00E5FF",
  automation: "#FF00A8",
  devops: "#FF2D55",
  other: "#93A2B1",
};

export function isWorkCategory(value: string): value is WorkCategory {
  return (WORK_CATEGORIES as readonly string[]).includes(value);
}

export function categoryLabel(category: string, lang: Lang): string {
  return CATEGORY_LABELS[lang][isWorkCategory(category) ? category : "other"];
}

export function categoryAccent(category: string): string {
  return CATEGORY_ACCENTS[isWorkCategory(category) ? category : "other"];
}
