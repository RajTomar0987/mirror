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

    const allEstimates = posStore.getEstimates();
    const customerEstimates = allEstimates.filter(
      (e) => e.customer_email?.toLowerCase() === userEmail || (customerId && e.customer_id === customerId)
    );

    return NextResponse.json({
      success: true,
      data: customerEstimates,
    });
  } catch (err) {
    console.error("GET portal estimates error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
