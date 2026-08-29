import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { usersStore } from "@/lib/users-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };
    const { fullName, email, password, confirmPassword } = body || {};

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      const existingUser = usersStore.findByEmail(cleanEmail);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists. Please log in." },
          { status: 409 }
        );
      }

      // Normal signup ALWAYS creates role = 'user'
      const newUser = usersStore.addUser({
        email: cleanEmail,
        password,
        fullName: cleanName,
        role: "user",
      });

      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully. You can now log in with your credentials.",
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.fullName,
            fullName: newUser.fullName,
            role: "user",
          },
        },
        { status: 201 }
      );
    }

    // 1. Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: authError.status || 400 }
      );
    }

    const userId = authData.user?.id;

    // 2. Ensure profile in public.profiles with role = 'user' (NEVER 'admin' from public signup)
    if (userId) {
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
        {
          id: userId,
          email: cleanEmail,
          full_name: cleanName,
          role: "user",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.warn("Notice: public.profiles table upsert warning:", profileError.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        data: {
          id: userId,
          email: cleanEmail,
          fullName: cleanName,
          role: "user",
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Sign up error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during sign up." },
      { status: 500 }
    );
  }
}
