import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Yapılan İşler";
  const description =
    "Web ve e-ticaret, yapay zekâ, otomasyon ve DevOps alanlarında yapılan işler. Her alanın kendi sayfası, ekran görüntüleri ve fiyatlarıyla.";

  return {
    title,
    description,
    alternates: { canonical: "https://kemalkondakci.me/showcase" },
    openGraph: {
      title: `${title} - Kemal Kondakçı`,
      description,
      url: "https://kemalkondakci.me/showcase",
      type: "website",
    },
  };
}

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
