"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { categoryAccent as accentOf, categoryLabel } from "@/lib/categories";
import {
  SERVICE_CATEGORIES,
  formatDelivery,
} from "@/lib/service-format";
import styles from "@/app/services/services.module.css";

export type ServiceCard = {
  id: string;
  slug: string;
  category: string;
  icon: string;
  nameTr: string;
  nameEn: string;
  shortDescTr: string;
  shortDescEn: string;
  featuresTr: string[];
  featuresEn: string[];
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  deliveryNoteTr: string;
  deliveryNoteEn: string;
  references: { label: string; url: string }[];
  tags: string[];
  featured: boolean;
};

const COPY = {
  tr: {
    eyebrow: "Hizmetler",
    title: "Ne yapıyorum ve ne kadar sürüyor",
    lead: "Aşağıdaki kalemler tipik kapsamlar için hazırlandı. Rakam yazmıyorum, çünkü aynı işin fiyatı sayfa sayısına, entegrasyonlara ve elinizdeki içeriğe göre ciddi değişiyor. İhtiyacınızı konuşalım, kapsamı çıkarıp yazılı teklif vereyim.",
    pillResponse: "Genellikle 24 saat içinde yanıt",
    pillRemote: "Uzaktan çalışma, Türkiye geneli",
    all: "Tümü",
    empty: "Şu anda yayında hizmet yok. İhtiyacınızı yazarsanız kapsamı birlikte çıkarabiliriz.",
    noneInCategory: "Bu kategoride yayında hizmet yok.",
    pillPrices: "Fiyat, kapsam netleşince yazılı veriliyor",
    scope: "Neler dahil",
    hideScope: "Kapsamı gizle",
    delivery: "Teslim",
    quote: "Teklif isteyin",
    reference: "Canlı referans",
    references: "Canlı referanslar",
    featured: "Öne çıkan",
    ctaTitle: "Aradığınız tam olarak listede yoksa",
    ctaText: "Yapmak istediğiniz işi birkaç cümleyle yazın; uygulanabilir mi, ne kadar tutar diye bakıp net bir kapsamla döneyim.",
    ctaPrimary: "İhtiyacınızı yazın",
    ctaSecondary: "Projelerimi inceleyin",
    footnote: "Buradaki teslim süreleri tipik bir kapsam içindir; sayfa ve ürün sayısı, istediğiniz entegrasyonlar ve içeriğin hazır olup olmaması süreyi de değiştirir. Teklif, ihtiyacınızı konuştuktan sonra maddelenmiş kapsamla birlikte yazılı verilir ve KDV hariçtir. Aylık bedeli olan hizmetlerde sunucu, güncelleme ve destek dahildir; üçüncü taraf lisans ve kullanım ücretleri (ödeme altyapısı, yapay zekâ modeli kullanımı, alan adı) ayrıca hesaplanır.",
  },
  en: {
    eyebrow: "Services",
    title: "What I build and how long it takes",
    lead: "The items below cover typical scopes. I do not print figures, because the same job varies a lot with the number of pages, the integrations and the content you already have. Tell me what you need and I will scope it and send a written quote.",
    pillResponse: "Usually responds within 24 hours",
    pillRemote: "Remote, working across Turkey",
    all: "All",
    empty: "No published services right now. Describe what you need and we can scope it together.",
    noneInCategory: "No published services in this category.",
    pillPrices: "The price comes in writing once the scope is set",
    scope: "What is included",
    hideScope: "Hide details",
    delivery: "Delivery",
    quote: "Request a quote",
    reference: "Live reference",
    references: "Live references",
    featured: "Featured",
    ctaTitle: "Not exactly what you were looking for?",
    ctaText: "Describe the job in a few sentences. I will tell you whether it is feasible, what it would cost, and come back with a concrete scope.",
    ctaPrimary: "Tell me what you need",
    ctaSecondary: "See my projects",
    footnote: "The delivery times here cover a typical scope; the number of pages and products, the integrations you need and whether your content is ready all move them. The quote comes in writing with an itemised scope once we have talked through your needs, and it excludes VAT. Monthly fees include hosting, updates and support; third-party licence and usage costs (payment provider, AI model usage, domain) are billed separately.",
  },
} as const;

export default function ServicesList({ services }: { services: ServiceCard[] }) {
  const { lang, isTransitioning } = useLanguage();
  const copy = COPY[lang];
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Yayında hizmeti olan kategoriler, sabit sırayla.
  const usedCategories = useMemo(
    () => SERVICE_CATEGORIES.filter((c) => services.some((s) => s.category === c)),
    [services]
  );

  const shownCategories = filter === "all" ? usedCategories : [filter];

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className={`content-fade-in ${styles.page}`}>
        {/* Hero bandı */}
        <section className={styles.hero}>
          <div className={styles.inner}>
            <div className={styles.eyebrow}>{copy.eyebrow}</div>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <div className={styles.heroMeta}>
              <span className={styles.heroPill}>
                <span className={styles.heroPillDot} aria-hidden="true" />
                {copy.pillResponse}
              </span>
              <span className={styles.heroPill}>{copy.pillRemote}</span>
              <span className={`${styles.heroPill} ${styles.heroPillNote}`}>
                <span className={styles.heroPillIcon} aria-hidden="true">
                  i
                </span>
                {copy.pillPrices}
              </span>
            </div>
          </div>
        </section>

        {services.length === 0 ? (
          <div className={styles.inner}>
            <p className={styles.empty}>{copy.empty}</p>
          </div>
        ) : (
          <>
            {/* Kategori filtresi */}
            {usedCategories.length > 1 && (
              <section className={styles.filterBar}>
                <div className={styles.inner}>
                  <div className={styles.filterRow} role="group" aria-label={copy.eyebrow}>
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      aria-pressed={filter === "all"}
                      className={`${styles.filterChip} ${filter === "all" ? styles.filterChipActive : ""}`}
                    >
                      {copy.all}
                    </button>
                    {usedCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFilter(c)}
                        aria-pressed={filter === c}
                        className={`${styles.filterChip} ${filter === c ? styles.filterChipActive : ""}`}
                      >
                        {categoryLabel(c, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {shownCategories.map((category, index) => {
              const items = services.filter((s) => s.category === category);
              const accent = accentOf(category);

              return (
                <section
                  key={category}
                  className={`${styles.categorySection} ${
                    index === 0 ? styles.categorySectionFirst : ""
                  }`}
                  style={{ ["--accent" as string]: accent }}
                >
                  <div className={styles.categoryBand}>
                    <div className={styles.inner}>
                      <h2 className={styles.categoryTitle}>
                        {categoryLabel(category, lang)}
                        <span className={styles.categoryCount}>{items.length}</span>
                      </h2>
                    </div>
                  </div>

                  <div className={styles.inner}>
                    {items.length === 0 ? (
                      <p className={styles.empty}>{copy.noneInCategory}</p>
                    ) : (
                      <div className={styles.grid}>
                        {items.map((s) => {
                          const name = (lang === "tr" ? s.nameTr : s.nameEn) || s.nameTr;
                          const desc = lang === "tr" ? s.shortDescTr : s.shortDescEn;
                          const features = lang === "tr" ? s.featuresTr : s.featuresEn;
                          const delivery = formatDelivery(s, lang);
                          const isOpen = Boolean(expanded[s.id]);
                          const listId = `features-${s.id}`;

                          return (
                            <article
                              key={s.id}
                              className={`${styles.card} ${s.featured ? styles.cardFeatured : ""}`}
                            >
                              <div className={styles.cardHead}>
                                {s.icon && (
                                  <div className={styles.cardIcon} aria-hidden="true">
                                    {s.icon}
                                  </div>
                                )}
                                <div>
                                  <h3 className={styles.cardName}>{name}</h3>
                                  {s.featured && (
                                    <span className={styles.featuredTag}>{copy.featured}</span>
                                  )}
                                </div>
                              </div>

                              {desc && <p className={styles.cardDesc}>{desc}</p>}

                              <div className={styles.priceSlab}>
                                {delivery && (
                                  <div className={styles.delivery}>
                                    <span className={styles.deliveryLabel}>{copy.delivery}</span>
                                    <span>{delivery}</span>
                                  </div>
                                )}
                              </div>

                              {features.length > 0 && (
                                <>
                                  <button
                                    type="button"
                                    className={styles.toggle}
                                    onClick={() => toggle(s.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={listId}
                                  >
                                    <span>{isOpen ? copy.hideScope : copy.scope}</span>
                                    <span
                                      className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ""}`}
                                      aria-hidden="true"
                                    >
                                      ▼
                                    </span>
                                  </button>
                                  {isOpen && (
                                    <ul id={listId} className={styles.features}>
                                      {features.map((f, i) => (
                                        <li key={i} className={styles.featureItem}>
                                          {f}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              )}

                              {s.tags.length > 0 && (
                                <div className={styles.tags}>
                                  {s.tags.map((t) => (
                                    <span key={t} className={styles.tag}>
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {s.references.length > 0 && (
                                <div className={styles.references}>
                                  <span className={styles.referencesLabel}>
                                    {s.references.length > 1 ? copy.references : copy.reference}
                                  </span>
                                  <div className={styles.referenceRow}>
                                    {s.references.map((r) => (
                                      <a
                                        key={r.url}
                                        href={r.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.referenceChip}
                                        data-umami-event="service-reference"
                                        data-umami-event-slug={s.slug}
                                      >
                                        {r.label}
                                        <span aria-hidden="true">↗</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className={styles.cardFoot}>
                                <Link
                                  href={`/contact?subject=${encodeURIComponent(name)}`}
                                  className="ktn-btn"
                                  data-umami-event="service-quote"
                                  data-umami-event-slug={s.slug}
                                >
                                  {copy.quote}
                                </Link>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            <div className={styles.inner}>
              <p className={styles.footnote}>{copy.footnote}</p>
            </div>
          </>
        )}

        {/* Kapanış bandı */}
        <section className={styles.ctaBand}>
          <div className={styles.inner}>
            <h2 className={styles.ctaTitle}>{copy.ctaTitle}</h2>
            <p className={styles.ctaText}>{copy.ctaText}</p>
            <div className={styles.ctaRow}>
              <Link href="/contact" className="ktn-btn" data-umami-event="services-cta-contact">
                {copy.ctaPrimary}
              </Link>
              <Link href="/projects" className="ktn-btn ktn-btn--ghost">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
