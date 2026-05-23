import Link from "next/link";
import Image from "next/image";

type CategoryItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
};

type ProductCategoriesSectionProps = {
  categories: CategoryItem[];
};

export function ProductCategoriesSection({
  categories,
}: ProductCategoriesSectionProps) {
  return (
    <section className="py-32 flex justify-around font-sans">
      <div className="container">
        <div className="flex flex-col gap-10">
          <h2 className="text-center text-4xl leading-snug font-semibold font-heading">
            Product Categories
          </h2>
          <div className="gap grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="transition-all duration-300">
                <div
                  data-slot="card"
                  data-size="default"
                  className="group/card flex flex-col gap-6 overflow-hidden text-sm ring-1 ring-border rounded-xl bg-card/20 p-4 shadow-none hover:border-primary/20 hover:ring-primary/20 transition-all duration-300"
                >
                  <div data-slot="card-content" className="p-0">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="flex flex-col gap-4"
                    >
                      <div
                        data-radix-aspect-ratio-wrapper=""
                        style={{
                          position: "relative",
                          width: "100%",
                          paddingBottom: "73.3527%",
                        }}
                      >
                        <div
                          data-slot="aspect-ratio"
                          className="overflow-hidden rounded-lg border bg-muted"
                          style={{ position: "absolute", inset: 0 }}
                        >
                          <Image
                            alt={category.title}
                            src={category.image}
                            fill
                            className="origin-center object-cover object-center transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 text-center">
                        <div
                          data-slot="card-title"
                          className="text-lg leading-tight font-semibold sm:text-xl font-heading text-foreground group-hover/card:text-primary transition-colors"
                        >
                          {category.title}
                        </div>
                        <div
                          data-slot="card-description"
                          className="text-muted-foreground text-xs font-medium leading-relaxed max-w-70 mx-auto"
                        >
                          {category.description}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
