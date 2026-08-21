-- Complete Glass Innovations - Supabase Initial Database Schema Migrations

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- SERVICES TABLE
create table if not exists public.services (
    id uuid default uuid_generate_v4() primary key,
    slug text not null unique,
    title text not null,
    description text not null,
    image_url text,
    content text,
    published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS TABLE
create table if not exists public.projects (
    id uuid default uuid_generate_v4() primary key,
    slug text not null unique,
    title text not null,
    description text not null,
    content text,
    project_type text, -- e.g., 'Residential', 'Commercial'
    location text,
    services_used text[] default '{}',
    hero_image text,
    client_name text,
    year text,
    published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECT IMAGES TABLE
create table if not exists public.project_images (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references public.projects(id) on delete cascade not null,
    image_url text not null,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTES TABLE
create table if not exists public.quotes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    phone text not null,
    email text not null,
    suburb text not null,
    service text not null,
    description text not null,
    preferred_contact text not null, -- 'email', 'phone', 'sms'
    status text default 'pending' not null, -- 'pending', 'reviewed', 'contacted', 'completed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTE FILES TABLE
create table if not exists public.quote_files (
    id uuid default uuid_generate_v4() primary key,
    quote_id uuid references public.quotes(id) on delete cascade not null,
    file_url text not null,
    file_name text not null,
    file_size integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS TABLE
create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    author text not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    content text not null,
    service_type text,
    approved boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread' not null, -- 'unread', 'read', 'archived'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ADMINS TABLE (To restrict admin features to specific authenticated users)
create table if not exists public.admins (
    id uuid primary key, -- matches auth.users.id
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_files enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins enable row level security;

-- RLS POLICIES FOR PUBLIC READ ACCESS
create policy "Allow public read access to published services"
    on public.services for select
    using (published = true);

create policy "Allow public read access to published projects"
    on public.projects for select
    using (published = true);

create policy "Allow public read access to project images"
    on public.project_images for select
    using (exists (
        select 1 from public.projects
        where projects.id = project_images.project_id and projects.published = true
    ));

create policy "Allow public read access to approved reviews"
    on public.reviews for select
    using (approved = true);

-- RLS POLICIES FOR PUBLIC INSERT ACCESS (Contact, Quotes)
create policy "Allow public insert to quotes"
    on public.quotes for insert
    with check (true);

create policy "Allow public insert to quote_files"
    on public.quote_files for insert
    with check (true);

create policy "Allow public insert to contact_messages"
    on public.contact_messages for insert
    with check (true);

create policy "Allow public insert to reviews"
    on public.reviews for insert
    with check (true);

-- ADMIN RLS POLICIES (All access for authenticated admins)
create policy "Allow admin full access to services"
    on public.services for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to projects"
    on public.projects for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to project_images"
    on public.project_images for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to quotes"
    on public.quotes for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to quote_files"
    on public.quote_files for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to reviews"
    on public.reviews for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin full access to contact_messages"
    on public.contact_messages for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Allow admin select access to public.admins"
    on public.admins for select
    using (exists (select 1 from public.admins where admins.id = auth.uid()) or auth.uid() = id);

-- INDEXES FOR PERFORMANCE
create index if not exists services_slug_idx on public.services(slug);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists project_images_project_id_idx on public.project_images(project_id);
create index if not exists quote_files_quote_id_idx on public.quote_files(quote_id);
create index if not exists reviews_approved_idx on public.reviews(approved);
