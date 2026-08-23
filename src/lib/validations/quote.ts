import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(8, "Phone number must be at least 8 digits").max(20),
  email: z.string().email("Invalid email address"),
  suburb: z.string().optional().default("Not specified"),
  service: z.string().optional(),
  projectType: z.string().optional(),
  description: z.string().optional(),
  message: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "sms"]).optional().default("email"),
}).refine(
  (data) => (data.service && data.service.length >= 2) || (data.projectType && data.projectType.length >= 2),
  { message: "Please specify a service or project type", path: ["service"] }
).refine(
  (data) => (data.description && data.description.length >= 10) || (data.message && data.message.length >= 10),
  { message: "Project description/message must be at least 10 characters", path: ["description"] }
);

export type QuoteInput = z.infer<typeof quoteSchema>;
