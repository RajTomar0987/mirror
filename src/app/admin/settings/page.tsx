"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Key,
  Database,
  LogOut,
  CheckCircle2,
  Save,
  Loader2,
  Building,
  DollarSign,
  CreditCard,
  FileText,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { clearAdminToken, getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { CompanySettings } from "@/types";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<CompanySettings>({
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
    gst_rate: 0.10,
    bank_name: "Commonwealth Bank of Australia",
    account_name: "Complete Glass Innovations Pty Ltd",
    bsb: "062-000",
    account_number: "1234 5678",
    invoice_prefix: "CGI-INV-",
    estimate_prefix: "CGI-EST-",
    quote_prefix: "CGI-Q-",
    estimate_terms_default: "Valid for 30 days. 50% deposit required upon confirmation. All glazing certified to AS1288.",
    invoice_terms_default: "Payment strictly within 14 days of invoice date. EFT preferred.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: CompanySettings };
        if (data && data.success && data.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Company profile & Australian GST settings saved successfully", "success");
      } else {
        showToast(data?.error || "Failed to save settings", "error");
      }
    } catch {
      showToast("Network error saving settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    showToast("Logged out of administrative session", "info");
    router.push("/admin/login");
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [System Settings & Tax Compliance]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              POS & BUSINESS SETTINGS
            </h1>
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Configuration
          </button>
        </div>

        {/* Section 1: Australian GST & Tax Settings */}
        <div className="p-6 sm:p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <DollarSign size={20} className="text-emerald-500" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Australian Goods & Services Tax (GST)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                GST Rate (Decimal, e.g. 0.10 for 10%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  required
                  value={settings.gst_rate}
                  onChange={(e) => setSettings({ ...settings, gst_rate: Number(e.target.value) || 0.10 })}
                  className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                />
              </div>
              <span className="text-[10px] font-mono text-brand-gray mt-1 block">
                Standard Australian GST is 10% (0.10). Automatically applied to all quotes, estimates, and tax invoices.
              </span>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-xs text-brand-charcoal dark:text-brand-gray-light leading-relaxed">
              <span className="font-bold text-emerald-600 block mb-1 font-mono uppercase text-[10px]">
                Tax Calculation Verification
              </span>
              Subtotal: $1,000.00 → GST: ${(1000 * settings.gst_rate).toFixed(2)} → Total: ${(1000 * (1 + settings.gst_rate)).toFixed(2)} AUD
            </div>
          </div>
        </div>

        {/* Section 2: Business & ABN Information */}
        <div className="p-6 sm:p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <Building size={20} className="text-blue-500" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Company & Registration Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Registered Business Name
              </label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Australian Business Number (ABN) *
              </label>
              <input
                type="text"
                required
                value={settings.abn}
                onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Billing Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Physical Workshop / Office Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="128 Architectural Way, Alexandria NSW 2015"
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Banking & Electronic Transfer Details */}
        <div className="p-6 sm:p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <CreditCard size={20} className="text-purple-500" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Bank Account Details for Invoices (EFT)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-brand-gray block mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-brand-gray block mb-1">Account Name</label>
              <input
                type="text"
                value={settings.account_name}
                onChange={(e) => setSettings({ ...settings, account_name: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-brand-gray block mb-1">BSB Number</label>
              <input
                type="text"
                value={settings.bsb}
                onChange={(e) => setSettings({ ...settings, bsb: e.target.value })}
                placeholder="062-000"
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-brand-gray block mb-1">Account Number</label>
              <input
                type="text"
                value={settings.account_number}
                onChange={(e) => setSettings({ ...settings, account_number: e.target.value })}
                placeholder="1234 5678"
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Default Terms & AS1288 Disclaimer */}
        <div className="p-6 sm:p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <FileText size={20} className="text-indigo-500" />
            <h2 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
              Default Estimate & Invoice Terms
            </h2>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Default Estimate Terms (Shown on Estimate PDFs)
              </label>
              <textarea
                rows={2}
                value={settings.estimate_terms_default}
                onChange={(e) => setSettings({ ...settings, estimate_terms_default: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                Default Invoice Terms & Payment Policy
              </label>
              <textarea
                rows={2}
                value={settings.invoice_terms_default}
                onChange={(e) => setSettings({ ...settings, invoice_terms_default: e.target.value })}
                className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* End Session Button */}
        <div className="p-6 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark flex items-center justify-between">
          <div>
            <span className="font-bold text-xs uppercase font-mono text-brand-charcoal dark:text-white block">
              Active Administrative Session
            </span>
            <span className="text-[10px] font-mono text-brand-gray">
              Role: Super Admin · AS1288 Certified System
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-600 text-white text-xs uppercase font-mono font-bold py-2.5 px-5 hover:bg-red-700 transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
