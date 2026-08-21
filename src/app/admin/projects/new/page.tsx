"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAuthHeaders } from "@/lib/auth-client";
import { useToast } from "@/components/admin/Toast";

export default function AdminNewProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle] = useState("");
  const [projectType, setProjectType] = useState<"Residential" | "Commercial" | "Other">("Residential");
  const [location, setLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [published, setPublished] = useState(true);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title,
          slug,
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
        showToast("Project created successfully!", "success");
        router.push("/admin/projects");
      } else {
        showToast(data?.error || "Failed to create project", "error");
      }
    } catch {
      showToast("Network error creating project", "error");
    } finally {
      setLoading(false);
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
            [New Portfolio Case Study]
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-brand-charcoal dark:text-white">
            CREATE PROJECT CASE STUDY
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-brand-bg-dark border border-brand-glass-border-light dark:border-brand-glass-border-dark p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectTitle" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Project Title *</label>
              <input
                id="projectTitle"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Modernist Harbour Balustrades"
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="projectSlug" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">URL Slug *</label>
              <input
                id="projectSlug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="modernist-harbour-balustrades"
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label htmlFor="projectType" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Classification *</label>
              <select
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as "Residential" | "Commercial" | "Other")}
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs uppercase font-mono text-brand-charcoal dark:text-white focus:outline-none"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="projectLocation" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Location *</label>
              <input
                id="projectLocation"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mosman, NSW"
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="projectYear" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Completion Year *</label>
              <input
                id="projectYear"
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="clientProfile" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Client Profile *</label>
            <input
              id="clientProfile"
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Private Waterfront Estate"
              className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="shortDesc" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Short Description *</label>
            <textarea
              id="shortDesc"
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary for portfolio cards"
              className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="fullNarrative" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Full Case Study Narrative *</label>
            <textarea
              id="fullNarrative"
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed description of engineering and installation"
              className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="engChallenge" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Engineering Challenge</label>
              <textarea
                id="engChallenge"
                rows={3}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="High coastal wind forces..."
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="glazingSolution" className="block text-xs uppercase tracking-widest text-brand-gray font-mono mb-2">Glazing Solution</label>
              <textarea
                id="glazingSolution"
                rows={3}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="15mm Grade A toughened glass panels..."
                className="w-full p-3 bg-brand-bg/10 dark:bg-brand-charcoal/30 border border-brand-glass-border-light dark:border-brand-glass-border-dark text-xs text-brand-charcoal dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-brand-charcoal"
            />
            <label htmlFor="published" className="text-xs uppercase tracking-widest font-mono text-brand-charcoal dark:text-white">
              Publish Project Immediately
            </label>
          </div>

          <div className="pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-brand-charcoal dark:bg-white text-white dark:text-brand-charcoal text-xs uppercase font-mono font-bold py-4 px-8 hover:bg-brand-gray transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Case Study
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
