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
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const metadata: Metadata = {
  title: "Why Choose Us | Complete Glass Innovations",
  description: "Discover why architects, property owners, and commercial builders choose Complete Glass Innovations for AS1288 certified architectural glazing and frameless glass installations.",
};

export default function WhyUsPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* SECTION 1: HERO HEADER WITH IMAGE 1 */}
        <section className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Heading & Text */}
              <div className="lg:col-span-7">
                <FadeIn direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Value & Engineering]
                  </span>
                </FadeIn>

                <Reveal delay={0.2} duration={0.9}>
                  <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] mb-8 leading-tight">
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

              {/* Right Column: IMAGE 1 (Hero Glass) */}
              <div className="lg:col-span-5">
                <FadeIn direction="up" delay={0.4}>
                  <div className="relative w-full aspect-[4/5] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-subtle group">
                    <OptimizedImage
                      src="/images/why-us/hero-glass.jpg"
                      alt="Luxury Australian contemporary residential architecture featuring frameless floor-to-ceiling glass"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="group-hover:scale-[1.02] transition-transform duration-700 ease-out object-cover"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US 4 FEATURE CARDS SECTION */}
        <WhyUsSection />

        {/* SECTION 2: FULL-WIDTH FEATURED PROJECT WITH IMAGE 2 */}
        <section className="py-20 md:py-28 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-white border border-[#e5e5e5] overflow-hidden shadow-subtle group">
                <OptimizedImage
                  src="/images/why-us/featured-project.jpg"
                  alt="Panoramic view of a luxury modern Australian coastal residence with frameless glass balcony"
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-8 md:p-14">
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/80 block mb-3 font-mono">
                    [FEATURED PROJECT]
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-white tracking-wide">
                    PRECISION IN EVERY DETAIL
                  </h3>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* SECTION 3: CRAFTSMANSHIP SECTION WITH IMAGE 3 */}
        <section className="py-24 md:py-32 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: IMAGE 3 (Craftsmanship Detail) */}
              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.1}>
                  <div className="relative w-full aspect-[4/5] bg-[#f7f7f5] border border-[#e5e5e5] overflow-hidden shadow-subtle group">
                    <OptimizedImage
                      src="/images/why-us/craftsmanship.jpg"
                      alt="Close-up macro detail of 2205 stainless steel spigots and polished frameless safety glass edge"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="group-hover:scale-[1.02] transition-transform duration-700 ease-out object-cover"
                    />
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Craftsmanship Typography */}
              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.2}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Engineering Precision]
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] mb-8 leading-tight">
                    THE DETAILS THAT <br />
                    <span className="italic font-normal">DEFINE THE DIFFERENCE.</span>
                  </h2>
                  <p className="text-base text-[#555555] leading-relaxed mb-6 font-sans font-light">
                    True architectural elegance lies in structural subtlety. Our frameless glass balustrades and custom glazing solutions rely on marine-grade Duplex 2205 stainless steel hardware and precision-machined channels engineered for lifetime stability.
                  </p>
                  <p className="text-base text-[#555555] leading-relaxed font-sans font-light mb-8">
                    Every edge is flat-polished with bevelled micro-facets, ensuring pristine optical clarity and tactile perfection across every installation.
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#e5e5e5]">
                    <div>
                      <span className="font-mono text-xs text-[#555555] uppercase tracking-wider block mb-1">Tolerances</span>
                      <span className="font-serif text-2xl font-light text-[#111111]">&lt; 1mm Precision</span>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#555555] uppercase tracking-wider block mb-1">Hardware Grade</span>
                      <span className="font-serif text-2xl font-light text-[#111111]">Duplex 2205 SS</span>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LOCAL / AUSTRALIAN COMPLIANCE SECTION WITH IMAGE 4 */}
        <section className="py-24 md:py-32 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Standards Text */}
              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.1}>
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                    [Glazing Compliance Guarantee]
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-light text-[#111111] mb-6">
                    RIGOROUS STANDARDS &amp; AUSTRALIAN CERTIFICATION
                  </h2>
                  <p className="text-base text-[#555555] leading-relaxed mb-6 font-sans font-light">
                    Safety and longevity are non-negotiable in glass engineering. Every piece of glass we install complies fully with the National Construction Code (NCC) and Australian Standards AS1288 (Glass in Buildings) and AS2208 (Safety Glazing Materials).
                  </p>
                  <p className="text-base text-[#555555] leading-relaxed font-sans font-light mb-8">
                    Upon project completion, we provide formal glazing compliance certificates required by local councils and certifiers across Australia.
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 border border-[#e5e5e5] bg-white">
                      <span className="block font-mono text-xs text-[#555555] uppercase tracking-wider mb-1">Standard 01</span>
                      <h4 className="font-serif text-lg text-[#111111]">AS1288 Glass in Buildings</h4>
                      <p className="text-xs text-[#555555] mt-1 font-light">Selection &amp; installation calculations based on wind loading and human impact criteria.</p>
                    </div>

                    <div className="p-5 border border-[#e5e5e5] bg-white">
                      <span className="block font-mono text-xs text-[#555555] uppercase tracking-wider mb-1">Standard 02</span>
                      <h4 className="font-serif text-lg text-[#111111]">AS2208 Safety Glazing</h4>
                      <p className="text-xs text-[#555555] mt-1 font-light">Mandatory Grade A toughened and laminated safety glass certification.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: IMAGE 4 (Australian Coastal Estate Project) */}
              <div className="lg:col-span-6">
                <FadeIn direction="up" delay={0.2}>
                  <div className="relative w-full aspect-[4/3] bg-white border border-[#e5e5e5] overflow-hidden shadow-subtle group">
                    <OptimizedImage
                      src="/images/why-us/australian-project.jpg"
                      alt="Contemporary Australian coastal estate with frameless glass pool fencing and glass balcony balustrade"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="group-hover:scale-[1.02] transition-transform duration-700 ease-out object-cover"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
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
