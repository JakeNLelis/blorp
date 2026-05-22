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
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const categoryParam = (await searchParams).category;

  let query = supabase.from("products").select("*, categories!inner(name, slug)");

  if (categoryParam) {
    query = query.eq("categories.slug", categoryParam);
  }

  const { data: productsData, error: productsError } = await query;
  if (productsError) {
    console.error("Error fetching products:", productsError);
    return (
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <SiteHeader />
        <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1 container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold mb-4">Error loading products</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }
  const products = (productsData || []) as unknown as ProductWithCategory[];

  const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
  }
  const categories = categoriesData || [];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-8">
            Our Collection
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/products">
              <Badge variant={!categoryParam ? "default" : "outline"} className="cursor-pointer">
                All
              </Badge>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <Badge variant={categoryParam === cat.slug ? "default" : "outline"} className="cursor-pointer">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted mb-4">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name}
                  </p>
                  <h3 className="font-medium text-lg tracking-tight group-hover:underline">
                    {product.title}
                  </h3>
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          {products?.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
