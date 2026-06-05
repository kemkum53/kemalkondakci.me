"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PostRowActions from "./PostRowActions";

export type AdminPost = {
  id: string;
  slug: string;
  titleTr: string;
  titleEn: string;
  status: string;
  updatedAt: string; // ISO
};

type Filter = "all" | "published" | "draft";

export default function PostsTable({ posts }: { posts: AdminPost[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return posts.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.titleTr.toLocaleLowerCase("tr").includes(q) ||
        p.titleEn.toLocaleLowerCase("tr").includes(q) ||
        p.slug.toLocaleLowerCase("tr").includes(q)
      );
    });
  }, [posts, query, filter]);

  const filterBtn = (key: Filter, label: string) => (
    <button
      type="button"
      onClick={() => setFilter(key)}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        filter === key
          ? "bg-[var(--purple)] text-white border-[var(--purple)]"
          : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]"
      }`}
    >
      {label} <span className="opacity-70">({counts[key]})</span>
    </button>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="flex gap-2">
          {filterBtn("all", "Tümü")}
          {filterBtn("published", "Yayında")}
          {filterBtn("draft", "Taslak")}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık veya slug ara…"
          className="rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--purple)] sm:w-64"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--muted)] py-8 text-center">
          Eşleşen yazı yok.
        </p>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] text-sm text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Güncelleme</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((post) => (
                <tr key={post.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-[var(--text)] hover:text-[var(--purple)] font-medium"
                    >
                      {post.titleTr || post.titleEn || "(başlıksız)"}
                    </Link>
                    <div className="text-xs text-[var(--muted)] mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
                        post.status === "published"
                          ? "border-[var(--cyan)] text-[var(--cyan)]"
                          : "border-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)] hidden sm:table-cell">
                    {new Date(post.updatedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <PostRowActions
                        id={post.id}
                        status={post.status}
                        slug={post.slug}
                        title={post.titleTr || post.titleEn}
                      />
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
