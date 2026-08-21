"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Mail, Check, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { ContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: ContactMessage[] };
      if (data && data.success && Array.isArray(data.data)) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Messages fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/messages", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: ContactMessage[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("Messages fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    const newStatus = msg.status === "read" ? "unread" : "read";
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data && data.success) {
        showToast(`Message marked as ${newStatus}`, "success");
        fetchMessages();
      }
    } catch {
      showToast("Error updating message", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = (await res.json()) as { success?: boolean };
      if (data && data.success) {
        showToast("Message deleted", "success");
        fetchMessages();
      }
    } catch {
      showToast("Error deleting message", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
            [Enquiries Inbox]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            CONTACT MESSAGES
          </h1>
        </div>

        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">Loading messages inbox...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray flex flex-col items-center gap-2">
              <Mail size={24} />
              <span>No contact messages in inbox.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id || m.email}
                  className={`p-6 border transition-all ${
                    m.status === "unread"
                      ? "border-brand-charcoal dark:border-white bg-brand-bg/10 dark:bg-brand-charcoal/30"
                      : "border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark opacity-80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                    <div>
                      <span className="font-serif text-lg font-light text-brand-charcoal dark:text-white mr-3">{m.name}</span>
                      <a href={`mailto:${m.email}`} className="text-xs font-mono text-brand-gray hover:underline mr-3">
                        {m.email}
                      </a>
                      {m.phone && <span className="text-xs font-mono text-brand-gray">({m.phone})</span>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                          m.status === "unread"
                            ? "border-amber-500/40 text-amber-600 dark:text-amber-400"
                            : "border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-gray"
                        }`}
                      >
                        {m.status || "unread"}
                      </span>
                      {m.id && (
                        <>
                          <button
                            onClick={() => handleToggleRead(m)}
                            className="text-xs font-mono text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                          >
                            <Check size={14} className="inline mr-1" />
                            {m.status === "read" ? "Mark Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() => handleDelete(m.id!)}
                            className="text-red-500 hover:text-red-700 text-xs font-mono"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed font-sans font-light">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
