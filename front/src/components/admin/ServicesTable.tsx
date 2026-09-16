"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import ServiceRowActions from "./ServiceRowActions";
import {
  CATEGORY_LABELS,
  formatDelivery,
  type ServiceCategory,
} from "@/lib/service-format";
import { reorderServices } from "@/app/admin/services/actions";
import { useRowDragSort } from "./useRowDragSort";

export type AdminService = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
  status: string;
  featured: boolean;
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  deliveryNoteTr: string;
};

function categoryLabel(category: string): string {
  return CATEGORY_LABELS.tr[category as ServiceCategory] ?? CATEGORY_LABELS.tr.other;
}

export default function ServicesTable({ services }: { services: AdminService[] }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const filtering = query.trim().length > 0;

  const { order, rowProps } = useRowDragSort<AdminService>(services, !filtering, (ids) => {
    setError("");
    startTransition(async () => {
      const res = await reorderServices(ids);
      if (res.error) setError(res.error);
    });
  });

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return order;
    return order.filter(
      (s) =>
        s.name.toLocaleLowerCase("tr").includes(q) ||
        s.slug.toLocaleLowerCase("tr").includes(q) ||
        categoryLabel(s.category).toLocaleLowerCase("tr").includes(q)
    );
  }, [order, query]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs text-[var(--muted)]">
          {filtering
            ? "Sıralamayı değiştirmek için aramayı temizle."
            : isPending
              ? "Sıra kaydediliyor…"
              : "Satırları sürükleyerek sırala. Sıra sitede de bu şekilde görünür."}
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hizmet ara…"
          className="rounded-lg bg-[var(--bg)] border-2 border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--purple)] sm:w-64"
        />
      </div>

      {error && (
        <p className="mb-3 text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-[var(--muted)] py-8 text-center">Eşleşen hizmet yok.</p>
      ) : (
        <div className="border-2 border-[var(--border)] rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] text-sm text-[var(--muted)]">
              <tr>
                <th className="px-2 py-3 font-medium w-8" aria-label="Sürükle" />
                <th className="px-4 py-3 font-medium">Hizmet</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Süre</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const drag = rowProps(s.id);
                return (
                  <tr
                    key={s.id}
                    {...drag}
                    className={`border-t-2 border-[var(--border)] transition-opacity ${
                      drag["data-dragging"] ? "opacity-40" : ""
                    }`}
                  >
                    <td className="px-2 py-3">
                      <span
                        className={`select-none text-[var(--muted)] ${
                          filtering ? "opacity-30" : "cursor-grab hover:text-[var(--text)]"
                        }`}
                        title={filtering ? "Aramayı temizle" : "Sürükle"}
                        aria-hidden="true"
                      >
                        ⠿
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="text-[var(--text)] hover:text-[var(--purple)] font-medium"
                        draggable={false}
                      >
                        {s.icon && <span className="mr-1.5">{s.icon}</span>}
                        {s.name || "(adsız)"}
                        {s.featured && <span className="ml-1.5 text-[var(--cyan)]">★</span>}
                      </Link>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        {categoryLabel(s.category)} · /{s.slug}
                      </div>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
