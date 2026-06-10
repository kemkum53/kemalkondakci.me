import CVClient from "@/components/cv/CVClient";
import { getPublishedProjects } from "@/lib/projects";

// Öne çıkan projeler DB'den geldiği için her istekte taze.
export const dynamic = "force-dynamic";

export default async function CVPage() {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured);
  const projects = (featured.length > 0 ? featured : all).slice(0, 6).map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescTr: p.shortDescTr,
    shortDescEn: p.shortDescEn,
    techStack: p.techStack,
  }));

  return <CVClient projects={projects} />;
}
