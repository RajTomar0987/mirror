"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Project } from "@/types";

export default function AdminProjectsPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { headers: getAuthHeaders() });
      const data = (await res.json()) as { success?: boolean; data?: Project[] };
      if (data && data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/projects", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: Project[] };
        if (isMounted && data && data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      } catch (err) {
        console.error("Projects fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ published: !project.published }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast(`Project "${project.title}" ${!project.published ? "published" : "unpublished"}`, "success");
        fetchProjects();
      } else {
        showToast(data?.error || "Failed to update project", "error");
      }
    } catch {
      showToast("Network error updating project", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Project deleted successfully", "success");
        setDeleteId(null);
        fetchProjects();
      } else {
        showToast(data?.error || "Failed to delete project", "error");
      }
    } catch {
      showToast("Network error deleting project", "error");
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.project_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
              [Portfolio Management]
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
              PROJECT CASE STUDIES
            </h1>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs uppercase font-mono font-bold py-3 px-6 hover:bg-brand-gray transition-colors"
          >
            <Plus size={16} /> Create New Project
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, location, or type..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-sans"
          />
        </div>

        {/* Projects List */}
        <div className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-brand-gray">No projects found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-brand-glass-border-light dark:border-brand-glass-border-dark text-[10px] uppercase font-mono text-brand-gray">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-glass-border-light dark:divide-brand-glass-border-dark">
                  {filteredProjects.map((p) => (
                    <tr key={p.slug} className="hover:bg-brand-bg/5 dark:hover:bg-brand-charcoal/5">
                      <td className="py-4 px-4 font-serif font-light text-sm text-brand-charcoal dark:text-white">
                        {p.title}
                        <span className="block text-[10px] text-brand-gray font-mono">{p.slug}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-brand-gray">{p.project_type}</td>
                      <td className="py-4 px-4 text-brand-gray">{p.location}</td>
                      <td className="py-4 px-4 font-mono text-brand-gray">{p.year}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase border transition-colors ${
                            p.published !== false
                              ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {p.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          {p.published !== false ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right space-x-3">
                        <Link
                          href={`/admin/projects/${p.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-charcoal dark:text-white hover:underline"
                        >
                          <Edit2 size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.slug)}
                          className="text-red-500 hover:text-red-700 font-mono text-xs"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark p-8 max-w-md w-full space-y-6">
              <h3 className="font-serif text-xl font-light text-brand-charcoal dark:text-white">
                Confirm Project Deletion
              </h3>
              <p className="text-xs text-brand-gray leading-relaxed">
                Are you sure you want to delete project case study &ldquo;{deleteId}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-5 py-2.5 text-xs font-mono uppercase text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 text-xs font-mono uppercase bg-red-600 text-white hover:bg-red-700 font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
