"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home, Grid } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {!submitted ? (
          <>
            {/* Header Section */}
            <section className="py-16 md:py-24 bg-white border-b border-[#e5e5e5]">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <FadeIn direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Estimate Portal]
                  </span>
                </FadeIn>
                <Reveal delay={0.2} duration={0.9}>
                  <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl mb-6">
                    GET A FREE QUOTE
                  </h1>
                </Reveal>
                <FadeIn direction="up" delay={0.3}>
                  <p className="text-base md:text-lg text-[#555555] leading-relaxed max-w-xl font-sans font-light">
                    Tell us about your project and our team will get back to you with a detailed architectural glazing estimate.
                  </p>
                </FadeIn>
              </div>
            </section>

            {/* Form Section */}
            <section className="py-20 md:py-28 bg-[#f7f7f5]">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <QuoteForm onSuccess={() => setSubmitted(true)} />
              </div>
            </section>
          </>
        ) : (
          /* SUCCESS CONFIRMATION VIEW */
          <section className="py-28 md:py-36 bg-[#f7f7f5]">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <FadeIn direction="up" delay={0.1}>
                <div className="w-20 h-20 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center text-[#111111] mx-auto mb-8 shadow-subtle">
                  <CheckCircle2 size={40} />
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4 font-mono">
                  [Submission Confirmed]
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] mb-6">
                  QUOTE REQUEST RECEIVED
                </h1>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <p className="text-base md:text-xl text-[#555555] leading-relaxed font-sans font-light mb-12 max-w-xl mx-auto">
                  Thank you for getting in touch. Your project enquiry has been submitted successfully. Our structural glazing team will review your specifications and reach out.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <MagneticButton>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-colors duration-300 shadow-subtle"
                    >
                      <Home size={14} />
                      Back to Home
                    </Link>
                  </MagneticButton>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#f7f7f5] transition-colors duration-300 shadow-subtle"
                  >
                    <Grid size={14} />
                    View Our Services
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </PageTransition>
  );
}
