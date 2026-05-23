-- migrate:up

-- 1. Add stock column to products table with check constraint to prevent negative stock
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 50 CHECK (stock >= 0);

-- 2. Create function to automatically deduct stock on new order items
CREATE OR REPLACE FUNCTION public.fn_deduct_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Create trigger on order_items table
DROP TRIGGER IF EXISTS trg_deduct_product_stock ON public.order_items;

CREATE TRIGGER trg_deduct_product_stock
    AFTER INSERT ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_deduct_product_stock();


-- migrate:down

DROP TRIGGER IF EXISTS trg_deduct_product_stock ON public.order_items CASCADE;
DROP FUNCTION IF EXISTS public.fn_deduct_product_stock() CASCADE;
ALTER TABLE public.products DROP COLUMN IF EXISTS stock;
