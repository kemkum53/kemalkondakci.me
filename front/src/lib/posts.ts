import "server-only";
import { apiFetch, type ApiPost } from "@/lib/api";
import { getToken } from "@/lib/session";

export type { ApiPost };

// --- Public ---

/** Yayınlanmış yazılar (en yeni önce). */
export async function getPublishedPosts(): Promise<ApiPost[]> {
  const res = await apiFetch("/api/posts");
  if (!res.ok) return [];
  return res.json();
}

/** Yayınlanmış tekil yazı (slug ile). Yoksa null. */
export async function getPublishedPostBySlug(slug: string): Promise<ApiPost | null> {
  const res = await apiFetch(`/api/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  return res.json();
}

// --- Admin (JWT gerekli) ---

export async function getAllPosts(): Promise<ApiPost[]> {
  const token = await getToken();
  const res = await apiFetch("/api/admin/posts", { token });
  if (!res.ok) return [];
  return res.json();
}

export async function getPostById(id: string): Promise<ApiPost | null> {
  const token = await getToken();
  const res = await apiFetch(`/api/admin/posts/${encodeURIComponent(id)}`, { token });
  if (!res.ok) return null;
  return res.json();
}
