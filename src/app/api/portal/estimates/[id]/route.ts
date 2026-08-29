import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
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
    const estimate = posStore.getEstimateById(id);

    if (!estimate || (estimate.customer_email?.toLowerCase() !== userEmail && estimate.customer_id !== authResult.user.id)) {
      return NextResponse.json({ success: false, error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: estimate });
  } catch (err) {
    console.error("GET portal estimate detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface CustomerEstimateActionBody {
  action?: "approve" | "reject";
  reason?: string;
}

export async function PATCH(
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
    const estimate = posStore.getEstimateById(id);

    if (!estimate || (estimate.customer_email?.toLowerCase() !== userEmail && estimate.customer_id !== authResult.user.id)) {
      return NextResponse.json({ success: false, error: "Estimate not found" }, { status: 404 });
    }

    const body = (await request.json()) as CustomerEstimateActionBody;
    const { action, reason } = body || {};

    if (action === "approve") {
      estimate.status = "accepted";
      estimate.accepted_at = new Date().toISOString();
      estimate.updated_at = new Date().toISOString();

      posStore.logActivity(
        userEmail,
        "ESTIMATE_ACCEPTED_BY_CUSTOMER",
        "estimate",
        estimate.id,
        `Customer ${authResult.user.fullName || userEmail} approved Estimate #${estimate.estimate_number} ($${estimate.total_amount.toFixed(2)})`
      );

      return NextResponse.json({
        success: true,
        message: `Estimate #${estimate.estimate_number} approved successfully. Our team will contact you to confirm the installation schedule.`,
        data: estimate,
      });
    }

    if (action === "reject") {
      estimate.status = "declined";
      estimate.notes = `${estimate.notes ? estimate.notes + "\n" : ""}Customer declined on ${new Date().toLocaleDateString()}${reason ? `: ${reason}` : ""}`;
      estimate.updated_at = new Date().toISOString();

      posStore.logActivity(
        userEmail,
        "ESTIMATE_DECLINED_BY_CUSTOMER",
        "estimate",
        estimate.id,
        `Customer ${authResult.user.fullName || userEmail} declined Estimate #${estimate.estimate_number}${reason ? ` (Reason: ${reason})` : ""}`
      );

      return NextResponse.json({
        success: true,
        message: `Estimate #${estimate.estimate_number} declined.`,
        data: estimate,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action. Must be 'approve' or 'reject'." }, { status: 400 });
  } catch (err) {
    console.error("PATCH portal estimate error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
