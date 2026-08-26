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
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
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
  suburb?: string;
  location?: string;
  service?: string;
  project_type?: string;
  description?: string;
  message?: string;
  budget?: string;
  notes?: string;
  preferredContact?: "email" | "phone" | "sms";
  preferred_contact?: "email" | "phone" | "sms" | string;
  status?: "new" | "contacted" | "completed" | "pending" | "reviewed" | "quote_sent" | "in_progress" | "closed" | string;
  createdAt?: string;
  created_at?: string;
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
