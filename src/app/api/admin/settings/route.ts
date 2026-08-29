import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { CompanySettings } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const settings = posStore.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    console.error("GET settings error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<CompanySettings>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid settings payload" }, { status: 400 });
    }

    // Validate GST rate if provided
    if (body.gst_rate !== undefined) {
      const rate = Number(body.gst_rate);
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return NextResponse.json({ success: false, error: "GST rate must be between 0 and 1 (e.g. 0.10 for 10%)" }, { status: 400 });
      }
    }

    const updated = posStore.updateSettings(body);
    posStore.logActivity(
      "admin@completeglass.com.au",
      "SETTINGS_UPDATED",
      "settings",
      "company_settings",
      "Updated business company profile and tax configuration"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH settings error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
