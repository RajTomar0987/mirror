-- Complete Glass Innovations - Database Schema (Supabase / PostgreSQL)

-- Enquiries Table (Primary unified table)
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

-- Contact Messages Table
create table if not exists public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quotes Table
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
