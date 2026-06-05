import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "CV",
    description: "Kemal Kondakçı'nın detaylı CV'si - AI Engineer, Python Developer, Machine Learning uzmanı. Deneyimler, projeler ve teknik yetenekler.",
    keywords: [
      "Kemal Kondakçı CV",
      "Kemal Kondakçı özgeçmiş",
      "AI Engineer CV",
      "Python Developer CV",
      "Machine Learning Engineer CV",
      "Software Developer CV",
      "MODSOFT Bilişim",
      "Kırklareli Üniversitesi",
      "Computer Engineering"
    ],
    openGraph: {
      title: "CV - Kemal Kondakçı",
      description: "Kemal Kondakçı'nın detaylı CV'si - AI Engineer, Python Developer, Machine Learning uzmanı.",
      url: 'https://kemalkondakci.me/cv',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: "CV - Kemal Kondakçı",
      description: "Kemal Kondakçı'nın detaylı CV'si - AI Engineer, Python Developer, Machine Learning uzmanı.",
    },
    alternates: {
      canonical: '/cv',
    },
  };
}

export default function CVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
