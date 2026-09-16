"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export interface ServiceFormState {
  error?: string;
}

function revalidateAll() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    // Pydantic doğrulama hatası: [{loc, msg, ...}] biçiminde gelir.
    if (Array.isArray(data?.detail)) {
      const first = data.detail[0];
      if (typeof first?.msg === "string") return first.msg.replace(/^Value error,\s*/, "");
    }
  } catch {
    /* yoksay */
  }
  return fallback;
}

/** "Satır 1\nSatır 2" → ["Satır 1", "Satır 2"] */
function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** "Etiket | https://site.com" veya sadece "https://site.com" satırlarını ayrıştırır. */
function parseReferences(value: FormDataEntryValue | null): { label: string; url: string }[] {
  return lines(value).map((line) => {
    const sep = line.lastIndexOf("|");
    if (sep === -1) return { label: "", url: line };
    return { label: line.slice(0, sep).trim(), url: line.slice(sep + 1).trim() };
  });
}

/** Boş string → null, aksi halde sayı. Geçersizse null. */
function num(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function saveService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const token = await getToken();
  if (!token) return { error: "Oturum süresi doldu. Tekrar giriş yap." };

  const id = String(formData.get("id") ?? "").trim();

  const payload = {
    category: String(formData.get("category") ?? "other"),
    icon: String(formData.get("icon") ?? ""),
    nameTr: String(formData.get("nameTr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    shortDescTr: String(formData.get("shortDescTr") ?? ""),
    shortDescEn: String(formData.get("shortDescEn") ?? ""),
    featuresTr: lines(formData.get("featuresTr")),
    featuresEn: lines(formData.get("featuresEn")),
    deliveryMinDays: num(formData.get("deliveryMinDays")),
    deliveryMaxDays: num(formData.get("deliveryMaxDays")),
    deliveryNoteTr: String(formData.get("deliveryNoteTr") ?? ""),
    deliveryNoteEn: String(formData.get("deliveryNoteEn") ?? ""),
    references: parseReferences(formData.get("references")),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    slug: String(formData.get("slug") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
    status: String(formData.get("status") ?? "draft"),
  };

  const res = id
    ? await apiFetch(`/api/admin/services/${id}`, { method: "PUT", body: payload, token })
    : await apiFetch("/api/admin/services", { method: "POST", body: payload, token });

  if (!res.ok) {
    return { error: await errorMessage(res, "Kaydedilemedi.") };
  }

  revalidateAll();
  redirect("/admin/services");
}

export async function toggleServicePublish(id: string) {
  const token = await getToken();
  if (!token) return;
  const res = await apiFetch(`/api/admin/services/${id}/publish`, { method: "PATCH", token });
  if (res.ok) revalidateAll();
}

export async function deleteService(id: string) {
  const token = await getToken();
  if (!token) return;
  await apiFetch(`/api/admin/services/${id}`, { method: "DELETE", token });
  revalidateAll();
}

export async function reorderServices(ids: string[]): Promise<{ error?: string }> {
  const token = await getToken();
  if (!token) return { error: "Oturum süresi doldu." };
  const res = await apiFetch("/api/admin/services/reorder", {
    method: "PATCH",
    body: { ids },
    token,
  });
  if (!res.ok) return { error: "Sıralama kaydedilemedi." };
  revalidateAll();
  return {};
}
