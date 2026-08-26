import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendQuoteStatusEmail } from "@/services/emailService";
import { quotesStore } from "@/lib/quotes-store";

interface RouteProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: Request, context: RouteProps) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      const quote = quotesStore.getById(id) || quotesStore.getAll().find((q) => q.id === id);
      if (!quote) {
        return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: quote });
    }

    const { data: quote, error } = await supabaseAdmin
      .from("quotes")
      .select("*, quote_files(*)")
      .eq("id", id)
      .single();

    if (error || !quote) {
      const fallback = quotesStore.getById(id);
      if (fallback) return NextResponse.json({ success: true, data: fallback });
      return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (err) {
    console.error("GET quote error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteProps) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 });
    }

    const body = (await request.json()) as { status?: string; notes?: string };
    const { status, notes } = body || {};

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      const updated = quotesStore.update(id, {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      });

      if (status) {
        try {
          await sendQuoteStatusEmail({
            name: updated?.name || "Customer",
            email: updated?.email || "customer@example.com",
            quoteId: id,
            service: updated?.service || "Glass Balustrades",
            status,
            notes,
          });
        } catch (e) {
          console.error("Non-blocking status email error (dev mode):", e);
        }
      }

      return NextResponse.json({ success: true, data: updated || { id, status, notes } });
    }

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;

    const { data: updatedQuote, error } = await supabaseAdmin
      .from("quotes")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // Dev store fallback
      const localUpdated = quotesStore.update(id, {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      });
      return NextResponse.json({ success: true, data: localUpdated || { id, status, notes } });
    }

    // Trigger non-blocking status notification email if status changed
    if (status && updatedQuote && updatedQuote.email) {
      try {
        await sendQuoteStatusEmail({
          name: updatedQuote.name,
          email: updatedQuote.email,
          quoteId: updatedQuote.id,
          service: updatedQuote.service || updatedQuote.project_type,
          status: updatedQuote.status,
          notes,
        });
      } catch (emailErr) {
        console.error("Non-blocking quote status email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: updatedQuote });
  } catch (err) {
    console.error("PATCH quote error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteProps) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      quotesStore.delete(id);
      return NextResponse.json({ success: true, message: "Quote deleted successfully" });
    }

    const { error } = await supabaseAdmin.from("quotes").delete().eq("id", id);
    if (error) {
      quotesStore.delete(id);
      return NextResponse.json({ success: true, message: "Quote removed" });
    }

    quotesStore.delete(id);
    return NextResponse.json({ success: true, message: "Quote deleted successfully" });
  } catch (err) {
    console.error("DELETE quote error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

