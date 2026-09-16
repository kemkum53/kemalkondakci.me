"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import ProjectRowActions from "./ProjectRowActions";
import { categoryLabel } from "@/lib/categories";
import { reorderProjects } from "@/app/admin/projects/actions";
import { useRowDragSort } from "./useRowDragSort";

export type AdminProject = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  featured: boolean;
  updatedAt: string;
};

export default function ProjectsTable({ projects }: { projects: AdminProject[] }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const filtering = query.trim().length > 0;

  const { order, rowProps } = useRowDragSort<AdminProject>(projects, !filtering, (ids) => {
    setError("");
    startTransition(async () => {
      const res = await reorderProjects(ids);
      if (res.error) setError(res.error);
    });
  });

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return order;
    return order.filter(
      (p) =>
        p.name.toLocaleLowerCase("tr").includes(q) ||
        p.slug.toLocaleLowerCase("tr").includes(q)
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
          placeholder="Proje ara…"
          className="rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--purple)] sm:w-64"
        />
      </div>

      {error && (
        <p className="mb-3 text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-[var(--muted)] py-8 text-center">Eşleşen proje yok.</p>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] text-sm text-[var(--muted)]">
              <tr>
                <th className="px-2 py-3 font-medium w-8" aria-label="Sürükle" />
                <th className="px-4 py-3 font-medium">Proje</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Alan</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Öne çıkan</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const drag = rowProps(p.id);
                return (
                  <tr
                    key={p.id}
                    {...drag}
                    className={`border-t border-[var(--border)] transition-opacity ${
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
                        href={`/admin/projects/${p.id}`}
                        className="text-[var(--text)] hover:text-[var(--purple)] font-medium"
                        draggable={false}
                      >
                        {p.name || "(adsız)"}
                      </Link>
                      <div className="text-xs text-[var(--muted)] mt-0.5">/{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] hidden md:table-cell">
                      {categoryLabel(p.category, "tr")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
                          p.status === "published"
                            ? "border-[var(--cyan)] text-[var(--cyan)]"
                            : "border-[var(--border)] text-[var(--muted)]"
                        }`}
                      >
                        {p.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)] hidden sm:table-cell">
                      {p.featured ? "★" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <ProjectRowActions id={p.id} status={p.status} slug={p.slug} name={p.name} />
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
