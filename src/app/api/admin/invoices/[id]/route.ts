import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { InvoiceStatus } from "@/types";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    const invoice = posStore.getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    const payments = posStore.getPaymentsByInvoiceId(id);

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        payments,
      },
    });
  } catch (err) {
    console.error("GET invoice detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface PatchInvoiceBody {
  status?: InvoiceStatus;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    const body = (await request.json()) as PatchInvoiceBody;
    const { status } = body || {};

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updated = posStore.updateInvoiceStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH invoice error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
