import { IEmailProvider, EmailPayload, EmailSendResult } from "../types";

export class MockEmailProvider implements IEmailProvider {
  name = "mock";

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    console.log("--------------------------------------------------");
    console.log(`[MOCK EMAIL PROVIDER] Dispatched Email`);
    console.log(`To: ${Array.isArray(payload.to) ? payload.to.join(", ") : payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Text Body Preview:\n${payload.text.slice(0, 300)}...`);
    console.log("--------------------------------------------------");

    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      provider: "mock",
    };
  }
}
