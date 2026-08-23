import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageTransition } from "@/components/animations/PageTransition";
import { FadeIn } from "@/components/animations/FadeIn";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = {
  title: "Contact Us | Complete Glass Innovations",
  description: "Get in touch with Complete Glass Innovations. Phone 1300 000 000 or email info@completeglass.com.au for architectural glass consultation, spatial measurements, and quotes.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        {/* HERO SECTION */}
        <section className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
                [Contact & Consultation]
              </span>
            </FadeIn>

            <Reveal delay={0.2} duration={0.9}>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] max-w-4xl mb-8 leading-tight">
                GET IN TOUCH WITH OUR <br />
                <span className="italic font-normal">GLAZING EXPERTS</span>
              </h1>
            </Reveal>

            <FadeIn direction="up" delay={0.3}>
              <p className="text-base md:text-xl text-[#555555] leading-relaxed max-w-2xl font-sans font-light">
                Have a question about a custom project or require site measurement? Contact our team or fill out the enquiry form below.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* CONTACT CARDS & FORM */}
        <section className="py-24 bg-[#f7f7f5] border-b border-[#e5e5e5]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
              
              {/* Contact Info Cards */}
              <div className="lg:col-span-4 space-y-6">
                <FadeIn direction="up" delay={0.1} className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                  <div className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-6">
                    <Phone size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#555555] font-mono block mb-1">Phone Line</span>
                  <h3 className="font-serif text-2xl text-[#111111]">1300 000 000</h3>
                  <p className="text-xs text-[#555555] mt-2 font-light">Mon-Fri 7:00 AM - 5:00 PM AEST</p>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                  <div className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-6">
                    <Mail size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#555555] font-mono block mb-1">Direct Email</span>
                  <h3 className="font-serif text-xl text-[#111111] break-all">info@completeglass.com.au</h3>
                  <p className="text-xs text-[#555555] mt-2 font-light">Enquiries answered within 24 hours</p>
                </FadeIn>

                <FadeIn direction="up" delay={0.3} className="p-8 border border-[#e5e5e5] bg-white shadow-subtle">
                  <div className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#111111] mb-6">
                    <MapPin size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#555555] font-mono block mb-1">Service Area</span>
                  <h3 className="font-serif text-xl text-[#111111]">Sydney, NSW, Australia</h3>
                  <p className="text-xs text-[#555555] mt-2 font-light">Greater Sydney & Surrounding Regions</p>
                </FadeIn>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-8">
                <FadeIn direction="up" delay={0.2}>
                  <div className="bg-white p-8 md:p-12 border border-[#e5e5e5] shadow-subtle">
                    <h2 className="font-serif text-3xl font-light text-[#111111] mb-2">Send an Enquiry</h2>
                    <p className="text-sm text-[#555555] font-light mb-8">
                      Fill in your project details and specifications for a technical estimate.
                    </p>
                    <ContactForm />
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
