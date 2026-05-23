import { createClient } from "@/utils/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import {
  User,
  Calendar,
  Shield,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { ProfileTabs } from "./profile-tabs";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "user";

  // Fetch order history
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      total,
      order_items (
        id,
        price,
        quantity,
        products (
          id,
          title,
          image_url
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved addresses
  const { data: addresses } = await supabase
    .from("saved_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved payments
  const { data: payments } = await supabase
    .from("saved_payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))]">
        <div className="container mx-auto max-w-6xl px-6 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-normal text-foreground">My Profile</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
            {/* Left Column: User Card */}
            <div className="space-y-6">
              <div className="rounded-none border bg-card/50 p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="flex size-16 items-center justify-center rounded-none bg-primary/5 text-primary border border-primary/20">
                    <User className="size-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium tracking-tight font-heading break-all max-w-60">
                      {user.email}
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                      Customer Account
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4 text-sm font-sans">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="size-4 shrink-0 text-foreground/70" />
                    <span className="text-foreground font-medium uppercase tracking-wide text-xs">
                      Role:{" "}
                      <span
                        className={`ml-1 px-2.5 py-0.5 rounded-none text-[10px] font-semibold border ${role === "admin" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}
                      >
                        {role}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="size-4 shrink-0 text-foreground/70" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  {role === "admin" && (
                    <Button
                      className="w-full rounded-md font-sans justify-between"
                      asChild
                    >
                      <Link href="/admin">
                        Admin Control Panel
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  )}
                  <form action={signOut} className="w-full">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full rounded-md font-sans border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: Profile Dashboard */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight font-heading md:text-4xl">
                  My Dashboard
                </h1>
                <p className="text-sm text-muted-foreground font-sans">
                  Manage your order history, shipping addresses, and saved
                  payment details.
                </p>
              </div>

              {ordersError ? (
                <div className="rounded-none border border-destructive/20 bg-destructive/5 p-6 text-center">
                  <p className="text-sm font-sans text-destructive">
                    Failed to load order history. Please try again later.
                  </p>
                </div>
              ) : (
                <ProfileTabs
                  orders={ordersData || []}
                  addresses={addresses || []}
                  payments={payments || []}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
