export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  service?: string;
  message: string;
}

export async function submitContactRequest(data: ContactRequest): Promise<{ success: boolean; message?: string; error?: string; data?: unknown }> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as { success?: boolean; message?: string; error?: string; data?: unknown };

    if (!response.ok || !result?.success) {
      return {
        success: false,
        error: result?.message || result?.error || "Failed to submit contact request.",
      };
    }

    return {
      success: true,
      message: result?.message || "Contact enquiry received successfully.",
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
