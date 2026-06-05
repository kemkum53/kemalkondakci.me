import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects",
    description: "Explore my projects and work in AI, machine learning, and software development.",
    openGraph: {
      title: "Projects - Kemal Kondakçı",
      description: "Explore my projects and work in AI, machine learning, and software development.",
    },
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
