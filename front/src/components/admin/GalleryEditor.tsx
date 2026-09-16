"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/posts/actions";

export type GalleryItem = {
  url: string;
  captionTr: string;
  captionEn: string;
};

const MAX_IMAGES = 12;

const inputClass =
  "w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]";

export default function GalleryEditor({
  name,
  initial,
}: {
  name: string;
  initial: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const urlRef = useRef<HTMLInputElement>(null);

  const full = items.length >= MAX_IMAGES;

  function update(index: number, patch: Partial<GalleryItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    setItems((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addUrl() {
    const value = urlRef.current?.value.trim() ?? "";
    if (!value) return;
    if (!/^(\/|https?:\/\/)/.test(value)) {
      setError("Adres / veya http(s):// ile başlamalı.");
      return;
    }
    setError("");
    setItems((prev) => [...prev, { url: value, captionTr: "", captionEn: "" }].slice(0, MAX_IMAGES));
    if (urlRef.current) urlRef.current.value = "";
  }

  async function addFiles(files: FileList) {
    setUploading(true);
    setError("");
    const uploaded: GalleryItem[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        uploaded.push({ url: await uploadImage(fd), captionTr: "", captionEn: "" });
      }
      setItems((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
    } catch {
      setError(
        uploaded.length > 0
          ? `${uploaded.length} görsel yüklendi, kalanı yüklenemedi.`
          : "Görsel yüklenemedi."
      );
      if (uploaded.length > 0) {
        setItems((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`ktn-btn ktn-btn--ghost shrink-0 whitespace-nowrap ${
            full || uploading ? "opacity-50" : "cursor-pointer"
          }`}
        >
          {uploading ? "Yükleniyor…" : "Görsel ekle"}
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={uploading || full}
            onChange={async (e) => {
              const files = e.target.files;
              e.target.value = "";
              if (files && files.length > 0) await addFiles(files);
            }}
          />
        </label>
        <input
          ref={urlRef}
          type="text"
          placeholder="veya adres yapıştır: /api/media/... "
          className={`${inputClass} flex-1 min-w-[14rem]`}
          disabled={full}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={full}
          className="ktn-btn ktn-btn--ghost shrink-0 disabled:opacity-50"
        >
          Ekle
        </button>
        <span className="text-xs text-[var(--muted)]">
          {items.length}/{MAX_IMAGES}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Henüz görsel yok. Vitrin sayfasında galeri bu görsellerden oluşur.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item, i) => (
            <li
              key={`${item.url}-${i}`}
              className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.captionTr || `görsel ${i + 1}`}
                className="h-20 w-28 shrink-0 rounded border border-[var(--border)] object-cover"
              />
              <div className="flex-1 space-y-2">
                <input
                  value={item.captionTr}
                  onChange={(e) => update(i, { captionTr: e.target.value })}
                  placeholder="Başlık (TR)"
                  className={inputClass}
                />
                <input
                  value={item.captionEn}
                  onChange={(e) => update(i, { captionEn: e.target.value })}
                  placeholder="Caption (EN)"
                  className={inputClass}
                />
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Yukarı taşı"
                  className="ktn-btn ktn-btn--ghost px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Aşağı taşı"
                  className="ktn-btn ktn-btn--ghost px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Görseli çıkar"
                  className="ktn-btn ktn-btn--ghost px-2 py-1 text-xs text-[var(--red)]"
                >
                  Çıkar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
