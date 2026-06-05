import type { Metadata } from "next";
import "./globals.css";
import "./katana-ui.css"; // global katana stilleri burada yüklü
import { Orbitron, Inter } from "next/font/google";
import KatanaNavbar from "@/components/KatanaNavbar";
import KatanaFooter from "@/components/KatanaFooter";
import { LanguageProvider } from "@/lib/language-context";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import EpilepsyWarning from "@/components/EpilepsyWarning";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "Kemal Kondakçı - AI Engineer & Software Developer",
    template: "%s - Kemal Kondakçı | AI Engineer & Software Developer"
  },
  description: "AI Engineer ve Software Developer - Python, ML/DL, .NET ve modern teknolojilerle güvenilir çözümler geliştiriyorum.",
  keywords: [
    "Kemal Kondakçı",
    "AI Engineer",
    "Software Developer", 
    "Python Developer",
    "Machine Learning Engineer",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "MLOps",
    ".NET Developer",
    "FastAPI",
    "Docker",
    "Azure",
    "Artificial Intelligence",
    "Yapay Zeka",
    "Yazılım Geliştirici",
    "Python Geliştirici",
    "Makine Öğrenmesi",
    "Derin Öğrenme",
    "Bilgisayar Görü",
    "Doğal Dil İşleme"
  ],
  authors: [{ name: "Kemal Kondakçı" }],
  creator: "Kemal Kondakçı",
  publisher: "Kemal Kondakçı",
  metadataBase: new URL('https://kemalkondakci.me'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr',
    },
  },
  openGraph: {
    title: "Kemal Kondakçı - AI Engineer & Software Developer",
    description: "AI Engineer ve Software Developer - Python, ML/DL, .NET ve modern teknolojilerle güvenilir çözümler geliştiriyorum.",
    url: 'https://kemalkondakci.me',
    siteName: 'Kemal Kondakçı Portfolio',
    images: [
      {
        url: '/me.png',
        width: 1200,
        height: 630,
        alt: 'Kemal Kondakçı - AI Engineer & Software Developer',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kemal Kondakçı - AI Engineer & Software Developer",
    description: "AI Engineer ve Software Developer - Python, ML/DL, .NET ve modern teknolojilerle güvenilir çözümler geliştiriyorum.",
    images: ['/me.png'],
    creator: '@kemalkondakci',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kemal Kondakçı",
    "jobTitle": "AI Engineer & Software Developer",
    "description": "AI Engineer ve Software Developer - Python, ML/DL, .NET ve modern teknolojilerle güvenilir çözümler geliştiriyorum.",
    "url": "https://kemalkondakci.me",
    "image": "https://kemalkondakci.me/me.png",
    "sameAs": [
      "https://www.linkedin.com/in/kemal-kondakçı-b62173157/",
      "https://github.com/kemkum53",
      "mailto:kondakci.k@gmail.com"
    ],
    "knowsAbout": [
      "Python",
      "Machine Learning", 
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      ".NET",
      "C#",
      "FastAPI",
      "Docker",
      "Azure",
      "MLOps",
      "Artificial Intelligence"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "MODSOFT Bilişim"
    },
    "alumniOf": {
      "@type": "EducationalOrganization", 
      "name": "Kırklareli Üniversitesi"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": "Turkey"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "kondakci.k@gmail.com",
      "contactType": "professional"
    }
  };

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#7a3cff" />
        <link rel="canonical" href="https://kemalkondakci.me" />
        <link rel="alternate" hrefLang="tr" href="https://kemalkondakci.me" />
        <link rel="alternate" hrefLang="en" href="https://kemalkondakci.me/en" />
        <link rel="alternate" hrefLang="x-default" href="https://kemalkondakci.me" />
      </head>
      <body className={`${orbitron.variable} ${inter.variable}`}>
        <LanguageProvider>
          <AccessibilityProvider>
            <EpilepsyWarning />
            <a id="top" className="sr-only" aria-hidden="true" />
            <KatanaNavbar />
            {children}
            <KatanaFooter />
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
