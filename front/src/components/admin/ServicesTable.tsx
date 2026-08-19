"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ServiceRowActions from "./ServiceRowActions";
import {
  CATEGORY_LABELS,
  formatDelivery,
  formatPrice,
  quoteLabel,
  type ServiceCategory,
} from "@/lib/service-format";

export type AdminService = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
  status: string;
  featured: boolean;
  priceType: string;
  setupPriceMin: number | null;
  setupPriceMax: number | null;
  monthlyPrice: number | null;
  currency: string;
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  deliveryNoteTr: string;
};

function categoryLabel(category: string): string {
  return CATEGORY_LABELS.tr[category as ServiceCategory] ?? CATEGORY_LABELS.tr.other;
}

/** Tabloda tek satıra sığacak kısa fiyat özeti. */
function priceSummary(s: AdminService): string {
  const p = formatPrice(s, "tr");
  if (p.isQuote) return quoteLabel("tr");
  const parts: string[] = [];
  if (p.setupValue) parts.push(p.setupValue);
  if (p.monthlyValue) parts.push(`+ ${p.monthlyValue}/ay`);
  return parts.join(" ");
}

export default function ServicesTable({ services }: { services: AdminService[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLocaleLowerCase("tr").includes(q) ||
        s.slug.toLocaleLowerCase("tr").includes(q) ||
        categoryLabel(s.category).toLocaleLowerCase("tr").includes(q)
    );
  }, [services, query]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hizmet ara…"
          className="rounded-lg bg-[var(--bg)] border-2 border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--purple)] sm:w-64"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--muted)] py-8 text-center">Eşleşen hizmet yok.</p>
      ) : (
        <div className="border-2 border-[var(--border)] rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] text-sm text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Hizmet</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Fiyat</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Süre</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id} className="border-t-2 border-[var(--border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/services/${s.id}`}
                      className="text-[var(--text)] hover:text-[var(--purple)] font-medium"
                    >
                      {s.icon && <span className="mr-1.5">{s.icon}</span>}
                      {s.name || "(adsız)"}
                      {s.featured && <span className="ml-1.5 text-[var(--cyan)]">★</span>}
                    </Link>
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      {categoryLabel(s.category)} · /{s.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text)] hidden md:table-cell">
                    {priceSummary(s)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)] hidden lg:table-cell">
                    {formatDelivery({ ...s, deliveryNoteEn: "" }, "tr") ?? "belirtilmedi"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full border-2 ${
                        s.status === "published"
                          ? "border-[var(--cyan)] text-[var(--cyan)]"
                          : "border-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {s.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <ServiceRowActions id={s.id} status={s.status} name={s.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
