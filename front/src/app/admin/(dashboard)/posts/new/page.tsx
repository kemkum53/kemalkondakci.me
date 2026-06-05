import PostForm from "@/components/admin/PostForm";
import { requireAuth } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireAuth();
  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-6">Yeni yazı</h1>
      <PostForm />
    </div>
  );
}
