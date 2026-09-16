"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { categoryLabel } from "@/lib/categories";
import { SHOWCASE_AREAS, SHOWCASE_COMMON } from "@/lib/showcase";
import styles from "@/app/showcase/showcase.module.css";

export default function ShowcaseIndex({ counts }: { counts: Record<string, number> }) {
  const { lang, isTransitioning } = useLanguage();
  const copy = SHOWCASE_COMMON[lang];

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main
        className={`${styles.page} content-fade-in`}
        style={{ ["--accent" as string]: "#7A3CFF" }}
      >
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{copy.indexEyebrow}</p>
            <h1 className={styles.title}>{copy.indexTitle}</h1>
            <p className={styles.lead}>{copy.indexLead}</p>
          </div>
        </section>

        <div className={styles.inner}>
          <div className={styles.areaGrid}>
            {SHOWCASE_AREAS.map((area) => {
              const count = counts[area.slug] ?? 0;
              const areaCopy = area.copy[lang];
              return (
                <Link
                  key={area.slug}
                  href={`/showcase/${area.slug}`}
                  className={styles.areaCard}
                  style={{ ["--accent" as string]: area.accent }}
                  data-umami-event="showcase-area"
                  data-umami-event-area={area.slug}
                >
                  <span className={styles.areaName}>{categoryLabel(area.slug, lang)}</span>
                  <span className={styles.areaDesc}>{areaCopy.title}</span>
                  <span className={styles.areaFoot}>
                    <span className={styles.areaCount}>
                      {count > 0 ? copy.caseCount(count) : copy.caseCountEmpty}
                    </span>
                    <span className={styles.areaOpen}>{copy.open} →</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
