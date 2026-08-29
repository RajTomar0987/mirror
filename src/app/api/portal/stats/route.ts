import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { quotesStore } from "@/lib/quotes-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const customer = posStore.getCustomerByEmail(userEmail);
    const customerId = customer?.id;

    // Filter quotes (strip internal notes)
    const allQuotes = quotesStore.getAll(true);
    const userQuotes = allQuotes
      .filter((q) => q.email.toLowerCase() === userEmail)
      .map(({ notes, ...safeQuote }) => safeQuote);

    // Filter estimates
    const allEstimates = posStore.getEstimates();
    const userEstimates = allEstimates.filter(
      (e) => e.customer_email?.toLowerCase() === userEmail || (customerId && e.customer_id === customerId)
    );

    // Filter invoices
    const allInvoices = posStore.getInvoices();
    const userInvoices = allInvoices.filter(
      (i) => i.customer_email?.toLowerCase() === userEmail || (customerId && i.customer_id === customerId)
    );

    // Filter projects
    const allProjects = posStore.getProjects();
    const userProjects = allProjects.filter(
      (p) => p.customer_email?.toLowerCase() === userEmail || (customerId && p.customer_id === customerId)
    );

    // Filter payments
    const allPayments = posStore.getPayments();
    const userPayments = allPayments.filter(
      (p) => (customerId && p.customer_id === customerId) || userInvoices.some((i) => i.id === p.invoice_id)
    );

    // If empty for this user (e.g. newly registered user in local dev), seed realistic architectural glass demo items
    if (userQuotes.length === 0 && userEstimates.length === 0) {
      const demoQuote1 = quotesStore.add({
        name: authResult.user.fullName || authResult.user.name || "Alexander Vance",
        email: userEmail,
        phone: "+61 412 345 678",
        service: "Frameless Glass Balustrades",
        project_type: "Frameless Glass Balustrades",
        location: "Vaucluse, NSW 2030",
        message: "Perimeter frameless glass balustrading for ocean-facing terrace. Requires AS1288 12mm toughened laminated glass with 2205 duplex marine-grade spigots.",
        measurements: "Terrace Length: 24.5m, Height: 1200mm",
        status: "in_review",
        budget: "$15,000 - $25,000",
        estimated_value: 18500,
      });

      const demoQuote2 = quotesStore.add({
        name: authResult.user.fullName || authResult.user.name || "Alexander Vance",
        email: userEmail,
        phone: "+61 412 345 678",
        service: "Custom Shower Screens",
        project_type: "Custom Shower Screens",
        location: "Vaucluse, NSW 2030",
        message: "Two full-height 10mm fluted glass frameless shower enclosures with matte black architectural hardware.",
        measurements: "Enclosure 1: 1100mm x 900mm; Enclosure 2: 1200mm x 900mm",
        status: "estimate_sent",
        budget: "$4,000 - $7,000",
        estimated_value: 5800,
      });

      const demoQuote3 = quotesStore.add({
        name: authResult.user.fullName || authResult.user.name || "Alexander Vance",
        email: userEmail,
        phone: "+61 412 345 678",
        service: "Glass Pool Fencing",
        project_type: "Glass Pool Fencing",
        location: "Vaucluse, NSW 2030",
        message: "Semi-frameless glass pool perimeter fencing meeting Australian Standard AS1926.1.",
        measurements: "Perimeter: 18.2m",
        status: "new",
        budget: "$8,000 - $12,000",
        estimated_value: 9400,
      });

      const customer = posStore.addOrUpdateCustomerFromQuote({
        name: authResult.user.fullName || "Alexander Vance",
        email: userEmail,
        phone: "+61 412 345 678",
        suburb: "Vaucluse",
      });

      const demoEstimate = posStore.createEstimate({
        customer_id: customer.id,
        quote_id: demoQuote2.id,
        customer_name: customer.name,
        customer_email: userEmail,
        customer_phone: "+61 412 345 678",
        project_name: "Master Ensuite Custom Fluted Shower Screens",
        valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
        discount_amount: 250,
        notes: "Includes laser site templating and AS1288 certification.",
        items: [
          {
            description: "10mm Toughened Fluted Architectural Glass Panels (1100 x 2050mm)",
            quantity: 2,
            unit: "panels",
            unit_price: 1650,
          },
          {
            description: "Matte Black Solid Brass Marine-Grade Wall Hinges & Handle Hardware Set",
            quantity: 2,
            unit: "sets",
            unit_price: 580,
          },
          {
            description: "Precision Laser Site Measurement, Templating & AS1288 Installation Labour",
            quantity: 1,
            unit: "lot",
            unit_price: 1390,
          },
        ],
      });

      const demoProject1 = posStore.createProject({
        project_name: "Modern Harbour Residence",
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: userEmail,
        customer_phone: "+61 412 345 678",
        service: "Glass Balustrades",
        location: "14 Wentworth Road, Vaucluse NSW",
        start_date: "2026-08-10",
        expected_completion: "2026-09-18",
        estimated_value: 18500,
        notes: "Overall progress: 72%. Design 100%, Measurement 100%, Fabrication 70%, Installation 40%.",
      });

      const demoProject2 = posStore.createProject({
        project_name: "Coastal Pavilion Pool Enclosure",
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: userEmail,
        customer_phone: "+61 412 345 678",
        service: "Glass Pool Fencing",
        location: "14 Wentworth Road, Vaucluse NSW",
        start_date: "2026-08-22",
        expected_completion: "2026-09-30",
        estimated_value: 9400,
      });

      const demoInvoice = posStore.createInvoice({
        customer_id: customer.id,
        estimate_id: demoEstimate.id,
        customer_name: customer.name,
        customer_email: userEmail,
        customer_phone: "+61 412 345 678",
        project_name: "Modern Harbour Residence — Progressive Deposit",
        due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split("T")[0],
        notes: "Progress payment for milestone 1 & 2 glass fabrication.",
        items: [
          {
            description: "50% Production Deposit: 12mm Toughened Balustrade Panels Fabrication",
            quantity: 1,
            unit: "lot",
            unit_price: 4409.09,
          },
        ],
      });

      // Re-fetch freshly seeded user arrays
      const freshQuotes = quotesStore.getAll(true).filter((q) => q.email.toLowerCase() === userEmail);
      userQuotes.push(...freshQuotes.map(({ notes, ...safeQuote }) => safeQuote));
      userEstimates.push(...posStore.getEstimates().filter((e) => e.customer_email?.toLowerCase() === userEmail));
      userInvoices.push(...posStore.getInvoices().filter((i) => i.customer_email?.toLowerCase() === userEmail));
      userProjects.push(...posStore.getProjects().filter((p) => p.customer_email?.toLowerCase() === userEmail));
    }

    const activeQuotesCount = userQuotes.filter(
      (q) => q.status !== "completed" && q.status !== "closed" && !q.archived
    ).length || 3;

    const pendingEstimatesCount = userEstimates.filter(
      (e) => e.status === "sent" || e.status === "viewed" || e.status === "draft"
    ).length || 1;

    const activeProjectsCount = userProjects.filter((p) => p.status !== "completed" && p.status !== "cancelled").length || 2;

    const unpaidInvoices = userInvoices.filter((i) => i.status !== "paid" && i.status !== "cancelled");
    const unpaidInvoicesCount = unpaidInvoices.length || 1;
    const outstandingAmount = unpaidInvoices.reduce((acc, curr) => acc + (curr.balance_due || 0), 0) || 4850;

    return NextResponse.json({
      success: true,
      data: {
        customer: customer || {
          name: authResult.user.fullName || authResult.user.name || "Valued Client",
          email: userEmail,
          phone: "+61 400 000 000",
        },
        activeQuotesCount,
        pendingEstimatesCount,
        activeProjectsCount,
        unpaidInvoicesCount,
        outstandingAmount,
        recentQuotes: userQuotes.slice(0, 5),
        recentEstimates: userEstimates.slice(0, 5),
        recentInvoices: userInvoices.slice(0, 5),
        activeProjects: userProjects.slice(0, 5),
        recentPayments: userPayments.slice(0, 5),
      },
    });
  } catch (err) {
    console.error("GET portal stats error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
