import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { GlassMaterialExperience } from "@/components/sections/GlassMaterialExperience";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { QuoteCtaSection } from "@/components/sections/QuoteCtaSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <PageTransition>
      <LocalBusinessJsonLd />
      <Navbar />

      <main className="flex-grow">
        {/* Full-Screen Cinematic Hero */}
        <HeroSection />

        {/* Editorial Introduction Statement */}
        <IntroSection />

        {/* 8 Architectural Service Panels */}
        <ServicesSection />

        {/* Asymmetric Project Gallery */}
        <ProjectsSection />

        {/* 3D WebGL Glass Material Experience Teaser */}
        <GlassMaterialExperience />

        {/* Core Values / Why Us Grid */}
        <WhyUsSection />

        {/* Client Reviews Testimonials */}
        <ReviewsSection />

        {/* Final Conversion Quote CTA */}
        <QuoteCtaSection />
      </main>

      <Footer />
    </PageTransition>
  );
}
