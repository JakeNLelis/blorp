-- Insert mock categories
INSERT INTO public.categories (id, name, slug) VALUES
('b27c35bd-f604-4537-b6bb-f8db8c027663', 'Handbags', 'handbags'),
('8d8b8e01-31a8-4db8-b570-3d7ec1655060', 'Watches', 'watches'),
('9b7cc326-7a1a-4c9f-8ea8-3a2b72cf72d8', 'Jewelry', 'jewelry'),
('d5a23f46-8800-410a-819f-7e04b4c73ba9', 'Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- Insert mock products
INSERT INTO public.products (id, title, description, price, image_url, category_id) VALUES
('1e8a8b16-43b9-4a4a-a434-6c39a3f295e2', 'The Obsidian Tote', 'Crafted from premium Italian leather, this structured tote features minimalist hardware and an exceptionally spacious interior. Perfect for the modern professional.', 1250.00, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop', 'b27c35bd-f604-4537-b6bb-f8db8c027663'),
('2f9a9c27-54ca-4b5b-b545-7d40b4a306f3', 'Midnight Crossbody', 'A versatile evening companion. Hand-stitched with a striking geometric clasp and a detachable chain strap.', 850.00, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1600&auto=format&fit=crop', 'b27c35bd-f604-4537-b6bb-f8db8c027663'),
('3a0b0d38-65db-4c6c-c656-8e51c5b417f4', 'Chronograph Royale', 'A masterpiece of horology. Featuring a 42mm titanium case, sapphire crystal, and an automatic movement with a 72-hour power reserve.', 4500.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600&auto=format&fit=crop', '8d8b8e01-31a8-4db8-b570-3d7ec1655060'),
('4b1c1e49-76ec-4d7d-d767-9f62d6c528f5', 'Diamond Solitaire Pendant', 'An exquisite 1.5 carat round brilliant cut diamond set in 18k white gold. Timeless elegance for any occasion.', 3200.00, 'https://images.unsplash.com/photo-1599643478524-fb524419f4a9?q=80&w=1600&auto=format&fit=crop', '9b7cc326-7a1a-4c9f-8ea8-3a2b72cf72d8'),
('5c2d2f5a-87fd-4e8e-e878-0f73e7d639f6', 'Silk Twill Scarf', 'Woven in Lake Como, this vibrant 100% silk scarf features an exclusive Blorp heritage print.', 295.00, 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1600&auto=format&fit=crop', 'd5a23f46-8800-410a-819f-7e04b4c73ba9'),
('6d3e3f6b-98fe-4f9f-f989-1e84f8e740f7', 'The Azure Satchel', 'A daily essential reinvented. Pebble grain leather in a striking azure blue with custom gold-tone hardware.', 980.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop', 'b27c35bd-f604-4537-b6bb-f8db8c027663')
ON CONFLICT (id) DO NOTHING;
