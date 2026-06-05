"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="ktn-scope min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
          <h1 className="font-display text-2xl text-[var(--text)] mb-1">
            Admin Girişi
          </h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            Blog yönetim paneline erişmek için giriş yap.
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[var(--text)] mb-1"
              >
                Kullanıcı adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text)] mb-1"
              >
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--purple)]"
              />
            </div>

            {state.error && (
              <p className="text-sm text-[var(--red)]" role="alert">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="ktn-btn w-full justify-center disabled:opacity-50"
            >
              {pending ? "Giriş yapılıyor…" : "Giriş yap"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
