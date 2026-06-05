import "server-only";

// Backend (FastAPI) için sunucu-taraf API istemcisi.
// Tarayıcı backend'e doğrudan konuşmaz; Next bir BFF olarak araya girer.
const API_URL = process.env.API_URL || "http://localhost:8000";

export type ApiPost = {
  id: string;
  slug: string;
  status: string;
  coverImage: string | null;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  contentTr: string;
  contentEn: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function url(path: string) {
  return `${API_URL}${path}`;
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  token?: string;
  formData?: FormData;
};

export async function apiFetch(path: string, opts: FetchOpts = {}): Promise<Response> {
  const headers = new Headers();
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData; // multipart; Content-Type'ı fetch ayarlar
  } else if (opts.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(opts.body);
  }

  return fetch(url(path), {
    method: opts.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });
}

/** Giriş: token döner, hatalıysa null. */
export async function apiLogin(username: string, password: string): Promise<string | null> {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken as string;
}
