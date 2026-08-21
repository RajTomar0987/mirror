"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";
import { Project } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [projectType, setProjectType] = useState<string>("Residential");
  const [location, setLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/projects", { headers: getAuthHeaders() });
        const data = (await res.json()) as { success?: boolean; data?: Project[] };
        if (data && data.success && Array.isArray(data.data)) {
          const found = data.data.find((p: Project) => p.slug === id);
          if (found) {
            setTitle(found.title);
            setSubtitle(found.subtitle || "");
            setProjectType(found.project_type || "Residential");
            setLocation(found.location || "");
            setClientName(found.client_name || "");
            setYear(found.year || "");
            setDescription(found.description || "");
            setContent(found.content || "");
            setChallenge(found.challenge || "");
            setSolution(found.solution || "");
            setPublished(found.published !== false);
          }
        }
      } catch (err) {
        console.error("Fetch project error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title,
          subtitle,
          project_type: projectType,
          location,
          client_name: clientName,
          year,
          description,
          content,
          challenge,
          solution,
          published,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data && data.success) {
        showToast("Project updated successfully!", "success");
        router.push("/admin/projects");
      } else {
        showToast(data?.error || "Failed to update project", "error");
      }
    } catch {
      showToast("Network error updating project", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs uppercase font-mono font-bold text-brand-gray hover:text-brand-charcoal dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Projects List
        </Link>

        <div className="pb-6 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-brand-gray block mb-1">
            [Edit Portfolio Case Study — Slug: {id}]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            {title || "EDIT PROJECT"}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs font-mono text-brand-gray">Loading project details...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="editTitle" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Project Title *</label>
                <input
                  id="editTitle"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="editSubtitle" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Subtitle</label>
                <input
                  id="editSubtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="editClassification" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Classification</label>
                <select
                  id="editClassification"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs uppercase font-mono text-brand-charcoal dark:text-white focus:outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="editLocation" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Location</label>
                <input
                  id="editLocation"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="editYear" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Year</label>
                <input
                  id="editYear"
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="editClientProfile" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Client Profile</label>
              <input
                id="editClientProfile"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="editShortDesc" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Short Description</label>
              <textarea
                id="editShortDesc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="editFullNarrative" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Full Narrative</label>
              <textarea
                id="editFullNarrative"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
              <input
                type="checkbox"
                id="editPublished"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-brand-charcoal"
              />
              <label htmlFor="editPublished" className="text-xs uppercase tracking-widest font-mono text-brand-charcoal dark:text-white">
                Published on Public Website
              </label>
            </div>

            <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs uppercase font-mono font-bold py-4 px-8 hover:bg-brand-gray transition-colors"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Update Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
