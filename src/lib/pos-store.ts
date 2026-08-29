import {
  Customer,
  Estimate,
  EstimateItem,
  Invoice,
  InvoiceItem,
  Payment,
  POSProject,
  ActivityLog,
  CompanySettings,
  QuoteRequest,
  EstimateStatus,
  InvoiceStatus,
  PaymentMethod,
  POSProjectStatus,
} from "@/types";

// Default Australian Glass Company Settings
const initialSettings: CompanySettings = {
  business_name: "Complete Glass Innovations",
  abn: "58 123 456 789",
  acn: "123 456 789",
  phone: "+61 2 9876 5432",
  email: "admin@completeglass.com.au",
  address: "128 Architectural Way",
  suburb: "Alexandria",
  state: "NSW",
  postcode: "2015",
  country: "Australia",
  gst_rate: 0.10, // 10% Australian GST
  bank_name: "Commonwealth Bank of Australia",
  account_name: "Complete Glass Innovations Pty Ltd",
  bsb: "062-000",
  account_number: "1234 5678",
  invoice_prefix: "CGI-INV-",
  estimate_prefix: "CGI-EST-",
  quote_prefix: "CGI-Q-",
  estimate_terms_default:
    "Valid for 30 days. 50% deposit required upon confirmation. All glazing certified strictly to AS1288.",
  invoice_terms_default:
    "Payment strictly within 14 days of invoice date. EFT / Bank Transfer preferred.",
  updated_at: new Date().toISOString(),
};

// Seed Customers
const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Alexander Vance",
    email: "alexander.vance@vancearchitects.com.au",
    phone: "+61 412 345 678",
    address: "42 Raglan Street",
    suburb: "Mosman",
    state: "NSW",
    postcode: "2088",
    company: "Vance Architecture Studio",
    notes: "VIP architectural partner. Prefers email drawings review and high-spec low-iron glass.",
    quote_count: 2,
    accepted_count: 1,
    projects_count: 1,
    total_value: 38500,
    last_activity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "cust-2",
    name: "Elena Rostova",
    email: "elena@rostovadesign.com.au",
    phone: "+61 498 765 432",
    address: "18 Hopetoun Avenue",
    suburb: "Vaucluse",
    state: "NSW",
    postcode: "2030",
    company: "Rostova Luxury Interiors",
    notes: "High-end residential designer. Focus on frameless sliding systems and fluted glass.",
    quote_count: 1,
    accepted_count: 1,
    projects_count: 1,
    total_value: 46200,
    last_activity: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "cust-3",
    name: "Marcus Sterling",
    email: "m.sterling@sterlingconstructions.com.au",
    phone: "+61 423 889 102",
    address: "75 Ocean Avenue",
    suburb: "Double Bay",
    state: "NSW",
    postcode: "2028",
    company: "Sterling Constructions Group",
    notes: "Commercial builder. 4-penthouse master suite shower screens completed and certified.",
    quote_count: 3,
    accepted_count: 2,
    projects_count: 2,
    total_value: 62700,
    last_activity: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "cust-4",
    name: "Victoria Zhang",
    email: "victoria.zhang@pointpiper.com.au",
    phone: "+61 433 112 233",
    address: "12 Wolseley Road",
    suburb: "Point Piper",
    state: "NSW",
    postcode: "2027",
    company: "Private Residence",
    notes: "Harbourfront pool fencing with marine grade 2205 stainless hardware.",
    quote_count: 1,
    accepted_count: 0,
    projects_count: 0,
    total_value: 19800,
    last_activity: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

// Seed Estimates
const initialEstimates: Estimate[] = [
  {
    id: "est-1",
    estimate_number: "CGI-0001",
    customer_id: "cust-1",
    customer_name: "Alexander Vance",
    customer_email: "alexander.vance@vancearchitects.com.au",
    customer_phone: "+61 412 345 678",
    customer_address: "42 Raglan Street, Mosman NSW 2088",
    quote_id: "quote-1",
    project_id: "pos-proj-1",
    project_name: "Mosman Cliffside Balustrades",
    status: "accepted",
    issue_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().split("T")[0],
    items: [
      {
        id: "item-1",
        description: "12mm Toughened Clear Safety Glass Balustrade Panels (AS1288 Certified)",
        quantity: 14,
        unit: "m",
        unit_price: 250,
        subtotal: 3500,
      },
      {
        id: "item-2",
        description: "Duplex 2205 Marine Grade Stainless Steel Base Spigots (Core-drilled)",
        quantity: 28,
        unit: "item",
        unit_price: 110,
        subtotal: 3080,
      },
      {
        id: "item-3",
        description: "On-site Glazing Installation, Laser Alignment & Engineering Certification",
        quantity: 1,
        unit: "service",
        unit_price: 1200,
        subtotal: 1200,
      },
    ],
    subtotal: 7780,
    discount_amount: 0,
    gst_rate: 0.10,
    gst_amount: 778,
    total_amount: 8558,
    notes: "Site measure complete. Substrate certified for high-wind cliffside load.",
    terms: "Valid for 30 days. 50% deposit required upon confirmation. All glazing certified to AS1288.",
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    accepted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    converted_to_invoice_id: "inv-1",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "est-2",
    estimate_number: "CGI-0002",
    customer_id: "cust-2",
    customer_name: "Elena Rostova",
    customer_email: "elena@rostovadesign.com.au",
    customer_phone: "+61 498 765 432",
    customer_address: "18 Hopetoun Avenue, Vaucluse NSW 2030",
    quote_id: "quote-2",
    project_id: "pos-proj-2",
    project_name: "Vaucluse Frameless Terrace Sliders",
    status: "sent",
    issue_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString().split("T")[0],
    items: [
      {
        id: "item-4",
        description: "Floor-to-ceiling 15mm Low-Iron Structural Toughened Glass Wall Panels",
        quantity: 18,
        unit: "sqm",
        unit_price: 380,
        subtotal: 6840,
      },
      {
        id: "item-5",
        description: "Heavy Duty Floor Spring Pivot Hardware & Brushed Brass Handles",
        quantity: 2,
        unit: "set",
        unit_price: 850,
        subtotal: 1700,
      },
      {
        id: "item-6",
        description: "Specialist Crane Hoist & Structural Butt-Glazed Installation",
        quantity: 1,
        unit: "service",
        unit_price: 2400,
        subtotal: 2400,
      },
    ],
    subtotal: 10940,
    discount_amount: 500,
    gst_rate: 0.10,
    gst_amount: 1044,
    total_amount: 11484,
    notes: "Architectural drawings received. Structural silicone seals in clear finish.",
    terms: "Valid for 30 days. 50% deposit required upon confirmation. All glazing certified to AS1288.",
    sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "est-3",
    estimate_number: "CGI-0003",
    customer_id: "cust-4",
    customer_name: "Victoria Zhang",
    customer_email: "victoria.zhang@pointpiper.com.au",
    customer_phone: "+61 433 112 233",
    customer_address: "12 Wolseley Road, Point Piper NSW 2027",
    status: "draft",
    issue_date: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
    items: [
      {
        id: "item-7",
        description: "12mm Toughened Pool Fencing Glass Panels (AS1926.1 Compliant)",
        quantity: 22,
        unit: "m",
        unit_price: 280,
        subtotal: 6160,
      },
      {
        id: "item-8",
        description: "Hydraulic Soft-Close Hinges & Magnetic Child-Safe Gate Latch System",
        quantity: 1,
        unit: "set",
        unit_price: 650,
        subtotal: 650,
      },
      {
        id: "item-9",
        description: "Core-Drill Concrete Mounting & EnduroShield Protective Glass Coating",
        quantity: 1,
        unit: "service",
        unit_price: 1500,
        subtotal: 1500,
      },
    ],
    subtotal: 8310,
    discount_amount: 0,
    gst_rate: 0.10,
    gst_amount: 831,
    total_amount: 9141,
    notes: "Harbourfront salt-water environment requires Duplex 2205 spigots.",
    terms: "Valid for 30 days. 50% deposit required upon confirmation. All glazing certified to AS1288.",
    created_at: new Date().toISOString(),
  },
];

// Seed Invoices
const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoice_number: "CGI-INV-0001",
    customer_id: "cust-1",
    customer_name: "Alexander Vance",
    customer_email: "alexander.vance@vancearchitects.com.au",
    customer_phone: "+61 412 345 678",
    customer_address: "42 Raglan Street, Mosman NSW 2088",
    project_id: "pos-proj-1",
    project_name: "Mosman Cliffside Balustrades",
    estimate_id: "est-1",
    estimate_number: "CGI-0001",
    status: "partially_paid",
    issue_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
    items: [
      {
        id: "inv-item-1",
        description: "12mm Toughened Clear Safety Glass Balustrade Panels (AS1288 Certified)",
        quantity: 14,
        unit: "m",
        unit_price: 250,
        subtotal: 3500,
      },
      {
        id: "inv-item-2",
        description: "Duplex 2205 Marine Grade Stainless Steel Base Spigots (Core-drilled)",
        quantity: 28,
        unit: "item",
        unit_price: 110,
        subtotal: 3080,
      },
      {
        id: "inv-item-3",
        description: "On-site Glazing Installation, Laser Alignment & Engineering Certification",
        quantity: 1,
        unit: "service",
        unit_price: 1200,
        subtotal: 1200,
      },
    ],
    subtotal: 7780,
    gst_rate: 0.10,
    gst_amount: 778,
    total_amount: 8558,
    amount_paid: 4279, // 50% deposit paid
    balance_due: 4279,
    notes: "50% deposit received. Balance due upon practical completion and AS1288 sign-off.",
    payment_terms: "Payment strictly within 14 days. Bank details: BSB 062-000, Acc 1234 5678.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "inv-2",
    invoice_number: "CGI-INV-0002",
    customer_id: "cust-3",
    customer_name: "Marcus Sterling",
    customer_email: "m.sterling@sterlingconstructions.com.au",
    customer_phone: "+61 423 889 102",
    customer_address: "75 Ocean Avenue, Double Bay NSW 2028",
    project_id: "pos-proj-3",
    project_name: "Double Bay Penthouse Fluted Glass Showers",
    status: "paid",
    issue_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString().split("T")[0],
    due_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().split("T")[0],
    items: [
      {
        id: "inv-item-4",
        description: "10mm Toughened Fluted Architectural Glass Shower Screens for 4 Penthouse Suites",
        quantity: 4,
        unit: "set",
        unit_price: 2400,
        subtotal: 9600,
      },
      {
        id: "inv-item-5",
        description: "Solid Brass Matte Black Hinge Assemblies and Water Seal Strips",
        quantity: 4,
        unit: "set",
        unit_price: 450,
        subtotal: 1800,
      },
      {
        id: "inv-item-6",
        description: "Sanitary Silicone Sealing, Testing & Compliance Certification",
        quantity: 1,
        unit: "service",
        unit_price: 900,
        subtotal: 900,
      },
    ],
    subtotal: 12300,
    gst_rate: 0.10,
    gst_amount: 1230,
    total_amount: 13530,
    amount_paid: 13530,
    balance_due: 0,
    notes: "Job complete and signed off by builder. AS1288 Form 15 Compliance Certificate issued.",
    payment_terms: "Paid in full via Direct EFT.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
];

// Seed Payments
const initialPayments: Payment[] = [
  {
    id: "pay-1",
    payment_number: "CGI-PAY-0001",
    invoice_id: "inv-1",
    invoice_number: "CGI-INV-0001",
    customer_id: "cust-1",
    customer_name: "Alexander Vance",
    amount: 4279,
    payment_method: "bank_transfer",
    payment_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().split("T")[0],
    reference_number: "EFT-VANCE-88219",
    status: "completed",
    notes: "50% project deposit for Mosman Balustrade fabrication.",
    recorded_by: "admin@completeglass.com.au",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "pay-2",
    payment_number: "CGI-PAY-0002",
    invoice_id: "inv-2",
    invoice_number: "CGI-INV-0002",
    customer_id: "cust-3",
    customer_name: "Marcus Sterling",
    amount: 6765,
    payment_method: "bank_transfer",
    payment_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString().split("T")[0],
    reference_number: "EFT-STERLING-4410",
    status: "completed",
    notes: "50% initial deposit.",
    recorded_by: "admin@completeglass.com.au",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id: "pay-3",
    payment_number: "CGI-PAY-0003",
    invoice_id: "inv-2",
    invoice_number: "CGI-INV-0002",
    customer_id: "cust-3",
    customer_name: "Marcus Sterling",
    amount: 6765,
    payment_method: "bank_transfer",
    payment_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    reference_number: "EFT-STERLING-4499",
    status: "completed",
    notes: "Final balance upon sign-off.",
    recorded_by: "admin@completeglass.com.au",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

// Seed POS Projects
const initialPOSProjects: POSProject[] = [
  {
    id: "pos-proj-1",
    project_name: "Mosman Cliffside Balustrades",
    customer_id: "cust-1",
    customer_name: "Alexander Vance",
    customer_email: "alexander.vance@vancearchitects.com.au",
    customer_phone: "+61 412 345 678",
    service: "Glass Balustrades",
    location: "42 Raglan Street, Mosman NSW 2088",
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    expected_completion: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString().split("T")[0],
    status: "in_progress",
    quote_id: "quote-1",
    estimate_id: "est-1",
    invoice_id: "inv-1",
    notes: "Spigots installed and core-drilled. Glass panels currently in tempering furnace.",
    images: ["/images/services/glass-balustrades.jpg"],
    estimated_value: 8558,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "pos-proj-2",
    project_name: "Vaucluse Frameless Terrace Sliders",
    customer_id: "cust-2",
    customer_name: "Elena Rostova",
    customer_email: "elena@rostovadesign.com.au",
    customer_phone: "+61 498 765 432",
    service: "Frameless Glass Installations",
    location: "18 Hopetoun Avenue, Vaucluse NSW 2030",
    start_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
    expected_completion: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString().split("T")[0],
    status: "estimate",
    quote_id: "quote-2",
    estimate_id: "est-2",
    notes: "Awaiting formal acceptance and deposit EFT before placing custom glass order.",
    images: ["/images/services/frameless-glass.jpg"],
    estimated_value: 11484,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "pos-proj-3",
    project_name: "Double Bay Penthouse Fluted Glass Showers",
    customer_id: "cust-3",
    customer_name: "Marcus Sterling",
    customer_email: "m.sterling@sterlingconstructions.com.au",
    customer_phone: "+61 423 889 102",
    service: "Shower Screens",
    location: "75 Ocean Avenue, Double Bay NSW 2028",
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString().split("T")[0],
    expected_completion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    actual_completion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    status: "completed",
    quote_id: "quote-3",
    invoice_id: "inv-2",
    notes: "Successfully handed over with AS1288 Certificate of Compliance.",
    images: ["/images/services/shower-screens.jpg"],
    estimated_value: 13530,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

// Seed Activity Logs
const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    admin_email: "admin@completeglass.com.au",
    action: "PAYMENT_RECORDED",
    entity_type: "payment",
    entity_id: "pay-1",
    details: "Recorded deposit payment of $4,279.00 (Bank Transfer) for Invoice #CGI-INV-0001",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "log-2",
    admin_email: "admin@completeglass.com.au",
    action: "INVOICE_CREATED",
    entity_type: "invoice",
    entity_id: "inv-1",
    details: "Created Invoice #CGI-INV-0001 from accepted Estimate #CGI-0001 for Alexander Vance ($8,558.00 incl. GST)",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "log-3",
    admin_email: "admin@completeglass.com.au",
    action: "ESTIMATE_ACCEPTED",
    entity_type: "estimate",
    entity_id: "est-1",
    details: "Customer Alexander Vance accepted Estimate #CGI-0001 ($8,558.00)",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "log-4",
    admin_email: "admin@completeglass.com.au",
    action: "ESTIMATE_SENT",
    entity_type: "estimate",
    entity_id: "est-2",
    details: "Dispatched Estimate #CGI-0002 to Elena Rostova ($11,484.00 incl. GST)",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "log-5",
    admin_email: "admin@completeglass.com.au",
    action: "QUOTE_STATUS_CHANGED",
    entity_type: "quote",
    entity_id: "quote-1",
    details: "Moved quote for Alexander Vance to 'estimate_sent'",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
];

export class POSStore {
  private customers: Customer[] = [...initialCustomers];
  private estimates: Estimate[] = [...initialEstimates];
  private invoices: Invoice[] = [...initialInvoices];
  private payments: Payment[] = [...initialPayments];
  private projects: POSProject[] = [...initialPOSProjects];
  private activityLogs: ActivityLog[] = [...initialActivityLogs];
  private settings: CompanySettings = { ...initialSettings };

  // ==========================================
  // ACTIVITY & AUDIT LOGS
  // ==========================================
  logActivity(
    adminEmail: string,
    action: string,
    entity_type: ActivityLog["entity_type"],
    entity_id?: string,
    details?: string,
    metadata?: Record<string, unknown>
  ): ActivityLog {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      admin_email: adminEmail,
      action,
      entity_type,
      entity_id,
      details: details || `${action} on ${entity_type} ${entity_id || ""}`,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.activityLogs.unshift(newLog);
    return newLog;
  }

  getActivityLogs(limit = 50): ActivityLog[] {
    return this.activityLogs.slice(0, limit);
  }

  // ==========================================
  // COMPANY SETTINGS
  // ==========================================
  getSettings(): CompanySettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<CompanySettings>, adminEmail = "admin@completeglass.com.au"): CompanySettings {
    this.settings = { ...this.settings, ...updates, updated_at: new Date().toISOString() };
    this.logActivity(adminEmail, "SETTINGS_UPDATED", "settings", undefined, "Updated company profile & Australian GST settings");
    return { ...this.settings };
  }

  // ==========================================
  // CUSTOMERS CRM
  // ==========================================
  getCustomers(): Customer[] {
    return [...this.customers].sort(
      (a, b) => new Date(b.last_activity || b.created_at).getTime() - new Date(a.last_activity || a.created_at).getTime()
    );
  }

  getCustomerById(id: string): Customer | null {
    return this.customers.find((c) => c.id === id) || null;
  }

  getCustomerByEmail(email: string): Customer | null {
    return this.customers.find((c) => c.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  addOrUpdateCustomerFromQuote(quote: Partial<QuoteRequest> & { name: string; email: string; phone: string }): Customer {
    const existing = this.getCustomerByEmail(quote.email);
    if (existing) {
      existing.name = quote.name || existing.name;
      existing.phone = quote.phone || existing.phone;
      if (quote.suburb || quote.location) existing.suburb = quote.suburb || quote.location;
      existing.last_activity = new Date().toISOString();
      existing.quote_count = (existing.quote_count || 0) + 1;
      return existing;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: quote.name,
      email: quote.email.toLowerCase().trim(),
      phone: quote.phone,
      suburb: quote.suburb || quote.location || "Sydney",
      state: "NSW",
      postcode: "2000",
      notes: quote.notes || "",
      quote_count: 1,
      accepted_count: 0,
      projects_count: 0,
      total_value: 0,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.customers.unshift(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>, adminEmail = "admin@completeglass.com.au"): Customer | null {
    const cust = this.customers.find((c) => c.id === id);
    if (!cust) return null;
    Object.assign(cust, updates, { updated_at: new Date().toISOString() });
    this.logActivity(adminEmail, "CUSTOMER_UPDATED", "customer", id, `Updated customer record for ${cust.name}`);
    return { ...cust };
  }

  // ==========================================
  // ESTIMATES
  // ==========================================
  getEstimates(): Estimate[] {
    return [...this.estimates].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getEstimatesByCustomerId(customerId: string): Estimate[] {
    return this.estimates.filter((e) => e.customer_id === customerId);
  }

  getEstimateById(id: string): Estimate | null {
    return this.estimates.find((e) => e.id === id || e.estimate_number === id) || null;
  }

  createEstimate(
    data: {
      customer_id: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      quote_id?: string;
      project_id?: string;
      project_name?: string;
      valid_until?: string;
      items: Array<{ description: string; quantity: number; unit: string; unit_price: number }>;
      discount_amount?: number;
      notes?: string;
      terms?: string;
      created_by?: string;
    },
    adminEmail = "admin@completeglass.com.au"
  ): Estimate {
    const customer = this.getCustomerById(data.customer_id);
    const estCount = this.estimates.length + 1;
    const estNum = `${this.settings.estimate_prefix || "CGI-"}${String(estCount).padStart(4, "0")}`;

    // Recalculate line items server-side
    const items: EstimateItem[] = data.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unit: item.unit || "item",
      unit_price: Number(item.unit_price) || 0,
      subtotal: Math.round((Number(item.quantity) || 1) * (Number(item.unit_price) || 0) * 100) / 100,
      item_order: idx,
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
    const discount = Number(data.discount_amount) || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const gstRate = this.settings.gst_rate || 0.10;
    const gstAmount = Math.round(taxableAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

    const newEstimate: Estimate = {
      id: `est-${Date.now()}`,
      estimate_number: estNum,
      customer_id: data.customer_id,
      customer_name: customer?.name || "Valued Client",
      customer_email: customer?.email || "",
      customer_phone: customer?.phone || "",
      customer_address: customer?.address ? `${customer.address}, ${customer.suburb} ${customer.state}` : customer?.suburb || "Sydney, NSW",
      quote_id: data.quote_id,
      project_id: data.project_id,
      project_name: data.project_name || "Custom Architectural Glazing",
      status: "draft",
      issue_date: new Date().toISOString().split("T")[0],
      valid_until:
        data.valid_until ||
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
      items,
      subtotal,
      discount_amount: discount,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      notes: data.notes || "",
      terms: data.terms || this.settings.estimate_terms_default,
      created_at: new Date().toISOString(),
    };

    this.estimates.unshift(newEstimate);

    if (customer) {
      customer.last_activity = new Date().toISOString();
    }

    this.logActivity(
      adminEmail,
      "ESTIMATE_CREATED",
      "estimate",
      newEstimate.id,
      `Created Estimate #${newEstimate.estimate_number} for ${newEstimate.customer_name} ($${totalAmount.toFixed(2)})`
    );

    return newEstimate;
  }

  updateEstimateStatus(
    id: string,
    status: EstimateStatus,
    adminEmail = "admin@completeglass.com.au"
  ): Estimate | null {
    const est = this.getEstimateById(id);
    if (!est) return null;
    est.status = status;
    est.updated_at = new Date().toISOString();

    if (status === "sent") est.sent_at = new Date().toISOString();
    if (status === "accepted") {
      est.accepted_at = new Date().toISOString();
      const cust = this.getCustomerById(est.customer_id);
      if (cust) {
        cust.accepted_count = (cust.accepted_count || 0) + 1;
        cust.total_value = (cust.total_value || 0) + est.total_amount;
      }
    }

    this.logActivity(
      adminEmail,
      `ESTIMATE_${status.toUpperCase()}`,
      "estimate",
      est.id,
      `Updated Estimate #${est.estimate_number} status to ${status.toUpperCase()}`
    );

    return est;
  }

  convertEstimateToInvoice(estimateId: string, adminEmail = "admin@completeglass.com.au"): Invoice | null {
    const est = this.getEstimateById(estimateId);
    if (!est) return null;

    if (est.converted_to_invoice_id) {
      const existingInv = this.getInvoiceById(est.converted_to_invoice_id);
      if (existingInv) return existingInv;
    }

    const invCount = this.invoices.length + 1;
    const invNum = `${this.settings.invoice_prefix || "CGI-INV-"}${String(invCount).padStart(4, "0")}`;

    const invoiceItems: InvoiceItem[] = est.items.map((item, idx) => ({
      id: `inv-item-${Date.now()}-${idx}`,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      item_order: idx,
    }));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invNum,
      customer_id: est.customer_id,
      customer_name: est.customer_name,
      customer_email: est.customer_email,
      customer_phone: est.customer_phone,
      customer_address: est.customer_address,
      project_id: est.project_id,
      project_name: est.project_name,
      estimate_id: est.id,
      estimate_number: est.estimate_number,
      status: "draft",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split("T")[0],
      items: invoiceItems,
      subtotal: est.subtotal - est.discount_amount,
      gst_rate: est.gst_rate,
      gst_amount: est.gst_amount,
      total_amount: est.total_amount,
      amount_paid: 0,
      balance_due: est.total_amount,
      notes: est.notes || "Generated from accepted estimate.",
      payment_terms: this.settings.invoice_terms_default,
      created_at: new Date().toISOString(),
    };

    this.invoices.unshift(newInvoice);
    est.converted_to_invoice_id = newInvoice.id;
    est.status = "accepted";
    est.accepted_at = est.accepted_at || new Date().toISOString();

    this.logActivity(
      adminEmail,
      "INVOICE_CREATED",
      "invoice",
      newInvoice.id,
      `Converted Estimate #${est.estimate_number} into Invoice #${newInvoice.invoice_number} ($${newInvoice.total_amount.toFixed(2)})`
    );

    return newInvoice;
  }

  // ==========================================
  // INVOICES
  // ==========================================
  getInvoices(): Invoice[] {
    return [...this.invoices].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getInvoicesByCustomerId(customerId: string): Invoice[] {
    return this.invoices.filter((inv) => inv.customer_id === customerId);
  }

  getInvoiceById(id: string): Invoice | null {
    return this.invoices.find((inv) => inv.id === id || inv.invoice_number === id) || null;
  }

  createInvoice(
    data: {
      customer_id: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      project_id?: string;
      project_name?: string;
      estimate_id?: string;
      quote_id?: string;
      due_date?: string;
      items: Array<{ description: string; quantity: number; unit: string; unit_price: number }>;
      discount_amount?: number;
      notes?: string;
      payment_terms?: string;
      created_by?: string;
    },
    adminEmail = "admin@completeglass.com.au"
  ): Invoice {
    const customer = this.getCustomerById(data.customer_id);
    const invCount = this.invoices.length + 1;
    const invNum = `${this.settings.invoice_prefix || "CGI-INV-"}${String(invCount).padStart(4, "0")}`;

    const items: InvoiceItem[] = data.items.map((item, idx) => ({
      id: `inv-item-${Date.now()}-${idx}`,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unit: item.unit || "item",
      unit_price: Number(item.unit_price) || 0,
      subtotal: Math.round((Number(item.quantity) || 1) * (Number(item.unit_price) || 0) * 100) / 100,
      item_order: idx,
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
    const discount = Number(data.discount_amount) || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const gstRate = this.settings.gst_rate || 0.10;
    const gstAmount = Math.round(taxableAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invNum,
      customer_id: data.customer_id,
      customer_name: data.customer_name || customer?.name || "Valued Client",
      customer_email: data.customer_email || customer?.email || "",
      customer_phone: data.customer_phone || customer?.phone || "",
      customer_address: customer?.address ? `${customer.address}, ${customer.suburb} ${customer.state}` : customer?.suburb || "Sydney, NSW",
      project_id: data.project_id,
      project_name: data.project_name || "Architectural Glazing Installation",
      estimate_id: data.estimate_id,
      status: "draft",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: data.due_date || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split("T")[0],
      items,
      subtotal,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      amount_paid: 0,
      balance_due: totalAmount,
      notes: data.notes || "",
      payment_terms: data.payment_terms || this.settings.invoice_terms_default,
      created_at: new Date().toISOString(),
    };

    this.invoices.unshift(newInvoice);

    if (customer) {
      customer.last_activity = new Date().toISOString();
    }

    this.logActivity(
      adminEmail,
      "INVOICE_CREATED",
      "invoice",
      newInvoice.id,
      `Created Invoice #${newInvoice.invoice_number} for ${newInvoice.customer_name} ($${totalAmount.toFixed(2)})`
    );

    return newInvoice;
  }

  updateInvoiceStatus(
    id: string,
    status: InvoiceStatus,
    adminEmail = "admin@completeglass.com.au"
  ): Invoice | null {
    const inv = this.getInvoiceById(id);
    if (!inv) return null;
    inv.status = status;
    inv.updated_at = new Date().toISOString();

    this.logActivity(
      adminEmail,
      `INVOICE_STATUS_${status.toUpperCase()}`,
      "invoice",
      inv.id,
      `Updated Invoice #${inv.invoice_number} status to ${status.toUpperCase()}`
    );

    return inv;
  }

  // ==========================================
  // PAYMENTS
  // ==========================================
  getPayments(): Payment[] {
    return [...this.payments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getPaymentsByInvoiceId(invoiceId: string): Payment[] {
    return this.payments.filter((p) => p.invoice_id === invoiceId);
  }

  recordPayment(
    data: {
      invoice_id: string;
      amount: number;
      payment_method: PaymentMethod;
      payment_date?: string;
      reference_number?: string;
      notes?: string;
      recorded_by?: string;
    },
    adminEmail = "admin@completeglass.com.au"
  ): { payment: Payment; invoice: Invoice } {
    const invoice = this.getInvoiceById(data.invoice_id);
    if (!invoice) throw new Error("Invoice not found");

    const amount = Math.round(Number(data.amount) * 100) / 100;
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    const payCount = this.payments.length + 1;
    const payNum = `CGI-PAY-${String(payCount).padStart(4, "0")}`;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      payment_number: payNum,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      amount,
      payment_method: data.payment_method,
      payment_date: data.payment_date || new Date().toISOString().split("T")[0],
      reference_number: data.reference_number || `REF-${Date.now().toString().slice(-6)}`,
      status: "completed",
      notes: data.notes || "",
      recorded_by: data.recorded_by || adminEmail,
      created_at: new Date().toISOString(),
    };

    this.payments.unshift(newPayment);

    // Update invoice amount paid & balance
    invoice.amount_paid = Math.round(((invoice.amount_paid || 0) + amount) * 100) / 100;
    invoice.balance_due = Math.max(0, Math.round((invoice.total_amount - invoice.amount_paid) * 100) / 100);

    if (invoice.balance_due <= 0.001) {
      invoice.status = "paid";
    } else {
      invoice.status = "partially_paid";
    }
    invoice.updated_at = new Date().toISOString();

    // Update customer last activity
    const cust = this.getCustomerById(invoice.customer_id);
    if (cust) {
      cust.last_activity = new Date().toISOString();
    }

    this.logActivity(
      adminEmail,
      "PAYMENT_RECORDED",
      "payment",
      newPayment.id,
      `Recorded ${data.payment_method.replace("_", " ")} payment of $${amount.toFixed(2)} for Invoice #${invoice.invoice_number} (Ref: ${newPayment.reference_number})`
    );

    return { payment: newPayment, invoice };
  }

  // ==========================================
  // POS PROJECTS
  // ==========================================
  getProjects(): POSProject[] {
    return [...this.projects].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getProjectsByCustomerId(customerId: string): POSProject[] {
    return this.projects.filter((p) => p.customer_id === customerId);
  }

  getProjectById(id: string): POSProject | null {
    return this.projects.find((p) => p.id === id) || null;
  }

  createProject(
    data: {
      project_name: string;
      customer_id: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      service?: string;
      location?: string;
      start_date?: string;
      expected_completion?: string;
      quote_id?: string;
      estimate_id?: string;
      notes?: string;
      images?: string[];
      estimated_value?: number;
    },
    adminEmail = "admin@completeglass.com.au"
  ): POSProject {
    const customer = this.getCustomerById(data.customer_id);
    const newProject: POSProject = {
      id: `pos-proj-${Date.now()}`,
      project_name: data.project_name,
      customer_id: data.customer_id,
      customer_name: data.customer_name || customer?.name || "Client",
      customer_email: data.customer_email || customer?.email || "",
      customer_phone: data.customer_phone || customer?.phone || "",
      service: data.service || "Custom Glazing",
      location: data.location || "Sydney, NSW",
      start_date: data.start_date || new Date().toISOString().split("T")[0],
      expected_completion: data.expected_completion,
      status: "quote",
      quote_id: data.quote_id,
      estimate_id: data.estimate_id,
      notes: data.notes || "",
      images: data.images || ["/images/services/glass-balustrades.jpg"],
      estimated_value: data.estimated_value || 0,
      created_at: new Date().toISOString(),
    };

    this.projects.unshift(newProject);

    if (customer) {
      customer.projects_count = (customer.projects_count || 0) + 1;
      customer.last_activity = new Date().toISOString();
    }

    this.logActivity(
      adminEmail,
      "PROJECT_CREATED",
      "project",
      newProject.id,
      `Initiated project "${newProject.project_name}" for ${newProject.customer_name}`
    );

    return newProject;
  }

  updateProjectStatus(
    id: string,
    status: POSProjectStatus,
    adminEmail = "admin@completeglass.com.au"
  ): POSProject | null {
    const p = this.getProjectById(id);
    if (!p) return null;
    p.status = status;
    p.updated_at = new Date().toISOString();
    if (status === "completed") {
      p.actual_completion = new Date().toISOString().split("T")[0];
    }

    this.logActivity(
      adminEmail,
      `PROJECT_${status.toUpperCase()}`,
      "project",
      p.id,
      `Updated project "${p.project_name}" status to ${status.replace("_", " ").toUpperCase()}`
    );

    return p;
  }

  // ==========================================
  // GLOBAL SEARCH
  // ==========================================
  searchAll(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        customers: [],
        quotes: [],
        estimates: [],
        invoices: [],
        projects: [],
      };
    }

    const matchedCustomers = this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.suburb && c.suburb.toLowerCase().includes(q))
    );

    const matchedEstimates = this.estimates.filter(
      (e) =>
        e.estimate_number.toLowerCase().includes(q) ||
        (e.customer_name && e.customer_name.toLowerCase().includes(q)) ||
        (e.project_name && e.project_name.toLowerCase().includes(q))
    );

    const matchedInvoices = this.invoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(q) ||
        (inv.customer_name && inv.customer_name.toLowerCase().includes(q)) ||
        (inv.project_name && inv.project_name.toLowerCase().includes(q))
    );

    const matchedProjects = this.projects.filter(
      (p) =>
        p.project_name.toLowerCase().includes(q) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        p.service.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );

    return {
      customers: matchedCustomers.slice(0, 5),
      estimates: matchedEstimates.slice(0, 5),
      invoices: matchedInvoices.slice(0, 5),
      projects: matchedProjects.slice(0, 5),
    };
  }

  // ==========================================
  // DASHBOARD KPI STATS
  // ==========================================
  getStats(quotesCount: { newCount: number; activeCount: number; totalCount: number }) {
    const totalEstimates = this.estimates.length;
    const completedProjects = this.projects.filter((p) => p.status === "completed").length;
    const unpaidInvoices = this.invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled");
    const outstandingAmount = unpaidInvoices.reduce((acc, curr) => acc + curr.balance_due, 0);
    const totalRevenue = this.payments.reduce((acc, curr) => acc + (curr.status === "completed" ? curr.amount : 0), 0);
    const totalCustomers = this.customers.length;

    return {
      totalLeads: quotesCount.totalCount,
      newQuotes: quotesCount.newCount,
      activeQuotes: quotesCount.activeCount,
      completedProjects,
      totalEstimates,
      unpaidInvoicesCount: unpaidInvoices.length,
      outstandingAmount: Math.round(outstandingAmount * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCustomers,
      recentActivity: this.getActivityLogs(5),
    };
  }
}

// Global singleton to preserve POS state across hot-reloading in dev
const globalForPOS = globalThis as unknown as { __posStore?: POSStore };
export const posStore = globalForPOS.__posStore ?? new POSStore();
if (process.env.NODE_ENV !== "production") globalForPOS.__posStore = posStore;
