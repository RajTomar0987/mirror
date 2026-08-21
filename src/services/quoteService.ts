import { QuoteRequest } from "@/types";

export async function submitQuoteRequest(data: QuoteRequest): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as { success?: boolean; error?: string; data?: unknown };

    if (!response.ok || !result?.success) {
      return {
        success: false,
        error: result?.error || "Failed to submit quote request.",
      };
    }

    return {
      success: true,
      data: result?.data,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network or connection error";
    return {
      success: false,
      error: message,
    };
  }
}
