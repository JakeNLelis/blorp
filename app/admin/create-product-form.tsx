"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct } from "./actions";
import { Loader2, Plus, Upload, Link as LinkIcon, DollarSign, Tag, FileText, CheckCircle2, AlertCircle } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CreateProductFormProps = {
  categories: Category[];
};

export function CreateProductForm({ categories }: CreateProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Image type selection: 'file' or 'url'
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    // Clear out the alternative image input if it wasn't selected to prevent mixed state
    if (imageType === "file" && imageFile) {
      formData.set("imageUrl", "");
      formData.set("imageFile", imageFile);
    } else {
      formData.set("imageFile", new File([], ""));
      formData.set("imageUrl", imageUrl);
    }

    try {
      const result = await createProduct(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setImageFile(null);
        setPreviewUrl(null);
        setImageUrl("");
        // Reset form
        (e.target as HTMLFormElement).reset();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-none border bg-card/10 p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-medium tracking-tight font-heading">Add New Product</h3>
        <p className="text-sm text-muted-foreground font-sans">
          Upload products directly to the store inventory.
        </p>
      </div>

      {success && (
        <div className="flex items-start gap-3 rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600 font-sans text-sm">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold">Product Added Successfully</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">
              The new product is now active in the catalog and storefront.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-none border border-destructive/20 bg-destructive/5 p-4 text-destructive font-sans text-sm">
          <AlertCircle className="size-5 shrink-0 text-destructive/80" />
          <div>
            <p className="font-semibold">Action Failed</p>
            <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 font-sans">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2" htmlFor="title">
            <FileText className="size-4 text-muted-foreground" />
            Product Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Luxurious Leather Tote Bag"
            required
            className="rounded-md"
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2" htmlFor="description">
            <FileText className="size-4 text-muted-foreground" />
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe the product details, materials, dimensions..."
            disabled={loading}
          />
        </div>

        {/* Price & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" htmlFor="price">
              <span className="text-muted-foreground font-semibold">₱</span>
              Price (PHP)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 2999.00"
              required
              className="rounded-md"
              disabled={loading}
            />
          </div>

          {/* Sale Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" htmlFor="salePrice">
              <Tag className="size-4 text-muted-foreground" />
              Sale Price (PHP)
            </label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="Optional discount"
              className="rounded-md"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" htmlFor="categoryId">
              <Tag className="size-4 text-muted-foreground" />
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              disabled={loading}
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

        {/* Image upload choice */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Product Image</label>
            <div className="flex bg-muted/60 p-0.5 rounded-md text-xs">
              <button
                type="button"
                onClick={() => {
                  setImageType("file");
                  setError(null);
                }}
                className={`px-3 py-1 rounded-md transition-all ${
                  imageType === "file" ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageType("url");
                  setError(null);
                }}
                className={`px-3 py-1 rounded-md transition-all ${
                  imageType === "url" ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground"
                }`}
              >
                External URL
              </button>
            </div>
          </div>

          {imageType === "file" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border border-dashed rounded-none cursor-pointer hover:bg-muted/10 transition-colors border-border relative">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <Upload className="size-8 text-muted-foreground mb-2" />
                    <p className="text-xs font-semibold text-muted-foreground">Click to upload image</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">PNG, JPG, JPEG, GIF up to 5MB</p>
                  </div>
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </label>
              </div>

              {previewUrl && (
                <div className="relative aspect-video w-full max-w-[200px] mx-auto rounded-none overflow-hidden border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-1.5 right-1.5 size-6 rounded-md bg-black/60 text-white flex items-center justify-center hover:bg-black/80 text-xs transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value || null);
                  }}
                  className="pl-9 rounded-md"
                  disabled={loading}
                />
              </div>

              {imageUrl && (
                <div className="relative aspect-video w-full max-w-[200px] mx-auto rounded-none overflow-hidden border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="URL Preview"
                    className="object-cover w-full h-full"
                    onError={() => setError("Failed to load image preview from URL. Make sure it is a valid direct link.")}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-md justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving Product...
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Add Product
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
