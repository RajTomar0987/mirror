import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, error: authResult.error || "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      return NextResponse.json({ success: true, data: quotesStore.getAll() });
    }

    const { data: quotes, error } = await supabaseAdmin
      .from("quotes")
      .select("*, quote_files(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: true, data: quotesStore.getAll() });
    }

    return NextResponse.json({ success: true, data: quotes });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
