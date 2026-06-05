"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export type NavLink = { href: string; label: string; prefetch?: boolean };

type Props = {
  brand?: string;
  links?: NavLink[];
  cta?: { href: string; label: string };
};

export default function KatanaNavbar({
  brand,
  links,
  cta,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, setLang, t, isTransitioning } = useLanguage();

  // Use translations for default values
  const defaultBrand = brand || t.home.name;
  const defaultLinks = links || [
    { href: "/", label: t.navbar.home },
    { href: "/cv", label: t.navbar.cv },
    { href: "/projects", label: t.navbar.projects },
    { href: "/blog", label: t.navbar.blog },
    { href: "/contact", label: t.navbar.contact },
  ];
  const defaultCta = cta || { href: "/hire", label: t.navbar.hireMe };

  const toggleLanguage = () => {
    setLang(lang === "en" ? "tr" : "en");
  };

  return (
    <div className={`ktn-scope ktn-nav language-transition ${isTransitioning ? 'transitioning' : ''}`} data-open={open}>
      <div className="ktn-container">
        <Link href="/" className="ktn-brand">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            {/* KK monogram with tech elements */}
            <defs>
              <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
            
            {/* Main K structure */}
            <path d="M12 12 L12 52 M12 32 L40 12 M12 32 L40 52" 
                  stroke="url(#techGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Second K (overlapping) */}
            <path d="M28 16 L28 48 M28 32 L48 16 M28 32 L48 48" 
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
            
            {/* Tech accent dots */}
            <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.9">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="44" cy="28" r="1" fill="currentColor" opacity="0.8">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
            </circle>
            
            {/* Circuit-like connecting lines */}
            <path d="M20 20 L24 24 M44 28 L40 32" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          </svg>
          <span className="ktn-glitch" data-text={defaultBrand} aria-label={defaultBrand}>
            {defaultBrand}
          </span>
        </Link>

        <div className="ktn-spacer" />

        {/* Desktop menü */}
        <nav className="ktn-menu" aria-label="Primary">
          {defaultLinks.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch={l.prefetch}
                className="ktn-link ktn-glitch"
                data-active={active || undefined}
                data-text={l.label}
              >
                {l.label}
              </Link>
            );
          })}
          {defaultCta ? (
            <Link href={defaultCta.href} className="ktn-btn ktn-btn--ghost ktn-glitch" data-text={defaultCta.label}>
              {defaultCta.label}
            </Link>
          ) : null}
          
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="ktn-link lang-button"
            type="button"
            aria-label={lang === "en" ? "Switch to Turkish" : "Switch to English"}
            title={lang === "en" ? "Switch to Turkish" : "Switch to English"}
            disabled={isTransitioning}
            style={{ 
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            {isTransitioning ? "⚡" : lang === "en" ? "🇹🇷" : "🇬🇧"}
          </button>
        </nav>

        {/* Mobil buton — görünürlüğü tamamen CSS yönetiyor */}
        <button
          className="ktn-menuBtn"
          type="button"
          aria-expanded={open}
          aria-controls="ktn-mobile"
          onClick={() => setOpen((s) => !s)}
        >
          <span className="sr-only">Menüyü aç/kapat</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Mobil menü paneli */}
      <div id="ktn-mobile" className="ktn-container ktn-menuMobile">
        {defaultLinks.map((l) => {
          const active =
            l.href === "/"
              ? pathname === "/"
              : pathname === l.href || pathname?.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className="ktn-link ktn-glitch"
              data-active={active || undefined}
              data-text={l.label}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          );
        })}
        {defaultCta ? (
          <Link href={defaultCta.href} className="ktn-btn ktn-btn--ghost ktn-glitch" data-text={defaultCta.label} onClick={() => setOpen(false)}>
            {defaultCta.label}
          </Link>
        ) : null}
        
        {/* Mobile Language Toggle */}
        <button
          onClick={() => {
            toggleLanguage();
            setOpen(false);
          }}
          className="ktn-link lang-button mobile-lang-fix"
          type="button"
          aria-label={lang === "en" ? "Switch to Turkish" : "Switch to English"}
          disabled={isTransitioning}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            padding: '0.5rem 1rem',
            margin: '0 auto',
            width: 'auto'
          }}
        >
          {isTransitioning ? "⚡" : lang === "en" ? "🇹🇷" : "🇬🇧"}
        </button>
      </div>
    </div>
  );
}
