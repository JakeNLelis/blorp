import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HandbagCategorySection() {
  return (
    <section className="bg-muted text-foreground lg:px-12 py-12 lg:py-24">
      <div className="container overflow-hidden rounded-xl bg-background px-6 py-12 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              alt="Model showcasing Blorp handbag"
              className="object-cover transition-transform duration-700 hover:scale-105"
              src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=2000&auto=format&fit=crop"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="space-y-6 lg:max-w-xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              The Artisan Handbag Collection
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the pinnacle of craftsmanship. Each Blorp handbag is
              meticulously hand-stitched by master artisans using only the
              finest, ethically sourced leathers.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/products?category=handbags">Shop Handbags</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/products">View All Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
