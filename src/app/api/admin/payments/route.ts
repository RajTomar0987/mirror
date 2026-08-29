import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { PaymentMethod } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoice_id");

    const payments = invoiceId
      ? posStore.getPaymentsByInvoiceId(invoiceId)
      : posStore.getPayments();

    return NextResponse.json({ success: true, data: payments });
  } catch (err) {
    console.error("GET payments error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface RecordPaymentBody {
  invoice_id?: string;
  amount?: number;
  payment_method?: PaymentMethod;
  payment_date?: string;
  reference_number?: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as RecordPaymentBody;
    const {
      invoice_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes,
    } = body || {};

    if (!invoice_id || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid invoice ID and payment amount are required" },
        { status: 400 }
      );
    }

    const payment = posStore.recordPayment({
      invoice_id,
      amount: Number(amount),
      payment_method: payment_method || "bank_transfer",
      payment_date,
      reference_number,
      notes,
      recorded_by: "admin@completeglass.com.au",
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Invoice not found or could not record payment" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (err) {
    console.error("POST payment error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
