import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Read my thoughts on AI, machine learning, software development, and technology trends.",
    openGraph: {
      title: "Blog - Kemal Kondakçı",
      description: "Read my thoughts on AI, machine learning, software development, and technology trends.",
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
