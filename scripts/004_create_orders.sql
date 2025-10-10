-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_reference text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postal_code text not null,
  phone_number text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  product_price numeric(10, 2) not null,
  quantity integer not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Users can only access their own orders
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "orders_update_own"
  on public.orders for update
  using (auth.uid() = user_id);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Users can only access order items for their own orders
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
