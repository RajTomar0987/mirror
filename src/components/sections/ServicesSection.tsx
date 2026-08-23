"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES_DATA } from "@/data/services";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-white border-t border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <FadeIn direction="up" delay={0.1}>
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Architectural Capabilities]
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111]">
                SPECIALIZED ARCHITECTURAL <br />
                <span className="italic font-normal">GLASS SERVICES</span>
              </h2>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <Link
              href="/services"
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#111111] hover:text-[#555555] transition-colors border-b border-[#111111] pb-1 w-fit focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              Explore All 8 Categories
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </FadeIn>
        </div>

        {/* Services Grid */}
        <StaggerContainer staggerChildren={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, index) => (
            <StaggerItem key={service.slug} className="h-full">
              <ServiceCard
                slug={service.slug}
                title={service.title}
                description={service.description}
                index={index + 1}
                image={service.image || service.imageUrl}
                imageAlt={service.imageAlt}
                complianceCode="AS1288"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
