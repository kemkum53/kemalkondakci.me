import "server-only";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export type GalleryImage = {
  url: string;
  captionTr: string;
  captionEn: string;
};

export type ApiProject = {
  id: string;
  slug: string;
  status: string;
  name: string;
  category: string;
  coverImage: string | null;
  shortDescTr: string;
  shortDescEn: string;
  contentTr: string;
  contentEn: string;
  clientName: string;
  roleTr: string;
  roleEn: string;
  resultsTr: string[];
  resultsEn: string[];
  gallery: GalleryImage[];
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

export async function getPublishedProjects(category?: string): Promise<ApiProject[]> {
  const path = category
    ? `/api/projects?category=${encodeURIComponent(category)}`
    : "/api/projects";
  const res = await apiFetch(path);
  if (!res.ok) return [];
  return res.json();
}

/** Published case count per work area, e.g. { web: 3, ai: 1, ... }. */
export async function getProjectCategoryCounts(): Promise<Record<string, number>> {
  const res = await apiFetch("/api/project-categories");
  if (!res.ok) return {};
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
