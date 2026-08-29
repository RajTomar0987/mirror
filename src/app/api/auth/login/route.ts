import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { usersStore } from "@/lib/users-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string; remember?: boolean };
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      const user = usersStore.findByEmail(cleanEmail);

      if (!user || user.password !== password) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const mockToken = `auth-token-${user.role}-${Date.now()}`;
      const response = NextResponse.json({
        success: true,
        data: {
          access_token: mockToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.fullName,
            fullName: user.fullName,
            role: user.role,
          },
        },
      });

      // Set cookie for session persistence
      response.cookies.set("cgi_auth_session", mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (user.role === "admin") {
        response.cookies.set("cgi_admin_session", mockToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return response;
    }

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError || !authData.session || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    // 2. Fetch role from public.profiles table (and fallback to public.admins)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", authData.user.id)
      .single();

    let userRole: "admin" | "user" = profile?.role === "admin" ? "admin" : "user";

    // Fallback check against public.admins
    if (userRole !== "admin") {
      const { data: adminCheck } = await supabaseAdmin
        .from("admins")
        .select("id, role")
        .eq("id", authData.user.id)
        .single();
      if (adminCheck?.role === "admin") {
        userRole = "admin";
      }
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
          name: profile?.full_name || authData.user.user_metadata?.full_name || "",
          fullName: profile?.full_name || authData.user.user_metadata?.full_name || "",
          role: userRole,
        },
      },
    });

    // Set secure session cookie
    response.cookies.set("cgi_auth_session", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    if (userRole === "admin") {
      response.cookies.set("cgi_admin_session", authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (err) {
    console.error("Auth login error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during login." },
      { status: 500 }
    );
  }
}
