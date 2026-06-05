import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { requireAuth } from "@/lib/session";
import PostsTable, { type AdminPost } from "@/components/admin/PostsTable";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  // Veri çekmeden önce auth (sızıntıyı önlemek için sayfa seviyesinde de doğrula).
  await requireAuth();
  const posts = await getAllPosts();

  const rows: AdminPost[] = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleTr: p.titleTr,
    titleEn: p.titleEn,
    status: p.status,
    updatedAt: p.updatedAt,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-[var(--text)]">Yazılar</h1>
        <Link href="/admin/posts/new" className="ktn-btn">
          + Yeni yazı
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-[var(--muted)]">
          Henüz yazı yok. İlk yazını oluşturmak için “Yeni yazı”ya tıkla.
        </p>
      ) : (
        <PostsTable posts={rows} />
      )}
    </div>
  );
}
