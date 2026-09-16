"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export interface ProjectFormState {
  error?: string;
}

function revalidateAll(slug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/showcase");
  revalidatePath("/showcase/[area]", "page");
  if (slug) revalidatePath(`/projects/${slug}`);
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

type GalleryItem = { url: string; captionTr: string; captionEn: string };

/** Galeri düzenleyicisinin gizli alanda taşıdığı JSON. Bozuksa galeri boşalmaz,
 *  boş liste gider ve kullanıcı formda ne olduğunu görür. */
function parseGallery(value: FormDataEntryValue | null): GalleryItem[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        url: String(item.url ?? "").trim(),
        captionTr: String(item.captionTr ?? "").trim(),
        captionEn: String(item.captionEn ?? "").trim(),
      }))
      .filter((item) => item.url.length > 0);
  } catch {
    return [];
  }
}

export async function saveProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const token = await getToken();
  if (!token) return { error: "Oturum süresi doldu. Tekrar giriş yap." };

  const id = String(formData.get("id") ?? "").trim();
  // "Python, FastAPI, Next.js" → ["Python","FastAPI","Next.js"]
  const techStack = String(formData.get("techStack") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const payload = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "").trim() || null,
    category: String(formData.get("category") ?? "other"),
    shortDescTr: String(formData.get("shortDescTr") ?? ""),
    shortDescEn: String(formData.get("shortDescEn") ?? ""),
    contentTr: String(formData.get("contentTr") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    clientName: String(formData.get("clientName") ?? ""),
    roleTr: String(formData.get("roleTr") ?? ""),
    roleEn: String(formData.get("roleEn") ?? ""),
    resultsTr: lines(formData.get("resultsTr")),
    resultsEn: lines(formData.get("resultsEn")),
    gallery: parseGallery(formData.get("gallery")),
    techStack,
    repoUrl: String(formData.get("repoUrl") ?? "").trim() || null,
    liveUrl: String(formData.get("liveUrl") ?? "").trim() || null,
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
    status: String(formData.get("status") ?? "draft"),
  };

  const res = id
    ? await apiFetch(`/api/admin/projects/${id}`, { method: "PUT", body: payload, token })
    : await apiFetch("/api/admin/projects", { method: "POST", body: payload, token });

  if (!res.ok) {
    return { error: await errorMessage(res, "Kaydedilemedi.") };
  }

  const project = await res.json();
  revalidateAll(project.slug);
  redirect("/admin/projects");
}

export async function toggleProjectPublish(id: string) {
  const token = await getToken();
  if (!token) return;
  const res = await apiFetch(`/api/admin/projects/${id}/publish`, { method: "PATCH", token });
  if (res.ok) {
    const project = await res.json();
    revalidateAll(project.slug);
  }
}

export async function deleteProject(id: string) {
  const token = await getToken();
  if (!token) return;
  await apiFetch(`/api/admin/projects/${id}`, { method: "DELETE", token });
  revalidateAll();
}
