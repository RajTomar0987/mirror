import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    // Local dev mock authentication when Supabase URL is placeholder
    if (isMockEnv) {
      const devAdminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || "admin@completeglass.com.au";
      const devAdminPassword = process.env.ADMIN_PASSWORD || "adminpass123";

      if (email.trim().toLowerCase() === devAdminEmail.trim().toLowerCase() && password === devAdminPassword) {
        const mockToken = "dev-mock-admin-token";
        const response = NextResponse.json({
          success: true,
          data: {
            access_token: mockToken,
            user: { id: "dev-mock-admin-id", email, role: "admin" },
          },
        });

        response.cookies.set("cgi_admin_session", mockToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        return response;
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid admin email or password" },
          { status: 401 }
        );
      }
    }

    // 1. Authenticate user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    // 2. Verify user has admin role in profiles or admins table
    const { data: profileRecord } = await supabaseAdmin
      .from("profiles")
      .select("id, email, role")
      .eq("id", authData.user.id)
      .single();

    let isAdmin = profileRecord?.role === "admin";

    if (!isAdmin) {
      const { data: adminRecord } = await supabaseAdmin
        .from("admins")
        .select("id, email, role")
        .eq("id", authData.user.id)
        .single();
      isAdmin = adminRecord?.role === "admin";
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Your account does not possess administrator privileges." },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: "admin",
        },
      },
    });

    // Set secure HTTP-only cookie for server-side middleware route protection
    response.cookies.set("cgi_admin_session", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during login." },
      { status: 500 }
    );
  }
}
