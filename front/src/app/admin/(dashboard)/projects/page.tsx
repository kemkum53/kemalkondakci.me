import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { requireAuth } from "@/lib/session";
import ProjectsTable, { type AdminProject } from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjects() {
  await requireAuth();
  const projects = await getAllProjects();

  const rows: AdminProject[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    status: p.status,
    featured: p.featured,
    updatedAt: p.updatedAt,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-[var(--text)]">Projeler</h1>
        <Link href="/admin/projects/new" className="ktn-btn">
          + Yeni proje
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-[var(--muted)]">
          Henüz proje yok. İlk projeni eklemek için “Yeni proje”ye tıkla.
        </p>
      ) : (
        <ProjectsTable projects={rows} />
      )}
    </div>
  );
}
