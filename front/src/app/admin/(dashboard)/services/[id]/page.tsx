import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/services";
import { requireAuth } from "@/lib/session";
import ServiceForm from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Hizmeti düzenle</h1>
      <ServiceForm
        service={{
          id: service.id,
          slug: service.slug,
          category: service.category,
          icon: service.icon,
          nameTr: service.nameTr,
          nameEn: service.nameEn,
          shortDescTr: service.shortDescTr,
          shortDescEn: service.shortDescEn,
          featuresTr: service.featuresTr,
          featuresEn: service.featuresEn,
          priceType: service.priceType,
          setupPriceMin: service.setupPriceMin,
          setupPriceMax: service.setupPriceMax,
          monthlyPrice: service.monthlyPrice,
          currency: service.currency,
          priceNoteTr: service.priceNoteTr,
          priceNoteEn: service.priceNoteEn,
          deliveryMinDays: service.deliveryMinDays,
          deliveryMaxDays: service.deliveryMaxDays,
          deliveryNoteTr: service.deliveryNoteTr,
          deliveryNoteEn: service.deliveryNoteEn,
          references: service.references,
          tags: service.tags,
          featured: service.featured,
          position: service.position,
          status: service.status,
        }}
      />
    </div>
  );
}
