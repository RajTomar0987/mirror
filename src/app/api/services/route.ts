import { NextResponse } from "next/server";
import { SERVICES_DATA } from "@/data/services";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        data: SERVICES_DATA,
      });
    }

    const { data: dbServices, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("title", { ascending: true });

    if (error || !dbServices || dbServices.length === 0) {
      return NextResponse.json({
        success: true,
        data: SERVICES_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      data: dbServices,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: SERVICES_DATA,
    });
  }
}
