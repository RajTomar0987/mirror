"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2, Star } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: Review[] };
      if (data && data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/reviews", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: Review[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error("Reviews fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleApproval = async (review: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ approved: !review.approved }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(`Review by ${review.author} ${!review.approved ? "approved" : "unapproved"}`, "success");
        fetchReviews();
      } else {
        showToast(data?.error || "Failed to update review", "error");
      }
    } catch {
      showToast("Network error updating review", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data && data.success) {
        showToast("Review deleted", "success");
        fetchReviews();
      }
    } catch {
      showToast("Error deleting review", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
            [Moderation Queue]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            CUSTOMER REVIEWS MODERATION
          </h1>
        </div>

        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">Loading reviews queue...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">No reviews in moderation queue.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Content</th>
                    <th className="py-3 px-4">Service & Suburb</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {reviews.map((r) => (
                    <tr key={r.id || r.author} className="hover:bg-brand-bg/5 dark:hover:bg-brand-charcoal/5">
                      <td className="py-4 px-4 font-serif font-light text-sm text-brand-charcoal dark:text-white">
                        {r.author}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: r.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-brand-gray max-w-sm font-light leading-relaxed">{r.content}</td>
                      <td className="py-4 px-4 text-brand-gray font-mono text-[10px]">
                        {r.serviceType || "Glazing"} — {r.suburb || "NSW"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] uppercase font-mono px-2.5 py-1 border ${
                            r.approved
                              ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {r.approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-3">
                        <button
                          onClick={() => handleToggleApproval(r)}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          {r.approved ? <X size={12} /> : <Check size={12} />}
                          {r.approved ? "Unapprove" : "Approve"}
                        </button>
                        {r.id && (
                          <button
                            onClick={() => handleDelete(r.id!)}
                            className="text-red-500 hover:text-red-700 font-mono text-xs"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
