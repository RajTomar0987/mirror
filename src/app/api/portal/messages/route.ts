import { NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/auth";
import { posStore } from "@/lib/pos-store";

interface PortalMessage {
  id: string;
  sender_email: string;
  sender_name: string;
  is_staff: boolean;
  message: string;
  created_at: string;
}

const portalMessagesStore: Record<string, PortalMessage[]> = {
  "alexander.vance@vancearchitects.com.au": [
    {
      id: "msg-1",
      sender_email: "admin@completeglass.com.au",
      sender_name: "Complete Glass Innovations",
      is_staff: true,
      message: "Hi Alexander, your balustrade panels have completed tempering and are scheduled for installation on Tuesday.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "msg-2",
      sender_email: "alexander.vance@vancearchitects.com.au",
      sender_name: "Alexander Vance",
      is_staff: false,
      message: "Thanks! Will the team need access to the lower terrace gate?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: "msg-3",
      sender_email: "admin@completeglass.com.au",
      sender_name: "Complete Glass Innovations",
      is_staff: true,
      message: "Yes please, that will allow our installers to hoist the 12mm panels directly onto the perimeter deck.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
  ],
};

export async function GET(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const thread = portalMessagesStore[userEmail] || [
      {
        id: "welcome-msg",
        sender_email: "support@completeglass.com.au",
        sender_name: "Complete Glass Innovations Support",
        is_staff: true,
        message: "Welcome to your Client Portal! If you have any questions regarding your architectural glazing project, quotes, or scheduling, please message us directly here.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];

    return NextResponse.json({ success: true, data: thread });
  } catch (err) {
    console.error("GET portal messages error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyUserSession(request);
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const userEmail = authResult.user.email.toLowerCase().trim();
    const body = (await request.json()) as { message?: string };
    const { message } = body || {};

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message content cannot be empty" }, { status: 400 });
    }

    if (!portalMessagesStore[userEmail]) {
      portalMessagesStore[userEmail] = [];
    }

    const newMessage: PortalMessage = {
      id: `msg-${Date.now()}`,
      sender_email: userEmail,
      sender_name: authResult.user.fullName || authResult.user.name || "Customer",
      is_staff: false,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    portalMessagesStore[userEmail].push(newMessage);

    posStore.logActivity(
      userEmail,
      "CUSTOMER_MESSAGE_SENT",
      "customer",
      authResult.user.id,
      `Customer sent message: "${message.trim().slice(0, 50)}..."`
    );

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (err) {
    console.error("POST portal message error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
