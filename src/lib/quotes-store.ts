import { posStore } from "./pos-store";
import { QuoteStatus } from "@/types";

export interface StoredQuote {
  id: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  location?: string;
  service: string;
  project_type?: string;
  description: string;
  message?: string;
  budget?: string;
  notes?: string;
  measurements?: string;
  estimated_value?: number;
  customer_id?: string;
  preferredContact: string;
  preferred_contact?: string;
  status: QuoteStatus | string;
  archived?: boolean;
  created_at: string;
  updated_at?: string;
}

// In-memory quote store for local dev fallback & sync
const initialMockQuotes: StoredQuote[] = [
  {
    id: "quote-1",
    name: "Alexander Vance",
    phone: "+61 412 345 678",
    email: "alexander.vance@vancearchitects.com.au",
    suburb: "Mosman",
    location: "Mosman, NSW",
    service: "Glass Balustrades",
    project_type: "Glass Balustrades",
    description: "Custom frameless glass balustrades for a 3-level cliffside residential property in Mosman.",
    message: "Custom frameless glass balustrades for a 3-level cliffside residential property in Mosman.",
    budget: "$25,000 - $50,000",
    measurements: "14 linear meters balcony balustrade, 1200mm high, 12mm toughened clear glass",
    estimated_value: 8558,
    customer_id: "cust-1",
    notes: "Initial phone consultation completed. Site measure scheduled for Tuesday. AS1288 load engineering reviewed.",
    preferredContact: "email",
    preferred_contact: "email",
    status: "estimate_sent",
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "quote-2",
    name: "Elena Rostova",
    phone: "+61 498 765 432",
    email: "elena@rostovadesign.com.au",
    suburb: "Vaucluse",
    location: "Vaucluse, NSW",
    service: "Frameless Glass Installations",
    project_type: "Frameless Glass Installations",
    description: "Floor-to-ceiling architectural glass panels and sliding doors for main living terrace.",
    message: "Floor-to-ceiling architectural glass panels and sliding doors for main living terrace.",
    budget: "$40,000+",
    measurements: "18 sqm floor-to-ceiling wall opening, 15mm low-iron structural glass",
    estimated_value: 11484,
    customer_id: "cust-2",
    notes: "Architectural drawings received and reviewed for AS1288 structural compliance.",
    preferredContact: "phone",
    preferred_contact: "phone",
    status: "estimate_sent",
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "quote-3",
    name: "Marcus Sterling",
    phone: "+61 423 889 102",
    email: "m.sterling@sterlingconstructions.com.au",
    suburb: "Double Bay",
    location: "Double Bay, NSW",
    service: "Shower Screens",
    project_type: "Shower Screens",
    description: "Frameless 12mm toughened fluted glass shower screens for 4 penthouse master suites.",
    message: "Frameless 12mm toughened fluted glass shower screens for 4 penthouse master suites.",
    budget: "$15,000 - $25,000",
    measurements: "4 bespoke ensuites: 1000x2000mm walk-in screens with 10mm fluted glass",
    estimated_value: 13530,
    customer_id: "cust-3",
    notes: "Job completed and signed off by builder. Certification documentation issued.",
    preferredContact: "email",
    preferred_contact: "email",
    status: "completed",
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "quote-4",
    name: "Victoria Zhang",
    phone: "+61 433 112 233",
    email: "victoria.zhang@pointpiper.com.au",
    suburb: "Point Piper",
    location: "Point Piper, NSW",
    service: "Glass Pool Fencing",
    project_type: "Glass Pool Fencing",
    description: "Frameless glass pool fence enclosing infinity pool facing Sydney harbour.",
    message: "Frameless glass pool fence enclosing infinity pool facing Sydney harbour.",
    budget: "$10,000 - $20,000",
    measurements: "22m perimeter, 1200mm height, 1 self-closing latch gate",
    estimated_value: 9141,
    customer_id: "cust-4",
    notes: "Site visit required for pool boundary non-climbable zone (NCZ) check.",
    preferredContact: "phone",
    preferred_contact: "phone",
    status: "new",
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

class QuotesStore {
  private quotes: StoredQuote[] = [...initialMockQuotes];

  getAll(includeArchived = false): StoredQuote[] {
    if (includeArchived) return [...this.quotes];
    return this.quotes.filter((q) => !q.archived);
  }

  getById(id: string): StoredQuote | null {
    return this.quotes.find((item) => item.id === id) || null;
  }

  add(quote: Partial<StoredQuote> & { name: string; email: string; phone: string }): StoredQuote {
    const serviceName = quote.service || quote.project_type || "Custom Glazing";
    const loc = quote.suburb || quote.location || "Sydney, NSW";
    const desc = quote.description || quote.message || "";

    // Sync or create customer in CRM
    const customer = posStore.addOrUpdateCustomerFromQuote({
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      suburb: loc,
      notes: quote.notes || "",
    });

    const newQuote: StoredQuote = {
      id: quote.id || `quote-${Date.now()}`,
      name: quote.name,
      phone: quote.phone,
      email: quote.email,
      suburb: loc,
      location: loc,
      service: serviceName,
      project_type: serviceName,
      description: desc,
      message: desc,
      budget: quote.budget || "Flexible",
      measurements: quote.measurements || "",
      estimated_value: quote.estimated_value || 0,
      customer_id: customer.id,
      notes: quote.notes || "",
      preferredContact: quote.preferredContact || quote.preferred_contact || "email",
      preferred_contact: quote.preferredContact || quote.preferred_contact || "email",
      status: quote.status || "new",
      archived: !!quote.archived,
      created_at: quote.created_at || new Date().toISOString(),
    };

    this.quotes.unshift(newQuote);

    // Audit log
    posStore.logActivity(
      "system@completeglass.com.au",
      "QUOTE_RECEIVED",
      "quote",
      newQuote.id,
      `New quote request from ${newQuote.name} for ${newQuote.service}`
    );

    return newQuote;
  }

  update(id: string, updates: Partial<StoredQuote>, adminEmail = "admin@completeglass.com.au"): StoredQuote | null {
    const q = this.quotes.find((item) => item.id === id);
    if (q) {
      if (updates.status !== undefined && updates.status !== q.status) {
        const oldStatus = q.status;
        q.status = updates.status;
        posStore.logActivity(
          adminEmail,
          "QUOTE_STATUS_CHANGED",
          "quote",
          id,
          `Changed quote status for ${q.name} from "${oldStatus}" to "${updates.status}"`
        );
      }
      if (updates.notes !== undefined) q.notes = updates.notes;
      if (updates.name !== undefined) q.name = updates.name;
      if (updates.email !== undefined) q.email = updates.email;
      if (updates.phone !== undefined) q.phone = updates.phone;
      if (updates.measurements !== undefined) q.measurements = updates.measurements;
      if (updates.estimated_value !== undefined) q.estimated_value = updates.estimated_value;
      if (updates.archived !== undefined) q.archived = updates.archived;
      if (updates.service !== undefined) {
        q.service = updates.service;
        q.project_type = updates.service;
      }
      if (updates.suburb !== undefined) {
        q.suburb = updates.suburb;
        q.location = updates.suburb;
      }
      q.updated_at = new Date().toISOString();
      return { ...q };
    }
    return null;
  }

  updateStatus(id: string, status: string, adminEmail = "admin@completeglass.com.au"): StoredQuote | null {
    return this.update(id, { status }, adminEmail);
  }

  archive(id: string, archived = true, adminEmail = "admin@completeglass.com.au"): StoredQuote | null {
    return this.update(id, { archived }, adminEmail);
  }

  delete(id: string, adminEmail = "admin@completeglass.com.au"): boolean {
    const quote = this.getById(id);
    const initialLen = this.quotes.length;
    this.quotes = this.quotes.filter((item) => item.id !== id);
    if (this.quotes.length < initialLen) {
      posStore.logActivity(
        adminEmail,
        "QUOTE_DELETED",
        "quote",
        id,
        `Deleted quote record ${id} (${quote?.name || "Unknown"})`
      );
      return true;
    }
    return false;
  }
}

// Global singleton to preserve state across hot reloads in Next.js dev server
const globalForQuotes = globalThis as unknown as { __quotesStore?: QuotesStore };
export const quotesStore = globalForQuotes.__quotesStore ?? new QuotesStore();
if (process.env.NODE_ENV !== "production") globalForQuotes.__quotesStore = quotesStore;
