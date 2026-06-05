import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { logout } from "../auth-actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="ktn-scope min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-lg text-[var(--text)]">
              Yönetim
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="text-[var(--muted)] hover:text-[var(--text)]">
                Yazılar
              </Link>
              <Link href="/admin/projects" className="text-[var(--muted)] hover:text-[var(--text)]">
                Projeler
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted)] hidden sm:inline">
              {session.username}
            </span>
            <form action={logout}>
              <button type="submit" className="text-sm text-[var(--red)] hover:underline">
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
