"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Calculator,
  Briefcase,
  Receipt,
  Check,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { useToast } from "@/components/admin/Toast";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  href: string;
  unread: boolean;
  category: "quote" | "estimate" | "project" | "invoice";
}

export default function CustomerNotificationsPage() {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "Estimate #EST-2026-001 is ready for approval",
      desc: "Your custom fluted shower screens estimate of $5,800 AUD is awaiting customer authorization.",
      time: "10 minutes ago",
      href: "/portal/estimates",
      unread: true,
      category: "estimate",
    },
    {
      id: "n-2",
      title: "Project Milestone Updated to 72%",
      desc: "Modern Harbour Residence: Glass tempering and marine spigot machining is complete.",
      time: "2 hours ago",
      href: "/portal/projects",
      unread: true,
      category: "project",
    },
    {
      id: "n-3",
      title: "Tax Invoice #INV-2026-001 Issued",
      desc: "Deposit progressive invoice for Modern Harbour Residence is ready for review.",
      time: "1 day ago",
      href: "/portal/invoices",
      unread: false,
      category: "invoice",
    },
    {
      id: "n-4",
      title: "Quote Request #QT-2026-014 Registered",
      desc: "Your perimeter frameless glass balustrade request has been assigned to Chief Estimator Elena Rostova.",
      time: "2 days ago",
      href: "/portal/quotes",
      unread: false,
      category: "quote",
    },
    {
      id: "n-5",
      title: "EFT Deposit Payment of $4,850.00 AUD Verified",
      desc: "Payment reconciled and applied to your account. Receipt generated.",
      time: "3 days ago",
      href: "/portal/payments",
      unread: false,
      category: "invoice",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read.", "success");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "estimate":
        return <Calculator size={16} className="text-purple-400" />;
      case "project":
        return <Briefcase size={16} className="text-cyan-400" />;
      case "invoice":
        return <Receipt size={16} className="text-amber-400" />;
      default:
        return <FileText size={16} className="text-blue-400" />;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-500 block mb-1">
              [Activity & Project Alerts]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              NOTIFICATIONS
            </h1>
          </div>

          <button
            onClick={markAllAsRead}
            className="px-4 py-2 border border-brand-glass-border-light dark:border-white/10 text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white rounded-sm transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Check size={14} /> Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] rounded-sm divide-y divide-brand-glass-border-light dark:divide-white/[0.05] shadow-sm">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 flex items-start gap-4 transition-colors ${
                n.unread
                  ? "bg-blue-500/[0.03] dark:bg-blue-500/[0.04]"
                  : "hover:bg-black/5 dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-sm flex-shrink-0 mt-0.5">
                {getCategoryIcon(n.category)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-brand-charcoal dark:text-white">
                      {n.title}
                    </span>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-brand-gray flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-brand-gray leading-relaxed font-sans">{n.desc}</p>
                <div className="pt-2">
                  <Link
                    href={n.href}
                    className="text-xs font-mono text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    View details <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
