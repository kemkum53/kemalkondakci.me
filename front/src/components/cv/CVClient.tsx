"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { skillBars, techStackGroups, timeline, socials } from "@/lib/cv-data";
import styles from "@/app/cv/cv.module.css";

export type CVProject = {
  slug: string;
  name: string;
  shortDescTr: string;
  shortDescEn: string;
  techStack: string[];
};

export default function CVClient({ projects }: { projects: CVProject[] }) {
  const { t, lang, isTransitioning } = useLanguage();
  const [animate, setAnimate] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = {
    tr: { print: "PDF olarak indir", about: "Hakkımda", experience: "Deneyim", skills: "Yetenekler", projects: "Öne Çıkan Projeler" },
    en: { print: "Download as PDF", about: "About", experience: "Experience", skills: "Skills", projects: "Selected Projects" },
  }[lang];

  return (
    <div className={`ktn-scope cv-print-root language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className={`content-fade-in ${styles.page}`}>
        <div className={styles.sheet}>
          {/* Header */}
          <header className={styles.header}>
            <Image src="/me.png" alt={t.home.name} width={96} height={96} className={styles.avatar} priority />
            <div className={styles.identity}>
              <h1 className={`font-display ${styles.name}`}>{t.home.name}</h1>
              <p className={styles.role}>{t.home.title}</p>
              <p className={styles.usp}>{t.home.usp}</p>
            </div>
            <div className={styles.actions} data-noprint>
              <a
                href={`/cv/Kemal-Kondakci-CV-${lang === "tr" ? "TR" : "EN"}.pdf`}
                download={`Kemal Kondakci - CV (${lang === "tr" ? "TR" : "EN"}).pdf`}
                className={styles.printBtn}
                data-umami-event="cv-download"
                data-umami-event-lang={lang}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {copy.print}
              </a>
            </div>
          </header>

          {/* Contact row */}
          <ul className={styles.contacts}>
            <li>📍 {socials.location[lang]}</li>
            <li><a href={`mailto:${socials.email}`}>✉ {socials.email}</a></li>
            <li><a href={socials.github} target="_blank" rel="noopener noreferrer">↗ GitHub</a></li>
            <li><a href={socials.linkedin} target="_blank" rel="noopener noreferrer">↗ LinkedIn</a></li>
            <li><a href={socials.whatsapp} target="_blank" rel="noopener noreferrer">↗ WhatsApp</a></li>
          </ul>

          {/* About */}
          <section className={styles.section}>
            <h2 className={styles.h2}>{copy.about}</h2>
            <p className={styles.about}>{t.home.aboutText}</p>
          </section>

          {/* Experience */}
          <section className={styles.section}>
            <h2 className={styles.h2}>{copy.experience}</h2>
            <div className={styles.timeline}>
              {timeline.map((item) => (
                <div key={item.company} className={styles.tlItem}>
                  <div className={styles.tlHead}>
                    <span>
                      <span className={styles.tlRole}>{item.role[lang]}</span>{" "}
                      <span className={styles.tlCompany}>· {item.company}</span>
                    </span>
                    <span className={styles.tlPeriod}>{item.period[lang]}</span>
                  </div>
                  <ul className={styles.tlBullets}>
                    {item.bullets[lang].map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills: proficiency bars + grouped tech stack */}
          <section className={styles.section}>
            <h2 className={styles.h2}>{copy.skills}</h2>
            <div ref={barsRef} className={styles.barsGrid}>
              {skillBars.map((s) => (
                <div key={s.label} className={styles.bar}>
                  <div className={styles.barTop}>
                    <span className={styles.barLabel}>{s.label}</span>
                    <span className={styles.barPct}>{s.value}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: animate ? `${s.value}%` : 0 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.stackGroups}>
              {techStackGroups.map((g) => (
                <div key={g.label.en} className={styles.stackGroup}>
                  <h3 className={styles.stackLabel}>{g.label[lang]}</h3>
                  <ul className={styles.tagRow}>
                    {g.items.map((it) => (
                      <li key={it} className={styles.tag}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Projects */}
          {projects.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.h2}>{copy.projects}</h2>
              <div className={styles.projects}>
                {projects.map((p) => (
                  <div key={p.slug} className={styles.projItem}>
                    <div className={styles.projHead}>
                      <h3 className={styles.projName}>
                        <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                      </h3>
                    </div>
                    <p className={styles.projDesc}>{lang === "tr" ? p.shortDescTr : p.shortDescEn}</p>
                    {p.techStack.length > 0 && (
                      <ul className={styles.tagRow}>
                        {p.techStack.slice(0, 6).map((tc) => (
                          <li key={tc} className={styles.tag}>{tc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
