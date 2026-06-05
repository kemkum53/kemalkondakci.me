import "server-only";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export type ApiProject = {
  id: string;
  slug: string;
  status: string;
  name: string;
  coverImage: string | null;
  shortDescTr: string;
  shortDescEn: string;
  contentTr: string;
  contentEn: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  position: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// --- Public ---

export async function getPublishedProjects(): Promise<ApiProject[]> {
  const res = await apiFetch("/api/projects");
  if (!res.ok) return [];
  return res.json();
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ApiProject | null> {
  const res = await apiFetch(`/api/projects/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  return res.json();
}

// --- Admin ---

export async function getAllProjects(): Promise<ApiProject[]> {
  const token = await getToken();
  const res = await apiFetch("/api/admin/projects", { token });
  if (!res.ok) return [];
  return res.json();
}

export async function getProjectById(id: string): Promise<ApiProject | null> {
  const token = await getToken();
  const res = await apiFetch(`/api/admin/projects/${encodeURIComponent(id)}`, { token });
  if (!res.ok) return null;
  return res.json();
}
