-- migrate:up

-- 1. Insert Clothing Category
INSERT INTO public.categories (id, name, slug)
VALUES ('e77c45cd-a604-4537-b6bb-f8db8c027664', 'Clothing', 'clothing')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert mock products for Clothing Category
INSERT INTO public.products (id, title, description, price, sale_price, image_url, category_id, stock)
VALUES 
('11e8a8b1-43b9-4a4a-a434-6c39a3f295e2', 'The Heritage Trench Coat', 'Crafted from durable double-breasted cotton twill with premium horn buttons and a waist belt. An archival style that elevates any clothing outfit.', 3500.00, 2999.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600&auto=format&fit=crop', 'e77c45cd-a604-4537-b6bb-f8db8c027664', 50),

('22f9a9c2-54ca-4b5b-b545-7d40b4a306f3', 'Tailored Linen Trousers', 'Relaxed-fit trousers loomed from premium Italian linen. High-rise fit with flat-front pleats and side adjuster tabs.', 1850.00, NULL, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop', 'e77c45cd-a604-4537-b6bb-f8db8c027664', 35),

('33b1c1e4-76ec-4d7d-d767-9f62d6c528f5', 'Minimalist Leather Sneakers', 'Classic low-top trainers made from full-grain calfskin leather. Featuring fully leather-lined interiors and durable margom rubber cupsoles.', 2400.00, NULL, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop', 'e77c45cd-a604-4537-b6bb-f8db8c027664', 40),

('44d2d2f5-87fd-4e8e-e878-0f73e7d639f6', 'Premium Cotton Knit Boxers', 'Knit from extra-long staple Egyptian cotton with a touch of stretch for ultimate breathability. Features a soft waistband and flatlock seams.', 650.00, 520.00, 'https://images.unsplash.com/photo-1582845512747-e426d1fc95f0?q=80&w=1600&auto=format&fit=crop', 'e77c45cd-a604-4537-b6bb-f8db8c027664', 60)
ON CONFLICT (id) DO NOTHING;


-- migrate:down

DELETE FROM public.products WHERE category_id = 'e77c45cd-a604-4537-b6bb-f8db8c027664';
DELETE FROM public.categories WHERE id = 'e77c45cd-a604-4537-b6bb-f8db8c027664';
