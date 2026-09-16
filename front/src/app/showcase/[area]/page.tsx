import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { getShowcaseArea, SHOWCASE_AREAS } from "@/lib/showcase";
import ShowcaseAreaView, {
  type CaseView,
  type ServiceSummary,
} from "@/components/showcase/ShowcaseAreaView";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SHOWCASE_AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const definition = getShowcaseArea(area);
  if (!definition) return { title: "Sayfa bulunamadı" };

  const { metaTitle, metaDescription } = definition.copy.tr;
  const url = `https://kemalkondakci.me/showcase/${definition.slug}`;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${metaTitle} - Kemal Kondakçı`,
      description: metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function ShowcaseAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const definition = getShowcaseArea(area);
  if (!definition) notFound();

  const [projects, services] = await Promise.all([
    getPublishedProjects(definition.slug),
    getPublishedServices(),
  ]);

  const cases: CaseView[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    coverImage: p.coverImage,
    shortDescTr: p.shortDescTr,
    shortDescEn: p.shortDescEn,
    clientName: p.clientName,
    roleTr: p.roleTr,
    roleEn: p.roleEn,
    resultsTr: p.resultsTr,
    resultsEn: p.resultsEn,
    gallery: p.gallery,
    techStack: p.techStack,
    repoUrl: p.repoUrl,
    liveUrl: p.liveUrl,
  }));

  const areaServices: ServiceSummary[] = services
    .filter((s) => s.category === definition.slug)
    .map((s) => ({
      id: s.id,
      nameTr: s.nameTr,
      nameEn: s.nameEn,
      shortDescTr: s.shortDescTr,
      shortDescEn: s.shortDescEn,
    }));

  return (
    <ShowcaseAreaView area={definition.slug} cases={cases} services={areaServices} />
  );
}
