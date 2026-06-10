"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export type PostCard = {
  slug: string;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  coverImage: string | null;
  publishedAt: string | null;
};

export default function BlogList({ posts }: { posts: PostCard[] }) {
  const { lang, isTransitioning } = useLanguage();

  const copy = {
    tr: {
      title: "Blog",
      subtitle: "AI, yazılım ve teknoloji üzerine yazılarım.",
      empty: "Henüz yayınlanmış bir yazı yok. Yakında burada olacak.",
    },
    en: {
      title: "Blog",
      subtitle: "My writing on AI, software and technology.",
      empty: "No published posts yet. Coming soon.",
    },
  }[lang];

  const dateFmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className="content-fade-in min-h-screen bg-[var(--bg)] px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="ktn-glitch font-display text-4xl md:text-5xl text-[var(--text)] mb-3" data-text={copy.title}>
            {copy.title}
          </h1>
          <p className="text-[var(--purple)] mb-10">{copy.subtitle}</p>

          {posts.length === 0 ? (
            <p className="text-[var(--muted)]">{copy.empty}</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((post) => {
                const title = lang === "tr" ? post.titleTr : post.titleEn;
                const excerpt = lang === "tr" ? post.excerptTr : post.excerptEn;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors hover:border-[var(--purple)]"
                  >
                    {post.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="flex flex-col flex-1 p-5">
                      {post.publishedAt && (
                        <div className="text-xs text-[var(--muted)] mb-2">{dateFmt(post.publishedAt)}</div>
                      )}
                      <h2 className="font-display text-xl text-[var(--text)] mb-2">{title}</h2>
                      {excerpt && <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">{excerpt}</p>}
                      <span className="mt-auto text-sm text-[var(--cyan)]">
                        {lang === "tr" ? "Devamını oku →" : "Read more →"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
