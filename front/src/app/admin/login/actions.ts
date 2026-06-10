"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { apiLogin } from "@/lib/api";
import { getSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Kullanıcı adı ve şifre gerekli." };
  }

  // Gerçek istemci IP'sini backend'e ilet ki rate-limit IP başına doğru çalışsın.
  const h = await headers();
  const clientIp =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    undefined;

  // Backend'e kimlik doğrulat; JWT al.
  const result = await apiLogin(username, password, clientIp);
  if (!result.ok) {
    if (result.status === 429) {
      return { error: result.message ?? "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." };
    }
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  // Token'ı httpOnly cookie'de (iron-session) sakla.
  const session = await getSession();
  session.token = result.token;
  session.username = username;
  await session.save();

  redirect("/admin");
}
