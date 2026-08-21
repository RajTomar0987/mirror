import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendQuoteStatusEmail } from "@/services/emailService";

const VALID_STATUSES = ["new", "contacted", "quote_sent", "in_progress", "completed", "closed"];

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as { status?: string; notes?: string };
    const { status, notes } = body || {};

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      // Mock mode status update & non-blocking status email
      try {
        await sendQuoteStatusEmail({
          name: "Dev Customer",
          email: "customer@example.com",
          quoteId: id,
          service: "Glass Balustrades",
          status,
          notes,
        });
      } catch (e) {
        console.error("Non-blocking status email error (dev mode):", e);
      }

      return NextResponse.json({ success: true, data: { id, status, notes } });
    }

    const { data: updatedQuote, error } = await supabaseAdmin
      .from("quotes")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to update quote status" }, { status: 500 });
    }

    // Trigger non-blocking status notification email
    if (updatedQuote && updatedQuote.email) {
      try {
        await sendQuoteStatusEmail({
          name: updatedQuote.name,
          email: updatedQuote.email,
          quoteId: updatedQuote.id,
          service: updatedQuote.service,
          status: updatedQuote.status,
          notes,
        });
      } catch (emailErr) {
        console.error("Non-blocking quote status email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: updatedQuote });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
