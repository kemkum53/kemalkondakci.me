"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export type ProjectCard = {
  slug: string;
  name: string;
  shortDescTr: string;
  shortDescEn: string;
  coverImage: string | null;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
};

export default function ProjectsList({ projects }: { projects: ProjectCard[] }) {
  const { lang, isTransitioning } = useLanguage();

  const copy = {
    tr: { title: "Projeler", subtitle: "Üzerinde çalıştığım seçili işler.", empty: "Henüz yayınlanmış proje yok.", detail: "Detay →" },
    en: { title: "Projects", subtitle: "Selected work I've built.", empty: "No published projects yet.", detail: "Details →" },
  }[lang];

  return (
    <div className={`ktn-scope language-transition ${isTransitioning ? "transitioning" : ""}`}>
      <main className="content-fade-in min-h-screen bg-[var(--bg)] px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="ktn-glitch font-display text-4xl md:text-5xl text-[var(--text)] mb-3" data-text={copy.title}>
            {copy.title}
          </h1>
          <p className="text-[var(--purple)] mb-10">{copy.subtitle}</p>

          {projects.length === 0 ? (
            <p className="text-[var(--muted)]">{copy.empty}</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((p) => {
                const desc = lang === "tr" ? p.shortDescTr : p.shortDescEn;
                return (
                  <div
                    key={p.slug}
                    className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors hover:border-[var(--purple)]"
                  >
                    {p.coverImage && (
                      <Link href={`/projects/${p.slug}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.coverImage} alt={p.name} className="w-full h-44 object-cover" />
                      </Link>
                    )}
                    <div className="flex flex-col flex-1 p-5">
                      <Link href={`/projects/${p.slug}`}>
                        <h2 className="font-display text-xl text-[var(--text)] hover:text-[var(--purple)] mb-2">
                          {p.name}
                        </h2>
                      </Link>
                      {desc && <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">{desc}</p>}

                      {p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.techStack.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--cyan)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-4 text-sm">
                        {p.repoUrl && (
                          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)]"
                            data-umami-event="project-github" data-umami-event-slug={p.slug}>
                            GitHub ↗
                          </a>
                        )}
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)]"
                            data-umami-event="project-demo" data-umami-event-slug={p.slug}>
                            Demo ↗
                          </a>
                        )}
                        <Link href={`/projects/${p.slug}`} className="ml-auto text-[var(--cyan)]"
                          data-umami-event="project-details" data-umami-event-slug={p.slug}>
                          {copy.detail}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
