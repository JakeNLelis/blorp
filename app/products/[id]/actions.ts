"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required to submit reviews." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5 stars." };
  }

  // Double check buying history here in backend for security
  const { data: purchaseHistory, error: purchaseError } = await supabase
    .from("orders")
    .select("id, status, order_items!inner(product_id)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .eq("order_items.product_id", productId);

  if (purchaseError || !purchaseHistory || purchaseHistory.length === 0) {
    return { error: "Only verified buyers can leave reviews." };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment: comment || null,
  });

  if (error) {
    console.error("Failed to submit review:", error);
    if (error.code === "23505") {
      return { error: "You have already reviewed this product." };
    }
    return { error: "An internal error occurred while submitting your review." };
  }

  revalidatePath(`/products/${productId}`);
  return { success: true };
}
