export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface IEmailProvider {
  name: string;
  send(payload: EmailPayload): Promise<EmailSendResult>;
}
