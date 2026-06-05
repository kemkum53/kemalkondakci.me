"use client";

import { useTransition } from "react";
import { deleteProject, toggleProjectPublish } from "@/app/admin/projects/actions";

export default function ProjectRowActions({
  id,
  status,
  slug,
  name,
}: {
  id: string;
  status: string;
  slug: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  const onToggle = () => startTransition(() => toggleProjectPublish(id));
  const onDelete = () => {
    if (window.confirm(`"${name}" projesini silmek istediğine emin misin?`)) {
      startTransition(() => deleteProject(id));
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {status === "published" && (
        <a
          href={`/projects/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--muted)] hover:text-[var(--text)]"
        >
          Görüntüle
        </a>
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
