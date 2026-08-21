import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SERVICES_DATA } from "@/data/services";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  
  if (!service) {
    return {
      title: "Service Not Found | Complete Glass Innovations",
    };
  }

  return {
    title: `${service.title} Specifications | Complete Glass Innovations`,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* Hero Section */}
        <section className="py-20 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#555555] hover:text-[#111111] mb-10 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Services Directory
              </Link>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Service Specifications]
              </span>
            </FadeIn>

            <Reveal delay={0.3} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl">
                {service.title}
              </h1>
            </Reveal>
          </div>
        </section>

        {/* Details & Specs Content */}
        <section className="py-24 bg-[#f7f7f5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column: Overview, Features, Process, Gallery */}
              <div className="lg:col-span-7">
                <FadeIn direction="up" delay={0.1}>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6">
                    [Overview]
                  </h2>
                  <p className="text-lg md:text-xl font-light text-[#111111] leading-relaxed mb-12 font-sans">
                    {service.content}
                  </p>
                </FadeIn>

                {/* Key Advantages */}
                <FadeIn direction="up" delay={0.2}>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                    [Key Features & Engineering]
                  </h3>
                  <ul className="space-y-4 mb-12">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center text-[#111111] mt-1 shadow-subtle">
                          <Check size={12} />
                        </div>
                        <span className="text-sm md:text-base text-[#555555] leading-relaxed font-sans font-light">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>

                {/* Process Steps */}
                {service.process && service.process.length > 0 && (
                  <FadeIn direction="up" delay={0.3}>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                      [Installation Process]
                    </h3>
                    <div className="space-y-6 mb-12">
                      {service.process.map((step) => (
                        <div key={step.step} className="p-6 border border-[#e5e5e5] bg-white">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs font-bold text-[#555555]">[{step.step}]</span>
                            <h4 className="font-serif text-lg font-light text-[#111111]">{step.title}</h4>
                          </div>
                          <p className="text-xs md:text-sm text-[#555555] leading-relaxed font-sans font-light">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Gallery Showcase */}
                <FadeIn direction="up" delay={0.4}>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                    [Project Gallery]
                  </h3>
                  <ProjectGallery images={service.gallery || []} title={service.title} />
                </FadeIn>

                {/* Compliance Box */}
                <FadeIn direction="up" delay={0.5}>
                  <div className="mt-12 p-8 border border-[#e5e5e5] bg-white">
                    <h4 className="font-serif text-lg font-light mb-3 text-[#111111]">
                      Compliance & Safety Certification
                    </h4>
                    <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                      {service.compliance}
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Sticky Specs Table */}
              <div className="lg:col-span-5">
                <FadeIn direction="up" delay={0.2} className="sticky top-28">
                  <div className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                    <h3 className="font-serif text-xl font-light mb-6 text-[#111111]">
                      Technical Specifications
                    </h3>
                    
                    <div className="space-y-6 mb-8 text-sm">
                      {Object.entries(service.specs).map(([key, val]) => (
                        <div key={key} className="border-b border-[#e5e5e5] pb-4">
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1 font-mono">
                            {key}
                          </span>
                          <span className="text-[#111111] font-sans font-medium">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <MagneticButton className="w-full">
                      <Link
                        href="/quote"
                        className="group flex items-center justify-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-6 hover:bg-[#333333] transition-colors duration-300 w-full"
                      >
                        Request Quote for {service.title}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </MagneticButton>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
