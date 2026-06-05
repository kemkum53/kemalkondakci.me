import { getPublishedPosts } from "@/lib/posts";
import BlogList, { type PostCard } from "@/components/blog/BlogList";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  const cards: PostCard[] = posts.map((p) => ({
    slug: p.slug,
    titleTr: p.titleTr,
    titleEn: p.titleEn,
    excerptTr: p.excerptTr ?? "",
    excerptEn: p.excerptEn ?? "",
    coverImage: p.coverImage,
    publishedAt: p.publishedAt,
  }));

  return <BlogList posts={cards} />;
}
