"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { TablesUpdate } from "@/types/supabase";

export async function checkIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("is_admin RPC error:", error);
    return false;
  }
  return !!isAdmin;
}

export type CreateProductState = { success: true } | { error: string } | null;

export async function createProduct(
  prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceRaw = formData.get("price") as string;
  const salePriceRaw = formData.get("salePrice") as string;
  const categoryId = formData.get("categoryId") as string;
  let imageUrl = formData.get("imageUrl") as string;
  const file = formData.get("imageFile") as File | null;
  const stockRaw = formData.get("stock") as string;

  if (!title || !priceRaw || !categoryId) {
    return {
      error:
        "Missing required fields: Title, Price, and Category are required.",
    };
  }

  const price = parseFloat(priceRaw);
  if (isNaN(price) || price < 0) {
    return { error: "Price must be a positive number." };
  }

  let salePrice: number | null = null;
  if (salePriceRaw) {
    salePrice = parseFloat(salePriceRaw);
    if (isNaN(salePrice) || salePrice < 0) {
      return { error: "Sale price must be a positive number if provided." };
    }
    if (salePrice >= price) {
      return {
        error: "Sale price must be strictly less than the regular price.",
      };
    }
  }

  const stock = stockRaw ? parseInt(stockRaw, 10) : 50;
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a non-negative integer." };
  }

  const supabase = await createClient();
  let filePath: string | null = null;
  let uploadSucceeded = false;

  // If a file was selected for upload, try uploading it to the bucket
  if (file && file.size > 0 && file.name) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    filePath = `products/${fileName}`;

    // Try uploading the file to the product-images bucket
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload product image to storage:", uploadError);
      return {
        error: `Failed to upload image to storage: ${uploadError.message}`,
      };
    }

    uploadSucceeded = true;

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const { data: insertedProduct, error } = await supabase
    .from("products")
    .insert({
      title,
      description: description || null,
      price,
      sale_price: salePrice,
      category_id: categoryId,
      image_url: imageUrl || null,
      stock,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create product in database:", error);

    // Clean up the uploaded storage image if database insertion failed
    if (uploadSucceeded && filePath) {
      try {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([filePath]);
        if (removeError) {
          console.error(
            "Failed to clean up uploaded image after database insert failed:",
            removeError,
          );
        }
      } catch (removeException) {
        console.error(
          "Exception during storage cleanup after database insert failed:",
          removeException,
        );
      }
    }

    return { error: `Database error: ${error.message}` };
  }

  // Insert broadcast notification for users
  if (insertedProduct) {
    const link = `/products/${insertedProduct.id}`;
    if (salePrice !== null) {
      await supabase.from("notifications").insert({
        title: "New Sale Discount! 🏷️",
        message: `"${title}" is now on sale for ₱${salePrice.toLocaleString()}!`,
        type: "new_discount",
        link,
        is_admin_notification: false,
      });
    } else {
      await supabase.from("notifications").insert({
        title: "New Arrival! ✨",
        message: `"${title}" has just been added to the store for ₱${price.toLocaleString()}!`,
        type: "new_product",
        link,
        is_admin_notification: false,
      });
    }
  }

  revalidatePath("/products");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateProduct(
  prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceRaw = formData.get("price") as string;
  const salePriceRaw = formData.get("salePrice") as string;
  const categoryId = formData.get("categoryId") as string;
  let imageUrl = formData.get("imageUrl") as string;
  const file = formData.get("imageFile") as File | null;
  const stockRaw = formData.get("stock") as string;

  if (!id || !title || !priceRaw || !categoryId) {
    return {
      error:
        "Missing required fields: ID, Title, Price, and Category are required.",
    };
  }

  const price = parseFloat(priceRaw);
  if (isNaN(price) || price < 0) {
    return { error: "Price must be a positive number." };
  }

  let salePrice: number | null = null;
  if (salePriceRaw) {
    salePrice = parseFloat(salePriceRaw);
    if (isNaN(salePrice) || salePrice < 0) {
      return { error: "Sale price must be a positive number if provided." };
    }
    if (salePrice >= price) {
      return {
        error: "Sale price must be strictly less than the regular price.",
      };
    }
  }

  const stock = stockRaw ? parseInt(stockRaw, 10) : 0;
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a non-negative integer." };
  }

  const supabase = await createClient();
  let filePath: string | null = null;
  let uploadSucceeded = false;

  // If a file was selected for upload, try uploading it to the bucket
  if (file && file.size > 0 && file.name) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    filePath = `products/${fileName}`;

    // Try uploading the file to the product-images bucket
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload product image to storage:", uploadError);
      return {
        error: `Failed to upload image to storage: ${uploadError.message}`,
      };
    }

    uploadSucceeded = true;

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  // Update product details in DB
  const updateData: TablesUpdate<"products"> = {
    title,
    description: description || null,
    price,
    sale_price: salePrice,
    category_id: categoryId,
    stock,
  };

  // Only override image_url if a new image was uploaded or URL was typed
  if (imageUrl) {
    updateData.image_url = imageUrl;
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Failed to update product in database:", error);

    // Clean up the uploaded storage image if database update failed
    if (uploadSucceeded && filePath) {
      try {
        await supabase.storage.from("product-images").remove([filePath]);
      } catch (removeException) {
        console.error(
          "Exception during storage cleanup after database update failed:",
          removeException,
        );
      }
    }

    return { error: `Database error: ${error.message}` };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  const supabase = await createClient();

  // First fetch the product to check if it has a storage-managed image to clean up
  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Failed to delete product:", error);
    return { error: `Database error: ${error.message}` };
  }

  // If the product had a storage-managed image, clean it up from storage
  if (
    product?.image_url &&
    product.image_url.includes("/storage/v1/object/public/product-images/")
  ) {
    try {
      const relativePath = product.image_url.split("/product-images/").pop();
      if (relativePath) {
        await supabase.storage.from("product-images").remove([relativePath]);
      }
    } catch (cleanupError) {
      console.error(
        "Failed to cleanup storage image on product delete:",
        cleanupError,
      );
    }
  }

  revalidatePath("/products");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: "shipped" | "completed",
) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  const supabase = await createClient();

  // Fetch the order to get the user_id
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    console.error("Failed to fetch order for status update:", fetchError);
    return { error: "Order not found." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (updateError) {
    console.error("Failed to update order status:", updateError);
    return { error: updateError.message };
  }

  // Send private user notification
  const title =
    status === "shipped" ? "Order Shipped! 🚚" : "Order Arrived! 📦";
  const message =
    status === "shipped"
      ? `Your order "${orderId}" has been shipped!`
      : `Your order "${orderId}" has arrived! Please confirm receipt or report if nothing has arrived.`;
  const type = status === "shipped" ? "order_shipped" : "order_arrived";

  const { error: notifyError } = await supabase.from("notifications").insert({
    user_id: order.user_id,
    title,
    message,
    type,
    link: "/profile",
    is_admin_notification: false,
  });

  if (notifyError) {
    console.error("Failed to insert user status notification:", notifyError);
  }

  revalidatePath("/admin");
  revalidatePath("/profile");
  return { success: true };
}
