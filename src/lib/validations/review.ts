import { z } from "zod";

export const reviewSchema = z.object({
  author: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10).max(1000),
  service_type: z.string().optional(),
  suburb: z.string().optional(),
  approved: z.boolean().default(false),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
