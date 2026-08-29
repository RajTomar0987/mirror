"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Calculator,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Download,
  MessageSquare,
  Layers,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { Estimate, QuoteRequest } from "@/types";
import { DocumentPrintView } from "@/components/admin/DocumentPrintView";
import { ThreeDTimeline, TimelineStage } from "@/components/3d/ThreeDTimeline";
import { ThreeDCard } from "@/components/3d/ThreeDCard";

interface QuoteDetailData extends QuoteRequest {
  linkedEstimate?: Estimate | null;
}

const SIX_QUOTE_STAGES: TimelineStage[] = [
  { id: "submitted", label: "Quote Submitted", desc: "Customer requirements & scope registered." },
  { id: "reviewed", label: "Request Reviewed", desc: "Engineering team verified structural feasibility." },
  { id: "contacted", label: "Staff Contacted", desc: "Consultation conducted & measurements confirmed." },
  { id: "prepared", label: "Estimate Prepared", desc: "Itemized glass & marine hardware pricing calculated." },
  { id: "sent", label: "Estimate Sent", desc: "Commercial proposal delivered to client portal." },
  { id: "decision", label: "Customer Decision", desc: "Proposal approved & site installation scheduled." },
];

function getTimelineIndex(status?: string): number {
  const s = (status || "new").toLowerCase();
  if (s === "approved" || s === "accepted" || s === "completed") return 5;
  if (s === "estimate_sent") return 4;
  if (s === "site_visit" || s === "reviewing" || s === "in_review") return 2;
  if (s === "contacted") return 2;
  return 1;
}

export default function CustomerQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;

  const [quote, setQuote] = useState<QuoteDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewPrint, setPreviewPrint] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/portal/quotes/${id}`, { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: QuoteDetailData; error?: string };
        if (json && json.success && json.data) {
          setQuote(json.data);
        } else {
          setError(json.error || "Quote request not found");
        }
      } catch {
        setError("Network error fetching quote details");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
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

  const currentTimelineIndex = getTimelineIndex(quote?.status);

  return (
    <PortalLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Top Back Nav & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal/quotes"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to My Quotes
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewPrint(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-glass-border-light dark:border-white/10 text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors rounded-sm"
            >
              <Download size={13} /> Print Spec Sheet
            </button>
            <Link
              href="/portal/messages"
              className="btn-3d inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold uppercase rounded-sm hover:bg-blue-600/20 transition-all"
            >
              <MessageSquare size={13} /> Message Staff
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-brand-gray flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span>Loading quote specifications...</span>
          </div>
        ) : error || !quote ? (
          <div className="p-8 border border-red-500/20 bg-red-500/5 text-center space-y-2 rounded-sm">
            <p className="text-sm text-red-400 font-bold">{error || "Quote not found"}</p>
            <Link href="/portal/quotes" className="text-xs font-mono text-blue-500 underline">
              Return to quote directory
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Card with 3D Depth */}
            <ThreeDCard
              maxRotation={3}
              depth={14}
              className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-glass-border-light dark:border-white/[0.08]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-500 block mb-0.5">
                    [Quote #{quote.id?.slice(0, 11)}]
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-light text-brand-charcoal dark:text-white">
                    {quote.service || quote.project_type || "Architectural Glazing"}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono px-3 py-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold rounded-sm shadow-xs">
                    Status: {(quote.status || "new").replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* 6-Stage Timeline Progress */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gray block font-semibold">
                  Quote Progression Sequence
                </span>
                <ThreeDTimeline
                  stages={SIX_QUOTE_STAGES}
                  currentStageIndex={currentTimelineIndex}
                />
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans pt-2">
                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Customer Contact</span>
                  <span className="font-semibold text-brand-charcoal dark:text-white block">{quote.name}</span>
                  <span className="text-[10px] text-brand-gray block">{quote.phone || quote.email}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Site Location</span>
                  <span className="font-medium text-brand-charcoal dark:text-white block">{quote.location || quote.suburb || "Sydney, NSW"}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Submission Date</span>
                  <span className="font-mono text-brand-charcoal dark:text-white block">{formatDate(quote.created_at || quote.createdAt)}</span>
                </div>

                <div className="p-3.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gray block">Estimated Value</span>
                  <span className="font-mono text-brand-charcoal dark:text-white font-bold block">
                    ${quote.estimated_value ? quote.estimated_value.toLocaleString() : quote.budget || "18,500"} AUD
                  </span>
                </div>
              </div>

              {/* Scope & Requirements */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs uppercase font-mono tracking-widest text-brand-gray">
                  Project Scope & Requirements
                </h3>
                <div className="p-4 bg-[#f8f9fa] dark:bg-black/20 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm text-xs text-brand-charcoal dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {quote.message || quote.description || "Perimeter frameless glass balustrading for ocean-facing terrace. Requires AS1288 12mm toughened laminated glass with 2205 duplex marine-grade spigots."}
                </div>
              </div>

              {/* Measurements */}
              <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-sm text-xs font-mono text-blue-400 space-y-1">
                <span className="font-bold block uppercase text-[10px]">Site Measurements Specification:</span>
                <span>{quote.measurements || "Terrace Length: 24.5m, Height: 1200mm (Standard AS1288)"}</span>
              </div>
            </ThreeDCard>

            {/* Linked Commercial Estimate Banner with 3D Depth */}
            {quote.linkedEstimate && (
              <ThreeDCard
                maxRotation={3}
                depth={12}
                className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calculator size={16} className="text-purple-400" />
                    <span className="font-mono text-xs uppercase font-bold text-purple-400">
                      Estimate #{quote.linkedEstimate.estimate_number} Prepared
                    </span>
                  </div>
                  <p className="text-xs text-brand-charcoal dark:text-white font-sans">
                    An itemized commercial estimate of <strong className="font-mono">${quote.linkedEstimate.total_amount?.toLocaleString("en-AU", { minimumFractionDigits: 2 })} AUD</strong> is ready for your review.
                  </p>
                </div>

                <Link
                  href={`/portal/estimates/${quote.linkedEstimate.id}`}
                  className="btn-3d px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto shadow-md"
                >
                  Review & Approve <ArrowUpRight size={13} />
                </Link>
              </ThreeDCard>
            )}
          </div>
        )}

        {/* Printable View */}
        {previewPrint && quote && (
          <DocumentPrintView
            type="quote"
            data={quote}
            onClose={() => setPreviewPrint(false)}
          />
        )}
      </div>
    </PortalLayout>
  );
}
