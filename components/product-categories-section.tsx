import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const categories = [
  {
    title: "Sunglasses",
    description: "Modern shades blending style and sun protection",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Checkered-Sunglasses-on-Stone-Pedestal-2.png",
    delay: "0ms",
  },
  {
    title: "Jewelry",
    description: "Elegant pieces to elevate every look",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Gold-Hoop-Earrings-on-Ceramic-Dish-2.png",
    delay: "100ms",
  },
  {
    title: "Coats & Jackets",
    description: "Layer up with timeless outerwear styles",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Fashion-Portrait-2.png",
    delay: "200ms",
  },
  {
    title: "Bags",
    description: "Functional designs crafted for daily wear",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-with-Tote-Bag-2.png",
    delay: "300ms",
  },
  {
    title: "Shoes",
    description: "Step forward with comfort and style",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
    delay: "400ms",
  },
  {
    title: "Dresses",
    description: "Effortless silhouettes for every occasion",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-429124762-15555033-2.jpg",
    delay: "500ms",
  },
];

export function ProductCategoriesSection() {
  return (
    <section className="py-32 flex justify-center">
      <div className="container">
        <div className="flex flex-col items-center gap-10">
          <h2 className="animate-in text-center text-4xl font-medium leading-snug duration-[600ms] fade-in slide-in-from-bottom-6">
            Product Categories
          </h2>
          <div className="grid w-full max-w-5xl gap-x-2.5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.title}
                className="animate-out opacity-0 duration-700 fade-in-100 fill-mode-forwards"
                style={{ animationDelay: category.delay }}
              >
                <Card className="group/card gap-6 overflow-hidden border-none bg-background p-0 text-sm shadow-none ring-1 ring-foreground/10">
                  <CardContent className="p-0">
                    <a href="#" className="flex flex-col gap-4">
                      <AspectRatio
                        ratio={1.362}
                        className="overflow-hidden rounded-xl"
                      >
                        <img
                          alt=""
                          className="size-full origin-center object-cover object-center transition-transform duration-400 hover:scale-115"
                          src={category.image}
                        />
                      </AspectRatio>
                      <div className="space-y-1">
                        <CardTitle className="text-center text-lg font-medium leading-tight sm:text-xl md:text-2xl">
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-center text-sm text-muted-foreground">
                          {category.description}
                        </CardDescription>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
