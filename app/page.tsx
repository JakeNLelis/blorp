import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { HandbagCategorySection } from "@/components/handbag-category-section";
import { ProductCategoriesSection } from "@/components/product-categories-section";
import { CallToActionSection } from "@/components/call-to-action-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="pt-[calc(var(--primary-nav-height)+var(--secondary-nav-height))]">
        <HeroCarousel />
        <HandbagCategorySection />
        <ProductCategoriesSection />
        <CallToActionSection />
      </main>
      <SiteFooter />
    </div>
  );
}
