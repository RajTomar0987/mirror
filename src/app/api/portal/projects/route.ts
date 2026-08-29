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

    const allProjects = posStore.getProjects();
    const customerProjects = allProjects.filter(
      (p) => p.customer_email?.toLowerCase() === userEmail || (customerId && p.customer_id === customerId)
    );

    return NextResponse.json({
      success: true,
      data: customerProjects,
    });
  } catch (err) {
    console.error("GET portal projects error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
