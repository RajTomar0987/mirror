import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;

    const logs = posStore.getActivityLogs(limit);
    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error("GET activity logs error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
