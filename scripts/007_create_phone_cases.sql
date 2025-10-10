-- Create phone_cases table for different phone models
create table if not exists public.phone_cases (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  price numeric(10, 2) not null,
  available boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(brand, model)
);

-- Enable RLS
alter table public.phone_cases enable row level security;

-- Phone cases are publicly readable
create policy "phone_cases_select_all"
  on public.phone_cases for select
  using (true);

-- Only authenticated users can insert/update/delete (for admin functionality)
create policy "phone_cases_insert_authenticated"
  on public.phone_cases for insert
  with check (auth.uid() is not null);

create policy "phone_cases_update_authenticated"
  on public.phone_cases for update
  using (auth.uid() is not null);

create policy "phone_cases_delete_authenticated"
  on public.phone_cases for delete
  using (auth.uid() is not null);
