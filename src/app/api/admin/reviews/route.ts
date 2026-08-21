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
            id: "rev-1",
            author: "Marcus Vance",
            rating: 5,
            content: "Flawless frameless glass balustrades installed with extreme precision.",
            service_type: "Glass Balustrades",
            suburb: "Mosman",
            approved: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "rev-2",
            author: "Elena Rostova",
            rating: 5,
            content: "Custom shower screen transformed our master bathroom.",
            service_type: "Shower Screens",
            suburb: "Vaucluse",
            approved: false,
            created_at: new Date().toISOString(),
          },
        ],
      });
    }

    const { data: dbReviews, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbReviews) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: dbReviews });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
