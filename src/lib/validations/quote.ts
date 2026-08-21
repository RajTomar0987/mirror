import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(8, "Phone number must be at least 8 digits").max(20),
  email: z.string().email("Invalid email address"),
  suburb: z.string().min(2, "Suburb must be at least 2 characters").max(100),
  service: z.string().min(2, "Please select a service"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  preferredContact: z.enum(["email", "phone", "sms"]),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
