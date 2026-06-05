"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export type PostView = {
  slug: string;
  titleTr: string;
  titleEn: string;
  contentTr: string;
  contentEn: string;
  coverImage: string | null;
  publishedAt: string | null;
};

export default function BlogArticle({ post }: { post: PostView }) {
  const { lang, isTransitioning } = useLanguage();

  const title = lang === "tr" ? post.titleTr : post.titleEn;
  const content = lang === "tr" ? post.contentTr : post.contentEn;

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className="min-h-screen bg-[var(--bg)] px-4 py-16">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-sm text-[var(--cyan)] hover:underline">
            ← Blog
          </Link>

          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={title}
              className="w-full max-h-[420px] object-cover rounded-xl border border-[var(--border)] mt-6 mb-8"
            />
          )}

          <h1 className="font-display text-3xl md:text-4xl text-[var(--text)] mt-6 mb-3">{title}</h1>
          {date && <div className="text-sm text-[var(--muted)] mb-8">{date}</div>}

          {/* İçerik kaydederken sunucuda sanitize edildi. */}
          <div className="ktn-prose" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </main>
    </div>
  );
}
