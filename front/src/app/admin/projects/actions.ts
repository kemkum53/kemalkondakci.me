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
  if (slug) revalidatePath(`/projects/${slug}`);
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
  } catch {
    /* yoksay */
  }
  return fallback;
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
    shortDescTr: String(formData.get("shortDescTr") ?? ""),
    shortDescEn: String(formData.get("shortDescEn") ?? ""),
    contentTr: String(formData.get("contentTr") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
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
