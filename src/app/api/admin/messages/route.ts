import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: "msg-1",
            name: "Sarah Jenkins",
            email: "sarah@example.com",
            phone: "0412 345 678",
            message: "Looking for an estimate on pool fencing for a 10m pool perimeter in Double Bay.",
            status: "unread",
            created_at: new Date().toISOString(),
          },
        ],
      });
    }

    const { data: messages, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !messages) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: messages });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
