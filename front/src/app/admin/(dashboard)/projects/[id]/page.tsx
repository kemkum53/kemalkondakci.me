import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { requireAuth } from "@/lib/session";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Projeyi düzenle</h1>
      <ProjectForm
        project={{
          id: project.id,
          slug: project.slug,
          name: project.name,
          shortDescTr: project.shortDescTr,
          shortDescEn: project.shortDescEn,
          contentTr: project.contentTr,
          contentEn: project.contentEn,
          techStack: project.techStack,
          repoUrl: project.repoUrl ?? "",
          liveUrl: project.liveUrl ?? "",
          coverImage: project.coverImage ?? "",
          featured: project.featured,
          position: project.position,
          status: project.status,
        }}
      />
    </div>
  );
}
