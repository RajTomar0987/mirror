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
  preferredContact: string;
  preferred_contact?: string;
  status: string;
  created_at: string;
}

// In-memory quote store for local dev fallback
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
    notes: "Initial phone consultation completed. Site measure scheduled for Tuesday.",
    preferredContact: "email",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "quote-2",
    name: "Elena Rostova",
    phone: "+61 498 765 432",
    email: "elena@rostovadesign.com.au",
    suburb: "Vaucluse",
    location: "Vaucluse, NSW",
    service: "Frameless Glass",
    project_type: "Frameless Glass",
    description: "Floor-to-ceiling architectural glass panels and sliding doors for main living terrace.",
    message: "Floor-to-ceiling architectural glass panels and sliding doors for main living terrace.",
    budget: "$40,000+",
    notes: "Architectural drawings received and reviewed for AS1288 structural compliance.",
    preferredContact: "phone",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
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
    notes: "Job completed and signed off by builder. Certification documentation issued.",
    preferredContact: "email",
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

class QuotesStore {
  private quotes: StoredQuote[] = [...initialMockQuotes];

  getAll(): StoredQuote[] {
    return [...this.quotes];
  }

  getById(id: string): StoredQuote | null {
    return this.quotes.find((item) => item.id === id) || null;
  }

  add(quote: Partial<StoredQuote> & { name: string; email: string; phone: string }): StoredQuote {
    const serviceName = quote.service || quote.project_type || "Custom Glazing";
    const loc = quote.suburb || quote.location || "Sydney, NSW";
    const desc = quote.description || quote.message || "";

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
      notes: quote.notes || "",
      preferredContact: quote.preferredContact || quote.preferred_contact || "email",
      preferred_contact: quote.preferredContact || quote.preferred_contact || "email",
      status: quote.status || "new",
      created_at: quote.created_at || new Date().toISOString(),
    };

    this.quotes.unshift(newQuote);
    return newQuote;
  }

  update(id: string, updates: Partial<StoredQuote>): StoredQuote | null {
    const q = this.quotes.find((item) => item.id === id);
    if (q) {
      if (updates.status !== undefined) q.status = updates.status;
      if (updates.notes !== undefined) q.notes = updates.notes;
      if (updates.name !== undefined) q.name = updates.name;
      if (updates.email !== undefined) q.email = updates.email;
      if (updates.phone !== undefined) q.phone = updates.phone;
      if (updates.service !== undefined) {
        q.service = updates.service;
        q.project_type = updates.service;
      }
      if (updates.suburb !== undefined) {
        q.suburb = updates.suburb;
        q.location = updates.suburb;
      }
      return { ...q };
    }
    return null;
  }

  updateStatus(id: string, status: string): StoredQuote | null {
    return this.update(id, { status });
  }

  delete(id: string): boolean {
    const initialLen = this.quotes.length;
    this.quotes = this.quotes.filter((item) => item.id !== id);
    return this.quotes.length < initialLen;
  }
}

// Global singleton to preserve state across hot reloads in Next.js dev server
const globalForQuotes = globalThis as unknown as { __quotesStore?: QuotesStore };
export const quotesStore = globalForQuotes.__quotesStore ?? new QuotesStore();
if (process.env.NODE_ENV !== "production") globalForQuotes.__quotesStore = quotesStore;

