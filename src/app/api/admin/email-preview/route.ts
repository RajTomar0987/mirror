import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { generateQuoteConfirmationEmail } from "@/services/email/templates/quoteConfirmation";
import { generateQuoteAdminNotificationEmail } from "@/services/email/templates/quoteAdminNotification";
import { generateContactConfirmationEmail } from "@/services/email/templates/contactConfirmation";
import { generateContactAdminNotificationEmail } from "@/services/email/templates/contactAdminNotification";
import { generateQuoteStatusEmail } from "@/services/email/templates/quoteStatus";

export async function GET(request: Request) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "quote-customer";

  const sampleQuote = {
    quoteId: "quote-sample-101",
    name: "Eleanor Vance",
    email: "eleanor@example.com",
    phone: "0412 345 678",
    suburb: "Vaucluse",
    service: "Glass Balustrades",
    description: "Custom frameless glass balustrade for a 12m harbourdeck with marine-grade 2205 spigots.",
    preferredContact: "Email",
    filesCount: 2,
  };

  let rendered = { html: "", subject: "" };

  switch (type) {
    case "quote-customer":
      rendered = generateQuoteConfirmationEmail(sampleQuote);
      break;
    case "quote-admin":
      rendered = generateQuoteAdminNotificationEmail(sampleQuote);
      break;
    case "contact-customer":
      rendered = generateContactConfirmationEmail({ name: sampleQuote.name, message: sampleQuote.description });
      break;
    case "contact-admin":
      rendered = generateContactAdminNotificationEmail({ name: sampleQuote.name, email: sampleQuote.email, phone: sampleQuote.phone, message: sampleQuote.description });
      break;
    case "quote-status":
      rendered = generateQuoteStatusEmail({ name: sampleQuote.name, quoteId: sampleQuote.quoteId, service: sampleQuote.service, status: "in_progress", notes: "Site measure scheduled for Thursday 10:00 AM." });
      break;
    default:
      rendered = generateQuoteConfirmationEmail(sampleQuote);
  }

  return new NextResponse(rendered.html, {
    headers: { "Content-Type": "text/html" },
  });
}
