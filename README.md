# Complete Glass Innovations — Architectural Glass Studio Web Platform

An ultra-premium, high-performance web platform built for **Complete Glass Innovations**, an Australian architectural glass studio specializing in custom frameless glass balustrades, pool fencing, shower screens, and commercial glazing engineered to AS1288 standards.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router with Turbopack) & React 19
- **3D WebGL Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation System**: Motion for React (`motion/react`)
- **Database & Storage**: Supabase PostgreSQL & Supabase Storage
- **Styling**: Vanilla CSS, Tailwind CSS, Google Fonts (Outfit & Playfair Display)
- **Validation**: Zod schema validation
- **Type Safety**: TypeScript (Strict Mode)

---

## Key Features

1. **3D WebGL Glass Hero Experience**: Real-time physical glass transmission rendering with studio HDRI reflections, mouse parallax tracking, and responsive wireframe fallbacks.
2. **5-Step Quote Form Wizard**: Multi-step customer estimate request system with drag-and-drop file attachment uploader (5MB limit, MIME verification, executable blocking).
3. **Private Admin Dashboard**: Authenticated management portal for reviewing quote requests, managing portfolio case studies, publishing services, moderating reviews, and reading customer messages.
4. **Private Upload Streaming Proxy**: Customer quote attachments are stored securely in Supabase Storage and streamed exclusively through authenticated proxy route `/api/admin/files/[id]`.
5. **Modular Email Notification Engine**: Non-blocking transactional email dispatches for customer quote receipts, admin notifications, contact forms, and quote status updates supporting Resend and Mock providers.
6. **SEO & Accessibility**: Dynamic sitemap (`/sitemap.xml`), crawler control (`/robots.txt`), Schema.org JSON-LD structured data (`LocalBusiness`, `Service`, `BreadcrumbList`), and WCAG 2.1 AA accessibility standards.

---

## Directory Architecture

```text
src/
├── app/                  # Next.js App Router (Public routes, /admin, /api)
│   ├── admin/            # Protected Private Admin Portal
│   ├── api/              # Secure Server API Handler Routes
│   ├── projects/         # Portfolio Case Studies & Detail Routing
│   ├── quote/            # Multi-Step Free Quote Page
│   ├── services/         # Architectural Services Directory
│   ├── privacy/          # Legal Privacy Policy (APP Compliant)
│   ├── terms/            # Legal Terms of Service (AS1288 Compliant)
│   ├── not-found.tsx     # Custom Architectural 404 View
│   └── sitemap.ts        # Dynamic Sitemap XML Generator
├── components/           # Modular UI Components
│   ├── 3d/               # Three.js / R3F Canvas & Physical Glass Meshes
│   ├── admin/            # Admin Layout, Navigation Sidebar & Toast Provider
│   ├── animations/       # Motion Reveals, Page Transitions & Magnetic Buttons
│   ├── layout/           # Public Header Navigation & Footer
│   ├── sections/         # Homepage Visual Experience Sections
│   └── ui/               # Quote Form Wizard, File Uploader & Lightboxes
├── config/               # Centralized Business & Branding Configuration
├── data/                 # Static Fallback & Pre-rendered Datasets
├── lib/                  # Server Clients, Auth Session Helpers & Validations
└── services/             # Email Service Abstraction & Template Generators

database/
├── migrations/           # PostgreSQL Schema Migrations (0001_initial_schema.sql)
└── seed.sql              # Development Database Seed Data
```

---

## Local Development Quickstart

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm 9.x+

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

### 4. Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live application.

---

## Verification & Build Commands

- **ESLint Verification**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Production Server Test**:
  ```bash
  npm run start
  ```

---

## License & Ownership

© Complete Glass Innovations. All rights reserved. Built for production deployment.
