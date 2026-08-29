"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Sliders,
  User,
  CheckCircle2,
  Save,
  Moon,
  Globe,
  DollarSign,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { useToast } from "@/components/admin/Toast";

export default function CustomerSettingsPage() {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    emailAll: true,
    quoteUpdates: true,
    estimateUpdates: true,
    projectMilestones: true,
    invoiceReminders: true,
    paymentReceipts: true,
    smsAlerts: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "system",
    currency: "AUD",
    measurementUnits: "metric",
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    showToast("Settings preferences saved successfully!", "success");
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-500 block mb-1">
              [System Preferences & Alerts]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              SETTINGS
            </h1>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Save size={13} /> Save Preferences
          </button>
        </div>

        {/* Notifications Section */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-sm">
          <div className="pb-3 border-b border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2">
              <Bell size={14} className="text-blue-500" /> Automated Email & SMS Notifications
            </h2>
            <span className="text-[10px] font-mono text-brand-gray">AS1288 Glazing Updates</span>
          </div>

          <div className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05] text-xs font-sans">
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Email Notifications</span>
                <span className="text-brand-gray text-[11px]">Receive primary consultation and engineering updates via email.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailAll")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.emailAll ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.emailAll ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Quote Request Updates</span>
                <span className="text-brand-gray text-[11px]">Instant notifications when engineering staff reviews your quote.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("quoteUpdates")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.quoteUpdates ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.quoteUpdates ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Estimate Sign-Off Alerts</span>
                <span className="text-brand-gray text-[11px]">Alert when itemized commercial proposals are ready for review.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("estimateUpdates")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.estimateUpdates ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.estimateUpdates ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Project Installation Milestones</span>
                <span className="text-brand-gray text-[11px]">Alerts for templating, tempering, factory dispatch, and crane hoist.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("projectMilestones")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.projectMilestones ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.projectMilestones ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Invoice Due Date Reminders</span>
                <span className="text-brand-gray text-[11px]">Reminders prior to progressive payment milestone due dates.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("invoiceReminders")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.invoiceReminders ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.invoiceReminders ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-brand-charcoal dark:text-white block">Payment Reconciliation Receipts</span>
                <span className="text-brand-gray text-[11px]">Instant receipt confirmation when direct EFT or card settles.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("paymentReceipts")}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications.paymentReceipts ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications.paymentReceipts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Preferences */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-sm">
          <div className="pb-3 border-b border-brand-glass-border-light dark:border-white/[0.08]">
            <h2 className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2">
              <Sliders size={14} className="text-cyan-400" /> Architectural Units & Localization
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
              <span className="text-[10px] uppercase font-mono text-brand-gray block">Measurement Standard</span>
              <span className="font-bold text-brand-charcoal dark:text-white block">Metric (mm / meters)</span>
              <span className="text-[10px] text-brand-gray">Australian AS1288 standard</span>
            </div>

            <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
              <span className="text-[10px] uppercase font-mono text-brand-gray block">Currency & Tax</span>
              <span className="font-bold text-brand-charcoal dark:text-white block">AUD ($) · 10% GST</span>
              <span className="text-[10px] text-brand-gray">Australian Dollar standard</span>
            </div>

            <div className="p-4 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
              <span className="text-[10px] uppercase font-mono text-brand-gray block">Timezone</span>
              <span className="font-bold text-brand-charcoal dark:text-white block">Sydney (AEST/AEDT)</span>
              <span className="text-[10px] text-brand-gray">UTC +10:00 / +11:00</span>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
