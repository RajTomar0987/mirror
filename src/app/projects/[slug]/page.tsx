import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { PROJECTS_DATA } from "@/data/projects";
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

  if (!project) {
    return {
      title: "Project Not Found | Complete Glass Innovations",
    };
  }

  return {
    title: `${project.title} Case Study | Complete Glass Innovations`,
    description: project.description,
  };
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <PageTransition>
      <Navbar />
      
      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* Header */}
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

        {/* Case Study Details & Interactive Media */}
        <section className="py-24 bg-[#f7f7f5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column: Interactive Slider, Narrative & Gallery */}
              <div className="lg:col-span-8">
                
                {/* Before/After Transformation Slider */}
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
                    <span className="block text-[10px] text-[#555555] mt-3 font-mono text-center">
                      [Drag slider handle or use Left/Right arrow keys to compare site views]
                    </span>
                  </div>
                </FadeIn>

                {/* Case Study Overview & Narrative */}
                <FadeIn direction="up" delay={0.2}>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                    [Project Overview]
                  </h3>
                  <p className="text-base md:text-lg text-[#555555] leading-relaxed mb-10 font-sans font-light">
                    {project.content}
                  </p>
                </FadeIn>

                {/* Challenge & Solution */}
                {(project.challenge || project.solution) && (
                  <FadeIn direction="up" delay={0.3}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 p-8 border border-[#e5e5e5] bg-white">
                      {project.challenge && (
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#555555] block mb-2 font-bold">
                            [Engineering Challenge]
                          </span>
                          <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                            {project.challenge}
                          </p>
                        </div>
                      )}
                      {project.solution && (
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#555555] block mb-2 font-bold">
                            [Glazing Solution]
                          </span>
                          <p className="text-sm text-[#555555] leading-relaxed font-sans font-light">
                            {project.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                )}

                {/* Interactive Project Gallery Lightbox */}
                <FadeIn direction="up" delay={0.4}>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-6 pt-8 border-t border-[#e5e5e5]">
                    [Project Photo Gallery]
                  </h3>
                  <ProjectGallery images={project.gallery || project.images || []} title={project.title} />
                </FadeIn>

              </div>

              {/* Right Column: Case Study Metadata Sidebar */}
              <div className="lg:col-span-4">
                <FadeIn direction="up" delay={0.2} className="sticky top-28">
                  <div className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                    <h3 className="font-serif text-xl font-light mb-6 text-[#111111]">
                      Project Metadata
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

                      {project.specs && Object.keys(project.specs).length > 0 && (
                        <div className="border-t border-[#e5e5e5] pt-4 space-y-4">
                          <span className="block text-[10px] uppercase tracking-wider text-[#555555] font-mono">
                            Technical Specs
                          </span>
                          {Object.entries(project.specs).map(([k, v]) => (
                            <div key={k} className="text-xs">
                              <span className="block text-[10px] text-[#555555]">{k}:</span>
                              <span className="text-[#111111] font-medium">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-[#e5e5e5] pt-4">
                        <span className="block text-[10px] uppercase tracking-wider text-[#555555] mb-2 font-mono">
                          Deployed Services
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {project.services_used.map((serviceSlug) => (
                            <Link
                              key={serviceSlug}
                              href={`/services/${serviceSlug}`}
                              className="text-[9px] uppercase tracking-wider font-bold text-[#111111] border border-[#e5e5e5] px-2.5 py-1 bg-[#f7f7f5] hover:bg-[#111111] hover:text-white transition-all duration-300"
                            >
                              {serviceSlug.replace("-", " ")}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#f7f7f5] border border-[#e5e5e5] mb-6 text-[10px] text-[#555555] font-mono">
                      <ShieldCheck size={14} className="text-[#111111]" />
                      <span>AS1288 Certified Glazing</span>
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
