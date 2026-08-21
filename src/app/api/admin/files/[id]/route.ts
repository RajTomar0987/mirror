import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.isAdmin) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from("quote_files")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !fileRecord) {
      return NextResponse.json({ success: false, error: "File record not found" }, { status: 404 });
    }

    // Generate signed download URL if stored in Supabase Storage
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
        .from("quote-files")
        .createSignedUrl(fileRecord.file_url, 60 * 15); // 15 min expiry

      if (!signedError && signedUrlData?.signedUrl) {
        return NextResponse.redirect(signedUrlData.signedUrl);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: fileRecord.id,
        file_name: fileRecord.file_name,
        file_url: fileRecord.file_url,
        mime_type: fileRecord.mime_type,
        file_size: fileRecord.file_size,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
