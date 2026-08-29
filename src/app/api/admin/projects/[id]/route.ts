import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { POSProjectStatus } from "@/types";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    const project = posStore.getProjectById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("GET project detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface PatchPOSProjectBody {
  status?: POSProjectStatus;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    const body = (await request.json()) as PatchPOSProjectBody;
    const { status } = body || {};

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updated = posStore.updateProjectStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH project error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
