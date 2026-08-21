import { NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validations/review";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: "rev-1",
            author: "Marcus Vance",
            rating: 5,
            content: "Flawless frameless glass balustrades installed with extreme precision on our waterfront balcony.",
            service_type: "Glass Balustrades",
            suburb: "Mosman",
            approved: true,
          },
          {
            id: "rev-2",
            author: "Elena Rostova",
            rating: 5,
            content: "Custom 10mm shower screen screen with matte black hinges transformed our master bathroom.",
            service_type: "Shower Screens",
            suburb: "Vaucluse",
            approved: true,
          },
        ],
      });
    }

    const { data: dbReviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error || !dbReviews) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: dbReviews });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review input",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { author, rating, content, service_type, suburb } = validationResult.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json(
        {
          success: true,
          data: {
            id: `mock-review-${Date.now()}`,
            author,
            rating,
            content,
            approved: false,
            message: "Review submitted for admin approval (Development Mode).",
          },
        },
        { status: 201 }
      );
    }

    const { data: review, error: dbError } = await supabase
      .from("reviews")
      .insert([
        {
          author,
          rating,
          content,
          service_type,
          suburb,
          approved: false, // Requires admin approval!
        },
      ])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
