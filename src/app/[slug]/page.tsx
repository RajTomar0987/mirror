import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { PROJECTS_DATA } from "@/data/projects";
import { SERVICES_DATA } from "@/data/services";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (project) {
    return {
      title: `${project.title} | Complete Glass Innovations`,
      description: project.description,
    };
  }

  const service = SERVICES_DATA.find((s) => s.slug === slug);
  if (service) {
    return {
      title: `${service.title} Specifications | Complete Glass Innovations`,
      description: service.description,
    };
  }

  return {
    title: "Not Found | Complete Glass Innovations",
  };
}

export async function generateStaticParams() {
  const projectParams = PROJECTS_DATA.map((project) => ({ slug: project.slug }));
  const serviceParams = SERVICES_DATA.map((service) => ({ slug: service.slug }));
  return [...projectParams, ...serviceParams];
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!project && !service) {
    notFound();
  }

  if (project) {
    return (
      <PageTransition>
        <Navbar />
        
        <main className="flex-grow pt-36 bg-white text-[#111111]">
          <section className="py-20 bg-white border-b border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <FadeIn direction="up" delay={0.1}>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#555555] hover:text-[#111111] mb-10 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Projects Gallery
                </Link>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.2}>
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                  [Architectural Case Study]
                </span>
              </FadeIn>

              <Reveal delay={0.3} duration={0.9}>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] max-w-4xl mb-6">
                  {project.title}
                </h1>
              </Reveal>

              {project.subtitle && (
                <FadeIn direction="up" delay={0.4}>
                  <p className="text-base md:text-xl text-[#555555] leading-relaxed max-w-2xl font-sans font-light">
                    {project.subtitle}
                  </p>
                </FadeIn>
              )}
            </div>
          </section>

          <section className="py-24 bg-[#f7f7f5]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                <div className="lg:col-span-8">
                  <FadeIn direction="up" delay={0.1}>
                    <div className="mb-16">
                      <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6">
                        [Before / After Site Comparison]
                      </h2>
                      <BeforeAfterSlider
                        beforeImage={project.beforeImage}
                        afterImage={project.afterImage}
                        beforeLabel="Pre-Installation Site"
                        afterLabel="Finished Glazing Installation"
                      />
                    </div>
                  </FadeIn>

                  <FadeIn direction="up" delay={0.2}>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                      [Project Overview]
                    </h3>
                    <p className="text-base md:text-lg text-[#555555] leading-relaxed mb-10 font-sans font-light">
                      {project.content}
                    </p>
                  </FadeIn>

                  <FadeIn direction="up" delay={0.3}>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                      [Project Photo Gallery]
                    </h3>
                    <ProjectGallery images={project.gallery || project.images || []} title={project.title} />
                  </FadeIn>
                </div>

                <div className="lg:col-span-4">
                  <FadeIn direction="up" delay={0.2} className="sticky top-28">
                    <div className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                      <h3 className="font-serif text-xl font-light mb-6 text-[#111111]">
                        Project Details
                      </h3>
                      
                      <div className="space-y-6 mb-8 text-sm">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1 font-mono">
                            Client Profile
                          </span>
                          <span className="text-[#111111] font-sans font-medium">
                            {project.client_name}
                          </span>
                        </div>
                        
                        <div className="border-t border-[#e5e5e5] pt-4">
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1 font-mono">
                            Glazing Location
                          </span>
                          <span className="text-[#111111] font-sans font-medium">
                            {project.location}
                          </span>
                        </div>

                        <div className="border-t border-[#e5e5e5] pt-4">
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1 font-mono">
                            Completion Year
                          </span>
                          <span className="text-[#111111] font-mono font-medium">
                            {project.year}
                          </span>
                        </div>

                        <div className="border-t border-[#e5e5e5] pt-4">
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1 font-mono">
                            Classification
                          </span>
                          <span className="text-[#111111] font-sans font-medium">
                            {project.project_type}
                          </span>
                        </div>
                      </div>

                      <MagneticButton className="w-full">
                        <Link
                          href="/quote"
                          className="group flex items-center justify-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-6 hover:bg-[#333333] transition-colors duration-300 w-full"
                        >
                          Request Similar Quote
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

  // Render Service detail if matched
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
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

            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl">
                {service!.title}
              </h1>
            </Reveal>
          </div>
        </section>

        <section className="py-24 bg-[#f7f7f5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7">
                <FadeIn direction="up" delay={0.1}>
                  <p className="text-lg md:text-xl font-light text-[#111111] leading-relaxed mb-12 font-sans">
                    {service!.content}
                  </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                    [Key Features & Engineering]
                  </h3>
                  <ul className="space-y-4 mb-12">
                    {service!.features.map((feature, idx) => (
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

                <FadeIn direction="up" delay={0.3}>
                  <ProjectGallery images={service!.gallery || []} title={service!.title} />
                </FadeIn>
              </div>

              <div className="lg:col-span-5">
                <FadeIn direction="up" delay={0.2} className="sticky top-28">
                  <div className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                    <h3 className="font-serif text-xl font-light mb-6 text-[#111111]">
                      Technical Specifications
                    </h3>
                    
                    <div className="space-y-6 mb-8 text-sm">
                      {Object.entries(service!.specs).map(([key, val]) => (
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
                        Request Quote
                        <ArrowRight size={14} />
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
