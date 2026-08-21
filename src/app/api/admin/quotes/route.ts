import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { data: quotes, error } = await supabaseAdmin
      .from("quotes")
      .select("*, quote_files(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to fetch quotes" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: quotes });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
