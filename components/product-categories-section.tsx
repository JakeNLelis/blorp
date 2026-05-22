import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Handbags",
    image:
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop",
    link: "/products?category=handbags",
  },
  {
    title: "Watches",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600&auto=format&fit=crop",
    link: "/products?category=watches",
  },
  {
    title: "Jewelry",
    image:
      "https://images.unsplash.com/photo-1599643478524-fb524419f4a9?q=80&w=1600&auto=format&fit=crop",
    link: "/products?category=jewelry",
  },
  {
    title: "Accessories",
    image:
      "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1600&auto=format&fit=crop",
    link: "/products?category=accessories",
  },
];

export function ProductCategoriesSection() {
  return (
    <section className="px-6 py-12 lg:px-12 lg:py-24">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Shop by Category
        </h2>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/products">View All Categories</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.link}
            className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl bg-muted p-6"
          >
            <Image
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={category.image}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white">
                {category.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
