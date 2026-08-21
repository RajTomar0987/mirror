import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validations/quote";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCustomerQuoteConfirmation, sendAdminQuoteNotification } from "@/services/emailService";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 0. Rate limiting anti-abuse check
    const clientIp = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many quote requests submitted. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Validate payload with Zod schema
    const validationResult = quoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please review your input fields.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, phone, email, suburb, service, description, preferredContact } = validationResult.data;

    // Check if Supabase environment is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const mockId = `mock-quote-${Date.now()}`;
      
      // Non-blocking email dispatch in dev/mock mode
      try {
        await Promise.allSettled([
          sendCustomerQuoteConfirmation({
            quoteId: mockId,
            name,
            email,
            phone,
            suburb,
            service,
            description,
            preferredContact,
          }),
          sendAdminQuoteNotification({
            quoteId: mockId,
            name,
            email,
            phone,
            suburb,
            service,
            description,
            preferredContact,
          }),
        ]);
      } catch (e) {
        console.error("Non-blocking email dispatch error (dev mode):", e);
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: mockId,
            name,
            service,
            status: "new",
            message: "Quote request received successfully (Development Mode).",
          },
        },
        { status: 201 }
      );
    }

    // 2. Insert into Supabase database via admin client
    const { data: quote, error: dbError } = await supabaseAdmin
      .from("quotes")
      .insert([
        {
          name,
          phone,
          email,
          suburb,
          service,
          description,
          preferred_contact: preferredContact,
          status: "new",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error on /api/quotes:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to store quote request. Please try again later.",
        },
        { status: 500 }
      );
    }

    // 3. Non-blocking email notifications (Failure will NOT break customer submission state)
    try {
      await Promise.allSettled([
        sendCustomerQuoteConfirmation({
          quoteId: quote.id,
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          suburb: quote.suburb,
          service: quote.service,
          description: quote.description,
          preferredContact: quote.preferred_contact,
        }),
        sendAdminQuoteNotification({
          quoteId: quote.id,
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          suburb: quote.suburb,
          service: quote.service,
          description: quote.description,
          preferredContact: quote.preferred_contact,
        }),
      ]);
    } catch (emailErr) {
      console.error("Non-blocking email notification error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: quote,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in /api/quotes:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
