"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FadeIn } from "@/components/animations/FadeIn";

export const ProjectsSection: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#f7f7f5] text-[#111111] border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <FadeIn direction="up" delay={0.1}>
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Selected Portfolio]
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111]">
                FEATURED ARCHITECTURAL <br />
                <span className="italic font-normal">INSTALLATIONS</span>
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#111111] hover:text-[#555555] transition-colors border-b border-[#111111] pb-1 w-fit focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              View Full Portfolio
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </FadeIn>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Large Featured Project */}
          {PROJECTS_DATA[0] && (
            <div className="lg:col-span-7">
              <FadeIn direction="up" delay={0.2} duration={0.8}>
                <ProjectCard
                  slug={PROJECTS_DATA[0].slug}
                  title={PROJECTS_DATA[0].title}
                  category={PROJECTS_DATA[0].project_type}
                  location={PROJECTS_DATA[0].location}
                  year={PROJECTS_DATA[0].year}
                  description={PROJECTS_DATA[0].description}
                  imageUrl={PROJECTS_DATA[0].heroImage}
                  aspectRatio="aspect-[16/11]"
                />
              </FadeIn>
            </div>
          )}

          {/* Secondary Column Stack */}
          <div className="lg:col-span-5 flex flex-col space-y-10">
            {PROJECTS_DATA.slice(1, 3).map((project, idx) => (
              <FadeIn key={project.slug} direction="up" delay={0.3 + idx * 0.15} duration={0.8}>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  category={project.project_type}
                  location={project.location}
                  year={project.year}
                  imageUrl={project.heroImage}
                  aspectRatio="aspect-[16/10]"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
