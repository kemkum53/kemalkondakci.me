import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hire Me",
    description: "Looking to hire an AI Engineer or Software Developer? Let's work together on your next project.",
    openGraph: {
      title: "Hire Me - Kemal Kondakçı",
      description: "Looking to hire an AI Engineer or Software Developer? Let's work together on your next project.",
    },
  };
}

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
