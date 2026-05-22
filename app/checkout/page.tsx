import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  // Fetch saved addresses
  const { data: addresses } = await supabase
    .from("saved_addresses")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch saved payments
  const { data: payments } = await supabase
    .from("saved_payments")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12 lg:py-20 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 font-heading">
            Secure Checkout
          </h1>
          <p className="text-sm text-muted-foreground font-sans mb-10">
            Select saved shipping addresses or credit card details to complete your order automatically.
          </p>

          <CheckoutForm
            savedAddresses={addresses || []}
            savedPayments={payments || []}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
