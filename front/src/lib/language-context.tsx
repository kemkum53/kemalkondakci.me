"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations } from "./translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations.en | typeof translations.tr;
  isTransitioning: boolean;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en"); // Default English
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Glitch language transition function
  const changeLang = (newLang: Lang) => {
    if (newLang === lang) return;
    
    // Remember scroll position
    const scrollY = window.scrollY;
    
    setIsTransitioning(true);
    
    // Glitch timing - quick bursts
    setTimeout(() => {
      setLang(newLang);
      setTimeout(() => {
        setIsTransitioning(false);
        // Restore scroll position to prevent jumping
        window.scrollTo(0, scrollY);
      }, 200); // Glitch recovery
    }, 300); // Glitch duration
  };

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") as Lang;
    if (savedLang && (savedLang === "en" || savedLang === "tr")) {
      setLang(savedLang);
    } else {
      // Auto-detect browser language, but keep English as fallback
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("tr")) {
        setLang("tr");
      }
      // Default stays "en" - no need to explicitly set
    }
    
    // Mark as hydrated to prevent FOUC
    setTimeout(() => setIsHydrated(true), 50); // Small delay for smooth appearance
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("preferred-language", lang);
    // Update document lang attribute
    document.documentElement.lang = lang;
  }, [lang]);

  const contextValue: LanguageContextType = {
    lang,
    setLang: changeLang,
    t: translations[lang],
    isTransitioning,
    isHydrated,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {/* Prevent FOUC with elegant fade-in */}
      <div 
        className={isHydrated ? 'content-fade-in' : ''}
        style={{ 
          opacity: isHydrated ? 1 : 0,
          visibility: isHydrated ? 'visible' : 'hidden'
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
