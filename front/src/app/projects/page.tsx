import { getPublishedProjects } from "@/lib/projects";
import ProjectsList, { type ProjectCard } from "@/components/projects/ProjectsList";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  const cards: ProjectCard[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescTr: p.shortDescTr,
    shortDescEn: p.shortDescEn,
    coverImage: p.coverImage,
    techStack: p.techStack,
    repoUrl: p.repoUrl,
    liveUrl: p.liveUrl,
  }));

  return <ProjectsList projects={cards} />;
}
