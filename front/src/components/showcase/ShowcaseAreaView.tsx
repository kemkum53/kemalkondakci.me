"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import type { GalleryImage } from "@/lib/projects";
import { formatPrice, quoteLabel } from "@/lib/service-format";
import { getShowcaseArea, SHOWCASE_COMMON } from "@/lib/showcase";
import CaseGallery from "@/components/showcase/CaseGallery";
import styles from "@/app/showcase/showcase.module.css";

export type CaseView = {
  slug: string;
  name: string;
  coverImage: string | null;
  shortDescTr: string;
  shortDescEn: string;
  clientName: string;
  roleTr: string;
  roleEn: string;
  resultsTr: string[];
  resultsEn: string[];
  gallery: GalleryImage[];
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
};

export type ServiceSummary = {
  id: string;
  nameTr: string;
  nameEn: string;
  shortDescTr: string;
  shortDescEn: string;
  priceType: string;
  setupPriceMin: number | null;
  setupPriceMax: number | null;
  monthlyPrice: number | null;
  currency: string;
};

type Props = {
  area: string;
  cases: CaseView[];
  services: ServiceSummary[];
};

export default function ShowcaseAreaView({ area, cases, services }: Props) {
  const { lang, isTransitioning } = useLanguage();
  const definition = getShowcaseArea(area);
  const common = SHOWCASE_COMMON[lang];

  if (!definition) return null;
  const copy = definition.copy[lang];

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main
        className={`${styles.page} content-fade-in`}
        style={{ ["--accent" as string]: definition.accent }}
      >
        <section className={styles.hero}>
          <div className={styles.inner}>
            <Link href="/showcase" className={styles.backLink}>
              ← {common.backToAreas}
            </Link>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <div className={styles.heroMeta}>
              {copy.pills.map((pill) => (
                <span key={pill} className={styles.heroPill}>
                  <span className={styles.heroPillDot} aria-hidden="true" />
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Nasıl ilerliyor */}
        <section>
          <div className={styles.sectionBand}>
            <div className={styles.inner}>
              <h2 className={styles.sectionTitle}>{copy.stepsTitle}</h2>
            </div>
          </div>
          <div className={styles.inner}>
            <ol className={styles.steps}>
              {copy.steps.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNo} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Vakalar */}
        <section>
          <div className={styles.sectionBand}>
            <div className={styles.inner}>
              <h2 className={styles.sectionTitle}>{copy.casesTitle}</h2>
            </div>
          </div>
          <div className={styles.inner}>
            {cases.length === 0 ? (
              <p className={styles.empty}>{copy.casesEmpty}</p>
            ) : (
              <div className={styles.cases}>
                {cases.map((c) => {
                  const desc = lang === "tr" ? c.shortDescTr : c.shortDescEn;
                  const role = lang === "tr" ? c.roleTr : c.roleEn;
                  const results = lang === "tr" ? c.resultsTr : c.resultsEn;

                  return (
                    <article key={c.slug} className={styles.case}>
                      {c.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.coverImage}
                          alt={c.name}
                          // Galerisi olan vakada kapak aynı görseli tekrar eder;
                          // dar ekranda gizlenir, masaüstünde kalır.
                          className={`${styles.caseCover} ${
                            c.gallery.length > 0 ? styles.caseCoverRedundant : ""
                          }`}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.caseBody}>
                        <div className={styles.caseHead}>
                          <h3 className={styles.caseName}>{c.name}</h3>
                          {/* Müşteri adı proje adıyla aynıysa rozet tekrar olur. */}
                          {c.clientName && c.clientName !== c.name && (
                            <span className={styles.caseClient}>{c.clientName}</span>
                          )}
                        </div>
                        {desc && <p className={styles.caseDesc}>{desc}</p>}

                        {(role || results.length > 0) && (
                          <div className={styles.caseMeta}>
                            {role && (
                              <div>
                                <p className={styles.metaLabel}>{common.role}</p>
                                <p className={styles.metaText}>{role}</p>
                              </div>
                            )}
                            {results.length > 0 && (
                              <div>
                                <p className={styles.metaLabel}>{common.results}</p>
                                <ul className={styles.results}>
                                  {results.map((r) => (
                                    <li key={r} className={styles.result}>
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {c.gallery.length > 0 && (
                          <div className={styles.caseMeta}>
                            <div style={{ gridColumn: "1 / -1" }}>
                              <CaseGallery
                                images={c.gallery}
                                lang={lang}
                                projectName={c.name}
                                accent={definition.accent}
                              />
                            </div>
                          </div>
                        )}

                        {c.techStack.length > 0 && (
                          <div className={styles.techRow}>
                            {c.techStack.map((t) => (
                              <span key={t} className={styles.techChip}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className={styles.caseLinks}>
                          {c.liveUrl && (
                            <a
                              href={c.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.caseLink}
                              data-umami-event="showcase-live"
                              data-umami-event-slug={c.slug}
                            >
                              {common.live} ↗
                            </a>
                          )}
                          {c.repoUrl && (
                            <a
                              href={c.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.caseLink}
                              data-umami-event="showcase-repo"
                              data-umami-event-slug={c.slug}
                            >
                              {common.repo} ↗
                            </a>
                          )}
                          <Link
                            href={`/projects/${c.slug}`}
                            className={`${styles.caseLink} ${styles.caseLinkStrong}`}
                            data-umami-event="showcase-detail"
                            data-umami-event-slug={c.slug}
                          >
                            {common.detail} →
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Bu alandaki hizmetler */}
        {services.length > 0 && (
          <section>
            <div className={styles.sectionBand}>
              <div className={styles.inner}>
                <h2 className={styles.sectionTitle}>{common.servicesTitle}</h2>
              </div>
            </div>
            <div className={styles.inner}>
              <div className={styles.serviceGrid}>
                {services.map((s) => {
                  const price = formatPrice(s, lang);
                  return (
                    <article key={s.id} className={styles.serviceCard}>
                      <h3 className={styles.serviceName}>
                        {lang === "tr" ? s.nameTr : s.nameEn}
                      </h3>
                      <p className={styles.serviceDesc}>
                        {lang === "tr" ? s.shortDescTr : s.shortDescEn}
                      </p>
                      <div className={styles.priceRow}>
                        {price.isQuote ? (
                          <span className={styles.priceValue}>{quoteLabel(lang)}</span>
                        ) : (
                          <>
                            {price.setupValue && (
                              <>
                                <span className={styles.priceLabel}>{price.setupLabel}</span>
                                <span className={styles.priceValue}>{price.setupValue}</span>
                              </>
                            )}
                            {price.monthlyValue && (
                              <>
                                <span className={styles.priceLabel}>{price.monthlyLabel}</span>
                                <span className={styles.priceValue}>{price.monthlyValue}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              <Link href="/services" className={styles.servicesLink}>
                {common.servicesLink} →
              </Link>
            </div>
          </section>
        )}

        <div className={styles.inner}>
          <section className={styles.cta}>
            <h2 className={styles.ctaTitle}>{common.ctaTitle}</h2>
            <p className={styles.ctaText}>{common.ctaText}</p>
            <div className={styles.ctaRow}>
              <Link
                href="/contact"
                className="ktn-btn"
                data-umami-event="showcase-cta-contact"
                data-umami-event-area={area}
              >
                {common.ctaPrimary}
              </Link>
              <Link href="/services" className="ktn-btn ktn-btn--ghost">
                {common.ctaSecondary}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
