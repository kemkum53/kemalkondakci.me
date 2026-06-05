"use server";

import { redirect } from "next/navigation";
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

  // Backend'e kimlik doğrulat; JWT al.
  const token = await apiLogin(username, password);
  if (!token) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  // Token'ı httpOnly cookie'de (iron-session) sakla.
  const session = await getSession();
  session.token = token;
  session.username = username;
  await session.save();

  redirect("/admin");
}
