-- Complete Glass Innovations - Supabase Production Database Migration

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Optional local user profile tracking linked to auth.users)
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ADMINS TABLE (Administrative privileges tracking linked to auth.users)
create table if not exists public.admins (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text default 'admin' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SERVICES TABLE
create table if not exists public.services (
    id uuid default gen_random_uuid() primary key,
    slug text not null unique,
    title text not null,
    short_description text,
    description text not null,
    content text not null,
    features text[] default '{}' not null,
    specs jsonb default '{}'::jsonb not null,
    compliance text not null,
    bg_class text,
    hero_image text,
    gallery text[] default '{}' not null,
    process jsonb default '[]'::jsonb not null,
    published boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PROJECTS TABLE
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    slug text not null unique,
    title text not null,
    subtitle text,
    description text not null,
    content text not null,
    project_type text not null check (project_type in ('Residential', 'Commercial', 'Other')),
    location text not null,
    services_used text[] default '{}' not null,
    client_name text not null,
    year text not null,
    before_image text,
    after_image text,
    hero_image text,
    challenge text,
    solution text,
    specs jsonb default '{}'::jsonb not null,
    published boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PROJECT IMAGES TABLE
create table if not exists public.project_images (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade not null,
    image_url text not null,
    caption text,
    display_order integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. QUOTES TABLE
create table if not exists public.quotes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    email text not null,
    suburb text not null,
    service text not null,
    description text not null,
    preferred_contact text not null check (preferred_contact in ('email', 'phone', 'sms')),
    status text default 'new' not null check (status in ('new', 'contacted', 'quote_sent', 'in_progress', 'completed', 'closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. QUOTE FILES TABLE
create table if not exists public.quote_files (
    id uuid default gen_random_uuid() primary key,
    quote_id uuid references public.quotes(id) on delete cascade not null,
    file_url text not null,
    file_name text not null,
    mime_type text not null,
    file_size integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid default gen_random_uuid() primary key,
    author text not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    content text not null,
    service_type text,
    suburb text,
    approved boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread' not null check (status in ('unread', 'read', 'archived')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.users enable row level security;
alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_files enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- PUBLIC READ POLICIES
create policy "Public can view published services"
    on public.services for select
    using (published = true);

create policy "Public can view published projects"
    on public.projects for select
    using (published = true);

create policy "Public can view project images for published projects"
    on public.project_images for select
    using (exists (
        select 1 from public.projects
        where projects.id = project_images.project_id and projects.published = true
    ));

create policy "Public can view approved reviews"
    on public.reviews for select
    using (approved = true);

-- PUBLIC INSERT POLICIES (Enquiries, Quotes, Reviews)
create policy "Public can insert quote requests"
    on public.quotes for insert
    with check (true);

create policy "Public can insert quote attachments"
    on public.quote_files for insert
    with check (true);

create policy "Public can submit contact messages"
    on public.contact_messages for insert
    with check (true);

create policy "Public can submit reviews"
    on public.reviews for insert
    with check (true);

-- ADMIN POLICIES (Full control for authenticated admins)
create policy "Admins full access to services"
    on public.services for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to projects"
    on public.projects for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to project_images"
    on public.project_images for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to quotes"
    on public.quotes for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to quote_files"
    on public.quote_files for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to reviews"
    on public.reviews for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins full access to contact_messages"
    on public.contact_messages for all
    using (exists (select 1 from public.admins where admins.id = auth.uid()));

create policy "Admins view own status"
    on public.admins for select
    using (id = auth.uid());

-- INDEXES FOR QUERY OPTIMIZATION
create index if not exists idx_services_slug on public.services(slug);
create index if not exists idx_services_published on public.services(published);

create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_published on public.projects(published);
create index if not exists idx_projects_type on public.projects(project_type);

create index if not exists idx_project_images_project_id on public.project_images(project_id);
create index if not exists idx_quote_files_quote_id on public.quote_files(quote_id);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_reviews_approved on public.reviews(approved);
create index if not exists idx_contact_messages_status on public.contact_messages(status);
