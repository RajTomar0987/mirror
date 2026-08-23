import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const metadata: Metadata = {
  title: "About Us | Complete Glass Innovations",
  description: "Learn about Complete Glass Innovations - leaders in architectural glass engineering, custom frameless glazing, balustrades, pool fencing, and AS1288 code compliance across Australia.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* HERO SECTION */}
        <section className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [About Our Studio]
              </span>
            </FadeIn>

            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-5xl mb-8 leading-tight">
                REDEFINING ARCHITECTURAL SPACE <br />
                <span className="italic font-normal">THROUGH STRUCTURAL GLASS</span>
              </h1>
            </Reveal>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-xl text-[#555555] leading-relaxed max-w-3xl font-sans font-light">
                Complete Glass Innovations is an Australian leader in bespoke architectural glazing. We bridge visionary design with rigorous structural engineering to deliver seamless frameless glass installations.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* EDITORIAL STORY & FEATURED IMAGE */}
        <section className="py-24 md:py-32 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-7">
                <FadeIn direction="up" delay={0.1}>
                  <div className="relative w-full aspect-[16/10] bg-white border border-[#e5e5e5] overflow-hidden shadow-subtle group">
                    <OptimizedImage
                      src="/images/about/staircase-balustrade.jpg"
                      alt="High-end Australian architectural interior featuring floating cantilevered wooden staircase with frameless glass balustrades"
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                  </div>
                </FadeIn>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between">
                <FadeIn direction="up" delay={0.2}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Our Legacy & Ethos]
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-[#111111] mb-6 leading-snug">
                    ENGINEERED FOR PERFECTION, BUILT FOR LONGEVITY
                  </h2>
                  <div className="space-y-6 text-sm md:text-base text-[#555555] leading-relaxed font-sans font-light">
                    <p>
                      At Complete Glass Innovations, we believe glass is more than a building material—it is a conduit for light, perspective, and spatial freedom.
                    </p>
                    <p>
                      Our dedicated teams manage every stage of the glazing process, from initial 3D laser measurement and load calculation to custom tempering and precision installation.
                    </p>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.3}>
                  <div className="grid grid-cols-2 gap-6 pt-8 mt-8 border-t border-[#e5e5e5]">
                    <div>
                      <span className="font-serif text-3xl font-light text-[#111111] block mb-1">100%</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#555555] font-mono font-bold">AS1288 Compliant</span>
                    </div>
                    <div>
                      <span className="font-serif text-3xl font-light text-[#111111] block mb-1">Grade A</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#555555] font-mono font-bold">Safety Toughened Glass</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section className="py-24 md:py-32 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <div className="mb-16 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                  [Pillars of Excellence]
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#111111]">
                  WHY ARCHITECTS & BUILDERS <br />
                  <span className="italic font-normal">TRUST OUR WORK</span>
                </h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn direction="up" delay={0.2} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5] shadow-subtle">
                <Compass size={24} className="text-[#111111] mb-6" />
                <h3 className="font-serif text-xl font-light text-[#111111] mb-3">Custom Precision</h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  Every panel is custom manufactured, edge-polished, and fitted to exact site specifications with minimal tolerances.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.3} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5] shadow-subtle">
                <ShieldCheck size={24} className="text-[#111111] mb-6" />
                <h3 className="font-serif text-xl font-light text-[#111111] mb-3">Full Code Compliance</h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  All installations strictly conform to Australian Standards AS1288 and AS2208, complete with structural compliance certificates.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.4} className="p-8 border border-[#e5e5e5] bg-[#f7f7f5] shadow-subtle">
                <Award size={24} className="text-[#111111] mb-6" />
                <h3 className="font-serif text-xl font-light text-[#111111] mb-3">Premium Hardware</h3>
                <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                  We utilize duplex 2205 stainless steel spigots, heavy-duty channels, and architectural silicone for lifetime performance.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-[#f4f4f2] text-center border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#555555] block mb-4">
              [Start Your Project]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#111111] mb-6">
              READY TO DISCUSS YOUR GLAZING REQUIREMENTS?
            </h2>
            <p className="text-base text-[#555555] max-w-xl mx-auto mb-10 font-sans font-light">
              Contact our technical team today for consultation, site measurement, or an estimate.
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
