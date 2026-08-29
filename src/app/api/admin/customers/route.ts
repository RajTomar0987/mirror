import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const customers = posStore.getCustomers();
    const allQuotes = quotesStore.getAll(true);
    const allEstimates = posStore.getEstimates();
    const allInvoices = posStore.getInvoices();
    const allProjects = posStore.getProjects();

    // Enrich customers with live counts
    const enriched = customers.map((c) => {
      const cQuotes = allQuotes.filter((q) => q.email.toLowerCase() === c.email.toLowerCase());
      const cEstimates = allEstimates.filter((e) => e.customer_id === c.id || e.customer_email?.toLowerCase() === c.email.toLowerCase());
      const cInvoices = allInvoices.filter((i) => i.customer_id === c.id || i.customer_email?.toLowerCase() === c.email.toLowerCase());
      const cProjects = allProjects.filter((p) => p.customer_id === c.id || p.customer_email?.toLowerCase() === c.email.toLowerCase());

      const totalVal = cInvoices.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) ||
        cEstimates.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

      return {
        ...c,
        quote_count: cQuotes.length || c.quote_count || 0,
        accepted_count: cEstimates.filter((e) => e.status === "accepted").length,
        projects_count: cProjects.length,
        total_value: totalVal,
      };
    });

    const filtered = search
      ? enriched.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search) ||
            c.phone.includes(search) ||
            (c.suburb && c.suburb.toLowerCase().includes(search)) ||
            (c.company && c.company.toLowerCase().includes(search))
        )
      : enriched;

    return NextResponse.json({ success: true, data: filtered });
  } catch (err) {
    console.error("GET customers error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, string | undefined>;
    const { name, email, phone, address, suburb, state, postcode, company, notes } = body || {};

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone number are required" },
        { status: 400 }
      );
    }

    const customer = posStore.addOrUpdateCustomerFromQuote({
      name,
      email,
      phone,
      suburb: suburb || "Sydney",
      notes,
    });

    if (address || state || postcode || company) {
      posStore.updateCustomer(customer.id, { address, state, postcode, company });
    }

    posStore.logActivity(
      "admin@completeglass.com.au",
      "CUSTOMER_CREATED",
      "customer",
      customer.id,
      `Added new customer ${customer.name} (${customer.email})`
    );

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (err) {
    console.error("POST customer error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
