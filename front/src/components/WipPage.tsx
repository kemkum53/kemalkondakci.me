"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useEffect } from "react";

type WipPageProps = {
  pageType: "projects" | "blog" | "contact" | "hire" | "cv";
  customTitle?: string;
  customDescription?: string;
};

export default function WipPage({ pageType, customTitle, customDescription }: WipPageProps) {
  const { t, isTransitioning, lang } = useLanguage();

  // Get page-specific titles
  const getPageTitle = () => {
    if (customTitle) return customTitle;
    
    switch (pageType) {
      case "cv": return t.navbar.cv;
      case "projects": return t.navbar.projects;
      case "blog": return t.navbar.blog;
      case "contact": return t.navbar.contact;
      case "hire": return t.navbar.hireMe;
      default: return t.wip.title;
    }
  };

  // Get page title for browser tab
  const getBrowserTitle = () => {
    switch (pageType) {
      case "cv": return lang === 'tr' ? "CV" : "CV";
      case "projects": return lang === 'tr' ? "Projeler" : "Projects";
      case "blog": return lang === 'tr' ? "Blog" : "Blog";
      case "hire": return lang === 'tr' ? "İşe Al" : "Hire Me";
      default: return getPageTitle();
    }
  };

  // Update document title
  useEffect(() => {
    const title = getBrowserTitle();
    document.title = `${title} - Kemal Kondakçı | AI Engineer & Software Developer`;
  }, [lang, pageType]);

  const pageTitle = getPageTitle();
  const pageDescription = customDescription || t.wip.description;

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? 'transitioning' : ''}`}>
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center relative">
          {/* Background Katana silhouette */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
            viewBox="0 0 400 300"
          >
            <defs>
              <linearGradient id="wipGrad" x1="0" x2="1">
                <stop offset="0" stopColor="var(--purple)" />
                <stop offset="0.5" stopColor="var(--cyan)" />
                <stop offset="1" stopColor="var(--red)" />
              </linearGradient>
            </defs>
            <path 
              d="M50 150 Q 200 50 350 120" 
              stroke="url(#wipGrad)" 
              strokeWidth="6" 
              fill="none" 
            />
            <rect x="50" y="140" width="30" height="15" fill="url(#wipGrad)" />
            <circle cx="380" cy="120" r="8" fill="var(--cyan)" opacity="0.6" />
          </svg>

          {/* Content */}
          <div className="relative z-10">
            {/* Glitch Title */}
            <h1 className="ktn-glitch text-4xl md:text-6xl font-display mb-4 text-[var(--text)]" 
                data-text={pageTitle}>
              {pageTitle}
            </h1>

            {/* Subtitle with neon effect */}
            <p className="text-lg md:text-xl text-[var(--purple)] mb-6 font-medium">
              {t.wip.subtitle}
            </p>

            {/* Description */}
            <p className="text-[var(--muted)] mb-8 leading-relaxed max-w-lg mx-auto">
              {pageDescription}
            </p>

            {/* Coming Soon badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[var(--text)]">
                {t.wip.comingSoon}
              </span>
            </div>

            {/* Features preview */}
            <div className="grid gap-4 mb-8 max-w-md mx-auto">
              {Object.values(t.wip.features).map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 text-left bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3"
                >
                  <div className="w-2 h-2 bg-[var(--purple)] rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-[var(--muted)]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="ktn-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L0 8h3v8h10V8h3L8 0z"/>
                </svg>
                {t.wip.backHome}
              </Link>
              
              <Link href="/contact" className="ktn-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 3h12l-6 4-6-4zm0 2v8h12V5l-6 4-6-4z"/>
                </svg>
                {t.navbar.contact}
              </Link>
            </div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[var(--cyan)] rounded-full opacity-40 animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 8}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
