"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { CSSProperties } from "react";
type CSSVars = CSSProperties & { "--i"?: number };

const skillChips = ["Python","C#",".NET","Machine Learning","Deep Learning","Computer Vision","NLP","MLOps","FastAPI","Docker","SQL","Azure"];
const skillBars = [
  { label: "Python", value: 90 },
  { label: "C#", value: 85 },
  { label: ".NET", value: 82 },
  { label: "Machine Learning", value: 88 },
];

const timeline = [
  { 
    role: { tr: "Yazılım Geliştirme Uzmanı", en: "Software Development Specialist" }, 
    company: "MODSOFT Bilişim", 
    period: { tr: "05/2023 — Güncel", en: "05/2023 — Current" }, 
    bullets: { 
      tr: ["AI destekli modüller ve .NET tabanlı servisler.","Performans/izleme, ölçülebilir iyileştirmeler."],
      en: ["AI-powered modules and .NET-based services.", "Performance monitoring and measurable improvements."]
    }
  },
  { 
    role: { tr: "Bilgi İşlem Destek Elemanı", en: "IT Support Specialist" }, 
    company: "QUALA NETWORKS", 
    period: { tr: "03/2022 — 05/2023", en: "03/2022 — 05/2023" }, 
    bullets: { 
      tr: ["Sistem desteği, otomasyon ve küçük araçlar."],
      en: ["System support, automation and small tools."]
    }
  },
  { 
    role: { tr: "Stajyer", en: "Intern" }, 
    company: "İSBAK", 
    period: { tr: "06/2019 — 07/2019", en: "06/2019 — 07/2019" }, 
    bullets: { 
      tr: ["Ar-Ge süreçlerine destek."],
      en: ["Support for R&D processes."]
    }
  },
];

export default function HomePage() {
  const { t, lang, isTransitioning } = useLanguage();

  // HomePage-specific structured data
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kemal Kondakçı Portfolio",
    "description": "AI Engineer ve Software Developer - Python, ML/DL, .NET ve modern teknolojilerle güvenilir çözümler geliştiriyorum.",
    "url": "https://kemalkondakci.me",
    "author": {
      "@type": "Person",
      "name": "Kemal Kondakçı",
      "jobTitle": "AI Engineer & Software Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "MODSOFT Bilişim"
      }
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Kemal Kondakçı",
      "hasOccupation": {
        "@type": "Occupation",
        "name": "AI Engineer",
        "occupationLocation": {
          "@type": "Country",
          "name": "Turkey"
        },
        "skills": ["Python", "Machine Learning", "Deep Learning", "Computer Vision", "NLP", ".NET", "C#", "FastAPI", "Docker", "Azure"]
      }
    }
  };

  // reveal-on-scroll
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;
    const root = rootRef.current; if (!root) return;
    
    // General reveal animation with cyberpunk variants
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const element = e.target as HTMLElement;
          
          // Assign different animation types based on element type
          if (element.tagName === 'H1' || element.tagName === 'H2') {
            element.classList.add('glitch-reveal');
          } else if (element.classList.contains(styles.usp) || element.classList.contains(styles.heroText)) {
            element.classList.add('fade-reveal');
          } else if (element.classList.contains(styles.ctaRow) || element.classList.contains(styles.contact)) {
            element.classList.add('scale-reveal');
          } else if (element.classList.contains(styles.stats) || element.classList.contains(styles.avatarWrap)) {
            element.classList.add('slide-reveal');
          }
          
          element.classList.add(styles.isIn);
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    items.forEach((el) => io.observe(el));

    // Skill bars animation with cyberpunk effect
    const skillBars = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.skillTrack} > i`));
    const skillsIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const target = e.target as HTMLElement;
          const skillBar = target.parentElement;
          if (skillBar) {
            skillBar.classList.add(styles.skillAnimating);
            // Set the target width as CSS custom property
            const currentWidth = target.style.width;
            target.style.setProperty('--target-width', currentWidth);
            // Add staggered glitch effect
            const index = skillBars.indexOf(target);
            setTimeout(() => {
              target.classList.add(styles.skillBarActive);
            }, index * 150); // Stagger by 150ms
          }
          skillsIO.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -20% 0px", threshold: 0.1 });
    
    skillBars.forEach((bar) => skillsIO.observe(bar));

    // Timeline items animation
    const timelineItems = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.timeItem}`));
    const timelineIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const element = e.target as HTMLElement;
          const index = timelineItems.indexOf(element);
          
          // Stagger timeline items with different animations
          setTimeout(() => {
            if (index % 2 === 0) {
              element.classList.add('slide-reveal');
            } else {
              element.classList.add('glitch-reveal');
            }
            element.classList.add(styles.isIn);
          }, index * 200); // Stagger by 200ms
          
          timelineIO.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0.1 });
    
    timelineItems.forEach((item) => {
      item.classList.add(styles.reveal);
      timelineIO.observe(item);
    });

    // Cards animation
    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`));
    const cardsIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const element = e.target as HTMLElement;
          const index = cards.indexOf(element);
          
          // Stagger cards with scale animation
          setTimeout(() => {
            element.classList.add('scale-reveal');
            element.classList.add(styles.isIn);
          }, index * 150); // Stagger by 150ms
          
          cardsIO.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -20% 0px", threshold: 0.1 });
    
    cards.forEach((card) => {
      card.classList.add(styles.reveal);
      cardsIO.observe(card);
    });

    return () => {
      io.disconnect();
      skillsIO.disconnect();
      timelineIO.disconnect();
      cardsIO.disconnect();
    };
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <main ref={rootRef} className={`ktn-scope ${styles.home} language-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>
              <span className="ktn-glitch" data-text={t.home.name}>{t.home.name}</span>
              <br />
              <span className="ktn-glitch" data-text={t.home.title} style={{ fontSize: '0.6em', opacity: 0.9 }}>{t.home.title}</span>
            </h1>

            <p className={`${styles.usp} ${styles.reveal}`} data-reveal>{t.home.usp}</p>

            <div className={`${styles.ctaRow} ${styles.reveal}`} data-reveal>
              <Link href="/cv" className={`ktn-btn ${styles.btnPulse}`} aria-label={t.home.ctaPrimary}>{t.home.ctaPrimary}</Link>
              <Link href="/contact" className="ktn-btn ktn-btn--ghost" aria-label={t.home.ctaSecondary}>{t.home.ctaSecondary}</Link>
            </div>

            <ul className={`${styles.stats} ${styles.reveal}`} data-reveal>
              <li><span className={styles.statNum}>3+</span><span className={styles.statLabel}>{t.home.sections.statsYears}</span></li>
              <li><span className={styles.statNum}>10+</span><span className={styles.statLabel}>{t.home.sections.statsProjects}</span></li>
            </ul>
          </div>

          <div className={`${styles.avatarWrap} ${styles.reveal}`} data-reveal>
            <div className={styles.avatarAura} aria-hidden="true" />
            <Image src="/me.png" alt="Kemal Kondakçı portrait" width={420} height={420} className={styles.avatar} priority />
          </div>
        </div>

        {/* Hero içi yüzen chip’ler — bölüm dışına taşmıyor */}
        <div className={styles.floatChips} aria-hidden="true">
          {["Python","ML","DL","NLP","CV",".NET","C#","FastAPI","Docker","SQL","Azure"].map((s, i) => (
            <span key={s} className={styles.chip} style={{ "--i": i } as CSSVars}>{s}</span>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.section}>
        <h2 className={styles.h2}>{t.home.sections.about}</h2>
        <p className={`${styles.lead} ${styles.reveal}`} data-reveal>{t.home.aboutText}</p>
      </section>

      {/* SKILLS */}
      <section className={styles.section}>
        <h2 className={styles.h2}>{t.home.sections.skills}</h2>

        <div className={`${styles.grid3} ${styles.reveal}`} data-reveal>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{t.home.skills.aiEngineering.title}</h3>
            <p className={styles.cardBody}>{t.home.skills.aiEngineering.description}</p>
            <div className={styles.chips}>{t.home.skills.aiEngineering.chips.map((c)=> <span key={c} className={styles.chip}>{c}</span>)}</div>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{t.home.skills.backendApis.title}</h3>
            <p className={styles.cardBody}>{t.home.skills.backendApis.description}</p>
            <div className={styles.chips}>{t.home.skills.backendApis.chips.map((c)=> <span key={c} className={styles.chip}>{c}</span>)}</div>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>{t.home.skills.mlopsDeployment.title}</h3>
            <p className={styles.cardBody}>{t.home.skills.mlopsDeployment.description}</p>
            <div className={styles.chips}>{t.home.skills.mlopsDeployment.chips.map((c)=> <span key={c} className={styles.chip}>{c}</span>)}</div>
          </article>
        </div>

        <div className={`${styles.skillWrap} ${styles.reveal}`} data-reveal>
          <ul className={styles.skillBars}>
            {skillBars.map((s) => (
              <li key={s.label}>
                <div className={styles.skillRow}><span>{s.label}</span><span className={styles.skillPct}>{s.value}%</span></div>
                <div className={styles.skillTrack} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.value}><i style={{ width: `${s.value}%` }} /></div>
              </li>
            ))}
          </ul>
          <div className={styles.chipsAll}>{skillChips.map((s)=> <span key={s} className={styles.chip}>{s}</span>)}</div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={styles.section}>
        <h2 className={styles.h2}>{t.home.sections.experience}</h2>
        <ol className={`${styles.timeline} ${styles.reveal}`} data-reveal>
          {timeline.map((item) => (
            <li key={item.role[lang] + item.company} className={styles.timeItem}>
              <div className={styles.timeDot} aria-hidden="true" />
              <div className={styles.timeCard}>
                <header className={styles.timeHeader}>
                  <h3>{item.role[lang]} · {item.company}</h3>
                  <span className={styles.timeWhen}>{item.period[lang]}</span>
                </header>
                <ul className={styles.timeList}>{item.bullets[lang].map((b: string, i: number)=> <li key={i}>{b}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
      </section>


    </main>
    </>
  );
}
