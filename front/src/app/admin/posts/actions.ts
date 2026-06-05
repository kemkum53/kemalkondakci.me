"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export interface PostFormState {
  error?: string;
}

function revalidateAll(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
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

export async function savePost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const token = await getToken();
  if (!token) return { error: "Oturum süresi doldu. Tekrar giriş yap." };

  const id = String(formData.get("id") ?? "").trim();
  const payload = {
    titleTr: String(formData.get("titleTr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    excerptTr: String(formData.get("excerptTr") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    contentTr: String(formData.get("contentTr") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    slug: String(formData.get("slug") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft"),
  };

  const res = id
    ? await apiFetch(`/api/admin/posts/${id}`, { method: "PUT", body: payload, token })
    : await apiFetch("/api/admin/posts", { method: "POST", body: payload, token });

  if (!res.ok) {
    return { error: await errorMessage(res, "Kaydedilemedi.") };
  }

  const post = await res.json();
  revalidateAll(post.slug);
  redirect("/admin");
}

export interface AutosaveInput {
  id?: string | null;
  titleTr?: string;
  titleEn?: string;
  excerptTr?: string;
  excerptEn?: string;
  contentTr?: string;
  contentEn?: string;
  coverImage?: string;
  slug?: string;
}

export async function autosaveDraft(
  input: AutosaveInput
): Promise<{ id: string; savedAt: string }> {
  const token = await getToken();
  if (!token) throw new Error("Oturum süresi doldu.");

  const res = await apiFetch("/api/admin/posts/autosave", {
    method: "POST",
    body: input,
    token,
  });
  if (!res.ok) throw new Error(await errorMessage(res, "Otomatik kayıt başarısız."));

  const data = await res.json();
  revalidatePath("/admin");
  return { id: data.id, savedAt: data.savedAt };
}

export async function togglePublish(id: string) {
  const token = await getToken();
  if (!token) return;
  const res = await apiFetch(`/api/admin/posts/${id}/publish`, { method: "PATCH", token });
  if (res.ok) {
    const post = await res.json();
    revalidateAll(post.slug);
  }
}

export async function deletePost(id: string) {
  const token = await getToken();
  if (!token) return;
  await apiFetch(`/api/admin/posts/${id}`, { method: "DELETE", token });
  revalidateAll();
}

/** Görsel yükler (TinyMCE ve kapak görseli için). Backend'e Bearer ile iletir. */
export async function uploadImage(formData: FormData): Promise<string> {
  const token = await getToken();
  if (!token) throw new Error("Oturum süresi doldu.");

  const res = await apiFetch("/api/admin/uploads", { method: "POST", formData, token });
  if (!res.ok) throw new Error(await errorMessage(res, "Yükleme başarısız."));

  const data = await res.json();
  return data.location as string;
}
