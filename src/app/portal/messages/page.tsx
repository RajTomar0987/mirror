"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";

interface ChannelMessage {
  id: string;
  sender_email: string;
  sender_name: string;
  is_staff: boolean;
  message: string;
  created_at: string;
}

interface Channel {
  id: string;
  name: string;
  role: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: ChannelMessage[];
}

export default function CustomerMessagesPage() {
  const { showToast } = useToast();
  const [activeChannelId, setActiveChannelId] = useState("channel-pm");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "channel-pm",
      name: "Project Manager (Marcus Croft)",
      role: "Chief Glazing Supervisor",
      unreadCount: 1,
      lastMessage: "Installation crew confirmed for Tuesday 8:30 AM arrival.",
      lastTime: "10m ago",
      messages: [
        {
          id: "m-1",
          sender_email: "pm@completeglass.com.au",
          sender_name: "Marcus Croft (Project Manager)",
          is_staff: true,
          message: "Hi Alexander, your custom 12mm balustrade panels have completed furnace tempering and edge polishing.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: "m-2",
          sender_email: "alexander@vance.com.au",
          sender_name: "Alexander Vance",
          is_staff: false,
          message: "Thanks Marcus! Will the team need access to the lower terrace gate for the crane hoist?",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        },
        {
          id: "m-3",
          sender_email: "pm@completeglass.com.au",
          sender_name: "Marcus Croft (Project Manager)",
          is_staff: true,
          message: "Yes please, that will allow our installers to hoist the spigots directly onto the perimeter deck. Installation crew confirmed for Tuesday 8:30 AM arrival.",
          created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
      ],
    },
    {
      id: "channel-quote",
      name: "Quote #QT-2026-014 Spec Desk",
      role: "Engineering Estimator",
      unreadCount: 0,
      lastMessage: "Estimate #EST-2026-001 has been posted to your portal.",
      lastTime: "2h ago",
      messages: [
        {
          id: "mq-1",
          sender_email: "estimates@completeglass.com.au",
          sender_name: "Elena Rostova (Estimator)",
          is_staff: true,
          message: "Hello! We have reviewed your fluted glass shower screen specs and prepared itemized pricing including AS1288 certification.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
        {
          id: "mq-2",
          sender_email: "estimates@completeglass.com.au",
          sender_name: "Elena Rostova (Estimator)",
          is_staff: true,
          message: "Estimate #EST-2026-001 has been posted to your portal for review and approval.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
      ],
    },
    {
      id: "channel-site",
      name: "Installation Site Team A",
      role: "Master Glaziers",
      unreadCount: 0,
      lastMessage: "Laser templating verified at 0mm variance.",
      lastTime: "1d ago",
      messages: [
        {
          id: "ms-1",
          sender_email: "site@completeglass.com.au",
          sender_name: "Liam O'Connor (Glazier)",
          is_staff: true,
          message: "Site laser measurement verified yesterday. Millimeter precision tolerance achieved.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        },
      ],
    },
    {
      id: "channel-billing",
      name: "Accounts & Billing Support",
      role: "Finance Officer",
      unreadCount: 0,
      lastMessage: "Deposit receipt #RCT-2026-001 reconciled.",
      lastTime: "3d ago",
      messages: [
        {
          id: "mb-1",
          sender_email: "accounts@completeglass.com.au",
          sender_name: "CGI Accounts",
          is_staff: true,
          message: "Your EFT deposit payment of $4,850.00 AUD has been reconciled and applied to Invoice #INV-2026-001.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        },
      ],
    },
  ]);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    const userMsg: ChannelMessage = {
      id: `msg-${Date.now()}`,
      sender_email: "user@client.com.au",
      sender_name: "You",
      is_staff: false,
      message: messageText,
      created_at: new Date().toISOString(),
    };

    // Update active channel messages
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === activeChannelId
          ? {
              ...ch,
              lastMessage: messageText,
              lastTime: "Just now",
              messages: [...ch.messages, userMsg],
            }
          : ch
      )
    );

    setNewMessage("");

    // Simulate staff response indicator after short delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const staffReply: ChannelMessage = {
        id: `msg-reply-${Date.now()}`,
        sender_email: "staff@completeglass.com.au",
        sender_name: activeChannel.name.split(" ")[0],
        is_staff: true,
        message: "Thank you for the update. Our team has recorded this in your project file.",
        created_at: new Date().toISOString(),
      };

      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === activeChannelId
            ? {
                ...ch,
                lastMessage: staffReply.message,
                lastTime: "Just now",
                messages: [...ch.messages, staffReply],
              }
            : ch
        )
      );
    }, 1800);
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }) + " · " + d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" });
    } catch {
      return dateStr;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-500 block mb-1">
              [Direct Customer Support & Project Channels]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MESSAGES
            </h1>
          </div>
        </div>

        {/* 2-Column Chat Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-brand-glass-border-light dark:border-white/[0.08] bg-white dark:bg-[#0f1217] rounded-sm overflow-hidden h-[680px] shadow-md">
          {/* Left Column: Channels List */}
          <div className="md:col-span-4 border-r border-brand-glass-border-light dark:border-white/[0.08] flex flex-col bg-[#f8f9fa] dark:bg-[#0c0e12]">
            <div className="p-4 border-b border-brand-glass-border-light dark:border-white/[0.08]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gray font-bold block">
                Support Channels
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-brand-glass-border-light dark:divide-white/[0.05]">
              {channels.map((ch) => {
                const isActive = ch.id === activeChannelId;

                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full p-4 text-left transition-colors block ${
                      isActive
                        ? "bg-white dark:bg-[#151921] border-l-2 border-blue-500"
                        : "hover:bg-black/5 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-brand-charcoal dark:text-white truncate">
                        {ch.name}
                      </span>
                      <span className="text-[10px] font-mono text-brand-gray flex-shrink-0">{ch.lastTime}</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 block mb-1">{ch.role}</span>
                    <p className="text-[11px] text-brand-gray truncate font-sans leading-snug">{ch.lastMessage}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Conversation View */}
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-[#0f1217]">
            {/* Conversation Header */}
            <div className="p-4 border-b border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between bg-[#fcfcfc] dark:bg-[#0f1217]">
              <div>
                <span className="font-bold text-xs text-brand-charcoal dark:text-white block">
                  {activeChannel.name}
                </span>
                <span className="text-[10px] font-mono text-brand-gray">
                  Channel: {activeChannel.role} · Dedicated Thread
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Staff Online</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeChannel.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    m.is_staff ? "mr-auto items-start" : "ml-auto items-end"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-brand-gray">
                    <span className="font-semibold text-brand-charcoal dark:text-white">{m.sender_name}</span>
                    <span>·</span>
                    <span>{formatTime(m.created_at)}</span>
                  </div>
                  <div
                    className={`p-4 text-xs font-sans rounded-sm leading-relaxed ${
                      m.is_staff
                        ? "bg-[#f4f5f7] dark:bg-[#161a22] text-brand-charcoal dark:text-gray-200 border border-brand-glass-border-light dark:border-white/[0.08]"
                        : "bg-blue-600 text-white shadow-sm"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-mono text-brand-gray animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span>{activeChannel.name.split(" ")[0]} is typing...</span>
                </div>
              )}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-glass-border-light dark:border-white/[0.08] bg-[#f8f9fa] dark:bg-[#0c0e12] flex gap-3">
              <input
                type="text"
                required
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeChannel.name.split(" ")[0]}...`}
                className="flex-1 p-3 bg-white dark:bg-[#12151b] border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-sm transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
              >
                {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
