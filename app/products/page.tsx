import { createClient } from "@/utils/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase";

type ProductWithCategory = Tables<"products"> & { categories: { name: string; slug: string } | { name: string; slug: string }[] | null };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sale?: string }>;
}) {
  const supabase = await createClient();
  const categoryParam = (await searchParams).category;
  const saleParam = (await searchParams).sale === "true";

  let query = supabase.from("products").select("*, categories!inner(name, slug)");

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
    products = [...products].sort(() => Math.random() - 0.5);
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col h-full bg-card/10 rounded-none p-3 border hover:border-foreground/50 transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-muted mb-4">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary font-sans text-xs text-muted-foreground">
                      No Image Available
                    </div>
                  )}

                  {product.sale_price && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground hover:bg-destructive border-none rounded-none px-2 py-0.5 text-xs font-semibold shadow-none font-sans">
                      SALE
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col justify-between px-1">
                  <div>
                    <p className="text-xs text-muted-foreground font-sans tracking-wide uppercase">
                      {Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name}
                    </p>
                    <h3 className="font-semibold text-base tracking-tight text-foreground/95 group-hover:text-primary transition-colors font-sans mt-0.5 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>
                  
                  <div className="pt-1">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2 font-sans flex-wrap">
                        <span className="font-bold text-destructive text-lg">₱{product.sale_price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">₱{product.price.toLocaleString()}</span>
                        <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-none font-bold uppercase tracking-wider shrink-0">
                          -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <p className="font-bold font-sans text-foreground/90 text-lg">₱{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {products?.length === 0 && (
            <div className="text-center py-24 text-muted-foreground font-sans">
              No products found.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
