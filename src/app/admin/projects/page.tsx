"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Briefcase,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
  Layers,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Customer, POSProject, POSProjectStatus, Project } from "@/types";

const WORKFLOW_STAGES: Array<{ key: POSProjectStatus | "All"; label: string }> = [
  { key: "All", label: "All Projects" },
  { key: "quote", label: "Quote Stage" },
  { key: "estimate", label: "Estimate Built" },
  { key: "accepted", label: "Deposit Accepted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_COLORS: Record<POSProjectStatus, string> = {
  quote: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  estimate: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  accepted: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  scheduled: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function AdminProjectsPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"pos" | "portfolio">("pos");
  const [posProjects, setPosProjects] = useState<POSProject[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<POSProjectStatus | "All">("All");

  // New POS Project Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjCustomerId, setNewProjCustomerId] = useState("");
  const [newProjService, setNewProjService] = useState("Glass Balustrades");
  const [newProjLocation, setNewProjLocation] = useState("Sydney, NSW");
  const [newProjStartDate, setNewProjStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [newProjExpected, setNewProjExpected] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().split("T")[0]
  );
  const [newProjNotes, setNewProjNotes] = useState("");
  const [newProjValue, setNewProjValue] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      const [projRes, custRes] = await Promise.all([
        fetch("/api/admin/projects", { headers: getAuthHeaders() }),
        fetch("/api/admin/customers", { headers: getAuthHeaders() }),
      ]);
      const projData = (await projRes.json()) as { success?: boolean; data?: POSProject[]; portfolioProjects?: Project[] };
      const custData = (await custRes.json()) as { success?: boolean; data?: Customer[] };

      if (projData && projData.success) {
        if (Array.isArray(projData.data)) setPosProjects(projData.data);
        if (Array.isArray(projData.portfolioProjects)) setPortfolioProjects(projData.portfolioProjects);
      }
      if (custData && custData.success && Array.isArray(custData.data)) {
        setCustomers(custData.data);
      }
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  const handleUpdateStatus = async (projectId: string, newStatus: POSProjectStatus) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(`Project moved to "${newStatus.replace("_", " ").toUpperCase()}"`, "success");
        fetchProjectsData();
      } else {
        showToast(data?.error || "Failed to update project", "error");
      }
    } catch {
      showToast("Error updating project status", "error");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjCustomerId) {
      showToast("Project name and customer selection are required", "error");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          project_name: newProjName,
          customer_id: newProjCustomerId,
          service: newProjService,
          location: newProjLocation,
          start_date: newProjStartDate,
          expected_completion: newProjExpected,
          notes: newProjNotes,
          estimated_value: Number(newProjValue) || 0,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Project initiated successfully", "success");
        setShowAddModal(false);
        setNewProjName("");
        setNewProjNotes("");
        setNewProjValue("");
        fetchProjectsData();
      } else {
        showToast(data?.error || "Failed to create project", "error");
      }
    } catch {
      showToast("Error creating project", "error");
    } finally {
      setCreating(false);
    }
  };

  const filteredPOSProjects = useMemo(() => {
    return posProjects.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.project_name.toLowerCase().includes(q) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        p.service.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);

      const matchesStage = stageFilter === "All" || p.status === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [posProjects, search, stageFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Installation Schedule & Case Studies]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              PROJECT MANAGEMENT
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "pos" ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> New POS Project
              </button>
            ) : (
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> Create Case Study
              </Link>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-2">
          <button
            onClick={() => setActiveTab("pos")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === "pos"
                ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                : "text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            Installation Workflow ({posProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === "portfolio"
                ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                : "text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
            }`}
          >
            Public Case Studies ({portfolioProjects.length})
          </button>
        </div>

        {activeTab === "pos" ? (
          <>
            {/* Workflow Stages Filter */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              {WORKFLOW_STAGES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStageFilter(s.key)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase rounded-sm transition-colors ${
                    stageFilter === s.key
                      ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal font-bold"
                      : "bg-black/5 dark:bg-white/5 text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                type="text"
                placeholder="Search project name, client name, service, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            {/* POS Projects Table */}
            <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark overflow-hidden">
              {loading ? (
                <div className="py-20 text-center text-xs font-mono text-brand-gray">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  Loading project workflows...
                </div>
              ) : filteredPOSProjects.length === 0 ? (
                <div className="py-20 text-center text-xs font-mono text-brand-gray">
                  No active projects match your stage filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray bg-[#fbfbfa] dark:bg-black/20">
                        <th className="py-3.5 px-4">Project Name</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4 hidden md:table-cell">Location</th>
                        <th className="py-3.5 px-4 hidden sm:table-cell">Timeline</th>
                        <th className="py-3.5 px-4">Workflow Stage</th>
                        <th className="py-3.5 px-4 text-right">Advance Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                      {filteredPOSProjects.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-[#f7f7f5] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-4 px-4 font-semibold text-brand-charcoal dark:text-white">
                            {p.project_name}
                            {p.notes && (
                              <span className="block text-[10px] text-brand-gray font-normal truncate max-w-xs mt-0.5">
                                {p.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-medium text-brand-charcoal dark:text-white">
                            <span className="block">{p.customer_name}</span>
                            <span className="text-[10px] text-brand-gray font-mono">{p.customer_email}</span>
                          </td>
                          <td className="py-4 px-4 text-brand-gray dark:text-brand-gray-light">
                            {p.service}
                          </td>
                          <td className="py-4 px-4 text-brand-gray font-mono hidden md:table-cell">
                            {p.location}
                          </td>
                          <td className="py-4 px-4 text-brand-gray font-mono text-[11px] hidden sm:table-cell">
                            {p.start_date || "—"} → {p.expected_completion || "—"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block text-[10px] uppercase font-mono px-2.5 py-1 border rounded-sm font-bold ${
                                STATUS_COLORS[p.status] || STATUS_COLORS.quote
                              }`}
                            >
                              {p.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdateStatus(p.id, e.target.value as POSProjectStatus)}
                              className="px-2.5 py-1 bg-brand-charcoal text-white text-[10px] font-mono uppercase rounded-sm border border-brand-glass-border-dark focus:outline-none"
                            >
                              <option value="quote">Quote</option>
                              <option value="estimate">Estimate</option>
                              <option value="accepted">Accepted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Portfolio Case Studies View */
          <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {portfolioProjects.map((p) => (
                    <tr key={p.slug} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="py-4 px-4 font-serif font-light text-sm text-brand-charcoal dark:text-white">
                        {p.title}
                        <span className="block text-[10px] text-brand-gray font-mono">{p.slug}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-brand-gray">{p.project_type}</td>
                      <td className="py-4 px-4 text-brand-gray">{p.location}</td>
                      <td className="py-4 px-4 font-mono text-brand-gray">{p.year}</td>
                      <td className="py-4 px-4 text-right space-x-3">
                        <Link
                          href={`/admin/projects/${p.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          <Edit2 size={12} /> Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD POS PROJECT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <form
              onSubmit={handleCreateProject}
              className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark w-full max-w-lg p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                  Initiate Installation Project
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
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="e.g. Double Bay Penthouse Balustrades"
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Customer *
                  </label>
                  <select
                    required
                    value={newProjCustomerId}
                    onChange={(e) => setNewProjCustomerId(e.target.value)}
                    className="w-full p-2.5 bg-[#f8f8f6] dark:bg-black/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                  >
                    <option value="">-- Select Client --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Service Category
                    </label>
                    <select
                      value={newProjService}
                      onChange={(e) => setNewProjService(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    >
                      <option value="Glass Balustrades">Glass Balustrades</option>
                      <option value="Frameless Glass Installations">Frameless Glass Installations</option>
                      <option value="Shower Screens">Shower Screens</option>
                      <option value="Glass Pool Fencing">Glass Pool Fencing</option>
                      <option value="Glass Splashbacks">Glass Splashbacks</option>
                      <option value="Custom Mirrors">Custom Mirrors</option>
                      <option value="Window Repairs & Glazing">Window Repairs & Glazing</option>
                      <option value="Pet Doors in Glass">Pet Doors in Glass</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Site Location
                    </label>
                    <input
                      type="text"
                      value={newProjLocation}
                      onChange={(e) => setNewProjLocation(e.target.value)}
                      placeholder="e.g. Vaucluse NSW 2030"
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newProjStartDate}
                      onChange={(e) => setNewProjStartDate(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                      Expected Completion
                    </label>
                    <input
                      type="date"
                      value={newProjExpected}
                      onChange={(e) => setNewProjExpected(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark font-mono text-brand-charcoal dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-brand-gray block mb-1">
                    Project Notes & Engineering Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={newProjNotes}
                    onChange={(e) => setNewProjNotes(e.target.value)}
                    placeholder="e.g. High wind load cliffside substrate, 15mm toughened low-iron glass..."
                    className="w-full p-2.5 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs font-sans text-brand-charcoal dark:text-white focus:outline-none"
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
                  {creating ? "Saving..." : "Start Project"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
