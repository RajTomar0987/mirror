"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";

const FAQS = [
  {
    question: "Do all of your glass products comply with Australian Standards?",
    answer: "Yes, absolutely. Under AS1288 (Glass in buildings - Selection and installation), all glass installations must meet strict structural and safety requirements. We source and install only certified toughened and laminated safety glass that conforms to AS/NZS 2208 safety standards.",
  },
  {
    question: "Can toughened glass panels be resized or modified on site?",
    answer: "No. Toughened safety glass undergoes a thermal tempering process that creates high internal stresses. If toughened glass is cut, drilled, or machined after tempering, it will instantly shatter into small granules. All measurements, cuts, and holes must be finalized prior to the toughening process.",
  },
  {
    question: "What is the typical lead time for custom architectural glass?",
    answer: "Lead times vary based on complexity. Standard clear toughened glass (like shower screens or balustrades) typically takes 7-14 business days for precision fabrication and delivery. Custom laminates, colored splashbacks, or CNC-machined shapes may take 2-4 weeks. We provide precise timelines upon quote confirmation.",
  },
  {
    question: "What geographical areas do you service?",
    answer: "[Service Area - Pending Verification]. We typically service metropolitan residential and commercial projects. Please specify your suburb in our quote request form to verify service availability in your area.",
  },
  {
    question: "What is low-iron glass, and is it worth the additional cost?",
    answer: "Low-iron glass is highly processed to remove the iron oxide that gives standard glass its green-ish edge tint. It offers maximum light transmission and pristine neutrality. We recommend low-iron glass for frameless balustrades against beautiful vistas or white kitchen splashbacks, where maintaining exact color accuracy is crucial.",
  },
];

export const HomeFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-brand-bg-dark border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-4">
              [Common Inquiries]
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-charcoal dark:text-white">
              FREQUENTLY ASKED <br />
              <span className="italic font-normal">QUESTIONS</span>
            </h2>
          </div>
        </FadeIn>

        {/* Accordions with AnimatePresence */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-brand-bg/10 dark:bg-brand-charcoal/10 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus-visible:ring-2 focus-visible:ring-brand-charcoal dark:focus-visible:ring-white"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base md:text-lg font-light text-brand-charcoal dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-center text-brand-gray"
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden border-t border-brand-glass-border-light dark:border-brand-glass-border-dark"
                    >
                      <p className="p-6 text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
