import Link from "next/link";
import { getAllServices } from "@/lib/services";
import { requireAuth } from "@/lib/session";
import ServicesTable, { type AdminService } from "@/components/admin/ServicesTable";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  await requireAuth();
  const services = await getAllServices();

  const rows: AdminService[] = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.nameTr,
    icon: s.icon,
    category: s.category,
    status: s.status,
    featured: s.featured,
    priceType: s.priceType,
    setupPriceMin: s.setupPriceMin,
    setupPriceMax: s.setupPriceMax,
    monthlyPrice: s.monthlyPrice,
    currency: s.currency,
    deliveryMinDays: s.deliveryMinDays,
    deliveryMaxDays: s.deliveryMaxDays,
    deliveryNoteTr: s.deliveryNoteTr,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-[var(--text)]">Hizmetler</h1>
        <Link href="/admin/services/new" className="ktn-btn">
          + Yeni hizmet
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-[var(--muted)]">
          Henüz hizmet yok. İlk hizmetini eklemek için “Yeni hizmet”e tıkla.
        </p>
      ) : (
        <ServicesTable services={rows} />
      )}
    </div>
  );
}
