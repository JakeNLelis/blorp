-- migrate:up

-- 1. Add sale_price column to products
ALTER TABLE public.products
ADD COLUMN sale_price NUMERIC CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price));

-- 2. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, user_id)
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Users who bought a product in a completed order can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.order_items oi ON o.id = oi.order_id
            WHERE o.user_id = auth.uid()
              AND o.status = 'completed'
              AND oi.product_id = reviews.product_id
        )
    );

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id);


-- 3. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for broadcasts
    is_admin_notification BOOLEAN DEFAULT false NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'review', 'new_product', 'new_discount', 'order_shipped', 'order_arrived', 'order_reported'
    link TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can read their own or broadcast notifications"
    ON public.notifications FOR SELECT
    USING (
        (auth.uid() = user_id AND is_admin_notification = false) OR
        (user_id IS NULL AND is_admin_notification = false) OR
        (is_admin_notification = true AND public.is_admin())
    );

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (
        (auth.uid() = user_id AND is_admin_notification = false) OR
        (is_admin_notification = true AND public.is_admin())
    )
    WITH CHECK (
        (auth.uid() = user_id AND is_admin_notification = false) OR
        (is_admin_notification = true AND public.is_admin())
    );

-- System or admin can insert notifications
CREATE POLICY "System or admin can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (
        (auth.uid() = user_id AND is_admin_notification IS FALSE) OR
        public.is_admin()
    );


-- 4. Create saved_addresses table
CREATE TABLE IF NOT EXISTS public.saved_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_number TEXT NOT NULL,
    region_name TEXT NOT NULL,
    region_code TEXT NOT NULL,
    province_name TEXT NOT NULL,
    province_code TEXT NOT NULL,
    city_name TEXT NOT NULL,
    city_code TEXT NOT NULL,
    barangay_name TEXT NOT NULL,
    barangay_code TEXT NOT NULL,
    street_address TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on saved_addresses
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- Policies for saved_addresses
CREATE POLICY "Users can view their own saved addresses"
    ON public.saved_addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved addresses"
    ON public.saved_addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved addresses"
    ON public.saved_addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved addresses"
    ON public.saved_addresses FOR DELETE
    USING (auth.uid() = user_id);


-- 5. Create saved_payments table
CREATE TABLE IF NOT EXISTS public.saved_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_method_token TEXT NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    card_brand TEXT NOT NULL,
    cardholder_name TEXT NOT NULL,
    expiry_date TEXT NOT NULL, -- MM/YY
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on saved_payments
ALTER TABLE public.saved_payments ENABLE ROW LEVEL SECURITY;

-- Policies for saved_payments
CREATE POLICY "Users can view their own saved payments"
    ON public.saved_payments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved payments"
    ON public.saved_payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved payments"
    ON public.saved_payments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved payments"
    ON public.saved_payments FOR DELETE
    USING (auth.uid() = user_id);


-- 6. Trigger to notify admin of new reviews
CREATE OR REPLACE FUNCTION public.fn_notify_admin_of_review()
RETURNS TRIGGER AS $$
DECLARE
    prod_title TEXT;
BEGIN
    SELECT title INTO prod_title FROM public.products WHERE id = NEW.product_id;

    INSERT INTO public.notifications (is_admin_notification, title, message, type, link)
    VALUES (
        true,
        'New Product Review ⭐',
        'A user left a ' || NEW.rating || '-star review on product "' || prod_title || '".',
        'review',
        '/products/' || NEW.product_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER trg_notify_admin_of_review
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_notify_admin_of_review();


-- migrate:down
DROP TRIGGER IF EXISTS trg_notify_admin_of_review ON public.reviews;
DROP FUNCTION IF EXISTS public.fn_notify_admin_of_review();

DROP TABLE IF EXISTS public.saved_payments;
DROP TABLE IF EXISTS public.saved_addresses;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.reviews;

ALTER TABLE public.products DROP COLUMN IF EXISTS sale_price;
