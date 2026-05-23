"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

type ProductWithCategory = Tables<"products"> & {
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

export async function fetchPaginatedProducts({
  category,
  sale,
  offset = 0,
  limit = 20,
}: {
  category?: string;
  sale?: boolean;
  offset?: number;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const safeOffset = Math.max(0, Math.floor(offset || 0));
  const MAX_LIMIT = 100;
  const safeLimit = Math.min(Math.max(1, Math.floor(limit || 20)), MAX_LIMIT);
  const rangeStart = safeOffset;
  const rangeEnd = safeOffset + safeLimit - 1;

  let query = supabase
    .from("products")
    .select("*, categories!inner(name, slug)")
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  if (category) {
    query = query.eq("categories.slug", category);
  }

  if (sale) {
    query = query.not("sale_price", "is", null);
  }

  const { data, error } = await query.returns<ProductWithCategory[]>();

  if (error) {
    console.error("Error in fetchPaginatedProducts:", error.message || error);
    return [];
  }

  return data || [];
}
