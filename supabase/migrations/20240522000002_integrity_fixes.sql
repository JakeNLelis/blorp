-- migrate:up

-- 1. Add non-negative check constraints to products, orders, and order_items
ALTER TABLE public.products ADD CONSTRAINT products_price_check CHECK (price >= 0);
ALTER TABLE public.orders ADD CONSTRAINT orders_total_check CHECK (total >= 0);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_price_check CHECK (price >= 0);

-- 2. Create B-tree indexes for optimization and faster joins
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- 3. Create or replace the fn_set_order_item_price_and_total function and trigger
CREATE OR REPLACE FUNCTION public.fn_set_order_item_price_and_total()
RETURNS TRIGGER AS $$
DECLARE
    v_product_price DECIMAL(10, 2);
BEGIN
    -- Pin the search_path to public and pg_temp for security under SECURITY DEFINER
    SET search_path = public, pg_temp;

    -- Fetch the correct product price
    SELECT COALESCE(sale_price, price) INTO v_product_price
    FROM public.products
    WHERE id = NEW.product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Override the client-supplied price
    NEW.price := v_product_price;

    -- Update the total in the parent order
    UPDATE public.orders
    SET total = COALESCE((
        SELECT SUM(price * quantity)
        FROM public.order_items
        WHERE order_id = NEW.order_id
          AND id != NEW.id -- exclude the current one as it's not inserted yet
    ), 0) + (NEW.price * NEW.quantity)
    WHERE id = NEW.order_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_set_order_item_price_and_total
    BEFORE INSERT ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_set_order_item_price_and_total();

-- 4. Enable users to update their own orders policy
CREATE POLICY "Users can update their own orders."
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Create create_order_with_items function for atomic single transaction orders
CREATE OR REPLACE FUNCTION public.create_order_with_items(
    "order" JSONB,
    items JSONB
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order public.orders;
    v_item RECORD;
BEGIN
    -- Pin the search_path to public and pg_temp for security under SECURITY DEFINER
    SET search_path = public, pg_temp;

    -- Insert the order and get the full row
    INSERT INTO public.orders (
        user_id,
        status,
        total,
        shipping_info
    )
    VALUES (
        (("order"->>'user_id'))::UUID,
        COALESCE("order"->>'status', 'pending'),
        COALESCE(("order"->>'total')::NUMERIC, 0),
        ("order"->'shipping_info')
    )
    RETURNING * INTO v_order;

    -- Insert the order items
    FOR v_item IN
        SELECT * FROM jsonb_to_recordset(items) AS x(
            product_id UUID,
            quantity INTEGER,
            price DECIMAL(10, 2)
        )
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES (
            v_order.id,
            v_item.product_id,
            v_item.quantity,
            v_item.price
        );
    END LOOP;

    -- Re-select the order row to fetch trigger-computed total post order_items insert
    SELECT * INTO v_order FROM public.orders WHERE id = v_order.id;

    RETURN v_order;
END;
$$;


-- migrate:down

-- 1. Drop functions and triggers
DROP FUNCTION IF EXISTS public.create_order_with_items(JSONB, JSONB) CASCADE;
DROP TRIGGER IF EXISTS trg_set_order_item_price_and_total ON public.order_items CASCADE;
DROP FUNCTION IF EXISTS public.fn_set_order_item_price_and_total() CASCADE;

-- 2. Drop policy
DROP POLICY IF EXISTS "Users can update their own orders." ON public.orders;

-- 3. Drop indexes
DROP INDEX IF EXISTS public.idx_products_category_id;
DROP INDEX IF EXISTS public.idx_orders_user_id;
DROP INDEX IF EXISTS public.idx_order_items_order_id;
DROP INDEX IF EXISTS public.idx_order_items_product_id;

-- 4. Drop check constraints
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_price_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_total_check;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_price_check;
