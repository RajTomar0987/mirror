import { supabaseAdmin } from "./supabase-server";

export async function verifyAdminSession(
  request: Request
): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    let token: string | null = null;

    // 1. Try Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // 2. Try Cookie header if no Bearer token
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/cgi_admin_session=([^;]+)/);
        if (match) {
          token = match[1];
        } else {
          const authMatch = cookieHeader.match(/cgi_auth_session=([^;]+)/);
          if (authMatch) {
            token = authMatch[1];
          }
        }
      }
    }

    if (!token) {
      return { isAdmin: false, error: "Unauthorized: Missing authentication token" };
    }

    // Handle mock token for local dev when Supabase keys are placeholders
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      if (token === "dev-mock-admin-token" || token.includes("-admin-")) {
        return { isAdmin: true, userId: "dev-mock-admin-id" };
      }

      // Check if token belongs to normal user
      if (token.includes("-user-")) {
        return {
          isAdmin: false,
          error: "Forbidden: Your account does not possess administrator privileges.",
        };
      }

      return { isAdmin: false, error: "Unauthorized: Invalid or expired session token" };
    }

    // 3. Verify token with Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return { isAdmin: false, error: "Unauthorized: Invalid or expired session token" };
    }

    // 4. Verify user possesses admin role in public.profiles or public.admins table
    const { data: profileRecord } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (profileRecord?.role === "admin") {
      return { isAdmin: true, userId: user.id };
    }

    const { data: adminRecord } = await supabaseAdmin
      .from("admins")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (adminRecord?.role === "admin") {
      return { isAdmin: true, userId: user.id };
    }

    return {
      isAdmin: false,
      userId: user.id,
      error: "Forbidden: Your account does not possess administrator privileges.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return { isAdmin: false, error: message };
  }
}
