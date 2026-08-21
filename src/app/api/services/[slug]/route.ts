import { NextResponse } from "next/server";
import { SERVICES_DATA } from "@/data/services";
import { supabase } from "@/lib/supabase";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const service = SERVICES_DATA.find((s) => s.slug === slug);
      if (!service) {
        return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: service });
    }

    const { data: dbService, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !dbService) {
      const fallback = SERVICES_DATA.find((s) => s.slug === slug);
      if (!fallback) {
        return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: fallback });
    }

    return NextResponse.json({ success: true, data: dbService });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
