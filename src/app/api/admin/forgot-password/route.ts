import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const { email } = body || {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      return NextResponse.json({
        success: true,
        message: "If an admin account exists for that email, a password reset link has been sent.",
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/admin/reset-password`,
    });

    if (resetError) {
      console.error("Password reset error:", resetError);
    }

    // Always return a generic success message to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: "If an admin account exists for that email, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password API error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
