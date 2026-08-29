import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { quotesStore } from "@/lib/quotes-store";
import { posStore } from "@/lib/pos-store";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    const userEmail = authResult.user.email.toLowerCase().trim();
    const quote = quotesStore.getById(id);

    if (!quote || quote.email.toLowerCase() !== userEmail) {
      return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 });
    }

    // Strip internal admin notes
    const { notes, ...safeQuote } = quote;

    // Check for linked estimate
    const estimates = posStore.getEstimates();
    const linkedEstimate = estimates.find((e) => e.quote_id === quote.id);

    return NextResponse.json({
      success: true,
      data: {
        ...safeQuote,
        linkedEstimate: linkedEstimate || null,
      },
    });
  } catch (err) {
    console.error("GET portal quote detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
