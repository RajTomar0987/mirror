"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  FileText,
  Calculator,
  Briefcase,
  Receipt,
  CreditCard,
  User,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    category: "Quotes",
    q: "How quickly will I receive an architectural glass quote review?",
    a: "Our chief glazing engineers review submissions within 24 to 48 business hours. We verify structural AS1288 load calculations and laser measurement tolerances before issuing an estimate.",
  },
  {
    category: "Quotes",
    q: "Can I upload architectural CAD drawings or site photos?",
    a: "Yes! You can attach PDF plans, DWG files, or site photographs directly on the quote request form or send them through the Messages portal.",
  },
  {
    category: "Estimates",
    q: "What is included in an itemized estimate?",
    a: "Every estimate includes precise glass specifications (e.g. 10mm/12mm Toughened/Laminated safety glass), marine-grade hardware (2205 duplex spigots/hinges), site templating, crane hoisting where necessary, installation labour, and Australian 10% GST.",
  },
  {
    category: "Estimates",
    q: "How long is a commercial estimate valid?",
    a: "Estimates are guaranteed for 30 days from the date of issue to protect against raw glass material market fluctuations.",
  },
  {
    category: "Projects",
    q: "What are the stages of an installation project?",
    a: "Projects follow an 8-stage sequence: Consultation → Design → Measurement → Engineering → Fabrication → Delivery → Installation → Completed Handover.",
  },
  {
    category: "Projects",
    q: "Will you provide an AS1288 Certificate of Compliance upon completion?",
    a: "Absolutely. All Complete Glass Innovations installations include a formal AS1288 Certificate of Compliance signed by our licensed master glaziers.",
  },
  {
    category: "Invoices & Payments",
    q: "What payment methods are supported?",
    a: "We accept Direct Bank Transfer (EFT / Wire) to our Commonwealth Bank account, as well as Visa and Mastercard.",
  },
  {
    category: "Invoices & Payments",
    q: "How are progressive milestone deposits structured?",
    a: "Standard projects typically require a 50% production deposit to commence glass tempering, followed by the remaining 50% upon installation sign-off.",
  },
];

export default function CustomerHelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = ["All", "Quotes", "Estimates", "Projects", "Invoices & Payments"];

  const filteredFAQs = FAQ_LIST.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header Banner */}
        <div className="p-8 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-500/10 border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-4 shadow-sm text-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-blue-500 font-bold block">
            [Knowledge Base & Direct Support]
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-charcoal dark:text-white">
            How can our glazing team assist you?
          </h1>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search size={16} className="absolute left-4 top-5 text-brand-gray" />
            <input
              type="text"
              placeholder="Search answers on quotes, estimates, AS1288 standards, payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.1] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm shadow-sm"
            />
          </div>
        </div>

        {/* 3 Contact Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/portal/messages"
            className="p-5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm hover:border-blue-500/50 transition-all block group"
          >
            <div className="w-10 h-10 rounded-sm bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <MessageSquare size={20} />
            </div>
            <span className="font-bold text-xs uppercase font-mono text-brand-charcoal dark:text-white block mb-1">
              Live Messaging
            </span>
            <p className="text-[11px] text-brand-gray leading-snug">
              Chat directly with your assigned Project Manager or Estimator.
            </p>
          </Link>

          <a
            href="tel:+61298765432"
            className="p-5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm hover:border-cyan-500/50 transition-all block group"
          >
            <div className="w-10 h-10 rounded-sm bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <Phone size={20} />
            </div>
            <span className="font-bold text-xs uppercase font-mono text-brand-charcoal dark:text-white block mb-1">
              Phone Support
            </span>
            <p className="text-[11px] text-brand-gray leading-snug">
              Call our Sydney headquarters: <strong>+61 2 9876 5432</strong>
            </p>
          </a>

          <a
            href="mailto:support@completeglass.com.au"
            className="p-5 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm hover:border-purple-500/50 transition-all block group"
          >
            <div className="w-10 h-10 rounded-sm bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Mail size={20} />
            </div>
            <span className="font-bold text-xs uppercase font-mono text-brand-charcoal dark:text-white block mb-1">
              Email Help Desk
            </span>
            <p className="text-[11px] text-brand-gray leading-snug">
              Send technical specs to: <strong>support@completeglass.com.au</strong>
            </p>
          </a>
        </div>

        {/* FAQ Accordion Section */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-glass-border-light dark:border-white/[0.08]">
            <h2 className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2">
              <HelpCircle size={14} className="text-blue-500" /> Frequently Asked Questions
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-black/5 dark:bg-white/5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
            {filteredFAQs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-semibold text-xs text-brand-charcoal dark:text-white hover:text-blue-500 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp size={16} className="flex-shrink-0" /> : <ChevronDown size={16} className="flex-shrink-0 text-brand-gray" />}
                  </button>

                  {isExpanded && (
                    <p className="mt-3 text-xs text-brand-gray leading-relaxed font-sans pr-6 animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
