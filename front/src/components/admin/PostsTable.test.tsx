import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Server action zincirini (server-only) kes — sadece UI mantığını test ediyoruz.
vi.mock("@/app/admin/posts/actions", () => ({
  togglePublish: vi.fn(),
  deletePost: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import PostsTable, { type AdminPost } from "./PostsTable";

const posts: AdminPost[] = [
  { id: "1", slug: "alfa", titleTr: "Alfa Yazı", titleEn: "Alpha", status: "published", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "2", slug: "beta", titleTr: "Beta Yazı", titleEn: "Beta", status: "draft", updatedAt: "2026-01-02T00:00:00Z" },
];

describe("PostsTable", () => {
  it("tüm yazıları ve filtre sayaçlarını gösterir", () => {
    render(<PostsTable posts={posts} />);
    expect(screen.getByText("Alfa Yazı")).toBeInTheDocument();
    expect(screen.getByText("Beta Yazı")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tümü/ })).toHaveTextContent("(2)");
    expect(screen.getByRole("button", { name: /Yayında/ })).toHaveTextContent("(1)");
  });

  it("başlık aramasına göre filtreler", () => {
    render(<PostsTable posts={posts} />);
    fireEvent.change(screen.getByPlaceholderText(/ara/i), {
      target: { value: "alfa" },
    });
    expect(screen.getByText("Alfa Yazı")).toBeInTheDocument();
    expect(screen.queryByText("Beta Yazı")).not.toBeInTheDocument();
  });

  it("durum filtresi (Taslak) yalnızca taslakları gösterir", () => {
    render(<PostsTable posts={posts} />);
    fireEvent.click(screen.getByRole("button", { name: /Taslak/ }));
    expect(screen.queryByText("Alfa Yazı")).not.toBeInTheDocument();
    expect(screen.getByText("Beta Yazı")).toBeInTheDocument();
  });
});
