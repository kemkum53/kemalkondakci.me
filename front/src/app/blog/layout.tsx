import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Blog";
  const description =
    "Yapay zekâ, yazılım ve sunucu tarafında çalışırken çıkan notlar. Uygulama sırasında öğrendiklerim, bitmiş işlerin ardından.";

  return {
    title,
    description,
    alternates: { canonical: "https://kemalkondakci.me/blog" },
    openGraph: {
      title: `${title} - Kemal Kondakçı`,
      description,
      url: "https://kemalkondakci.me/blog",
      type: "website",
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
