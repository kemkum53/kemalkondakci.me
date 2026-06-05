import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { requireAuth } from "@/lib/session";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Yazıyı düzenle</h1>
      <PostForm
        post={{
          id: post.id,
          slug: post.slug,
          titleTr: post.titleTr,
          titleEn: post.titleEn,
          excerptTr: post.excerptTr ?? "",
          excerptEn: post.excerptEn ?? "",
          contentTr: post.contentTr,
          contentEn: post.contentEn,
          coverImage: post.coverImage ?? "",
          status: post.status,
        }}
      />
    </div>
  );
}
