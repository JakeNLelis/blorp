"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import { useCartStore } from "@/store/cart";

export function AddToCartButton({ product }: { product: Tables<"products"> }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (product.stock === 0) return;

    addItem(product, quantity);
  };

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrease = () => {
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="flex gap-4 items-center">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center border border-border h-14 rounded-md bg-background overflow-hidden select-none shrink-0 font-sans">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="h-full px-3 hover:bg-muted border-none rounded-none text-muted-foreground hover:text-foreground"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center font-bold text-sm text-foreground">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="h-full px-3 hover:bg-muted border-none rounded-none text-muted-foreground hover:text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}

      {/* Action Button */}
      <Button
        size="lg"
        disabled={isOutOfStock}
        className="flex-1 h-14 text-base font-semibold rounded-md flex items-center justify-center gap-2"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="size-5" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
