import { PROJECTS_DATA } from "@/data/projects";
import { Project } from "@/types";

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (!response.ok) {
      return PROJECTS_DATA as unknown as Project[];
    }
    const result = (await response.json()) as { success?: boolean; data?: Project[] };
    if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data as Project[];
    }
    return PROJECTS_DATA as unknown as Project[];
  } catch {
    return PROJECTS_DATA as unknown as Project[];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}
