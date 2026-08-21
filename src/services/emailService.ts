import { BUSINESS_CONFIG } from "@/config/business";
import { getEmailProvider } from "./email/emailProvider";
import { generateQuoteConfirmationEmail } from "./email/templates/quoteConfirmation";
import { generateQuoteAdminNotificationEmail } from "./email/templates/quoteAdminNotification";
import { generateContactConfirmationEmail } from "./email/templates/contactConfirmation";
import { generateContactAdminNotificationEmail } from "./email/templates/contactAdminNotification";
import { generateQuoteStatusEmail } from "./email/templates/quoteStatus";

export interface QuoteEmailData {
  quoteId: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  service: string;
  description: string;
  preferredContact: string;
  filesCount?: number;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendCustomerQuoteConfirmation(data: QuoteEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = getEmailProvider();
    const { html, text, subject } = generateQuoteConfirmationEmail(data);
    const result = await provider.send({
      to: data.email,
      subject,
      html,
      text,
    });
    return { success: result.success, error: result.error };
  } catch (err) {
    console.error("[EmailService] Failed to send customer quote confirmation:", err);
    return { success: false, error: "Internal email dispatch error" };
  }
}

export async function sendAdminQuoteNotification(data: QuoteEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = getEmailProvider();
    const { html, text, subject } = generateQuoteAdminNotificationEmail(data);
    const result = await provider.send({
      to: BUSINESS_CONFIG.email,
      subject,
      html,
      text,
      replyTo: data.email,
    });
    return { success: result.success, error: result.error };
  } catch (err) {
    console.error("[EmailService] Failed to send admin quote notification:", err);
    return { success: false, error: "Internal email dispatch error" };
  }
}

export async function sendCustomerContactConfirmation(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = getEmailProvider();
    const { html, text, subject } = generateContactConfirmationEmail(data);
    const result = await provider.send({
      to: data.email,
      subject,
      html,
      text,
    });
    return { success: result.success, error: result.error };
  } catch (err) {
    console.error("[EmailService] Failed to send customer contact confirmation:", err);
    return { success: false, error: "Internal email dispatch error" };
  }
}

export async function sendAdminContactNotification(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = getEmailProvider();
    const { html, text, subject } = generateContactAdminNotificationEmail(data);
    const result = await provider.send({
      to: BUSINESS_CONFIG.email,
      subject,
      html,
      text,
      replyTo: data.email,
    });
    return { success: result.success, error: result.error };
  } catch (err) {
    console.error("[EmailService] Failed to send admin contact notification:", err);
    return { success: false, error: "Internal email dispatch error" };
  }
}

export async function sendQuoteStatusEmail(data: {
  name: string;
  email: string;
  quoteId: string;
  service: string;
  status: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = getEmailProvider();
    const { html, text, subject } = generateQuoteStatusEmail(data);
    const result = await provider.send({
      to: data.email,
      subject,
      html,
      text,
    });
    return { success: result.success, error: result.error };
  } catch (err) {
    console.error("[EmailService] Failed to send quote status email:", err);
    return { success: false, error: "Internal email dispatch error" };
  }
}
