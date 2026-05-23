import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { HandbagCategorySection } from "@/components/handbag-category-section";
import { ProductCategoriesSection } from "@/components/product-categories-section";
import { CallToActionSection } from "@/components/call-to-action-section";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch recent products for the Hero Section
  const { data: recentProducts } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch all categories
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  // Fetch products to pick representative ones
  const { data: productsData } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false });

  // Map category slugs to descriptions
  const categoryDescriptions: Record<string, string> = {
    handbags: "Functional and elegant designs crafted for daily wear",
    watches: "Masterpieces of horology designed to last lifetimes",
    jewelry: "Exquisite pieces that add luxury to any occasion",
    accessories: "Subtle additions that elevate your everyday looks",
    clothing: "Tailored outfits crafted from archival twill and premium linen",
    shoes: "Walk with confidence in our handcrafted premium footwear",
  };

  // Build the list of categories with representative products and descriptions
  const categories = (categoriesData || []).map((cat) => {
    // Find first product in this category
    const repProd = (productsData || []).find((p) => p.category_id === cat.id);
    return {
      id: cat.id,
      title: cat.name,
      slug: cat.slug,
      description: categoryDescriptions[cat.slug] || "Explore our premium selection",
      image: repProd?.image_url || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600&auto=format&fit=crop",
    };
  });

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))]">
        <HeroCarousel products={recentProducts || []} />
        <HandbagCategorySection />
        <ProductCategoriesSection categories={categories} />
        <CallToActionSection />
      </main>
      <SiteFooter />
    </div>
  );
}
