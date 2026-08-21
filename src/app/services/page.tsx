import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SERVICES_DATA } from "@/data/services";
import { ServiceShowcase } from "@/components/ui/ServiceShowcase";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export const metadata: Metadata = {
  title: "Architectural Glass Services | Complete Glass Innovations",
  description: "Explore custom glass balustrades, frameless glass installations, shower screens, pool fencing, splashbacks, and custom glazing across Australia.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* Hero Section (Section 1: #FFFFFF) */}
        <section className="py-20 md:py-28 bg-white overflow-hidden border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Services Directory]
              </span>
            </FadeIn>

            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl mb-8">
                GLASS SOLUTIONS <br />
                <span className="italic font-normal text-[#111111]">DESIGNED AROUND YOUR SPACE</span>
              </h1>
            </Reveal>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-xl text-[#555555] leading-relaxed max-w-2xl font-sans font-light">
                Custom architectural glazing, safety engineered for contemporary residential and commercial environments across Australia. AS1288 Glazing Code Compliant.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Large Visual Services Directory (Section 2: #F7F7F5) */}
        <section className="py-24 md:py-32 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="space-y-12">
              {SERVICES_DATA.map((service, index) => (
                <ServiceShowcase key={service.slug} service={service} index={index + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline Section (Section 3: #FFFFFF) */}
        <section className="py-24 md:py-32 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <div className="mb-20 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                  [Methodology]
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111]">
                  OUR EXECUTION <br />
                  <span className="italic font-normal">PROCESS</span>
                </h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn direction="up" delay={0.2} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5]">
                <span className="font-mono text-xs font-bold text-[#555555] block mb-6">[01]</span>
                <h3 className="font-serif text-2xl font-light text-[#111111] mb-4">
                  Site Audit & Measurement
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  Precision laser scanning of building substrate layout, wall plumbness, and structural attachment points.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.3} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5]">
                <span className="font-mono text-xs font-bold text-[#555555] block mb-6">[02]</span>
                <h3 className="font-serif text-2xl font-light text-[#111111] mb-4">
                  Factory Tempering & Cut
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  CNC notch cutting, edge polishing, and thermal glass tempering certified under AS2208 safety standards.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.4} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5]">
                <span className="font-mono text-xs font-bold text-[#555555] block mb-6">[03]</span>
                <h3 className="font-serif text-2xl font-light text-[#111111] mb-4">
                  Fit & Certification
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  On-site structural fastening, hardware torque checks, and immediate issuance of AS1288 glazing compliance certificates.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Conversion Quote CTA (Section 4: #F4F4F2 panel with Black CTA) */}
        <section className="py-24 md:py-32 bg-[#f4f4f2] text-[#111111] text-center border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#555555] font-bold block mb-6">
              [Custom Engineering]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight mb-8 text-[#111111]">
              NEED A TAILORED ARCHITECTURAL GLAZING SPECIFICATION?
            </h2>
            <p className="text-[#555555] text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10 font-sans font-light">
              Submit your architectural drawings or spatial measurements for a complimentary technical assessment.
            </p>
            <MagneticButton>
              <Link
                href="/quote"
                className="inline-flex items-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 shadow-subtle"
              >
                Request Free Quote
                <ArrowRight size={14} />
              </Link>
            </MagneticButton>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
