export interface StoredQuote {
  id: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  description: string;
  preferredContact: string;
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
    service: "Glass Balustrades",
    description: "Custom frameless glass balustrades for a 3-level cliffside residential property in Mosman.",
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
    service: "Frameless Glass",
    description: "Floor-to-ceiling architectural glass panels and sliding doors for main living terrace.",
    preferredContact: "phone",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

class QuotesStore {
  private quotes: StoredQuote[] = [...initialMockQuotes];

  getAll(): StoredQuote[] {
    return [...this.quotes];
  }

  add(quote: Omit<StoredQuote, "id" | "status" | "created_at"> & { id?: string }): StoredQuote {
    const newQuote: StoredQuote = {
      id: quote.id || `quote-${Date.now()}`,
      name: quote.name,
      phone: quote.phone,
      email: quote.email,
      suburb: quote.suburb,
      service: quote.service,
      description: quote.description,
      preferredContact: quote.preferredContact,
      status: "new",
      created_at: new Date().toISOString(),
    };

    this.quotes.unshift(newQuote);
    return newQuote;
  }

  updateStatus(id: string, status: string): StoredQuote | null {
    const q = this.quotes.find((item) => item.id === id);
    if (q) {
      q.status = status;
      return { ...q };
    }
    return null;
  }
}

// Global singleton to preserve state across hot reloads in Next.js dev server
const globalForQuotes = globalThis as unknown as { __quotesStore?: QuotesStore };
export const quotesStore = globalForQuotes.__quotesStore ?? new QuotesStore();
if (process.env.NODE_ENV !== "production") globalForQuotes.__quotesStore = quotesStore;
