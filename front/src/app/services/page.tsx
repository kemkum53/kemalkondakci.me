import { getPublishedServices } from "@/lib/services";
import ServicesList, { type ServiceCard } from "@/components/services/ServicesList";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getPublishedServices();

  const cards: ServiceCard[] = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    category: s.category,
    icon: s.icon,
    nameTr: s.nameTr,
    nameEn: s.nameEn,
    shortDescTr: s.shortDescTr,
    shortDescEn: s.shortDescEn,
    featuresTr: s.featuresTr,
    featuresEn: s.featuresEn,
    deliveryMinDays: s.deliveryMinDays,
    deliveryMaxDays: s.deliveryMaxDays,
    deliveryNoteTr: s.deliveryNoteTr,
    deliveryNoteEn: s.deliveryNoteEn,
    references: s.references,
    tags: s.tags,
    featured: s.featured,
  }));

  return <ServicesList services={cards} />;
}
