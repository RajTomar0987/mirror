import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock")) {
      const allQuotes = quotesStore.getAll();
      const newCount = allQuotes.filter((q) => q.status === "new").length;
      const contactedCount = allQuotes.filter((q) => q.status === "contacted").length;
      return NextResponse.json({
        success: true,
        data: {
          newEnquiries: newCount,
          pendingQuotes: newCount + contactedCount,
          projectsCount: 4,
          publishedServicesCount: 8,
          unreadMessages: 1,
        },
      });
    }

    // Query real counts from database
    const { count: newEnquiries } = await supabaseAdmin.from("quotes").select("*", { count: "exact", head: true }).eq("status", "new");
    const { count: pendingQuotes } = await supabaseAdmin.from("quotes").select("*", { count: "exact", head: true }).in("status", ["new", "contacted"]);
    const { count: projectsCount } = await supabaseAdmin.from("projects").select("*", { count: "exact", head: true });
    const { count: publishedServicesCount } = await supabaseAdmin.from("services").select("*", { count: "exact", head: true }).eq("published", true);
    const { count: unreadMessages } = await supabaseAdmin.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread");

    return NextResponse.json({
      success: true,
      data: {
        newEnquiries: newEnquiries || 0,
        pendingQuotes: pendingQuotes || 0,
        projectsCount: projectsCount || 0,
        publishedServicesCount: publishedServicesCount || 0,
        unreadMessages: unreadMessages || 0,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        newEnquiries: 0,
        pendingQuotes: 0,
        projectsCount: 0,
        publishedServicesCount: 0,
        unreadMessages: 0,
      },
    });
  }
}
