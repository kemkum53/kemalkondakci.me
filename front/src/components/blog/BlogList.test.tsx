import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import BlogList, { type PostCard } from "./BlogList";

// next/link'i basit bir anchor'a indir (router gerektirmesin).
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const posts: PostCard[] = [
  {
    slug: "ilk-yazi",
    titleTr: "İlk Yazı",
    titleEn: "First Post",
    excerptTr: "Türkçe özet",
    excerptEn: "English summary",
    coverImage: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
];

function renderList(items: PostCard[]) {
  return render(
    <LanguageProvider>
      <BlogList posts={items} />
    </LanguageProvider>
  );
}

describe("BlogList", () => {
  it("yayınlanmış yazıyı listeler ve doğru linki verir (varsayılan EN)", () => {
    renderList(posts);
    const title = screen.getByText("First Post");
    expect(title).toBeInTheDocument();
    expect(title.closest("a")).toHaveAttribute("href", "/blog/ilk-yazi");
  });

  it("yazı yokken boş durum mesajı gösterir", () => {
    renderList([]);
    expect(screen.getByText(/No published posts/i)).toBeInTheDocument();
  });
});
