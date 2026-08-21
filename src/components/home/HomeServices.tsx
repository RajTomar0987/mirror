"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    slug: "glass-balustrades",
    title: "Glass Balustrades",
    description: "Sleek, transparent safety barriers that optimize views and maximize light transmission for modern balconies, stairs, and voids.",
    bgClass: "bg-gradient-to-tr from-brand-ice/20 to-white/10 dark:from-brand-ice-dark/10 dark:to-brand-charcoal",
  },
  {
    slug: "frameless-glass",
    title: "Frameless Glass Installations",
    description: "Premium frameless structural glass panels engineered for clean lines and a contemporary architectural aesthetic.",
    bgClass: "bg-gradient-to-tr from-brand-gray-extralight to-white/20 dark:from-brand-charcoal-light/10 dark:to-brand-charcoal",
  },
  {
    slug: "shower-screens",
    title: "Shower Screens",
    description: "Custom frameless and semi-frameless glass shower enclosures tailored to elevate luxury bathrooms with flawless structural integrity.",
    bgClass: "bg-gradient-to-tr from-brand-ice/15 to-white/15 dark:from-brand-ice-dark/5 dark:to-brand-charcoal",
  },
  {
    slug: "pool-fencing",
    title: "Glass Pool Fencing",
    description: "Architectural pool fencing compliance without sacrificing visual connection. Premium spigots and structural glass panels.",
    bgClass: "bg-gradient-to-tr from-brand-gray-extralight to-white/10 dark:from-brand-charcoal-light/20 dark:to-brand-charcoal",
  },
  {
    slug: "glass-splashbacks",
    title: "Glass Splashbacks",
    description: "Polished and painted safety glass splashbacks, bringing seamless elegance and easy maintenance to modern kitchens.",
    bgClass: "bg-gradient-to-tr from-brand-ice/10 to-white/20 dark:from-brand-ice-dark/15 dark:to-brand-charcoal",
  },
  {
    slug: "mirrors",
    title: "Custom Mirrors",
    description: "Bespoke silvered glass and polished-edge mirrors designed to open up spaces and reflect light in contemporary interiors.",
    bgClass: "bg-gradient-to-tr from-brand-gray-extralight to-white/30 dark:from-brand-charcoal-light/5 dark:to-brand-charcoal",
  },
];

export const HomeServices = () => {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-brand-bg-dark border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-4">
              [Core Capabilities]
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-charcoal dark:text-white">
              ARCHITECTURAL GLASS <br />
              <span className="italic font-normal">INSTALLATIONS</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm md:text-base text-brand-gray dark:text-brand-gray-light leading-relaxed">
              We specialize in custom architectural glass fittings for residential and commercial architectural structures. Every project complies with AS1288 Australian Standards.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col justify-between p-8 min-h-[320px] border border-brand-glass-border-light dark:border-brand-glass-border-dark hover:border-brand-charcoal dark:hover:border-white transition-all duration-500 relative overflow-hidden bg-brand-bg/20 dark:bg-brand-charcoal/20"
            >
              {/* Card visual background texture */}
              <div className={`absolute inset-0 -z-10 opacity-70 group-hover:scale-105 transition-transform duration-700 ${service.bgClass}`}></div>
              
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-brand-gray/60 dark:text-brand-gray">
                  0{index + 1}
                </span>
                <div className="w-8 h-8 rounded-full border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-center group-hover:bg-brand-charcoal dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-brand-charcoal transition-all duration-300">
                  <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-light tracking-tight mb-4 text-brand-charcoal dark:text-white group-hover:translate-x-1 transition-transform">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-charcoal dark:text-white border-b border-brand-charcoal/20 dark:border-white/20 pb-2 hover:border-brand-charcoal dark:hover:border-white transition-colors"
          >
            Explore All Services
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
