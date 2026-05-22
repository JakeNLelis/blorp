"use client";

import * as React from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

// A hook to safely use Zustand stores with hydration
export function useStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) {
  const result = store(callback) as F;
  const [data, setData] = React.useState<F>();

  React.useEffect(() => {
    // A small timeout avoids the immediate synchronous setState in effect
    const timeout = setTimeout(() => {
      setData(result);
    }, 0);
    return () => clearTimeout(timeout);
  }, [result]);

  return data;
}

export function CartSheet() {
  const items = useStore(useCartStore, (state) => state.items) ?? [];
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  // Hydration state check to avoid mismatch between server and client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // A small timeout avoids the immediate synchronous setState in effect
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return (
      <div className="relative size-fit">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative size-fit cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <ShoppingCart className="size-4" />
          </Button>
          {totalItems() > 0 && (
            <Badge className="absolute right-0 top-0 h-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 px-2 py-0.5 text-[0.625rem] font-medium text-foreground">
              {totalItems()}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Your Cart ({totalItems()})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <SheetTrigger asChild>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-24 w-20 overflow-hidden rounded-md bg-muted flex-shrink-0">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium leading-none line-clamp-1">{item.product.title}</h4>
                          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Button asChild className="w-full h-12 rounded-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
