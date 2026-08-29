import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { InvoiceItem } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    const invoices = customerId
      ? posStore.getInvoicesByCustomerId(customerId)
      : posStore.getInvoices();

    return NextResponse.json({ success: true, data: invoices });
  } catch (err) {
    console.error("GET invoices error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface CreateInvoiceBody {
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  project_id?: string;
  project_name?: string;
  estimate_id?: string;
  quote_id?: string;
  due_date?: string;
  items?: InvoiceItem[];
  discount_amount?: number;
  notes?: string;
  payment_terms?: string;
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateInvoiceBody;
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      project_id,
      project_name,
      estimate_id,
      quote_id,
      due_date,
      items,
      discount_amount,
      notes,
      payment_terms,
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

    let effectiveCustomerId = customer_id;
    if (!effectiveCustomerId) {
      const cust = posStore.addOrUpdateCustomerFromQuote({
        name: customer_name,
        email: customer_email,
        phone: customer_phone || "",
      });
      effectiveCustomerId = cust.id;
    }

    const invoice = posStore.createInvoice({
      customer_id: effectiveCustomerId,
      customer_name,
      customer_email,
      customer_phone,
      project_id,
      project_name,
      estimate_id,
      quote_id,
      due_date,
      items,
      discount_amount: Number(discount_amount) || 0,
      notes,
      payment_terms,
      created_by: "admin@completeglass.com.au",
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (err) {
    console.error("POST invoice error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
