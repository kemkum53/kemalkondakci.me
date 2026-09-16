"use client";

import { useActionState, useState } from "react";
import { saveService, type ServiceFormState } from "@/app/admin/services/actions";
import {
  CATEGORY_LABELS,
  SERVICE_CATEGORIES,
  formatDelivery,
} from "@/lib/service-format";

export type ServiceFormData = {
  id?: string;
  slug?: string;
  category?: string;
  icon?: string;
  nameTr?: string;
  nameEn?: string;
  shortDescTr?: string;
  shortDescEn?: string;
  featuresTr?: string[];
  featuresEn?: string[];
  deliveryMinDays?: number | null;
  deliveryMaxDays?: number | null;
  deliveryNoteTr?: string;
  deliveryNoteEn?: string;
  references?: { label: string; url: string }[];
  tags?: string[];
  featured?: boolean;
  position?: number;
  status?: string;
};

const initialState: ServiceFormState = {};

const inputClass =
  "w-full rounded-lg bg-[var(--bg)] border-2 border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]";
const labelClass = "block text-sm font-medium text-[var(--text)] mb-1";
const hintClass = "text-xs text-[var(--muted)] mt-1";

/** Sayısal alanın boş kalabilmesi için değer state'te string tutulur. */
function toInput(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}

function parseAmount(v: string): number | null {
  const trimmed = v.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export default function ServiceForm({ service }: { service?: ServiceFormData }) {
  const [state, formAction, pending] = useActionState(saveService, initialState);
  const [activeLang, setActiveLang] = useState<"tr" | "en">("tr");

  const [minDays, setMinDays] = useState(toInput(service?.deliveryMinDays));
  const [maxDays, setMaxDays] = useState(toInput(service?.deliveryMaxDays));
  const [deliveryNoteTr, setDeliveryNoteTr] = useState(service?.deliveryNoteTr ?? "");

  // Sayfada nasıl görüneceğinin canlı önizlemesi (Türkçe).
  const previewDelivery = formatDelivery(
    {
      deliveryMinDays: parseAmount(minDays),
      deliveryMaxDays: parseAmount(maxDays),
      deliveryNoteTr,
      deliveryNoteEn: "",
    },
    "tr"
  );

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {service?.id && <input type="hidden" name="id" value={service.id} />}

      {/* --- Kimlik --- */}
      <div className="grid sm:grid-cols-[5rem_1fr] gap-4">
        <div>
          <label className={labelClass} htmlFor="icon">
            İkon
          </label>
          <input
            id="icon"
            name="icon"
            defaultValue={service?.icon}
            placeholder="🛒"
            maxLength={16}
            className={`${inputClass} text-center text-xl`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={service?.category ?? "web"}
            className={inputClass}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS.tr[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Dil sekmeleri --- */}
      <div className="flex gap-2">
        {(["tr", "en"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
              activeLang === lang
                ? "bg-[var(--purple)] text-white border-[var(--purple)]"
                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]"
            }`}
          >
            {lang === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"}
          </button>
        ))}
      </div>

      {/* TR alanları */}
      <div className={`space-y-4 ${activeLang === "tr" ? "" : "hidden"}`}>
        <div>
          <label className={labelClass} htmlFor="nameTr">
            Hizmet adı (TR)
          </label>
          <input id="nameTr" name="nameTr" defaultValue={service?.nameTr} className={inputClass} />
          <p className={hintClass}>Zorunlu. Örn: Satış altyapılı web sitesi</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="shortDescTr">
            Kısa açıklama (TR)
          </label>
          <textarea
            id="shortDescTr"
            name="shortDescTr"
            defaultValue={service?.shortDescTr}
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="featuresTr">
            Kapsam maddeleri (TR)
          </label>
          <textarea
            id="featuresTr"
            name="featuresTr"
            defaultValue={service?.featuresTr?.join("\n")}
            rows={6}
            placeholder={"Ürün kataloğu ve sepet\nSanal POS entegrasyonu\nYönetim paneli"}
            className={inputClass}
          />
          <p className={hintClass}>Her satır bir madde olur.</p>
        </div>
      </div>

      {/* EN alanları */}
      <div className={`space-y-4 ${activeLang === "en" ? "" : "hidden"}`}>
        <div>
          <label className={labelClass} htmlFor="nameEn">
            Service name (EN)
          </label>
          <input id="nameEn" name="nameEn" defaultValue={service?.nameEn} className={inputClass} />
          <p className={hintClass}>Boş bırakılırsa İngilizce sayfada Türkçe ad görünür.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="shortDescEn">
            Short description (EN)
          </label>
          <textarea
            id="shortDescEn"
            name="shortDescEn"
            defaultValue={service?.shortDescEn}
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="featuresEn">
            What is included (EN)
          </label>
          <textarea
            id="featuresEn"
            name="featuresEn"
            defaultValue={service?.featuresEn?.join("\n")}
            rows={6}
            placeholder={"Product catalog and cart\nPayment gateway integration\nAdmin panel"}
            className={inputClass}
          />
          <p className={hintClass}>One item per line.</p>
        </div>
      </div>

      {/* --- Teslim süresi --- */}
      <fieldset className="border-2 border-[var(--border)] rounded-xl p-4 space-y-4">
        <legend className="px-2 text-sm font-semibold text-[var(--cyan)]">Teslim süresi</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="deliveryMinDays">
              En az (gün)
            </label>
            <input
              id="deliveryMinDays"
              name="deliveryMinDays"
              type="number"
              min={0}
              value={minDays}
              onChange={(e) => setMinDays(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="deliveryMaxDays">
              En çok (gün)
            </label>
            <input
              id="deliveryMaxDays"
              name="deliveryMaxDays"
              type="number"
              min={0}
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2 rounded-lg bg-[var(--bg)] border-2 border-[var(--border)] px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              Sayfada böyle görünecek
            </div>
            <div className="text-sm text-[var(--text)]">
              {previewDelivery ? `Teslim: ${previewDelivery}` : "Teslim süresi girilmedi"}
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="deliveryNoteTr">
              Süre notu (TR)
            </label>
            <input
              id="deliveryNoteTr"
              name="deliveryNoteTr"
              value={deliveryNoteTr}
              onChange={(e) => setDeliveryNoteTr(e.target.value)}
              placeholder="içerik hazırsa"
              maxLength={255}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="deliveryNoteEn">
              Duration note (EN)
            </label>
            <input
              id="deliveryNoteEn"
              name="deliveryNoteEn"
              defaultValue={service?.deliveryNoteEn}
              placeholder="if content is ready"
              maxLength={255}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* --- Referans, etiket, yayın --- */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t-2 border-[var(--border)]">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="references">
            Referans siteler
          </label>
          <textarea
            id="references"
            name="references"
            defaultValue={service?.references
              ?.map((r) => (r.label ? `${r.label} | ${r.url}` : r.url))
              .join("\n")}
            rows={3}
            placeholder={"https://korede.com.tr\nEvrensel Yapı | https://evrenselyapi.com.tr"}
            className={inputClass}
          />
          <p className={hintClass}>
            Her satır bir referans. Sadece link yazarsan etiket alan adından üretilir; başka bir ad
            istersen “Etiket | https://...” biçiminde yaz. En fazla 6 tane.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="tags">
            Etiketler (virgülle ayır)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={service?.tags?.join(", ")}
            placeholder="Next.js, PostgreSQL, Sanal POS"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">
            Slug (boş → otomatik)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={service?.slug}
            placeholder="satis-altyapili-web-sitesi"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="position">
            Sıra (küçük üstte)
          </label>
          <input
            id="position"
            name="position"
            type="number"
            defaultValue={service?.position ?? 0}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={service?.featured}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm text-[var(--text)]">
            Öne çıkan
          </label>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Durum
          </label>
          <select
            id="status"
            name="status"
            defaultValue={service?.status ?? "draft"}
            className={inputClass}
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-[var(--red)]" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="ktn-btn disabled:opacity-50">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <a href="/admin/services" className="ktn-btn ktn-btn--ghost">
          İptal
        </a>
      </div>
    </form>
  );
}
