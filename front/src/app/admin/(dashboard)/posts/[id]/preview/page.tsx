import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { requireAuth } from "@/lib/session";
import BlogArticle, { type PostView } from "@/components/blog/BlogArticle";

export const dynamic = "force-dynamic";

export default async function PreviewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const view: PostView = {
    slug: post.slug,
    titleTr: post.titleTr,
    titleEn: post.titleEn,
    contentTr: post.contentTr,
    contentEn: post.contentEn,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
  };

  return (
    <div>
      {/* Önizleme uyarı şeridi */}
      <div className="ktn-scope mb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2">
          <span className="text-sm text-[var(--muted)]">
            Önizleme modu —{" "}
            <span className={post.status === "published" ? "text-[var(--cyan)]" : "text-[var(--purple)]"}>
              {post.status === "published" ? "Yayında" : "Taslak"}
            </span>
          </span>
          <div className="flex gap-3 text-sm">
            <Link href={`/admin/posts/${post.id}`} className="text-[var(--cyan)] hover:underline">
              ← Düzenlemeye dön
            </Link>
          </div>
        </div>
      </div>

      <BlogArticle post={view} />
    </div>
  );
}
