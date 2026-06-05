"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Loading component for SSR
function LanguageProviderLoading({ children }: { children: ReactNode }) {
  return (
    <div style={{ opacity: 0, visibility: 'hidden' }}>
      {children}
    </div>
  );
}

// Dynamically import the LanguageProvider to prevent SSR issues
const DynamicLanguageProvider = dynamic(
  () => import('./language-context').then(mod => ({ default: mod.LanguageProvider })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ClientLanguageProvider({ children }: { children: ReactNode }) {
  return (
    <DynamicLanguageProvider>
      {children}
    </DynamicLanguageProvider>
  );
}
