"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PROJECTS_DATA } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { MagneticButton } from "@/components/animations/MagneticButton";

const PROJECT_TYPES = ["All", "Residential", "Commercial"];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.project_type === activeFilter);

  return (
    <PageTransition>
      <Navbar />
      
      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* Header */}
        <section className="py-20 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Portfolio]
              </span>
            </FadeIn>
            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl mb-8">
                ARCHITECTURAL GLASS <br />
                <span className="italic font-normal">PROJECT GALLERY</span>
              </h1>
            </Reveal>
            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-lg text-[#555555] leading-relaxed max-w-xl font-sans font-light">
                A curated selection of custom architectural glass and structural glazing installations across residential and commercial spaces.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Portfolio Showcase Section */}
        <section className="py-24 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            {/* Category Filter Tabs */}
            <FadeIn direction="up" delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-16 border-b border-[#e5e5e5] pb-6" role="tablist" aria-label="Project Categories">
                {PROJECT_TYPES.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    role="tab"
                    aria-selected={activeFilter === filter}
                    className={`text-xs uppercase tracking-[0.2em] font-bold py-3 px-6 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#111111] ${
                      activeFilter === filter
                        ? "bg-[#111111] text-white"
                        : "text-[#555555] bg-white border border-[#e5e5e5] hover:text-[#111111]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Asymmetric Portfolio Grid */}
            <StaggerContainer staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {filteredProjects.map((project) => (
                <StaggerItem key={project.slug} className="w-full">
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    category={project.project_type}
                    location={project.location}
                    year={project.year}
                    description={project.description}
                    imageUrl={project.heroImage}
                    aspectRatio="aspect-[16/10]"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

          </div>
        </section>

        {/* Quote CTA Banner */}
        <section className="py-28 bg-[#f4f4f2] text-[#111111] text-center border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#555555] block mb-6 font-bold">
              [Custom Fabrication]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight mb-8 text-[#111111]">
              HAVE AN UPCOMING ARCHITECTURAL PROJECT?
            </h2>
            <p className="text-[#555555] text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10 font-sans font-light">
              Collaborate with our structural glazing engineers from initial laser measurement to final certified installation.
            </p>
            <MagneticButton>
              <Link
                href="/quote"
                className="inline-flex items-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 shadow-subtle"
              >
                Request Project Quote
                <ArrowUpRight size={14} />
              </Link>
            </MagneticButton>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
