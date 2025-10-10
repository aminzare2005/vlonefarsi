-- Clear old products and add new phone case designs
truncate table public.products cascade;

insert into public.products (name, description, image_url) values
  ('طرح گل رز', 'قاب گوشی با طرح گل رز زیبا و رمانتیک', '/placeholder.svg?height=400&width=400'),
  ('طرح هندسی', 'قاب گوشی با طرح هندسی مدرن و شیک', '/placeholder.svg?height=400&width=400'),
  ('طرح فضایی', 'قاب گوشی با طرح کهکشان و ستاره‌های درخشان', '/placeholder.svg?height=400&width=400'),
  ('طرح مینیمال', 'قاب گوشی با طرح مینیمال و ساده', '/placeholder.svg?height=400&width=400'),
  ('طرح طبیعت', 'قاب گوشی با طرح منظره طبیعی و کوهستان', '/placeholder.svg?height=400&width=400'),
  ('طرح انتزاعی', 'قاب گوشی با طرح انتزاعی و رنگارنگ', '/placeholder.svg?height=400&width=400'),
  ('طرح ماه و ستاره', 'قاب گوشی با طرح ماه و ستاره‌های شب', '/placeholder.svg?height=400&width=400'),
  ('طرح گرافیکی', 'قاب گوشی با طرح گرافیکی و هنری', '/placeholder.svg?height=400&width=400')
on conflict do nothing;
