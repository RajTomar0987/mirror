import { NextResponse } from "next/server";
import { PROJECTS_DATA } from "@/data/projects";
import { supabase } from "@/lib/supabase";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const project = PROJECTS_DATA.find((p) => p.slug === slug);
      if (!project) {
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: project });
    }

    const { data: dbProject, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !dbProject) {
      const fallback = PROJECTS_DATA.find((p) => p.slug === slug);
      if (!fallback) {
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: fallback });
    }

    return NextResponse.json({ success: true, data: dbProject });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
