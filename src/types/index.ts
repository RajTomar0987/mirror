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
  base_price?: string | number;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  project_type: string; // 'Residential' | 'Commercial' | 'Other'
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

// POS Pipeline Statuses
export type QuoteStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "site_visit"
  | "estimate_sent"
  | "accepted"
  | "completed"
  | "closed"
  | "archived";

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
  measurements?: string;
  estimated_value?: number;
  customer_id?: string;
  preferredContact?: "email" | "phone" | "sms";
  preferred_contact?: "email" | "phone" | "sms" | string;
  status?: QuoteStatus | string;
  archived?: boolean;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  company?: string;
  notes?: string;
  quote_count?: number;
  accepted_count?: number;
  projects_count?: number;
  total_value?: number;
  last_activity?: string;
  created_at: string;
  updated_at?: string;
}

export type EstimateStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired";

export interface EstimateItem {
  id: string;
  estimate_id?: string;
  description: string;
  quantity: number;
  unit: string; // e.g. "m", "sqm", "panel", "set", "service", "item", "hours"
  unit_price: number;
  subtotal: number;
  item_order?: number;
}

export interface Estimate {
  id: string;
  estimate_number: string; // e.g. "CGI-0001" or "CGI-EST-0001"
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  quote_id?: string;
  project_id?: string;
  project_name?: string;
  status: EstimateStatus;
  issue_date: string;
  valid_until: string;
  items: EstimateItem[];
  subtotal: number;
  discount_amount: number;
  gst_rate: number; // e.g. 0.10 for 10% Australian GST
  gst_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  sent_at?: string;
  accepted_at?: string;
  converted_to_invoice_id?: string;
  created_at: string;
  updated_at?: string;
}

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";

export interface InvoiceItem {
  id: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  item_order?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string; // e.g. "CGI-INV-0001"
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  project_id?: string;
  project_name?: string;
  estimate_id?: string;
  estimate_number?: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  notes?: string;
  payment_terms?: string;
  created_at: string;
  updated_at?: string;
}

export type PaymentMethod =
  | "bank_transfer"
  | "card"
  | "cash"
  | "cheque"
  | "other";

export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";

export interface Payment {
  id: string;
  payment_number: string; // e.g. "CGI-PAY-0001"
  invoice_id: string;
  invoice_number?: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference_number?: string;
  status: PaymentStatus;
  notes?: string;
  recorded_by?: string;
  created_at: string;
}

export type POSProjectStatus =
  | "quote"
  | "estimate"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface POSProject {
  id: string;
  project_name: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service: string;
  location: string;
  start_date?: string;
  expected_completion?: string;
  actual_completion?: string;
  status: POSProjectStatus;
  quote_id?: string;
  estimate_id?: string;
  invoice_id?: string;
  notes?: string;
  images?: string[];
  estimated_value?: number;
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  admin_user_id?: string;
  admin_email: string;
  action: string; // e.g. "QUOTE_CREATED", "ESTIMATE_SENT", "PAYMENT_RECORDED"
  entity_type: "quote" | "estimate" | "invoice" | "payment" | "project" | "customer" | "service" | "settings";
  entity_id?: string;
  details: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CompanySettings {
  id?: string;
  business_name: string;
  abn: string;
  acn?: string;
  phone: string;
  email: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  gst_rate: number; // 0.10 (10%)
  bank_name: string;
  account_name: string;
  bsb: string;
  account_number: string;
  invoice_prefix: string;
  estimate_prefix: string;
  quote_prefix: string;
  estimate_terms_default: string;
  invoice_terms_default: string;
  updated_at?: string;
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
