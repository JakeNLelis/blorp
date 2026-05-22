const categories = [
  {
    title: "Sunglasses",
    description: "Modern shades blending style and sun protection",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Checkered-Sunglasses-on-Stone-Pedestal-2.png",
  },
  {
    title: "Jewelry",
    description: "Elegant pieces to elevate every look",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Gold-Hoop-Earrings-on-Ceramic-Dish-2.png",
  },
  {
    title: "Coats & Jackets",
    description: "Layer up with timeless outerwear styles",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Fashion-Portrait-2.png",
  },
  {
    title: "Bags",
    description: "Functional designs crafted for daily wear",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-with-Tote-Bag-2.png",
  },
  {
    title: "Shoes",
    description: "Step forward with comfort and style",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
  },
  {
    title: "Dresses",
    description: "Effortless silhouettes for every occasion",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-429124762-15555033-2.jpg",
  },
];

export function ProductCategoriesSection() {
  return (
    <section className="py-32 flex justify-around">
      <div className="container">
        <div className="flex flex-col gap-10">
          <h2 className="animate-in text-center text-4xl leading-snug font-medium duration-600 fade-in slide-in-from-bottom-6">
            Product Categories
          </h2>
          <div className="gap grid grid-cols-2 gap-x-2.5 gap-y-10 lg:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className="animate-out opacity-0 duration-700 fade-in-100 fill-mode-forwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  data-slot="card"
                  data-size="default"
                  className="ring-foreground/10 text-card-foreground group/card flex flex-col gap-6 overflow-hidden text-sm ring-1 rounded-none border-none bg-background p-0 shadow-none"
                >
                  <div
                    data-slot="card-content"
                    className="group-data-[size=sm]/card:px-4 p-0"
                  >
                    <a href="#" className="flex flex-col gap-4">
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
                          className="overflow-hidden rounded-xl"
                          style={{ position: "absolute", inset: 0 }}
                        >
                          <img
                            alt=""
                            className="size-full origin-center object-cover object-center transition-transform duration-400 hover:scale-115"
                            src={category.image}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div
                          data-slot="card-title"
                          className="group-data-[size=sm]/card:text-sm text-center text-lg leading-tight font-medium sm:text-xl md:text-2xl"
                        >
                          {category.title}
                        </div>
                        <div
                          data-slot="card-description"
                          className="text-muted-foreground text-sm text-center"
                        >
                          {category.description}
                        </div>
                      </div>
                    </a>
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
