import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { PROJECTS_DATA } from "@/data/projects";
import { POSProjectStatus } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    const posProjectsList = customerId
      ? posStore.getProjectsByCustomerId(customerId)
      : posStore.getProjects();

    return NextResponse.json({
      success: true,
      data: posProjectsList,
      portfolioProjects: PROJECTS_DATA,
    });
  } catch (err) {
    console.error("GET projects error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface CreatePOSProjectBody {
  project_name?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  service?: string;
  location?: string;
  start_date?: string;
  expected_completion?: string;
  quote_id?: string;
  estimate_id?: string;
  notes?: string;
  images?: string[];
  estimated_value?: number;
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreatePOSProjectBody;
    const {
      project_name,
      customer_id,
      customer_name,
      customer_email,
      service,
      location,
      start_date,
      expected_completion,
      quote_id,
      estimate_id,
      notes,
      images,
      estimated_value,
    } = body || {};

    if (!project_name || !customer_id) {
      return NextResponse.json(
        { success: false, error: "Project name and customer are required" },
        { status: 400 }
      );
    }

    const customer = posStore.getCustomerById(customer_id);

    const project = posStore.createProject({
      project_name,
      customer_id,
      customer_name: customer_name || customer?.name || "Client",
      customer_email: customer_email || customer?.email || "",
      service: service || "Custom Architectural Glazing",
      location: location || customer?.address || customer?.suburb || "Sydney, NSW",
      start_date,
      expected_completion,
      quote_id,
      estimate_id,
      notes,
      images,
      estimated_value: Number(estimated_value) || 0,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error("POST project error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
