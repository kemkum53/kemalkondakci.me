"use client";

import { useActionState, useState } from "react";
import FlagIcon from "@/components/FlagIcon";
import RichTextEditor from "./Editor";
import GalleryEditor, { type GalleryItem } from "./GalleryEditor";
import { saveProject, type ProjectFormState } from "@/app/admin/projects/actions";
import { uploadImage } from "@/app/admin/posts/actions";
import { CATEGORY_LABELS, WORK_CATEGORIES } from "@/lib/categories";

export type ProjectFormData = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  shortDescTr?: string;
  shortDescEn?: string;
  contentTr?: string;
  contentEn?: string;
  clientName?: string;
  roleTr?: string;
  roleEn?: string;
  resultsTr?: string[];
  resultsEn?: string[];
  gallery?: GalleryItem[];
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

      <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
        <div>
          <label className={labelClass} htmlFor="name">Proje adı</label>
          <input id="name" name="name" defaultValue={project?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">Çalışma alanı</label>
          <select
            id="category"
            name="category"
            defaultValue={project?.category ?? "other"}
            className={inputClass}
          >
            {WORK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS.tr[c]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Proje bu alanın vitrin sayfasında görünür.
          </p>
        </div>
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
            <span className="inline-flex items-center gap-1.5">
              <FlagIcon country={lang === "tr" ? "tr" : "gb"} />
              {lang === "tr" ? "Türkçe" : "English"}
            </span>
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

      {/* Vitrin alanları: rol ve sonuç maddeleri, aktif dile göre */}
      <div className={activeLang === "tr" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="roleTr">Benim rolüm (TR)</label>
        <input
          id="roleTr"
          name="roleTr"
          defaultValue={project?.roleTr}
          placeholder="Tasarım, geliştirme, sunucu kurulumu"
          className={inputClass}
        />
      </div>
      <div className={activeLang === "en" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="roleEn">My role (EN)</label>
        <input
          id="roleEn"
          name="roleEn"
          defaultValue={project?.roleEn}
          placeholder="Design, development, hosting"
          className={inputClass}
        />
      </div>

      <div className={activeLang === "tr" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="resultsTr">
          Sonuç maddeleri (TR), her satır bir madde
        </label>
        <textarea
          id="resultsTr"
          name="resultsTr"
          defaultValue={project?.resultsTr?.join("\n")}
          rows={4}
          placeholder={"Sayfa açılışı 4.1 sn yerine 0.9 sn\nAylık sipariş 3 kat arttı"}
          className={inputClass}
        />
      </div>
      <div className={activeLang === "en" ? "" : "hidden"}>
        <label className={labelClass} htmlFor="resultsEn">
          Outcome bullets (EN), one per line
        </label>
        <textarea
          id="resultsEn"
          name="resultsEn"
          defaultValue={project?.resultsEn?.join("\n")}
          rows={4}
          className={inputClass}
        />
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

      {/* Vitrin galerisi */}
      <div className="pt-2 border-t border-[var(--border)]">
        <label className={labelClass}>Vitrin galerisi</label>
        <GalleryEditor name="gallery" initial={project?.gallery ?? []} />
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
          <label className={labelClass} htmlFor="clientName">Müşteri adı (boş bırakılabilir)</label>
          <input
            id="clientName"
            name="clientName"
            defaultValue={project?.clientName}
            placeholder="Korede"
            className={inputClass}
          />
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
