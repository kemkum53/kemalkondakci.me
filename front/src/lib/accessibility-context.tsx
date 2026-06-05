"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AccessibilityContextType = {
  isSafeMode: boolean;
  setSafeMode: (enabled: boolean) => void;
  hasSeenEpilepsyWarning: boolean;
  markEpilepsyWarningAsSeen: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isSafeMode, setIsSafeMode] = useState(false);
  const [hasSeenEpilepsyWarning, setHasSeenEpilepsyWarning] = useState(true); // Default true to avoid flash

  useEffect(() => {
    // Load settings from localStorage
    const savedSafeMode = localStorage.getItem("accessibility-safe-mode");
    const savedWarning = localStorage.getItem("accessibility-epilepsy-warning-seen");
    
    if (savedSafeMode !== null) {
      const isEnabled = savedSafeMode === "true";
      setIsSafeMode(isEnabled);
      // Apply safe mode class immediately
      if (isEnabled) {
        document.body.classList.add("safe-mode");
      }
    }
    
    if (savedWarning !== null) {
      setHasSeenEpilepsyWarning(savedWarning === "true");
    } else {
      // First visit, show warning
      setHasSeenEpilepsyWarning(false);
    }
  }, []);

  const setSafeMode = (enabled: boolean) => {
    setIsSafeMode(enabled);
    localStorage.setItem("accessibility-safe-mode", enabled.toString());
    
    // Add/remove CSS class from body for global effects
    if (enabled) {
      document.body.classList.add("safe-mode");
    } else {
      document.body.classList.remove("safe-mode");
    }
  };

  const markEpilepsyWarningAsSeen = () => {
    setHasSeenEpilepsyWarning(true);
    localStorage.setItem("accessibility-epilepsy-warning-seen", "true");
  };

  return (
    <AccessibilityContext.Provider value={{
      isSafeMode,
      setSafeMode,
      hasSeenEpilepsyWarning,
      markEpilepsyWarningAsSeen
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
