"use client";

import { useCartStore } from "@/store/cart";
import { useStore } from "@/components/cart-sheet";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { placeOrder } from "./actions";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const items = useStore(useCartStore, (state) => state.items) ?? [];
  const totalPrice = useCartStore((state) => state.totalPrice);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    const result = await placeOrder(formData, items);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-8">Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Your cart is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Shipping Form */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium">Shipping Information</h2>
                <form action={handleSubmit} className="space-y-4" id="checkout-form">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">City</label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="postalCode" className="text-sm font-medium">Postal Code</label>
                      <Input id="postalCode" name="postalCode" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium">Country</label>
                    <Input id="country" name="country" required />
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full mt-6 text-lg"
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Place Order"}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/50 p-6 rounded-xl h-fit">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted flex-shrink-0">
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
                          <h4 className="font-medium line-clamp-1 text-sm">{item.product.title}</h4>
                          <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
