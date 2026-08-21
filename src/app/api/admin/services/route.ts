import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { SERVICES_DATA } from "@/data/services";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({ success: true, data: SERVICES_DATA });
    }

    const { data: dbServices, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbServices) {
      return NextResponse.json({ success: true, data: SERVICES_DATA });
    }

    return NextResponse.json({ success: true, data: dbServices });
  } catch {
    return NextResponse.json({ success: true, data: SERVICES_DATA });
  }
}
