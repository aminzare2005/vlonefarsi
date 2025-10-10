-- Add phone_case_id to cart_items and remove unique constraint on product_id
alter table public.cart_items 
  drop constraint if exists cart_items_user_id_product_id_key;

alter table public.cart_items 
  add column if not exists phone_case_id uuid references public.phone_cases(id) on delete cascade;

-- Add new unique constraint for user_id, product_id, and phone_case_id
alter table public.cart_items 
  add constraint cart_items_user_product_phonecase_unique 
  unique(user_id, product_id, phone_case_id);

-- Make phone_case_id required
alter table public.cart_items 
  alter column phone_case_id set not null;
