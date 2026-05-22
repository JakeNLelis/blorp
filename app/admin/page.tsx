import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "./actions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CreateProductForm } from "./create-product-form";
import { ProductList } from "./product-list";
import { OrdersFulfillment } from "./orders-fulfillment";
import Link from "next/link";
import { Shield, Package, Truck } from "lucide-react";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Server-side authorization check
  const isAdmin = await checkIsAdmin();
  
  if (!isAdmin) {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "inventory";

  const supabase = await createClient();

  // Fetch categories to populate the dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  // Fetch products with their categories
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  // Fetch all orders with items & product details for fulfillment
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        price,
        quantity,
        products (
          title
        )
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))]">
        <div className="container mx-auto max-w-6xl px-6 py-12 lg:py-20">
          
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-normal text-foreground">Admin Panel</li>
            </ol>
          </nav>

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="size-5 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider font-sans">Administrative Access</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight font-heading md:text-4xl lg:text-5xl">
                Admin Control Panel
              </h1>
              <p className="text-sm text-muted-foreground font-sans max-w-xl">
                Supervise active listings, add new arrivals, dispatch shipped items, and resolve delivery disputes.
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-border/80 gap-6 text-sm font-medium font-sans mb-8">
            <Link
              href="/admin?tab=inventory"
              className={`pb-3 transition-all relative flex items-center gap-2 ${
                tab === "inventory" ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="size-4" />
              Inventory & Products
            </Link>

            <Link
              href="/admin?tab=orders"
              className={`pb-3 transition-all relative flex items-center gap-2 ${
                tab === "orders" ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Truck className="size-4" />
              Fulfillment Console ({orders?.filter(o => o.status === "pending" || o.status === "reported").length || 0})
            </Link>
          </div>

          {/* Core Dashboard Tabs Grid */}
          {tab === "inventory" ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
              {/* Create Product Form */}
              <div className="space-y-6">
                <CreateProductForm categories={categories || []} />
              </div>

              {/* Products Inventory List */}
              <div className="space-y-6">
                <ProductList products={products || []} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <OrdersFulfillment orders={(orders as any) || []} />
            </div>
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
