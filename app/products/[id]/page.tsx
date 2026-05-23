import { createClient } from "@/utils/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./add-to-cart-button";
import { Tables } from "@/types/supabase";
import { Star } from "lucide-react";
import { ReviewForm } from "./review-form";

type ProductWithCategory = Tables<"products"> & {
  categories: { name: string } | { name: string }[] | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  const product: Tables<"products"> = {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    sale_price:
      data.sale_price !== null && data.sale_price !== undefined
        ? Number(data.sale_price)
        : null,
    image_url: data.image_url,
    category_id: data.category_id,
    created_at: data.created_at,
    stock: data.stock,
  };

  const categoryName = Array.isArray(data.categories)
    ? data.categories[0]?.name
    : data.categories?.name;

  // Fetch reviews for this product
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: false });
  const reviews = reviewsData || [];

  // Calculate review averages
  const reviewsCount = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const ratingAvg =
    reviewsCount > 0 ? (ratingSum / reviewsCount).toFixed(1) : null;

  // Determine if user can write a review (authenticated + bought in a completed order + not reviewed yet)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let canReview = false;
  if (user) {
    const { data: purchaseHistory } = await supabase
      .from("orders")
      .select("id, status, order_items!inner(product_id)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("order_items.product_id", id);

    canReview = !!purchaseHistory && purchaseHistory.length > 0;

    if (canReview) {
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existingReview) {
        canReview = false;
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <div className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))] flex-1">
        <div className="container mx-auto px-6 py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image */}
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-none bg-muted border border-muted/50">
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
                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground font-sans text-xs">
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                  {categoryName}
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-heading">
                  {product.title}
                </h1>

                {/* Star rating summary near title */}
                {ratingAvg && (
                  <div className="flex items-center gap-2 pt-1 font-sans">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-4 ${s <= Math.round(Number(ratingAvg)) ? "fill-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{ratingAvg}</span>
                    <span className="text-xs text-muted-foreground">
                      ({reviewsCount}{" "}
                      {reviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}

                {/* Display price in PHP with discount support */}
                <div className="pt-2">
                  {product.sale_price !== null &&
                  product.sale_price !== undefined ? (
                    <div className="flex flex-col gap-2 font-sans">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-destructive">
                          ₱{product.sale_price.toLocaleString()}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                          ₱{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs bg-destructive/10 text-destructive px-2.5 py-0.5 rounded-none font-bold uppercase tracking-wider">
                          -
                          {product.price !== 0 &&
                          product.price !== null &&
                          product.price !== undefined
                            ? Math.round(
                                ((product.price - product.sale_price) /
                                  product.price) *
                                  100,
                              )
                            : 0}
                          % OFF
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold font-sans">
                      ₱{product.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Stock Level Warning */}
                <div className="pt-1 font-sans text-xs">
                  {product.stock === 0 ? (
                    <span className="text-destructive font-bold uppercase tracking-wider">
                      Out of Stock ❌
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="text-amber-600 font-semibold">
                      ⚠️ Only {product.stock} left in stock - order soon!
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium">
                      ✓ {product.stock} items available in stock
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert font-sans text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="pt-6 border-t">
                <AddToCartButton product={product} />
              </div>

              <div className="text-xs text-muted-foreground space-y-2.5 font-sans pt-2">
                <p>✓ Free shipping on orders over ₱5,000</p>
                <p>✓ 30-day return policy for manufacturing defects</p>
                <p>✓ Secure mockup payment validation</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-20 border-t pt-16 font-sans">
            <h2 className="text-3xl font-semibold tracking-tight font-heading mb-10">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Ratings Summary & Form */}
              <div className="space-y-6">
                <div className="bg-card/40 rounded-none border p-6 text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-6xl font-extrabold tracking-tight">
                    {ratingAvg || "0.0"}
                  </p>
                  <div className="flex items-center justify-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-5 ${s <= Math.round(Number(ratingAvg || 0)) ? "fill-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {reviewsCount}{" "}
                    {reviewsCount === 1
                      ? "verified review"
                      : "verified reviews"}
                  </p>
                </div>

                {canReview && <ReviewForm productId={product.id} />}
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-16 border border-dashed rounded-none text-muted-foreground bg-card/10">
                    <p className="font-semibold text-base">No reviews yet</p>
                    <p className="text-xs mt-1 text-muted-foreground/80">
                      Purchased this item? Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const buyerName =
                      "Verified Buyer #" +
                      review.user_id.substring(0, 4).toUpperCase();
                    return (
                      <div
                        key={review.id}
                        className="p-6 rounded-none border bg-card/15 space-y-3 hover:border-foreground/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-sm flex items-center gap-2">
                              {buyerName}
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-none font-bold">
                                Verified Purchase
                              </span>
                            </p>
                            <div className="flex items-center text-amber-400 mt-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`size-3.5 ${s <= review.rating ? "fill-amber-400" : "text-muted-foreground/30"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
