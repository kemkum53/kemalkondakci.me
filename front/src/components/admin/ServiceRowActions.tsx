"use client";

import { useState, useTransition } from "react";
import { deleteService, toggleServicePublish } from "@/app/admin/services/actions";

export default function ServiceRowActions({
  id,
  status,
  name,
}: {
  id: string;
  status: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  // Tarayıcı onay kutusu yerine satır içi iki adımlı onay.
  const [confirming, setConfirming] = useState(false);

  const onToggle = () => startTransition(() => toggleServicePublish(id));

  if (confirming) {
    return (
      <div className="flex items-center gap-3 text-sm whitespace-nowrap">
        <span className="text-[var(--muted)]">
          <span className="text-[var(--text)]">{name || "Bu hizmet"}</span> silinsin mi?
        </span>
        <button
          type="button"
          onClick={() => startTransition(() => deleteService(id))}
          disabled={pending}
          className="text-[var(--red)] font-medium hover:underline disabled:opacity-50"
        >
          Evet, sil
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-50"
        >
          Vazgeç
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm whitespace-nowrap">
      {status === "published" && (
        <a
          href="/services"
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
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="text-[var(--red)] hover:underline disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
