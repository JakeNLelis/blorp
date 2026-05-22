import { createClient } from "@/utils/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // Handle the nested structure of Supabase joins
  const categoryName = Array.isArray(product.categories)
    ? product.categories[0]?.name
    : (product.categories as any)?.name;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  No image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {categoryName}
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  {product.title}
                </h1>
                <p className="text-2xl font-semibold mt-4">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert font-sans text-muted-foreground">
                <p>{product.description}</p>
              </div>

              <div className="pt-6 border-t">
                <AddToCartButton product={product as any} />
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>✓ Free shipping on orders over $500</p>
                <p>✓ 30-day return policy</p>
                <p>✓ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
