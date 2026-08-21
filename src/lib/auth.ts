import { supabaseAdmin } from "./supabase-server";

export async function verifyAdminSession(request: Request): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Unauthorized: Missing Authorization token header" };
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return { isAdmin: false, error: "Unauthorized: Invalid or expired session token" };
    }

    // Verify user exists in public.admins table
    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .single();

    if (adminError || !adminRecord) {
      return { isAdmin: false, userId: user.id, error: "Forbidden: User does not possess administrative privileges" };
    }

    return { isAdmin: true, userId: user.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return { isAdmin: false, error: message };
  }
}
