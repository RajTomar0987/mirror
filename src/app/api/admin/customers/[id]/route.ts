import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { quotesStore } from "@/lib/quotes-store";
import { Customer } from "@/types";

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

    const customer = posStore.getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    // Aggregated customer history
    const quotes = quotesStore.getAll(true).filter(
      (q) => q.email.toLowerCase() === customer.email.toLowerCase()
    );
    const estimates = posStore.getEstimatesByCustomerId(id);
    const invoices = posStore.getInvoicesByCustomerId(id);
    const payments = posStore.getPayments().filter(
      (p) => p.customer_id === id || p.customer_name?.toLowerCase() === customer.name.toLowerCase()
    );
    const projects = posStore.getProjectsByCustomerId(id);

    return NextResponse.json({
      success: true,
      data: {
        customer,
        quotes,
        estimates,
        invoices,
        payments,
        projects,
      },
    });
  } catch (err) {
    console.error("GET customer detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
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

    const body = (await request.json()) as Partial<Customer>;
    const updated = posStore.updateCustomer(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    posStore.logActivity(
      "admin@completeglass.com.au",
      "CUSTOMER_UPDATED",
      "customer",
      id,
      `Updated customer ${updated.name}`
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH customer error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
