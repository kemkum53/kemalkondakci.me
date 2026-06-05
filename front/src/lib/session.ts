import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionData {
  // Backend'den alınan JWT. Tarayıcı JS'ine açık değil (httpOnly cookie).
  token?: string;
  username?: string;
}

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  // Runtime'da doğrula (build sırasında env olmayabilir; modül yüklenince çökmesin).
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET en az 32 karakter olmalı. .env / ortam değişkenlerini kontrol et."
    );
  }
  // Oturum 7 gün geçerli.
  const ttl = 60 * 60 * 24 * 7;
  // `secure` cookie sadece HTTPS'te gönderilir. LAN'da düz HTTP kullanıldığında
  // bu açık olursa tarayıcı çerezi saklamaz ve oturum kalıcı olmaz.
  // Bu yüzden açıkça COOKIE_SECURE=true verilmedikçe kapalı (production HTTPS'te aç).
  const secure = process.env.COOKIE_SECURE === "true";
  return {
    password,
    cookieName: "kk_admin_session",
    ttl,
    cookieOptions: {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
    },
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions());
}

/** Korumalı admin sayfalarında çağrılır; token yoksa login'e yönlendirir. */
export async function requireAuth() {
  const session = await getSession();
  if (!session.token) {
    redirect("/admin/login");
  }
  return session;
}

/** Sunucu action/sayfalarından backend'e Bearer olarak iletmek için token. */
export async function getToken(): Promise<string | undefined> {
  const session = await getSession();
  return session.token;
}
