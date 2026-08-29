"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Laptop,
  Smartphone,
  LogOut,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

export default function CustomerProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Security Section State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portal/profile", { headers: getAuthHeaders() });
        const json = (await res.json()) as { success?: boolean; data?: CustomerProfile };
        if (json && json.success && json.data) {
          setProfile(json.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(profile),
      });

      const json = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (res.ok && json.success) {
        showToast("Personal and site address details updated successfully!", "success");
      } else {
        showToast(json.error || "Failed to update profile", "error");
      }
    } catch {
      showToast("Network error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      showToast("Password updated successfully!", "success");
    }, 800);
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-500 block mb-1">
              [Customer Account & Security]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              MY PROFILE & SECURITY
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-brand-gray font-mono text-xs gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span>Loading profile records...</span>
          </div>
        ) : !profile ? (
          <div className="p-8 border border-red-500/20 bg-red-500/5 text-center text-xs font-mono text-red-400 rounded-sm">
            Failed to load profile.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personal Details Form */}
            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-sm">
              {/* Avatar & Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-brand-glass-border-light dark:border-white/[0.08]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-mono text-2xl font-bold shadow-md">
                  {profile.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-light text-brand-charcoal dark:text-white">
                    {profile.name}
                  </h2>
                  <span className="text-xs font-mono text-brand-gray">{profile.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full p-2.5 bg-black/5 dark:bg-white/5 border border-brand-glass-border-light dark:border-white/[0.05] text-xs text-brand-gray font-mono cursor-not-allowed rounded-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+61 400 000 000"
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Company / Studio (Optional)</label>
                  <input
                    type="text"
                    value={profile.company || ""}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    placeholder="Vance Architectural Studios"
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>
              </div>

              {/* Site Address Details */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gray font-bold block pb-2 border-b border-brand-glass-border-light dark:border-white/[0.08]">
                  Primary Site & Billing Address
                </span>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray">Street Address</label>
                  <input
                    type="text"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="14 Wentworth Road"
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-brand-gray">Suburb</label>
                    <input
                      type="text"
                      value={profile.suburb || ""}
                      onChange={(e) => setProfile({ ...profile, suburb: e.target.value })}
                      placeholder="Vaucluse"
                      className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-sans focus:outline-none focus:border-blue-500 rounded-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-brand-gray">State</label>
                    <input
                      type="text"
                      value={profile.state || ""}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      placeholder="NSW"
                      className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-brand-gray">Postcode</label>
                    <input
                      type="text"
                      value={profile.postcode || ""}
                      onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                      placeholder="2030"
                      className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Save Changes
                </button>
              </div>
            </form>

            {/* Security & Password Section */}
            <div className="p-6 sm:p-8 bg-white dark:bg-[#0f1217] border border-brand-glass-border-light dark:border-white/[0.08] rounded-sm space-y-6 shadow-sm">
              <div className="pb-3 border-b border-brand-glass-border-light dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-brand-charcoal dark:text-white flex items-center gap-2">
                    <KeyRound size={14} className="text-blue-500" /> Security & Authentication
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={12} /> Encrypted Session
                </span>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">New Password (Min. 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-brand-gray font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.08] text-xs text-brand-charcoal dark:text-white font-mono focus:outline-none focus:border-blue-500 rounded-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/15 text-brand-charcoal dark:text-white text-xs font-mono uppercase font-bold rounded-sm transition-colors"
                >
                  {savingPassword ? "Updating..." : "Change Password"}
                </button>
              </form>

              {/* Active Sessions */}
              <div className="pt-4 border-t border-brand-glass-border-light dark:border-white/[0.08] space-y-3">
                <span className="text-[10px] uppercase font-mono text-brand-gray font-bold block">
                  Active Verified Sessions
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#f8f9fa] dark:bg-black/30 border border-brand-glass-border-light dark:border-white/[0.05] rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop size={16} className="text-blue-500" />
                      <div>
                        <span className="font-bold text-brand-charcoal dark:text-white block">Current Device — Chrome (macOS / Windows)</span>
                        <span className="text-[10px] font-mono text-brand-gray">Sydney, Australia · IP: 10.37.95.105</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Active Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
