import { NextResponse } from "next/server";
import { PROJECTS_DATA } from "@/data/projects";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        data: PROJECTS_DATA,
      });
    }

    const { data: dbProjects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("year", { ascending: false });

    if (error || !dbProjects || dbProjects.length === 0) {
      return NextResponse.json({
        success: true,
        data: PROJECTS_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      data: dbProjects,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: PROJECTS_DATA,
    });
  }
}
