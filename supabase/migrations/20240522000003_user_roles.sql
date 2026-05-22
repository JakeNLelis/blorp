-- migrate:up

-- 1. Create profiles table to link roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create recursive-free public check for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Trigger to handle new user registration role
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (
        NEW.id,
        CASE
            -- First user to register in the system gets the admin role
            WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER trg_handle_new_user
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_handle_new_user();

-- Fill profiles for any existing users
INSERT INTO public.profiles (id, role)
SELECT id, 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Make the earliest registered user an admin if there are any
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- 5. RLS Policies on Products for Admins
CREATE POLICY "Only admins can insert products."
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update products."
    ON public.products FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete products."
    ON public.products FOR DELETE
    USING (public.is_admin());

-- 6. RLS Policies on Categories for Admins
CREATE POLICY "Only admins can insert categories."
    ON public.categories FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories."
    ON public.categories FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete categories."
    ON public.categories FOR DELETE
    USING (public.is_admin());

-- 7. Storage Bucket Insert Policies for Admins
CREATE POLICY "Admins can upload product images."
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());


-- migrate:down
DROP POLICY IF EXISTS "Admins can upload product images." ON storage.objects;

DROP POLICY IF EXISTS "Only admins can insert products." ON public.products;
DROP POLICY IF EXISTS "Only admins can update products." ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products." ON public.products;

DROP POLICY IF EXISTS "Only admins can insert categories." ON public.categories;
DROP POLICY IF EXISTS "Only admins can update categories." ON public.categories;
DROP POLICY IF EXISTS "Only admins can delete categories." ON public.categories;

DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS public.fn_handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();
DROP TABLE IF EXISTS public.profiles;
