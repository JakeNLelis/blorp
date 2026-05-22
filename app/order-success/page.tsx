"use client";

import { useEffect, Suspense } from "react";
import { useCartStore } from "@/store/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      clearCart();
    }
  }, [clearCart, orderId]);

  return (
    <div className="container mx-auto px-6 py-24 max-w-md text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Order Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been placed successfully.
        {orderId && (
          <span className="block mt-2 text-sm">
            Order ID: <span className="font-mono text-foreground">{orderId}</span>
          </span>
        )}
      </p>
      <Button asChild className="h-12 rounded-full w-full">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1 flex items-center">
        <Suspense fallback={<div className="container mx-auto px-6 py-24 text-center">Loading...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </div>
      <SiteFooter />
    </div>
  );
}
