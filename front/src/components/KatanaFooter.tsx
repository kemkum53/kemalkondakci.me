"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useAccessibility } from "@/lib/accessibility-context";

type LinkGroup = { title: string; items: { href: string; label: string }[] };

type Props = {
  about?: string;
  groups?: LinkGroup[];
  copyrightName?: string;
};

export default function KatanaFooter({
  copyrightName = "Kemal Kondakçı",
}: Props) {
  const { t, isTransitioning } = useLanguage();
  const { isSafeMode, setSafeMode } = useAccessibility();

  const about = t.footer.about;
  const groups = [
    {
      title: t.footer.navigation,
      items: [
        { href: "/", label: t.navbar.home },
        { href: "/cv", label: t.navbar.cv },
        { href: "/projects", label: t.navbar.projects },
        { href: "/contact", label: t.navbar.contact },
      ],
    },
    {
      title: t.footer.social,
      items: [
        { href: "mailto:kondakci.k@gmail.com", label: t.footer.email },
        { href: "https://www.linkedin.com/in/kemal-kondak%C3%A7%C4%B1-b62173157/", label: t.footer.linkedin },
        { href: "https://github.com/kemkum53", label: t.footer.github },
        { href: "https://wa.me/905538790853", label: t.footer.whatsapp },
      ],
    },
  ];

  return (
    <footer className={`ktn-scope ktn-footer language-transition ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="ktn-container">
        <div className="ktn-grid">
          <section className="ktn-footer-main">
            <div className="ktn-footer-brand">
              <svg className="ktn-footer-icon" viewBox="0 0 64 64" aria-hidden="true">
                {/* KK monogram with tech elements */}
                <defs>
                  <linearGradient id="footerTechGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
                  </linearGradient>
                </defs>
                
                {/* Main K structure */}
                <path d="M12 12 L12 52 M12 32 L40 12 M12 32 L40 52" 
                      stroke="url(#footerTechGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                
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
              <h3 className="ktn-glitch ktn-footer-brand-text" data-text="Kemal Kondakçı">
                Kemal Kondakçı
              </h3>
            </div>
            <p className="ktn-footer-about">{about}</p>
            <div className="ktn-footer-actions">
              <a href="#top" className="ktn-btn ktn-btn--ghost ktn-footer-top" aria-label={t.footer.goToTop}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5l0 14M5 12l7 -7l7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {t.footer.goToTop}
              </a>
              <a href="/cv" className="ktn-btn ktn-footer-cv">{t.footer.downloadCv}</a>
            </div>
          </section>

          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title} className="ktn-footer-nav">
              <h4 className="ktn-footer-nav-title">{g.title}</h4>
              <ul className="ktn-footer-nav-list">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="ktn-footer-link">{it.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ktn-footer-bottom">
          <div className="ktn-footer-copyright">
            <span>© {new Date().getFullYear()} {copyrightName}</span>
            <span className="ktn-footer-divider">•</span>
            <span>{t.footer.copyrightRole}</span>
          </div>
          <div className="ktn-footer-legal">
            <div className="safe-mode-toggle footer-toggle">
              <label className="switch" title={t.accessibility.safeModeDescription}>
                <input
                  type="checkbox"
                  checked={isSafeMode}
                  onChange={(e) => setSafeMode(e.target.checked)}
                />
                <span className="slider">
                </span>
              </label>
              <span className="switch-label">{t.accessibility.safeMode}</span>
            </div>
            <span className="ktn-footer-status">{t.footer.availableStatus}</span>
          </div>
        </div>
      </div>
      
      {/* Safe Mode Toggle Styles for Footer */}
      <style jsx>{`
        .safe-mode-toggle.footer-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .switch {
          position: relative;
          display: inline-block;
          width: 45px;
          height: 22px;
          cursor: pointer;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 22px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .switch input:checked + .slider {
          background-color: #4caf50;
          border-color: #4caf50;
        }
        
        .switch input:checked + .slider:before {
          transform: translateX(23px);
        }
        
        .switch-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .ktn-footer-legal {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .ktn-footer-legal {
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
