-- Complete Glass Innovations - Development Seed Data
-- WARNING: DEVELOPMENT DATA ONLY. DO NOT EXECUTE IN PRODUCTION ENVIRONMENT.

-- Seed initial services
insert into public.services (slug, title, short_description, description, content, features, specs, compliance, published)
values
(
    'glass-balustrades',
    'Glass Balustrades',
    'Sleek, transparent safety barriers that optimize views and maximize light transmission.',
    'Sleek, transparent safety barriers that optimize views and maximize light transmission for modern balconies, stairs, and voids.',
    'Our custom glass balustrades provide the perfect blend of structural safety and visual openness.',
    array['Fully frameless, semi-frameless, or patch-fitted configurations', 'Sourced from premium toughened safety glass (12mm to 19mm)'],
    '{"Standard Thickness": "12mm, 15mm, 19mm Toughened Safety Glass", "Fixing Options": "Spigot fixed, Channel fixed"}'::jsonb,
    'All balustrades are engineered and installed in strict compliance with AS1288 and AS1170.',
    true
),
(
    'shower-screens',
    'Shower Screens',
    'Custom frameless and semi-frameless glass shower enclosures.',
    'Custom frameless and semi-frameless glass shower enclosures tailored to elevate luxury bathrooms.',
    'Transform your bathroom into a luxury sanctuary with custom frameless shower screens.',
    array['10mm clear toughened safety glass', 'Solid brass hardware'],
    '{"Standard Thickness": "10mm (Frameless)", "Hinge Types": "Pivot hinges"}'::jsonb,
    'All panels comply with AS/NZS 2208 safety standards.',
    true
)
on conflict (slug) do nothing;

-- Seed initial development review
insert into public.reviews (author, rating, content, service_type, suburb, approved)
values
(
    'Dev Test Client',
    5,
    'Exceptional quality glass installation and prompt communication.',
    'Glass Balustrades',
    'Sydney',
    true
);
