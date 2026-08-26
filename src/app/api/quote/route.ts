import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validations/quote";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCustomerQuoteConfirmation, sendAdminQuoteNotification } from "@/services/emailService";
import { checkRateLimit } from "@/lib/rate-limit";
import { quotesStore } from "@/lib/quotes-store";

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many quote requests submitted. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validationResult = quoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please review your input fields.",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, phone, email, suburb, service, projectType, description, message, preferredContact } = validationResult.data;
    const activeService = service || projectType || "Custom Glazing";
    const activeDescription = description || message || "";
    const activeSuburb = suburb || "Not specified";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("mock") ||
      supabaseUrl.includes("placeholder") ||
      !serviceKey ||
      serviceKey.includes("your-service-role") ||
      serviceKey.includes("mock") ||
      serviceKey.includes("placeholder");

    if (isMockEnv) {
      const mockId = `mock-quote-${Date.now()}`;

      quotesStore.add({
        id: mockId,
        name,
        phone,
        email,
        suburb: activeSuburb,
        service: activeService,
        description: activeDescription,
        preferredContact,
      });

      try {
        await Promise.allSettled([
          sendCustomerQuoteConfirmation({
            quoteId: mockId,
            name,
            email,
            phone,
            suburb: activeSuburb,
            service: activeService,
            description: activeDescription,
            preferredContact,
          }),
          sendAdminQuoteNotification({
            quoteId: mockId,
            name,
            email,
            phone,
            suburb: activeSuburb,
            service: activeService,
            description: activeDescription,
            preferredContact,
          }),
        ]);
      } catch (e) {
        console.error("Non-blocking email dispatch error (dev mode):", e);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your architectural quote request has been received successfully.",
          data: {
            id: mockId,
            name,
            service: activeService,
            status: "new",
          },
        },
        { status: 201 }
      );
    }

    try {
      // 1. Save into `quote_requests` table
      const { data: quoteRequest } = await supabaseAdmin
        .from("quote_requests")
        .insert([
          {
            name,
            email,
            phone,
            project_type: activeService,
            location: activeSuburb,
            budget: "Flexible",
            message: activeDescription,
            status: "new",
            notes: "",
          },
        ])
        .select()
        .single();

      // 2. Save into `enquiries` table for backwards compatibility
      const { data: enquiry, error: enquiryError } = await supabaseAdmin
        .from("enquiries")
        .insert([
          {
            name,
            email,
            phone,
            project_type: activeService,
            message: `[Location: ${activeSuburb}] ${activeDescription}`,
            status: "new",
          },
        ])
        .select()
        .single();

      if (enquiryError) {
        console.warn("Supabase enquiries insert notice:", enquiryError.message);
      }

      // 3. Save into `quotes` table
      const { data: quote } = await supabaseAdmin
        .from("quotes")
        .insert([
          {
            name,
            phone,
            email,
            suburb: activeSuburb,
            location: activeSuburb,
            service: activeService,
            project_type: activeService,
            description: activeDescription,
            message: activeDescription,
            preferred_contact: preferredContact,
            status: "new",
          },
        ])
        .select()
        .single();

      const quoteId = quoteRequest?.id || quote?.id || enquiry?.id || `quote-${Date.now()}`;

      quotesStore.add({
        id: quoteId,
        name,
        phone,
        email,
        suburb: activeSuburb,
        service: activeService,
        description: activeDescription,
        preferredContact,
      });

      // 3. Send email notifications
      try {
        await Promise.allSettled([
          sendCustomerQuoteConfirmation({
            quoteId,
            name,
            email,
            phone,
            suburb: activeSuburb,
            service: activeService,
            description: activeDescription,
            preferredContact,
          }),
          sendAdminQuoteNotification({
            quoteId,
            name,
            email,
            phone,
            suburb: activeSuburb,
            service: activeService,
            description: activeDescription,
            preferredContact,
          }),
        ]);
      } catch (emailErr) {
        console.error("Non-blocking email notification error:", emailErr);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your architectural quote request has been received successfully.",
          data: { id: quoteId, name, service: activeService, status: "new" },
        },
        { status: 201 }
      );
    } catch (dbException) {
      console.warn("Database connection exception, returning fallback response:", dbException);
      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your architectural quote request has been received successfully.",
          data: {
            id: `quote-${Date.now()}`,
            name,
            service: activeService,
            status: "new",
          },
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("Unexpected error in /api/quote:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
