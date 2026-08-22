export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  content: string;
  features: string[];
  specs: Record<string, string>;
  compliance: string;
  bgClass?: string;
  imageUrl?: string;
  heroImage?: string;
  gallery?: string[];
  process?: ProcessStep[];
  published?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  project_type: string; // 'Residential' | 'Commercial'
  location: string;
  services_used: string[];
  client_name: string;
  year: string;
  beforeImage?: string;
  afterImage?: string;
  heroImage?: string;
  images?: string[];
  gallery?: string[];
  challenge?: string;
  solution?: string;
  specs?: Record<string, string>;
  published?: boolean;
}

export interface QuoteRequest {
  id?: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  description: string;
  preferredContact: "email" | "phone" | "sms";
  status?: "pending" | "reviewed" | "contacted" | "completed";
  createdAt?: string;
}

export interface Review {
  id?: string;
  author: string;
  rating: number;
  content: string;
  serviceType?: string;
  suburb?: string;
  date?: string;
  approved?: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: "unread" | "read" | "archived";
  createdAt?: string;
}
