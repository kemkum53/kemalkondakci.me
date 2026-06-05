"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost, togglePublish } from "@/app/admin/posts/actions";

export default function PostRowActions({
  id,
  status,
  slug,
  title,
}: {
  id: string;
  status: string;
  slug: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();

  const onToggle = () => startTransition(() => togglePublish(id));
  const onDelete = () => {
    if (window.confirm(`"${title}" yazısını silmek istediğine emin misin?`)) {
      startTransition(() => deletePost(id));
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {status === "published" ? (
        <a
          href={`/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--muted)] hover:text-[var(--text)]"
        >
          Görüntüle
        </a>
      ) : (
        <Link
          href={`/admin/posts/${id}/preview`}
          className="text-[var(--muted)] hover:text-[var(--text)]"
        >
          Önizle
        </Link>
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className="text-[var(--cyan)] hover:underline disabled:opacity-50"
      >
        {status === "published" ? "Taslağa al" : "Yayınla"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="text-[var(--red)] hover:underline disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
