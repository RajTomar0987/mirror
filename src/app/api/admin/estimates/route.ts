import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { EstimateItem } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    const estimates = customerId
      ? posStore.getEstimatesByCustomerId(customerId)
      : posStore.getEstimates();

    return NextResponse.json({ success: true, data: estimates });
  } catch (err) {
    console.error("GET estimates error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface CreateEstimateBody {
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  quote_id?: string;
  project_id?: string;
  project_name?: string;
  valid_until?: string;
  items?: EstimateItem[];
  discount_amount?: number;
  notes?: string;
  terms?: string;
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateEstimateBody;
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      quote_id,
      project_id,
      project_name,
      valid_until,
      items,
      discount_amount,
      notes,
      terms,
    } = body || {};

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { success: false, error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one line item is required" },
        { status: 400 }
      );
    }

    // Auto-create/sync customer if not present
    let effectiveCustomerId = customer_id;
    if (!effectiveCustomerId) {
      const cust = posStore.addOrUpdateCustomerFromQuote({
        name: customer_name,
        email: customer_email,
        phone: customer_phone || "",
      });
      effectiveCustomerId = cust.id;
    }

    const estimate = posStore.createEstimate({
      customer_id: effectiveCustomerId,
      customer_name,
      customer_email,
      customer_phone,
      quote_id,
      project_id,
      project_name,
      valid_until,
      items,
      discount_amount: Number(discount_amount) || 0,
      notes,
      terms,
      created_by: "admin@completeglass.com.au",
    });

    return NextResponse.json({ success: true, data: estimate }, { status: 201 });
  } catch (err) {
    console.error("POST estimate error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
