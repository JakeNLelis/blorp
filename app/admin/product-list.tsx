"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteProduct, updateProduct, CreateProductState } from "./actions";
import { CreateProductForm } from "./create-product-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Search,
  PackageOpen,
  Edit,
  Package,
  Upload,
  Link as LinkIcon,
  Tag,
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category_id: string | null;
  categories: { name: string } | { name: string }[] | null;
  stock: number;
};

type ProductListProps = {
  products: Product[];
  categories: CategoryItem[];
};

export function ProductList({ products, categories }: ProductListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const result = await deleteProduct(id);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setImageUrl(product.image_url || "");
    setPreviewUrl(product.image_url || null);
    setImageType(
      product.image_url &&
        product.image_url.startsWith("http") &&
        !product.image_url.includes("/storage/v1/object/public/")
        ? "url"
        : "file",
    );
    setImageFile(null);
    setEditError(null);
    setEditSuccess(false);
  };

  const closeEditModal = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setEditingProduct(null);
    setPreviewUrl(null);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("id", editingProduct.id);

    if (imageType === "file" && imageFile) {
      formData.set("imageUrl", "");
      formData.set("imageFile", imageFile);
    } else {
      formData.set("imageFile", new File([], ""));
      formData.set("imageUrl", imageUrl);
    }

    try {
      const result = await updateProduct(null, formData);
      if (result && "error" in result) {
        setEditError(result.error);
      } else if (result && "success" in result) {
        setEditSuccess(true);
        setTimeout(() => {
          closeEditModal();
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setEditError("An unexpected error occurred. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const getCategoryName = (product: Product) => {
    if (Array.isArray(product.categories)) {
      return product.categories[0]?.name || "Uncategorized";
    }
    return product.categories?.name || "Uncategorized";
  };

  return (
    <div className="rounded-none border bg-card/10 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-medium tracking-tight font-heading">
            Product Inventory
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            Total of {products.length} products listed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-max shrink-0 sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-sans border-border rounded-md h-10 bg-background/50"
            />
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="rounded-md h-10 px-4 font-sans font-semibold flex items-center gap-2 shrink-0 cursor-pointer text-sm"
          >
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-none border border-destructive/20 bg-destructive/5 p-4 text-destructive font-sans text-sm">
          {error}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="rounded-none border border-dashed p-12 text-center space-y-3">
          <div className="mx-auto flex size-10 items-center justify-center rounded-none bg-muted border text-muted-foreground">
            <PackageOpen className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium font-heading">
              No products found
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              {search
                ? "Try adjusting your search terms."
                : "Start by adding a new product above."}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-border text-left font-sans text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <th scope="col" className="py-3 px-2">
                    Info
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Stock
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="py-4 px-2 flex items-center gap-3 min-w-50">
                      <div className="relative aspect-square size-12 shrink-0 overflow-hidden rounded-none bg-muted border">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary text-[9px] text-muted-foreground font-medium">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate block text-sm">
                          {product.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate block max-w-45">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                      <span className="inline-flex items-center rounded-none bg-muted border border-border px-2.5 py-0.5 text-xs font-normal">
                        {getCategoryName(product)}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-foreground">
                      {product.sale_price !== null ? (
                        <div className="space-y-0.5">
                          <span className="text-destructive font-bold">
                            ₱{Number(product.sale_price).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground line-through block">
                            ₱{Number(product.price).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span>₱{Number(product.price).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                      {product.stock <= 5 ? (
                        <span className="inline-flex items-center text-xs font-semibold text-amber-600">
                          ⚠️ Only {product.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-foreground">
                          {product.stock} pcs
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                        disabled={deletingId !== null}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 size-8 rounded-md border border-transparent hover:border-primary/20 transition-all mr-2"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId !== null}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8 rounded-md border border-transparent hover:border-destructive/20 transition-all"
                        aria-label={`Delete ${product.title}`}
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="size-4 animate-spin text-destructive" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background text-foreground border rounded-none p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 relative font-sans">
            <button
              onClick={closeEditModal}
              className="absolute right-4 top-4 p-1.5 hover:scale-105 hover:bg-muted transition-all rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-medium tracking-tight font-heading flex items-center gap-2">
                <Edit className="size-5 text-primary" />
                Edit Product
              </h3>
              <p className="text-xs text-muted-foreground">
                Update details for listing &quot;{editingProduct.title}&quot; (ID:{" "}
                {editingProduct.id.substring(0, 8)}...).
              </p>
            </div>

            {editSuccess && (
              <div className="flex items-start gap-3 rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600 text-sm animate-fade-in">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-semibold">Update Succeeded</p>
                  <p className="text-xs text-emerald-600/80 mt-0.5">
                    Product details have been successfully modified.
                  </p>
                </div>
              </div>
            )}

            {editError && (
              <div className="flex items-start gap-3 rounded-none border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm animate-fade-in">
                <AlertCircle className="size-5 shrink-0 text-destructive/80" />
                <div>
                  <p className="font-semibold">Update Failed</p>
                  <p className="text-xs text-destructive/80 mt-0.5">
                    {editError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="edit-title">
                  Product Title
                </label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingProduct.title}
                  required
                  placeholder="e.g. The Sapphire Crossbody"
                  className="rounded-md"
                  disabled={editLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="edit-description"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingProduct.description || ""}
                  rows={3}
                  placeholder="Craft details, textures, and measurements..."
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={editLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium flex items-center gap-2"
                    htmlFor="edit-price"
                  >
                    <span className="text-muted-foreground font-semibold">
                      ₱
                    </span>
                    Price (PHP)
                  </label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingProduct.price}
                    required
                    className="rounded-md"
                    disabled={editLoading}
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium flex items-center gap-2"
                    htmlFor="edit-salePrice"
                  >
                    <Tag className="size-4 text-muted-foreground" />
                    Sale Price (PHP)
                  </label>
                  <Input
                    id="edit-salePrice"
                    name="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={
                      editingProduct.sale_price !== null
                        ? editingProduct.sale_price
                        : ""
                    }
                    placeholder="Optional discount"
                    className="rounded-md"
                    disabled={editLoading}
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium flex items-center gap-2"
                    htmlFor="edit-stock"
                  >
                    <Package className="size-4 text-muted-foreground" />
                    Stock Count
                  </label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct.stock}
                    required
                    className="rounded-md"
                    disabled={editLoading}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium flex items-center gap-2"
                    htmlFor="edit-categoryId"
                  >
                    <Tag className="size-4 text-muted-foreground" />
                    Category
                  </label>
                  <select
                    id="edit-categoryId"
                    name="categoryId"
                    defaultValue={editingProduct.category_id || ""}
                    required
                    disabled={editLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Input Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Product Image</label>
                  <div className="flex bg-muted/60 p-0.5 rounded-md text-xs">
                    <button
                      type="button"
                      onClick={() => setImageType("file")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        imageType === "file"
                          ? "bg-background text-foreground shadow-sm font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageType("url")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        imageType === "url"
                          ? "bg-background text-foreground shadow-sm font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      External URL
                    </button>
                  </div>
                </div>

                {imageType === "file" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed rounded-none cursor-pointer hover:bg-muted/10 transition-colors border-border relative">
                        <div className="flex flex-col items-center justify-center pt-3 pb-4 text-center px-4">
                          <Upload className="size-6 text-muted-foreground mb-1.5" />
                          <p className="text-xs font-semibold text-muted-foreground">
                            Click to upload replacement file
                          </p>
                          <p className="text-[10px] text-muted-foreground/70">
                            PNG, JPG, JPEG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          id="edit-imageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={editLoading}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      className="text-xs text-muted-foreground flex items-center gap-1.5"
                      htmlFor="edit-imageUrl"
                    >
                      <LinkIcon className="size-3 text-muted-foreground" />
                      Image URL Address
                    </label>
                    <Input
                      id="edit-imageUrl"
                      name="imageUrl"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      type="url"
                      placeholder="https://example.com/product-image.jpg"
                      className="rounded-md"
                      disabled={editLoading}
                    />
                  </div>
                )}

                {/* Image Preview Panel */}
                {previewUrl && (
                  <div className="mt-3 p-3 bg-muted/10 border flex gap-4 items-center rounded-none">
                    <div className="relative size-16 shrink-0 overflow-hidden bg-muted border rounded-none">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover size-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-foreground">
                        Selected Image Preview
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {imageFile
                          ? `Local upload: ${imageFile.name}`
                          : "Remote URL source"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                  disabled={editLoading}
                  className="rounded-md h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading || editSuccess}
                  className="rounded-md h-10 px-6 font-semibold"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Saving changes...
                    </>
                  ) : (
                    "Save Product Details"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background text-foreground border rounded-none p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 relative font-sans">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:scale-105 hover:bg-muted transition-all rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-medium tracking-tight font-heading flex items-center gap-2">
                <Plus className="size-5 text-primary" />
                Add New Product
              </h3>
              <p className="text-xs text-muted-foreground">
                Create a new active listing in Blorp Atelier's catalog.
              </p>
            </div>

            <CreateProductForm
              categories={categories}
              onClose={() => setIsAddOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
