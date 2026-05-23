import { createClient } from "@/utils/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase";
import { InfiniteScrollProducts } from "@/components/infinite-scroll-products";

type ProductWithCategory = Tables<"products"> & { categories: { name: string; slug: string } | { name: string; slug: string }[] | null };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sale?: string }>;
}) {
  const supabase = await createClient();
  const categoryParam = (await searchParams).category;
  const saleParam = (await searchParams).sale === "true";

  let query = supabase
    .from("products")
    .select("*, categories!inner(name, slug)")
    .order("created_at", { ascending: false })
    .range(0, 19);

  if (categoryParam) {
    query = query.eq("categories.slug", categoryParam);
  }

  if (saleParam) {
    query = query.not("sale_price", "is", null);
  }

  const { data: productsData, error: productsError } = await query.returns<ProductWithCategory[]>();
  if (productsError) {
    console.error("Error fetching products:", productsError.message || productsError);
    return (
      <div className="flex min-h-dvh flex-col bg-background text-foreground animate-fade-in">
        <SiteHeader />
        <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1 container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold mb-4 font-heading">Error loading products</h1>
          <p className="text-muted-foreground font-sans">Please try again later.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }
  
  // Arrange products randomly if in Sale section
  let products = productsData ?? [];
  if (saleParam) {
    // Deterministic seeded shuffle based on product ID to prevent server/client hydration mismatch
    const getSeededValue = (id: string) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };
    products = [...products].sort((a, b) => getSeededValue(a.id) - getSeededValue(b.id));
  }

  const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError.message || categoriesError);
  }
  const categories = categoriesData || [];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-8 font-heading">
            {saleParam ? "Exclusive Sale & Offers" : "Our Collection"}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8 font-sans items-center">
            <Link href="/products">
              <Badge variant={!categoryParam && !saleParam ? "default" : "outline"} className="cursor-pointer rounded-none px-4 py-1.5 transition-all">
                All Products
              </Badge>
            </Link>
            
            <Link href="/products?sale=true">
              <Badge 
                variant={saleParam ? "default" : "outline"} 
                className={`cursor-pointer rounded-none px-4 py-1.5 transition-all ${
                  saleParam 
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                    : "border-destructive/30 text-destructive hover:bg-destructive/5"
                }`}
              >
                🏷️ On Sale
              </Badge>
            </Link>

            <span className="h-4 w-px bg-border mx-2" />

            {categories?.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}${saleParam ? "&sale=true" : ""}`}>
                <Badge variant={categoryParam === cat.slug ? "default" : "outline"} className="cursor-pointer rounded-none px-4 py-1.5 transition-all">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          <InfiniteScrollProducts
            initialProducts={products}
            categoryParam={categoryParam}
            saleParam={saleParam}
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
