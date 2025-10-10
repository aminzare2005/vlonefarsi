-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  category text,
  stock integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- Products are publicly readable
create policy "products_select_all"
  on public.products for select
  using (true);

-- Only authenticated users can insert/update/delete (for admin functionality)
create policy "products_insert_authenticated"
  on public.products for insert
  with check (auth.uid() is not null);

create policy "products_update_authenticated"
  on public.products for update
  using (auth.uid() is not null);

create policy "products_delete_authenticated"
  on public.products for delete
  using (auth.uid() is not null);
