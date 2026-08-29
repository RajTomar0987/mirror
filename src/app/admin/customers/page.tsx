"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  X,
  Calculator,
  Receipt,
  CreditCard,
  Briefcase,
  DollarSign,
  Plus,
  Loader2,
  Building,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Customer, Estimate, Invoice, Payment, POSProject, QuoteRequest } from "@/types";

export default function AdminCustomersPage() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
  const [customerHistory, setCustomerHistory] = useState<{
    quotes: QuoteRequest[];
    estimates: Estimate[];
    invoices: Invoice[];
    payments: Payment[];
    projects: POSProject[];
  }>({
    quotes: [],
    estimates: [],
    invoices: [],
    payments: [],
    projects: [],
  });

  // New Customer Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newCustCompany, setNewCustCompany] = useState("");
  const [newCustNotes, setNewCustNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: Customer[] };
      if (data && data.success && Array.isArray(data.data)) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error("Customers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomerDetail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        headers: getAuthHeaders(),
      });
      const data = (await res.json()) as {
        success?: boolean;
        data?: {
          customer: Customer;
          quotes: QuoteRequest[];
          estimates: Estimate[];
          invoices: Invoice[];
          payments: Payment[];
          projects: POSProject[];
        };
      };
      if (data && data.success && data.data) {
        setCustomerHistory({
          quotes: data.data.quotes || [],
          estimates: data.data.estimates || [],
          invoices: data.data.invoices || [],
          payments: data.data.payments || [],
          projects: data.data.projects || [],
        });
      }
    } catch (err) {
      console.error("Error loading customer detail:", err);
    } finally {
      setCustomerDetailLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail || !newCustPhone) {
      showToast("Name, email, and phone number are required", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          name: newCustName,
          email: newCustEmail,
          phone: newCustPhone,
          address: newCustAddress,
          company: newCustCompany,
          notes: newCustNotes,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Customer added successfully", "success");
        setShowAddModal(false);
        setNewCustName("");
        setNewCustEmail("");
        setNewCustPhone("");
        setNewCustAddress("");
        setNewCustCompany("");
        setNewCustNotes("");
        fetchCustomers();
      } else {
        showToast(data?.error || "Failed to add customer", "error");
      }
    } catch {
      showToast("Error creating customer", "error");
    } finally {
      setCreating(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const term = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.suburb && c.suburb.toLowerCase().includes(term)) ||
        (c.company && c.company.toLowerCase().includes(term))
    );
  }, [customers, search]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [CRM & Account Management]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              CUSTOMER CRM
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Add Customer
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            placeholder="Search customers by name, company, email, phone, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark text-xs font-sans text-brand-charcoal dark:text-white focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Customers Table */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-xs font-mono text-brand-gray">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              Loading customer directory...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-16 text-xs font-mono text-brand-gray">
              {search ? "No customers match your search." : "No customers registered yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                    <th className="py-3.5 px-4 sm:px-6">Customer & Company</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Contact Info</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Location</th>
                    <th className="py-3.5 px-4 text-center">Quotes</th>
                    <th className="py-3.5 px-4 text-center">Projects</th>
                    <th className="py-3.5 px-4 text-right">Total Value</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id || customer.email}
                      onClick={() => openCustomerDetail(customer)}
                      className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-semibold text-brand-charcoal dark:text-white block">
                          {customer.name}
                        </span>
                        {customer.company && (
                          <span className="text-[10px] font-mono text-brand-gray flex items-center gap-1">
                            <Building size={10} /> {customer.company}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-brand-gray font-mono hidden md:table-cell">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1">
                            <Mail size={10} /> {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={10} /> {customer.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-brand-gray hidden lg:table-cell">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin size={10} /> {customer.address ? `${customer.address}, ` : ""}{customer.suburb || "Sydney"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-500 font-mono font-bold rounded-sm text-[11px]">
                          {customer.quote_count || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-500 font-mono font-bold rounded-sm text-[11px]">
                          {customer.projects_count || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-brand-charcoal dark:text-white">
                        ${(customer.total_value || 0).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-brand-gray font-mono text-[11px] hidden sm:table-cell">
                        {formatDate(customer.last_activity || customer.created_at)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCustomerDetail(customer);
                          }}
                          className="px-2.5 py-1 text-xs font-mono uppercase font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CUSTOMER 360° DETAIL DRAWER / MODAL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-gray block">
                    [Customer 360° Profile]
                  </span>
                  <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                    {selectedCustomer.name}
                  </h2>
                  {selectedCustomer.company && (
                    <span className="text-xs font-mono text-brand-gray">{selectedCustomer.company}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contact Information Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-brand-gray block">Email</span>
                  <a href={`mailto:${selectedCustomer.email}`} className="text-blue-500 hover:underline">
                    {selectedCustomer.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-brand-gray block">Phone</span>
                  <a href={`tel:${selectedCustomer.phone}`} className="text-brand-charcoal dark:text-white hover:underline">
                    {selectedCustomer.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-brand-gray block">Location</span>
                  <span className="text-brand-charcoal dark:text-white">
                    {selectedCustomer.address ? `${selectedCustomer.address}, ` : ""}{selectedCustomer.suburb || "Sydney NSW"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/estimates?customerId=${selectedCustomer.id}&customerName=${encodeURIComponent(selectedCustomer.name)}&customerEmail=${encodeURIComponent(selectedCustomer.email)}&customerPhone=${encodeURIComponent(selectedCustomer.phone)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono uppercase font-bold rounded-sm transition-colors"
                >
                  <Calculator size={13} /> New Estimate
                </Link>
                <Link
                  href={`/admin/invoices?customerId=${selectedCustomer.id}&customerName=${encodeURIComponent(selectedCustomer.name)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono uppercase font-bold rounded-sm transition-colors"
                >
                  <Receipt size={13} /> New Invoice
                </Link>
              </div>

              {customerDetailLoading ? (
                <div className="py-12 text-center text-xs font-mono text-brand-gray">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                  Loading customer history...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quotes History */}
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-widest text-brand-gray mb-2 flex items-center gap-1.5">
                      <FileText size={13} /> Quote Enquiries ({customerHistory.quotes.length})
                    </h3>
                    {customerHistory.quotes.length === 0 ? (
                      <p className="text-xs font-mono text-brand-gray p-3 bg-black/5 dark:bg-white/5">No quotes recorded.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {customerHistory.quotes.map((q) => (
                          <div
                            key={q.id}
                            className="p-3 border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <span className="font-bold text-brand-charcoal dark:text-white">
                                {q.service || q.project_type}
                              </span>
                              <span className="text-[10px] text-brand-gray block">
                                {formatDate(q.created_at)} · {q.location || "Sydney"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase px-2 py-0.5 border border-blue-500/30 text-blue-500">
                                {q.status || "new"}
                              </span>
                              <Link
                                href={`/admin/quotes/${q.id}`}
                                className="text-[10px] uppercase font-bold text-brand-charcoal dark:text-white hover:underline"
                              >
                                View →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Estimates History */}
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-widest text-brand-gray mb-2 flex items-center gap-1.5">
                      <Calculator size={13} /> Cost Estimates ({customerHistory.estimates.length})
                    </h3>
                    {customerHistory.estimates.length === 0 ? (
                      <p className="text-xs font-mono text-brand-gray p-3 bg-black/5 dark:bg-white/5">No estimates built yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {customerHistory.estimates.map((e) => (
                          <div
                            key={e.id}
                            className="p-3 border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <span className="font-bold text-brand-charcoal dark:text-white">
                                {e.estimate_number}
                              </span>
                              <span className="text-[10px] text-brand-gray block">
                                Valid until: {e.valid_until} · {e.items.length} items
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-brand-charcoal dark:text-white">
                                ${e.total_amount?.toLocaleString()}
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 border border-purple-500/30 text-purple-500">
                                {e.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Invoices & Payments History */}
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-widest text-brand-gray mb-2 flex items-center gap-1.5">
                      <Receipt size={13} /> Invoices & Payments ({customerHistory.invoices.length})
                    </h3>
                    {customerHistory.invoices.length === 0 ? (
                      <p className="text-xs font-mono text-brand-gray p-3 bg-black/5 dark:bg-white/5">No commercial invoices generated.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {customerHistory.invoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-3 border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <span className="font-bold text-brand-charcoal dark:text-white">
                                {inv.invoice_number}
                              </span>
                              <span className="text-[10px] text-brand-gray block">
                                Due: {inv.due_date} · Paid: ${inv.amount_paid?.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold block text-brand-charcoal dark:text-white">
                                Balance: ${inv.balance_due?.toLocaleString()}
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 border border-amber-500/30 text-amber-500">
                                {inv.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono uppercase font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CUSTOMER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <form
              onSubmit={handleCreateCustomer}
              className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-lg p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                  Add New Customer
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      placeholder="e.g. client@example.com.au"
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="e.g. +61 412 345 678"
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Company / Studio (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCustCompany}
                    onChange={(e) => setNewCustCompany(e.target.value)}
                    placeholder="e.g. Sterling Architectural Constructions"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Address / Suburb
                  </label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="e.g. 75 Ocean Avenue, Double Bay NSW 2028"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Client Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newCustNotes}
                    onChange={(e) => setNewCustNotes(e.target.value)}
                    placeholder="Special requirements, architectural preference..."
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
