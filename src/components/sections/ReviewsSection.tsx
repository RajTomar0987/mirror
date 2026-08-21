"use client";

import React from "react";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";

const PLACEHOLDER_REVIEWS = [
  {
    author: "Julian Vance",
    suburb: "Mosman, NSW",
    rating: 5,
    serviceType: "Glass Balustrades",
    content:
      "The custom frameless glass balustrade completely opened up our harbour view. Flawless installation, robust fittings, and complete structural certification.",
  },
  {
    author: "Elena Rostova",
    suburb: "Double Bay, NSW",
    rating: 5,
    serviceType: "Shower Screens",
    content:
      "Precision measurement and fitting for our master bathroom. The floor-to-ceiling frameless glass screen operates smoothly and elevates the entire room.",
  },
  {
    author: "Marcus Chen",
    suburb: "Vaucluse, NSW",
    rating: 5,
    serviceType: "Pool Fencing",
    content:
      "Exceptional workmanship on our frameless pool fence. Clear compliance certification provided promptly for council approval. Highly professional team.",
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-white text-[#111111] border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <FadeIn direction="up" delay={0.1}>
          <div className="mb-20 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#555555] block mb-4">
              [Client Testimonials Placeholder]
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111]">
              REPUTATION BUILT ON <br />
              <span className="italic font-normal">PRECISION & TRUST</span>
            </h2>
          </div>
        </FadeIn>

        {/* Testimonials Grid */}
        <StaggerContainer staggerChildren={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLACEHOLDER_REVIEWS.map((review, i) => (
            <StaggerItem key={i} className="h-full">
              <ReviewCard
                author={review.author}
                suburb={review.suburb}
                rating={review.rating}
                serviceType={review.serviceType}
                content={review.content}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
