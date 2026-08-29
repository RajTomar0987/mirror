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

-- 3. Customers CRM Table
create table if not exists public.customers (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null unique,
    phone text not null,
    address text,
    suburb text default 'Sydney',
    state text default 'NSW',
    postcode text default '2000',
    company text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enquiries Table (Primary unified table for spatial & glazing enquiries)
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

-- 5. Contact Messages Table
create table if not exists public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'unread'::text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Quote Requests Table (Primary Table)
create table if not exists public.quote_requests (
    id uuid default gen_random_uuid() primary key,
    customer_id uuid references public.customers(id) on delete set null,
    name text not null,
    email text not null,
    phone text,
    project_type text default 'Custom Glazing'::text,
    location text default 'Sydney, NSW'::text,
    budget text default 'Flexible'::text,
    message text,
    measurements text,
    estimated_value numeric(12,2) default 0.00,
    status text default 'new'::text not null,
    notes text default ''::text,
    archived boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Quotes Table (Legacy Compatibility)
create table if not exists public.quotes (
    id uuid default gen_random_uuid() primary key,
    customer_id uuid references public.customers(id) on delete set null,
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
    measurements text,
    estimated_value numeric(12,2) default 0.00,
    preferred_contact text default 'email'::text,
    status text default 'new'::text not null,
    notes text default ''::text,
    archived boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. POS Projects Table
create table if not exists public.pos_projects (
    id uuid default gen_random_uuid() primary key,
    project_name text not null,
    customer_id uuid references public.customers(id) on delete set null,
    service text not null default 'Custom Glazing',
    location text not null default 'Sydney, NSW',
    start_date date,
    expected_completion date,
    actual_completion date,
    status text default 'quote' not null check (status in ('quote', 'estimate', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    quote_id uuid,
    estimate_id uuid,
    invoice_id uuid,
    notes text,
    images text[] default '{}' not null,
    estimated_value numeric(12,2) default 0.00,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Estimates Table
create table if not exists public.estimates (
    id uuid default gen_random_uuid() primary key,
    estimate_number text not null unique,
    customer_id uuid references public.customers(id) on delete cascade not null,
    quote_id uuid,
    project_id uuid references public.pos_projects(id) on delete set null,
    status text default 'draft' not null check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
    issue_date date default current_date not null,
    valid_until date not null,
    subtotal numeric(12,2) default 0.00 not null,
    discount_amount numeric(12,2) default 0.00 not null,
    gst_rate numeric(4,2) default 0.10 not null, -- 10% Australian GST
    gst_amount numeric(12,2) default 0.00 not null,
    total_amount numeric(12,2) default 0.00 not null,
    notes text,
    terms text default 'Valid for 30 days. 50% deposit required on acceptance. Compliant with AS1288.',
    sent_at timestamp with time zone,
    accepted_at timestamp with time zone,
    converted_to_invoice_id uuid,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Estimate Line Items
create table if not exists public.estimate_items (
    id uuid default gen_random_uuid() primary key,
    estimate_id uuid references public.estimates(id) on delete cascade not null,
    description text not null,
    quantity numeric(10,2) default 1.00 not null,
    unit text default 'item' not null,
    unit_price numeric(12,2) default 0.00 not null,
    subtotal numeric(12,2) default 0.00 not null,
    item_order integer default 0 not null
);

-- 11. Invoices Table
create table if not exists public.invoices (
    id uuid default gen_random_uuid() primary key,
    invoice_number text not null unique,
    customer_id uuid references public.customers(id) on delete cascade not null,
    project_id uuid references public.pos_projects(id) on delete set null,
    estimate_id uuid references public.estimates(id) on delete set null,
    status text default 'draft' not null check (status in ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled')),
    issue_date date default current_date not null,
    due_date date not null,
    subtotal numeric(12,2) default 0.00 not null,
    gst_rate numeric(4,2) default 0.10 not null,
    gst_amount numeric(12,2) default 0.00 not null,
    total_amount numeric(12,2) default 0.00 not null,
    amount_paid numeric(12,2) default 0.00 not null,
    balance_due numeric(12,2) default 0.00 not null,
    notes text,
    payment_terms text default 'Payment due within 14 days. Bank Transfer details on invoice.',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Invoice Line Items
create table if not exists public.invoice_items (
    id uuid default gen_random_uuid() primary key,
    invoice_id uuid references public.invoices(id) on delete cascade not null,
    description text not null,
    quantity numeric(10,2) default 1.00 not null,
    unit text default 'item' not null,
    unit_price numeric(12,2) default 0.00 not null,
    subtotal numeric(12,2) default 0.00 not null,
    item_order integer default 0 not null
);

-- 13. Payments Table
create table if not exists public.payments (
    id uuid default gen_random_uuid() primary key,
    payment_number text not null unique,
    invoice_id uuid references public.invoices(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    amount numeric(12,2) not null check (amount > 0),
    payment_method text default 'bank_transfer' not null check (payment_method in ('bank_transfer', 'card', 'cash', 'cheque', 'other')),
    payment_date date default current_date not null,
    reference_number text,
    status text default 'completed' not null check (status in ('completed', 'pending', 'failed', 'refunded')),
    notes text,
    recorded_by text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Activity / Audit Logs Table
create table if not exists public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    admin_user_id uuid references auth.users(id) on delete set null,
    admin_email text not null,
    action text not null,
    entity_type text not null,
    entity_id text,
    details text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Company Settings Table
create table if not exists public.company_settings (
    id uuid default gen_random_uuid() primary key,
    business_name text default 'Complete Glass Innovations' not null,
    abn text default '58 123 456 789' not null,
    acn text default '123 456 789',
    phone text default '+61 2 9876 5432' not null,
    email text default 'admin@completeglass.com.au' not null,
    address text default '128 Architectural Way' not null,
    suburb text default 'Alexandria' not null,
    state text default 'NSW' not null,
    postcode text default '2015' not null,
    country text default 'Australia' not null,
    gst_rate numeric(4,2) default 0.10 not null,
    bank_name text default 'Commonwealth Bank of Australia' not null,
    account_name text default 'Complete Glass Innovations Pty Ltd' not null,
    bsb text default '062-000' not null,
    account_number text default '1234 5678' not null,
    invoice_prefix text default 'CGI-INV-' not null,
    estimate_prefix text default 'CGI-EST-' not null,
    quote_prefix text default 'CGI-Q-' not null,
    estimate_terms_default text default 'Valid for 30 days. 50% deposit required upon confirmation. All glazing certified to AS1288.',
    invoice_terms_default text default 'Payment strictly within 14 days of invoice date. EFT preferred.',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
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

alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.customers enable row level security;
alter table public.enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_requests enable row level security;
alter table public.pos_projects enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.company_settings enable row level security;

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

-- Admin Access Policies (Only authenticated admins have access to POS / CRM / Financial tables)
create policy "Allow admin full access on admins" on public.admins
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on customers" on public.customers
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

create policy "Allow admin full access on pos_projects" on public.pos_projects
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on estimates" on public.estimates
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on estimate_items" on public.estimate_items
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on invoices" on public.invoices
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on invoice_items" on public.invoice_items
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on payments" on public.payments
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on activity_logs" on public.activity_logs
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Allow admin full access on company_settings" on public.company_settings
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );
