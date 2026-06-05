"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import RichTextEditor from "./Editor";
import {
  savePost,
  autosaveDraft,
  uploadImage,
  type PostFormState,
} from "@/app/admin/posts/actions";

export type PostFormData = {
  id?: string;
  slug?: string;
  titleTr?: string;
  titleEn?: string;
  excerptTr?: string;
  excerptEn?: string;
  contentTr?: string;
  contentEn?: string;
  coverImage?: string;
  status?: string;
};

const initialState: PostFormState = {};
const AUTOSAVE_DELAY = 2500;

export default function PostForm({ post }: { post?: PostFormData }) {
  const [state, formAction, pending] = useActionState(savePost, initialState);
  const [activeLang, setActiveLang] = useState<"tr" | "en">("tr");
  const [contentTr, setContentTr] = useState(post?.contentTr ?? "");
  const [contentEn, setContentEn] = useState(post?.contentEn ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);

  // Autosave durumu
  const [postId, setPostId] = useState(post?.id);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef({ tr: contentTr, en: contentEn });
  contentRef.current = { tr: contentTr, en: contentEn };
  const coverRef = useRef(coverImage);
  coverRef.current = coverImage;
  const postIdRef = useRef(postId);
  postIdRef.current = postId;
  const inFlightRef = useRef(false);

  const runAutosave = useCallback(async () => {
    const form = formRef.current;
    if (!form || inFlightRef.current) return;

    const titleTr = (form.elements.namedItem("titleTr") as HTMLInputElement)?.value ?? "";
    const titleEn = (form.elements.namedItem("titleEn") as HTMLInputElement)?.value ?? "";
    const { tr, en } = contentRef.current;

    // Boş yazı için taslak oluşturma.
    const hasContent =
      titleTr.trim() || titleEn.trim() || tr.replace(/<[^>]*>/g, "").trim() || en.replace(/<[^>]*>/g, "").trim();
    if (!hasContent) return;

    inFlightRef.current = true;
    setSaveState("saving");
    try {
      const res = await autosaveDraft({
        id: postIdRef.current,
        titleTr,
        titleEn,
        excerptTr: (form.elements.namedItem("excerptTr") as HTMLTextAreaElement)?.value ?? "",
        excerptEn: (form.elements.namedItem("excerptEn") as HTMLTextAreaElement)?.value ?? "",
        contentTr: tr,
        contentEn: en,
        coverImage: coverRef.current,
        slug: (form.elements.namedItem("slug") as HTMLInputElement)?.value ?? "",
      });
      if (!postIdRef.current) setPostId(res.id);
      setSavedAt(res.savedAt);
      setSaveState("saved");
    } catch {
      setSaveState("idle");
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const scheduleAutosave = useCallback(() => {
    setSaveState("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(runAutosave, AUTOSAVE_DELAY);
  }, [runAutosave]);

  const inputClass =
    "w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]";
  const labelClass = "block text-sm font-medium text-[var(--text)] mb-1";

  const savedTime = savedAt
    ? new Date(savedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <form ref={formRef} action={formAction} onInput={scheduleAutosave} className="space-y-6 max-w-3xl">
      {postId && <input type="hidden" name="id" value={postId} />}
      <input type="hidden" name="contentTr" value={contentTr} />
      <input type="hidden" name="contentEn" value={contentEn} />

      {/* Dil sekmeleri + autosave göstergesi */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {(["tr", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeLang === lang
                  ? "bg-[var(--purple)] text-white border-[var(--purple)]"
                  : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]"
              }`}
            >
              {lang === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"}
            </button>
          ))}
        </div>
        <span className="text-xs text-[var(--muted)]" aria-live="polite">
          {saveState === "saving" && "Kaydediliyor…"}
          {saveState === "saved" && savedTime && `Otomatik kaydedildi ${savedTime}`}
        </span>
      </div>

      {/* TR başlık/özet */}
      <div className={activeLang === "tr" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="titleTr">Başlık (TR)</label>
          <input id="titleTr" name="titleTr" defaultValue={post?.titleTr} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="excerptTr">Özet (TR)</label>
          <textarea id="excerptTr" name="excerptTr" defaultValue={post?.excerptTr} rows={2} className={inputClass} />
        </div>
      </div>

      {/* EN başlık/özet */}
      <div className={activeLang === "en" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="titleEn">Title (EN)</label>
          <input id="titleEn" name="titleEn" defaultValue={post?.titleEn} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="excerptEn">Excerpt (EN)</label>
          <textarea id="excerptEn" name="excerptEn" defaultValue={post?.excerptEn} rows={2} className={inputClass} />
        </div>
      </div>

      {/* İçerik editörü — tek örnek, aktif dile göre içerik değişir */}
      <div>
        <label className={labelClass}>
          İçerik ({activeLang === "tr" ? "Türkçe" : "English"})
        </label>
        <RichTextEditor
          value={activeLang === "tr" ? contentTr : contentEn}
          onChange={(html) => {
            if (activeLang === "tr") setContentTr(html);
            else setContentEn(html);
            scheduleAutosave();
          }}
        />
      </div>

      {/* Ortak alanlar */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
        <div>
          <label className={labelClass} htmlFor="slug">Slug (boş bırakılırsa otomatik)</label>
          <input id="slug" name="slug" defaultValue={post?.slug} placeholder="ornek-yazi-basligi" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="coverImage">Kapak görseli (opsiyonel)</label>
          <div className="flex gap-2">
            <input
              id="coverImage"
              name="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/media/kapak.jpg veya URL"
              className={inputClass}
            />
            <label className="ktn-btn ktn-btn--ghost shrink-0 cursor-pointer whitespace-nowrap">
              {coverUploading ? "…" : "Yükle"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={coverUploading}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  setCoverUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append("file", f);
                    const location = await uploadImage(fd);
                    setCoverImage(location);
                    scheduleAutosave();
                  } catch {
                    alert("Kapak görseli yüklenemedi.");
                  } finally {
                    setCoverUploading(false);
                  }
                }}
              />
            </label>
          </div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="kapak önizleme" className="mt-2 h-20 rounded border border-[var(--border)] object-cover" />
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Durum</label>
          <select id="status" name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-[var(--red)]" role="alert">{state.error}</p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <button type="submit" disabled={pending} className="ktn-btn disabled:opacity-50">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {postId && (
          <a href={`/admin/posts/${postId}/preview`} target="_blank" rel="noopener noreferrer" className="ktn-btn ktn-btn--ghost">
            Önizle
          </a>
        )}
        <a href="/admin" className="ktn-btn ktn-btn--ghost">İptal</a>
      </div>
    </form>
  );
}
