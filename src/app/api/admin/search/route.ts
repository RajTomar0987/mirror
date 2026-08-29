import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";

    if (!q) {
      return NextResponse.json({
        success: true,
        data: { customers: [], quotes: [], estimates: [], invoices: [], projects: [] },
      });
    }

    const posResults = posStore.searchAll(q);
    const allQuotes = quotesStore.getAll(true);
    const matchedQuotes = allQuotes
      .filter(
        (quote) =>
          quote.name.toLowerCase().includes(q) ||
          quote.email.toLowerCase().includes(q) ||
          quote.phone.includes(q) ||
          (quote.service && quote.service.toLowerCase().includes(q)) ||
          (quote.suburb && quote.suburb.toLowerCase().includes(q)) ||
          (quote.id && quote.id.toLowerCase().includes(q))
      )
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        ...posResults,
        quotes: matchedQuotes,
      },
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
