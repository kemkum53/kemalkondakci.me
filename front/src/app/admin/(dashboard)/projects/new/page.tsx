import ProjectForm from "@/components/admin/ProjectForm";
import { requireAuth } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireAuth();
  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Yeni proje</h1>
      <ProjectForm />
    </div>
  );
}
