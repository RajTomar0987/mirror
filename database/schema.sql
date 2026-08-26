-- Complete Glass Innovations - Database Schema & Row Level Security (Supabase / PostgreSQL)

-- 1. Profiles Table (Unified User & Admin accounts linked to auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    role text default 'user'::text not null check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Admins Table (Stores admin user roles tied to auth.users for compatibility)
create table if not exists public.admins (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text default 'admin'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enquiries Table (Primary unified table for spatial & glazing enquiries)
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

-- 4. Contact Messages Table
create table if not exists public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Quote Requests Table (Primary Table)
create table if not exists public.quote_requests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    phone text,
    project_type text default 'Custom Glazing'::text,
    location text default 'Sydney, NSW'::text,
    budget text default 'Flexible'::text,
    message text,
    status text default 'new'::text not null check (status in ('new', 'contacted', 'completed')),
    notes text default ''::text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Quotes Table (Legacy Compatibility)
create table if not exists public.quotes (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    phone text not null,
    project_type text default 'Custom Glazing'::text,
    service text default 'Custom Glazing'::text,
    location text default 'Sydney, NSW'::text,
    suburb text default 'Sydney, NSW'::text,
    budget text default 'Flexible'::text,
    message text,
    description text,
    preferred_contact text default 'email'::text,
    status text default 'new'::text not null check (status in ('new', 'contacted', 'completed')),
    notes text default ''::text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ==================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all sensitive data tables
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_requests enable row level security;

-- Profiles RLS
create policy "Allow users to read own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Allow users to update own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Allow admin full access on profiles" on public.profiles
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

-- Public Insert Policies (Anonymous/Public users can submit forms, but CANNOT read existing records)
create policy "Allow public insert on enquiries" on public.enquiries
    for insert with check (true);

create policy "Allow public insert on contact_messages" on public.contact_messages
    for insert with check (true);

create policy "Allow public insert on quotes" on public.quotes
    for insert with check (true);

create policy "Allow public insert on quote_requests" on public.quote_requests
    for insert with check (true);

-- Admin Access Policies (Only authenticated users with 'admin' role in public.profiles or public.admins can select/update/delete)
create policy "Allow admin full access on admins" on public.admins
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on enquiries" on public.enquiries
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on contact_messages" on public.contact_messages
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on quotes" on public.quotes
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on quote_requests" on public.quote_requests
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );
