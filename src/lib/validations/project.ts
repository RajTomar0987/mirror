import { z } from "zod";

export const projectSchema = z.object({
  slug: z.string().min(2).max(100),
  title: z.string().min(2).max(200),
  subtitle: z.string().optional(),
  description: z.string().min(10).max(1000),
  content: z.string().min(10).max(5000),
  project_type: z.enum(["Residential", "Commercial", "Other"]),
  location: z.string().min(2).max(100),
  services_used: z.array(z.string()).default([]),
  client_name: z.string().min(2).max(100),
  year: z.string().min(4).max(10),
  before_image: z.string().optional(),
  after_image: z.string().optional(),
  hero_image: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  published: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;
