"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  {
    author: "[Customer Name - Pending Verification]",
    service: "Glass Balustrade Installation",
    rating: 5,
    content: "[Review content is pending verification from client. Once testimonials are verified, they will be dynamically displayed here to show details of balustrade precision alignment and service quality.]",
    date: "[Pending Verification]",
  },
  {
    author: "[Customer Name - Pending Verification]",
    service: "Custom Shower Screen Fitting",
    rating: 5,
    content: "[Review content is pending verification from client. Once testimonials are verified, they will be dynamically displayed here to show details of custom bathroom fitouts and cleanliness on site.]",
    date: "[Pending Verification]",
  },
  {
    author: "[Customer Name - Pending Verification]",
    service: "Frameless Pool Fencing",
    rating: 5,
    content: "[Review content is pending verification from client. Once testimonials are verified, they will be dynamically displayed here to show details of safety standard compliance and glass quality.]",
    date: "[Pending Verification]",
  },
];

export const HomeReviews = () => {
  return (
    <section className="py-24 md:py-32 bg-brand-bg dark:bg-brand-charcoal border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-4">
            [Client Testimonials]
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-charcoal dark:text-white">
            WHAT OUR CLIENTS <br />
            <span className="italic font-normal">SAY ABOUT US</span>
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="p-8 border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark flex flex-col justify-between min-h-[300px] shadow-subtle"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-charcoal text-brand-charcoal dark:fill-white dark:text-white" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed italic mb-8">
                  {review.content}
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-brand-glass-border-light dark:border-brand-glass-border-dark pt-4 flex flex-col">
                <span className="font-serif text-base font-light text-brand-charcoal dark:text-white">
                  {review.author}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-brand-gray/60 mt-1">
                  Project: {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
