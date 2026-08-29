import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const customer = posStore.getCustomerByEmail(userEmail);
    const customerId = customer?.id;

    const userInvoices = posStore
      .getInvoices()
      .filter((i) => i.customer_email?.toLowerCase() === userEmail || (customerId && i.customer_id === customerId));
    const userInvoiceIds = new Set(userInvoices.map((i) => i.id));

    const allPayments = posStore.getPayments();
    const customerPayments = allPayments.filter(
      (p) => (customerId && p.customer_id === customerId) || userInvoiceIds.has(p.invoice_id)
    );

    return NextResponse.json({
      success: true,
      data: customerPayments,
    });
  } catch (err) {
    console.error("GET portal payments error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
