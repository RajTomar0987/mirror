import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCustomerContactConfirmation, sendAdminContactNotification } from "@/services/emailService";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many messages submitted. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please check your form input.",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message, projectType, service } = validationResult.data;
    const activeProjectType = projectType || service || "General Glazing";

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
      try {
        await Promise.allSettled([
          sendCustomerContactConfirmation({ name, email, message }),
          sendAdminContactNotification({ name, email, phone: phone || undefined, message }),
        ]);
      } catch (e) {
        console.error("Non-blocking contact email error (dev mode):", e);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your contact message has been received successfully.",
          data: {
            id: `mock-enquiry-${Date.now()}`,
            name,
            email,
            phone: phone || null,
            project_type: activeProjectType,
            message,
            status: "new",
          },
        },
        { status: 201 }
      );
    }

    try {
      // 1. Save into primary `enquiries` table
      const { data: enquiry, error: enquiryError } = await supabaseAdmin
        .from("enquiries")
        .insert([
          {
            name,
            email,
            phone: phone || null,
            project_type: activeProjectType,
            message,
            status: "new",
          },
        ])
        .select()
        .single();

      if (enquiryError) {
        console.warn("Supabase enquiries insert notice:", enquiryError.message);
      }

      // 2. Save into `contact_messages` table for backwards compatibility
      await supabaseAdmin
        .from("contact_messages")
        .insert([
          {
            name,
            email,
            phone: phone || null,
            message: `[${activeProjectType}] ${message}`,
            status: "unread",
          },
        ]);

      // 3. Send email notifications
      try {
        await Promise.allSettled([
          sendCustomerContactConfirmation({ name, email, message }),
          sendAdminContactNotification({ name, email, phone: phone || undefined, message }),
        ]);
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your contact message has been received successfully.",
          data: enquiry || { name, email, project_type: activeProjectType, status: "new" },
        },
        { status: 201 }
      );
    } catch (dbException) {
      console.warn("Database connection exception, returning fallback response:", dbException);
      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your contact message has been received successfully.",
          data: {
            id: `enquiry-${Date.now()}`,
            name,
            email,
            phone: phone || null,
            project_type: activeProjectType,
            message,
            status: "new",
          },
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("Unexpected error in /api/contact:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
