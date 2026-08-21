import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUSINESS_CONFIG } from "@/config/business";
import { PageTransition } from "@/components/animations/PageTransition";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BUSINESS_CONFIG.name}`,
  description: `Privacy policy and customer data handling principles for ${BUSINESS_CONFIG.name}.`,
};

export default function PrivacyPolicyPage() {
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
              [Legal Compliance]
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight mb-8 text-[#111111]">
              PRIVACY POLICY
            </h1>
            <p className="text-xs font-mono text-[#555555]">
              Last Updated: January 2025 | Governed under the Australian Privacy Act 1988 (Cth)
            </p>
          </div>
        </section>

        <section className="py-20 bg-[#f7f7f5]">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12 text-sm leading-relaxed font-sans font-light text-[#555555]">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                {BUSINESS_CONFIG.name} collects personal information provided directly by customers when requesting architectural glass quotes, submitting project plans, or contacting our studio.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact Information: Full name, email address, phone number, and suburb/project location.</li>
                <li>Project Files: Architectural drawings, site measurements, and photographs uploaded to our quote system.</li>
                <li>Communication Records: Correspondence regarding quotes, design specifications, and site measurement bookings.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                2. How We Use Information
              </h2>
              <p className="mb-4">
                We use collected information solely for legitimate business purposes associated with custom glazing services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Preparing precise engineering estimates and custom glazing proposals.</li>
                <li>Scheduling site audits, laser measurements, and glass installation teams.</li>
                <li>Communicating project updates, AS1288 compliance certificates, and warranty documentation.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                3. Data Storage & Security
              </h2>
              <p>
                Customer files and quote requests are stored securely using encrypted cloud database infrastructure with strict access controls. Private customer uploaded files are accessible exclusively by authorized administrative personnel and estimating staff.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                4. Third-Party Disclosures
              </h2>
              <p>
                We do not sell, trade, or rent personal information to external third parties. Information is shared only with verified logistics and glass manufacturing partners essential for producing and delivering your order.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light text-[#111111] mb-4">
                5. Contact & Data Access
              </h2>
              <p>
                To request access, correction, or deletion of your personal information, please contact our privacy compliance team at:
              </p>
              <div className="mt-4 p-6 border border-[#e5e5e5] bg-white font-mono text-xs text-[#111111] shadow-subtle">
                <strong>{BUSINESS_CONFIG.name} Privacy Team</strong><br />
                Email: {BUSINESS_CONFIG.email}<br />
                Phone: {BUSINESS_CONFIG.phone}<br />
                Location: {BUSINESS_CONFIG.address}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
