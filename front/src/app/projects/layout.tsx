import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Projeler";
  const description =
    "Müşteri işleri, kendi ürünlerim ve denemeler. Yapay zekâ, web, otomasyon ve altyapı tarafında yazdığım her şey tek listede.";

  return {
    title,
    description,
    alternates: { canonical: "https://kemalkondakci.me/projects" },
    openGraph: {
      title: `${title} - Kemal Kondakçı`,
      description,
      url: "https://kemalkondakci.me/projects",
      type: "website",
    },
  };
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
