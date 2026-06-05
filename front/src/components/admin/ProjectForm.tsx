"use client";

import { useActionState, useState } from "react";
import RichTextEditor from "./Editor";
import { saveProject, type ProjectFormState } from "@/app/admin/projects/actions";
import { uploadImage } from "@/app/admin/posts/actions";

export type ProjectFormData = {
  id?: string;
  slug?: string;
  name?: string;
  shortDescTr?: string;
  shortDescEn?: string;
  contentTr?: string;
  contentEn?: string;
  techStack?: string[];
  repoUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  featured?: boolean;
  position?: number;
  status?: string;
};

const initialState: ProjectFormState = {};

export default function ProjectForm({ project }: { project?: ProjectFormData }) {
  const [state, formAction, pending] = useActionState(saveProject, initialState);
  const [activeLang, setActiveLang] = useState<"tr" | "en">("tr");
  const [contentTr, setContentTr] = useState(project?.contentTr ?? "");
  const [contentEn, setContentEn] = useState(project?.contentEn ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);

  const inputClass =
    "w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]";
  const labelClass = "block text-sm font-medium text-[var(--text)] mb-1";

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="contentTr" value={contentTr} />
      <input type="hidden" name="contentEn" value={contentEn} />

      <div>
        <label className={labelClass} htmlFor="name">Proje adı</label>
        <input id="name" name="name" defaultValue={project?.name} className={inputClass} />
      </div>

      {/* Dil sekmeleri */}
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

      {/* TR kısa açıklama */}
      <div className={activeLang === "tr" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="shortDescTr">Kısa açıklama (TR) — kartta görünür</label>
        <textarea id="shortDescTr" name="shortDescTr" defaultValue={project?.shortDescTr} rows={2} className={inputClass} />
      </div>
      <div className={activeLang === "en" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="shortDescEn">Short description (EN) — shown on card</label>
        <textarea id="shortDescEn" name="shortDescEn" defaultValue={project?.shortDescEn} rows={2} className={inputClass} />
      </div>

      {/* Detay içeriği (tek editör, aktif dile göre) */}
      <div>
        <label className={labelClass}>
          Detay içeriği ({activeLang === "tr" ? "Türkçe" : "English"})
        </label>
        <RichTextEditor
          value={activeLang === "tr" ? contentTr : contentEn}
          onChange={(html) => (activeLang === "tr" ? setContentTr(html) : setContentEn(html))}
        />
      </div>

      {/* Teknolojiler + linkler */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="techStack">Teknolojiler (virgülle ayır)</label>
          <input
            id="techStack"
            name="techStack"
            defaultValue={project?.techStack?.join(", ")}
            placeholder="Python, FastAPI, Next.js"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="repoUrl">GitHub / repo linki</label>
          <input id="repoUrl" name="repoUrl" defaultValue={project?.repoUrl} placeholder="https://github.com/..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="liveUrl">Canlı demo linki</label>
          <input id="liveUrl" name="liveUrl" defaultValue={project?.liveUrl} placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">Slug (boş → otomatik)</label>
          <input id="slug" name="slug" defaultValue={project?.slug} placeholder="proje-adi" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="position">Sıra (küçük üstte)</label>
          <input id="position" name="position" type="number" defaultValue={project?.position ?? 0} className={inputClass} />
        </div>

        {/* Kapak / ekran görüntüsü */}
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="coverImage">Ekran görüntüsü / kapak</label>
          <div className="flex gap-2">
            <input
              id="coverImage"
              name="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/api/media/... veya URL"
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
                    setCoverImage(await uploadImage(fd));
                  } catch {
                    alert("Görsel yüklenemedi.");
                  } finally {
                    setCoverUploading(false);
                  }
                }}
              />
            </label>
          </div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="kapak önizleme" className="mt-2 h-24 rounded border border-[var(--border)] object-cover" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input id="featured" name="featured" type="checkbox" defaultChecked={project?.featured} className="h-4 w-4" />
          <label htmlFor="featured" className="text-sm text-[var(--text)]">Öne çıkan</label>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Durum</label>
          <select id="status" name="status" defaultValue={project?.status ?? "draft"} className={inputClass}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      {state.error && <p className="text-sm text-[var(--red)]" role="alert">{state.error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="ktn-btn disabled:opacity-50">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <a href="/admin/projects" className="ktn-btn ktn-btn--ghost">İptal</a>
      </div>
    </form>
  );
}
