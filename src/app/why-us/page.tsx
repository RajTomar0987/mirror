import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export const metadata: Metadata = {
  title: "Why Choose Us | Complete Glass Innovations",
  description: "Discover why architects, property owners, and commercial builders choose Complete Glass Innovations for AS1288 certified architectural glazing and frameless glass installations.",
};

export default function WhyUsPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* HERO HEADER */}
        <section className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Value & Engineering]
              </span>
            </FadeIn>

            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl mb-8 leading-tight">
                THE ARCHITECTURAL <br />
                <span className="italic font-normal">STANDARD OF EXCELLENCE</span>
              </h1>
            </Reveal>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-xl text-[#555555] leading-relaxed max-w-2xl font-sans font-light">
                Why residential homeowners, tier-1 architects, and commercial project managers place their trust in Complete Glass Innovations.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* WHY US SECTION COMPONENT */}
        <WhyUsSection />

        {/* DETAILED TECHNICAL GUARANTEE SECTION */}
        <section className="py-24 md:py-32 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Glazing Compliance Guarantee]
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-[#111111] mb-6">
                    RIGOROUS STANDARDS & CERTIFICATION
                  </h2>
                  <p className="text-base text-[#555555] leading-relaxed mb-6 font-sans font-light">
                    Safety and longevity are non-negotiable in glass engineering. Every piece of glass we install complies fully with the National Construction Code (NCC) and Australian Standards AS1288 (Glass in Buildings) and AS2208 (Safety Glazing Materials).
                  </p>
                  <p className="text-base text-[#555555] leading-relaxed font-sans font-light">
                    Upon project completion, we provide formal glazing compliance certificates required by local councils and certifiers across Australia.
                  </p>
                </FadeIn>
              </div>

              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.2} className="p-8 md:p-12 border border-[#e5e5e5] bg-[#f7f7f5]">
                  <div className="space-y-6">
                    <div className="border-b border-[#e5e5e5] pb-4">
                      <span className="block font-mono text-xs text-[#555555] uppercase tracking-wider mb-1">Standard 01</span>
                      <h4 className="font-serif text-xl text-[#111111]">AS1288 Glass in Buildings</h4>
                      <p className="text-sm text-[#555555] mt-1 font-light">Selection & installation calculations based on wind loading and human impact criteria.</p>
                    </div>

                    <div className="border-b border-[#e5e5e5] pb-4">
                      <span className="block font-mono text-xs text-[#555555] uppercase tracking-wider mb-1">Standard 02</span>
                      <h4 className="font-serif text-xl text-[#111111]">AS2208 Safety Glazing</h4>
                      <p className="text-sm text-[#555555] mt-1 font-light">Mandatory Grade A toughened and laminated safety glass certification.</p>
                    </div>

                    <div>
                      <span className="block font-mono text-xs text-[#555555] uppercase tracking-wider mb-1">Hardware</span>
                      <h4 className="font-serif text-xl text-[#111111]">Duplex 2205 Stainless Hardware</h4>
                      <p className="text-sm text-[#555555] mt-1 font-light">Superior corrosion resistance for coastal environments and pool enclosures.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#f4f4f2] text-center border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#555555] block mb-4">
              [Get Started]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#111111] mb-6">
              WORK WITH AUSTRALIA&apos;S PREMIER GLAZING SPECIALISTS
            </h2>
            <p className="text-base text-[#555555] max-w-xl mx-auto mb-10 font-sans font-light">
              Receive a detailed architectural glazing quote tailored to your exact floor plan or project specifications.
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
