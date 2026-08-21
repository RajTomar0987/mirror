import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const MAX_FILES_COUNT = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const quoteId = formData.get("quoteId") as string;
    const files = formData.getAll("files") as File[];

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: "Missing quoteId in upload payload" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "No files attached to quote" },
        { status: 200 }
      );
    }

    if (files.length > MAX_FILES_COUNT) {
      return NextResponse.json(
        { success: false, error: `Exceeded maximum file limit of ${MAX_FILES_COUNT} files.` },
        { status: 400 }
      );
    }

    const uploadedFiles: Array<{ id: string; name: string; path: string; size: number }> = [];

    for (const file of files) {
      // 1. File Size Validation
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the maximum allowed size of 5MB.` },
          { status: 400 }
        );
      }

      // 2. MIME Type Validation
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" has an unsupported format. Allowed formats: JPEG, PNG, WebP, PDF.` },
          { status: 400 }
        );
      }

      // 3. Extension Validation
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { success: false, error: `File extension .${ext} is strictly prohibited.` },
          { status: 400 }
        );
      }

      // 4. Generate Safe Storage Path
      const safeRandomId = Math.random().toString(36).substring(2, 10);
      const safeFilename = `${Date.now()}-${safeRandomId}.${ext}`;
      const storagePath = `quotes/${quoteId}/${safeFilename}`;

      let fileUrl = `/uploads/${storagePath}`;

      // Upload to Supabase Storage bucket if configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: storageData, error: storageError } = await supabaseAdmin.storage
          .from("quote-files")
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (!storageError && storageData) {
          fileUrl = storageData.path;
        }
      }

      // 5. Insert Record into quote_files Table
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        await supabaseAdmin.from("quote_files").insert([
          {
            quote_id: quoteId,
            file_url: fileUrl,
            file_name: file.name,
            mime_type: file.type,
            file_size: file.size,
          },
        ]);
      }

      uploadedFiles.push({
        id: safeRandomId,
        name: file.name,
        path: storagePath,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { success: false, error: "Server upload failure. Please try again." },
      { status: 500 }
    );
  }
}
