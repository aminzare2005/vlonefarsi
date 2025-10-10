-- Remove price and stock from products table since they'll be in phone_cases
alter table public.products 
  drop column if exists price,
  drop column if exists stock,
  drop column if exists category;

-- Add description column if it doesn't exist
alter table public.products 
  add column if not exists description text;
