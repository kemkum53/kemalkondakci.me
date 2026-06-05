import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/projects";
import ProjectArticle, { type ProjectView } from "@/components/projects/ProjectArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Proje bulunamadı" };

  const description = project.shortDescTr || project.shortDescEn || undefined;
  return {
    title: project.name,
    description,
    openGraph: {
      title: `${project.name} - Kemal Kondakçı`,
      description,
      ...(project.coverImage ? { images: [{ url: project.coverImage }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const view: ProjectView = {
    slug: project.slug,
    name: project.name,
    shortDescTr: project.shortDescTr,
    shortDescEn: project.shortDescEn,
    contentTr: project.contentTr,
    contentEn: project.contentEn,
    coverImage: project.coverImage,
    techStack: project.techStack,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
  };

  return <ProjectArticle project={view} />;
}
