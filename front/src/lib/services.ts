import "server-only";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/session";

export type ServiceReference = { label: string; url: string };

export type ApiService = {
  id: string;
  slug: string;
  status: string;
  category: string;
  icon: string;
  nameTr: string;
  nameEn: string;
  shortDescTr: string;
  shortDescEn: string;
  featuresTr: string[];
  featuresEn: string[];
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  deliveryNoteTr: string;
  deliveryNoteEn: string;
  references: ServiceReference[];
  tags: string[];
  featured: boolean;
  position: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// --- Public ---

export async function getPublishedServices(): Promise<ApiService[]> {
  const res = await apiFetch("/api/services");
  if (!res.ok) return [];
  return res.json();
}

// --- Admin ---

export async function getAllServices(): Promise<ApiService[]> {
  const token = await getToken();
  const res = await apiFetch("/api/admin/services", { token });
  if (!res.ok) return [];
  return res.json();
}

export async function getServiceById(id: string): Promise<ApiService | null> {
  const token = await getToken();
  const res = await apiFetch(`/api/admin/services/${encodeURIComponent(id)}`, { token });
  if (!res.ok) return null;
  return res.json();
}
