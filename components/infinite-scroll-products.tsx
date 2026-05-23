"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase";
import { fetchPaginatedProducts } from "@/app/products/actions";
import { Loader2 } from "lucide-react";

type ProductWithCategory = Tables<"products"> & {
  categories:
    | { name: string; slug: string }
    | { name: string; slug: string }[]
    | null;
};

type InfiniteScrollProductsProps = {
  initialProducts: ProductWithCategory[];
  categoryParam?: string;
  saleParam?: boolean;
};

export function InfiniteScrollProducts({
  initialProducts,
  categoryParam,
  saleParam = false,
}: InfiniteScrollProductsProps) {
  const [products, setProducts] =
    useState<ProductWithCategory[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length >= 20);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync state when initial products change (e.g. user toggles category filter)
  useEffect(() => {
    setProducts(initialProducts);
    setOffset(initialProducts.length);
    setHasMore(initialProducts.length >= 20);
    isFetchingRef.current = false;
  }, [initialProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingRef.current) {
          isFetchingRef.current = true;
          setLoading(true);
          try {
            const nextProducts = await fetchPaginatedProducts({
              category: categoryParam,
              sale: saleParam,
              offset: offset,
              limit: 20,
            });

            if (nextProducts.length > 0) {
              setProducts((prev) => [...prev, ...nextProducts]);
              setOffset((prev) => prev + nextProducts.length);
              setHasMore(nextProducts.length >= 20);
            } else {
              setHasMore(false);
            }
          } catch (err) {
            console.error("Failed to load more products:", err);
          } finally {
            setLoading(false);
            isFetchingRef.current = false;
          }
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [offset, hasMore, loading, categoryParam, saleParam]);

  return (
    <div className="space-y-12">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          const categoryName = Array.isArray(product.categories)
            ? product.categories[0]?.name
            : product.categories?.name;
          const activePrice =
            product.sale_price !== null ? product.sale_price : product.price;

          return (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group flex flex-col h-full bg-card/10 rounded-none p-3 border hover:border-foreground/50 transition-all duration-300"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-none bg-muted mb-4">
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
                    {categoryName}
                  </p>
                  <h3 className="font-semibold text-base tracking-tight text-foreground/95 group-hover:text-primary transition-colors font-sans mt-0.5 line-clamp-1">
                    {product.title}
                  </h3>
                </div>

                <div className="pt-1">
                  {product.sale_price ? (
                    <div className="flex items-center gap-2 font-sans flex-wrap">
                      <span className="font-bold text-destructive text-lg">
                        ₱{Number(product.sale_price).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₱{Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-none font-bold uppercase tracking-wider shrink-0">
                        -
                        {Math.round(
                          ((product.price - product.sale_price) /
                            product.price) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  ) : (
                    <p className="font-bold font-sans text-foreground/90 text-lg">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-24 text-muted-foreground font-sans">
          No products found.
        </div>
      )}

      {/* Sentinel Element & Loading Skeletons */}
      <div
        ref={observerTarget}
        className="w-full pt-4 flex flex-col items-center"
      >
        {loading && (
          <div className="space-y-8 w-full">
            {/* Pulsing loading skeletons to match grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex flex-col h-full bg-card/10 rounded-none p-3 border border-border"
                >
                  <div className="aspect-4/5 bg-muted mb-4 rounded-none" />
                  <div className="space-y-3 flex-1 flex flex-col justify-between px-1">
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded-none w-1/3" />
                      <div className="h-4 bg-muted rounded-none w-3/4" />
                    </div>
                    <div className="h-6 bg-muted rounded-none w-1/2 mt-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium py-4">
              <Loader2 className="size-4 animate-spin text-primary" />
              Loading more arrivals...
            </div>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-xs text-muted-foreground/70 uppercase tracking-widest font-semibold py-8 border-t w-full text-center">
            ✓ You have explored the entire collection
          </div>
        )}
      </div>
    </div>
  );
}
