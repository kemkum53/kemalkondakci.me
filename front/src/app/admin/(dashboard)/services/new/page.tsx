import ServiceForm from "@/components/admin/ServiceForm";
import { requireAuth } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireAuth();
  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Yeni hizmet</h1>
      <ServiceForm />
    </div>
  );
}
