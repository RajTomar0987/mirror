import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCustomerContactConfirmation, sendAdminContactNotification } from "@/services/emailService";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 0. Rate limiting anti-abuse check
    const clientIp = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many messages submitted. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please review your message input.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = validationResult.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      // Non-blocking email dispatch in dev mode
      try {
        await Promise.allSettled([
          sendCustomerContactConfirmation({ name, email, message }),
          sendAdminContactNotification({ name, email, phone, message }),
        ]);
      } catch (e) {
        console.error("Non-blocking contact email error (dev mode):", e);
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: `mock-msg-${Date.now()}`,
            name,
            email,
            status: "unread",
            message: "Contact message received successfully (Development Mode).",
          },
        },
        { status: 201 }
      );
    }

    const { data: contactMsg, error: dbError } = await supabaseAdmin
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message,
          status: "unread",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error on /api/contact:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to submit message. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Non-blocking email notifications
    try {
      await Promise.allSettled([
        sendCustomerContactConfirmation({ name: contactMsg.name, email: contactMsg.email, message: contactMsg.message }),
        sendAdminContactNotification({ name: contactMsg.name, email: contactMsg.email, phone: contactMsg.phone || undefined, message: contactMsg.message }),
      ]);
    } catch (emailErr) {
      console.error("Non-blocking contact email error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: contactMsg,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in /api/contact:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
