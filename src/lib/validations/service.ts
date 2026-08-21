import { z } from "zod";

export const serviceSchema = z.object({
  slug: z.string().min(2).max(100),
  title: z.string().min(2).max(200),
  short_description: z.string().optional(),
  description: z.string().min(10).max(1000),
  content: z.string().min(10).max(5000),
  features: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  compliance: z.string().min(5),
  bg_class: z.string().optional(),
  hero_image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  process: z.array(z.object({
    step: z.string(),
    title: z.string(),
    description: z.string(),
  })).default([]),
  published: z.boolean().default(false),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
