import { getProjectCategoryCounts } from "@/lib/projects";
import ShowcaseIndex from "@/components/showcase/ShowcaseIndex";

export const dynamic = "force-dynamic";

export default async function ShowcasePage() {
  const counts = await getProjectCategoryCounts();
  return <ShowcaseIndex counts={counts} />;
}
