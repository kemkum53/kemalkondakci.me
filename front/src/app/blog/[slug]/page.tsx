import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";
import BlogArticle, { type PostView } from "@/components/blog/BlogArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Yazı bulunamadı" };

  const title = post.titleTr || post.titleEn;
  const description = post.excerptTr || post.excerptEn || undefined;

  return {
    title,
    description,
    openGraph: {
      title: `${title} - Kemal Kondakçı`,
      description,
      type: "article",
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const view: PostView = {
    slug: post.slug,
    titleTr: post.titleTr,
    titleEn: post.titleEn,
    contentTr: post.contentTr,
    contentEn: post.contentEn,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
  };

  return <BlogArticle post={view} />;
}
