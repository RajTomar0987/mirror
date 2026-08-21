import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations/project";
import { PROJECTS_DATA } from "@/data/projects";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({ success: true, data: PROJECTS_DATA });
    }

    const { data: dbProjects, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbProjects) {
      return NextResponse.json({ success: true, data: PROJECTS_DATA });
    }

    return NextResponse.json({ success: true, data: dbProjects });
  } catch {
    return NextResponse.json({ success: true, data: PROJECTS_DATA });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = projectSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: "Invalid project input", details: validationResult.error.format() }, { status: 400 });
    }

    const projectData = validationResult.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({ success: true, data: { id: `proj-${Date.now()}`, ...projectData } }, { status: 201 });
    }

    const { data: createdProject, error: dbError } = await supabaseAdmin
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: createdProject }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
