import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";
import { usersStore } from "@/lib/users-store";
import { Customer } from "@/types";

export async function GET(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const customer = posStore.getCustomerByEmail(userEmail);

    return NextResponse.json({
      success: true,
      data: {
        id: customer?.id || authResult.user.id,
        name: customer?.name || authResult.user.fullName || authResult.user.name || "Valued Client",
        email: userEmail,
        phone: customer?.phone || "+61 400 000 000",
        company: customer?.company || "",
        address: customer?.address || "",
        suburb: customer?.suburb || "Sydney",
        state: customer?.state || "NSW",
        postcode: customer?.postcode || "2000",
      },
    });
  } catch (err) {
    console.error("GET portal profile error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

interface UpdateProfileBody {
  name?: string;
  phone?: string;
  company?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

export async function PATCH(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const body = (await request.json()) as UpdateProfileBody;
    const { name, phone, company, address, suburb, state, postcode } = body || {};

    let customer = posStore.getCustomerByEmail(userEmail);
    if (!customer) {
      customer = posStore.addOrUpdateCustomerFromQuote({
        name: name || authResult.user.fullName || "Valued Client",
        email: userEmail,
        phone: phone || "+61 400 000 000",
        suburb: suburb || "Sydney",
      });
    }

    const updated = posStore.updateCustomer(customer.id, {
      name: name || customer.name,
      phone: phone || customer.phone,
      company: company !== undefined ? company : customer.company,
      address: address !== undefined ? address : customer.address,
      suburb: suburb || customer.suburb,
      state: state || customer.state,
      postcode: postcode || customer.postcode,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("PATCH portal profile error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
