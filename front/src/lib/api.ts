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

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; status: number; message?: string };

/** Giriş. Başarılıysa token, değilse durum kodu + backend mesajı döner.
 *  forwardedFor: gerçek istemci IP'si (BFF, rate-limit doğru işlesin diye iletir). */
export async function apiLogin(
  username: string,
  password: string,
  forwardedFor?: string
): Promise<LoginResult> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (forwardedFor) headers.set("X-Forwarded-For", forwardedFor);

  const res = await fetch(url("/api/auth/login"), {
    method: "POST",
    headers,
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (res.ok) {
    const data = await res.json();
    return { ok: true, token: data.accessToken as string };
  }

  let message: string | undefined;
  try {
    message = (await res.json())?.detail;
  } catch {
    /* gövde yok */
  }
  return { ok: false, status: res.status, message };
}
