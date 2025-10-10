-- Add phone case information to order_items
alter table public.order_items 
  add column if not exists phone_case_id uuid references public.phone_cases(id),
  add column if not exists phone_brand text,
  add column if not exists phone_model text;

-- Make phone case fields required
alter table public.order_items 
  alter column phone_case_id set not null,
  alter column phone_brand set not null,
  alter column phone_model set not null;
