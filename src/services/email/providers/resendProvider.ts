import { IEmailProvider, EmailPayload, EmailSendResult } from "../types";
import { BUSINESS_CONFIG } from "@/config/business";

export class ResendEmailProvider implements IEmailProvider {
  name = "resend";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const fromAddress = payload.from || `${BUSINESS_CONFIG.name} <onboarding@resend.dev>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          reply_to: payload.replyTo,
        }),
      });

      const data = (await res.json()) as { message?: string; id?: string };

      if (!res.ok) {
        return {
          success: false,
          error: data?.message || "Resend API error",
          provider: "resend",
        };
      }

      return {
        success: true,
        messageId: data?.id,
        provider: "resend",
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error contacting Resend API";
      return {
        success: false,
        error: errorMessage,
        provider: "resend",
      };
    }
  }
}
