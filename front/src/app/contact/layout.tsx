import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Default to English, but this will be updated client-side
  return {
    title: "Contact",
    description: "Get in touch with Kemal Kondakçı. Professional support for your AI projects and software development needs.",
    keywords: [
      "Kemal Kondakçı contact",
      "AI Engineer hire", 
      "Python Developer hire",
      "Machine Learning consultant",
      "Software Developer contact",
      "AI project consulting",
      "Software development service"
    ],
    openGraph: {
      title: "Contact - Kemal Kondakçı",
      description: "Get in touch with Kemal Kondakçı. Professional support for your AI projects and software development needs.",
      url: 'https://kemalkondakci.me/contact',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: "Contact - Kemal Kondakçı", 
      description: "Get in touch with Kemal Kondakçı. Professional support for your AI projects and software development needs.",
    },
    alternates: {
      canonical: '/contact',
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
