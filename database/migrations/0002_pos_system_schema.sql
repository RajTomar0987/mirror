-- ==============================================================================
-- Complete Glass Innovations - POS & Sales Management Database Schema Migration
-- ==============================================================================

-- 1. CUSTOMERS CRM TABLE
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

-- 2. POS PROJECTS TABLE
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

-- 3. ESTIMATES TABLE
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

-- 4. ESTIMATE LINE ITEMS TABLE
create table if not exists public.estimate_items (
    id uuid default gen_random_uuid() primary key,
    estimate_id uuid references public.estimates(id) on delete cascade not null,
    description text not null,
    quantity numeric(10,2) default 1.00 not null,
    unit text default 'item' not null, -- 'm', 'sqm', 'panel', 'set', 'service', 'item', 'hours'
    unit_price numeric(12,2) default 0.00 not null,
    subtotal numeric(12,2) default 0.00 not null,
    item_order integer default 0 not null
);

-- 5. INVOICES TABLE
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

-- 6. INVOICE LINE ITEMS TABLE
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

-- 7. PAYMENTS TABLE
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

-- 8. ACTIVITY / AUDIT LOGS TABLE
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

-- 9. COMPANY SETTINGS TABLE
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR POS
-- ==============================================================================

alter table public.customers enable row level security;
alter table public.pos_projects enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.company_settings enable row level security;

-- Admin Full Access Policies
create policy "Admins full access to customers" on public.customers
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to pos_projects" on public.pos_projects
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to estimates" on public.estimates
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to estimate_items" on public.estimate_items
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to invoices" on public.invoices
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to invoice_items" on public.invoice_items
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to payments" on public.payments
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to activity_logs" on public.activity_logs
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

create policy "Admins full access to company_settings" on public.company_settings
    for all using (
        auth.uid() in (select id from public.profiles where role = 'admin')
        or auth.uid() in (select id from public.admins where role = 'admin')
    );

-- Indexes for Fast POS Queries
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_estimates_customer on public.estimates(customer_id);
create index if not exists idx_estimates_status on public.estimates(status);
create index if not exists idx_invoices_customer on public.invoices(customer_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
create index if not exists idx_pos_projects_customer on public.pos_projects(customer_id);
create index if not exists idx_activity_logs_created on public.activity_logs(created_at desc);
