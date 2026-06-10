import HomeClient from "@/components/home/HomeClient";
import { getPublishedPosts } from "@/lib/posts";
import { getPublishedProjects } from "@/lib/projects";

// İçerik (son yazılar / öne çıkan projeler) DB'den geldiği için her istekte taze.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
  ]);

  const latestPosts = posts.slice(0, 3).map((p) => ({
    slug: p.slug,
    titleTr: p.titleTr,
    titleEn: p.titleEn,
    excerptTr: p.excerptTr ?? "",
    excerptEn: p.excerptEn ?? "",
    coverImage: p.coverImage,
  }));

  // featured varsa onları, yoksa ilk projeleri göster.
  const featured = projects.filter((p) => p.featured);
  const featuredProjects = (featured.length > 0 ? featured : projects)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      shortDescTr: p.shortDescTr,
      shortDescEn: p.shortDescEn,
      coverImage: p.coverImage,
      techStack: p.techStack,
    }));

  return (
    <HomeClient
      latestPosts={latestPosts}
      featuredProjects={featuredProjects}
      projectCount={projects.length}
    />
  );
}
