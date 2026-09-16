"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { categoryAccent, categoryLabel } from "@/lib/categories";
import styles from "@/app/page-kit.module.css";

export type ProjectCard = {
  slug: string;
  name: string;
  category: string;
  shortDescTr: string;
  shortDescEn: string;
  coverImage: string | null;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
};

const COPY = {
  tr: {
    eyebrow: "Projeler",
    title: "Yazdığım her şey, tek listede",
    lead: "Müşteri işleri, kendi ürünlerim ve denemeler bir arada. Müşteriye dönük anlatımı ve ekran görüntülerini arıyorsan Yapılan İşler sayfasına bak.",
    pillShowcase: "Alan bazlı vitrin",
    sectionTitle: "Bütün projeler",
    empty: "Henüz yayınlanmış proje yok.",
    detail: "Proje detayı",
    repo: "Kaynak kodu",
    live: "Canlı site",
  },
  en: {
    eyebrow: "Projects",
    title: "Everything I have built, in one list",
    lead: "Client work, my own products and experiments together. If you are after the client-facing write-ups and screenshots, see the Work pages.",
    pillShowcase: "Work by area",
    sectionTitle: "All projects",
    empty: "No published projects yet.",
    detail: "Project details",
    repo: "Source code",
    live: "Live site",
  },
} as const;

export default function ProjectsList({ projects }: { projects: ProjectCard[] }) {
  const { lang, isTransitioning } = useLanguage();
  const copy = COPY[lang];

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main
        className={`${styles.page} content-fade-in`}
        style={{ ["--accent" as string]: "#7A3CFF" }}
      >
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <div className={styles.heroMeta}>
              <Link href="/showcase" className={styles.heroPill}>
                <span className={styles.heroPillDot} aria-hidden="true" />
                {copy.pillShowcase} →
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.sectionBand}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>
              {copy.sectionTitle}
              {projects.length > 0 && (
                <span className={styles.sectionCount}>{projects.length}</span>
              )}
            </h2>
          </div>
        </div>

        <div className={styles.inner}>

          {projects.length === 0 ? (
            <p className={styles.empty}>{copy.empty}</p>
          ) : (
            <div className={styles.grid}>
              {projects.map((p) => {
                const desc = lang === "tr" ? p.shortDescTr : p.shortDescEn;
                return (
                  <article
                    key={p.slug}
                    className={styles.card}
                    style={{ ["--accent" as string]: categoryAccent(p.category) }}
                  >
                    {p.coverImage && (
                      <Link href={`/projects/${p.slug}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className={styles.cardCover}
                          loading="lazy"
                        />
                      </Link>
                    )}
                    <div className={styles.cardBody}>
                      <Link href={`/projects/${p.slug}`}>
                        <h3 className={styles.cardTitle}>{p.name}</h3>
                      </Link>
                      {desc && <p className={styles.cardDesc}>{desc}</p>}

                      <div className={styles.chipRow}>
                        <span className={`${styles.chip} ${styles.chipArea}`}>
                          {categoryLabel(p.category, lang)}
                        </span>
                        {p.techStack.slice(0, 4).map((t) => (
                          <span key={t} className={styles.chip}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className={styles.cardLinks}>
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.cardLink}
                            data-umami-event="project-github"
                            data-umami-event-slug={p.slug}
                          >
                            {copy.repo} ↗
                          </a>
                        )}
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.cardLink}
                            data-umami-event="project-demo"
                            data-umami-event-slug={p.slug}
                          >
                            {copy.live} ↗
                          </a>
                        )}
                        <Link
                          href={`/projects/${p.slug}`}
                          className={`${styles.cardLink} ${styles.cardLinkStrong}`}
                          data-umami-event="project-details"
                          data-umami-event-slug={p.slug}
                        >
                          {copy.detail} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
