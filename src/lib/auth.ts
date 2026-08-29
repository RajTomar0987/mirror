import { supabaseAdmin } from "./supabase-server";
import { usersStore } from "./users-store";

export interface SessionUser {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: "admin" | "user";
}

function extractToken(request: Request): string | null {
  // 1. Try Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 2. Try Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const adminMatch = cookieHeader.match(/cgi_admin_session=([^;]+)/);
    if (adminMatch) return adminMatch[1];

    const authMatch = cookieHeader.match(/cgi_auth_session=([^;]+)/);
    if (authMatch) return authMatch[1];
  }

  return null;
}

export async function verifyUserSession(
  request: Request
): Promise<{ isAuthenticated: boolean; user?: SessionUser; error?: string }> {
  try {
    const token = extractToken(request);
    if (!token) {
      return { isAuthenticated: false, error: "Unauthorized: Missing authentication token" };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isMockEnv =
      !supabaseUrl ||
      supabaseUrl.includes("your-project") ||
      supabaseUrl.includes("placeholder") ||
      supabaseUrl.includes("mock");

    if (isMockEnv) {
      if (token === "dev-mock-admin-token" || token.includes("-admin-")) {
        return {
          isAuthenticated: true,
          user: {
            id: "dev-mock-admin-id",
            email: "admin@completeglass.com.au",
            fullName: "CGI Administrator",
            name: "CGI Administrator",
            role: "admin",
          },
        };
      }

      // Check usersStore for user tokens
      const allUsers = usersStore.getAll();
      const matchedUser = allUsers.find((u) => token.includes(u.id) || token.includes(u.role)) || allUsers[0];

      if (matchedUser) {
        return {
          isAuthenticated: true,
          user: {
            id: matchedUser.id,
            email: matchedUser.email,
            fullName: matchedUser.fullName,
            name: matchedUser.fullName,
            role: matchedUser.role,
          },
        };
      }

      return {
        isAuthenticated: true,
        user: {
          id: "dev-mock-user-id",
          email: "customer@example.com.au",
          fullName: "Valued Customer",
          name: "Valued Customer",
          role: "user",
        },
      };
    }

    // Verify token with Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return { isAuthenticated: false, error: "Unauthorized: Invalid or expired session token" };
    }

    // Fetch user profile
    const { data: profileRecord } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", user.id)
      .single();

    const role: "admin" | "user" = profileRecord?.role === "admin" ? "admin" : "user";

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email || profileRecord?.email || "",
        fullName: profileRecord?.full_name || user.email || "",
        name: profileRecord?.full_name || user.email || "",
        role,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return { isAuthenticated: false, error: message };
  }
}

export async function verifyAdminSession(
  request: Request
): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return { isAdmin: false, error: authResult.error || "Unauthorized: Missing authentication token" };
    }

    if (authResult.user.role !== "admin") {
      return {
        isAdmin: false,
        userId: authResult.user.id,
        error: "Forbidden: Your account does not possess administrator privileges.",
      };
    }

    return { isAdmin: true, userId: authResult.user.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return { isAdmin: false, error: message };
  }
}
