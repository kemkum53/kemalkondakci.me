"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export type ProjectView = {
  slug: string;
  name: string;
  shortDescTr: string;
  shortDescEn: string;
  contentTr: string;
  contentEn: string;
  coverImage: string | null;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
};

export default function ProjectArticle({ project }: { project: ProjectView }) {
  const { lang, isTransitioning } = useLanguage();

  const content = lang === "tr" ? project.contentTr : project.contentEn;
  const desc = lang === "tr" ? project.shortDescTr : project.shortDescEn;

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className="min-h-screen bg-[var(--bg)] px-4 py-16">
        <article className="max-w-3xl mx-auto">
          <Link href="/projects" className="text-sm text-[var(--cyan)] hover:underline">
            ← {lang === "tr" ? "Projeler" : "Projects"}
          </Link>

          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full max-h-[420px] object-cover rounded-xl border border-[var(--border)] mt-6 mb-8"
            />
          )}

          <h1 className="font-display text-3xl md:text-4xl text-[var(--text)] mt-6 mb-3">
            {project.name}
          </h1>
          {desc && <p className="text-[var(--muted)] mb-4">{desc}</p>}

          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.techStack.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--cyan)]">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mb-8">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="ktn-btn ktn-btn--ghost">
                GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="ktn-btn">
                {lang === "tr" ? "Canlı Demo ↗" : "Live Demo ↗"}
              </a>
            )}
          </div>

          {/* İçerik sunucuda sanitize edildi. */}
          {content && <div className="ktn-prose" dangerouslySetInnerHTML={{ __html: content }} />}
        </article>
      </main>
    </div>
  );
}
