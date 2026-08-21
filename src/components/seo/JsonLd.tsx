import React from "react";
import { BUSINESS_CONFIG } from "@/config/business";

export const LocalBusinessJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_CONFIG.name,
    image: `${BUSINESS_CONFIG.websiteUrl}/images/hero-og.jpg`,
    "@id": BUSINESS_CONFIG.websiteUrl,
    url: BUSINESS_CONFIG.websiteUrl,
    telephone: BUSINESS_CONFIG.phone,
    email: BUSINESS_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sydney Architectural Glass Studio",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      postalCode: "2000",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.8688,
      longitude: 151.2093,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    priceRange: "$$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ServiceJsonLd: React.FC<{
  name: string;
  description: string;
  url: string;
}> = ({ name, description, url }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.websiteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    description,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const BreadcrumbJsonLd: React.FC<{
  items: Array<{ name: string; item: string }>;
}> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
