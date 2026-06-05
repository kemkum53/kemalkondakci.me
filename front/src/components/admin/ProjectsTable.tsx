"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProjectRowActions from "./ProjectRowActions";

export type AdminProject = {
  id: string;
  slug: string;
  name: string;
  status: string;
  featured: boolean;
  updatedAt: string;
};

export default function ProjectsTable({ projects }: { projects: AdminProject[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLocaleLowerCase("tr").includes(q) ||
        p.slug.toLocaleLowerCase("tr").includes(q)
    );
  }, [projects, query]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Proje ara…"
          className="rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--purple)] sm:w-64"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--muted)] py-8 text-center">Eşleşen proje yok.</p>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] text-sm text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Proje</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Öne çıkan</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-[var(--text)] hover:text-[var(--purple)] font-medium"
                    >
                      {p.name || "(adsız)"}
                    </Link>
                    <div className="text-xs text-[var(--muted)] mt-0.5">/{p.slug}</div>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
