-- migrate:up
-- 1. Create Shoes category
INSERT INTO public.categories (id, name, slug)
VALUES ('f8a65d01-e23a-4eb8-b98a-5d6c82cf81de', 'Shoes', 'shoes')
ON CONFLICT (id) DO NOTHING;

-- 2. Update Minimalist Leather Sneakers to Shoes category
UPDATE public.products
SET category_id = 'f8a65d01-e23a-4eb8-b98a-5d6c82cf81de'
WHERE id = '33b1c1e4-76ec-4d7d-d767-9f62d6c528f5';

-- 3. Seed Jewelry mock products
INSERT INTO public.products (id, title, description, price, sale_price, image_url, category_id, stock)
VALUES 
('4b1c1e49-76ec-4d7d-d767-9f62d6c528f5', 'Diamond Solitaire Pendant', 'An exquisite 1.5 carat round brilliant cut diamond set in 18k white gold. Timeless elegance for any occasion.', 3200.00, 2999.00, 'https://images.unsplash.com/photo-1599643478524-fb524419f4a9?q=80&w=1600&auto=format&fit=crop', '9b7cc326-7a1a-4c9f-8ea8-3a2b72cf72d8', 15),
('8c7d6e5f-1a2b-3c4d-5e6f-7a8b9c0d1e2f', 'Classic Gold Hoop Earrings', 'Crafted from highly polished 14k yellow gold, these lightweight hoop earrings offer a timeless elegance.', 450.00, NULL, 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1600&auto=format&fit=crop', '9b7cc326-7a1a-4c9f-8ea8-3a2b72cf72d8', 40)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Shoes mock products
INSERT INTO public.products (id, title, description, price, sale_price, image_url, category_id, stock)
VALUES
('9d8e7f6a-2b3c-4d5e-6f7a-8b9c0d1e2f3a', 'Elegant Suede Loafers', 'Handcrafted from ultra-soft Italian suede with a flexible leather sole. The ultimate combination of luxury and relaxed style.', 1850.00, 1699.00, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1600&auto=format&fit=crop', 'f8a65d01-e23a-4eb8-b98a-5d6c82cf81de', 25)
ON CONFLICT (id) DO NOTHING;

-- migrate:down
-- 1. Restore Minimalist Leather Sneakers to its original category
UPDATE public.products
SET category_id = 'e77c45cd-a604-4537-b6bb-f8db8c027664'
WHERE id = '33b1c1e4-76ec-4d7d-d767-9f62d6c528f5';

-- 2. Delete seeded products
DELETE FROM public.products
WHERE id IN (
  '4b1c1e49-76ec-4d7d-d767-9f62d6c528f5',
  '8c7d6e5f-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
  '9d8e7f6a-2b3c-4d5e-6f7a-8b9c0d1e2f3a'
);

-- 3. Delete seeded category
DELETE FROM public.categories
WHERE id = 'f8a65d01-e23a-4eb8-b98a-5d6c82cf81de';
