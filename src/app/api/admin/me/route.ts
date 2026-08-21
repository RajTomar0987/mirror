import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: authResult.userId,
      role: "admin",
    },
  });
}
