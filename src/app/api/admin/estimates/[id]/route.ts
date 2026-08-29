import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { EstimateStatus } from "@/types";

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

    const estimate = posStore.getEstimateById(id);
    if (!estimate) {
      return NextResponse.json({ success: false, error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: estimate });
  } catch (err) {
    console.error("GET estimate detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface PatchEstimateBody {
  action?: string;
  status?: EstimateStatus;
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

    const body = (await request.json()) as PatchEstimateBody;
    const { action, status } = body || {};

    if (action === "convert_to_invoice") {
      const invoice = posStore.convertEstimateToInvoice(id);
      if (!invoice) {
        return NextResponse.json({ success: false, error: "Could not convert estimate to invoice" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Estimate converted to Tax Invoice #${invoice.invoice_number}`,
        data: invoice,
      });
    }

    if (status) {
      const updated = posStore.updateEstimateStatus(id, status);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Estimate not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "No valid action provided" }, { status: 400 });
  } catch (err) {
    console.error("PATCH estimate error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
