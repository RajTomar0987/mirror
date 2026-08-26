-- Complete Glass Innovations - Database Schema & Row Level Security (Supabase / PostgreSQL)

-- 1. Admins Table (Stores admin user roles tied to auth.users)
create table if not exists public.admins (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text default 'admin'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enquiries Table (Primary unified table for spatial & glazing enquiries)
create table if not exists public.enquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    project_type text,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'new'::text not null
);

-- 3. Contact Messages Table
create table if not exists public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Quotes Table
create table if not exists public.quotes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text not null,
    suburb text default 'Not specified'::text,
    service text not null,
    description text not null,
    preferred_contact text default 'email'::text,
    status text default 'new'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all sensitive data tables
alter table public.admins enable row level security;
alter table public.enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quotes enable row level security;

-- Public Insert Policies (Anonymous/Public users can submit forms, but CANNOT read existing records)
create policy "Allow public insert on enquiries" on public.enquiries
    for insert with check (true);

create policy "Allow public insert on contact_messages" on public.contact_messages
    for insert with check (true);

create policy "Allow public insert on quotes" on public.quotes
    for insert with check (true);

-- Admin Access Policies (Only authenticated users with 'admin' role in public.admins can select/update/delete)
create policy "Allow admin full access on admins" on public.admins
    for all using (
        auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on enquiries" on public.enquiries
    for all using (
        auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on contact_messages" on public.contact_messages
    for all using (
        auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on quotes" on public.quotes
    for all using (
        auth.uid() in (select id from public.admins where role = 'admin')
    );
