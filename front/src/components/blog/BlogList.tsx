"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import styles from "@/app/page-kit.module.css";

export type PostCard = {
  slug: string;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  coverImage: string | null;
  publishedAt: string | null;
};

const COPY = {
  tr: {
    eyebrow: "Blog",
    title: "Yaparken öğrendiklerim",
    lead: "Yapay zekâ, yazılım ve sunucu tarafında çalışırken çıkan notlar. Genelde bir işi bitirdikten sonra, ne işe yaradığını hatırlamak için yazıyorum.",
    sectionTitle: "Yazılar",
    empty: "Henüz yayınlanmış bir yazı yok. Yakında burada olacak.",
    read: "Devamını oku",
  },
  en: {
    eyebrow: "Blog",
    title: "What I learn while building",
    lead: "Notes from working on AI, software and servers. Usually written after finishing something, to remember what actually helped.",
    sectionTitle: "Posts",
    empty: "No published posts yet. Coming soon.",
    read: "Read more",
  },
} as const;

export default function BlogList({ posts }: { posts: PostCard[] }) {
  const { lang, isTransitioning } = useLanguage();
  const copy = COPY[lang];

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main
        className={`${styles.page} content-fade-in`}
        style={{ ["--accent" as string]: "#00E5FF" }}
      >
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
          </div>
        </section>

        <div className={styles.sectionBand}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>
              {copy.sectionTitle}
              {posts.length > 0 && <span className={styles.sectionCount}>{posts.length}</span>}
            </h2>
          </div>
        </div>

        <div className={styles.inner}>

          {posts.length === 0 ? (
            <p className={styles.empty}>{copy.empty}</p>
          ) : (
            <div className={styles.grid}>
              {posts.map((post) => {
                const title = lang === "tr" ? post.titleTr : post.titleEn;
                const excerpt = lang === "tr" ? post.excerptTr : post.excerptEn;
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                    {post.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={title}
                        className={styles.cardCover}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.cardBody}>
                      {post.publishedAt && (
                        <p className={styles.cardMeta}>{formatDate(post.publishedAt)}</p>
                      )}
                      <h3 className={styles.cardTitle}>{title}</h3>
                      {excerpt && <p className={styles.cardDesc}>{excerpt}</p>}
                      <span className={`${styles.cardLinks} ${styles.cardLink}`}>
                        <span className={styles.cardLinkStrong}>{copy.read} →</span>
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
