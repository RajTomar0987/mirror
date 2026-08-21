import { IEmailProvider } from "./types";
import { MockEmailProvider } from "./providers/mockProvider";
import { ResendEmailProvider } from "./providers/resendProvider";

export function getEmailProvider(): IEmailProvider {
  const providerType = (process.env.EMAIL_PROVIDER || "mock").toLowerCase();
  const apiKey = process.env.EMAIL_API_KEY;

  if (providerType === "resend" && apiKey && !apiKey.includes("placeholder")) {
    return new ResendEmailProvider(apiKey);
  }

  // Fallback to MockEmailProvider for local development & testing
  return new MockEmailProvider();
}
