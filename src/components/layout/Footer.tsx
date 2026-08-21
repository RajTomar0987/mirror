"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-white pt-24 pb-12 border-t border-brand-charcoal-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-charcoal-light">
          {/* Brand Info Placeholder */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="group inline-flex flex-col mb-6">
                <span className="font-serif text-xl font-bold tracking-widest text-white uppercase">
                  COMPLETE GLASS
                </span>
                <span className="text-[10px] tracking-[0.3em] text-brand-gray uppercase -mt-1 font-sans">
                  INNOVATIONS
                </span>
              </Link>
              <p className="text-sm text-brand-gray leading-relaxed font-sans font-light max-w-sm mb-6">
                Custom architectural glass solutions engineered for luxury residential and commercial environments across Australia. AS1288 Glazing Code Compliant.
              </p>
            </div>
            <div className="text-xs text-brand-gray font-mono">
              [Sydney / Regional NSW]
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-6">
              Navigation
            </span>
            <ul className="space-y-3 text-xs uppercase tracking-widest text-brand-gray-light">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services Overview
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-white transition-colors">
                  Why Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Index Placeholder */}
          <div className="md:col-span-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-6">
              Solutions
            </span>
            <ul className="space-y-3 text-xs uppercase tracking-widest text-brand-gray-light">
              <li>
                <Link href="/services/glass-balustrades" className="hover:text-white transition-colors">
                  Glass Balustrades
                </Link>
              </li>
              <li>
                <Link href="/services/frameless-glass" className="hover:text-white transition-colors">
                  Frameless Glass
                </Link>
              </li>
              <li>
                <Link href="/services/shower-screens" className="hover:text-white transition-colors">
                  Shower Screens
                </Link>
              </li>
              <li>
                <Link href="/services/pool-fencing" className="hover:text-white transition-colors">
                  Pool Fencing
                </Link>
              </li>
              <li>
                <Link href="/services/custom-glass" className="hover:text-white transition-colors">
                  Custom Glazing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Placeholders */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-6">
                Inquiries
              </span>
              <p className="text-xs text-brand-gray leading-relaxed mb-4">
                Request custom project quotes or technical specifications via our portal.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-white border-b border-white pb-0.5 hover:text-brand-ice transition-colors"
              >
                Get a Quote
                <ArrowUpRight size={12} />
              </Link>
            </div>
            
            <div className="mt-8">
              <span className="text-[10px] uppercase tracking-widest text-brand-gray block mb-2">
                Social (Placeholder)
              </span>
              <div className="flex gap-4 text-xs text-brand-gray-light">
                <span className="hover:text-white cursor-pointer">Instagram</span>
                <span className="hover:text-white cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-gray">
          <p>© {new Date().getFullYear()} Complete Glass Innovations. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
