import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUSINESS_CONFIG } from "@/config/business";
import { PageTransition } from "@/components/animations/PageTransition";

export const metadata: Metadata = {
  title: `Terms of Service | ${BUSINESS_CONFIG.name}`,
  description: `Terms of service, engineering guidelines, and quotation policies for ${BUSINESS_CONFIG.name}.`,
};

export default function TermsPage() {
  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 bg-white text-[#111111]">
        <section className="py-16 md:py-24 border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono font-bold text-[#555555] hover:text-[#111111] mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#555555] block mb-3 font-bold">
              [Terms & Standards]
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight mb-8 text-[#111111]">
              TERMS OF SERVICE
            </h1>
            <p className="text-xs font-mono text-[#555555]">
              Last Updated: January 2025 | Standard Commercial Terms & Conditions
            </p>
          </div>
        </section>

        <section className="py-20 bg-[#f7f7f5]">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12 text-sm leading-relaxed font-sans font-light text-[#555555]">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                1. Quotations & Technical Estimates
              </h2>
              <p>
                All initial quote estimates provided via our website or email portal are based on preliminary customer measurements and drawings. Final binding quotes require an on-site technical laser measure by an accredited {BUSINESS_CONFIG.name} technician.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                2. AS1288 Australian Standards Compliance
              </h2>
              <p>
                All custom glass products, balustrades, pool fencing, and shower enclosures are manufactured and installed strictly in accordance with AS1288 (Glass in Buildings — Selection and Installation) and AS2208 (Safety Glazing Materials in Buildings). Formal Form 15/Compliance Certificates are issued upon project completion.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                3. Custom Manufacturing & Lead Times
              </h2>
              <p>
                Because toughened safety glass and custom architectural panels are precision-cut and thermally processed for specific building openings, orders cannot be altered once factory tempering has commenced. Standard manufacturing lead times vary by specification.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                4. Warranty & Workmanship
              </h2>
              <p>
                {BUSINESS_CONFIG.name} provides a comprehensive 7-year structural installation warranty on hardware attachments and a 10-year manufacturer warranty on glass clarity against defects, subject to standard care and maintenance guidelines.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                5. Inquiries & Legal Notices
              </h2>
              <div className="mt-4 p-6 border border-[#e5e5e5] bg-white font-mono text-xs text-[#111111] shadow-subtle">
                <strong>{BUSINESS_CONFIG.name}</strong><br />
                ABN: {BUSINESS_CONFIG.abn}<br />
                Email: {BUSINESS_CONFIG.email}<br />
                Phone: {BUSINESS_CONFIG.phone}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
