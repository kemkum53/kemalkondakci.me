// Tek kaynak: hem ana sayfa hem /cv buradan okur (tekrar yok).
import type { Lang } from "./translations";

export type Bilingual = Record<Lang, string>;

export const skillBars: { label: string; value: number }[] = [
  { label: "Python", value: 92 },
  { label: "Generative AI / LLM", value: 90 },
  { label: "AI-Assisted Development", value: 90 },
  { label: "DevOps · Docker · CI/CD", value: 88 },
  { label: "C# / .NET", value: 85 },
  { label: "Machine Learning", value: 82 },
];

// Kategorili teknoloji yığını — hem ana sayfa hem /cv buradan okur. Gerçek
// projelerden gelen yığını yansıtır (BUDDAI/Lucido/DarkMatter/Multi-Agent…).
export const techStackGroups: { label: Bilingual; items: string[] }[] = [
  { label: { tr: "Diller", en: "Languages" }, items: ["Python", "C#", "TypeScript", "Dart", "SQL"] },
  { label: { tr: "YZ & ML", en: "AI & ML" }, items: ["Generative AI / LLM", "Machine Learning", "Deep Learning", "Computer Vision", "NLP"] },
  { label: { tr: "AI Araçları", en: "AI Tooling" }, items: ["LangChain / LangGraph", "Prompt Engineering", "AI-Assisted Dev", "LLM Integration"] },
  { label: { tr: "Backend & API", en: "Backend & APIs" }, items: [".NET / ASP.NET", "FastAPI", "EF Core", "PostgreSQL", "REST"] },
  { label: { tr: "Mobil & Web", en: "Mobile & Web" }, items: ["Flutter", "React", "Next.js"] },
  { label: { tr: "DevOps & Bulut", en: "DevOps & Cloud" }, items: ["Docker", "Docker Compose", "CI/CD · GitHub Actions", "Traefik", "Linux", "AWS", "MLOps"] },
];

export type TimelineItem = {
  role: Bilingual;
  company: string;
  period: Bilingual;
  bullets: Record<Lang, string[]>;
};

export const timeline: TimelineItem[] = [
  {
    role: { tr: "Yazılım Geliştirme Uzmanı", en: "Software Development Specialist" },
    company: "MODSOFT Bilişim",
    period: { tr: "05/2023 — Güncel", en: "05/2023 — Current" },
    bullets: {
      tr: ["AI destekli modüller ve .NET tabanlı servisler.", "Performans/izleme, ölçülebilir iyileştirmeler."],
      en: ["AI-powered modules and .NET-based services.", "Performance monitoring and measurable improvements."],
    },
  },
  {
    role: { tr: "Bilgi İşlem Destek Elemanı", en: "IT Support Specialist" },
    company: "QUALA NETWORKS",
    period: { tr: "03/2022 — 05/2023", en: "03/2022 — 05/2023" },
    bullets: {
      tr: ["Sistem desteği, otomasyon ve küçük araçlar."],
      en: ["System support, automation and small tools."],
    },
  },
  {
    role: { tr: "Stajyer", en: "Intern" },
    company: "İSBAK",
    period: { tr: "06/2019 — 07/2019", en: "06/2019 — 07/2019" },
    bullets: {
      tr: ["Ar-Ge süreçlerine destek."],
      en: ["Support for R&D processes."],
    },
  },
];

export const socials = {
  email: "kondakci.k@gmail.com",
  whatsapp: "https://wa.me/+905538790853",
  linkedin: "https://www.linkedin.com/in/kemal-kondak%C3%A7%C4%B1-b62173157/",
  github: "https://github.com/kemkum53",
  instagram: "https://instagram.com/53kemkum",
  location: { tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" } as Bilingual,
};
