import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const allQuotes = quotesStore.getAll(true);

    // Filter strictly by authenticated customer email and STRIP internal notes
    const customerQuotes = allQuotes
      .filter((q) => q.email.toLowerCase() === userEmail)
      .map(({ notes, ...safeQuote }) => safeQuote);

    return NextResponse.json({
      success: true,
      data: customerQuotes,
    });
  } catch (err) {
    console.error("GET portal quotes error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
