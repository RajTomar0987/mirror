# Complete Glass Innovations — Production Handover & Deployment Guide

This document outlines the step-by-step procedure for deploying the **Complete Glass Innovations** web platform to production hosting, migrating DNS, configuring Supabase PostgreSQL, and managing administrator access.

---

## 1. Environment Variable Checklist

Configure these environment variables in your hosting dashboard (e.g., Cloudflare Pages, Vercel, or Render). **Never commit production credentials to GitHub.**

| Variable Name | Environment Scope | Example / Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | Privileged service role key (Never exposed to browser) |
| `EMAIL_PROVIDER` | **Server-Only** | `resend` (or `mock` for testing) |
| `EMAIL_API_KEY` | **Server-Only** | `re_123456789_your_api_key` |
| `BUSINESS_NAME` | Client & Server | `Complete Glass Innovations` |
| `BUSINESS_EMAIL` | Client & Server | `info@completeglass.com.au` |
| `BUSINESS_PHONE` | Client & Server | `1300 000 000` |
| `BUSINESS_ADDRESS` | Client & Server | `Sydney, NSW, Australia` |
| `WEBSITE_URL` | Client & Server | `https://completeglass.com.au` |
| `NEXT_PUBLIC_APP_URL` | Client & Server | `https://completeglass.com.au` |

---

## 2. Database Migration (Supabase PostgreSQL)

1. Log into your production [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy the contents of [database/migrations/0001_initial_schema.sql](file:///d:/mirror/database/migrations/0001_initial_schema.sql) into the SQL Query window.
4. Execute the script to instantiate all 9 database tables (`users`, `admins`, `services`, `projects`, `project_images`, `quotes`, `quote_files`, `reviews`, `contact_messages`), query indexes, and RLS policies.
5. Do **NOT** run `database/seed.sql` in production. Seed data is strictly for development environments.

---

## 3. Storage Bucket Setup (`quote-files`)

1. In Supabase Dashboard, navigate to **Storage**.
2. Create a new bucket named `quote-files`.
3. Set the bucket privacy to **Private** (Customer uploads must not be publicly accessible).
4. Verify RLS policies:
   - `INSERT`: Allowed for `anon` role (for customer uploads during quote submission).
   - `SELECT` / `DELETE`: Allowed exclusively for `authenticated` users with `admin` role.

---

## 4. Email Service Configuration (Resend)

1. Sign up for a production account at [Resend.com](https://resend.com).
2. Add and verify the client's domain (`completeglass.com.au`).
3. Add the required TXT records (`resend._domainkey`) provided by Resend to domain DNS.
4. Create an API Key in Resend and set `EMAIL_API_KEY` in environment variables.
5. Set `EMAIL_PROVIDER=resend`.

---

## 5. DNS Migration & Safeguards

> [!CAUTION]
> **DO NOT DELETE OR MODIFY EXISTING MX, SPF, DKIM, OR DMARC RECORDS.**
> Modifying email-related DNS records will disrupt business emails (e.g. Google Workspace, Microsoft 365). Only update `A` / `CNAME` records associated with website traffic.

### Recommended DNS Configuration:
- **Apex / Root Domain (`completeglass.com.au`)**:
  - Type: `ALIAS` or `A` record pointing to hosting provider IP.
- **www Subdomain (`www.completeglass.com.au`)**:
  - Type: `CNAME` pointing to hosting provider target host (e.g., `cgi-studio.pages.dev` or `cname.vercel-dns.com`).

---

## 6. Admin User Onboarding

To create your initial super admin account:
1. In Supabase Dashboard SQL Editor, run:
```sql
-- Step 1: Create user record
INSERT INTO public.users (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@completeglass.com.au', 'Super Admin', 'admin');

-- Step 2: Register in admins table
INSERT INTO public.admins (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'super_admin');
```
2. Navigate to `https://completeglass.com.au/admin/login` to sign in.

---

## 7. Maintenance & Backup Guidelines

- **Database Backups**: Supabase automatically creates daily point-in-time backups.
- **Code Maintenance**: All source code is version-controlled in the repository. Standard deployment updates can be triggered via `git push origin main`.
- **Certificates & SSL**: Cloudflare / Vercel automatically issues and renews SSL certificates via Let's Encrypt / DigiCert.
