-- Seed phone cases data
insert into public.phone_cases (brand, model, price, available) values
  ('Apple', 'iPhone 15 Pro Max', 450000, true),
  ('Apple', 'iPhone 15 Pro', 420000, true),
  ('Apple', 'iPhone 15', 390000, true),
  ('Apple', 'iPhone 14 Pro Max', 400000, true),
  ('Apple', 'iPhone 14 Pro', 380000, true),
  ('Apple', 'iPhone 14', 350000, true),
  ('Apple', 'iPhone 13', 320000, true),
  ('Samsung', 'Galaxy S24 Ultra', 440000, true),
  ('Samsung', 'Galaxy S24+', 410000, true),
  ('Samsung', 'Galaxy S24', 380000, true),
  ('Samsung', 'Galaxy S23 Ultra', 420000, true),
  ('Samsung', 'Galaxy S23', 360000, true),
  ('Samsung', 'Galaxy A54', 300000, true),
  ('Samsung', 'Galaxy A34', 280000, false),
  ('Xiaomi', 'Xiaomi 14 Pro', 390000, true),
  ('Xiaomi', 'Xiaomi 13', 350000, true),
  ('Xiaomi', 'Redmi Note 13 Pro', 290000, true),
  ('Xiaomi', 'Redmi Note 12', 260000, true)
on conflict (brand, model) do nothing;
