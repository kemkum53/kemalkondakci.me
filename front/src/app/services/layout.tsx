import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Hizmetler";
  const description =
    "Satış altyapılı ve kurumsal web siteleri, veritabanına bağlanan chatbot sistemleri, otomasyon ve DevOps işleri. Kapsam ve teslim süreleriyle.";

  return {
    title,
    description,
    alternates: { canonical: "https://kemalkondakci.me/services" },
    openGraph: {
      title: `${title} - Kemal Kondakçı`,
      description,
      url: "https://kemalkondakci.me/services",
      type: "website",
    },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
