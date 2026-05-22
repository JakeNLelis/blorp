"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteProduct } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Search, PackageOpen } from "lucide-react";

type Category = {
  name: string;
};

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  categories: Category | Category[] | null;
};

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
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
          <h3 className="text-xl font-medium tracking-tight font-heading">Product Inventory</h3>
          <p className="text-sm text-muted-foreground font-sans">
            Total of {products.length} products listed.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-[240px]">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-sans border-border rounded-md h-10 bg-background/50"
          />
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
            <p className="text-sm font-medium font-heading">No products found</p>
            <p className="text-xs text-muted-foreground font-sans">
              {search ? "Try adjusting your search terms." : "Start by adding a new product above."}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-border text-left font-sans text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <th scope="col" className="py-3 px-2">Info</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Price</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="py-4 px-2 flex items-center gap-3 min-w-[200px]">
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
                        <p className="text-xs text-muted-foreground truncate block max-w-[180px]">
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
                      ₱{Number(product.price).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
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
    </div>
  );
}
